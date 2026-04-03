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