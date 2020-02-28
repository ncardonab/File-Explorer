document.addEventListener("DOMContentLoaded", () => {
  // hiding the context menu
  const menu = document.querySelector(".menu");
  menu.classList.add("off");

  fetchInfo("home/nicolas").then(results => {
    results.map(info => {
      // Rendering the info in the UI
      renderFilesAndFolders(info);
    });

    // Listener for file type
    let files = document.querySelectorAll(".file");
    files.forEach(file => file.addEventListener("contextmenu", showMenu));

    // Listener for folder type
    let folders = document.querySelectorAll(".directory");
    folders.forEach(folder => folder.addEventListener("contextmenu", showMenu));

    // hide the menu when the mouse leave the menu
    menu.addEventListener("mouseleave", hideMenu);
  });
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

  let menu = document.querySelector(".menu");
  menu.classList.remove("off");
  menu.style.top = `${event.clientY}px`;
  menu.style.left = `${event.clientX}px`;
}

function hideMenu() {
  const menu = document.querySelector(".menu");
  menu.classList.add("off");
}

function renderFilesAndFolders(info) {
  // Creates the card
  const icon =
    info.type === "file"
      ? `<i class="far fa-file-word"></i>
         <p>${info.filename}${info.extension}</p>`
      : `<i class="fas fa-folder"></i>
         <p>${info.directory_name}</p>`;

  const card = `
  <div class="${info.type}">
    ${icon}
  </div>`;

  const filesContainer = document.querySelector(".files-container");

  filesContainer.innerHTML += card;
}

function fetchInfo(directory) {
  return fetch(`http://localhost:3000/api/files?directory=${directory}`)
    .then(response => response.json())
    .then(data => data);
}
