const AUTH0_DOMAIN = "dev-0ro7hht6cv1fjtwz.us.auth0.com";
const AUTH0_CLIENT_ID = "TnM1wIOmiPhunCmZ1pkUc4Z8ufmMxSHr";

let auth0Client;

// Initialize Auth0
async function initAuth() {
    auth0Client = await createAuth0Client({
        domain: AUTH0_DOMAIN,
        client_id: AUTH0_CLIENT_ID,
        cacheLocation: "localstorage",
    });

    // Check if user is logged in
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
        const user = await auth0Client.getUser();
        updateUI(user);
    } else {
        resetUI();
    }
}

// Log In
document.getElementById("login-btn").addEventListener("click", async () => {
    await auth0Client.loginWithRedirect({
        redirect_uri: window.location.href,
    });
});

// Sign Up
document.getElementById("signup-btn").addEventListener("click", async () => {
    await auth0Client.loginWithRedirect({
        redirect_uri: window.location.href,
        screen_hint: "signup",
    });
});

// Log Out
document.getElementById("logout-btn").addEventListener("click", async () => {
    await auth0Client.logout({
        returnTo: window.location.href,
    });
    resetUI();
});

// Update UI After Login
async function updateUI(user) {
    document.querySelector(".auth-buttons").style.display = "none";
    document.getElementById("user-info").classList.remove("hidden");

    // Get User's IP and Time Zone, then set greeting
    fetch("https://api.ipify.org?format=json")
        .then((response) => response.json())
        .then((data) => {
            // Use the IP to get location and time zone
            fetch(`https://ipgeolocation.io/timezone?apiKey=YOUR_API_KEY&ip=${data.ip}`)
                .then((response) => response.json())
                .then((locationData) => {
                    const userTimeZone = locationData.timezone;
                    const currentTime = new Date().toLocaleString("en-US", { timeZone: userTimeZone });
                    const hour = new Date(currentTime).getHours();

                    let greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
                    document.getElementById("greeting-text").textContent = `${greeting}, ${user.name}`;
                });
        });
}

// Reset UI After Logout
function resetUI() {
    document.querySelector(".auth-buttons").style.display = "block";
    document.getElementById("user-info").classList.add("hidden");
}

// Start Authentication
window.onload = initAuth;
