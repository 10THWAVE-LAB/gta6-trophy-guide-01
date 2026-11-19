// app.js — boot and state for the Leonida Legend guide: loads the trophy
// data, owns the shared state, routes between the checklist and the roadmap
// on the URL hash, and wires every control. The hash carries the view and
// the current filter, spoiler and open-trophy state, so a link reproduces
// exactly what its maker saw.
import { KIND_FILTERS } from './filters.js';
import { renderChecklist, renderProgress } from './tracker.js';
import { renderRoadmap } from './roadmap.js';
import {
  loadEarned,
  saveEarned,
  loadSpoiler,
  saveSpoiler,
  exportProgress,
  importProgress,
} from './storage.js';

const state = {
  trophies: [],
  sources: {},
  earned: loadEarned(),
  spoiler: loadSpoiler(),
  filter: 'all',
  grade: 'all',
  earnedFilter: 'all',
  query: '',
  openId: null,
  view: 'checklist',
};

const elements = {
  progress: document.getElementById('progress'),
  toolbar: document.getElementById('toolbar'),
  search: document.getElementById('search'),
  spoiler: document.getElementById('spoiler'),
  filters: document.getElementById('filters'),
  grade: document.getElementById('grade-filter'),
  earnedFilter: document.getElementById('earned-filter'),
  list: document.getElementById('list'),
  count: document.getElementById('list-count'),
  empty: document.getElementById('empty'),
  checklistView: document.getElementById('checklist-view'),
  roadmapView: document.getElementById('roadmap-view'),
  tabChecklist: document.getElementById('tab-checklist'),
  tabRoadmap: document.getElementById('tab-roadmap'),
  warning: document.getElementById('missable-warning'),
};

function renderAll() {
  renderProgress(state, elements.progress);
  renderChecklist(state, elements);
  renderRoadmap(state, elements.roadmapView);
  const onRoadmap = state.view === 'roadmap';
  elements.checklistView.hidden = onRoadmap;
  elements.roadmapView.hidden = !onRoadmap;
  elements.toolbar.hidden = onRoadmap;
  elements.tabChecklist.classList.toggle('active', !onRoadmap);
  elements.tabRoadmap.classList.toggle('active', onRoadmap);
  elements.warning.hidden = false;
}

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, queryString] = raw.split('?');
  const params = new URLSearchParams(queryString ?? '');
  state.view = path === 'roadmap' ? 'roadmap' : 'checklist';
  // The hash is the whole view state: a parameter left out means its default,
  // so a bare #/checklist clears the search and filters instead of keeping
  // stale ones. Only the spoiler setting falls back to the saved preference.
  state.filter = 'all';
  state.grade = 'all';
  state.earnedFilter = 'all';
  state.query = '';
  state.openId = null;
  state.spoiler = params.has('spoiler') ? params.get('spoiler') === '1' : loadSpoiler();
  const filter = params.get('filter');
  if (filter && KIND_FILTERS.some((f) => f.id === filter)) state.filter = filter;
  const grade = params.get('grade');
  if (grade && ['all', 'platinum', 'gold', 'silver', 'bronze'].includes(grade)) state.grade = grade;
  const earned = params.get('earned');
  if (earned && ['all', 'earned', 'unearned'].includes(earned)) state.earnedFilter = earned;
  const open = Number(params.get('open'));
  if (Number.isInteger(open) && open > 0) state.openId = open;
  const q = params.get('q');
  if (q !== null) state.query = q;
  syncControls();
}

function syncControls() {
  elements.search.value = state.query;
  elements.spoiler.checked = state.spoiler;
  elements.grade.value = state.grade;
  elements.earnedFilter.value = state.earnedFilter;
  for (const button of elements.filters.querySelectorAll('button')) {
    button.classList.toggle('active', button.dataset.filter === state.filter);
  }
}

function syncHash() {
  const params = new URLSearchParams();
  if (state.filter !== 'all') params.set('filter', state.filter);
  if (state.grade !== 'all') params.set('grade', state.grade);
  if (state.earnedFilter !== 'all') params.set('earned', state.earnedFilter);
  if (state.spoiler) params.set('spoiler', '1');
  if (state.openId !== null) params.set('open', String(state.openId));
  if (state.query) params.set('q', state.query);
  const query = params.toString();
  history.replaceState(null, '', `#/${state.view}${query ? `?${query}` : ''}`);
}

function scrollToOpen() {
  if (state.openId === null || state.view !== 'checklist') return;
  const card = elements.list.querySelector(`[data-id="${state.openId}"]`);
  if (card) card.scrollIntoView({ block: 'center' });
}

function buildFilterChips() {
  for (const kind of KIND_FILTERS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.filter = kind.id;
    button.textContent = kind.label;
    button.addEventListener('click', () => {
      state.filter = kind.id;
      state.openId = null;
      syncControls();
      syncHash();
      renderAll();
    });
    elements.filters.append(button);
  }
}

async function boot() {
  const doc = await (await fetch('data/trophies.json')).json();
  state.trophies = doc.trophies;
  state.sources = doc.sources;

  buildFilterChips();
  parseHash();
  renderAll();
  scrollToOpen();

  window.addEventListener('hashchange', () => {
    parseHash();
    renderAll();
    scrollToOpen();
  });

  elements.search.addEventListener('input', () => {
    state.query = elements.search.value;
    state.openId = null;
    syncHash();
    renderChecklist(state, elements);
  });

  elements.spoiler.addEventListener('change', () => {
    state.spoiler = elements.spoiler.checked;
    saveSpoiler(state.spoiler);
    syncHash();
    renderAll();
  });

  elements.grade.addEventListener('change', () => {
    state.grade = elements.grade.value;
    syncHash();
    renderChecklist(state, elements);
  });

  elements.earnedFilter.addEventListener('change', () => {
    state.earnedFilter = elements.earnedFilter.value;
    syncHash();
    renderChecklist(state, elements);
  });

  elements.list.addEventListener('change', (event) => {
    const box = event.target;
    if (box.type !== 'checkbox') return;
    const card = box.closest('[data-id]');
    const id = Number(card.dataset.id);
    if (box.checked) state.earned.add(id);
    else state.earned.delete(id);
    saveEarned(state.earned);
    renderAll();
  });

  document.getElementById('export-btn').addEventListener('click', () => exportProgress(state.earned));

  const importFile = document.getElementById('import-file');
  document.getElementById('import-btn').addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', async () => {
    const file = importFile.files[0];
    if (!file) return;
    try {
      const ids = await importProgress(file, state.trophies);
      if (ids === null) throw new Error('unrecognized file');
      state.earned = ids;
      saveEarned(state.earned);
      renderAll();
    } catch {
      alert('That file is not a Leonida Legend progress export.');
    }
    importFile.value = '';
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    if (!confirm('Clear all earned trophies? Export first if you want a backup.')) return;
    state.earned = new Set();
    saveEarned(state.earned);
    renderAll();
  });
}

boot();
