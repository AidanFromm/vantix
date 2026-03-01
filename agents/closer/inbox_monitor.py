
import imaplib
import email
import os
import re
from datetime import datetime
import requests
import json

# IMAP Configuration
IMAP_SERVER = 'imap.gmail.com'
IMAP_PORT = 993
EMAIL_ADDRESS = 'usevantix@gmail.com'
APP_PASSWORD = 'fqptryzjcybyhgaq' # From TOOLS.md

# Supabase Configuration
SUPABASE_URL = 'https://obprrtqyzpaudfeyftyd.supabase.co'
SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9icHJydHF5enBhdWRmZXlmdHlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MTc4ODIsImV4cCI6MjA4NjA5Mzg4Mn0.Lu1n4m9GFNb85o-zxD_q5bmx20SuW0SMIfxSompVZdQ'

HEADERS = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
    'Content-Type': 'application/json'
}

def get_sender_email(msg):
    """Extracts the sender's email address from an email message."""
    from_header = msg.get('From')
    if from_header:
        match = re.search(r'<(.*?)>', from_header)
        if match:
            return match.group(1)
        return from_header # Fallback if no angle brackets
    return None

def get_email_body(msg):
    """Extracts the plain text body from an email message."""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdisposition = part.get('Content-Disposition')
            if ctype == 'text/plain' and 'attachment' not in (cdisposition or ''):
                try:
                    return part.get_payload(decode=True).decode('utf-8')
                except UnicodeDecodeError:
                    return part.get_payload(decode=True).decode('latin-1', errors='ignore')
    else:
        try:
            return msg.get_payload(decode=True).decode('utf-8')
        except UnicodeDecodeError:
            return msg.get_payload(decode=True).decode('latin-1', errors='ignore')
    return ""

def check_lead_in_supabase(email_address):
    """Checks if an email address exists as a lead in Supabase."""
    url = f"{SUPABASE_URL}/rest/v1/leads?email=eq.{email_address}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    leads = response.json()
    if leads:
        return leads[0] # Return the first matching lead
    return None

def update_lead_status(lead_id, new_stage):
    """Updates the stage of a lead in Supabase."""
    url = f"{SUPABASE_URL}/rest/v1/leads?id=eq.{lead_id}"
    payload = {"stage": new_stage}
    response = requests.patch(url, headers=HEADERS, data=json.dumps(payload))
    response.raise_for_status()
    return response.json()

def post_lead_activity(lead_id, activity_type, description):
    """Posts an activity for a lead in Supabase."""
    url = f"{SUPABASE_URL}/rest/v1/activities"
    payload = {
        "lead_id": lead_id,
        "type": activity_type,
        "description": description,
        "created_at": datetime.now().isoformat()
    }
    response = requests.post(url, headers=HEADERS, data=json.dumps(payload))
    response.raise_for_status()
    return response.json()

def main():
    summary_lines = []
    current_date = datetime.now().strftime("%Y-%m-%d")
    log_file_path = f"memory/agents/leads/inbox-{current_date}.md"
    NEWLINE = os.linesep
    
    mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
    try:
        mail.login(EMAIL_ADDRESS, APP_PASSWORD)
        mail.select('inbox')

        status, email_ids = mail.search(None, 'UNSEEN')
        email_id_list = email_ids[0].split()

        summary_lines.append(f"--- Inbox Monitor Report ({current_date}) ---")
        summary_lines.append(f"Checked usevantix@gmail.com for UNSEEN emails.")
        summary_lines.append(f"Found {len(email_id_list)} new UNSEEN emails.")
        summary_lines.append("")

        if not email_id_list:
            summary_lines.append("No new lead replies found.")

        for num in email_id_list:
            status, msg_data = mail.fetch(num, '(RFC822)')
            msg = email.message_from_bytes(msg_data[0][1])

            sender_email = get_sender_email(msg)
            subject = msg.get('Subject', 'No Subject')
            email_body = get_email_body(msg)

            summary_lines.append(f"Processing email from: {sender_email}")
            summary_lines.append(f"Subject: {subject}")

            if sender_email:
                lead = check_lead_in_supabase(sender_email)
                if lead:
                    lead_id = lead['id']
                    lead_name = lead.get('name', 'Unknown Lead')
                    
                    summary_lines.append(f"  -> MATCHED Supabase lead: {lead_name} (ID: {lead_id})")
                    
                    update_lead_status(lead_id, 'replied')
                    summary_lines.append(f"  -> Updated lead stage to 'replied'.")
                    
                    post_lead_activity(lead_id, 'email_reply', f"Received reply from lead: '{subject}'.")
                    summary_lines.append(f"  -> Posted activity for lead.")
                    summary_lines.append(f"  -> Lead Reply: '{lead_name}' ({sender_email}) - Subject: '{subject}'")
                    summary_lines.append("")

                    # Mark email as SEEN after processing
                    mail.store(num, '+FLAGS', '\Seen')
                else:
                    summary_lines.append(f"  -> No matching lead found in Supabase for {sender_email}.")
                    summary_lines.append("")
            else:
                summary_lines.append(f"  -> Could not extract sender email.")
                summary_lines.append("")

    except Exception as e:
        summary_lines.append(f"ERROR: {e}")
        print(f"ERROR during IMAP or Supabase operation: {e}")
    finally:
        try:
            mail.logout()
        except:
            pass # Ignore errors on logout if not logged in

    # Write summary to file
    os.makedirs(os.path.dirname(log_file_path), exist_ok=True)
    with open(log_file_path, 'w') as f:
        f.write(NEWLINE.join(summary_lines))
    
    print(NEWLINE.join(summary_lines))

if __name__ == '__main__':
    main()
