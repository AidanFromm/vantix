// Resend email client wrapper

const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_TJNHAFRB_A66nrWk5st1W4RAFyn2z4eQs';
const DEFAULT_FROM = 'Vantix <onboarding@resend.dev>'; // Switch to hello@usevantix.com after domain verification

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  from?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: from || DEFAULT_FROM,
        to: [to],
        subject,
        html,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error('Resend error:', data);
      return { success: false, error: data.message || 'Failed to send' };
    }
    return { success: true, id: data.id };
  } catch (err) {
    console.error('Email send failed:', err);
    return { success: false, error: 'Network error' };
  }
}
