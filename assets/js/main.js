document.addEventListener("DOMContentLoaded", () => {
    const escapeHtml = value =>
        value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");

    const currentPage = window.location.pathname.split("/").pop();
    const projectsList = [
        { url: "max_particle_velocity.html", title: "Maximum Particle Velocity in Solids", category: "Independent Study", hook: "MATLAB Monte Carlo model probing a possible universal particle-velocity limit in solids.", theme: "theme-green", img: "assets/images/cropped/project1_title_cropped.webp" },
        { url: "intra_ox.html", title: "Intra.Ox", category: "Internship", hook: "Disposable sheath and O-ring design for a handheld tissue oximeter.", theme: "theme-green", img: "assets/images/cropped/project2_title_cropped.webp" },
        { url: "auris_viewer_console.html", title: "Viewer Console", category: "Optomechanical Design", hook: "Optomechanical console development from prototype builds through DVT manufacturing.", theme: "theme-yellow", img: "assets/images/cropped/project3_title_cropped.webp" },
        { url: "BOM_tracking.html", title: "BOM Tracking", category: "Process Improvement", hook: "SolidWorks-to-Excel BOM automation for fast, accurate inventory tracking.", theme: "theme-green", img: "assets/images/cropped/project4_title_cropped.webp" },
        { url: "lap_ox.html", title: "Lap.Ox", category: "Medical Device Design", hook: "Laparoscopic tissue oximeter development spanning CAD, inventory, and DVT builds.", theme: "theme-green", img: "assets/images/cropped/project5_title_cropped.webp" },
        { url: "IT_setup_procedure.html", title: "IT Laptop Setup Procedure", category: "Process Improvement", hook: "A repeatable Windchill and SolidWorks setup guide adopted by IT.", theme: "theme-green", img: "assets/images/cropped/project6_title_cropped.webp" },
        { url: "fergie_robot.html", title: '“Fergie” Robot', category: "Mechatronics", hook: "Competition robot built for autonomous navigation, wall-following, and button pressing.", theme: "theme-yellow", img: "assets/images/cropped/project7_title_cropped.webp" },
        { url: "pantryos.html", title: "PantryOS", category: "Internet of Things/PCBA design", hook: "An IoT pantry assistant with embedded sensing, MQTT syncing, and a live dashboard.", theme: "theme-yellow", img: "assets/images/cropped/project8_title_cropped.webp" }
    ];
    const renderProjectCard = (proj, extraClasses = "") => {
        const safeTitle = escapeHtml(proj.title);
        const safeCategory = escapeHtml(proj.category);
        const safeHook = escapeHtml(proj.hook);
        const themeClass = proj.theme ? ` ${proj.theme}` : "";
        const className = `project-card${themeClass}${extraClasses ? ` ${extraClasses}` : ""}`;

        return `
            <a href="${proj.url}" class="${className}" aria-label="View project: ${safeTitle}">
                <div class="card-image" style="background-image: url('${proj.img}');"></div>
                <div class="project-overlay">
                    <h3>${safeTitle}</h3>
                    <div class="category">${safeCategory}</div>
                    <p class="project-hook">${safeHook}</p>
                </div>
            </a>
        `;
    };

    const setFormStatus = (statusElement, state, message) => {
        if (!statusElement) {
            return;
        }

        statusElement.hidden = false;
        statusElement.dataset.state = state;
        statusElement.textContent = message;
    };

    // 1. Mobile Hamburger Menu
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector("nav ul");
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (hamburger && navMenu) {
        const toggleMenu = () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        };

        const closeMenu = () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        };

        hamburger.addEventListener("click", toggleMenu);
        hamburger.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggleMenu();
            }
        });

        // Close menu when a link is clicked
        document.querySelectorAll("nav ul li a").forEach(n =>
            n.addEventListener("click", () => {
                closeMenu();
            })
        );

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
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

    const observeFadeElements = elements => {
        elements.forEach(el => {
            el.classList.add("fade-hidden");
            observer.observe(el);
        });
    };

    observeFadeElements(fadeElements);

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
    const applyThemeState = isLightTheme => {
        if (themeToggle) {
            themeToggle.setAttribute("title", isLightTheme ? "Switch to dark mode" : "Switch to light mode");
            themeToggle.setAttribute("aria-label", isLightTheme ? "Switch to dark mode" : "Switch to light mode");
            themeToggle.setAttribute("aria-pressed", String(isLightTheme));
        }

        if (themeColorMeta) {
            themeColorMeta.setAttribute("content", isLightTheme ? "#f3f5f7" : "#0f1417");
        }
    };

    // Check for saved user preference
    const savedTheme = localStorage.getItem("portfolio-theme-v2");
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }
    applyThemeState(document.body.classList.contains("light-theme"));

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");

            // Save preference & toggle title
            if (document.body.classList.contains("light-theme")) {
                localStorage.setItem("portfolio-theme-v2", "light");
            } else {
                localStorage.setItem("portfolio-theme-v2", "dark");
            }

            applyThemeState(document.body.classList.contains("light-theme"));
        });
    }

    // 5. Project quick-scan navigation
    const projectMeta = document.querySelector(".project-meta");
    if (projectMeta) {
        const sections = [];
        document.querySelectorAll("main .content-section h2").forEach(heading => {
            const sectionId = heading.textContent
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
            heading.id = sectionId;
            sections.push({ id: sectionId, label: heading.textContent.trim() });
        });

        const moreWorkHeading = document.querySelector(".more-work-section h2");
        if (moreWorkHeading) {
            moreWorkHeading.id = "more-work";
            sections.push({ id: "more-work", label: moreWorkHeading.textContent.trim() });
        }

        const metaText = projectMeta.textContent.replace(/\s+/g, " ").trim();
        const timelineValue = metaText.includes(":")
            ? metaText.split(":").slice(1).join(":").trim()
            : metaText;

        projectMeta.innerHTML = `
            <div class="project-meta-card">
                <div class="meta-chip">
                    <span>Timeline</span>
                    <strong>${timelineValue}</strong>
                </div>
                <div class="project-scan">
                    <span>Quick Scan</span>
                    <div class="project-anchors">
                        ${sections.map(section => `<a href="#${section.id}">${section.label}</a>`).join("")}
                    </div>
                </div>
            </div>
        `;

    }

    // 6. Reading progress
    const header = document.querySelector("header");
    if (header && !document.getElementById("reading-progress")) {
        const progressBar = document.createElement("div");
        progressBar.id = "reading-progress";
        header.appendChild(progressBar);

        const updateReadingProgress = () => {
            const scrollTop = window.scrollY;
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        };

        updateReadingProgress();
        window.addEventListener("scroll", updateReadingProgress, { passive: true });
        window.addEventListener("resize", updateReadingProgress);
    }

    // 7. Shared Project Card Rendering
    const selectedWorkGrid = document.getElementById("selected-work-grid");
    if (selectedWorkGrid) {
        selectedWorkGrid.innerHTML = projectsList.map(project => renderProjectCard(project, "fade-hidden")).join("");
        observeFadeElements(selectedWorkGrid.querySelectorAll(".fade-hidden"));
    }

    const dynamicContainer = document.getElementById("dynamic-more-work");

    if (dynamicContainer) {
        // Filter out current project
        const availableProjects = projectsList.filter(p => p.url !== currentPage);

        // Keep the remaining 7 projects in portfolio order
        const selectedProjects = availableProjects;

        dynamicContainer.innerHTML = selectedProjects.map(project => renderProjectCard(project, "fade-hidden")).join("");

        // Re-attach observer for newly injected cards
        const newCards = dynamicContainer.querySelectorAll(".fade-hidden");
        observeFadeElements(newCards);
    }

    // 8. Contact form AJAX submission
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        const submitButton = contactForm.querySelector(".submit-btn");
        const formStatus = document.getElementById("form-status");
        const defaultButtonText = submitButton ? submitButton.textContent.trim() : "Send Message";

        contactForm.addEventListener("submit", async event => {
            event.preventDefault();

            if (submitButton?.disabled) {
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            contactForm.classList.add("is-submitting");
            setFormStatus(formStatus, "loading", "Sending your message...");

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: new FormData(contactForm),
                    headers: {
                        Accept: "application/json"
                    }
                });

                if (response.ok) {
                    contactForm.reset();
                    const successTarget = contactForm.dataset.successUrl || "thank-you.html";
                    window.location.assign(new URL(successTarget, window.location.href).toString());
                    return;
                }

                let errorMessage = "Something went wrong. Please try again or email Arik directly.";
                try {
                    const data = await response.json();
                    if (Array.isArray(data.errors) && data.errors.length > 0) {
                        errorMessage = data.errors.map(error => error.message).join(" ");
                    }
                } catch (jsonError) {
                    // Ignore JSON parsing issues and keep the fallback message.
                }

                setFormStatus(formStatus, "error", errorMessage);
            } catch (error) {
                setFormStatus(formStatus, "error", "Network issue. Please try again in a moment or email Arik directly.");
            } finally {
                contactForm.classList.remove("is-submitting");
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = defaultButtonText;
                }
            }
        });
    }
});
