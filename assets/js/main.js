// Main site script.
// Responsibilities:
// 1. Progressive enhancement for shared navigation and theme controls.
// 2. Small UX helpers like fade-ins, reading progress, and back-to-top.
// 3. Rendering project cards from the canonical project directory page.
document.addEventListener("DOMContentLoaded", () => {
    // Sanitize card copy before injecting it into template strings.
    // The content is authored locally, but escaping still keeps the renderer safe
    // if the project registry text ever changes to include special characters.
    const escapeHtml = value =>
        value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");

    // Use the current filename to avoid rendering the current case study inside
    // its own "More Work" rail.
    // This works because the canonical registry stores simple relative URLs
    // like "pantryos.html" rather than absolute paths.
    const currentPage = window.location.pathname.split("/").pop();

    // Read project metadata from the project-directory page markup.
    // This keeps the no-JS fallback list and the JS-rendered card UI in sync.
    const extractProjects = root => {
        const projectLinks = root.querySelectorAll("#project-directory-list a[data-project-card]");

        return Array.from(projectLinks).map(link => ({
            url: link.getAttribute("href"),
            title: link.dataset.title || link.textContent.trim(),
            category: link.dataset.category || "",
            hook: link.dataset.hook || "",
            theme: link.dataset.theme || "",
            img: link.dataset.img || "",
            badges: link.dataset.badges ? link.dataset.badges.split("|").map(badge => badge.trim()).filter(Boolean) : [],
            featuredRank: Number.parseInt(link.dataset.featuredRank || "0", 10) || 0
        }));
    };

    // Load the canonical project registry.
    // - On project-directory.html itself, we can read the inline list directly.
    // - Everywhere else, fetch the directory page and parse its project list.
    // If this fails, the page still has non-JS fallback links in HTML.
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

            // Parse the fetched HTML in-memory so we can reuse the same registry
            // without duplicating project data in this file.
            const parsedDocument = new DOMParser().parseFromString(html, "text/html");
            return extractProjects(parsedDocument);
        } catch (error) {
            // An empty array intentionally leaves the static HTML fallback in place.
            return [];
        }
    };

    // Shared renderer for homepage cards and "More Work" cards.
    // The same markup powers both experiences so visual updates stay consistent.
    const renderProjectCard = (proj, extraClasses = "") => {
        const safeTitle = escapeHtml(proj.title);
        const safeCategory = escapeHtml(proj.category);
        const safeHook = escapeHtml(proj.hook);
        const badgesMarkup = proj.badges.length > 0
            ? `<div class="project-badges">${proj.badges
                .map(badge => `<span class="project-badge">${escapeHtml(badge)}</span>`)
                .join("")}</div>`
            : "";
        const themeClass = proj.theme ? ` ${proj.theme}` : "";
        const className = `project-card${themeClass}${extraClasses ? ` ${extraClasses}` : ""}`;

        return `
            <a href="${proj.url}" class="${className}" aria-label="View project: ${safeTitle}">
                <div class="card-image" style="background-image: url('${proj.img}');"></div>
                <div class="project-overlay">
                    ${badgesMarkup}
                    <h3>${safeTitle}</h3>
                    <div class="category">${safeCategory}</div>
                    <p class="project-hook">${safeHook}</p>
                </div>
            </a>
        `;
    };

    // 1. Mobile navigation toggle.
    // The nav is always visible on desktop. On smaller screens, JS toggles the
    // active class and keeps ARIA state synchronized for accessibility.
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

        // If the viewport grows back to desktop width, clear the mobile state
        // so the nav does not stay visually "stuck" open.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });

        // Let keyboard users dismiss the mobile menu with Escape.
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        syncMenuState();
    }

    // 2. Scroll-triggered fade-ins.
    // Elements start hidden, then animate once when they enter the viewport.
    // This is presentation-only; content remains in the HTML either way.
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

    // Observe any fade-capable elements that already exist in the DOM at load time.
    observeFadeElements(fadeElements);

    // 3. Back-to-top button.
    // This control is created in JS because it is purely a convenience feature.
    const backToTopBtn = document.createElement("button");
    backToTopBtn.innerHTML = "↑";
    backToTopBtn.setAttribute("id", "back-to-top");
    backToTopBtn.setAttribute("aria-label", "Back to top");
    document.body.appendChild(backToTopBtn);

    // Only show the button once the visitor has meaningfully scrolled.
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

    // 4. Light/dark theme toggle.
    // We persist the user's preference locally and also keep the theme-color meta
    // tag in sync so browser chrome colors match the active theme.
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

    // Restore any saved theme before the visitor interacts with the page.
    const savedTheme = localStorage.getItem("portfolio-theme-v2");
    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }
    applyThemeState(document.body.classList.contains("light-theme"));

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-theme");

            // Persist the current theme so future visits keep the same palette.
            if (document.body.classList.contains("light-theme")) {
                localStorage.setItem("portfolio-theme-v2", "light");
            } else {
                localStorage.setItem("portfolio-theme-v2", "dark");
            }

            applyThemeState(document.body.classList.contains("light-theme"));
        });
    }

    // 5. Project quick-scan navigation.
    // On case-study pages, convert section headings into anchor chips so readers
    // can jump between the problem statement, role, outcome, and related work.
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

        // Treat the "More Work" header like a navigable section as well.
        const moreWorkHeading = document.querySelector(".more-work-section h2");
        if (moreWorkHeading) {
            moreWorkHeading.id = "more-work";
            sections.push({ id: "more-work", label: moreWorkHeading.textContent.trim() });
        }

        // Reuse the date text already authored in HTML rather than duplicating it
        // in JavaScript. This keeps content ownership inside the page markup.
        const metaText = projectMeta.textContent.replace(/\s+/g, " ").trim();
        const timelineValue = metaText.includes(":")
            ? metaText.split(":").slice(1).join(":").trim()
            : metaText;

        // Replace the plain date line with the richer quick-scan card UI.
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

    // 6. Reading progress bar.
    // This gives long-form case studies a subtle sense of where the reader is
    // within the overall page.
    const header = document.querySelector("header");
    if (header && !document.getElementById("reading-progress")) {
        const progressBar = document.createElement("div");
        progressBar.id = "reading-progress";
        header.appendChild(progressBar);

        // Width is derived from scroll position relative to the total scrollable
        // document height.
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

    // 7. Shared project card rendering.
    // The homepage and each case-study page consume the same registry so the
    // visual cards, titles, hooks, and themes stay aligned with the fallback
    // project directory.
    const initializeProjectCards = async () => {
        const projectsList = await loadProjectsList();
        if (projectsList.length === 0) {
            // If the registry cannot be loaded, leave the static HTML fallback
            // untouched instead of rendering a broken or partial UI.
            return;
        }

        // Keep the homepage metric derived from the live registry rather than a
        // hardcoded number in HTML.
        const heroProjectCount = document.querySelector("[data-project-count]");
        if (heroProjectCount) {
            heroProjectCount.textContent = String(projectsList.length);
        }

        // Render the homepage project gallery when present.
        // Featured projects get a larger, more editorial treatment while the
        // rest of the work stays accessible in a secondary grid below.
        const featuredGrid = document.getElementById("selected-work-featured");
        const additionalGrid = document.getElementById("selected-work-additional");
        const additionalSection = document.querySelector("[data-additional-section]");
        if (featuredGrid) {
            const featuredProjects = projectsList
                .filter(project => project.featuredRank > 0)
                .sort((left, right) => left.featuredRank - right.featuredRank);
            const additionalProjects = projectsList.filter(project => project.featuredRank === 0);

            // A single featured project should read like one intentional hero
            // case study rather than occupying one half of a multi-column grid.
            featuredGrid.classList.toggle("featured-grid-solo", featuredProjects.length === 1);

            const featuredMarkup = featuredProjects.length > 0
                ? featuredProjects
                    .map((project, index) =>
                        renderProjectCard(project, `fade-hidden ${index === 0 ? "featured-primary" : "featured-secondary"}`)
                    )
                    .join("")
                : projectsList.map(project => renderProjectCard(project, "fade-hidden")).join("");

            featuredGrid.innerHTML = featuredMarkup;
            observeFadeElements(featuredGrid.querySelectorAll(".fade-hidden"));

            if (additionalGrid && additionalSection && additionalProjects.length > 0) {
                additionalSection.hidden = false;
                additionalGrid.innerHTML = additionalProjects
                    .map(project => renderProjectCard(project, "fade-hidden compact"))
                    .join("");
                observeFadeElements(additionalGrid.querySelectorAll(".fade-hidden"));
            }
        }

        // Render related projects on case-study pages, excluding the page the
        // visitor is currently reading.
        const dynamicContainer = document.getElementById("dynamic-more-work");
        if (dynamicContainer) {
            const availableProjects = projectsList.filter(project => project.url !== currentPage);
            dynamicContainer.innerHTML = availableProjects.map(project => renderProjectCard(project, "fade-hidden")).join("");

            const newCards = dynamicContainer.querySelectorAll(".fade-hidden");
            observeFadeElements(newCards);
        }
    };

    // Fire and forget; the page already has usable static fallbacks if anything
    // in the async card-loading path fails.
    void initializeProjectCards();
});
