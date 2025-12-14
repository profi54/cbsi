from django.db import models


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


class SiteStatistics(models.Model):
    tests_completed = models.PositiveIntegerField('Проведенных проверок', default=0)
    corporate_clients = models.PositiveIntegerField('Корпоративных клиентов', default=0)
    years_experience = models.PositiveIntegerField('Лет на рынке', default=0)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Статистика сайта'
        verbose_name_plural = 'Статистика сайта'

    def __str__(self):
        return "Статистика сайта"


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