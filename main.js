// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute("href")).scrollIntoView({
            behavior: "smooth"
        });
    });
});

// Dark mode toggle with icon change and transition
document.getElementById("toggle-dark-mode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = document.getElementById("toggle-icon");
    icon.textContent = document.body.classList.contains("dark-mode") ? "🌙" : "🌞";
});

