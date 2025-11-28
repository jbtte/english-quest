# Pokémon English — Card Randomizer

Um app simples e responsivo para **sortear cartas temáticas** usadas em improvisação de inglês durante cenas de Pokémon ou situações do dia a dia.  
Desenvolvido para ser usado principalmente **no celular**, com um modo especial de **Focus Mode** para reduzir distrações durante a aula.

---

## 📱 Funcionalidade

O app permite:

- Escolher uma lição (lesson) e carregar seu baralho.
- Sortear cartas de quatro tipos:
  - **Word Sparks**
  - **Emotion Triggers**
  - **Event Cards**
  - **Mystery Cards** (com revelação ao toque)
- Controlar se as cartas podem se repetir ou não.
- Filtrar quais tipos de cartas entram no sorteio.
- Ver um pequeno histórico das cartas sorteadas.
- Ativar o **Focus Mode**:
  - Esconde histórico, settings e grid de lições.
  - Expande o card para ocupar grande parte da tela.
  - Mantém apenas o botão **Draw card** e o card atual.
  - Ideal para improvisação em tempo real com as crianças.

---

## 🧱 Estrutura do Projeto

```
/
│
├── index.html          # página única do app
├── styles.css          # estilos (mobile-first, dark theme)
├── randomizer.js       # lógica do sorteio e estado do app
│
└── lessons/            # JSONs das lições
    ├── lesson1.json
    ├── lesson2.json
    ├── ...
```

---

## 🎴 Formato dos Arquivos de Aula (JSON)

Cada lição segue o formato:

```json
{
  "lesson": {
    "lesson_number": 2,
    "title": "Lesson 2 – Pokémon Emergency",
    "cards_deck": {
      "word_sparks": ["popcorn", "charger", "cookie", "hoodie"],
      "emotion_triggers": ["suspicious", "scared", "annoyed", "relieved"],
      "event_cards": [
        "Object Drop!",
        "Time is running out!",
        "Something moves in your pocket!",
        "A Pokémon cries!"
      ],
      "mystery_cards": [
        "Hidden Object",
        "Hidden Emotion",
        "Hidden Problem",
        "Hidden Reason"
      ]
    }
  }
}
```

### Observações:

- `total_cards` é opcional e ignorado (o app calcula automaticamente).
- Você pode criar quantas lições quiser.
- O nome do arquivo deve seguir o padrão: `lessonX.json`.

---

## 🔍 Lógica de Sorteio

Ao clicar em **Draw card**, o app:

1. Filtra as cartas pelos tipos habilitados.
2. Remove cartas já usadas (se “Allow repeats” estiver desligado).
3. Escolhe uma carta aleatória do pool restante.
4. Marca a carta como _used_, se aplicável.
5. Atualiza o card na tela.
6. Registra no histórico.

Para cartas **Mystery**, a palavra aparece oculta.  
Ao tocar no card, a palavra é revelada.

---

## 🎯 Focus Mode

O **Focus Mode** foi criado para minimizar distrações durante a improvisação.

- O grid de lições desaparece.
- O painel de configurações desaparece.
- O histórico desaparece.
- O card ocupa grande parte da tela.
- A fonte da palavra aumenta.
- A UI fica “limpa” como um quadro negro.

Perfeito para deixar o celular como dispositivo principal enquanto o iPad projeta outra atividade.

---

## 🛠 Tecnologias

- **HTML single page**
- **CSS mobile-first**, dark mode, fontes Google Fonts
- **JavaScript puro** (zero dependências)
- **JSON externo** para os decks
- Feito para funcionar perfeitamente no **GitHub Pages**

---

## 🚀 Como adicionar novas lições

1. Crie um arquivo em `/lessons/`  
   Ex: `lessons/lesson5.json`
2. Siga o formato do JSON mostrado acima.
3. Adicione o número da lição na UI, se desejar.

---

## 📦 Como rodar

Não precisa de servidor.  
Basta abrir `index.html` localmente ou hospedar no GitHub Pages.

---

## ✔ Status

App totalmente funcional, com:

- Escolha de lição
- Sorteio com filtros
- Mystery reveal
- Focus mode
- Histórico
- Visual limpo e pronto para uso em aula

---
