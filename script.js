/* ============================================
   FUNDACIÓN HUELLITAS - JAVASCRIPT
   ============================================ */

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    scrollTopBtn.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    scrollTopBtn.classList.remove('visible');
  }
});

// ===== MOBILE MENU =====
function toggleMenu() {
  const navLinks = document.getElementById('nav-links');
  navLinks.classList.toggle('open');
}

function closeMobileMenu() {
  const navLinks = document.getElementById('nav-links');
  navLinks.classList.remove('open');
}

// ===== HERO COUNTERS ANIMATION =====
function animateCounter(id, target, duration = 1800) {
  const el = document.getElementById(id);
  let start = 0;
  const step = target / (duration / 16);

  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target.toLocaleString('es-CO') + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start).toLocaleString('es-CO');
    }
  }, 16);
}

// Trigger counters when hero is in view
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter('counter-rescue', 1200);
      animateCounter('counter-adopted', 980);
      animateCounter('counter-years', 16);
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const heroSection = document.getElementById('inicio');
if (heroSection) heroObserver.observe(heroSection);

// ===== PET FILTER =====
function filterPets(type, tabBtn) {
  // Update active tab
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tabBtn.classList.add('active');

  // Filter cards
  const cards = document.querySelectorAll('.pet-card');
  cards.forEach(card => {
    if (type === 'todos' || card.dataset.type === type) {
      card.classList.remove('hidden');
      card.style.animation = 'none';
      requestAnimationFrame(() => {
        card.style.animation = 'fadeInUp 0.4s ease forwards';
      });
    } else {
      card.classList.add('hidden');
    }
  });
}

// Add fade in animation for cards
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ===== ADOPTION MODAL =====
function openModal(name, type, age, size, description) {
  const overlay = document.getElementById('adopt-modal');
  document.getElementById('modal-pet-name').textContent = name;
  document.getElementById('modal-emoji').textContent = type === 'Gato' ? '🐱' : '🐶';
  document.getElementById('modal-description').textContent = description;

  const tagsEl = document.getElementById('modal-tags');
  tagsEl.innerHTML = `
    <span class="tag">${type === 'Gato' ? '🐈' : '🐕'} ${type}</span>
    <span class="tag">⏱ ${age}</span>
    <span class="tag">📏 ${size}</span>
  `;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('adopt-modal').classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('adopt-modal')) closeModal();
}

// ===== SHOPPING CART =====
let cart = [];

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1, id: Date.now() });
  }
  updateCartUI();
  showToast(`✅ "${name}" agregado al carrito`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-count').textContent = total;
}

function openCartModal() {
  renderCartItems();
  document.getElementById('cart-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartModal() {
  document.getElementById('cart-modal').classList.remove('active');
  document.body.style.overflow = '';
}

function closeCartOutside(e) {
  if (e.target === document.getElementById('cart-modal')) closeCartModal();
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-price');

  if (cart.length === 0) {
    container.innerHTML = '<div class="empty-cart">🛒 Tu carrito está vacío</div>';
    totalEl.textContent = '$0';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    total += item.price * item.qty;
    return `
      <div class="cart-item">
        <span class="cart-item-name">${item.name} ${item.qty > 1 ? `x${item.qty}` : ''}</span>
        <span class="cart-item-price">$${(item.price * item.qty).toLocaleString('es-CO')}</span>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;
  }).join('');

  totalEl.textContent = '$' + total.toLocaleString('es-CO');
}

function checkout() {
  if (cart.length === 0) {
    showToast('⚠️ Agrega productos al carrito primero');
    return;
  }
  closeCartModal();
  cart = [];
  updateCartUI();
  showToast('🎉 ¡Gracias por tu compra! Te contactaremos pronto.');
}

// ===== TOAST NOTIFICATION =====
let toastTimeout;

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== CONTACT FORM =====
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = '⏳ Enviando...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = '✅ ¡Mensaje enviado!';
    btn.style.background = 'linear-gradient(135deg, #6bcb77, #38b249)';
    e.target.reset();
    showToast('✅ ¡Mensaje enviado exitosamente! Te responderemos pronto.');

    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1500);
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Apply scroll animation to cards
document.querySelectorAll('.pet-card, .product-card, .news-card, .contact-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  animObserver.observe(el);
});

// ===== ESCAPE KEY TO CLOSE MODALS =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
    closeCartModal();
    closeMobileMenu();
  }
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--primary)';
    }
  });
});

console.log('🐾 Fundación Huellitas - Sitio web cargado con éxito');
