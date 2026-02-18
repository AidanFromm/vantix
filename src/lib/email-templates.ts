// Vantix branded email templates — Resend-compatible HTML strings

const BRAND = {
  bg: '#F4EFE8',
  accent: '#B07A45',
  text: '#1C1C1C',
  muted: '#7A746C',
  phone: '(908) 498-7753',
};

function layout(content: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:40px 20px;">
<tr><td align="center">
<table width="100%" style="max-width:560px;background:#FFFFFF;border-radius:12px;overflow:hidden;">
<tr><td style="padding:32px 40px 24px;border-bottom:1px solid #EEE6DC;">
  <span style="font-size:24px;font-weight:700;color:${BRAND.accent};letter-spacing:-0.5px;">vantix.</span>
</td></tr>
<tr><td style="padding:32px 40px;">
  ${content}
</td></tr>
<tr><td style="padding:24px 40px 32px;border-top:1px solid #EEE6DC;">
  <p style="margin:0;font-size:13px;color:${BRAND.muted};line-height:1.5;">
    Vantix &mdash; AI-powered business solutions<br>
    ${BRAND.phone} &bull; <a href="https://usevantix.com" style="color:${BRAND.accent};text-decoration:none;">usevantix.com</a>
  </p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function bookingConfirmationEmail(name: string, date: string, time: string) {
  return layout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND.text};">You're booked, ${name}!</h2>
    <p style="margin:0 0 24px;font-size:15px;color:${BRAND.muted};line-height:1.6;">
      Your free AI consultation is confirmed. Here are the details:
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};border-radius:8px;padding:20px;margin-bottom:24px;">
    <tr><td style="padding:16px 20px;">
      <p style="margin:0 0 8px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:${BRAND.accent};">Date</p>
      <p style="margin:0 0 16px;font-size:16px;color:${BRAND.text};font-weight:500;">${date}</p>
      <p style="margin:0 0 8px;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:${BRAND.accent};">Time</p>
      <p style="margin:0;font-size:16px;color:${BRAND.text};font-weight:500;">${time}</p>
    </td></tr>
    </table>
    <p style="margin:0;font-size:15px;color:${BRAND.muted};line-height:1.6;">
      We'll reach out at your scheduled time. If you need to reschedule, just reply to this email or call us at ${BRAND.phone}.
    </p>
  `);
}

export function bookingNotificationEmail(name: string, email: string, phone: string, date: string, time: string) {
  return layout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND.text};">New Booking 🎯</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};border-radius:8px;margin-bottom:16px;">
    <tr><td style="padding:16px 20px;">
      <p style="margin:0 0 4px;font-size:14px;color:${BRAND.muted};">Name</p>
      <p style="margin:0 0 12px;font-size:16px;color:${BRAND.text};font-weight:500;">${name}</p>
      <p style="margin:0 0 4px;font-size:14px;color:${BRAND.muted};">Email</p>
      <p style="margin:0 0 12px;font-size:16px;color:${BRAND.text};font-weight:500;">${email}</p>
      <p style="margin:0 0 4px;font-size:14px;color:${BRAND.muted};">Phone</p>
      <p style="margin:0 0 12px;font-size:16px;color:${BRAND.text};font-weight:500;">${phone || 'Not provided'}</p>
      <p style="margin:0 0 4px;font-size:14px;color:${BRAND.muted};">Date &amp; Time</p>
      <p style="margin:0;font-size:16px;color:${BRAND.text};font-weight:500;">${date} at ${time}</p>
    </td></tr>
    </table>
  `);
}

export function contactConfirmationEmail(name: string) {
  return layout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND.text};">Thanks for reaching out, ${name}!</h2>
    <p style="margin:0 0 16px;font-size:15px;color:${BRAND.muted};line-height:1.6;">
      We received your message and will get back to you within 24 hours. If it's urgent, call us at ${BRAND.phone}.
    </p>
    <p style="margin:0;font-size:15px;color:${BRAND.muted};line-height:1.6;">
      Talk soon.
    </p>
  `);
}

export function contactNotificationEmail(name: string, email: string, message: string) {
  return layout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND.text};">New Contact Form Lead 📬</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};border-radius:8px;margin-bottom:16px;">
    <tr><td style="padding:16px 20px;">
      <p style="margin:0 0 4px;font-size:14px;color:${BRAND.muted};">Name</p>
      <p style="margin:0 0 12px;font-size:16px;color:${BRAND.text};font-weight:500;">${name}</p>
      <p style="margin:0 0 4px;font-size:14px;color:${BRAND.muted};">Email</p>
      <p style="margin:0 0 12px;font-size:16px;color:${BRAND.text};font-weight:500;">${email}</p>
      <p style="margin:0 0 4px;font-size:14px;color:${BRAND.muted};">Message</p>
      <p style="margin:0;font-size:15px;color:${BRAND.text};line-height:1.5;">${message}</p>
    </td></tr>
    </table>
  `);
}

export function chatLeadNotificationEmail(name: string, email: string, phone: string, interest: string) {
  return layout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:${BRAND.text};">New Chat Widget Lead 💬</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};border-radius:8px;margin-bottom:16px;">
    <tr><td style="padding:16px 20px;">
      <p style="margin:0 0 4px;font-size:14px;color:${BRAND.muted};">Name</p>
      <p style="margin:0 0 12px;font-size:16px;color:${BRAND.text};font-weight:500;">${name || 'Not provided'}</p>
      <p style="margin:0 0 4px;font-size:14px;color:${BRAND.muted};">Email</p>
      <p style="margin:0 0 12px;font-size:16px;color:${BRAND.text};font-weight:500;">${email || 'Not provided'}</p>
      <p style="margin:0 0 4px;font-size:14px;color:${BRAND.muted};">Phone</p>
      <p style="margin:0 0 12px;font-size:16px;color:${BRAND.text};font-weight:500;">${phone || 'Not provided'}</p>
      <p style="margin:0 0 4px;font-size:14px;color:${BRAND.muted};">Interest</p>
      <p style="margin:0;font-size:15px;color:${BRAND.text};line-height:1.5;">${interest || 'General inquiry'}</p>
    </td></tr>
    </table>
  `);
}
