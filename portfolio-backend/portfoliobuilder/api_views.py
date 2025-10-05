from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.http import JsonResponse, HttpResponse
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
import json

from .models import User, Portfolio, Project, Skill, Experience, Template
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer,
    PortfolioSerializer, PortfolioCreateSerializer, ProjectSerializer,
    SkillSerializer, ExperienceSerializer, TemplateSerializer,
    PortfolioExportSerializer
)

@api_view(['GET'])
def api_health_check(request):
    """Simple health check endpoint for the API"""
    return Response({
        'status': 'healthy',
        'message': 'Portfolio Builder API is running',
        'version': '2.0.0',
        'features': ['Authentication', 'Templates', 'HTML Export']
    })

# Authentication Views
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """User login endpoint"""
    serializer = UserLoginSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Login successful'
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """User logout endpoint"""
    try:
        request.user.auth_token.delete()
    except:
        pass
    logout(request)
    return Response({'message': 'Logout successful'})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    """Get current user profile"""
    return Response(UserSerializer(request.user).data)

# Template Views
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def templates_list(request):
    """Get all available templates"""
    templates = Template.objects.all()
    serializer = TemplateSerializer(templates, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def template_detail(request, template_id):
    """Get specific template details"""
    try:
        template = Template.objects.get(id=template_id)
        serializer = TemplateSerializer(template)
        return Response(serializer.data)
    except Template.DoesNotExist:
        return Response({'error': 'Template not found'}, status=status.HTTP_404_NOT_FOUND)

# Portfolio Views
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def portfolios_list(request):
    """Get user's portfolios or create new one"""
    if request.method == 'GET':
        portfolios = Portfolio.objects.filter(user=request.user)
        serializer = PortfolioSerializer(portfolios, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PortfolioCreateSerializer(data=request.data)
        if serializer.is_valid():
            portfolio = serializer.save(user=request.user)
            return Response(PortfolioSerializer(portfolio).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def portfolio_detail(request, portfolio_id):
    """Get, update, or delete specific portfolio"""
    try:
        portfolio = Portfolio.objects.get(id=portfolio_id, user=request.user)
    except Portfolio.DoesNotExist:
        return Response({'error': 'Portfolio not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = PortfolioSerializer(portfolio)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = PortfolioSerializer(portfolio, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        portfolio.delete()
        return Response({'message': 'Portfolio deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

# Project Views
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def portfolio_projects(request, portfolio_id):
    """Get or create projects for a portfolio"""
    try:
        portfolio = Portfolio.objects.get(id=portfolio_id, user=request.user)
    except Portfolio.DoesNotExist:
        return Response({'error': 'Portfolio not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        projects = Project.objects.filter(portfolio=portfolio)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(portfolio=portfolio)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# HTML Export View
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def export_portfolio(request):
    """Export portfolio as HTML file"""
    try:
        portfolio_id = request.data.get('portfolio_id')
        portfolio = Portfolio.objects.get(id=portfolio_id, user=request.user)
        
        # Generate HTML content
        html_content = generate_portfolio_html(portfolio)
        
        # Create HTTP response with HTML file
        response = HttpResponse(html_content, content_type='text/html')
        response['Content-Disposition'] = f'attachment; filename="{portfolio.slug}.html"'
        return response
        
    except Portfolio.DoesNotExist:
        return Response({'error': 'Portfolio not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def generate_portfolio_html(portfolio):
    """Generate complete HTML for portfolio export"""
    template = portfolio.template
    projects = portfolio.projects.all()
    skills = portfolio.skills.all()
    experiences = portfolio.experiences.all()
    
    # Basic HTML template structure
    html_template = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{portfolio.title}</title>
    <style>
        {template.css_content}
        {portfolio.custom_css}
    </style>
</head>
<body>
    <header>
        <h1>{portfolio.hero_title}</h1>
        <h2>{portfolio.hero_subtitle}</h2>
    </header>
    
    <section id="about">
        <h3>About</h3>
        <p>{portfolio.about_content}</p>
    </section>
    
    <section id="projects">
        <h3>Projects</h3>
        <div class="projects-grid">
            {"".join([f'''
            <div class="project">
                <h4>{project.title}</h4>
                <p>{project.description}</p>
                <p><strong>Technologies:</strong> {project.technology_stack}</p>
                {f'<a href="{project.project_url}" target="_blank">View Project</a>' if project.project_url else ''}
                {f'<a href="{project.github_url}" target="_blank">GitHub</a>' if project.github_url else ''}
            </div>
            ''' for project in projects])}
        </div>
    </section>
    
    <section id="skills">
        <h3>Skills</h3>
        <div class="skills-grid">
            {"".join([f'''
            <div class="skill">
                <span>{skill.name}</span>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: {skill.proficiency}%"></div>
                </div>
            </div>
            ''' for skill in skills])}
        </div>
    </section>
    
    <section id="experience">
        <h3>Experience</h3>
        {"".join([f'''
        <div class="experience">
            <h4>{exp.position} at {exp.company}</h4>
            <p class="duration">{exp.start_date} - {"Present" if exp.is_current else exp.end_date}</p>
            <p>{exp.description}</p>
        </div>
        ''' for exp in experiences])}
    </section>
    
    <section id="contact">
        <h3>Contact</h3>
        <p>Email: {portfolio.contact_email}</p>
        {f'<p>Phone: {portfolio.contact_phone}</p>' if portfolio.contact_phone else ''}
        {f'<a href="{portfolio.social_linkedin}" target="_blank">LinkedIn</a>' if portfolio.social_linkedin else ''}
        {f'<a href="{portfolio.social_github}" target="_blank">GitHub</a>' if portfolio.social_github else ''}
        {f'<a href="{portfolio.social_twitter}" target="_blank">Twitter</a>' if portfolio.social_twitter else ''}
    </section>
    
    {portfolio.custom_html}
    
    <script>
        {template.js_content}
    </script>
</body>
</html>
    """
    
    return html_template.strip()

# Legacy endpoint for backward compatibility
@api_view(['GET', 'POST'])
def portfolio_items(request):
    """Legacy API endpoint for portfolio items"""
    if request.method == 'GET':
        if request.user.is_authenticated:
            portfolios = Portfolio.objects.filter(user=request.user)
            data = []
            for portfolio in portfolios:
                data.append({
                    'id': portfolio.id,
                    'title': portfolio.title,
                    'description': portfolio.about_content[:100] + '...',
                    'technology': 'Portfolio Builder',
                    'created_at': portfolio.created_at.strftime('%Y-%m-%d')
                })
            return Response(data)
        else:
            # Return sample data for non-authenticated users
            sample_data = [
                {
                    'id': 1,
                    'title': 'Sample Portfolio 1',
                    'description': 'A beautiful portfolio showcasing web development skills',
                    'technology': 'React, Django, SQLite',
                    'created_at': '2025-10-05'
                },
                {
                    'id': 2,
                    'title': 'Sample Portfolio 2',
                    'description': 'Professional portfolio with modern design',
                    'technology': 'Python, JavaScript, HTML/CSS',
                    'created_at': '2025-10-04'
                }
            ]
            return Response(sample_data)
    
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Create portfolio from legacy data
        data = request.data
        try:
            template = Template.objects.first()  # Use first available template
            portfolio = Portfolio.objects.create(
                user=request.user,
                template=template,
                title=data.get('title', 'New Portfolio'),
                hero_title=data.get('title', 'Your Name'),
                about_content=data.get('description', 'Tell your story here...'),
            )
            response_data = {
                'id': portfolio.id,
                'message': 'Portfolio created successfully',
                **data
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)