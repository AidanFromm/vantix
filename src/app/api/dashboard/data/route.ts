import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const TYPES = ['clients', 'leads', 'invoices', 'projects', 'tasks', 'activities', 'bookings'] as const;

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(type: string): unknown[] {
  try {
    const file = join(DATA_DIR, `${type}.json`);
    if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf-8'));
  } catch { /* */ }
  return [];
}

function writeJson(type: string, data: unknown[]) {
  ensureDir();
  writeFileSync(join(DATA_DIR, `${type}.json`), JSON.stringify(data, null, 2));
}

export async function GET() {
  ensureDir();
  const result: Record<string, unknown[]> = {};
  for (const type of TYPES) {
    result[type] = readJson(type);
  }
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;
    if (!TYPES.includes(type) || !Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid type or data' }, { status: 400 });
    }
    writeJson(type, data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
