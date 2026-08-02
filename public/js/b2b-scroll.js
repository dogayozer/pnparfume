
// B2B Scroll Story Animation Logic
document.addEventListener('scroll', () => {
    const buildBrandSection = document.getElementById('build-brand');
    if (!buildBrandSection) return;

    const stickyContainer = buildBrandSection.querySelector('.build-brand-sticky');
    if (!stickyContainer) return;

    const sectionTop = buildBrandSection.offsetTop;
    const sectionHeight = buildBrandSection.offsetHeight;
    const windowScrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Calculate how far we've scrolled inside the section
    let scrolled = windowScrollY - sectionTop;
    let maxScroll = sectionHeight - windowHeight;

    let progress = scrolled / maxScroll;

    // Clamp progress between 0 and 1
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    // Apply to CSS variable
    stickyContainer.style.setProperty('--scroll-p', progress);
});
