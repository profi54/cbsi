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

            // Рассчитываем позицию с учетом фиксированного хедера
            const headerHeight = 80; // Высота вашего фиксированного хедера
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
        });
    });

    // 2. Подсветка активной секции (опционально)
    function highlightActiveNav() {
        const sections = document.querySelectorAll('section[id], div[id]');
        const navLinks = document.querySelectorAll('.nav-btn[href^="#"]');

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

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    }

    // Запускаем подсветку
    window.addEventListener('scroll', highlightActiveNav);
    highlightActiveNav(); // Инициализация при загрузке
});