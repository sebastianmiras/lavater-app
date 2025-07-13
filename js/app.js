// js/app.js

// URL del Web App de Apps Script
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwWyA1dOpSXL1iml8tL5z1OIR91VfgnQO2ZxE54SmDYDXpmgOSZm9EmYwfblRTLR2Vc/exec';

// Esperar a que el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
  // 0. Fisher–Yates shuffle
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // 1. Barajar IDs del 1 al 20
  const ids = shuffle(Array.from({ length: 20 }, (_, i) => i + 1));

  // 2. Renderizar tarjetas
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  const fasesOptions = [
    'Situación inicial',
    'Conflicto',
    'Desarrollo',
    'Resolución',
    'Situación final'
  ];
  const optionsHTML = fasesOptions
    .map(opt => `<option value="${opt}">${opt}</option>`)
    .join('');

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
      <select name="fase">
        <option value="" disabled selected>Fase narrativa</option>
        ${optionsHTML}
      </select>
      <textarea name="descripcion" placeholder="Descripción"></textarea>
    `;
    container.appendChild(div);
  });

  // 3. Iniciar Sortable y actualizar badges
  function updateBadges() {
    Array.from(container.children).forEach((card, index) => {
      card.querySelector('.badge').textContent = index + 1;
    });
  }
  new Sortable(container, {
    handle: '.drag-handle',
    draggable: '.card',
    animation: 150,
    onUpdate: updateBadges,
    onStart: ({ item }) => item.classList.add('dragging'),
    onEnd: ({ item }) => item.classList.remove('dragging')
  });
  updateBadges();

  // 4. Validación y estado del botón
  const btn = document.getElementById('generate-btn');
  btn.disabled = true;

  function validateAll() {
    const fasesOK = Array.from(container.querySelectorAll('select[name=fase]'))
      .every(sel => sel.value.trim() !== '');
    const descOK = Array.from(container.querySelectorAll('textarea[name=descripcion]'))
      .every(txt => txt.value.trim() !== '');
    return fasesOK && descOK;
  }
  container.addEventListener('input', () => {
    btn.disabled = !validateAll();
  });

  // 5. Envío al backend
  btn.addEventListener('click', async () => {
    // Marcar campos vacíos
    let valid = true;
    container.querySelectorAll('select[name=fase], textarea[name=descripcion]').forEach(field => {
      const isEmpty = field.value.trim() === '';
      field.classList.toggle('invalid', isEmpty);
      if (isEmpty) valid = false;
    });
    if (!valid) return;

    // Recolectar payload
    const payload = Array.from(container.children).map(card => ({
      id: card.dataset.id,
      fase: card.querySelector('select[name=fase]').value,
      descripcion: card.querySelector('textarea[name=descripcion]').value
    }));

    // Llamada al backend
    try {
      const resp = await fetch(WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructions: 'Genera un cuento popular de aproximadamente 200 palabras basado en las descripciones de las escenas siguientes. Usa un tono narrativo clásico, cercano a la tradición oral. Presenta personajes claros y un arco argumental coherente. Mantén un ritmo ágil. No excedas las 200 palabras en total.',
          scenes: payload
        })
      });
      const data = await resp.json();
      document.getElementById('output-story').textContent = data.story;
    } catch (error) {
      console.error('Error al llamar al backend:', error);
    }
  });
});
