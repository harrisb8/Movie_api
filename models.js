const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * This is the format for how movies will be displayed
 * @param {string} 
 * @returns Title, Description and Genre
 * Each movie will contain the Title, Description and Genre of the movie
 * Genre will have the category along with a description of its type
 * Director will contain the name and bio of the director for that movie
 * Actors will have an image 
 */
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

/**
 * Users profiles must have
 * @param {string}
 * @returns username, password, email, birthday and favorite movies 
 */
let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref:'Movie' }]
});

/**
 * @param {*} password 
 * @returns 
 */
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};


/**
 * 
 * @param {*} password 
 * @returns login if password is validated
 */
userSchema.methods.validatePassword = function(password)
{
    return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
