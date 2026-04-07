let selectedProduct = null;
let bsOrderModal;

document.addEventListener("DOMContentLoaded", () => {
  bsOrderModal = new bootstrap.Modal(document.getElementById("orderModal"));
});

// Load items when the "Products" link is clicked
let loadItemsBtn = document.getElementById("products-link");
loadItemsBtn.addEventListener("click", loadItems);


// Function to load items from the API
function loadItems() {
  fetch('https://dummyjson.com/products?limit=100')
    .then(responce => responce.json())
    .then(jsonData => {
      jsonData.products = jsonData.products.filter(p =>
        p.category === 'fragrances' || p.category === 'beauty');
      renderItems(jsonData);
    })
    .catch(error => console.error("Error loading items:", error));
}

// Function to render items in the DOM
function renderItems(data) {
  let output = '';
  let item = document.getElementById("items-container");

  data.products.forEach((product) => {


    output += `
            <div class="col">
              <div class="card" style="width: 18rem;">
               <img src="${product.images[0]}" class="card-img-top" alt="${product.title}">

                <div class="card-body">
                 ${product.brand ? `<h5 class="card-brand">${product.brand}</h5>` : ""}
                 <h1 class="card-title"> ${product.title}</h1>
                 <p class="card-text">${product.description}</p>
                 <p class="card-text text-danger"> Price: ${product.price}</p>
                 <a href="#" class="btn-buy buy-btn"
                  data-title="${product.title}"
                  data-price="${product.price}"
                  data-img="${product.images[0]}">Buy</a>
              </div>
            </div>
          </div>
                        
        `;
  });

  item.innerHTML = output;

  //
  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("previewImg").src = this.dataset.img;
      document.getElementById("previewImg").alt = this.dataset.title;
      document.getElementById("previewTitle").textContent = this.dataset.title;
      document.getElementById("previewPrice").textContent = "Price: $" + this.dataset.price;
      document.getElementById("modalProductPreview").classList.remove("d-none");
      document.getElementById("orderForm").classList.remove("d-none");
      document.getElementById("confirmBox").classList.add("d-none");
      selectedProduct = { title: this.dataset.title, price: this.dataset.price };
      bsOrderModal.show();
    });
  });
}



// Close modal / reset
document.getElementById("orderModal").addEventListener("hidden.bs.modal", () => {
  clearForm();
  document.getElementById("confirmBox").classList.add("d-none");
  document.getElementById("orderForm").classList.remove("d-none");
  document.getElementById("modalProductPreview").classList.add("d-none");
  selectedProduct = null;
});

// Confirm button closes modal
document.getElementById("confirmClose").addEventListener("click", () => {
  bsOrderModal.hide();
});

/* a. Namnet är minst 2 tecken och max 50 tecken - klar
b. E-postadressen måste innehålla @ och max 50 tecken
c. Telefonnummer får innehålla siffror, bindestreck och parenteser. Max 20 tecken.
d. Leveransadress enligt svensk standard:
i. Gatuadress: Min 2 tecken och Max 50 tecken
ii. Postnummer: Exakt 5 siffror
iii. Ort: Min 2 tecken och Max 20 tecken */

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

  document.getElementById("confirmText").innerHTML = `
    Thank you <strong>${name}</strong>!<br>
    Your order of <em>${selectedProduct.title}</em><br>
    will be delivered to <strong>${street}, ${zip} ${city}</strong>.
  `;

  document.getElementById("orderForm").classList.add("d-none");
  document.getElementById("modalProductPreview").classList.add("d-none");
  document.getElementById("confirmBox").classList.remove("d-none");
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