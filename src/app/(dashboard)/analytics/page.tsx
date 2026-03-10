import { createClient } from '@/lib/supabase/server';
import AnalyticsClient from './AnalyticsClient';
import type { Lead, Profile } from '@/types/database';

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: agents } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name');

  return (
    <AnalyticsClient
      leads={(leads || []) as Lead[]}
      agents={(agents || []) as Profile[]}
    />
  );
}
