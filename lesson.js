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
 * Converte texto com [palavras] marcadas em spans destacadas.
 * Ex: "I'm [alone] here" -> "I'm <span class='swap-candidate'>alone</span> here"
 */
function buildHighlightedHTML(text) {
  if (!text) return '';
  return text.replace(
    /\[([^\]]+)\]/g,
    '<span class="swap-candidate">$1</span>'
  );
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

      // montar script (com speaker A/B e highlight de [palavras])
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

        // aplica A/B
        if (speaker === 'A') {
          li.classList.add('speaker-a');
        } else if (speaker === 'B') {
          li.classList.add('speaker-b');
        }

        // insere texto com highlights
        li.innerHTML = buildHighlightedHTML(text);
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

  // cards
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
});
