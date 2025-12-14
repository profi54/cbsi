# core/context_processors.py
import time
from core.models import SiteSettings
from services.models import Service
from reviews.models import Review
from core.models import ResearchInfo


def cache_versions(request):
    """Добавляет версии кэша во все шаблоны"""
    settings = SiteSettings.objects.first()

    # Получаем актуальные данные для расчета версий
    services = Service.objects.filter(is_active=True).order_by('order')
    reviews = Review.objects.filter(is_published=True).order_by('-created_at')[:6]
    research_info = ResearchInfo.objects.filter(is_active=True).first()

    return {
        'GLOBAL_VERSION': int(time.time()),
        'SITE_VERSION': settings.cache_version if settings else int(time.time()),
        'CACHE_BUSTER': f'v{int(time.time())}',
        # Специфичные версии для блоков
        'RESEARCH_VERSION': research_info.updated_at.timestamp() if research_info and hasattr(research_info,
                                                                                              'updated_at') else 0,
        'SERVICES_VERSION': services.last().updated_at.timestamp() if services.exists() and hasattr(services.last(),
                                                                                                    'updated_at') else 0,
        'REVIEWS_VERSION': reviews.first().created_at.timestamp() if reviews.exists() else 0,
    }