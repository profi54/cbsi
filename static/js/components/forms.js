// =====================
// 1. ОБЩИЕ ФУНКЦИИ СКРОЛЛА
// =====================

function scrollToSection(sectionId) {
    console.log('🎯 Scrolling to:', sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// =====================
// 2. ФОРМА ВНИЗУ СТРАНИЦЫ (для совместимости)
// =====================

function focusOnCallbackForm(serviceId = null) {
    console.log('🎯 Focusing on form (legacy), serviceId:', serviceId);

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
        console.log('✅ Service ID added:', serviceId);
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
// 3. МОДАЛЬНОЕ ОКНО
// =====================

let currentServiceId = null;

// Открытие модального окна
function openModal(serviceId = null, serviceTitle = null) {
    console.log('🎯 Opening modal, serviceId:', serviceId, 'serviceTitle:', serviceTitle);

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

    const modal = document.getElementById('callback-modal');
    if (modal) {
        // Удаляем класс hidden (показываем модальное окно)
        modal.classList.remove('hidden');

        // Блокируем скролл на body
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden'; // Для надежности

        console.log('✅ Modal opened - classes:', modal.className);

        // Фокусируемся на первом поле после небольшой задержки
        setTimeout(() => {
            const nameInput = modal.querySelector('input[name="name"]');
            if (nameInput) {
                nameInput.focus();
            }
        }, 50);
    } else {
        console.error('❌ Modal element not found!');
        // Проверьте есть ли элемент в DOM
        console.log('Available elements with callback-modal id:',
            document.querySelectorAll('#callback-modal').length);
    }
}

// Закрытие модального окна
function closeModal() {
    console.log('🎯 Closing modal');

    const modal = document.getElementById('callback-modal');
    if (modal) {
        // Добавляем класс hidden (скрываем модальное окно)
        modal.classList.add('hidden');

        // Разблокируем скролл
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        console.log('✅ Modal closed');
    }

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
// 4. ИНИЦИАЛИЗАЦИЯ
// =====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Forms module loaded');

    // Закрытие модального окна при клике на overlay
    const overlay = document.querySelector('.modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) { // Клик именно на overlay, а не на его детей
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

    // Обработка успешной отправки формы (модальной)
    const modalForm = document.getElementById('callback-form-modal');
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            console.log('✅ Modal form submitted');
            // Закрываем модальное окно через секунду
            setTimeout(function() {
                closeModal();
            }, 1000);
        });
    }

    // Для совместимости - если в кнопках используется focusOnCallbackForm
    // Но теперь лучше использовать openModal()
    console.log('📝 Note: Use openModal() for new forms, focusOnCallbackForm() for compatibility');

    // Дебаг: проверка что все работает
    console.log('🔍 Modal element exists:',
        document.getElementById('callback-modal') ? 'YES' : 'NO');
});

console.log('✅ Forms: All form functions loaded');

// Экспортируем функции для глобального использования
window.openModal = openModal;
window.closeModal = closeModal;
window.scrollToSection = scrollToSection;
window.focusOnCallbackForm = focusOnCallbackForm;