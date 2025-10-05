from django.urls import path
from . import api_views

urlpatterns = [
    path('health/', api_views.api_health_check, name='api_health_check'),
    path('portfolio/', api_views.portfolio_items, name='portfolio_items'),
]