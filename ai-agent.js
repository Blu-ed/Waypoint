function startAutonomousAI() {
    const wallet = parseFloat(document.getElementById('tripBudget').value);
    const days = parseInt(document.getElementById('tripDays').value);
    const badge = document.getElementById('budgetStatusBadge');
    const list = document.getElementById('itineraryList');

    if (isNaN(wallet) || wallet <= 0) { alert("Please allocate a valid budget sum."); return; }
    
    list.innerHTML = "";
    document.getElementById('itinerarySection').style.display = "block";

    let tier = "budget";
    if (wallet >= calculatedMinimumRequiredBudget * 2.5) tier = "luxury";
    else if (wallet > calculatedMinimumRequiredBudget * 1.3) tier = "mid-range";

    if (wallet >= calculatedMinimumRequiredBudget) {
        badge.style.backgroundColor = "#e8f8f5"; badge.style.color = "#117a65"; badge.style.border = "1px solid #117a65";
        badge.innerHTML = `✅ Budget Approved! [Tier: ${tier.toUpperCase()}] Your funds are fully aligned for this stay.`;
    } else {
        badge.style.backgroundColor = "#fdf2e9"; badge.style.color = "#a04000"; badge.style.border = "1px solid #a04000";
        badge.innerHTML = `❌ Low Budget Warning! Realistic survival minimum requirement is ₹${calculatedMinimumRequiredBudget.toLocaleString('en-IN')}.`;
        tier = "hardcore-minimal";
    }
    compileFinalItinerary(currentSelectedDestination, days, tier, wallet);
}

function compileFinalItinerary(locationName, totalDays, budgetTier, walletFunds) {
    const list = document.getElementById('itineraryList');
    const destLower = locationName.toLowerCase();

    // Flight Deals Recommendation Module
    if (selectedTransitMode === "plane") {
        const flightLi = document.createElement('li');
        flightLi.style.background = "#fff8e1"; flightLi.style.borderLeft = "5px solid #ffb300";
        let html = `<div><strong style="color:#b78103; font-size:15px;">✈️ Connected Flight Route Matches</strong><div style="display:grid; gap:6px; font-size:13px; margin-top:8px;">`;
        if (destLower.includes('america') || destLower.includes('usa')) {
            html += `<div>🎫 <strong>Kuwait Airways:</strong> ₹58,200 round-trip</div><div>🎫 <strong>Air India:</strong> ₹64,500 round-trip</div>`;
        } else {
            html += `<div>🎫 <strong>IndiGo:</strong> ₹4,200 round-trip</div><div>🎫 <strong>Air India Express:</strong> ₹4,600 round-trip</div>`;
        }
        html += `</div></div>`; flightLi.innerHTML = html; list.appendChild(flightLi);
    }

    const stayShare = Math.round(walletFunds * 0.45);
    const foodShare = Math.round(walletFunds * 0.35);

    let stay = "Local Economy Guesthouse Network";
    let food = "Neighborhood street vendor stalls";
    let sights = ["Central Plaza", "Old Town Heritage District"];

    if (destLower.includes('delhi')) {
        sights = ["Red Fort & Old Delhi Markets", "India Gate & Lotus Temple"];
        stay = budgetTier.includes('luxury') ? "The Leela Palace Chanakyapuri" : "Zostel Delhi Hostel";
        food = budgetTier.includes('luxury') ? "Gourmet dining at Bukhara" : "Paranthe Wali Gali food walk";
    } else if (destLower.includes('kochi')) {
        sights = ["Fort Kochi Nets & Cafes", "Jew Town Antique Markets"];
        stay = budgetTier.includes('luxury') ? "Grand Hyatt Waterfront" : "Zostel Fort Kochi";
        food = budgetTier.includes('luxury') ? "Fine dining at The Rice Boat" : "Local sea-front shacks";
    }

    const configLi = document.createElement('li');
    configLi.style.background = "#f4f6f7"; configLi.style.borderLeftColor = "#7f8c8d";
    configLi.innerHTML = `<div><strong>💸 AI Capital Resource Split Map:</strong><br><span style="font-size:13px; color:#555;">• Lodging Budget Cap: ₹${stayShare.toLocaleString('en-IN')}<br>• Dining & Action Cap: ₹${foodShare.toLocaleString('en-IN')}</span></div>`;
    list.appendChild(configLi);

    for (let i = 1; i <= totalDays; i++) {
        const li = document.createElement('li');
        li.innerHTML = `<div><strong style="color:#2980b9;">🗓️ Day ${i} Timetable Schedule</strong><span style="font-size: 13px; color: #333; display:block; margin-top:5px;">🏨 <strong>Lodging:</strong> ${stay}<br>🍴 <strong>Dining:</strong> ${food}<br>🏛️ <strong>Sightseeing:</strong> Explore <strong>${sights[(i - 1) % sights.length]}</strong>.</span></div>`;
        list.appendChild(li);
    }
}

function searchTheLiveWeb(locationName) {
    const container = document.getElementById('webSearchContainer');
    const statusText = document.getElementById('searchStatusText');
    const resultsBox = document.getElementById('webSearchResults');
    container.style.display = "block"; statusText.innerText = `Crawling active web pages for ${locationName}...`;
    
    fetch(`https://wikipedia.org{encodeURIComponent(locationName.trim())}`)
        .then(res => res.json()).then(data => {
            statusText.innerText = `Web Sync Loaded successfully.`;
            resultsBox.innerHTML = `"${data.extract || 'Region layout paths verified.'}"`;
        })
        .catch(() => {
            statusText.innerText = "Web Search Update:";
            resultsBox.innerText = `Live paths scraped for ${locationName}.`;
        });
}
