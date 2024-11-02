const pantryWrapper = document.getElementById("pantry-wrapper");
function clearPantries() {
    while (pantryWrapper.firstChild) {
        pantryWrapper.removeChild(pantryWrapper.firstChild);
    }
}

async function getNearbyPantries() {
    clearPantries();
    const zip_code = document.getElementById('zip-code').value;

    const response = await fetch('/zhn-endpoint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'function': 'get_nearby_pantries',
            'zip_code': zip_code
        })
    })

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    /* Add pantries to webpage */
    var pantryWrapper = document.getElementById("pantry-wrapper");
    for (var i = 0; i < 10; i++) {
        const miles = data[i]['distance'].toFixed(1);
        var pantry = document.createElement("div");
        pantry.style = "margin-top: 20px;"
        pantry.innerHTML = `
        <p>${data[i]['address']}</p>
        <div style = "display: grid;">
            <p style = "margin-top: 5px;">${miles} miles away</p>
            <a href = "https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data[i]['address'])}" style = "display: flex; grid-column-start: 2; justify-content: right;">
                <p>See on Google Maps</p>
                <img class = "arrow" src = "../static/images/arrow.svg">
            </a>
        </div>
        `;
        pantryWrapper.appendChild(pantry);
    }
    
}

document.getElementById('search').addEventListener('click', getNearbyPantries);