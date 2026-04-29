const questionText = document.getElementById('questionText');
const questionTag = document.getElementById('questionTag');
const questionCount = document.getElementById('questionCount');
const answersEl = document.getElementById('answers');
const feedbackEl = document.getElementById('feedback');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const scoreValue = document.getElementById('scoreValue');

const skipBtn = document.getElementById('skipBtn');
let currentIndex = 0;
let selectedIndices = [];
let matchSelections = {}; // { categoryIndex: optionIndex } for match questions
let questionLocked = false;
let userHistory = [];

function updateHeader() {
  const currentQuestionNumber = Math.min(currentIndex + 1, questions.length);
  const totalQuestions = questions.length;
  const progressPercent = totalQuestions === 0 ? 0 : (currentQuestionNumber / totalQuestions) * 100;
  const currentScore = userHistory.filter(h => h && h.isCorrect).length;

  questionCount.textContent = `${currentQuestionNumber} / ${totalQuestions}`;
  progressText.textContent = `Question ${currentQuestionNumber} of ${totalQuestions}`;
  progressFill.style.width = `${progressPercent}%`;
  scoreValue.textContent = `${currentScore} / ${totalQuestions}`;
}

// ─── MATCH QUESTION RENDERER ────────────────────────────────────────────────

function renderMatchQuestion(question, locked, savedState) {
  answersEl.innerHTML = '';
  matchSelections = savedState ? { ...savedState.matchSelections } : {};

  const wrapper = document.createElement('div');
  wrapper.className = 'match-wrapper';

  // Render each pair as a row: category label + dropdown side by side (stacked on mobile)
  question.pairs.forEach((pair, catIdx) => {
    const pairRow = document.createElement('div');
    pairRow.className = 'match-pair';

    // Category label
    const cat = document.createElement('div');
    cat.className = 'match-category';
    cat.textContent = pair.category;

    // Dropdown
    const select = document.createElement('select');
    select.className = 'match-select';
    select.dataset.catIndex = catIdx;
    select.disabled = locked;

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '— select an option —';
    placeholder.disabled = true;
    placeholder.selected = !(catIdx in matchSelections);
    select.appendChild(placeholder);

    question.pairs.forEach((p, optIdx) => {
      const opt = document.createElement('option');
      opt.value = optIdx;
      opt.textContent = p.option;
      if (matchSelections[catIdx] === optIdx) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', () => {
      matchSelections[catIdx] = parseInt(select.value);
      checkMatchComplete(question);
    });

    // Apply correct/wrong styling if already answered
    if (locked && savedState) {
      const chosen = matchSelections[catIdx];
      select.classList.add(chosen === catIdx ? 'match-correct' : 'match-wrong');
    }

    pairRow.appendChild(cat);
    pairRow.appendChild(select);
    wrapper.appendChild(pairRow);
  });

  answersEl.appendChild(wrapper);
}

function checkMatchComplete(question) {
  const allFilled = question.pairs.every((_, i) => i in matchSelections && matchSelections[i] !== '');
  if (!allFilled) return;

  questionLocked = true;
  const isCorrect = question.pairs.every((_, i) => matchSelections[i] === i);

  // Apply visual feedback to selects
  const selects = answersEl.querySelectorAll('.match-select');
  selects.forEach(sel => {
    sel.disabled = true;
    const catIdx = parseInt(sel.dataset.catIndex);
    if (matchSelections[catIdx] === catIdx) sel.classList.add('match-correct');
    else sel.classList.add('match-wrong');
  });

  userHistory[currentIndex] = { matchSelections: { ...matchSelections }, isCorrect };

  if (isCorrect) {
    feedbackEl.className = 'feedback success';
    feedbackEl.innerHTML = `<strong>Correct.</strong> ${question.explanation || ''}`;
  } else {
    const correctList = question.pairs.map(p => `<em>${p.category}</em> → "${p.option}"`).join('<br>');
    feedbackEl.className = 'feedback error';
    feedbackEl.innerHTML = `<strong>Incorrect.</strong> Correct matches:<br>${correctList}<br><br>${question.explanation || ''}`;
  }

  nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
  nextBtn.disabled = false;
  skipBtn.disabled = true;
  updateHeader();
}

// ─── MULTISELECT QUESTION RENDERER ──────────────────────────────────────────

function renderMultiselectQuestion(question, locked, savedState) {
  answersEl.innerHTML = '';
  selectedIndices = savedState ? [...savedState.selectedIndices] : [];

  const correctIndexes = question.correctIndexes || [question.correctIndex];
  const requiredCount = correctIndexes.length;
  const correctFound = selectedIndices.filter(i => correctIndexes.includes(i)).length;
  const remaining = requiredCount - correctFound;

  feedbackEl.className = 'feedback';
  feedbackEl.textContent = locked
    ? ''
    : `Find ${requiredCount} correct answer${requiredCount > 1 ? 's' : ''}. ${remaining > 0 ? remaining + ' remaining.' : ''}`;

  question.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-btn';
    button.textContent = answer;
    button.setAttribute('role', 'listitem');

    if (selectedIndices.includes(index)) {
      // Restore state from history
      button.disabled = true;
      if (correctIndexes.includes(index)) button.classList.add('correct');
      else button.classList.add('wrong');
    } else if (locked) {
      button.disabled = true;
    } else {
      button.addEventListener('click', () => handleMultiselect(index));
    }

    answersEl.appendChild(button);
  });

  if (locked && savedState) {
    if (savedState.isCorrect) {
      feedbackEl.className = 'feedback success';
      feedbackEl.innerHTML = `<strong>All correct!</strong> ${question.explanation || ''}`;
    } else {
      feedbackEl.className = 'feedback error';
      feedbackEl.innerHTML = `<strong>Incorrect.</strong> ${question.explanation || ''}`;
    }
  }
}

function handleMultiselect(answerIndex) {
  if (questionLocked) return;

  const question = questions[currentIndex];
  const correctIndexes = question.correctIndexes || [question.correctIndex];
  const requiredCount = correctIndexes.length;

  // Ignore already-clicked buttons
  if (selectedIndices.includes(answerIndex)) return;

  selectedIndices.push(answerIndex);

  const isThisCorrect = correctIndexes.includes(answerIndex);

  // Immediately colour this button
  const buttons = Array.from(answersEl.querySelectorAll('.answer-btn'));
  const btn = buttons[answerIndex];
  btn.disabled = true;
  btn.classList.add(isThisCorrect ? 'correct' : 'wrong');

  // How many correct answers has the user found so far
  const correctFound = selectedIndices.filter(i => correctIndexes.includes(i)).length;
  const remaining = requiredCount - correctFound;

  if (remaining > 0) {
    // Still hunting — update hint, keep question open
    feedbackEl.className = 'feedback';
    feedbackEl.textContent = isThisCorrect
      ? `✓ Correct! ${remaining} more correct answer${remaining > 1 ? 's' : ''} to find.`
      : `✗ Wrong. Keep going — ${remaining} correct answer${remaining > 1 ? 's' : ''} still to find.`;
  } else {
    // All correct answers found — check if any wrong picks were made
    questionLocked = true;
    const hadWrong = selectedIndices.some(i => !correctIndexes.includes(i));
    const isCorrect = !hadWrong;

    userHistory[currentIndex] = { selectedIndices: [...selectedIndices], isCorrect };

    // Reveal any un-clicked correct answers (in case user found all correct without clicking wrong ones)
    buttons.forEach((b, i) => {
      if (correctIndexes.includes(i)) {
        b.disabled = true;
        if (!b.classList.contains('correct')) b.classList.add('correct');
      }
    });

    if (isCorrect) {
      feedbackEl.className = 'feedback success';
      feedbackEl.innerHTML = `<strong>All correct!</strong> ${question.explanation || ''}`;
    } else {
      feedbackEl.className = 'feedback error';
      feedbackEl.innerHTML = `<strong>Found all correct answers, but with wrong picks.</strong> ${question.explanation || ''}`;
    }

    nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
    nextBtn.disabled = false;
    skipBtn.disabled = true;
    updateHeader();
  }
}

// ─── STANDARD QUESTION RENDERER ─────────────────────────────────────────────

function renderQuestion() {
  const question = questions[currentIndex];
  selectedIndices = [];
  matchSelections = {};
  questionLocked = false;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = true;
  skipBtn.disabled = false;
  skipBtn.style.display = currentIndex === questions.length - 1 ? 'none' : '';
  feedbackEl.className = 'feedback';
  feedbackEl.textContent = '';

  questionTag.textContent = question.topic || 'CCNA Practice';
  questionText.textContent = question.question;
  answersEl.innerHTML = '';

  const savedState = userHistory[currentIndex] || null;
  const locked = !!savedState;
  if (locked) questionLocked = true;

  if (question.type === 'match') {
    feedbackEl.textContent = 'Match each category to the correct option using the dropdowns.';
    renderMatchQuestion(question, locked, savedState);
    if (locked) {
      nextBtn.disabled = false;
      skipBtn.disabled = true;
      nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
    }
  } else if (question.type === 'multiselect') {
    renderMultiselectQuestion(question, locked, savedState);
    if (locked) {
      nextBtn.disabled = false;
      skipBtn.disabled = true;
      nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
    }
  } else {
    // Standard single-answer
    const expectedCorrect = Array.isArray(question.correctIndex) ? question.correctIndex : [question.correctIndex];
    feedbackEl.textContent = 'Select an answer to see instant feedback.';

    question.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-btn';
      button.textContent = answer;
      button.setAttribute('role', 'listitem');
      button.addEventListener('click', () => handleAnswer(index, 1));
      answersEl.appendChild(button);
    });

    if (savedState) {
      selectedIndices = [...savedState.selectedIndices];
      const buttons = Array.from(answersEl.querySelectorAll('.answer-btn'));
      buttons.forEach((btn, i) => {
        btn.disabled = true;
        if (expectedCorrect.includes(i)) btn.classList.add('correct');
        else if (selectedIndices.includes(i)) btn.classList.add('wrong');
      });

      if (savedState.isCorrect) {
        feedbackEl.className = 'feedback success';
        feedbackEl.innerHTML = `<strong>Correct.</strong> ${question.explanation || ''}`;
      } else {
        const correctText = expectedCorrect.map(i => question.answers[i]).join('", "');
        feedbackEl.className = 'feedback error';
        feedbackEl.innerHTML = `<strong>Incorrect.</strong> Correct answer: <strong>"${correctText}"</strong>. ${question.explanation || ''}`;
      }

      nextBtn.disabled = false;
      skipBtn.disabled = true;
      nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
    } else {
      nextBtn.textContent = 'Next';
    }
  }

  updateHeader();
}

function handleAnswer(answerIndex) {
  if (questionLocked) return;
  questionLocked = true;

  const question = questions[currentIndex];
  const expectedCorrect = Array.isArray(question.correctIndex) ? question.correctIndex : [question.correctIndex];
  selectedIndices = [answerIndex];
  const isCorrect = expectedCorrect.includes(answerIndex);

  userHistory[currentIndex] = { selectedIndices: [answerIndex], isCorrect };

  const buttons = Array.from(answersEl.querySelectorAll('.answer-btn'));
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (expectedCorrect.includes(i)) btn.classList.add('correct');
    else if (i === answerIndex) btn.classList.add('wrong');
  });

  if (isCorrect) {
    feedbackEl.className = 'feedback success';
    feedbackEl.innerHTML = `<strong>Correct.</strong> ${question.explanation || ''}`;
  } else {
    const correctText = expectedCorrect.map(i => question.answers[i]).join('", "');
    feedbackEl.className = 'feedback error';
    feedbackEl.innerHTML = `<strong>Incorrect.</strong> Correct answer: <strong>"${correctText}"</strong>. ${question.explanation || ''}`;
  }

  nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
  nextBtn.disabled = false;
  skipBtn.disabled = true;
  updateHeader();
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────

function showSummary() {
  const answered = userHistory.filter(h => h && !h.skipped).length;
  const currentScore = userHistory.filter(h => h && h.isCorrect).length;
  const skipped = questions.length - answered;
  const percentage = answered > 0 ? Math.round((currentScore / answered) * 100) : 0;
  questionTag.textContent = 'Quiz complete';
  questionCount.textContent = `${questions.length} / ${questions.length}`;
  questionText.textContent = 'You finished the practice quiz.';
  answersEl.innerHTML = '';
  feedbackEl.className = 'feedback success';
  feedbackEl.innerHTML = `<strong>Final score:</strong> ${currentScore} out of ${answered} answered (${percentage}%).${skipped > 0 ? ` <strong>${skipped} question${skipped > 1 ? 's' : ''} skipped</strong> — use Back to go answer them.` : ''} Restart for another attempt.`;
  prevBtn.disabled = false;
  nextBtn.textContent = 'Finished';
  nextBtn.disabled = true;
  skipBtn.style.display = 'none';
  progressFill.style.width = '100%';
  progressText.textContent = 'Quiz complete';
  scoreValue.textContent = `${currentScore} / ${questions.length}`;
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
  // Do NOT save to history — question remains unanswered and fully interactive when revisited
  currentIndex += 1;
  renderQuestion();
}
function restartQuiz() {
  currentIndex = 0;
  selectedIndices = [];
  matchSelections = {};
  userHistory = [];
  questionLocked = false;
  renderQuestion();
}

// ─── UTILS ───────────────────────────────────────────────────────────────────

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ─── INIT ────────────────────────────────────────────────────────────────────

prevBtn.addEventListener('click', goToPrevQuestion);
nextBtn.addEventListener('click', goToNextQuestion);
skipBtn.addEventListener('click', skipQuestion);
restartBtn.addEventListener('click', restartQuiz);

if (typeof questions !== 'undefined' && questions.length > 0) renderQuestion();
else questionText.textContent = 'Error: Question data not found.';
