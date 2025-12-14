let currentScrollPosition = 0;
let currentServiceId = null;

// =====================
// МОДАЛЬНОЕ ОКНО
// =====================

// Открытие модального окна
function openModal(serviceId = null, serviceTitle = null, event = null) {
    // Получаем event если он передан
    const e = event || window.event;

    // Предотвращаем поведение по умолчанию
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    const modal = document.getElementById('callback-modal');
    if (!modal) {
        console.error('❌ Modal element not found!');
        return false;
    }

    // Сохраняем текущую позицию скролла
    currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

    // Устанавливаем ID услуги если есть
    if (serviceId) {
        currentServiceId = serviceId;
        const serviceIdInput = document.getElementById('modal-service-id');
        if (serviceIdInput) {
            serviceIdInput.value = serviceId;
        }

        // Меняем заголовок если есть название услуги
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle && serviceTitle) {
            modalTitle.textContent = `Заявка на услугу: ${serviceTitle}`;
        }
    }

    // Показываем модальное окно
    modal.classList.remove('hidden');

    // Блокируем скролл и фиксируем позицию
    document.body.classList.add('modal-open');
    document.body.style.top = `-${currentScrollPosition}px`;
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    // Фокусируемся на первом поле
    setTimeout(() => {
        const nameInput = modal.querySelector('input[name="name"]');
        if (nameInput) {
            nameInput.focus({ preventScroll: true });
        }
    }, 50);

    return false;
}

// Закрытие модального окна
function closeModal(event = null) {
    // Если передано событие, предотвращаем поведение по умолчанию
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const modal = document.getElementById('callback-modal');
    if (!modal) return false;

    // Скрываем модальное окно
    modal.classList.add('hidden');

    // Восстанавливаем скролл
    document.body.classList.remove('modal-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';

    // Восстанавливаем позицию скролла
    window.scrollTo(0, currentScrollPosition);

    // Сбрасываем значения
    currentServiceId = null;
    const serviceIdInput = document.getElementById('modal-service-id');
    if (serviceIdInput) {
        serviceIdInput.value = '';
    }

    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
        modalTitle.textContent = 'Заявка на обратный звонок';
    }

    // Сбрасываем форму если есть
    const form = document.getElementById('callback-form-modal');
    if (form) {
        form.reset();
    }

    return false;
}

// =====================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// =====================

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = 64; // Высота шапки
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Маска для телефона
function initPhoneMask(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') +
                                            (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
    }
}

// =====================
// ИНИЦИАЛИЗАЦИЯ
// =====================

document.addEventListener('DOMContentLoaded', function() {
    // Закрытие модального окна при клике на overlay
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(e);
            }
        });
    }

    // Закрытие модального окна на ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('callback-modal');
            if (modal && !modal.classList.contains('hidden')) {
                closeModal(e);
            }
        }
    });

    // Инициализация масок телефона
    initPhoneMask('modal-phone');

    // Проверяем наличие формы внизу (для совместимости)
    const phoneField = document.getElementById('phone-field');
    if (phoneField) {
        initPhoneMask('phone-field');
    }

    // Обработка отправки модальной формы
    const modalForm = document.getElementById('callback-form-modal');
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            // Можно добавить AJAX отправку здесь
            setTimeout(() => {
                closeModal();
            }, 1000);
        });
    }
});

// Экспортируем функции для глобального использования
window.openModal = openModal;
window.closeModal = closeModal;
window.scrollToSection = scrollToSection;