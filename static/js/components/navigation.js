document.addEventListener('DOMContentLoaded', function() {
    // 1. Плавный скролл для всех ссылок с хэшем
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Пропускаем пустые ссылки
            if (href === '#' || href === '') return;

            // Находим целевой элемент
            const targetElement = document.querySelector(href);
            if (!targetElement) {
                console.warn(`Элемент ${href} не найден`);
                return;
            }

            // Предотвращаем стандартное поведение
            e.preventDefault();

            // Рассчитываем позицию с учетом фиксированного хедера (64px - новая высота)
            const headerHeight = 64; // Изменили с 80 на 64
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            // Плавный скролл
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Обновляем URL в адресной строке
            if (history.pushState) {
                history.pushState(null, null, href);
            } else {
                location.hash = href;
            }

            // Для кнопок новой шапки добавляем класс active
            if (this.classList.contains('header-nav-btn')) {
                document.querySelectorAll('.header-nav-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // 2. Подсветка активной секции для новой шапки
    function highlightActiveNav() {
        const sections = document.querySelectorAll('section[id], div[id]');
        // Используем новый селектор для кнопок шапки
        const navButtons = document.querySelectorAll('.header-nav-btn');

        let current = '';
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = `#${sectionId}`;
            }
        });

        navButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('href') === current) {
                button.classList.add('active');
            }
        });
    }

    // Запускаем подсветку
    window.addEventListener('scroll', highlightActiveNav);
    highlightActiveNav(); // Инициализация при загрузке
});