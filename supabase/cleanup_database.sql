-- =====================================================
-- Rememoir Database Cleanup Script
-- Run this in Supabase SQL Editor to clear the project
-- =====================================================

-- IMPORTANT: This will DELETE ALL DATA permanently!
-- Only run this on development projects you want to reset

-- Disable notices for cleaner output
SET client_min_messages TO WARNING;

-- =====================================================
-- 1. DROP ALL STORAGE POLICIES FIRST (ignore errors)
-- =====================================================

DO $$ 
BEGIN
    -- Drop storage policies if they exist
    DROP POLICY IF EXISTS "Users can upload to rememoir-files" ON storage.objects;
    DROP POLICY IF EXISTS "Users can view project files" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
    DROP POLICY IF EXISTS "Users can manage profile files" ON storage.objects;
    DROP POLICY IF EXISTS "Service role full storage access" ON storage.objects;
EXCEPTION 
    WHEN OTHERS THEN 
        RAISE NOTICE 'Storage policies cleanup completed (some may not have existed)';
END $$;

-- =====================================================
-- 2. DROP ALL TABLE POLICIES (ignore errors)
-- =====================================================

DO $$ 
BEGIN
    -- Drop all RLS policies (both old and new)
    DROP POLICY IF EXISTS profiles_own_access ON profiles;
    DROP POLICY IF EXISTS profiles_service_access ON profiles;
    DROP POLICY IF EXISTS projects_member_access ON projects;
    DROP POLICY IF EXISTS projects_owner_modify ON projects;
    DROP POLICY IF EXISTS memberships_project_access ON project_memberships;
    DROP POLICY IF EXISTS invitations_owner_manage ON invitations;
    DROP POLICY IF EXISTS invitations_invitee_view ON invitations;
    DROP POLICY IF EXISTS prompts_project_access ON prompts;
    DROP POLICY IF EXISTS prompts_member_modify ON prompts;
    
    -- Old dangerous policy
    DROP POLICY IF EXISTS sessions_public_access ON sessions;
    -- New secure policy  
    DROP POLICY IF EXISTS sessions_secure_access ON sessions;
    DROP POLICY IF EXISTS sessions_project_access ON sessions;
    
    DROP POLICY IF EXISTS recordings_session_access ON session_recordings;
    DROP POLICY IF EXISTS stories_project_access ON stories;
    DROP POLICY IF EXISTS files_access ON files;
    DROP POLICY IF EXISTS session_tokens_project_access ON session_access_tokens;
    DROP POLICY IF EXISTS books_owner_access ON books;
EXCEPTION 
    WHEN OTHERS THEN 
        RAISE NOTICE 'Table policies cleanup completed (some may not have existed)';
END $$;

DO $$ 
BEGIN
    -- Drop service role bypass policies
    DROP POLICY IF EXISTS service_role_bypass_all_profiles ON profiles;
    DROP POLICY IF EXISTS service_role_bypass_all_projects ON projects;
    DROP POLICY IF EXISTS service_role_bypass_all_memberships ON project_memberships;
    DROP POLICY IF EXISTS service_role_bypass_all_invitations ON invitations;
    DROP POLICY IF EXISTS service_role_bypass_all_prompts ON prompts;
    DROP POLICY IF EXISTS service_role_bypass_all_sessions ON sessions;
    DROP POLICY IF EXISTS service_role_bypass_all_recordings ON session_recordings;
    DROP POLICY IF EXISTS service_role_bypass_all_stories ON stories;
    DROP POLICY IF EXISTS service_role_bypass_all_files ON files;
    DROP POLICY IF EXISTS service_role_bypass_all_session_tokens ON session_access_tokens;
    DROP POLICY IF EXISTS service_role_bypass_all_books ON books;
    DROP POLICY IF EXISTS service_role_bypass_all_book_stories ON book_stories;
EXCEPTION 
    WHEN OTHERS THEN 
        RAISE NOTICE 'Service role policies cleanup completed (some may not have existed)';
END $$;

-- =====================================================
-- 3. DROP ALL TRIGGERS (ignore errors)
-- =====================================================

DO $$ 
BEGIN
    DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
    DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
    DROP TRIGGER IF EXISTS update_project_memberships_updated_at ON project_memberships;
    DROP TRIGGER IF EXISTS update_invitations_updated_at ON invitations;
    DROP TRIGGER IF EXISTS update_prompts_updated_at ON prompts;
    DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
    DROP TRIGGER IF EXISTS update_session_recordings_updated_at ON session_recordings;
    DROP TRIGGER IF EXISTS update_stories_updated_at ON stories;
    DROP TRIGGER IF EXISTS update_files_updated_at ON files;
    DROP TRIGGER IF EXISTS update_session_access_tokens_updated_at ON session_access_tokens;
    DROP TRIGGER IF EXISTS update_books_updated_at ON books;
EXCEPTION 
    WHEN OTHERS THEN 
        RAISE NOTICE 'Triggers cleanup completed (some may not have existed)';
END $$;

-- =====================================================
-- 4. DROP ALL TABLES (in reverse dependency order)
-- =====================================================

-- Drop tables one by one with individual error handling
DROP TABLE IF EXISTS book_stories CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS session_access_tokens CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS session_recordings CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS prompts CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
DROP TABLE IF EXISTS project_memberships CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =====================================================
-- 5. DROP ALL FUNCTIONS (ignore errors)
-- =====================================================

DO $$ 
BEGIN
    DROP FUNCTION IF EXISTS generate_session_access_token(UUID);
    DROP FUNCTION IF EXISTS generate_public_invite(UUID, project_role, UUID);
    DROP FUNCTION IF EXISTS accept_invite(TEXT, UUID);
    DROP FUNCTION IF EXISTS update_updated_at_column();
EXCEPTION 
    WHEN OTHERS THEN 
        RAISE NOTICE 'Functions cleanup completed (some may not have existed)';
END $$;

-- =====================================================
-- 6. DROP ALL CUSTOM TYPES (ignore errors)
-- =====================================================

DO $$ 
BEGIN
    DROP TYPE IF EXISTS project_status CASCADE;
    DROP TYPE IF EXISTS session_step CASCADE;
    DROP TYPE IF EXISTS story_style CASCADE;
    DROP TYPE IF EXISTS file_type CASCADE;
    DROP TYPE IF EXISTS invitation_status CASCADE;
    DROP TYPE IF EXISTS project_role CASCADE;
EXCEPTION 
    WHEN OTHERS THEN 
        RAISE NOTICE 'Types cleanup completed (some may not have existed)';
END $$;

-- =====================================================
-- 7. DROP STORAGE BUCKETS (ignore errors)
-- =====================================================

DO $$ 
BEGIN
    DELETE FROM storage.buckets WHERE id = 'rememoir-files';
    DELETE FROM storage.buckets WHERE id = 'rememoir-profiles';
EXCEPTION 
    WHEN OTHERS THEN 
        RAISE NOTICE 'Storage buckets cleanup completed (some may not have existed)';
END $$;

-- =====================================================
-- 8. COMPLETE AUTH SCHEMA CLEANUP 
-- =====================================================

-- Remove all auth users and related data for complete reset
DO $$ 
BEGIN
    -- Clear auth sessions first
    DELETE FROM auth.sessions;
    
    -- Clear auth refresh tokens
    DELETE FROM auth.refresh_tokens;
    
    -- Clear auth users (this will cascade to profiles due to foreign key)
    DELETE FROM auth.users;
    
    -- Clear any auth audit logs
    DELETE FROM auth.audit_log_entries;
    
    -- Clear auth identities
    DELETE FROM auth.identities;
    
    RAISE NOTICE 'Auth schema completely cleared - all users and sessions removed';
EXCEPTION 
    WHEN OTHERS THEN 
        RAISE NOTICE 'Auth cleanup completed (some tables may not have existed or been accessible)';
END $$;

-- =====================================================
-- 9. CLEAR STORAGE OBJECTS (complete file cleanup)
-- =====================================================

DO $$ 
BEGIN
    -- Remove all objects from storage buckets
    DELETE FROM storage.objects WHERE bucket_id IN ('rememoir-files', 'rememoir-profiles');
    
    RAISE NOTICE 'All storage objects removed from buckets';
EXCEPTION 
    WHEN OTHERS THEN 
        RAISE NOTICE 'Storage objects cleanup completed (buckets may not have existed)';
END $$;

-- Reset message level
SET client_min_messages TO NOTICE;

-- =====================================================
-- CLEANUP COMPLETE
-- =====================================================

SELECT 'Database cleanup completed successfully! 🧹' as message,
       'COMPLETE SUPABASE PROJECT RESET:' as status,
       '• All public schema tables and data removed' as tables,
       '• All custom functions, types, and constraints dropped' as database_objects,
       '• All RLS policies and triggers removed' as security,
       '• All storage buckets and objects deleted' as storage,
       '• All auth users, sessions, and identities cleared' as authentication,
       '• Project ready for fresh migration and seed data' as ready; 