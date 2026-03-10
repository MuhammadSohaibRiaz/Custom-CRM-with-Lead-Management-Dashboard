import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, Avatar, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { Users, Target, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import type { Profile, Lead } from '@/types/database';

export default async function AgentsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single();

  if (currentProfile?.role !== 'admin') {
    redirect('/');
  }

  const { data: agents } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name');

  const { data: leads } = await supabase
    .from('leads')
    .select('*');

  const allAgents = (agents || []) as Profile[];
  const allLeads = (leads || []) as Lead[];

  // Calculate stats per agent
  const agentStats = allAgents.map((agent) => {
    const agentLeads = allLeads.filter((l) => l.assigned_to === agent.id);
    const totalLeads = agentLeads.length;
    const closedWon = agentLeads.filter((l) => l.status === 'closed_won').length;
    const closedLost = agentLeads.filter((l) => l.status === 'closed_lost').length;
    const activeLeads = agentLeads.filter(
      (l) => !['closed_won', 'closed_lost'].includes(l.status)
    ).length;
    const totalValue = agentLeads.reduce((sum, l) => sum + (l.value || 0), 0);
    const wonValue = agentLeads
      .filter((l) => l.status === 'closed_won')
      .reduce((sum, l) => sum + (l.value || 0), 0);
    const conversionRate =
      totalLeads > 0 ? ((closedWon / totalLeads) * 100).toFixed(1) : '0';

    return {
      ...agent,
      totalLeads,
      closedWon,
      closedLost,
      activeLeads,
      totalValue,
      wonValue,
      conversionRate,
    };
  });

  // Sort by won value desc
  agentStats.sort((a, b) => b.wonValue - a.wonValue);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
        <p className="text-sm text-gray-500">{allAgents.length} team members</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2.5">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Agents</p>
              <p className="text-lg font-bold text-gray-900">
                {allAgents.filter((a) => a.role === 'agent').length}
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2.5">
              <Target className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Leads</p>
              <p className="text-lg font-bold text-gray-900">{allLeads.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-2.5">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Conversion</p>
              <p className="text-lg font-bold text-gray-900">
                {allLeads.length > 0
                  ? (
                      (allLeads.filter((l) => l.status === 'closed_won').length / allLeads.length) *
                      100
                    ).toFixed(1)
                  : '0'}
                %
              </p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2.5">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(
                  allLeads
                    .filter((l) => l.status === 'closed_won')
                    .reduce((sum, l) => sum + (l.value || 0), 0)
                )}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agentStats.map((agent) => (
          <Card key={agent.id}>
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={agent.full_name} size="lg" />
              <div>
                <p className="font-semibold text-gray-900">{agent.full_name}</p>
                <p className="text-sm text-gray-500 capitalize">{agent.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-lg font-bold text-gray-900">{agent.totalLeads}</p>
                <p className="text-xs text-gray-500">Total Leads</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-lg font-bold text-emerald-600">{agent.closedWon}</p>
                <p className="text-xs text-gray-500">Won</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-lg font-bold text-gray-900">{agent.conversionRate}%</p>
                <p className="text-xs text-gray-500">Conversion</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-lg font-bold text-indigo-600">
                  {formatCurrency(agent.wonValue)}
                </p>
                <p className="text-xs text-gray-500">Revenue</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">{agent.activeLeads} active leads</span>
              <span className="text-gray-500">{formatCurrency(agent.totalValue)} pipeline</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
