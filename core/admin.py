from django.contrib import admin
from .models import SiteSettings, SiteStatistics, PrivacyPolicy


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['phone', 'email']

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()


@admin.register(SiteStatistics)
class SiteStatisticsAdmin(admin.ModelAdmin):
    list_display = ['tests_completed', 'corporate_clients', 'years_experience', 'updated_at']
    list_display_links = ['updated_at']  # Добавляем эту строку
    list_editable = ['tests_completed', 'corporate_clients', 'years_experience']

    def has_add_permission(self, request):
        return not SiteStatistics.objects.exists()





@admin.register(PrivacyPolicy)
class PrivacyPolicyAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_published', 'updated_at']
    list_editable = ['is_published']

    def has_add_permission(self, request):
        return not PrivacyPolicy.objects.exists()