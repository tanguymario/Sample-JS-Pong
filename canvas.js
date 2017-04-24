//Canvs et context
var canvas;
var context;

var canvasData;

//Récupère le canvas
var canvasData;

var players = "one_player";

//Stop
var stop = false;

//Echelle des pieces
var scale;

//Définit la vitesse du jeu
var speed = 1;

//Définit si la partie est finie
var gameOver = false;
var winner = "";

//Définit la limite de points à atteindre pour obtenir la victoire
var limite_points = 5;

var global_speed = 4.0;

//Intervalle du jeu
var intervalId;

//Timeout pour lancer la balle
var timeoutId;
var timeoutGame;

//Définit le joueur du bord gauche
var Left_Player = new Object();
Left_Player.width = 0;
Left_Player.height = 0;
Left_Player.x = 0;
Left_Player.y = 0;
Left_Player.speed = 1;
Left_Player.score = 0;
Left_Player.distance_Ball = 0;
Left_Player.frozen = false;

//Définit le joueur du bord droit
var Right_Player = new Object();
Right_Player.width = 0;
Right_Player.height = 0;
Right_Player.x = 0;
Right_Player.y = 0;
Right_Player.speed = 1;
Right_Player.score = 0;
Right_Player.distance_Ball = 0;
Right_Player.frozen = false

//Définit la balle de notre jeu
var Ball = new Object();
Ball.x = 0;
Ball.y = 0;
Ball.taille = 2;
Ball.time_out = 3;
Ball.wait = true;
Ball.angle = 0;
Ball.speed_x = 0;
Ball.speed_y = 0;

//Contient tous les effets du bonus
var Array_Bonus = new Array();
Array_Bonus.push("big_height");
Array_Bonus.push("little_height");
Array_Bonus.push("big_ball");
Array_Bonus.push("little_ball");
Array_Bonus.push("big_speed");
Array_Bonus.push("little_speed");
Array_Bonus.push("frozen");
Array_Bonus.push("bomb");

//Crée des confetti
var nb_confetti = 100;
var Confettis = new Array();
for(var i = 0; i < nb_confetti;i++){
    var Confetti = new Object();
    Confetti.x = 0;
    Confetti.y = 0;
    Confetti.width = 0;
    Confetti.height = 0;
    Confettis.push(Confetti);
}

//Partie en cours
var gameIsOn = false;

//Définit si on doit créer, ou pas un bonus
var isBonusCreated = false;
var Bonus_timeOut = 0;

//Constitue l'élément Bonus
var Bonus = new Object();

//Crée un tableau des touches du clavier
var keyboard = new Array();

//Au chargement de la page
window.onload = function (){

    //Récupération du canvas et de son context
    canvas = document.getElementById("myCanvas");

    if(!canvas)
    {
        alert("Impossible de récupérer le canvas");
        return;
    }

    //Récupération de son context
    context = canvas.getContext("2d");
    if(!context)
    {
        alert("Impossible de récupérer le context");
        return;
    }

    //Définit l'échelle des pièces
    scale = (canvas.width/150);

    //On affiche une interface avec le menu
    displayMenu();
}

function displayMenu(){

    //On définit les dimensions des joueurs
    Left_Player.width = scale / 5;
    Left_Player.height = scale * 5;

    Right_Player.width = scale / 5;
    Right_Player.height = scale * 5;

    //On définit les positions de départ des joueurs
    Left_Player.x = scale;
    Left_Player.y = canvas.height / 2 - (Left_Player.height * scale / 2);

    Right_Player.x = canvas.width - (Right_Player.width * scale) - scale;
    Right_Player.y = canvas.height / 2 - (Right_Player.height * scale / 2);

    //Initialise la position de la balle
    Ball.x = canvas.width/2;
    Ball.y = canvas.height/2;

    //Rénitialise la taille de la balle
    Ball.taille = 2;

    //On rénitialise les scores des joueurs
    Left_Player.score = 0;
    Right_Player.score = 0;

    //Définit le gameOver
    gameOver = false;
    winner = "";

    isBonusCreated = false;
    Bonus_timeOut = 0;

    //Dessine le fond du canvas
    drawScreen();

    //On dessine le joueur
    drawGame();

    //Lance la balle
    launchBall();

    //Puis on gere les positions du joueur
    intervalId = setInterval(playGame,10/speed);

    //On lance une partie
    launchGame();
}

//Lancement d'une partie
function launchGame(){

    clearInterval(intervalId);

    //On définit les dimensions des joueurs
    Left_Player.width = scale / 5;
    Left_Player.height = scale * 5;

    Right_Player.width = scale / 5;
    Right_Player.height = scale * 5;

    //On définit les positions de départ des joueurs
    Left_Player.x = scale;
    Left_Player.y = canvas.height / 2 - (Left_Player.height * scale / 2);

    Right_Player.x = canvas.width - (Right_Player.width * scale) - scale;
    Right_Player.y = canvas.height / 2 - (Right_Player.height * scale / 2);

    //Initialise la position de la balle
    Ball.x = canvas.width/2;
    Ball.y = canvas.height/2;

    //Rénitialise la taille de la balle
    Ball.taille = 2;

    //On rénitialise les scores des joueurs
    Left_Player.score = 0;
    Right_Player.score = 0;

    //Définit le gameOver
    gameOver = false;
    winner = "";

    isBonusCreated = false;
    Bonus_timeOut = 0;

    //Dessine le fond du canvas
    drawScreen();

    //On dessine le joueur
    drawGame();

    //Lance la balle
    launchBall();

    //Puis on gere les positions du joueur
    intervalId = setInterval(playGame,10/speed);
}

//Dessine les pièces du jeu
function drawGame(){

    //On dessine progressivement le fond pour donner un effet
    context.fillStyle = "rgba(0,0,0,0.15)";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgb(255,255,255)";

    //On trace les joueurs
    Rect(Left_Player.x,Left_Player.y,Left_Player.width * scale,Left_Player.height * scale,"white","fill");
    Rect(Right_Player.x,Right_Player.y,Right_Player.width * scale,Right_Player.height * scale,"white","fill");

    if(!gameOver){
        Arc(Ball.x,Ball.y,Ball.taille * scale,"cyan","fill");
    }

    if(isBonusCreated){
        drawImage(Bonus.desc,Bonus.x,Bonus.y,Bonus.taille * scale,Bonus.taille * scale);
    }

    Texte(Left_Player.score,canvas.width/2 - scale * 20,scale * 10);
    Texte(Right_Player.score,canvas.width/2 + scale * 20,scale * 10);
}

//Gere la partie en cours
function playGame(){

    //Si la partie n'est pas terminée
    if(!gameOver){

        if(players === "bots"){

            if(!Left_Player.frozen){
                if(Ball.y - ((Left_Player.height * scale) /2)< Left_Player.y){
                    if(Left_Player.y > 0){
                        Left_Player.y -= Left_Player.speed * global_speed * 0.35;
                    }
                } else {
                    if(Left_Player.y + (Left_Player.height * scale) < canvas.height){
                        Left_Player.y += Left_Player.speed * global_speed * 0.35;
                    }
                }
            }

            if(!Right_Player.frozen){
                if(Ball.y - ((Right_Player.height * scale) /2) < Right_Player.y){
                    if(Right_Player.y > 0){
                        Right_Player.y -= Right_Player.speed * global_speed * 0.35;
                    }
                } else {
                    if(Right_Player.y + (Right_Player.height * scale) < canvas.height){
                        Right_Player.y += Right_Player.speed * global_speed * 0.35;
                    }
                }
            }
        } else if(players === "one_player"){

            if(!Left_Player.frozen){
                if(Ball.y - ((Left_Player.height * scale) /2)< Left_Player.y){
                    if(Left_Player.y > 0){
                        Left_Player.y -= Left_Player.speed * global_speed * 0.35;
                    }
                } else {
                    if(Left_Player.y + (Left_Player.height * scale) < canvas.height){
                        Left_Player.y += Left_Player.speed * global_speed * 0.35;
                    }
                }
            }

            if(!Right_Player.frozen){
                if(keyboard[38]){
                    //Fleche haut
                    if(Right_Player.y > 0){
                        Right_Player.y -= Right_Player.speed * global_speed;
                    }
                } else if(keyboard[40]){
                    //Fleche bas
                    if(Right_Player.y + (Right_Player.height * scale) < canvas.height){
                        Right_Player.y += Right_Player.speed * global_speed;
                    }
                }
            }
        } else {

            if(!Left_Player.frozen){
                if(keyboard[90]){
                        //Touche z
                        if(Left_Player.y > 0){
                            Left_Player.y -= Left_Player.speed * global_speed;
                        }
                    } else if(keyboard[83]){
                        //Touche s
                        if(Left_Player.y + (Left_Player.height * scale) < canvas.height){
                            Left_Player.y += Left_Player.speed * global_speed;
                        }
                }
            }

            if(!Right_Player.frozen){

                if(keyboard[38]){
                    //Fleche haut
                    if(Right_Player.y > 0){
                        Right_Player.y -= Right_Player.speed * global_speed;
                    }
                } else if(keyboard[40]){
                    //Fleche bas
                    if(Right_Player.y + (Right_Player.height * scale) < canvas.height){
                        Right_Player.y += Right_Player.speed * global_speed;
                    }
                }
            }
        }

        if(!isBonusCreated){
            createBonus();
        } else {
            manageBonus();
        }

        manageGame();

    }

    //Si la balle est lancée, on gère ses interactions
    if(!Ball.wait && !gameOver){
        //Gère la balle du jeu
        manageBall();
        global_speed *= 1.00025;
        // global_speed *= 1.0025;
    }

    //On dessine le jeu
    drawGame();
}

//Lance la balle
function launchBall(){

    //La balle ne bouge pas
    Ball.wait = true;

    //Re définit les positions de la balle
    Ball.x = canvas.width/2;
    Ball.y = canvas.height/2;

    Left_Player.height = scale * 5;
    Right_Player.height = scale * 5;

    Left_Player.speed = 1;
    Right_Player.speed = 1;

    //Rénitialise la taille de la balle
    Ball.taille = 2;

    //Définit un angle aléatoire
    Ball.angle = Math.random();
    Ball.angle = Ball.angle * Math.PI * 2;

    //Si la valeur aléatoire n'est pas suffisament correcte
    while((Ball.angle > 4.0 && Ball.angle < 6.0) || (Ball.angle > 0.0 && Ball.angle < 2.0) || (Ball.angle < -4 && Ball.angle > -6) || (Ball.angle < -0 && Ball.angle > -2)){
        //On redéfinit l'angle de la balle
        Ball.angle = Math.random();
        Ball.angle = Ball.angle * Math.PI * 2;
    }

    //On modifie ensuite la vitesse de la balle en fonction de son angle
    Ball.speed_x = Math.cos(Ball.angle);
    Ball.speed_y = Math.sin(Ball.angle);

    //On met un timeout
    timeoutId = null;
    timeoutId = setTimeout(manageBall, Ball.time_out * 1000);
}

//Crée un bonus
function createBonus(){

    //Valeur aléatoire pour choisir le bonus
    var val_aleatoire = Math.floor((Math.random() * (Array_Bonus.length)));

    //Determine la position et la direction du bonus
    var bonus_direction = Math.floor(Math.random() * 2);

    //définit une hauteur aléatoire de notre élément
    var hauteur_aleatoire = 75 + (Math.floor(Math.random() * (canvas.height - 150)));

    //Définit les positions de notre bonus
    Bonus.x = canvas.width/2;
    Bonus.y = hauteur_aleatoire;

    //Définit les effets de notre bonus
    Bonus.desc = Array_Bonus[val_aleatoire];

    //Définit la taille de notre bonus
    Bonus.taille = 5;

    //Définit la direction de notre bonus
    if(bonus_direction === 0){
        Bonus.direction = "left";
    } else {
        Bonus.direction = "right";
    }

    isBonusCreated = true;
}

//Gere la position du bonus
function manageBonus(){

    var Left_collision = false;
    var Right_collision = false;

    //On situe différents points sur la première barre
    for(var i = 0; i <= Left_Player.height && !Left_collision;i++){

        //Calcul les distances entre la balle et le premier/deuxième joueur
        Left_Player.distance_Bonus = Math.sqrt(Math.pow(Left_Player.x + (Left_Player.width * scale) - (Bonus.x + Bonus.taille*scale),2) + Math.pow(Left_Player.y + (i * scale) - Bonus.y - Bonus.taille*scale,2));

        if(Left_Player.distance_Bonus < (Bonus.taille * scale) && !Left_collision){
            Left_collision = true;
        }
    }

    //On situe différents points sur la seconde barre
    for(var j = 0; j <= Right_Player.height && !Left_collision && !Right_collision;j++){

        //Calcul les distances entre la balle et le premier/deuxième joueur
        Right_Player.distance_Bonus = Math.sqrt(Math.pow(Right_Player.x + (Right_Player.width * scale) - (Bonus.x + Bonus.taille*scale),2) + Math.pow(Right_Player.y + (j * scale) - Bonus.y - Bonus.taille*scale,2));

        if(Right_Player.distance_Bonus < (Bonus.taille * scale) && !Right_collision){
            Right_collision = true;
        }
    }

    if(!Left_collision && !Right_collision){
        if(Bonus.direction === "left"){
            if(Bonus.x < -5){
                isBonusCreated = false;
            } else {
                Bonus.x -= global_speed / 10;
                drawImage(Bonus.desc,Bonus.x,Bonus.y,scale,scale);
            }
        } else {
            if(Bonus.x > canvas.width + 5){
                isBonusCreated = false;
            } else {
                Bonus.x += global_speed / 10;
                drawImage(Bonus.desc,Bonus.x,Bonus.y,scale,scale);
            }
        }
    } else {
        if(Left_collision){
            if(Bonus.desc === "big_height"){
                Left_Player.height *= 1.5;
            } else if(Bonus.desc === "little_height"){
                Left_Player.height *= 0.75;
            } else if(Bonus.desc === "big_ball"){
                Ball.taille *= 1.5;
            } else if(Bonus.desc === "little_ball"){
                Ball.taille *= 0.75;
            } else if(Bonus.desc === "big_speed"){
                Left_Player.speed *= 2;
                setTimeout(function(){
                    Left_Player.speed = 1;
                }, 10000/global_speed);
            } else if(Bonus.desc === "little_speed"){
                Left_Player.speed *= 0.5;
                setTimeout(function(){
                    Left_Player.speed = 1;
                }, 10000/global_speed);
            } else if (Bonus.desc === "frozen"){
                Left_Player.frozen = true;
                setTimeout(function(){
                    Left_Player.frozen = false;
                }, 10000/global_speed);
            } else if(Bonus.desc === "bomb"){
                gameOver = true;
                winner = "Right_Player";
                endGame();
            } else {
                alert("erreur objet!");
            }
        } else {
            if(Bonus.desc === "big_height"){
                Right_Player.height *= 1.5;
            } else if(Bonus.desc === "little_height"){
                Right_Player.height *= 0.75;
            } else if(Bonus.desc === "big_ball"){
                Ball.taille *= 1.5;
            } else if(Bonus.desc === "little_ball"){
                Ball.taille *= 0.75;
            } else if(Bonus.desc === "big_speed"){
                Right_Player.speed *= 2;
                setTimeout(function(){
                    Right_Player.speed = 1;
                }, 1000000/global_speed);
            } else if(Bonus.desc === "little_speed"){
                Right_Player.speed *= 0.5;
                setTimeout(function(){
                    Right_Player.speed = 1;
                }, 1000000/global_speed);
            } else if (Bonus.desc === "frozen"){
                Right_Player.frozen = true;
                setTimeout(function(){
                    Right_Player.frozen = false;
                }, 10000/global_speed);
            } else if(Bonus.desc === "bomb"){
                gameOver = true;
                winner = "Left_Player";
                endGame();
            } else {
                alert("erreur objet!");
            }
        }

        isBonusCreated = false;
    }
}

//Gère la balle
function manageBall(){

    //La balle est lancée
    Ball.wait = false;

    //Définit les vitesses de la balle
    Ball.speed_x = Math.cos(Ball.angle);
    Ball.speed_y = Math.sin(Ball.angle);

    //Si il y a une collision on arrete les boucles
    var collision = false;

    var Left_center_barre = Left_Player.y + (Left_Player.height * scale) /2;
    var Right_center_barre = Right_Player.y + (Right_Player.height * scale) /2;

    //On situe différents points sur la première barre
    for(var i = 0; i <= Left_Player.height && !collision;i++){

        //Calcul les distances entre la balle et le premier/deuxième joueur
        Left_Player.distance_Ball = Math.sqrt(Math.pow(Left_Player.x + (Left_Player.width * scale) - (Ball.x + Ball.taille*scale + Ball.speed_x),2) + Math.pow(Left_Player.y + (i * scale) - Ball.y - Ball.taille*scale,2));

        if(Left_Player.distance_Ball < (Ball.taille * scale) && !collision){
            collision = true;
            //On change la direction speed_x de la balle
            // Ball.angle = Math.PI - Ball.angle;
            //On change la direction speed_y de la balle
            var cote_frappe = Ball.y - Left_center_barre;
            Ball.angle = cote_frappe / (Left_Player.height * scale);
        }
    }

    //On situe différents points sur la seconde barre
    for(var j = 0; j <= Right_Player.height && !collision;j++){

        //Calcul les distances entre la balle et le premier/deuxième joueur
        Right_Player.distance_Ball = Math.sqrt(Math.pow(Right_Player.x + (Right_Player.width * scale) - (Ball.x + Ball.taille*scale + Ball.speed_x),2) + Math.pow(Right_Player.y + (j * scale) - Ball.y - Ball.taille*scale,2));

        if(Right_Player.distance_Ball < (Ball.taille * scale) && !collision){
            collision = true;
            // Ball.angle = Math.PI - Ball.angle;
            //On change la direction speed_y de la balle
            var cote_frappe = Ball.y - Right_center_barre;
            Ball.angle = Math.PI - cote_frappe / (Right_Player.height * scale);
        }
    }

    if(Ball.x + (Ball.taille * scale) + 3 < 0){
        Right_Player.score ++;
        launchBall();
        global_speed = 4.0;
    } else if(Ball.x - (Ball.taille * scale) - 3 > canvas.width){
        Left_Player.score ++;
        launchBall();
        global_speed = 4.0;
    }

    if(Ball.y - (Ball.taille * (scale/4)) < 0 || Ball.y + (Ball.taille * (scale/4)) + Ball.speed_y > canvas.height){
        collision = true;
        Ball.angle = - Ball.angle;
    }

    if(collision){
        Ball.speed_x = Math.cos(Ball.angle);
        Ball.speed_y = Math.sin(Ball.angle);
    }

    //Définit les positions de la balle par rapport aux vitesses
    Ball.x += (Ball.speed_x * global_speed);
    Ball.y += (Ball.speed_y * global_speed);

    // document.getElementById("dbg").innerHTML= "toto" + collision;
}

//Gere les parametres de la partie en cours
function manageGame(){

    //Si la limite de points a été atteinte
    if(Left_Player.score === limite_points || Right_Player.score === limite_points && !gameOver){

        gameOver = true;

        canvasData = context.getImageData(0,0,canvas.width,canvas.height);

        if(Left_Player.score === limite_points){
            winner = "Left_Player";
        } else {
            winner = "Right_Player";
        }
        endGame();
    }
}

//Finit la partie
function endGame(){

    if(gameOver){

        Rect(canvas.width/2 - scale * 2,canvas.height/2 - scale * 2,"black","fill");
        createConfetti();
        timeoutGame = null;
        timeoutGame = setTimeout(function (){
            clearInterval(intervalId);
            intervalId = setInterval(manageConfetti,100);
            Texte("GAME OVER",canvas.width/2,canvas.height/2);
            if(confirm("Voulez vous réessayer ?")){
                clearInterval(intervalId);
                launchGame();
            }
        },500);
    }
}

//Gére les caractéristiques des confettis
function manageConfetti(){

    context.putImageData(canvasData,0,0);

    for(var i = 0; i < 10;i++){
        var current_confetti = Confettis[i];
        current_confetti.y += global_speed;
        Rect(current_confetti.x,current_confetti.y,current_confetti.width,current_confetti.height,current_confetti.color,"fill");
    }
}

//Définit les caractéristiques des confettis
function createConfetti(){

    //Valeur tamp de x
    var tamp_x = 0;

    //Determine ou on lance les confettis
    if(winner === "Right_Player"){
        tamp_x = canvas.width - 100;
    }

    //On attribue a chaque confetti une abcisse particulière
    for(var i = 0; i < Confettis.length;i++){
        var current_confetti = Confettis[i];
        current_confetti.x = Math.random() * 100 + tamp_x;
        current_confetti.y = 0 - Math.random() * 100;
        current_confetti.width = Math.floor(Math.random() * 20);
        current_confetti.height = Math.floor(Math.random() * 30);
        current_confetti.color = "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")";
    }
}

//Dessine le fond du canvas
function drawScreen() {
    //Point d'origine du canvas à toute son épaisseur/largeur
    Rect(0,0,canvas.width,canvas.height,"black","fill");
}

//Dessine une image
function drawImage(src,begin_pos_x,begin_pos_y,width,height){

    var img = new Image();
    img.src = "Images/" + src + ".png";
    img.onload= function(){
        context.drawImage(img,begin_pos_x,begin_pos_y, width,height);
    }
}

//Dessine un texte avec les paramètres données
function Texte(contenu,pos_x,pos_y){

    var myText = "" + contenu;
    context.font = "" + scale * 10 + "px Arial";
    context.fillStyle = "white";
    var myText_length = context.measureText(myText).width;
    context.fillText(myText,pos_x - myText_length/2,pos_y);
}

//Dessine une cercle avec les paramètres donnés
function Arc(begin_pos_x,begin_pos_y,rayon,color,method){

    context.beginPath();
    context.arc(begin_pos_x,begin_pos_y,rayon,0, Math.PI*2);

    //Si on trace un trait
    if(method==="stroke"){
        context.strokeStyle = "" + color;
        context.stroke();
    } else if(method==="fill"){
        //Ou si on remplit notre cercle
        context.fillStyle = "" + color;
        context.fill();
    } else {
        context.closePath();
    }
}

//Dessine un rectangle avec les paramètres donnés
function Rect(begin_pos_x,begin_pos_y,end_pos_x,end_pos_y,color,method) {

    context.beginPath();
    //On choisit la méthode de dessin
    //Stroke qui représente un trait
    if(method === "stroke"){
        context.strokeStyle="" + color;
        context.rect(begin_pos_x,begin_pos_y,end_pos_x,end_pos_y);
        context.stroke();
    } else if(method === "fill"){
        //Ou fill qui remplit le rectangle
        context.fillStyle="" + color;
        context.fillRect(begin_pos_x,begin_pos_y,end_pos_x,end_pos_y);
    } else {
        context.closePath();
    }
}

//Quand la touche n'est plus appuyée
window.onkeyup = function(e) {

    var key = e.keyCode || e.which;
    keyboard[key] = false;
}

//A l'appui d'une touhce
window.onkeydown = function(e) {

    var key = e.keyCode || e.which;
    keyboard[key] = true;
}
