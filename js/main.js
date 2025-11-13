// Simple menu toggle for mobile
document.querySelector(".menu-btn").addEventListener("click", () => {
     document.querySelector(".nav-menu").classList.toggle("show");
   });

// Scroll reveal animations
ScrollReveal().reveal('.showcase');
ScrollReveal().reveal('.portfolio-screenshot', { delay: 500 });
ScrollReveal().reveal('.social', { delay: 500 });