document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) {
        return;
    }

    const submitButton = contactForm.querySelector(".submit-btn");
    const formStatus = document.getElementById("form-status");
    const defaultButtonText = submitButton ? submitButton.textContent.trim() : "Send Message";

    const setFormStatus = (state, message) => {
        if (!formStatus) {
            return;
        }

        formStatus.hidden = false;
        formStatus.dataset.state = state;
        formStatus.textContent = message;
    };

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
        setFormStatus("loading", "Sending your message...");

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
                const successUrl = new URL(successTarget, window.location.href);
                successUrl.searchParams.set("sent", Date.now().toString());
                window.location.assign(successUrl.toString());
                return;
            }

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
            setFormStatus("error", "Network issue. Please try again in a moment or email Arik directly.");
        } finally {
            contactForm.classList.remove("is-submitting");
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = defaultButtonText;
            }
        }
    });
});
