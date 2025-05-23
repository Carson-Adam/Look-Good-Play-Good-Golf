// --- Product data ---
const products = [
  {
    id: 'taylormade',
    name: 'TaylorMade',
    img: 'Taylormade.jpg.jpeg',
    desc: 'High-performance golf balls designed for precision and distance.',
    prices: {12: 18, 24: 33}
  },
  {
    id: 'prov1',
    name: 'Pro V1',
    img: 'prov1.jpg.jpeg',
    desc: 'Premium golf balls favored by professionals for exceptional feel.',
    prices: {12: 27, 24: 52}
  },
  {
    id: 'titleist',
    name: 'Titleist',
    img: '', // no image yet
    desc: 'Trusted classic golf balls providing consistency and control.',
    prices: {12: 18, 24: 33}
  },
  {
    id: 'callaway',
    name: 'Callaway',
    img: 'callaway.jpg.jpeg',
    desc: 'Innovative golf balls offering superb distance and accuracy.',
    prices: {12: 18, 24: 33}
  }
];

// --- Get DOM elements ---
const productContainer = document.getElementById('products-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartSummary = document.getElementById('cart-summary');
const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');
const checkoutSection = document.getElementById('checkout');
const checkoutForm = document.getElementById('checkout-form');
const confirmationMsg = document.getElementById('confirmation-msg');

// --- Cart data ---
let cart = JSON.parse(localStorage.getItem('cart')) || {};

// --- Render products ---
function renderProducts() {
  productContainer.innerHTML = '';
  products.forEach(product => {
    const price12 = product.prices[12];
    const price24 = product.prices[24];
    const imgSrc = product.img || 'https://via.placeholder.com/240x160?text=No+Image';

    const productHTML = `
      <div class="product" data-id="${product.id}">
        <img src="${imgSrc}" alt="${product.name}" class="product-img" />
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>
        <select class="qty-select" aria-label="Select quantity for ${product.name}">
          <option value="12">12 Balls - $${price12}</option>
          <option value="24">24 Balls - $${price24}</option>
        </select>
        <button class="btn-secondary add-to-cart-btn">Add to Cart</button>
      </div>
    `;
    productContainer.insertAdjacentHTML('beforeend', productHTML);
  });

  // Attach event listeners to buttons
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', handleAddToCart);
  });
}

// --- Add to Cart Handler ---
function handleAddToCart(e) {
  const productElem = e.target.closest('.product');
  const productId = productElem.dataset.id;
  const qtySelect = productElem.querySelector('.qty-select');
  const qty = parseInt(qtySelect.value);

  // Add or update cart entry
  if (cart[productId]) {
    cart[productId].qty += qty;
  } else {
    cart[productId] = {
      qty: qty
    };
  }

  // Save cart and update UI
  saveCart();
  renderCart();
  showConfirmation(`Added ${qty} ${products.find(p => p.id === productId).name} balls to cart!`);
}

// --- Save cart to localStorage ---
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// --- Render Cart ---
function renderCart() {
  cartItemsContainer.innerHTML = '';
  const entries = Object.entries(cart);
  if (entries.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartSummary.textContent = '';
    proceedCheckoutBtn.disabled = true;
    return;
  }

  proceedCheckoutBtn.disabled = false;

  let totalPrice = 0;
  entries.forEach(([productId, {qty}]) => {
    const product = products.find(p => p.id === productId);
    // Calculate price for qty, split into packs of 12 or 24
    // Because you only sell packs of 12 or 24, and qty is cumulative packs count
    // We store cumulative qty in balls, not packs, so let’s treat qty as number of balls here.

    // But actually, we stored cumulative qty as number of balls, so prices depend on packs size.

    // We must find how many packs of 12 and 24 in qty — but since you only add 12 or 24 at a time, let's do simpler:
    // For now, assume qty is total balls in cart for that product.

    // Price calculation based on packs: 
    // Try to use max packs of 24, remainder packs of 12.

    const packs24 = Math.floor(qty / 24);
    const remainder12 = qty % 24;

    // remainder12 must be divisible by 12 (only 12 or 24 allowed), so we will round down to nearest 12.
    const packs12 = remainder12 >= 12 ? 1 : 0;

    const priceForProduct = packs24 * product.prices[24] + packs12 * product.prices[12];

    totalPrice += priceForProduct;

    cartItemsContainer.insertAdjacentHTML('beforeend', `
      <div class="cart-item" data-id="${product.id}" style="margin-bottom: 1rem;">
        <strong>${product.name}</strong> — ${qty} balls<br />
        <span>Price: $${priceForProduct.toFixed(2)}</span>
      </div>
    `);
  });

  cartSummary.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// --- Show confirmation message ---
function showConfirmation(msg) {
  confirmationMsg.textContent = msg;
  confirmationMsg.style.opacity = '1';
  setTimeout(() => {
    confirmationMsg.style.opacity = '0';
  }, 3000);
}

// --- Proceed to checkout ---
proceedCheckoutBtn.addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    alert('Your cart is empty!');
    return;
  }
  document.getElementById('cart').scrollIntoView({behavior: 'smooth'});
  checkoutSection.scrollIntoView({behavior: 'smooth'});
});

// --- Handle checkout form submission ---
checkoutForm.addEventListener('submit', function(e) {
  e.preventDefault();

  // Validate inputs
  const name = checkoutForm.elements['name'].value.trim();
  const email = checkoutForm.elements['email'].value.trim();
  const address = checkoutForm.elements['address'].value.trim();

  if (!name || !email || !address) {
    alert('Please fill in all checkout fields.');
    return;
  }

  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Calculate total price
  let totalPrice = 0;
  for (const [productId, {qty}] of Object.entries(cart)) {
    const product = products.find(p => p.id === productId);
    const packs24 = Math.floor(qty / 24);
    const remainder12 = qty % 24;
    const packs12 = remainder12 >= 12 ? 1 : 0;
    totalPrice += packs24 * product.prices[24] + packs12 * product.prices[12];
  }

  // Create PayPal checkout URL (sandbox or live)
  // For simplicity, we'll send the total amount as a single payment
  // PayPal URL format for direct payment:
  // https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=YOUR_PAYPAL_EMAIL&item_name=Mulligan+Bros+Order&amount=TOTAL&currency_code=USD&return=YOUR_RETURN_URL&cancel_return=YOUR_CANCEL_URL

  const paypalEmail = 'your-paypal-email@example.com'; // Replace with your actual PayPal email
  const returnUrl = window.location.href + '?payment=success';
  const cancelUrl = window.location.href + '?payment=cancel';

  const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(paypalEmail)}&item_name=${encodeURIComponent('Mulligan Bros Order')}&amount=${totalPrice.toFixed(2)}&currency_code=USD&return=${encodeURIComponent(returnUrl)}&cancel_return=${encodeURIComponent(cancelUrl)}`;

  // Optionally: Save order info locally or send to server before redirect

  // Clear cart
  cart = {};
  saveCart();
  renderCart();

  // Show confirmation and redirect to PayPal
  alert(`Thank you for your order, ${name}! Redirecting to PayPal to complete payment.`);
  window.location.href = paypalUrl;
});

// --- Email validation ---
function validateEmail(email) {
  // Simple regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

// --- Initialization ---
renderProducts();
renderCart();
