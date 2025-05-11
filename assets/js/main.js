let totalAmount = 0;
let products = [];

function addProduct() {
  const name = val("productName");
  const qty = parseFloat(val("productQty"));
  const rate = parseFloat(val("productRate"));
  const vat = parseFloat(val("productVAT"));
  const discount = parseFloat(val("productDiscount"));

  const subtotal = qty * rate;
  const total = subtotal + (subtotal * vat / 100) - (subtotal * discount / 100);

  products.push({ name, qty, rate, vat, discount, total });
  totalAmount += total;

  const row = `<tr><td>${name}</td><td>${qty}</td><td>${rate}</td><td>${vat}%</td><td>${discount}%</td><td>Tk ${total.toFixed(2)}</td></tr>`;
  document.querySelector("#invoiceTable tbody").innerHTML += row;
  setText("totalAmount", `Total: Tk ${totalAmount.toFixed(2)}`);

  ["productName", "productQty", "productRate", "productVAT", "productDiscount"].forEach(id => setVal(id, ""));
}

function saveInvoice() {
  const invoice = {
    no: val("invoiceNo"),
    issueDate: val("issueDate"),
    dueDate: val("dueDate"),
    status: val("status"),
    clientName: val("clientName"),
    clientPhone: val("clientPhone"),
    notes: val("notes"),
    products,
    totalAmount
  };
  localStorage.setItem("fi9_invoice", JSON.stringify(invoice));
  alert("Invoice Saved!");
}

function loadInvoice() {
  const data = JSON.parse(localStorage.getItem("fi9_invoice"));
  if (!data) return alert("No saved invoice found.");
  setVal("invoiceNo", data.no);
  setVal("issueDate", data.issueDate);
  setVal("dueDate", data.dueDate);
  setVal("status", data.status);
  setVal("clientName", data.clientName);
  setVal("clientPhone", data.clientPhone);
  setVal("notes", data.notes);

  products = data.products || [];
  totalAmount = data.totalAmount || 0;
  document.querySelector("#invoiceTable tbody").innerHTML = "";
  products.forEach(p => {
    const row = `<tr><td>${p.name}</td><td>${p.qty}</td><td>${p.rate}</td><td>${p.vat}%</td><td>${p.discount}%</td><td>Tk ${p.total.toFixed(2)}</td></tr>`;
    document.querySelector("#invoiceTable tbody").innerHTML += row;
  });
  setText("totalAmount", `Total: Tk ${totalAmount.toFixed(2)}`);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function clearSignature() {
  const canvas = document.getElementById("signatureCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function val(id) { return document.getElementById(id).value; }
function setVal(id, v) { document.getElementById(id).value = v; }
function setText(id, txt) { document.getElementById(id).innerText = txt; }

window.onload = function () {
  const canvas = document.getElementById("signatureCanvas");
  const ctx = canvas.getContext("2d");
  let drawing = false;

  canvas.onmousedown = () => drawing = true;
  canvas.onmouseup = () => { drawing = false; ctx.beginPath(); };
  canvas.onmousemove = e => {
    if (!drawing) return;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  };

  // Optional Chart Example
  new Chart(document.getElementById("salesChart"), {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar"],
      datasets: [{
        label: "Sales",
        data: [12000, 15000, 18000],
        backgroundColor: "#007bff"
      }]
    }
  });
};
