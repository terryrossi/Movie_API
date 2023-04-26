const express = require('express'),
	morgan = require('morgan'),
	fs = require('fs'), // import built in node modules fs and path
	path = require('path'),
	bodyParser = require('body-parser'),
	uuid = require('uuid');
const { title } = require('process');

// MongoDB Connection:
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Actors = Models.Actor;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/MoviesDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// MOVIES OBJECT
let top10Movies = [
	{
		title: 'Superman',
		description: 'Kriptonite sucks!',
		mainActor: 'Henry Cavill',
		genre: 'Sci-Fi',
		directorName: 'John Doe',

		image: '#',
		featured: 'Yes',
	},
	{
		title: 'Lord of the Rings',
		description: 'Find the Ring or Die!',
		mainActor: 'Elijah Wood',
		genre: 'Sci-Fi',
		directorName: 'John Doe',

		image: '#',
		featured: 'Yes',
	},
	{
		title: 'Batman',
		description: 'Dark Bat!',
		mainActor: 'Christian Bale',
		genre: 'Sci-Fi',
		directorName: 'Clint Eastwood',

		image: '#',
		featured: 'Yes',
	},
	{
		title: 'Ironman',
		description: 'Funny, Rich, Succesfull and Handsome!',
		mainActor: 'Robert Downey Jr',
		genre: 'Sci-Fi',
		directorName: 'John Doe',

		image: '#',
		featured: 'Yes',
	},
	{
		title: 'Spiderman',
		description: 'Radioactive Spider!',
		mainActor: 'Tom Holland',
		genre: 'Sci-Fi',
		directorName: 'John Doe',

		image: '#',
		featured: 'Yes',
	},
	{
		title: 'Bourne Supremacy',
		description: 'Always ahead of the game!',
		mainActor: 'Matt Damon',
		genre: 'Sci-Fi',
		directorName: 'Jimmy Lewis',

		image: '#',
		featured: 'Yes',
	},
	{
		title: 'Star Wars',
		description: 'Best space ship in the Galaxy',
		mainActor: 'Harrison Ford',
		genre: 'Sci-Fi',
		directorName: 'John Doe',

		image: '#',
		featured: 'Yes',
	},
	{
		title: 'Thor',
		description: 'Thunder God!',
		mainActor: 'Chris Hemsworth',
		genre: 'Sci-Fi',
		directorName: 'John Doe',

		image: '#',
		featured: 'Yes',
	},
	{
		title: 'Hulk',
		description: 'Smash Machine!',
		mainActor: 'Mark Buffalo',
		genre: 'Sci-Fi',
		directorName: 'Jimmy Lewis',

		image: '#',
		featured: 'Yes',
	},
	{
		title: 'Black Widow',
		description: 'Fatal Beauty',
		mainActor: 'Scarlett Johansson',
		genre: 'Sci-Fi',
		directorName: 'John Doe',

		image: '#',
		featured: 'Yes',
	},
	{
		title: 'Wonder Woman',
		description: 'Last Amazon!',
		mainActor: 'Gal Gabot',
		genre: 'Sci-Fi',
		directorName: 'Clint Eastwood',
		image: '#',
		featured: 'Yes',
	},
];

// DIRECTORS OBJECT
let directors = [
	{
		name: 'John Doe',
		bio: 'kjsdfkesdmbfksdbfkesdmfbksdmfbn',
		dateOfBirth: '01-01-2000',
		dateOfDeath: null,
	},
	{
		name: 'Jimmy Lewis',
		bio: 'kjsdfkesdmbfksdbfkesdmfbksdmfbn',
		dateOfBirth: '01-01-2000',
		dateOfDeath: null,
	},
	{
		name: 'Clint Eastwood',
		bio: 'kjsdfkesdmbfksdbfkesdmfbksdmfbn',
		dateOfBirth: '01-01-2000',
		dateOfDeath: null,
	},
];
// USERS OBJECT
let users = [
	{ userId: 1, userName: 'John Black', preferedMovies: ['Superman', 'Thor'] },
	{ userId: 2, userName: 'Tom White', preferedMovies: ['Batman', 'Wonder Woman'] },
];

const app = express();

app.use(bodyParser.json());

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
	response.send('Welcome to TheMovie!');
});

// Returns all Movies
app.get('/movies', (request, response) => {
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
});

// Returns 1 movie by title
app.get('/movies/:name', (request, response) => {
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
});

// Returns Data about a Genre
app.get('/movies/genres/:genre', (request, response) => {
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
});

// Returns data about Director by Director Name
app.get('/movies/director/:directorName', (request, response) => {
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
});

// Returns a list of Users
app.get('/movies/users/all', (request, response) => {
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
});

// Allows User to Register
app.post('/movies/users/', (request, response) => {
	let newUser = request.body;
	if (!newUser.lastName) {
		response.status(400).send('The request sent is missing the User Name');
	} else {
		Users.findOne({ lastName: request.body.lastName })
			.then((user) => {
				if (user) {
					response.status(400).send(`User: ${request.body.lastName} already exist!`);
				} else {
					Users.create({
						firstName: request.body.firstName,
						lastName: request.body.lastName,
						email: request.body.email,
						password: request.body.password,
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
});

// Allow User to Update his UserName/Email
app.put('/movies/users/', (request, response) => {
	let updatedUser = request.body;

	Users.findOneAndUpdate(
		{ lastName: updatedUser.lastName },
		{
			$set: {
				email: updatedUser.email,
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
});

// Allow User to de-Register
app.delete('/movies/users/:lastname', (request, response) => {
	Users.findOneAndRemove({ lastName: request.params.lastname })
		.then((user) => {
			if (!user) {
				response.status(404).send(`User: ${request.params.lastname} NOT Found`);
			} else {
				response.status(200).send(`User: ${request.params.lastname} has been Deleted`);
			}
		})
		.catch((err) => {
			console.error(err);
			response.status(500).send(`Error : ${err}`);
		});
});

// Allow User to Add a movie to a list of Favorites
app.post('/movies/users/:lastName/favorites', (request, response) => {
	let movieToAdd = request.body;
	console.log(movieToAdd._id);
	Users.findOneAndUpdate(
		{ lastName: request.params.lastName },
		{
			$push: {
				favoriteMovies: movieToAdd._id,
			},
		},
		{ new: true } // This line makes sure that the updated document is returned
	)
		.then((user) => {
			if (!user) {
				response.status(400).send(`User ${request.params.lastName} NOT Found`);
			} else {
				response.status(201).json(user);
			}
		})
		.catch((err) => {
			console.error(err);
			response.status(500).send(`Error: ${err}`);
		});
});

// Allow User to remove a Movie from the list of Favorites
app.delete('/movies/users/:lastName/favorites', (request, response) => {
	let movieToDelete = request.body;
	console.log(movieToDelete._id);
	Users.findOneAndUpdate(
		{ lastName: request.params.lastName },
		{
			$pull: {
				favoriteMovies: movieToDelete._id,
			},
		},
		{ new: true } // This line makes sure that the updated document is returned
	)
		.then((user) => {
			if (!user) {
				response.status(400).send(`User ${request.params.lastName} NOT Found`);
			} else {
				response.status(201).json(user);
			}
		})
		.catch((err) => {
			console.error(err);
			response.status(500).send(`Error: ${err}`);
		});
});

// Error Handling
app.use((err, request, response, next) => {
	console.error(err.stack);
	response.status(500).send('Unexpected Error. Please Try Again Later.');
});

app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});
