import React, { useState } from 'react';
import { X, FileText, Clock, Save, Edit3 } from 'lucide-react';

interface MeetingNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: {
    id: string;
    faculty: string;
    title: string;
    time: string;
    notes?: string;
    agenda?: string[];
  } | null;
  onSave: (meetingId: string, notes: string) => void;
}

export const MeetingNotesModal: React.FC<MeetingNotesModalProps> = ({ 
  isOpen, 
  onClose, 
  meeting, 
  onSave 
}) => {
  const [notes, setNotes] = useState(meeting?.notes || '');
  const [isEditing, setIsEditing] = useState(!meeting?.notes);

  const handleSave = () => {
    if (meeting) {
      onSave(meeting.id, notes);
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!isOpen || !meeting) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Meeting Summary</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Meeting Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">{meeting.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{meeting.time}</span>
              </span>
              <span>with {meeting.faculty}</span>
            </div>
          </div>

          {/* Agenda */}
          {meeting.agenda && meeting.agenda.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Meeting Agenda</h4>
              <ul className="space-y-2">
                {meeting.agenda.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meeting Notes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Meeting Notes & Discussion Points</h4>
              {!isEditing && meeting.notes && (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record key discussion points, universities covered, document expectations, faculty notes, etc..."
                  rows={8}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-2">💡 What to include in your notes:</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Universities discussed and their specific requirements</li>
                    <li>• Document expectations and deadlines</li>
                    <li>• Key points faculty wants to highlight in the LoR</li>
                    <li>• Next steps and action items</li>
                    <li>• Any specific formatting or submission requirements</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Notes</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                {meeting.notes ? (
                  <div className="whitespace-pre-wrap text-gray-700">{meeting.notes}</div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No meeting notes recorded yet.</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mx-auto"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Add Meeting Notes</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Timestamp */}
          {meeting.notes && (
            <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
              Last updated: {new Date().toLocaleString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};