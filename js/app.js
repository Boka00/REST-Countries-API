// ==========================================
// HOME PAGE — app.js
// ==========================================
// API used: https://countries.dev/countries
// Key field differences vs restcountries.com:
//   country.alpha3Code  (not cca3)
//   country.name        (plain string, not object)
//   country.capital     (plain string, not array)
//   country.flags.svg   (same ✅)

// ==========================================
// 1. THEME SETUP
// ==========================================
const btn = document.getElementById("btn");
const img = document.querySelector(".icon");
const theme = document.querySelector(".theme-p");
const savedTheme = localStorage.getItem("theme");
const filterEL = document.querySelector(".hidden");
const regionDropdown = document.querySelector(".filter-dropdown");

let allCountries = [];

// Restore saved theme on page load
if (savedTheme === "dark") {
  document.body.classList.add("theme-dark");
  theme.textContent = "Light Mode";
  img.src = "./Assets/Vector.svg";
}

// Toggle dark/light mode on button click
btn.addEventListener("click", () => {
  document.body.classList.toggle("theme-dark");

  if (document.body.classList.contains("theme-dark")) {
    theme.textContent = "Light Mode";
    img.src = "./Assets/Vector.svg";
    img.alt = "icon-dark";
    localStorage.setItem("theme", "dark");
  } else {
    theme.textContent = "Dark Mode";
    img.src = "./Assets/Path.svg";
    img.alt = "icon-light";
    localStorage.setItem("theme", "light");
  }
});

// ==========================================
// 2. FETCH ALL COUNTRIES
// ==========================================
const API_URL = "https://countries.dev/countries";

async function fetchCountries() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    // Change Georgia's region to Europe
    const georgia = data.find(c => c.alpha3Code === "GEO");
    if (georgia) {
      georgia.region = "Europe";
    }

    allCountries = data;
    renderCountries(allCountries);
  } catch (error) {
    console.error("Failed to fetch countries:", error);
  }
}

fetchCountries();

// ==========================================
// 3. RENDER COUNTRY CARDS
// ==========================================
const countriesContainer = document.querySelector(".cards-container");

function renderCountries(countries) {
  countriesContainer.innerHTML = "";

  countries.forEach((country) => {
    const card = document.createElement("div");
    card.classList.add("country-card");
    // FIX: Store alpha3Code (not cca3) for navigation
    card.dataset.code = country.alpha3Code;
    card.style.cursor = "pointer";

    // Clicking the card navigates to the detail page with the alpha3Code in the URL
    // FIX: Use alpha3Code, not cca3
    card.addEventListener("click", () => {
      window.location.href = `details.html?code=${country.alpha3Code}`;
    });

    // --- FLAG IMAGE ---
    const countryInfo = document.createElement("div");
    countryInfo.classList.add("country-info");

    const flagImg = document.createElement("img");
    flagImg.src = country.flags?.svg || country.flags?.png;
    // FIX: country.name is a plain string ("Albania"), not an object
    flagImg.alt = country.name;
    countryInfo.appendChild(flagImg);

    // --- COUNTRY DETAILS ---
    const countryDetails = document.createElement("div");
    countryDetails.classList.add("country-details");

    const title = document.createElement("h2");
    // FIX: country.name is a plain string, not country.name.common
    title.textContent = country.name || "N/A";

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("details");

    // Helper: creates <p><strong>Label: </strong>Value</p>
    function createDetailRow(label, value) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      p.append(strong, document.createTextNode(value));
      return p;
    }

    const populationP = createDetailRow(
      "Population",
      country.population.toLocaleString()
    );
    const regionP = createDetailRow("Region", country.region || "N/A");
    // FIX: country.capital is a plain STRING, not an array
    // Previously: country.capital ? country.capital : "N/A"  ← would show "Tirana" as-is ✅
    // But it was broken when treated as array elsewhere, so be explicit:
    const capitalP = createDetailRow(
      "Capital",
      country.capital || "N/A"
    );

    detailsDiv.append(populationP, regionP, capitalP);
    countryDetails.append(title, detailsDiv);
    card.append(countryInfo, countryDetails);
    countriesContainer.appendChild(card);
  });
}

// ==========================================
// 4. SEARCH
// ==========================================
const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();
  // FIX: country.name is a plain STRING, so .toLowerCase() works directly on it.
  // (Previously tried country.name.toLowerCase() when name was an object → "[object object]")
  const filteredCountries = allCountries.filter((country) => {
    return country.name.toLowerCase().includes(searchTerm);
  });
  renderCountries(filteredCountries);
});

// ==========================================
// 5. REGION FILTER
// ==========================================
regionDropdown.addEventListener("change", (e) => {
  filterEL.classList.add("hidden");

  const selectedRegion = e.target.value;

  if (selectedRegion === "all") {
    renderCountries(allCountries);
  } else {
    const filteredCountries = allCountries.filter(
      (country) => country.region === selectedRegion
    );
    renderCountries(filteredCountries);
  }
});
