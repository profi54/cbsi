// static/js/components/mobile-menu.js
document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.getElementById('burgerBtn');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!burgerBtn || !mobileMenu) return;

    // Открыть меню
    burgerBtn.addEventListener('click', openMobileMenu);

    // Закрыть меню
    closeMenu.addEventListener('click', closeMobileMenu);

    // Закрыть при клике на ссылку
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Закрыть при клике вне меню
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === mobileMenu) {
            closeMobileMenu();
        }
    });

    // Закрыть при нажатии ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            closeMobileMenu();
        }
    });

    // Функции
    function openMobileMenu() {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Анимация появления
        setTimeout(() => {
            mobileMenu.style.opacity = '1';
            mobileMenu.style.transform = 'translateY(0)';
        }, 10);
    }

    function closeMobileMenu() {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }

    // Плавная прокрутка для всех навигационных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.header-fixed')?.offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Закрыть мобильное меню если открыто
                    if (!mobileMenu.classList.contains('hidden')) {
                        closeMobileMenu();
                    }
                }
            }
        });
    });
});