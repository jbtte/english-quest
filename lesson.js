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
      // título da lição (sem "Lesson 1")
      titleEl.textContent = data.title || '';

      // introdução da cena
      sceneIntro.textContent = data.scene || '';

      // montar script (com suporte a objetos {speaker, text} e strings simples)
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
        li.textContent = text;

        if (speaker === 'A') {
          li.classList.add('speaker-a');
        } else if (speaker === 'B') {
          li.classList.add('speaker-b');
        }

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

  // listeners dos cards
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
