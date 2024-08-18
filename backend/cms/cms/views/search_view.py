from django.contrib.postgres.search import SearchQuery, SearchVector
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated  # Import the IsAuthenticated permission class
from cms.models.post_model import Post
from cms.serializers.post_serializer import PostSerializer

class SearchPostsView(generics.ListAPIView):
    """
    Handles searching for posts based on a query.
    URL: /search/posts/
    """
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('q')
        if query:
            search_vector = SearchVector('title', 'content')
            search_query = SearchQuery(query)
            return Post.objects.annotate(search=search_vector).filter(search=search_query)
        return Post.objects.all()
