let cart = [];

function addToCart(productName, quantity, price) {
  let totalPrice = quantity === '12' ? price * 12 : price * 24;

  let productIndex = cart.findIndex(item => item.name === productName && item.quantity === quantity);
  
  if (productIndex !== -1) {
    cart[productIndex].quantity += quantity === '12' ? 12 : 24;
    cart[productIndex].price += totalPrice;
  } else {
    cart.push({ name: productName, quantity: quantity === '12' ? 12 : 24, price: totalPrice });
  }

  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';

  let total = 0;

  cart.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.innerHTML = `${item.name} - ${item.quantity} balls - $${item.price}`;
    cartItems.appendChild(itemDiv);

    total += item.price;
  });

  document.getElementById('cart-total').innerText = total;

  document.getElementById('checkout-button').style.display = cart.length > 0 ? 'inline-block' : 'none';
}

document.getElementById('checkout-button').addEventListener('click', () => {
  if (cart.length > 0) {
    alert("Proceeding to checkout... (This can be implemented further with a checkout page or API)");
  } else {
    alert("Your cart is empty.");
  }
});
