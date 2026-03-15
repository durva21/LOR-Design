import React, { useState } from 'react';
import { Plus, Clock, CheckCircle, XCircle, Eye, Search, SlidersHorizontal, Calendar } from 'lucide-react';
import { RequestLoRModal } from '../modals/RequestLoRModal';
import { MeetingRequestModal } from '../meetings/MeetingRequestModal';

interface RequestTimeline {
  id: string;
  faculty: string;
  university: string;
  status: 'completed' | 'in-progress' | 'pending' | 'rejected' | 'approved';
  priority: 'high' | 'medium' | 'low';
  timeline: {
    submitted: string;
    accepted?: string;
    rejected?: string;
    draft_started?: string;
    completed?: string;
  };
}

export const RequestLoR: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState<RequestTimeline | null>(null);
  const [selectedFacultyForMeeting, setSelectedFacultyForMeeting] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [requestTimelines, setRequestTimelines] = useState<RequestTimeline[]>([
    {
      id: '1',
      faculty: 'Dr. Smith',
      university: 'MIT',
      status: 'completed',
      priority: 'high',
      timeline: {
        submitted: '2024-01-15',
        accepted: '2024-01-16',
        draft_started: '2024-01-18',
        completed: '2024-01-22'
      }
    },
    {
      id: '2',
      faculty: 'Prof. Johnson',
      university: 'Stanford',
      status: 'approved',
      priority: 'medium',
      timeline: {
        submitted: '2024-01-20',
        accepted: '2024-01-21'
      }
    },
    {
      id: '3',
      faculty: 'Dr. Wilson',
      university: 'Harvard',
      status: 'rejected',
      priority: 'high',
      timeline: {
        submitted: '2024-01-18',
        rejected: '2024-01-19'
      }
    }
  ]);

  const getTimelineStatusColor = (status: RequestTimeline['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'approved':
        return 'bg-purple-100 text-purple-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleRequestSubmit = (data: any) => {
    const newRequest: RequestTimeline = {
      id: (requestTimelines.length + 1).toString(),
      faculty: data.faculty_name,
      university: data.institute_company,
      status: 'pending',
      priority: data.priority,
      timeline: {
        submitted: new Date().toISOString().split('T')[0]
      }
    };

    setRequestTimelines([newRequest, ...requestTimelines]);
    console.log('New LoR Request submitted:', data);
  };

  const handleMeetingRequest = (faculty: string) => {
    setSelectedFacultyForMeeting(faculty);
    setShowMeetingModal(true);
  };

  const handleMeetingSubmit = (data: any) => {
    console.log('Meeting request submitted:', data);
  };

  const filteredTimelines = requestTimelines.filter(timeline =>
    timeline.faculty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timeline.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionButton = (request: RequestTimeline) => {
    switch (request.status) {
      case 'approved':
        return (
          <button
            onClick={() => handleMeetingRequest(request.faculty)}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
          >
            <Calendar className="h-3 w-3" />
            <span>Request Meeting</span>
          </button>
        );
      case 'pending':
        return (
          <span className="px-3 py-1.5 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md">
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1.5 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md">
            Rejected
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1.5 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md">
            Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search and Filter Bar with New Request Button */}
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
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Single Tab Header */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <div className="py-4 px-1 border-b-2 border-purple-500 text-purple-600 font-medium text-sm">
            Overview
          </div>
        </nav>
      </div>

      {/* Overview Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Faculty</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">University</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTimelines.map((request) => (
                <tr 
                  key={request.id} 
                  className={`hover:bg-gray-50 transition-colors ${
                    request.status === 'rejected' ? 'opacity-75' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">
                          {request.faculty.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className={`font-medium ${
                        request.status === 'rejected' ? 'text-gray-500' : 'text-gray-900'
                      }`}>
                        {request.faculty}
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 ${
                    request.status === 'rejected' ? 'text-gray-500' : 'text-gray-900'
                  }`}>
                    {request.university}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTimelineStatusColor(request.status)}`}>
                      {request.status === 'in-progress' ? 'in progress' : request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedTimeline(request)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View timeline"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {getActionButton(request)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Timeline Details Modal */}
      {selectedTimeline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Request Timeline</h3>
              <button
                onClick={() => setSelectedTimeline(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedTimeline.faculty}</h3>
                  <p className="text-gray-600">{selectedTimeline.university}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedTimeline.priority)}`}>
                    {selectedTimeline.priority}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTimelineStatusColor(selectedTimeline.status)}`}>
                    {selectedTimeline.status === 'in-progress' ? 'in progress' : selectedTimeline.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Request Submitted */}
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Request Submitted</h4>
                    <p className="text-sm text-gray-500">{new Date(selectedTimeline.timeline.submitted).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Professor Accepted */}
                {selectedTimeline.timeline.accepted && (
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Professor Accepted</h4>
                      <p className="text-sm text-gray-500">{new Date(selectedTimeline.timeline.accepted).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                {/* Professor Rejected */}
                {selectedTimeline.timeline.rejected && (
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Request Rejected</h4>
                      <p className="text-sm text-gray-500">{new Date(selectedTimeline.timeline.rejected).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                {/* Draft In Progress */}
                {selectedTimeline.timeline.draft_started && (
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Draft In Progress</h4>
                      <p className="text-sm text-gray-500">{new Date(selectedTimeline.timeline.draft_started).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                {/* LoR Completed */}
                {selectedTimeline.timeline.completed && (
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">LoR Completed</h4>
                      <p className="text-sm text-gray-500">{new Date(selectedTimeline.timeline.completed).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button in Modal */}
              {selectedTimeline.status === 'approved' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedTimeline(null);
                      handleMeetingRequest(selectedTimeline.faculty);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Request Meeting with {selectedTimeline.faculty}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request LoR Modal */}
      <RequestLoRModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleRequestSubmit}
      />

      {/* Meeting Request Modal */}
      <MeetingRequestModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        onSubmit={handleMeetingSubmit}
        facultyName={selectedFacultyForMeeting}
      />
    </div>
  );
};