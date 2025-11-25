# English Quest 🎭📚

App web simples (HTML/CSS/JS) para apoiar sessões de conversação em inglês com crianças. Funciona em iPad via GitHub Pages. Interface clean, estímulo lúdico e interação baseada em improvisação guiada.

---

## 🎮 Objetivo

Criar um ambiente imersivo e divertido para conversação:

- Tema **“English Quest”**: ao iniciar a música, só vale falar inglês.
- Cada aula carrega um **JSON** com:
  - Cena introdutória
  - Diálogo/script
  - Palavras aleatórias para *vocabulário*, *emoção* e *twist*
- O adulto conduz a conversa improvisando a partir desses elementos.

---

## 🗂️ Estrutura de pastas

```text
english-quest/
├─ index.html          # Tela inicial
├─ lesson.html         # Tela de aula
├─ styles.css          # Estilos
├─ main.js             # Lógica tela inicial
├─ lesson.js           # Lógica da tela de aula
├─ audio/
│  └─ theme.mp3        # Áudio de ativação modo inglês
└─ lessons/
   ├─ lesson1.json
   ├─ lesson2.json
   └─ ...
