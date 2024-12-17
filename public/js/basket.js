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

//+ Контент страницы:

const basket = document.querySelector('.basket__product'),
      btnOrder = document.querySelector('.btn-order');

// let products = JSON.parse(localStorage.getItem('products')) || []; //? КАК СДЕЛАТЬ ВЫВОД?

//+ Проверка на наличие выбранных товаров:
// if (products.length > 0) {
//     basket.classList.add('delete-elem');
//     btnOrder.classList.remove('delete-elem');
//     showSards();
// } else {
//     empty.classList.remove('delete-elem');
//     btnOrder.classList.add('delete-elem');
// }

function showSards() {
    products.forEach(product => {
        const cards = document.createElement('div'),
              trimmedText = trimToWord(product.productSrc, "img");
        cards.classList.add('cards');
        cards.innerHTML = `
            <div class="cards__card">
                <img src="../${trimmedText}" alt="картинка товара" class="cards__img"></img>
                <div class="cards__description">Выранный товар: "${product.productName}"</div>
                <button class="cards__btn">Убрать 🗑</button>
            </div>
        `;
        document.querySelector('[data-container]').prepend(cards);
    });
}

{/* <h1>Shopping cart</h1>
<div class="basket__product">
    
</div>
<button class="btn btn-order">Order everything!</button>
</div> */}