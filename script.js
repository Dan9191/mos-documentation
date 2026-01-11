document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const expandSidebarBtn = document.getElementById('expandSidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const contentTitle = document.getElementById('content-title');

    // Состояние боковой панели
    let isSidebarCollapsed = false;
    let isMobile = window.innerWidth <= 768;

    // Проверка мобильного устройства
    function checkMobile() {
        isMobile = window.innerWidth <= 768;
        if (isMobile && !sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
            sidebar.classList.remove('show');
            isSidebarCollapsed = true;
        }
    }

    // Обработчик изменения размера окна
    window.addEventListener('resize', checkMobile);
    checkMobile(); // Проверить при загрузке

    // Переключение боковой панели
    toggleSidebarBtn.addEventListener('click', function() {
        if (isMobile) {
            // На мобильных просто скрываем панель
            sidebar.classList.remove('show');
        } else {
            // На десктопе сворачиваем/разворачиваем
            sidebar.classList.toggle('collapsed');
            isSidebarCollapsed = sidebar.classList.contains('collapsed');
        }
    });

    // Кнопка разворачивания на мобильных
    expandSidebarBtn.addEventListener('click', function() {
        sidebar.classList.add('show');
    });

    // Обработка кликов по пунктам меню
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Удаляем активный класс у всех пунктов
            navItems.forEach(navItem => navItem.classList.remove('active'));

            // Добавляем активный класс к выбранному пункту
            this.classList.add('active');

            // Получаем ID контента для отображения
            const contentId = this.getAttribute('data-content');

            // Обновляем заголовок
            const itemText = this.querySelector('.text').textContent;
            contentTitle.textContent = itemText;

            // Скрываем все разделы контента
            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            // Показываем выбранный раздел
            const activeSection = document.getElementById(contentId);
            if (activeSection) {
                activeSection.classList.add('active');
            }

            // На мобильных скрываем панель после выбора
            if (isMobile) {
                sidebar.classList.remove('show');
            }
        });
    });

    // Закрытие боковой панели при клике вне её на мобильных
    document.addEventListener('click', function(event) {
        if (isMobile &&
            !sidebar.contains(event.target) &&
            !expandSidebarBtn.contains(event.target) &&
            sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });

    // Инициализация первого активного раздела
    const firstNavItem = document.querySelector('.nav-item.active');
    if (firstNavItem) {
        const contentId = firstNavItem.getAttribute('data-content');
        const itemText = firstNavItem.querySelector('.text').textContent;
        contentTitle.textContent = itemText;

        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        const activeSection = document.getElementById(contentId);
        if (activeSection) {
            activeSection.classList.add('active');
        }
    }

    // Добавляем возможность закрывать боковую панель по клавише ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isMobile && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });
});