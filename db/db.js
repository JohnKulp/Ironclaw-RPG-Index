const pgp = require('pg-promise')({ poolSize: 50 });

let databaseURL = process.env.DATABASE_URL;
module.exports = pgp(databaseURL + '?ssl=true');
