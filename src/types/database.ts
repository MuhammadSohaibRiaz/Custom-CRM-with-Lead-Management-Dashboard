export type UserRole = 'admin' | 'agent';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'closed_won'
  | 'closed_lost';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: LeadStatus;
  source: string | null;
  value: number;
  assigned_to: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  assigned_agent?: Profile;
  creator?: Profile;
}

export interface LeadNote {
  id: string;
  lead_id: string;
  author_id: string;
  content: string;
  created_at: string;
  // Joined
  author?: Profile;
}

export interface ActivityLogEntry {
  id: string;
  lead_id: string | null;
  user_id: string | null;
  action: string;
  details: Record<string, unknown>;
  created_at: string;
  // Joined
  user?: Profile;
  lead?: { name: string; company: string | null };
}

export const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; color: string; bgColor: string }
> = {
  new: { label: 'New', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
  contacted: { label: 'Contacted', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
  qualified: { label: 'Qualified', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200' },
  proposal: { label: 'Proposal', color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200' },
  closed_won: { label: 'Closed Won', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
  closed_lost: { label: 'Closed Lost', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },
};

export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Trade Show',
  'Email Campaign',
  'Other',
] as const;

export const PIPELINE_STAGES: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'closed_won',
  'closed_lost',
];
