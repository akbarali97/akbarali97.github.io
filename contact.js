// Quote/contact form handler.
// Submits to Web3Forms via fetch so the visitor stays on the page, and shows
// an inline success/error message. Cloudflare Turnstile (the .cf-turnstile widget)
// injects a `cf-turnstile-response` token into the form, which Web3Forms verifies.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quote-form");
  if (!form) return;

  const result = document.getElementById("qf-result");
  const submitBtn = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // If a Turnstile widget is present, require it to be solved before sending.
    // (When no widget is configured, this check is skipped.)
    const token = form.querySelector("[name='cf-turnstile-response']");
    if (token && !token.value) {
      result.textContent = "Please complete the verification challenge first.";
      result.className = "text-center mt-3 qf-error";
      return;
    }

    const original = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Sending…";
    result.textContent = "";
    result.className = "text-center mt-3";

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await response.json();

      if (data.success) {
        result.textContent = "Thanks! Your enquiry has been sent — I'll get back to you shortly.";
        result.className = "text-center mt-3 qf-success";
        form.reset();
        if (window.turnstile) window.turnstile.reset();
      } else {
        result.textContent = data.message || "Something went wrong. Please email me directly at hello@akbarali.dev.";
        result.className = "text-center mt-3 qf-error";
      }
    } catch (err) {
      result.textContent = "Network error. Please email me directly at hello@akbarali.dev.";
      result.className = "text-center mt-3 qf-error";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = original;
    }
  });
});
