from django.urls import path
from . import api_views

urlpatterns = [
    # Health check
    path('health/', api_views.api_health_check, name='api_health_check'),
    
    # Authentication
    path('auth/register/', api_views.register, name='register'),
    path('auth/login/', api_views.login_view, name='login'),
    path('auth/logout/', api_views.logout_view, name='logout'),
    path('auth/profile/', api_views.user_profile, name='user_profile'),
    
    # Templates
    path('templates/', api_views.templates_list, name='templates_list'),
    path('templates/<int:template_id>/', api_views.template_detail, name='template_detail'),
    
    # Portfolios
    path('portfolios/', api_views.portfolios_list, name='portfolios_list'),
    path('portfolios/<int:portfolio_id>/', api_views.portfolio_detail, name='portfolio_detail'),
    path('portfolios/<int:portfolio_id>/projects/', api_views.portfolio_projects, name='portfolio_projects'),
    
    # Export
    path('export/', api_views.export_portfolio, name='export_portfolio'),
    
    # Legacy endpoints (for backward compatibility)
    path('portfolio/', api_views.portfolio_items, name='portfolio_items'),
]