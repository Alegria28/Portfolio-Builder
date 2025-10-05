from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User, Template, Portfolio, Project, Skill, Experience


@admin.register(User)
class UserAdmin(BaseUserAdmin):
	"""Admin for the custom User model using email as the username field."""

	model = User
	ordering = ("-date_joined",)
	list_display = (
		"email",
		"username",
		"first_name",
		"last_name",
		"is_staff",
		"is_superuser",
		"date_joined",
	)
	list_filter = ("is_staff", "is_superuser", "is_active", "groups")
	search_fields = ("email", "username", "first_name", "last_name")

	# Display email/password first, then personal info and permissions like the default admin
	fieldsets = (
		(None, {"fields": ("email", "password")}),
		(_("Personal info"), {"fields": ("username", "first_name", "last_name")}),
		(
			_("Permissions"),
			{"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")},
		),
		(_("Important dates"), {"fields": ("last_login", "date_joined")}),
	)

	# Fields to show when creating a new user via the admin UI
	add_fieldsets = (
		(
			None,
			{
				"classes": ("wide",),
				"fields": (
					"email",
					"username",
					"first_name",
					"last_name",
					"password1",
					"password2",
					"is_staff",
					"is_superuser",
					"is_active",
					"groups",
				),
			},
		),
	)


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
	list_display = ("name", "template_type", "is_premium", "created_at")
	list_filter = ("template_type", "is_premium")
	search_fields = ("name", "description")


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
	list_display = ("title", "user", "template", "is_published", "created_at")
	list_filter = ("is_published", "template__template_type")
	search_fields = ("title", "user__email", "user__username")
	autocomplete_fields = ("user", "template")


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
	list_display = ("title", "portfolio", "is_featured", "order", "created_at")
	list_filter = ("is_featured",)
	search_fields = ("title", "technology_stack", "portfolio__title")
	autocomplete_fields = ("portfolio",)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
	list_display = ("name", "category", "proficiency", "portfolio")
	list_filter = ("category",)
	search_fields = ("name", "portfolio__title")
	autocomplete_fields = ("portfolio",)


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
	list_display = ("position", "company", "portfolio", "start_date", "end_date", "is_current")
	list_filter = ("is_current",)
	search_fields = ("position", "company", "portfolio__title")
	autocomplete_fields = ("portfolio",)


# Optional: tweak the admin site titles
admin.site.site_header = "Portfolio Builder Admin"
admin.site.site_title = "Portfolio Builder Admin"
admin.site.index_title = "Administration"
