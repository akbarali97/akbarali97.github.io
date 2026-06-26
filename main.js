// Define the offset in pixels (e.g., 60 for a 60px header)
const offset = 60;

// Smooth scrolling with offset for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        // Calculate the position with the offset
        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;

        // Scroll to the position with offset
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    });
});


// Dark mode with persistence across pages (via localStorage)
function applyTheme(dark) {
    document.body.classList.toggle("dark-mode", dark);

    const icon = document.getElementById("toggle-icon");
    if (icon) icon.textContent = dark ? "🌞" : "🌙";

    const header = document.querySelector("header");
    if (header) {
        header.classList.toggle("navbar-dark", dark);
        header.classList.toggle("bg-dark", dark);
        header.classList.toggle("navbar-light", !dark);
        header.classList.toggle("bg-light", !dark);
    }
}

// Apply the saved preference on load
applyTheme(localStorage.getItem("theme") === "dark");

const darkToggle = document.getElementById("toggle-dark-mode");
if (darkToggle) {
    darkToggle.addEventListener("click", () => {
        const dark = !document.body.classList.contains("dark-mode");
        applyTheme(dark);
        localStorage.setItem("theme", dark ? "dark" : "light");
    });
}
