'use client';

import { useState } from 'react';
import { Input, Select } from '@/components/ui';
import { LEAD_SOURCES } from '@/types/database';
import type { Profile } from '@/types/database';

interface LeadFormProps {
  agents: Profile[];
  isAdmin: boolean;
  defaultValues?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    source?: string;
    value?: number;
    assigned_to?: string;
    status?: string;
  };
  action: (formData: FormData) => void;
  submitLabel: string;
}

export default function LeadForm({
  agents,
  isAdmin,
  defaultValues = {},
  action,
  submitLabel,
}: LeadFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'closed_won', label: 'Closed Won' },
    { value: 'closed_lost', label: 'Closed Lost' },
  ];

  const sourceOptions = [
    { value: '', label: 'Select source...' },
    ...LEAD_SOURCES.map((s) => ({ value: s, label: s })),
  ];

  const agentOptions = [
    { value: '', label: 'Select agent...' },
    ...agents.map((a) => ({ value: a.id, label: a.full_name })),
  ];

  return (
    <form
      action={async (formData) => {
        setSubmitting(true);
        await action(formData);
        setSubmitting(false);
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          id="name"
          name="name"
          label="Full Name *"
          required
          defaultValue={defaultValues.name}
          placeholder="John Smith"
        />
        <Input
          id="email"
          name="email"
          label="Email"
          type="email"
          defaultValue={defaultValues.email}
          placeholder="john@company.com"
        />
        <Input
          id="phone"
          name="phone"
          label="Phone"
          defaultValue={defaultValues.phone}
          placeholder="+1-555-0100"
        />
        <Input
          id="company"
          name="company"
          label="Company"
          defaultValue={defaultValues.company}
          placeholder="Acme Inc."
        />
        <Select
          id="source"
          name="source"
          label="Lead Source"
          options={sourceOptions}
          defaultValue={defaultValues.source || ''}
        />
        <Input
          id="value"
          name="value"
          label="Deal Value ($)"
          type="number"
          min={0}
          step={100}
          defaultValue={defaultValues.value?.toString()}
          placeholder="10000"
        />
        {defaultValues.status && (
          <Select
            id="status"
            name="status"
            label="Status"
            options={statusOptions}
            defaultValue={defaultValues.status}
          />
        )}
        {isAdmin && (
          <Select
            id="assigned_to"
            name="assigned_to"
            label="Assign to Agent"
            options={agentOptions}
            defaultValue={defaultValues.assigned_to || ''}
          />
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
