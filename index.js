const express = require('express'),
	morgan = require('morgan'),
	fs = require('fs'), // import built in node modules fs and path
	path = require('path');

let top10Movies = [
	{
		title: 'Superman',
		actor: 'Henry Cavill',
	},
	{
		title: 'Lord of the Rings',
		author: 'Elijah Wood',
	},
	{
		title: 'Batman',
		author: 'Christian Bale',
	},
	{
		title: 'Ironman',
		actor: 'Robert Downey Jr',
	},
	{
		title: 'Spiderman',
		author: 'Tom Holland',
	},
	{
		title: 'Bourne Supremacy',
		author: 'Matt Damon',
	},
	{
		title: 'Star Wars',
		author: 'Harrison Ford',
	},
	{
		title: 'Thor',
		author: 'Chris Hemsworth',
	},
	{
		title: 'Hulk',
		actor: 'Mark Buffalo',
	},
	{
		title: 'Black Widow',
		author: 'Scarlett Johansson',
	},
	{
		title: 'Wonder Woman',
		author: 'Gal Gabot',
	},
];

const app = express();

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));
// Serving Static Files
app.use(express.static('public'));

// GET requests
app.get('/', (req, res) => {
	res.send('Welcome to TheMovie!');
});

// Following code is replaced by: app.use(express.static('public'));
// app.get('/documentation', (req, res) => {
//   res.sendFile('public/documentation.html', { root: __dirname });
// });

app.get('/movies', (req, res) => {
	res.json(top10Movies);
});

// Error Handling
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Unexpected Error. Please Try Again Later.');
});

app.listen(8080, () => {
	console.log('Your app is listening on port 8080.');
});
