let userScore = 0;
let compScore = 0;

const userScoreSpan = document.getElementById('user-score');
const compScoreSpan = document.getElementById('comp-score');
const resultDiv = document.getElementById('result');
const userChoiceDisplay = document.getElementById('user-choice-display');
const compChoiceDisplay = document.getElementById('comp-choice-display');
const resetBtn = document.getElementById('reset-btn');

const choices = ['rock', 'paper', 'scissors'];
const icons = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

function win(user, comp) {
    userScore++;
    userScoreSpan.textContent = userScore;
    resultDiv.textContent = 'You Win! 🎉';
    resultDiv.style.color = 'var(--win-color)';
}

function lose(user, comp) {
    compScore++;
    compScoreSpan.textContent = compScore;
    resultDiv.textContent = 'You Lose! 😢';
    resultDiv.style.color = 'var(--loss-color)';
}

function draw(user, comp) {
    resultDiv.textContent = "It's a Draw! 🤝";
    resultDiv.style.color = 'var(--draw-color)';
}

function game(userChoice) {
    const compChoice = getComputerChoice();
    
    userChoiceDisplay.textContent = icons[userChoice];
    compChoiceDisplay.textContent = icons[compChoice];

    switch (userChoice + compChoice) {
        case 'rockscissors':
        case 'paperrock':
        case 'scissorspaper':
            win(userChoice, compChoice);
            break;
        case 'rockpaper':
        case 'scissorsrock':
        case 'paperscissors':
            lose(userChoice, compChoice);
            break;
        case 'rockrock':
        case 'paperpaper':
        case 'scissorsscissors':
            draw(userChoice, compChoice);
            break;
    }
}

document.getElementById('rock').addEventListener('click', () => game('rock'));
document.getElementById('paper').addEventListener('click', () => game('paper'));
document.getElementById('scissors').addEventListener('click', () => game('scissors'));

resetBtn.addEventListener('click', () => {
    userScore = 0;
    compScore = 0;
    userScoreSpan.textContent = userScore;
    compScoreSpan.textContent = compScore;
    resultDiv.textContent = 'Pick your move!';
    resultDiv.style.color = 'var(--text-color)';
    userChoiceDisplay.textContent = '-';
    compChoiceDisplay.textContent = '-';
});