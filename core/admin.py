from django.contrib import admin
from .models import SiteSettings, PrivacyPolicy, ResearchInfo


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ['phone', 'email']

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()




@admin.register(PrivacyPolicy)
class PrivacyPolicyAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_published', 'updated_at']
    list_editable = ['is_published']

    def has_add_permission(self, request):
        return not PrivacyPolicy.objects.exists()


@admin.register(ResearchInfo)
class ResearchInfoAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'order', 'updated_at']
    list_editable = ['is_active', 'order']
    list_filter = ['is_active']
    search_fields = ['title', 'column_1', 'column_2', 'column_3']

    # Поля для формы редактирования
    fieldsets = (
        ('Основное', {
            'fields': ('title', 'is_active', 'order'),
        }),
        ('Содержание колонок', {
            'fields': ('column_1', 'column_2', 'column_3'),
            'description': 'В каждую колонку можно вписать текст. Используйте HTML для форматирования:<br>'
                           '• <strong>&lt;strong&gt;жирный текст&lt;/strong&gt;</strong><br>'
                           '• <em>&lt;em&gt;курсив&lt;/em&gt;</em><br>'
                           '• &lt;ul&gt;&lt;li&gt;пункт списка&lt;/li&gt;&lt;/ul&gt;<br>'
                           '• &lt;h4&gt;заголовок&lt;/h4&gt; (небольшой)<br>'
                           '• &lt;br&gt; - перенос строки<br><br>'
                           '<strong>Пример для колонки 1:</strong><br>'
                           '&lt;h4&gt;Точность&lt;/h4&gt;<br>'
                           'Используем современное оборудование<br>'
                           '&lt;strong&gt;Диана-7&lt;/strong&gt;'
        }),
    )

    # Настраиваем поля для удобства
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)

        # Для каждой колонки настраиваем внешний вид
        for field_name in ['column_1', 'column_2', 'column_3']:
            form.base_fields[field_name].widget.attrs.update({
                'rows': '10',
                'style': 'width: 100%; font-family: monospace;',
                'placeholder': f'Введите текст для {field_name}...\nМожно использовать HTML теги'
            })

        return form

    # Сортировка по умолчанию
    ordering = ['order', '-updated_at']