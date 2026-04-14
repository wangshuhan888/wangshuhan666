/* ============================================================
   Discover Zibo — main.js  (Light Frosted Glass · Optimized GPU)
   ============================================================ */

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.menu-toggle');
  const links  = document.querySelector('.nav-links');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }
}

/* ---------- Scroll fade-in animations ---------- */
function initScrollAnimations() {
  const classes = ['.fade-in', '.slide-in-left', '.slide-in-right', '.scale-in'];
  const els = document.querySelectorAll(classes.join(','));
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ---------- Homepage scroll parallax ---------- */
function initIndexScroll() {
  if (document.body.dataset.page !== 'index') return;
  // Skip heavy parallax on mobile to avoid jank
  if (window.innerWidth <= 768) return;

  const heroOverlay  = document.querySelector('.hero-overlay');
  const heroContent  = document.querySelector('.hero-content');
  const sections     = Array.from(document.querySelectorAll('section:not(.hero)'));
  const featureImgs  = Array.from(document.querySelectorAll('.feature-img img'));
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const statItems    = Array.from(document.querySelectorAll('.stat-item'));

  let ticking = false;

  function update() {
    const y  = window.scrollY;
    const vh = window.innerHeight;

    /* Hero content parallax */
    if (heroOverlay) heroOverlay.style.transform = `translateY(${y * 0.42}px) scale(1.12)`;
    if (heroContent) {
      heroContent.style.transform = `translateY(${y * 0.18}px)`;
      heroContent.style.opacity = String(Math.max(0, 1 - y / (vh * 0.7)));
    }

    /* Per-section entrance scale + opacity */
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const p = rect.top > 0 ? Math.max(0, 1 - rect.top / vh) : 1;
      const scale = 0.92 + p * 0.08;
      sec.style.transform = `scale(${scale})`;
      sec.style.transformOrigin = 'top center';
    });

    /* Feature-row image strong parallax */
    featureImgs.forEach((img, i) => {
      const wrapper = img.closest('.feature-img');
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - vh / 2;
      const dir = i % 2 === 0 ? 1 : -1;
      img.style.transform = `translateY(${center * 0.08 * dir}px) scale(1.12)`;
    });

    /* Gallery item parallax */
    galleryItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - vh / 2;
      item.style.transform = `translateY(${center * 0.04}px)`;
    });

    /* Stat counter float-in */
    statItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const p2 = Math.max(0, Math.min(1, 1 - rect.top / vh));
      item.style.transform = `translateY(${(1 - p2) * 24}px)`;
      item.style.opacity = String(0.15 + p2 * 0.85);
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------- Scroll progress bar ---------- */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 10000;
    height: 3px; width: 0%;
    background: linear-gradient(90deg, #2563eb, #7c3aed, #dc2626);
    transition: width .1s linear;
    pointer-events: none;
    border-radius: 0 2px 2px 0;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(100, pct) + '%';
  }, { passive: true });
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- Number count-up animation ---------- */
function initCountUp() {
  const items = document.querySelectorAll('.stat-item h3[data-count]');
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 2000;
      const step = 16;
      let cur = 0;
      const inc = end / (dur / step);
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, end);
        el.textContent = (Number.isInteger(end) ? Math.round(cur) : cur.toFixed(1)) + suffix;
        if (cur >= end) clearInterval(timer);
      }, step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  items.forEach(el => obs.observe(el));
}

/* ---------- Homepage hero parallax ---------- */
function initParallax() {
  const overlay = document.querySelector('.hero-overlay');
  if (!overlay) return;
  if (document.body.dataset.page !== 'index') {
    window.addEventListener('scroll', () => {
      overlay.style.transform = `translateY(${window.scrollY * 0.35}px) scale(1.1)`;
    }, { passive: true });
  }
}

/* ---------- Inner-page banner parallax ---------- */
function initBannerParallax() {
  if (window.innerWidth <= 768) return;
  const banner = document.querySelector('.page-banner img');
  if (!banner) return;
  window.addEventListener('scroll', () => {
    banner.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }, { passive: true });
}

/* ---------- Horizontal scroll (food.html) ---------- */
function initHorizontalScroll() {
  const section  = document.querySelector('.h-scroll-section');
  const track    = document.querySelector('.h-scroll-track');
  const progressBar = document.querySelector('.h-scroll-progress-bar');
  const hint     = document.getElementById('hScrollHint');
  if (!section || !track) return;

  // Mobile: CSS switches to native horizontal scroll; skip JS control
  if (window.innerWidth <= 768) {
    track.querySelectorAll('.h-food-card').forEach(c => c.classList.add('h-card-visible'));
    return;
  }

  const cards = Array.from(track.querySelectorAll('.h-food-card'));
  let hintHidden = false;

  // Show the first two cards immediately
  cards.slice(0, 2).forEach(c => c.classList.add('h-card-visible'));

  function update() {
    const rect = section.getBoundingClientRect();
    const sectionH = section.offsetHeight - window.innerHeight;
    const scrolled  = Math.max(0, -rect.top);
    const progress  = Math.min(1, scrolled / sectionH);

    const maxShift = track.scrollWidth - track.parentElement.offsetWidth;
    track.style.transform = `translateX(${-maxShift * progress}px)`;
    if (progressBar) progressBar.style.width = (progress * 100) + '%';

    // Hide the scroll hint
    if (hint && !hintHidden && scrolled > 20) {
      hint.classList.add('hidden');
      hintHidden = true;
    }

    // Progressively reveal cards based on scroll progress
    const revealThreshold = [0, 0, 0.15, 0.32, 0.52, 0.72];
    cards.forEach((c, i) => {
      if (progress >= (revealThreshold[i] || 0)) {
        if (!c.classList.contains('h-card-visible')) {
          setTimeout(() => c.classList.add('h-card-visible'), i * 60);
        }
      }
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- Sticky story scroll (culture.html) ---------- */
function initStickyStory() {
  const story   = document.querySelector('.sticky-story');
  const wrapper = document.querySelector('.sticky-panel-wrapper');
  const panels  = Array.from(document.querySelectorAll('.sticky-panel'));
  const dots    = Array.from(document.querySelectorAll('.sticky-dot'));
  if (!story || !panels.length) return;

  // Mobile: CSS expands all panels; skip JS sticky control
  if (window.innerWidth <= 768) {
    panels.forEach(p => p.classList.add('active'));
    story.style.height = '';
    return;
  }

  const PANEL_SCROLL = 100; // vh per panel
  story.style.height = panels.length * PANEL_SCROLL + 'vh';

  let currentIdx = -1;

  function activatePanel(idx) {
    if (idx === currentIdx) return;
    panels.forEach((p, i) => {
      p.classList.remove('active', 'exiting');
      if (i === idx) p.classList.add('active');
      else if (i === currentIdx) p.classList.add('exiting');
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    currentIdx = idx;
  }

  function update() {
    const rect = story.getBoundingClientRect();
    const scrolled = Math.max(0, -rect.top);
    const totalScroll = story.offsetHeight - window.innerHeight;
    const idx = Math.min(panels.length - 1, Math.floor((scrolled / totalScroll) * panels.length));
    activatePanel(idx);
  }

  window.addEventListener('scroll', update, { passive: true });
  activatePanel(0);
  update();

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const targetScroll = story.offsetTop + (i / panels.length) * story.offsetHeight;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    });
  });
}

/* ---------- Divider animation ---------- */
function initLivingMotion() {
  const style = document.createElement('style');
  style.id = 'living-motion';
  style.textContent = `
    @keyframes dividerPulse {
      0%, 100% { width: 64px; }
      50%      { width: 84px; }
    }
  `;
  if (!document.getElementById('living-motion')) document.head.appendChild(style);

  document.querySelectorAll('.section-title .divider').forEach(d => {
    d.style.animation = 'dividerPulse 3.5s ease-in-out infinite';
  });
}

/* ============================================================
   Initialisation entry point
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initBackToTop();
  initCountUp();
  initScrollProgress();
  initLivingMotion();
  initIndexScroll();
  initParallax();

  const page = document.body.dataset.page;
  if (page === 'food')    { initHorizontalScroll(); initBannerParallax(); }
  if (page === 'culture') { initStickyStory();      initBannerParallax(); }
});