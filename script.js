document.addEventListener('DOMContentLoaded', function() {
    console.log("ATS System Master Script Active...");

    // 1. Initialize Tables
    if (document.getElementById('submissionsTableBody')) renderTLTable();
    if (document.getElementById('jobTableBody')) renderJobsInRecruiterTable();

    // 2. BDE Logic (Create Job)
    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.onsubmit = function(e) {
            e.preventDefault();
            const newJob = {
                id: Date.now(),
                role: document.getElementById('role').value,
                skills: document.getElementById('skills').value,
                exp: document.getElementById('experience').value,
                location: document.getElementById('location').value,
                openings: document.getElementById('openings').value
            };
            let jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
            jobs.push(newJob);
            localStorage.setItem('allJobs', JSON.stringify(jobs));
            alert("Job Created!");
            this.reset();
        };
    }

    // 3. Recruiter Logic (Add Candidate)
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
            alert("Sent to TL!");
            this.reset();
            if (document.getElementById('submissionsTableBody')) renderTLTable();
        };
    }
});

// 4. Render Functions
function renderJobsInRecruiterTable() {
    const tableBody = document.getElementById('jobTableBody');
    let jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
    tableBody.innerHTML = jobs.length ? '' : '<tr><td colspan="4">No active jobs.</td></tr>';
    jobs.forEach(job => {
        tableBody.insertAdjacentHTML('beforeend', `
            <tr>
                <td>${job.role}</td>
                <td>${job.openings}</td>
                <td>${job.location}</td>
                <td><button onclick="applyForJob('${job.role}')">Source</button></td>
            </tr>`);
    });
}

function renderTLTable() {
    const tableBody = document.getElementById('submissionsTableBody');
    let submissions = JSON.parse(localStorage.getItem('tlData')) || [];
    tableBody.innerHTML = submissions.length ? '' : '<tr><td colspan="4">No pending candidates.</td></tr>';
    
    submissions.forEach(item => {
        tableBody.insertAdjacentHTML('beforeend', `
            <tr>
                <td>${item.name}</td>
                <td>${item.phone}</td>
                <td>${item.status}</td>
                <td>
                    <button onclick="fixInterview('${item.phone}', '${item.name}')" style="background:green; color:white;">✅ Interview</button>
                    <button onclick="deleteEntry(${item.id})" style="background:red; color:white;">❌ Remove</button>
                </td>
            </tr>`);
    });
}

// 5. Global Actions
window.applyForJob = (role) => { alert("Sourcing: " + role); document.getElementById('candidateName')?.focus(); };

window.deleteEntry = (id) => {
    let sub = JSON.parse(localStorage.getItem('tlData')).filter(e => e.id !== id);
    localStorage.setItem('tlData', JSON.stringify(sub));
    renderTLTable();
};

window.fixInterview = function(phone, name) {
    if (!phone || phone === "undefined") return alert("Phone number missing!");

    const date = prompt(`Interview date for ${name}:`, "Tomorrow 11 AM");
    if (date) {
        let cleanPhone = phone.toString().replace(/\D/g, '');
        if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;

        const msg = `Hello ${name}, Your Interview is Fixed.\n📅 Date: ${date}\nRegards: MSME Agency`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
};
