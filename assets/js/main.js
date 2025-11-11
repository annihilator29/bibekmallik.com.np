// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Theme Management with CSS Variables
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.html = document.documentElement;
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listeners
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        this.html.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
        this.updateButtonIcon();
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    updateButtonIcon() {
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

// Color Palette Manager
class PaletteManager {
    constructor() {
        this.paletteToggle = document.getElementById('palette-toggle');
        this.palettes = [
            { name: 'English Violet', primary: '#4A3267', secondary: '#DE638A', tertiary: '#F7B9C4' },
            { name: 'Ocean Blue', primary: '#1e40af', secondary: '#3b82f6', tertiary: '#60a5fa' },
            { name: 'Forest Green', primary: '#15803d', secondary: '#22c55e', tertiary: '#4ade80' },
            { name: 'Sunset Orange', primary: '#ea580c', secondary: '#f97316', tertiary: '#fb923c' },
            { name: 'Royal Purple', primary: '#7c3aed', secondary: '#a855f7', tertiary: '#c084fc' }
        ];
        this.currentPalette = localStorage.getItem('palette') || 0;
        
        this.init();
    }
    
    init() {
        this.paletteToggle.addEventListener('click', () => {
            this.togglePalette();
        });
        
        this.applyPalette(this.currentPalette);
    }
    
    applyPalette(index) {
        const palette = this.palettes[index];
        if (!palette) return;
        
        // Update CSS variables
        const root = document.documentElement;
        root.style.setProperty('--accent-primary', palette.primary);
        root.style.setProperty('--accent-secondary', palette.secondary);
        root.style.setProperty('--accent-tertiary', palette.tertiary);
        
        localStorage.setItem('palette', index);
    }
    
    togglePalette() {
        this.currentPalette = (parseInt(this.currentPalette) + 1) % this.palettes.length;
        this.applyPalette(this.currentPalette);
    }
}

// Initialize managers
const themeManager = new ThemeManager();
const paletteManager = new PaletteManager();

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

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
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

function highlightActiveSection() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// Form submission
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="bx bx-loader-alt animate-spin"></i> Sending...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch('https://formspree.io/f/meqyrrly', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        
        if (response.ok) {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showNotification('Oops! Something went wrong. Please try again later.', 'error');
        }
    } catch (error) {
        showNotification('Oops! Something went wrong. Please try again later.', 'error');
    } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
});

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'></i>
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
    }, 4000);
}

// Animate skill bars on scroll
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.h-3.rounded-full');
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialize skill bar animations
animateSkillBars();

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Persistent Navigation Management
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('nav');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.mobileMenuButton = document.getElementById('mobile-menu-button');
        this.init();
    }
    
    init() {
        // Always ensure navigation is visible and clickable
        this.ensureNavigationAccess();
        
        // Add keyboard shortcuts for navigation
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
        
        // Add intersection observer to ensure navigation is always accessible
        this.addNavigationGuard();
    }
    
    ensureNavigationAccess() {
        // Force navigation to always be on top and visible with sticky positioning
        if (this.navbar) {
            // Ensure sticky positioning is maintained
            this.navbar.style.position = 'sticky !important';
            this.navbar.style.top = '0 !important';
            this.navbar.style.zIndex = '99999 !important';
            this.navbar.style.pointerEvents = 'auto !important';
            this.navbar.style.opacity = '1 !important';
            this.navbar.style.display = 'block !important';
            this.navbar.style.visibility = 'visible !important';
        }
        
        // Always ensure nav links are clickable
        const navLinks = this.navbar?.querySelectorAll('a[href^="#"]');
        navLinks?.forEach(link => {
            link.style.pointerEvents = 'auto !important';
            link.style.opacity = '1 !important';
            link.style.display = 'block !important';
            link.style.visibility = 'visible !important';
        });
        
        // Always ensure control buttons are clickable
        const controlButtons = this.navbar?.querySelectorAll('button');
        controlButtons?.forEach(button => {
            button.style.pointerEvents = 'auto !important';
            button.style.opacity = '1 !important';
            button.style.display = 'block !important';
            button.style.visibility = 'visible !important';
        });
    }
    
    addNavigationGuard() {
        // Add a "Back to Top" floating button
        this.createBackToTopButton();
        
        // Monitor page scroll to ensure navigation is always accessible
        window.addEventListener('scroll', () => {
            this.ensureNavigationAccess();
        });
    }
    
    createBackToTopButton() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="bx bx-up-arrow-alt"></i>';
        backToTopBtn.className = 'fixed bottom-6 right-6 z-[99998] p-3 rounded-full text-white transition-all duration-300 transform hover:scale-110';
        backToTopBtn.style.cssText = `
            background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
            color: white;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            opacity: 0;
            pointer-events: none;
            position: fixed !important;
            z-index: 99998 !important;
        `;
        
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