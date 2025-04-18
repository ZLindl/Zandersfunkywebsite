
import { consoleBank } from './consoleBank.js';

// === Inject consoleBank into global scope if needed ===
window.consoleBank = consoleBank;

/******************************************
 * app.js
 ******************************************/

/*
  Generic function to go to a random quiz.
  In a real version, you'd list all quiz pages
  and choose randomly.
*/
function goToRandomQuiz() {
  const quizzes = [
    'guess-the-startup.html',
    'console-chronology.html',
    'system-speedrun.html',
    'match-the-manufacturer.html'
  ];
  const randomIndex = Math.floor(Math.random() * quizzes.length);
  window.location.href = quizzes[randomIndex];
}

/* ========== GUESS THE STARTUP ========== */
function checkStartupAnswer(option) {
  // Stub logic: pretend option 2 is correct
  const feedbackDiv = document.getElementById('feedback');
  if (option === 2) {
    feedbackDiv.innerText = 'Correct! That’s the correct startup sound!';
    feedbackDiv.style.color = 'green';
  } else {
    feedbackDiv.innerText = 'Incorrect. Try again!';
    feedbackDiv.style.color = 'red';
  }
}

/* ========== CONSOLE CHRONOLOGY ========== */
function checkChronologyOrder() {
  // Check the current order of the .console-item elements
  const items = document.querySelectorAll('.console-item');
  // Convert NodeList to array to map over it
  const actualOrder = [...items].map(item => item.getAttribute('data-order'));

  // You can define the correct order as [1, 2, 3, 4], for instance:
  const correctOrder = ['1', '2', '3', '4'];

  const timelineBar = document.getElementById('timelineBar');
  const feedback = document.getElementById('chronologyFeedback');

  if (JSON.stringify(actualOrder) === JSON.stringify(correctOrder)) {
    timelineBar.style.backgroundColor = 'green';
    feedback.innerText = 'Perfect order!';
    feedback.style.color = 'green';
  } else {
    timelineBar.style.backgroundColor = 'red';
    feedback.innerText = 'Incorrect order. Keep trying!';
    feedback.style.color = 'red';
  }
}

/* ========== SYSTEM SPEEDRUN ========== */
let speedrunTime = 30;
let speedrunTimer = null;
let correctAnswers = [];

// Start timer automatically on page load
window.addEventListener('load', () => {
  const path = window.location.pathname;
  if (path.includes('system-speedrun.html')) {
    startSpeedrunTimer();
  }
});

function startSpeedrunTimer() {
  speedrunTimer = setInterval(() => {
    speedrunTime--;
    document.getElementById('timerDisplay').innerText = `Time: ${speedrunTime}`;
    if (speedrunTime <= 0) {
      clearInterval(speedrunTimer);
      endSpeedrun();
    }
  }, 1000);
}

function handleSpeedrunInput(e) {
  if (e.key === 'Enter') {
    const input = e.target.value.trim();
    if (!input) return;

    const speedrunAnswersDiv = document.getElementById('speedrunAnswers');
    // Stub example: We'll consider *any* input as "correct" for demonstration
    correctAnswers.push(input);
    const answerEl = document.createElement('div');
    answerEl.innerText = input;
    speedrunAnswersDiv.appendChild(answerEl);

    // Clear input
    e.target.value = '';
  }
}

function endSpeedrun() {
  // Just show how many were typed
  alert(`Time is up! You typed ${correctAnswers.length} consoles.`);
}

/* ========== MATCH THE MANUFACTURER ========== */
function checkManufacturerMatch() {
  // We assume each .match-item has a data-match,
  // and each .drag-item has data-name.
  // This function would iterate and see if items are matched.
  const matchFeedback = document.getElementById('matchFeedback');
  // You’d do a more complex check for a real match quiz
  matchFeedback.innerText = 'Check complete! (Stub logic here.)';
  matchFeedback.style.color = 'blue';
}

