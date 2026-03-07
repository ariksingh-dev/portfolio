document.addEventListener("DOMContentLoaded", () => {
    // 1. Mobile Hamburger Menu
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector("nav ul");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close menu when a link is clicked
        document.querySelectorAll("nav ul li a").forEach(n => 
            n.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            })
        );
    }

    // 2. Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll(".project-card, .about-content, .contact-section, .content-section, figure");
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        el.classList.add("fade-hidden");
        observer.observe(el);
    });

    // 3. Back to Top Button
    const backToTopBtn = document.createElement("button");
    backToTopBtn.innerHTML = "↑";
    backToTopBtn.setAttribute("id", "back-to-top");
    backToTopBtn.setAttribute("aria-label", "Back to top");
    document.body.appendChild(backToTopBtn);

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});
