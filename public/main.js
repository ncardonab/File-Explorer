document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu");
  menu.classList.add("off");

  let files = document.querySelectorAll(".file");
  files.forEach(file => file.addEventListener("contextmenu", showMenu));

  let folders = document.querySelectorAll(".folder");
  folders.forEach(folder => folder.addEventListener("contextmenu", showMenu));

  menu.addEventListener("mouseleave", hideMenu);
  fetchInfo();
});

window.addEventListener("contextmenu", event => {
  event.preventDefault();
});

// hamburguer menu function
document.querySelector(".hamburguer-menu").addEventListener("click", event => {
  const sidebar = document.querySelector(".side-bar");
  document.querySelector(".hamburguer-menu").classList.toggle("change");
  sidebar.classList.toggle("change");
});

function showMenu(event) {
  event.preventDefault();

  console.log(event.clientX, event.clientY);
  let menu = document.querySelector(".menu");
  menu.classList.remove("off");
  menu.style.top = `${event.clientY}px`;
  menu.style.left = `${event.clientX}px`;
}

function hideMenu() {
  const menu = document.querySelector(".menu");
  menu.classList.add("off");
}

function renderInfo() {}

function fetchInfo() {
  fetch(`http://localhost:3000/api/files?directory=home`)
    .then(response => response.json())
    .then(data => console.log(data));
}
