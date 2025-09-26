
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_email(to_email, subject, html_content):
    """
    Sends an email using the SendGrid API.
    """
    try:
        # It's a good practice to have a single, verified sender email
        sender_email = os.environ.get('EMAIL_ADDRESS') 
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        
        message = Mail(
            from_email=sender_email,
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )
        
        response = sg.send(message)
        
        # You can add more robust logging here if needed
        print(f"Email sent to {to_email}, status code: {response.status_code}")
        
        return True, "Email sent successfully"

    except Exception as e:
        # Log the exception for debugging
        print(f"Error sending email with SendGrid: {e}")
        return False, str(e)
