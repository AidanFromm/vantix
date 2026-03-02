import { getData } from '@/lib/data';
import { FileText, Printer } from 'lucide-react';

interface LineItem {
  description: string;
  qty: number;
  rate: number;
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  phone: string;
  items: LineItem[];
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  createdAt: string;
  notes: string;
  sentAt?: string;
  paidAt?: string;
}

const statusStyle: Record<string, string> = {
  draft: 'bg-[#E3D9CD] text-[#7A746C]',
  sent: 'bg-[#C89A6A]/20 text-[#B07A45]',
  paid: 'bg-[#8E5E34]/20 text-[#8E5E34]',
  overdue: 'bg-[#B07A45]/20 text-[#B07A45]',
};

export default async function PublicInvoicePage({ params }: { params: { id: string } }) {
  const invoiceId = params.id;
  const invoice: Invoice | null = await getData('invoices', invoiceId);

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#F4EFE8] flex items-center justify-center p-6">
        <p className="text-xl text-[#1C1C1C]">Invoice not found.</p>
      </div>
    );
  }

  const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-[#F4EFE8] text-[#1C1C1C] p-6 sm:p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-[#EEE6DC] border border-[#E3D9CD] shadow-lg rounded-xl p-6 sm:p-10 md:p-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-[#1C1C1C]">Vantix</h1>
            <p className="text-[#7A746C]">Invoice Management</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-[#B07A45]">INVOICE</h2>
            <p className="text-sm text-[#4B4B4B]">#{invoice.number}</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-10 text-sm">
          <div>
            <p className="uppercase text-xs text-[#7A746C] mb-1">Billed To:</p>
            <p className="font-medium text-[#1C1C1C]">{invoice.client}</p>
            {invoice.phone && <p className="text-[#4B4B4B]">{invoice.phone}</p>}
          </div>
          <div className="md:text-right">
            <p className="uppercase text-xs text-[#7A746C] mb-1">Invoice Date:</p>
            <p className="font-medium text-[#1C1C1C]">{new Date(invoice.createdAt).toLocaleDateString()}</p>
            <p className="uppercase text-xs text-[#7A746C] mt-4 mb-1">Due Date:</p>
            <p className="font-medium text-[#1C1C1C]">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-10">
          <div className="hidden sm:grid grid-cols-4 font-bold text-xs uppercase text-[#7A746C] border-b border-[#E3D9CD] py-3 px-2">
            <div className="col-span-2">Description</div>
            <div className="text-right">Qty</div>
            <div className="text-right">Rate</div>
          </div>
          {invoice.items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-0 border-b border-[#E3D9CD]/50 py-4 px-2 last:border-b-0">
              <div className="col-span-2 font-medium text-[#1C1C1C]">{item.description}</div>
              <div className="flex justify-between sm:justify-end sm:text-right text-[#4B4B4B]">
                <span className="sm:hidden text-xs uppercase text-[#7A746C]">Qty:</span> {item.qty}
              </div>
              <div className="flex justify-between sm:justify-end sm:text-right text-[#4B4B4B]">
                <span className="sm:hidden text-xs uppercase text-[#7A746C]">Rate:</span> {fmt(item.rate)}
              </div>
            </div>
          ))}

          <div className="flex justify-end items-center mt-6 pt-4 border-t border-[#E3D9CD] font-bold text-lg">
            <span className="text-[#1C1C1C] mr-4">Total:</span>
            <span className="text-[#B07A45]">{fmt(invoice.total)}</span>
          </div>
        </div>

        {/* Status and Notes */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="uppercase text-xs text-[#7A746C] mb-1">Status:</p>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize ${statusStyle[invoice.status]}`}>
                {invoice.status}
              </span>
            </div>
            {invoice.paidAt && (
              <div className="text-right">
                <p className="uppercase text-xs text-[#7A746C] mb-1">Paid On:</p>
                <p className="font-medium text-[#1C1C1C]">{new Date(invoice.paidAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          {invoice.notes && (
            <div>
              <p className="uppercase text-xs text-[#7A746C] mt-6 mb-1">Notes:</p>
              <p className="text-[#4B4B4B] text-sm leading-relaxed whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Pay Now & Print */}
        <div className="bg-[#E3D9CD] rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-[#1C1C1C] mb-4">Pay Now</h3>
          <p className="text-[#4B4B4B] mb-2">Send payments via Zelle to:</p>
          <p className="text-[#B07A45] font-semibold text-lg mb-6">usevantix@gmail.com</p>
          <button onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#B07A45] text-white rounded-xl font-medium shadow-md hover:bg-[#8E5E34] transition-colors">
            <Printer size={20} /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
