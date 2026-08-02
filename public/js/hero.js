
// Hero Section Mouse Parallax Interaction
document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('home');
    const glowOrb = document.getElementById('glow-orb-main');
    const shape1 = document.querySelector('.shape-1');
    const shape2 = document.querySelector('.shape-2');

    if(heroSection && glowOrb) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            // Move the orb slightly based on mouse
            glowOrb.style.transform = `translate(${x * 50 - 25}px, ${y * 50 - 25}px) scale(${1 + (x * 0.1)})`;
            
            if(shape1) shape1.style.transform = `translate(${x * -30}px, ${y * -30}px)`;
            if(shape2) shape2.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
        });
    }
});
