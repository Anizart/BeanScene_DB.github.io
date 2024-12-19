'use strict'

document.addEventListener("DOMContentLoaded", async () => {

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

    //+ Получение данных пользователя:
        try {
            const res = await fetch('/user-profile', {
                method: 'GET',
                credentials: 'include' // Для отправки куки
            });

            if (!res.ok) {
                throw new Error("Failed to fetch user data");
            }

            //+ Получение данных пользователя:
            const userData = await res.json();

            document.querySelector('.office__profile-info').innerHTML = `
                <p><strong>Username:</strong> ${userData.name}</p>
                <p><strong>Email:</strong> ${userData.email}</p>
                <p><strong>Address:</strong> ${userData.address}</p>
            `;

        } catch (error) {
            console.error("Error fetching user data:", error);
            alert("Failed to load user data. Please try again.");
        }
});