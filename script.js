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

    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
        const user = await auth0Client.getUser();
        updateUI(user);
    } else {
        updateUI(null);
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
    const authButtons = document.querySelector(".auth-buttons");
    const userInfo = document.getElementById("user-info");
    const greetingText = document.getElementById("greeting-text");

    if (user) {
        authButtons.style.display = "none"; // Hide login/signup
        userInfo.classList.remove("hidden"); // Show user info

        // Get Local Time for Greeting
        const hour = new Date().getHours();
        const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
        
        greetingText.textContent = `${greeting}, ${user.name}`;
    } else {
        authButtons.style.display = "block"; // Show login/signup
        userInfo.classList.add("hidden"); // Hide user info
    }
}

// Reset UI After Logout
function resetUI() {
    document.querySelector(".auth-buttons").style.display = "block";
    document.getElementById("user-info").classList.add("hidden");
}

// Start Authentication
window.onload = initAuth;

