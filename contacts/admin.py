from django.contrib import admin
from .models import CallbackRequest


@admin.register(CallbackRequest)
class CallbackRequestAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'service', 'created_at', 'is_processed', 'consent']
    list_filter = ['is_processed', 'consent', 'created_at']
    search_fields = ['name', 'phone', 'message']
    list_editable = ['is_processed']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'phone', 'message', 'service', 'consent')
        }),
        ('Статус', {
            'fields': ('is_processed', 'created_at'),
            'classes': ('collapse',)
        }),
    )