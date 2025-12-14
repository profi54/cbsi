from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from .models import CallbackRequest
from .telegram_bot1 import telegram_notifier  # Импортируем ваш класс


@require_POST
def callback_request(request):
    # Получаем данные из формы
    name = request.POST.get('name', '').strip()
    phone = request.POST.get('phone', '').strip()
    message = request.POST.get('message', '').strip()
    service_id = request.POST.get('service_id', '').strip()
    consent = request.POST.get('consent') == 'on'

    # Валидация
    if not name or not phone:
        error_msg = '❌ Пожалуйста, укажите имя и телефон'
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'message': error_msg})
        messages.error(request, error_msg)
        return redirect('home')

    if not consent:
        error_msg = '❌ Необходимо согласие на обработку данных'
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({'success': False, 'message': error_msg})
        messages.error(request, error_msg)
        return redirect('home')

    # Сохраняем в базу
    callback = CallbackRequest.objects.create(
        name=name,
        phone=phone,
        message=message,
        consent=consent
    )

    # Если есть service_id, связываем с услугой
    service_info = ""
    if service_id:
        from services.models import Service
        try:
            service = Service.objects.get(id=service_id)
            callback.service = service
            callback.save()
            service_info = f"📋 Услуга: {service.title}"
        except Service.DoesNotExist:
            pass

    # Добавляем информацию о сообщении если есть
    full_service_info = service_info
    if message:
        if full_service_info:
            full_service_info += f"\n💬 Сообщение: {message}"
        else:
            full_service_info = f"💬 Сообщение: {message}"

    # Отправляем в Telegram через ваш класс
    telegram_sent = telegram_notifier.send_notification(name, phone, full_service_info)

    # Логируем результат
    print(f"📊 Telegram отправлен: {telegram_sent}")

    # Формируем ответ
    success_message = '✅ Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'

    # Если это AJAX запрос
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return JsonResponse({
            'success': True,
            'message': success_message,
            'telegram_sent': telegram_sent
        })

    # Если обычная форма
    messages.success(request, success_message)
    return redirect('home')