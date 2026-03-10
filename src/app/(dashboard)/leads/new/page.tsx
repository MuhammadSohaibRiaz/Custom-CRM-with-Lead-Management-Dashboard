import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui';
import LeadForm from '@/components/LeadForm';
import { createLead } from '../actions';
import type { Profile } from '@/types/database';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function NewLeadPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  let agents: Profile[] = [];
  if (isAdmin) {
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    agents = (data || []) as Profile[];
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div>
        <Link
          href="/leads"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
        <p className="text-sm text-gray-500">Create a new lead in your pipeline</p>
      </div>

      <Card>
        <LeadForm
          agents={agents}
          isAdmin={isAdmin}
          action={createLead}
          submitLabel="Create Lead"
        />
      </Card>
    </div>
  );
}
