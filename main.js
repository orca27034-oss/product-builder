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
let timer = 0;
let timerInterval = null;
let firstClick = true;
let isGameOver = false;

function initGame() {
    const { rows, cols, mines: totalMines } = levels[currentLevel];
    boardElement.className = "board " + currentLevel;
    boardElement.style.gridTemplateColumns = "repeat(" + cols + ", 30px)";
    if (window.innerWidth <= 500) {
        boardElement.style.gridTemplateColumns = "repeat(" + cols + ", 25px)";
    }
    
    boardElement.innerHTML = '';
    grid = [];
    mines = [];
    revealedCount = 0;
    flags = 0;
    timer = 0;
    firstClick = true;
    isGameOver = false;
    clearInterval(timerInterval);
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
        
        // Don't place mine on first click or already placed mine
        if ((r === firstRow && c === firstCol) || grid[r][c].isMine) continue;
        
        // Don't place mine in immediate neighbors of first click for better start
        if (Math.abs(r - firstRow) <= 1 && Math.abs(c - firstCol) <= 1) continue;

        grid[r][c].isMine = true;
        mines.push({ r, c });
        placed++;
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c].isMine) continue;
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isMine) {
                        count++;
                    }
                }
            }
            grid[r][c].neighborMines = count;
        }
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = String(Math.min(timer, 999)).padStart(3, '0');
    }, 1000);
}

function handleLeftClick(r, c) {
    if (isGameOver || grid[r][c].isRevealed || grid[r][c].isFlagged) return;

    if (firstClick) {
        firstClick = false;
        plantMines(r, c);
        startTimer();
    }

    const cell = grid[r][c];
    if (cell.isMine) {
        gameOver(false);
        return;
    }

    reveal(r, c);
    checkWin();
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
        // Auto-reveal neighbors for 0-mine cells
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    reveal(nr, nc);
                }
            }
        }
    }
}

function handleRightClick(r, c) {
    if (isGameOver || grid[r][c].isRevealed) return;

    const cell = grid[r][c];
    const { mines: totalMines } = levels[currentLevel];

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

    mineCountElement.textContent = String(Math.max(0, totalMines - flags)).padStart(3, '0');
}

function checkWin() {
    const { rows, cols, mines: totalMines } = levels[currentLevel];
    if (revealedCount === (rows * cols) - totalMines) {
        gameOver(true);
    }
}

function gameOver(isWin) {
    isGameOver = true;
    clearInterval(timerInterval);
    resetBtn.textContent = isWin ? '😎' : '😵';

    if (!isWin) {
        mines.forEach(({ r, c }) => {
            const cell = grid[r][c];
            cell.element.classList.add('revealed', 'mine');
            cell.element.textContent = '💣';
        });
    } else {
        mineCountElement.textContent = '000';
    }
}

// Event Listeners
resetBtn.addEventListener('click', initGame);

diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        diffBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentLevel = btn.dataset.level;
        initGame();
    });
});

window.addEventListener('resize', () => {
    const { cols } = levels[currentLevel];
    if (window.innerWidth <= 500) {
        boardElement.style.gridTemplateColumns = "repeat(" + cols + ", 25px)";
    } else {
        boardElement.style.gridTemplateColumns = "repeat(" + cols + ", 30px)";
    }
});

initGame();