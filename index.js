require('dotenv').config();

const express = require('express'),
	morgan = require('morgan'),
	fs = require('fs'), // import built in node modules fs and path
	path = require('path'),
	bodyParser = require('body-parser'),
	uuid = require('uuid');

const { title } = require('process');

const { body, check, validationResult } = require('express-validator');

// MongoDB Connection:
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Actors = Models.Actor;
const Users = Models.User;

console.log(process.env.DATABASE_URL);

mongoose.connect('mongodb://localhost:27017/MoviesDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
// const db = mongoose.Connection;
// db.on('error', (error) => console.error(error));
// db.once('open', () => console.log('Connected to Database'));

const app = express();

// CORS Security
const cors = require('cors');
// app.use(cors());
let allowedOrigins = ['http://localhost:8080/', 'http://localhost:8080/movies'];

app.use(
	cors({
		origin: (origin, done) => {
			if (!origin) return done(null, true);
			if (allowedOrigins.indexOf(origin) === -1) {
				// If a specific origin isn’t found on the list of allowed origins
				let message =
					'The CORS policy for this application doesn’t allow access from origin ' + origin;
				return done(new Error(message), false);
			}
			return done(null, true);
		},
	})
);

app.use(bodyParser.json());
// OR SHOULD IT BE... ?!? (based on exercise 2.9 Authentication Logic)
// app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

// Serving Static Files. No need app.get('/file.html, (req,res)...)
// as long as file.html is in public folder.
app.use(express.static('public'));
// Which is why the Following code is not required anymore
// app.get('/documentation', (req, res) => {
//   res.sendFile('public/documentation.html', { root: __dirname });
// });

// GET requests
app.get('/', (request, response) => {
	response.send('Welcome to TheFlix!');
});

// Returns all Movies
app.get(
	'/movies',
	passport.authenticate('jwt', {
		session: false,
	}),
	(request, response) => {
		Movies.find()
			.then((movies) => {
				if (movies) {
					response.status(201).json(movies);
				} else {
					response.status(404).send(`Couldn't Find any Movies`);
				}
			})
			.catch((err) => {
				console.error(err);
				response.status(500).send('Error: ' + err);
			});
	}
);

// Returns 1 movie by title
app.get(
	'/movies/:name',
	passport.authenticate('jwt', {
		session: false,
	}),
	(request, response) => {
		Movies.findOne({ title: request.params.name })
			.then((movie) => {
				if (movie) {
					response.status(201).json(movie);
				} else {
					response.status(404).send(`Couldn't Find Movie: ${request.params.name}`);
				}
			})
			.catch((err) => {
				console.error(err);
				response.status(500).send('Error: ' + err);
			});
	}
);

// Returns Data about a Genre
app.get(
	'/genres/:genre',
	passport.authenticate('jwt', {
		session: false,
	}),
	(request, response) => {
		Movies.findOne({ 'genre.name': request.params.genre })
			.then((movie) => {
				if (movie) {
					response.status(201).json(movie);
				} else {
					response.status(404).send(`Couldn't Find Genre: ${request.params.genre}`);
				}
			})
			.catch((err) => {
				response.status(500).send('Error: ' + err);
			});
	}
);

// Returns data about Director by Director Name
app.get(
	'/director/:directorName',
	passport.authenticate('jwt', {
		session: false,
	}),
	(request, response) => {
		Movies.findOne({ 'director.name': request.params.directorName })
			.then((movie) => {
				if (movie) {
					response.status(201).json(movie);
				} else {
					response.status(404).send(`Couldn't Find Director: ${request.params.directorName}`);
				}
			})
			.catch((err) => {
				response.status(500).send('Error: ' + err);
			});
	}
);

// Returns a list of Users
app.get(
	'/users/',
	passport.authenticate('jwt', {
		session: false,
	}),
	(request, response) => {
		Users.find()
			.then((users) => {
				if (users) {
					response.status(201).json(users);
				} else {
					response.status(404).send(`Couldn't Find any Users`);
				}
			})
			.catch((err) => {
				console.error(err);
				response.status(500).send(`Error : ${err}`);
			});
	}
);

// Returns 1 User using username
app.get(
	'/users/:userName',
	passport.authenticate('jwt', {
		session: false,
	}),
	(request, response) => {
		Users.findOne({ userName: request.params.userName })
			.then((user) => {
				if (user) {
					response.status(201).json(user);
				} else {
					response.status(404).send(`Couldn't Find Username: ${request.params.userName}`);
				}
			})
			.catch((err) => {
				response.status(500).send('Error: ' + err);
			});
	}
);

// Allows User to Register

// Validation logic here for request
//you can either use a chain of methods like .not().isEmpty()
//which means "opposite of isEmpty" in plain english "is not empty"
//or use .isLength({min: 5}) which means
//minimum value of 5 characters are only allowed

app.post(
	'/users/',
	[
		check('firstName', 'First Name is Required.')
			.notEmpty()
			.isAlphanumeric()
			.withMessage('Firstname MUST ONLY contain alphanumeric chareacters.'),
		check('lastName', 'Last Name is Required.')
			.notEmpty()
			.isAlphanumeric()
			.withMessage('Lastname MUST ONLY contain alphanumeric chareacters.'),
		check('userName', 'User Name is Required.')
			.notEmpty()
			.isAlphanumeric()
			.withMessage('Username MUST ONLY contain alphanumeric chareacters.')
			.isLength({ min: 5 })
			.withMessage('Username must be at least 5 Characters Alphanumeric.'),
		check('password', 'Password is Required.')
			.notEmpty()
			.isLength({ min: 5 })
			.withMessage('Password must be at least 5 characters.'),
		check('email', 'Email does not appear to be Valid.').isEmail(),
		check('birthDate', 'Birth Date does not appear to be Valid. Format must be: yyyy-mm-dd.')
			.trim()
			.isDate()
			.optional({ checkFalsy: true }),
	],
	(request, response) => {
		let errors = validationResult(request);
		if (!errors.isEmpty()) {
			response.status(422).json({
				errors: errors.array(),
			});
		} else {
			let hashedPassword = Users.hashPassword(request.body.password);
			Users.findOne({ userName: request.body.userName })
				.then((user) => {
					if (user) {
						response.status(400).send(`User: ${request.body.userName} already exist!`);
					} else {
						Users.create({
							firstName: request.body.firstName,
							lastName: request.body.lastName,
							userName: request.body.userName,
							email: request.body.email,
							password: hashedPassword,
							birthDate: request.body.birthDate,
						})
							.then((user) => {
								response.status(201).json(user);
							})
							.catch((err) => {
								console.error(err);
								response.status(500).send(`Error: ${err}`);
							});
					}
				})
				.catch((err) => {
					console.error(err);
					response.status(500).send(`Error: ${err}`);
				});
		}
	}
);

// Allow User to Update his First name, Last name, userID and Email
app.patch(
	'/users/',
	passport.authenticate('jwt', {
		session: false,
	}),
	[
		check('firstName', 'First Name is Required.')
			.notEmpty()
			.isAlphanumeric()
			.withMessage('Firstname MUST ONLY contain alphanumeric chareacters.'),
		check('lastName', 'Last Name is Required.')
			.notEmpty()
			.isAlphanumeric()
			.withMessage('Lastname MUST ONLY contain alphanumeric chareacters.'),
		check('userName', 'User Name is Required.')
			.notEmpty()
			.isAlphanumeric()
			.withMessage('Username MUST ONLY contain alphanumeric chareacters.')
			.isLength({ min: 5 })
			.withMessage('Username must be at least 5 Characters Alphanumeric.'),
		check('password', 'Password is Required.')
			.notEmpty()
			.isLength({ min: 5 })
			.withMessage('Password must be at least 5 characters.'),
		check('email', 'Email does not appear to be Valid.').isEmail(),
		check('birthDate', 'Birth Date does not appear to be Valid. Format must be: yyyy-mm-dd.')
			.trim()
			.isDate()
			.optional({ checkFalsy: true }),
	],
	(request, response) => {
		let errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(422).json({ errors: errors.array() });
		}
		console.log('request.body._id: ' + request.body._id);

		Users.findOneAndUpdate(
			{ _id: request.body._id },
			{
				$set: {
					firstName: request.body.firstName,
					lastName: request.body.lastName,
					userName: request.body.userName,
					email: request.body.email,
					birthDate: request.body.birthDate,
				},
			},
			{ new: true } // This line makes sure that the updated document is returned
		)
			.then((user) => {
				if (!user) {
					response.status(400).send(`User ${updatedUser.lastName} NOT Found`);
				} else {
					response.status(201).json(user);
				}
			})
			.catch((err) => {
				console.error(err);
				response.status(500).send(`Error: ${err}`);
			});
	}
);

// Allow User to change his password
app.patch(
	'/users/password',
	passport.authenticate('jwt', {
		session: false,
	}),
	[
		check('password', 'Password is Required.')
			.notEmpty()
			.isLength({ min: 5 })
			.withMessage('Password must be at least 5 characters.'),
	],
	(request, response) => {
		let errors = validationResult(request);
		if (!errors.isEmpty()) {
			return response.status(422).json({ errors: errors.array() });
		}

		let hashedPassword = Users.hashPassword(request.body.password);

		Users.findOneAndUpdate(
			{ _id: request.body._id },
			{
				$set: {
					password: hashedPassword,
				},
			},
			{ new: true } // This line makes sure that the updated document is returned
		)
			.then((user) => {
				if (!user) {
					response.status(400).send(`User ${updatedUser.lastName} NOT Found`);
				} else {
					response.status(201).json(user);
				}
			})
			.catch((err) => {
				console.error(err);
				response.status(500).send(`Error: ${err}`);
			});
	}
);

// Allow User to de-Register
app.delete(
	'/users/:username',
	passport.authenticate('jwt', {
		session: false,
	}),
	(request, response) => {
		Users.findOneAndRemove({ userName: request.params.username })
			.then((user) => {
				if (!user) {
					response.status(404).send(`User: ${request.params.username} NOT Found`);
				} else {
					response.status(200).send(`User: ${request.params.username} has been Deleted`);
				}
			})
			.catch((err) => {
				console.error(err);
				response.status(500).send(`Error : ${err}`);
			});
	}
);

// Allow User to Add a movie to a list of Favorites
app.post(
	'/users/:userName/favorites',
	passport.authenticate('jwt', {
		session: false,
	}),
	(request, response) => {
		let movieToAdd = request.body;

		Users.findOne({ favoriteMovies: { $in: [movieToAdd._id] } })
			.then((user) => {
				if (user) {
					response
						.status(403)
						.send(`This Movie ${movieToAdd.title} is already in your Favorite Movies`);
				} else {
					Users.findOneAndUpdate(
						{ userName: request.params.userName },
						{
							$push: {
								favoriteMovies: movieToAdd._id,
							},
						},
						{ new: true } // This line makes sure that the updated document is returned
					)
						.then((user) => {
							if (!user) {
								response.status(400).send(`User ${request.params.userName} NOT Found`);
							} else {
								response.status(201).json(user);
							}
						})
						.catch((err) => {
							console.error(err);
							response.status(500).send(`Error: ${err}`);
						});
				}
			})
			.catch((err) => {
				console.error(err);
				response.status(500).send(`Error: ${err}`);
			});
	}
);

// Allow User to remove a Movie from the list of Favorites
app.delete(
	'/users/:userName/favorites',
	passport.authenticate('jwt', {
		session: false,
	}),
	(request, response) => {
		let movieToDelete = request.body;

		Users.findOneAndUpdate(
			{ userName: request.params.userName },
			{
				$pull: {
					favoriteMovies: movieToDelete._id,
				},
			},
			{ new: true } // This line makes sure that the updated document is returned
		)
			.then((user) => {
				if (!user) {
					response.status(400).send(`User ${request.params.userName} NOT Found`);
				} else {
					response.status(201).json(user);
				}
			})
			.catch((err) => {
				console.error(err);
				response.status(500).send(`Error: ${err}`);
			});
	}
);

// Error Handling
app.use((err, request, response, next) => {
	console.error(err.stack);
	response.status(500).send('Unexpected Error. Please Try Again Later.');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
	console.log('Your app is listening on port: ' + port);
});
