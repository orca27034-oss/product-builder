let clicks = 0;
let timeLeft = 5.00;
let testDuration = 5;
let isRunning = false;
let timerId = null;

const clickArea = document.getElementById('click-area');
const timerDisplay = document.getElementById('timer');
const clickCountDisplay = document.getElementById('click-count');
const cpsDisplay = document.getElementById('cps-display');
const resetBtn = document.getElementById('reset-btn');
const timeBtns = document.querySelectorAll('.time-btn');

// Modal elements
const modal = document.getElementById('result-modal');
const finalCps = document.getElementById('final-cps');
const finalClicks = document.getElementById('final-clicks');
const rankText = document.getElementById('rank-text');
const closeModal = document.getElementById('close-modal');

function startTest() {
    isRunning = true;
    clickArea.querySelector('span').textContent = 'Click Fast!';
    
    const startTime = Date.now();
    const endTime = startTime + (testDuration * 1000);

    timerId = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, (endTime - now) / 1000);
        
        timeLeft = remaining;
        timerDisplay.textContent = timeLeft.toFixed(2);

        if (timeLeft <= 0) {
            endTest();
        }
    }, 10);
}

function endTest() {
    isRunning = false;
    clearInterval(timerId);
    clickArea.style.pointerEvents = 'none';
    clickArea.querySelector('span').textContent = "Time's Up!";
    
    const cps = (clicks / testDuration).toFixed(1);
    showResult(cps, clicks);
}

function showResult(cps, totalClicks) {
    finalCps.textContent = cps;
    finalClicks.textContent = totalClicks;
    
    let rank = '';
    if (cps >= 12) rank = 'Godlike! 🚀';
    else if (cps >= 10) rank = 'Pro Clicker! 🔥';
    else if (cps >= 7) rank = 'Fast! ⚡';
    else if (cps >= 4) rank = 'Average. 😐';
    else rank = 'Snail Pace... 🐌';
    
    rankText.textContent = rank;
    modal.style.display = 'flex';
}

function resetTest() {
    clearInterval(timerId);
    isRunning = false;
    clicks = 0;
    timeLeft = testDuration;
    
    timerDisplay.textContent = timeLeft.toFixed(2);
    clickCountDisplay.textContent = '0';
    cpsDisplay.textContent = '0.0';
    clickArea.querySelector('span').textContent = 'Click Here to Start!';
    clickArea.style.pointerEvents = 'auto';
    modal.style.display = 'none';
}

clickArea.addEventListener('mousedown', (e) => {
    if (timeLeft <= 0) return;
    
    if (!isRunning) {
        startTest();
    }
    
    clicks++;
    clickCountDisplay.textContent = clicks;
    
    const elapsed = testDuration - timeLeft;
    if (elapsed > 0) {
        cpsDisplay.textContent = (clicks / elapsed).toFixed(1);
    }
});

timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isRunning) return;
        
        timeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        testDuration = parseInt(btn.getAttribute('data-time'));
        resetTest();
    });
});

resetBtn.addEventListener('click', resetTest);
closeModal.addEventListener('click', resetTest);

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) resetTest();
});