from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
import uuid

class User(AbstractUser):
    """Extended user model for portfolio builder"""
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

class Template(models.Model):
    """Portfolio templates that users can choose from"""
    TEMPLATE_TYPES = [
        ('minimal', 'Minimal'),
        ('creative', 'Creative'),
        ('professional', 'Professional'),
        ('developer', 'Developer'),
        ('designer', 'Designer'),
        ('business', 'Business'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    template_type = models.CharField(max_length=20, choices=TEMPLATE_TYPES)
    html_content = models.TextField()  # Base HTML template
    css_content = models.TextField()   # Base CSS styles
    js_content = models.TextField(blank=True)  # Optional JavaScript
    preview_image = models.CharField(max_length=500, blank=True)  # URL to preview image
    is_premium = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.template_type})"

class Portfolio(models.Model):
    """User's portfolio instance based on a template"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='portfolios')
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    
    # Customizable content
    hero_title = models.CharField(max_length=200, default="Your Name")
    hero_subtitle = models.CharField(max_length=300, default="Your Professional Title")
    about_content = models.TextField(default="Tell your story here...")
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    social_linkedin = models.URLField(blank=True)
    social_github = models.URLField(blank=True)
    social_twitter = models.URLField(blank=True)
    
    # Custom HTML/CSS overrides
    custom_html = models.TextField(blank=True)
    custom_css = models.TextField(blank=True)
    
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = f"{self.user.username}-{uuid.uuid4().hex[:8]}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.title} by {self.user.username}"

class Project(models.Model):
    """Individual projects within a portfolio"""
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=200)
    description = models.TextField()
    technology_stack = models.CharField(max_length=500)  # Comma-separated technologies
    project_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    image_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)  # For ordering projects
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', '-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.portfolio.title}"

class Skill(models.Model):
    """Skills section for portfolios"""
    SKILL_CATEGORIES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('database', 'Database'),
        ('tools', 'Tools & Frameworks'),
        ('design', 'Design'),
        ('other', 'Other'),
    ]
    
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='skills')
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=SKILL_CATEGORIES)
    proficiency = models.PositiveIntegerField(default=50)  # Percentage 0-100
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['category', 'order']
    
    def __str__(self):
        return f"{self.name} ({self.proficiency}%)"

class Experience(models.Model):
    """Work experience section"""
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='experiences')
    company = models.CharField(max_length=200)
    position = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)  # Null for current job
    is_current = models.BooleanField(default=False)
    company_url = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.position} at {self.company}"
