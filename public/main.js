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
  /**
   * @method menuOptionsHandler
   * @description Method that handles the options of right click menu
   * @param {Array} filesAndFolders
   * @param {EventListener} event
   * @param {Node} menu
   */
  static menuOptionsHandler(filesAndFolders, event, menu) {
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
      UI.rename(properties);
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
    const { type, name, extension } = info;
    const filename = `${name}${extension}`;
    const truncatedFilename =
      filename.length > 8 ? `${filename.slice(0, 8)}...` : filename;
    const folderName = `${name}`;
    const truncatedFoldername =
      folderName.length > 10 ? `${folderName.slice(0, 10)}...` : folderName;
    const icon =
      type === "file"
        ? `<i class="far fa-file-word"></i>
           <p>${truncatedFilename}</p>`
        : `<i class="fas fa-folder"></i>
           <p>${truncatedFoldername}</p>`;

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
   * @description Method that renames the selected file or folder calling the API static function
   * @param {string} oldName
   * @param {string} newName
   */
  static rename(properties) {
    const { name, type, extension } = properties;

    UI.unfoldSidebar();
    const inputForm = `
    <div class="rename-form">
      <h4>If it's a file don't forget the extension</h4>
      <div><span>Name: </span> ${name}</div>
      <label for="name-input">New file or folder name</label>
      <input type="text" id="name-input" class="new-name input" placeholder="Type here the new name"></input>
      <button type="submit" class="submit-btn btn">Rename</button>
    </div>`;

    const sidebar = document.querySelector(".side-bar");
    sidebar.innerHTML = inputForm;

    const newName = document.querySelector(".new-name");
    const submit = document.querySelector(".submit-btn");

    submit.addEventListener("click", () => {
      const directory = "home/nicolas";
      const oldName = type === "file" ? `${name}${extension}` : name;
      API.rename(directory, oldName, newName.value);
    });
  }

  /**
   * @method renderRoute
   * @description Method that renders the absolute route in the navbar
   * @param {Object} route
   */
  static renderRoute(route) {
    const dirs = route.split("\\");
    const breadcrumbs = document.createElement("ul");
    breadcrumbs.className = "breadcrumbs";
    dirs.map((name, index) => {
      const dir =
        index < dirs.length - 1
          ? `<li class="breadcrumb-item"><a class="breadcrumb-link" href="#">${name}</a></li>`
          : `<li class="breadcrumb-item current-dir" aria-current="page">${name}</li>`;
      breadcrumbs.innerHTML += dir;
    });

    document.querySelector(".navbar").append(breadcrumbs);
  }

  /**
   * @method filesAndFoldersEventHandler
   * @description Method that fetch the files and folders, renderize it into the UI and apply for each of them a event listener
   * @param {String} directory
   * @param {Element} menu
   */
  static filesAndFoldersEventHandler(filesAndFolders, menu) {
    // Listener for file type
    let files = document.querySelectorAll(".file");
    files.forEach(file =>
      file.addEventListener("contextmenu", event => {
        UI.menuOptionsHandler(filesAndFolders, event, menu);
      })
    );

    // Listener for folder type
    let folders = document.querySelectorAll(".directory");
    folders.forEach(folder =>
      folder.addEventListener("contextmenu", event => {
        UI.menuOptionsHandler(filesAndFolders, event, menu);
      })
    );
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

  /**
   * @method rename
   * @description Method that makes a PUT request with the query params to the backend API
   * @param {String} directory
   * @param {String} oldName
   * @param {String} newName
   */
  static rename(directory, oldName, newName) {
    fetch(
      `http://localhost:3000/api/files/rename?directory=${directory}&oldName=${oldName}&newName=${newName}`,
      { method: "PUT" }
    );
  }

  /**
   * @method getRoute
   * @description Method that fetch the route (cwd) from the API
   * @param {String} directoryRoute
   */
  static getRoute(directoryRoute) {
    return fetch(
      `http://localhost:3000/api/files/route?directoryRoute=${directoryRoute}`
    )
      .then(response => response.text())
      .then(data => data);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const DIRECTORY = `C:\\Users\\nclsc\\developer\\front-end\\file-explorer\\home\\nicolas`;
  const menu = document.querySelector(".menu");

  // Hides the context menu
  menu.classList.add("off");

  // Hide the menu when the mouse leave the menu
  menu.addEventListener("mouseleave", UI.hideMenu);

  API.getRoute(DIRECTORY).then(route => {
    // Renders the current work directory in the navbar
    UI.renderRoute(route);

    const navbar = document.querySelector(".navbar");

    navbar.addEventListener("click", event => {
      if (event.target.className === "breadcrumb-link") {
        // Getting the relative route where we are standing
        const relativeRoute = event.target.textContent;
        // Getting the absolute route where we are standing
        const absoluteRoute = Array.from(
          document.querySelector(".breadcrumbs").children
        );
        // Clearing the navbar
        navbar.innerHTML = "";

        let index = 0;
        let directory = [];
        // compare each route with the relative one and returns the index where was found it
        absoluteRoute.map((relRoute, i) => {
          if (relRoute.textContent === relativeRoute) {
            index = i;
          }
        });

        absoluteRoute.map((relRoute, i) => {
          if (i <= index) {
            directory.push(relRoute.textContent);
          }
        });
        directory = directory.join("\\");
        UI.renderRoute(directory);

        const filesContainer = document.querySelector(".files-container");
        // Emptying the files container
        filesContainer.innerHTML = "";

        API.getFilesAndFolders(directory).then(filesAndFolders => {
          filesAndFolders.map(info => {
            // Rendering the info into the UI
            UI.renderFilesAndFolders(info);
          });

          UI.filesAndFoldersEventHandler(filesAndFolders, menu);
        });
      }
    });
  });

  API.getFilesAndFolders(DIRECTORY).then(filesAndFolders => {
    filesAndFolders.map(info => {
      // Rendering the info into the UI
      UI.renderFilesAndFolders(info);
    });

    UI.filesAndFoldersEventHandler(filesAndFolders, menu);
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
