from django.db import models
import time

class SiteSettings(models.Model):
    phone = models.CharField('Телефон', max_length=20)
    email = models.EmailField('Email')
    address = models.TextField('Адрес')
    working_hours = models.TextField('Режим работы')
    vk_link = models.URLField('VK', blank=True)
    telegram_link = models.URLField('Telegram', blank=True)

    class Meta:
        verbose_name = 'Настройки сайта'
        verbose_name_plural = 'Настройки сайта'

    def __str__(self):
        return "Настройки сайта"

    cache_version = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        # Обновляем версию при каждом сохранении
        self.cache_version = int(time.time())
        super().save(*args, **kwargs)

    @classmethod
    def get_cache_version(cls):
        settings = cls.objects.first()
        return settings.cache_version if settings else int(time.time())




class PrivacyPolicy(models.Model):
    title = models.CharField('Заголовок', max_length=200, default='Политика конфиденциальности')
    content = models.TextField('Текст политики', blank=True)
    is_published = models.BooleanField('Опубликовано', default=False)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Политика конфиденциальности'
        verbose_name_plural = 'Политика конфиденциальности'

    def __str__(self):
        return self.title


class ResearchInfo(models.Model):
    """Блок 'Об исследованиях' """

    title = models.CharField(
        'Заголовок блока',
        max_length=200,
        default='О наших исследованиях',
        help_text='Заголовок блока, например: "Почему выбирают нас"'
    )

    # Три колонки
    column_1 = models.TextField(
        'Колонка 1 (левая)',
        blank=True,
        help_text='Текст для первой колонки. Можно использовать HTML: '
                  '&lt;strong&gt;жирный текст&lt;/strong&gt;, '
                  '&lt;br&gt; - перенос строки, '
                  '&lt;ul&gt;&lt;li&gt;список&lt;/li&gt;&lt;/ul&gt;'
    )

    column_2 = models.TextField(
        'Колонка 2 (средняя)',
        blank=True,
        help_text='Текст для второй колонки. Можно использовать HTML: '
                  '&lt;strong&gt;жирный текст&lt;/strong&gt;, '
                  '&lt;br&gt; - перенос строки, '
                  '&lt;ul&gt;&lt;li&gt;список&lt;/li&gt;&lt;/ul&gt;'
    )

    column_3 = models.TextField(
        'Колонка 3 (правая)',
        blank=True,
        help_text='Текст для третьей колонки. Можно использовать HTML: '
                  '&lt;strong&gt;жирный текст&lt;/strong&gt;, '
                  '&lt;br&gt; - перенос строки, '
                  '&lt;ul&gt;&lt;li&gt;список&lt;/li&gt;&lt;/ul&gt;'
    )

    is_active = models.BooleanField(
        'Показывать на сайте',
        default=True,
        help_text='Отметьте, чтобы блок отображался на главной странице'
    )

    order = models.IntegerField(
        'Порядок отображения',
        default=0,
        help_text='Чем меньше число, тем выше блок. Используется при наличии нескольких блоков'
    )

    created_at = models.DateTimeField('Дата создания', auto_now_add=True)
    updated_at = models.DateTimeField('Дата обновления', auto_now=True)

    class Meta:
        verbose_name = 'Блок "Об исследованиях" (3 колонки)'
        verbose_name_plural = 'Блоки "Об исследованиях" (3 колонки)'
        ordering = ['order', '-created_at']

    def __str__(self):
        status = "активен" if self.is_active else "скрыт"
        return f"{self.title} ({status})"