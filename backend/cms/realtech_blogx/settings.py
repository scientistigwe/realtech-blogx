"""
Django settings for RealTech BlogX project.

This file contains settings for both production and development environments.
It uses environment variables for configuration, which should be set in a .env file
or in the deployment environment.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
from corsheaders.defaults import default_headers
from decouple import config, UndefinedValueError
import os
import sys

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
try:
    SECRET_KEY = config('SECRET_KEY')
except UndefinedValueError:
    print("ERROR: SECRET_KEY is not set.")
    sys.exit(1)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', cast=bool, default=False)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='*').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_prometheus',
    'corsheaders',
    'rest_framework',
    'djoser',
    'cms',
    'drf_yasg',
    'drf_spectacular',
]

MIDDLEWARE = [
    'django_prometheus.middleware.PrometheusBeforeMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django_prometheus.middleware.PrometheusAfterMiddleware',
]

# Database configuration
def read_secret(secret_name):
    """Read a secret from a file."""
    try:
        with open(f'/run/secrets/{secret_name}', 'r') as secret_file:
            return secret_file.read().strip()
    except IOError:
        return None

DATABASES = {
    'default': {
        'ENGINE': config('DATABASE_ENGINE', default='django.db.backends.postgresql'),
        'NAME': config('DATABASE_NAME'),
        'USER': config('DATABASE_USER'),
        'PASSWORD': read_secret('db_password') or config('DATABASE_PASSWORD'),
        'HOST': config('DATABASE_HOST', default='db'),
        'PORT': config('DATABASE_PORT', default='5432'),
    }
}

# Validate database settings
if not all(DATABASES['default'].values()):
    print("ERROR: One or more database settings are missing.")
    sys.exit(1)

# CORS settings
CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000",
    "http://localhost:3001",
]
CORS_ALLOW_ALL_ORIGINS = DEBUG
CORS_ALLOWED_ORIGINS = CORS_ORIGIN_WHITELIST if DEBUG else [
    "https://your-production-domain.com",
]

CORS_ALLOW_HEADERS = list(default_headers) + ['x-csrftoken']
CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS + [
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]

# Authentication settings
AUTH_USER_MODEL = 'cms.CustomUser'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# Rest Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.UserRateThrottle',
        'rest_framework.throttling.AnonRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'user': '1000/hour',
        'anon': '100/minute',
    },
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.URLPathVersioning',
    'DEFAULT_VERSION': 'v1',
    'ALLOWED_VERSIONS': ['v1'],
    'VERSION_PARAM': 'version',
    'EXCEPTION_HANDLER': 'cms.exceptions.custom_exception_handler',
}

# Djoser Configuration
DJOSER = {
    'LOGIN_FIELD': 'username',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'USERNAME_CHANGED_EMAIL_CONFIRMATION': True,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    'SET_USERNAME_RETYPE': True,
    'SET_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'USERNAME_RESET_CONFIRM_URL': 'email/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': not DEBUG,
    'SEND_CONFIRMATION_EMAIL': not DEBUG,
    'TOKEN_MODEL': None,
    'SERIALIZERS': {
        'user_create': 'cms.serializers.CustomUserCreateSerializer',
        'user': 'cms.serializers.CustomUserSerializer',
        'current_user': 'cms.serializers.CustomUserSerializer',
        'user_delete': 'djoser.serializers.UserDeleteSerializer',
    },
}

# Simple JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
    'AUTH_COOKIE': 'access_token',
    'AUTH_COOKIE_HTTP_ONLY': True,
    'AUTH_COOKIE_PATH': '/',
    'AUTH_COOKIE_SECURE': not DEBUG,
    'AUTH_COOKIE_SAMESITE': 'Lax',
}

# Templates configuration
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# URLs configuration
ROOT_URLCONF = 'realtech_blogx.urls'
WSGI_APPLICATION = 'realtech_blogx.wsgi.application'

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
MEDIA_ROOT = BASE_DIR / 'media'

# Security settings
if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
else:
    SECURE_SSL_REDIRECT = False
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False

CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'None' if not DEBUG else 'Lax'
SESSION_COOKIE_SAMESITE = 'None' if not DEBUG else 'Lax'
CSRF_COOKIE_NAME = 'csrftoken'
CSRF_HEADER_NAME = 'HTTP_X_CSRFTOKEN'
CSRF_USE_SESSIONS = False

# Cache configuration
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': config('REDIS_URL', default='redis://127.0.0.1:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}

# Celery configuration
CELERY_BROKER_URL = config('CELERY_BROKER_URL', default='redis://redis:6379/0')
CELERY_RESULT_BACKEND = config('CELERY_RESULT_BACKEND', default='redis://redis:6379/0')

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Email Settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend' if not DEBUG else 'django.core.mail.backends.console.EmailBackend'
EMAIL_HOST = config('EMAIL_HOST', default='localhost')
EMAIL_PORT = config('EMAIL_PORT', cast=int, default=25)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', cast=bool, default=False)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@example.com')

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Swagger/OpenAPI settings
SPECTACULAR_SETTINGS = {
    'VERSION': '1.0.0',
    'TITLE': 'RealTech BlogX API',
    'DESCRIPTION': 'API for RealTech BlogX',
    'SERVERS': [
        {'url': 'http://localhost:8000', 'description': 'Local development server'},
        {'url': 'https://api.yourproductionurl.com', 'description': 'Production server'},
    ],
    'SCHEMA_PATH': '/schema/',
    'OPENAPI_VERSION': '3.0.2',
    'GENERATE_SCHEMA_PATH': 'schema.json',
    'DEFAULT_FILTER_OPERATORS': ['iexact', 'contains', 'in', 'range', 'gt', 'lt', 'gte', 'lte'],
    'DEFAULT_FILTER_FIELD_NAME': 'filter',
    'TAGS': [
        {'name': 'Auth', 'description': 'Authentication related endpoints'},
        {'name': 'Users', 'description': 'CRUD operations for users'},
        {'name': 'Posts', 'description': 'Endpoints for managing blog posts'},
        {'name': 'Comments', 'description': 'Endpoints for managing comments'},
        {'name': 'Notifications', 'description': 'Endpoints for handling notifications'},
    ],
}

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'django_debug.log'),
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'WARNING',
    },
}