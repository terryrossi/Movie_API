# TheFlix

- ### Objective

_To build the server-side component of a “movies” web application. The web
application will provide users with access to information about different
movies, directors, and genres. Users will be able to sign up, update their
personal information, and create a list of their favorite movies._

- ### Context

It’s no longer enough for a JavaScript developer to be skilled in frontend development alone.
It’s become essential to be able to interface with and even create our own APIs. For this reason, throughout this Achievement, I've created a REST API for an application called “TheFlix”
that interacts with a database that stores data on different movies. In this project, I’ll build
the client-side component of this application using REACT and Redux. I’ll then have a complete web application (client-side and server-side) built using full-stack JavaScript technologies to showcase in my portfolio.

The project demonstrates my knowledge of full-stack JavaScript development, including APIs, web server, frameworks, databases, business logic, authentication, data security, and more.

#### The complete tech stack is known as the MERN (MongoDB, Express, React, and Node.js) stack.

### The 5 Ws

- Who the immediate users will be (frontend developers) who’ll work on the client-side for the
  application based on what’s been documented on the server-side (in this case, the developer
  is also me!). We should also consider the users of the TheFlix application. These will be
  movie enthusiasts who enjoy reading information about different movies.

- What—The complete server-side of the web application, including the server, business logic,
  and business layers of the application. It will consist of a well-designed REST API and
  architected database built using JavaScript, Node.js, Express, and MongoDB. The REST API
  will be accessed via commonly used HTTP methods like GET, POST, PATCH, etc. Similar methods
  (CRUD) will be used to retrieve data from your database and store that data in a non-relational
  way.

- When—Whenever users of TheFlix are interacting with the application, the server-side of the
  application will be in use, processing their requests and performing operations against the
  data in the database. These users will be able to use the TheFlix application whenever they like
  to read information about different movies or update their user information, for instance, their
  list of “Favorite Movies.”

- Where—The application will be hosted online. The TheFlix application itself is responsive and
  can therefore be used anywhere and on any device, giving all users the same experience.

- Why—Movie enthusiasts want to be able to access information about different movies, directors,
  and genres. The server-side of the TheFlix application will ensure they have access to this
  information, that their requests can be processed, and that all necessary data can be stored.

### Design Criteria

#### User Stories

- As a user, I want to be able to receive information on movies, directors, and genres so that I
  can learn more about movies I’ve watched or am interested in.
- As a user, I want to be able to create a profile so I can save data about my favorite movies.
  Feature Requirements
  The feature requirements below were extracted from the user stories listed above. Your project will
  only be approved if the following “essential” feature requirements are implemented in your
  Achievement project.
  Essential Features
- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL, whether it’s featured or not) about a
  single movie by title to the user
- Return data about a genre (description) by name/title (e.g., “Thriller”)
- Return data about a director (bio, birth year, death year) by name
- Allow new users to register
- Allow users to update their user info (username, password, email, date of birth)
- Allow users to add a movie to their list of favorites
- Allow users to remove a movie from their list of favorites
- Allow existing users to deregister

#### Optional Features

- Allow users to see which actors star in which movies
- Allow users to view information about different actors
- Allow users to view more information about different movies, such as the release date and
  the movie rating
- Allow users to create a “To Watch” list in addition to their “Favorite Movies” list

Technical Requirements

- The API must be a Node.js and Express application.
- The API must use REST architecture, with URL endpoints corresponding to the data
  operations listed above
- The API must use at least three middleware modules, such as the body-parser package for
  reading data from requests and morgan for logging.
- The API must use a “package.json” file.
- The database must be built using MongoDB.
- The business logic must be modeled with Mongoose.
- The API must provide movie information in JSON format.
- The JavaScript code must be error-free.
- The API must be tested in Postman.
- The API must include user authentication and authorization code.
- The API must include data validation logic.
- The API must meet data security regulations.
- The API source code must be deployed to a publicly accessible platform like GitHub.
- The API must be deployed to Heroku.

#### Project Deliverables

- Set up a project directory
- Practice writing Node.js syntax
- Create a “package.json” file
- Import all necessary packages into project directory
- Define project dependencies
- Route HTTP requests for the project using Express
- Define the endpoints for the REST API
- Create a relational (SQL) database for storing movie data using PostgreSQL
- Recreate the relational (SQL) database as a non-relational (NoSQL) database using
  MongoDB
- Model the business logic using Mongoose
- Implement authentication and authorization into the API using basic HTTP authentication
  and JWT (token-based) authentication
- Incorporate data validation logic into the API
- Implement data security and storage controls
- Host the project on the web using Heroku

#### Documentation with JSDoc
