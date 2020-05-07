// Get canvas context for drawing
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');


/**
 * Draw a cell
 * @param {Number} x - x position
 * @param {Number} y - y position
 * @param {String} color - color to fill
 *		e.g. 'green', 'red', '#2B5EA6'
 */
const drawCell = (x, y, color) => {
	ctx.fillStyle = color;
	ctx.fillRect(x * 20, y * 20, 20, 20);
};

/**
 * Reset the canvas
 */
const resetCanvas = () => {
	ctx.fillStyle = '#FFF';
	ctx.fillRect(0, 0, 500, 500);
};

///////////////////////////////////////////////////////////////////////
//                                                                   //
//                             SNAKE                                 //
//                                                                   //
///////////////////////////////////////////////////////////////////////

// Constants
const GRID_WIDTH = 25;
const GRID_HEIGHT = 25;

const HEAD_COLOR = '#2B5EA6';
const BODY_COLOR = '#CFA5C8';
const FOOD_COLOR = '#FFE38F';

// Snake
let head = [13, 13];    // Head cell [x, y]
let body = [];          // Body cell [[x, y], [x, y], ...]
let food = [Math.floor(Math.random() * GRID_WIDTH), Math.floor(Math.random() * GRID_HEIGHT)];      // Food cell [x, y]
let direction = 'up';   // Direction (one of 'up', 'down', 'left', 'right')
let over = false;       // Whether the game is over

// Functions

/**
 * Draw the current game state
 */
const draw = () => {
	resetCanvas();

	// draw body
	for (let i = 0; i < body.length; i++) {
		drawCell(body[i][0], body[i][1], BODY_COLOR);
	}

	// Draw head and food
	drawCell(food[0], food[1], FOOD_COLOR);
	drawCell(head[0], head[1], HEAD_COLOR);

	// Draw score
	ctx.font = '400 15px Courier';
	ctx.fillStyle = '#000';
	ctx.fillText((body.length + 1).toString(10), 10, 20);

	// Draw "Game over" text if game is over
	if (over) {
		ctx.fillStyle = '#F00';
		ctx.fillRect(179, 230, 142, 32);
		ctx.fillStyle = '#FFF';
		ctx.fillRect(180, 231, 140, 30);

		ctx.font = '400 15px Courier';
		ctx.fillStyle = '#F00';
		ctx.textAlign = 'center';
		ctx.fillText('GAME OVER', 250, 250, 500);

		const playAgain = document.getElementById('playAgain');
		playAgain.style.display = 'block';
	}
};

/**
 * Game tick - generate the next game state
 */
const tick = () => {
	// Flag to set when the snake ate the food
	let ateFood = false;

	/**
	 * Move the snake based on the current snake and direction
	 */
	const move = () => {
		// move body (based on head and `ateFood` flag)

		if (!ateFood && body.length) {
			body = body.slice(0, body.length - 1);
			body.unshift([head[0], head[1]]);
		} else if (ateFood) {
			body.unshift([head[0], head[1]]);
		}

		// move head based on direction
		switch (direction) {
			case 'up':
				head[1]--;
				break;
			case 'down':
				head[1]++;
				break;
			case 'left':
				head[0]--;
				break;
			case 'right':
				head[0]++;
				break;
		}
	};

	/**
	 * Check whether the head is at the food, and eat the food if so
	 */
	const maybeEat = () => {
		// TODO: set the `ateFood` flag if head is at food
		if (head[0] === food[0] && head[1] === food[1]) {
			ateFood = true;
			console.log('Ate the food!');
		}

		// TODO: generate a new random food cell if snake ate the food
		if (ateFood) {
			food = [Math.floor(Math.random() * GRID_WIDTH), Math.floor(Math.random() * GRID_HEIGHT)];
		}
	};

	/**
	 * Check whether the game is over
	 */
	const maybeEnd = () => {
		// set the `over` flag if the head is out of bounds
		if (head[0] < 0 || head[0] > GRID_WIDTH - 1 || head[1] < 0 || head[1] > GRID_HEIGHT - 1) {
			over = true;
		}


		// set the `over` flag if the head hit the body
		if (body.find(x => x[0] === head[0] && x[1] === head[1])) {
			over = true;
		}
	};

	maybeEat();
	move();
	maybeEnd();

	draw();

	if (!over) {
		// Schedule the next game tick (every 300ms, make this lower for higher difficulty)
		timeout = setTimeout(tick, 300);
	}
};

// Handle keypresses
const onKeyPress = (e) => {
	const KEY_UP = 38;
	const KEY_DOWN = 40;
	const KEY_LEFT = 37;
	const KEY_RIGHT = 39;

	const pressed = e.which;

	// set direction based on pressed key
	switch (pressed) {
		case KEY_UP:
			direction = 'up';
			break;
		case KEY_DOWN:
			direction = 'down';
			break;
		case KEY_LEFT:
			direction = 'left';
			break;
		case KEY_RIGHT:
			direction = 'right';
			break;
	}
};

const resetGame = () => {
	head = [13, 13];    // Head cell [x, y]
	body = [];          // Body cell [[x, y], [x, y], ...]
	food = [2, 2];      // Food cell [x, y]
	direction = 'up';   // Direction (one of 'up', 'down', 'left', 'right')
	over = false;       // Whether the game is over
	draw();
	tick();
	playAgain.style.display = 'none';
}

document.addEventListener('keydown', onKeyPress);
tick();

playButton.onclick = () => resetGame()