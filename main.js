/* eslint-disable max-classes-per-file */
// **************************************************************
// DOM REFERENCES
// **************************************************************
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// **************************************************************
// CONSTANTS
// **************************************************************

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const color = getRandomColor();
const arialFont = '16px Arial';
const bricks = [];
// **************************************************************
// VARIABLES
// **************************************************************
let x = canvasWidth / 2;
let y = canvasHeight - 30;
let dx = 3;
let dy = -3;
let paddleX = (canvasWidth - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3;

// **************************************************************
// CLASSES
// **************************************************************
class Ball {
  constructor(x = 0, y = 0, dx = 1, dy = -1, radius = 10, color = 'blue') {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.speed = 2;
  }

  render(ctx) {
    const fullCircle = Math.PI * 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, fullCircle);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  move() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }
}

const ball = new Ball(canvasWidth / 2, canvasHeight - 30);

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = brickWidth;
    this.height = brickHeight;
    this.status = 1;
  }
}

//  Bricks
//  Paddle
//  Score

//  Lives

//  Game

// **************************************************************
// Functions
// **************************************************************

function collisionDetection() {
  const congrats = 'YOU WIN, CONGRATS!';
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          ball.x > b.x &&
          ball.x < b.x + brickWidth &&
          ball.y > b.y &&
          ball.y < b.y + brickHeight
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            alert(congrats);
            document.location.reload();
          }
          if (score >= 5 && score < 10) {
            ball.speed = 3;
          } else if (score > 9) {
            ball.speed = 4;
          }
        }
      }
    }
  }
}
function initializeBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r += 1) {
      const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;

      bricks[c][r] = new Brick(brickX, brickY);
    }
  }
}

initializeBricks();
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvasHeight - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function drawScore() {
  ctx.font = arialFont;
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, 8, 20);
}
function drawLives() {
  ctx.font = arialFont;
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Lives:  ${lives}`, canvasWidth - 65, 20);
}

// **************************************************************
// GAME LOOP
// **************************************************************
function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ball.move();
  drawBricks();
  ball.render(ctx);
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // Bounce the ball off the left and right of the canvas
  if (
    ball.x + ball.dx > canvas.width - ball.radius ||
    ball.x + ball.dx < ball.radius
  ) {
    ball.dx = -ball.dx;
  }

  // Bounce the ball off the top, paddle, or hit the bottom of the canvas
  if (ball.y + ball.dy < ball.radius) {
    // hit the top
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    // hit the bottom
    if (ball.x > paddleX && x < paddleX + paddleWidth) {
      // Hit the paddle
      ball.dy = -ball.dy;
    } else {
      // Lose a life
      lives -= 1;
      if (!lives) {
        // Game Over
        // eslint-disable-next-line no-alert
        alert('GAME OVER'); // * Could be good as a constant
        x = 200;
        y = 200;
        document.location.reload();
      } else {
        // Start the over you hit the bottom
        // ** Set the position of ball and paddle
        // ** And set the speed and direction of the ball
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        ball.dx = 1;
        ball.dy = -1;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  // Check for arrow keys
  // *** Better as a function
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  // Draw the screen again
  requestAnimationFrame(draw);
}
function getRandomColor() {
  const letters = 'ABCDE'.split('');
  let colors = '#';
  for (let i = 0; i < 3; i += 1) {
    colors += letters[Math.floor(Math.random() * letters.length)];
  }
  return colors;
}
// **************************************************************
// Events LISTENERS
// **************************************************************
function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvasWidth) {
    paddleX = relativeX - paddleWidth / 2;
  }
}
// **************************************************************
// Register Events
// **************************************************************
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
// **************************************************************
// START PROGRAM ENTRY POINT
// **************************************************************
draw();
