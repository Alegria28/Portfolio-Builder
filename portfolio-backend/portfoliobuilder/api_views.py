from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse

@api_view(['GET'])
def api_health_check(request):
    """
    Simple health check endpoint for the API
    """
    return Response({
        'status': 'healthy',
        'message': 'Portfolio Builder API is running',
        'version': '1.0.0'
    })

@api_view(['GET', 'POST'])
def portfolio_items(request):
    """
    API endpoint for portfolio items
    GET: Return all portfolio items
    POST: Create a new portfolio item
    """
    if request.method == 'GET':
        # For now, return sample data
        sample_data = [
            {
                'id': 1,
                'title': 'Project 1',
                'description': 'A sample project description',
                'technology': 'React, Django',
                'created_at': '2025-10-05'
            },
            {
                'id': 2,
                'title': 'Project 2',
                'description': 'Another sample project',
                'technology': 'Python, SQLite',
                'created_at': '2025-10-04'
            }
        ]
        return Response(sample_data)
    
    elif request.method == 'POST':
        # Handle creating new portfolio item
        data = request.data
        # For now, just return the received data with an ID
        response_data = {
            'id': 3,
            'message': 'Portfolio item created successfully',
            **data
        }
        return Response(response_data, status=status.HTTP_201_CREATED)