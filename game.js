const container = document.querySelector('.container');

const rows = 25;
const cols = 70;
const pixel = 10;

let currentChar = [
	[24,0],
	[23,0],
	[22,0],
];

let pixelMap = new Map();
let createKey = (i, j) => i + '-' + j;

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
			pixelMap.set(pos, cpx);
			container.appendChild(cpx);
		}
	}
}

function drawChar(char) {
	let charPos = new Set();

	for (let [t, l] of char) {
		let pos = createKey(t, l)
		charPos.add(pos);
	}

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let pos = createKey(i, j);
			let cpx = pixelMap.get(pos);
			cpx.style.background =
				charPos.has(pos) ?
				'black' :
				'white'
		}
	}
}


const moveUp = ([t, l]) => [t - 1, l]
const moveDown = ([t, l]) => [t + 1, l];
const moveRight = ([t, l]) => [t, l + 1];
const moveLeft = ([t, l]) => [t, l - 1];

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

	drawChar(currentChar);
	console.log(currentChar);
}

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
drawChar(currentChar);
