from elasticsearch import Elasticsearch

# Initialize Elasticsearch client
es = Elasticsearch(["http://localhost:9200"])

def create_index(index_name: str):
    """Create an index with mappings."""
    if not es.indices.exists(index=index_name):
        es.indices.create(index=index_name, body={
            "mappings": {
                "properties": {
                    "title": {
                        "type": "text",
                        "fields": {
                            "autocomplete": {
                                "type": "completion"
                            }
                        }
                    },
                    "description": {
                        "type": "text"
                    }
                }
            }
        })
        print(f"Index '{index_name}' created.")
    else:
        print(f"Index '{index_name}' already exists.")

if __name__ == "__main__":
    index_name = "your_index_name"  # Replace with your actual index name
    create_index(index_name)
