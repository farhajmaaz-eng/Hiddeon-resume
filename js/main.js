(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;

  /* ---------- Header state + scroll progress ----------  */ const header = $('#siteHeader');
  const progressFill = $('#progressFill');
  const onScroll = () => {
    header.classList.toggle('scrolled', scrollY > 24);
    const max = document.documentElement.scrollHeight - innerHeight;
    progressFill.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ----------  */ const hamburger = $('#hamburger');
  const nav = $('#siteNav');
  const closeMenu = () => {
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  };
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  $$('a', nav).forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  matchMedia('(min-width: 769px)').addEventListener('change', closeMenu);

  /* ---------- Typing effect ----------  */ const typedEl = $('#typed');
  const phrases = ['games players stick with.', 'systems that scale.', 'communities that thrive.', 'websites that convert.'];
  if (typedEl && !reducedMotion) {
    let pi = 0, ci = 0, deleting = false;
    (function loop() {
      const cur = phrases[pi];
      typedEl.textContent = cur.slice(0, ci);
      let delay = deleting ? 32 : 72;
      if (!deleting && ci === cur.length) { delay = 2000; deleting = true; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 420; }
      ci += deleting ? -1 : 1;
      setTimeout(loop, delay);
    })();
  } else if (typedEl) {
    typedEl.textContent = phrases[0];
  }

  /* ---------- Scroll reveal ----------  */ const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters ----------  */ const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      counterObserver.unobserve(e.target);
      const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || '';
      if (reducedMotion) { el.textContent = target + suffix; return; }
      const t0 = performance.now(), dur = 1600;
      (function tick(now) {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.5 });
  $$('.stat-num[data-count]').forEach(el => counterObserver.observe(el));

  /* ---------- Skill bars ----------  */ const skillsBar = $('.skills-bars');
  if (skillsBar) {
    const skillObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      skillObserver.disconnect();
      $$('.skill-fill', skillsBar).forEach((f, i) => {
        const lvl = f.dataset.level;
        f.style.setProperty('--lvl', lvl + '%');
        setTimeout(() => { f.style.width = lvl + '%'; }, reducedMotion ? 0 : i * 110);
      });
    }, { threshold: 0.3 });
    skillObserver.observe(skillsBar);
  }

  /* ---------- Project cards: tilt + cursor spotlight ----------  */ if (finePointer && !reducedMotion) {
    $$('.project-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (x * 100) + '%');
        card.style.setProperty('--my', (y * 100) + '%');
        card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 5}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Copy Discord username ----------  */ const copyBtn = $('#copyDiscord');
  const tag = $('#discordTag').textContent.trim();
  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(tag);
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>';
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-copy"/></svg>';
      }, 1800);
    } catch (err) {
      prompt('Copy my Discord username:', tag);
    }
  };
  copyBtn.addEventListener('click', doCopy);
  $('#socialDiscord').addEventListener('click', doCopy);

  /* ---------- Active nav link ----------  */ const navMap = {};
  $$('a', nav).forEach(a => navMap[a.hash.slice(1)] = a);
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && navMap[e.target.id]) {
        $$('a', nav).forEach(a => a.classList.remove('active'));
        navMap[e.target.id].classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  $$('main section[id]').forEach(s => sectionObserver.observe(s));

  /* ---------- Footer year ----------  */ $('#year').textContent = new Date().getFullYear();
})();
