import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload, Download, Search, SlidersHorizontal, Eye, EyeOff, Users, UserPlus, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  is_active: boolean;
  created_at: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  branch: string;
  year: string;
  is_active: boolean;
  created_at: string;
}

export const UserManagement: React.FC = () => {
  const { users, refreshUsers } = useAuth();
  const [activeTab, setActiveTab] = useState<'faculty' | 'students'>('faculty');
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    password: ''
  });

  const [facultyList, setFacultyList] = useState<Faculty[]>([
    {
      id: '2',
      name: 'Dr. Kate Morrison',
      email: 'kate.morrison@example.com',
      department: 'Information Technology',
      designation: 'HOD - IT',
      is_active: true,
      created_at: '2024-01-15'
    },
    {
      id: '4',
      name: 'Dr. Aliah Lane',
      email: 'aliah.lane@example.com',
      department: 'Computer Science',
      designation: 'Professor',
      is_active: true,
      created_at: '2024-01-16'
    },
    {
      id: '5',
      name: 'Dr. Andi Lane',
      email: 'andi.lane@example.com',
      department: 'AIDS',
      designation: 'Associate Professor',
      is_active: true,
      created_at: '2024-01-17'
    }
  ]);

  const [studentList, setStudentList] = useState<Student[]>([
    {
      id: '1',
      name: 'Durva Badekar',
      email: 'durva.badekar@example.com',
      branch: 'Computer Science',
      year: '2024',
      is_active: true,
      created_at: '2024-01-10'
    }
  ]);

  const departments = [
    'Information Technology',
    'Computer Science',
    'AIDS',
    'Cybersecurity',
    'AI-ML',
    'Electronics',
    'Mechanical',
    'Civil'
  ];

  const designations = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'HOD',
    'Dean',
    'Principal'
  ];

  const handleAddFaculty = () => {
    if (!facultyForm.name || !facultyForm.email || !facultyForm.department || !facultyForm.designation) {
      alert('Please fill all required fields');
      return;
    }

    const newFaculty: Faculty = {
      id: uuidv4(),
      name: facultyForm.name,
      email: facultyForm.email,
      department: facultyForm.department,
      designation: facultyForm.designation,
      is_active: true,
      created_at: new Date().toISOString().split('T')[0]
    };

    setFacultyList([...facultyList, newFaculty]);
    setFacultyForm({ name: '', email: '', department: '', designation: '', password: '' });
    setShowAddFacultyModal(false);
    console.log('Faculty added:', newFaculty);
  };

  const handleEditFaculty = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFacultyForm({
      name: faculty.name,
      email: faculty.email,
      department: faculty.department,
      designation: faculty.designation,
      password: ''
    });
    setShowAddFacultyModal(true);
  };

  const handleUpdateFaculty = () => {
    if (!editingFaculty) return;

    setFacultyList(facultyList.map(f => 
      f.id === editingFaculty.id 
        ? { ...f, ...facultyForm }
        : f
    ));
    setEditingFaculty(null);
    setFacultyForm({ name: '', email: '', department: '', designation: '', password: '' });
    setShowAddFacultyModal(false);
    console.log('Faculty updated:', editingFaculty.id);
  };

  const handleToggleFacultyStatus = (id: string) => {
    setFacultyList(facultyList.map(f => 
      f.id === id ? { ...f, is_active: !f.is_active } : f
    ));
  };

  const handleToggleStudentStatus = (id: string) => {
    setStudentList(studentList.map(s => 
      s.id === id ? { ...s, is_active: !s.is_active } : s
    ));
  };

  const handleResetPassword = (id: string) => {
    console.log('Reset password for user:', id);
    alert('Password reset email sent to user');
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',').map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || '';
            return obj;
          }, {} as any);
        });
        setCsvData(data);
      };
      reader.readAsText(file);
    }
  };

  const handleBulkUpload = () => {
    const newStudents = csvData.map(row => ({
      id: uuidv4(),
      name: row.Name || row.name,
      email: row.Email || row.email,
      branch: row.Branch || row.branch,
      year: row.Year || row.year,
      is_active: true,
      created_at: new Date().toISOString().split('T')[0]
    }));

    setStudentList([...studentList, ...newStudents]);
    setCsvFile(null);
    setCsvData([]);
    setShowBulkUploadModal(false);
    console.log('Bulk upload completed:', newStudents.length, 'students added');
  };

  const downloadSampleCsv = () => {
    const csvContent = "Name,Email,Branch,Year\nJohn Doe,john.doe@example.com,Computer Science,2024\nJane Smith,jane.smith@example.com,Information Technology,2025";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_upload_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredFaculty = facultyList.filter(faculty =>
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = studentList.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage faculty and student access to the system</p>
        </div>
        <div className="flex items-center space-x-3">
          {activeTab === 'faculty' && (
            <button
              onClick={() => setShowAddFacultyModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add Faculty</span>
            </button>
          )}
          {activeTab === 'students' && (
            <button
              onClick={() => setShowBulkUploadModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Bulk Upload</span>
            </button>
          )}
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
            placeholder="Search users..."
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
            { key: 'faculty', label: 'Faculty', count: facultyList.length, icon: Users },
            { key: 'students', label: 'Students', count: studentList.length, icon: Users }
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
                <span className={`py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.key
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                  {activeTab === 'faculty' ? 'Department' : 'Branch'}
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">
                  {activeTab === 'faculty' ? 'Designation' : 'Year'}
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {activeTab === 'faculty' && filteredFaculty.map((faculty) => (
                <tr key={faculty.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {faculty.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{faculty.name}</div>
                        <div className="text-sm text-gray-500">Added {new Date(faculty.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{faculty.email}</td>
                  <td className="px-6 py-4 text-gray-900">{faculty.department}</td>
                  <td className="px-6 py-4 text-gray-900">{faculty.designation}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleFacultyStatus(faculty.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        faculty.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {faculty.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditFaculty(faculty)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(faculty.id)}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        title="Reset Password"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {activeTab === 'students' && filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">Added {new Date(student.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">{student.email}</td>
                  <td className="px-6 py-4 text-gray-900">{student.branch}</td>
                  <td className="px-6 py-4 text-gray-900">{student.year}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStudentStatus(student.id)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {student.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleResetPassword(student.id)}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                        title="Reset Password"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {((activeTab === 'faculty' && filteredFaculty.length === 0) || 
          (activeTab === 'students' && filteredStudents.length === 0)) && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} found
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'faculty' 
                ? 'Add faculty members to get started'
                : 'Upload students to get started'
              }
            </p>
            {activeTab === 'faculty' && (
              <button
                onClick={() => setShowAddFacultyModal(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Faculty</span>
              </button>
            )}
            {activeTab === 'students' && (
              <button
                onClick={() => setShowBulkUploadModal(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Students</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Faculty Modal */}
      {showAddFacultyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
              </h3>
              <button
                onClick={() => {
                  setShowAddFacultyModal(false);
                  setEditingFaculty(null);
                  setFacultyForm({ name: '', email: '', department: '', designation: '', password: '' });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={facultyForm.name}
                  onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Dr. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={facultyForm.email}
                  onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john.doe@university.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  value={facultyForm.department}
                  onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
                <select
                  value={facultyForm.designation}
                  onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Designation</option>
                  {designations.map((designation) => (
                    <option key={designation} value={designation}>{designation}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {editingFaculty ? 'New Password (leave blank to keep current)' : 'Password *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={facultyForm.password}
                    onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => {
                  setShowAddFacultyModal(false);
                  setEditingFaculty(null);
                  setFacultyForm({ name: '', email: '', department: '', designation: '', password: '' });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingFaculty ? handleUpdateFaculty : handleAddFaculty}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingFaculty ? 'Update Faculty' : 'Add Faculty'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Bulk Upload Students</h3>
              <button
                onClick={() => {
                  setShowBulkUploadModal(false);
                  setCsvFile(null);
                  setCsvData([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">CSV Format Requirements</h4>
                <p className="text-sm text-blue-800 mb-3">
                  Your CSV file should contain the following columns: Name, Email, Branch, Year
                </p>
                <button
                  onClick={downloadSampleCsv}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Sample CSV</span>
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <FileSpreadsheet className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {csvFile ? csvFile.name : 'Click to upload CSV file or drag and drop'}
                    </p>
                  </label>
                </div>
              </div>

              {csvData.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Preview ({csvData.length} students)</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto max-h-64">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-4 py-2 font-medium text-gray-600">Name</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-600">Email</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-600">Branch</th>
                            <th className="text-left px-4 py-2 font-medium text-gray-600">Year</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {csvData.slice(0, 10).map((row, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2">{row.Name || row.name}</td>
                              <td className="px-4 py-2">{row.Email || row.email}</td>
                              <td className="px-4 py-2">{row.Branch || row.branch}</td>
                              <td className="px-4 py-2">{row.Year || row.year}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {csvData.length > 10 && (
                      <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600">
                        ... and {csvData.length - 10} more students
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => {
                  setShowBulkUploadModal(false);
                  setCsvFile(null);
                  setCsvData([]);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpload}
                disabled={csvData.length === 0}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload {csvData.length} Students
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};