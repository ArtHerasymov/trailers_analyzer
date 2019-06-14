const mongoose = require('mongoose');

const MovieSchema = mongoose.Schema({
    movie: {},
    revenue: ''
});
const Movie = module.exports = mongoose.model('Movie', MovieSchema);

module.exports.serializeMovieObject = function(movieObject, callback) {
    movieObject.save(callback);
};


