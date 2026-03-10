import { createClient } from '@/lib/supabase/server';
import LeadsTableClient from './LeadsTableClient';
import type { Lead, Profile } from '@/types/database';

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  // Fetch leads with assigned agent info
  const { data: leads } = await supabase
    .from('leads')
    .select('*, assigned_agent:profiles!leads_assigned_to_fkey(*)')
    .order('created_at', { ascending: false });

  // Fetch all agents for the filter dropdown (admin only)
  let agents: Profile[] = [];
  if (isAdmin) {
    const { data } = await supabase.from('profiles').select('*').order('full_name');
    agents = (data || []) as Profile[];
  }

  return (
    <LeadsTableClient
      leads={(leads || []) as (Lead & { assigned_agent?: Profile })[]}
      agents={agents}
      isAdmin={isAdmin}
    />
  );
}
