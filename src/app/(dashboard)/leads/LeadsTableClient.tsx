'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge, Avatar } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Search, Filter } from 'lucide-react';
import type { Lead, Profile, LeadStatus } from '@/types/database';

interface LeadsTableClientProps {
  leads: (Lead & { assigned_agent?: Profile })[];
  agents: Profile[];
  isAdmin: boolean;
}

export default function LeadsTableClient({ leads, agents, isAdmin }: LeadsTableClientProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [agentFilter, setAgentFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !search ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        (lead.company || '').toLowerCase().includes(search.toLowerCase()) ||
        (lead.email || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesAgent = agentFilter === 'all' || lead.assigned_to === agentFilter;
      return matchesSearch && matchesStatus && matchesAgent;
    });
  }, [leads, search, statusFilter, agentFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500">{leads.length} total leads</p>
        </div>
        <Link
          href="/leads/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Lead
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="closed_won">Closed Won</option>
          <option value="closed_lost">Closed Lost</option>
        </select>
        {isAdmin && (
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Agents</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.full_name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Lead</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Agent</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Source</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Value</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 last:border-0">
                <td className="px-4 py-3">
                  <Link href={`/leads/${lead.id}`} className="group">
                    <p className="font-medium text-gray-900 group-hover:text-indigo-600">
                      {lead.name}
                    </p>
                    {lead.email && (
                      <p className="text-xs text-gray-400">{lead.email}</p>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{lead.company || '—'}</td>
                <td className="px-4 py-3">
                  <Badge status={lead.status} />
                </td>
                <td className="px-4 py-3">
                  {lead.assigned_agent ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={lead.assigned_agent.full_name} size="sm" />
                      <span className="text-sm text-gray-600">{lead.assigned_agent.full_name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{lead.source || '—'}</td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                  {formatCurrency(lead.value || 0)}
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">
                  {formatDate(lead.created_at)}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                  No leads found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
