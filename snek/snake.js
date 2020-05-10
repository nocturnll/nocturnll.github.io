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
const BUFF_COLOR = '#F60';
const SPEEDY_COLOR = '#4CBB17';

// Snake
let head = [13, 13];    // Head cell [x, y]
let body = [];          // Body cell [[x, y], [x, y], ...]
let food = [Math.floor(Math.random() * GRID_WIDTH), Math.floor(Math.random() * GRID_HEIGHT)];      // Food cell [x, y]
let buffApple = [];      // buff cell [x,y]
let direction = 'up';   // Direction (one of 'up', 'down', 'left', 'right')
let over = false;       // Whether the game is over
let buffAppleActive = false; // is there a buff apple on the field
let ateBuffApple = false; // did u eat the buff apple
let isPoisoned = false; // r u poisoned
let isSpeedy = false; // r u speedy
let buffType = ''; // what kind of buff apple is it
let clearBuffApple // a timeout that despawns the buff apple
let highscore = 0; // ur highscore (doesnt persist across sessions)
let baseSpeed = 300; // how fast the game plays, 300ms
let newSpeed = 0; // used in tick speed calculation to make it go faster

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

	// draw buff apple
	if (buffAppleActive) {
		drawCell(buffApple[0], buffApple[1], BUFF_COLOR);
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

	//buff apple spawn logic
	const spawnBuff = () => {
		if (!buffAppleActive) {
			if (body.length > 4) { // when buff apple will spawn
//			if (body.length > 0) { // uncomment for debugging
				let randomChance = 999; // doesnt actually matter
				randomChance = Math.random();
				if (randomChance < 0.05) { // set to 5%
//				if (randomChance > 0.01) { // uncomment for debugging
					buffApple = [1 + (Math.floor(Math.random() * (GRID_WIDTH - 2))), 1 + (Math.floor(Math.random() * (GRID_WIDTH - 2)))];
					while (buffApple[0] === food[0] && buffApple[1] === food[1]) { // if buff apple is on food
						buffApple = [1 + (Math.floor(Math.random() * (GRID_WIDTH - 2))), 1 + (Math.floor(Math.random() * (GRID_WIDTH - 2)))]; // respawn apple
					};
					buffAppleActive = true; // sets buff apple flag
					let buffRandom = Math.random();
					if (buffRandom > 0.5) {
						buffType = 'poison';
					} else {
						buffType = 'speedy';
					};
					clearBuffApple = setTimeout(() => {
						buffAppleActive = false;
						buffApple = [];
					}, 6000); // sets flag to false, resets buff apple location after 6sec
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

		if (head[0] === buffApple[0] && head[1] === buffApple[1]) {
			ateBuffApple = true;
			console.log(buffType);
			if (buffType === 'poison') {
				isPoisoned = true;
				console.log('Ate a poison apple! Oh no!');
				BODY_COLOR = '#EA3C53';
				HEAD_COLOR = '#960018';
				buffApple = [];
			} else if (buffType === 'speedy') {
				isSpeedy = true;
				console.log('Ate a speedy apple! Zoom!');
				HEAD_COLOR = '#0B6623';
				BODY_COLOR = '#00AB6B';
				buffApple = [];
		}
	}

		if (ateBuffApple) {
			ateBuffApple = false;
			clearTimeout(clearBuffApple); // cancels the buff apple timeout so it doesn't respawn early
			setTimeout(() => {
				HEAD_COLOR = '#2B5EA6';
				BODY_COLOR = '#CFA5C8';
				buffAppleActive = false;
				isSpeedy = false;
				isPoisoned = false;
				buffType = '';
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

	spawnBuff();
	maybeEat();
	move();
	maybeEnd();

	draw();

	if (!over) { // schedules the next tick of the game
		if (isSpeedy && buffType === 'speedy') { // speedy boi goes 100ms fast
			timeout = setTimeout(tick, 100);
		} else {
			if (body.length < 67) { // while youre 66 long or less (should work out to 100ms~ max)
				newSpeed = baseSpeed - (body.length * 3); // get faster as u get longer
			}
			timeout = setTimeout(tick, newSpeed);
		}
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
	ateBuffApple = false;
	isPoisoned = false;
	buffAppleActive = false;
	buffApple = [];
	HEAD_COLOR = '#2B5EA6';
	BODY_COLOR = '#CFA5C8';
	draw();
	tick();
	playAgain.style.display = 'none';
}

document.addEventListener('keydown', onKeyPress);
tick();

playButton.onclick = () => resetGame()