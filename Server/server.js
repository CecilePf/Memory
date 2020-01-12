var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Appel de notre model
var GameTime = require('./models/gameTime.model');

// Permet de récupérer la requête dans req.body
app.use(bodyParser.json());
// permet de servir nos fichiers statiques
app.use(express.static('../Client'));

// Connexion à la base de donnée MongoDB

// Connexion à la base de données
// Si mongoDB est installé en local :
// mongoose.connect('mongodb://localhost/db_memory', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   }, function(err) {
//   if (err) {
//     throw err;
//   } else {
//     // On s'assure ici que tout est ok
//     console.log("MongoDB OK !");
//   }
// });

// Sinon :
// ici on se connecte à la base de données en ligne
mongoose.connect('mongodb+srv://admin:admin@cluster0-cac6v.mongodb.net/memory_db?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  }, function(err) {
	if (err) {
		throw err;
	} else {
		console.log("MongoDB OK !");
	}
});

// Route de notre API, qui va se charger d'enregistrer les données à chaque partie gagnée
app.post('/api/save', function(req, res) {
  // Création d'un nouveau document destiné à la DB
  var newGameTime = new GameTime(req.body);

  // enregistrement dans la DB
  newGameTime.save(function(err, result) {
    if (err) {
      res.send('error : ', err);
    } else {
      res.send(result);
    }
  });
  // La fonction save peut prendre en paramètre une fonction de callback :
  // elle sera executée lorsque le save en db sera fait.
});

// Route pour récupérer le temps record
app.get('/api/times', function(req, res) {
  var newTime = 200;
  var name = '';
  GameTime.find({}, function(err, result) {
    // Fonction exécutée une fois que les résultats sont trouvés. On cherche le meilleur temps :
    result.forEach(function(time) {
      if (time.seconds < newTime) {
        newTime = time.seconds;
        name = time.name;
      }
    });
    // On renvoie le meilleur temps au client
    res.status(200).send({name, newTime});
  });

});

// Ici on lance le serveur sur le port 3000
app.listen(3000);