const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

// Create the pong paddle and ball
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let player = {
    x: 0,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FFDD00',
    score: 0
};

let ai = {
    x: canvas.width - paddleWidth,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FF3300',
    score: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    speedX: 5,
    speedY: 5,
    color: '#00FF00'
};

// Draw everything
function draw() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw paddles with shadow
    context.shadowColor = 'rgba(0, 0, 0, 0.5)';
    context.shadowBlur = 20;
    context.fillStyle = player.color;
    context.fillRect(player.x, player.y, player.width, player.height);
    context.fillStyle = ai.color;
    context.fillRect(ai.x, ai.y, ai.width, ai.height);
    
    // Draw ball with glowing effect
    context.fillStyle = ball.color;
    context.beginPath();
    context.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    context.fill();
    
    // Draw scoreboard with glowing effect
    context.fillStyle = '#FFFFFF';
    context.font = '30px Arial';
    context.fillText(`Player: ${player.score}`, 30, 40);
    context.fillText(`AI: ${ai.score}`, canvas.width - 130, 40);
}

// Move the paddles
function movePaddles(event) {
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    player.y = mouseY - paddleHeight / 2;
}

// Update the game state
function update() {
    // Move AI paddle
    if (ball.y > ai.y + ai.height / 2) {
        ai.y += 4;
    } else {
        ai.y -= 4;
    }

    // Ball movement
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top and bottom
    if (ball.y <= 0 || ball.y >= canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Ball collision with paddles
    if (ball.x <= player.x + player.width && ball.y >= player.y && ball.y <= player.y + player.height) {
        ball.speedX = -ball.speedX;
    }
    if (ball.x >= ai.x - ball.size && ball.y >= ai.y && ball.y <= ai.y + ai.height) {
        ball.speedX = -ball.speedX;
    }

    // Score update
    if (ball.x <= 0) {
        ai.score++;
        resetBall();
    } else if (ball.x >= canvas.width) {
        player.score++;
        resetBall();
    }

    // Prevent paddles from going out of bounds
    player.y = Math.max(Math.min(player.y, canvas.height - player.height), 0);
    ai.y = Math.max(Math.min(ai.y, canvas.height - ai.height), 0);
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = 5 * (Math.random() > 0.5 ? 1 : -1);
}

// Game loop
function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

// Start the game
startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('scoreboard').style.display = 'block';
    resetBall();
    gameLoop();
});

canvas.addEventListener('mousemove', movePaddles);
