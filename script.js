/* ═══════════════════════════════════════════════════
   PLANELLS STUDIO — SCRIPT.JS
   Centro Médico Polivalente de Ibiza
═══════════════════════════════════════════════════ */

'use strict';

/* ── Navbar scroll behaviour ────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Hamburger / mobile menu ────────────────────── */
(function initMobileMenu() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

  if (!hamburger || !mobileMenu) return;

  const open  = () => {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });

  mobileLinks.forEach(link => link.addEventListener('click', close));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();

/* ── Scroll-reveal ──────────────────────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = parseFloat(el.style.getPropertyValue('--delay') || '0') * 1000;

      setTimeout(() => {
        el.classList.add('revealed');

        /* Animate section-line inside revealed element */
        el.querySelectorAll('.section-line').forEach(line => {
          line.classList.add('animated');
        });
      }, delay);

      observer.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  els.forEach(el => observer.observe(el));

  /* Also animate section-lines that are direct children of revealed parents */
  const lines = document.querySelectorAll('.section-line');
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        lineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  lines.forEach(line => lineObserver.observe(line));
})();

/* ── Hero parallax ──────────────────────────────── */
(function initParallax() {
  const heroImg = document.getElementById('heroParallax');
  if (!heroImg) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    const shift   = scrollY * 0.18;
    heroImg.style.transform = `translateY(${shift}px)`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  /* Disable parallax on reduced motion */
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) {
    window.removeEventListener('scroll', update);
    heroImg.style.transform = '';
  }
})();

/* ── Testimonials carousel ──────────────────────── */
(function initCarousel() {
  const carousel   = document.getElementById('carousel');
  const dotsWrap   = document.getElementById('carouselDots');
  const prevBtn    = document.getElementById('prevBtn');
  const nextBtn    = document.getElementById('nextBtn');

  if (!carousel || !dotsWrap || !prevBtn || !nextBtn) return;

  const slides   = Array.from(carousel.querySelectorAll('.carousel-slide'));
  let   current  = 0;
  let   timer    = null;

  /* Build dots */
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Ir al testimonio ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const dots = () => Array.from(dotsWrap.querySelectorAll('.dot'));

  const goTo = (index) => {
    const prev = current;
    current = (index + slides.length) % slides.length;

    slides[prev].classList.remove('active');
    slides[prev].classList.add('exit');

    setTimeout(() => {
      slides[prev].classList.remove('exit');
    }, 600);

    slides[current].classList.add('active');

    dots().forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  nextBtn.addEventListener('click', () => { next(); resetTimer(); });
  prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

  /* Touch/swipe support */
  let touchStartX = 0;

  carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
      resetTimer();
    }
  }, { passive: true });

  /* Auto-advance */
  const startTimer = () => {
    timer = setInterval(next, 5500);
  };

  const resetTimer = () => {
    clearInterval(timer);
    startTimer();
  };

  startTimer();

  /* Pause on hover */
  const wrap = document.querySelector('.carousel-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', () => clearInterval(timer));
    wrap.addEventListener('mouseleave', () => startTimer());
  }
})();

/* ── Smooth anchor scrolling ────────────────────── */
(function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      const offset = 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── Micro-animation on service links ───────────── */
(function initServiceLinks() {
  document.querySelectorAll('.service-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.querySelector('.arrow').style.transform = 'translateX(4px)';
    });
    link.addEventListener('mouseleave', () => {
      link.querySelector('.arrow').style.transform = '';
    });
  });
})();

/* ── Stat counter animation ─────────────────────── */
(function initCounters() {
  const stats = document.querySelectorAll('.about-stat-num');
  if (!stats.length) return;

  const targets = { '4.9': 4.9, '137': 137 };

  const animateCount = (el, target, isDecimal) => {
    const duration = 1400;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      const value    = isDecimal
        ? (target * ease).toFixed(1)
        : Math.round(target * ease);

      el.textContent = value;

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el   = entry.target;
      const text = el.textContent.trim();

      if (text === '4.9') animateCount(el, 4.9, true);
      if (text === '137') animateCount(el, 137, false);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
})();
