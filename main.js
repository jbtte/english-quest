document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('start-english-mode');
  const audio = document.getElementById('theme-audio');

  if (!button || !audio) return;

  button.addEventListener('click', () => {
    // tentativa de tocar; em alguns browsers pode exigir interação direta,
    // mas aqui estamos dentro do clique, então costuma funcionar.
    audio.play().catch((err) => {
      console.log('Audio play blocked:', err);
    });
  });
});
