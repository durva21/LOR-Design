import React, { useState } from 'react';
import { Calendar, Clock, Video, MapPin, CheckCircle, XCircle, RotateCcw, Eye, Search, SlidersHorizontal, Plus } from 'lucide-react';
import { RescheduleModal } from '../meetings/RescheduleModal';
import { MeetingRequestModal } from '../meetings/MeetingRequestModal';

interface MeetingRequest {
  id: string;
  student: string;
  studentAvatar: string;
  title: string;
  purpose: string;
  universities: string[];
  universityCount: number;
  preferredSlots: string[];
  mode: 'online' | 'offline';
  status: 'pending' | 'approved' | 'rejected' | 'rescheduled' | 'completed';
  submittedDate: string;
  additionalNotes?: string;
  scheduledTime?: string;
  scheduledDate?: string;
  location?: string;
  meetingUrl?: string;
}

export const FacultyMeetingScheduler: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'upcoming' | 'completed'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<MeetingRequest | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [rescheduleRequest, setRescheduleRequest] = useState<MeetingRequest | null>(null);
  const [requests, setRequests] = useState<MeetingRequest[]>([
    {
      id: '1',
      student: 'Durva Badekar',
      studentAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      title: 'LoR Discussion Meeting',
      purpose: 'higher_studies',
      universities: ['MIT', 'Stanford'],
      universityCount: 2,
      preferredSlots: ['Monday - 9:00 AM', 'Tuesday - 10:00 AM', 'Wednesday - 2:00 PM'],
      mode: 'online',
      status: 'pending',
      submittedDate: '2024-01-28',
      additionalNotes: 'Would like to discuss research focus and publication requirements for PhD applications.'
    },
    {
      id: '2',
      student: 'John Smith',
      studentAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      title: 'Masters Application LoR',
      purpose: 'higher_studies',
      universities: ['CMU', 'Berkeley', 'UIUC'],
      universityCount: 3,
      preferredSlots: ['Monday - 2:00 PM', 'Thursday - 10:00 AM', 'Friday - 11:00 AM'],
      mode: 'offline',
      status: 'pending',
      submittedDate: '2024-01-27',
      additionalNotes: 'Need to discuss different requirements for each university.'
    },
    {
      id: '3',
      student: 'Sarah Johnson',
      studentAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      title: 'PhD Application Discussion',
      purpose: 'higher_studies',
      universities: ['Harvard', 'Yale'],
      universityCount: 2,
      preferredSlots: ['Tuesday - 11:00 AM', 'Wednesday - 3:00 PM'],
      mode: 'online',
      status: 'approved',
      submittedDate: '2024-01-25',
      scheduledTime: '11:00 AM',
      scheduledDate: '2024-02-05',
      meetingUrl: 'https://zoom.us/j/123456789'
    },
    {
      id: '4',
      student: 'Alex Chen',
      studentAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      title: 'Research Internship LoR',
      purpose: 'internship',
      universities: ['Google Research', 'Microsoft Research'],
      universityCount: 2,
      preferredSlots: ['Friday - 2:00 PM', 'Monday - 10:00 AM'],
      mode: 'offline',
      status: 'approved',
      submittedDate: '2024-01-23',
      scheduledTime: '2:00 PM',
      scheduledDate: '2024-02-02',
      location: 'Faculty Office - Room 301'
    }
  ]);

  const getTabFilter = (status: string) => {
    switch (activeTab) {
      case 'pending':
        return status === 'pending';
      case 'upcoming':
        return status === 'approved';
      case 'completed':
        return status === 'completed';
      default:
        return false;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.universities.some(u => u.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = getTabFilter(request.status);
    return matchesSearch && matchesTab;
  });

  const getTabCounts = () => {
    return {
      pending: requests.filter(r => r.status === 'pending').length,
      upcoming: requests.filter(r => r.status === 'approved').length,
      completed: requests.filter(r => r.status === 'completed').length
    };
  };

  const tabCounts = getTabCounts();

  const handleAction = (requestId: string, action: 'approve' | 'reject' | 'reschedule' | 'complete', selectedSlot?: string) => {
    if (action === 'reschedule') {
      const request = requests.find(r => r.id === requestId);
      if (request) {
        setRescheduleRequest(request);
        setShowRescheduleModal(true);
      }
      return;
    }

    setRequests(prevRequests => 
      prevRequests.map(request => {
        if (request.id === requestId) {
          switch (action) {
            case 'approve':
              const [day, time] = selectedSlot ? selectedSlot.split(' - ') : ['', ''];
              return { 
                ...request, 
                status: 'approved' as const,
                scheduledTime: time,
                scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Next week
              };
            case 'reject':
              return { ...request, status: 'rejected' as const };
            case 'complete':
              return { ...request, status: 'completed' as const };
            default:
              return request;
          }
        }
        return request;
      })
    );
    
    setSelectedRequest(null);
    console.log(`${action} meeting request ${requestId}`, selectedSlot ? `for slot: ${selectedSlot}` : '');
  };

  const handleRescheduleSubmit = (rescheduleData: any) => {
    console.log('Reschedule data submitted:', rescheduleData);
    
    // Update the request status to rescheduled
    setRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === rescheduleData.meetingRequestId 
          ? { ...request, status: 'rescheduled' as const }
          : request
      )
    );
    
    // Close modals
    setShowRescheduleModal(false);
    setRescheduleRequest(null);
    setSelectedRequest(null);
  };

  const handleMeetingRequestSubmit = (data: any) => {
    console.log('Faculty meeting request submitted:', data);
    // Handle faculty-initiated meeting request
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'approved':
        return 'text-green-700 bg-green-100';
      case 'rejected':
        return 'text-red-700 bg-red-100';
      case 'rescheduled':
        return 'text-blue-700 bg-blue-100';
      case 'completed':
        return 'text-purple-700 bg-purple-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getPurposeLabel = (purpose: string) => {
    switch (purpose) {
      case 'higher_studies':
        return 'Higher Studies';
      case 'internship':
        return 'Research Internship';
      case 'job':
        return 'Job Application';
      case 'research':
        return 'Research Position';
      default:
        return 'Other';
    }
  };

  const renderActionButtons = (request: MeetingRequest) => {
    switch (activeTab) {
      case 'pending':
        return (
          <>
            <button
              onClick={() => handleAction(request.id, 'approve')}
              className="p-2 text-green-600 hover:text-green-700 transition-colors"
              title="Approve"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleAction(request.id, 'reject')}
              className="p-2 text-red-600 hover:text-red-700 transition-colors"
              title="Reject"
            >
              <XCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleAction(request.id, 'reschedule')}
              className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
              title="Reschedule"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </>
        );
      case 'upcoming':
        return (
          <>
            <button
              onClick={() => handleAction(request.id, 'reschedule')}
              className="p-2 text-blue-600 hover:text-blue-700 transition-colors"
              title="Reschedule"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleAction(request.id, 'complete')}
              className="p-2 text-purple-600 hover:text-purple-700 transition-colors"
              title="Mark as Completed"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          </>
        );
      case 'completed':
        return (
          <span className="text-sm text-gray-500">Completed</span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-medium mb-4">Plan Your LoR Meetings with Ease</h2>
          <p className="text-white/90 mb-6">
            Schedule meetings with students to discuss their applications, document requirements, and ensure clarity before drafting begins.
          </p>
          <button
            onClick={() => setShowMeetingModal(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors inline-flex items-center space-x-2"
          >
            <span>Schedule a meeting</span>
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute right-8 top-8 opacity-20">
          <div className="w-40 h-40 bg-white rounded-2xl transform rotate-12"></div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3">
        <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <SlidersHorizontal className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-purple-50 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'pending', label: 'Pending Requests', count: tabCounts.pending },
            { key: 'upcoming', label: 'Upcoming Meetings', count: tabCounts.upcoming },
            { key: 'completed', label: 'Completed', count: tabCounts.completed }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
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

      {/* Meeting Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Purpose</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Universities</th>
                {activeTab === 'upcoming' && (
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Scheduled</th>
                )}
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Mode</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={request.studentAvatar}
                        alt={request.student}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{request.student}</div>
                        <div className="text-sm text-gray-500">
                          Submitted {new Date(request.submittedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{getPurposeLabel(request.purpose)}</div>
                    <div className="text-sm text-gray-500">{request.universityCount} universities</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">
                      {request.universities.slice(0, 2).join(', ')}
                      {request.universities.length > 2 && ` +${request.universities.length - 2} more`}
                    </div>
                  </td>
                  {activeTab === 'upcoming' && (
                    <td className="px-6 py-4">
                      <div className="text-gray-900">
                        {request.scheduledDate && new Date(request.scheduledDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{request.scheduledTime}</div>
                      {request.location && (
                        <div className="text-xs text-gray-500 mt-1">{request.location}</div>
                      )}
                      {request.meetingUrl && (
                        <div className="text-xs text-blue-600 mt-1">Online Meeting</div>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.mode === 'online' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {request.mode === 'online' ? (
                        <Video className="w-3 h-3 mr-1" />
                      ) : (
                        <MapPin className="w-3 h-3 mr-1" />
                      )}
                      {request.mode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {renderActionButtons(request)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'pending' && 'No pending meeting requests'}
              {activeTab === 'upcoming' && 'No upcoming meetings'}
              {activeTab === 'completed' && 'No completed meetings'}
            </h3>
            <p className="text-gray-600">
              {activeTab === 'pending' && 'New meeting requests will appear here'}
              {activeTab === 'upcoming' && 'Approved meetings will appear here'}
              {activeTab === 'completed' && 'Completed meetings will appear here'}
            </p>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Meeting Request Details</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={selectedRequest.studentAvatar}
                  alt={selectedRequest.student}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedRequest.student}</h4>
                  <p className="text-gray-600">{getPurposeLabel(selectedRequest.purpose)}</p>
                  <p className="text-sm text-gray-500">
                    Submitted {new Date(selectedRequest.submittedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Universities ({selectedRequest.universityCount})</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {selectedRequest.universities.map((uni, index) => (
                      <li key={index}>• {uni}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Meeting Mode</h5>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedRequest.mode === 'online' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedRequest.mode === 'online' ? (
                      <Video className="w-4 h-4 mr-2" />
                    ) : (
                      <MapPin className="w-4 h-4 mr-2" />
                    )}
                    {selectedRequest.mode}
                  </span>
                </div>
              </div>

              {/* Scheduled Info for Upcoming Meetings */}
              {activeTab === 'upcoming' && selectedRequest.status === 'approved' && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h5 className="font-medium text-green-900 mb-2">Scheduled Meeting</h5>
                  <div className="text-sm text-green-800">
                    <p><strong>Date:</strong> {selectedRequest.scheduledDate && new Date(selectedRequest.scheduledDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {selectedRequest.scheduledTime}</p>
                    {selectedRequest.location && <p><strong>Location:</strong> {selectedRequest.location}</p>}
                    {selectedRequest.meetingUrl && <p><strong>Meeting URL:</strong> <a href={selectedRequest.meetingUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Join Meeting</a></p>}
                  </div>
                </div>
              )}

              {/* Preferred Time Slots for Pending */}
              {activeTab === 'pending' && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Preferred Time Slots</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedRequest.preferredSlots.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <span className="text-gray-700">{slot}</span>
                        {selectedRequest.status === 'pending' && (
                          <button
                            onClick={() => handleAction(selectedRequest.id, 'approve', slot)}
                            className="px-3 py-1 text-sm text-green-700 bg-green-50 border border-green-200 rounded hover:bg-green-100 transition-colors"
                          >
                            Select This Slot
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {selectedRequest.additionalNotes && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Additional Notes</h5>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {selectedRequest.additionalNotes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {activeTab === 'pending' && selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(selectedRequest.id, 'approve')}
                      className="flex-1 px-4 py-2 text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Approve Meeting
                    </button>
                    <button
                      onClick={() => handleAction(selectedRequest.id, 'reschedule')}
                      className="flex-1 px-4 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Suggest New Times
                    </button>
                    <button
                      onClick={() => handleAction(selectedRequest.id, 'reject')}
                      className="flex-1 px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Reject Request
                    </button>
                  </>
                )}
                
                {activeTab === 'upcoming' && selectedRequest.status === 'approved' && (
                  <>
                    <button
                      onClick={() => handleAction(selectedRequest.id, 'reschedule')}
                      className="flex-1 px-4 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Reschedule Meeting
                    </button>
                    <button
                      onClick={() => handleAction(selectedRequest.id, 'complete')}
                      className="flex-1 px-4 py-2 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={() => {
          setShowRescheduleModal(false);
          setRescheduleRequest(null);
        }}
        onSubmit={handleRescheduleSubmit}
        meetingRequest={rescheduleRequest}
      />

      {/* Meeting Request Modal */}
      <MeetingRequestModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        onSubmit={handleMeetingRequestSubmit}
      />
    </div>
  );
};