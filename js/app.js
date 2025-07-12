// js/app.js

// Esperamos a que el DOM esté listo (opcional si tu <script> ya está al final del <body>)
document.addEventListener('DOMContentLoaded', () => {

  // 0. Fisher–Yates shuffle
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // 1. Generar y barajar IDs
  const ids = shuffle(Array.from({ length: 20 }, (_, i) => i + 1));
  console.log('IDs aleatorios:', ids); // para depurar

  // 2. Seleccionar y limpiar el contenedor
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  // 3. Renderizar las tarjetas en orden aleatorio
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

  // 4. Inicializar Sortable (y ya el resto de tu lógica)
  new Sortable(container, { animation: 150 });
  // … tu listener de click para el botón …
});
