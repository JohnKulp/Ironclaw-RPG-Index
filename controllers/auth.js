let router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../app.config');
const queries = require('./../db/queries');

// no register function because admin usage is so rare, and there's no point to a user account

// this could change if I set up a messageboard or something

router.post('/users/login', (req, res) => {
	return queries.user.getUserByEmail([req.body.user.email])
	.then( user => {
		if (!user) return res.status(401).send('No user found.');
		let passwordIsValid = bcrypt.compareSync(req.body.user.password, user.password_hash);
		if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
		user.password_hash = undefined;
		let token = jwt.sign(
			{ id: user.id },
			config.secret,
			{ expiresIn: 86400 } // expires in 24 hours
		);
		user.token = token;
		res.status(200).send({ auth: true, token: token, user: user });
	})
	.catch(err => {
		res.status(500).send('Error on the server.');
		console.error(err);
	});
});

// get a user with an api token
router.get('/user', (req, res) => {
	if(req.user){
		console.log('validating user with id', req.user.id)
		return queries.user.getUserById([req.user.id])
		.then( user => {
			if (!user) return res.status(401).send('No user found.');
			res.status(200).send({ auth: true, user: user });
		})
		.catch(err => {
			res.status(500).send('Error on the server.');
			console.error(err);
		});
	}

	res.status(500).send('Error');

});

//register
router.post('/users', (req, res) => {
	res.status(500).send('Error');

});

module.exports = router;