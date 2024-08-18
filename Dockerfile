# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file from the cms directory and install dependencies
COPY backend/cms/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY backend/cms ./

# Command to run the Celery worker
CMD ["celery", "-A", "myproject", "worker", "--loglevel=info"]
