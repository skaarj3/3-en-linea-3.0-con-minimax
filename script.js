var origBoard;
let textoVictoria = document.getElementById("vencedor");
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

var modoDeJuego;
/*Iniciamos variable. Si el modo es 0, es pvp, si es 1 es pve fácil y si es 2 es pve difícil*/

/*Para mostrar los modos de juego de pve en la pantalla inicial, al pulsar el botón pve*/
function mostrarBotonesPve() {
	var x = document.getElementById("facilDificil");
	if (x.style.visibility === "visible") {
		x.style.visibility = "hidden";
	} else {
		x.style.visibility = "visible";
	}
}

document.getElementById("pve").onclick = function () {
	mostrarBotonesPve();
}

function reiniciar() {
	document.getElementById("cuadro").style.visibility = "hidden";
	document.getElementById("reinicio").style.visibility = "hidden";
	document.getElementById("tipoJuego").style.visibility = "visible";
	document.getElementById("facilDificil").style.visibility = "hidden";
	document.getElementById("progress").style.visibility = "hidden";
	document.getElementById("vencedor").style.visibility = "hidden";
	document.getElementById("textoModoJuego").innerHTML = "¿Estás preparado? Elije el modo de juego";
}

function cargarPartida() {
	//cuadro.setAttribute("visibility", "visible"); //Esto de momento no funciona
	document.getElementById("cuadro").style.visibility = "visible";
	document.getElementById("reinicio").style.visibility = "visible";
	document.getElementById("tipoJuego").style.visibility = "hidden";
	document.getElementById("facilDificil").style.visibility = "hidden";
	startGame();
} //Esta función muestra el cuadro de juego y oculta los botones superiores

const cells = document.querySelectorAll('.cell');


//Muestra la barra de carga, la anima y luego la oculta
function animar() {
	document.getElementById("progress").style.visibility = "visible";
	document.getElementById("barra").classList.toggle("final");
	setTimeout(function () {
		document.getElementById("progress").style.visibility = "hidden";
	}, 1000);
}

/*En función del botón que pulsemos, se cargará siempre la barra de progreso, luego desaparece, carga el cuadro de juego y la variable modoJuego tendrá un valor distinto*/
document.querySelector("#pvp").addEventListener("click", function () {
	modoDeJuego = 0;
	document.getElementById("modoDeJuego").innerHTML = "modoDeJuego " + modoDeJuego;
	animar();
	setTimeout(function () {
		cargarPartida();
	}, 1000);
	document.getElementById("textoModoJuego").innerHTML = 'Jugador contra Jugador <i class="fas fa-people-arrows"></i>';
	startGame();
});

document.querySelector("#botonPveFacil").addEventListener("click", function () {
	modoDeJuego = 1;
	document.getElementById("modoDeJuego").innerHTML = "modoDeJuego " + modoDeJuego;
	animar();
	setTimeout(function () {
		cargarPartida();
	}, 1000);
	document.getElementById("textoModoJuego").innerHTML = 'Jugador contra la máquina. Modo fácil <i class="fas fa-shapes"></i>';
	startGame();
});

document.querySelector("#botonPveDificil").addEventListener("click", function () {
	modoDeJuego = 2;
	document.getElementById("modoDeJuego").innerHTML = "modoDeJuego " + modoDeJuego;
	animar();
	setTimeout(function () {
		cargarPartida();
	}, 1000);
	document.getElementById("textoModoJuego").innerHTML = 'Jugador contra la máquina. Modo difícil <i class="fas fa-fire-alt"></i>';
	startGame();
});

function startGame() {
	//Al iniciar se oculta el Id del vencedor
	/* document.querySelector(".endgame").style.display = "none"; */
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square, modoDeJuego) {
	if (typeof origBoard[square.target.id] == "number") {
		turn(square.target.id, huPlayer);
		if (!checkTie()) turn(bestSpot(modoDeJuego), aiPlayer);
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {
				index: index,
				player: player
			};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) { //Con este for pintamos las casillas de la jugada ganadora
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "lightgreen" : "red";
	} //Con este for evitamos que se puedan hacer más clicks una vez acaba la partida
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener("click", turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? textoVictoria.innerHTML = '<i class="fas fa-trophy"></i> ¡Felicidades, has ganado! <i class="fas fa-trophy">' : textoVictoria.innerHTML = '<i class="far fa-laugh-squint"></i> ¡Has perdido, lamer! <i class="fas fa-skull-crossbones"></i>');
}

function declareWinner(who) {
	/* 	document.querySelector(".endgame").style.display = "block";
		document.querySelector(".endgame .text").innerText = who; */
	textoVictoria.style.visibility = "visible";
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot(modoDeJuego) {
	if (modoDeJuego == 0) {//Si es PVP cargamos el modo PVP (cuando lo tenga hecho, claro...)
		return minimax(origBoard, aiPlayer).index;
	} else if (modoDeJuego == 1) { //ia modo fácil
		randomClick();
	} else {//ia modo difícil
		return minimax(origBoard, aiPlayer).index;
	}
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner(textoVictoria.innerHTML = '<i class="far fa-laugh-squint"></i> ¡Empate, pkt! <i class="fas fa-skull-crossbones"></i>')
		return true;
	}
	return false;
}

function randomClick() {//click random para el modo fácil
    document.getElementById("modoJuego").innerHTML = "He entrado en la función iaFacil";
    /*Función aleatorio para el modo fácil*/
    function aleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    let valores = botones.map(x => x.innerHTML);
    let pos = -1;

    let n = aleatorio(0, botones.length - 1);
    while (valores[n] != "") {
        n = aleatorio(0, botones.length - 1);
    } /*Solo sale de este bucle si encuentra una posición libre (y que no sea el centro)*/
    pos = n;

    botones[pos].innerHTML = "O";
    return pos;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {
			score: -10
		};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {
			score: 10
		};
	} else if (availSpots.length === 0) {
		return {
			score: 0
		};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if (player === aiPlayer) {
		var bestScore = -10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for (var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}