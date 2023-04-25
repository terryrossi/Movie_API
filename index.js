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

mongoose.connect('mongodb://localhost:27017/dbname', {
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
// Serving Static Files
app.use(express.static('public'));

// GET requests
app.get('/', (request, response) => {
	response.send('Welcome to TheMovie!');
});

// Following code is replaced by: app.use(express.static('public'));
// app.get('/documentation', (req, res) => {
//   res.sendFile('public/documentation.html', { root: __dirname });
// });

// Returns all Movies
app.get('/movies', (request, response) => {
	response.json(top10Movies);
});

// Returns 1 movie by title
app.get('/movies/:name', (request, response) => {
	response.json(
		top10Movies.find((movie) => {
			return movie.title == request.params.name;
		})
	);
});

// Returns Data about a Genre
app.get('/movies/genres/:genre', (request, response) => {
	response.send(`Sucessfull GET Request returning Data about Genre: ${request.params.genre}`);
});

// Returns data about Director by Director Name
app.get('/movies/director/:directorName', (request, response) => {
	response.json(
		directors.find((director) => {
			return director.name == request.params.directorName;
		})
	);
});

// Returns a list of Users
app.get('/movies/users/all', (request, response) => {
	response.json(users);
});

// Allows User to Register
app.post('/movies/users/', (request, response) => {
	let newUser = request.body;
	if (!newUser.userName) {
		response.status(400).send('The request sent is missing the User Name');
	} else {
		newUser.userId = uuid.v4();
		users.push(newUser);
		response.status(201).json(newUser);
	}
});

// Allow User to Update his UserName
app.put('/movies/users/', (request, response) => {
	let userToUpdate = users.find((user) => {
		return user.userId === request.body.userId;
	});
	userToUpdate.userName = request.body.userName;
	response.json(userToUpdate);
});

// Allow User to de-Register
app.delete('/movies/users/:userId', (request, response) => {
	let userToDelete = users.find((user) => {
		return user.userId === parseInt(request.params.userId);
	});
	if (userToDelete) {
		console.log('userfound', userToDelete);
		users = users.filter((user) => {
			return user.userId !== parseInt(request.params.userId);
		});
		response.send(`UserId : ${request.params.userId} has been Deleted`);
	} else {
		response.status(404).send(`Could not find userId : ${request.params.userId}`);
	}
});

// Allow User to Add a movie to a list of Favorites
app.put('/movies/users/:userId/favorites/:title', (request, response) => {
	let userToUpdate = users.find((user) => {
		return user.userId === parseInt(request.params.userId);
	});
	userToUpdate.preferedMovies.push(request.params.title);
	response.json(userToUpdate);
});

// Allow User to remove a Movie from the list of Favorites
app.delete('/movies/users/:userId/favorites/:title', (request, response) => {
	let indexOfUser = users.indexOf(
		users.find((user) => {
			return user.userId == request.params.userId;
		})
	);
	let indexOfTitle = users[indexOfUser].preferedMovies.indexOf(
		users[indexOfUser].preferedMovies.find((title) => {
			return title == request.params.title;
		})
	);
	let userToUpdate = users[indexOfUser].preferedMovies[indexOfTitle];

	if (userToUpdate) {
		users[indexOfUser].preferedMovies.splice(indexOfTitle, 1);
		response.json(users[indexOfUser]);
	} else {
		response
			.status(404)
			.send(
				`${users[indexOfUser].userName} doesn't have ${request.params.title} in his/her Favorites`
			);
	}
});

// Error Handling
app.use((err, request, response, next) => {
	console.error(err.stack);
	res.status(500).send('Unexpected Error. Please Try Again Later.');
});

app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});
