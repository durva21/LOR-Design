import React, { useState } from 'react';
import { Calendar, Clock, Video, MapPin, Plus, Edit, Trash2, Search, SlidersHorizontal, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { MeetingRequestModal } from '../meetings/MeetingRequestModal';
import { MeetingNotesModal } from '../meetings/MeetingNotesModal';

interface Meeting {
  id: string;
  faculty: string;
  avatar: string;
  title: string;
  time: string;
  mode: 'online' | 'offline';
  status: 'today' | 'upcoming' | 'completed' | 'requested' | 'approved' | 'rejected';
  agenda?: string[];
  notes?: string;
  universities?: string[];
  purpose?: string;
}

export const MeetingScheduler: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed' | 'requested'>('today');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'online' | 'offline'>('all');
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      faculty: 'Kate Morrison',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      title: 'LoR Discussion - MIT Application',
      time: '9:00 - 9:30',
      mode: 'online',
      status: 'today',
      agenda: ['Review draft structure', 'Discuss key achievements', 'Timeline for revisions'],
      notes: 'Discussed MIT PhD application requirements. Focus on research experience and publications. Need to highlight machine learning projects.',
      universities: ['MIT'],
      purpose: 'PhD Application'
    },
    {
      id: '2',
      faculty: 'Aliah Lane',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      title: 'Stanford & Harvard LoR Planning',
      time: '11:45 - 12:15',
      mode: 'offline',
      status: 'today',
      agenda: ['Review both applications', 'Discuss differences in requirements', 'Timeline coordination'],
      universities: ['Stanford', 'Harvard'],
      purpose: 'Masters Application'
    },
    {
      id: '3',
      faculty: 'Andi Lane',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      title: 'Research Internship LoR',
      time: '14:30 - 14:50',
      mode: 'online',
      status: 'today',
      agenda: ['Verify submission process', 'Confirm deadlines'],
      universities: ['Google Research', 'Microsoft Research'],
      purpose: 'Research Internship'
    },
    {
      id: '4',
      faculty: 'Drew Cano',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      title: 'Initial LoR Discussion',
      time: 'Pending approval',
      mode: 'online',
      status: 'requested',
      universities: ['CMU', 'Berkeley'],
      purpose: 'PhD Application'
    }
  ]);

  const tabCounts = {
    today: meetings.filter(m => m.status === 'today').length,
    upcoming: meetings.filter(m => m.status === 'upcoming' || m.status === 'approved').length,
    completed: meetings.filter(m => m.status === 'completed').length,
    requested: meetings.filter(m => m.status === 'requested').length
  };

  const tabs = [
    { key: 'today' as const, label: "Today's", count: tabCounts.today },
    { key: 'upcoming' as const, label: 'Upcoming', count: tabCounts.upcoming },
    { key: 'completed' as const, label: 'Completed', count: tabCounts.completed },
    { key: 'requested' as const, label: 'Requested', count: tabCounts.requested },
  ];

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMode = filterMode === 'all' || meeting.mode === filterMode;
    const matchesTab = meeting.status === activeTab || 
                      (activeTab === 'upcoming' && meeting.status === 'approved');
    return matchesSearch && matchesMode && matchesTab;
  });

  const handleMeetingRequestSubmit = (data: any) => {
    const newMeeting: Meeting = {
      id: (meetings.length + 1).toString(),
      faculty: data.faculty_name,
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      title: `${data.purpose} Discussion`,
      time: 'Pending approval',
      mode: data.meeting_mode,
      status: 'requested',
      universities: data.target_universities ? data.target_universities.split(',').map((u: string) => u.trim()) : [],
      purpose: data.purpose
    };
    
    setMeetings([...meetings, newMeeting]);
    console.log('Meeting request submitted:', data);
  };

  const handleNotesOpen = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowNotesModal(true);
  };

  const handleNotesSave = (meetingId: string, notes: string) => {
    setMeetings(prevMeetings => 
      prevMeetings.map(meeting => 
        meeting.id === meetingId 
          ? { ...meeting, notes, status: 'completed' as const }
          : meeting
      )
    );
    setShowNotesModal(false);
  };

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetings(prevMeetings => prevMeetings.filter(m => m.id !== meetingId));
  };

  const getStatusIcon = (status: Meeting['status']) => {
    switch (status) {
      case 'requested':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Plan Your LoR Meetings with Ease</h2>
          <p className="text-white/90 mb-6">
            Schedule meetings with faculty to discuss your applications, document requirements, and ensure clarity before drafting begins.
          </p>
          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors inline-flex items-center space-x-2"
          >
            <span>Request a meeting</span>
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute right-8 top-8 opacity-20">
          <div className="w-40 h-40 bg-white rounded-2xl transform rotate-12"></div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-3">
        <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-purple-50 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          />
        </div>
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value as 'all' | 'online' | 'offline')}
          className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        >
          <option value="all">All Modes</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Meeting Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {filteredMeetings.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-3 text-sm font-medium text-gray-900">Faculty Name</th>
                      <th className="pb-3 text-sm font-medium text-gray-900">Title</th>
                      <th className="pb-3 text-sm font-medium text-gray-900">Time</th>
                      <th className="pb-3 text-sm font-medium text-gray-900">Mode</th>
                      <th className="pb-3 text-sm font-medium text-gray-900">Status</th>
                      <th className="pb-3 text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMeetings.map((meeting) => (
                      <tr key={meeting.id} className="hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={meeting.avatar}
                              alt={meeting.faculty}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="font-medium text-gray-900">{meeting.faculty}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div>
                            <div className="text-gray-900">{meeting.title}</div>
                            {meeting.universities && meeting.universities.length > 0 && (
                              <div className="text-sm text-gray-500">
                                {meeting.universities.join(', ')}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 text-gray-700">{meeting.time}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            meeting.mode === 'online' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {meeting.mode === 'online' ? (
                              <Video className="w-3 h-3 mr-1" />
                            ) : (
                              <MapPin className="w-3 h-3 mr-1" />
                            )}
                            {meeting.mode}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(meeting.status)}
                            <span className="text-sm text-gray-600 capitalize">
                              {meeting.status === 'requested' ? 'Pending' : meeting.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            {(meeting.status === 'today' || meeting.status === 'completed') && (
                              <button
                                onClick={() => handleNotesOpen(meeting)}
                                className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                                title="Meeting notes"
                              >
                                <MessageSquare className="h-4 w-4" />
                              </button>
                            )}
                            {meeting.status === 'requested' && (
                              <button
                                onClick={() => handleDeleteMeeting(meeting.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Cancel request"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'today' && 'No meetings scheduled for today'}
                {activeTab === 'upcoming' && 'No upcoming meetings'}
                {activeTab === 'completed' && 'No completed meetings'}
                {activeTab === 'requested' && 'No meeting requests pending'}
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'today' && 'Your meetings for today will appear here'}
                {activeTab === 'upcoming' && 'Your upcoming meetings will appear here'}
                {activeTab === 'completed' && 'Your completed meetings will appear here'}
                {activeTab === 'requested' && 'Your meeting requests will appear here'}
              </p>
              {activeTab !== 'completed' && (
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Request Meeting</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Meeting Request Modal */}
      <MeetingRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleMeetingRequestSubmit}
      />

      {/* Meeting Notes Modal */}
      <MeetingNotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        meeting={selectedMeeting}
        onSave={handleNotesSave}
      />
    </div>
  );
};