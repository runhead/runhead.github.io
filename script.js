const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}));

// Escape closes the mobile menu and returns keyboard focus to its button.
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    menuButton.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
    menuButton.focus();
  }
});

// Each graphic passes through upright in the reading area and keeps turning with scroll.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const rotatingGraphics = Array.from(document.querySelectorAll(
  '.brand-logo,.about-logo,.round-stamp'
));
let rotationFrame = null;
const updateScrollRotation = () => {
  rotationFrame = null;
  if (reducedMotion.matches) {
    rotatingGraphics.forEach(graphic => graphic.style.removeProperty('--scroll-rotation'));
    return;
  }
  const uprightAt = window.innerHeight * 0.62;
  const turnDistance = window.innerHeight * 0.5;
  // Read every position before writing styles to avoid repeated layout work.
  const angles = rotatingGraphics.map(graphic => {
    const bounds = graphic.getBoundingClientRect();
    const centre = bounds.top + bounds.height / 2;
    const remaining = Math.min(1, (centre - uprightAt) / turnDistance);
    return -90 * remaining;
  });
  rotatingGraphics.forEach((graphic, index) => {
    graphic.style.setProperty('--scroll-rotation', `${angles[index]}deg`);
  });
};
const requestScrollRotation = () => {
  if (!reducedMotion.matches && rotationFrame === null) {
    rotationFrame = window.requestAnimationFrame(updateScrollRotation);
  }
};
window.addEventListener('scroll', requestScrollRotation, { passive: true });
window.addEventListener('resize', requestScrollRotation);
window.addEventListener('pageshow', updateScrollRotation);
window.addEventListener('load', requestScrollRotation);
reducedMotion.addEventListener('change', updateScrollRotation);
document.fonts?.ready.then(requestScrollRotation);
updateScrollRotation();
