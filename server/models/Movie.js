const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const MovieSchema = new Schema({
    imdb_id: {
      type: String,
      required: true
    },
    moviePath: {
      type: String
    },
    torrent_url: {
      type: String,
      required: true
    },
    lastPlayedDate: {
      type: Date,
      required: true
    },
    downloading: {
      type: Boolean,
      required: true
    }
});

module.exports = Movie = mongoose.model("movies", MovieSchema);