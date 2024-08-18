from elasticsearch_client import es

INDEX_NAME = 'posts'

def search_posts(query):
    response = es.search(index=INDEX_NAME, body={
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["title", "content", "excerpt"]
            }
        }
    })
    return response['hits']['hits']
