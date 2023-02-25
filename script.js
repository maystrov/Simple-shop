const cartEl = document.querySelector('#cart-list');
const cartTotalEl = document.querySelector('.cart-total');
const cartList = document.getElementById('cart-list');
const orderBtn = document.querySelector('.make-order');
const showOrderBtn = document.querySelector('.orders-button');
const ordersEl = document.querySelector('#orders');
const closeBtn = document.querySelector('.close-button');

orderBtn.disabled = true;
if (localStorage.key(0) === null) {
  showOrderBtn.disabled = true;
} else showOrderBtn.disabled = false;

document.body.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-button')) onDeleteCartRow(e);
  else if (e.target.classList.contains('minus-button')) onMinusTotal(e);
  else if (e.target.classList.contains('plus-button')) onPlusTotal(e);
  else if (e.target.classList.contains('buy-button')) addToCart(e);
  else if (e.target.classList.contains('close-button')) clearOrders();
  else if (e.target.classList.contains('delete-order-button'))
    onDeleteOrderBtn(e);
  else if (e.target.classList.contains('make-order')) {
    saveCart();
    clearCart();
    orderBtn.disabled = true;
    showOrderBtn.disabled = false;
  } else if (e.target.classList.contains('orders-button')) {
    renderOrders();
  }
});

document.body.addEventListener('change', (e) => {
  if (e.target.classList.contains('quantity')) {
    calculateItemTotal(e);
    cartTotalCalc();
  }
});

function onDeleteOrderBtn(e) {
  const str = e.target.parentElement.textContent;
  const orderArr = str.split(' - ');
  const title = orderArr[1];
  localStorage.removeItem(`${title}`);
  e.target.parentElement.remove();

  if (ordersEl.childElementCount < 2) {
    ordersTotal.textContent = 'Total: 0$';
    closeBtn.classList.add('hidden');
  } else {
    orderTotalCount();
  }
  if (localStorage.key(0) === null) {
    showOrderBtn.disabled = true;
  } else showOrderBtn.disabled = false;
}

function orderTotalCount() {
  const ordersArr = Array.from(document.getElementsByClassName('order'));
  const newTotalArr = ordersArr.map((el) => {
    newArr = el.textContent.split(' ');
    let price = newArr[10];
    return +price.slice(0, -1);
  });
  let sum = newTotalArr.reduce((sum, current) => sum + current);
  let ordersTotal = document.querySelector('.orders-total');
  ordersTotal.textContent = `Total: ${sum}$ `;
}

function clearOrders() {
  while (ordersEl.firstChild) {
    ordersEl.removeChild(ordersEl.lastChild);
  }
  closeBtn.classList.add('hidden');
  // showOrderBtn.disabled = true;
}

function saveCart() {
  let cartItemsArr = Array.from(cartList.children);
  const cartTotal = document.querySelector('.cart-total').textContent;

  const date = new Date().toDateString().slice(4);
  const time = new Date().toLocaleTimeString().slice(0, -3);
  const orderTime = date + '  ' + time;

  let title,
    quantity,
    itemTotal = 0;
  for (let i = 0; i < cartItemsArr.length; i++) {
    title = cartItemsArr[i].querySelector('.products-title').textContent;
    quantity = cartItemsArr[i].querySelector('.quantity').value;
    itemTotal = cartItemsArr[i].querySelector('.total-price').textContent;
    const orderRow = {
      title: title,
      quantity: quantity,
      itemTotal: itemTotal,
      cartTotal: cartTotal,
      time: orderTime,
    };
    localStorage.setItem(`${title}`, JSON.stringify(orderRow));
  }
}

function clearCart() {
  while (cartEl.firstElementChild) {
    cartEl.removeChild(cartEl.lastElementChild);
  }
  cartTotalCalc();
}

function renderOrders() {
  let orderRowLS = {};
  if (ordersEl.firstElementChild) {
    clearOrders();
  }
  for (let i = 1; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    orderRowLS = JSON.parse(localStorage.getItem(`${key}`));
    const orderRow = new Element(
      'div',
      {
        class: 'order',
      },
      `${orderRowLS.time} - ${orderRowLS.title} - x${orderRowLS.quantity} - ${orderRowLS.itemTotal} `,
      'white'
    );
    const deleteOrderBtn = new Element(
      'Button',
      {
        class: 'delete-order-button',
      },
      `Delete`
    );
    orderRow.render('#orders');
    let orderRowEl = ordersEl.querySelector('.products-row');
    deleteOrderBtn.render(`.order:last-child`);
  }
  ordersTotal = document.createElement('div');
  ordersTotal.classList.add('orders-total');
  ordersEl.append(ordersTotal);
  orderTotalCount();
  closeBtn.classList.add('visible');
  closeBtn.classList.remove('hidden');
  if (ordersEl.childElementCount < 2) {
    closeBtn.classList.add('hidden');
  } else {
    closeBtn.classList.add('visible');
  }
}

function addToCart(e) {
  let total = 0;
  const buyButton = e.target;
  const imageSrc = buyButton.parentElement.getElementsByTagName('img')[0].src;
  const productTitle =
    buyButton.parentElement.querySelector('.products-title').textContent;
  const price = buyButton.previousElementSibling.textContent;
  const errorMessage = document.querySelector('.added-item');
  const cartTitles = Array.from(cartEl.querySelectorAll('.products-title'));
  const cartTitlesTextArr = cartTitles.map((el) => el.textContent);
  if (!cartTitlesTextArr.includes(productTitle)) {
    renderCartRow(imageSrc, productTitle, price);
    cartTotalCalc();
  } else {
    errorMessage.classList.add('error-visible');
    setTimeout(() => {
      errorMessage.classList.remove('error-visible');
    }, 2000);
  }
  orderBtn.disabled = false;
}

function renderCartRow(imageSrc, productTitle, price) {
  const newcartRow = document.createElement('li');
  newcartRow.classList.add('cart-row');
  cartEl.append(newcartRow);
  newcartRow.innerHTML = `<input type="button" class="delete-button" value="x">
    <div class="products-image"><img src="${imageSrc}" alt="mouse"></div>
    <span class="products-title">${productTitle}</span> 
    <span>${price}</span>
    <span class="quantity-section">
        <input type="button" class="cart-button minus-button" value="-">
        <input type="text" class="quantity" value="1"></input>
        <input type="button" class="cart-button plus-button" value="+">
    </span>
    <span class="total-price">${price}</span>`;
}

function calculateItemTotal(event) {
  const quantity = +event.target.parentElement.querySelector('.quantity').value;
  const itemTotal =
    event.target.parentElement.parentElement.querySelector('.total-price');
  const price = getNumber(
    event.target.parentElement.previousElementSibling.textContent
  );
  const result = quantity * price;
  itemTotal.textContent = result + '$';
}

function onDeleteCartRow(e) {
  e.target.parentElement.remove();
  cartTotalCalc();
  if (cartList.firstElementChild) {
    orderBtn.disabled = false;
  } else orderBtn.disabled = true;
}

function onMinusTotal(e) {
  let quantityEl = e.target.nextElementSibling;
  let quantity = +quantityEl.value;
  if (quantity > 0) {
    quantity--;
    quantityEl.value = quantity;
  } else quantity = 0;
  calculateItemTotal(e);
  cartTotalCalc();
}

function onPlusTotal(e) {
  let quantityEl = e.target.previousElementSibling;
  let quantity = quantityEl.value;
  quantity++;
  quantityEl.value = quantity;
  calculateItemTotal(e);
  cartTotalCalc();
}

function cartTotalCalc() {
  if (cartEl.firstElementChild) {
    let totalsArr = Array.from(document.querySelectorAll('.total-price'));
    const newTotals = totalsArr.map((el) => getNumber(el.textContent));
    const cartTotal = newTotals.reduce((accum, el) => accum + el);
    cartTotalEl.textContent = 'Total: ' + cartTotal + '$';
    return cartTotal;
  } else cartTotalEl.textContent = 'Total: 0$';
}

function getNumber(str) {
  return +str.replace(/[^-0-9-.]/, '');
}
