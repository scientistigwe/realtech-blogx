"""
WSGI config for realtech_blogx project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
from pathlib import Path

from django.core.wsgi import get_wsgi_application

BASE_DIR = Path(__file__).resolve().parent.parent

# Ensure the logs directory exists
logs_dir = BASE_DIR / 'logs'
logs_dir.mkdir(parents=True, exist_ok=True)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'realtech_blogx.settings')

application = get_wsgi_application()
