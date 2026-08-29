/* ============ NAV ============ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}));

/* Active link on scroll */
const sections = document.querySelectorAll('section[id]');
const linkMap = {};
navLinks.querySelectorAll('a').forEach(a => linkMap[a.getAttribute('href').slice(1)] = a);

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && linkMap[e.target.id]) {
      navLinks.querySelectorAll('a').forEach(a => a.classList.remove('active'));
      linkMap[e.target.id].classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));

/* ============ TYPING EFFECT ============ */
const typedEl = document.getElementById('typed');
const phrases = [
  'Roblox games in Luau.',
  'clean, optimized scripts.',
  'premium websites.',
  'communities that scale.'
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const current = phrases[phraseIdx];
  typedEl.textContent = current.slice(0, charIdx);
  let delay = deleting ? 35 : 75;
  if (!deleting && charIdx === current.length) { delay = 1800; deleting = true; }
  else if (deleting && charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; delay = 400; }
  charIdx += deleting ? -1 : 1;
  setTimeout(typeLoop, delay);
}
typeLoop();

/* ============ SCROLL REVEAL ============ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============ ANIMATED COUNTERS ============ */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    counterObserver.unobserve(e.target);
    const el = e.target;
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObserver.observe(el));

/* ============ COPY DISCORD ============ */
const copyBtn = document.getElementById('copyDiscord');
const discordTag = document.getElementById('discordTag');
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(discordTag.textContent.trim());
    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    copyBtn.classList.add('copied');
    setTimeout(() => {
      copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
      copyBtn.classList.remove('copied');
    }, 1800);
  } catch (err) {
    window.prompt('Copy my Discord username:', discordTag.textContent.trim());
  }
});

/* Clicking the Discord social button also copies */
document.getElementById('socialDiscord').addEventListener('click', e => {
  e.preventDefault();
  copyBtn.click();
});

/* ============ YEAR ============ */
document.getElementById('year').textContent = new Date().getFullYear();
