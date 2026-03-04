document.addEventListener('DOMContentLoaded', function() {
    console.log("ATS System Restored...");

    // 1. Load Tables
    if (document.getElementById('submissionsTableBody')) renderTLTable();
    if (document.getElementById('jobTableBody')) renderJobsInRecruiterTable();

    // 2. BDE Logic
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
            alert("Job Position Created!");
            this.reset();
        };
    }
});

function renderJobsInRecruiterTable() {
    const tableBody = document.getElementById('jobTableBody');
    let jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
    if (!tableBody) return;

    tableBody.innerHTML = jobs.map(job => `
        <tr>
            <td>${job.role}</td>
            <td>${job.openings}</td>
            <td>${job.location}</td>
            <td><button onclick="applyForJob('${job.role}')">Source</button></td>
        </tr>
    `).join('') || '<tr><td colspan="4">No jobs available.</td></tr>';
}

function renderTLTable() {
    const tableBody = document.getElementById('submissionsTableBody');
    let submissions = JSON.parse(localStorage.getItem('tlData')) || [];
    if (!tableBody) return;
    tableBody.innerHTML = submissions.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.phone}</td>
            <td>${item.status}</td>
            <td>
                <button onclick="fixInterview('${item.phone}', '${item.name}')" style="background:green; color:white;">Interview</button>
                <button onclick="deleteEntry(${item.id})" style="background:red; color:white;">Delete</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="4">No submissions.</td></tr>';
}

window.fixInterview = function(phone, name) {
    const date = prompt(`Interview date for ${name}:`, "Tomorrow 11 AM");
    if (date) {
        let cleanPhone = phone.toString().replace(/\D/g, '');
        if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;
        const msg = `Hello ${name}, Your Interview is Fixed for ${date}. Regards: MSME Agency`;
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
};

window.deleteEntry = (id) => {
    let sub = JSON.parse(localStorage.getItem('tlData')).filter(e => e.id !== id);
    localStorage.setItem('tlData', JSON.stringify(sub));
    renderTLTable();
};

window.applyForJob = (role) => {
    // Alert dikhayega
    alert("Ab aap " + role + " ke liye candidates add kar sakte hain.");
    
    // Candidate Form tak auto-scroll karega
    const form = document.getElementById('candidateForm');
    if(form) {
        form.scrollIntoView({ behavior: 'smooth' });
        // Name field par focus karega taaki recruiter typing shuru kar sake
        document.getElementById('candidateName').focus();
    }
};