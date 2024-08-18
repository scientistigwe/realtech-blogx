from elasticsearch_client import es, ELASTICSEARCH_INDEX

def search_posts(query, category_ids=None, tag_ids=None):
    search_body = {
        'query': {
            'bool': {
                'must': [
                    {'multi_match': {
                        'query': query,
                        'fields': ['title', 'content', 'excerpt']
                    }}
                ],
                'filter': []
            }
        }
    }

    if category_ids:
        search_body['query']['bool']['filter'].append({
            'terms': {'categories': category_ids}
        })

    if tag_ids:
        search_body['query']['bool']['filter'].append({
            'terms': {'tags': tag_ids}
        })

    response = es.search(index=ELASTICSEARCH_INDEX, body=search_body)
    return response['hits']['hits']
