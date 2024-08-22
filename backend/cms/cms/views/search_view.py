from django.contrib.postgres.search import SearchQuery, SearchVector, SearchRank
from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from cms.models.post_model import Post
from cms.serializers.post_serializer import PostSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class SearchPostsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Handles searching for posts based on a query.
    URL: /search/posts/
    """
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content']

    @swagger_auto_schema(
        operation_description="Search for posts",
        manual_parameters=[
            openapi.Parameter('q', openapi.IN_QUERY, description="Search query", type=openapi.TYPE_STRING),
        ],
        responses={
            200: openapi.Response(
                description='Successful search',
                schema=PostSerializer(many=True)
            ),
            400: openapi.Response(
                description='Invalid search query',
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={})
            ),
            404: openapi.Response(
                description='No posts found',
                schema=openapi.Schema(type=openapi.TYPE_OBJECT, properties={})
            ),
        },
    )
    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if query:
            search_vector = SearchVector('title', 'content')
            search_query = SearchQuery(query)
            search_rank = SearchRank(search_vector, search_query)
            
            # Annotate the queryset with the search rank and filter by the search query
            queryset = Post.objects.annotate(rank=search_rank).filter(search=search_query).order_by('-rank')
        else:
            queryset = Post.objects.none()
        
        return queryset
