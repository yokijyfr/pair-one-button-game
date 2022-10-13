title = "escapefrombombs";

description = `
[click] turn
`;
characters = [
  `
 l
lll
l l
`,
  `
llllll
ll l l
ll l l
llllll
 l  l
 l  l
  `,
  `
llllll
ll l l
ll l l
llllll
ll  ll
  `,
];

options = {
  theme: "dark",
  seed: 8000,
  viewSize: {x: 100, y: 130}
};

/**
 * @type {{
 * from: Vector, to: Vector, vel: Vector,
 * ticks: number, prevLine: any, isActive: boolean
 * }[]}
 */
let lines;
let activeTicks;
/** @type {{x: number, vx: number}} */
let player;
let multiplier;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Star
 */

/**
 * @type { Star [] }
 */
let stars;



function update() {
  if (!ticks) {
    lines = [];
    activeTicks = -1;
    stars = [];
    player = { x: 40, vx: 1 };
    multiplier = 1;

    stars = times(10, () => {
      const posX = rnd(0, 100);
      const posY = rnd(0, 130);
      return {
          pos: vec(posX, posY),
          speed: rnd(0.2, 0.5)
      };
  });

  }

  stars.forEach((s) => {
    s.pos.y += s.speed;
    if (s.pos.y > 130) s.pos.y = 0;

    color("light_black");
    box(s.pos, 1);
});

  if (lines.length === 0) {
    const from = vec(rnd(30, 70), 0);
    lines.push({
      from,
      to: vec(from),
      vel: vec(0.5 * difficulty, 0).rotate(PI / 2),
      ticks: ceil(30 / difficulty),
      prevLine: undefined,
      isActive: false,
    });
  }



  color("light_blue");
  rect(0, 90, 100, 10);
  activeTicks--;

  if (
    input.isJustPressed ||
    (player.x < 0 && player.vx < 0) ||
    (player.x > 99 && player.vx > 0)
  ) {
    play("laser");
    player.vx *= -1;
  }
  player.x += player.vx * sqrt(difficulty);
  color("black");
  if (
    char(addWithCharCode("b", floor(ticks / 10) % 2), player.x, 87, {
      mirror: { x: player.vx > 0 ? 1 : -1 },
    }).isColliding.rect.yellow
  ) {
    play("lucky");
    end();
  }
}