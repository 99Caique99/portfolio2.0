// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// 1. Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    mouseMultiplier: 1.2
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Scroll Progress Indicator
const progressEl = document.querySelector('.scroll-progress');
lenis.on('scroll', (e) => {
    let scrollPercent = 0;
    if(e.dimensions.scrollHeight > e.dimensions.height) {
        scrollPercent = (e.animatedScroll / (e.dimensions.scrollHeight - e.dimensions.height)) * 100;
    }
    if(progressEl) progressEl.style.width = `${scrollPercent}%`;
});

// 2. Custom Cursor & Global Light Mode
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const mouseGlow = document.querySelector('.mouse-glow');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let outlineX = mouseX;
let outlineY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if(cursorDot) {
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
    if(mouseGlow) {
        mouseGlow.style.left = `${mouseX}px`;
        mouseGlow.style.top = `${mouseY}px`;
    }
});

function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    if(cursorOutline) {
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateCursor);
}
if(window.innerWidth > 768) {
    animateCursor();
}

// Magnetic Hover Buttons
const magneticEls = document.querySelectorAll('.hover-magnetic');
magneticEls.forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) - rect.width / 2;
        const y = (e.clientY - rect.top) - rect.height / 2;
        gsap.to(el, { duration: 0.3, x: x * 0.2, y: y * 0.2, ease: "power2.out" });
        if(cursorOutline) { 
            cursorOutline.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1.5) translate(-50%, -50%)`; 
            cursorOutline.style.backgroundColor = "transparent";
            cursorOutline.style.borderColor = "var(--color-3)";
        }
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { duration: 0.5, x: 0, y: 0, ease: "elastic.out(1, 0.3)" });
        if(cursorOutline) { 
            cursorOutline.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1) translate(-50%, -50%)`; 
            cursorOutline.style.borderColor = "rgba(254, 255, 239, 0.5)";
        }
    });
});

// 3. Hero Section - Antigravity Canvas Particles
const canvas = document.getElementById('particles-bg');
const ctx = canvas?.getContext('2d');
let width, height, particles;

function initParticles() {
    if(!canvas) return;
    const heroBg = document.querySelector('.hero-bg');
    width = canvas.width = heroBg ? heroBg.offsetWidth : window.innerWidth;
    height = canvas.height = heroBg ? heroBg.offsetHeight : window.innerHeight;
    particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2,
            speedY: Math.random() * -0.6 - 0.2, // Always rising
            opacity: Math.random() * 0.5
        });
    }
}
function drawParticles() {
    if(!ctx) return;
    ctx.clearRect(0, 0, width, height);
    // Draw connections (Network Effect)
    for(let i = 0; i < particles.length; i++) {
        for(let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if(dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(184, 217, 245, ${0.15 * (1 - dist/120)})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    // Draw particles
    particles.forEach(p => {
        p.y += p.speedY;
        if (p.y < 0) { p.y = height; p.x = Math.random() * width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 217, 245, ${p.opacity})`; 
        ctx.fill();
    });
    requestAnimationFrame(drawParticles);
}
if (canvas) {
    initParticles();
    drawParticles();
    window.addEventListener('resize', initParticles);
}

// 4. (Data Stream Removed - Using CSS Grid Now)

// Card Hover Glow Tracker
document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 5. GSAP Entrance Animations
window.addEventListener('DOMContentLoaded', () => {
    // Hero 
    const heroTl = gsap.timeline();
    heroTl.from(".reveal-text", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.2
    })
    .from(".hero-img", {
        scale: 0.9,
        y: 30,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
    }, "-=1");

    // Scroll Reveals
    gsap.utils.toArray(".reveal-up").forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: { trigger: elem, start: "top 85%" },
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: "power3.out"
        });
    });

    // Cyber Cube Reveal
    gsap.from(".cyber-cube-wrapper", {
        scrollTrigger: { trigger: ".about", start: "top 70%" },
        scale: 0.5,
        opacity: 0,
        duration: 2,
        ease: "elastic.out(1, 0.5)"
    });

    // Cards Stagger
    gsap.from(".bento-grid > *", {
        scrollTrigger: { trigger: ".portfolio", start: "top 75%" },
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Parallax Imgs & Elements
    gsap.utils.toArray('.parallax-img, .parallax-element').forEach(layer => {
        const depth = layer.getAttribute('data-speed') || 0.1;
        gsap.to(layer, {
            yPercent: depth * 100,
            ease: "none",
            scrollTrigger: {
                trigger: layer,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });
});
