// Enum values from Django models
export const primaryCategories = [
  { value: "data", label: "Data" },
  { value: "data_analysis", label: "Data Analysis" },
  { value: "python_development", label: "Python Development" },
  { value: "backend_development", label: "Backend Development" },
  { value: "devops", label: "DevOps" },
  { value: "cloud_engineering", label: "Cloud Engineering" },
  { value: "artificial_intelligence", label: "Artificial Intelligence" },
  { value: "machine_learning", label: "Machine Learning" },
  { value: "data_science", label: "Data Science" },
  { value: "web_development", label: "Web Development" },
  { value: "mobile_development", label: "Mobile Development" },
  { value: "security", label: "Security" },
  { value: "game_development", label: "Game Development" },
];

export const subcategories = {
  data: [
    { value: "data_science", label: "Data Science" },
    { value: "data_engineering", label: "Data Engineering" },
    { value: "big_data", label: "Big Data" },
    { value: "data_visualization", label: "Data Visualization" },
    { value: "databases", label: "Databases" },
    { value: "data_privacy_security", label: "Data Privacy and Security" },
    { value: "data_migration", label: "Data Migration" },
    { value: "etl", label: "ETL (Extract, Transform, Load)" },
    { value: "data_cleaning", label: "Data Cleaning" },
    { value: "data_integration", label: "Data Integration" },
    { value: "data_governance", label: "Data Governance" },
  ],
  data_analysis: [
    { value: "statistical_analysis", label: "Statistical Analysis" },
    { value: "machine_learning", label: "Machine Learning" },
    { value: "nlp", label: "Natural Language Processing (NLP)" },
    { value: "data_mining", label: "Data Mining" },
    { value: "predictive_analytics", label: "Predictive Analytics" },
    { value: "time_series_analysis", label: "Time Series Analysis" },
    { value: "business_intelligence", label: "Business Intelligence" },
    { value: "text_analysis", label: "Text Analysis" },
    { value: "sentiment_analysis", label: "Sentiment Analysis" },
  ],
  python_development: [
    { value: "python_basics", label: "Python Basics" },
    { value: "python_libraries", label: "Python Libraries" },
    { value: "django_framework", label: "Django Framework" },
    { value: "flask_framework", label: "Flask Framework" },
    { value: "python_for_data_science", label: "Python for Data Science" },
    {
      value: "python_for_web_development",
      label: "Python for Web Development",
    },
    {
      value: "python_for_scientific_computing",
      label: "Python for Scientific Computing",
    },
    { value: "python_automation", label: "Python Automation" },
    { value: "python_for_networking", label: "Python for Networking" },
    { value: "python_for_testing", label: "Python for Testing" },
  ],
  backend_development: [
    { value: "api_development", label: "API Development" },
    {
      value: "microservices_architecture",
      label: "Microservices Architecture",
    },
    { value: "database_design", label: "Database Design" },
    { value: "web_frameworks", label: "Web Frameworks" },
    { value: "server_administration", label: "Server Administration" },
    { value: "performance_tuning", label: "Performance Tuning" },
    { value: "cache_management", label: "Cache Management" },
    { value: "backend_security", label: "Backend Security" },
    { value: "application_architecture", label: "Application Architecture" },
    { value: "message_brokers", label: "Message Brokers" },
  ],
  devops: [
    { value: "ci_cd_pipelines", label: "CI/CD Pipelines" },
    { value: "infrastructure_as_code", label: "Infrastructure as Code (IaC)" },
    { value: "containerization", label: "Containerization" },
    { value: "cloud_platforms", label: "Cloud Platforms" },
    { value: "monitoring_logging", label: "Monitoring and Logging" },
    { value: "devops_tools", label: "DevOps Tools" },
    { value: "security_operations", label: "Security Operations" },
    { value: "configuration_management", label: "Configuration Management" },
    { value: "system_automation", label: "System Automation" },
    { value: "build_automation", label: "Build Automation" },
  ],
  cloud_engineering: [
    {
      value: "cloud_computing_fundamentals",
      label: "Cloud Computing Fundamentals",
    },
    { value: "cloud_security", label: "Cloud Security" },
    { value: "serverless_computing", label: "Serverless Computing" },
    { value: "cloud_migration", label: "Cloud Migration" },
    { value: "cloud_cost_optimization", label: "Cloud Cost Optimization" },
    { value: "multicloud_strategy", label: "Multicloud Strategy" },
    { value: "cloud_natives", label: "Cloud Natives" },
    { value: "cloud_monitoring", label: "Cloud Monitoring" },
    { value: "cloud_automation", label: "Cloud Automation" },
    { value: "edge_computing", label: "Edge Computing" },
  ],
  artificial_intelligence: [
    { value: "general_ai", label: "General AI" },
    { value: "computer_vision", label: "Computer Vision" },
    { value: "robotics", label: "Robotics" },
    { value: "reinforcement_learning", label: "Reinforcement Learning" },
    { value: "ai_ethics", label: "AI Ethics" },
    { value: "ai_policy", label: "AI Policy" },
    { value: "knowledge_graph", label: "Knowledge Graph" },
  ],
  machine_learning: [
    { value: "supervised_learning", label: "Supervised Learning" },
    { value: "unsupervised_learning", label: "Unsupervised Learning" },
    { value: "deep_learning", label: "Deep Learning" },
    { value: "neural_networks", label: "Neural Networks" },
    { value: "model_evaluation", label: "Model Evaluation" },
    { value: "feature_engineering", label: "Feature Engineering" },
    { value: "hyperparameter_tuning", label: "Hyperparameter Tuning" },
    { value: "ml_pipelines", label: "ML Pipelines" },
  ],
  data_science: [
    { value: "exploratory_data_analysis", label: "Exploratory Data Analysis" },
    { value: "statistical_modeling", label: "Statistical Modeling" },
    { value: "data_management", label: "Data Management" },
    { value: "data_discovery", label: "Data Discovery" },
    { value: "data_quality", label: "Data Quality" },
    { value: "data_sharing", label: "Data Sharing" },
  ],
  web_development: [
    { value: "frontend_development", label: "Frontend Development" },
    { value: "javascript_frameworks", label: "JavaScript Frameworks" },
    { value: "responsive_design", label: "Responsive Design" },
    { value: "web_performance", label: "Web Performance" },
    { value: "user_experience", label: "User Experience (UX)" },
    { value: "user_interface", label: "User Interface (UI)" },
  ],
  mobile_development: [
    { value: "android_development", label: "Android Development" },
    { value: "ios_development", label: "iOS Development" },
    {
      value: "cross_platform_development",
      label: "Cross-Platform Development",
    },
    { value: "mobile_user_experience", label: "Mobile User Experience" },
    { value: "mobile_security", label: "Mobile Security" },
    { value: "mobile_performance", label: "Mobile Performance" },
  ],
  security: [
    { value: "network_security", label: "Network Security" },
    { value: "application_security", label: "Application Security" },
    { value: "penetration_testing", label: "Penetration Testing" },
    { value: "incident_response", label: "Incident Response" },
    { value: "vulnerability_management", label: "Vulnerability Management" },
    { value: "security_compliance", label: "Security Compliance" },
  ],
  game_development: [
    { value: "game_engine", label: "Game Engine" },
    { value: "game_design", label: "Game Design" },
    { value: "3d_modeling", label: "3D Modeling" },
    { value: "game_animation", label: "Game Animation" },
    { value: "multiplayer_gaming", label: "Multiplayer Gaming" },
    { value: "vr_ar_development", label: "VR/AR Development" },
  ],
};
