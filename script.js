let cart = [];

function addToCart(product, quantity, price) {
  const existingProduct = cart.find(item => item.product === product && item.quantity === quantity);
  
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      product,
      quantity: parseInt(quantity),
      price: price,
    });
  }

  alert(`${product} added to cart!`);
  console.log(cart);
}
// Sample cart array for testing
let cart = [];

function addToCart(product, quantity, price) {
  const existingProduct = cart.find(item => item.product === product && item.quantity === quantity);
  
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      product,
      quantity: parseInt(quantity),
      price: price,
    });
  }

  alert(`${product} added to cart!`);
  console.log(cart);
}

// Load cart items into the cart page
function loadCart() {
  const cartContainer = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price');
  
  // Clear current cart items
  cartContainer.innerHTML = '';

  let totalPrice = 0;

  cart.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');
    
    itemElement.innerHTML = `
      <img src="https://via.placeholder.com/60" alt="${item.product}" />
      <div class="cart-item-details">
        <h3>${item.product}</h3>
        <p>Price: $${item.price} x ${item.quantity}</p>
        <p>Total: $${item.price * item.quantity}</p>
      </div>
      <button onclick="removeFromCart(${index})">Remove</button>
    `;

    cartContainer.appendChild(itemElement);
    totalPrice += item.price * item.quantity;
  });

  totalPriceElement.textContent = totalPrice.toFixed(2);
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  loadCart();
}

// Initialize cart page
if (document.getElementById('cart-items')) {
  loadCart();
}
