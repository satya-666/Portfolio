// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Theme Toggle Functionality
const themeBtn = document.querySelector('.theme-btn');
const htmlElement = document.documentElement;
const storedTheme = localStorage.getItem('theme') || 'light';

// Set initial theme
htmlElement.setAttribute('data-theme', storedTheme);

// Toggle theme function
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Optional: Add a smooth transition effect to the body
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Theme toggle event listener
themeBtn.addEventListener('click', toggleTheme);

// Navigation functionality
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-link');

// Handle scroll events for navbar
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class and background color
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Set active nav link based on scroll position
function setActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navHeight = navbar.offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const currentScroll = window.pageYOffset;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
            links.forEach(link => link.classList.remove('active'));
            correspondingLink?.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);
setActiveNavLink(); // Set initial active state

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('mobile-menu');
    document.body.style.overflow = navLinks.classList.contains('mobile-menu') ? 'hidden' : '';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('mobile-menu');
        document.body.style.overflow = '';
    }
});

// Smooth scroll for navigation links
links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const navHeight = navbar.offsetHeight;
        
        window.scrollTo({
            top: targetSection.offsetTop - navHeight,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navLinks.classList.remove('mobile-menu');
        document.body.style.overflow = '';
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
        // Here you would typically send the form data to your backend
        // For demonstration, we'll use a timeout to simulate an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
    } catch (error) {
        // Show error message
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add some CSS for the notification system
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.success {
        background: #10B981;
    }
    
    .notification.error {
        background: #EF4444;
    }
    
    .mobile-menu {
        position: fixed;
        top: 70px;
        left: 0;
        width: 100%;
        background: white;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
    }
`;

document.head.appendChild(style);

// Add scroll-based navbar styling
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Hide/show navbar based on scroll direction
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
});

// Projects Filter and Load More functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const loadMoreBtn = document.querySelector('.load-more-btn');
const projectsPerPage = 4;
let currentPage = 1;

// Add hover effect to project cards with video control
projectCards.forEach(card => {
    const video = card.querySelector('.project-video');
    const overlay = card.querySelector('.project-overlay');
    
    if (video) {
        // Ensure video is loaded and paused initially
        video.load();
        video.pause();
        
        card.addEventListener('mouseenter', () => {
            try {
                // Play video when hovering
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Video play failed:", error);
                    });
                }
                
                // Apply hover effects
                video.style.transform = 'scale(1.1)';
                if (overlay) overlay.style.opacity = '1';
            } catch (error) {
                console.error('Error playing video:', error);
            }
        });
        
        card.addEventListener('mouseleave', () => {
            try {
                // Pause video when mouse leaves
                video.pause();
                // Reset video to start
                video.currentTime = 0;
                
                // Reset hover effects
                video.style.transform = 'scale(1)';
                if (overlay) overlay.style.opacity = '0';
            } catch (error) {
                console.error('Error pausing video:', error);
            }
        });
    }
});

// Filter projects
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            card.style.display = 'none'; // Hide all cards first
            
            // Show cards based on filter
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
            }
        });
        
        // Reset pagination
        currentPage = 1;
        updateProjectsVisibility();
    });
});

// Update projects visibility based on current page
function updateProjectsVisibility() {
    const visibleProjects = Array.from(projectCards).filter(card => 
        window.getComputedStyle(card).display !== 'none'
    );
    
    visibleProjects.forEach((project, index) => {
        if (index < currentPage * projectsPerPage) {
            project.style.display = 'block';
        } else {
            project.style.display = 'none';
        }
    });
    
    // Hide/show load more button
    if (visibleProjects.length <= currentPage * projectsPerPage) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Load more projects
loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    updateProjectsVisibility();
    
    // Animate new projects
    const newProjects = document.querySelectorAll('.project-card[style="display: block"]');
    newProjects.forEach(project => {
        project.style.opacity = '0';
        project.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            project.style.opacity = '1';
            project.style.transform = 'translateY(0)';
        }, 100);
    });
});

// Initialize projects visibility
updateProjectsVisibility();
