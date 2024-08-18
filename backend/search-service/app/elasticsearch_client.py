from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Fetch environment variables
ELASTICSEARCH_HOST = os.getenv('ELASTICSEARCH_HOST', 'localhost')
ELASTICSEARCH_PORT = int(os.getenv('ELASTICSEARCH_PORT', 9200))  # Convert to int
ELASTICSEARCH_SCHEME = os.getenv('ELASTICSEARCH_SCHEME', 'http')
ELASTICSEARCH_INDEX = os.getenv('ELASTICSEARCH_INDEX', 'posts')

# Initialize Elasticsearch client with the correct data types
es = Elasticsearch([{
    'host': ELASTICSEARCH_HOST,
    'port': ELASTICSEARCH_PORT,
    'scheme': ELASTICSEARCH_SCHEME
}])

def create_index():
    # Create the index if it doesn't exist
    if not es.indices.exists(index=ELASTICSEARCH_INDEX):
        es.indices.create(index=ELASTICSEARCH_INDEX, ignore=400)

def index_post(post):
    # Index a new post
    es.index(index=ELASTICSEARCH_INDEX, id=post['id'], body={
        'title': post['title'],
        'content': post['content'],
        'excerpt': post['excerpt'],
        'author': post['author'],
        'status': post['status'],
        'categories': post['categories'],
        'tags': post['tags'],
        'slug': post['slug'],
        'created_at': post['created_at'],
        'updated_at': post['updated_at'],
    })

def delete_post(post_id):
    # Delete a post by its ID
    es.delete(index=ELASTICSEARCH_INDEX, id=post_id, ignore=[400, 404])
