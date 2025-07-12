// js/app.js

document.addEventListener('DOMContentLoaded', () => {
  // 0. Función de Fisher–Yates para desordenar un array
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // 1. Generar y barajar IDs del 1 al 20
  const ids = shuffle(Array.from({ length: 20 }, (_, i) => i + 1));
  console.log('IDs aleatorios:', ids);

  // 2. Seleccionar y limpiar el contenedor
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  // 3. Renderizar tarjetas usando el array mezclado
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

  // 4. Inicializar Sortable.js con drag handle y feedback visual
  function updateBadges() {
    Array.from(container.children).forEach((card, index) => {
      card.querySelector('.badge').textContent = index + 1;
    });
  }

  const sortable = new Sortable(container, {
    handle: '.drag-handle',
    draggable: '.card',      // sólo .card es arrastrable
    animation: 150,
    onUpdate: updateBadges,
    onStart: ({ item }) => item.classList.add('dragging'),
    onEnd:   ({ item }) => item.classList.remove('dragging'),
  });

  // Actualizar badges inicialmente
  updateBadges();

  // 5. Validación de inputs y deshabilitar botón hasta validación
  const btn = document.getElementById('generate-btn');

  function validateAll() {
    return Array.from(container.querySelectorAll('input[name=fase]'))
      .every(input => input.value.trim() !== '');
  }

  // Deshabilitar o habilitar botón según validación
  container.addEventListener('input', () => {
    btn.disabled = !validateAll();
  });

  // 6. Envío de datos y manejo de validación en clic
  btn.addEventListener('click', async () => {
    // Marcar campos vacíos
    let valid = true;
    container.querySelectorAll('input[name=fase], textarea').forEach(field => {
      const isEmpty = field.value.trim() === '';
      field.classList.toggle('invalid', isEmpty);
      if (field.name === 'fase' && isEmpty) valid = false;
    });
    if (!valid) return; // No enviar si falta fase narrativa en alguna tarjeta

    // Recolectar datos
    const payload = Array.from(container.children).map(card => ({
      id: card.dataset.id,
      fase: card.querySelector('[name=fase]').value,
      descripcion: card.querySelector('[name=descripcion]').value,
      dialogo: card.querySelector('[name=dialogo]').value,
    }));

    // Llamada al backend (Apps Script)
    try {
      const resp = await fetch('https://script.google.com/macros/s/TU_DEPLOY_ID/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenes: payload })
      });
      const data = await resp.json();
      document.getElementById('output-story').textContent = data.story;
    } catch (err) {
      console.error('Error al llamar al backend:', err);
    }
  });
});
