function getLessonNumber() {
  const params = new URLSearchParams(window.location.search);
  const n = parseInt(params.get('lesson'), 10);
  return Number.isNaN(n) ? 1 : n;
}

function randomFromArray(arr) {
  if (!arr || arr.length === 0) return '(no items)';
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

/**
 * Converte texto com [palavras] marcadas em spans clicáveis.
 * Ex: "I'm [alone] here" -> "I'm <span class='swap-candidate' data-key='alone'>alone</span> here"
 */
function buildHighlightedHTML(text, optionsMap) {
  if (!text) return '';
  return text.replace(/\[([^\]]+)\]/g, (match, rawWord) => {
    const key = rawWord.trim();
    const hasOptions = optionsMap && optionsMap[key];
    const dataAttr = hasOptions ? ` data-key="${key}"` : ` data-key="${key}"`;
    // exibimos a palavra "crua" (sem colchetes)
    return `<span class="swap-candidate"${dataAttr}>${key}</span>`;
  });
}

let swapPopupEl = null;
let currentSwapSpan = null;

function ensureSwapPopup() {
  if (!swapPopupEl) {
    swapPopupEl = document.createElement('div');
    swapPopupEl.className = 'swap-popup';
    swapPopupEl.style.display = 'none';
    document.body.appendChild(swapPopupEl);
  }
  return swapPopupEl;
}

function openSwapPopupForSpan(span) {
  const popup = ensureSwapPopup();
  popup.innerHTML = '';

  const key = span.dataset.key || span.textContent.trim();
  const optionsMap = window.swapOptions || {};
  const options =
    optionsMap[key] && optionsMap[key].length > 0
      ? optionsMap[key]
      : [span.textContent.trim()];

  options.forEach((opt) => {
    const div = document.createElement('div');
    div.className = 'swap-option';
    div.textContent = opt;
    div.addEventListener('click', (event) => {
      event.stopPropagation();
      // troca o texto da palavra e mantém data-key para permitir trocar de novo
      span.textContent = opt;
      closeSwapPopup();
    });
    popup.appendChild(div);
  });

  // posicionar popup perto da palavra
  const rect = span.getBoundingClientRect();
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  popup.style.left = `${scrollX + rect.left}px`;
  popup.style.top = `${scrollY + rect.bottom + 8}px`;
  popup.style.display = 'block';

  currentSwapSpan = span;
}

function closeSwapPopup() {
  if (swapPopupEl) {
    swapPopupEl.style.display = 'none';
  }
  currentSwapSpan = null;
}

document.addEventListener('DOMContentLoaded', () => {
  const lessonNumber = getLessonNumber();
  const url = `lessons/lesson${lessonNumber}.json`;

  const titleEl = document.getElementById('lesson-title');
  const sceneIntro = document.getElementById('scene-intro');
  const scriptStart = document.getElementById('script-start');
  const scriptList = document.getElementById('script-list');

  const vocabOutput = document.getElementById('vocabulary-output');
  const emotionOutput = document.getElementById('emotion-output');
  const twistOutput = document.getElementById('twist-output');

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // título
      titleEl.textContent = data.title || '';

      // cena
      sceneIntro.textContent = data.scene || '';

      // guardar opções de troca vindas do JSON
      window.swapOptions = data.options || {};

      // montar script (com speaker A/B + palavras clicáveis)
      scriptList.innerHTML = '';
      (data.script || []).forEach((entry) => {
        let text;
        let speaker = null;

        if (typeof entry === 'string') {
          text = entry;
        } else {
          text = entry.text || entry.line || '';
          if (entry.speaker || entry.who) {
            speaker = String(entry.speaker || entry.who).toUpperCase();
          }
        }

        const li = document.createElement('li');

        if (speaker === 'A') {
          li.classList.add('speaker-a');
        } else if (speaker === 'B') {
          li.classList.add('speaker-b');
        }

        li.innerHTML = buildHighlightedHTML(text, window.swapOptions);
        scriptList.appendChild(li);
      });

      // clique para começar o script
      scriptStart.addEventListener('click', () => {
        sceneIntro.style.display = 'none';
        scriptStart.style.display = 'none';
        scriptList.classList.remove('hidden');
      });

      // guardar arrays para os cards
      window.englishQuestLesson = {
        vocabulary: data.vocabulary || [],
        emotion: data.emotion || [],
        twist: data.twist || [],
      };
    })
    .catch((err) => {
      console.error('Error loading lesson:', err);
      titleEl.textContent = 'Error loading lesson';
    });

  // clique nos cards
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => {
      const type = card.dataset.type;
      const store = window.englishQuestLesson || {};
      const list = store[type] || [];
      const value = randomFromArray(list);

      if (type === 'vocabulary') {
        vocabOutput.textContent = value;
      } else if (type === 'emotion') {
        emotionOutput.textContent = value;
      } else if (type === 'twist') {
        twistOutput.textContent = value;
      }
    });
  });

  // clique global para lidar com popup de opções
  document.addEventListener('click', (event) => {
    const target = event.target;

    // se clicou numa palavra destacada
    if (target.classList && target.classList.contains('swap-candidate')) {
      event.stopPropagation();
      openSwapPopupForSpan(target);
      return;
    }

    // se clicou dentro do popup, não fecha aqui (cada opção já trata o clique)
    if (
      swapPopupEl &&
      (target === swapPopupEl || swapPopupEl.contains(target))
    ) {
      return;
    }

    // clique fora: fecha popup
    if (swapPopupEl && swapPopupEl.style.display === 'block') {
      closeSwapPopup();
    }
  });
});
