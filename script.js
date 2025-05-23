// Mulligan Market Cart Script
// Manages products, cart, quantities, localStorage persistence, and UI updates

// Product data for reference (should align with index.html product data)
const products = [
  {
    id: "pro-v1",
    name: "Titleist Pro V1",
    description: "Premium golf balls for precision and control on every shot.",
    prices: {
      dozen: 27,
      twoDozen: 48
    },
    image: "pro-v1.jpg" // optional, not used here
  },
  {
    id: "titleist",
    name: "Titleist",
    description: "Reliable performance and great feel for casual rounds.",
    prices: {
      dozen: 18,
      twoDozen: 33
    },
    image: "titleist.jpg"
  },
  {
    id: "callaway",
    name: "Callaway",
    description: "Durable golf balls delivering excellent distance and accuracy.",
    prices: {
      dozen: 18,
      twoDozen: 33
    },
    image: "callaway.jpg"
  },
  {
    id: "taylormade",
    name: "TaylorMade",
    description: "Innovative design for consistent shots and soft feel.",
    prices: {
      dozen: 18,
      twoDozen: 33
    },
    image: "taylormade.jpg"
  }
];

// Get DOM elements
const productsGrid = document.querySelector(".products-grid");
const cartCountElem = document.querySelector("#cart-count");
const cartItemsContainer = document.querySelector("#cart-items");
const cartTotalElem = document.querySelector("#cart-total");
const checkoutBtn = document.querySelector("#checkout-btn");

// Load cart from localStorage or initialize empty
let cart = JSON.parse(localStorage.getItem("mulliganCart")) || [];

// Utility: Save cart to localStorage
function saveCart() {
  localStorage.setItem("mulliganCart", JSON.stringify(cart));
}

// Utility: Format price as USD string
function formatPrice(num) {
  return "$" + num.toFixed(2);
}

// Render product cards dynamically (if you want to generate products dynamically - optional)
function renderProducts() {
  if (!productsGrid) return;
  productsGrid.innerHTML = "";
  products.forEach((product) => {
    const productHTML = `
      <div class="product" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" class="product-img" />
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.description}</p>
        <div class="price-qty">
          <label class="price-option">
            <input type="radio" name="price-${product.id}" value="dozen" checked /> 12 balls - ${formatPrice(product.prices.dozen)}
          </label>
          <label class="price-option">
            <input type="radio" name="price-${product.id}" value="twoDozen" /> 24 balls - ${formatPrice(product.prices.twoDozen)}
          </label>
        </div>
        <button class="btn-secondary add-to-cart-btn">Add to Cart</button>
      </div>
    `;
    productsGrid.insertAdjacentHTML("beforeend", productHTML);
  });
}

// Update cart count display
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  if (cartCountElem) {
    cartCountElem.textContent = count;
    cartCountElem.style.display = count > 0 ? "inline-block" : "none";
  }
}

// Calculate and update total price in cart
function updateCartTotal() {
  if (!cartTotalElem) return;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalElem.textContent = formatPrice(total);
}

// Render cart items in the cart page container
function renderCartItems() {
  if (!cartItemsContainer) return;
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Your cart is empty.</p>`;
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  let html = "";
  cart.forEach((item) => {
    html += `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.quantity} x ${formatPrice(item.price)}</p>
          <p><strong>Subtotal: </strong>${formatPrice(item.price * item.quantity)}</p>
        </div>
        <div class="cart-item-controls">
          <button class="btn-qty btn-decrease" aria-label="Decrease quantity">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="btn-qty btn-increase" aria-label="Increase quantity">+</button>
          <button class="btn-remove" aria-label="Remove item from cart">&times;</button>
        </div>
      </div>
    `;
  });
  cartItemsContainer.innerHTML = html;

  if (checkoutBtn) checkoutBtn.disabled = false;
}

// Add item to cart or increase quantity if exists
function addToCart(productId) {
  // Find product info
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  // Find selected price option
  const selectedPriceInput = document.querySelector(`input[name="price-${productId}"]:checked`);
  const priceKey = selectedPriceInput ? selectedPriceInput.value : "dozen";
  const price = product.prices[priceKey];

  // Check if product already in cart with same price option
  const existingIndex = cart.findIndex((item) => item.id === productId && item.price === price);
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: price,
      quantity: 1,
      priceKey: priceKey
    });
  }

  saveCart();
  updateCartCount();
  alert(`Added 1 ${product.name} (${priceKey === "dozen" ? "12 balls" : "24 balls"}) to cart.`);
}

// Remove item from cart
function removeFromCart(productId, price) {
  cart = cart.filter((item) => !(item.id === productId && item.price === price));
  saveCart();
  updateCartCount();
  renderCartItems();
  updateCartTotal();
}

// Change quantity for cart item
function changeQuantity(productId, price, delta) {
  const index = cart.findIndex((item) => item.id === productId && item.price === price);
  if (index === -1) return;

  cart[index].quantity += delta;
  if (cart[index].quantity < 1) {
    removeFromCart(productId, price);
  } else {
    saveCart();
    updateCartCount();
    renderCartItems();
    updateCartTotal();
  }
}

// Event delegation for Add to Cart buttons on index page
function setupAddToCartButtons() {
  if (!productsGrid) return;
  productsGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const productDiv = e.target.closest(".product");
      if (!productDiv) return;
      const productId = productDiv.dataset.id;
      addToCart(productId);
    }
  });
}

// Event delegation for cart item controls on cart page
function setupCartControls() {
  if (!cartItemsContainer) return;
  cartItemsContainer.addEventListener("click", (e) => {
    const cartItemDiv = e.target.closest(".cart-item");
    if (!cartItemDiv) return;

    const productId = cartItemDiv.dataset.id;
    const quantitySpan = cartItemDiv.querySelector(".quantity");
    const quantity = parseInt(quantitySpan.textContent);

    // Find the price for this cart item displayed subtotal
    const priceText = cartItemDiv.querySelector(".cart-item-info p:nth-child(2)").textContent;
    // Extract price number (e.g. "3 x $27.00")
    const priceMatch = priceText.match(/\$\d+(\.\d{2})?/);
    if (!priceMatch) return;
    const price = parseFloat(priceMatch[0].replace("$", ""));

    if (e.target.classList.contains("btn-increase")) {
      changeQuantity(productId, price, +1);
    } else if (e.target.classList.contains("btn-decrease")) {
      changeQuantity(productId, price, -1);
    } else if (e.target.classList.contains("btn-remove")) {
      removeFromCart(productId, price);
    }
  });
}

// Initialize everything on page load
function init() {
  updateCartCount();

  // Only render cart items if cart page (has cartItemsContainer)
  if (cartItemsContainer) {
    renderCartItems();
    updateCartTotal();
    setupCartControls();
  }

  // Setup add to cart buttons on index page
  if (productsGrid) {
    // Uncomment if you want to dynamically generate products here
    // renderProducts();
    setupAddToCartButtons();
  }

  // Setup checkout button listener (optional)
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("Checkout feature coming soon!");
    });
  }
}

// Run init on DOMContentLoaded
document.addEventListener("DOMContentLoaded", init);
