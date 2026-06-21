document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();

    // Typing effect for the hero subtitle (home page only)
    const typedTextElement = document.querySelector('.typed-text');
    if (typedTextElement) {
        const words = [
            'AI Software Engineer',
            'Digital Solution Marketing',
            'AI Solutions Architect',
            'Prompt Engineer',
            'Tech Entrepreneur'
        ];
        new TypingEffect(typedTextElement, words);
    }

    // Typing effect for the logo
    const hackTextElement = document.querySelector('.hack-text');
    if (hackTextElement) {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        if (isMobile) {
            new TypingEffect(hackTextElement, ['Please use a PC to view'], 3000);
        } else {
            new TypingEffect(hackTextElement, [
                'Welcome My Friend',
                'Enter The Terminal',
                'Hack The Planet',
                'The Future Is Here',
                'Escape The Matrix'
            ], 3000);
        }
    }

    // Initialize Matrix Rain (home page only)
    const matrixCanvas = document.getElementById('matrix-canvas');
    if (matrixCanvas instanceof HTMLCanvasElement) {
        new MatrixRain(matrixCanvas);
    }

    // Animate Stats on scroll (home page only)
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    stats.forEach(s => observer.unobserve(s));
                }
            });
        }, { threshold: 0.8 });
        stats.forEach(stat => observer.observe(stat));
    }

    // Initialize Terminal Simulation (home page only)
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

    // Initialize particles.js (home page only)
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

});

function initMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navIcon = navToggle ? navToggle.querySelector('i') : null;
    if (!navToggle || !navLinks) return;

    const setMenuOpen = (isOpen) => {
        navLinks.classList.toggle('open', isOpen);
        document.body.classList.toggle('nav-open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        if (navIcon) {
            navIcon.classList.toggle('fa-bars', !isOpen);
            navIcon.classList.toggle('fa-xmark', isOpen);
        }
    };

    navToggle.addEventListener('click', function() {
        setMenuOpen(!navLinks.classList.contains('open'));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            setMenuOpen(false);
        });
    });
}

class MatrixRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.fontSize = 22;
        this.columns = 0;
        this.drops = [];
        this.animationFrameId = null;
        this.frame = 0;
        this.speed = 3;

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
        this.animationFrameId = requestAnimationFrame(() => this.draw());
        this.frame++;
        if (this.frame % this.speed !== 0) return;

        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.12)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.32)';
        this.ctx.font = this.fontSize + 'px monospace';

        for (let i = 0; i < this.drops.length; i++) {
            if (i % 3 !== 0) continue;
            const char = this.characters[Math.floor(Math.random() * this.characters.length)];
            this.ctx.fillText(char, i * this.fontSize, this.drops[i] * this.fontSize);
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.985) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
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
        const increment = target / 50;

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

function initContactForm() { /* wired via onsubmit — see handleContactSubmit */ }

async function handleContactSubmit(e) {
    e.preventDefault();

    const EMAILJS_SERVICE_ID  = 'service_v5qbr8h';
    const EMAILJS_TEMPLATE_ID = 'template_nkldeoq';

    const submitBtn = document.querySelector('#contact-form .submit-btn');
    if (submitBtn.disabled) return;
    const btnText   = submitBtn.querySelector('.btn-text');
    const statusEl  = document.getElementById('cf-status');

    const fromName = document.getElementById('cf-name').value.trim();
    const replyTo  = document.getElementById('cf-email').value.trim();
    const message  = document.getElementById('cf-message').value.trim();

    if (!fromName || !replyTo || !message) {
        statusEl.textContent = '[ ERROR ] All fields are required.';
        statusEl.className = 'cf-status cf-error';
        return;
    }

    submitBtn.disabled = true;
    btnText.textContent = 'Transmitting...';
    statusEl.textContent = '';
    statusEl.className = 'cf-status';

    try {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name: fromName,
            reply_to:  replyTo,
            message:   message
        });

        document.getElementById('cf-name').value    = '';
        document.getElementById('cf-email').value   = '';
        document.getElementById('cf-message').value = '';
        btnText.textContent = 'Transmit Message';
        submitBtn.disabled = false;

        document.getElementById('contact-success-overlay').style.display = 'flex';

    } catch (err) {
        console.error('EmailJS error:', err);
        btnText.textContent = 'Transmit Message';
        submitBtn.disabled = false;
        statusEl.textContent = '[ ERROR ] Transmission failed. Email me directly: jazzhong@outlook.com';
        statusEl.className = 'cf-status cf-error';
    }
}

const style = document.createElement('style');
style.textContent = `
    .fade-in-up { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
    .animate { opacity: 1; transform: translate(0, 0); }
`;
document.head.appendChild(style);
