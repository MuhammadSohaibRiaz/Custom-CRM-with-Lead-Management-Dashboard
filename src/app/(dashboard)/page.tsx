import { createClient } from '@/lib/supabase/server';
import { Card, StatCard, Badge } from '@/components/ui';
import { Users, DollarSign, TrendingUp, Target, Plus, ArrowRight } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import type { Lead, ActivityLogEntry, LeadStatus, LEAD_STATUS_CONFIG } from '@/types/database';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: recentActivity } = await supabase
    .from('activity_log')
    .select('*, user:profiles!activity_log_user_id_fkey(full_name), lead:leads!activity_log_lead_id_fkey(name, company)')
    .order('created_at', { ascending: false })
    .limit(8);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .single();

  const allLeads = (leads || []) as Lead[];
  const activities = (recentActivity || []) as ActivityLogEntry[];

  const totalLeads = allLeads.length;
  const closedWon = allLeads.filter((l) => l.status === 'closed_won').length;
  const conversionRate = totalLeads > 0 ? ((closedWon / totalLeads) * 100).toFixed(1) : '0';
  const totalPipelineValue = allLeads
    .filter((l) => !['closed_won', 'closed_lost'].includes(l.status))
    .reduce((sum, l) => sum + (l.value || 0), 0);
  const activeLeads = allLeads.filter(
    (l) => !['closed_won', 'closed_lost'].includes(l.status)
  ).length;

  const stageCounts: Record<string, number> = {};
  allLeads.forEach((l) => {
    stageCounts[l.status] = (stageCounts[l.status] || 0) + 1;
  });

  const stages: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'closed_won', 'closed_lost'];
  const stageLabels: Record<string, string> = {
    new: 'New',
    contacted: 'Contacted',
    qualified: 'Qualified',
    proposal: 'Proposal',
    closed_won: 'Won',
    closed_lost: 'Lost',
  };
  const stageColors: Record<string, string> = {
    new: 'bg-blue-500',
    contacted: 'bg-amber-500',
    qualified: 'bg-purple-500',
    proposal: 'bg-indigo-500',
    closed_won: 'bg-emerald-500',
    closed_lost: 'bg-red-500',
  };

  function getActionLabel(action: string, details: Record<string, unknown>): string {
    switch (action) {
      case 'lead_created':
        return `created lead "${details.name}"`;
      case 'status_changed':
        return `changed status from ${details.from} to ${details.to}`;
      case 'lead_assigned':
        return 'assigned a lead';
      case 'note_added':
        return 'added a note';
      default:
        return action.replace(/_/g, ' ');
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your sales pipeline</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/leads/new"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Lead
          </Link>
          <Link
            href="/pipeline"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Pipeline
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Leads" value={totalLeads} icon={Users} />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(totalPipelineValue)}
          icon={DollarSign}
        />
        <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon={TrendingUp} />
        <StatCard title="Active Leads" value={activeLeads} icon={Target} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pipeline Overview */}
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Pipeline Overview</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {stages.map((stage) => (
              <div key={stage} className="text-center">
                <div
                  className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg ${stageColors[stage]}`}
                >
                  {stageCounts[stage] || 0}
                </div>
                <p className="text-xs font-medium text-gray-600">{stageLabels[stage]}</p>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-gray-100">
            {stages.map((stage) => {
              const count = stageCounts[stage] || 0;
              const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={stage}
                  className={`${stageColors[stage]} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              );
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {activities.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
            )}
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{activity.user?.full_name || 'System'}</span>{' '}
                    {getActionLabel(activity.action, activity.details)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatRelativeTime(activity.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
          <Link href="/leads" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-left text-xs font-semibold uppercase text-gray-500">Name</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase text-gray-500">Company</th>
                <th className="pb-3 text-left text-xs font-semibold uppercase text-gray-500">Status</th>
                <th className="pb-3 text-right text-xs font-semibold uppercase text-gray-500">Value</th>
              </tr>
            </thead>
            <tbody>
              {allLeads.slice(0, 5).map((lead) => (
                <tr key={lead.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3">
                    <Link href={`/leads/${lead.id}`} className="font-medium text-gray-900 hover:text-indigo-600">
                      {lead.name}
                    </Link>
                  </td>
                  <td className="py-3 text-sm text-gray-500">{lead.company || '—'}</td>
                  <td className="py-3">
                    <Badge status={lead.status} />
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-gray-900">
                    {formatCurrency(lead.value || 0)}
                  </td>
                </tr>
              ))}
              {allLeads.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                    No leads yet.{' '}
                    <Link href="/leads/new" className="text-indigo-600 hover:text-indigo-700">
                      Create your first lead
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
