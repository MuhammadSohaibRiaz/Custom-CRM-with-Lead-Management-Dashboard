import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card, Badge, Avatar } from '@/components/ui';
import { formatCurrency, formatDate } from '@/lib/utils';
import ActivityTimeline from '@/components/ActivityTimeline';
import LeadDetailClient from './LeadDetailClient';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Building2, Globe, DollarSign, Calendar } from 'lucide-react';
import type { Lead, LeadNote, ActivityLogEntry, Profile } from '@/types/database';

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  const { data: lead } = await supabase
    .from('leads')
    .select('*, assigned_agent:profiles!leads_assigned_to_fkey(*), creator:profiles!leads_created_by_fkey(*)')
    .eq('id', id)
    .single();

  if (!lead) notFound();

  const { data: notes } = await supabase
    .from('lead_notes')
    .select('*, author:profiles!lead_notes_author_id_fkey(*)')
    .eq('lead_id', id)
    .order('created_at', { ascending: false });

  const { data: activities } = await supabase
    .from('activity_log')
    .select('*, user:profiles!activity_log_user_id_fkey(*)')
    .eq('lead_id', id)
    .order('created_at', { ascending: false });

  let agents: Profile[] = [];
  if (isAdmin) {
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    agents = (data || []) as Profile[];
  }

  const typedLead = lead as Lead;
  const typedNotes = (notes || []) as LeadNote[];
  const typedActivities = (activities || []) as ActivityLogEntry[];

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-in">
      <div>
        <Link
          href="/leads"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lead Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{typedLead.name}</h1>
                {typedLead.company && (
                  <p className="text-sm text-gray-500 mt-1">{typedLead.company}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge status={typedLead.status} />
                <Link
                  href={`/leads/${id}/edit`}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </Link>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {typedLead.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {typedLead.email}
                </div>
              )}
              {typedLead.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {typedLead.phone}
                </div>
              )}
              {typedLead.company && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  {typedLead.company}
                </div>
              )}
              {typedLead.source && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="h-4 w-4 text-gray-400" />
                  {typedLead.source}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign className="h-4 w-4 text-gray-400" />
                {formatCurrency(typedLead.value || 0)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                Created {formatDate(typedLead.created_at)}
              </div>
            </div>

            {/* Assigned Agent */}
            {typedLead.assigned_agent && (
              <div className="mt-6 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <Avatar name={typedLead.assigned_agent.full_name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {typedLead.assigned_agent.full_name}
                  </p>
                  <p className="text-xs text-gray-500">Assigned Agent</p>
                </div>
              </div>
            )}
          </Card>

          {/* Status Change + Notes — client component */}
          <LeadDetailClient
            leadId={id}
            currentStatus={typedLead.status}
            notes={typedNotes}
            isAdmin={isAdmin}
            agents={agents}
          />
        </div>

        {/* Activity Timeline */}
        <div>
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Activity</h3>
            <ActivityTimeline activities={typedActivities} />
          </Card>
        </div>
      </div>
    </div>
  );
}
