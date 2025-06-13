// Portal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize portal functionality
    initializePortal();
    
    // Handle job form submission
    handleJobForm();
    
    // Update displays based on current page
    updateAllDisplays();
});

function initializePortal() {
    console.log('Portal initialized');
    
    // Set up event listeners for dynamic content
    setupEventListeners();
}

function setupEventListeners() {
    // Job form handling
    const jobForm = $('#job-form');
    if (jobForm) {
        jobForm.addEventListener('submit', handleJobSubmission);
        jobForm.addEventListener('reset', function() {
            window.InternshipFinder.showNotification('Form cleared', 'info');
        });
    }
}

function handleJobForm() {
    const jobForm = $('#job-form');
    if (!jobForm) return;

    jobForm.addEventListener('submit', handleJobSubmission);
}

function handleJobSubmission(e) {
    e.preventDefault();
    
    const formData = {
        title: $('#job-title')?.value || '',
        company: $('#company-name')?.value || '', 
        location: $('#job-location')?.value || '',
        description: $('#job-description')?.value || ''
        
    };
    
    const errors = window.InternshipFinder.validateForm(formData, ['title', 'company', 'location', 'description']);
    if (errors.length > 0) {
        window.InternshipFinder.showNotification(errors[0], 'error');
        return;
    }
    
    const newJob = window.InternshipFinder.addJob(formData);
    if (newJob) {
        window.InternshipFinder.showNotification('Job posted successfully! Now visible to all applicants.', 'success');
        e.target.reset();
        updateAllDisplays();
        
        // Show confirmation that job is now available to applicants
        setTimeout(() => {
            window.InternshipFinder.showNotification('Job is now live in the applicant portal!', 'info');
        }, 2000);
    } else {
        window.InternshipFinder.showNotification('Error posting job', 'error');
    }
}

function updateAllDisplays() {
    // Update different displays based on current page
    updateJobListings();
    updateAvailableInternships();
    updateMyApplications();
    updateViewApplicants(); // Added this for company portal
    updateAdminTables();
}

function updateJobListings() {
    const container = $('#job-listings .content-card');
    if (!container) return;
    
    const jobs = window.InternshipFinder.getJobs();
    
    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Job Listings</h3>
                <p>Create your first internship posting to attract talented applicants.</p>
            </div>
        `;
    } else {
        container.innerHTML = jobs.map(job => createJobCard(job, 'company')).join('');
    }
}

function updateAvailableInternships() {
    const container = $('#available-jobs .content-card');
    if (!container) return;
    
    const jobs = window.InternshipFinder.getJobs();
    
    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Internships Available</h3>
                <p>Check back later for new opportunities or contact companies directly.</p>
            </div>
        `;
    } else {
        container.innerHTML = jobs.map(job => createJobCard(job, 'applicant')).join('');
    }
}

// NEW: Update company's view applicants section
function updateViewApplicants() {
    const container = $('#view-applicants .content-card');
    if (!container) return;
    
    const applications = window.InternshipFinder.getApplications();    
    if (applications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Applicants Yet</h3>
                <p>Once applicants apply to your job listings, their information will appear here.</p>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="applicants-list">
                <h4 style="margin-bottom: 1rem; color: var(--primary-color, #3b82f6);">Recent Applications (${applications.length})</h4>
                ${applications.map(app => createApplicantCard(app)).join('')}
            </div>
        `;
    }
}

function createApplicantCard(application, userType = 'company') {
    const statusColors = {
        pending: { bg: '#FEF3C7', color: '#92400E' },
        accepted: { bg: '#D1FAE5', color: '#065F46' },
        rejected: { bg: '#FEE2E2', color: '#991B1B' }
    };

    const statusText = application.status ? application.status.toLowerCase() : 'pending';
    const statusStyle = statusColors[statusText] || statusColors.pending;
    const displayStatus = application.status ? application.status.toUpperCase() : 'PENDING';

    // Conditionally include action buttons for company users only
    const actionButtons = userType === 'company' ? `
        <div style="display: flex; gap: 0.5rem;">
            <button onclick="updateApplicationStatus('${application.id}', 'accepted')" class="btn btn-success" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; background: #10B981; color: white; border: none; border-radius: 4px;">Accept</button>
            <button onclick="updateApplicationStatus('${application.id}', 'rejected')" class="btn btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; background: #EF4444; color: white; border: none; border-radius: 4px;">Reject</button>
        </div>
    ` : '';

    return `
        <div class="applicant-card" style="border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; background: var(--white, #ffffff);">
            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 1rem;">
                <div style="flex: 1;">
                    <h4 style="color: var(--primary-color, #3b82f6); margin-bottom: 0.25rem;">${escapeHtml(application.applicantName || 'Demo User')}</h4>
                    <p style="color: var(--text-dark, #374151); margin-bottom: 0.25rem;">📧 ${escapeHtml(application.applicantEmail || 'demo@example.com')}</p>
                    <p style="font-weight: 600; margin-bottom: 0.5rem;">Applied for: ${escapeHtml(application.jobTitle)}</p>
                    <p style="color: var(--text-dark, #374151); opacity: 0.7; font-size: 0.875rem;">🏢 ${escapeHtml(application.company)}</p>
                </div>
                <span class="status-badge" style="padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; background: ${statusStyle.bg}; color: ${statusStyle.color};">${displayStatus}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color, #e5e7eb); padding-top: 1rem;">
                <small style="color: var(--text-dark, #374151); opacity: 0.6;">Applied: ${window.InternshipFinder.formatDate(application.applicationDate)}</small>
                ${actionButtons}
            </div>
        </div>
    `;
}
// NEW: Quick update application status function for company
function updateApplicationStatus(appId, newStatus) {
    const applications = window.InternshipFinder.getApplications();
    const appIndex = applications.findIndex(a => a.id === appId);
    
    if (appIndex !== -1) {
        applications[appIndex].status = newStatus;
        window.InternshipFinder.saveData('applications', applications);
        
        window.InternshipFinder.showNotification(`Application ${newStatus}!`, 'success');
        updateAllDisplays();
    } else {
        window.InternshipFinder.showNotification('Error updating application', 'error');
    }
}

function createJobCard(job, userType = 'company') {
    const actions = userType === 'company' ? `
        <button onclick="deleteJob('${job.id}')" class="btn btn-danger" style="padding: 0.5rem 1rem; font-size: 0.875rem; margin-right: 0.5rem;">Delete</button>
        <button onclick="editJob('${job.id}')" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Edit</button>
    ` : `
        <button onclick="applyForJob('${job.id}')" class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.875rem;">Apply Now</button>
    `;
    
    return `
        <div class="job-card" style="border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; background: var(--white, #ffffff);">
            <h3 style="color: var(--primary-color, #3b82f6); margin-bottom: 0.5rem;">${escapeHtml(job.title)}</h3>
            <p style="font-weight: 600; margin-bottom: 0.5rem;">${escapeHtml(job.company)}</p>
            <p style="color: var(--text-dark, #374151); opacity: 0.8; margin-bottom: 0.5rem;">📍 ${escapeHtml(job.location)}</p>
            <p style="color: var(--text-dark, #374151); margin-bottom: 1rem;">${escapeHtml(job.description)}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                <small style="color: var(--text-dark, #374151); opacity: 0.6;">Posted: ${window.InternshipFinder.formatDate(job.postedDate)}</small>
                <div style="display: flex; gap: 0.5rem;">${actions}</div>
            </div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function applyForJob(jobId) {
    const job = window.InternshipFinder.getJobs().find(j => j.id === jobId);
    if (!job) {
        window.InternshipFinder.showNotification('Job not found', 'error');
        return;
    }

    // Check if already applied (demo user check)
    const existingApplication = window.InternshipFinder.getApplications().find(app => 
        app.jobId === jobId && app.userId === 'demo-user'
    );
    
    if (existingApplication) {
        window.InternshipFinder.showNotification('You have already applied for this job!', 'warning');
        return;
    }

    // Get current user details (replace mock data with real user session in production)
    const applicationData = {
        jobId,
        jobTitle: job.title,
        company: job.company, // Critical: Use job's company name
        userId: 'demo-user', // Replace with window.InternshipFinder.currentUser.id
        applicantName: 'Demo User', // Replace with user session data
        applicantEmail: 'demo@example.com', // Replace with user session data
        applicantCv:'',
        applicationDate: new Date().toISOString(),
        status: 'pending'
    };

    const newApplication = window.InternshipFinder.addApplication(applicationData);
    if (newApplication) {
        window.InternshipFinder.showNotification(`Successfully applied for ${job.title}!`, 'success');
        updateMyApplications(); // Update applicant view
        updateViewApplicants(); // Update company view
        updateAdminTables(); // Update admin view
    } else {
        window.InternshipFinder.showNotification('Error submitting application', 'error');
    }
}

function updateMyApplications() {
    const container = $('#my-applications .content-card');
    if (!container) return;
    
    const applications = window.InternshipFinder.getApplications();
    
    if (applications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Applications Yet</h3>
                <p>Apply to internships to see your application status here.</p>
            </div>
        `;
    } else {
        container.innerHTML = applications.map(app => createApplicantCard(app, 'applicant')).join('');
    }
}
function createApplicantCard(application) {
    const statusColors = {
        pending: { bg: '#FEF3C7', color: '#92400E' },
        accepted: { bg: '#D1FAE5', color: '#065F46' },
        rejected: { bg: '#FEE2E2', color: '#991B1B' }
    };
    
    const statusText = application.status ? application.status.toLowerCase() : 'pending';
    const statusStyle = statusColors[statusText] || statusColors.pending;
    const displayStatus = application.status ? application.status.toUpperCase() : 'PENDING';
    
    const cvLink = application.applicantCv ? `
        <a href="${application.applicantCv}" download="${escapeHtml(application.cvFileName)}" style="color: var(--primary-color, #3b82f6); text-decoration: none; font-size: 0.875rem;">Download CV</a>
    ` : '<span style="color: var(--text-dark, #374151); opacity: 0.7; font-size: 0.875rem;">No CV uploaded</span>';

    return `
        <div class="applicant-card" style="border: 1px solid var(--border-color, #e5e7eb); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; background: var(--white, #ffffff);">
            <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 1rem;">
                <div style="flex: 1;">
                    <h4 style="color: var(--primary-color, #3b82f6); margin-bottom: 0.25rem;">${escapeHtml(application.applicantName || 'Demo User')}</h4>
                    <p style="color: var(--text-dark, #374151); margin-bottom: 0.25rem;">📧 ${escapeHtml(application.applicantEmail || 'demo@example.com')}</p>
                    <p style="font-weight: 600; margin-bottom: 0.5rem;">Applied for: ${escapeHtml(application.jobTitle)}</p>
                    <p style="color: var(--text-dark, #374151); opacity: 0.7; font-size: 0.875rem;">🏢 ${escapeHtml(application.company)}</p>
                    ${cvLink}
                </div>
                <span class="status-badge" style="padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; background: ${statusStyle.bg}; color: ${statusStyle.color};">${displayStatus}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color, #e5e7eb); padding-top: 1rem;">
                <small style="color: var(--text-dark, #374151); opacity: 0.6;">Applied: ${window.InternshipFinder.formatDate(application.applicationDate)}</small>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="updateApplicationStatus('${application.id}', 'accepted')" class="btn btn-success" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; background: #10B981; color: white; border: none; border-radius: 4px;">Accept</button>
                    <button onclick="updateApplicationStatus('${application.id}', 'rejected')" class="btn btn-danger" style="padding: 0.25rem 0.75rem; font-size: 0.75rem; background: #EF4444; color: white; border: none; border-radius: 4px;">Reject</button>
                </div>
            </div>
        </div>
    `;
}

function deleteJob(jobId) {
    if (confirm('Are you sure you want to delete this job posting?')) {
        const success = window.InternshipFinder.deleteJob(jobId);
        if (success) {
            window.InternshipFinder.showNotification('Job deleted successfully', 'success');
            updateAllDisplays();
        } else {
            window.InternshipFinder.showNotification('Error deleting job', 'error');
        }
    }
}

function editJob(jobId) {
    const job = window.InternshipFinder.getJobs().find(j => j.id === jobId);
    if (!job) {
        window.InternshipFinder.showNotification('Job not found', 'error');
        return;
    }
    
    const newTitle = prompt('Enter new job title:', job.title);
    if (newTitle === null) return; // User cancelled
    
    const newDescription = prompt('Enter new job description:', job.description);
    if (newDescription === null) return; // User cancelled
    
    if (newTitle.trim() && newDescription.trim()) {
        // Update the job in the jobs array
        const jobIndex = window.InternshipFinder.getJobs().findIndex(j => j.id === jobId);
        if (jobIndex !== -1) {
            const jobs = window.InternshipFinder.getJobs();
            jobs[jobIndex] = { ...jobs[jobIndex], title: newTitle.trim(), description: newDescription.trim() };
            window.InternshipFinder.saveData('jobs', jobs);
            
            window.InternshipFinder.showNotification('Job updated successfully', 'success');
            updateAllDisplays();
        } else {
            window.InternshipFinder.showNotification('Error updating job', 'error');
        }
    } else {
        window.InternshipFinder.showNotification('Title and description cannot be empty', 'error');
    }
}

function updateAdminTables() {
    updateJobsTable();
    updateApplicantsTable();
    updateCompaniesTable();
}

function updateJobsTable() {
    const jobsTableBody = $('#manage-jobs tbody');
    if (!jobsTableBody) return;
    
    const jobs = window.InternshipFinder.getJobs();
    jobsTableBody.innerHTML = '';
    
    if (jobs.length === 0) {
        jobsTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <p>No jobs to manage at this time.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    jobs.forEach(job => {
        const row = document.createElement('tr');
        
        // Job Title
        const titleCell = document.createElement('td');
        titleCell.textContent = job.title;
        row.appendChild(titleCell);
        
        // Company
        const companyCell = document.createElement('td');
        companyCell.textContent = job.company;
        row.appendChild(companyCell);
        
        // Location
        const locationCell = document.createElement('td');
        locationCell.textContent = job.location;
        row.appendChild(locationCell);
        
        // Posted Date
        const dateCell = document.createElement('td');
        dateCell.textContent = window.InternshipFinder.formatDate(job.postedDate);
        row.appendChild(dateCell);
        
        // Status
        const statusCell = document.createElement('td');
        statusCell.textContent = job.status || 'active';
        row.appendChild(statusCell);
        
        // Actions
        const actionsCell = document.createElement('td');
        actionsCell.style.cssText = 'display: flex; gap: 0.5rem; flex-wrap: wrap;';
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'btn btn-danger';
        deleteButton.style.cssText = 'padding: 0.25rem 0.5rem; font-size: 0.75rem;';
        deleteButton.onclick = () => deleteJob(job.id);
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'btn btn-secondary';
        editButton.style.cssText = 'padding: 0.25rem 0.5rem; font-size: 0.75rem;';
        editButton.onclick = () => editJob(job.id);
        
        actionsCell.appendChild(deleteButton);
        actionsCell.appendChild(editButton);
        row.appendChild(actionsCell);
        
        jobsTableBody.appendChild(row);
    });
}
function updateApplicantsTable() {
    const applicantsTableBody = $('#manage-applicants tbody');
    if (!applicantsTableBody) return;
    
    const applications = window.InternshipFinder.getApplications();
    
    applicantsTableBody.innerHTML = applications.map(app => `
        <tr>
            <td>${app.name}</td>
            <td>${app.email}</td>
            <td>${app.phone}</td>
            <td>${app.jobTitle}</td>
            <td>${window.InternshipFinder.formatDate(app.applicationDate)}</td>
            <td>${app.status}</td>
            <td>
                <button onclick="editApplicationStatus('${app.id}')" 
                    class="btn btn-primary">
                    Edit Status
                </button>
            </td>
        </tr>
    `).join('');
    
    if (applications.length === 0) {
        applicantsTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <p>No applicants to manage at this time.</p>
                    </div>
                </td>
            </tr>
        `;
    }
}
function updateCompaniesTable() {
    const companiesTableBody = $('#manage-companies tbody');
    if (!companiesTableBody) return;
    
    const companies = window.InternshipFinder.getCompanies();
    const jobs = window.InternshipFinder.getJobs();
    
    // Get unique companies from jobs
    const companyMap = new Map();
    jobs.forEach(job => {
        if (!companyMap.has(job.company)) {
            companyMap.set(job.company, {
                name: job.company,
                email: 'contact@' + job.company.toLowerCase().replace(/\s+/g, '') + '.com',
                registrationDate: job.postedDate,
                status: 'active'
            });
        }
    });
    
    const allCompanies = [...companies, ...Array.from(companyMap.values())];
    
    companiesTableBody.innerHTML = '';
    
    if (allCompanies.length === 0) {
        companiesTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <p>No companies to manage at this time.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    allCompanies.forEach(company => {
        const row = document.createElement('tr');
        
        // Company Name
        const nameCell = document.createElement('td');
        nameCell.textContent = company.name || 'N/A';
        row.appendChild(nameCell);
        
        // Email
        const emailCell = document.createElement('td');
        emailCell.textContent = company.email || 'N/A';
        row.appendChild(emailCell);
        
        // Jobs Posted
        const jobsCell = document.createElement('td');
        const jobCount = jobs.filter(job => job.company === company.name).length;
        jobsCell.textContent = jobCount;
        row.appendChild(jobsCell);
        
        // Registration Date
        const dateCell = document.createElement('td');
        dateCell.textContent = window.InternshipFinder.formatDate(company.registrationDate);
        row.appendChild(dateCell);
        
        // Status
        const statusCell = document.createElement('td');
        statusCell.textContent = company.status || 'active';
        row.appendChild(statusCell);
        
        // Actions
        const actionsCell = document.createElement('td');
        actionsCell.textContent = 'View Details';
        row.appendChild(actionsCell);
        
        companiesTableBody.appendChild(row);
    });
}

function editApplicationStatus(appId) {
    const applications = window.InternshipFinder.getApplications();
    const app = applications.find(a => a.id === appId);
    if (!app) {
        window.InternshipFinder.showNotification('Application not found', 'error');
        return;
    }
    
    const newStatus = prompt('Enter new status (pending/accepted/rejected):', app.status);
    if (newStatus === null) return; // User cancelled
    
    const validStatuses = ['pending', 'accepted', 'rejected'];
    if (newStatus && validStatuses.includes(newStatus.toLowerCase())) {
        // Update application status
        const appIndex = applications.findIndex(a => a.id === appId);
        if (appIndex !== -1) {
            applications[appIndex].status = newStatus.toLowerCase();
            window.InternshipFinder.saveData('applications', applications);
            
            window.InternshipFinder.showNotification('Application status updated successfully', 'success');
            updateAllDisplays();
        } else {
            window.InternshipFinder.showNotification('Error updating application', 'error');
        }
    } else {
        window.InternshipFinder.showNotification('Invalid status. Use: pending, accepted, or rejected.', 'error');
    }
}
// Portal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize portal functionality
    initializePortal();
    
    // Handle job form submission
    handleJobForm();
    
    // Update displays based on current page
    updateAllDisplays();
});

let currentJobId = null;

function initializePortal() {
    console.log('Portal initialized');
    setupEventListeners();
}

function setupEventListeners() {
    const jobForm = $('#job-form');
    if (jobForm) {
        jobForm.addEventListener('submit', handleJobSubmission);
        jobForm.addEventListener('reset', function() {
            window.InternshipFinder.showNotification('Form cleared', 'info');
        });
    }

    // Application form handling
    const applicationForm = $('#application-form');
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleApplicationSubmission);
    }
}

function handleJobSubmission(e) {
    e.preventDefault();
    
    const formData = {
        title: $('#job-title')?.value || '',
        company: $('#company-name')?.value || '', 
        location: $('#job-location')?.value || '',
        description: $('#job-description')?.value || ''
    };
    
    const errors = window.InternshipFinder.validateForm(formData, ['title', 'company', 'location', 'description']);
    if (errors.length > 0) {
        window.InternshipFinder.showNotification(errors[0], 'error');
        return;
    }
    
    const newJob = window.InternshipFinder.addJob(formData);
    if (newJob) {
        window.InternshipFinder.showNotification('Job posted successfully! Now visible to all applicants.', 'success');
        e.target.reset();
        updateAllDisplays();
        
        setTimeout(() => {
            window.InternshipFinder.showNotification('Job is now live in the applicant portal!', 'info');
        }, 2000);
    } else {
        window.InternshipFinder.showNotification('Error posting job', 'error');
    }
}

// Application Handling
function applyForJob(jobId) {
    const job = window.InternshipFinder.getJobs().find(j => j.id === jobId);
    if (!job) return;
    
    currentJobId = jobId;
    $('#job-title-display').textContent = job.title;
    $('#application-modal').style.display = 'flex';
}

function closeModal() {
    $('#application-modal').style.display = 'none';
    currentJobId = null;
}

function handleApplicationSubmission(e) {
    e.preventDefault();
    
    const fileInput = $('#applicant-cv');
    const file = fileInput?.files[0];
    
    if (!file) {
        window.InternshipFinder.showNotification('Please upload a CV', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const applicationData = {
            applicantName: $('#applicant-name').value,
            applicantEmail: $('#applicant-email').value,
            phone: $('#applicant-phone').value,
            applicantCv: event.target.result, // Store CV as base64 string
            cvFileName: file.name, // Store original file name
            jobId: currentJobId
        };

        const errors = window.InternshipFinder.validateForm(applicationData, 
            ['applicantName', 'applicantEmail', 'phone', 'jobId', 'applicantCv']);
        
        if (errors.length > 0) {
            window.InternshipFinder.showNotification(errors[0], 'error');
            return;
        }

        const job = window.InternshipFinder.getJobs().find(j => j.id === currentJobId);
        
        const application = {
            ...applicationData,
            id: window.InternshipFinder.generateId(),
            jobTitle: job.title,
            company: job.company,
            applicationDate: new Date().toISOString(),
            status: 'pending'
        };

        window.InternshipFinder.addApplication(application);
        window.InternshipFinder.showNotification('Application submitted successfully!', 'success');
        
        e.target.reset();
        closeModal();
        updateAllDisplays();
    };
    
    reader.onerror = function() {
        window.InternshipFinder.showNotification('Error reading CV file', 'error');
    };
    
    reader.readAsDataURL(file); // Convert file to base64
}
// Display Updates
function updateAllDisplays() {
    updateJobListings();
    updateAvailableInternships();
    updateMyApplications();
    updateViewApplicants();
    updateAdminTables();
}

function updateApplicantsTable() {
    const applicantsTableBody = $('#manage-applicants tbody');
    if (!applicantsTableBody) return;
    
    const applications = window.InternshipFinder.getApplications();
    
    applicantsTableBody.innerHTML = applications.map(app => `
        <tr>
            <td>${app.applicantName}</td>
            <td>${app.applicantEmail}</td>
            <td>${app.phone}</td>
            <td>${app.jobTitle}</td>
            <td>${window.InternshipFinder.formatDate(app.applicationDate)}</td>
            <td>${app.status}</td>
            <td>
                <button onclick="editApplicationStatus('${app.id}')" 
                    class="btn btn-primary">
                    Edit Status
                </button>
            </td>
        </tr>
    `).join('');
    
    if (applications.length === 0) {
        applicantsTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <p>No applicants to manage at this time.</p>
                    </div>
                </td>
            </tr>
        `;
    }
}

