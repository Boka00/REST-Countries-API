const btn = document.getElementById("btn");
const img = document.querySelector(".icon");

btn.addEventListener("click", () => {
  document.body.classList.toggle("theme-dark");

  if (document.body.classList.contains("theme-dark")) {
    img.src = "./Assets/Vector.svg";
    img.alt = "icon-dark";
  } else {
    img.src = "./Assets/Path.svg";
    img.alt = "icon-light";
  }
});
