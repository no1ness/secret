const fs = require("fs");
const path = require('path');

const apply = pool => (err, content) => {
  if (err) throw err;
  pool.query(content, (error, _results) => { if (error) throw error; });
}

function migrate(dirname, pool) {
  fs.readdir(dirname, (err, filenames) => {
    if (err) return err;
    filenames.forEach(filename => {
      fs.readFile(path.join(dirname, filename), 'utf-8', apply(pool));
    });
  });
}

function addSecret(pool, info, pswd, link) {
  pool.query(`
    insert into secrets (info, pswd, link)
    values ($1, $2, $3)`, [info, pswd, link],
    (err, _results) => { if (err) console.log(err); }
  );
}

async function secretLinkExists(pool, link) {
  const results = await pool.query(
    `select * from secrets where link = $1`, [link]);
  return results.rowCount > 0;
}

async function getInfoForLink(pool, link) {
  const results = await pool.query(
    `select * from secrets where link = $1`, [link]);
  return results.rows[0];
}

function deleteLink(pool, link) {
  pool.query(`delete from secrets where link = $1`, [link]);
}

module.exports = {
  migrate,
  addSecret,
  secretLinkExists,
  getInfoForLink,
  deleteLink,
};