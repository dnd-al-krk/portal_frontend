from os import environ
from settings.base import *

read_env = lambda e, d=None: environ[e] if e in environ else d

SECRET_KEY = read_env('PORTAL_SECRET')

DEBUG = False
TEMPLATE_DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': read_env('PORTAL_PROD_DB_NAME'),                      # Or path to database file if using sqlite3.
        'USER': read_env('PORTAL_PROD_DB_USER'),                      # Not used with sqlite3.
        'PASSWORD': read_env('PORTAL_PROD_DB_PASS'),                  # Not used with sqlite3.
        'HOST': read_env('PORTAL_PROD_DB_HOST'),                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

ALLOWED_HOSTS += [
    'alkrk.toady.org'
]

# EMAIL SETTINGS
EMAIL_HOST = read_env('PORTAL_PROD_EMAIL_HOST')
EMAIL_PORT = read_env('PORTAL_PROD_EMAIL_PORT')
EMAIL_HOST_USER = read_env('PORTAL_PROD_EMAIL_USERNAME')
EMAIL_HOST_PASSWORD = read_env('PORTAL_PROD_EMAIL_PASSWORD')

ROOT_URL = 'http://alkrk.toady.org'
