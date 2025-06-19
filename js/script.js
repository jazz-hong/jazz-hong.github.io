document.addEventListener('DOMContentLoaded', () => {
    // Typing effect for the hero subtitle
    const typedTextElement = document.querySelector('.typed-text');
    if (typedTextElement) {
        const words = [
            'Ethical Hacker',
            'AI Software Engineer',
            'Multimedia Producer',
            'Penetration Tester'
        ];
        new TypingEffect(typedTextElement, words);
    }

    // Typing effect for the logo
    const hackTextElement = document.querySelector('.hack-text');
    if (hackTextElement) {
        new TypingEffect(hackTextElement, ['Welcome My Friend, Read The Notice', 'Enter The Terminal', 'Hack The Planet', 'The Future Is Here', 'Escape The Matrix'], 3000);
    }

    // Initialize Matrix Rain
    const matrixCanvas = document.getElementById('matrix-canvas');
    if (matrixCanvas) {
        new MatrixRain(matrixCanvas);
    }

    // Animate Stats on scroll
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    // Unobserve all stats once the first one is visible to prevent re-triggering
                    stats.forEach(s => observer.unobserve(s));
                }
            });
        }, { threshold: 0.8 });
        // Observe each stat number
        stats.forEach(stat => {
            observer.observe(stat);
        });
    }

    // Initialize Terminal Simulation
    const terminalBody = document.querySelector('.terminal-body');
    if (terminalBody) {
        new TerminalSimulation(terminalBody);
    }

    // Initialize skill bars
    initSkillBars();

    // Initialize Intersection Observer for animations
    initIntersectionObserver();
    
    // Initialize form
    initContactForm();

    // Initialize glitch effects for project cards
    initProjectCards();

    // Initialize code window typing effect
    const codeContent = document.querySelector('.code-content code');
    if (codeContent) {
       const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    new CodeTypingEffect(codeContent);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(codeContent);
    }

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Initialize crazy effects
    createGlitchParticles();
    addRGBSplitEffect();
    addGlitchOnHover();

    // Initialize particles.js if the library is loaded
    if (typeof particlesJS !== 'undefined') {
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            particlesJS('particles-js', {
                "particles": {
                    "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                    "color": { "value": "#00ff00" },
                    "shape": { "type": "circle" },
                    "opacity": { "value": 0.5, "random": true },
                    "size": { "value": 3, "random": true },
                    "line_linked": { "enable": false },
                    "move": { "enable": true, "speed": 1, "direction": "none", "random": true, "straight": false, "out_mode": "out", "bounce": false }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": { "onhover": { "enable": true, "mode": "repulse" }, "onclick": { "enable": true, "mode": "push" }, "resize": true }
                },
                "retina_detect": true
            });
        }
    }

    // Hamburger menu toggle for mobile
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('open');
        });
    }
});

class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.fontSize = 14;
        this.columns = 0;
        this.drops = [];
        this.animationFrameId = null;

        this.initialize();
        window.addEventListener('resize', () => this.initialize());
    }

    initialize() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = [];
        for (let i = 0; i < this.columns; i++) {
            this.drops[i] = Math.random() * -this.canvas.height;
        }
        this.draw();
    }

    draw() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }
}

class TypingEffect {
    constructor(element, words, waitTime = 3000) {
        this.element = element;
        this.words = words;
        this.waitTime = waitTime;
        this.txt = '';
        this.wordIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        this.txt = this.isDeleting ? fullTxt.substring(0, this.txt.length - 1) : fullTxt.substring(0, this.txt.length + 1);
        this.element.innerHTML = this.txt;

        let typeSpeed = this.isDeleting ? 75 : 150;

        if (!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.waitTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }
        setTimeout(() => this.type(), typeSpeed);
    }
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        if (stat.dataset.noAnimate) {
            stat.textContent = stat.dataset.target;
            return;
        }

        const targetString = stat.getAttribute('data-target');
        const target = parseInt(targetString);

        if (isNaN(target)) {
            stat.textContent = targetString;
            return;
        }

        stat.textContent = '0';
        let current = 0;
        const increment = target / 50; // Animate over 50 steps

        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.ceil(current);
                setTimeout(updateCount, 20);
            } else {
                stat.textContent = targetString;
            }
        };
        updateCount();
    });
}

class TerminalSimulation {
    constructor(terminalBody) {
        this.terminal = terminalBody;
        this.lines = [
            { text: '> sudo initialize', isCommand: true },
            { text: 'Accessing mainframe...', isCommand: false },
            { text: 'Bypassing security protocols...', isCommand: false },
            { text: 'Establishing secure connection...', isCommand: false },
            { text: 'Access granted.', isCommand: false, isSuccess: true },
        ];
        this.simulate();
    }

    async simulate() {
        this.terminal.innerHTML = '';
        for (const line of this.lines) {
            await this.typeLine(line);
            await this.wait(line.isCommand ? 500 : 300);
        }
        const cursorLine = document.createElement('div');
        cursorLine.classList.add('line');
        cursorLine.innerHTML = '><span class="cursor">_</span>';
        this.terminal.appendChild(cursorLine);
    }

    async typeLine(line) {
        const lineElement = document.createElement('div');
        lineElement.classList.add('line');
        if (line.isSuccess) lineElement.classList.add('success');
        this.terminal.appendChild(lineElement);

        const textToType = line.isCommand ? line.text.substring(2) : line.text;
        if (line.isCommand) lineElement.innerHTML = `>&nbsp;`;

        for (const char of textToType) {
            lineElement.innerHTML += char;
            await this.wait(30);
        }
    }
    wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
}

function initSkillBars() {
    const skillBars = document.querySelectorAll('.progress-line span');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.getAttribute('data-percent') + '%';
                obs.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });
    skillBars.forEach(bar => observer.observe(bar));
}

function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                obs.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });
    document.querySelectorAll('.skill-item, .project-card, .tech-item').forEach(item => {
        item.classList.add('fade-in-up');
        observer.observe(item);
    });
}

class CodeTypingEffect {
    constructor(element) {
        this.element = element;
        this.text = this.element.innerText;
        this.element.innerHTML = '';
        this.currentChar = 0;
        this.type();
    }
    type() {
        if (this.currentChar < this.text.length) {
            this.element.innerHTML += this.text.charAt(this.currentChar);
            this.currentChar++;
            setTimeout(() => this.type(), 10);
        }
    }
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', async(e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;

        submitBtn.disabled = true;
        btnText.textContent = 'Encrypting...';
        await new Promise(resolve => setTimeout(resolve, 1500));
        btnText.textContent = 'Transmitting...';
        await new Promise(resolve => setTimeout(resolve, 1500));
        btnText.textContent = 'Message Sent!';
        await new Promise(resolve => setTimeout(resolve, 2000));
        form.reset();
        document.querySelectorAll('.form-group.is-filled').forEach(el => el.classList.remove('is-filled'));
        submitBtn.disabled = false;
        btnText.textContent = originalText;
    });

    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('blur', (e) => {
            e.target.parentElement.classList.toggle('is-filled', e.target.value !== '');
        });
    });
}

function initProjectCards() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseover', () => card.classList.add('glitch-active'));
        card.addEventListener('mouseout', () => card.classList.remove('glitch-active'));
    });
}

function createGlitchParticles() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        for (let i = 0; i < 5; i++) {
            createParticle(section);
        }
    });
}

function createParticle(section) {
    const particle = document.createElement('div');
    particle.className = 'glitch-particle';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.setProperty('--x', `${(Math.random() - 0.5) * 200}px`);
    particle.style.setProperty('--y', `${(Math.random() - 0.5) * 200}px`);
    section.appendChild(particle);
    setTimeout(() => particle.remove(), 1000 + Math.random() * 1000);
}

function addRGBSplitEffect() {
    let lastScrollY = window.scrollY;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollDelta = Math.abs(window.scrollY - lastScrollY);
                const intensity = Math.min(scrollDelta / 50, 5);
                document.documentElement.style.setProperty('--rgb-split', `${intensity}px`);
                lastScrollY = window.scrollY;
                ticking = false;
            });
            ticking = true;
        }
    });
}

function addGlitchOnHover() {
    document.querySelectorAll('.cta-button, .social-link, .nav-links a').forEach(element => {
        element.addEventListener('mouseover', () => element.classList.add('glitch-active'));
        element.addEventListener('mouseout', () => element.classList.remove('glitch-active'));
    });
}

const style = document.createElement('style');
style.textContent = `
    .fade-in-up { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
    .animate { opacity: 1; transform: translate(0, 0); }
    .glitch-active { animation: crazyGlitch 0.3s infinite; }
    :root { --rgb-split: 0px; }
    body { transition: text-shadow 0.2s ease-out; text-shadow: var(--rgb-split) 0 0 red, calc(var(--rgb-split) * -1) 0 0 blue; }
`;
document.head.appendChild(style);
