// ---------- Estado global ----------
const appState = {
  lessonJson: null,
  cards: [],
  usedCards: [],
  settings: {
    allowRepeats: false,
    filterTypes: [
      'word_sparks',
      'emotion_triggers',
      'event_cards',
      'mystery_cards',
    ],
    showTypeLabel: true,
  },
  ui: {
    lastDrawnCard: null,
    history: [],
    historyLimit: 8,
    currentLessonNumber: null,
    mysteryRevealed: false,
  },
};

const CARD_TYPE_KEYS = [
  'word_sparks',
  'emotion_triggers',
  'event_cards',
  'mystery_cards',
];
const CARD_TYPE_ABBR = {
  word_sparks: 'WS',
  emotion_triggers: 'EM',
  event_cards: 'EV',
  mystery_cards: 'MY',
};

// ---------- Flatten do deck ----------
function buildCardsFromLesson(lesson) {
  const deck = lesson.cards_deck;
  if (!deck) return [];

  const cards = [];
  CARD_TYPE_KEYS.forEach((typeKey) => {
    const arr = deck[typeKey] || [];
    arr.forEach((text, index) => {
      const id = `L${lesson.lesson_number || 'X'}-${
        CARD_TYPE_ABBR[typeKey] || 'XX'
      }-${index}`;
      cards.push({
        id,
        text,
        type: typeKey,
        used: false,
      });
    });
  });

  return cards;
}

// ---------- UI helpers ----------
function updateLessonTitle() {
  const el = document.getElementById('lesson-title');
  if (!el) return;
  const lesson = appState.lessonJson;
  if (!lesson) {
    el.textContent = 'Choose a lesson to start';
    return;
  }
  el.textContent = lesson.title || `Lesson ${lesson.lesson_number || ''}`;
}

function updateCardDisplay() {
  const display = document.getElementById('card-display');
  const typeLabel = document.getElementById('card-type-label');
  const textEl = document.getElementById('card-text');

  if (!display || !typeLabel || !textEl) return;

  const card = appState.ui.lastDrawnCard;

  // reset classes
  display.className = 'card-display card-normal';

  if (!card) {
    typeLabel.textContent = '';
    textEl.textContent = 'Draw a card';
    return;
  }

  // tipo – label menor
  if (appState.settings.showTypeLabel) {
    if (card.type === 'word_sparks') typeLabel.textContent = 'WORD';
    else if (card.type === 'emotion_triggers')
      typeLabel.textContent = 'EMOTION';
    else if (card.type === 'event_cards') typeLabel.textContent = 'EVENT';
    else if (card.type === 'mystery_cards') typeLabel.textContent = 'MYSTERY';
    else typeLabel.textContent = card.type.toUpperCase();
  } else {
    typeLabel.textContent = '';
  }

  // mistério: antes da revelação
  if (card.type === 'mystery_cards') {
    if (!appState.ui.mysteryRevealed) {
      display.classList.remove('card-normal');
      display.classList.add('card-mystery-hidden');
      textEl.textContent = 'Secret card – tap to reveal';
      return;
    }
    // revelado
    display.classList.remove('card-mystery-hidden');
    display.classList.add('card-mystery-revealed');
    textEl.textContent = card.text;
    return;
  }

  // outros tipos: normal, branco
  display.classList.add('card-normal');
  textEl.textContent = card.text;
}

function updateHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;

  list.innerHTML = '';
  appState.ui.history.forEach((card) => {
    const li = document.createElement('li');
    li.className = 'history-item';

    const textDiv = document.createElement('div');
    textDiv.className = 'history-text';
    textDiv.textContent = card.text;

    const metaDiv = document.createElement('div');
    metaDiv.className = 'history-meta';

    let typeLabel = '';
    if (card.type === 'word_sparks') typeLabel = 'Word';
    else if (card.type === 'emotion_triggers') typeLabel = 'Emotion';
    else if (card.type === 'event_cards') typeLabel = 'Event';
    else if (card.type === 'mystery_cards') typeLabel = 'Mystery';
    else typeLabel = card.type;

    metaDiv.textContent = `${typeLabel} • ${card.id}`;

    li.appendChild(textDiv);
    li.appendChild(metaDiv);
    list.appendChild(li);
  });
}

// ---------- Sorteio ----------
function drawCard() {
  const allCards = appState.cards;
  if (!allCards || allCards.length === 0) return;

  const activeTypes = appState.settings.filterTypes;
  let pool = allCards.filter((c) => activeTypes.includes(c.type));

  if (!appState.settings.allowRepeats) {
    pool = pool.filter((c) => !c.used);
  }

  if (pool.length === 0) {
    appState.ui.lastDrawnCard = null;
    const display = document.getElementById('card-display');
    const typeLabel = document.getElementById('card-type-label');
    const textEl = document.getElementById('card-text');
    if (display && typeLabel && textEl) {
      display.className = 'card-display card-normal';
      typeLabel.textContent = '';
      textEl.textContent = 'All cards used. Reset deck.';
    }
    return;
  }

  const index = Math.floor(Math.random() * pool.length);
  const chosen = pool[index];

  appState.ui.lastDrawnCard = chosen;
  appState.ui.mysteryRevealed = chosen.type !== 'mystery_cards';

  if (!appState.settings.allowRepeats) {
    chosen.used = true;
  }

  appState.ui.history.unshift(chosen);
  if (appState.ui.history.length > appState.ui.historyLimit) {
    appState.ui.history.pop();
  }

  updateCardDisplay();
  updateHistory();
}

// ---------- Reset ----------
function resetDeck() {
  appState.cards.forEach((c) => {
    c.used = false;
  });
  appState.ui.history = [];
  appState.ui.lastDrawnCard = null;
  appState.ui.mysteryRevealed = false;
  updateCardDisplay();
  updateHistory();
}

// ---------- Carregar lição ----------
function loadLesson(lessonNumber) {
  const url = `lessons/lesson${lessonNumber}.json`;
  appState.ui.currentLessonNumber = lessonNumber;

  // highlight do botão escolhido
  document.querySelectorAll('.lesson-card').forEach((btn) => {
    if (parseInt(btn.dataset.lesson, 10) === lessonNumber) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const lesson = data.lesson ? data.lesson : data;

      appState.lessonJson = lesson;
      appState.cards = buildCardsFromLesson(lesson);
      appState.usedCards = [];
      appState.ui.history = [];
      appState.ui.lastDrawnCard = null;
      appState.ui.mysteryRevealed = false;

      updateLessonTitle();
      updateCardDisplay();
      updateHistory();
    })
    .catch((err) => {
      console.error('Error loading lesson:', err);
      const titleEl = document.getElementById('lesson-title');
      if (titleEl) titleEl.textContent = 'Error loading lesson JSON';
    });
}

// ---------- Settings handlers ----------
function initSettingsHandlers() {
  const allowRepeatsCheckbox = document.getElementById('setting-allow-repeats');
  if (allowRepeatsCheckbox) {
    allowRepeatsCheckbox.checked = appState.settings.allowRepeats;
    allowRepeatsCheckbox.addEventListener('change', () => {
      appState.settings.allowRepeats = allowRepeatsCheckbox.checked;
    });
  }

  const typeCheckboxes = document.querySelectorAll('.type-filter');
  typeCheckboxes.forEach((cb) => {
    cb.addEventListener('change', () => {
      const types = [];
      document.querySelectorAll('.type-filter').forEach((el) => {
        const input = el;
        if (input.checked) {
          types.push(input.value);
        }
      });
      appState.settings.filterTypes = types;
    });
  });

  const resetBtn = document.getElementById('reset-button');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetDeck();
    });
  }
}

// ---------- Inicialização ----------
document.addEventListener('DOMContentLoaded', () => {
  // handlers de seleção de lição
  document.querySelectorAll('.lesson-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      const n = parseInt(btn.dataset.lesson, 10);
      if (!Number.isNaN(n)) {
        loadLesson(n);
      }
    });
  });

  // botão de sorteio
  const drawBtn = document.getElementById('draw-button');
  if (drawBtn) {
    drawBtn.addEventListener('click', () => {
      drawCard();
    });
  }

  // clique no card para revelar mistério
  const display = document.getElementById('card-display');
  if (display) {
    display.addEventListener('click', () => {
      const card = appState.ui.lastDrawnCard;
      if (
        card &&
        card.type === 'mystery_cards' &&
        !appState.ui.mysteryRevealed
      ) {
        appState.ui.mysteryRevealed = true;
        updateCardDisplay();
      }
    });
  }

  initSettingsHandlers();

  // ===== FOCUS MODE =====
  const appContainer = document.querySelector('.app-container');
  const enterFocusBtn = document.getElementById('enter-focus-btn');
  const exitFocusBtn = document.getElementById('exit-focus-btn');

  if (enterFocusBtn && appContainer) {
    enterFocusBtn.addEventListener('click', () => {
      appContainer.classList.add('focus-mode');
    });
  }

  if (exitFocusBtn && appContainer) {
    exitFocusBtn.addEventListener('click', () => {
      appContainer.classList.remove('focus-mode');
    });
  }
  // ======================

  // não carrego lição automaticamente → fica “Choose a lesson to start”
});
