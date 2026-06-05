// Initialize AOS
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
}

// Theme Management with CSS Variables & Classes
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.html = document.documentElement;
        this.currentTheme = localStorage.getItem('theme') || 'dark'; // Dark is default
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listeners
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        const isDark = theme === 'dark';
        this.html.classList.toggle('dark', isDark);
        this.html.classList.toggle('light-theme', !isDark);
        localStorage.setItem('theme', theme);
        this.updateButtonIcon();
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
    
    updateButtonIcon() {
        if (!this.themeToggle) return;
        const moonIcon = this.themeToggle.querySelector('i.bx-moon');
        const sunIcon = this.themeToggle.querySelector('i.bx-sun');
        
        if (this.currentTheme === 'dark') {
            moonIcon?.classList.add('hidden');
            sunIcon?.classList.remove('hidden');
        } else {
            moonIcon?.classList.remove('hidden');
            sunIcon?.classList.add('hidden');
        }
    }
}

// Color Palette Manager using data-palette attributes
class PaletteManager {
    constructor() {
        this.paletteToggle = document.getElementById('palette-toggle');
        this.palettesCount = 4; // 0: Grid Power, 1: Classic Blueprint, 2: High-Voltage Amber, 3: Automation Terminal
        this.currentPalette = localStorage.getItem('palette') || 0;
        this.initialized = false;
        
        this.init();
    }
    
    init() {
        if (this.paletteToggle) {
            this.paletteToggle.addEventListener('click', () => {
                this.togglePalette();
            });
        }
        
        this.applyPalette(this.currentPalette);
    }
    
    applyPalette(index) {
        const root = document.documentElement;
        root.setAttribute('data-palette', index);
        localStorage.setItem('palette', index);
        
        // Notify user about palette change
        const paletteNames = ['Grid Power', 'Classic Blueprint', 'High-Voltage Amber', 'Automation Terminal'];
        if (this.initialized) {
            showNotification(`Palette switched to: ${paletteNames[index]}`, 'success');
        }
        this.initialized = true;
    }
    
    togglePalette() {
        this.currentPalette = (parseInt(this.currentPalette) + 1) % this.palettesCount;
        this.applyPalette(this.currentPalette);
    }
}

// Notification system (loaded first for palette initialization logs)
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 z-[100000] p-4 rounded shadow-lg transform translate-x-full transition-transform duration-300 font-mono-labels text-xs border ${
        type === 'success' 
            ? 'bg-surface-container text-primary-container border-primary-container' 
            : 'bg-surface-container text-secondary border-secondary'
    }`;
    
    const icon = type === 'success' ? 'terminal' : 'warning';
    
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <span class="material-symbols-outlined text-sm">${icon}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3500);
}

// Initialize managers
const themeManager = new ThemeManager();
const paletteManager = new PaletteManager();

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when clicking on links
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation highlight
const sections = document.querySelectorAll('section[id], #skills');
const navLinksAll = document.querySelectorAll('.nav-link');
const navContactTerminal = document.getElementById('nav-contact-terminal');

function highlightActiveSection() {
    let current = '';
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollPos - 120;
        const sectionHeight = rect.height;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // Highlight top-right terminal button when in contact section
    if (navContactTerminal) {
        if (current === 'contact') {
            navContactTerminal.classList.add('terminal-active');
        } else {
            navContactTerminal.classList.remove('terminal-active');
        }
    }
}

window.addEventListener('scroll', highlightActiveSection);


// Form submission
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = `
            <span class="material-symbols-outlined text-sm animate-spin mr-2">sync</span>
            <span>TRANSMITTING...</span>
        `;
        submitButton.disabled = true;
        
        try {
            const response = await fetch('https://formspree.io/f/meqyrrly', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            
            if (response.ok) {
                showNotification('TRANSMISSION SUCCESSFUL. MESSAGE RECEIVED.', 'success');
                contactForm.reset();
            } else {
                showNotification('TRANSMISSION FAILED. SUBMIT RETRY ATTEMPT.', 'error');
            }
        } catch (error) {
            showNotification('TRANSMISSION FAILED. NETWORK ERROR DETECTED.', 'error');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Animate skill bars on scroll
function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar-fill');
                if (progressBar) {
                    const width = progressBar.getAttribute('data-width') || '0%';
                    progressBar.style.width = '0%';
                    
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 200);
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    skillItems.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialize skill bar animations
animateSkillBars();

// Add loading animation class to body
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Persistent Navigation Guard & Floating Controls
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('nav');
        this.init();
    }
    
    init() {
        this.ensureNavigationAccess();
        this.createBackToTopButton();
        
        window.addEventListener('scroll', () => {
            this.ensureNavigationAccess();
        });
        
        // Keyboard navigation shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.scrollToSection('home');
                        break;
                    case '2':
                        e.preventDefault();
                        this.scrollToSection('about');
                        break;
                    case '3':
                        e.preventDefault();
                        this.scrollToSection('skills');
                        break;
                    case '4':
                        e.preventDefault();
                        this.scrollToSection('work');
                        break;
                    case '5':
                        e.preventDefault();
                        this.scrollToSection('contact');
                        break;
                }
            }
        });
    }
    
    ensureNavigationAccess() {
        if (this.navbar) {
            this.navbar.style.position = 'sticky';
            this.navbar.style.top = '0';
            this.navbar.style.zIndex = '99999';
        }
    }
    
    createBackToTopButton() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'back-to-top';
        backToTopBtn.innerHTML = '<span class="material-symbols-outlined">arrow_upward</span>';
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.pointerEvents = 'auto';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.pointerEvents = 'none';
            }
        });
        
        document.body.appendChild(backToTopBtn);
    }
    
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offset = 80;
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Initialize Navigation Manager
const navigationManager = new NavigationManager();

// Dynamic Experience Counters
function initExperienceCounters() {
    const totalExpEl = document.getElementById('dynamic-exp-counter');
    const neaTenureEl = document.getElementById('nea-tenure-ticker');
    
    const totalStartDate = new Date('2021-04-15T00:00:00');
    const neaStartDate = new Date('2026-02-17T00:00:00');
    
    function calcDiff(startDate, now) {
        let y = now.getFullYear() - startDate.getFullYear();
        let m = now.getMonth()   - startDate.getMonth();
        let d = now.getDate()    - startDate.getDate();
        if (d < 0) {
            const prev = new Date(now.getFullYear(), now.getMonth(), 0);
            d += prev.getDate();
            m--;
        }
        if (m < 0) { m += 12; y--; }
        return { y, m, d };
    }
    
    function updateCounters() {
        const now = new Date();
        
        // 1. Total Experience → "X Years, Y Months, Z Days"
        if (totalExpEl) {
            const { y, m, d } = calcDiff(totalStartDate, now);
            totalExpEl.textContent = `${y} Years, ${m} Months, ${d} Days`;
        }
        
        // 2. NEA Tenure → "Y Months, Z Days" (omit years if < 1)
        if (neaTenureEl) {
            const { y, m, d } = calcDiff(neaStartDate, now);
            neaTenureEl.textContent = y >= 1
                ? `${y}y ${m}m ${d}d`
                : `${m} Months, ${d} Days`;
        }
    }
    
    setInterval(updateCounters, 60000);
    updateCounters();
}

// Footer Uptime Counter
function initFooterUptime() {
    const footerEl = document.getElementById('footer-uptime-ticker');
    if (!footerEl) return;
    
    const careerStart = new Date('2021-04-15T00:00:00');
    
    function updateUptime() {
        const now   = new Date();
        const years = (now - careerStart) / (1000 * 60 * 60 * 24 * 365.25);
        footerEl.textContent = years >= 6.0
            ? `UPTIME: ${Math.floor(years)} YEARS`
            : `UPTIME: ${years.toFixed(1)} YEARS`;
    }
    
    setInterval(updateUptime, 60000);
    updateUptime();
}

// Initialize dynamic experience tickers
initExperienceCounters();
initFooterUptime();