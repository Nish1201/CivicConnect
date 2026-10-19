/**
 * CivicConnect — Main JavaScript (Phase 1 Shared Foundation)
 * Strictly Vanilla JavaScript | Zero external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
});

/**
 * Initializes accessible mobile navigation toggle behavior.
 */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('siteNav');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    const nextState = !isExpanded;

    toggleBtn.setAttribute('aria-expanded', String(nextState));
    navMenu.classList.toggle('is-open', nextState);
  });

  // Close the menu if a navigation link is clicked
  const navLinks = navMenu.querySelectorAll('.nav-link, .nav-cta .btn');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('is-open')) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      }
    });
  });

  // Close the menu if clicked outside on mobile
  document.addEventListener('click', (event) => {
    if (
      navMenu.classList.contains('is-open') &&
      !navMenu.contains(event.target) &&
      !toggleBtn.contains(event.target)
    ) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    }
  });

  // Close menu on Escape key press
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      toggleBtn.focus();
    }
  });
}
