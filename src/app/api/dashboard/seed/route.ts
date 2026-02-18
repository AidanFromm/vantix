import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(type: string): unknown[] {
  try {
    const file = join(DATA_DIR, `${type}.json`);
    if (existsSync(file)) {
      const data = JSON.parse(readFileSync(file, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch { /* */ }
  return [];
}

function writeJson(type: string, data: unknown[]) {
  ensureDir();
  writeFileSync(join(DATA_DIR, `${type}.json`), JSON.stringify(data, null, 2));
}

export async function GET() {
  ensureDir();
  const seeded: string[] = [];

  if (readJson('clients').length === 0) {
    writeJson('clients', [{
      id: 'dave-secured-tampa',
      name: 'SecuredTampa',
      contact_name: 'Dave',
      contact_email: 'securedtampa.llc@gmail.com',
      contact_phone: '(813) 943-2777',
      industry: 'Retail/E-commerce',
      status: 'active',
      contract_value: 4500,
      created_at: '2026-01-28T00:00:00Z',
    }]);
    seeded.push('clients');
  }

  if (readJson('projects').length === 0) {
    writeJson('projects', [{
      id: 'secured-tampa-app',
      name: 'SecuredTampa E-Commerce Platform',
      client_id: 'dave-secured-tampa',
      status: 'active',
      health: 'green',
      budget: 4500,
      spent: 2000,
      progress: 90,
      deadline: '2026-02-28',
    }]);
    seeded.push('projects');
  }

  if (readJson('invoices').length === 0) {
    writeJson('invoices', [
      {
        id: 'inv-001',
        invoice_number: 'VTX-001',
        client_id: 'dave-secured-tampa',
        project_id: 'secured-tampa-app',
        total: 2000,
        status: 'paid',
        paid_at: '2026-02-01T00:00:00Z',
        created_at: '2026-01-28T00:00:00Z',
      },
      {
        id: 'inv-002',
        invoice_number: 'VTX-002',
        client_id: 'dave-secured-tampa',
        project_id: 'secured-tampa-app',
        total: 2500,
        status: 'sent',
        due_date: '2026-02-28',
        created_at: '2026-02-14T00:00:00Z',
      },
    ]);
    seeded.push('invoices');
  }

  if (readJson('activities').length === 0) {
    writeJson('activities', [
      {
        id: 'act-1',
        type: 'payment',
        title: 'Payment received from SecuredTampa',
        description: '$2,000 deposit',
        created_at: '2026-02-01T00:00:00Z',
      },
      {
        id: 'act-2',
        type: 'project',
        title: 'SecuredTampa platform shipped',
        description: '122 pages, 50+ API routes',
        created_at: '2026-02-17T00:00:00Z',
      },
    ]);
    seeded.push('activities');
  }

  return NextResponse.json({
    ok: true,
    seeded,
    message: seeded.length > 0 ? `Seeded: ${seeded.join(', ')}` : 'All data already exists, nothing seeded',
  });
}
