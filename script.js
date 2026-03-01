document.addEventListener('DOMContentLoaded', function() {
    // 1. Job Form Check (BDE Page ke liye)
    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.onsubmit = async function(e) {
            e.preventDefault();
            const payload = {
                role: document.getElementById('role').value,
                openings: document.getElementById('openings').value,
                location: document.getElementById('location').value
            };
            await submitData(payload);
        };
    }

    // 2. Candidate Form Check (TL Page ke liye)
    const candidateForm = document.getElementById('candidateForm');
    if (candidateForm) {
        candidateForm.onsubmit = function(e) {
            e.preventDefault();
            alert("Candidate Profile Updated!");
        };
    }
});

// Common Function to send data
async function submitData(payload) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxi-DUIbwRvX2HJ3s6dUn57sU3-bsZChjFxfGoiHHKMtrcev5j9nKtL_fFVXZTLzv0/exec'; // Apna naya URL yahan dalo
    try {
        await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify(payload)
        });
        alert("Data Saved Successfully!");
        window.location.href = 'index.html';
    } catch (err) {
        console.error("Error:", err);
    }
}