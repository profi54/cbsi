document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.getElementById('burgerBtn');
    const closeBtn = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');

    // Проверяем что элементы существуют
    if (!burgerBtn || !closeBtn || !mobileMenu) {
        console.log('Мобильное меню: элементы не найдены');
        return;
    }

    console.log('Мобильное меню: инициализация');

    // Функция открытия меню
    function openMenu() {
        console.log('Открываем меню');
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Фокус на кнопке закрытия для доступности
        setTimeout(() => closeBtn.focus(), 100);
    }

    // Функция закрытия меню
    function closeMenu() {
        console.log('Закрываем меню');
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // Возвращаем фокус на бургер
        burgerBtn.focus();
    }

    // Открытие по клику на бургер
    burgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        openMenu();
    });

    // Закрытие по клику на крестик
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeMenu();
    });

    // Закрытие по клику на ссылку в меню
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMenu();
        });
    });

    // Закрытие по клику вне меню
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            closeMenu();
        }
    });

    // Плавная прокрутка для всех якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                // Закрываем меню если открыто
                if (!mobileMenu.classList.contains('hidden')) {
                    closeMenu();
                }

                // Прокрутка с учетом высоты шапки
                const header = document.querySelector('.header-fixed');
                const headerHeight = header ? header.offsetHeight : 0;

                const targetPosition = target.getBoundingClientRect().top +
                                      window.pageYOffset -
                                      headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('Мобильное меню: инициализация завершена');
});