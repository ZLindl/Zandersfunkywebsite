import { consoleBank } from './consoleBank.js';
window.consoleBank = consoleBank;

// ——————————————————————————————
// Navigate to a random quiz
// ——————————————————————————————
function goToRandomQuiz() {
  const quizzes = [
    'guess-the-startup.html',
    'console-chronology.html',
    'system-speedrun.html',
    'match-the-manufacturer.html'
  ];
  const idx = Math.floor(Math.random() * quizzes.length);
  window.location.href = quizzes[idx];
}

// ——————————————————————————————
// GUESS THE STARTUP
// ——————————————————————————————
const startupQuestions = [
  {
    audioSrc: 'Console Images/Atari 2600.mp3',  // swap in your actual files
    options: ['Atari 2600', 'Magnavox Odyssey', 'Coleco Telestar', 'Intellivision'],
    correct: 0
  },
  // …add more questions here…
];
let currentStartupQuestionIndex = 0;

function loadStartupQuestion() {
  const q = startupQuestions[currentStartupQuestionIndex];
  document.querySelector('.video-container').innerHTML =
    `<audio controls src="${q.audioSrc}"></audio>`;
  document.querySelector('.quiz-answers').innerHTML =
    q.options.map((opt, i) =>
      `<button class="answer-btn" onclick="checkStartupAnswer(${i})">${opt}</button>`
    ).join('');
  document.getElementById('feedback').innerText = '';
}

function checkStartupAnswer(choice) {
  const q = startupQuestions[currentStartupQuestionIndex];
  const fb = document.getElementById('feedback');
  if (choice === q.correct) {
    fb.innerText = '✅ Correct!';
    fb.style.color = 'green';
  } else {
    fb.innerText = '❌ Incorrect. Try again!';
    fb.style.color = 'red';
  }
}

window.addEventListener('load', () => {
  if (location.pathname.endsWith('guess-the-startup.html')) {
    loadStartupQuestion();
  }
});

// ——————————————————————————————
// CONSOLE CHRONOLOGY (Drag‑to‑reorder)
// ——————————————————————————————
function enableChronologyDrag() {
  const container = document.querySelector('.chronology-container');
  let dragged;

  container.addEventListener('dragstart', e => {
    dragged = e.target;
  });

  container.addEventListener('dragover', e => {
    e.preventDefault();
    const after = getDragAfterElement(container, e.clientY);
    if (!after) container.appendChild(dragged);
    else container.insertBefore(dragged, after);
  });
}

function getDragAfterElement(container, y) {
  const items = [...container.querySelectorAll('.console-item:not(.dragging)')];
  return items.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset)
      return { offset, element: child };
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function checkChronologyOrder() {
  const items = [...document.querySelectorAll('.chronology-container .console-item')];
  const actual = items.map(i => i.dataset.order).sort((a,b)=> a-b);
  const bar = document.getElementById('timelineBar');
  const fb = document.getElementById('chronologyFeedback');
  if (JSON.stringify(actual) === JSON.stringify(actual)) {
    bar.style.backgroundColor = 'green';
    fb.innerText = '🎉 Perfect order!';
    fb.style.color = 'green';
  } else {
    bar.style.backgroundColor = 'red';
    fb.innerText = '🚫 Incorrect—keep trying!';
    fb.style.color = 'red';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if (location.pathname.endsWith('console-chronology.html')) {
    enableChronologyDrag();
  }
});

// ——————————————————————————————
// SYSTEM SPEEDRUN
// ——————————————————————————————
let speedrunTime = 30, timerId, answers = new Set();

function startSpeedrun() {
  const disp = document.getElementById('timerDisplay');
  const input = document.getElementById('speedrunInput');
  timerId = setInterval(() => {
    speedrunTime--;
    disp.innerText = `Time: ${speedrunTime}`;
    if (speedrunTime <= 0) {
      clearInterval(timerId);
      input.disabled = true;
      alert(`⏰ Time’s up! You got ${answers.size} unique consoles.`);
    }
  }, 1000);

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = e.target.value.trim().toLowerCase();
      const found = consoleBank.find(
        c => c.name.toLowerCase() === val
      );
      if (found && !answers.has(found.name)) {
        answers.add(found.name);
        const div = document.createElement('div');
        div.innerText = found.name;
        document.getElementById('speedrunAnswers').appendChild(div);
      }
      e.target.value = '';
    }
  });
}

window.addEventListener('load', () => {
  if (location.pathname.endsWith('system-speedrun.html')) {
    startSpeedrun();
  }
});

// ——————————————————————————————
// MATCH THE MANUFACTURER
// ——————————————————————————————
function enableMatchDrag() {
  const drags = document.querySelectorAll('.drag-item');
  const targets = document.querySelectorAll('.match-item');

  drags.forEach(d => {
    d.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', d.dataset.name);
    });
  });

  targets.forEach(t => {
    t.addEventListener('dragover', e => e.preventDefault());
    t.addEventListener('drop', e => {
      e.preventDefault();
      const name = e.dataTransfer.getData('text/plain');
      const dragged = Array.from(drags).find(d => d.dataset.name === name);
      if (dragged) {
        dragged.remove();
        t.appendChild(dragged);
      }
    });
  });
}

function checkManufacturerMatch() {
  let ok = true;
  document.querySelectorAll('.match-item').forEach(slot => {
    const want = slot.dataset.match;
    const gotEl = slot.querySelector('.drag-item');
    if (!gotEl || gotEl.dataset.name !== want) ok = false;
  });
  const fb = document.getElementById('matchFeedback');
  if (ok) {
    fb.innerText = '✅ All correct!';
    fb.style.color = 'green';
  } else {
    fb.innerText = '❌ Some are wrong—keep going!';
    fb.style.color = 'red';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  if (location.pathname.endsWith('match-the-manufacturer.html')) {
    enableMatchDrag();
  }
});
