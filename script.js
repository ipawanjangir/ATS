document.addEventListener('DOMContentLoaded', function() {
    console.log("ATS Master Script Active...");

    if (document.getElementById('submissionsTableBody')) renderTLTable();
    if (document.getElementById('jobTableBody')) renderJobsInRecruiterTable();

    // BDE Job Creation
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
            alert("Job Created Successfully!");
            window.location.href = 'index.html';
        };
    }
});

function renderJobsInRecruiterTable() {
    const tableBody = document.getElementById('jobTableBody');
    let jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
    if(!tableBody) return;

    tableBody.innerHTML = jobs.length ? '' : '<tr><td colspan="4">No active jobs found.</td></tr>';
    
    jobs.forEach(job => {
        tableBody.insertAdjacentHTML('beforeend', `
            <tr>
                <td data-label="Job Role"><strong>${job.role}</strong></td>
                <td data-label="Openings">${job.openings}</td>
                <td data-label="Location">${job.location}</td>
                <td data-label="Action"><button class="btn btn-sm btn-primary" onclick="alert('Sourcing for ${job.role}')">Source</button></td>
            </tr>`);
    });
}

function renderTLTable() {
    const tableBody = document.getElementById('submissionsTableBody');
    let submissions = JSON.parse(localStorage.getItem('tlData')) || [];
    if(!tableBody) return;

    tableBody.innerHTML = submissions.length ? '' : '<tr><td colspan="4">No pending candidates.</td></tr>';
    
    submissions.forEach(item => {
        tableBody.insertAdjacentHTML('beforeend', `
            <tr>
                <td data-label="Candidate">${item.name}</td>
                <td data-label="Phone">${item.phone}</td>
                <td data-label="Status"><span class="badge bg-warning text-dark">${item.status}</span></td>
                <td data-label="Action">
                    <button onclick="fixInterview('${item.phone}', '${item.name}')" class="btn btn-sm btn-success">✅ Interview</button>
                </td>
            </tr>`);
    });
}

// WhatsApp Interview Fix
window.fixInterview = function(phone, name) {
    const date = prompt(`Enter Interview Date for ${name}:`, "Tomorrow 11 AM");
    if (date) {
        let cleanPhone = phone.toString().replace(/\D/g, '');
        if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;
        const msg = encodeURIComponent(`Hello ${name}, Your Interview is Fixed.\n📅 Date: ${date}\nRegards: MSME Agency`);
        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
    }
};