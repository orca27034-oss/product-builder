// Game Switching Logic
const switchBtns = document.querySelectorAll('.switch-btn');
const gameContainers = document.querySelectorAll('.game-container');

switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const game = btn.dataset.game;
        
        switchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        gameContainers.forEach(container => {
            container.classList.remove('active');
            if (container.id === `${game}-game`) {
                container.classList.add('active');
            }
        });

        if (game === 'snake') {
            clearInterval(msTimerInterval);
            initSnakeGame();
        } else {
            stopSnakeGame();
            initMinesweeper();
        }
    });
});

// --- Minesweeper Logic ---
const boardElement = document.getElementById('game-board');
const mineCountElement = document.getElementById('mine-count');
const timerElement = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');
const diffBtns = document.querySelectorAll('.diff-btn');

const levels = {
    beginner: { rows: 9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 }
};

let currentLevel = 'beginner';
let grid = [];
let mines = [];
let revealedCount = 0;
let flags = 0;
let msTimer = 0;
let msTimerInterval = null;
let firstClick = true;
let isMSGameOver = false;

function initMinesweeper() {
    const { rows, cols, mines: totalMines } = levels[currentLevel];
    boardElement.className = "board " + currentLevel;
    boardElement.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    if (window.innerWidth <= 500) {
        boardElement.style.gridTemplateColumns = `repeat(${cols}, 25px)`;
    }
    
    boardElement.innerHTML = '';
    grid = [];
    mines = [];
    revealedCount = 0;
    flags = 0;
    msTimer = 0;
    firstClick = true;
    isMSGameOver = false;
    clearInterval(msTimerInterval);
    timerElement.textContent = '000';
    mineCountElement.textContent = String(totalMines).padStart(3, '0');
    resetBtn.textContent = '😊';

    for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            cell.addEventListener('click', () => handleLeftClick(r, c));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleRightClick(r, c);
            });
            
            boardElement.appendChild(cell);
            grid[r][c] = {
                element: cell,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            };
        }
    }
}

function plantMines(firstRow, firstCol) {
    const { rows, cols, mines: totalMines } = levels[currentLevel];
    let placed = 0;
    while (placed < totalMines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if ((r === firstRow && c === firstCol) || grid[r][c].isMine) continue;
        if (Math.abs(r - firstRow) <= 1 && Math.abs(c - firstCol) <= 1) continue;
        grid[r][c].isMine = true;
        mines.push({ r, c });
        placed++;
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c].isMine) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isMine) count++;
                }
            }
            grid[r][c].neighborMines = count;
        }
    }
}

function startMSTimer() {
    msTimerInterval = setInterval(() => {
        msTimer++;
        timerElement.textContent = String(Math.min(msTimer, 999)).padStart(3, '0');
    }, 1000);
}

function handleLeftClick(r, c) {
    if (isMSGameOver || grid[r][c].isRevealed || grid[r][c].isFlagged) return;
    if (firstClick) {
        firstClick = false;
        plantMines(r, c);
        startMSTimer();
    }
    if (grid[r][c].isMine) {
        endMSGame(false);
        return;
    }
    reveal(r, c);
    if (revealedCount === (levels[currentLevel].rows * levels[currentLevel].cols) - levels[currentLevel].mines) {
        endMSGame(true);
    }
}

function reveal(r, c) {
    const { rows, cols } = levels[currentLevel];
    const cell = grid[r][c];
    if (cell.isRevealed || cell.isFlagged) return;
    cell.isRevealed = true;
    cell.element.classList.add('revealed');
    revealedCount++;
    if (cell.neighborMines > 0) {
        cell.element.textContent = cell.neighborMines;
        cell.element.classList.add('n' + cell.neighborMines);
    } else {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) reveal(nr, nc);
            }
        }
    }
}

function handleRightClick(r, c) {
    if (isMSGameOver || grid[r][c].isRevealed) return;
    const cell = grid[r][c];
    if (cell.isFlagged) {
        cell.isFlagged = false;
        cell.element.classList.remove('flagged');
        cell.element.textContent = '';
        flags--;
    } else {
        cell.isFlagged = true;
        cell.element.classList.add('flagged');
        cell.element.textContent = '🚩';
        flags++;
    }
    mineCountElement.textContent = String(Math.max(0, levels[currentLevel].mines - flags)).padStart(3, '0');
}

function endMSGame(isWin) {
    isMSGameOver = true;
    clearInterval(msTimerInterval);
    resetBtn.textContent = isWin ? '😎' : '😵';
    if (!isWin) {
        mines.forEach(({ r, c }) => {
            grid[r][c].element.classList.add('revealed', 'mine');
            grid[r][c].element.textContent = '💣';
        });
    } else {
        mineCountElement.textContent = '000';
    }
}

resetBtn.addEventListener('click', initMinesweeper);
diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        diffBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLevel = btn.dataset.level;
        initMinesweeper();
    });
});

// --- Snake Logic ---
const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const snakeScoreElement = document.getElementById('snake-score');
const snakeHighScoreElement = document.getElementById('snake-high-score');
const snakeResetBtn = document.getElementById('snake-reset-btn');

const gridSize = 20;
const tileCount = 20;

let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let nextDx = 0;
let nextDy = 0;
let score = 0;
let highScore = 0;
try {
    highScore = localStorage.getItem('snakeHighScore') || 0;
} catch (e) {
    highScore = 0;
}
let snakeGameInterval = null;
let snakeSpeed = 100;
let isSnakeMoving = false;
let isSnakeGameOver = false;

function initSnakeGame() {
    stopSnakeGame();
    snake = [{ x: 10, y: 10 }];
    generateFood();
    dx = 0;
    dy = 0;
    nextDx = 0;
    nextDy = 0;
    score = 0;
    isSnakeMoving = false;
    isSnakeGameOver = false;
    snakeScoreElement.textContent = '000';
    snakeHighScoreElement.textContent = String(highScore).padStart(3, '0');
    
    drawSnakeGame();
    snakeGameInterval = setInterval(updateSnake, snakeSpeed);
}

function stopSnakeGame() {
    clearInterval(snakeGameInterval);
    snakeGameInterval = null;
}

function updateSnake() {
    if (isSnakeGameOver) return;

    dx = nextDx;
    dy = nextDy;
    
    if (dx !== 0 || dy !== 0) {
        isSnakeMoving = true;
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            return endSnakeGame();
        }

        // Self collision
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) return endSnakeGame();
        }

        snake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            snakeScoreElement.textContent = String(score).padStart(3, '0');
            if (score > highScore) {
                highScore = score;
                try {
                    localStorage.setItem('snakeHighScore', highScore);
                } catch (e) {}
                snakeHighScoreElement.textContent = String(highScore).padStart(3, '0');
            }
            generateFood();
        } else {
            snake.pop();
        }
    }

    drawSnakeGame();
}

function drawSnakeGame() {
    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc((food.x * gridSize) + gridSize/2, (food.y * gridSize) + gridSize/2, gridSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw snake
    snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#3b82f6' : '#60a5fa';
        ctx.fillRect(part.x * gridSize + 1, part.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });

    if (!isSnakeMoving && !isSnakeGameOver) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '20px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Press any Arrow Key to Start', canvas.width / 2, canvas.height / 2 + 50);
    }

    if (isSnakeGameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 30px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = '20px Inter, sans-serif';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText('Press Reset to Try Again', canvas.width / 2, canvas.height / 2 + 70);
    }
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) return generateFood();
    }
}

function endSnakeGame() {
    isSnakeGameOver = true;
    isSnakeMoving = false;
    drawSnakeGame();
}

window.addEventListener('keydown', e => {
    // Only handle keys if snake game is active
    const snakeGameActive = document.getElementById('snake-game').classList.contains('active');
    if (!snakeGameActive) return;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 's', 'a', 'd'].includes(e.key)) {
        e.preventDefault();
    }

    if (isSnakeGameOver) return;

    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            if (dy !== 1) { nextDx = 0; nextDy = -1; }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            if (dy !== -1) { nextDx = 0; nextDy = 1; }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            if (dx !== 1) { nextDx = -1; nextDy = 0; }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            if (dx !== -1) { nextDx = 1; nextDy = 0; }
            break;
    }
});

snakeResetBtn.addEventListener('click', initSnakeGame);

// Initial start
initMinesweeper();
