// Function to send data to Google Sheets
async function submitData(payload) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxi-DUIbwRvX2HJ3s6dUn57sU3-bsZChjFxfGoiHHKMtrcev5j9nKtL_fFVXZTLzv0/exec';

    try {
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        alert("Success! Data updated in Google Sheet.");
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Error!", error.message);
        alert("Failed to send data. Check console.");
    }
}

// Wait for DOM to load fully
document.addEventListener('DOMContentLoaded', function() {
    const jobForm = document.getElementById('jobForm');
    const candidateForm = document.getElementById('candidateForm');

    // Check if Job Form exists on this page
    if (jobForm) {
        jobForm.onsubmit = function(e) {
            e.preventDefault();
            const payload = {
                action: "addJob",
                role: document.getElementById('role').value,
                openings: document.getElementById('openings').value,
                location: document.getElementById('location').value
            };
            submitData(payload);
        };
    }

    // Check if Candidate Form exists on this page
    if (candidateForm) {
        candidateForm.onsubmit = function(e) {
            e.preventDefault();
            const payload = {
                action: "addCandidate",
                name: document.getElementById('candidateName')?.value || "N/A"
            };
            submitData(payload);
        };
    }
});