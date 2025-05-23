// script.js

// Initialize cart array from localStorage or empty
let cart = [];
try {
  const storedCart = localStorage.getItem('cart');
  cart = storedCart ? JSON.parse(storedCart) : [];
} catch (error) {
  console.warn('LocalStorage read error:', error);
  cart = [];
}

// Save cart to localStorage
function saveCart() {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    alert('Unable to save cart. Your browser might be in private mode or storage is disabled.');
  }
}

// Add product to cart
function addToCart(name, quantity, pricePerSet) {
  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || (qty !== 12 && qty !== 24)) {
    alert('Invalid quantity selected.');
    return;
  }

  const existingItemIndex = cart.findIndex(item => item.name === name && item.quantity === qty);

  if (existingItemIndex >= 0) {
    cart[existingItemIndex].count++;
  } else {
    cart.push({ name, quantity: qty, pricePerSet, count: 1 });
  }

  saveCart();
  alert(`${qty} ${name} golf balls added to cart.`);
}

// Event listeners for add to cart buttons on index.html
function setupAddToCartButtons() {
  const products = document.querySelectorAll('.product');
  products.forEach(prod => {
    const btn = prod.querySelector('.add-to-cart-btn');
    const select = prod.querySelector('.quantity-select');
    btn.addEventListener('click', () => {
      const name = prod.dataset.name;
      const qty = select.value;
      const priceKey = qty === '12' ? 'price12' : 'price24';
      const pricePerSet = parseFloat(prod.dataset[priceKey]);
      addToCart(name, qty, pricePerSet);
    });
  });
}

// --- CART PAGE FUNCTIONS --- //

function loadCart() {
  if (!cart.length) return;

  const cartTableBody = document.getElementById('cart-table-body');
  if (!cartTableBody) return;

  cartTableBody.innerHTML = '';

  cart.forEach((item, idx) => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.textContent = item.name;
    tdName.className = 'cart-item-name';

    const tdQuantity = document.createElement('td');
    tdQuantity.textContent = `${item.quantity} balls x ${item.count} sets`;
    tdQuantity.className = 'cart-item-qty';

    const tdPricePerSet = document.createElement('td');
    tdPricePerSet.textContent = `$${item.pricePerSet.toFixed(2)}`;
    tdPricePerSet.className = 'cart-item-price';

    const tdTotalPrice = document.createElement('td');
    const totalPrice = item.pricePerSet * item.count;
    tdTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
    tdTotalPrice.className = 'cart-item-total';

    const tdRemove = document.createElement('td');
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'remove-btn';
    removeBtn.addEventListener('click', () => {
      cart.splice(idx, 1);
      saveCart();
      loadCart();
      updateCartCount();
    });
    tdRemove.appendChild(removeBtn);

    tr.append(tdName, tdQuantity, tdPricePerSet, tdTotalPrice, tdRemove);
    cartTableBody.appendChild(tr);
  });

  updateCartTotal();
  updateCartCount();
}

function updateCartTotal() {
  const totalEl = document.getElementById('cart-total');
  if (!totalEl) return;

  const total = cart.reduce((sum, item) => sum + item.pricePerSet * item.count, 0);
  totalEl.textContent = `$${total.toFixed(2)}`;
}

function updateCartCount() {
  const cartCountEls = document.querySelectorAll('.cart-count');
  const totalCount = cart.reduce((sum, item) => sum + item.count, 0);
  cartCountEls.forEach(el => {
    el.textContent = totalCount;
  });
}

// --- CHECKOUT PAGE FUNCTIONS --- //

function loadCheckoutCart() {
  const checkoutItems = document.getElementById('checkout-items');
  const totalEl = document.getElementById('checkout-total');
  if (!checkoutItems || !totalEl) return;

  checkoutItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item';

    const name = document.createElement('span');
    name.textContent = `${item.name} (${item.quantity} balls x ${item.count} sets)`;

    const price = document.createElement('span');
    const itemTotal = item.pricePerSet * item.count;
    price.textContent = `$${itemTotal.toFixed(2)}`;

    total += itemTotal;

    row.append(name, price);
    checkoutItems.appendChild(row);
  });

  totalEl.textContent = total.toFixed(2);
}

function validateCheckoutForm() {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const addressInput = document.getElementById('address');
  const cityInput = document.getElementById('city');
  const stateInput = document.getElementById('state');
  const zipInput = document.getElementById('zip');

  if (!nameInput.value.trim()) {
    alert('Please enter your full name.');
    nameInput.focus();
    return false;
  }
  if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
    alert('Please enter a valid email address.');
    emailInput.focus();
    return false;
  }
  if (!addressInput.value.trim()) {
    alert('Please enter your address.');
    addressInput.focus();
    return false;
  }
  if (!cityInput.value.trim()) {
    alert('Please enter your city.');
    cityInput.focus();
    return false;
  }
  if (!stateInput.value.trim()) {
    alert('Please enter your state.');
    stateInput.focus();
    return false;
  }
  if (!zipInput.value.trim()) {
    alert('Please enter your ZIP/postal code.');
    zipInput.focus();
    return false;
  }

  if (!cart.length) {
    alert('Your cart is empty. Please add items before checkout.');
    return false;
  }
  return true;
}

function placeOrder() {
  if (!validateCheckoutForm()) return;

  alert('Thank you for your order! We will contact you soon.');

  cart = [];
  saveCart();

  window.location.href = 'index.html';
}

// --- Init page-specific logic --- //

function init() {
  const page = document.body.dataset.page;

  if (page === 'index') {
    setupAddToCartButtons();
    updateCartCount();
  } else if (page === 'cart') {
    loadCart();
  } else if (page === 'checkout') {
    updateCartCount();
    loadCheckoutCart();

    const orderForm = document.getElementById('checkout-form');
    if (orderForm) {
      orderForm.addEventListener('submit', e => {
        e.preventDefault();
        placeOrder();
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
