import React, { useState } from 'react';
import { Save, MessageSquare, Clock, CheckCircle, Eye, Edit3, Users, FileText, ArrowLeft, Send, RotateCcw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Student {
  id: string;
  name: string;
  avatar: string;
  university: string;
  purpose: string;
  status: string;
  deadline: string;
}

interface Faculty {
  id: string;
  name: string;
  avatar: string;
  department: string;
  status: string;
}

interface Draft {
  id: string;
  version: number;
  title: string;
  content: string;
  status: 'draft' | 'review' | 'approved' | 'revision-requested';
  created_at: string;
  comments: Comment[];
  submitted_by: string;
}

interface Comment {
  id: string;
  user: string;
  content: string;
  position?: { start: number; end: number };
  created_at: string;
  resolved: boolean;
  type: 'comment' | 'suggestion' | 'approval';
}

export const LoRComposer: React.FC = () => {
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'versions' | 'comments'>('editor');
  const [content, setContent] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState('');

  const students: Student[] = [
    {
      id: '1',
      name: 'Durva Badekar',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      university: 'MIT',
      purpose: 'PhD Application',
      status: 'in-progress',
      deadline: '2024-02-15'
    },
    {
      id: '2',
      name: 'John Smith',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      university: 'Stanford',
      purpose: 'MS Application',
      status: 'draft',
      deadline: '2024-02-20'
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      university: 'Harvard',
      purpose: 'Job Application',
      status: 'review',
      deadline: '2024-02-10'
    }
  ];

  const faculty: Faculty[] = [
    {
      id: '1',
      name: 'Dr. Kate Morrison',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      department: 'Information Technology',
      status: 'available'
    },
    {
      id: '2',
      name: 'Dr. Aliah Lane',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      department: 'Computer Science',
      status: 'available'
    },
    {
      id: '3',
      name: 'Dr. Andi Lane',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      department: 'AIDS',
      status: 'busy'
    }
  ];

  const drafts: Draft[] = [
    {
      id: '1',
      version: 3,
      title: 'Final Draft',
      content: 'I am writing to provide my strongest recommendation for Durva Badekar for admission to your PhD program in Computer Science. Having worked closely with Durva for the past two years as her research supervisor, I can confidently attest to her exceptional academic abilities, research potential, and personal qualities that make her an ideal candidate for advanced study.\n\nDurva has consistently demonstrated outstanding performance in her coursework, maintaining a GPA of 3.85 while taking on challenging projects. Her research work on machine learning applications has resulted in a publication in IJCAI, showcasing her ability to contribute meaningfully to the field.',
      status: 'review',
      created_at: '2024-01-28T10:30:00Z',
      comments: [
        {
          id: '1',
          user: 'Dr. Kate Morrison',
          content: 'This is a strong opening. Consider adding more specific examples of her research contributions.',
          created_at: '2024-01-28T14:20:00Z',
          resolved: false,
          type: 'suggestion'
        },
        {
          id: '2',
          user: 'Durva Badekar',
          content: 'Should I mention the specific ML algorithms I worked with?',
          created_at: '2024-01-28T15:10:00Z',
          resolved: false,
          type: 'comment'
        }
      ],
      submitted_by: 'student'
    },
    {
      id: '2',
      version: 2,
      title: 'Second Draft',
      content: 'I am pleased to recommend Durva Badekar for your graduate program...',
      status: 'revision-requested',
      created_at: '2024-01-25T14:20:00Z',
      comments: [],
      submitted_by: 'student'
    }
  ];

  const templates = [
    { id: '1', name: 'Academic PhD Template', purpose: 'PhD Application' },
    { id: '2', name: 'Industry Position Template', purpose: 'Job Application' },
    { id: '3', name: 'Research Internship Template', purpose: 'Internship' }
  ];

  const recentActivity = [
    {
      user: 'Alex Chen',
      action: 'submitted a new LoR request',
      target: 'Berkeley',
      time: '2 hours ago'
    },
    {
      user: 'Maria Garcia',
      action: 'has a deadline approaching',
      target: 'CMU',
      time: '5 hours ago'
    },
    {
      user: 'David Kim',
      action: 'uploaded new documents',
      target: 'Caltech',
      time: '1 day ago'
    }
  ];

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    // Load the latest draft for this student
    const latestDraft = drafts.find(d => d.status === 'review' || d.status === 'draft');
    setContent(latestDraft?.content || '');
  };

  const handleFacultySelect = (facultyMember: Faculty) => {
    setSelectedFaculty(facultyMember);
    setContent('');
  };

  const handleSave = () => {
    console.log('Saving draft...', content);
  };

  const handleSubmitForReview = () => {
    console.log('Submitting for review...', content);
    // Create notification for faculty
  };

  const handleApprove = () => {
    console.log('Approving draft...');
  };

  const handleRequestRevision = () => {
    console.log('Requesting revision with comments...');
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  const handleBack = () => {
    if (user?.role === 'student') {
      setSelectedFaculty(null);
    } else {
      setSelectedStudent(null);
    }
  };

  const getDeadlineColor = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (daysLeft <= 3) return 'text-red-600 bg-red-50';
    if (daysLeft <= 7) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  // Student view: Select Faculty first
  if (user?.role === 'student' && !selectedFaculty) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Faculty</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {faculty.map((facultyMember) => (
              <div
                key={facultyMember.id}
                onClick={() => handleFacultySelect(facultyMember)}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={facultyMember.avatar}
                    alt={facultyMember.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{facultyMember.name}</h4>
                    <p className="text-sm text-gray-600">{facultyMember.department}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  facultyMember.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {facultyMember.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Faculty view: Select Student first
  if (user?.role === 'faculty' && !selectedStudent) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Students</option>
              <option>In Progress</option>
              <option>Pending Review</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Student</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                onClick={() => handleStudentSelect(student)}
                className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.university}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{student.purpose}</p>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    student.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    student.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {student.status}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getDeadlineColor(student.deadline)}`}>
                    Due: {new Date(student.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action} for{' '}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Editor View (for both student and faculty after selection)
  const currentPerson = user?.role === 'student' ? selectedFaculty : selectedStudent;
  const currentDraft = drafts[0]; // Latest draft
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-3">
            <img
              src={currentPerson?.avatar}
              alt={currentPerson?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-medium text-gray-900">{currentPerson?.name}</h2>
              <p className="text-gray-600">
                {user?.role === 'student' 
                  ? (currentPerson as Faculty)?.department 
                  : `${(currentPerson as Student)?.university} - ${(currentPerson as Student)?.purpose}`
                }
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {user?.role === 'student' && (
            <button
              onClick={handleSubmitForReview}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>Submit for Review</span>
            </button>
          )}
          
          {user?.role === 'faculty' && currentDraft?.status === 'review' && (
            <>
              <button
                onClick={handleRequestRevision}
                className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Request Changes</span>
              </button>
              <button
                onClick={handleApprove}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Finalize</span>
              </button>
            </>
          )}
          
          <button
            onClick={() => setShowComments(!showComments)}
            className={`p-2 rounded-lg transition-colors ${
              showComments ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {currentDraft && (
        <div className={`p-4 rounded-lg border ${
          currentDraft.status === 'review' ? 'bg-blue-50 border-blue-200' :
          currentDraft.status === 'revision-requested' ? 'bg-orange-50 border-orange-200' :
          currentDraft.status === 'approved' ? 'bg-green-50 border-green-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">
                {currentDraft.status === 'review' && 'Under Review'}
                {currentDraft.status === 'revision-requested' && 'Revision Requested'}
                {currentDraft.status === 'approved' && 'Approved'}
                {currentDraft.status === 'draft' && 'Draft'}
              </h4>
              <p className="text-sm text-gray-600">
                Version {currentDraft.version} • Last updated {new Date(currentDraft.created_at).toLocaleDateString()}
              </p>
            </div>
            {user?.role === 'student' && (currentPerson as Student)?.deadline && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDeadlineColor((currentPerson as Student).deadline)}`}>
                Due: {new Date((currentPerson as Student).deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'editor', label: 'Editor', icon: Edit3 },
            { key: 'versions', label: 'Versions', icon: Clock },
            { key: 'comments', label: 'Comments', icon: MessageSquare, count: currentDraft?.comments.length }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count && tab.count > 0 && (
                  <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'editor' && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Letter Content</h3>
                <div className="flex items-center space-x-2">
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>Use Template</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-6">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Start writing the letter of recommendation..."
                />
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Version History</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {drafts.map((draft) => (
                    <div key={draft.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-600">v{draft.version}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{draft.title}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(draft.created_at).toLocaleDateString()} • Submitted by {draft.submitted_by}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          draft.status === 'approved' ? 'bg-green-100 text-green-800' :
                          draft.status === 'review' ? 'bg-blue-100 text-blue-800' :
                          draft.status === 'revision-requested' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {draft.status === 'revision-requested' ? 'revision requested' : draft.status}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium text-gray-900">Comments & Feedback</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 mb-6">
                  {currentDraft?.comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-600">
                          {comment.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">{comment.user}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            comment.type === 'suggestion' ? 'bg-blue-100 text-blue-800' :
                            comment.type === 'approval' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {comment.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add Comment */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex space-x-3">
                    <img
                      src={user?.avatar || 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment or suggestion..."
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleAddComment}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Add Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Person Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">
              {user?.role === 'student' ? 'Faculty Information' : 'Student Information'}
            </h4>
            <div className="space-y-2 text-sm">
              {user?.role === 'student' ? (
                <>
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 text-gray-900">{(currentPerson as Faculty)?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Department:</span>
                    <span className="ml-2 text-gray-900">{(currentPerson as Faculty)?.department}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 text-gray-900">{(currentPerson as Faculty)?.status}</span>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="text-gray-500">University:</span>
                    <span className="ml-2 text-gray-900">{(currentPerson as Student)?.university}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Purpose:</span>
                    <span className="ml-2 text-gray-900">{(currentPerson as Student)?.purpose}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 text-gray-900">{(currentPerson as Student)?.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Deadline:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getDeadlineColor((currentPerson as Student)?.deadline || '')}`}>
                      {new Date((currentPerson as Student)?.deadline || '').toLocaleDateString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                View Documents
              </button>
              <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                Schedule Meeting
              </button>
              <button className="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};