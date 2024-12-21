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

    //+ Modals SignIn, SignUp and EditProfile:
    const modalAreaSignIn = document.querySelector('[data-modal-signIn]'),
          modalAreaSignUp = document.querySelector('[data-modal-signUp]'),
          modalSignIn = document.querySelector('[data-open-signIn]'),
          modalSignUp = document.querySelector('[data-open-signUp]'),
          entrance = modalAreaSignUp.querySelector('[data-linkRegistration]'),
          createAccount = modalAreaSignIn.querySelector('[data-linkAuthorization]'),
          btnEdit = document.querySelector('.btn-edit'),
          modalEdit = document.querySelector('[data-modal-edit]');

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

    //+ Edit btn:
    btnEdit.addEventListener('click', () => {
        showModal(modalEdit);
    });
    modalEdit.addEventListener('click', () => {
        closeModal(modalEdit);
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

    //+ Получение данных с сервера:
    //+ Получение данных пользователя:
        try {
            const res = await fetch('/user-profile', {
                method: 'GET',
                credentials: 'include' // Для отправки куки
            });

            if (!res.ok) {
                throw new Error("Failed to fetch user data");
            }

            //+ Получение данных:
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

    //+ Редактирование профиля:
    const editForm = document.querySelector('[data-edit-form]'),
          nameInput = editForm.querySelector('#name'),
          addressInput = editForm.querySelector('#address'),
          passwordInput = editForm.querySelector('#password');

    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedData = {
            name: nameInput.value,
            address: addressInput.value,
            password: passwordInput.value,
        };

        try {
            const response = await fetch('/update-profile', {
                method: 'PUT', // PUT(для изменение данных) означает что запрос можно выполнять многократно, и результат будет одинаковым и будет правильно по REST-семантики
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // так как использую cookies
                body: JSON.stringify(updatedData),
            });

            const result = await response.json();

            if (response.ok) {
                showMessage('Profile updated o(￣▽￣)ｄ');

                modalEdit.classList.remove('modal-area-active');
                document.body.style.overflow = '';

                location.reload(); // Перезагрузка страници
            } else {
                displayError(result.message + ' <( _ _ )>');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showMessage('Failed to update profile. Please try again.');
        }
    });

    //+ Выход:
    const exitBtn = document.querySelector('.btn-exit'),
          modalQuestion = document.querySelector('[data-modal-question]'),
          btnNo = modalQuestion.querySelector('[data-btn]'),
          btnYes = modalQuestion.querySelector('[data-btn-exit]');

    exitBtn.addEventListener('click', () => {
        showModal(modalQuestion);
    });
    modalQuestion.addEventListener('click', () => {
        closeModal(modalQuestion);
    });

    btnNo.addEventListener('click', () => {
        closeModal(modalQuestion);
    });

    btnYes.addEventListener('click', async () => {
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                credentials: 'include', // Для передачи куков
            });
    
            if (response.ok) {
                closeModal(modalQuestion);
    
                window.location.href = '/'; // Перенаправляю пользователя на главную страницу
                showMessage('Come back soon!（￣︶￣）↗');
            } else {
                const errorData = await response.json();
                showMessage(`Failed to logout: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error during logout:', error);
            showMessage('An error occurred. Please try again. <(＿　＿)>');
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
});