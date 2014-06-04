/***********************************************

    Fonction au chargement de la page 

************************************************/


// Initialisation au chargement de la page de la fonction
window.onload = function() {
    // Initialisation et mise en place du local storage pour la gestion des différents niveaux
    if (localStorage.getItem("level") === null || localStorage.getItem("level") === 'undefinded')
    {
        localStorage.setItem("level", 1);
    }

    var level = parseInt(localStorage.getItem("level"));
    var cases = maze(10 + level, 10 + level);
    var y = cases.length;
    var x = cases[0].length;
    var start = [0,0];
    var end = [y - 1, x - 1];
    var plateau = new Array();
    for (var i = 0; i < y; i++)
    {
        plateau[i] = new Array();
        for (var j = 0; j < x; j++)
        {
            plateau[i][j] = 0;
        }
    }
    plateau[0][0] = 2;
    var currPos = [0, 0];

    // Initialisation des déplacements de Sacha + images adaptées
    window.onkeypress = function(event) {
        var keypressed = event.keyCode;
        switch (keypressed) {
            // Déplacement vers le haut
            case 122:
                if (currPos[0] - 1 > -1)
                {
                    if (cases[currPos[0]][currPos[1]][0] == 1)
                    {
                        var currCase = document.getElementsByClassName(currPos[0] + "-" +  currPos[1]);
                        currCase[0].style.backgroundImage = "none";
                        plateau[currPos[0]][currPos[1]] = 1;
                        currPos[0]--;
                        plateau[currPos[0]][currPos[1]] = 2;
                        var currCase = document.getElementsByClassName(currPos[0] + "-" +  currPos[1]);
                        currCase[0].style.backgroundImage = "url('img/maze/sacha-haut.png')";
                    }
                }
                break;
            // Déplacement vers la droite
            case 100:
                if (currPos[1] + 1 < x)
                {
                    if (cases[currPos[0]][currPos[1]][1] == 1)
                    {
                        var currCase = document.getElementsByClassName(currPos[0] + "-" +  currPos[1]);
                        currCase[0].style.backgroundImage = "none";
                        plateau[currPos[0]][currPos[1]] = 1;
                        currPos[1]++;
                        plateau[currPos[0]][currPos[1]] = 2;
                        var currCase = document.getElementsByClassName(currPos[0] + "-" +  currPos[1]);
                        currCase[0].style.backgroundImage = "url('img/maze/sacha-droite.png')";
                    }
                }
                break;
            // Déplacement vers le bas
            case 115:
                if (currPos[0] + 1 < y)
                {
                    if (cases[currPos[0]][currPos[1]][2] == 1)
                    {
                        var currCase = document.getElementsByClassName(currPos[0] + "-" +  currPos[1]);
                        currCase[0].style.backgroundImage = "none";
                        plateau[currPos[0]][currPos[1]] = 1;
                        currPos[0]++;
                        plateau[currPos[0]][currPos[1]] = 2;
                        var currCase = document.getElementsByClassName(currPos[0] + "-" +  currPos[1]);
                        currCase[0].style.backgroundImage = "url('img/maze/sacha-bas.png')";
                    }
                }
                break;
            // Déplacement vers la gauche
            case 113:
                if (currPos[1] - 1 > -1)
                {
                    if (cases[currPos[0]][currPos[1]][3] == 1)
                    {
                        var currCase = document.getElementsByClassName(currPos[0] + "-" +  currPos[1]);
                        currCase[0].style.backgroundImage = "none";
                        plateau[currPos[0]][currPos[1]] = 1;
                        currPos[1]--;
                        plateau[currPos[0]][currPos[1]] = 2;
                        var currCase = document.getElementsByClassName(currPos[0] + "-" +  currPos[1]);
                        currCase[0].style.backgroundImage = "url('img/maze/sacha-gauche.png')";
                    }
                }
                break;
        }
        // Action sur la case d'arrivée, mise à jour du local storage
        if (currPos[0] == end[0] && currPos[1] == end[1])
        {
            alert('Gagné ! Rendez-vous au niveau suivant ;)');
            localStorage["level"]++;
            window.location.reload();
        }
    }

    // Initialisation de la case départ
    draw(cases);
    var startCase = document.getElementsByClassName("0-0");
    startCase[0].style.backgroundImage = "url('img/maze/sacha-bas.png')";

    // Détermination de la case d'arrivée et mise en place image du pokémon
    var level = localStorage.getItem("level");
    var endCase = document.getElementsByClassName((y - 1).toString() + "-" + (x - 1).toString());
    endCase[0].style.backgroundImage = "url('img/maze/" + level + ".png')";

    // Initialisation du solver au clic
    solver = document.getElementById("solve");
    solver.onclick = function() {
        solve(cases);
    }

    // Initialisation du reset au clic
    var reset = document.getElementById("reset");
    reset.onclick = function(){
        localStorage.setItem("level", 1);
        window.location.reload();
    }

    // Remise à zéro du storage + initialisation du catalogue de pokémon attrapés
    var catalog = document.getElementById("catalog");
    while (catalog.firstChild) 
    {
        catalog.removeChild(catalog.firstChild);
    }

    if (parseInt(level) > 1) 
    {
        var row = catalog.insertRow(0);
        var pokecell = row.insertCell(0);
        pokecell.style.backgroundImage = "url(img/maze/pokeball.png)";
        pokecell.className += "pokeball";
        for (var i = 1; i < level; i++)
        {
            var cell = row.insertCell(i);
            cell.style.backgroundImage = "url('img/maze/" + i + ".png')";
        }
    }
}



/**************************************************

        Génération aléatoire du labyrinthe

 ***************************************************/

// Fonction de génération
function maze(x, y)
{
    var currentCell, path, cells, visited;

    cells = new Array();
    visited = new Array();

    for (var i = 0 ; i < y ; i++) {
        cells[i] = new Array();
        visited[i] = new Array();

        // Chaque cellule est un tableau contenant les valeurs des 4 murs, 0 pour ouvert et 1 pour fermé
        for (var j = 0 ; j < x ; j++) {
            cells[i][j] = [0, 0, 0, 0];
            visited[i][j] = false;
        }
    }

    // On définit une cellule de départ + emplie sur le chemin + active la visite
    currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
    path = currentCell;
    visited[currentCell[0]][currentCell[1]] = true;

    // Tant que le chemin n'est pas vide on continue
    while (path.length)
    {   
        // Mise en place des possibilités de deplacement dans la case suivant
        var propositions, solutions, top, right, bottom, left, next;

        top = [currentCell[0] - 1, currentCell[1], 0, 2];
        right = [currentCell[0], currentCell[1] + 1, 1, 3];
        bottom = [currentCell[0] + 1, currentCell[1], 2, 0];
        left = [currentCell[0], currentCell[1] - 1, 3, 1];

        propositions = [top, right, bottom, left];
        solutions = new Array();

        // Pour chaque proposition, on vérifie que la case est dans le plateau + qu'elle n'a pas déjà été visitée et si c'est ok on l'ajoute aux solutions
        for (i = 0 ; i < 4 ; i++) {
            var propy = propositions[i][0];
            var propx = propositions[i][1];

            if (propy > -1 && propy < y && propx > -1 && propx < x)
            {
                if(!visited[propy][propx])
                {
                    solutions.push(propositions[i]);
                }
            }
        }

        // Déplacement aléatoire vers une case voisine
        if (solutions.length)
        {
            // On prend une cellule au hasard dans le tableau de solution
            next = solutions[Math.floor(Math.random() * solutions.length)];

            // On enlève les murs dans la cellule courante et la cellule suivante
            cells[currentCell[0]][currentCell[1]][next[2]] = 1;
            cells[next[0]][next[1]][next[3]] = 1;

            // On note la prochaine cellule comme visitée + on s'y place et on l'ajoute au chemin
            visited[next[0]][next[1]] = true;
            currentCell = [next[0], next[1]];
            path.push(currentCell);
        }
        else {
            // Si pas de solution on recule d'une case et on recommence
            currentCell = path.pop();
        }
    }
    console.log(cells);
    return cells;
}



/**************************************************

                Tracé des murs

 ***************************************************/

function draw(cases) {

    var i;
    var j;
    var mur;
    var y = cases.length;
    var x = cases[0].length;
    var tab = document.getElementById('maze');

    // Une fois maze recupéré on initialise le tableau
    for (i = 0; i < y; i++) {
        var row = tab.insertRow(i);
        for (j = 0; j < x; j++) {
            var cell = row.insertCell(j);
            cell.className = cell.className + i + "-" + j;
            for (mur = 0; mur < 4; mur++) {

                // Si il y a effectivement un mur, selon son indice, on le trace correctement
                if (cases[i][j][mur] == 0){
                    switch(mur){
                        case 0 :
                            cell.style.borderTop="2px solid darkgreen";
                            break;
                        case 1 :
                            cell.style.borderRight="2px solid darkgreen";
                            break;
                        case 2 :
                            cell.style.borderBottom="2px solid darkgreen";
                            break;
                        case 3 :
                            cell.style.borderLeft="2px solid darkgreen";
                            break;
                    }
                }
            }
        }
    }
}



/*******************************

            Solver

 *******************************/

function solve(cases) {
    var y = cases.length;
    var x = cases[0].length;
    var tab = document.getElementById('maze');
    var currentCell = [0, 0];
    var path = new Array();
    var visited = new Array();
    for (var i = 0; i < y; i++){
        visited[i] = new Array();
        for (var j = 0; j < x; j++){
            visited[i][j] = 0;
        }
    }

    // Tant que la cellule courante n'est pas celle d'arrivée
    while(currentCell[0] != y - 1 || currentCell[1] != x - 1) {
        // On la rend "visited"
        visited[currentCell[0]][currentCell[1]] = true;

        var possibilities = new Array();

        // On calcule les possibilités (prochaines cellules où on peut aller)
        // Vers le haut
        if (currentCell[0] - 1 > -1 && cases[currentCell[0]][currentCell[1]][0] == 1 && !visited[currentCell[0] - 1][currentCell[1]]) {
            possibilities.push([currentCell[0] - 1, currentCell[1]])
        }
        // Vers le bas
        if (currentCell[0] + 1 < y && cases[currentCell[0]][currentCell[1]][2] == 1 && !visited[currentCell[0] + 1][currentCell[1]]) {
            possibilities.push([currentCell[0] + 1, currentCell[1]])
        }
        // Vers la gauche
        if (currentCell[1] - 1 > -1 && cases[currentCell[0]][currentCell[1]][3] == 1 && !visited[currentCell[0]][currentCell[1] - 1]) {
            possibilities.push([currentCell[0], currentCell[1] - 1])
        }
        // Vers la droite
        if (currentCell[1] + 1 < x && cases[currentCell[0]][currentCell[1]][1] == 1 && !visited[currentCell[0]][currentCell[1] + 1]) {
            possibilities.push([currentCell[0], currentCell[1] + 1])
        }

        // Choix aléatoire de la direction parmis les possibilités
        if (possibilities.length) {
            path.push(currentCell);
            var next = possibilities[Math.floor(Math.random() * possibilities.length)];
            currentCell = next;
            // Si la case fait partie de la solution alors le tracé apparait
            var currCase = document.getElementsByClassName(currentCell[0] + "-" + currentCell[1]);
            currCase[0].style.backgroundColor = "#CDF6F9";
        }
        else {
            // Sinon le tracé reste transparent (pour ne pas gener l'utilisateur)
            var currCase = document.getElementsByClassName(currentCell[0] + "-" + currentCell[1]);
            currCase[0].style.backgroundColor = "transparent";
            currentCell = path.pop();
        }
    }
}