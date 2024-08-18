from django.contrib import admin

# Import models from their respective files
from cms.models.custom_user_model import CustomUser
from cms.models.category_model import Category
from cms.models.tag_model import Tag
from cms.models.author_model import Author
from cms.models.post_model import Post, PostEngagement
from cms.models.comment_model import Comment

# Custom User Admin
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'bio', 'website', 'location', 'twitter_handle', 'facebook_profile', 'linkedin_profile', 'last_active')
    search_fields = ('username', 'email', 'bio', 'website', 'twitter_handle', 'facebook_profile', 'linkedin_profile')
    readonly_fields = ('last_active',)
    filter_horizontal = ('groups', 'user_permissions')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'bio', 'profile_image', 'website', 'location', 'twitter_handle', 'facebook_profile', 'linkedin_profile')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'last_active')}),
    )

# Category Admin
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    list_filter = ('parent',)
    ordering = ('name',)

# Tag Admin
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

# Author Admin
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'twitter_handle', 'facebook_profile', 'linkedin_profile')
    search_fields = ('user__username', 'location', 'twitter_handle', 'facebook_profile', 'linkedin_profile')
    readonly_fields = ('user',)

# Post Admin
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'status', 'primary_category', 'subcategory', 'publication_date', 'is_public')
    list_filter = ('status', 'primary_category', 'subcategory', 'tags')
    search_fields = ('title', 'content', 'excerpt', 'author__user__username')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at')
    filter_horizontal = ('tags',)
    date_hierarchy = 'created_at'

# Comment Admin with Bulk Moderation Actions
class CommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'author', 'content', 'sentiment_score', 'moderation_status', 'upvotes', 'downvotes')
    list_filter = ('moderation_status', 'post', 'author')
    search_fields = ('content', 'author__username', 'post__title')
    readonly_fields = ('created_at', 'updated_at')

    actions = ['approve_comments', 'reject_comments']

    def approve_comments(self, request, queryset):
        count = queryset.update(moderation_status='approved')
        self.message_user(request, f'{count} comments were successfully approved.')

    def reject_comments(self, request, queryset):
        count = queryset.update(moderation_status='rejected')
        self.message_user(request, f'{count} comments were successfully rejected.')

    approve_comments.short_description = "Approve selected comments"
    reject_comments.short_description = "Reject selected comments"

# Post Engagement Admin
class PostEngagementAdmin(admin.ModelAdmin):
    list_display = ('post', 'clicks', 'sessions', 'conversions', 'score')
    search_fields = ('post__title',)
    readonly_fields = ('created_at', 'updated_at', 'score')

# Register models with admin site
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(PostEngagement, PostEngagementAdmin)
