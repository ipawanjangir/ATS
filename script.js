document.addEventListener('DOMContentLoaded', function() {
    console.log("MSME ATS Master Script Active...");

    // 1. Initial Load
    if (document.getElementById('submissionsTableBody')) renderTLTable();
    if (document.getElementById('jobTableBody')) renderJobsInRecruiterTable();

    // 2. Candidate Submission (Recruiter)
    const candidateForm = document.getElementById('candidateForm');
    if (candidateForm) {
        candidateForm.onsubmit = function(e) {
            e.preventDefault();
            const candidateData = {
                id: Date.now(),
                name: document.getElementById('candidateName').value,
                phone: document.getElementById('candidatePhone').value,
                status: document.getElementById('status').value
            };
            let submissions = JSON.parse(localStorage.getItem('tlData')) || [];
            submissions.push(candidateData);
            localStorage.setItem('tlData', JSON.stringify(submissions));
            alert("Candidate Profile Sent to Team Lead!");
            this.reset();
            if (document.getElementById('submissionsTableBody')) renderTLTable();
        };
    }
});

// 3. Render Jobs (Recruiter View)
function renderJobsInRecruiterTable() {
    const tableBody = document.getElementById('jobTableBody');
    let jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
    tableBody.innerHTML = jobs.length ? '' : '<tr><td colspan="4" style="text-align:center;">No active jobs found.</td></tr>';
    
    jobs.forEach(job => {
        tableBody.insertAdjacentHTML('beforeend', `
            <tr>
                <td data-label="Job Role"><strong>${job.role}</strong></td>
                <td data-label="Openings">${job.openings}</td>
                <td data-label="Location">${job.location}</td>
                <td data-label="Action"><button class="btn-sm btn-primary" onclick="applyForJob('${job.role}')" style="background:#3498db; color:white; border:none; border-radius:4px; padding:5px 10px;">Source</button></td>
            </tr>`);
    });
}

// 4. Render Submissions (TL View)
function renderTLTable() {
    const tableBody = document.getElementById('submissionsTableBody');
    let submissions = JSON.parse(localStorage.getItem('tlData')) || [];
    tableBody.innerHTML = submissions.length ? '' : '<tr><td colspan="4" style="text-align:center;">No pending submissions.</td></tr>';
    
    submissions.forEach(item => {
        tableBody.insertAdjacentHTML('beforeend', `
            <tr>
                <td data-label="Candidate Name">${item.name}</td>
                <td data-label="Phone Number">${item.phone}</td>
                <td data-label="Current Status">${item.status}</td>
                <td data-label="Actions">
                    <button onclick="fixInterview('${item.phone}', '${item.name}')" style="background:#27ae60; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;">✅ Interview</button>
                    <button onclick="deleteEntry(${item.id})" style="background:#e74c3c; color:white; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; margin-left:5px;">❌</button>
                </td>
            </tr>`);
    });
}

// 5. Global Helpers
window.applyForJob = (role) => {
    alert("Setting filter for: " + role);
    document.getElementById('candidateName')?.focus();
};

window.deleteEntry = (id) => {
    if(confirm("Are you sure you want to remove this candidate?")) {
        let sub = JSON.parse(localStorage.getItem('tlData')).filter(e => e.id !== id);
        localStorage.setItem('tlData', JSON.stringify(sub));
        renderTLTable();
    }
};

window.fixInterview = function(phone, name) {
    if (!phone) return alert("Contact info not available!");
    const date = prompt(`Set Interview Date & Time for ${name}:`, "Tomorrow 11:30 AM");
    
    if (date) {
        let cleanPhone = phone.toString().replace(/\D/g, '');
        if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;

        const msg = `Hello ${name}, Greetings from our Recruitment Team.\n\nYour Interview has been fixed.\n📅 Schedule: ${date}\n📍 Mode: Online/Office\n\nPlease be on time. Regards!`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
};