const express = require("express");
const morgan = require("morgan");
const path = require("path");
const { exec, execSync } = require("child_process");

const app = express();

app.set("port", 3000);

app.use(morgan("dev"));

app.get("/", (request, response) => {
  response.send("all good");
});

app.listen("3000", () =>
  console.log(`Our app is running on port ${app.get("port")}`)
);
