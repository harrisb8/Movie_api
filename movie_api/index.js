const express = require('express'),
  bodyParser = require('body-parser'),       
  uuid = require('uuid');

  morgan = require('morgan'),
  app = express(),      
  mongoose = require('mongoose');
  Models = require('./models.js');
        
  Movies = Models.Movie;
  Users = Models.User;
  Genres = Models.Genre;
  Directors = Models.Director;

  mongoose.connect('mongodb://localhost:27017/myFlixDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true 
  });

    

     
    app.use('/documentation.html', express.static('public'));

    app.use(morgan('common'));
    
    app.use(bodyParser.json());
    

//---------Movie Requests--------



    app.get('/movies', (req, res) => {
        Movies.find()
          .then((movies) => {
              res.status(201).json(movies);
          })
          .catch((err) => {
              console.error(err);
              res.status(500).send("Error: " + err);
          });
    });

    app.get('/movies/:title', (req, res) => {
        Movie.findOne({ Title: req.params.Title })
          .then((movies) => {
             res.status(201).json(movies);
          })
          .catch((err) => {
              console.error(err);
              res.status(500).send("Error: " + err);
          });
    });


    app.get('/movies/directors/:name', (req, res) => {
        let moviesByDirector = movies.filter( function(movie){ return movie.director.name === req.params.name} )
        res.json(moviesByDirector);
    });

    app.get('/movies/genre/:name', (req, res) => {
        let moviesByGenre = movies.filter( function(movie){ return movie.genre === req.params.name} )
        res.json(moviesByGenre);
    });
  

    app.post('/movies', (req, res) => {
        let newMovie = req.body;

        if(!newMovie.title) {
            const message = 'Missing title in request body';
            res.status(400).send(message);
        }else {
            newMovie.id = uuid.v4();
            movies.push(newMovie);
            res.status(201).send(newMovie);
        }
    });

    app.delete('/movies/remove/:title', (req, res) => {
        res.send('Successful delete request returning list with movies removed that were deleted');
    });

    //--------User requests--------

    app.get('/users', (req, res) => {
        Users.find()
            .then(function (users) {
                res.status(201).json(users);
            })
            .catch(function (err) {
                console.error(err);
                res.status(500).send("Error:" + err);
            });
    });

    app.post('/users', (req, res) => {
       Users.findOne({Username: req.body.Username })
         .then((user) => {
             if (user) {
                 return res.status(400).send(req.body.Username + "already exists")
             } else {
                 Users.create({
                     Username: req.body.Username,
                     Password: req.body.Password,
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
    });

    app.put('/users/:username', (req, res) => {
        let newData = req.body;

        let user = user.find((user) => { return user.username === req.params.username});
    
        if (newData.email) {
            user.email = newData.email;
        }
        if (newData.password) {
            user.passowrd = newData.password;
        }
        if (newData.birthday) {
        user.birthday = newData.birthday;
    }
        res.json({user})
    });


    app.delete('/users/delete/:id', (req, res) => {
        let user = user.find((user) => { return user.id === req.params.id});

            if (user) {
                user = user.filter( (user) => { return user.id !== req.params.id});
                res.status(201).send('User' + req.params.id + 'was deleted.');
            }else {
                res.status(201).send('User not found.');
            }
    });



    app.get('/', (req, res) => {
        res.send('Welcome to My Flix');
    });

    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    
    app.listen(8080, () => {
        console.log('Your app is listening on port 8080.');
    });

    
    