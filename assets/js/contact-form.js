// Contact-form-specific script.
// This lives outside main.js on purpose so the branded submission flow can keep
// working even if the shared enhancement bundle changes later.
document.addEventListener("DOMContentLoaded", () => {
    // Bail out immediately on non-contact pages.
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) {
        return;
    }

    // Cache the few elements we need so we do not repeatedly query the DOM.
    const submitButton = contactForm.querySelector(".submit-btn");
    const formStatus = document.getElementById("form-status");
    const defaultButtonText = submitButton ? submitButton.textContent.trim() : "Send Message";

    // Shared helper for status messaging.
    // The element starts hidden in HTML and only becomes visible when there is
    // something meaningful to tell the visitor.
    const setFormStatus = (state, message) => {
        if (!formStatus) {
            return;
        }

        formStatus.hidden = false;
        formStatus.dataset.state = state;
        formStatus.textContent = message;
    };

    contactForm.addEventListener("submit", async event => {
        // Prevent the browser from doing a normal full-page POST so we can show
        // loading/error states and redirect to the branded thank-you page.
        event.preventDefault();

        // Avoid duplicate submissions from double-clicks or impatient taps.
        if (submitButton?.disabled) {
            return;
        }

        // Lock the button while the request is in flight.
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        // Add a visual submitting state and surface immediate feedback.
        contactForm.classList.add("is-submitting");
        setFormStatus("loading", "Sending your message...");

        try {
            // Submit to Formspree's JSON endpoint using the same action/method the
            // form would use in a traditional non-JS submission.
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: new FormData(contactForm),
                headers: {
                    Accept: "application/json"
                }
            });

            if (response.ok) {
                // Reset the form and send the visitor to the branded thank-you
                // page instead of the default hosted Formspree success page.
                contactForm.reset();
                const successTarget = contactForm.dataset.successUrl || "thank-you.html";
                const successUrl = new URL(successTarget, window.location.href);

                // Add a cache-busting query string so browsers are less likely to
                // show a stale cached thank-you page.
                successUrl.searchParams.set("sent", Date.now().toString());
                window.location.assign(successUrl.toString());
                return;
            }

            // Start from a useful generic error, then replace it if Formspree
            // returns structured validation errors.
            let errorMessage = "Something went wrong. Please try again or email Arik directly.";
            try {
                const data = await response.json();
                if (Array.isArray(data.errors) && data.errors.length > 0) {
                    errorMessage = data.errors.map(error => error.message).join(" ");
                }
            } catch (jsonError) {
                // Keep the fallback message if the response is not JSON.
            }

            setFormStatus("error", errorMessage);
        } catch (error) {
            // Network-level failures never reach Formspree, so show a different
            // message that encourages the visitor to retry or email directly.
            setFormStatus("error", "Network issue. Please try again in a moment or email Arik directly.");
        } finally {
            // Restore the button state whether the request succeeded or failed.
            contactForm.classList.remove("is-submitting");
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = defaultButtonText;
            }
        }
    });
});
