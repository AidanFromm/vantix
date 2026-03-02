import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { updateRecord } from '@/lib/data';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = '+18628292840';

const client = new twilio.Twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const { invoiceId, phone, message, invoiceNumber, invoiceTotal } = await request.json();

    if (!invoiceId || !phone || !invoiceNumber || !invoiceTotal) {
      return NextResponse.json({ error: 'Missing required fields: invoiceId, phone, invoiceNumber, invoiceTotal' }, { status: 400 });
    }

    const invoiceLink = `https://usevantix.com/invoice/${invoiceId}`;
    const defaultMessage = `Invoice ${invoiceNumber} from Vantix - $${invoiceTotal}. View: ${invoiceLink}`;
    const body = message || defaultMessage;

    await client.messages.create({
      body,
      to: phone,
      from: twilioPhoneNumber,
    });

    await updateRecord('invoices', invoiceId, { status: 'sent', sentAt: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 });
  }
}
