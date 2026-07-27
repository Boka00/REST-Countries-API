const btn = document.getElementById("btn");
const img = document.querySelector(".icon");
const theme = document.querySelector("p");
const savedTheme = localStorage.getItem("theme");

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
