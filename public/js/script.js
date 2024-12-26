'use strict'

window.addEventListener('DOMContentLoaded', async () => {

    //+ header:
    //+ header-scroll:
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;    
        if (scrollTop >= 10) {
        header.classList.add('bg-blure');
        } else {
        header.classList.remove('bg-blure');
        }
    });

    //+ burger:
    const burger = document.querySelector('.header__burger'),
        activeBurger = document.querySelector('.header__wrapper-nav');

    burger.addEventListener('click', () => {
        activeBurger.classList.toggle('active-burger');
        hiddenElem();
    });

    //+ Переключатель:
    const toggleCheckbox = document.querySelector('#toggle-dark-mode'),
        circle = document.querySelector('.header__circle');

    toggleCheckbox.addEventListener('click', () => {
        circle.classList.toggle('circle-transform');
        toggleCheckbox.classList.toggle('toggle-container-bg');
    });

    //+ Modals SignIn and SignUp:
    const modalAreaSignIn = document.querySelector('[data-modal-signIn]'),
        modalAreaSignUp = document.querySelector('[data-modal-signUp]'),
        modalSignIn = document.querySelector('[data-open-signIn]'),
        modalSignUp = document.querySelector('[data-open-signUp]'),
        entrance = modalAreaSignUp.querySelector('[data-linkRegistration]'),
        createAccount = modalAreaSignIn.querySelector('[data-linkAuthorization]');

    document.querySelectorAll('.modal__wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && (modalAreaSignIn.classList.contains('modal-area-active') || modalAreaSignUp.classList.contains('modal-area-active'))) { 
            document.querySelectorAll('.modal').forEach(modal => {
                closeModal(modal);
            });
        }
    });
    modalSignIn.addEventListener('click', () => {
        showModal(modalAreaSignIn);    
    });

    modalAreaSignIn.addEventListener('click', () => {
        closeModal(modalAreaSignIn);
    });

    modalSignUp.addEventListener('click', () => {
        showModal(modalAreaSignUp);
    });
    modalAreaSignUp.addEventListener('click', () => {
        closeModal(modalAreaSignUp);
    });

    //+ Ссылки в модалках:
    createAccount.addEventListener('click', () => {
        showModal(modalAreaSignUp);
        closeModal(modalAreaSignIn);
    });
    entrance.addEventListener('click', () => {
        showModal(modalAreaSignIn);
        closeModal(modalAreaSignUp);
    });

    //+ Поиск:
    const modalSearch = document.querySelector('[data-modal-search]');

    document.querySelector('.header__search').addEventListener('click', () => {
        showModal(modalSearch);
    });

    modalSearch.addEventListener('click', () => {
        closeModal(modalSearch);
    });

    //+ Функции-modal:
    function hiddenElem() {
        document.querySelector('.body').classList.toggle('hidden');
    }

    function showModal(modal) {
        modal.classList.add('modal-area-active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('modal-area-active');
        document.body.style.overflow = '';
    }

    //+ Тёмная тема:
    const themeSwitch = document.querySelector('#toggle-dark-mode'),
        body = document.querySelector('.body'),
        titles = body.querySelectorAll('[data-title]'),
        subtitles = body.querySelectorAll('.subtitle'),
        elementsBg = body.querySelectorAll('.response__wrapper');

    themeSwitch.addEventListener('click', () => {
        body.classList.toggle('dark-theme-bg');
        titles.forEach(title => {
            title.classList.toggle('dark-theme-text-title');
        });
        subtitles.forEach(subtitle => {
            subtitle.classList.toggle('dark-theme-text-title');
        });
        elementsBg.forEach(elem => elem.classList.toggle('light-background-elements-bg'));
        document.querySelectorAll('[data-description]').forEach(description => {
            description.classList.toggle('dark-theme-text');
        });    
        document.querySelector('.response__quotation-marks').classList.toggle('dark-theme-text-title');
    });

    //+ owl-carousel:
    $(document).ready(function() {
        $(".owl-carousel").owlCarousel();
    });

    $('.menu__owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        responsive:{
            0:{
                items: 2
            },
            460:{
                items: 3
            },
            770:{
                items: 4
            },
            2000:{
                items: 4
            }
        }
    });

    const responseSlider = $(".response__owl-carousel").owlCarousel({
        loop: true,
        margin: 0,
        items: 1,
        nav: false,
        navText: ['', '']
    });

    //+ Обработчики событий кнопок:
    $('.response__rewind-left').on('click', function() {
        responseSlider.trigger('prev.owl.carousel', [500]);
    });

    $('.response__rewind-right').on('click', function() {
        responseSlider.trigger('next.owl.carousel', [500]);
    });

    //+ Работа с сервером:
    //+ Registration:
    document.querySelector('[data-btn-signUp]').addEventListener('click', async (e) => {
        e.preventDefault();

        const name = document.querySelector('#name').value,
            email = document.querySelector('#email').value,
            address = document.querySelector('#address').value,
            password = document.querySelector('#password').value;

        const data = {
            name,
            email,
            address,
            password
        };

        try {
            const response = await fetch('/regist', {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const user = await response.json();
            console.log("Ответ от сервера:", user);

            if (response.ok) {
                showMessage(`${user.message} (～￣▽￣)～`);
            } else {
                showMessage(user.message);
            }

            document.querySelector('.modal__wrapper').reset();
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            showMessage("Oops... Error during user registration <(＿ ＿)>");
        }

        name = '';
        email = '';
        address = '';
        password = '';
    });

    //+ Authorization:
    document.querySelector('[data-btn-signIn]').addEventListener('click', async (e) => {
        e.preventDefault();

        const emailInput = document.querySelector('#email-authorization'),
            passwordInput = document.querySelector('#password-authorization');

        const email = emailInput.value,
            password = passwordInput.value;

        if (!email || !password) {
            showMessage('Email and password are required to enter!');
            return;
        }

        try {
            const response = await fetch('/login', {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            console.log("Ответ от сервера:", data);

            if (response.ok) {
                showMessage(data.message);
                // Можно обновить UI
            } else {
                showMessage(data.message);
            }
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            showMessage(`Oops... ${data.message} <(＿ ＿)>`);
        }

        emailInput.value = '';
        passwordInput.value = '';
    });

    //+ Ссылка office:
    document.querySelector('#office').addEventListener('click', (e) => {
        e.preventDefault();
        checkAuth();
    });

    //+ Получение и отображение продуктов:
    fetchAndDisplayProducts();

    //+ Для поиска продуктов:
    document.querySelector('#search').addEventListener('input', async function() {
        const searchQuery = this.value.trim();
    
        if (searchQuery.length === 0) {
            // Очистка результатов, если поле пустое:
            document.querySelector('.modal__wrapper-products').innerHTML = '';
            return;
        }
    
        try {
            // Отправляю запрос на сервер для поиска продуктов:
            const response = await fetch(`/search-products?query=${searchQuery}`);
            const products = await response.json();
    
            if (response.ok) {
                // Очищаю текущие результаты поиска:
                const productsWrapper = document.querySelector('.modal-search__wrapper-products');
                productsWrapper.innerHTML = '';
    
                // Создание карточки продуктов:
                products.forEach(product => {
                    const card = document.createElement('div');
                    card.classList.add('modal-search__card');
    
                    card.innerHTML = `
                        <div class="modal-search__wrapper-img">
                            <img src="${product.img}" alt="coffee card" class="modal-search__img">
                        </div>
                        <h3 class="modal-search__name">${product.name}</h3>
                        <div class="modal-search__weights">${product.description}</div>
                        <div class="modal-search__price">${product.price}</div>
                        <a href="#" class="btn modal-search__btn">Order now</a>
                    `;
    
                    productsWrapper.appendChild(card);
                });
            } else {
                // Если нет продуктов:
                document.querySelector('.modal-search__wrapper-products').innerHTML = '<p class="modal__text">No products found ╯︿╰</p>';
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    });

    //+ Функции работающие с сервером:
    //+ Модалка с сообщениями:
    function showMessage(notification) {
        const modal = document.querySelector('.modal-message'),
            message = modal.querySelector('.modal__text');

        modal.classList.add('modal-message-active');
        message.innerHTML = notification;

        setTimeout(() => {
            modal.classList.remove('modal-message-active');
        }, 2500);
    }

    //+ для ссылки office:
    async function checkAuth() {
        try {
            const response = await fetch('/check-auth', {
                method: 'GET',
                credentials: 'same-origin' // Cookie будут передаваться с запросом
            });

            const data = await response.json();

            if (data.isAuthenticated) {
                window.location.href = `http://localhost:3000/office.html`;
            } else {
                showModal(modalAreaSignIn);
            }

        } catch (error) {
            console.error('Ошибка при проверке авторизации:', error);
            showModal(modalAreaSignIn);
        }
    }

    //+ Получение и отображение продуктов:
    async function fetchAndDisplayProducts() {
        try {
            // Запрашиваю продукты с сервера:
            const response = await fetch('/products');
            
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
    
            // Преобразую ответ в JSON:
            const products = await response.json();
    
            console.log(products);
    
            // Находим карусель
            const carousel = $('.menu__owl-carousel');
    
            // Уничтожаем текущую карусель, если она уже инициализирована:
            carousel.trigger('destroy.owl.carousel');
            carousel.html(''); // Очищаем содержимое карусели
    
            // Создаю карточки и добавляю их в карусель:
            products.forEach(product => {
                const card = `
                    <div class="menu__card">
                        <div class="menu__wrapper-img">
                            <img src="${product.img}" alt="${product.name}" class="menu__img">
                        </div>
                        <h3 class="menu__name">${product.name}</h3>
                        <div class="menu__weights">${product.description}</div>
                        <div class="menu__price">${product.price}</div>
                        <a href="#" class="btn menu__btn">Order now</a>
                    </div>
                `;
                carousel.append(card);
            });
    
            // Реинициализация карусели после добавления элементов:
            carousel.owlCarousel({
                loop: true,
                margin: 10,
                nav: false,
                responsive:{
                    0:{
                        items: 2
                    },
                    460:{
                        items: 3
                    },
                    770:{
                        items: 4
                    },
                    2000:{
                        items: 4
                    }
                }
            });
    
        } catch (error) {
            console.error('Ошибка при загрузке продуктов:', error);
        }
    }
    
});