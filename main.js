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


// Dark mode toggle with icon change and transition
document.getElementById("toggle-dark-mode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = document.getElementById("toggle-icon");
    icon.textContent = document.body.classList.contains("dark-mode") ?"🌞" : "🌙";

    // Toggle header classes based on dark mode
    const header = document.querySelector("header");
    if (document.body.classList.contains("dark-mode")) {
        header.classList.remove("navbar-light", "bg-light");
        header.classList.add("navbar-dark", "bg-dark");
    } else {
        header.classList.remove("navbar-dark", "bg-dark");
        header.classList.add("navbar-light", "bg-light");
    }
});
