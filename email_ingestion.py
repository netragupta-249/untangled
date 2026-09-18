import imaplib
import email
from email.header import decode_header


# System Constants
IMAP_SERVER = "imap.gmail.com"
EMAIL_ACCOUNT = "kishoriipriya2508@gmail.com"
APP_PASSWORD = "ENTER PASSWORD HERE" # Do not commit this to GitHub


def fetch_campus_notices(target_domain="igdtuw.ac.in", max_emails=5):
   """
   Establishes an SSL connection to Gmail, executes a server-side search,
   and parses the multipart MIME payload into raw text.
   """
   # 1. Open Secure Socket layer connection
   mail = imaplib.IMAP4_SSL(IMAP_SERVER)
   mail.login(EMAIL_ACCOUNT, APP_PASSWORD)
  
   # 2. Mount the Inbox in read-only mode to prevent accidental data mutation
   mail.select("inbox", readonly=True)
  
   # 3. Server-Side Filtering (O(1) bandwidth cost)
   # Target specific university domains or keywords like 'class' or 'rescheduled'
   status, messages = mail.search(None, f'(FROM "{target_domain}")')
  
   if status != "OK":
       print("No messages found.")
       return []


   # 4. Memory Allocation
   # messages[0] is a space-separated byte string of email IDs
   email_ids = messages[0].split()
   latest_emails = email_ids[-max_emails:] # Slice the most recent
  
   extracted_data = []


   # 5. Payload Decoding Loop
   for e_id in latest_emails:
       # Fetch the physical byte array of the email
       res, msg_data = mail.fetch(e_id, "(RFC822)")
       for response_part in msg_data:
           if isinstance(response_part, tuple):
               # Construct the email object from bytes
               msg = email.message_from_bytes(response_part[1])
              
               # Decode Subject Header
               subject, encoding = decode_header(msg["Subject"])[0]
               if isinstance(subject, bytes):
                   subject = subject.decode(encoding if encoding else "utf-8")
              
               # Traverse the MIME tree to find the plaintext body
               body = ""
               if msg.is_multipart():
                   for part in msg.walk():
                       content_type = part.get_content_type()
                       content_disposition = str(part.get("Content-Disposition"))
                      
                       if content_type == "text/plain" and "attachment" not in content_disposition:
                           body = part.get_payload(decode=True).decode()
                           break
               else:
                   body = msg.get_payload(decode=True).decode()
              
               extracted_data.append({"subject": subject, "body": body})
              
   mail.logout()
   return extracted_data


# Execution Block for testing
if __name__ == "__main__":
   notices = fetch_campus_notices()
   for notice in notices:
       print(f"Subject: {notice['subject']}")
       print(f"Body snippet: {notice['body'][:100]}...\n")
       print("-" * 40)
