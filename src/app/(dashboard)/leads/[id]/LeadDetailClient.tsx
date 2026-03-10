'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Avatar, Select } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { updateLeadStatus, addNote, reassignLead } from '../actions';
import { formatDate } from '@/lib/utils';
import { Send } from 'lucide-react';
import type { LeadNote, LeadStatus, Profile } from '@/types/database';
import { LEAD_STATUS_CONFIG } from '@/types/database';

interface LeadDetailClientProps {
  leadId: string;
  currentStatus: LeadStatus;
  notes: LeadNote[];
  isAdmin: boolean;
  agents: Profile[];
}

export default function LeadDetailClient({
  leadId,
  currentStatus,
  notes,
  isAdmin,
  agents,
}: LeadDetailClientProps) {
  const [status, setStatus] = useState(currentStatus);
  const [noteContent, setNoteContent] = useState('');
  const [sendingNote, setSendingNote] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const statusOptions = Object.entries(LEAD_STATUS_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const handleStatusChange = async (newStatus: string) => {
    setChangingStatus(true);
    const result = await updateLeadStatus(leadId, newStatus);
    if (result?.error) {
      toast(result.error, 'error');
    } else {
      setStatus(newStatus as LeadStatus);
      toast('Status updated', 'success');
      router.refresh();
    }
    setChangingStatus(false);
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) return;
    setSendingNote(true);
    const result = await addNote(leadId, noteContent.trim());
    if (result?.error) {
      toast(result.error, 'error');
    } else {
      setNoteContent('');
      toast('Note added', 'success');
      router.refresh();
    }
    setSendingNote(false);
  };

  const handleReassign = async (agentId: string) => {
    if (!agentId) return;
    const result = await reassignLead(leadId, agentId);
    if (result?.error) {
      toast(result.error, 'error');
    } else {
      toast('Lead reassigned', 'success');
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={changingStatus}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {isAdmin && agents.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reassign Agent
              </label>
              <select
                onChange={(e) => handleReassign(e.target.value)}
                defaultValue=""
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Select agent...
                </option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.full_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* Notes */}
      <Card>
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Notes</h3>

        {/* Add Note */}
        <div className="mb-6 flex gap-2">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add a note..."
            rows={2}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={handleAddNote}
            disabled={sendingNote || !noteContent.trim()}
            className="self-end rounded-lg bg-indigo-600 p-2.5 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">No notes yet</p>
          )}
          {notes.map((note) => (
            <div key={note.id} className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Avatar name={note.author?.full_name || 'Unknown'} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {note.author?.full_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(note.created_at)}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
