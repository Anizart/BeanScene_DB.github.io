'use strict'

//+ header:
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

//+ Поиск:
const modalSearch = document.querySelector('[data-modal-search]');

document.querySelector('.header__search').addEventListener('click', () => {
    showModal(modalSearch);
});

modalSearch.addEventListener('click', () => {
    closeModal(modalSearch);
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

//+ Контент страницы:
async function loadBasket() {
    try {
        const response = await fetch('/get-basket');
        const basketItems = await response.json();

        console.log(basketItems);
        
        if (basketItems.length === 0) { return; }

        const basketContainer = document.querySelector('.basket__null');
        basketContainer.innerHTML = '';
        
        basketItems.forEach(item => {
            const product = item.product; // Связанный продукт
            const card = document.createElement('div');
            card.classList.add('cards');
            card.innerHTML = `
                <div class="cards__card">
                    <img src="${product.img}" alt="${product.name}" class="cards__img">
                    <h3 class="cards__name">Selected product: ${product.name}</h3>
                    <div class="cards__weights">${product.description}</div>
                    <div class="cards__price">${product.price}$</div>
                    <button class="btn cards__btn-order" data-product-id="${product.id}">Order</button>
                    <button class="btn cards__btn-remove" data-product-id="${product.id}">Remove 🗑</button>
                </div>
            `;
            basketContainer.appendChild(card);
        });

        // Обработчики для кнопок (Оформление заказа):
        document.querySelectorAll('.cards__btn-order').forEach((button) => {
            button.addEventListener('click', createOrder);
        });

        // Добавляю обработчик для удаления товара:
        document.querySelectorAll('.cards__btn-remove').forEach(button => {
            button.addEventListener('click', removeFromBasket);
        });
    } catch (error) {
        console.error('Error loading basket:', error);
    }
}

//+ Загрузка корзины при загрузке страницы:
document.addEventListener('DOMContentLoaded', loadBasket);

//+ Ссылка office:
document.querySelector('#office').addEventListener('click', (e) => {
    e.preventDefault();
    checkAuth();
});

//+ Функции работающие с сервером:
//+ Удаление карточек:
async function removeFromBasket(event) {
    const productId = event.target.dataset.productId;

    try {
        const response = await fetch('/remove-from-basket', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });

        const data = await response.json();

        if (response.ok) {
            loadBasket(); // Перезагрузка корзины
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error removing product from basket:', error);
    }
}

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

//+ для создания заказа:
async function createOrder(event) {
    const productId = event.target.dataset.productId;

    try {
        const response = await fetch('/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });

        if (response.ok) {
            // showMessage(response.message);
            alert('done');
            // Удалить карточку товара из корзины:
            event.target.closest('.cards').remove();

            location.reload(); // Перезагрузка страници
        } else {
            const error = await response.json();
            alert(`Failed to create order: ${error.message}`);
        }
    } catch (error) {
        console.error('Error creating order:', error);
        alert('An error occurred while creating the order.');
    }
}