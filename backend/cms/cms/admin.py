from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib import admin
from .models import CustomUser, Post, Comment, Notification, Category, Tag

"""
Admin Interface Configuration for CustomUser Model
"""

class CustomUserAdmin(BaseUserAdmin):
    """
    Custom User Admin Interface
    
    This class extends BaseUserAdmin to customize the admin interface for CustomUser model.
    
    Attributes:
        model (CustomUser): The model this admin interface represents.
        list_display: Fields displayed in the changelist view.
        search_fields: Fields searchable in the changelist view.
        readonly_fields: Fields that cannot be edited in the change form.
        filter_horizontal: Many-to-many fields displayed in a horizontal box.
        list_filter: Fields used for filtering in the changelist view.
        fieldsets: Grouped fields displayed in the change form.
        add_fieldsets: Fields displayed when adding a new user.
        ordering: Default ordering for the changelist view.
    
    Methods:
        None
    
    Notes:
        - This admin interface provides a comprehensive view of CustomUser model attributes.
        - It allows easy management of user permissions through filter_horizontal.
        - The fieldsets grouping logically organizes user information.
    """
    model = CustomUser
    list_display = ('username', 'email', 'bio', 'website', 'location', 'last_active')
    search_fields = ('username', 'email', 'bio', 'website')
    readonly_fields = ('last_active',)
    filter_horizontal = ('groups', 'user_permissions')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'bio', 'website', 'location')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'last_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    ordering = ('username',)

"""
Admin Interface Configuration for Post Model
"""

class PostAdmin(admin.ModelAdmin):
    """
    Admin Interface for Post Model
    
    This class customizes the admin interface for the Post model.
    
    Attributes:
        list_display: Fields displayed in the changelist view.
        list_filter: Fields used for filtering in the changelist view.
        search_fields: Fields searchable in the changelist view.
        readonly_fields: Fields that cannot be edited in the change form.
        date_hierarchy: Field used for hierarchical date-based filtering.
        actions: Custom bulk actions available on the changelist view.
    
    Methods:
        publish_posts: Publishes selected posts.
        unpublish_posts: Unpublishes selected posts.
    
    Notes:
        - This admin interface provides a comprehensive view of Post model attributes.
        - It allows easy filtering and searching of posts based on various criteria.
        - Custom actions are implemented for bulk publishing and unpublishing of posts.
    """
    list_display = ('id', 'title', 'author', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at', 'author__username')
    search_fields = ('title', 'content', 'author__username')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    actions = ['publish_posts', 'unpublish_posts']

    def publish_posts(self, request, queryset):

        """
        Publishes selected posts
        
        Args:
            request: The current HTTP request object.
            queryset: The queryset of posts to be published.
        
        Returns:
            int: Number of posts successfully published.
        
        Notes:
            - Updates the status of selected posts to 'published'.
            - Displays a success message to the user.
        """
        updated = queryset.update(status='published')
        self.message_user(request, f'{updated} posts were successfully published.')

    def unpublish_posts(self, request, queryset):
        """
        Unpublishes selected posts
        
        Args:
            request: The current HTTP request object.
            queryset: The queryset of posts to be unpublished.
        
        Returns:
            int: Number of posts successfully unpublished.
        
        Notes:
            - Updates the status of selected posts to 'draft'.
            - Displays a success message to the user.
        """
        updated = queryset.update(status='draft')
        self.message_user(request, f'{updated} posts were successfully unpublished.')

    publish_posts.short_description = "Publish selected posts"
    unpublish_posts.short_description = "Unpublish selected posts"
"""
Admin Interface Configurations for Other Models
"""

# Comment Admin
class CommentAdmin(admin.ModelAdmin):
    """
    Admin Interface for Comment Model
    
    This class customizes the admin interface for the Comment model.
    
    Attributes:
        list_display: Fields displayed in the changelist view.
        list_filter: Fields used for filtering in the changelist view.
        search_fields: Fields searchable in the changelist view.
        readonly_fields: Fields that cannot be edited in the change form.
    
    Notes:
        - Provides a comprehensive view of Comment model attributes.
        - Allows easy filtering and searching of comments.
    """
class CommentAdmin(admin.ModelAdmin):
    list_display = ('post', 'author', 'content', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at', 'author__username')
    search_fields = ('content', 'author__username', 'post__title')
    readonly_fields = ('created_at', 'updated_at')

# Notification Admin
class NotificationAdmin(admin.ModelAdmin):
    """
    Admin Interface for Notification Model
    
    This class customizes the admin interface for the Notification model.
    
    Attributes:
        list_display: Fields displayed in the changelist view.
        list_filter: Fields used for filtering in the changelist view.
        search_fields: Fields searchable in the changelist view.
        readonly_fields: Fields that cannot be edited in the change form.
    
    Notes:
        - Provides a comprehensive view of Notification model attributes.
        - Allows easy filtering and searching of notifications.
    """
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('user__username', 'message')
    readonly_fields = ('created_at',)

# Category Admin
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin Interface for Category Model
    
    This class customizes the admin interface for the Category model.
    
    Attributes:
        list_display: Fields displayed in the changelist view.
        prepopulated_fields: Fields automatically populated based on another field.
        search_fields: Fields searchable in the changelist view.
    
    Notes:
        - Provides a comprehensive view of Category model attributes.
        - Implements automatic slug generation based on category name.
    """
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

# Tag Admin
class TagAdmin(admin.ModelAdmin):
    """
    Admin Interface for Tag Model
    
    This class customizes the admin interface for the Tag model.
    
    Attributes:
        list_display: Fields displayed in the changelist view.
        prepopulated_fields: Fields automatically populated based on another field.
        search_fields: Fields searchable in the changelist view.
    
    Notes:
        - Provides a comprehensive view of Tag model attributes.
        - Implements automatic slug generation based on tag name.
    """
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

# Register models
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Notification, NotificationAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Tag, TagAdmin)
