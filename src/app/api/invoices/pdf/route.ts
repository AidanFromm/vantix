import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://obprrtqyzpaudfeyftyd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'missing-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing invoice id' }, { status: 400 });
  }

  try {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*, client:clients(*), project:projects(*)')
      .eq('id', id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const items = invoice.items || [];
    const clientName = invoice.client?.name || 'Client';
    const clientEmail = invoice.client?.contact_email || '';

    const itemRows = Array.isArray(items)
      ? items.map((item: { description?: string; quantity?: number; rate?: number; amount?: number }) =>
          `<tr>
            <td style="padding:8px;border-bottom:1px solid #eee">${item.description || ''}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity || 1}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${(item.rate || 0).toFixed(2)}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">$${(item.amount || 0).toFixed(2)}</td>
          </tr>`
        ).join('')
      : '<tr><td colspan="4" style="padding:8px">No line items</td></tr>';

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice ${invoice.invoice_number || id}</title>
  <style>
    @media print { body { margin: 0; } .no-print { display: none; } }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .logo { font-size: 28px; font-weight: bold; color: #8E5E34; }
    .invoice-meta { text-align: right; }
    .invoice-meta h2 { margin: 0; color: #8E5E34; font-size: 24px; }
    .parties { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .party h4 { margin: 0 0 8px; color: #666; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #f8f4ef; padding: 10px 8px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; }
    .totals { text-align: right; margin-top: 20px; }
    .totals .total { font-size: 22px; font-weight: bold; color: #8E5E34; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-paid { background: #d4edda; color: #155724; }
    .status-sent { background: #fff3cd; color: #856404; }
    .status-overdue { background: #f8d7da; color: #721c24; }
    .status-draft { background: #e2e3e5; color: #383d41; }
    .print-btn { position: fixed; bottom: 20px; right: 20px; padding: 12px 24px; background: #8E5E34; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">VANTIX</div>
    <div class="invoice-meta">
      <h2>INVOICE</h2>
      <p>${invoice.invoice_number || `INV-${id.slice(0, 8)}`}</p>
      <p>Date: ${new Date(invoice.created_at).toLocaleDateString()}</p>
      ${invoice.due_date ? `<p>Due: ${new Date(invoice.due_date).toLocaleDateString()}</p>` : ''}
      <span class="status status-${invoice.status}">${invoice.status}</span>
    </div>
  </div>
  <div class="parties">
    <div class="party">
      <h4>From</h4>
      <strong>Vantix</strong><br>
      usevantix@gmail.com
    </div>
    <div class="party" style="text-align:right">
      <h4>Bill To</h4>
      <strong>${clientName}</strong><br>
      ${clientEmail}
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align:center">Qty</th>
        <th style="text-align:right">Rate</th>
        <th style="text-align:right">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows}
    </tbody>
  </table>
  <div class="totals">
    ${invoice.subtotal ? `<p>Subtotal: $${invoice.subtotal.toFixed(2)}</p>` : ''}
    ${invoice.tax ? `<p>Tax: $${invoice.tax.toFixed(2)}</p>` : ''}
    <p class="total">Total: $${(invoice.total || invoice.amount || 0).toFixed(2)}</p>
    ${invoice.paid ? `<p>Paid: $${invoice.paid.toFixed(2)}</p>` : ''}
  </div>
  ${invoice.notes ? `<div style="margin-top:30px;padding:16px;background:#f8f4ef;border-radius:8px"><strong>Notes:</strong><br>${invoice.notes}</div>` : ''}
  <button class="print-btn no-print" onclick="window.print()">Print / Save PDF</button>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="invoice-${invoice.invoice_number || id}.html"`,
      },
    });
  } catch (err) {
    console.error('Invoice PDF error:', err);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}
