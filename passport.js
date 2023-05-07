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
			// console.log('username: ' + username + ' password: ' + password);

			// console.log('username: ' + username + ' HASHED password: ' + hashedPassword);

			Users.findOne({ userName: username })
				.then((user) => {
					console.log('user found in passport.js ' + user);
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
			secretOrKey: 'your_jwt_secret',
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
