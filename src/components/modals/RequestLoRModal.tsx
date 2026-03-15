import React, { useState } from 'react';
import { X, Calendar, Building, Target, FileText, Upload, AlertTriangle } from 'lucide-react';

interface RequestLoRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const RequestLoRModal: React.FC<RequestLoRModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    faculty_id: '',
    institute_company: '',
    purpose: '',
    deadline: '',
    priority: 'medium',
    additional_info: ''
  });

  const [documents, setDocuments] = useState<File[]>([]);

  const faculty = [
    { id: '1', name: 'Dr. Kate Morrison', department: 'Information Technology' },
    { id: '2', name: 'Dr. Aliah Lane', department: 'Computer Science' },
    { id: '3', name: 'Dr. Andi Lane', department: 'AIDS' },
    { id: '4', name: 'Dr. Drew Cano', department: 'Cybersecurity' },
    { id: '5', name: 'Dr. Koray Okumus', department: 'AI-ML' }
  ];

  const purposes = [
    { value: 'phd', label: 'PhD Application' },
    { value: 'masters', label: 'Masters Program' },
    { value: 'internship', label: 'Research Internship' },
    { value: 'job', label: 'Job Application' },
    { value: 'research', label: 'Research Position' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'high', label: 'High Priority', description: 'Urgent deadline (within 2 weeks)', color: 'red' },
    { value: 'medium', label: 'Medium Priority', description: 'Standard timeline (2-4 weeks)', color: 'yellow' },
    { value: 'low', label: 'Low Priority', description: 'Flexible deadline (1+ months)', color: 'green' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find the selected faculty member to get their full name
    const selectedFaculty = faculty.find(f => f.id === formData.faculty_id);
    
    // Submit with the actual faculty name instead of just the ID
    const submissionData = {
      ...formData,
      faculty_name: selectedFaculty?.name || '',
      faculty_department: selectedFaculty?.department || '',
      documents
    };
    
    onSubmit(submissionData);
    onClose();
    
    // Reset form
    setFormData({
      faculty_id: '',
      institute_company: '',
      purpose: '',
      deadline: '',
      priority: 'medium',
      additional_info: ''
    });
    setDocuments([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments([...documents, ...Array.from(e.target.files)]);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-300 bg-red-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      case 'low':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityIconColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Request Letter of Recommendation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Professor Selection */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Target className="h-4 w-4" />
              <span>Professor</span>
            </label>
            <select
              value={formData.faculty_id}
              onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select a professor</option>
              {faculty.map((prof) => (
                <option key={prof.id} value={prof.id}>
                  {prof.name} - {prof.department}
                </option>
              ))}
            </select>
          </div>

          {/* Institute/Company */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Building className="h-4 w-4" />
              <span>Institute/Company</span>
            </label>
            <input
              type="text"
              value={formData.institute_company}
              onChange={(e) => setFormData({ ...formData, institute_company: e.target.value })}
              placeholder="e.g., MIT, Google, Stanford University"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Purpose */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4" />
              <span>Purpose</span>
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
              <option value="">Select purpose</option>
              {purposes.map((purpose) => (
                <option key={purpose.value} value={purpose.value}>
                  {purpose.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <AlertTriangle className="h-4 w-4" />
              <span>Priority Level</span>
            </label>
            <div className="space-y-3">
              {priorities.map((priority) => (
                <label
                  key={priority.value}
                  className={`flex items-start space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.priority === priority.value
                      ? getPriorityColor(priority.value)
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className={`h-4 w-4 ${getPriorityIconColor(priority.value)}`} />
                      <span className="font-medium text-gray-900">{priority.label}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{priority.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Deadline</span>
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information
            </label>
            <textarea
              value={formData.additional_info}
              onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
              placeholder="Any specific requirements or additional information..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Upload className="h-4 w-4" />
              <span>Supporting Documents</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Drag and drop your files here, or <span className="text-purple-600">browse</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, DOC, DOCX (Max 10MB each)
                </p>
              </label>
            </div>
            
            {documents.length > 0 && (
              <div className="mt-4 space-y-2">
                {documents.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setDocuments(documents.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};