'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, StatCard } from '@/components/ui';
import { Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Lead, Profile } from '@/types/database';

interface AnalyticsClientProps {
  leads: Lead[];
  agents: Profile[];
}

const STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6',
  contacted: '#f59e0b',
  qualified: '#8b5cf6',
  proposal: '#6366f1',
  closed_won: '#10b981',
  closed_lost: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  closed_won: 'Won',
  closed_lost: 'Lost',
};

export default function AnalyticsClient({ leads, agents }: AnalyticsClientProps) {
  const totalLeads = leads.length;
  const closedWon = leads.filter((l) => l.status === 'closed_won').length;
  const conversionRate = totalLeads > 0 ? ((closedWon / totalLeads) * 100).toFixed(1) : '0';
  const avgDealValue =
    totalLeads > 0
      ? leads.reduce((sum, l) => sum + (l.value || 0), 0) / totalLeads
      : 0;
  const thisMonthLeads = leads.filter((l) => {
    const created = new Date(l.created_at);
    const now = new Date();
    return (
      created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    );
  }).length;

  // Leads by status for pie chart
  const statusData = Object.entries(
    leads.reduce((acc: Record<string, number>, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({
    name: STATUS_LABELS[status] || status,
    value: count,
    color: STATUS_COLORS[status] || '#94a3b8',
  }));

  // Leads by month for bar chart
  const monthlyData: { month: string; count: number }[] = [];
  const monthMap = new Map<string, number>();
  leads.forEach((lead) => {
    const d = new Date(lead.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthMap.set(key, (monthMap.get(key) || 0) + 1);
  });
  Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .forEach(([month, count]) => {
      const [y, m] = month.split('-');
      const label = new Date(parseInt(y), parseInt(m) - 1).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      });
      monthlyData.push({ month: label, count });
    });

  // Top agents by closed_won
  const agentPerformance = agents
    .map((agent) => {
      const agentLeads = leads.filter((l) => l.assigned_to === agent.id);
      const won = agentLeads.filter((l) => l.status === 'closed_won').length;
      const revenue = agentLeads
        .filter((l) => l.status === 'closed_won')
        .reduce((sum, l) => sum + (l.value || 0), 0);
      return { name: agent.full_name, won, revenue };
    })
    .filter((a) => a.won > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500">Sales performance metrics</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Leads" value={totalLeads} icon={Users} />
        <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon={TrendingUp} />
        <StatCard title="Avg Deal Value" value={formatCurrency(avgDealValue)} icon={DollarSign} />
        <StatCard title="This Month" value={thisMonthLeads} icon={Calendar} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Leads by Month */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Leads Created per Month</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Leads by Status */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Leads by Status</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Performing Agents */}
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Performing Agents</h3>
          {agentPerformance.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No closed deals yet</p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    width={120}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
