import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Video, Plus, Trash2 } from 'lucide-react';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  meetingRequest: {
    id: string;
    student: string;
    title: string;
    mode: 'online' | 'offline';
  } | null;
}

interface AlternativeSlot {
  id: string;
  date: string;
  time: string;
  mode: 'online' | 'offline';
  location?: string;
  meetingUrl?: string;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  meetingRequest 
}) => {
  const [alternativeSlots, setAlternativeSlots] = useState<AlternativeSlot[]>([
    {
      id: '1',
      date: '',
      time: '',
      mode: meetingRequest?.mode || 'online',
      location: '',
      meetingUrl: ''
    }
  ]);
  const [rescheduleReason, setRescheduleReason] = useState('');

  const timeOptions = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ];

  const addAlternativeSlot = () => {
    const newSlot: AlternativeSlot = {
      id: Date.now().toString(),
      date: '',
      time: '',
      mode: 'online',
      location: '',
      meetingUrl: ''
    };
    setAlternativeSlots([...alternativeSlots, newSlot]);
  };

  const removeAlternativeSlot = (id: string) => {
    if (alternativeSlots.length > 1) {
      setAlternativeSlots(alternativeSlots.filter(slot => slot.id !== id));
    }
  };

  const updateSlot = (id: string, field: keyof AlternativeSlot, value: string) => {
    setAlternativeSlots(alternativeSlots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all slots have required fields
    const validSlots = alternativeSlots.filter(slot => 
      slot.date && slot.time && 
      (slot.mode === 'online' ? true : slot.location)
    );
    
    if (validSlots.length === 0) {
      alert('Please provide at least one complete alternative time slot');
      return;
    }
    
    const rescheduleData = {
      meetingRequestId: meetingRequest?.id,
      student: meetingRequest?.student,
      alternativeSlots: validSlots,
      reason: rescheduleReason,
      status: 'rescheduled',
      rescheduledBy: 'faculty',
      rescheduledAt: new Date().toISOString()
    };
    
    onSubmit(rescheduleData);
    onClose();
    
    // Reset form
    setAlternativeSlots([{
      id: '1',
      date: '',
      time: '',
      mode: 'online',
      location: '',
      meetingUrl: ''
    }]);
    setRescheduleReason('');
  };

  if (!isOpen || !meetingRequest) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Reschedule Meeting</h2>
            <p className="text-gray-600 mt-1">Provide alternative times for {meetingRequest.student}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Meeting Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-1">Original Meeting Request</h3>
            <p className="text-blue-800">{meetingRequest.title} with {meetingRequest.student}</p>
          </div>

          {/* Reschedule Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Rescheduling (Optional)
            </label>
            <textarea
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
              placeholder="e.g., Schedule conflict, need more time to prepare, etc."
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Alternative Time Slots */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Alternative Time Slots</h3>
              <button
                type="button"
                onClick={addAlternativeSlot}
                className="flex items-center space-x-2 px-3 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Slot</span>
              </button>
            </div>

            <div className="space-y-4">
              {alternativeSlots.map((slot, index) => (
                <div key={slot.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Option {index + 1}</h4>
                    {alternativeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAlternativeSlot(slot.id)}
                        className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>Date</span>
                      </label>
                      <input
                        type="date"
                        value={slot.date}
                        onChange={(e) => updateSlot(slot.id, 'date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>Time</span>
                      </label>
                      <select
                        value={slot.time}
                        onChange={(e) => updateSlot(slot.id, 'time', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select time</option>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Meeting Mode */}
                  <div className="mt-4">
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
                            onClick={() => updateSlot(slot.id, 'mode', mode.value)}
                            className={`p-3 border rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                              slot.mode === mode.value
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

                  {/* Location/URL based on mode */}
                  {slot.mode === 'offline' && (
                    <div className="mt-4">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>Location</span>
                      </label>
                      <input
                        type="text"
                        value={slot.location}
                        onChange={(e) => updateSlot(slot.id, 'location', e.target.value)}
                        placeholder="e.g., Room 301, Faculty Office, Conference Room A"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required={slot.mode === 'offline'}
                      />
                    </div>
                  )}

                  {slot.mode === 'online' && (
                    <div className="mt-4">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                        <Video className="h-4 w-4" />
                        <span>Meeting URL (Optional)</span>
                      </label>
                      <input
                        type="url"
                        value={slot.meetingUrl}
                        onChange={(e) => updateSlot(slot.id, 'meetingUrl', e.target.value)}
                        placeholder="https://zoom.us/j/... or Google Meet link"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h4 className="font-medium text-amber-900 mb-1">How it works:</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Student will receive these alternative time options</li>
                  <li>• Student selects their preferred option</li>
                  <li>• Meeting is automatically scheduled (no further approval needed)</li>
                  <li>• You'll receive confirmation once student selects a slot</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
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
              Send Alternative Times
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};