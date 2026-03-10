import { createClient } from '@/lib/supabase/server';
import { Card, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import type { Lead, LeadStatus } from '@/types/database';
import { LEAD_STATUS_CONFIG, PIPELINE_STAGES } from '@/types/database';

export default async function PipelinePage() {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from('leads')
    .select('*, assigned_agent:profiles!leads_assigned_to_fkey(full_name)')
    .order('created_at', { ascending: false });

  const allLeads = (leads || []) as (Lead & { assigned_agent?: { full_name: string } })[];

  const stageLeads: Record<LeadStatus, typeof allLeads> = {
    new: [],
    contacted: [],
    qualified: [],
    proposal: [],
    closed_won: [],
    closed_lost: [],
  };

  allLeads.forEach((lead) => {
    stageLeads[lead.status].push(lead);
  });

  const stageColors: Record<LeadStatus, string> = {
    new: 'border-t-blue-500',
    contacted: 'border-t-amber-500',
    qualified: 'border-t-purple-500',
    proposal: 'border-t-indigo-500',
    closed_won: 'border-t-emerald-500',
    closed_lost: 'border-t-red-500',
  };

  const stageBgColors: Record<LeadStatus, string> = {
    new: 'bg-blue-50',
    contacted: 'bg-amber-50',
    qualified: 'bg-purple-50',
    proposal: 'bg-indigo-50',
    closed_won: 'bg-emerald-50',
    closed_lost: 'bg-red-50',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
        <p className="text-sm text-gray-500">
          {allLeads.length} leads across {PIPELINE_STAGES.length} stages
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage) => {
          const config = LEAD_STATUS_CONFIG[stage];
          const stageItems = stageLeads[stage];
          const totalValue = stageItems.reduce((sum, l) => sum + (l.value || 0), 0);

          return (
            <div
              key={stage}
              className={`flex min-w-[280px] flex-1 flex-col rounded-xl border-t-4 bg-white shadow-sm ${stageColors[stage]}`}
            >
              {/* Stage Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">{config.label}</h3>
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${stageBgColors[stage]} ${config.color}`}
                  >
                    {stageItems.length}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{formatCurrency(totalValue)}</p>
              </div>

              {/* Lead Cards */}
              <div className="flex-1 space-y-2 p-3 overflow-y-auto max-h-[calc(100vh-280px)]">
                {stageItems.length === 0 && (
                  <p className="py-8 text-center text-xs text-gray-400">No leads</p>
                )}
                {stageItems.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="block rounded-lg border border-gray-100 bg-white p-3 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                  >
                    <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                    {lead.company && (
                      <p className="mt-0.5 text-xs text-gray-500">{lead.company}</p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-indigo-600">
                        {formatCurrency(lead.value || 0)}
                      </span>
                      {lead.assigned_agent && (
                        <span className="text-xs text-gray-400">
                          {lead.assigned_agent.full_name}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
