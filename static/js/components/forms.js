// forms.js - все функции для работы с формами

// =====================
// 1. ОБЩИЕ ФУНКЦИИ СКРОЛЛА
// =====================

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// =====================
// 2. ФОРМА ВНИЗУ СТРАНИЦЫ (для совместимости)
// =====================

function focusOnCallbackForm(serviceId = null) {
    // СНАЧАЛА добавляем service_id в форму
    if (serviceId) {
        let serviceField = document.getElementById('service-field');
        if (!serviceField) {
            serviceField = document.createElement('input');
            serviceField.type = 'hidden';
            serviceField.name = 'service_id';
            serviceField.id = 'service-field';
            const form = document.getElementById('callback-form');
            if (form) form.appendChild(serviceField);
        }
        serviceField.value = serviceId;
    }

    // ПОТОМ скроллим к форме
    const contactsSection = document.getElementById('contacts');
    if (contactsSection) {
        contactsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Highlight and focus name field
    setTimeout(() => {
        const nameField = document.getElementById('name-field');
        if (nameField) {
            // Добавляем классы для подсветки
            nameField.classList.add('field-highlight', 'field-pulse');
            nameField.focus();
            nameField.setSelectionRange(0, 0);

            // Убираем подсветку при вводе или через время
            const removeHighlight = () => {
                nameField.classList.remove('field-highlight', 'field-pulse');
                nameField.removeEventListener('input', removeHighlight);
            };

            nameField.addEventListener('input', removeHighlight);
            setTimeout(removeHighlight, 3000);
        }
    }, 800);
}

// =====================
// 3. МОДАЛЬНОЕ ОКНО - ИСПРАВЛЕННАЯ ВЕРСИЯ
// =====================

let currentServiceId = null;

// Открытие модального окна
function openModal(serviceId = null, serviceTitle = null) {
    const modal = document.getElementById('callback-modal');

    if (!modal) {
        console.error('❌ Modal element not found!');
        return;
    }

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

    // Удаляем класс hidden (показываем модальное окно)
    modal.classList.remove('hidden');

    // Блокируем скролл - только через класс, не через style
    document.body.classList.add('modal-open');

    // Фокусируемся на первом поле после небольшой задержки
    setTimeout(() => {
        const nameInput = modal.querySelector('input[name="name"]');
        if (nameInput) {
            nameInput.focus();
        }
    }, 50);
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('callback-modal');

    if (!modal) return;

    // Добавляем класс hidden (скрываем модальное окно)
    modal.classList.add('hidden');

    // Разблокируем скролл
    document.body.classList.remove('modal-open');

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
}

// Маска для телефона в модальном окне
function initPhoneMask() {
    const phoneInput = document.getElementById('modal-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
    }
}

// Маска для телефона в форме внизу
function initPhoneMaskBottomForm() {
    const phoneInput = document.getElementById('phone-field');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        });
    }
}

// =====================
// 4. ИНИЦИАЛИЗАЦИЯ - ИСПРАВЛЕННАЯ ВЕРСИЯ
// =====================

document.addEventListener('DOMContentLoaded', function() {
    // Закрытие модального окна при клике на overlay
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }

    // Закрытие модального окна на ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('callback-modal');
            if (modal && !modal.classList.contains('hidden')) {
                closeModal();
            }
        }
    });

    // Инициализация масок телефона
    initPhoneMask();
    initPhoneMaskBottomForm();

    // Обработка отправки формы (модальной)
    const modalForm = document.getElementById('callback-form-modal');
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            setTimeout(closeModal, 1000);
        });
    }

    // Экстренный патч: проверяем и исправляем стили модального окна
    setTimeout(function() {
        const modal = document.getElementById('callback-modal');
        if (modal) {
            // Убедимся, что начальные стили правильные
            const computedStyle = window.getComputedStyle(modal);

            // Если display: none, исправляем
            if (computedStyle.display === 'none') {
                modal.style.display = 'flex';
            }

            // Если visibility: hidden и нет класса .hidden, исправляем
            if (computedStyle.visibility === 'hidden' && !modal.classList.contains('hidden')) {
                modal.style.visibility = 'visible';
            }

            console.log('✅ Modal initialized correctly');
        }
    }, 500);
});

// Экспортируем функции для глобального использования
window.openModal = openModal;
window.closeModal = closeModal;
window.scrollToSection = scrollToSection;
window.focusOnCallbackForm = focusOnCallbackForm;