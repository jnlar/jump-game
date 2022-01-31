const container = document.querySelector('.container');

const rows = 25;
const cols = 70;
const pixel = 10;

let currentChar = [
	[24,0],
	[23,0],
	[22,0],
];
let currentObstacles = [];
let obstaclePasses = 0;
let pixelMap = new Map();
let paused;

const toKey = ([i, j]) => i + '-' + j;
const moveUp = ([t, l]) => [t - 1, l]
const moveDown = ([t, l]) => [t + 1, l];
const moveRight = ([t, l]) => [t, l + 1];
const moveLeft = ([t, l]) => [t, l - 1];
const getObstaclesInCanvas = (currentObstacle) => currentObstacle[1] >= 0;

function createObstacles() {
	let randomObstacleCount = Math.floor(Math.random() * 7 + 1);

	for (let i = 0; i < randomObstacleCount; i++) {
		currentObstacles.push(genObstaclePos());
	}

	return currentObstacles;
}

function genObstaclePos() {
	let randomPixelT = Math.floor(Math.random() * 24);
	return [randomPixelT, 69];
}

function drawCanvas() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let cpx = document.createElement('div');

			cpx.style.position = "absolute";
			cpx.style.top = i * pixel + "px";
			cpx.style.left = j * pixel + "px";
			cpx.style.width = pixel + "px";
			cpx.style.height = pixel + "px";
			cpx.style.border = "1px solid #ddd";

			let pos = toKey([i, j]);
			cpx.classList.add(pos);
			pixelMap.set(pos, cpx);
			container.appendChild(cpx);
		}
	}
}

createObstacles();
drawCanvas();

function toSet(type, set) {
	for (let cell of type) {
		set.add(toKey(cell));
	}

	return set;
}

function draw(char, obstacle) {
	if (obstaclePasses === 10) {
		obstaclePasses = 0;
		createObstacles();
	}

	let charPositions = new Set();
	let obsPositions = new Set();

	toSet(char, charPositions);
	toSet(obstacle, obsPositions);

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let pos = toKey([i, j]);
			let cpx = pixelMap.get(pos);
			let background = 'white';

			if (obsPositions.has(pos))	 {
				background = 'red';
			} else if (charPositions.has(pos)) {
				background = 'black';
			}

			cpx.style.background = background;
		}
	}

	obstaclePasses++;
}

function iterateChar(moveDirection) {
	return currentChar.forEach((el, i) => {
		currentChar[i] = moveDirection(el)
	});
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
	}

	draw(currentChar);
}

// TODO: implement obstacle collision detection
function detectWallCollision(currentChar, direction) {
	if (currentChar[2][0] !== 0 && direction === 'up') move(direction);
	if (currentChar[0][0] !== 24 && direction == 'down') move(direction);
	if (currentChar[0][1] !== 69 && direction === 'right') move(direction);
	if (currentChar[0][1] !== 0 && direction == 'left') move(direction);

	return;
}

function setKeyBindings() {
	document.addEventListener('keydown', (e) => {
		if (e.key === 'w' || e.key === 'W') {
			detectWallCollision(currentChar, 'up');
		}
		if (e.key === 's' || e.key === 'S') {
			detectWallCollision(currentChar, 'down');
		}
		if (e.key === 'a' || e.key === 'A') {
			detectWallCollision(currentChar, 'left');
		}
		if (e.key === 'd' || e.key === 'D') {
			detectWallCollision(currentChar, 'right');
		}
		if (e.key === ' ' || e.key === 'Spacebar') {
			if (paused === true) return paused = false;

			paused = true;
		}
	})
}

function shiftObstacles(obstacle) {
	let shiftedObstacles = [];

	for (let cell of obstacle) {
		shiftedObstacles.push(moveLeft(cell));
	}

	return shiftedObstacles;
}

function step() {
	if (paused === true) return;
	let obstaclesInCanvas = currentObstacles.filter(getObstaclesInCanvas);
	currentObstacles = shiftObstacles(obstaclesInCanvas);

	return draw(currentChar, currentObstacles);
}

setKeyBindings();
setInterval(step, 100);
