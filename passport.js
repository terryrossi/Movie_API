const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	Models = require('./models.js'),
	passportJWT = require('passport-jwt');

console.log('entering passport.js');

let Users = Models.User,
	JWTStrategy = passportJWT.Strategy,
	ExtractJWT = passportJWT.ExtractJwt;

passport.use(
	new LocalStrategy(
		{
			usernameField: 'userName',
			passwordField: 'password',
		},
		(username, password, done) => {
			console.log(username + '  ' + password);
			Users.findOne({ userName: username })
				.then((user) => {
					console.log('user ' + user);
					if (!user) {
						console.log('incorrect username');
						return done(null, false, {
							message: 'Incorrect username or password.',
						});
					}
					// if (!user.validPassword(password)) {
					console.log('finished');
					return done(null, user);
					// }
				})
				.catch((error) => {
					console.log(error);
					return done(error);
				});
		}
	)
);

passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: 'your_jwt_secret',
		},
		(jwtPayload, done) => {
			console.log('jwtPayload._id' + jwtPayload._id);
			return Users.findById(jwtPayload._id)
				.then((user) => {
					return done(null, user);
				})
				.catch((error) => {
					return done(error);
				});
		}
	)
);
