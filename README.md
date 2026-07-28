# Where in the world? 🌍

A REST Countries API app built with vanilla HTML, CSS, and JavaScript. Browse every country in the world, search by name, filter by region, and drill into details like population, currencies, languages, and border countries — all with a persistent dark/light theme.

**🔗 Live demo:** https://boka00.github.io/REST-Countries-API/

## Features

- **Country list** — every country rendered as a card with its flag, name, population, region, and capital
- **Search** — live filtering as you type a country name
- **Region filter** — narrow the list down by continent via a dropdown
- **Country details page** — native name, sub-region, top-level domain, currencies, languages, and border countries
- **Border country navigation** — click a border country to jump straight to its details page
- **Dark / light mode** — toggle persists across pages and reloads via `localStorage`
- **Responsive layout** — works across mobile, tablet, and desktop

## Built with

- HTML5
- CSS3 (custom properties for theming)
- Vanilla JavaScript (ES6+, no frameworks or build tools)
- [Google Fonts](https://fonts.google.com/)
- Country data from a REST Countries–style API

## 🎯 What I Learned

While building this project, I practised:

- **Working** with REST APIs
- Fetch API and asynchronous JavaScript
- DOM manipulation
- Array methods (map, filter, find)
- Event handling
- Responsive web design
- Clean project structure


## Project structure

```
REST-Countries-API/
├── Assets/           # Icons and static images
├── css/
│   ├── style.css     # Home page styles
│   └── details.css   # Details page** styles
├── js/
│   ├── app.js        # Home page logic (fetch, search, filter, theme)
│   └── details.js     # Details page logic (fetch by code, borders, theme)
├── index.html         # Home page
└── details.html       # Country details page
```

## Getting started

No build step or dependencies required — it's plain HTML/CSS/JS.

1. Clone the repo
   ```bash
   git clone https://github.com/Boka00/REST-Countries-API.git
   cd REST-Countries-API
   ```
2. Open `index.html` in your browser, or serve it locally, e.g.:
   ```bash
   npx serve .
   ```

## How it works

- `index.html` fetches the full country list and renders each as a clickable card. Clicking a card navigates to `details.html?code=<alpha3Code>`.
- `details.html` reads the `code` query parameter, looks up the matching country, and renders its full details, including clickable border-country links.
- Theme preference is stored in `localStorage` and re-applied on load for both pages.

## Notes

This project uses a REST Countries–style API where field names differ slightly from the original [restcountries.com](https://restcountries.com) format (e.g. `alpha3Code` instead of `cca3`, `name` and `capital` as plain strings rather than objects/arrays). The app code is written specifically around this response shape.
