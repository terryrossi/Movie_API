const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	Models = require('./models.js'),
	passportJWT = require('passport-jwt');

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
			Users.findOne({ userName: username })
				.then((user) => {
					if (!user) {
						console.log('incorrect username');
						return done(null, false, {
							message: 'Incorrect username.',
						});
					}
					if (!user.validatePassword(password)) {
						console.log('Incorrect Password');
						return done(null, false, { message: 'Incorrect Password' });
					}
					console.log('LOGGED IN!!!');
					return done(null, user);
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
			secretOrKey: 'wt_secret_abcd1234',
		},
		(jwtPayload, done) => {
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
