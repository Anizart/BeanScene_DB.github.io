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

//+ Вывод контента в корзине:
//+ Функции для работы с cookies:
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/`;
}
function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return JSON.parse(value);
    }
    return {};
}

//+ Функция обновления cookies (с возможностью удаления продукта):
function updateCookies(productId, basketItemId, selectedAdditivesArray = null) {
    let allAdditives = getCookie('selectedAdditives');

    if (selectedAdditivesArray !== null) {
        allAdditives[basketItemId] = selectedAdditivesArray;
    } else {
        delete allAdditives[basketItemId];
    }

    setCookie('selectedAdditives', allAdditives, 7);
}

//+ Основная функция загрузки корзины:
async function loadBasket() {
    try {
        const response = await fetch('/get-basket');
        const basketItems = await response.json();

        console.log(basketItems);
        
        if (basketItems.length === 0) { return; }

        const basketContainer = document.querySelector('.basket__null');
        if (!basketContainer) {
            console.error("Ошибка: контейнер для корзины не найден!");
            return;
        }
        basketContainer.innerHTML = '';

        basketItems.forEach(item => {
            const product = item.product;
            const card = document.createElement('div');
            card.classList.add('cards');
            card.innerHTML = `
                <div class="cards__card">
                    <img src="${product.img}" alt="${product.name}" class="cards__img">
                    <h3 class="cards__name">Selected product: ${product.name}</h3>
                    <div class="cards__weights">${product.description}</div>
                    <div class="cards__price">${product.price}$</div>
                    <button class="btn cards__btn-order" data-product-id="${product.id}" data-basket-item-id="${item.id}">Order</button>
                    <button type="submit" class="btn" data-btn-addTaste data-basket-item-id="${item.id}">Add</button>
                    <button class="btn cards__btn-remove" data-product-id="${product.id}" data-basket-item-id="${item.id}">Remove 🗑</button>
                </div>
            `;
            basketContainer.appendChild(card);

            //+ Обработчики кнопок:
            card.querySelector('.cards__btn-order').addEventListener('click', createOrder);
            card.querySelector('.cards__btn-remove').addEventListener('click', removeFromBasket);

            const modalAdditives = document.querySelector('[data-modal-additives]');
            modalAdditives.addEventListener('click', () => {
                closeModal(modalAdditives);
            });
            const addTasteButton = card.querySelector('[data-btn-addTaste]');

            if (addTasteButton) {
                addTasteButton.addEventListener('click', () => showAdditivesModal(product.id, item.id));
            }
        });

    } catch (error) {
        console.error('Error loading basket:', error);
    }
}

//+ Открытие модального окна с добавками для конкретного продукта:
function showAdditivesModal(productId, basketItemId) {
    const modalAdditives = document.querySelector('[data-modal-additives]');
    if (!modalAdditives) return;

    modalAdditives.dataset.currentProduct = productId;
    modalAdditives.dataset.currentBasketItem = basketItemId;
    showModal(modalAdditives);

    let selectedAdditives = new Set(getCookie('selectedAdditives')[basketItemId] || []);
    let selectedAdditivesArray = Array.from(selectedAdditives);

    //+ Обновление UI:
    document.querySelectorAll('[data-btn-add]').forEach(btn => {
        const additive = parseInt(btn.dataset.btnAdd, 10);
        if (selectedAdditives.has(additive)) {
            toggleCancelButton(btn, true);
        } else {
            toggleCancelButton(btn, false);
        }

        btn.onclick = () => {
            if (!selectedAdditives.has(additive)) {
                selectedAdditives.add(additive);
            } else {
                selectedAdditives.delete(additive);
            }
            selectedAdditivesArray = Array.from(selectedAdditives);
            updateCookies(productId, basketItemId, selectedAdditivesArray);
            toggleCancelButton(btn, selectedAdditives.has(additive));
        };
    });

    document.querySelector("[data-btn-done]").onclick = () => closeModal(modalAdditives);

    document.querySelector('[data-btn-cancellation]').onclick = () => {
        selectedAdditives.clear();
        selectedAdditivesArray = [];
        document.querySelectorAll('.cancel-btn').forEach(cancelBtn => cancelBtn.remove());
        updateCookies(productId, basketItemId, selectedAdditivesArray);
        closeModal(modalAdditives);
    };
}

//+ Функция для обновления cookies:
function updateCookies(productId, basketItemId, selectedAdditivesArray) {
    let allAdditives = getCookie('selectedAdditives');
    allAdditives[basketItemId] = selectedAdditivesArray;
    setCookie('selectedAdditives', allAdditives, 7);
}

//+ Переключение кнопки отмены:
function toggleCancelButton(addBtn, show) {
    const parent = addBtn.closest('.modal__additives');
    if (!parent) return;

    if (show) {
        let cancelBtn = parent.querySelector(`.cancel-btn[data-cancel="${addBtn.dataset.btnAdd}"]`);

        if (!cancelBtn) {
            cancelBtn = document.createElement('button');
            cancelBtn.classList.add('btn', 'cancel-btn', 'modal__btn-cancellation');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.dataset.cancel = addBtn.dataset.btnAdd;

            cancelBtn.addEventListener('click', () => {
                const additive = parseInt(addBtn.dataset.btnAdd, 10);
                let modalAdditives = document.querySelector('[data-modal-additives]');
                let productId = modalAdditives.dataset.currentProduct;
                let basketItemId = modalAdditives.dataset.currentBasketItem;
                let selectedAdditives = new Set(getCookie('selectedAdditives')[basketItemId] || []);
                selectedAdditives.delete(additive);
                updateCookies(productId, basketItemId, Array.from(selectedAdditives));
                cancelBtn.remove();
                toggleCancelButton(addBtn, false);
            });

            parent.appendChild(cancelBtn);
        }
    } else {
        const existingCancelBtn = parent.querySelector(`.cancel-btn[data-cancel="${addBtn.dataset.btnAdd}"]`);
        if (existingCancelBtn) existingCancelBtn.remove();
    }
}

//+ Загружаем корзину после загрузки страницы:
document.addEventListener('DOMContentLoaded', loadBasket);

//!

//+ Ссылка office:
document.querySelector('#office').addEventListener('click', (e) => {
    e.preventDefault();
    checkAuth();
});

//+ Функции работающие с сервером:
//+ Удаление карточек:
async function removeFromBasket(event) {
    const productId = event.target.dataset.productId;
    const basketItemId = event.target.dataset.basketItemId;

    try {
        const response = await fetch('/remove-from-basket', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        });

        const data = await response.json();
        console.log(data); // Логируем ответ сервера

        if (response.ok) {
            updateCookies(productId, basketItemId, null);

            if (data.message === 'Basket is empty') {
                document.querySelector('.basket-container').innerHTML = '<p>Корзина пуста</p>'; // Полностью очищаем корзину
            } else {
                loadBasket(); // Перезагрузка
            }
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
    const basketItemId = event.target.dataset.basketItemId;

    // Получаем добавки для этого продукта из cookies
    let allAdditives = getCookie('selectedAdditives') || {};
    let flavorAdditives = allAdditives[basketItemId] ? allAdditives[basketItemId].join(', ') : "Без добавок";

    try {
        const response = await fetch('/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, flavor_additive: flavorAdditives }),
        });

        if (response.ok) {
            showMessage("Заказ успешно создан!");

            // Удаляем добавки этого товара из cookies
            updateCookies(productId, basketItemId, null);

            // Удаляем карточку товара из корзины
            event.target.closest('.cards').remove();

            location.reload(); // Перезагрузка страницы
        } else {
            const error = await response.json();
            showMessage(`Ошибка при создании заказа: ${error.message}`);
        }
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        showMessage('Произошла ошибка при оформлении заказа.');
    }
}