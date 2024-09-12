from elasticsearch_client import es

INDEX_NAME = 'posts'

def create_index():
    if not es.indices.exists(index=INDEX_NAME):
        es.indices.create(index=INDEX_NAME, body={
            "mappings": {
                "properties": {
                    "title": {"type": "text"},
                    "content": {"type": "text"},
                    "excerpt": {"type": "text"},
                    "author": {"type": "keyword"},
                    "tags": {"type": "keyword"},
                    "categories": {"type": "keyword"},
                }
            }
        })

def index_post(post_id, title, content, excerpt, author, tags, categories):
    doc = {
        "title": title,
        "content": content,
        "excerpt": excerpt,
        "author": author,
        "tags": tags,
        "categories": categories
    }
    es.index(index=INDEX_NAME, id=post_id, document=doc)

def delete_post(post_id):
    es.delete(index=INDEX_NAME, id=post_id)
