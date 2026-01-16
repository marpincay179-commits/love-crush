const icons = ["❤️", "🌹", "💋", "⭐"];

const loveData = [
  { text: "💖 Cada combinación me recuerda a ti", img: "./img/love1.jpg" },
  { text: "🌹 Nuestro amor siempre encaja", img: "./img/love2.jpg" },
  { text: "💋 No hay jugada más dulce que tú", img: "./img/love3.jpg" },
  { text: "⭐ Contigo siempre gano", img: "./img/love4.jpg" },
  { text: "❤️ Eres mi mejor combinación", img: "./img/love5.jpg" }
];

const board = document.getElementById("board");
const messageText = document.getElementById("message");
const messageImage = document.getElementById("messageImage");
const finalMessage = document.getElementById("finalMessage");

const width = 6;
let score = 0;
let index = 0;
let cells = [];
let draggedCell = null;
let replacedCell = null;

// Crear tablero
for (let i = 0; i < width * width; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.setAttribute("draggable", true);
  cell.setAttribute("id", i);
  cell.textContent = randomIcon();
  board.appendChild(cell);
  cells.push(cell);
}

// Drag & Drop
cells.forEach(cell => {
  cell.addEventListener("dragstart", () => draggedCell = cell);
  cell.addEventListener("dragover", e => e.preventDefault());
  cell.addEventListener("drop", () => replacedCell = cell);
  cell.addEventListener("dragend", dragEnd);
});

function dragEnd() {
  if (!replacedCell) return;

  const draggedId = +draggedCell.id;
  const replacedId = +replacedCell.id;

  const validMoves = [
    draggedId - 1,
    draggedId + 1,
    draggedId - width,
    draggedId + width
  ];

  if (validMoves.includes(replacedId)) {
    swapCells(draggedCell, replacedCell);

    if (checkMatches()) {
      score += 10;
      showLoveMessage();
      if (score >= 50) {
        finalMessage.classList.remove("hidden");
      }
    } else {
      setTimeout(() => swapCells(draggedCell, replacedCell), 300);
    }
  }

  replacedCell = null;
}

// === FUNCIONES ===

function showLoveMessage() {
  const data = loveData[index];

  messageText.textContent = data.text;
  messageImage.src = data.img;
  messageImage.classList.remove("hidden");

  messageText.style.transform = "scale(1.2)";
  messageImage.style.transform = "scale(1.1)";
  messageImage.style.opacity = "0.7";

  setTimeout(() => {
    messageText.style.transform = "scale(1)";
    messageImage.style.transform = "scale(1)";
    messageImage.style.opacity = "1";
  }, 300);

  index = (index + 1) % loveData.length;
}

function swapCells(a, b) {
  [a.textContent, b.textContent] = [b.textContent, a.textContent];
}

function checkMatches() {
  let found = false;

  for (let i = 0; i < 36; i++) {
    if (i % width > 3) continue;
    if (
      cells[i].textContent &&
      cells[i].textContent === cells[i + 1].textContent &&
      cells[i].textContent === cells[i + 2].textContent
    ) {
      animateMatch([i, i + 1, i + 2]);
      found = true;
    }
  }

  for (let i = 0; i < 24; i++) {
    if (
      cells[i].textContent &&
      cells[i].textContent === cells[i + width].textContent &&
      cells[i].textContent === cells[i + width * 2].textContent
    ) {
      animateMatch([i, i + width, i + width * 2]);
      found = true;
    }
  }

  return found;
}

function animateMatch(indexes) {
  indexes.forEach(i => cells[i].classList.add("match"));
  setTimeout(() => {
    indexes.forEach(i => {
      cells[i].textContent = randomIcon();
      cells[i].classList.remove("match");
    });
  }, 300);
}

function randomIcon() {
  return icons[Math.floor(Math.random() * icons.length)];
}
