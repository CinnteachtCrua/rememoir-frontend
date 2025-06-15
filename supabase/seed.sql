-- Seed file for development testing

-- =====================================================
-- Rememoir Seed Data - Run with Service Role
-- =====================================================

-- IMPORTANT: Run this query in Supabase SQL Editor
-- Make sure you're using the service role, not anon key

-- First, insert into auth.users (required for profiles foreign key)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  aud,
  role
) VALUES 
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'sarah.johnson@email.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('b1ffdc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'mike.chen@email.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('c2ffdc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid, 'grandma.smith@email.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated'),
  ('d3ffdc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid, 'tom.wilson@email.com', crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(), 'authenticated', 'authenticated');

-- Now insert profiles that reference these auth users
INSERT INTO profiles (id, email, name, avatar_url, user_metadata) VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'sarah.johnson@email.com', 'Sarah Johnson', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150', '{"role": "admin"}'),
  ('b1ffdc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'mike.chen@email.com', 'Mike Chen', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '{"role": "user"}'),
  ('c2ffdc99-9c0b-4ef8-bb6d-6bb9bd380a33'::uuid, 'grandma.smith@email.com', 'Eleanor Smith', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', '{"role": "user"}'),
  ('d3ffdc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid, 'tom.wilson@email.com', 'Tom Wilson', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '{"role": "collaborator"}');

-- Insert test projects
INSERT INTO projects (
  id, name, description, is_setup, project_status, session_count, story_count,
  subject_name, subject_email, subject_relationship,
  subject_info, schedule_frequency, schedule_day_of_week, schedule_time, timezone,
  schedule_start_date, owner_id, project_settings
) VALUES
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Grandma Eleanor''s Life Story',
    'Capturing the incredible journey of Eleanor Smith through the decades.',
    true,
    'active',
    2,
    1,
    'Eleanor Smith',
    'grandma.smith@email.com',
    'Grandmother',
    '{"birthplace": "Kansas", "education": "High School", "career": "Homemaker"}',
    'weekly',
    1,
    '10:00:00',
    'America/New_York',
    '2024-01-15 10:00:00+00',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    '{"theme": "vintage", "email_reminders": true}'
  ),
  (
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Dad''s Military Stories',
    'Recording stories from my father''s Navy service.',
    true,
    'active',
    1,
    0,
    'Robert Wilson',
    'dad.wilson@email.com',
    'Father',
    '{"birthplace": "Texas", "education": "College", "career": "Navy Officer"}',
    'monthly',
    1,
    '14:00:00',
    'America/Central',
    '2024-02-01 14:00:00+00',
    'b1ffdc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
    '{"theme": "military", "email_reminders": true}'
  ),
  (
    '33333333-3333-3333-3333-333333333333'::uuid,
    'My Personal Journey',
    'A memoir project that is paused for now.',
    true,
    'paused',
    0,
    0,
    'Mike Chen',
    'mike.chen@email.com',
    'Self',
    '{"birthplace": "California", "education": "Masters", "career": "Software Engineer"}',
    'weekly',
    3,
    '19:00:00',
    'America/Pacific',
    '2024-03-01 19:00:00+00',
    'b1ffdc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid,
    '{"theme": "modern", "email_reminders": false}'
  );

-- Insert project memberships
INSERT INTO project_memberships (project_id, user_id, role, invited_by) VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'owner', NULL),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'd3ffdc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid, 'collaborator', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'b1ffdc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'owner', NULL),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'b1ffdc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'owner', NULL);

-- Insert test prompts
INSERT INTO prompts (id, project_id, text, created_by, is_ai_suggested, is_used, metadata) VALUES
  ('a1111111-1111-1111-1111-111111111111'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Tell me about your childhood home. What did it look like?', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, false, true, '{"category": "childhood"}'),
  ('a2222222-2222-2222-2222-222222222222'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'What was it like during the Great Depression?', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, false, false, '{"category": "historical"}'),
  ('a3333333-3333-3333-3333-333333333333'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'What made you join the Navy?', 'b1ffdc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, false, true, '{"category": "career"}'),
  ('a4444444-4444-4444-4444-444444444444'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Tell me about your wedding day', 'd3ffdc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid, false, true, '{"category": "family"}'),
  ('a5555555-5555-5555-5555-555555555555'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'What was your most memorable deployment?', 'b1ffdc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, true, false, '{"category": "military", "ai_suggested": true}');

-- Insert test files (now with mandatory project_id)
INSERT INTO files (
  id, filename, file_type, mime_type, file_size, bucket, storage_path, storage_object,
  uploaded_by, project_id, file_metadata
) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'grandma-story-1.mp3', 'audio', 'audio/mpeg', 2457600, 'rememoir-files', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11/recordings/66666666-6666-6666-6666-666666666666/', 'initial-answer.mp3', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '{"duration_seconds": 180, "transcription_status": "completed"}'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'grandma-story-2.mp3', 'audio', 'audio/mpeg', 1843200, 'rememoir-files', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11/recordings/88888888-8888-8888-8888-888888888888/', 'initial-answer.mp3', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '{"duration_seconds": 135, "transcription_status": "completed"}'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'old-family-photo.jpg', 'image', 'image/jpeg', 524288, 'rememoir-files', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11/photos/11111111-1111-1111-1111-111111111111/', 'family-1924.jpg', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '{"width": 1200, "height": 900, "description": "Family photo from 1924"}');

-- Insert completed sessions (matching session_count in projects)
INSERT INTO sessions (
  id, project_id, subject_email, current_step, selected_prompt_id, selected_style,
  session_data, completed_at
) VALUES
  ('66666666-6666-6666-6666-666666666666'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'grandma.smith@email.com', 'completed', 'a1111111-1111-1111-1111-111111111111'::uuid, 'first-person', '{"followup_count": 2}', NOW() - INTERVAL '5 days'),
  ('88888888-8888-8888-8888-888888888888'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'grandma.smith@email.com', 'completed', 'a4444444-4444-4444-4444-444444444444'::uuid, 'first-person', '{"followup_count": 1}', NOW() - INTERVAL '2 days'),
  ('99999999-9999-9999-9999-999999999999'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'dad.wilson@email.com', 'completed', 'a3333333-3333-3333-3333-333333333333'::uuid, 'third-person', '{"followup_count": 3}', NOW() - INTERVAL '1 week');

-- Insert session recordings (linked to files via new schema)
INSERT INTO session_recordings (
  id, session_id, sequence_number, recording_type, question_text,
  transcription, processing_status, metadata
) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid, '66666666-6666-6666-6666-666666666666'::uuid, 1, 'initial_answer', 'Tell me about your childhood home. What did it look like?', 'I grew up in a small two-story house on Maple Street that held more love than its size might suggest. The big oak tree in our front yard was my playground and my refuge.', 'completed', '{"confidence": 0.94, "model": "whisper-1"}'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid, '88888888-8888-8888-8888-888888888888'::uuid, 1, 'initial_answer', 'Tell me about your wedding day', 'Oh my wedding day! It was June 15th, 1952. The church was decorated with white lilies and baby''s breath. I wore my mother''s dress...', 'completed', '{"confidence": 0.91, "model": "whisper-1"}'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaab'::uuid, '99999999-9999-9999-9999-999999999999'::uuid, 1, 'initial_answer', 'What made you join the Navy?', 'Well, it was 1943 and the war was on. I felt it was my duty to serve my country...', 'completed', '{"confidence": 0.89, "model": "whisper-1"}');

-- Insert session access tokens for secure public access
INSERT INTO session_access_tokens (
  id, session_id, access_token, subject_email, expires_at, access_count, last_accessed_at
) VALUES
  ('aaaaaaaa-bbbb-cccc-dddd-111111111111'::uuid, '66666666-6666-6666-6666-666666666666'::uuid, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_mock_token_1', 'grandma.smith@email.com', NOW() + INTERVAL '25 days', 3, NOW() - INTERVAL '1 day'),
  ('bbbbbbbb-cccc-dddd-eeee-222222222222'::uuid, '88888888-8888-8888-8888-888888888888'::uuid, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_mock_token_2', 'grandma.smith@email.com', NOW() + INTERVAL '28 days', 1, NOW() - INTERVAL '2 hours'),
  ('cccccccc-dddd-eeee-ffff-333333333333'::uuid, '99999999-9999-9999-9999-999999999999'::uuid, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_mock_token_3', 'dad.wilson@email.com', NOW() + INTERVAL '20 days', 5, NOW() - INTERVAL '3 hours');

-- Insert a story
INSERT INTO stories (
  id, project_id, session_id, title, content, style, prompted_by_name,
  include_in_book, book_order, generation_metadata
) VALUES
  ('77777777-7777-7777-7777-777777777777'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '66666666-6666-6666-6666-666666666666'::uuid, 'The House on Maple Street', 'I grew up in a small two-story house on Maple Street that held more love than its size might suggest. The big oak tree in our front yard was my playground and my refuge. My mother''s garden was beautiful, filled with roses and vegetables that helped feed our family. But what I remember most was the smell of fresh bread every morning...', 'first-person', 'Sarah Johnson', true, 1, '{"model": "gpt-4", "version": "1.0"}');

-- =====================================================
-- SEED DATA SUMMARY
-- =====================================================

SELECT 'Seed data inserted successfully! 🎉' as message,
       'Created comprehensive test data for the new schema:' as details,
       '• 4 test users with authentication' as users,
       '• 3 projects (2 active, 1 paused) with proper status tracking' as projects,
       '• 4 project memberships including collaborators' as memberships,
       '• 5 prompts (including AI-suggested)' as prompts,
       '• 3 completed sessions with realistic timing' as sessions,
       '• 3 session recordings with transcriptions' as recordings,
       '• 3 session access tokens for secure public access' as tokens,
       '• 3 files (2 audio, 1 image) with mandatory project links' as files,
       '• 1 generated story ready for book inclusion' as stories,
       '• All data designed to test the enhanced security model' as security;
