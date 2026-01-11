document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const expandSidebarBtn = document.getElementById('expandSidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const submenuItems = document.querySelectorAll('.submenu-item');
    const allMenuItems = [...navItems, ...submenuItems];
    const contentSections = document.querySelectorAll('.content-section');
    const contentTitle = document.getElementById('content-title');
    const submenus = document.querySelectorAll('.with-submenu');

    // Инициализация Mermaid с правильными настройками
    mermaid.initialize({
        startOnLoad: false, // Не запускать автоматически
        theme: 'default',
        securityLevel: 'loose',
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true
        }
    });

    // Состояние боковой панели
    let isSidebarCollapsed = false;
    let isMobile = window.innerWidth <= 768;

    // Текущий открытый раздел
    let currentSection = 'introduction';

    // Рендеринг Mermaid для активной секции
    function renderMermaid() {
        // Ждем небольшое время, чтобы контент успел отобразиться
        setTimeout(() => {
            const activeSection = document.querySelector('.content-section.active');
            if (activeSection) {
                const mermaidElements = activeSection.querySelectorAll('.mermaid:not(.rendered)');
                if (mermaidElements.length > 0) {
                    try {
                        mermaid.init({}, mermaidElements);
                        // Помечаем как отрендеренные
                        mermaidElements.forEach(el => {
                            el.classList.add('rendered');
                        });
                    } catch (error) {
                        console.error('Mermaid rendering error:', error);
                    }
                }
            }
        }, 500);
    }

    // Функция отображения контента с рендерингом Mermaid
    function showContent(contentId, itemText) {
        // Обновляем заголовок
        contentTitle.textContent = itemText;

        // Сохраняем текущий раздел
        currentSection = contentId;

        // Скрываем все разделы контента
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Показываем выбранный раздел
        const activeSection = document.getElementById(contentId);
        if (activeSection) {
            activeSection.classList.add('active');
            // Рендерим Mermaid для нового контента
            renderMermaid();
        }
    }

    // Проверка мобильного устройства
    function checkMobile() {
        isMobile = window.innerWidth <= 768;
        if (isMobile && !sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
            sidebar.classList.remove('show');
            isSidebarCollapsed = true;
        }
    }

    // Функция закрытия всех подменю
    function closeAllSubmenus() {
        document.querySelectorAll('.submenu.active').forEach(submenu => {
            submenu.classList.remove('active');
        });
        document.querySelectorAll('.with-submenu.active').forEach(item => {
            item.classList.remove('active');
        });
    }

    // Обработчик изменения размера окна
    window.addEventListener('resize', checkMobile);
    checkMobile();

    // Переключение боковой панели
    toggleSidebarBtn.addEventListener('click', function() {
        if (isMobile) {
            sidebar.classList.remove('show');
        } else {
            sidebar.classList.toggle('collapsed');
            isSidebarCollapsed = sidebar.classList.contains('collapsed');

            // Закрываем все подменю при сворачивании
            if (isSidebarCollapsed) {
                closeAllSubmenus();
            }
        }
    });

    // Кнопка разворачивания на мобильных
    expandSidebarBtn.addEventListener('click', function() {
        sidebar.classList.add('show');
    });

    // Обработка кликов по подменю (основным пунктам с вложенными)
    submenus.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();

            const contentId = this.getAttribute('data-content');
            const itemText = this.querySelector('.text').textContent;

            if (isSidebarCollapsed || isMobile) {
                // На свернутой панели или мобильных - открываем основной раздел
                showContent(contentId, itemText);

                // Удаляем активный класс у всех пунктов меню
                allMenuItems.forEach(menuItem => menuItem.classList.remove('active'));
                // Добавляем активный класс к выбранному пункту
                this.classList.add('active');
            } else {
                // На развернутой панели - открываем/закрываем подменю
                const submenu = this.nextElementSibling;

                // Если кликнули на уже активное подменю, показываем основной раздел
                if (this.classList.contains('active') && submenu.classList.contains('active')) {
                    showContent(contentId, itemText);
                    return;
                }

                // Закрываем другие подменю
                document.querySelectorAll('.submenu.active').forEach(activeSubmenu => {
                    if (activeSubmenu !== submenu) {
                        activeSubmenu.classList.remove('active');
                        activeSubmenu.previousElementSibling.classList.remove('active');
                    }
                });

                // Переключаем текущее подменю
                this.classList.toggle('active');
                submenu.classList.toggle('active');

                // Если открываем подменю, показываем основной раздел
                if (this.classList.contains('active')) {
                    showContent(contentId, itemText);
                }
            }
        });
    });

    // Обработка кликов по пунктам меню (обычным и подпунктам)
    allMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();

            // Пропускаем обработку для основных пунктов с подменю
            if (this.classList.contains('with-submenu') && !isSidebarCollapsed && !isMobile) {
                return;
            }

            // Удаляем активный класс у всех пунктов меню
            allMenuItems.forEach(menuItem => menuItem.classList.remove('active'));

            // Добавляем активный класс к выбранному пункту
            this.classList.add('active');

            // Если это подпункт, активируем и родительский пункт
            if (this.classList.contains('submenu-item')) {
                const parentMenuItem = this.closest('.submenu').previousElementSibling;
                if (parentMenuItem) {
                    parentMenuItem.classList.add('active');
                    parentMenuItem.nextElementSibling.classList.add('active');
                }
            }

            // Получаем ID контента для отображения
            const contentId = this.getAttribute('data-content');

            // Получаем текст для заголовка
            let itemText = '';
            if (this.classList.contains('submenu-item')) {
                itemText = this.querySelector('.text').textContent;
            } else {
                itemText = this.querySelector('.text').textContent;
            }

            showContent(contentId, itemText);

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
            // Рендерим Mermaid для начальной секции
            setTimeout(() => {
                renderMermaid();
            }, 100);
        }
    }

    // Добавляем возможность закрывать боковую панель по клавише ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isMobile && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });

    // Рендеринг Mermaid при изменении размера окна
    window.addEventListener('resize', () => {
        // Перерендериваем Mermaid при изменении размера
        const activeSection = document.querySelector('.content-section.active');
        if (activeSection) {
            const mermaidElements = activeSection.querySelectorAll('.mermaid');
            mermaidElements.forEach(el => {
                el.classList.remove('rendered');
            });
            renderMermaid();
        }
    });
});