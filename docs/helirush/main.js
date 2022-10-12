title = "helirush";

description = `
[click] shot
`;
		characters = [
			`
 GGGGGG
g   g
ggggggg
g  gggg
`,
			`
 GGGGGGG
g   g
ggggggg
g  gggg
  `,
			`
GGGGGGG
g   g
ggggggg
g  gggg
  `,
		];

		options = {
			theme: "dark",
			// isPlayingBgm: true,
			// isReplayEnabled: true,
			seed: 8000,
			viewSize: { x: 100, y: 120 }
		};

		/**
		 * @type {{
		 * from: Vector, to: Vector, vel: Vector,
		 * ticks: number, prevLine: any, isActive: boolean
		 * }[]}
		 */
		let lines;
		let activeTicks;
		/** @type {{pos: Vector, vel: Vector}[]} */
		let human;



		/**
		 * @typedef { object } player
		 * @property { Vector } pos
		 * @property { number } firingrate
		 * @property { number } moving_velocity
		 */
		let player;

		/**
			* @typedef { object } enemies
			* @property { Vector } pos
		 */
		let enemies;
		let number_enemies;

		// declare Bullet
		/**
		 * @typedef { object } Bullet
		 * @property { Vector } pos
		 * @property { Vector } moving_velocity
		 */
		let Bullet;
		let bullet_speed;


		let firstClick;
		let secondClick;
		let twoClicksDuration;
		let holdDuration;

		let fireTrigger;

		let game_score;

		function update() {
			if (!ticks) {
				lines = [];
				activeTicks = -1;
				human = [];

				//init player
				player = {
					pos: vec(50, 30),
					firingrate: 50,
					moving_velocity: 1,
				};

				//init bullet
				bullet_speed = 1;

				//init enemies
				enemies = [];
				number_enemies = 5;

				//setup mouse input
				firstClick = false;
				secondClick = false;
				twoClicksDuration = 0;
				holdDuration = 0;
				//fire setup
				fireTrigger = false;

				//game score
				game_score = 30;
			}



			//   if (lines.length === 0) {
			//     const from = vec(rnd(30, 70), 0);
			//     lines.push({
			//       from,
			//       to: vec(from),
			//       vel: vec(0.5 * difficulty, 0).rotate(PI / 2),
			//       ticks: ceil(30 / difficulty),
			//       prevLine: undefined,
			//       isActive: false,
			//     });
			//   }

			if ((player.pos.x < 0) || (player.pos.x > 99)) {
				//  play("laser");
				player.moving_velocity *= -1;
			}



			//draw player
			player.pos.x += player.moving_velocity;
			color("black");
			char("a", player.pos);


			if (input.isJustPressed) {
				//first click = true means it's single click
				if (!firstClick) {
					firstClick = true;
				} else {
					//second click = true means it's double click
					secondClick = true;
					firstClick = false;
				}
			}

			if (input.isPressed) {
				holdDuration++;
				//if u hold, it will run hold code instead of single/double click
				if (holdDuration >= 15) {
					//=====================================
					//put your code for holding here
					console.log("holding");
					//=====================================
					secondClick = false;
					firstClick = false;
				}
			} else {
				if (firstClick && twoClicksDuration < 7) {
					twoClicksDuration++;
				} else {
					if (firstClick && holdDuration < 15) {
						//=====================================
						//put your code for single click here
						console.log("just a click");

						if (!fireTrigger) {

							fireTrigger = true;
							Bullet = {
								pos: vec(player.pos),
								moving_velocity: bullet_speed,
							}


						}


						//=====================================
					}
					if (secondClick && holdDuration < 15) {
						//=====================================
						//put your code for double click here
						console.log("double click");
						//=====================================
						secondClick = false;
					}
					holdDuration = 0;
					twoClicksDuration = 0;
					firstClick = false;
				}

			}

			if (fireTrigger) {
				color("yellow");
				box(Bullet.pos, 2, 3);
				Bullet.pos.y += Bullet.moving_velocity;

				if (Bullet.pos.y >= 120) {
					fireTrigger = false;
				}
			}


			if (enemies.length === 0) {

				for (let i = 0; i < number_enemies; i++) {
					const posX = rnd(20, 100);
					const posY = 100;
					enemies.push({
						pos: vec(posX, posY)
					})
				}
			}



			// This time, with remove()
			remove(enemies, (e) => {

				color("red");
				const isCollidingWithBullets = box(e.pos, 10, 10).isColliding.rect.yellow;
				if (isCollidingWithBullets) {
					play("explosion");
					color("yellow");
					particle(e.pos,
						100, // The number of particles
						1, // The speed of the particles
						-PI / 2, // The emitting angle
						PI  // The emitting width
					);
					game_score += 10;
					addScore(game_score, e.pos);
				}
				return (isCollidingWithBullets);
			});
				}
