const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const startBtn = document.getElementById('start-btn');
const overlay = document.getElementById('game-overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayMsg = document.getElementById('overlay-msg');

// Game constants
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Game variables
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let nextDx = 0;
let nextDy = 0;
let score = 0;
let highScore = localStorage.getItem('snake-high-score') || 0;
let gameSpeed = 100;
let isGameOver = false;
let gameLoopId = null;

highScoreElement.textContent = highScore;

function initGame() {
    snake = [{ x: 10, y: 10 }];
    score = 0;
    dx = 1;
    dy = 0;
    nextDx = 1;
    nextDy = 0;
    scoreElement.textContent = score;
    isGameOver = false;
    gameSpeed = 100;
    createFood();
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // Make sure food doesn't appear on snake body
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) createFood();
    });
}

function drawGame() {
    if (isGameOver) return;

    moveSnake();
    checkCollision();
    
    // Clear canvas
    ctx.fillStyle = '#2d2d2d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for(let i=0; i<tileCount; i++) {
        ctx.beginPath(); ctx.moveTo(i*gridSize, 0); ctx.lineTo(i*gridSize, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i*gridSize); ctx.lineTo(canvas.width, i*gridSize); ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#f44336';
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake
    snake.forEach((part, index) => {
        ctx.fillStyle = (index === 0) ? '#4CAF50' : '#81C784';
        ctx.strokeStyle = '#2d2d2d';
        ctx.lineWidth = 2;
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        ctx.strokeRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
        
        // Add eyes to head
        if (index === 0) {
            ctx.fillStyle = 'white';
            const eyeSize = 3;
            if (dx === 1) { // Right
                ctx.fillRect(part.x * gridSize + 12, part.y * gridSize + 4, eyeSize, eyeSize);
                ctx.fillRect(part.x * gridSize + 12, part.y * gridSize + 12, eyeSize, eyeSize);
            } else if (dx === -1) { // Left
                ctx.fillRect(part.x * gridSize + 4, part.y * gridSize + 4, eyeSize, eyeSize);
                ctx.fillRect(part.x * gridSize + 4, part.y * gridSize + 12, eyeSize, eyeSize);
            } else if (dy === 1) { // Down
                ctx.fillRect(part.x * gridSize + 4, part.y * gridSize + 12, eyeSize, eyeSize);
                ctx.fillRect(part.x * gridSize + 12, part.y * gridSize + 12, eyeSize, eyeSize);
            } else if (dy === -1) { // Up
                ctx.fillRect(part.x * gridSize + 4, part.y * gridSize + 4, eyeSize, eyeSize);
                ctx.fillRect(part.x * gridSize + 12, part.y * gridSize + 4, eyeSize, eyeSize);
            }
        }
    });

    gameLoopId = setTimeout(drawGame, gameSpeed);
}

function moveSnake() {
    dx = nextDx;
    dy = nextDy;
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snake-high-score', highScore);
        }
        createFood();
        // Increase speed slightly
        if (gameSpeed > 50) gameSpeed -= 1;
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
    }
    
    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
        }
    }
}

function gameOver() {
    isGameOver = true;
    clearTimeout(gameLoopId);
    overlayTitle.textContent = 'Game Over!';
    overlayMsg.textContent = `Final Score: ${score}`;
    startBtn.textContent = 'Play Again';
    overlay.style.display = 'flex';
}

function changeDirection(newDx, newDy) {
    // Prevent 180 degree turns
    if (newDx === -dx || newDy === -dy) return;
    nextDx = newDx;
    nextDy = newDy;
}

// Input Handling
window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': changeDirection(0, -1); break;
        case 'ArrowDown': case 's': case 'S': changeDirection(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': changeDirection(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': changeDirection(1, 0); break;
    }
});

// Mobile Controls
document.getElementById('up-btn').addEventListener('click', () => changeDirection(0, -1));
document.getElementById('down-btn').addEventListener('click', () => changeDirection(0, 1));
document.getElementById('left-btn').addEventListener('click', () => changeDirection(-1, 0));
document.getElementById('right-btn').addEventListener('click', () => changeDirection(1, 0));

startBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    initGame();
    drawGame();
});
