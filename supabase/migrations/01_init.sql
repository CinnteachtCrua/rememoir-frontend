-- =====================================================
-- Rememoir Database Schema - Initial Migration
-- Analyzed line-by-line against project requirements
-- =====================================================

-- Enable UUID generation for primary keys (standard for distributed systems)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Enable trigram matching for full-text search on story content and prompt text
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- ENUMS - Simplified to match actual project workflow
-- =====================================================

-- Project roles: owner (buyer), collaborator (family/friends who can add prompts)
-- Removed 'editor', 'subject', 'viewer' as spec only mentions owner and collaborators
CREATE TYPE project_role AS ENUM ('owner', 'collaborator');

-- Invitation status for collaboration system (required per spec)
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'revoked', 'expired');

-- File types for voice recordings, future images/videos (extensible design)
CREATE TYPE file_type AS ENUM ('audio', 'image', 'video', 'document');

-- Story styles from session workflow: spec mentions "First Person, Third Person, Clean Transcript"
CREATE TYPE story_style AS ENUM ('first-person', 'third-person', 'transcript');

-- Session workflow states: flexible workflow that doesn't hardcode follow-up count
-- Application logic determines how many follow-ups to generate based on business rules
CREATE TYPE session_step AS ENUM ('prompts', 'recording', 'followups', 'style_selection', 'story_review', 'completed');

-- =====================================================
-- CORE TABLES - Aligned with project workflows
-- =====================================================

-- Extends Supabase auth.users with profile info (required for user management)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Links to Supabase auth
    email TEXT NOT NULL, -- Email from Stripe webhook/auth signup
    name TEXT, -- User's display name
    avatar_url TEXT, -- Optional profile image
    user_metadata JSONB DEFAULT '{}', -- Extensible user preferences
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Audit trail
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() -- Change tracking
);

-- Projects: main entity - "Each user can have multiple projects"
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique project identifier
    name TEXT NOT NULL, -- Project display name (e.g., "Mom's Life Story")
    description TEXT, -- Optional project description
    is_setup BOOLEAN NOT NULL DEFAULT FALSE, -- "project is only considered 'set up' once all details added"
    
    -- Subject information (person the memoir is about)
    subject_name TEXT NOT NULL, -- Required: who the memoir is about
    subject_email TEXT NOT NULL, -- Required: where prompts are sent via email
    subject_relationship TEXT, -- Optional: relationship to owner (self/family/friend)
    subject_info JSONB DEFAULT '{}', -- Profile info: birthplace, education, career, life events
    
    -- Explicit scheduling fields (required per spec: "period by which prompts are sent")
    schedule_frequency TEXT CHECK (schedule_frequency IN ('daily', 'weekly', 'monthly')), -- How often
    schedule_day_of_week SMALLINT CHECK (schedule_day_of_week >= 0 AND schedule_day_of_week <= 6), -- Which day (0=Sunday)
    schedule_time TIME, -- What time
    timezone TEXT, -- User's timezone for scheduling
    schedule_start_date TIMESTAMPTZ, -- When to start sending prompts
    
    -- Project owner (references Supabase auth user who paid)
    owner_id UUID NOT NULL REFERENCES profiles(id), -- Project owner from Stripe payment
    
    -- Administrative fields
    project_settings JSONB DEFAULT '{}', -- Theme preferences, advanced settings
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When project was created
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Last modification
    deleted_at TIMESTAMPTZ -- Soft delete for data retention compliance
);

-- Project collaborators: "list of other user accounts that have joined the project"
CREATE TABLE project_memberships (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Which project
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE, -- Which user
    role project_role NOT NULL, -- Owner or collaborator
    invited_by UUID REFERENCES profiles(id), -- Who sent the invitation (audit trail)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When they joined
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Role changes
    PRIMARY KEY (project_id, user_id) -- One membership per user per project
);

-- Invitation system: "invite new collaborators with a pop up"
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique invitation ID
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Which project
    invited_email TEXT, -- NULL for public link invites, email for direct invites
    role project_role NOT NULL, -- What role they'll have when accepted
    token TEXT NOT NULL UNIQUE, -- Secure token for invitation URL
    status invitation_status NOT NULL DEFAULT 'pending', -- Invitation state
    expires_at TIMESTAMPTZ NOT NULL, -- Security: invitations expire
    created_by UUID NOT NULL REFERENCES profiles(id), -- Who created the invitation
    accepted_by UUID REFERENCES profiles(id), -- Who accepted (NULL until accepted)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When invitation was sent
    accepted_at TIMESTAMPTZ -- When invitation was accepted
);

-- Prompts: "prompts can be viewed, added and edited"
CREATE TABLE prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique prompt ID
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Which project
    text TEXT NOT NULL, -- The actual prompt/question text
    created_by UUID NOT NULL REFERENCES profiles(id), -- Who added this prompt
    is_ai_suggested BOOLEAN NOT NULL DEFAULT FALSE, -- From AI suggestions or user-created
    is_used BOOLEAN NOT NULL DEFAULT FALSE, -- Has this been answered in a session yet
    voice_recording_url TEXT, -- Optional: voice recording of person asking prompt
    metadata JSONB DEFAULT '{}', -- AI generation params, categories
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When prompt was created
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When last modified
    deleted_at TIMESTAMPTZ -- Soft delete (prompts can be deleted)
);

-- Sessions: "multi-step page emailed to subject as scheduled"
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique session ID for public URL
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Which project
    subject_email TEXT NOT NULL, -- Email of person completing session (matches project.subject_email)
    current_step session_step NOT NULL DEFAULT 'prompts', -- Current workflow step
    selected_prompt_id UUID REFERENCES prompts(id), -- Which prompt they chose to answer
    selected_style story_style, -- Their chosen story style
    session_data JSONB DEFAULT '{}', -- Flexible data: AI models used, follow-up logic, workflow state
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When session started
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Last activity
    completed_at TIMESTAMPTZ -- When they finished the full workflow
);

-- Session recordings: stores all recordings from the session workflow (flexible count)
-- DESIGN NOTE: This table supports variable follow-up counts (0, 2, 5, etc.) based on:
-- - AI analysis of recording quality/completeness  
-- - Project settings (some subjects may need more prompting)
-- - Future feature expansion (different follow-up strategies)
-- Application logic determines when to stop generating follow-ups, not database constraints
CREATE TABLE session_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique recording ID
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE, -- Which session
    sequence_number INTEGER NOT NULL, -- Order of recording (1=initial, 2=first followup, etc.)
    recording_type TEXT NOT NULL DEFAULT 'answer', -- 'initial_answer', 'followup', 'change_request', etc.
    question_text TEXT, -- The question being answered (original prompt or AI-generated followup)
    recording_url TEXT, -- URL to audio file in Supabase Storage
    transcription TEXT, -- AI transcription of the recording
    processing_status TEXT DEFAULT 'pending', -- pending, transcribing, completed, failed
    metadata JSONB DEFAULT '{}', -- Extensible data: confidence scores, AI model used, etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When recording was made
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() -- Processing updates
);

-- Stories: "AI-generated stories from sessions"
CREATE TABLE stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique story ID
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Which project
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE, -- Which session created this
    title TEXT NOT NULL, -- Story title (AI-generated or user-edited)
    content TEXT NOT NULL, -- The actual story content
    style story_style NOT NULL, -- Style chosen during session
    prompted_by_name TEXT NOT NULL, -- Name of person who added the original prompt
    include_in_book BOOLEAN NOT NULL DEFAULT TRUE, -- Can be excluded from book order
    book_order INTEGER, -- Order within the book (for story sequencing)
    generation_metadata JSONB DEFAULT '{}', -- AI model version, revision history
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When story was generated
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When edited
    deleted_at TIMESTAMPTZ -- Soft delete (stories can be excluded)
);

-- Files: voice recordings, future images/videos
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique file ID
    filename TEXT NOT NULL, -- Original filename
    file_type file_type NOT NULL, -- audio, image, video, document
    mime_type TEXT NOT NULL, -- MIME type for proper handling
    file_size BIGINT NOT NULL, -- File size in bytes
    bucket TEXT NOT NULL DEFAULT 'rememoir-files', -- Supabase Storage bucket
    storage_path TEXT NOT NULL, -- Full path within bucket
    storage_object TEXT NOT NULL, -- Object name for signed URLs
    uploaded_by UUID NOT NULL REFERENCES profiles(id), -- Who uploaded
    project_id UUID REFERENCES projects(id), -- Optional: project association
    file_metadata JSONB DEFAULT '{}', -- Duration, thumbnails, processing status
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Upload timestamp
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() -- Processing updates
);

-- Book orders: "order the book (one included with original payment)"
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), -- Unique book order ID
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Which project
    ordered_by UUID NOT NULL REFERENCES profiles(id), -- Who placed the order
    title TEXT NOT NULL, -- Book title
    
    -- Stripe integration (required: "one time fee on a stripe hosted link")
    stripe_session_id TEXT, -- Stripe checkout session
    stripe_payment_intent_id TEXT, -- Stripe payment intent
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    fulfillment_status TEXT CHECK (fulfillment_status IN ('pending', 'processing', 'printed', 'shipped', 'delivered')) DEFAULT 'pending',
    
    -- Order details
    shipping_address JSONB, -- Required for physical book delivery
    order_details JSONB DEFAULT '{}', -- Special instructions, preferences
    story_selection JSONB DEFAULT '{}', -- Which stories to include, ordering
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Order timestamp
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW() -- Status updates
);

-- Junction table for book story inclusion and ordering
CREATE TABLE book_stories (
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE, -- Which book
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE, -- Which story
    story_order INTEGER NOT NULL, -- Order within book
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- When added to book
    PRIMARY KEY (book_id, story_id) -- One entry per story per book
);

-- =====================================================
-- PERFORMANCE INDEXES - Based on expected query patterns
-- =====================================================

-- Project membership queries (dashboard sidebar, permissions)
CREATE INDEX idx_project_memberships_user ON project_memberships(user_id); -- User's projects
CREATE INDEX idx_project_memberships_project ON project_memberships(project_id); -- Project members

-- Session workflow queries (public session pages)
CREATE INDEX idx_sessions_id_email ON sessions(id, subject_email); -- Session lookup with email verification
CREATE INDEX idx_sessions_project ON sessions(project_id); -- Project sessions dashboard

-- Story management queries (stories page)
CREATE INDEX idx_stories_project ON stories(project_id) WHERE deleted_at IS NULL; -- Active stories
CREATE INDEX idx_stories_book_order ON stories(project_id, book_order) WHERE include_in_book = TRUE; -- Book ordering

-- Prompt management queries (prompts page)  
CREATE INDEX idx_prompts_project_active ON prompts(project_id) WHERE deleted_at IS NULL; -- Active prompts
CREATE INDEX idx_prompts_unused ON prompts(project_id, is_used) WHERE deleted_at IS NULL; -- Unused prompts
CREATE INDEX idx_prompts_ai_suggested ON prompts(project_id, is_ai_suggested) WHERE deleted_at IS NULL; -- AI vs user prompts

-- File management queries
CREATE INDEX idx_files_project ON files(project_id); -- Project files
CREATE INDEX idx_files_uploader ON files(uploaded_by); -- User's uploads

-- Invitation system queries
CREATE INDEX idx_invitations_token ON invitations(token) WHERE status = 'pending'; -- Token lookup
CREATE INDEX idx_invitations_email ON invitations(invited_email) WHERE status = 'pending'; -- Email invites
CREATE UNIQUE INDEX idx_invitations_project_email ON invitations(project_id, invited_email) WHERE status = 'pending'; -- Prevent duplicate invites

-- Text search capabilities (search stories and prompts)
CREATE INDEX idx_stories_text_search ON stories USING gin(to_tsvector('english', title || ' ' || content)) WHERE deleted_at IS NULL;
CREATE INDEX idx_prompts_text_search ON prompts USING gin(to_tsvector('english', text)) WHERE deleted_at IS NULL;

-- Recording workflow queries (flexible follow-up system)
CREATE INDEX idx_session_recordings_session ON session_recordings(session_id, sequence_number); -- Session recordings in chronological order
CREATE INDEX idx_session_recordings_type ON session_recordings(session_id, recording_type); -- Find recordings by type (initial, followup, etc.)

-- Book management queries
CREATE INDEX idx_books_project ON books(project_id); -- Project books
CREATE INDEX idx_books_payment_status ON books(payment_status); -- Payment tracking

-- =====================================================
-- BUSINESS LOGIC CONSTRAINTS
-- =====================================================

-- Ensure only one owner per project (business rule)
CREATE UNIQUE INDEX idx_project_memberships_one_owner ON project_memberships(project_id) WHERE role = 'owner';

-- Session recordings must have positive sequence numbers (flexible count for future expansion)
ALTER TABLE session_recordings ADD CONSTRAINT check_sequence_positive CHECK (sequence_number >= 1);

-- Invitations must expire in the future (security)
ALTER TABLE invitations ADD CONSTRAINT check_expires_future CHECK (expires_at > created_at);

-- Projects must have subject email for session delivery
ALTER TABLE projects ADD CONSTRAINT check_subject_email_required CHECK (subject_email IS NOT NULL);

-- Completed sessions must have selected prompt and style
ALTER TABLE sessions ADD CONSTRAINT check_completed_session 
    CHECK (current_step != 'completed' OR (selected_prompt_id IS NOT NULL AND selected_style IS NOT NULL));

-- =====================================================
-- AUTOMATED TRIGGERS - Standard database patterns
-- =====================================================

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables (audit trail best practice)
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_memberships_updated_at BEFORE UPDATE ON project_memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON invitations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_session_recordings_updated_at BEFORE UPDATE ON session_recordings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORED PROCEDURES - Core business logic
-- =====================================================

-- Accept invitation and create project membership (collaboration workflow)
CREATE OR REPLACE FUNCTION accept_invite(p_token TEXT, p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Elevated privileges for system operation
AS $$
DECLARE
    invite_record invitations%ROWTYPE;
BEGIN
    -- Find valid pending invitation
    SELECT * INTO invite_record 
    FROM invitations 
    WHERE token = p_token 
    AND status = 'pending' 
    AND expires_at > NOW();
    
    -- Return error if invitation invalid/expired
    IF NOT FOUND THEN
        RETURN '{"success": false, "error": "Invalid or expired invitation"}'::JSONB;
    END IF;
    
    -- Create project membership (handles duplicate gracefully)
    INSERT INTO project_memberships (project_id, user_id, role, invited_by)
    VALUES (invite_record.project_id, p_user_id, invite_record.role, invite_record.created_by)
    ON CONFLICT (project_id, user_id) 
    DO UPDATE SET role = EXCLUDED.role, updated_at = NOW();
    
    -- Mark invitation as accepted (audit trail)
    UPDATE invitations 
    SET status = 'accepted', accepted_by = p_user_id, accepted_at = NOW()
    WHERE id = invite_record.id;
    
    -- Return success with project details
    RETURN jsonb_build_object(
        'success', true, 
        'project_id', invite_record.project_id,
        'role', invite_record.role
    );
END;
$$;

-- Generate secure invitation link (collaboration system)
CREATE OR REPLACE FUNCTION generate_public_invite(p_project_id UUID, p_role project_role, p_creator UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Elevated privileges for system operation
AS $$
DECLARE
    invite_token TEXT;
    invite_id UUID;
BEGIN
    -- Generate cryptographically secure token
    invite_token := encode(gen_random_bytes(32), 'base64url');
    
    -- Create invitation record
    INSERT INTO invitations (project_id, role, token, expires_at, created_by)
    VALUES (p_project_id, p_role, invite_token, NOW() + INTERVAL '7 days', p_creator)
    RETURNING id INTO invite_id;
    
    -- Return invitation details for URL construction
    RETURN jsonb_build_object(
        'success', true,
        'invite_id', invite_id,
        'token', invite_token,
        'expires_at', NOW() + INTERVAL '7 days'
    );
END;
$$;

-- =====================================================
-- ROW LEVEL SECURITY - Data access control
-- =====================================================

-- Enable RLS on all tables (security best practice)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_stories ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can only access their own profile data
CREATE POLICY profiles_own_access ON profiles FOR ALL USING (auth.uid() = id);

-- SERVICE ROLE: System operations bypass RLS (seed scripts, webhooks)
CREATE POLICY profiles_service_access ON profiles FOR ALL USING (auth.role() = 'service_role');

-- PROJECTS: Only project members can view project data
CREATE POLICY projects_member_access ON projects FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM project_memberships 
        WHERE project_id = id AND user_id = auth.uid()
    )
);

-- PROJECTS: Only project owners can modify project settings
CREATE POLICY projects_owner_modify ON projects FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM project_memberships 
        WHERE project_id = id AND user_id = auth.uid() AND role = 'owner'
    )
);

-- PROJECT_MEMBERSHIPS: Users see memberships for projects they belong to
CREATE POLICY memberships_project_access ON project_memberships FOR SELECT USING (
    user_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM project_memberships pm2 
        WHERE pm2.project_id = project_id AND pm2.user_id = auth.uid()
    )
);

-- INVITATIONS: Project owners manage invitations
CREATE POLICY invitations_owner_manage ON invitations FOR ALL USING (
    EXISTS (
        SELECT 1 FROM project_memberships 
        WHERE project_id = invitations.project_id AND user_id = auth.uid() AND role = 'owner'
    )
);

-- INVITATIONS: Invited users can view their pending invitations
CREATE POLICY invitations_invitee_view ON invitations FOR SELECT USING (
    status = 'pending' AND invited_email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- PROMPTS: Project members can view prompts
CREATE POLICY prompts_project_access ON prompts FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM project_memberships 
        WHERE project_id = prompts.project_id AND user_id = auth.uid()
    )
);

-- PROMPTS: Project members can create/edit prompts  
CREATE POLICY prompts_member_modify ON prompts FOR ALL USING (
    EXISTS (
        SELECT 1 FROM project_memberships 
        WHERE project_id = prompts.project_id AND user_id = auth.uid()
    )
);

-- SESSIONS: Public read access for session workflow (subjects may not be registered users)
CREATE POLICY sessions_public_access ON sessions FOR SELECT USING (true);

-- SESSIONS: Project members can view all project sessions
CREATE POLICY sessions_project_access ON sessions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM project_memberships 
        WHERE project_id = sessions.project_id AND user_id = auth.uid()
    )
);

-- SESSION_RECORDINGS: Inherit session access rules
CREATE POLICY recordings_session_access ON session_recordings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM sessions s 
        WHERE s.id = session_recordings.session_id
    )
);

-- STORIES: Project members can view stories
CREATE POLICY stories_project_access ON stories FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM project_memberships 
        WHERE project_id = stories.project_id AND user_id = auth.uid()
    )
);

-- FILES: Uploader and project members can access files
CREATE POLICY files_access ON files FOR SELECT USING (
    uploaded_by = auth.uid() OR
    (project_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM project_memberships 
        WHERE project_id = files.project_id AND user_id = auth.uid()
    ))
);

-- BOOKS: Project owners can manage book orders
CREATE POLICY books_owner_access ON books FOR ALL USING (
    EXISTS (
        SELECT 1 FROM project_memberships 
        WHERE project_id = books.project_id AND user_id = auth.uid() AND role = 'owner'
    )
);

-- SERVICE ROLE: System bypass for all operations (webhooks, background jobs)
CREATE POLICY service_role_bypass_all_profiles ON profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_bypass_all_projects ON projects FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_bypass_all_memberships ON project_memberships FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_bypass_all_invitations ON invitations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_bypass_all_prompts ON prompts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_bypass_all_sessions ON sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_bypass_all_recordings ON session_recordings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_bypass_all_stories ON stories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_bypass_all_files ON files FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_bypass_all_books ON books FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY service_role_bypass_all_book_stories ON book_stories FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- PERMISSIONS - Database access control
-- =====================================================

-- Grant authenticated users access to tables (required for app functionality)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant service role full access (required for server-side operations)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role; 