/*
  # LoR Management System Database Schema

  1. New Tables
    - `users` - User management (students, faculty, admin)
    - `lor_requests` - Letter of recommendation requests
    - `meetings` - Meeting scheduling between students and faculty
    - `drafts` - Document drafts with version control
    - `comments` - Comments on drafts for collaboration
    - `documents` - File storage for supporting documents
    - `notifications` - System notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    - Ensure data isolation between users

  3. Features
    - Complete user management system
    - Request approval workflow
    - Meeting scheduling system
    - Document collaboration
    - Notification system
*/

-- Drop existing tables if they exist (in correct order to handle dependencies)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS drafts CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS lor_requests CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['student'::text, 'faculty'::text, 'admin'::text])),
  full_name text NOT NULL,
  department text,
  designation text,
  phone text,
  avatar text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- Add foreign key constraint to auth.users
ALTER TABLE users ADD CONSTRAINT users_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- LoR Requests table
CREATE TABLE lor_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  faculty_id uuid NOT NULL,
  title text NOT NULL,
  purpose text NOT NULL,
  target_university text NOT NULL,
  deadline date NOT NULL,
  achievements text NOT NULL,
  status text DEFAULT 'pending'::text NOT NULL,
  faculty_comments text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add constraints for lor_requests
ALTER TABLE lor_requests ADD CONSTRAINT lor_requests_status_check 
  CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text])));

ALTER TABLE lor_requests ADD CONSTRAINT lor_requests_student_id_fkey 
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE lor_requests ADD CONSTRAINT lor_requests_faculty_id_fkey 
  FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE;

-- Documents table
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lor_request_id uuid NOT NULL,
  title text DEFAULT 'Letter of Recommendation Draft'::text NOT NULL,
  content text DEFAULT ''::text NOT NULL,
  version integer DEFAULT 1 NOT NULL,
  author_id uuid NOT NULL,
  is_current boolean DEFAULT true NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE documents ADD CONSTRAINT documents_lor_request_id_fkey 
  FOREIGN KEY (lor_request_id) REFERENCES lor_requests(id) ON DELETE CASCADE;

ALTER TABLE documents ADD CONSTRAINT documents_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;

-- Comments table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL,
  content text NOT NULL,
  author_id uuid NOT NULL,
  line_number integer,
  resolved boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Note: Comments reference lor_requests, not documents based on the existing schema
ALTER TABLE comments ADD CONSTRAINT comments_document_id_fkey 
  FOREIGN KEY (document_id) REFERENCES lor_requests(id) ON DELETE CASCADE;

ALTER TABLE comments ADD CONSTRAINT comments_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE;

-- Meetings table
CREATE TABLE meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lor_request_id uuid,
  student_id uuid NOT NULL,
  faculty_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  scheduled_date timestamp with time zone NOT NULL,
  duration_minutes integer DEFAULT 60 NOT NULL,
  location_type text NOT NULL,
  meeting_link text,
  status text DEFAULT 'scheduled'::text NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Add constraints for meetings
ALTER TABLE meetings ADD CONSTRAINT meetings_location_type_check 
  CHECK ((location_type = ANY (ARRAY['online'::text, 'offline'::text, 'onsite'::text])));

ALTER TABLE meetings ADD CONSTRAINT meetings_status_check 
  CHECK ((status = ANY (ARRAY['scheduled'::text, 'completed'::text, 'cancelled'::text])));

ALTER TABLE meetings ADD CONSTRAINT meetings_student_id_fkey 
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE meetings ADD CONSTRAINT meetings_faculty_id_fkey 
  FOREIGN KEY (faculty_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE meetings ADD CONSTRAINT meetings_lor_request_id_fkey 
  FOREIGN KEY (lor_request_id) REFERENCES lor_requests(id) ON DELETE CASCADE;

-- Notifications table (optional for future use)
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false NOT NULL,
  related_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_lor_requests_student_id ON lor_requests USING btree (student_id);
CREATE INDEX idx_lor_requests_faculty_id ON lor_requests USING btree (faculty_id);
CREATE INDEX idx_lor_requests_status ON lor_requests USING btree (status);
CREATE INDEX idx_lor_requests_deadline ON lor_requests USING btree (deadline);

CREATE INDEX idx_documents_lor_request_id ON documents USING btree (lor_request_id);
CREATE INDEX idx_documents_author_id ON documents USING btree (author_id);
CREATE INDEX idx_documents_version ON documents USING btree (version);
CREATE INDEX idx_documents_is_current ON documents USING btree (is_current);

CREATE INDEX idx_comments_document_id ON comments USING btree (document_id);
CREATE INDEX idx_comments_author_id ON comments USING btree (author_id);
CREATE INDEX idx_comments_resolved ON comments USING btree (resolved);

CREATE INDEX idx_meetings_student_id ON meetings USING btree (student_id);
CREATE INDEX idx_meetings_faculty_id ON meetings USING btree (faculty_id);
CREATE INDEX idx_meetings_scheduled_date ON meetings USING btree (scheduled_date);
CREATE INDEX idx_meetings_status ON meetings USING btree (status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lor_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Authenticated users can read other users" ON users
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT TO authenticated
  WITH CHECK (uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (uid() = id);

-- RLS Policies for lor_requests table
CREATE POLICY "Students can read own requests" ON lor_requests
  FOR SELECT TO authenticated
  USING (student_id = uid());

CREATE POLICY "Faculty can read assigned requests" ON lor_requests
  FOR SELECT TO authenticated
  USING (faculty_id = uid());

CREATE POLICY "Students can create requests" ON lor_requests
  FOR INSERT TO authenticated
  WITH CHECK (student_id = uid());

CREATE POLICY "Faculty can update assigned requests" ON lor_requests
  FOR UPDATE TO authenticated
  USING (faculty_id = uid());

-- RLS Policies for documents table
CREATE POLICY "Students can read documents for their requests" ON documents
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM lor_requests 
    WHERE lor_requests.id = documents.lor_request_id 
    AND lor_requests.student_id = uid()
  ));

CREATE POLICY "Faculty can read documents for assigned requests" ON documents
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM lor_requests 
    WHERE lor_requests.id = documents.lor_request_id 
    AND lor_requests.faculty_id = uid()
  ));

CREATE POLICY "Users can create documents for their requests" ON documents
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM lor_requests 
    WHERE lor_requests.id = documents.lor_request_id 
    AND (lor_requests.student_id = uid() OR lor_requests.faculty_id = uid())
  ));

CREATE POLICY "Users can update documents for their requests" ON documents
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM lor_requests 
    WHERE lor_requests.id = documents.lor_request_id 
    AND (lor_requests.student_id = uid() OR lor_requests.faculty_id = uid())
  ));

-- RLS Policies for comments table
CREATE POLICY "Students can read comments for their requests" ON comments
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM lor_requests 
    WHERE lor_requests.id = comments.document_id 
    AND lor_requests.student_id = uid()
  ));

CREATE POLICY "Faculty can read comments for assigned requests" ON comments
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM lor_requests 
    WHERE lor_requests.id = comments.document_id 
    AND lor_requests.faculty_id = uid()
  ));

CREATE POLICY "Users can create comments for their requests" ON comments
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM lor_requests 
    WHERE lor_requests.id = comments.document_id 
    AND (lor_requests.student_id = uid() OR lor_requests.faculty_id = uid())
  ));

CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE TO authenticated
  USING (author_id = uid());

-- RLS Policies for meetings table
CREATE POLICY "Students can read own meetings" ON meetings
  FOR SELECT TO authenticated
  USING (student_id = uid());

CREATE POLICY "Faculty can read assigned meetings" ON meetings
  FOR SELECT TO authenticated
  USING (faculty_id = uid());

CREATE POLICY "Students can create meetings" ON meetings
  FOR INSERT TO authenticated
  WITH CHECK (student_id = uid());

CREATE POLICY "Users can update their meetings" ON meetings
  FOR UPDATE TO authenticated
  USING (student_id = uid() OR faculty_id = uid());

-- RLS Policies for notifications table
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = uid());

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = uid());

-- Insert some sample data for testing (optional)
-- Note: You'll need to replace these UUIDs with actual auth.users IDs after user registration

-- Sample admin user (you'll need to update the ID after creating the auth user)
-- INSERT INTO users (id, email, role, full_name, department, designation) VALUES
--   ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'admin', 'System Administrator', 'Administration', 'Admin');