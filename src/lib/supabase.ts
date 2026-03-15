import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database service functions
export const dbService = {
  // Users
  async getUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data;
  },

  async createUser(user: any) {
    const { data, error } = await supabase.from('users').insert(user).select();
    if (error) throw error;
    return data[0];
  },

  async updateUser(id: string, updates: any) {
    const { data, error } = await supabase.from('users').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  async deleteUser(id: string) {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;
  },

  // LoR Requests
  async getLoRRequests(userId?: string, role?: string) {
    let query = supabase.from('lor_requests').select(`
      *,
      student:student_id(name, email),
      faculty:faculty_id(name, email, department)
    `);
    
    if (userId && role === 'student') {
      query = query.eq('student_id', userId);
    } else if (userId && role === 'faculty') {
      query = query.eq('faculty_id', userId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createLoRRequest(request: any) {
    const { data, error } = await supabase.from('lor_requests').insert(request).select();
    if (error) throw error;
    return data[0];
  },

  async updateLoRRequest(id: string, updates: any) {
    const { data, error } = await supabase.from('lor_requests').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  // Meetings
  async getMeetings(userId?: string, role?: string) {
    let query = supabase.from('meetings').select(`
      *,
      student:student_id(name, email),
      faculty:faculty_id(name, email, department)
    `);
    
    if (userId && role === 'student') {
      query = query.eq('student_id', userId);
    } else if (userId && role === 'faculty') {
      query = query.eq('faculty_id', userId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createMeeting(meeting: any) {
    const { data, error } = await supabase.from('meetings').insert(meeting).select();
    if (error) throw error;
    return data[0];
  },

  async updateMeeting(id: string, updates: any) {
    const { data, error } = await supabase.from('meetings').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  // Drafts
  async getDrafts(requestId: string) {
    const { data, error } = await supabase.from('drafts').select('*').eq('request_id', requestId);
    if (error) throw error;
    return data;
  },

  async createDraft(draft: any) {
    const { data, error } = await supabase.from('drafts').insert(draft).select();
    if (error) throw error;
    return data[0];
  },

  async updateDraft(id: string, updates: any) {
    const { data, error } = await supabase.from('drafts').update(updates).eq('id', id).select();
    if (error) throw error;
    return data[0];
  },

  // Notifications
  async getNotifications(userId: string) {
    const { data, error } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createNotification(notification: any) {
    const { data, error } = await supabase.from('notifications').insert(notification).select();
    if (error) throw error;
    return data[0];
  },

  async markNotificationRead(id: string) {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) throw error;
  }
};