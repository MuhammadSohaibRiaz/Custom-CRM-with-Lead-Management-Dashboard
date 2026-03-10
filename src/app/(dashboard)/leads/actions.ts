'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createLead(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const company = formData.get('company') as string;
  const source = formData.get('source') as string;
  const value = parseFloat(formData.get('value') as string) || 0;
  const assignedTo = formData.get('assigned_to') as string;

  const { data: lead, error } = await supabase
    .from('leads')
    .insert({
      name,
      email: email || null,
      phone: phone || null,
      company: company || null,
      source: source || null,
      value,
      status: 'new',
      assigned_to: assignedTo || user.id,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Log activity
  await supabase.from('activity_log').insert({
    lead_id: lead.id,
    user_id: user.id,
    action: 'lead_created',
    details: { name, company },
  });

  revalidatePath('/leads');
  revalidatePath('/');
  redirect('/leads');
}

export async function updateLead(leadId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const company = formData.get('company') as string;
  const source = formData.get('source') as string;
  const value = parseFloat(formData.get('value') as string) || 0;
  const assignedTo = formData.get('assigned_to') as string;
  const status = formData.get('status') as string;

  // Get old state for activity log
  const { data: oldLead } = await supabase
    .from('leads')
    .select('status, assigned_to')
    .eq('id', leadId)
    .single();

  const updates: Record<string, unknown> = {
    name,
    email: email || null,
    phone: phone || null,
    company: company || null,
    source: source || null,
    value,
  };

  if (status) updates.status = status;
  if (assignedTo) updates.assigned_to = assignedTo;

  const { error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', leadId);

  if (error) {
    return { error: error.message };
  }

  // Log status change
  if (status && oldLead && status !== oldLead.status) {
    await supabase.from('activity_log').insert({
      lead_id: leadId,
      user_id: user.id,
      action: 'status_changed',
      details: { from: oldLead.status, to: status },
    });
  }

  // Log reassignment
  if (assignedTo && oldLead && assignedTo !== oldLead.assigned_to) {
    await supabase.from('activity_log').insert({
      lead_id: leadId,
      user_id: user.id,
      action: 'lead_assigned',
      details: { assigned_to: assignedTo },
    });
  }

  revalidatePath('/leads');
  revalidatePath(`/leads/${leadId}`);
  revalidatePath('/');
  redirect(`/leads/${leadId}`);
}

export async function updateLeadStatus(leadId: string, newStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { data: oldLead } = await supabase
    .from('leads')
    .select('status')
    .eq('id', leadId)
    .single();

  const { error } = await supabase
    .from('leads')
    .update({ status: newStatus })
    .eq('id', leadId);

  if (error) return { error: error.message };

  if (oldLead && newStatus !== oldLead.status) {
    await supabase.from('activity_log').insert({
      lead_id: leadId,
      user_id: user.id,
      action: 'status_changed',
      details: { from: oldLead.status, to: newStatus },
    });
  }

  revalidatePath('/leads');
  revalidatePath(`/leads/${leadId}`);
  revalidatePath('/pipeline');
  revalidatePath('/');
  return { success: true };
}

export async function addNote(leadId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase.from('lead_notes').insert({
    lead_id: leadId,
    author_id: user.id,
    content,
  });

  if (error) return { error: error.message };

  // Log activity
  await supabase.from('activity_log').insert({
    lead_id: leadId,
    user_id: user.id,
    action: 'note_added',
    details: { preview: content.slice(0, 100) },
  });

  revalidatePath(`/leads/${leadId}`);
  return { success: true };
}

export async function deleteLead(leadId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can delete leads' };
  }

  const { error } = await supabase.from('leads').delete().eq('id', leadId);
  if (error) return { error: error.message };

  revalidatePath('/leads');
  revalidatePath('/');
  redirect('/leads');
}

export async function reassignLead(leadId: string, agentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized' };

  const { error } = await supabase
    .from('leads')
    .update({ assigned_to: agentId })
    .eq('id', leadId);

  if (error) return { error: error.message };

  await supabase.from('activity_log').insert({
    lead_id: leadId,
    user_id: user.id,
    action: 'lead_assigned',
    details: { assigned_to: agentId },
  });

  revalidatePath('/leads');
  revalidatePath(`/leads/${leadId}`);
  revalidatePath('/agents');
  return { success: true };
}
