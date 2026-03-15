import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Eye, MessageSquare, Search, SlidersHorizontal, Calendar, Building, User } from 'lucide-react';

interface Request {
  id: string;
  student: string;
  studentAvatar: string;
  purpose: string;
  university: string;
  deadline: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  submittedDate: string;
  details: {
    gpa: string;
    achievements: string[];
    personalStatement: string;
  };
}

export const RequestManagement: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '1',
      student: 'Durva Badekar',
      studentAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      purpose: 'PhD Application',
      university: 'MIT',
      deadline: '2024-02-15',
      status: 'pending',
      priority: 'high',
      submittedDate: '2024-01-15',
      details: {
        gpa: '3.85',
        achievements: ['Research Publication in IJCAI', 'Dean\'s List (3 semesters)', 'Best Project Award 2023'],
        personalStatement: 'I am passionate about artificial intelligence and machine learning...'
      }
    },
    {
      id: '2',
      student: 'John Smith',
      studentAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      purpose: 'MS Application',
      university: 'Stanford',
      deadline: '2024-02-20',
      status: 'approved',
      priority: 'medium',
      submittedDate: '2024-01-12',
      details: {
        gpa: '3.72',
        achievements: ['Google Summer of Code 2023', 'Hackathon Winner', 'Open Source Contributor'],
        personalStatement: 'My interest in computational research began during my sophomore year...'
      }
    },
    {
      id: '3',
      student: 'Sarah Johnson',
      studentAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      purpose: 'Job Application',
      university: 'Harvard',
      deadline: '2024-02-10',
      status: 'in-progress',
      priority: 'high',
      submittedDate: '2024-01-10',
      details: {
        gpa: '3.91',
        achievements: ['Valedictorian', 'Research Assistant (2 years)', 'IEEE Student Member'],
        personalStatement: 'My academic journey has been driven by a desire to solve real-world problems...'
      }
    },
    {
      id: '4',
      student: 'Alex Chen',
      studentAvatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      purpose: 'Research Position',
      university: 'Berkeley',
      deadline: '2024-01-30',
      status: 'completed',
      priority: 'medium',
      submittedDate: '2024-01-05',
      details: {
        gpa: '3.78',
        achievements: ['Research Assistant', 'Published Paper', 'Conference Presentation'],
        personalStatement: 'My research interests focus on machine learning applications...'
      }
    }
  ]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'approved':
        return 'text-green-700 bg-green-100';
      case 'rejected':
        return 'text-red-700 bg-red-100';
      case 'in-progress':
        return 'text-blue-700 bg-blue-100';
      case 'completed':
        return 'text-purple-700 bg-purple-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.university.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAction = (requestId: string, action: 'accept' | 'reject' | 'complete') => {
    setRequests(prevRequests => 
      prevRequests.map(request => {
        if (request.id === requestId) {
          switch (action) {
            case 'accept':
              return { ...request, status: 'approved' as const };
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
    
    // Close modal if open
    if (selectedRequest?.id === requestId) {
      setSelectedRequest(null);
    }
    
    console.log(`${action} request ${requestId}`);
  };

  const getActionButtons = (request: Request) => {
    switch (request.status) {
      case 'pending':
        return (
          <>
            <button
              onClick={() => handleAction(request.id, 'accept')}
              className="px-3 py-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={() => handleAction(request.id, 'reject')}
              className="px-3 py-1.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
            >
              Reject
            </button>
          </>
        );
      case 'approved':
        return (
          <span className="px-3 py-1.5 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md">
            Start Writing
          </span>
        );
      case 'in-progress':
        return (
          <button
            onClick={() => handleAction(request.id, 'complete')}
            className="px-3 py-1.5 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
          >
            Mark Complete
          </button>
        );
      case 'completed':
        return (
          <span className="px-3 py-1.5 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md">
            Completed
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1.5 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-md">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search and Filter Bar with Status Filter */}
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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Institute</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Purpose</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Deadline</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">
                          {request.student.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{request.student}</div>
                        <div className="text-sm text-gray-500">Submitted {new Date(request.submittedDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{request.university}</td>
                  <td className="px-6 py-4 text-gray-900">{request.purpose}</td>
                  <td className="px-6 py-4 text-gray-900">{new Date(request.deadline).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status === 'in-progress' ? 'in progress' : request.status}
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
                      {getActionButtons(request)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Request Details</h3>
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
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-medium text-purple-600">
                    {selectedRequest.student.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{selectedRequest.student}</h4>
                  <p className="text-gray-600">{selectedRequest.purpose} - {selectedRequest.university}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status === 'in-progress' ? 'in progress' : selectedRequest.status}
                  </span>
                </div>
              </div>

              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">University:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedRequest.university}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Deadline:</span>
                  <span className="text-sm font-medium text-gray-900">{new Date(selectedRequest.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Academic Info */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Academic Information</h5>
                <p className="text-sm text-gray-700">GPA: {selectedRequest.details.gpa}/4.0</p>
              </div>

              {/* Achievements */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Key Achievements</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  {selectedRequest.details.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Personal Statement */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Personal Statement (Preview)</h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedRequest.details.personalStatement}
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(selectedRequest.id, 'accept')}
                      className="flex-1 px-4 py-2 text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Accept Request
                    </button>
                    <button
                      onClick={() => handleAction(selectedRequest.id, 'reject')}
                      className="flex-1 px-4 py-2 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Reject Request
                    </button>
                  </>
                )}
                
                {selectedRequest.status === 'approved' && (
                  <button className="flex-1 px-4 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg">
                    Start Writing LoR
                  </button>
                )}
                
                {selectedRequest.status === 'in-progress' && (
                  <button
                    onClick={() => handleAction(selectedRequest.id, 'complete')}
                    className="flex-1 px-4 py-2 text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    Mark as Completed
                  </button>
                )}
                
                {(selectedRequest.status === 'completed' || selectedRequest.status === 'rejected') && (
                  <div className="flex-1 px-4 py-2 text-center text-gray-500 bg-gray-50 border border-gray-200 rounded-lg">
                    {selectedRequest.status === 'completed' ? 'LoR Completed' : 'Request Rejected'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};