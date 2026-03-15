import React, { useState } from 'react';
import { Upload, Eye, Download, Trash2, FileText, CheckCircle, Search, SlidersHorizontal, Calendar, Building, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Document {
  id: string;
  name: string;
  type: 'resume' | 'transcript' | 'sop' | 'lor' | 'other';
  size: string;
  uploadedAt: string;
  status: 'uploaded' | 'verified' | 'rejected';
  university: string;
  deadline: string;
  applicationType: string;
  notes?: string;
}

interface Faculty {
  id: string;
  name: string;
  avatar: string;
  department: string;
  documentsCount: number;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  university: string;
  purpose: string;
  documentsCount: number;
}

export const DocumentVault: React.FC = () => {
  const { user } = useAuth();
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const faculty: Faculty[] = [
    {
      id: '1',
      name: 'Dr. Kate Morrison',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      department: 'Information Technology',
      documentsCount: 12
    },
    {
      id: '2',
      name: 'Dr. Aliah Lane',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      department: 'Computer Science',
      documentsCount: 8
    },
    {
      id: '3',
      name: 'Dr. Andi Lane',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      department: 'AIDS',
      documentsCount: 5
    }
  ];

  const students: Student[] = [
    {
      id: '1',
      name: 'Durva Badekar',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      university: 'MIT',
      purpose: 'PhD Application',
      documentsCount: 4
    },
    {
      id: '2',
      name: 'John Smith',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      university: 'Stanford',
      purpose: 'MS Application',
      documentsCount: 3
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      university: 'Harvard',
      purpose: 'Job Application',
      documentsCount: 2
    }
  ];

  const documents: Document[] = [
    {
      id: '1',
      name: 'LOR_MIT_PhD_Signed.pdf',
      type: 'lor',
      size: '2.1 MB',
      uploadedAt: '2024-01-28',
      status: 'verified',
      university: 'MIT',
      deadline: '2024-02-15',
      applicationType: 'PhD Application',
      notes: 'Final signed version for PhD application'
    },
    {
      id: '2',
      name: 'Resume_Updated_2024.pdf',
      type: 'resume',
      size: '1.8 MB',
      uploadedAt: '2024-01-25',
      status: 'verified',
      university: 'Stanford',
      deadline: '2024-02-20',
      applicationType: 'MS Application'
    },
    {
      id: '3',
      name: 'Transcript_Fall2023.pdf',
      type: 'transcript',
      size: '3.2 MB',
      uploadedAt: '2024-01-22',
      status: 'verified',
      university: 'Harvard',
      deadline: '2024-02-10',
      applicationType: 'Job Application'
    },
    {
      id: '4',
      name: 'SOP_Research_Focus.pdf',
      type: 'sop',
      size: '1.5 MB',
      uploadedAt: '2024-01-20',
      status: 'uploaded',
      university: 'CMU',
      deadline: '2024-02-25',
      applicationType: 'PhD Application'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      default:
        return <Upload className="h-4 w-4 text-yellow-600" />;
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleBack = () => {
    if (user?.role === 'student') {
      setSelectedFaculty(null);
    } else {
      setSelectedStudent(null);
    }
  };

  // Student view: Select Faculty first
  if (user?.role === 'student' && !selectedFaculty) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Faculty to View Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {faculty.map((facultyMember) => (
              <div
                key={facultyMember.id}
                onClick={() => setSelectedFaculty(facultyMember)}
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Documents</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {facultyMember.documentsCount}
                  </span>
                </div>
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
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Student to View Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
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
                  <span className="text-sm text-gray-600">Documents</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {student.documentsCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Document View (after selection)
  const currentPerson = user?.role === 'student' ? selectedFaculty : selectedStudent;

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
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-purple-50 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
        >
          <option value="all">All Types</option>
          <option value="lor">Letters of Recommendation</option>
          <option value="resume">Resume/CV</option>
          <option value="transcript">Transcripts</option>
          <option value="sop">Statement of Purpose</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Upload Area - Only for Students */}
      {user?.role === 'student' && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Documents</h3>
          <p className="text-gray-600 mb-4">
            Upload signed LoRs and supporting documents for {currentPerson?.name}
          </p>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            Choose Files
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: PDF, DOC, DOCX (Max 10MB each)
          </p>
        </div>
      )}

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Document</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">University</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Deadline</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.name}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{doc.size}</span>
                          <span>Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{doc.university}</div>
                      <div className="text-sm text-gray-600">{doc.applicationType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {doc.type === 'lor' ? 'LoR' : doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeadlineColor(doc.deadline)}`}>
                      {new Date(doc.deadline).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(doc.status)}
                      <span className={`text-sm font-medium ${getStatusColor(doc.status).split(' ')[0]}`}>
                        {doc.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      {user?.role === 'student' && (
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
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

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600">
              {user?.role === 'student' 
                ? 'Upload your first document to get started'
                : 'No documents have been uploaded yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Document Metadata Form - Only for Students */}
      {user?.role === 'student' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Document Metadata</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">University Name</label>
              <input
                type="text"
                placeholder="e.g., MIT, Stanford"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Submission Deadline</label>
              <input
                type="date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Application Type</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>PhD Application</option>
                <option>Masters Application</option>
                <option>Job Application</option>
                <option>Research Internship</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>Letter of Recommendation</option>
                <option>Resume/CV</option>
                <option>Transcript</option>
                <option>Statement of Purpose</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              placeholder="Any additional notes about this document..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Save Metadata
            </button>
          </div>
        </div>
      )}
    </div>
  );
};