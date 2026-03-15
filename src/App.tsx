import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { StudentDashboard } from './components/student/StudentDashboard';
import { RequestLoR } from './components/student/RequestLoR';
import { MeetingScheduler } from './components/student/MeetingScheduler';
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { RequestManagement } from './components/faculty/RequestManagement';
import { FacultyMeetingScheduler } from './components/faculty/FacultyMeetingScheduler';
import { LoRComposer } from './components/workspace/LoRComposer';
import { DocumentVault } from './components/documents/DocumentVault';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserManagement } from './components/admin/UserManagement';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return user?.role === 'student' ? 'Student Dashboard' : 
               user?.role === 'faculty' ? 'Faculty Dashboard' : 'Admin Dashboard';
      case 'request':
        return 'Request Letter of Recommendation';
      case 'requests':
        return 'Manage LoR Requests';
      case 'meetings':
        return 'Meeting Scheduler';
      case 'drafts':
        return 'LoR Workspace';
      case 'workspace':
        return 'LoR Workspace';
      case 'documents':
        return 'Document Vault';
      case 'analytics':
        return 'Analytics Dashboard';
      case 'messages':
        return 'Messages';
      case 'users':
        return 'User Management';
      case 'all-requests':
        return 'All LoR Requests';
      case 'all-meetings':
        return 'All Meetings';
      case 'system-analytics':
        return 'System Analytics';
      case 'security':
        return 'Security Settings';
      default:
        return 'Dashboard';
    }
  };

  const renderContent = () => {
    if (user?.role === 'student') {
      switch (activeView) {
        case 'dashboard':
          return <StudentDashboard onViewChange={setActiveView} />;
        case 'request':
          return <RequestLoR />;
        case 'meetings':
          return <MeetingScheduler />;
        case 'drafts':
          return <LoRComposer />;
        case 'documents':
          return <DocumentVault />;
        case 'messages':
          return (
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
              <p className="text-gray-600">Chat system coming soon...</p>
            </div>
          );
        default:
          return <StudentDashboard onViewChange={setActiveView} />;
      }
    } else if (user?.role === 'faculty') {
      switch (activeView) {
        case 'dashboard':
          return <FacultyDashboard onViewChange={setActiveView} />;
        case 'requests':
          return <RequestManagement />;
        case 'meetings':
          return <FacultyMeetingScheduler />;
        case 'workspace':
          return <LoRComposer />;
        case 'documents':
          return <DocumentVault />;
        case 'analytics':
          return (
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Charts and insights coming soon...</p>
            </div>
          );
        default:
          return <FacultyDashboard onViewChange={setActiveView} />;
      }
    } else if (user?.role === 'admin') {
      switch (activeView) {
        case 'dashboard':
          return <AdminDashboard onViewChange={setActiveView} />;
        case 'users':
          return <UserManagement />;
        case 'all-requests':
          return (
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">All LoR Requests</h3>
              <p className="text-gray-600">System-wide request monitoring coming soon...</p>
            </div>
          );
        case 'all-meetings':
          return (
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Meetings</h3>
              <p className="text-gray-600">System-wide meeting monitoring coming soon...</p>
            </div>
          );
        case 'system-analytics':
          return (
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">System Analytics</h3>
              <p className="text-gray-600">Advanced analytics dashboard coming soon...</p>
            </div>
          );
        case 'security':
          return (
            <div className="p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Security Settings</h3>
              <p className="text-gray-600">Security configuration coming soon...</p>
            </div>
          );
        default:
          return <AdminDashboard onViewChange={setActiveView} />;
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={getPageTitle()} 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;