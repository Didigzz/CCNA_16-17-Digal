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

  // Shuffle options for display
  const optionIndices = question.pairs.map((_, i) => i);
  if (!savedState) shuffleArray(optionIndices);

  const wrapper = document.createElement('div');
  wrapper.className = 'match-wrapper';

  // Left column: categories
  const catCol = document.createElement('div');
  catCol.className = 'match-col match-categories';
  question.pairs.forEach((pair, i) => {
    const cell = document.createElement('div');
    cell.className = 'match-category';
    cell.dataset.catIndex = i;
    cell.textContent = pair.category;
    catCol.appendChild(cell);
  });

  // Right column: options (dropdowns per category)
  const optCol = document.createElement('div');
  optCol.className = 'match-col match-options';
  question.pairs.forEach((_, catIdx) => {
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

    question.pairs.forEach((pair, optIdx) => {
      const opt = document.createElement('option');
      opt.value = optIdx;
      opt.textContent = pair.option;
      if (matchSelections[catIdx] === optIdx) opt.selected = true;
      select.appendChild(opt);
    });

    select.addEventListener('change', () => {
      matchSelections[catIdx] = parseInt(select.value);
      checkMatchComplete(question);
    });

    // Apply correct/wrong styling if locked
    if (locked && savedState) {
      const chosen = matchSelections[catIdx];
      if (chosen === catIdx) {
        select.classList.add('match-correct');
      } else {
        select.classList.add('match-wrong');
      }
    }

    optCol.appendChild(select);
  });

  wrapper.appendChild(catCol);
  wrapper.appendChild(optCol);
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
  updateHeader();
}

// ─── MULTISELECT QUESTION RENDERER ──────────────────────────────────────────

function renderMultiselectQuestion(question, locked, savedState) {
  answersEl.innerHTML = '';
  selectedIndices = savedState ? [...savedState.selectedIndices] : [];

  const correctIndexes = question.correctIndexes || [question.correctIndex];
  const needed = correctIndexes.length;

  feedbackEl.textContent = `Select ${needed} answer${needed > 1 ? 's' : ''} to see instant feedback.`;

  question.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-btn';
    button.textContent = answer;
    button.setAttribute('role', 'listitem');

    if (locked) {
      button.disabled = true;
      if (correctIndexes.includes(index)) button.classList.add('correct');
      else if (selectedIndices.includes(index)) button.classList.add('wrong');
    } else {
      if (selectedIndices.includes(index)) {
        button.style.borderColor = 'rgba(20, 92, 158, 0.8)';
        button.style.backgroundColor = 'rgba(20, 92, 158, 0.05)';
      }
      button.addEventListener('click', () => handleMultiselect(index, needed, question));
    }

    answersEl.appendChild(button);
  });

  if (locked && savedState) {
    if (savedState.isCorrect) {
      feedbackEl.className = 'feedback success';
      feedbackEl.innerHTML = `<strong>Correct.</strong> ${question.explanation || ''}`;
    } else {
      const correctText = correctIndexes.map(i => question.answers[i]).join('", "');
      feedbackEl.className = 'feedback error';
      feedbackEl.innerHTML = `<strong>Incorrect.</strong> Correct answer(s): <strong>"${correctText}"</strong>. ${question.explanation || ''}`;
    }
  }
}

function handleMultiselect(answerIndex, needed, question) {
  if (questionLocked) return;

  const existingIdx = selectedIndices.indexOf(answerIndex);
  if (existingIdx >= 0) selectedIndices.splice(existingIdx, 1);
  else selectedIndices.push(answerIndex);

  const buttons = Array.from(answersEl.querySelectorAll('.answer-btn'));
  buttons.forEach((btn, i) => {
    if (selectedIndices.includes(i)) {
      btn.style.borderColor = 'rgba(20, 92, 158, 0.8)';
      btn.style.backgroundColor = 'rgba(20, 92, 158, 0.05)';
    } else {
      btn.style.borderColor = '';
      btn.style.backgroundColor = '';
    }
  });

  if (selectedIndices.length === needed) {
    questionLocked = true;
    const correctIndexes = question.correctIndexes || [question.correctIndex];
    const isCorrect =
      selectedIndices.length === correctIndexes.length &&
      selectedIndices.every(i => correctIndexes.includes(i));

    userHistory[currentIndex] = { selectedIndices: [...selectedIndices], isCorrect };

    buttons.forEach((btn, i) => {
      btn.disabled = true;
      btn.style.borderColor = '';
      btn.style.backgroundColor = '';
      if (correctIndexes.includes(i)) btn.classList.add('correct');
      else if (selectedIndices.includes(i)) btn.classList.add('wrong');
    });

    if (isCorrect) {
      feedbackEl.className = 'feedback success';
      feedbackEl.innerHTML = `<strong>Correct.</strong> ${question.explanation || ''}`;
    } else {
      const correctText = correctIndexes.map(i => question.answers[i]).join('", "');
      feedbackEl.className = 'feedback error';
      feedbackEl.innerHTML = `<strong>Incorrect.</strong> Correct answer(s): <strong>"${correctText}"</strong>. ${question.explanation || ''}`;
    }

    nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
    nextBtn.disabled = false;
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
      nextBtn.textContent = currentIndex === questions.length - 1 ? 'Finish' : 'Next';
    }
  } else if (question.type === 'multiselect') {
    renderMultiselectQuestion(question, locked, savedState);
    if (locked) {
      nextBtn.disabled = false;
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
  updateHeader();
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────

function showSummary() {
  const currentScore = userHistory.filter(h => h && h.isCorrect).length;
  const percentage = Math.round((currentScore / questions.length) * 100);
  questionTag.textContent = 'Quiz complete';
  questionCount.textContent = `${questions.length} / ${questions.length}`;
  questionText.textContent = 'You finished the practice quiz.';
  answersEl.innerHTML = '';
  feedbackEl.className = 'feedback success';
  feedbackEl.innerHTML = `<strong>Final score:</strong> ${currentScore} out of ${questions.length} (${percentage}%). Review the topics you missed or restart for another attempt.`;
  prevBtn.disabled = false;
  nextBtn.textContent = 'Finished';
  nextBtn.disabled = true;
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
restartBtn.addEventListener('click', restartQuiz);

if (typeof questions !== 'undefined' && questions.length > 0) renderQuestion();
else questionText.textContent = 'Error: Question data not found.';
