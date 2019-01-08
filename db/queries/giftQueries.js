let db = require('../db');

let queries = {};

queries.getAllGifts = function([], t=db){

	return t.any(`
		SELECT Gifts.id, Gifts.name, (
			SELECT string_agg(parents.name, ', ')
			FROM Gift_Parent_Prerequisites AS link
			JOIN Gifts AS parents
			ON parents.id = link.prerequisite_gift_id
			WHERE Gifts.id = link.gift_id

		) AS gift_req_string, (
			SELECT string_agg(link.skill_rank, ', ')
			FROM Gift_Skill_Prerequisites AS link
			WHERE Gifts.id = link.gift_id

		) AS gift_skill_req_string, (
			SELECT string_agg(link.prerequisite_text, ', ')
			FROM Gift_Miscelaneous_Prerequisites AS link
			WHERE Gifts.id = link.gift_id

		) AS gift_misc_req_string, (
			SELECT string_agg(tag_text, ', ')
			FROM Tags
			JOIN Gifts_Tags_Id
			ON Tags.id = Gifts_Tags_Id.tag_id 
			WHERE Gifts_Tags_Id.gift_id = Gifts.id
		) AS tags,
		Gifts.exhaust_type AS exhaust,
		Gifts.summary,
		(
			SELECT name
			FROM Gift_Categories
			WHERE Gifts.gift_category_id = Gift_Categories.id
		) AS type,
		Books.name AS book_name,
		Books.abbreviation AS book_abbreviation,
		Gifts.page_number AS page
		FROM Gifts
		LEFT JOIN Books
		ON Gifts.book_id = Books.id
	`, []);
};



module.exports = queries;