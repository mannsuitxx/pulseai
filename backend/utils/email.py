import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

def send_email(to_email, subject, html_content):
    """
    Sends an email using the Brevo (Sendinblue) API.
    """
    try:
        sender_email = os.environ.get('EMAIL_ADDRESS')
        api_key = os.environ.get('BREVO_API_KEY') # Use BREVO_API_KEY
        print(f"DEBUG: BREVO_API_KEY being used: {api_key}")
        print(f"DEBUG: SENDER_EMAIL being used: {sender_email}")

        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = api_key

        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

        sender = {"name": "PulseAI", "email": sender_email} # Brevo requires sender name
        to = [{"email": to_email}]

        send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
            to=to,
            html_content=html_content,
            sender=sender,
            subject=subject
        )

        response = api_instance.send_transac_email(send_smtp_email)

        print(f"Email sent to {to_email} via Brevo. Response: {response}")

        return True, "Email sent successfully"

    except ApiException as e:
        print(f"Error sending email with Brevo API: {e}")
        return False, str(e)
    except Exception as e:
        print(f"An unexpected error occurred while sending email with Brevo: {e}")
        return False, str(e)
