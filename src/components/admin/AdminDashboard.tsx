import React from 'react';
import { 
  Users, 
  FileText, 
  Calendar, 
  BarChart3, 
  Shield, 
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserPlus,
  Upload
} from 'lucide-react';

interface AdminDashboardProps {
  onViewChange: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewChange }) => {
  const stats = [
    { label: 'Total Users', value: '1,247', change: '+12% this month', icon: Users, color: 'blue' },
    { label: 'Active Requests', value: '89', change: '+5% this week', icon: FileText, color: 'green' },
    { label: 'Scheduled Meetings', value: '156', change: '+8% this week', icon: Calendar, color: 'purple' },
    { label: 'System Uptime', value: '99.9%', change: 'Last 30 days', icon: Shield, color: 'emerald' },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New faculty member Dr. Sarah Wilson registered',
      time: '2 hours ago',
      status: 'info'
    },
    {
      id: 2,
      type: 'system_alert',
      message: 'High volume of LoR requests detected',
      time: '4 hours ago',
      status: 'warning'
    },
    {
      id: 3,
      type: 'completion',
      message: '25 LoRs completed today',
      time: '6 hours ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'maintenance',
      message: 'Scheduled maintenance completed',
      time: '1 day ago',
      status: 'info'
    }
  ];

  const systemMetrics = [
    { label: 'Database Performance', value: '98%', status: 'good' },
    { label: 'API Response Time', value: '120ms', status: 'good' },
    { label: 'Storage Usage', value: '67%', status: 'warning' },
    { label: 'Active Sessions', value: '234', status: 'good' }
  ];

  const quickActions = [
    { 
      icon: UserPlus, 
      label: 'Add Faculty', 
      description: 'Add new faculty members',
      action: () => onViewChange('users'),
      color: 'blue'
    },
    { 
      icon: Upload, 
      label: 'Upload Students', 
      description: 'Bulk upload student data',
      action: () => onViewChange('users'),
      color: 'green'
    },
    { 
      icon: FileText, 
      label: 'View All Requests', 
      description: 'Monitor all LoR requests',
      action: () => onViewChange('all-requests'),
      color: 'purple'
    },
    { 
      icon: BarChart3, 
      label: 'System Analytics', 
      description: 'View detailed analytics',
      action: () => onViewChange('system-analytics'),
      color: 'orange'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getMetricStatus = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-medium mb-2">System Administration</h2>
          <p className="text-indigo-100 mb-4 md:mb-6 text-sm md:text-base">
            Monitor and manage the LoR platform. Current system status: All systems operational.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button 
              onClick={() => onViewChange('users')}
              className="bg-white text-indigo-600 px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors text-sm md:text-base"
            >
              Manage Users
            </button>
            <button 
              onClick={() => onViewChange('system-analytics')}
              className="border border-white text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition-colors text-sm md:text-base"
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
                <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                  <Icon className={`h-4 w-4 md:h-5 md:w-5 text-${stat.color}-600`} />
                </div>
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
              </div>
              <div className="text-xl md:text-2xl font-medium text-gray-900 mb-1 md:mb-2">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
              <div className="text-xs md:text-sm text-green-600 mt-1">{stat.change}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent System Activity</h3>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={() => onViewChange('system-logs')}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                View all activity →
              </button>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">System Metrics</h3>
          </div>
          <div className="p-4 md:p-6">
            <div className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{metric.label}</h4>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${getMetricStatus(metric.status)}`}>
                      {metric.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                onClick={() => onViewChange('system-monitoring')}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
              >
                View detailed metrics →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center space-y-3 p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-center"
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