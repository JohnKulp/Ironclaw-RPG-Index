let router = require('express').Router();
const queries = require('./../db/queries');

router.get('/gifts', (req, res) => {
	queries.gift.getAllGifts([])
	.then( gifts => {
		res.status(200).send({ gifts });
	})
	.catch(err => {
		res.status(500).send('Error on the server.');
		console.error(err);
	});
});

module.exports = router;