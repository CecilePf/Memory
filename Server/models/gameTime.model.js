var mongoose = require('mongoose');

var gameTimeSchema = new mongoose.Schema({
	name: String,
	seconds : Number,
});

// Je récupère mon model je l'ajoute à ma db en lui donnant un nom
var GameTime = mongoose.model('GameTime', gameTimeSchema);
// Export de mon model
module.exports = GameTime;