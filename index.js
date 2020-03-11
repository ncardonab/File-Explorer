const express = require("express");
const morgan = require("morgan");
const path = require("path");
const { exec, execSync } = require("child_process");

const app = express();

app.set("port", 3000);

app.use(morgan("dev"));

/**
 * @description Adding the CORS header that allows to request data from the same domain
 **/
app.use((request, response, next) => {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (request, response) => {
  response.send("all good");
});

app.get("/api/files", (request, response) => {
  const directoryPath = path.join(__dirname, request.query.directory);
  const commandResults = execSync("ls -l", { cwd: directoryPath })
    .toString()
    .split("\n");

  const results = commandResults.slice(1, commandResults.length - 1);

  let fileFolderList = [];

  results.map(result => {
    result = result.split(" ");
    if (result[0].slice(0, 1) === "-") {
      const file = {
        filename: result[8].slice(0, result[8].indexOf(".")),
        extension: result[8].slice(result[8].indexOf("."), result[0].length),
        type: result[0].slice(0, 1) === "d" ? "directory" : "file",
        permissions: result[0].slice(1, result[0].length - 1),
        owner: result[2]
      };
      fileFolderList.push(file);
    } else {
      const directory = {
        directory_name: result[8],
        type: result[0].slice(0, 1) === "d" ? "directory" : "file",
        permissions: result[0].slice(1, result[0].length - 1),
        owner: result[2]
      };
      fileFolderList.push(directory);
    }
  });
  response.json(fileFolderList);
});

const port = process.env.PORT || 3000;

app.listen("3000", () => console.log(`Our app is running on port ${port}`));
