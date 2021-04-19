const express = require('express');
const router = express.Router();
const flash = require('express-flash');
const sql = require('mssql');
const path = require('path');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const passport = require('passport');
const middleware = require('../middleware');

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/login', function (req, res) {
	res.render('login');
});

router.post('/login',
	middleware.checkNotAuthenticated,
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
	})
);

router.get('/register', function (req, res) {	
	res.render('register');
});

router.post('/register', async function (req, res) {
	try {
		const hashPassword = await bcrypt.hash(req.body.password, 10);
		
		var sqlReq = new sql.Request();
		sqlReq.input('email', sql.NVarChar, req.body.email);
		sqlReq.input('password', sql.NVarChar, hashPassword);

		sqlReq
			.query('INSERT INTO tbl_user (email, password) VALUES (@email, @password)'
			)
			.then((result) => {
				if (result.rowsAffected == 0){
					console.log('failed to insert user');
				} else {
					console.log('inserted user');
				}

				res.redirect('/');
			});
	} catch (err) {
		console.log(err);
		res.redirect('/register');
	}
});

router.get('/terms-and-conditions', function (req, res) {
	res.render('terms-and-conditions');
});

router.get('/privacy-policy', function (req, res) {
	res.render('privacy-policy');
});

// router.get('/sitemap.xml', function (req, res) {
// 	res.sendFile(path.join(__dirname, '../sitemap.xml'));
// });

// router.get('/robots.txt', function (req, res) {
// 	res.sendFile(path.join(__dirname, '../robots.txt'));
// });

module.exports = router;
