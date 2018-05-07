var questionsList = [];
var points = {};
loadXMLDoc();

////////////////////////////////////////////////////////////////////////////////
///////////////////////// Premier chargement de page ///////////////////////////
////////////////////////////////////////////////////////////////////////////////
$('#start-btn').click(function() {
  questionsList = randomizeArray(questionsList);

  points.rouge = 0;
  points.vert = 0;
  points.bleu = 0;
  points.jaune = 0;

  $('#start').hide();
  $('#btn-suivant').hide();

  document.getElementById("current").innerHTML = 1;
  document.getElementById("total").innerHTML = questionsList.length;

  var firstQuestion = questionsList[0];
  document.getElementById("question-titre").innerHTML = "<p>" + firstQuestion.titre + "</p>";
  document.getElementById("question-texte").innerHTML = firstQuestion.texte.replace(/[\n\r]/g, '<br/>');
  document.getElementById("question-couleur").innerHTML = firstQuestion.couleur;

  $('#questions').fadeIn();
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////// Sélection d'une réponse /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
$('#reponse div.btn').click(function() {
  $('#reponse div.reponse-selected').removeClass('reponse-selected');
  $(this).addClass('reponse-selected');
  $('#btn-suivant').fadeIn();
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// Suivant /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
$('#btn-suivant').click(function() {
  $('#content').hide();

  updatePoints();
  var current = parseInt(document.getElementById("current").innerHTML);

  // S'il reste des questions
  if (current < questionsList.length) {
    $('#reponse div.reponse-selected').removeClass('reponse-selected');
    $('#btn-suivant').hide();
    document.getElementById("current").innerHTML = current + 1;

    var nextQuestion = questionsList[current];
    document.getElementById("question-titre").innerHTML = "<p>" + nextQuestion.titre + "</p>";
    document.getElementById("question-texte").innerHTML = nextQuestion.texte.replace(/[\n\r]/g, '<br/>');
    document.getElementById("question-couleur").innerHTML = nextQuestion.couleur;

    $('#content').fadeIn();
  }

  // Resultats
  else {
    $('#questions').hide();

    document.getElementById("result-rouge").innerHTML = points.rouge;
    document.getElementById("result-bleu").innerHTML = points.bleu;
    document.getElementById("result-vert").innerHTML = points.vert;
    document.getElementById("result-jaune").innerHTML = points.jaune;

    var total = points.rouge + points.bleu + points.vert + points.jaune;
    $("#result-rouge-rect").css("width", (points.rouge * 100 / total) + "%");
    $("#result-bleu-rect").css("width", (points.bleu * 100 / total) + "%");
    $("#result-vert-rect").css("width", (points.vert * 100 / total) + "%");
    $("#result-jaune-rect").css("width", (points.jaune * 100 / total) + "%");

    $('#resultat').fadeIn();
  }
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Maj des points //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function updatePoints() {
  var couleur = document.getElementById("question-couleur").innerHTML;
  if (couleur == "R") {
    points.rouge += convertReponseToPoints();
  } else if (couleur == "B") {
    points.bleu += convertReponseToPoints();
  } else if (couleur == "J") {
    points.jaune += convertReponseToPoints();
  } else if (couleur == "V") {
    points.vert += convertReponseToPoints();
  }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////// Convert reponse to points ///////////////////////////
////////////////////////////////////////////////////////////////////////////////
function convertReponseToPoints() {
  if ($("#assez").hasClass('reponse-selected')) {
    return 1;
  }
  if ($("#beaucoup").hasClass('reponse-selected')) {
    return 2;
  }
  return 0;
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////// Chargement du XML ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function loadXMLDoc() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      getQuestionsXml(this);
    }
  };
  xmlhttp.open("GET", "questions.xml", true);
  xmlhttp.send();
}

////////////////////////////////////////////////////////////////////////////////
/////////////////// Récupération des questions dans le XML /////////////////////
////////////////////////////////////////////////////////////////////////////////
function getQuestionsXml(xml) {
  xmlDoc = xml.responseXML;
  questionsListXml = xmlDoc.getElementsByTagName("question");
  for (var i = 0; i < questionsListXml.length; i++) {
    // for (var i = 0; i < 5; i++) {
    var question = {};
    question.titre = questionsListXml[i].children[0].textContent;
    question.texte = questionsListXml[i].children[1].textContent;
    question.couleur = questionsListXml[i].children[2].textContent;
    questionsList.push(question);
  }
}

////////////////////////////////////////////////////////////////////////////////
///////////////////// Ordre aléatoire pour les questions ///////////////////////
////////////////////////////////////////////////////////////////////////////////
function randomizeArray(arr) {
  var n = arr.length;
  var tempArr = [];
  for (var i = 0; i < n - 1; i++) {
    // The following line removes one random element from arr
    // and pushes it onto tempArr
    tempArr.push(arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
  }
  // Push the remaining item onto tempArr
  tempArr.push(arr[0]);
  return tempArr;
}