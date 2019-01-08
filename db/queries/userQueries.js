let db = require('../db');

let queries = {};

queries.createUser = function([username, hashedPassword, email], t=db){

	return t.one(`
		INSERT INTO users (username, password_hash, email)
		VALUES ($1, $2, $3)
		RETURNING id
	`, [username, hashedPassword, email]);
};

queries.getUserByEmail = function([email], t=db){


	return t.oneOrNone(`
		SELECT *
		FROM users
		WHERE email ILIKE $1
	`, [email]);
}

queries.getUserById = function([id], t=db){


	return t.oneOrNone(`
		SELECT *
		FROM users
		WHERE id = $1
	`, [id]);
}


module.exports = queries;