$(document).ready(function() {

	var idCheckArray = [];
	var counter = 0;
	var end = 0; // Pour voir si toutes les paires sont trouvées
	var fields = document.querySelectorAll(".back");

	// Progressbar
	var width = 100;
	var progressbar = document.getElementById("myBar");
	var sec = 200;

	// firstClick va nous servir à détecter le 1er clic pour lancer le timer
	firstClick = true;

	var cards = [
		{
	    name: "img1",
	    img: "/imgs/1.png",
	    id: 1,
		},
		{
	    name: "img2",
	    img: "/imgs/2.png",
	    id: 2
		},
		{
	    name: "img3",
	    img: "/imgs/3.png",
	    id: 3
		},
		{
		  name: "img4",
		  img: "/imgs/4.png",
		  id: 4
		},
		{
		  name: "img5",
		  img: "/imgs/5.png",
		  id: 5
		},
		{
	    name: "img6",
	    img: "/imgs/6.png",
	    id: 6
		},
		{
	    name: "img7",
	    img: "/imgs/7.png",
	    id: 7
		},
		{
	    name: "img8",
	    img: "/imgs/8.png",
	    id: 8
		},
		{
		  name: "img9",
		  img: "/imgs/9.png",
		  id: 9
		},
		{
	    name: "img10",
	    img: "/imgs/10.png",
	    id: 10
		},
		{
	    name: "img11",
	    img: "/imgs/11.png",
	    id: 11
		},
		{
	    name: "img12",
	    img: "/imgs/12.png",
	    id: 12
		},
		{
	    name: "img13",
	    img: "/imgs/13.png",
	    id: 13
		},
		{
	    name: "img14",
	    img: "/imgs/14.png",
	    id: 14
		},
		{
	    name: "img15",
	    img: "/imgs/15.png",
	    id: 15
		},
		{
	    name: "img16",
	    img: "/imgs/16.png",
	    id: 16
		},
		{
	    name: "img17",
	    img: "/imgs/17.png",
	    id: 17
		},
		{
	    name: "img18",
	    img: "/imgs/18.png",
	    id: 18
		},
	];

	// On double notre tableau de cartes
	cardsArray = $.merge(cards, cards);

	var timer;

	function initTimer() {
		progressbar.style.width = width + "%";
	  	// Décrémentation
	  	width -= 0.5;
	  	sec --;
	  	// Quand le timer est à 0, c'est perdu
	  	if (width == 0) {
		  	clearInterval(timer);
	   	 	Swal.fire({
				  title: 'You lose.',
				  text: "Perdu :(",
				  icon: 'warning',
				  confirmButtonColor: '#3085d6',
				  confirmButtonText: 'Ok'
				}).then((result) => {
				    restart();
				});
   		}
	}

	function startTimer() {
   		timer = setInterval(initTimer, 1000);
 	}

	function cardClicked() {
		// On lance le timer au 1er clic sur une carte
		if (firstClick) {
			firstClick = false;
			startTimer();
		}
		// Si on clique sur une carte déjà retournée, on sort
		if ($(this).find(".inner-wrap").hasClass("flipped")) {
			return;
		}
		// On met la classe flipped sur notre carte cliquée
		$(this).find(".inner-wrap").addClass("flipped");
		// On met le data-id de la carte cliquée dans un tableau
		idCheckArray.push($(this).attr("data-id"));

		// Si on a cliqué sur 2 cartes, on va les vérifier
		if (idCheckArray.length === 2) {
			check();
		}

	}

	function restart() {
		// Réinitialisation des variables
		sec = 200;
		firstClick = true;
		idCheckArray = [];
		counter = 0;
		end = 0;
		width = 100;
		progressbar.style.width = width + "%";

		// On relance le jeu
		startGame();
	}

	function checkEnd() {
		if (end === 36) { // Toutes les paires sont trouvées
			var seconds = (200 - sec);
			// Stop timer
			clearInterval(timer);
			Swal.fire({
				title: 'Votre nom : ',
  				input: 'text',
  				confirmButtonText: 'Ok',
			}).then((result) => {
					var data = {
						name : result.value,
						seconds: seconds
					}
					save(data);
				});
			restart();
		}
	}

	// Fonction pour mélanger les cartes
	function shuffleArray(array) {
	  for (var i = array.length - 1; i > 0; i--) {
	      var j = Math.floor(Math.random() * (i + 1));
	      var temp = array[i];
	      array[i] = array[j];
	      array[j] = temp;
	  }
	  return array;
	}

	function startGame() {
		initTimer();
		getTimes();
		buildHTML();
	}

	function buildHTML() {
		var arr = shuffleArray(cardsArray);
    var frag = '';
    arr.forEach(function(card){
        frag += '<div class="field" data-id="'+ card.id +'"><div class="inner-wrap">\
        <div class="front"><img src="'+ card.img +'"\
        alt="'+ card.name +'" /></div>\
        <div class="back"></div></div>\
        </div>';
    });

    // On envoie notre html dans le DOM
    $('.table').html(frag);
    // On ajoute un event au clic
    $(".field").on("click", cardClicked);
	}

	function check() {
		// On désactive le fait de pouvoir cliquer sur une 3ème carte
		$(".field").off("click", cardClicked);

		setTimeout(function(){
			// pas de match
			if (idCheckArray[0] !== idCheckArray[1]) {
				// On récupère les 2 cartes sur lesquelles on a cliqué dans le DOM
				var card1 = $('.field[data-id="'+idCheckArray[0]+'"]');
				var card2 = $('.field[data-id="'+idCheckArray[1]+'"]');

				// On leur retire la classe flipped pour les remettre face cachée
				card1.find(".inner-wrap").removeClass("flipped");
				card2.find(".inner-wrap").removeClass("flipped");

				// Réinitialisation du tableau d'Ids
				idCheckArray = [];
				// Et on remet en place le clic
				$(".field").on("click", cardClicked);
			} else {
				end += 2; // On augmente le nombre de cartes trouvées, on se rapproche de la fin

				idCheckArray = [];
				checkEnd();
				$(".field").on("click", cardClicked);
			}
		}, 800);
	}

	// Permet de récupérer le temps record
	function getTimes() {
		var request = new XMLHttpRequest();
		request.open('GET', '/api/times', true);
		request.responseType = 'json';

		request.onreadystatechange = function() {
			var name = '';
       // Quand tout est ok (state 4 et status 200) :
       if (this.readyState == 4 && this.status == 200) {

       	// On peut utiliser le retour de notre API dans le DOM
       	$('.record').html('Record : ' + this.response.newTime + ' secondes');

       	// On vérifie qu'il y a un nom avec ce temps
       	if (this.response.name != "") {
       		name = this.response.name;
       		$('.record').append(' (' + name + ')');
       	}
       }
     }
		request.send();
	}

	// Fonction appelée en fin de partie gagnée
	function save(data) {
		// On crée notre requête
		var xhr = new XMLHttpRequest();
		// C'est une requête POST
		xhr.open('POST', '/api/save', true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.send(JSON.stringify(data));
		// On relance le jeu
		restart();
	}

	startGame();

});