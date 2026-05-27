// GLOBAL CONFIG PARAMETERS 
let userCountry = "Unknown";

function handleRegister() {
    const u = document.getElementById('username').value.trim();
    const e = document.getElementById('email').value.trim();
    const p = document.getElementById('password').value.trim();

    if (!u || !e || !p) { 
        alert("Please complete all signup fields to register account!"); 
        return; 
    }
    
    // Explicit permission access prompt
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            () => { userCountry = "India"; proceedToDashboard(u); },
            () => { userCountry = "India"; proceedToDashboard(u); }
        );
    } else {
        userCountry = "India";
        proceedToDashboard(u);
    }
}

function proceedToDashboard(username) {
    document.getElementById('profileName').innerText = username;
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appScreen').style.display = 'block';
    
    setTimeout(() => { 
        document.getElementById('plannerInputsSection').scrollIntoView({ behavior: 'smooth' }); 
    }, 800);
}

function handleLogout() {
    location.reload(); // Hard system flush cleanly wipes out inputs cache data safely
}
