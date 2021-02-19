// Imports
const path = require("path");
const pug = require("pug");
const express = require("express");

// Constants
const public = path.join(__dirname, "public");
const prod = process.env.NODE_ENV === "production";
const port = prod ? 80 : 8000;
const templatePath = path.join(__dirname, "templates", "view.pug");
const template = pug.compileFile(templatePath);
const app = express();

// Routes
app.use("/", express.static(public));

app.post("/encrypt", (_r, w)=> {
  w.send("<a href='https://www.google.com/'>Secret Link</a>");
});

app.post("/decrypt", (_r, w) => {
  w.send(template({data: "hello world"}));
});

// Entrypoint
app.listen(port, () => {
  if (prod) console.log("running in production mode ...");
  console.log(`listening at localhost:${port} ...`);
});