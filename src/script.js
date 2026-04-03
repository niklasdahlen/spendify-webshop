let selectedProduct = null;
let bsOrderModal;

document.addEventListener("DOMContentLoaded", () => {
  bsOrderModal = new bootstrap.Modal(document.getElementById("orderModal"));
});

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
  if (val.length < 2)  return setFieldState(inp, err, "Name must be at least 2 characters.");
  if (val.length > 50) return setFieldState(inp, err, "Max 50 characters.");
  return setFieldState(inp, err, "");

}

// add functions for remaining criterias 


















document.getElementById("fName").addEventListener("blur", validateName);
document.getElementById("fEmail").addEventListener("blur", validateEmail);
document.getElementById("fPhone").addEventListener("blur", validatePhone);
document.getElementById("fStreet").addEventListener("blur", validateStreet);
document.getElementById("fZip").addEventListener("blur", validateZip);
document.getElementById("fCity").addEventListener("blur", validateCity);

document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();

  //add isValid methods from validation

  const isValid =
    validateName(); // add remaning validations

    if (!isValid) {
    document.getElementById("orderForm")
      .querySelector(".invalid")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const name   = document.getElementById("fName").value.trim();
  const street = document.getElementById("fStreet").value.trim();
  const zip    = document.getElementById("fZip").value.trim();
  const city   = document.getElementById("fCity").value.trim();

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