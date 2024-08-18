# cms/models/utils.py

from django.utils.text import slugify

def media_upload_to(instance, filename):
    """
    Function to generate a path for uploaded files based on the instance and filename.
    """
    filename = slugify(filename)  # Sanitize the filename

    if hasattr(instance, 'user'):  # Check if the instance has a 'user' attribute
        return f'media/{instance.user.username}/{filename}'
    elif hasattr(instance, 'thumbnail'):  # Check if the instance has a 'thumbnail' attribute
        return f'post_thumbnails/{filename}'
    else:
        return f'uploads/{filename}'
