let totalAmount = 0;

function addProduct() {
  const name = document.getElementById("productName").value;
  const qty = parseFloat(document.getElementById("productQty").value);
  const rate = parseFloat(document.getElementById("productRate").value);
  const vat = parseFloat(document.getElementById("productVAT").value);
  const discount = parseFloat(document.getElementById("productDiscount").value);

  if (!name || isNaN(qty) || isNaN(rate)) {
    alert("Please enter valid product information.");
    return;
  }

  const subtotal = qty * rate;
  const vatAmount = (subtotal * vat) / 100;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + vatAmount - discountAmount;

  totalAmount += total;

  const row = document.createElement("tr");
  row.innerHTML = `<td>${name}</td><td>${qty}</td><td>${rate}</td><td>${vat}%</td><td>${discount}%</td><td>Tk ${total.toFixed(2)}</td>`;

  document.querySelector("#invoiceTable tbody").appendChild(row);
  document.getElementById("totalAmount").innerText = "Total: Tk " + totalAmount.toFixed(2);

  // Clear input fields
  document.getElementById("productName").value = "";
  document.getElementById("productQty").value = "";
  document.getElementById("productRate").value = "";
  document.getElementById("productVAT").value = "";
  document.getElementById("productDiscount").value = "";
}
