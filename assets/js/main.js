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
        threshold: 0,
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

    // 4. Light/Dark Mode Toggle
    const themeToggle = document.getElementById("theme-toggle");

    // Check for saved user preference
    const savedTheme = localStorage.getItem("portfolio-theme-v2");
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        if (themeToggle) themeToggle.setAttribute("title", "Switch to dark mode");
    } else {
        if (themeToggle) themeToggle.setAttribute("title", "Switch to light mode");
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");

            // Save preference & toggle title
            if (document.body.classList.contains("light-theme")) {
                localStorage.setItem("portfolio-theme-v2", "light");
                themeToggle.setAttribute("title", "Switch to dark mode");
            } else {
                localStorage.setItem("portfolio-theme-v2", "dark");
                themeToggle.setAttribute("title", "Switch to light mode");
            }
        });
    }

    // 5. Dynamic Related Projects
    const projectsList = [
        { url: "max_particle_velocity.html", title: "Maximum Particle Velocity in Solids", category: "Independent Study", img: "assets/images/project1_title.png" },
        { url: "intra_ox.html", title: "Intra.Ox", category: "Internship", img: "assets/images/project2_title.png" },
        { url: "auris_viewer_console.html", title: "Viewer Console", category: "Optomechanical Design", img: "assets/images/project3_title.png" },
        { url: "BOM_tracking.html", title: "BOM Tracking", category: "Process Improvement", img: "assets/images/project4_title.png" },
        { url: "lap_ox.html", title: "Lap.Ox", category: "Medical Device Design", img: "assets/images/project5_title.png" },
        { url: "IT_setup_procedure.html", title: "IT Laptop Setup Procedure", category: "Process Improvement", img: "assets/images/project6_title.png" },
        { url: "fergie_robot.html", title: '"Fergie" Robot', category: "Mechatronics", img: "assets/images/project7_title.png" },
        { url: "pantryos.html", title: "PantryOS", category: "Internet of Things/PCBA design", img: "assets/images/cropped/project8_title_cropped.webp" }
    ];

    const dynamicContainer = document.getElementById("dynamic-more-work");

    if (dynamicContainer) {
        // Get current page filename
        const currentPage = window.location.pathname.split("/").pop();

        // Filter out current project
        const availableProjects = projectsList.filter(p => p.url !== currentPage);

        // Select all remaining 6 projects in order
        const selectedProjects = availableProjects;

        // Generate HTML
        let htmlStr = "";
        selectedProjects.forEach(proj => {
            htmlStr += `
                <a href="${proj.url}" class="project-card fade-hidden" aria-label="View project: ${proj.title}">
                    <div class="card-image" style="background-image: url('${proj.img}');"></div>
                    <div class="project-overlay">
                        <h3>${proj.title}</h3>
                        <div class="category">${proj.category}</div>
                    </div>
                </a>
            `;
        });

        dynamicContainer.innerHTML = htmlStr;

        // Re-attach observer for newly injected cards
        const newCards = dynamicContainer.querySelectorAll(".fade-hidden");
        newCards.forEach(card => observer.observe(card));
    }
});
