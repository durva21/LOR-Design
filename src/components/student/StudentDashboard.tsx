import React from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight,
  TrendingUp,
  Users,
  BookOpen,
  FolderOpen,
  MessageSquare
} from 'lucide-react';

interface StudentDashboardProps {
  onViewChange: (view: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onViewChange }) => {
  const stats = [
    { label: 'Total Requests', value: '7', change: '+2 this month' },
    { label: 'Completed', value: '4', change: '57% completion rate' },
    { label: 'Pending', value: '2', change: 'Awaiting response' },
    { label: 'Meetings Scheduled', value: '3', change: 'This week' },
  ];

  const recentLORs = [
    { 
      id: 1, 
      university: 'MIT', 
      purpose: 'PhD Application', 
      status: 'completed', 
      date: '2024-01-15',
      faculty: 'Dr. Kate Morrison'
    },
    { 
      id: 2, 
      university: 'Stanford', 
      purpose: 'Research Internship', 
      status: 'pending', 
      date: '2024-01-20',
      faculty: 'Dr. Aliah Lane'
    },
    { 
      id: 3, 
      university: 'Harvard', 
      purpose: 'Masters Program', 
      status: 'draft', 
      date: '2024-01-25',
      faculty: 'Dr. Andi Lane'
    },
    { 
      id: 4, 
      university: 'Caltech', 
      purpose: 'PhD Application', 
      status: 'completed', 
      date: '2024-01-28',
      faculty: 'Dr. Drew Cano'
    },
  ];

  const upcomingMeetings = [
    {
      id: 1,
      faculty: 'Dr. Kate Morrison',
      time: '10:00 AM IST',
      purpose: 'Faculty LoR Approval Sync',
      type: 'online'
    },
    {
      id: 2,
      faculty: 'Dr. Aliah Lane',
      time: '12:00 PM IST',
      purpose: 'LoR Draft Finalization Call',
      type: 'offline'
    },
    {
      id: 3,
      faculty: 'Dr. Andi Lane',
      time: '10:00 AM IST',
      purpose: 'Pending LoR Follow-up',
      type: 'online'
    }
  ];

  const quickActions = [
    { 
      icon: FileText, 
      label: 'Request LoR', 
      description: 'Start a new letter request',
      action: () => onViewChange('request')
    },
    { 
      icon: Calendar, 
      label: 'Schedule Meeting', 
      description: 'Book time with faculty',
      action: () => onViewChange('meetings')
    },
    { 
      icon: BookOpen, 
      label: 'Edit Drafts', 
      description: 'Collaborate on drafts',
      action: () => onViewChange('drafts')
    },
    { 
      icon: FolderOpen, 
      label: 'Documents', 
      description: 'View document vault',
      action: () => onViewChange('documents')
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLORClick = (lor: any) => {
    if (lor.status === 'draft') {
      onViewChange('drafts');
    } else {
      onViewChange('documents');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome Back, Durva Badekar</h2>
          <p className="text-purple-100 mb-4 md:mb-6 text-sm md:text-base">
            You have 2 pending requests and 3 upcoming meetings this week.
          </p>
          <button 
            onClick={() => onViewChange('request')}
            className="bg-white text-purple-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors inline-flex items-center space-x-2 text-sm md:text-base"
          >
            <span>Request a new LoR</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute right-4 md:right-8 top-4 opacity-20">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-xs md:text-sm font-medium text-gray-600">{stat.label}</h3>
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{stat.value}</div>
            <div className="text-xs md:text-sm text-gray-500">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent LoRs */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent LoRs</h3>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {recentLORs.map((lor) => (
                <div 
                  key={lor.id} 
                  onClick={() => handleLORClick(lor)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      lor.status === 'completed' ? 'bg-green-500' :
                      lor.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{lor.university}</h4>
                      <p className="text-sm text-gray-600">{lor.purpose}</p>
                      <p className="text-xs text-gray-500">{lor.faculty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lor.status)}`}>
                      {lor.status}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{new Date(lor.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Meetings (3)</h3>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {upcomingMeetings.map((meeting, index) => (
                <div 
                  key={index} 
                  onClick={() => onViewChange('meetings')}
                  className="border-l-4 border-purple-500 pl-4 py-2 hover:bg-gray-50 rounded-r cursor-pointer transition-colors"
                >
                  <h4 className="font-medium text-gray-900">{meeting.faculty}</h4>
                  <p className="text-sm text-gray-600 mb-1">{meeting.purpose}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-600 font-medium">{meeting.time}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      meeting.type === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {meeting.type}
                    </span>
                  </div>
                </div>
              ))}
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
                className="flex flex-col items-center space-y-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-center"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-purple-600" />
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