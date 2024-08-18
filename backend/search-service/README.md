project-root/
├── backend/
│ ├── cms/ # Existing Django CMS service
│ └── search/ # New FastAPI search service
│ ├── app/
│ │ ├── main.py # FastAPI app entry point
│ │ ├── models.py # Pydantic models for request validation
│ │ ├── schemas.py # Schemas for request and response
│ │ ├── search.py # Search logic and routes
│ │ ├── utils.py # Utility functions
│ │ └── config.py # Configuration settings
│ ├── Dockerfile # Dockerfile for the search service
│ ├── requirements.txt # Python dependencies
│ └── docker-compose.yml # Docker Compose for the search service
├── docker-compose.yml # Main Docker Compose file
└── .gitlab-ci.yml # GitLab CI/CD configuration
