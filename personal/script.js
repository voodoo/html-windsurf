// Theme toggling
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

function toggleTheme() {
    document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', document.body.dataset.theme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (document.body.dataset.theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.dataset.theme = savedTheme;
updateThemeIcon();

themeToggle.addEventListener('click', toggleTheme);

// Smooth scrolling for navigation links
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

// Project data
const projects = [
    {
        title: 'Cascade',
        description: 'An AI-powered coding assistant that helps developers write better code faster. Built with a focus on real-time collaboration and intuitive interactions.',
        technologies: ['Ruby on Rails', 'Turbo', 'Stimulus', 'AI'],
        image: 'images/cascade.png',
        link: 'https://github.com/voodoo/'
    },
    {
        title: 'Personal Portfolio',
        description: 'A modern, responsive portfolio website showcasing my work and skills. Features dark mode support and smooth animations.',
        technologies: ['HTML', 'CSS', 'JavaScript'],
        image: 'images/site.png',
        link: 'https://github.com/voodoo/'
    }
];

// Populate projects
function createProjectCard(project) {
    return `
        <div class="project-card">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy" style="width: 100%; height: auto;">
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <a href="${project.link}" class="btn primary" target="_blank">View Project</a>
            </div>
        </div>
    `;
}

const projectGrid = document.querySelector('.project-grid');
if (projectGrid) {
    projectGrid.innerHTML = projects.map(createProjectCard).join('');
}

// Animate skill bars on scroll
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.progress-bar');
    skillBars.forEach(bar => {
        const progress = bar.dataset.progress;
        bar.style.setProperty('--progress', `${progress}%`);
    });
}

// Intersection Observer for skill bars animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
        }
    });
});

const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    observer.observe(skillsSection);
}

// Form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Clear form
        this.reset();
        
        // Show success message
        alert('Message sent successfully!');
    });
}

// Add scroll-based navbar background
const navbar = document.querySelector('.navbar');
