# Generated by Django 5.1 on 2024-09-06 09:56

from django.db import migrations, models
import django.db.models.deletion


def add_categories_and_subcategories(apps, schema_editor):
    Category = apps.get_model('cms', 'Category')

    categories = {
        'Data': [
            'Data Science', 'Data Engineering', 'Big Data', 'Data Visualization',
            'Databases', 'Data Privacy and Security', 'Data Migration', 'ETL',
            'Data Cleaning', 'Data Integration', 'Data Governance'
        ],
        'Data Analysis': [
            'Statistical Analysis', 'Machine Learning', 'Natural Language Processing (NLP)',
            'Data Mining', 'Predictive Analytics', 'Time Series Analysis',
            'Business Intelligence', 'Text Analysis', 'Sentiment Analysis'
        ],
        'Python Development': [
            'Python Basics', 'Python Libraries', 'Django Framework', 'Flask Framework',
            'Python for Data Science', 'Python for Web Development',
            'Python for Scientific Computing', 'Python Automation',
            'Python for Networking', 'Python for Testing'
        ],
        'Backend Development': [
            'API Development', 'Microservices Architecture', 'Database Design',
            'Web Frameworks', 'Server Administration', 'Performance Tuning',
            'Cache Management', 'Backend Security', 'Application Architecture',
            'Message Brokers'
        ],
        'DevOps': [
            'CI/CD Pipelines', 'Infrastructure as Code (IaC)', 'Containerization',
            'Cloud Platforms', 'Monitoring and Logging', 'DevOps Tools',
            'Security Operations', 'Configuration Management', 'System Automation',
            'Build Automation'
        ],
        'Cloud Engineering': [
            'Cloud Computing Fundamentals', 'Cloud Security', 'Serverless Computing',
            'Cloud Migration', 'Cloud Cost Optimization', 'Multicloud Strategy',
            'Cloud Natives', 'Cloud Monitoring', 'Cloud Automation', 'Edge Computing'
        ],
        'Artificial Intelligence': [
            'General AI', 'Computer Vision', 'Robotics', 'Reinforcement Learning',
            'AI Ethics', 'AI Policy', 'Knowledge Graph'
        ],
        'Machine Learning': [
            'Supervised Learning', 'Unsupervised Learning', 'Deep Learning',
            'Neural Networks', 'Model Evaluation', 'Feature Engineering',
            'Hyperparameter Tuning', 'ML Pipelines'
        ],
        'Data Science': [
            'Exploratory Data Analysis', 'Statistical Modeling', 'Data Management',
            'Data Discovery', 'Data Quality', 'Data Sharing'
        ],
        'Web Development': [
            'Frontend Development', 'JavaScript Frameworks', 'Responsive Design',
            'Web Performance', 'User Experience (UX)', 'User Interface (UI)'
        ],
        'Mobile Development': [
            'Android Development', 'iOS Development', 'Cross-Platform Development',
            'Mobile User Experience', 'Mobile Security', 'Mobile Performance'
        ],
        'Security': [
            'Network Security', 'Application Security', 'Penetration Testing',
            'Incident Response', 'Vulnerability Management', 'Security Compliance'
        ],
        'Game Development': [
            'Game Engine', 'Game Design', '3D Modeling', 'Game Animation',
            'Multiplayer Gaming', 'VR/AR Development'
        ],
    }

    # Create primary categories and subcategories
    primary_category_instances = {}
    for primary_category_name, subcategories in categories.items():
        primary_category, created = Category.objects.get_or_create(
            name=primary_category_name,
            defaults={'slug': primary_category_name.lower().replace(' ', '-'), 'parent_id': None}
        )
        primary_category_instances[primary_category_name] = primary_category
        
        for subcategory_name in subcategories:
            Category.objects.get_or_create(
                name=subcategory_name,
                defaults={
                    'slug': subcategory_name.lower().replace(' ', '-'),
                    'parent_id': primary_category.id
                }
            )


class Migration(migrations.Migration):

    dependencies = [
        ('cms', '0002_rename_parent_category_parents'),
    ]

    operations = [
        migrations.RenameField(
            model_name='category',
            old_name='parents',
            new_name='parent',
        ),
        migrations.AlterField(
            model_name='post',
            name='category',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='post', to='cms.category'),
        ),
        migrations.RunPython(
            code=add_categories_and_subcategories,
            reverse_code=migrations.RunPython.noop,
        ),
    ]
