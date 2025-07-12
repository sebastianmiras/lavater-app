// 1. Renderizar tarjetas dinámicamente (20 imágenes numeradas)
const container = document.getElementById('cards-container');
for (let id = 1; id <= 20; id++) {
  const div = document.createElement('div');
  div.className = 'card';
  div.dataset.id = id;
  div.innerHTML = `
    <img src="images/${id}.jpg" alt="Escena ${id}">
    <input type="text" name="fase" placeholder="Fase narrativa">
    <textarea name="descripcion" placeholder="Descripción"></textarea>
    <textarea name="dialogo" placeholder="Diálogo"></textarea>
  `;
  container.appendChild(div);
}

// 2. Inicializar Sortable.js
new Sortable(container, {
  animation: 150,
});

// 3. Envío de datos al backend
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
