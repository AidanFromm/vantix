INSERT INTO invoices (client_id, invoice_number, items, subtotal, total, paid, status, due_date, notes, created_at)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'INV-001',
  '[{"description": "Secured Tampa E-Commerce Platform - Deposit", "amount": 2000}]',
  2000, 2000, 2000, 'paid', '2026-02-01',
  'Initial deposit payment', '2026-01-27'
);

INSERT INTO invoices (client_id, invoice_number, items, subtotal, total, paid, status, due_date, notes, created_at)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'INV-002',
  '[{"description": "Secured Tampa E-Commerce Platform - Final Payment", "amount": 2500}]',
  2500, 2500, 0, 'sent', '2026-03-01',
  'Final payment due on completion', '2026-02-15'
);

INSERT INTO revenue (client_id, type, amount, description, received_at)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'project_fee', 2000, 'Secured Tampa - Initial deposit', '2026-01-27'
);

-- Update project with dates
UPDATE projects SET 
  start_date = '2026-01-27',
  deadline = '2026-03-01',
  description = 'Full custom e-commerce platform replacing Shopify. Sneakers + Pokemon inventory management, Stripe payments, GoShippo shipping, staff portal, iPad kiosk, POS system. 122 pages, production-ready.'
WHERE client_id = 'a0000000-0000-0000-0000-000000000001';

-- Add activity entries
INSERT INTO activities (type, description, client_id) VALUES
  ('client_created', 'New client: Secured Tampa (Dave)', 'a0000000-0000-0000-0000-000000000001'),
  ('invoice_paid', 'Invoice INV-001 paid: $2,000', 'a0000000-0000-0000-0000-000000000001'),
  ('project_started', 'Project started: Secured Tampa E-Commerce Platform', 'a0000000-0000-0000-0000-000000000001');
