/* ─────────────────────────────────────
   UniLabs Tech — Global JavaScript
   ───────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav: active link highlight ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Nav: scroll shadow ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('mobile-open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
        hamburger.classList.remove('open');
      }
    });
  }

  /* ── Scroll-reveal animation ── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
      io.observe(el);
    });

    document.addEventListener('animationend', () => {}, { once: true });

    // Inject .revealed styles once
    const style = document.createElement('style');
    style.textContent = `.revealed { opacity: 1 !important; transform: none !important; }`;
    document.head.appendChild(style);
  }

  /* ── Contact form ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      try {
        const res = await fetch('https://formspree.io/f/mnjgarla', {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        const json = await res.json();
        if (json.ok) {
          form.style.display = 'none';
          const success = document.getElementById('formSuccess');
          if (success) success.style.display = 'block';
        } else {
          throw new Error('Submission failed');
        }
      } catch {
        btn.disabled = false;
        btn.innerHTML = 'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>';
        alert('Something went wrong. Please try again or email us directly at kenneth@unilabstech.com');
      }
    });
  }

  /* ── Product filter tabs ── */
  const filterBtns = document.querySelectorAll('[data-filter]');
  const filterItems = document.querySelectorAll('[data-category]');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.filter;
        filterItems.forEach(item => {
          if (cat === 'all' || item.dataset.category === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

});
