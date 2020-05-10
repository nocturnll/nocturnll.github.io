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

let HEAD_COLOR = '#2B5EA6';
let BODY_COLOR = '#CFA5C8';
const FOOD_COLOR = '#FFE38F';
const POISON_COLOR = '#CE2029';

// Snake
let head = [13, 13];    // Head cell [x, y]
let body = [];          // Body cell [[x, y], [x, y], ...]
let food = [Math.floor(Math.random() * GRID_WIDTH), Math.floor(Math.random() * GRID_HEIGHT)];      // Food cell [x, y]
let poisonApple = [];      // Food cell [x, y]
let direction = 'up';   // Direction (one of 'up', 'down', 'left', 'right')
let over = false;       // Whether the game is over
let poisonAppleActive = false;
let atePoisonApple = false;
let isPoisoned = false;
let clearPoisonApple
let highscore = 0;

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

	if (poisonAppleActive) {
		drawCell(poisonApple[0], poisonApple[1], POISON_COLOR);
	}

	// Draw score
	ctx.font = '400 15px Courier';
	ctx.fillStyle = '#000';
	ctx.fillText(body.length.toString(10), 10, 20);

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

		const highscoreBox = document.getElementById('highscore');
		if (over && body.length > highscore) {
			highscore = body.length;
			console.log('Your new high score is ' + highscore + '!');
			highscoreBox.innerHTML = highscore;
		}
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
		// move body (based on hea d and `ateFood` flag)

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

	//poison apple spawn logic
	const spawnPoison = () => {
		if (!poisonAppleActive) {
			if (body.length > 4) { // when poison apple will spawn
				let randomChance = 999; // doesnt actually matter
				randomChance = Math.random();
				if (randomChance < 0.02) { // set to 2%
					//poisonApple = [Math.floor(Math.random() * GRID_WIDTH), Math.floor(Math.random() * GRID_HEIGHT)];
					poisonApple = [1 + (Math.floor(Math.random() * (GRID_WIDTH - 2))), 1 + (Math.floor(Math.random() * (GRID_WIDTH - 2)))];
					while (poisonApple[0] === food[0] && poisonApple[1] === food[1]) { // if poison apple is on food
						poisonApple = [1 + (Math.floor(Math.random() * (GRID_WIDTH - 2))), 1 + (Math.floor(Math.random() * (GRID_WIDTH - 2)))]; // respawn apple
					};
					poisonAppleActive = true; // sets poison apple flag
					clearPoisonApple = setTimeout(() => {
						poisonAppleActive = false;
						poisonApple = [];
					}, 6000); // sets flag to false, resets poison apple location after 6sec
				}
			}
		}
	};

	/**
	 * Check whether the head is at the food, and eat the food if so
	 */
	const maybeEat = () => {
		// set the `ateFood` flag if head is at food
		if (head[0] === food[0] && head[1] === food[1]) {
			ateFood = true;
			console.log('Ate the food!');
		}

		// generate a new random food cell if snake ate the food
		if (ateFood) {
			food = [Math.floor(Math.random() * GRID_WIDTH), Math.floor(Math.random() * GRID_HEIGHT)];
		}

		if (head[0] === poisonApple[0] && head[1] === poisonApple[1]) {
			atePoisonApple = true;
			isPoisoned = true;
			console.log('Ate a poison apple! Oh no!');
			BODY_COLOR = '#EA3C53';
			HEAD_COLOR = '#960018';
			poisonApple = [];
		}

		if (atePoisonApple) {
			atePoisonApple = false;
			clearTimeout(clearPoisonApple); // cancels the poison apple timeout so it doesn't respawn early
			setTimeout(() => {
				HEAD_COLOR = '#2B5EA6';
				BODY_COLOR = '#CFA5C8';
				poisonAppleActive = false;
				isPoisoned = false;
				}, 9000);
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

	spawnPoison();
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
	let KEY_UP = 38;
	let KEY_DOWN = 40;
	let KEY_LEFT = 37;
	let KEY_RIGHT = 39;

	const pressed = e.which;

	if (!isPoisoned) {
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
	} else {
		switch (pressed) {
			case KEY_UP:
				direction = 'down';
				break;
			case KEY_DOWN:
				direction = 'up';
				break;
			case KEY_LEFT:
				direction = 'right';
				break;
			case KEY_RIGHT:
				direction = 'left';
				break;		
		}
	}
};

const resetGame = () => {
	head = [13, 13];    // Head cell [x, y]
	body = [];          // Body cell [[x, y], [x, y], ...]
	food = [2, 2];      // Food cell [x, y]
	direction = 'up';   // Direction (one of 'up', 'down', 'left', 'right')
	over = false;       // Whether the game is over
	atePoisonApple = false;
	isPoisoned = false;
	poisonAppleActive = false;
	poisonApple = [];
	HEAD_COLOR = '#2B5EA6';
	BODY_COLOR = '#CFA5C8';
	draw();
	tick();
	playAgain.style.display = 'none';
}

document.addEventListener('keydown', onKeyPress);
tick();

playButton.onclick = () => resetGame()