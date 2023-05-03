const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	actors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Actor' }],
	genre: {
		name: String,
		description: String,
	},
	director: {
		name: String,
		bio: String,
		birth: String,
		death: String,
	},
	imageURL: String,
	featured: Boolean,
	rating: Number,
	releaseYear: Number,
});

let userSchema = mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	userName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	birthDate: Date,
	favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

let actorSchema = mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	imageURL: String,
	birthDate: Date,
});

let Movie = mongoose.model('Movie', movieSchema);
let Actor = mongoose.model('Actor', actorSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.Actor = Actor;
module.exports.User = User;
