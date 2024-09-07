from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from elasticsearch_client import create_index, index_post, delete_post
from crud import search_posts

app = FastAPI()

# Create Elasticsearch index
@app.on_event("startup")
async def startup_event():
    create_index()

# Index a post
@app.post("/index_post/")
async def index_post_endpoint(post: dict):
    index_post(post)
    return {"status": "success"}

# Delete a post
@app.delete("/delete_post/{post_id}")
async def delete_post_endpoint(post_id: str):
    delete_post(post_id)
    return {"status": "success"}

# Search posts
@app.get("/search/")
async def search(query: str, category_ids: Optional[List[str]] = Query(None), tag_ids: Optional[List[str]] = Query(None)):
    results = search_posts(query, category_ids, tag_ids)
    return {"results": results}
