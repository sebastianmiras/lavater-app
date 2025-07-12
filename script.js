const cards = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  img: `images/${i + 1}.jpg`
}));

function renderCards() {
  const container = document.getElementById("card-container");
  container.innerHTML = "";

  cards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";
    div.draggable = true;
    div.dataset.id = card.id;

    div.innerHTML = `
      <img src="${card.img}" alt="Tarjeta ${card.id}">
      <textarea placeholder="Describe esta escena..."></textarea>
    `;

    // Eventos de arrastre
    div.addEventListener("dragstart", handleDragStart);
    div.addEventListener("dragover", handleDragOver);
    div.addEventListener("drop", handleDrop);

    container.appendChild(div);
  });
}

let draggedCard = null;

function handleDragStart(e) {
  draggedCard = this;
  e.dataTransfer.effectAllowed = "move";
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function handleDrop(e) {
  e.preventDefault();
  if (this === draggedCard) return;

  const container = document.getElementById("card-container");
  const draggedIndex = Array.from(container.children).indexOf(draggedCard);
  const targetIndex = Array.from(container.children).indexOf(this);

  if (draggedIndex < targetIndex) {
    container.insertBefore(draggedCard, this.nextSibling);
  } else {
    container.insertBefore(draggedCard, this);
  }
}

document.getElementById("submit-btn").addEventListener("click", () => {
  const container = document.getElementById("card-container");
  const orderedCards = Array.from(container.children).map(card => ({
    id: card.dataset.id,
    description: card.querySelector("textarea").value.trim()
  }));

  console.log("Narrativa enviada:", orderedCards);
  alert("Narrativa registrada en consola. (Aquí se conectará con Apps Script)");
});

renderCards();
