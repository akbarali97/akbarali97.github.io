// Currency conversion for the Services section.
// Base prices are stored in USD via the `data-usd` attribute on each .price element.
// Visitors can switch between USD and the GCC currencies; the default is guessed
// from their timezone. GCC currencies are pegged to the USD, so rates are stable.

const currencyConfig = {
  USD: { symbol: "$",    rate: 1,      round: 1 },
  AED: { symbol: "AED ", rate: 3.6725, round: 25 }, // UAE Dirham (pegged)
  SAR: { symbol: "SAR ", rate: 3.75,   round: 25 }, // Saudi Riyal (pegged)
  QAR: { symbol: "QAR ", rate: 3.64,   round: 25 }, // Qatari Riyal (pegged)
  KWD: { symbol: "KWD ", rate: 0.307,  round: 5 },  // Kuwaiti Dinar
  BHD: { symbol: "BHD ", rate: 0.376,  round: 5 },  // Bahraini Dinar (pegged)
  OMR: { symbol: "OMR ", rate: 0.3845, round: 5 },  // Omani Rial (pegged)
};

// Map IANA timezones to a sensible default currency.
function detectCurrency() {
  let tz = "";
  try {
    tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch (e) {
    tz = "";
  }
  if (/Dubai|Abu_Dhabi/i.test(tz)) return "AED";
  if (/Riyadh/i.test(tz)) return "SAR";
  if (/Qatar/i.test(tz)) return "QAR";
  if (/Kuwait/i.test(tz)) return "KWD";
  if (/Bahrain/i.test(tz)) return "BHD";
  if (/Muscat/i.test(tz)) return "OMR";
  return "USD";
}

function formatPrice(usd, currency) {
  const cfg = currencyConfig[currency];
  let value = usd * cfg.rate;
  value = Math.round(value / cfg.round) * cfg.round;
  return cfg.symbol + value.toLocaleString("en-US");
}

function setCurrency(currency) {
  if (!currencyConfig[currency]) currency = "USD";

  document.querySelectorAll(".price").forEach((el) => {
    const usd = parseFloat(el.getAttribute("data-usd"));
    if (isNaN(usd)) return;
    const suffix = el.getAttribute("data-suffix") || "";
    el.textContent = formatPrice(usd, currency) + suffix;
  });

  const select = document.getElementById("currency-select");
  if (select) select.value = currency;
}

document.addEventListener("DOMContentLoaded", () => {
  setCurrency(detectCurrency());

  const select = document.getElementById("currency-select");
  if (select) {
    select.addEventListener("change", () => setCurrency(select.value));
  }
});
