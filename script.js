let selectedProduct = null;
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let bsOrderModal;

document.addEventListener("DOMContentLoaded", () => {
  bsOrderModal = new bootstrap.Modal(document.getElementById("orderModal"));
  updateCartBadge();
});

let loadItemsBtn = document.getElementById("products-link");
loadItemsBtn.addEventListener("click", loadItems);

function loadItems() {
  fetch('https://dummyjson.com/products?limit=100')
    .then(responce => responce.json())
    .then(jsonData => renderItems(jsonData.products.filter(p => p.category === 'fragrances' || p.category === 'beauty')))
    .catch(error => console.error("Error loading items:", error));
}

function renderItems(products) {
  const container = document.getElementById("items-container");
  container.innerHTML = products
    .map(
      p => `
    <div class="col">
      <div class="card" style="width:18rem;">
        <img src="${p.images[0]}" class="card-img-top" alt="${p.title}">
        <div class="card-body">
          ${p.brand ? `<h5 class="card-brand">${p.brand}</h5>` : ""}
          <h1 class="card-title">${p.title}</h1>
          <p class="card-text">${p.description}</p>
          <p class="card-text text-danger">Price: $${p.price}</p>
          <a href="#" class="btn-buy add-cart-btn"
            data-id="${p.id}"
            data-title="${p.title}"
            data-price="${p.price}"
            data-img="${p.images[0]}">Add to cart</a>
        </div>
      </div>
    </div>`
    )
    .join("");
  
    container.querySelectorAll(".add-cart-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      addToCart({
        id: btn.dataset.id,
        title: btn.dataset.title,
        price: parseFloat(btn.dataset.price),
        img: btn.dataset.img,
      });
    });
  });
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}
 
function updateCartBadge() {
  const count = cart.reduce((s, item) => s + item.qty, 0);
  document.getElementById("cart-count").textContent = count;
}
 
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  renderCart();
  openCart();
}
 
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCart();
}
 
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}
 
function emptyCart() {
  cart = [];
  saveCart();
  renderCart();
}
 
function renderCart() {
  const container = document.getElementById("cartItems");
  const footer = document.getElementById("cartFooter");
 
  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty-msg">Your cart is empty.</p>';
    footer.classList.add("d-none");
    return;
  }
 
  container.innerHTML = cart
    .map(
      item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.title}" />
      <div class="cart-item-info">
        <p class="cart-item-title">${item.title}</p>
        <p class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</p>
        <div class="cart-qty-row">
          <button class="qty-btn" data-id="${item.id}" data-d="-1">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-d="1">+</button>
          <button class="remove-btn" data-id="${item.id}">&times;</button>
        </div>
      </div>
    </div>`
    )
    .join("");
 
  container.querySelectorAll(".qty-btn").forEach(btn =>
    btn.addEventListener("click", () =>
      changeQty(btn.dataset.id, parseInt(btn.dataset.d))
    )
  );
 
  container.querySelectorAll(".remove-btn").forEach(btn =>
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id))
  );
 
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById("cartTotal").textContent = "$" + total.toFixed(2);
  footer.classList.remove("d-none");
}

function openCart() {
  renderCart();
  document.getElementById("cartSidebar").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
}
function closeCart() {
  document.getElementById("cartSidebar").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
}
 
document.getElementById("cart-toggle").addEventListener("click", e => {
  e.preventDefault();
  openCart();
});
document.getElementById("cartClose").addEventListener("click", closeCart);
document.getElementById("cartOverlay").addEventListener("click", closeCart);
document.getElementById("cartEmpty").addEventListener("click", emptyCart);
 
document.getElementById("cartCheckout").addEventListener("click", () => {
  if (cart.length === 0) return;
  closeCart();
 
  const summary = document.getElementById("modalCartSummary");
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  summary.innerHTML =
    `<table class="cart-summary-table">
      <thead><tr><th>Product</th><th>Qty</th><th>Sum</th></tr></thead>
      <tbody>` +
    cart
      .map(
        i =>
          `<tr><td>${i.title}</td><td>${i.qty}</td><td>$${(i.price * i.qty).toFixed(2)}</td></tr>`
      )
      .join("") +
    `</tbody>
      <tfoot><tr><td colspan="2">Total</td><td><strong>$${total.toFixed(2)}</strong></td></tr></tfoot>
    </table>`;
 
  document.getElementById("orderForm").classList.remove("d-none");
  document.getElementById("confirmBox").classList.add("d-none");
  bsOrderModal.show();
});
 
document.getElementById("orderModal").addEventListener("hidden.bs.modal", () => {
  clearForm();
  document.getElementById("confirmBox").classList.add("d-none");
  document.getElementById("orderForm").classList.remove("d-none");
  document.getElementById("modalCartSummary").innerHTML = "";
});
 
document.getElementById("confirmClose").addEventListener("click", () => {
  bsOrderModal.hide();
});

function setFieldState(input, errorEl, message) {
  if (message) {
    input.classList.add("invalid");
    input.classList.remove("valid");
    errorEl.textContent = message;
    return false;
  }
  input.classList.remove("invalid");
  input.classList.add("valid");
  errorEl.textContent = "";
  return true;
}

function validateName() {
  const inp = document.getElementById("fName");
  const val = inp.value.trim();
  const err = document.getElementById("errName");
  if (val.length < 2) return setFieldState(inp, err, "Name must be at least 2 characters.");
  if (val.length > 50) return setFieldState(inp, err, "Max 50 characters.");
  return setFieldState(inp, err, "");

}

function validateEmail() {
  const inp = document.getElementById("fEmail");
  const val = inp.value.trim();
  const err = document.getElementById("errEmail");
  if (!val.length)        return setFieldState(inp, err, "Email is required.");
  if (!val.includes("@")) return setFieldState(inp, err, "Must contain @.");
  if (val.length > 50)    return setFieldState(inp, err, "Max 50 characters.");
  return setFieldState(inp, err, "");
}

function validatePhone() {
  const inp = document.getElementById("fPhone");
  const val = inp.value.trim();
  const err = document.getElementById("errPhone");
  if (val.length > 20) return setFieldState(inp, err, "Max 20 characters.");
  if (!/^[\d\s\-()]+$/.test(val)) return setFieldState(inp, err, "Only numbers, spaces, - and ().");
  return setFieldState(inp, err, "");
}

function validateStreet() {
  const inp = document.getElementById("fStreet");
  const val = inp.value.trim();
  const err = document.getElementById("errStreet");
  if (val.length < 2) return setFieldState(inp, err, "Street must be at least 2 characters.");
  if (val.length > 50) return setFieldState(inp, err, "Max 50 characters.");
  return setFieldState(inp, err, "");
}

function validateZip() {
  const inp = document.getElementById("fZip");
  const val = inp.value.trim();
  const err = document.getElementById("errZip");
  if (!/^\d{5}$/.test(val)) return setFieldState(inp, err, "Must be exactly 5 digits.");
  return setFieldState(inp, err, "");
}

function validateCity() {
  const inp = document.getElementById("fCity");
  const val = inp.value.trim();
  const err = document.getElementById("errCity");
  if (val.length < 2) return setFieldState(inp, err, "City must be at least 2 characters.");
  if (val.length > 20) return setFieldState(inp, err, "Max 20 characters.");
  return setFieldState(inp, err, "");
}


document.getElementById("fName").addEventListener("blur", validateName);
document.getElementById("fEmail").addEventListener("blur", validateEmail);
document.getElementById("fPhone").addEventListener("blur", validatePhone);
document.getElementById("fStreet").addEventListener("blur", validateStreet);
document.getElementById("fZip").addEventListener("blur", validateZip);
document.getElementById("fCity").addEventListener("blur", validateCity);

document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();

const isValid = validateName() & validateEmail() & validatePhone() & validateStreet() & validateZip() & validateCity();

  if (!isValid) {
    document.getElementById("orderForm")
      .querySelector(".invalid")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const name = document.getElementById("fName").value.trim();
  const street = document.getElementById("fStreet").value.trim();
  const zip = document.getElementById("fZip").value.trim();
  const city = document.getElementById("fCity").value.trim();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemList = cart.map(i => `${i.title} x${i.qty}`).join(", ");

  document.getElementById("confirmText").innerHTML = `
    Thank you <strong>${name}</strong>!<br>
    Your order (${itemList}) totalling <strong>$${total.toFixed(2)}</strong><br>    
    will be delivered to <strong>${street}, ${zip} ${city}</strong>.
  `;

  document.getElementById("orderForm").classList.add("d-none");
  document.getElementById("modalCartSummary").innerHTML = "";
  document.getElementById("confirmBox").classList.remove("d-none");

  cart = [];
  saveCart();
  renderCart();

});

function clearForm() {
  document.getElementById("orderForm").reset();
  document.querySelectorAll("#orderForm input").forEach(i => {
    i.classList.remove("valid", "invalid");
  });
  document.querySelectorAll("#orderForm .error").forEach(e => {
    e.textContent = "";
  });
}