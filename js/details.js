// ==========================================
// DETAILS PAGE — details.js
// ==========================================
// API used: https://countries.dev/countries
// This API uses a DIFFERENT field structure than restcountries.com:
//   country.alpha3Code  (not cca3)
//   country.name        (plain string, not an object)
//   country.nativeName  (plain string, not nested)
//   country.capital     (plain string, not an array)
//   country.topLevelDomain (array, not tld)
//   country.currencies  (array of {code, name, symbol}, not object)
//   country.languages   (array of {name, iso639_1, ...}, not object)

// ==========================================
// 1. GRAB DOM ELEMENTS
// ==========================================
const backBtn = document.getElementById("back-btn");
const themeBtn = document.getElementById("btn");
const themeIcon = document.getElementById("theme-icon");
const themeText = document.getElementById("theme-text");

const elements = {
  flag: document.getElementById("detail-flag"),
  name: document.getElementById("detail-name"),
  nativeName: document.getElementById("detail-native-name"),
  population: document.getElementById("detail-population"),
  region: document.getElementById("detail-region"),
  subRegion: document.getElementById("detail-sub-region"),
  capital: document.getElementById("detail-capital"),
  tld: document.getElementById("detail-tld"),
  currencies: document.getElementById("detail-currencies"),
  languages: document.getElementById("detail-languages"),
  bordersContainer: document.getElementById("btn-container"),
};

// ==========================================
// 2. DARK MODE — Restore saved theme & toggle
// ==========================================
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("theme-dark");
  themeText.textContent = "Light Mode";
  themeIcon.src = "./Assets/Vector.svg";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("theme-dark");

  if (document.body.classList.contains("theme-dark")) {
    themeText.textContent = "Light Mode";
    themeIcon.src = "./Assets/Vector.svg";
    themeIcon.alt = "icon-dark";
    localStorage.setItem("theme", "dark");
  } else {
    themeText.textContent = "Dark Mode";
    themeIcon.src = "./Assets/Path.svg";
    themeIcon.alt = "icon-light";
    localStorage.setItem("theme", "light");
  }
});

// ==========================================
// 3. GET URL PARAMETER
// ==========================================
// URL format: details.html?code=ALB
// URLSearchParams reads the "?code=ALB" part and lets us extract it.
const urlParams = new URLSearchParams(window.location.search);
const countryCode = urlParams.get("code"); // e.g. "ALB"

// ==========================================
// 4. FETCH AND DISPLAY DATA
// ==========================================
async function getCountryDetails() {
  try {
    const response = await fetch("https://countries.dev/countries");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const allCountries = await response.json();

    // FIX: The API field is "alpha3Code", NOT "cca3"
    // This was the ROOT CAUSE of the "Country not found" error.
    // country.cca3 was always undefined, so the .find() never matched anything.
    const country = allCountries.find((c) => c.alpha3Code === countryCode);

    if (!country) {
      elements.name.textContent = "Country not found!";
      return;
    }

    // --- FLAG ---
    elements.flag.src = country.flags?.svg || country.flags?.png;
    elements.flag.alt = `${country.name} Flag`;

    // --- NAME ---
    // FIX: country.name is a plain STRING ("Albania"), not an object
    elements.name.textContent = country.name;

    // --- NATIVE NAME ---
    // FIX: nativeName is a plain STRING ("Shqipëria"), NOT a nested object
    elements.nativeName.textContent = country.nativeName || country.name;

    // --- POPULATION ---
    // toLocaleString() adds commas: 2837743 → "2,837,743"
    elements.population.textContent = country.population.toLocaleString();

    // --- REGION & SUB-REGION ---
    elements.region.textContent = country.region || "N/A";
    elements.subRegion.textContent = country.subregion || "N/A";

    // --- CAPITAL ---
    // FIX: capital is a plain STRING ("Tirana"), NOT an array
    elements.capital.textContent = country.capital || "N/A";

    // --- TOP LEVEL DOMAIN ---
    // FIX: the field is "topLevelDomain", NOT "tld"
    // It IS an array: [".al"] → join gives ".al"
    elements.tld.textContent =
      country.topLevelDomain && country.topLevelDomain.length
        ? country.topLevelDomain.join(", ")
        : "N/A";

    // --- CURRENCIES ---
    // FIX: currencies is an ARRAY of objects: [{code:"ALL", name:"Albanian lek", symbol:"L"}]
    // Previously code used Object.values() which only works on plain objects, not arrays.
    if (country.currencies && country.currencies.length) {
      elements.currencies.textContent = country.currencies
        .map((c) => c.name)
        .join(", ");
    } else {
      elements.currencies.textContent = "N/A";
    }

    // --- LANGUAGES ---
    // FIX: languages is an ARRAY of objects: [{name:"Albanian", iso639_1:"sq", ...}]
    // Previously code used Object.values() which only works on plain objects, not arrays.
    if (country.languages && country.languages.length) {
      elements.languages.textContent = country.languages
        .map((l) => l.name)
        .join(", ");
    } else {
      elements.languages.textContent = "N/A";
    }

    // --- BORDER COUNTRIES ---
    elements.bordersContainer.innerHTML = ""; // Clear old content

    if (country.borders && country.borders.length > 0) {
      country.borders.forEach((borderCode) => {
        // FIX: Look up by alpha3Code, not cca3
        const borderCountry = allCountries.find(
          (c) => c.alpha3Code === borderCode
        );

        if (borderCountry) {
          const borderBtn = document.createElement("a");
          borderBtn.classList.add("btn", "border-btn");
          // FIX: borderCountry.name is a string, not an object
          borderBtn.textContent = borderCountry.name;
          // Navigate to the details page for that border country
          borderBtn.href = `details.html?code=${borderCountry.alpha3Code}`;
          elements.bordersContainer.appendChild(borderBtn);
        }
      });
    } else {
      elements.bordersContainer.textContent = "None";
    }
  } catch (error) {
    console.error("Error fetching country details:", error);
    elements.name.textContent = "Failed to load country data.";
  }
}

// ==========================================
// 5. RUN THE APP
// ==========================================
if (countryCode) {
  getCountryDetails();
} else {
  elements.name.textContent = "No country code provided in URL.";
}

// ==========================================
// 6. BACK BUTTON
// ==========================================
backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});
