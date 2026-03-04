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

// 2. BDE Logic Update
const jobForm = document.getElementById('jobForm');
if (jobForm) {
    jobForm.onsubmit = function(e) {
        e.preventDefault();
        
        const role = document.getElementById('role').value;
        const location = document.getElementById('location').value;
        const openings = document.getElementById('openings').value;

        // --- Step A: TL Table ke liye data taiyar karna (Interview/Reject buttons ke liye) ---
        const tlEntry = {
            id: Date.now(),
            name: "JOB: " + role, // TL Table mein Name ki jagah Role dikhega
            phone: location,      // Phone ki jagah Location dikhegi
            status: 'Pending Review'
        };
        let submissions = JSON.parse(localStorage.getItem('tlData')) || [];
        submissions.push(tlEntry);
        localStorage.setItem('tlData', JSON.stringify(submissions));

        // --- Step B: Recruiter Table ke liye data taiyar karna ---
        const newJob = {
            id: Date.now(),
            role: role,
            location: location,
            openings: openings
        };
        let jobs = JSON.parse(localStorage.getItem('allJobs')) || [];
        jobs.push(newJob);
        localStorage.setItem('allJobs', JSON.stringify(jobs));

        alert("Requirement Sent! Ab ye TL aur Recruiter dono ko dikhega.");
        this.reset();
        
        // Agar aap chahte hain ki form bharte hi Dashboard par chale jayein
        // window.location.href = 'index.html'; 
    };
}

// Recruiter Form Submission Logic
const candidateForm = document.getElementById('candidateForm');
if (candidateForm) {
    candidateForm.onsubmit = function(e) {
        e.preventDefault();

        // Data capture karna
        const name = document.getElementById('candidateName').value;
        const phone = document.getElementById('candidatePhone').value;
        const status = document.getElementById('status').value;

        // TL ke liye naya object banana
        const newSubmission = {
            id: Date.now(),
            name: name,
            phone: phone,
            status: status
        };

        // tlData (Local Storage) mein save karna
        let submissions = JSON.parse(localStorage.getItem('tlData')) || [];
        submissions.push(newSubmission);
        localStorage.setItem('tlData', JSON.stringify(submissions));

        alert("Candidate " + name + " sent to TL successfully!");
        this.reset(); // Form clear karne ke liye
        
        // Agar TL table refresh karni ho (agar usi page par hai)
        if (typeof renderTLTable === "function") renderTLTable();
    };
}