let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add product to cart
function addToCart(productName, quantity, price) {
  let totalPrice = quantity === '12' ? price * 12 : price * 24;
  let productIndex = cart.findIndex(item => item.name === productName && item.quantity === (quantity === '12' ? 12 : 24));

  if (productIndex !== -1) {
    // Update the quantity and price of the existing product
    cart[productIndex].quantity += quantity === '12' ? 12 : 24;
    cart[productIndex].price += totalPrice;
  } else {
    // Add a new product to the cart
    cart.push({ name: productName, quantity: quantity === '12' ? 12 : 24, price: totalPrice });
  }

  // Save the updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  updateCart();
}

// Function to update the cart display
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';  // Clear the cart display

  let total = 0;

  // Display each item in the cart
  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.innerHTML = `${item.name} - ${item.quantity} balls - $${item.price}`;
    cartItems.appendChild(itemDiv);

    total += item.price;  // Add to total price
  });

  // Display the total price
  document.getElementById('cart-total').innerText = `Total: $${total.toFixed(2)}`;

  // Show checkout button only if there are items in the cart
  document.getElementById('checkout-button').style.display = cart.length > 0 ? 'inline-block' : 'none';
}

// Function to load the cart when the page is loaded
window.onload = function() {
  if (document.getElementById('cart-items')) {
    updateCart();  // Update the cart display when the cart page is loaded
  }
}

// Checkout Button functionality
document.getElementById('checkout-button')?.addEventListener('click', () => {
  if (cart.length > 0) {
    alert("Proceeding to checkout... (This can be implemented further with a checkout page or API)");
  } else {
    alert("Your cart is empty.");
  }
});
