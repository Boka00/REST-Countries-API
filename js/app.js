const btn = document.getElementById("btn");
const img = document.querySelector(".icon");
const theme = document.querySelector(".theme-p");
const savedTheme = localStorage.getItem("theme");
const filterEL = document.querySelector(".hidden");
const dropEL = document.querySelector(".filter-dropdown");

dropEL.addEventListener("click", () => {
  filterEL.classList.add("hidden");
});

let allCountries = [];

if (savedTheme === "dark") {
  document.body.classList.add("theme-dark");
  theme.textContent = "Light Mode";
  img.src = "./Assets/Vector.svg";
}

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

/// rest api
const API_URL = "https://countries.dev/countries";
async function fetchCountries() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    allCountries = data;
    renderCountries(allCountries);
  } catch (error) {
    console.error(error);
  }
}
fetchCountries();

const countriesContainer = document.querySelector(".cards-container");

function renderCountries(countries) {
  countriesContainer.innerHTML = "";
  countries.forEach((country) => {
    // 2
    const card = document.createElement("div");
    card.classList.add("country-card");
    card.dataset.code = country.cca3;

    // 3
    // 3. country-info და სურათი
    const countryInfo = document.createElement("div");
    countryInfo.classList.add("country-info");

    const img = document.createElement("img");
    img.src = country.flags?.svg || country.flags?.png;
    img.alt = country.name?.common;
    countryInfo.appendChild(img);

    // 4. country-details და სათაური
    const countryDetails = document.createElement("div");
    countryDetails.classList.add("country-details");

    const title = document.createElement("h2");
    title.textContent = country.name?.common || country.name || "N/A";

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("details");

    // დამხმარე ფუნქცია <p><strong>Label:</strong> Value</p> ელემენტების უსაფრთხოდ შექმნისთვის
    function createDetailRow(label, value) {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;

      p.append(strong, document.createTextNode(value));
      return p;
    }

    // 5. პარაგრაფების შექმნა
    const populationP = createDetailRow(
      "Population",
      country.population.toLocaleString(),
    );
    const regionP = createDetailRow("Region", country.region);
    const capitalP = createDetailRow(
      "Capital",
      country.capital ? country.capital : "N/A",
    );

    // 6. ელემენტების აწყობა (Append)
    detailsDiv.append(populationP, regionP, capitalP);
    countryDetails.append(title, detailsDiv);
    card.append(countryInfo, countryDetails);

    // 7. ჩასმა მთავარ კონტეინერში
    countriesContainer.appendChild(card);
  });
}

// search
const searchInput = document.querySelector(".search-input");

searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase().trim();
  // filter arr
  const filteredCountries = allCountries.filter((country) => {
    return country.name.toLowerCase().includes(searchTerm);
  });
  renderCountries(filteredCountries);
});
