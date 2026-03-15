import React, { useState } from 'react';
import { X, Calendar, Clock, Users, FileText, AlertTriangle, Video, MapPin } from 'lucide-react';

interface MeetingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  facultyName?: string;
}

export const MeetingRequestModal: React.FC<MeetingRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  facultyName 
}) => {
  const [formData, setFormData] = useState({
    faculty_id: '',
    university_count: 1,
    target_universities: '',
    purpose: '',
    preferred_slots: [] as string[],
    additional_notes: '',
    meeting_mode: 'online'
  });

  const faculty = [
    { id: '1', name: 'Dr. Kate Morrison', department: 'Information Technology' },
    { id: '2', name: 'Dr. Aliah Lane', department: 'Computer Science' },
    { id: '3', name: 'Dr. Andi Lane', department: 'AIDS' },
    { id: '4', name: 'Dr. Drew Cano', department: 'Cybersecurity' },
    { id: '5', name: 'Dr. Koray Okumus', department: 'AI-ML' }
  ];

  const purposes = [
    { value: 'higher_studies', label: 'Higher Studies (PhD/Masters)' },
    { value: 'internship', label: 'Research Internship' },
    { value: 'job', label: 'Job Application' },
    { value: 'research', label: 'Research Position' },
    { value: 'other', label: 'Other' }
  ];

  const timeSlots = [
    { day: 'Monday', slots: ['9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'] },
    { day: 'Tuesday', slots: ['10:00 AM', '11:00 AM', '3:00 PM'] },
    { day: 'Wednesday', slots: ['9:00 AM', '1:00 PM', '4:00 PM'] },
    { day: 'Thursday', slots: ['10:00 AM', '2:00 PM', '3:00 PM'] },
    { day: 'Friday', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.preferred_slots.length < 3) {
      alert('Please select at least 3 preferred time slots');
      return;
    }
    
    const selectedFaculty = faculty.find(f => f.id === formData.faculty_id);
    
    const submissionData = {
      ...formData,
      faculty_name: selectedFaculty?.name || facultyName || '',
      faculty_department: selectedFaculty?.department || '',
      status: 'requested',
      submitted_date: new Date().toISOString()
    };
    
    onSubmit(submissionData);
    onClose();
    
    // Reset form
    setFormData({
      faculty_id: '',
      university_count: 1,
      target_universities: '',
      purpose: '',
      preferred_slots: [],
      additional_notes: '',
      meeting_mode: 'online'
    });
  };

  const handleSlotToggle = (day: string, slot: string) => {
    const slotKey = `${day} - ${slot}`;
    setFormData(prev => ({
      ...prev,
      preferred_slots: prev.preferred_slots.includes(slotKey)
        ? prev.preferred_slots.filter(s => s !== slotKey)
        : [...prev.preferred_slots, slotKey]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Request Meeting</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Faculty Selection */}
          {!facultyName && (
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Users className="h-4 w-4" />
                <span>Faculty Member</span>
              </label>
              <select
                value={formData.faculty_id}
                onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="">Select faculty member</option>
                {faculty.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.name} - {prof.department}
                  </option>
                ))}
              </select>
            </div>
          )}

          {facultyName && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700">
                <strong>Meeting with:</strong> {facultyName}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* University Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Universities (LoR Count)
              </label>
              <select
                value={formData.university_count}
                onChange={(e) => setFormData({ ...formData, university_count: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'University' : 'Universities'}</option>
                ))}
              </select>
            </div>

            {/* Purpose */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4" />
                <span>LoR Purpose</span>
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
          </div>

          {/* Target Universities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target University Names (Optional)
            </label>
            <textarea
              value={formData.target_universities}
              onChange={(e) => setFormData({ ...formData, target_universities: e.target.value })}
              placeholder="e.g., MIT, Stanford, Harvard, CMU..."
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Meeting Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Meeting Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'online', label: 'Online', icon: Video, color: 'blue' },
                { value: 'offline', label: 'Offline', icon: MapPin, color: 'gray' }
              ].map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, meeting_mode: mode.value })}
                    className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                      formData.meeting_mode === mode.value
                        ? `border-${mode.color}-500 bg-${mode.color}-50 text-${mode.color}-700`
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Time Slots */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
              <Clock className="h-4 w-4" />
              <span>Preferred Time Slots</span>
              <span className="text-xs text-gray-500">(Select at least 3 options)</span>
            </label>
            
            <div className="space-y-4">
              {timeSlots.map((daySlots) => (
                <div key={daySlots.day} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">{daySlots.day}</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {daySlots.slots.map((slot) => {
                      const slotKey = `${daySlots.day} - ${slot}`;
                      const isSelected = formData.preferred_slots.includes(slotKey);
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSlotToggle(daySlots.day, slot)}
                          className={`p-2 text-sm rounded border transition-colors ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            
            {formData.preferred_slots.length > 0 && (
              <div className="mt-3 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>Selected slots ({formData.preferred_slots.length}):</strong> {formData.preferred_slots.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.additional_notes}
              onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
              placeholder="Any specific topics you'd like to discuss or additional information..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
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
              Send Meeting Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};