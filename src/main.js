// --- SMOOTH SCROLL (Lenis) ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// --- MOBILE MENU ---
const burger = document.querySelector('.header__burger');
const nav = document.querySelector('.header__nav');
const links = document.querySelectorAll('.header__link');

burger.addEventListener('click', () => {
    nav.classList.toggle('is-open');
    burger.classList.toggle('is-active');
});

// Close menu when link is clicked
links.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        burger.classList.remove('is-active');
    });
});

// --- GSAP REGISTER ---
gsap.registerPlugin(ScrollTrigger);

console.log('Cypher-Cloud core initialized.');