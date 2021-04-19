var mwObject = {};

// only lets logged-in users access the page
mwObject.checkAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/login');
	}
};

// blocks logged-in users from posting login form
mwObject.checkNotAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect('/');
	} else {
        next();
	}
};

module.exports = mwObject;