// Interactive Project Quote Estimator
// Walks the visitor through an adaptive questionnaire, shows an instant ballpark
// range, then collects contact details and submits everything to Web3Forms.

const WEB3FORMS_KEY = "f3dc0d17-9c43-44f5-847a-00f79b23103b";
const WHATSAPP = "971527468099";

// Base price (USD) per project type. The questionnaire adds/multiplies from here.
const PROJECT_TYPES = {
  landing:    { label: "Static Landing Page",        base: 300 },
  website:    { label: "Multi-page Website",         base: 800 },
  ecommerce:  { label: "E-commerce Store",           base: 1500 },
  webapp:     { label: "Custom Web Application",      base: 1200 },
  mobile:     { label: "Mobile App (Flutter)",       base: 1500 },
  erp:        { label: "ERP / Odoo Development",      base: 600 },
  automation: { label: "Automation / Web Scraping",  base: 250 },
  other:      { label: "Not sure / Other",           base: 500 },
};

// Each question: id, text, type (radio|checkbox), applies (project-type keys),
// and options carrying a `cost` (USD, additive) and/or `mult` (multiplier).
const QUESTIONS = [
  {
    id: "type", type: "radio", applies: "all",
    text: "What kind of project do you have in mind?",
    options: [
      { label: "Landing page (single page)", value: "landing" },
      { label: "Multi-page website", value: "website" },
      { label: "E-commerce store", value: "ecommerce" },
      { label: "Web application", value: "webapp" },
      { label: "Mobile app", value: "mobile" },
      { label: "ERP / Odoo", value: "erp" },
      { label: "Automation / web scraping", value: "automation" },
      { label: "Not sure / something else", value: "other" },
    ],
  },
  {
    id: "pages", type: "radio", applies: ["website", "ecommerce", "webapp", "other"],
    text: "Roughly how many pages or screens?",
    options: [
      { label: "Just a few (2–5)", cost: 200 },
      { label: "Medium (6–10)", cost: 500 },
      { label: "Large (10+)", cost: 1000 },
    ],
  },
  {
    id: "ecom_products", type: "radio", applies: ["ecommerce"],
    text: "How many products will you sell?",
    options: [
      { label: "Under 50", cost: 0 },
      { label: "50–500", cost: 300 },
      { label: "500+", cost: 700 },
    ],
  },
  {
    id: "ecom_features", type: "checkbox", applies: ["ecommerce"],
    text: "Which store features do you need? (select all that apply)",
    options: [
      { label: "Discount codes / coupons", cost: 100 },
      { label: "Multi-currency", cost: 150 },
      { label: "Subscriptions / recurring billing", cost: 300 },
      { label: "Advanced inventory management", cost: 200 },
    ],
  },
  {
    id: "app_auth", type: "radio", applies: ["webapp", "mobile", "erp"],
    text: "What level of user accounts do you need?",
    options: [
      { label: "No login required", cost: 0 },
      { label: "Basic user accounts", cost: 250 },
      { label: "Roles, permissions & SSO", cost: 600 },
    ],
  },
  {
    id: "integrations", type: "checkbox", applies: ["webapp", "mobile", "ecommerce", "erp"],
    text: "Any integrations needed? (select all that apply)",
    options: [
      { label: "Payment gateway", cost: 250 },
      { label: "Third-party API integrations", cost: 300 },
      { label: "AI / chatbot features", cost: 450 },
      { label: "Real-time (chat, live updates)", cost: 350 },
    ],
  },
  {
    id: "admin", type: "radio", applies: ["webapp", "ecommerce"],
    text: "Do you need an admin dashboard to manage data?",
    options: [
      { label: "Yes, a custom admin panel", cost: 400 },
      { label: "No / use the built-in one", cost: 0 },
    ],
  },
  {
    id: "mobile_platform", type: "radio", applies: ["mobile"],
    text: "Which platforms should the app support?",
    options: [
      { label: "Android only", cost: 0 },
      { label: "iOS only", cost: 0 },
      { label: "Both Android & iOS", cost: 300 },
    ],
  },
  {
    id: "backend", type: "radio", applies: ["mobile", "webapp"],
    text: "Is there an existing backend / API?",
    options: [
      { label: "Yes, I have an API ready", cost: 0 },
      { label: "No, build the backend too", cost: 600 },
    ],
  },
  {
    id: "erp_modules", type: "radio", applies: ["erp"],
    text: "How many ERP modules are involved?",
    options: [
      { label: "1–2 modules", cost: 0 },
      { label: "3–5 modules", cost: 400 },
      { label: "6+ modules", cost: 900 },
    ],
  },
  {
    id: "erp_migration", type: "radio", applies: ["erp"],
    text: "Migrating from an existing system?",
    options: [
      { label: "Fresh setup", cost: 0 },
      { label: "Migrate from an existing system", cost: 400 },
    ],
  },
  {
    id: "auto_sources", type: "radio", applies: ["automation"],
    text: "How many sources / sites to automate?",
    options: [
      { label: "A single source", cost: 0 },
      { label: "2–5 sources", cost: 200 },
      { label: "More than 5", cost: 500 },
    ],
  },
  {
    id: "auto_output", type: "radio", applies: ["automation"],
    text: "How should the data be delivered?",
    options: [
      { label: "CSV / Excel file", cost: 0 },
      { label: "Into a database", cost: 150 },
      { label: "Via an API endpoint", cost: 250 },
      { label: "Live dashboard", cost: 400 },
    ],
  },
  {
    id: "design", type: "radio", applies: ["landing", "website", "ecommerce", "webapp", "mobile", "other"],
    text: "Do you already have a design?",
    options: [
      { label: "Yes — ready designs (Figma/XD/PSD)", cost: 0 },
      { label: "Use a clean template", cost: 100 },
      { label: "Design it from scratch", cost: 300 },
    ],
  },
  {
    id: "content", type: "radio", applies: ["landing", "website", "ecommerce", "webapp", "mobile", "other"],
    text: "What about content & assets?",
    options: [
      { label: "I'll provide all content & images", cost: 0 },
      { label: "I need help with copywriting", cost: 200 },
      { label: "I need logo & branding too", cost: 350 },
    ],
  },
  {
    id: "seo", type: "radio", applies: ["landing", "website", "ecommerce"],
    text: "Include SEO setup?",
    options: [
      { label: "Yes, basic SEO setup", cost: 150 },
      { label: "No", cost: 0 },
    ],
  },
  {
    id: "multilingual", type: "radio", applies: ["website", "ecommerce", "webapp"],
    text: "Multiple languages?",
    options: [
      { label: "Single language", cost: 0 },
      { label: "Multilingual", cost: 250 },
    ],
  },
  {
    id: "analytics", type: "radio", applies: ["landing", "website", "ecommerce", "webapp", "mobile"],
    text: "Add analytics & tracking?",
    options: [
      { label: "Yes, set up analytics", cost: 100 },
      { label: "No", cost: 0 },
    ],
  },
  {
    id: "hosting", type: "radio", applies: "all",
    text: "Do you have hosting / deployment sorted?",
    options: [
      { label: "Yes, I have hosting", cost: 0 },
      { label: "Set it up & deploy for me", cost: 200 },
    ],
  },
  {
    id: "timeline", type: "radio", applies: "all",
    text: "What's your timeline?",
    options: [
      { label: "Flexible", mult: 1.0 },
      { label: "Within 1–2 months", mult: 1.0 },
      { label: "ASAP / rush", mult: 1.3 },
    ],
  },
  {
    id: "maintenance", type: "radio", applies: "all",
    text: "Ongoing maintenance after launch?",
    options: [
      { label: "No, just the build", cost: 0 },
      { label: "Monthly maintenance plan (from $150/mo)", cost: 0, note: "+ maintenance retainer" },
    ],
  },
];

// ---- State ----
const state = {
  flow: [],          // ordered questions for the chosen project type
  index: 0,
  selections: {},    // qid -> [{label, cost, mult, note}]
};

const app = document.getElementById("quote-app");

function roundTo(n, step) {
  return Math.round(n / step) * step;
}

function fmt(n) {
  return "$" + n.toLocaleString("en-US");
}

function appliesToType(q, type) {
  return q.applies === "all" || (Array.isArray(q.applies) && q.applies.includes(type));
}

function buildFlow(type) {
  state.flow = QUESTIONS.filter((q) => q.id === "type" || appliesToType(q, type));
}

function currentType() {
  const sel = state.selections["type"];
  return sel && sel[0] ? sel[0].value : null;
}

function totalSteps() {
  // questionnaire steps + the final estimate/contact step
  return state.flow.length + 1;
}

function computeEstimate() {
  const type = currentType();
  let total = PROJECT_TYPES[type] ? PROJECT_TYPES[type].base : 0;
  let mult = 1;
  // Only count answers for questions in the current flow (ignore stale answers
  // left over from a previously selected project type).
  state.flow.forEach((q) => {
    (state.selections[q.id] || []).forEach((s) => {
      if (s.cost) total += s.cost;
      if (s.mult) mult *= s.mult;
    });
  });
  total *= mult;
  return { low: roundTo(total * 0.9, 50), high: roundTo(total * 1.35, 50) };
}

function summaryText() {
  const lines = [];
  lines.push("Project type: " + (PROJECT_TYPES[currentType()] || {}).label);
  state.flow.forEach((q) => {
    if (q.id === "type") return;
    const sels = state.selections[q.id];
    if (sels && sels.length) {
      lines.push(q.text + " -> " + sels.map((s) => s.label).join(", "));
    }
  });
  return lines.join("\n");
}

// ---- Rendering ----
function progressBar() {
  const step = Math.min(state.index + 1, totalSteps());
  const pct = Math.round((step / totalSteps()) * 100);
  return `
    <div class="quiz-progress mb-4">
      <div class="quiz-progress-bar" style="width:${pct}%"></div>
    </div>
    <p class="text-center quiz-step-label">Step ${step} of ${totalSteps()}</p>`;
}

function renderQuestion() {
  const q = state.flow[state.index];
  const chosen = state.selections[q.id] || [];
  const chosenLabels = chosen.map((c) => c.label);
  const inputType = q.type === "checkbox" ? "checkbox" : "radio";

  const opts = q.options.map((o, i) => {
    const isSel = chosenLabels.includes(o.label);
    return `
      <label class="quiz-option ${isSel ? "selected" : ""}">
        <input type="${inputType}" name="q-${q.id}" value="${i}" ${isSel ? "checked" : ""}>
        <span>${o.label}</span>
      </label>`;
  }).join("");

  app.innerHTML = `
    ${progressBar()}
    <div class="quiz-card">
      <h4 class="mb-3">${q.text}</h4>
      <div class="quiz-options">${opts}</div>
      <div class="quiz-nav mt-4 d-flex justify-content-between">
        <button type="button" class="btn btn-outline-secondary quiz-back" ${state.index === 0 ? "disabled" : ""}>Back</button>
        <button type="button" class="btn btn-primary quiz-next" disabled>${q.type === "checkbox" ? "Continue" : "Next"}</button>
      </div>
    </div>`;

  const nextBtn = app.querySelector(".quiz-next");
  const inputs = app.querySelectorAll(`input[name='q-${q.id}']`);

  // checkbox questions can proceed with zero selections (optional)
  const refreshNext = () => {
    const anyChecked = [...inputs].some((i) => i.checked);
    nextBtn.disabled = q.type === "checkbox" ? false : !anyChecked;
  };
  refreshNext();

  inputs.forEach((input) => {
    input.addEventListener("change", () => {
      app.querySelectorAll(".quiz-option").forEach((lbl) => {
        const inp = lbl.querySelector("input");
        lbl.classList.toggle("selected", inp.checked);
      });
      refreshNext();
    });
  });

  app.querySelector(".quiz-back").addEventListener("click", goBack);
  nextBtn.addEventListener("click", () => {
    saveCurrent(q, inputs);
    goNext();
  });
}

function saveCurrent(q, inputs) {
  const sels = [];
  inputs.forEach((input) => {
    if (input.checked) {
      const o = q.options[parseInt(input.value, 10)];
      sels.push({ label: o.label, value: o.value, cost: o.cost, mult: o.mult, note: o.note });
    }
  });
  state.selections[q.id] = sels;
}

function goNext() {
  // Selecting the project type (re)builds the flow.
  if (state.flow[state.index].id === "type") {
    buildFlow(currentType());
  }
  if (state.index < state.flow.length - 1) {
    state.index++;
    renderQuestion();
  } else {
    renderResult();
  }
}

function goBack() {
  if (state.index > 0) {
    state.index--;
    renderQuestion();
  }
}

function renderResult() {
  state.index = state.flow.length; // final step for progress
  const est = computeEstimate();
  const wantsMaintenance = (state.selections["maintenance"] || []).some((s) => s.note);

  app.innerHTML = `
    ${progressBar()}
    <div class="quiz-card text-center">
      <p class="estimate-label mb-1">Your estimated project cost</p>
      <div class="estimate-range">${fmt(est.low)} &ndash; ${fmt(est.high)}</div>
      <p class="estimate-note">Indicative ballpark in USD${wantsMaintenance ? ", plus an optional maintenance retainer" : ""}. Your exact quote depends on the finer details &mdash; share your contact below and I'll send a precise proposal.</p>

      <form id="quote-lead" class="quote-form mx-auto text-start mt-4">
        <input type="checkbox" name="botcheck" class="d-none" style="display:none" tabindex="-1" autocomplete="off">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label" for="ql-name">Name</label>
            <input type="text" class="form-control" id="ql-name" name="name" required>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="ql-email">Email</label>
            <input type="email" class="form-control" id="ql-email" name="email" required>
          </div>
          <div class="col-md-6">
            <label class="form-label" for="ql-phone">Phone / WhatsApp (optional)</label>
            <input type="text" class="form-control" id="ql-phone" name="phone">
          </div>
          <div class="col-md-6">
            <label class="form-label" for="ql-company">Company (optional)</label>
            <input type="text" class="form-control" id="ql-company" name="company">
          </div>
          <div class="col-12">
            <label class="form-label" for="ql-message">Anything else I should know? (optional)</label>
            <textarea class="form-control" id="ql-message" name="message" rows="3"></textarea>
          </div>
          <div class="col-12 text-center">
            <button type="button" class="btn btn-outline-secondary quiz-back me-2"><i class="fas fa-arrow-left me-1"></i>Back</button>
            <button type="submit" class="btn btn-primary"><i class="fas fa-paper-plane me-2"></i>Get My Detailed Quote</button>
            <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener" class="btn btn-whatsapp ms-2"><i class="fab fa-whatsapp me-2"></i>WhatsApp</a>
          </div>
        </div>
        <div id="ql-result" class="text-center mt-3" role="status" aria-live="polite"></div>
      </form>
    </div>`;

  app.querySelector(".quiz-back").addEventListener("click", () => {
    state.index = state.flow.length - 1;
    renderQuestion();
  });
  app.querySelector("#quote-lead").addEventListener("submit", (e) => submitLead(e, est));
}

async function submitLead(e, est) {
  e.preventDefault();
  const form = e.target;
  const result = form.querySelector("#ql-result");
  const btn = form.querySelector("button[type='submit']");
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = "Sending…";

  const fd = new FormData(form);
  const payload = {
    access_key: WEB3FORMS_KEY,
    subject: "New quote-estimator lead: " + (PROJECT_TYPES[currentType()] || {}).label,
    from_name: "Portfolio Quote Estimator",
    name: fd.get("name"),
    email: fd.get("email"),
    phone: fd.get("phone") || "—",
    company: fd.get("company") || "—",
    estimated_range: `${fmt(est.low)} – ${fmt(est.high)} USD`,
    project_breakdown: summaryText(),
    message: fd.get("message") || "—",
    botcheck: fd.get("botcheck") ? true : false,
  };

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      app.innerHTML = `
        <div class="quiz-card text-center">
          <div class="estimate-icon mb-3"><i class="fas fa-circle-check"></i></div>
          <h3>Thank you${payload.name ? ", " + escapeHtml(payload.name.split(" ")[0]) : ""}!</h3>
          <p>Your details are in. Based on your answers, your estimated range is
            <strong>${fmt(est.low)} – ${fmt(est.high)}</strong>.</p>
          <p>I'll review the specifics and get back to you with a tailored quote shortly.</p>
          <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener" class="btn btn-whatsapp mt-2"><i class="fab fa-whatsapp me-2"></i>Chat now on WhatsApp</a>
          <div class="mt-3"><a href="index.html">&larr; Back to portfolio</a></div>
        </div>`;
    } else {
      result.textContent = data.message || "Something went wrong. Please email me directly at hello@akbarali.dev.";
      result.className = "text-center mt-3 qf-error";
      btn.disabled = false;
      btn.innerHTML = original;
    }
  } catch (err) {
    result.textContent = "Network error. Please email me directly at hello@akbarali.dev.";
    result.className = "text-center mt-3 qf-error";
    btn.disabled = false;
    btn.innerHTML = original;
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  if (!app) return;
  buildFlow(null);
  renderQuestion();
});
