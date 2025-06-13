// Main JavaScript functionality

// Global variables
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let jobs = JSON.parse(localStorage.getItem('jobs')) || [];
let applications = JSON.parse(localStorage.getItem('applications')) || [];
let companies = JSON.parse(localStorage.getItem('companies')) || [];

// Utility functions
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;
    switch(type) {
        case 'success': notification.style.backgroundColor = '#10B981'; break;
        case 'error': notification.style.backgroundColor = '#EF4444'; break;
        case 'warning': notification.style.backgroundColor = '#F59E0B'; break;
        default: notification.style.backgroundColor = '#3B82F6';
    }
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add CSS animations for notifications
function addNotificationStyles() {
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }
}

// Form validation
function validateForm(formData, requiredFields) {
    const errors = [];
    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
            errors.push(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        }
    });
    return errors;
}

// Format date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Data management functions
function saveData(key, data) {
    try {
        // Store in localStorage
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Data saved to ${key}:`, data);
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function loadData(key) {
    try {
        // Load from localStorage
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
}

// Initialize data
function initializeData() {
    jobs = loadData('jobs');
    applications = loadData('applications');
    companies = loadData('companies');
}

// Job management functions
function addJob(jobData) {
    const job = { id: generateId(), ...jobData, postedDate: new Date().toISOString(), status: 'active' };
    jobs.push(job);
    saveData('jobs', jobs);
    return job;
}

function getJobs() {
    return jobs.filter(job => job.status === 'active');
}

function updateJob(jobId, updatedData) {
    const index = jobs.findIndex(job => job.id === jobId);
    if (index !== -1) {
        jobs[index] = { ...jobs[index], ...updatedData, updatedDate: new Date().toISOString() };
        saveData('jobs', jobs);
        return true;
    }
    return false;
}

function deleteJob(jobId) {
    const index = jobs.findIndex(job => job.id === jobId);
    if (index !== -1) {
        jobs.splice(index, 1);
        saveData('jobs', jobs);
        return true;
    }
    return false;
}

// Application management functions
function addApplication(applicationData) {
    const application = { id: generateId(), ...applicationData, applicationDate: new Date().toISOString(), status: 'pending' };
    applications.push(application);
    saveData('applications', applications);
    return application;
}

function getApplications(userId = null) {
    return userId ? applications.filter(app => app.userId === userId) : applications;
}

function updateApplication(appId, updatedData) {
    const index = applications.findIndex(app => app.id === appId);
    if (index !== -1) {
        applications[index] = { ...applications[index], ...updatedData, updatedDate: new Date().toISOString() };
        saveData('applications', applications);
        return true;
    }
    return false;
}

// Company management functions
function addCompany(companyData) {
    const company = { id: generateId(), ...companyData, registrationDate: new Date().toISOString(), status: 'active' };
    companies.push(company);
    saveData('companies', companies);
    return company;
}

function getCompanies() {
    return companies;
}

// Simulate login (since login.html isn't provided)
function setCurrentUser(user) {
    currentUser = user;
    saveData('currentUser', user);
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    addNotificationStyles();
    initializeData();
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        console.log('Internship Finder initialized at', new Date().toLocaleString('en-US', { timeZone: 'Africa/Johannesburg' }));
    }
    // Simulate a logged-in user for testing (remove in production)
    if (!currentUser) {
        setCurrentUser({ id: 'user123', username: 'testuser', role: 'applicant' });
    }
});
// In the DOMContentLoaded event:
if (!currentUser) {
    if (window.location.pathname.includes('company.html')) {
        setCurrentUser({ 
            id: 'company123', 
            username: 'testcompany', 
            role: 'company', 
            company: 'Demo Company' // Must match job.company values
        });
    } else {
        setCurrentUser({ id: 'user123', role: 'applicant' });
    }
}
// Export functions
window.InternshipFinder = {
    currentUser,
    showNotification,
    validateForm,
    formatDate,
    generateId,
    addJob,
    getJobs,
    updateJob,
    deleteJob,
    addApplication,
    getApplications,
    updateApplication,
    addCompany,
    getCompanies,
    saveData,
    loadData,
    setCurrentUser
};