const express = require('express'),
  bodyParser = require('body-parser'),       
  uuid = require('uuid');
const { Movie } = require('./models.js');
const { check, validationResult } = require('express-validator');

  morgan = require('morgan'),
  app = express(),      
  mongoose = require('mongoose');
  Models = require('./models.js');
        
  Movies = Models.Movie;
  Users = Models.User;
 

  mongoose.connect('mongodb+srv://test_user:test_user@cluster0.pzp56.mongodb.net/myFlixDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  });

 /* mongoose.connect( process.env.CONNECTION_URI, 
  { useNewUrlParser: true, useUnifiedTopology: true }); */

   // Adding new comments
     
    app.use('/documentation.html', express.static('public'));

    app.use(morgan('common'));
    
    app.use(bodyParser.json());

    app.use(bodyParser.urlencoded({ extended: true }));

    //------Added Cross Origin Resource Sharing-----
    /**
     * This function allowedOrigins adds Cross Origin Resource Sharing
     * @param {} origin 
     * If the origin callback does not meet one of the allowed origins
     * @return  error message "The CORS policy for this application does not allow access from orgin"
     * The callback must have the correct passport/ authentication in order to 
     * @return data for api
     */
    const cors = require('cors');
    let allowedOrigins = [ 'http://localhost:8080', 'http://localhost:1234', 'https://stormy-taiga-55813.herokuapp.com', 'https://harrisb8.github.io/myFlix-Angular-client', 'https://shimmering-profiterole-05f0c8.netlify.app'];
    app.use(cors({
        origin: (origin, callback) => {
            if(!origin) return callback(null, true);
            if(allowedOrigins.indexOf(origin) === -1){
                let message = 'The CORS policy for this application does not allow access from orgin ' + origin;
                return callback(new Error(message ), false);
            }
            return callback(null, true);
        }
    }));

     require('./auth')(app);
    const passport = require('passport');
    require('./passport');
    

//---------Returns Movies Home Page--------
/**
 * This endpoint returns users to the movies Home Page
 * app.get uses / endpoint to request that the user is 
 * @returns "Welcome to My Flix"
 */
app.get('/', (req, res) => {
    res.send('Welcome to My Flix');
});

//----Returns all movies----
/**
 * This endpoint takes users the the list of movies
 * app.get uses /movies endpoint with the token authentication to request access to the list of movies
 * if successful
 * @return list of movies
 * otherwise
 * @return error message with the catch method
 */
   // app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
       app.get('/movies', function (req, res) {
        Movies.find()
         // .then((movies) => {
             .then(function (movies) {
              res.status(201).json(movies);
          })
          //.catch((err) => {
              .catch(function (error) {
              console.error(err);
              res.status(500).send("Error: " + err);
          });
    });

//-----Returns movies by Title-----
/**
 * This Function returns movies by Title
 * app.get endpoint uses /movies/:Title along with token authentication to access movie titles
 * @param {} title
 * user will be able to find a movie based on the title name
 * @return movie
 * If there is an error with authentication the catch 
 * @param {} err
 * @return error status
 */
    app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
        Movies.findOne({ Title: req.params.Title })
          .then((movie) => {
             res.json(movie);
          })
          .catch((err) => {
              console.error(err);
              res.status(500).send("Error: " + err);
          });
    });

//------Returns a list of all movie directors----
/**
 * Returns a list of all movie directors
 * app.get uses /directors endpoint and token to authenticate users request
 * @param {} Movies
 * @returns movie directors
 * If there is an error in authentication
 * @returns error with the catch method
 */
    app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
        Movies.find()
        .then( movies => {
            let directors = movies.map(movie => movie.Director);
            res.status(201).json(directors)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
  });
    
//-------Returns a list of all genres------
/**
 * Returns a list of all movie genres
 * app.get uses /genres endpoint and token to authenticate users request
 * @param {} Movies
 * @returns movie genres
 * If there is an error in authentication
 * @returns error with the catch method
 */
    app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
        Movies.find()
        .then( movies => {
            let Genre = movies.map(movie => movie.Genre);
            res.status(201).json(Genre)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
  });
    
//--------Returns a movie by genre------
/**
 * Returns a list of genre for a movie chosen by the user
 * app.get uses /movies/genre/:name endpoint and token to authenticate users request
 * @param {} Genre.Name
 * @returns movie genre
 * If there is an error in authentication
 * @returns error with the catch method
 */
    app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
       Movie.find({"Genre.Name": req.params.name})
       .then( movies => {
           res.status(201).json(movies)
       })
       .catch((err) => {
           console.error(err);
           res.status(500).send("Error: " + err);
       });
    });

    app.get('/movies/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
        Movie.find({"Director.Name": req.params.name})
        .then( movies => {
            res.status(201).json(movies)
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
     });
  
    //--------User requests--------

    //------Show User List------
    /**
     * This function shows user list
     * app.get uses the /users endpoint and token to authenticate the user 
     * @param {} users
     * @returns user
     * If authenticate fails, catch 
     * @returns error
     */
    app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
        Users.find()
            .then(function (users) {
                res.status(201).json(users);
            })
            .catch(function (err) {
                console.error(err);
                res.status(500).send("Error:" + err);
            });
    });

    //------Adding a new User  with validation-----
    /**
     * Signning up a new User with validation
     * use app.post to add a new user to the /users endpoint
     * Users will be required to provide a username with a minumin of 5 characters, password and email address
     * If there are errors in the validation procress 
     * @returns error
     * If user picks a username or password that is in use 
     * @returns "already exists"
     * Otherwise function will 
     * @return new created username, password, email and birthdate
     */
    app.post('/users',
      [
          check('Username', 'Username is required').isLength({min: 5}),
          check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
          check('Password', 'Password is required').not().isEmpty(),
          check('Email', 'Email does not appear to be valid').isEmail()
      ], (req, res) => {
          let errors = validationResult(req);

          if (!errors.isEmpty()) {
              return res.status(422).json({ errors: errors.array()
            });
          }
       let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({Username: req.body.Username })
        .then((user) => {
             if (user) {
                 return res.status(400).send(req.body.Username + " already exists")
             } else {
                 Users.create({
                     Username: req.body.Username,
                     Password: hashedPassword,
                     Email: req.body.Email,
                     Birthday: req.body.Birthday,
                 })
                    .then((user) => {
                        res.status(201).json(user);
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send("Error: " + error);
                    });
             }
         })
         .catch((error) => {
             console.error(error);
             res.status(500).send('Error: ' + error);
         });
    });


    //-----Updating a users information if user updates one they have to update all----
    /**
     * Updating a users information
     * app.put uses /user/:id endpoint with authentication to access users profile
     * @param {} user
     * @returs user information
     * User can then update information for their profile
     * If there is an error
     * @return error message
     */
    app.put('/users/:id', passport.authenticate('jwt', { session: false }),
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ],
    (req, res) => {
       Users.findOne({_id: req.params.id })
       .then((user) => {
           if (!user) {
               return res.status(400).send(req.body.Username + " does not exist")
           } else {
               let updateObject = {};
               if (req.body.Username) {
                   updateObject.Username = req.body.Username;
               }
               if (req.body.Password) {
                   updateObject.Password = req.body.Password;
               }
               if (req.body.Email) {
                   updateObject.Email = req.body.Email;
               }
               if (req.body.Birthday) {
                   updateObject.Birthday = req.body.Birthday;
               }
               Users
               .findByIdAndUpdate({_id: req.params.id}, updateObject, {new: true})
               .then((user) => {
                   res.status(201).json(user);
               })
               .catch((error) => {
                   res.status(500).send("Error: " + error);
               });
           }
       })
    });


//--------Delete an existing user-----
/**
 * Delete an existing user
 * app.delete uses /users/:id and token authenticate to first pull up a user profile to be removed
 * @param {} user
 * @return "does not exist" if there is an error
 * otherwise the user is able to fine ones profile and delete it
 */
    app.delete('/users/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
        Users.findOne({_id: req.params.id })
        .then((user) => {
            if (!user) {
                return res.status(400).send(req.body.Username + " does not exist")
            } else {
                Users
                .findOneAndDelete({_id: req.params.id})
                .then((user) => {
                    res.status(201).json(user);
                })
                .catch((error) => {
                    res.status(500).send("Error: " + error);
                });
            }
        })
    });

    //------Add Movies to Users favorites-----
    /**
     * Add Movies to Favorites
     * app.post uses users/:id/movies/:Title endpoint along with token authentication
     * @param {} id
     * @return favorite movies pushed to users account
     * If there is an error
     * @return error
     */
    app.post('/users/:id/movies/:Title',  passport.authenticate('jwt', { session: false }), (req, res) => {
        // find the movie by title
        Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
           Users
           .findOneAndUpdate({_id: req.params.id }, {
               // push that movie._id variable here
               //  $push: { FavoriteMovies: movie._id}
             $push: { FavoriteMovies: movie._id }
           },
           { new: true }, // update is returned  
            (err, user) => {
               if (err) {
                   console.error(err);
                   res.status(500).send('Error: ' + err);
               } else {
                   res.json(user);
               }
           });
        })
        // store that movie in some movie variable
       
    });

    //------Delete Movies from Users Favorites-----
      /**
     * Delete Movies from Favorites
     * app.post uses users/:id/movies/:Title endpoint along with token authentication
     * @param {} id
     * @return favorite movies removed from users account
     * If there is an error
     * @return error
     */
    app.delete('/users/:id/movies/:Title',  passport.authenticate('jwt', { session: false }), (req, res) => {
        Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
           Users
           .findOneAndUpdate({_id: req.params.id }, {
               // push that movie._id variable here
               //  $push: { FavoriteMovies: movie._id}
             $pull: { FavoriteMovies: movie._id }
           },
           { new: true }, // update is returned  
            (err, user) => {
               if (err) {
                   console.error(err);
                   res.status(500).send('Error: ' + err);
               } else {
                   res.json(user);
               }
           });
        })
    });
   
    
    /**
     * This is a function that shows if something is not working
     * @return "Something broke!"
     */
    

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    const port = process.env.PORT || 8080;
    app.listen(port, '0.0.0.0',() => {
        console.log('Listening on Port ' + port);
    });

    
    
