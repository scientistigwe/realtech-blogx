from django.db import models
from cms.models.tag_model import Tag
from django.utils.text import slugify
from cms.models.custom_user_model import CustomUser
from django.contrib.postgres.search import SearchVectorField
from django.db.models.signals import post_save
from django.dispatch import receiver
import os
from cms.models.time_stamped_model import TimeStampedModel

class PrimaryCategory(models.TextChoices):
    DATA = 'data', 'Data'
    DATA_ANALYSIS = 'data_analysis', 'Data Analysis'
    PYTHON_DEVELOPMENT = 'python_development', 'Python Development'
    BACKEND_DEVELOPMENT = 'backend_development', 'Backend Development'
    DEVOPS = 'devops', 'DevOps'
    CLOUD_ENGINEERING = 'cloud_engineering', 'Cloud Engineering'
    ARTIFICIAL_INTELLIGENCE = 'artificial_intelligence', 'Artificial Intelligence'
    MACHINE_LEARNING = 'machine_learning', 'Machine Learning'
    DATA_SCIENCE = 'data_science', 'Data Science'
    WEB_DEVELOPMENT = 'web_development', 'Web Development'
    MOBILE_DEVELOPMENT = 'mobile_development', 'Mobile Development'
    SECURITY = 'security', 'Security'
    GAME_DEVELOPMENT = 'game_development', 'Game Development'

class Subcategory(models.TextChoices):
    # Data Subcategories
    DATA_SCIENCE = 'data_science', 'Data Science'
    DATA_ENGINEERING = 'data_engineering', 'Data Engineering'
    BIG_DATA = 'big_data', 'Big Data'
    DATA_VISUALIZATION = 'data_visualization', 'Data Visualization'
    DATABASES = 'databases', 'Databases'
    DATA_PRIVACY_SECURITY = 'data_privacy_security', 'Data Privacy and Security'
    DATA_MIGRATION = 'data_migration', 'Data Migration'
    ETL = 'etl', 'ETL (Extract, Transform, Load)'
    DATA_CLEANING = 'data_cleaning', 'Data Cleaning'
    DATA_INTEGRATION = 'data_integration', 'Data Integration'
    DATA_GOVERNANCE = 'data_governance', 'Data Governance'

    # Data Analysis Subcategories
    STATISTICAL_ANALYSIS = 'statistical_analysis', 'Statistical Analysis'
    MACHINE_LEARNING = 'machine_learning', 'Machine Learning'
    NLP = 'nlp', 'Natural Language Processing (NLP)'
    DATA_MINING = 'data_mining', 'Data Mining'
    PREDICTIVE_ANALYTICS = 'predictive_analytics', 'Predictive Analytics'
    TIME_SERIES_ANALYSIS = 'time_series_analysis', 'Time Series Analysis'
    BUSINESS_INTELLIGENCE = 'business_intelligence', 'Business Intelligence'
    TEXT_ANALYSIS = 'text_analysis', 'Text Analysis'
    SENTIMENT_ANALYSIS = 'sentiment_analysis', 'Sentiment Analysis'

    # Python Development Subcategories
    PYTHON_BASICS = 'python_basics', 'Python Basics'
    PYTHON_LIBRARIES = 'python_libraries', 'Python Libraries'
    DJANGO_FRAMEWORK = 'django_framework', 'Django Framework'
    FLASK_FRAMEWORK = 'flask_framework', 'Flask Framework'
    PYTHON_FOR_DATA_SCIENCE = 'python_for_data_science', 'Python for Data Science'
    PYTHON_FOR_WEB_DEVELOPMENT = 'python_for_web_development', 'Python for Web Development'
    PYTHON_FOR_SCIENTIFIC_COMPUTING = 'python_for_scientific_computing', 'Python for Scientific Computing'
    PYTHON_AUTOMATION = 'python_automation', 'Python Automation'
    PYTHON_FOR_NETWORKING = 'python_for_networking', 'Python for Networking'
    PYTHON_FOR_TESTING = 'python_for_testing', 'Python for Testing'

    # Backend Development Subcategories
    API_DEVELOPMENT = 'api_development', 'API Development'
    MICROSERVICES_ARCHITECTURE = 'microservices_architecture', 'Microservices Architecture'
    DATABASE_DESIGN = 'database_design', 'Database Design'
    WEB_FRAMEWORKS = 'web_frameworks', 'Web Frameworks'
    SERVER_ADMINISTRATION = 'server_administration', 'Server Administration'
    PERFORMANCE_TUNING = 'performance_tuning', 'Performance Tuning'
    CACHE_MANAGEMENT = 'cache_management', 'Cache Management'
    BACKEND_SECURITY = 'backend_security', 'Backend Security'
    APPLICATION_ARCHITECTURE = 'application_architecture', 'Application Architecture'
    MESSAGE_BROKERS = 'message_brokers', 'Message Brokers'

    # DevOps Subcategories
    CI_CD_PIPELINES = 'ci_cd_pipelines', 'CI/CD Pipelines'
    IAC = 'infrastructure_as_code', 'Infrastructure as Code (IaC)'
    CONTAINERIZATION = 'containerization', 'Containerization'
    CLOUD_PLATFORMS = 'cloud_platforms', 'Cloud Platforms'
    MONITORING_LOGGING = 'monitoring_logging', 'Monitoring and Logging'
    DEVOPS_TOOLS = 'devops_tools', 'DevOps Tools'
    SECURITY_OPERATIONS = 'security_operations', 'Security Operations'
    CONFIGURATION_MANAGEMENT = 'configuration_management', 'Configuration Management'
    SYSTEM_AUTOMATION = 'system_automation', 'System Automation'
    BUILD_AUTOMATION = 'build_automation', 'Build Automation'

    # Cloud Engineering Subcategories
    CLOUD_COMPUTING_FUNDAMENTALS = 'cloud_computing_fundamentals', 'Cloud Computing Fundamentals'
    CLOUD_SECURITY = 'cloud_security', 'Cloud Security'
    SERVERLESS_COMPUTING = 'serverless_computing', 'Serverless Computing'
    CLOUD_MIGRATION = 'cloud_migration', 'Cloud Migration'
    CLOUD_COST_OPTIMIZATION = 'cloud_cost_optimization', 'Cloud Cost Optimization'
    MULTICLOUD_STRATEGY = 'multicloud_strategy', 'Multicloud Strategy'
    CLOUD_NATIVES = 'cloud_natives', 'Cloud Natives'
    CLOUD_MONITORING = 'cloud_monitoring', 'Cloud Monitoring'
    CLOUD_AUTOMATION = 'cloud_automation', 'Cloud Automation'
    EDGE_COMPUTING = 'edge_computing', 'Edge Computing'

    # Artificial Intelligence Subcategories
    GENERAL_AI = 'general_ai', 'General AI'
    COMPUTER_VISION = 'computer_vision', 'Computer Vision'
    ROBOTICS = 'robotics', 'Robotics'
    REINFORCEMENT_LEARNING = 'reinforcement_learning', 'Reinforcement Learning'
    AI_ETHICS = 'ai_ethics', 'AI Ethics'
    AI_POLICY = 'ai_policy', 'AI Policy'
    KNOWLEDGE_GRAPH = 'knowledge_graph', 'Knowledge Graph'

    # Machine Learning Subcategories
    SUPERVISED_LEARNING = 'supervised_learning', 'Supervised Learning'
    UNSUPERVISED_LEARNING = 'unsupervised_learning', 'Unsupervised Learning'
    DEEP_LEARNING = 'deep_learning', 'Deep Learning'
    NEURAL_NETWORKS = 'neural_networks', 'Neural Networks'
    MODEL_EVALUATION = 'model_evaluation', 'Model Evaluation'
    FEATURE_ENGINEERING = 'feature_engineering', 'Feature Engineering'
    HYPERPARAMETER_TUNING = 'hyperparameter_tuning', 'Hyperparameter Tuning'
    ML_PIPELINES = 'ml_pipelines', 'ML Pipelines'

    # Data Science Subcategories
    EXPLORATORY_DATA_ANALYSIS = 'exploratory_data_analysis', 'Exploratory Data Analysis'
    STATISTICAL_MODELING = 'statistical_modeling', 'Statistical Modeling'
    DATA_MANAGEMENT = 'data_management', 'Data Management'
    DATA_DISCOVERY = 'data_discovery', 'Data Discovery'
    DATA_QUALITY = 'data_quality', 'Data Quality'
    DATA_SHARING = 'data_sharing', 'Data Sharing'

    # Web Development Subcategories
    FRONTEND_DEVELOPMENT = 'frontend_development', 'Frontend Development'
    JAVASCRIPT_FRAMEWORKS = 'javascript_frameworks', 'JavaScript Frameworks'
    RESPONSIVE_DESIGN = 'responsive_design', 'Responsive Design'
    WEB_PERFORMANCE = 'web_performance', 'Web Performance'
    USER_EXPERIENCE = 'user_experience', 'User Experience (UX)'
    USER_INTERFACE = 'user_interface', 'User Interface (UI)'

    # Mobile Development Subcategories
    ANDROID_DEVELOPMENT = 'android_development', 'Android Development'
    IOS_DEVELOPMENT = 'ios_development', 'iOS Development'
    CROSS_PLATFORM_DEVELOPMENT = 'cross_platform_development', 'Cross-Platform Development'
    MOBILE_USER_EXPERIENCE = 'mobile_user_experience', 'Mobile User Experience'
    MOBILE_SECURITY = 'mobile_security', 'Mobile Security'
    MOBILE_PERFORMANCE = 'mobile_performance', 'Mobile Performance'

    # Security Subcategories
    NETWORK_SECURITY = 'network_security', 'Network Security'
    APPLICATION_SECURITY = 'application_security', 'Application Security'
    PENETRATION_TESTING = 'penetration_testing', 'Penetration Testing'
    INCIDENT_RESPONSE = 'incident_response', 'Incident Response'
    VULNERABILITY_MANAGEMENT = 'vulnerability_management', 'Vulnerability Management'
    SECURITY_COMPLIANCE = 'security_compliance', 'Security Compliance'

    # Game Development Subcategories
    GAME_ENGINE = 'game_engine', 'Game Engine'
    GAME_DESIGN = 'game_design', 'Game Design'
    THREED_MODELING = '3d_modeling', '3D Modeling'
    GAME_ANIMATION = 'game_animation', 'Game Animation'
    MULTIPLAYER_GAMING = 'multiplayer_gaming', 'Multiplayer Gaming'
    VR_AR_DEVELOPMENT = 'vr_ar_development', 'VR/AR Development'


def post_thumbnail_upload_to(instance, filename):
    return os.path.join('posts', f'{instance.slug}/thumbnails', filename)

class Post(TimeStampedModel):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]

    title = models.CharField(max_length=255, db_index=True)
    content = models.TextField()
    excerpt = models.TextField(blank=True, null=True)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='posts')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    meta_description = models.TextField(blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    publication_date = models.DateField(null=True, blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    is_public = models.BooleanField(default=True)
    thumbnail = models.ImageField(upload_to=post_thumbnail_upload_to, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    primary_category = models.CharField(max_length=50, choices=PrimaryCategory.choices, default=PrimaryCategory.DATA)
    subcategory = models.CharField(max_length=50, choices=Subcategory.choices, blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name='posts', blank=True)
    view_count = models.PositiveIntegerField(default=0)
    upvotes = models.PositiveIntegerField(default=0)
    downvotes = models.PositiveIntegerField(default=0)
    search_vector = SearchVectorField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['view_count']),
            models.Index(fields=['search_vector']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.excerpt:
            self.excerpt = self.generate_excerpt()
        super().save(*args, **kwargs)

    def generate_excerpt(self):
        return self.content[:100] + '...' if self.content else ''

    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])

    def upvote(self):
        self.upvotes += 1
        self.save(update_fields=['upvotes'])

    def downvote(self):
        self.downvotes += 1
        self.save(update_fields=['downvotes'])

    def update_search_vector(self):
        from django.contrib.postgres.search import SearchVector
        Post.objects.filter(id=self.id).update(search_vector=SearchVector('title', 'content'))

@receiver(post_save, sender=Post)
def update_post_search_vector(sender, instance, **kwargs):
    instance.update_search_vector()

class PostEngagement(TimeStampedModel):
    post = models.OneToOneField(Post, related_name='engagement', on_delete=models.CASCADE)
    clicks = models.PositiveIntegerField(default=0)
    sessions = models.PositiveIntegerField(default=0)
    conversions = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def increment_clicks(self):
        self.clicks += 1
        self.save(update_fields=['clicks'])

    @property
    def score(self):
        return self.clicks + self.sessions * 2 + self.conversions * 3

    def __str__(self):
        return f'Engagement metrics for post {self.post.title}'
    