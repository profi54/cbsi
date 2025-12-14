from django.shortcuts import render
from services.models import Service
from reviews.models import Review
from core.models import SiteSettings, SiteStatistics

def home(request):
    context = {
        'services': Service.objects.filter(is_active=True).order_by('order'),
        'reviews': Review.objects.filter(is_published=True).order_by('-created_at')[:6],
        'settings': SiteSettings.objects.first(),
        'statistics': SiteStatistics.objects.first(),
    }
    return render(request, 'core/home.html', context)

def privacy_policy(request):  # Эта функция должна быть
    policy = PrivacyPolicy.objects.first()
    settings = SiteSettings.objects.first()
    context = {
        'policy': policy,
        'settings': settings,
    }
    return render(request, 'core/privacy_policy.html', context)