-- ============================================================
-- LeadFlow CRM – Seed Data
-- Run this AFTER creating users in Supabase Auth.
--
-- INSTRUCTIONS:
-- 1. First, create these 6 users via the Supabase Auth dashboard
--    or the signup form:
--      admin1@leadflow.io  (password: Admin123!)
--      admin2@leadflow.io  (password: Admin123!)
--      sarah.j@leadflow.io (password: Agent123!)
--      mike.r@leadflow.io  (password: Agent123!)
--      emma.w@leadflow.io  (password: Agent123!)
--      james.k@leadflow.io (password: Agent123!)
--
-- 2. After creating users, update the UUIDs below with the
--    actual user IDs from auth.users table.
--
-- 3. Run this script in the Supabase SQL editor.
-- ============================================================

-- Replace these with real UUIDs from your auth.users table
DO $$
DECLARE
  admin1_id UUID;
  admin2_id UUID;
  agent1_id UUID;
  agent2_id UUID;
  agent3_id UUID;
  agent4_id UUID;
  lead_ids UUID[];
BEGIN

  -- Look up user IDs by email
  SELECT id INTO admin1_id FROM auth.users WHERE email = 'admin1@leadflow.io';
  SELECT id INTO admin2_id FROM auth.users WHERE email = 'admin2@leadflow.io';
  SELECT id INTO agent1_id FROM auth.users WHERE email = 'sarah.j@leadflow.io';
  SELECT id INTO agent2_id FROM auth.users WHERE email = 'mike.r@leadflow.io';
  SELECT id INTO agent3_id FROM auth.users WHERE email = 'emma.w@leadflow.io';
  SELECT id INTO agent4_id FROM auth.users WHERE email = 'james.k@leadflow.io';

  -- Update profiles with proper names and roles
  UPDATE profiles SET full_name = 'Alex Thompson', role = 'admin' WHERE id = admin1_id;
  UPDATE profiles SET full_name = 'Jordan Lee', role = 'admin' WHERE id = admin2_id;
  UPDATE profiles SET full_name = 'Sarah Johnson', role = 'agent' WHERE id = agent1_id;
  UPDATE profiles SET full_name = 'Mike Rodriguez', role = 'agent' WHERE id = agent2_id;
  UPDATE profiles SET full_name = 'Emma Williams', role = 'agent' WHERE id = agent3_id;
  UPDATE profiles SET full_name = 'James Kim', role = 'agent' WHERE id = agent4_id;

  -- Insert leads
  INSERT INTO leads (name, email, phone, company, status, source, value, assigned_to, created_by, created_at) VALUES
    ('Olivia Martinez', 'olivia@techcorp.com', '+1-555-0101', 'TechCorp Inc.', 'new', 'Website', 15000.00, agent1_id, admin1_id, now() - interval '2 days'),
    ('Liam Chen', 'liam@datavault.io', '+1-555-0102', 'DataVault.io', 'new', 'Referral', 28000.00, agent1_id, admin1_id, now() - interval '1 day'),
    ('Sophia Nguyen', 'sophia@greenleaf.co', '+1-555-0103', 'GreenLeaf Co.', 'new', 'LinkedIn', 12000.00, agent2_id, admin1_id, now() - interval '3 days'),
    ('Noah Williams', 'noah@skyline.dev', '+1-555-0104', 'Skyline Dev', 'contacted', 'Cold Call', 45000.00, agent1_id, admin1_id, now() - interval '5 days'),
    ('Isabella Brown', 'isabella@mediapulse.com', '+1-555-0105', 'MediaPulse', 'contacted', 'Website', 32000.00, agent2_id, admin1_id, now() - interval '7 days'),
    ('William Davis', 'william@fintrack.io', '+1-555-0106', 'FinTrack.io', 'contacted', 'Trade Show', 55000.00, agent3_id, admin1_id, now() - interval '4 days'),
    ('Mia Johnson', 'mia@cloudnine.co', '+1-555-0107', 'CloudNine Co.', 'qualified', 'Referral', 67000.00, agent1_id, admin1_id, now() - interval '10 days'),
    ('James Wilson', 'james@brightpath.com', '+1-555-0108', 'BrightPath', 'qualified', 'LinkedIn', 42000.00, agent2_id, admin1_id, now() - interval '12 days'),
    ('Charlotte Moore', 'charlotte@nexgen.io', '+1-555-0109', 'NexGen Solutions', 'qualified', 'Website', 89000.00, agent3_id, admin1_id, now() - interval '8 days'),
    ('Benjamin Taylor', 'ben@quantumleap.co', '+1-555-0110', 'QuantumLeap', 'qualified', 'Cold Call', 35000.00, agent4_id, admin1_id, now() - interval '15 days'),
    ('Amelia Anderson', 'amelia@swiftship.com', '+1-555-0111', 'SwiftShip Logistics', 'proposal', 'Referral', 120000.00, agent1_id, admin1_id, now() - interval '20 days'),
    ('Ethan Thomas', 'ethan@corestack.io', '+1-555-0112', 'CoreStack.io', 'proposal', 'Website', 78000.00, agent2_id, admin1_id, now() - interval '18 days'),
    ('Harper Jackson', 'harper@vividlabs.co', '+1-555-0113', 'Vivid Labs', 'proposal', 'Trade Show', 95000.00, agent3_id, admin1_id, now() - interval '14 days'),
    ('Alexander White', 'alex@pinnacle.biz', '+1-555-0114', 'Pinnacle Group', 'proposal', 'LinkedIn', 150000.00, agent4_id, admin1_id, now() - interval '22 days'),
    ('Evelyn Harris', 'evelyn@bluecrest.com', '+1-555-0115', 'BlueCrest Capital', 'closed_won', 'Referral', 85000.00, agent1_id, admin1_id, now() - interval '30 days'),
    ('Daniel Martin', 'daniel@optima.io', '+1-555-0116', 'Optima Solutions', 'closed_won', 'Website', 62000.00, agent1_id, admin1_id, now() - interval '25 days'),
    ('Abigail Garcia', 'abigail@trueform.co', '+1-555-0117', 'TrueForm Design', 'closed_won', 'Cold Call', 44000.00, agent2_id, admin1_id, now() - interval '28 days'),
    ('Michael Robinson', 'michael@edgepoint.com', '+1-555-0118', 'EdgePoint Inc.', 'closed_won', 'LinkedIn', 110000.00, agent3_id, admin1_id, now() - interval '35 days'),
    ('Emily Clark', 'emily@horizonhr.co', '+1-555-0119', 'Horizon HR', 'closed_won', 'Trade Show', 72000.00, agent3_id, admin1_id, now() - interval '32 days'),
    ('Matthew Lewis', 'matt@zenith.io', '+1-555-0120', 'Zenith Analytics', 'closed_won', 'Referral', 98000.00, agent4_id, admin1_id, now() - interval '40 days'),
    ('Elizabeth Walker', 'liz@primelogic.com', '+1-555-0121', 'PrimeLogic', 'closed_lost', 'Website', 55000.00, agent1_id, admin1_id, now() - interval '35 days'),
    ('David Hall', 'david@starforge.io', '+1-555-0122', 'StarForge', 'closed_lost', 'Cold Call', 38000.00, agent2_id, admin1_id, now() - interval '30 days'),
    ('Sofia Allen', 'sofia@lumina.co', '+1-555-0123', 'Lumina Tech', 'closed_lost', 'LinkedIn', 27000.00, agent4_id, admin1_id, now() - interval '28 days'),
    ('Joseph Young', 'joseph@atlasgrp.com', '+1-555-0124', 'Atlas Group', 'new', 'Website', 18000.00, agent3_id, admin1_id, now() - interval '1 day'),
    ('Avery King', 'avery@nebulasoft.io', '+1-555-0125', 'NebulaSoft', 'contacted', 'Referral', 41000.00, agent4_id, admin1_id, now() - interval '6 days'),
    ('Henry Wright', 'henry@cascadenet.com', '+1-555-0126', 'CascadeNet', 'qualified', 'Trade Show', 53000.00, agent1_id, admin1_id, now() - interval '11 days'),
    ('Scarlett Lopez', 'scarlett@ironclad.biz', '+1-555-0127', 'IronClad Security', 'proposal', 'Website', 130000.00, agent2_id, admin1_id, now() - interval '16 days'),
    ('Sebastian Hill', 'seb@wavecrest.io', '+1-555-0128', 'WaveCrest', 'new', 'LinkedIn', 22000.00, agent4_id, admin1_id, now()),
    ('Aria Scott', 'aria@summitml.co', '+1-555-0129', 'Summit ML', 'contacted', 'Referral', 67000.00, agent3_id, admin1_id, now() - interval '3 days'),
    ('Jack Green', 'jack@boldstep.com', '+1-555-0130', 'BoldStep Ventures', 'closed_won', 'Trade Show', 88000.00, agent2_id, admin1_id, now() - interval '45 days'),
    ('Luna Adams', 'luna@peakflow.io', '+1-555-0131', 'PeakFlow', 'qualified', 'Cold Call', 36000.00, agent4_id, admin1_id, now() - interval '9 days'),
    ('Owen Baker', 'owen@clearvue.co', '+1-555-0132', 'ClearVue Analytics', 'new', 'Website', 24000.00, agent1_id, admin1_id, now() - interval '1 day');

  -- Collect lead IDs for notes and activity
  SELECT array_agg(id) INTO lead_ids FROM (SELECT id FROM leads ORDER BY created_at DESC LIMIT 10) sub;

  -- Sample notes
  INSERT INTO lead_notes (lead_id, author_id, content, created_at)
  SELECT leads.id, leads.assigned_to,
    CASE (ROW_NUMBER() OVER ()) % 5
      WHEN 0 THEN 'Initial contact made via email. Prospect is interested in our enterprise plan.'
      WHEN 1 THEN 'Had a great discovery call. They have a team of 50+ and need CRM integration.'
      WHEN 2 THEN 'Decision maker confirmed as VP of Sales. Budget approved for Q2.'
      WHEN 3 THEN 'Sent proposal with custom pricing. Follow-up scheduled for next week.'
      WHEN 4 THEN 'Competitor comparison requested. Preparing feature matrix document.'
    END,
    leads.created_at + interval '1 day'
  FROM leads
  WHERE leads.status IN ('contacted', 'qualified', 'proposal', 'closed_won')
    AND leads.assigned_to IS NOT NULL;

  INSERT INTO lead_notes (lead_id, author_id, content, created_at)
  SELECT leads.id, leads.assigned_to,
    CASE (ROW_NUMBER() OVER ()) % 3
      WHEN 0 THEN 'Follow-up call completed. Moving forward with technical evaluation.'
      WHEN 1 THEN 'Demo scheduled for Friday. Invited their whole team.'
      WHEN 2 THEN 'Contract terms discussed. Legal review in progress.'
    END,
    leads.created_at + interval '3 days'
  FROM leads
  WHERE leads.status IN ('qualified', 'proposal', 'closed_won')
    AND leads.assigned_to IS NOT NULL;

  -- Activity log entries
  INSERT INTO activity_log (lead_id, user_id, action, details, created_at)
  SELECT id, created_by, 'lead_created',
    jsonb_build_object('name', name, 'company', company),
    created_at
  FROM leads
  WHERE created_by IS NOT NULL;

  INSERT INTO activity_log (lead_id, user_id, action, details, created_at)
  SELECT id, assigned_to, 'status_changed',
    jsonb_build_object('from', 'new', 'to', status::text),
    created_at + interval '2 days'
  FROM leads
  WHERE status != 'new'
    AND assigned_to IS NOT NULL;

  INSERT INTO activity_log (lead_id, user_id, action, details, created_at)
  SELECT id, created_by, 'lead_assigned',
    jsonb_build_object('assigned_to', assigned_to),
    created_at
  FROM leads
  WHERE assigned_to IS NOT NULL;

END $$;
