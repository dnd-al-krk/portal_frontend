from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string


def send_email(to, subject, template, context):
    message = render_to_string(template, context)

    email = EmailMessage(
        subject, message, to=to, from_email=settings.EMAIL_FROM
    )
    email.send(fail_silently=True)
