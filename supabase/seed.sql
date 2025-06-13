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
  id, name, description, is_setup, subject_name, subject_email, subject_relationship,
  subject_info, schedule_frequency, schedule_day_of_week, schedule_time, timezone,
  schedule_start_date, owner_id, project_settings
) VALUES
  (
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Grandma Eleanor''s Life Story',
    'Capturing the incredible journey of Eleanor Smith through the decades.',
    true,
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
  );

-- Insert project memberships
INSERT INTO project_memberships (project_id, user_id, role, invited_by) VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, 'owner', NULL),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'd3ffdc99-9c0b-4ef8-bb6d-6bb9bd380a44'::uuid, 'collaborator', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'b1ffdc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, 'owner', NULL);

-- Insert test prompts
INSERT INTO prompts (id, project_id, text, created_by, is_ai_suggested, is_used, metadata) VALUES
  ('33333333-3333-3333-3333-333333333333'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'Tell me about your childhood home. What did it look like?', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, false, true, '{"category": "childhood"}'),
  ('44444444-4444-4444-4444-444444444444'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'What was it like during the Great Depression?', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid, false, false, '{"category": "historical"}'),
  ('55555555-5555-5555-5555-555555555555'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'What made you join the Navy?', 'b1ffdc99-9c0b-4ef8-bb6d-6bb9bd380a22'::uuid, false, true, '{"category": "career"}');

-- Insert a completed session
INSERT INTO sessions (
  id, project_id, subject_email, current_step, selected_prompt_id, selected_style,
  session_data, completed_at
) VALUES
  ('66666666-6666-6666-6666-666666666666'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'grandma.smith@email.com', 'completed', '33333333-3333-3333-3333-333333333333'::uuid, 'first-person', '{"followup_count": 2}', NOW() - INTERVAL '5 days');

-- Insert a story
INSERT INTO stories (
  id, project_id, session_id, title, content, style, prompted_by_name,
  include_in_book, book_order, generation_metadata
) VALUES
  ('77777777-7777-7777-7777-777777777777'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, '66666666-6666-6666-6666-666666666666'::uuid, 'The House on Maple Street', 'I grew up in a small two-story house on Maple Street that held more love than its size might suggest. The big oak tree in our front yard was my playground and my refuge. My mother''s garden was beautiful, filled with roses and vegetables that helped feed our family. But what I remember most was the smell of fresh bread every morning...', 'first-person', 'Sarah Johnson', true, 1, '{"model": "gpt-4", "version": "1.0"}');

SELECT 'Seed data inserted successfully! 🎉' as message;
