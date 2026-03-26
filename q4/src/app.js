// CYSE 411 Exam Application
// WARNING: This code contains security vulnerabilities.
// Students must repair the implementation.

const loadBtn = document.getElementById("loadBtn");
const saveBtn = document.getElementById("saveSession");
const loadSessionBtn = document.getElementById("loadSession");

loadBtn.addEventListener("click", loadProfile);
saveBtn.addEventListener("click", saveSession);
loadSessionBtn.addEventListener("click", loadSession);

let currentProfile = null;


/* -------------------------
   Load Profile
-------------------------- */

function loadProfile() {
    const text = document.getElementById("profileInput").value;

    let Data_parsed;

    try {
        Data_parsed = JSON.parse(text);
    } catch (error) {
        console.error("Invalid JSON input:", error);
        alert("Profile data is incorrect. Check the format!");
        return; 
    }

    if (
        typeof Data_parsed !== "object" || Data_parsed === null || Array.isArray(Data_parsed)
    ) {
        alert("Invalid profile format! Check and try again.");
        return;
    }

    if (
        typeof Data_parsed.username !== "string" || typeof Data_parsed.notifications !== "boolean"
    ) {
        alert("Missing or invalid required fields. Check and try again.");
        return;
    }

    const profile = {
        username: Data_parsed.username,
        notifications: Data_parsed.notifications,
    };

    currentProfile = profile;

    renderProfile(profile);
}


/* -------------------------
   Render Profile
-------------------------- */

function renderProfile(profile) {
    const usernameEl = document.getElementById("username");
    usernameEl.textContent = profile.username;

    const new_list = document.getElementById("notifications");
    new_list.textContent = "";

    if (!Array.isArray(profile.notifications)) {
        return;
    }

    for (let n of profile.notifications) {
        const li = document.createElement("li");
        li.textContent = String(n);
        new_list.appendChild(li);
    }
}


/* -------------------------
   Browser Storage
-------------------------- */

function saveSession() {
    if (!currentProfile || typeof currentProfile !== "object") {
        alert("No valid profile to save. Try again after loading a profile.");
        return;
    }

    const safeProfile = {
        username: currentProfile.username,
        notifications: currentProfile.notifications
    };

    try {
        localStorage.setItem("profile", JSON.stringify(safeProfile));
        alert("Session saved, congrats :)");
    } catch (error) {
        console.error("Failed to save session:", error);
        alert("Could not save session!");
    }
}


function loadSession() {
    const stored = localStorage.getItem("profile");

    if (!stored) return;

    let parsed_var;

    try {
        parsed_var = JSON.parse(stored);
    } catch (error) {
        console.error("Corrupted session data: Clearing profile.");
        localStorage.removeItem("profile");
        return;
    }

    if (
        typeof parsed_var !== "object" || parsed_var === null || Array.isArray(parsed_var)
    ) {
        localStorage.removeItem("profile");
        return;
    }

    if (
        typeof parsed_var.username !== "string" || !Array.isArray(parsed_var.notifications)
    ) {
        localStorage.removeItem("profile");
        return;
    }

    const validNotifications = parsed_var.notifications.every(
        (n) => typeof n === "string"
    );

    if (!validNotifications) {
        localStorage.removeItem("profile");
        return;
    }

    const profile = {
        username: parsed_var.username,
        notifications: parsed_var.notifications
    };

    currentProfile = profile;
    renderProfile(profile);
}