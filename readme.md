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
```

---

## 🖥️ Como usar

### 1. Abrir via GitHub Pages
Ao acessar a página:

- Clicar em **“Start English Mode”** → toca a música  
- Escolher uma lição → abre `lesson.html?lesson=n`

### 2. Durante a aula

1. Exibe **cena introdutória**
2. Botão: _“Tap to start the script”_
3. Mostra o diálogo
4. Cards clicáveis:
   - *Tap for vocabulary*
   - *Tap for emotion*
   - *Tap for twist*

Cada clique sorteia um elemento, guiando a improvisação da conversa.

---

## 📄 Exemplo de JSON

```json
{
  "title": "Playground",
  "scene": "We're at a neighbourhood street. It's late afternoon and...",
  "script": [
    { "speaker": "A", "text": "Hi, my name is John." },
    { "speaker": "B", "text": "Hey! Want to play?" },
    { "speaker": "A", "text": "Sure!" }
  ],
  "vocabulary": ["playground", "slide", "swing"],
  "emotion": ["excited", "shy", "curious"],
  "twist": ["A dog suddenly appears."]
}
```

---

## 🔧 Tecnologias

- HTML5 / CSS3 / JS puro
- Fonte: **Baloo 2** (Google Fonts)
- Sem dependências externas
- Otimizado para iPad

---

## 📌 Customização

| O que alterar                              | Onde                 |
|--------------------------------------------|----------------------|
| Script, vocabulário, emoção, twists        | `lessons/*.json`     |
| Fonte, cores, espaçamento                  | `styles.css`         |
| Lógica dos cards / comportamento da cena   | `lesson.js`          |
| Número de lições / links                   | `index.html`         |

---

## 🚀 Deploy no GitHub Pages

1. Suba para a branch `main`
2. Vá em **Settings → Pages**
3. Configure:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Acesse:

```
https://<seu-usuario>.github.io/english-quest/
```

---

## 🧠 Ideias futuras

- Sonorização por cena
- Animação na transição da cena
- Personagens nomeados (não só A/B)
- Registro de frases usadas
- Tema “fantasia”, “espiões” etc. mudando apenas o JSON

---

## 👨‍👧 Público-alvo

- Crianças de **8 a 12 anos**
- Sessões curtas de conversação guiada
- Experiência lúdica e envolvente

---

## ✍️ Autor

Criado por **João Paulo** como ferramenta de apoio para conversação em inglês com seus filhos.

---

## 🎧🇬🇧 English only beyond this point

_A música começou. Now… let the quest begin!_ 🔥
