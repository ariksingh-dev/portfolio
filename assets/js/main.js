document.addEventListener("DOMContentLoaded", () => {
    const escapeHtml = value =>
        value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");

    const currentPage = window.location.pathname.split("/").pop();
    const extractProjects = root => {
        const projectLinks = root.querySelectorAll("#project-directory-list a[data-project-card]");

        return Array.from(projectLinks).map(link => ({
            url: link.getAttribute("href"),
            title: link.dataset.title || link.textContent.trim(),
            category: link.dataset.category || "",
            hook: link.dataset.hook || "",
            theme: link.dataset.theme || "",
            img: link.dataset.img || ""
        }));
    };

    const loadProjectsList = async () => {
        const inlineProjectList = document.getElementById("project-directory-list");
        if (inlineProjectList) {
            return extractProjects(document);
        }

        try {
            const response = await fetch("project-directory.html", {
                headers: {
                    Accept: "text/html"
                }
            });

            if (!response.ok) {
                return [];
            }

            const html = await response.text();
            const parsedDocument = new DOMParser().parseFromString(html, "text/html");
            return extractProjects(parsedDocument);
        } catch (error) {
            return [];
        }
    };

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

    // 1. Mobile Hamburger Menu
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector("nav ul");
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (hamburger && navMenu) {
        const syncMenuState = () => {
            hamburger.setAttribute("aria-expanded", String(navMenu.classList.contains("active")));
        };

        const toggleMenu = () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            syncMenuState();
        };

        const closeMenu = () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            syncMenuState();
        };

        hamburger.addEventListener("click", toggleMenu);

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

        syncMenuState();
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
    const initializeProjectCards = async () => {
        const projectsList = await loadProjectsList();
        if (projectsList.length === 0) {
            return;
        }

        const heroProjectCount = document.querySelector("[data-project-count]");
        if (heroProjectCount) {
            heroProjectCount.textContent = String(projectsList.length);
        }

        const selectedWorkGrid = document.getElementById("selected-work-grid");
        if (selectedWorkGrid) {
            selectedWorkGrid.innerHTML = projectsList.map(project => renderProjectCard(project, "fade-hidden")).join("");
            observeFadeElements(selectedWorkGrid.querySelectorAll(".fade-hidden"));
        }

        const dynamicContainer = document.getElementById("dynamic-more-work");
        if (dynamicContainer) {
            const availableProjects = projectsList.filter(project => project.url !== currentPage);
            dynamicContainer.innerHTML = availableProjects.map(project => renderProjectCard(project, "fade-hidden")).join("");

            const newCards = dynamicContainer.querySelectorAll(".fade-hidden");
            observeFadeElements(newCards);
        }
    };

    void initializeProjectCards();
});
