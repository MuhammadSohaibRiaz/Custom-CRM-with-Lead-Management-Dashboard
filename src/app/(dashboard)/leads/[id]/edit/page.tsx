import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Card } from '@/components/ui';
import LeadForm from '@/components/LeadForm';
import { updateLead } from '../../actions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Lead, Profile } from '@/types/database';

interface EditLeadPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLeadPage({ params }: EditLeadPageProps) {
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
    .select('*')
    .eq('id', id)
    .single();

  if (!lead) notFound();

  let agents: Profile[] = [];
  if (isAdmin) {
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    agents = (data || []) as Profile[];
  }

  const typedLead = lead as Lead;

  const updateLeadWithId = updateLead.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div>
        <Link
          href={`/leads/${id}`}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lead
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Lead</h1>
        <p className="text-sm text-gray-500">Update lead information</p>
      </div>

      <Card>
        <LeadForm
          agents={agents}
          isAdmin={isAdmin}
          defaultValues={{
            name: typedLead.name,
            email: typedLead.email || '',
            phone: typedLead.phone || '',
            company: typedLead.company || '',
            source: typedLead.source || '',
            value: typedLead.value,
            assigned_to: typedLead.assigned_to || '',
            status: typedLead.status,
          }}
          action={updateLeadWithId}
          submitLabel="Save Changes"
        />
      </Card>
    </div>
  );
}
