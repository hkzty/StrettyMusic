const topbar = document.getElementById('topbar');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('site-nav');
    const navLinks = [...document.querySelectorAll('.nav-list a')];
    const fadeEls = document.querySelectorAll('.fade-in');
    const counters = document.querySelectorAll('[data-counter]');
    const toTop = document.getElementById('toTop');
    const sections = [...document.querySelectorAll('main section[id]')];
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.querySelector('span:last-child').textContent = isOpen ? 'Close Menu' : 'Open Menu';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 820) {
          nav.classList.remove('open');
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.querySelector('span:last-child').textContent = 'Open Menu';
        }
      });
    });

    const onScrollFrame = () => {
      const scrolled = window.scrollY > 16;
      topbar.classList.toggle('scrolled', scrolled);
      toTop.classList.toggle('show', window.scrollY > 720);

      if (!prefersReducedMotion) {
        const scrollY = window.scrollY;
        parallaxLayers.forEach(layer => {
          const speed = Number(layer.dataset.speed || 0.1);
          layer.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
        });
      }

      let currentId = sections[0]?.id || '';
      const offset = window.scrollY + 180;
      for (const section of sections) {
        if (offset >= section.offsetTop) currentId = section.id;
      }
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href') === `#${currentId}`;
        link.classList.toggle('active', isActive);
      });
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScrollFrame();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    onScrollFrame();

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    fadeEls.forEach(el => {
      if (!el.classList.contains('visible')) revealObserver.observe(el);
    });

    const animateCounter = (el) => {
      const target = Number(el.dataset.counter || 0);
      const duration = 1300;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toString();
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target.toString();
        }
      };
      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.55 });

    counters.forEach(counter => counterObserver.observe(counter));

    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const hoverables = document.querySelectorAll('a, button, input, textarea, .gallery-item');

    if (window.matchMedia('(pointer: fine)').matches) {
      let cursorVisible = false;
      window.addEventListener('mousemove', (event) => {
        const { clientX, clientY } = event;
        cursor.style.left = `${clientX}px`;
        cursor.style.top = `${clientY}px`;
        cursorDot.style.left = `${clientX}px`;
        cursorDot.style.top = `${clientY}px`;
        if (!cursorVisible) {
          cursor.classList.add('active');
          cursorDot.classList.add('active');
          cursorVisible = true;
        }
      });

      hoverables.forEach(item => {
        item.addEventListener('mouseenter', () => cursor.classList.add('link-hover'));
        item.addEventListener('mouseleave', () => cursor.classList.remove('link-hover'));
      });
    }

    const galleryButtons = [...document.querySelectorAll('[data-gallery-index]')];
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentGalleryIndex = 0;

    const setLightbox = (index) => {
      const item = galleryButtons[index];
      currentGalleryIndex = index;
      lightboxImage.src = item.dataset.full;
      lightboxImage.alt = item.querySelector('img')?.alt || 'Expanded gallery image';
      lightboxCaption.textContent = item.dataset.caption || 'Gallery image';
    };

    const openLightbox = (index) => {
      setLightbox(index);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    const stepLightbox = (direction) => {
      currentGalleryIndex = (currentGalleryIndex + direction + galleryButtons.length) % galleryButtons.length;
      setLightbox(currentGalleryIndex);
    };

    galleryButtons.forEach((button, index) => {
      button.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => stepLightbox(-1));
    lightboxNext.addEventListener('click', () => stepLightbox(1));
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    window.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('open')) return;
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') stepLightbox(-1);
      if (event.key === 'ArrowRight') stepLightbox(1);
    });

    const contactForm = document.getElementById('contactForm');
    const formError = document.getElementById('formError');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      formError.textContent = '';
      formStatus.textContent = '';

      const formData = new FormData(contactForm);
      const name = formData.get('name').toString().trim();
      const email = formData.get('email').toString().trim();
      const subject = formData.get('subject').toString().trim();
      const message = formData.get('message').toString().trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (name.length < 2) {
        formError.textContent = 'Enter a real name with at least 2 characters.';
        return;
      }
      if (!emailPattern.test(email)) {
        formError.textContent = 'Enter a valid email address.';
        return;
      }
      if (subject.length < 3) {
        formError.textContent = 'Subject needs at least 3 characters.';
        return;
      }
      if (message.length < 12) {
        formError.textContent = 'Message is too short. Add some actual detail.';
        return;
      }

      formStatus.textContent = 'Message validated. Hook this form to Formspree, Netlify Forms, EmailJS, or your backend to make submissions live.';
      contactForm.reset();
    });