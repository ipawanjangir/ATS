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