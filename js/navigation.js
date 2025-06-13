// Navigation functionality

// Navigate to different portals
function navigateToPortal(portal) {
    const portalUrls = {
        'applicant': 'applicant.html',
        'company': 'company.html',
        'admin': 'admin.html'
    };
    
    if (portalUrls[portal]) {
        window.location.href = portalUrls[portal];
    } else {
        console.error('Invalid portal:', portal);
    }
}

// Handle back to home navigation
function navigateToHome() {
    window.location.href = 'index.html';
}

// Highlight active navigation item
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = $$('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Portal section navigation
function showSection(sectionId) {
    // Validate sectionId before using it
    if (!sectionId || sectionId.trim() === '') {
        console.error('Invalid section ID:', sectionId);
        return;
    }
    
    // Hide all sections
    const sections = $$('.section');
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Show target section
    const targetSection = $('#' + sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
    } else {
        console.error('Section not found:', sectionId);
    }
    
    // Update sidebar navigation
    const navItems = $$('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        const itemSection = item.getAttribute('data-section');
        if (itemSection === sectionId) {
            item.classList.add('active');
        }
    });
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any user session data
        currentUser = null;
        
        // Show logout message
        if (window.InternshipFinder) {
            window.InternshipFinder.showNotification('Logged out successfully', 'success');
        }
        
        // Redirect to home after a short delay
        setTimeout(() => {
            navigateToHome();
        }, 1500);
    }
}

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation item
    setActiveNavItem();
    
    // Handle portal navigation buttons
    const portalButtons = $$('.portal-btn');
    portalButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const portal = this.textContent.toLowerCase().includes('applicant') ? 'applicant' :
                          this.textContent.toLowerCase().includes('company') ? 'company' :
                          this.textContent.toLowerCase().includes('admin') ? 'admin' : null;
            
            if (portal) {
                navigateToPortal(portal);
            }
        });
    });
    
    // Handle sidebar navigation
    const sidebarNavItems = $$('.nav-item');
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            
            if (section === 'logout') {
                handleLogout();
            } else if (section && section.trim() !== '') {
                showSection(section);
            } else {
                console.error('Invalid or missing data-section attribute');
            }
        });
    });
    
    // Initialize first section as active on portal pages
    if (window.location.pathname.includes('.html') && 
        !window.location.pathname.includes('index.html')) {
        
        // Find the first section and show it
        const firstSection = $('.section');
        if (firstSection && firstSection.id && firstSection.id.trim() !== '') {
            showSection(firstSection.id);
        }
    }
    
    // Handle responsive navigation menu
    const navToggle = $('.nav-toggle');
    const nav = $('.nav');
    
    if (navToggle && nav) {
        navToggle.addEventListener('click', function() {
            nav.classList.toggle('nav-open');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const nav = $('.nav');
        const navToggle = $('.nav-toggle');
        
        if (nav && navToggle && 
            !nav.contains(e.target) && 
            !navToggle.contains(e.target)) {
            nav.classList.remove('nav-open');
        }
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function(e) {
    setActiveNavItem();
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href') && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        
        // Validate targetId before using it
        if (targetId && targetId.trim() !== '') {
            const targetElement = $('#' + targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }
});

// Export navigation functions
window.Navigation = {
    navigateToPortal,
    navigateToHome,
    showSection,
    handleLogout,
    setActiveNavItem
};