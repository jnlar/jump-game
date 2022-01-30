const container = document.querySelector('.container');

const rows = 25;
const cols = 70;
const pixel = 10;

// TODO: lets not mutate this, but refer to it as a starting point
let currentChar = [
	[24,0],
	[23,0],
	[22,0],
];
let [charPixelMap, obsPixelMap] = [new Map(), new Map()];
const createKey = (i, j) => i + '-' + j;

function generateObstacle() {
	let randomPixelT = Math.floor(Math.random() * 24);
	return [randomPixelT, 69];
}

const moveUp = ([t, l]) => [t - 1, l]
const moveDown = ([t, l]) => [t + 1, l];
const moveRight = ([t, l]) => [t, l + 1];
const moveLeft = ([t, l]) => [t, l - 1];

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

			let pos = createKey(i, j);
			cpx.classList.add(pos);
			charPixelMap.set(pos, cpx);
			//obsPixelMap.set(generateObstacle(), cpx);
			container.appendChild(cpx);
		}
	}
}

function mapToSet(type, set) {
	for (let [t, l] of type) {
		let pos = createKey(t, l)
		set.add(pos);
	}
}

function renderColor(type, set, pos) {
	return type.style.background =
		set.has(pos) ?
		'black' :
		'white'
}

function draw(char, obstacle) {
	let [charPos, obsPos] = [new Set(), new Set()];

	// TODO: draw random obstacles to avoid
	// - obstacles will only move from right to left
	mapToSet(char, charPos);
	//mapToSet(obstacle, obsPos);

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let pos = createKey(i, j);
			let charCpx = charPixelMap.get(pos);
			let obsCpx = charPixelMap.get(pos);

			renderColor(charCpx, charPos, pos);
		}
	}
}

function iterateChar(moveDirection) {
	currentChar.forEach((el, i) => {
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
})

drawCanvas();
setInterval(() => {
	draw(currentChar);
}, 500);





