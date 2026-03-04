document.addEventListener('DOMContentLoaded', function() {
    console.log("ATS System Master Script Active...");

    // Render Tables on Load
    if (document.getElementById('submissionsTableBody')) renderTLTable();
    if (document.getElementById('jobTableBody')) renderJobsInRecruiterTable();

    // BDE Job Form
    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.onsubmit = function(e) {
            e.preventDefault();
            const newJob = {
                id: Date.now(),
                role: document.getElementById('role').value,
                location: document.getElementById('location').value,
                openings: document.getElementById('openings').value
            };
            let jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
            jobs.push(newJob);
            localStorage.setItem('allJobs', JSON.stringify(jobs));
            alert("Job Created & Assigned!");
            location.href = 'index.html';
        };
    }
});

// Render Jobs for Recruiter
function renderJobsInRecruiterTable() {
    const tableBody = document.getElementById('jobTableBody');
    let jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
    if(!tableBody) return;
    tableBody.innerHTML = jobs.map(job => `
        <tr>
            <td><strong>${job.role}</strong></td>
            <td>${job.openings}</td>
            <td>${job.location}</td>
            <td><button class="btn btn-sm btn-primary" onclick="alert('Sourcing for ${job.role}')">Source</button></td>
        </tr>
    `).join('') || '<tr><td colspan="4">No active requirements.</td></tr>';
}

// Render Submissions for TL
function renderTLTable() {
    const tableBody = document.getElementById('submissionsTableBody');
    let submissions = JSON.parse(localStorage.getItem('tlData')) || [];
    if(!tableBody) return;
    tableBody.innerHTML = submissions.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.phone}</td>
            <td><span class="badge bg-warning text-dark">${item.status}</span></td>
            <td>
                <button onclick="fixInterview('${item.phone}', '${item.name}')" class="btn btn-sm btn-success">✅ Interview</button>
                <button onclick="deleteEntry(${item.id})" class="btn btn-sm btn-danger">❌</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="4">No pending candidates.</td></tr>';
}

// Global Actions
window.fixInterview = function(phone, name) {
    const date = prompt(`Set Interview Date for ${name}:`, "Tomorrow 11 AM");
    if (date) {
        let cleanPhone = phone.toString().replace(/\D/g, '');
        if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;
        const msg = encodeURIComponent(`Hello ${name}, Your Interview is Fixed for ${date}. Regards: MSME Agency`);
        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    }
};

window.deleteEntry = (id) => {
    let sub = JSON.parse(localStorage.getItem('tlData')).filter(e => e.id !== id);
    localStorage.setItem('tlData', JSON.stringify(sub));
    renderTLTable();
};