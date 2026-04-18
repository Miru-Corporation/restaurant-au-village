/* =========================================
   AU VILLAGE — main.js
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navigation Scroll Effect --- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Mobile Menu --- */
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const mobileClose = document.querySelector('.nav__mobile-close');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeMobile = () => {
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
  };

  mobileClose?.addEventListener('click', closeMobile);
  mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobile));

  /* --- Active nav link --- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* --- Hero BG Ken Burns --- */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  }

  /* --- Scroll Reveal --- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* --- Menu Tabs (homepage preview & carte) --- */
  const initTabs = (tabsSelector, panelsSelector) => {
    const tabs = document.querySelectorAll(tabsSelector);
    const panels = document.querySelectorAll(panelsSelector);

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('active');
      });
    });
  };

  initTabs('.menu-tab', '.menu-panel');

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  /* --- Gallery Filter --- */
  const filterBtns = document.querySelectorAll('.gallery-filter .menu-tab');
  const galleryItems = document.querySelectorAll('.gallery-masonry__item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;

      galleryItems.forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.display = '';
          item.style.opacity = '1';
        } else {
          item.style.opacity = '0';
          setTimeout(() => {
            if (item.style.opacity === '0') item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  /* --- Lightbox --- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox__img');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxPrev = document.querySelector('.lightbox__prev');
  const lightboxNext = document.querySelector('.lightbox__next');

  if (lightbox && lightboxImg) {
    const galleryImages = [...document.querySelectorAll('.gallery-masonry__item img, .gallery-strip__item img')];
    let currentIndex = 0;

    const openLightbox = (src, idx) => {
      lightboxImg.src = src;
      currentIndex = idx;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    const navigate = (dir) => {
      currentIndex = (currentIndex + dir + galleryImages.length) % galleryImages.length;
      lightboxImg.src = galleryImages[currentIndex].src;
    };

    document.querySelectorAll('.gallery-masonry__item, .gallery-strip__item').forEach((item, idx) => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) openLightbox(img.src, idx);
      });
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', () => navigate(-1));
    lightboxNext?.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --- Counter Animation (stats) --- */
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const steps = 60;
        const step = target / steps;
        let current = 0;
        const isFloat = target % 1 !== 0;

        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = isFloat ? current.toFixed(1) + suffix : Math.floor(current) + suffix;
          if (current >= target) clearInterval(timer);
        }, duration / steps);

        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* --- Toast notification (after form submit) --- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✓ Votre message a bien été envoyé. Nous vous répondrons rapidement.');
      form.reset();
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: #2d7a00;
      color: #fff;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      animation: fadeInUp 0.4s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

});
