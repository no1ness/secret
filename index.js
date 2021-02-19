// Imports
const pug = require("pug");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require('bcrypt');
const env = require("./env.json");
const cipher = require("./cipher");
const express = require("express");
const database = require("./database");
const generateLink = require("./linkgen");
const bodyParser = require('body-parser');

// Constants
const public = path.join(__dirname, "public");
const prod = process.env.NODE_ENV === "production";
const port = prod ? 80 : 8000;
const origin = "http://localhost" + (prod ? '' : ':'+port);
const templates = path.join(__dirname, "templates");
const app = express();
const pool = new Pool(env);
const saltRounds = 10;

// Migrate
database.migrate(env.migrations, pool);

// Server setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static(public));

app.post("/encrypt", (r, w) => {
  bcrypt.hash(r.body.pswd, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
      return;
    }
    const link = generateLink();
    const ciphertext = cipher.encrypt(r.body.info, hash);
    database.addSecret(pool, ciphertext, hash, link);
    w.send(`<a href='${origin}${link}'>Secret Link</a>`);
  });
});

app.post("/decrypt", async (r, w) => {
  const { info, pswd } = await database.getInfoForLink(pool, r.body.link);
  bcrypt.compare(r.body.pswd, pswd, (err, _response) => {
    if (err) {
      console.log(err);
      w.status(404).send("Error 404: Page Not Found");
      return;
    }
    if (r.body.action == 'view') {
      const key = cipher.keyFromHash(pswd);
      const template = pug.compileFile(path.join(templates, "view.pug"));
      w.send(template({ info: cipher.decrypt(info, key) }));
    } else if (r.body.action == 'delete') {
      database.deleteLink(pool, r.body.link);
      w.send("Link successfully removed!");
    } else {
      w.status(400).send("Error 400: Bad Request");
    }
  });
});

app.get("/secret/:ten", async (r, w) => {
  if (await database.secretLinkExists(pool, r.url)) {
    const template = pug.compileFile(path.join(templates, "decrypt.pug"));
    w.send(template({ link: r.url }));
  } else {
    w.status(404).send("Error 404: Page Not Found");
  }
});

// Entrypoint
app.listen(port, () => {
  if (prod) console.log("running in production mode ...");
  console.log(`listening at ${origin} ...`);
});
