// ======================================
// DOM Elements
// ======================================
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const particlesContainer = document.getElementById('particles');

// ======================================
// Mobile Menu Toggle
// ======================================
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ======================================
// Sticky Header on Scroll
// ======================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header background
    if (scrollY > 80) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Back to top button
    if (scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Active nav link
    updateActiveNavLink();

    lastScroll = scrollY;
});

// ======================================
// Active Navigation Link
// ======================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);

        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ======================================
// Scroll Animations (Intersection Observer)
// ======================================
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('animate-in');
            }, parseInt(delay));
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});

// ======================================
// Skill Progress Bars Animation
// ======================================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.skill-progress');
            bars.forEach(bar => {
                const width = bar.dataset.width;
                setTimeout(() => {
                    bar.style.width = width + '%';
                }, 300);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('.skills-grid');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}

// ======================================
// Counter Animation (Hero Stats)
// ======================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ======================================
// Particle Effect (Hero Background)
// ======================================
function createParticles() {
    if (!particlesContainer) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
        particle.style.animationDelay = (Math.random() * 5) + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.1;

        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ======================================
// Contact Form — Feedback Visual (FormSubmit cuida do envio)
// ======================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const btn = contactForm.querySelector('button[type="submit"]');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btn.disabled = true;
        // O formulário segue com o submit nativo para o FormSubmit
    });
}

// ======================================
// Smooth Scroll for anchor links
// ======================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const position = target.offsetTop - offset;
            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });
        }
    });
});
