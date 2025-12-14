from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_POST
from .forms import CallbackForm


@require_POST
def callback_request(request):
    form = CallbackForm(request.POST)

    if form.is_valid():
        callback = form.save(commit=False)
        # Если пришло из кнопки "Записаться" на услуге
        service_id = request.POST.get('service_id')
        if service_id:
            from services.models import Service
            try:
                callback.service = Service.objects.get(id=service_id)
            except Service.DoesNotExist:
                pass

        callback.save()
        messages.success(request, '✅ Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.')
        return redirect('home')
    else:
        messages.error(request, '❌ Пожалуйста, заполните все обязательные поля.')
        return redirect('home')