const container = document.querySelector('.container');
const rows = 25;
const cols = 70;
const pixel = 10;

let pixelMap = new Map();

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

			let pos = i + '_' + j;
			cpx.classList.add(pos);
			pixelMap.set(pos, cpx);
			container.appendChild(cpx);
		}
	}
}

function drawChar(char) {
	let charPos = new Set();

	for (let [x, y] of char) {
		let pos = x + '_' + y;
		charPos.add(pos);
	}

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) { 
			let pos = i + '_' + j;
			let cpx = pixelMap.get(pos);
			cpx.style.background = 
				charPos.has(pos) ?
				'black' :
				'white'
		}
	}
}

let currentChar = [
	[24,0],
	[23,0],
	[22,0],
];

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

drawCanvas();
drawChar(currentChar);

document.addEventListener('keydown', (e) => {
	if (e.key === 'w' || e.key === 'W') {
		move('up');
	}
	if (e.key === 's' || e.key === 'S') {
		move('down');
	}
	if (e.key === 'a' || e.key === 'A') {
		move('left');
	}
	if (e.key === 'd' || e.key === 'D') {
		move('right');
	}
})
