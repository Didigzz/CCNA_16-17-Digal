const questionText  = document.getElementById('questionText');
const questionTag   = document.getElementById('questionTag');
const questionCount = document.getElementById('questionCount');
const answersEl     = document.getElementById('answers');
const feedbackEl    = document.getElementById('feedback');
const prevBtn       = document.getElementById('prevBtn');
const nextBtn       = document.getElementById('nextBtn');
const skipBtn       = document.getElementById('skipBtn');
const shuffleBtn    = document.getElementById('shuffleBtn');
const restartBtn    = document.getElementById('restartBtn');
const progressFill  = document.getElementById('progressFill');
const progressText  = document.getElementById('progressText');
const scoreValue    = document.getElementById('scoreValue');

let currentIndex    = 0;
let selectedIndices = [];
let matchSelections = {};
let questionLocked  = false;
let userHistory     = [];
let questionOrder   = questions.map((_, i) => i);
let answerOrders    = {}; // stable shuffled answer order per position
let isShuffled      = false;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function currentQuestion() {
  return questions[questionOrder[currentIndex]];
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Returns a stable display order (array of original indices) for current question's answers.
// Match questions are never shuffled. Order is generated once and cached per position.
function getAnswerOrder(question) {
  if (!isShuffled || question.type === 'match' || !question.answers) {
    return question.answers ? question.answers.map((_, i) => i) : [];
  }
  if (!answerOrders[currentIndex]) {
    const order = question.answers.map((_, i) => i);
    shuffleArray(order);
    answerOrders[currentIndex] = order;
  }
  return answerOrders[currentIndex];
}

function updateHeader() {
  const num   = Math.min(currentIndex + 1, questions.length);
  const total = questions.length;
  const score = userHistory.filter(h => h && h.isCorrect).length;

  questionCount.textContent = `${num} / ${total}`;
  progressText.textContent  = `Question ${num} of ${total}`;
  progressFill.style.width  = `${(num / total) * 100}%`;
  scoreValue.textContent    = `${score} / ${total}`;
}

// ─── MATCH RENDERER ──────────────────────────────────────────────────────────

function renderMatchQuestion(question, locked, savedState) {
  answersEl.innerHTML = '';
  matchSelections = savedState ? { ...savedState.matchSelections } : {};

  const wrapper = document.createElement('div');
  wrapper.className = 'match-wrapper';

  question.pairs.forEach((pair, catIdx) => {
    const row = document.createElement('div');
    row.className = 'match-pair';

    const cat = document.createElement('div');
    cat.className = 'match-category';
    cat.textContent = pair.category;

    const select = document.createElement('select');
    select.className = 'match-select';
    select.dataset.catIndex = catIdx;
    select.disabled = locked;

    const placeholder = document.createElement('option');
    placeholder.value       = '';
    placeholder.textContent = '— select an option —';
    placeholder.disabled    = true;
    placeholder.selected    = !(catIdx in matchSelections);
    select.appendChild(placeholder);

    question.pairs.forEach((p, optIdx) => {
      const opt = document.createElement('option');
      opt.value       = optIdx;
      opt.textContent = p.option;
      if (matchSelections[catIdx] === optIdx) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', () => {
      matchSelections[catIdx] = parseInt(select.value);
      checkMatchComplete(question);
    });

    if (locked && savedState) {
      select.classList.add(matchSelections[catIdx] === catIdx ? 'match-correct' : 'match-wrong');
    }

    row.appendChild(cat);
    row.appendChild(select);
    wrapper.appendChild(row);
  });

  answersEl.appendChild(wrapper);
}

function checkMatchComplete(question) {
  const allFilled = question.pairs.every((_, i) => i in matchSelections && matchSelections[i] !== '');
  if (!allFilled) return;

  questionLocked = true;
  const isCorrect = question.pairs.every((_, i) => matchSelections[i] === i);

  answersEl.querySelectorAll('.match-select').forEach(sel => {
    sel.disabled = true;
    const idx = parseInt(sel.dataset.catIndex);
    sel.classList.add(matchSelections[idx] === idx ? 'match-correct' : 'match-wrong');
  });

  userHistory[currentIndex] = { matchSelections: { ...matchSelections }, isCorrect };

  feedbackEl.className = isCorrect ? 'feedback success' : 'feedback error';
  feedbackEl.innerHTML = isCorrect
    ? `<strong>Correct.</strong> ${question.explanation || ''}`
    : `<strong>Incorrect.</strong> Correct matches:<br>${question.pairs.map(p => `<em>${p.category}</em> → "${p.option}"`).join('<br>')}<br><br>${question.explanation || ''}`;

  nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
  nextBtn.disabled    = false;
  skipBtn.disabled    = true;
  updateHeader();
}

// ─── MULTISELECT RENDERER ────────────────────────────────────────────────────

function renderMultiselectQuestion(question, locked, savedState) {
  answersEl.innerHTML = '';
  selectedIndices = savedState ? [...savedState.selectedIndices] : [];

  const correctIndexes = question.correctIndexes || [question.correctIndex];
  const requiredCount  = correctIndexes.length;
  const correctFound   = selectedIndices.filter(i => correctIndexes.includes(i)).length;
  const remaining      = requiredCount - correctFound;

  feedbackEl.className   = 'feedback';
  feedbackEl.textContent = locked
    ? ''
    : `Find ${requiredCount} correct answer${requiredCount > 1 ? 's' : ''}. ${remaining > 0 ? remaining + ' remaining.' : ''}`;

  const answerOrder = getAnswerOrder(question);
  answerOrder.forEach(origIdx => {
    const btn = document.createElement('button');
    btn.type            = 'button';
    btn.className       = 'answer-btn';
    btn.textContent     = question.answers[origIdx];
    btn.dataset.origIdx = origIdx;
    btn.setAttribute('role', 'listitem');

    if (selectedIndices.includes(origIdx)) {
      btn.disabled = true;
      btn.classList.add(correctIndexes.includes(origIdx) ? 'correct' : 'wrong');
    } else if (locked) {
      btn.disabled = true;
    } else {
      btn.addEventListener('click', () => handleMultiselect(origIdx));
    }

    answersEl.appendChild(btn);
  });

  if (locked && savedState) {
    feedbackEl.className = savedState.isCorrect ? 'feedback success' : 'feedback error';
    feedbackEl.innerHTML = savedState.isCorrect
      ? `<strong>All correct!</strong> ${question.explanation || ''}`
      : `<strong>Incorrect.</strong> ${question.explanation || ''}`;
  }
}

function handleMultiselect(origIdx) {
  if (questionLocked) return;

  const question       = currentQuestion();
  const correctIndexes = question.correctIndexes || [question.correctIndex];
  const requiredCount  = correctIndexes.length;

  if (selectedIndices.includes(origIdx)) return;
  selectedIndices.push(origIdx);

  const isThisCorrect = correctIndexes.includes(origIdx);

  // Colour the clicked button immediately
  const clicked = answersEl.querySelector(`[data-orig-idx="${origIdx}"]`);
  if (clicked) {
    clicked.disabled = true;
    clicked.classList.add(isThisCorrect ? 'correct' : 'wrong');
  }

  const correctFound = selectedIndices.filter(i => correctIndexes.includes(i)).length;
  const remaining    = requiredCount - correctFound;

  if (remaining > 0) {
    feedbackEl.className   = 'feedback';
    feedbackEl.textContent = isThisCorrect
      ? `✓ Correct! ${remaining} more correct answer${remaining > 1 ? 's' : ''} to find.`
      : `✗ Wrong. Keep going — ${remaining} correct answer${remaining > 1 ? 's' : ''} still to find.`;
  } else {
    questionLocked  = true;
    const hadWrong  = selectedIndices.some(i => !correctIndexes.includes(i));
    const isCorrect = !hadWrong;

    userHistory[currentIndex] = { selectedIndices: [...selectedIndices], isCorrect };

    // Highlight any remaining correct answers not yet clicked
    answersEl.querySelectorAll('.answer-btn').forEach(btn => {
      const idx = parseInt(btn.dataset.origIdx);
      if (correctIndexes.includes(idx) && !btn.classList.contains('correct')) {
        btn.disabled = true;
        btn.classList.add('correct');
      }
    });

    feedbackEl.className = isCorrect ? 'feedback success' : 'feedback error';
    feedbackEl.innerHTML = isCorrect
      ? `<strong>All correct!</strong> ${question.explanation || ''}`
      : `<strong>Found all correct answers, but with wrong picks.</strong> ${question.explanation || ''}`;

    nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
    nextBtn.disabled    = false;
    skipBtn.disabled    = true;
    updateHeader();
  }
}

// ─── STANDARD RENDERER ───────────────────────────────────────────────────────

function renderQuestion() {
  const question  = currentQuestion();
  selectedIndices = [];
  matchSelections = {};
  questionLocked  = false;

  prevBtn.disabled      = currentIndex === 0;
  nextBtn.disabled      = true;
  skipBtn.disabled      = false;
  skipBtn.style.display = currentIndex === questions.length - 1 ? 'none' : '';

  feedbackEl.className   = 'feedback';
  feedbackEl.textContent = '';
  questionTag.textContent  = question.topic || 'CCNA Practice';
  questionText.textContent = question.question;
  answersEl.innerHTML      = '';

  const savedState = userHistory[currentIndex] || null;
  const locked     = !!savedState;
  if (locked) questionLocked = true;

  if (question.type === 'match') {
    feedbackEl.textContent = 'Match each category to the correct option using the dropdowns.';
    renderMatchQuestion(question, locked, savedState);
    if (locked) {
      nextBtn.disabled    = false;
      skipBtn.disabled    = true;
      nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
    }

  } else if (question.type === 'multiselect') {
    renderMultiselectQuestion(question, locked, savedState);
    if (locked) {
      nextBtn.disabled    = false;
      skipBtn.disabled    = true;
      nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
    }

  } else {
    const expectedCorrect = Array.isArray(question.correctIndex) ? question.correctIndex : [question.correctIndex];
    feedbackEl.textContent = 'Select an answer to see instant feedback.';

    const answerOrder = getAnswerOrder(question);
    answerOrder.forEach(origIdx => {
      const btn = document.createElement('button');
      btn.type            = 'button';
      btn.className       = 'answer-btn';
      btn.textContent     = question.answers[origIdx];
      btn.dataset.origIdx = origIdx;
      btn.setAttribute('role', 'listitem');
      btn.addEventListener('click', () => handleAnswer(origIdx));
      answersEl.appendChild(btn);
    });

    if (savedState) {
      selectedIndices = [...savedState.selectedIndices];
      answersEl.querySelectorAll('.answer-btn').forEach(btn => {
        const origIdx = parseInt(btn.dataset.origIdx);
        btn.disabled = true;
        if (expectedCorrect.includes(origIdx))      btn.classList.add('correct');
        else if (selectedIndices.includes(origIdx)) btn.classList.add('wrong');
      });
      feedbackEl.className = savedState.isCorrect ? 'feedback success' : 'feedback error';
      feedbackEl.innerHTML = savedState.isCorrect
        ? `<strong>Correct.</strong> ${question.explanation || ''}`
        : `<strong>Incorrect.</strong> Correct answer: <strong>"${expectedCorrect.map(i => question.answers[i]).join('", "')}"</strong>. ${question.explanation || ''}`;
      nextBtn.disabled    = false;
      skipBtn.disabled    = true;
      nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
    } else {
      nextBtn.textContent = 'Next';
    }
  }

  updateHeader();
}

function handleAnswer(origIdx) {
  if (questionLocked) return;
  questionLocked = true;

  const question        = currentQuestion();
  const expectedCorrect = Array.isArray(question.correctIndex) ? question.correctIndex : [question.correctIndex];
  selectedIndices       = [origIdx];
  const isCorrect       = expectedCorrect.includes(origIdx);

  userHistory[currentIndex] = { selectedIndices: [origIdx], isCorrect };

  answersEl.querySelectorAll('.answer-btn').forEach(btn => {
    const idx = parseInt(btn.dataset.origIdx);
    btn.disabled = true;
    if (expectedCorrect.includes(idx))  btn.classList.add('correct');
    else if (idx === origIdx)           btn.classList.add('wrong');
  });

  feedbackEl.className = isCorrect ? 'feedback success' : 'feedback error';
  feedbackEl.innerHTML = isCorrect
    ? `<strong>Correct.</strong> ${question.explanation || ''}`
    : `<strong>Incorrect.</strong> Correct answer: <strong>"${expectedCorrect.map(i => question.answers[i]).join('", "')}"</strong>. ${question.explanation || ''}`;

  nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
  nextBtn.disabled    = false;
  skipBtn.disabled    = true;
  updateHeader();
}

// ─── NAVIGATION ──────────────────────────────────────────────────────────────

function showSummary() {
  const answered   = userHistory.filter(h => h && !h.skipped).length;
  const score      = userHistory.filter(h => h && h.isCorrect).length;
  const skipped    = questions.length - answered;
  const percentage = answered > 0 ? Math.round((score / answered) * 100) : 0;

  questionTag.textContent   = 'Quiz complete';
  questionCount.textContent = `${questions.length} / ${questions.length}`;
  questionText.textContent  = 'You finished the practice quiz.';
  answersEl.innerHTML       = '';
  feedbackEl.className      = 'feedback success';
  feedbackEl.innerHTML      = `<strong>Final score:</strong> ${score} out of ${answered} answered (${percentage}%).`
    + (skipped > 0 ? ` <strong>${skipped} question${skipped > 1 ? 's' : ''} skipped</strong> — use Back to answer them.` : '')
    + ' Restart for another attempt.';

  prevBtn.disabled      = false;
  nextBtn.textContent   = 'Finished';
  nextBtn.disabled      = true;
  skipBtn.style.display = 'none';
  progressFill.style.width  = '100%';
  progressText.textContent  = 'Quiz complete';
  scoreValue.textContent    = `${score} / ${questions.length}`;
}

function goToNextQuestion() {
  if (!questionLocked && currentIndex < questions.length) return;
  if (currentIndex >= questions.length - 1) {
    currentIndex = questions.length;
    showSummary();
  } else {
    currentIndex += 1;
    renderQuestion();
  }
}

function goToPrevQuestion() {
  if (currentIndex > 0) {
    currentIndex -= 1;
    renderQuestion();
  }
}

function skipQuestion() {
  if (currentIndex >= questions.length - 1) return;
  currentIndex += 1;
  renderQuestion();
}

function restartQuiz() {
  currentIndex    = 0;
  selectedIndices = [];
  matchSelections = {};
  userHistory     = [];
  questionLocked  = false;

  // Always shuffle questions on restart
  questionOrder = questions.map((_, i) => i);
  shuffleArray(questionOrder);

  // Pre-generate shuffled answer orders for all questions
  answerOrders = {};
  isShuffled   = true;
  questionOrder.forEach((qIdx, pos) => {
    const q = questions[qIdx];
    if (!q.answers || q.type === 'match') return;
    const order = q.answers.map((_, i) => i);
    shuffleArray(order);
    answerOrders[pos] = order;
  });

  renderQuestion();
}

// ─── SHUFFLE ─────────────────────────────────────────────────────────────────

function toggleShuffle() {
  // Re-shuffle remaining questions and answers from current position
  const remaining = questionOrder.slice(currentIndex);
  shuffleArray(remaining);
  questionOrder = [...questionOrder.slice(0, currentIndex), ...remaining];

  // Re-generate answer orders for current and future questions
  for (let i = currentIndex; i < questions.length; i++) {
    const q = questions[questionOrder[i]];
    if (!q.answers || q.type === 'match') continue;
    const order = q.answers.map((_, idx) => idx);
    shuffleArray(order);
    answerOrders[i] = order;
  }

  renderQuestion();
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

prevBtn.addEventListener('click', goToPrevQuestion);
nextBtn.addEventListener('click', goToNextQuestion);
skipBtn.addEventListener('click', skipQuestion);
shuffleBtn.addEventListener('click', toggleShuffle);
restartBtn.addEventListener('click', restartQuiz);

if (typeof questions !== 'undefined' && questions.length > 0) {
  // Shuffle on first load too
  restartQuiz();
} else {
  questionText.textContent = 'Error: Question data not found.';
}
