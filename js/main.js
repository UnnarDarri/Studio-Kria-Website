const menuToggle = document.getElementById('menuToggle');
const navOverlay = document.getElementById('navOverlay');
const navClose = document.getElementById('navClose');
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
  navOverlay.classList.contains('is-open') ? closeNav() : openNav();
});
navClose.addEventListener('click', closeNav);
navLinks.forEach(a => a.addEventListener('click', closeNav));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeNav();
});
