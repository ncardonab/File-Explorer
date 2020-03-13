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
  static optionsHandler(filesAndFolders, event, menu) {
    // showing the context menu
    UI.showMenu(event);

    const options = menu.children;

    const properties = API.getFileOrFolder(filesAndFolders, event)[0];

    const propertiesOption = options[0];
    propertiesOption.addEventListener("click", () => {
      UI.renderFileOrFolderProperties(properties);
    });

    const renameOption = options[1];
    renameOption.addEventListener("click", () => {
      UI.rename(properties.name);
    });
  }

  /**
   * @method showMenu
   * @description Method that shows the customize contextmenu in the right-click coordinates
   * @param {contextmenu} event
   */
  static showMenu(event) {
    event.preventDefault();
    let menu = document.querySelector(".menu");
    menu.classList.remove("off");
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
  }

  /**
   * @method hideMenu
   * @description Method that adds 'off' class in the contextmenu and the css file takes care of that
   */
  static hideMenu() {
    const menu = document.querySelector(".menu");
    menu.classList.add("off");
  }

  /**
   * @method renderFilesAndFolders
   * @description Method that renders the cards of the file or folder into the UI
   * @param {Array} info
   */
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

  /**
   * @method unfoldSidebar
   * @description Method that unfold the sidebar once the hamburguer menu was clicked
   */
  static unfoldSidebar() {
    const sidebar = document.querySelector(".side-bar");
    document.querySelector(".hamburguer-menu").classList.toggle("change");
    sidebar.classList.toggle("change");
  }

  /**
   * @method renderFileOrFolderProperties
   * @description Method that renders a card into the sidebar UI with the element's info that was selected
   * @param {object} properties
   */
  static renderFileOrFolderProperties(properties) {
    UI.unfoldSidebar();
    const sidebar = document.querySelector(".side-bar");

    const card = document.createElement("div");
    card.classList.add("properties");
    if (properties.type === "file") {
      const { name, extension, type, permissions, owner } = properties;
      const fileCard = `
        <div class="card-properties">
          <h4>${name}</h4>
          <div><span>Extension: </span>${extension}</div>
          <div><span>Type: </span>${type}</div>
          <div><span>Permissions: </span>${permissions}</div>
          <div><span>Owner: </span>${owner}</div>
        </div>`;
      card.innerHTML = fileCard;
    } else {
      const { name, type, permissions, owner } = properties;
      const folderCard = `
        <div class="card-properties">
          <h4>${name}</h4>
          <div><span>Type: </span>${type}</div>
          <div><span>Permissions: </span>${permissions}</div>
          <div><span>Owner: </span>${owner}</div>
        </div>`;
      card.innerHTML = folderCard;
    }

    sidebar.innerHTML = card.innerHTML;
  }

  /**
   * @method rename
   * @description Method that renames the selected file or folder
   * @param {string} oldName
   * @param {string} newName
   */
  static rename(oldName) {
    UI.unfoldSidebar();
    const inputForm = `
    <div class="rename-form">
      <h4>If it's a file don't forget the extension</h4>
      <div><span>Name: </span> ${oldName}</div>
      <label for="name-input">New file or folder name</label>
      <input type="text" id="name-input" class="input" placeholder="Type here the new name"></input>
      <button type="submit" class="btn">Rename</button>
    </div>`;

    const sidebar = document.querySelector(".side-bar");
    sidebar.innerHTML = inputForm;
  }
}

class API {
  /**
   * @method getFilesAndFolders
   * @description Method that brings the files and folders info from the API
   * @param {String} directory
   */
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

  /**
   * @method getFileOrFolder
   * @description Method that match the info from the API with the selected from the UI
   * @param {Array} filesOrFolders
   * @param {contextmenu} event
   */
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
  const menu = document.querySelector(".menu");
  // Hides the context menu
  menu.classList.add("off");

  API.getFilesAndFolders("home/nicolas").then(filesAndFolders => {
    filesAndFolders.map(info => {
      // Rendering the info into the UI
      UI.renderFilesAndFolders(info);
    });

    // Listener for file type
    let files = document.querySelectorAll(".file");
    files.forEach(file =>
      file.addEventListener("contextmenu", event => {
        UI.optionsHandler(filesAndFolders, event, menu);
      })
    );

    // Listener for folder type
    let folders = document.querySelectorAll(".directory");
    folders.forEach(folder =>
      folder.addEventListener("contextmenu", event => {
        UI.optionsHandler(filesAndFolders, event, menu);
      })
    );

    // Hide the menu when the mouse leave the menu
    menu.addEventListener("mouseleave", UI.hideMenu);
  });
});

// Preventing that the original browser context menu appears
window.addEventListener("contextmenu", event => {
  event.preventDefault();
});

// Hamburguer menu function unfolds sidebar
document
  .querySelector(".hamburguer-menu")
  .addEventListener("click", UI.unfoldSidebar);
