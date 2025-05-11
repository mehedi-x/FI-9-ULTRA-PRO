// Global Variables
let items = [];
let total = 0;
let invoiceNumber = 1;

// Theme Switcher
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
});

// Logo Upload
document.getElementById('logo-upload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '150px';
            img.style.maxHeight = '150px';
            document.getElementById('logo-preview').innerHTML = '';
            document.getElementById('logo-preview').appendChild(img);
        }
        reader.readAsDataURL(file);
    }
});

// Add Item Row
document.getElementById('add-item').addEventListener('click', addItemRow);

function addItemRow() {
    const tbody = document.getElementById('item-list');
    const tr = document.createElement('tr');
    tr.className = 'item-row';
    tr.innerHTML = `
        <td><input type="text" class="input-control item-name" placeholder="Item name" required></td>
        <td><textarea class="input-control item-description" placeholder="Description" rows="2"></textarea></td>
        <td><input type="number" class="input-control quantity" min="1" value="1" required></td>
        <td><input type="number" class="input-control price" min="0" step="0.01" required></td>
        <td><input type="number" class="input-control tax-rate" min="0" max="100" value="0"></td>
        <td><input type="number" class="input-control amount" readonly></td>
        <td><button type="button" class="btn delete-row"><i class="fas fa-trash"></i></button></td>
    `;
    tbody.appendChild(tr);
    
    // Add event listeners to new row
    addRowEventListeners(tr);
}

// Calculate Row Amount
function calculateRowAmount(row) {
    const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
    const price = parseFloat(row.querySelector('.price').value) || 0;
    const taxRate = parseFloat(row.querySelector('.tax-rate').value) || 0;
    
    const subtotal = quantity * price;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    
    row.querySelector('.amount').value = total.toFixed(2);
    calculateTotal();
}

// Calculate Total
function calculateTotal() {
    const rows = document.querySelectorAll('.item-row');
    let subtotal = 0;
    let taxTotal = 0;
    
    rows.forEach(row => {
        const quantity = parseFloat(row.querySelector('.quantity').value) || 0;
        const price = parseFloat(row.querySelector('.price').value) || 0;
        const taxRate = parseFloat(row.querySelector('.tax-rate').value) || 0;
        
        const rowSubtotal = quantity * price;
        const rowTax = rowSubtotal * (taxRate / 100);
        
        subtotal += rowSubtotal;
        taxTotal += rowTax;
    });
    
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const discountType = document.getElementById('discount-type').value;
    
    let discountAmount = 0;
    if (discountType === 'percentage') {
        discountAmount = subtotal * (discount / 100);
    } else {
        discountAmount = discount;
    }
    
    const total = subtotal + taxTotal - discountAmount;
    
    document.querySelector('.subtotal-amount').textContent = subtotal.toFixed(2);
    document.querySelector('.tax-amount').textContent = taxTotal.toFixed(2);
    document.querySelector('.total-amount').textContent = total.toFixed(2);
}

// Delete Row
function deleteRow(button) {
    button.closest('tr').remove();
    calculateTotal();
}

// Add Event Listeners to Row
function addRowEventListeners(row) {
    const inputs = row.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', () => calculateRowAmount(row));
    });
    
    row.querySelector('.delete-row').addEventListener('click', function() {
        deleteRow(this);
    });
}

// Generate QR Code
function generateQR() {
    const qrData = {
        invoiceNumber: document.getElementById('invoice-num').value,
        amount: document.querySelector('.total-amount').textContent,
        date: document.getElementById('invoice-date').value
    };
    
    const qr = new QRCode(document.getElementById('qr-code'), {
        text: JSON.stringify(qrData),
        width: 128,
        height: 128
    });
}

// Initialize Signature Pad
const canvas = document.getElementById('signature-pad');
const signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgb(255, 255, 255)'
});

document.getElementById('clear-signature').addEventListener('click', () => {
    signaturePad.clear();
});

// Generate PDF
document.getElementById('download-pdf').addEventListener('click', () => {
    const element = document.getElementById('invoice-container');
    const opt = {
        margin: 1,
        filename: `invoice-${document.getElementById('invoice-num').value}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Add first row
    addItemRow();
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoice-date').value = today;
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    document.getElementById('due-date').value = thirtyDaysFromNow.toISOString().split('T')[0];
    
    // Generate initial QR code
    generateQR();
});
// Add touch scroll for tables on mobile
document.querySelectorAll('.product-table').forEach(table => {
  let isDown = false;
  let startX;
  let scrollLeft;

  table.addEventListener('mousedown', (e) => {
    isDown = true;
    table.classList.add('active');
    startX = e.pageX - table.offsetLeft;
    scrollLeft = table.scrollLeft;
  });

  table.addEventListener('mouseleave', () => {
    isDown = false;
    table.classList.remove('active');
  });

  table.addEventListener('mouseup', () => {
    isDown = false;
    table.classList.remove('active');
  });

  table.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - table.offsetLeft;
    const walk = (x - startX) * 2;
    table.scrollLeft = scrollLeft - walk;
  });

  // Touch events
  table.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX - table.offsetLeft;
    scrollLeft = table.scrollLeft;
  });

  table.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    const x = e.touches[0].pageX - table.offsetLeft;
    const walk = (x - startX) * 2;
    table.scrollLeft = scrollLeft - walk;
  });
});

// Prevent zoom on iOS when focusing inputs
document.addEventListener('gesturestart', function(e) {
  e.preventDefault();
});

// Add viewport height fix for mobile browsers
function setMobileViewportHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setMobileViewportHeight);
setMobileViewportHeight();
