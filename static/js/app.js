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

async function getHighDemandPantries() {
    fetch('/zhn-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'function': 'get_high_demand_pantries',
            'date': '2025-10-03'
        })
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data);
    })
    .catch(error => console.error('Error:', error));
}

getHighDemandPantries();