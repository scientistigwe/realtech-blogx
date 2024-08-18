from pydantic import BaseModel
from typing import List, Optional

class PostBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    author: str
    status: str
    categories: List[str]
    tags: List[str]
    slug: str
    created_at: str
    updated_at: str

class PostCreate(PostBase):
    pass

class PostResponse(BaseModel):
    id: str
    title: str
    content: str
    excerpt: Optional[str] = None
    author: str
    status: str
    categories: List[str]
    tags: List[str]
    slug: str
    created_at: str
    updated_at: str
