const jwtSecret = 'wt_secret_abcd1234'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
	passport = require('passport');

require('./passport'); // Our local Passport File

let generateJWTToken = (user) => {
	return jwt.sign(user, jwtSecret, {
		subject: user.userName, // This is the username we're encoding in the JWT
		expiresIn: '7d', // Obviously expires in 7 Days
		algorithm: 'HS256', // This is the algorithm used to “sign” or encode the values of the JWT
	});
};

// POST Login
module.exports = (router) => {
	router.post('/login', (request, response) => {
		passport.authenticate(
			'local',
			{ session: false, failureRedirect: '/login', failureMessage: true },
			(error, user, info) => {
				if (error || !user) {
					return response.status(400).json({
						// message: 'Something went wrong! ' + error,
						// Update for the Angular Version
						message: 'Inalid UserId or Password',

						user: user,
					});
				}
				request.login(user, { session: false }, (error) => {
					if (error) {
						response.send(error);
					}
					let token = generateJWTToken(user.toJSON());
					return response.json({ user, token });
				});
			}
		)(request, response);
	});
};
