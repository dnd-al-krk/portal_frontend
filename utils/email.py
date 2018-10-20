from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string


def send_email(subject, template, context=None, *args, **kwargs):
    message = render_to_string(template, context)

    email = EmailMessage(
        subject, message, from_email=settings.EMAIL_FROM, *args, **kwargs
    )
    email.send(fail_silently=True)
