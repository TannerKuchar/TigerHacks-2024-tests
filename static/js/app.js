async function loadHighDemand() {
    fetch('/zhn-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'function': 'get_nearby_pantries',
            'zip_code': '65201'
        })
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}

async function predictDonation() {
    fetch('/zhn-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'function': 'predict_donations',
            'location': '5101 E 24th St, Kansas City, MO 64127',
            'date': '2025-10-03'
        })
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}

async function predictDistributions() {
    fetch('/zhn-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'function': 'predict_distributions',
            'location': '5101 E 24th St, Kansas City, MO 64127',
            'date': '2025-10-03'
        })
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}

async function getPantryDemand() {
    fetch('/zhn-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'function': 'get_pantry_demand',
            'location': '5101 E 24th St, Kansas City, MO 64127',
            'date': '2025-10-03'
        })
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}

async function getHighDemandPantries(dt, zip_code) {
    if (zip_code) {
        const response = await fetch('/zhn-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'function': 'get_high_demand_pantries',
                'date': dt,
                'zip_code': zip_code
            })
        })

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } else {
        const response = await fetch('/zhn-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'function': 'get_high_demand_pantries',
                'date': dt,
            })
        })
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    }
}

async function loadHomePageDemand() {

    /* Get high demand pantries */
    const pantries = await getHighDemandPantries("2025-10-02");

    /* Add element for each high demand pantry */
    const pantryWrapper = document.getElementById("high-demand");
    for (var i = 0; i < 3; i++) {
        console.log("found a pantry");
        var newPantry = document.createElement("div")
        newPantry.className = 'pantry';
        newPantry.style = 'background-color: #1D1F1D; border-radius: 24px; padding: 20px; max-width: 600px; margin-left: auto; margin-right: auto; margin-top: 20px;'
        newPantry.innerHTML = `
        <div style = "display: flex; flex-wrap: wrap;">
            <img src = "../static/images/warning.svg" style = "width: 20px;">
            <p style = "margin-left: 10px; margin-top: 5px; color: #FF5E5E; width: max-content;" >${pantries[i]['demand']} meals needed by tomorrow</p>
        </div>
        <div style = "display: grid; margin-top: 10px;">
            <p class = "address" style = "width: max-content;">${pantries[i]['location']}</p>
            <div style = "grid-column-start: 2; display: grid; justify-content: right;">
            <a href = "" style = "display: flex; width: max-content; grid-column-start: 2; justify-content: right;">
                <p>Donate</p>
                <img class = "arrow" src = "../static/images/arrow.svg">
            </a>
            </div>
        </div>
        `;
        pantryWrapper.appendChild(newPantry);
    }
}

loadHomePageDemand();
