let currentSelectedDestination = "";
let calculatedMinimumRequiredBudget = 0;
let selectedTransitMode = "plane";

const mockPlacesDatabase = ["America", "Delhi", "Mumbai", "Kochi", "London", "Paris", "Tokyo"];

function handleSimulatedInput(query) {
    const box = document.getElementById('suggestionsBox');
    if (!query.trim()) { box.style.display = 'none'; return; }
    
    const filtered = mockPlacesDatabase.filter(place => place.toLowerCase().includes(query.toLowerCase()));
    if (filtered.length > 0) {
        box.innerHTML = '';
        filtered.forEach(place => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `📍 <strong>${place}</strong>`;
            div.onclick = function() {
                document.getElementById('destination').value = place;
                box.style.display = 'none';
                processDestinationChoice(place);
            };
            box.appendChild(div);
        });
        box.style.display = 'block';
    } else { box.style.display = 'none'; }
}

document.addEventListener('click', function(e) {
    if (e.target.id !== 'destination') {
        document.getElementById('suggestionsBox').style.display = 'none';
    }
});

// STEP 1 CASCADE TRIGGER
function processDestinationChoice(destinationText) {
    currentSelectedDestination = destinationText.trim();
    const transportContainer = document.getElementById('transportFieldContainer');
    
    document.getElementById('transportMethod').selectedIndex = 0;
    document.getElementById('daysFieldContainer').style.display = "none";
    document.getElementById('budgetFieldContainer').style.display = "none";
    document.getElementById('generateBtn').style.display = "none";
    document.getElementById('itinerarySection').style.display = "none";

    const destLower = currentSelectedDestination.toLowerCase();
    const isDomestic = destLower.includes('delhi') || destLower.includes('mumbai') || destLower.includes('kochi') || destLower.includes('india');

    if (userCountry === "India" && isDomestic) {
        transportContainer.style.display = "block";
    } else {
        selectedTransitMode = "plane";
        revealDaysFormBar();
    }
    searchTheLiveWeb(destinationText); // Call AI-Scraper function hook
}

// STEP 2 CASCADE TRIGGER
function handleTransportChange() {
    selectedTransitMode = document.getElementById('transportMethod').value;
    revealDaysFormBar();
}

function revealDaysFormBar() {
    const daysContainer = document.getElementById('daysFieldContainer');
    const daysHint = document.getElementById('daysOverlayHint');
    const destLower = currentSelectedDestination.toLowerCase();

    let daysMsg = "💡 Enter your preferred trip duration below.";
    if (destLower.includes('america') || destLower.includes('usa')) {
        daysMsg = `✈️ Minimum recommended stay: 10 Days due to long-haul routes.`;
    } else if (destLower.includes('london') || destLower.includes('paris')) {
        daysMsg = `🇪🇺 Recommended European route tracking length: 7 Days minimum.`;
    } else {
        daysMsg = `🚗 Local regional getaway baseline: 3 Days recommended.`;
    }

    daysHint.innerText = daysMsg;
    daysContainer.style.display = "block";
}

// STEP 3 CASCADE TRIGGER (BUDGET BOX APPEARS LAST)
function handleDaysInput(daysValue) {
    const budgetContainer = document.getElementById('budgetFieldContainer');
    const budgetHint = document.getElementById('budgetOverlayHint');
    const generateBtn = document.getElementById('generateBtn');
    const days = parseInt(daysValue);
    const destLower = currentSelectedDestination.toLowerCase();

    if (isNaN(days) || days <= 0) {
        budgetContainer.style.display = "none";
        generateBtn.style.display = "none";
        return;
    }

    let flightCost = 0; 
    let minimalDailyStayCost = 0;

    if (destLower.includes('america') || destLower.includes('usa')) {
        flightCost = 55000; minimalDailyStayCost = 3500;
    } else if (destLower.includes('london') || destLower.includes('paris')) {
        flightCost = 45000; minimalDailyStayCost = 4000;
    } else {
        minimalDailyStayCost = 1500;
        if (selectedTransitMode === "railways") flightCost = 1200;
        else if (selectedTransitMode === "bus") flightCost = 1800;
        else if (selectedTransitMode === "car") flightCost = 4500;
        else flightCost = 9000;
    }

    calculatedMinimumRequiredBudget = flightCost + (minimalDailyStayCost * days);
    budgetHint.innerHTML = `⚠️ Absolute minimal real-life cost from your location for ${days} days is **₹${calculatedMinimumRequiredBudget.toLocaleString('en-IN')}**`;
    
    budgetContainer.style.display = "block";
    generateBtn.style.display = "block";
}
