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
