/* ============================================
   NESTIQ — Main JavaScript
   ============================================ */

/* ---- Navbar scroll behavior ---- */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 20);
});

/* ---- Hamburger / Mobile Nav ---- */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
hamburger?.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* ---- Fade-in on scroll ---- */
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));

/* ---- Search Tabs ---- */
const searchTabs = document.querySelectorAll('.search-tab');
searchTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    searchTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

/* ---- Filter Chips ---- */
document.querySelectorAll('.filter-chip[data-single]').forEach(chip => {
  chip.addEventListener('click', () => {
    const group = chip.closest('.filter-group') || chip.parentElement;
    group.querySelectorAll('.filter-chip[data-single]').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});
document.querySelectorAll('.filter-chip:not([data-single])').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('active'));
});

/* ---- Favorites ---- */
document.querySelectorAll('.prop-fav').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('active');
    const isActive = btn.classList.contains('active');
    btn.textContent = isActive ? '❤️' : '🤍';
    showToast(isActive ? '❤️ Added to wishlist' : 'Removed from wishlist', isActive ? 'success' : 'info');
  });
});

/* ---- Toast Notifications ---- */
function showToast(message, type = 'info', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-text">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'none';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(110%)';
    toast.style.transition = '0.3s';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ---- Modal System ---- */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
});
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- EMI Calculator ---- */
function initEMICalc() {
  const loanRange = document.getElementById('loanAmount');
  const rateRange = document.getElementById('interestRate');
  const tenureRange = document.getElementById('tenure');
  const loanVal = document.getElementById('loanVal');
  const rateVal = document.getElementById('rateVal');
  const tenureVal = document.getElementById('tenureVal');
  const emiResult = document.getElementById('emiResult');

  function calcEMI() {
    const P = parseFloat(loanRange?.value || 5000000);
    const r = parseFloat(rateRange?.value || 8.5) / 12 / 100;
    const n = parseFloat(tenureRange?.value || 20) * 12;
    const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    if (loanVal) loanVal.textContent = '₹' + formatNum(P);
    if (rateVal) rateVal.textContent = rateRange?.value + '%';
    if (tenureVal) tenureVal.textContent = tenureRange?.value + ' yrs';
    if (emiResult) emiResult.textContent = '₹' + formatNum(Math.round(emi)) + '/mo';
  }

  [loanRange, rateRange, tenureRange].forEach(r => r?.addEventListener('input', calcEMI));
  calcEMI();
}

/* ---- Format Numbers ---- */
function formatNum(n) {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + ' Cr';
  if (n >= 100000) return (n / 100000).toFixed(1) + ' L';
  return n.toLocaleString('en-IN');
}

/* ---- Search Suggestions chips ---- */
document.querySelectorAll('.search-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const locationInput = document.querySelector('#searchLocation, .search-location-inp');
    if (locationInput) {
      locationInput.value = chip.textContent.trim();
      showToast('🔍 Searching in ' + chip.textContent.trim(), 'info', 2000);
    }
  });
});

/* ---- Category Cards ---- */
document.querySelectorAll('.category-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.querySelector('.category-name')?.textContent;
    if (name) showToast('Browsing: ' + name, 'info', 2000);
  });
});

/* ---- View Toggle (Grid / List) ---- */
const viewBtns = document.querySelectorAll('.view-toggle-btn');
const propsGrid = document.querySelector('.props-grid');
viewBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const view = btn.dataset.view;
    if (propsGrid) {
      if (view === 'list') {
        propsGrid.style.gridTemplateColumns = '1fr';
      } else {
        propsGrid.style.gridTemplateColumns = '';
      }
    }
  });
});

/* ---- Range Slider Styling ---- */
function updateRangeSlider(input) {
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 100;
  const val = parseFloat(input.value) || 0;
  const pct = ((val - min) / (max - min)) * 100;
  input.style.background = `linear-gradient(to right, var(--gold) 0%, var(--gold) ${pct}%, var(--border) ${pct}%)`;
}
document.querySelectorAll('input[type="range"]').forEach(r => {
  updateRangeSlider(r);
  r.addEventListener('input', () => updateRangeSlider(r));
});

/* ---- Contact Form Submit ---- */
document.querySelectorAll('.contact-submit-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('✉️ Your enquiry has been sent! Agent will contact you soon.', 'success', 4000);
  });
});

/* ---- Page Navigation (SPA-like) ---- */
const pages = document.querySelectorAll('.page');
function showPage(pageId) {
  pages.forEach(p => {
    p.style.display = p.id === pageId ? 'block' : 'none';
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Reinitialize observers for new page
  setTimeout(() => {
    const newFadeEls = document.querySelectorAll('#' + pageId + ' .fade-in');
    newFadeEls.forEach(el => observer.observe(el));
  }, 100);
}

// Nav links handling
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = el.dataset.page;
    showPage(pageId);
    // Close mobile nav
    mobileNav?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- Sidebar Filter Toggle (Mobile) ---- */
const filterToggleBtn = document.querySelector('.filter-sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
filterToggleBtn?.addEventListener('click', () => {
  sidebar?.classList.toggle('sidebar-open');
});

/* ---- Init on DOMContentLoaded ---- */
document.addEventListener('DOMContentLoaded', () => {
  initEMICalc();
  // Show home page by default
  showPage('page-home');
});

/* ---- Smooth number counters ---- */
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = formatNum(target); clearInterval(timer); return; }
    el.textContent = formatNum(Math.floor(start));
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.count);
      if (target) animateCounter(e.target, target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ---- Share Property ---- */
function shareProperty(title, price) {
  if (navigator.share) {
    navigator.share({ title: `${title} - ₹${price}`, text: 'Check out this property on NESTIQ!', url: window.location.href });
  } else {
    navigator.clipboard?.writeText(window.location.href);
    showToast('🔗 Link copied to clipboard!', 'success');
  }
}

/* ---- Print / Download Brochure ---- */
function downloadBrochure() {
  showToast('📄 Preparing brochure... Download will start shortly.', 'info', 3000);
}

/* ---- Expose global functions ---- */
window.openModal = openModal;
window.closeModal = closeModal;
window.showToast = showToast;
window.showPage = showPage;
window.shareProperty = shareProperty;
window.downloadBrochure = downloadBrochure;
