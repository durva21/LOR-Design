import React from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Users, 
  TrendingUp,
  AlertCircle,
  MessageSquare,
  BarChart3,
  BookOpen
} from 'lucide-react';

interface FacultyDashboardProps {
  onViewChange: (view: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onViewChange }) => {
  const stats = [
    { label: 'Total Requests', value: '24', change: '+6 this month', icon: FileText },
    { label: 'Completed LoRs', value: '18', change: '75% completion rate', icon: CheckCircle },
    { label: 'Pending Reviews', value: '4', change: 'Awaiting action', icon: Clock },
    { label: 'Scheduled Meetings', value: '7', change: 'This week', icon: Calendar },
  ];

  const recentRequests = [
    { 
      id: 1, 
      student: 'Durva Badekar', 
      purpose: 'PhD Application - MIT', 
      status: 'pending', 
      date: '2024-01-28',
      priority: 'high'
    },
    { 
      id: 2, 
      student: 'Ravi Sharma', 
      purpose: 'Research Internship - Google', 
      status: 'approved', 
      date: '2024-01-25',
      priority: 'medium'
    },
    { 
      id: 3, 
      student: 'Priya Patel', 
      purpose: 'Masters Program - Stanford', 
      status: 'in-progress', 
      date: '2024-01-22',
      priority: 'high'
    },
    { 
      id: 4, 
      student: 'Arjun Kumar', 
      purpose: 'Industry Position - Microsoft', 
      status: 'completed', 
      date: '2024-01-20',
      priority: 'low'
    },
  ];

  const upcomingMeetings = [
    {
      id: 1,
      student: 'Durva Badekar',
      time: '10:00 AM',
      purpose: 'LoR Discussion',
      type: 'online'
    },
    {
      id: 2,
      student: 'Sarah Johnson',
      time: '2:00 PM',
      purpose: 'Draft Review',
      type: 'offline'
    },
    {
      id: 3,
      student: 'Michael Chen',
      time: '4:00 PM',
      purpose: 'Final Approval',
      type: 'online'
    }
  ];

  const quickActions = [
    { 
      icon: FileText, 
      label: 'Review Requests', 
      description: 'Check pending LoR requests', 
      color: 'blue',
      action: () => onViewChange('requests')
    },
    { 
      icon: MessageSquare, 
      label: 'Draft Reviews', 
      description: 'Comment on student drafts', 
      color: 'purple',
      action: () => onViewChange('workspace')
    },
    { 
      icon: Calendar, 
      label: 'Schedule Meeting', 
      description: 'Book time with students', 
      color: 'green',
      action: () => onViewChange('meetings')
    },
    { 
      icon: TrendingUp, 
      label: 'View Analytics', 
      description: 'See your LoR insights', 
      color: 'orange',
      action: () => onViewChange('analytics')
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'high') {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const handleRequestClick = (request: any) => {
    if (request.status === 'pending') {
      onViewChange('requests');
    } else if (request.status === 'in-progress') {
      onViewChange('workspace');
    } else {
      onViewChange('documents');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome Back, Dr. Kate Morrison</h2>
          <p className="text-blue-100 mb-4 md:mb-6 text-sm md:text-base">
            You have 4 pending requests and 3 meetings scheduled today.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => onViewChange('requests')}
              className="bg-white text-blue-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm md:text-base"
            >
              Review Requests
            </button>
            <button 
              onClick={() => onViewChange('analytics')}
              className="border border-white text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors text-sm md:text-base"
            >
              View Analytics
            </button>
          </div>
        </div>
        <div className="absolute right-4 md:right-8 top-4 opacity-20">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icon className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                </div>
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
              </div>
              <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
              <div className="text-xs md:text-sm text-green-600 mt-1">{stat.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent LoR Requests</h3>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div 
                  key={request.id} 
                  onClick={() => handleRequestClick(request)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {request.student.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{request.student}</h4>
                        {getPriorityIcon(request.priority)}
                      </div>
                      <p className="text-sm text-gray-600">{request.purpose}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace('-', ' ')}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{new Date(request.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={() => onViewChange('requests')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View all requests →
              </button>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {upcomingMeetings.map((meeting, index) => (
                <div 
                  key={index} 
                  onClick={() => onViewChange('meetings')}
                  className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 rounded-r cursor-pointer transition-colors"
                >
                  <h4 className="font-medium text-gray-900">{meeting.student}</h4>
                  <p className="text-sm text-gray-600 mb-1">{meeting.purpose}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">{meeting.time}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      meeting.type === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {meeting.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={() => onViewChange('meetings')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View full calendar →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center space-y-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
              >
                <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 text-${action.color}-600`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{action.label}</h4>
                  <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};