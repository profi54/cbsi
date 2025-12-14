// navigation.js - плавная навигация и подсветка активных ссылок

document.addEventListener('DOMContentLoaded', function() {
    // 1. Плавный скролл для навигационных ссылок
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) {
                console.warn(`Элемент ${targetId} не найден на странице`);
                return;
            }

            // Плавный скролл
            const headerOffset = 80; // Высота фиксированного хедера
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Обновляем URL без перезагрузки
            history.pushState(null, null, targetId);
        });
    });

    // 2. Подсветка активной секции при скролле
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // Небольшой отступ

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = `#${section.id}`;
            }
        });

        // Обновляем активные ссылки
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSectionId) {
                link.classList.add('active');
            }
        });
    }

    // Запускаем при загрузке и скролле
    highlightActiveSection();
    window.addEventListener('scroll', highlightActiveSection);

    // 3. Проверка существования секций
    function checkSections() {
        const sections = ['about', 'location', 'services', 'reviews', 'research', 'contacts'];
        const missingSections = [];

        sections.forEach(sectionId => {
            const element = document.getElementById(sectionId);
            if (!element) {
                missingSections.push(sectionId);
            }
        });

        if (missingSections.length > 0) {
            console.warn('Следующие секции не найдены на странице:', missingSections);
        }
    }

    checkSections();
});