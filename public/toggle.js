function updateToggle(toggleType, value) {
    console.log(`${toggleType} Toggle changed: ${value ? "On" : "Off"}`);

    fetch("/update-toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleType, value }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(`${toggleType} Toggle updated:`, data);
        location.reload(); // Reload the page to reflect the change
    })
    .catch((error) => console.error("Error updating toggle:", error));
}

// Function to attach event listeners dynamically
function attachToggleEventListeners() {
    console.log("Attaching toggle event listeners...");

    const evToggle = document.getElementById("ev-toggle");
    const womenToggle = document.getElementById("weman-toggle");
    const phoneEvToggle = document.getElementById("phone-ev-toggle-input");
    const phoneWomanToggle = document.getElementById("phone-weman-toggle-input");

    if (evToggle) {
        evToggle.addEventListener("change", function () {
            console.log("EV toggle changed:", this.checked);
            updateToggle("ev", this.checked);
        });
    }

    if (womenToggle) {
        womenToggle.addEventListener("change", function () {
            console.log("Women toggle changed:", this.checked);
            updateToggle("women", this.checked);
        });
    }

    if (phoneEvToggle) {
        phoneEvToggle.addEventListener("change", function () {
            console.log("Phone EV toggle changed:", this.checked);
            updateToggle("ev", this.checked);
        });
    }

    if (phoneWomanToggle) {
        phoneWomanToggle.addEventListener("change", function () {
            console.log("Phone Women toggle changed:", this.checked);
            updateToggle("women", this.checked);
        });
    }
}

// Ensure event listeners are attached every time the script loads
attachToggleEventListeners();
