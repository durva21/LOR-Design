// Database Schema Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty';
  avatar?: string;
  department?: string;
  designation?: string;
  phone?: string;
  bio?: string;
  created_at: Date;
  updated_at: Date;
}

export interface LoRRequest {
  id: string;
  student_id: string;
  faculty_id: string;
  institute_company: string;
  purpose: 'phd' | 'masters' | 'internship' | 'job' | 'research' | 'other';
  deadline: Date;
  additional_info?: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  created_at: Date;
  updated_at: Date;
  documents?: Document[];
  drafts?: Draft[];
}

export interface Document {
  id: string;
  request_id: string;
  name: string;
  type: 'resume' | 'transcript' | 'sop' | 'other';
  file_url: string;
  file_size: number;
  uploaded_at: Date;
  uploaded_by: string;
}

export interface Draft {
  id: string;
  request_id: string;
  version: number;
  title: string;
  content: string;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  created_by: string;
  created_at: Date;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  draft_id: string;
  user_id: string;
  content: string;
  position?: {
    start: number;
    end: number;
  };
  created_at: Date;
  resolved: boolean;
}

export interface Meeting {
  id: string;
  student_id: string;
  faculty_id: string;
  request_id?: string;
  title: string;
  description?: string;
  scheduled_date: Date;
  duration: number; // in minutes
  mode: 'online' | 'offline';
  location?: string;
  meeting_url?: string;
  status: 'requested' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  agenda?: string[];
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'request' | 'meeting' | 'draft' | 'deadline' | 'comment';
  title: string;
  message: string;
  read: boolean;
  created_at: Date;
  related_id?: string; // ID of related entity
}

export interface Template {
  id: string;
  name: string;
  purpose: string;
  content: string;
  created_by: string;
  is_public: boolean;
  created_at: Date;
}