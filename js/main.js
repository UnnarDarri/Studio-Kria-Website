
const menuToggle = document.getElementById('menuToggle');
const navOverlay = document.getElementById('navOverlay');
const navClose = document.getElementById('navClose');

if (menuToggle && navOverlay && navClose) {
  const navLinks = navOverlay.querySelectorAll('a');

  function openNav() {
    navOverlay.classList.add('is-open');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-locked');
  }

  function closeNav() {
    navOverlay.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-locked');
  }

  menuToggle.addEventListener('click', () => {
    navOverlay.classList.contains('is-open')
      ? closeNav()
      : openNav();
  });

  navClose.addEventListener('click', closeNav);
  navLinks.forEach(link => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeNav();
  });
}

// Homepage preview SVG buttons
document.addEventListener('DOMContentLoaded', () => {
  const svg = document.querySelector('.kria-home-preview svg');
  if (!svg) return;

  const basePath = '/Studio-Kria-Website/is';

 const links = {
  'our-work': `${basePath}/verkefni/`,
  'how-can-we-help': `${basePath}/starfsemi/`,
  'about': `${basePath}/um-okkur/`,
  'contact': `${basePath}/hafa-samband/`
};

  Object.entries(links).forEach(([id, path]) => {
    const element = svg.querySelector(`#${id}`);
    if (!element) return;

    element.style.cursor = 'pointer';

    element.addEventListener('click', () => {
      window.location.href = path;
    });
  // Fade SVG text from gray to white as it enters the viewport
const textElements = [
  '#contact',
  '#how-can-we-help',
  '#about',
  '#our-work'
]
  .map(selector => svg.querySelector(selector))
  .filter(Boolean);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    entry.target.classList.toggle('is-visible', entry.isIntersecting);
  });
}, {
  threshold: 0.5
});

textElements.forEach(element => observer.observe(element));
  });

  // Bird returns to the Icelandic homepage
  const bird = svg.querySelector('#bird');

  if (bird) {
    bird.style.cursor = 'pointer';
    bird.addEventListener('click', () => {
      window.location.href = `${basePath}/`;
    });
  }

  // SVG menu button opens the existing navigation
  const menu = svg.querySelector('#menu');
  const menuToggle = document.getElementById('menuToggle');

  if (menu && menuToggle) {
    menu.style.cursor = 'pointer';
    menu.addEventListener('click', () => menuToggle.click());
  }
});
