'use strict'

document.addEventListener("DOMContentLoaded", async () => {

    //+ header:
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

    //+ Поиск:
    const modalSearch = document.querySelector('[data-modal-search]');

    document.querySelector('.header__search').addEventListener('click', () => {
        showModal(modalSearch);
    });

    modalSearch.addEventListener('click', () => {
        closeModal(modalSearch);
    });

    //+ Для поиска продуктов:
    document.querySelector('#search').addEventListener('input', async function () {
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
    
                // Создание карточек продуктов:
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
                        <a href="#" class="btn modal-search__btn" data-productId="${product.id}">Order now</a>
                    `;
    
                    productsWrapper.appendChild(card);
                });
    
                // Добавление обработчиков для кнопок "Order now":
                document.querySelectorAll('.modal-search__btn').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        event.preventDefault();
    
                        const productId = event.target.getAttribute('data-productId');
    
                        try {
                            const response = await fetch('/add-to-basket', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ productId })
                            });
    
                            if (response.ok) {
                                alert('Product added to the basket!');
                            } else {
                                alert('Failed to add product to the basket');
                            }
                        } catch (error) {
                            console.error('Error adding product to the basket:', error);
                        }
                    });
                });
            } else {
                // Если нет продуктов:
                document.querySelector('.modal-search__wrapper-products').innerHTML = '<p class="modal__text">No products found ╯︿╰</p>';
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    });

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