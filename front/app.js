const API_URL = 'http://localhost:3333';

async function fetchJSON(path, options) {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

function qs(sel, el = document) {
  return el.querySelector(sel);
}

function qsa(sel, el = document) {
  return Array.from(el.querySelectorAll(sel));
}

function renderCard(container, item) {
  const tpl = qs('#cardTemplate');
  const node = tpl.content.firstElementChild.cloneNode(true);
  node.dataset.id = item.id;
  qs('.poster', node).src = item.imageUrl;
  qs('.poster', node).alt = item.title;
  qs('.title', node).textContent = item.title;
  qs('.genre', node).textContent = item.genre;
  qs('.description', node).textContent = item.description || '';
  qs('.likeCount', node).textContent = item.likes;
  qs('.dislikeCount', node).textContent = item.dislikes;

  qs('.like', node).addEventListener('click', async () => {
    await vote(item.id, 'LIKE');
  });

  qs('.dislike', node).addEventListener('click', async () => {
    await vote(item.id, 'DISLIKE');
  });

  container.appendChild(node);
}

function updateTotals(items) {
  const totalLikes = items.reduce((acc, it) => acc + it.likes, 0);
  const totalDislikes = items.reduce((acc, it) => acc + it.dislikes, 0);
  qs('#totalLikes').textContent = `👍 ${totalLikes}`;
  qs('#totalDislikes').textContent = `👎 ${totalDislikes}`;
}

async function loadContents() {
  const grid = qs('#contentGrid');
  grid.innerHTML = '';
  const items = await fetchJSON('/contents');
  items.forEach((it) => renderCard(grid, it));
  updateTotals(items);
}

async function vote(id, type) {
  await fetchJSON(`/contents/${id}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  });

  await reloadCounts();
}

async function reloadCounts() {
  await loadContents();
}

function setupForm() {
  const form = qs('#createForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      await fetchJSON('/contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      form.reset();

      await loadContents();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('Erro ao cadastrar. Verifique os campos.');
    }
  });
}

(async function init() {
  setupForm();
  await loadContents();
})();