 document.getElementById('candidateForm').onsubmit = function(e) {
            e.preventDefault();
            alert("Candidate profile updated and shared with Team Lead. [Source: PDF Step 8]");
            location.href='index.html';
        };

          document.getElementById('jobForm').onsubmit = function(e) {
            e.preventDefault();
            alert("Success! Job created and assigned to Department. Dashboard updated automatically.");
            location.href='index.html';
        };

        // Example for BDE Form Submission
async function submitData() {
    const payload = {
        action: "addJob",
        role: document.getElementById('role').value,
        openings: document.getElementById('openings').value,
        location: document.getElementById('location').value
    };

    const response = await fetch('https://script.google.com/macros/s/AKfycbxi-DUIbwRvX2HJ3s6dUn57sU3-bsZChjFxfGoiHHKMtrcev5j9nKtL_fFVXZTLzv0/exec', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    if(result.status === 'success') alert("Data Saved to Google Sheet!");
}