let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add item to cart
function addToCart(productName, quantity, unitPrice) {
  const qty = parseInt(quantity);
  const pricePerSet = qty === 12 ? unitPrice : qty === 24 ? unitPrice === 18 ? 33 : 52 : 0;

  const productIndex = cart.findIndex(item => item.name === productName && item.quantity === qty);

  if (productIndex !== -1) {
    cart[productIndex].quantity += qty;
    cart[productIndex].price += pricePerSet;
  } else {
    cart.push({
      name: productName,
      quantity: qty,
      price: pricePerSet
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${productName} (${qty} balls) added to cart.`);
  updateCart();
}

// Update cart display on cart.html
function updateCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-button');

  if (!cartItemsDiv) return;

  cartItemsDiv.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cart-item');
    itemDiv.innerHTML = `
      <strong>${item.name}</strong> - ${item.quantity} balls - $${item.price.toFixed(2)}
      <button class="remove-button" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsDiv.appendChild(itemDiv);
    total += item.price;
  });

  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
  checkoutBtn.style.display = cart.length > 0 ? 'inline-block' : 'none';
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCart();
}

// On checkout page: handle form submit
function handleCheckoutForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    alert("Thank you for your order! (Payment integration can be added later.)");

    cart = [];
    localStorage.removeItem('cart');
    window.location.href = 'index.html';
  });
}

// On page load, run updates
window.onload = function () {
  updateCart();
  handleCheckoutForm();
};
