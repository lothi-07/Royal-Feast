// Scroll-reveal animations
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach((el) => revealObserver.observe(el));

// Voucher modal
const voucherModal = document.getElementById('voucherModal');
const redeemBtn = document.getElementById('redeemBtn');
const closeVoucher = document.getElementById('closeVoucher');
const voucherOverlay = document.querySelector('.voucher-overlay');

function openVoucher() {
  voucherModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeVoucherModal() {
  voucherModal.classList.remove('active');
  document.body.style.overflow = '';
}

if (redeemBtn) redeemBtn.addEventListener('click', openVoucher);
if (closeVoucher) closeVoucher.addEventListener('click', closeVoucherModal);
if (voucherOverlay) voucherOverlay.addEventListener('click', closeVoucherModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (voucherModal?.classList.contains('active')) closeVoucherModal();
    if (orderModal?.classList.contains('active')) closeOrderModal();
  }
});

// Navbar shadow on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.classList.toggle('navbar-scrolled', window.scrollY > 60);
});

// Order modal
const orderModal = document.getElementById('orderModal');
const orderOverlay = document.querySelector('.order-overlay');
const closeOrderBtn = document.getElementById('closeOrder');
const confirmOrderBtn = document.getElementById('confirmOrder');
const orderToast = document.getElementById('orderToast');
const orderToastMsg = document.getElementById('orderToastMsg');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');
const orderQtyEl = document.getElementById('orderQty');
const orderTotalEl = document.getElementById('orderTotal');

let currentOrder = { name: '', price: 0, priceLabel: '', qty: 1 };

function parsePrice(priceStr) {
  const match = priceStr.replace(/,/g, '').match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function formatPrice(amount) {
  return '₹' + amount;
}

function updateOrderTotal() {
  if (!orderTotalEl) return;
  if (currentOrder.price === 0) {
    orderTotalEl.textContent = currentOrder.priceLabel;
    return;
  }
  orderTotalEl.textContent = formatPrice(currentOrder.price * currentOrder.qty);
}

function openOrderModal(btn) {
  const name = btn.dataset.orderName || 'Item';
  const priceLabel = btn.dataset.orderPrice || '₹0';
  const desc = btn.dataset.orderDesc || '';
  const img = btn.dataset.orderImg || '';
  const time = btn.dataset.orderTime || '25–30 mins';

  currentOrder = {
    name,
    price: parsePrice(priceLabel),
    priceLabel,
    qty: 1,
  };

  document.getElementById('orderTitle').textContent = name;
  document.getElementById('orderDesc').textContent = desc;
  document.getElementById('orderPrice').textContent = priceLabel;
  document.getElementById('orderTime').textContent = time;
  document.getElementById('orderImg').src = img;
  document.getElementById('orderImg').alt = name;
  orderQtyEl.textContent = '1';
  updateOrderTotal();

  orderModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
  orderModal.classList.remove('active');
  document.body.style.overflow = '';
}

function showOrderToast(message) {
  orderToastMsg.textContent = message;
  orderToast.classList.add('show');
  setTimeout(() => orderToast.classList.remove('show'), 3500);
}

document.querySelectorAll('.menu-order-btn, .delivery-order-btn').forEach((btn) => {
  btn.addEventListener('click', () => openOrderModal(btn));
});

if (closeOrderBtn) closeOrderBtn.addEventListener('click', closeOrderModal);
if (orderOverlay) orderOverlay.addEventListener('click', closeOrderModal);

if (qtyMinus) {
  qtyMinus.addEventListener('click', () => {
    if (currentOrder.qty > 1) {
      currentOrder.qty -= 1;
      orderQtyEl.textContent = currentOrder.qty;
      updateOrderTotal();
    }
  });
}

if (qtyPlus) {
  qtyPlus.addEventListener('click', () => {
    if (currentOrder.qty < 10) {
      currentOrder.qty += 1;
      orderQtyEl.textContent = currentOrder.qty;
      updateOrderTotal();
    }
  });
}

if (confirmOrderBtn) {
  confirmOrderBtn.addEventListener('click', () => {
    const total = currentOrder.price > 0
      ? formatPrice(currentOrder.price * currentOrder.qty)
      : currentOrder.priceLabel;
    closeOrderModal();
    showOrderToast(`${currentOrder.qty}× ${currentOrder.name} ordered! Total: ${total}`);
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section, .header, .delivery-section, .thankyou-section, .follow-section, .container-hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      current = section.getAttribute('id') || '';
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});
