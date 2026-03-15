import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  FileText, 
  Calendar, 
  Users, 
  BarChart3, 
  LogOut,
  MessageSquare,
  BookOpen,
  FolderOpen,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  active?: boolean;
}

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isCollapsed, onToggleCollapse }) => {
  const { logout } = useAuth();

  const studentItems: SidebarItem[] = [
    { icon: Home, label: 'Dashboard', path: 'dashboard' },
    { icon: FileText, label: 'Request LoR', path: 'request' },
    { icon: Calendar, label: 'Meetings', path: 'meetings' },
    { icon: BookOpen, label: 'LoR Workspace', path: 'drafts' },
    { icon: FolderOpen, label: 'Document Vault', path: 'documents' },
    { icon: MessageSquare, label: 'Messages', path: 'messages' },
  ];

  const facultyItems: SidebarItem[] = [
    { icon: Home, label: 'Dashboard', path: 'dashboard' },
    { icon: FileText, label: 'Requests', path: 'requests' },
    { icon: Calendar, label: 'Meetings', path: 'meetings' },
    { icon: BookOpen, label: 'LoR Workspace', path: 'workspace' },
    { icon: FolderOpen, label: 'Document Vault', path: 'documents' },
    { icon: BarChart3, label: 'Analytics', path: 'analytics' },
  ];

  const adminItems: SidebarItem[] = [
    { icon: Home, label: 'Dashboard', path: 'dashboard' },
    { icon: Users, label: 'User Management', path: 'users' },
    { icon: FileText, label: 'All Requests', path: 'all-requests' },
    { icon: Calendar, label: 'All Meetings', path: 'all-meetings' },
    { icon: BarChart3, label: 'System Analytics', path: 'system-analytics' },
    { icon: Shield, label: 'Security', path: 'security' },
  ];

  const { user } = useAuth();

  const getItems = () => {
    switch (user?.role) {
      case 'student':
        return studentItems;
      case 'faculty':
        return facultyItems;
      case 'admin':
        return adminItems;
      default:
        return studentItems;
    }
  };

  const items = getItems();

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-medium text-sm">L</span>
            </div>
            <div>
              <h1 className="text-lg font-medium text-gray-900">LoR Manager</h1>
              <p className="text-xs text-gray-500">Letter of Recommendation</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-medium text-sm">L</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => onViewChange(item.path)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button 
          onClick={onToggleCollapse}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors`}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
        
        <button
          onClick={logout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors`}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};