const container = document.querySelector('.container');
const debugObs = document.getElementById('debug-obs');
const debugChr = document.getElementById('debug-chr');

const rows = 25;
const cols = 70;
const pixel = 10;

let paused;
let charPositions;
let obsPositions;
let hitObstacle;
let currentChar;
let currentObstacles;
let gameStarted;
let obstaclePasses;
let pixelMap;

const toKey = ([i, j]) => i + '-' + j;
const moveUp = ([t, l]) => [t - 1, l]
const moveDown = ([t, l]) => [t + 1, l];
const moveRight = ([t, l]) => [t, l + 1];
const moveLeft = ([t, l]) => [t, l - 1];
const getObstaclesInCanvas = (currentObstacle) => currentObstacle[1] >= 0;

function drawCanvas() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let cpx = document.createElement('div');

			cpx.style.position = "absolute";
			cpx.style.top = i * pixel + "px";
			cpx.style.left = j * pixel + "px";
			cpx.style.width = pixel + "px";
			cpx.style.height = pixel + "px";

			let pos = toKey([i, j]);
			cpx.classList.add(pos);
			pixelMap.set(pos, cpx);
			container.appendChild(cpx);
		}
	}
}

function initGame() {
	gameStarted = true;
	currentChar = [
		[24,0],
		[23,0],
		[22,0],
	];
	currentObstacles = [];
	paused = false;
	hitObstacle = false;
	obstaclePasses = 0;
	pixelMap = new Map();
	setKeyBindings();
	createObstacles();
	return drawCanvas();
}

function setKeyBindings() {
	let keys = {
		up: false,
		down: false,
		left: false,
		right: false
	}

	document.addEventListener('keydown', (e) => {
		if (keys.up && keys.right) {
			detectWallCollision(currentChar, 'upright');
		}
		if (keys.up && keys.left) {
			detectWallCollision(currentChar, 'upleft');
		}
		if (keys.down && keys.right) {
			detectWallCollision(currentChar, 'downright');
		}
		if (keys.down && keys.left) {
			detectWallCollision(currentChar, 'downleft');
		}
		if (e.key === 'w' || e.key === 'ArrowUp') {
			keys.up = true;
			detectWallCollision(currentChar, 'up');
		}
		if (e.key === 's' || e.key === 'ArrowDown') {
			keys.down = true;
			detectWallCollision(currentChar, 'down');
		}
		if (e.key === 'a' || e.key === 'ArrowLeft') {
			keys.left = true;
			detectWallCollision(currentChar, 'left');
		}
		if (e.key === 'd' || e.key === 'ArrowRight') {
			keys.right = true;
			detectWallCollision(currentChar, 'right');
		}
		if (e.key === ' ' || e.key === 'Spacebar') {
			if (paused) return paused = false;

			paused = true;
		}
	})

	document.addEventListener('keyup', () => {
		Object.keys(keys).map(key => keys[key] = false)
	});
}

function genObstaclePos() {
	let randomPixelT = Math.floor(Math.random() * 24);
	return [randomPixelT, 69];
}

function createObstacles() {
	let randomObstacleCount = Math.floor(Math.random() * 7 + 1);

	for (let i = 0; i < randomObstacleCount; i++) {
		currentObstacles.push(genObstaclePos());
	}

	return currentObstacles;
}

function toSet(type, set) {
	for (let cell of type) {
		set.add(toKey(cell));
	}

	return set;
}

function iterateChar(moveDirection) {
	return currentChar.forEach((el, i) => {
		currentChar[i] = moveDirection(el)
	});
}

function draw(char, obstacle) {
	if (hitObstacle) return;

	charPositions = new Set();
	obsPositions = new Set();

	toSet(char, charPositions);
	toSet(obstacle, obsPositions);

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let pos = toKey([i, j]);
			let cpx = pixelMap.get(pos);
			let background = 'white';

			if (obsPositions.has(pos))	 {
				background = 'orange';
			} else if (charPositions.has(pos)) {
				background = 'blue';
			}

			cpx.style.background = background;
		}
	}
}

function move(direction) {
	switch (direction) {
		case 'up':
			iterateChar(moveUp);
			break;
		case 'down':
			iterateChar(moveDown);
			break;
		case 'left':
			iterateChar(moveLeft);
			break;
		case 'right':
			iterateChar(moveRight);
			break;
		case 'upright':
			iterateChar(moveUp);
			iterateChar(moveRight);
			break;
		case 'upleft':
			iterateChar(moveUp);
			iterateChar(moveLeft);
			break;
		case 'downright':
			iterateChar(moveDown);
			iterateChar(moveRight);
			break;
		case 'downleft':
			iterateChar(moveDown);
			iterateChar(moveLeft);
			break;
	}

	draw(currentChar);
}

function detectWallCollision(currentChar, direction) {
	if (paused) return;
	if (currentChar[2][0] !== 0 && direction === 'up') return move(direction);
	if (currentChar[0][0] !== 24 && direction == 'down') return move(direction);
	if (currentChar[0][1] !== 69 && direction === 'right') return move(direction)
	if (currentChar[0][1] !== 0 && direction == 'left') return move(direction);
	if (
		currentChar[2][0] !== 0
		&& currentChar[0][1] !== 69
		&& direction === 'upright'
		) return move(direction);
	if (
		currentChar[2][0] !== 0
		&& currentChar[0][1] !== 0
		&& direction === 'upleft'
		) return move(direction);
	if (
		currentChar[0][0] !== 24
		&& currentChar[0][1] !== 69
		&& direction === 'downright'
		) return move(direction);
	if (
		currentChar[0][0] !== 24
		&& currentChar[0][1] !== 0
		&& direction === 'downleft'
		) return move(direction);
}

function detectObstacleCollision(currentChar) {
	for (let cell of currentChar) {
		let pos = toKey(cell);

		if (obsPositions && obsPositions.has(pos)) {
			return true;
		}
	}

	return false;
}

function shiftObstacles(obstacle) {
	let shiftedObstacles = [];

	for (let cell of obstacle) {
		shiftedObstacles.push(moveLeft(cell));
	}

	return shiftedObstacles;
}

function obstacleStep() {
	if (paused || hitObstacle) return;

	debugObs.innerHTML = `<pre>ObstaclesInCanvas</pre> `
	debugChr.innerHTML = `<pre>currentChar</pre> `
	let obstaclesInCanvas = currentObstacles.filter(getObstaclesInCanvas);
	obstaclesInCanvas.forEach((el, i) => debugObs.innerHTML += ` [${el}] `)
	currentChar.forEach((el, i) => debugChr.innerHTML += ` [${el}] `)
	currentObstacles = shiftObstacles(obstaclesInCanvas);

	if (obstaclePasses === 10) {
		obstaclePasses = 0;
		createObstacles();
	}

	obstaclePasses++;
}

function characterStep() {
	if (!gameStarted) return initGame();
	if (!detectObstacleCollision(currentChar) && !hitObstacle) {
		return draw(currentChar, currentObstacles);
	}

	return hitObstacle = true;
}

setInterval(obstacleStep, 100);
setInterval(characterStep, 1);
// yeah I know... this is bad
window.onerror = () => true;
