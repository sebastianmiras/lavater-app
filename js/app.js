// js/app.js

// 0. Función de Fisher–Yates para desordenar un array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 1. IDs del 1 al 20 desordenados
const ids = shuffle(Array.from({ length: 20 }, (_, i) => i + 1));

// 2. Renderizar tarjetas usando el array mezclado
const container = document.getElementById('cards-container');
ids.forEach(id => {
  const div = document.createElement('div');
  div.className = 'card';
  div.dataset.id = id;
  div.innerHTML = `
    <div class="card-header">
      <span class="drag-handle">☰</span>
      <span class="badge">?</span>
    </div>
    <img src="images/${id}.jpg" alt="Escena ${id}">
    <input type="text" name="fase" placeholder="Fase narrativa">
    <textarea name="descripcion" placeholder="Descripción"></textarea>
    <textarea name="dialogo" placeholder="Diálogo"></textarea>
  `;
  container.appendChild(div);
});

// 3. Inicializar Sortable.js
new Sortable(container, {
  animation: 150,
});

// 4. Envío de datos al backend
document.getElementById('generate-btn').addEventListener('click', async () => {
  const payload = Array.from(container.children).map(card => ({
    id: card.dataset.id,
    fase: card.querySelector('[name=fase]').value,
    descripcion: card.querySelector('[name=descripcion]').value,
    dialogo: card.querySelector('[name=dialogo]').value,
  }));

  const resp = await fetch('https://script.google.com/macros/s/TU_DEPLOY_ID/exec', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenes: payload })
  });
  const data = await resp.json();
  document.getElementById('output-story').textContent = data.story;
});
