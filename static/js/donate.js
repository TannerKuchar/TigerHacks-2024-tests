const pantryWrapper = document.getElementById("high-demand");
function clearList() {
    while (pantryWrapper.firstChild) {
        pantryWrapper.removeChild(pantryWrapper.firstChild);
    }
}

async function loadPage() {
    clearList();
    const zip_code = document.getElementById('zip-code').value;

    const response = await fetch('/zhn-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'function': 'get_high_demand_pantries',
            'date': '2025-10-01'
        })
    })

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const pantries = await response.json();
    /* Add pantries to webpage */
    for (var i = 0; i < 5; i++) {
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
            <a href = "https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pantries[i]['location'])}" style = "display: flex; width: max-content; grid-column-start: 2; justify-content: right;">
                <p>Donate</p>
                <img class = "arrow" src = "../static/images/arrow.svg">
            </a>
            </div>
        </div>
        `;
        pantryWrapper.appendChild(newPantry);
    }
}

async function zipCode() {
    clearList();
    const zip_code = document.getElementById('zip-code').value;

    const response = await fetch('/zhn-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'function': 'get_high_demand_pantries',
            'zip_code': zip_code,
            'date': '2025-10-01'
        })
    })

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const pantries = await response.json();
    /* Add pantries to webpage */
    for (var i = 0; i < 5; i++) {
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


/* Add element for each high demand pantry */
loadPage();
document.getElementById('search').addEventListener('click', zipCode);