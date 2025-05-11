// Professional Invoice Generator - Advanced Edition
class InvoiceApp {
  constructor() {
    this.state = {
      invoice: {
        number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: this.getDueDate(30),
        items: [],
        subtotal: 0,
        tax: 0,
        discount: { amount: 0, type: 'percentage' },
        total: 0,
        currency: 'USD',
        exchangeRate: 1,
        status: 'draft',
        paymentMethod: '',
        paidAmount: 0,
        balanceDue: 0
      },
      company: {
        name: '',
        address: '',
        taxId: '',
        logo: null,
        bankDetails: {
          name: '',
          account: '',
          swift: ''
        }
      },
      client: {
        name: '',
        address: '',
        taxId: ''
      },
      settings: {
        taxRates: [
          { id: 'vat', name: 'VAT', rate: 20 },
          { id: 'gst', name: 'GST', rate: 18 },
          { id: 'sales', name: 'Sales Tax', rate: 10 }
        ],
        currencies: [
          { code: 'USD', symbol: '$', name: 'US Dollar' },
          { code: 'EUR', symbol: '€', name: 'Euro' },
          { code: 'GBP', symbol: '£', name: 'British Pound' },
          { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
        ],
        paymentTerms: [
          { id: 'immediate', name: 'Immediate Payment' },
          { id: '7', name: 'Net 7 Days' },
          { id: '15', name: 'Net 15 Days' },
          { id: '30', name: 'Net 30 Days' }
        ],
        theme: localStorage.getItem('theme') || 'light'
      },
      templates: [],
      signatures: [],
      lastSaved: null
    };

    this.init();
  }

  init() {
    // Initialize application
    this.loadFromLocalStorage();
    this.setupEventListeners();
    this.renderInvoice();
    this.setupServiceWorker();
    this.setupOfflineCapabilities();
    this.checkForUpdates();
  }

  // Core Business Logic
  calculateInvoice() {
    let subtotal = 0;
    let taxTotal = 0;
    
    this.state.invoice.items.forEach(item => {
      const itemTotal = item.quantity * item.price;
      subtotal += itemTotal;
      taxTotal += itemTotal * (item.taxRate / 100);
    });

    let discountAmount = 0;
    if (this.state.invoice.discount.type === 'percentage') {
      discountAmount = subtotal * (this.state.invoice.discount.amount / 100);
    } else {
      discountAmount = this.state.invoice.discount.amount;
    }

    this.state.invoice.subtotal = subtotal;
    this.state.invoice.tax = taxTotal;
    this.state.invoice.total = subtotal + taxTotal - discountAmount;
    this.state.invoice.balanceDue = this.state.invoice.total - this.state.invoice.paidAmount;

    this.saveToLocalStorage();
    this.renderInvoice();
  }

  // Advanced Features
  async generatePDF(options = {}) {
    try {
      // Enhanced PDF generation with professional template
      const element = document.getElementById('invoice-container');
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `invoice_${this.state.invoice.number}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'] 
        },
        ...options
      };

      // Show loading indicator
      this.showLoading(true);
      
      // Generate PDF with professional watermark
      await html2pdf()
        .set(opt)
        .from(element)
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          const totalPages = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.setTextColor(150);
            pdf.text(
              `Invoice ${this.state.invoice.number} - Page ${i} of ${totalPages}`,
              pdf.internal.pageSize.getWidth() - 60,
              pdf.internal.pageSize.getHeight() - 10
            );
          }
        })
        .save();
      
      // Track analytics
      this.trackEvent('PDF Generated', { invoiceNumber: this.state.invoice.number });
    } catch (error) {
      console.error('PDF generation error:', error);
      this.showNotification('PDF generation failed. Please try again.', 'error');
    } finally {
      this.showLoading(false);
    }
  }

  // Cloud Integration
  async saveToCloud() {
    try {
      // Implement actual cloud save with Firebase/Backend
      const response = await fetch('https://your-api-endpoint.com/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
          invoice: this.state.invoice,
          company: this.state.company,
          client: this.state.client
        })
      });

      if (!response.ok) throw new Error('Failed to save to cloud');
      
      const data = await response.json();
      this.state.lastSaved = new Date();
      this.showNotification('Invoice saved to cloud successfully', 'success');
      return data;
    } catch (error) {
      console.error('Cloud save error:', error);
      this.showNotification('Failed to save to cloud. Working offline.', 'warning');
      this.saveToLocalStorage();
      return null;
    }
  }

  // Security Enhancements
  sanitizeInput(input) {
    // Implement comprehensive input sanitization
    if (typeof input !== 'string') return input;
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#x2F;');
  }

  // Professional UI Components
  showLoading(show) {
    const loader = document.getElementById('loading-overlay');
    if (show) {
      loader.style.display = 'flex';
    } else {
      loader.style.display = 'none';
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button class="close-btn">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    notification.querySelector('.close-btn').addEventListener('click', () => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    });

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // ... (additional professional methods)
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const invoiceApp = new InvoiceApp();
  window.invoiceApp = invoiceApp; // Make available for debugging
  
  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(
      registration => console.log('ServiceWorker registration successful'),
      err => console.log('ServiceWorker registration failed: ', err)
    );
  }
});
