// Check if browser supports native smooth scrolling
if (!('scrollBehavior' in document.documentElement.style)) {
  // Add class to disable CSS smooth scroll
  document.documentElement.classList.add('js-smooth-scroll');
  
  // Handle smooth scrolling with JS
  const smoothScroll = (target, duration = 1000) => {
    const targetPosition = target.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition;
    let startTime = null;

    const animation = currentTime => {
      if (startTime === null) {
        startTime = currentTime;
      }
      const timeElapsed = currentTime - startTime;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    // Easing function
    const ease = (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) {
        return c / 2 * t * t + b;
      }
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
  };

  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) {
      return;
    }
    
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) {
      return;
    }
    
    smoothScroll(target);
  });
}
