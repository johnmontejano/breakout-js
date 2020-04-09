const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const ballRadius = 10;
let x = canvasWidth / 2;
let y = canvasHeight - 30;
let dx = 3;
let dy = -3;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvasWidth - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
const brickRowCount = 5;
const brickColumnCount = 3;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let score = 0;
let lives = 3;
const color = getRandomColor();
const arialFont = '16px Arial';
const bricks = [];

for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

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
function collisionDetection() {
  const congrats = 'YOU WIN, CONGRATS!';
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score += 1;
          if (score === brickRowCount * brickColumnCount) {
            alert(congrats);
            document.location.reload();
          }
          if (score >= 5) {
            dy += -2;
            dx += 2;
          }
        }
      }
    }
  }
}

function drawBall() {
  const fullCircle = Math.PI * 2;
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, fullCircle);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}
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
      if (bricks[c][r].status === 1) {
        const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
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
function moveBall() {
  x += dx;
  y += dy;
}
function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  moveBall();
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  // Bounce the ball off the left and right of the canvas
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  // Bounce the ball off the top, paddle, or hit the bottom of the canvas
  if (y + dy < ballRadius) {
    // hit the top
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    // hit the bottom
    if (x > paddleX && x < paddleX + paddleWidth) {
      // Hit the paddle
      dy = -dy;
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
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
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
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

draw();
