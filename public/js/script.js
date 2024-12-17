'use strict'

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
})

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
            alert("Пользователь успешно зарегистрирован!");
        } else {
            alert("Ошибка: " + user.message);
        }
    } catch (error) {
        console.error("Ошибка при отправке данных:", error);
        alert("Ошибка при регистрации пользователя");
    }
});

//+ Authorization:
document.querySelector('[data-btn-signIn]').addEventListener('click', async (e) => {
    e.preventDefault();

    const email = document.querySelector('#email-authorization').value,
          password = document.querySelector('#password-authorization').value;

    if (!email || !password) {
        alert("Email и пароль обязательны для ввода!");
        return;
    }    

    try {
        const response = await fetch('/login', {  // Меняем URL на /login для авторизации
            method: "POST",
            body: JSON.stringify({ email, password }),  // Отправляем email и пароль
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log("Ответ от сервера:", data);

        if (response.ok) {
            alert("Вы успешно авторизовались!");
            // Можно здесь выполнить редирект на другую страницу или обновить UI
        } else {
            alert("Ошибка: " + data.message);
        }
    } catch (error) {
        console.error("Ошибка при отправке данных:", error);
        alert("Ошибка при авторизации");
    }
});