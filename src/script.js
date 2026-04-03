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