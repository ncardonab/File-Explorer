class File {
  constructor(name, extension, type, permissions, owner) {
    this.name = name;
    this.extension = extension;
    this.type = type;
    this.permissions = permissions;
    this.owner = owner;
  }
}

class Folder {
  constructor(name, type, permissions, owner) {
    this.name = name;
    this.type = type;
    this.permissions = permissions;
    this.owner = owner;
  }
}

class UI {
  static showMenu(event) {
    event.preventDefault();
    let menu = document.querySelector(".menu");
    menu.classList.remove("off");
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
  }

  static hideMenu() {
    const menu = document.querySelector(".menu");
    menu.classList.add("off");
  }

  static renderFilesAndFolders(info) {
    // Creates the card
    const icon =
      info.type === "file"
        ? `<i class="far fa-file-word"></i>
           <p>${info.name}${info.extension}</p>`
        : `<i class="fas fa-folder"></i>
           <p>${info.name}</p>`;

    const card = `
    <div class="${info.type}">
      ${icon}
    </div>`;

    const filesContainer = document.querySelector(".files-container");

    filesContainer.innerHTML += card;
  }
}

class API {
  static getFilesAndFolders(directory) {
    let filesAndFolders = [];
    return fetch(`http://localhost:3000/api/files?directory=${directory}`)
      .then(response => response.json())
      .then(objects => {
        objects.map(object => {
          if (object.filename) {
            const { filename, extension, type, permissions, owner } = object;
            filesAndFolders.push(
              new File(filename, extension, type, permissions, owner)
            );
          } else {
            const { directory_name, type, permissions, owner } = object;
            filesAndFolders.push(
              new Folder(directory_name, type, permissions, owner)
            );
          }
        });
        return filesAndFolders;
      });
  }

  static getFileOrFolder(filesOrFolders, event) {
    // Current class element is the card itself or the childs
    const elementClass =
      event.target.className === "file" ||
      event.target.className === "directory"
        ? event.target.className
        : event.target.parentElement.className;
    const element =
      event.target.className === "directory" ||
      event.target.className === "file"
        ? event.target.children[1]
        : event.target.parentElement.children[1];
    let item;
    if (elementClass === "file") {
      // Gets the filename without the extension
      const filename = element.textContent.slice(
        0,
        element.textContent.indexOf(".")
      );
      // Filter by the element filename
      item = filesOrFolders.filter(file => file.name === filename);
    } else if (elementClass === "directory") {
      // Gets the directory name
      const directoryName = element.textContent;
      // Filter by the element directory name
      item = filesOrFolders.filter(folder => folder.name === directoryName);
    }
    return item;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // hiding the context menu
  const menu = document.querySelector(".menu");
  menu.classList.add("off");

  API.getFilesAndFolders("home/nicolas").then(filesAndFolders => {
    filesAndFolders.map(info => {
      // Rendering the info in the UI
      UI.renderFilesAndFolders(info);
    });

    // Listener for file type
    let files = document.querySelectorAll(".file");
    files.forEach(file =>
      file.addEventListener("contextmenu", event => {
        // showing the context menu
        UI.showMenu(event);
        console.log(API.getFileOrFolder(filesAndFolders, event)[0].name);
      })
    );

    // Listener for folder type
    let folders = document.querySelectorAll(".directory");
    folders.forEach(folder =>
      folder.addEventListener("contextmenu", event => {
        // showing the context menu
        UI.showMenu(event);
        console.log(API.getFileOrFolder(filesAndFolders, event)[0].name);
      })
    );

    // hide the menu when the mouse leave the menu
    menu.addEventListener("mouseleave", UI.hideMenu);
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
