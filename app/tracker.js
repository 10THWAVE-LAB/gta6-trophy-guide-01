// tracker.js — the checklist view and the progress summary: render the
// filtered trophies, keep the counts honest, and re-render on every change.
import { applyFilters } from './filters.js';
import { progressPanel, trophyCard } from './render.js';

export function renderProgress(state, container) {
  container.replaceChildren(progressPanel(state));
}

export function renderChecklist(state, elements) {
  const shown = applyFilters(state.trophies, state);
  elements.list.replaceChildren();
  for (const trophy of shown) {
    elements.list.append(trophyCard(trophy, state, state.sources));
  }
  elements.empty.hidden = shown.length > 0;
  const noun = shown.length === 1 ? 'trophy' : 'trophies';
  elements.count.textContent = `Showing ${shown.length} of ${state.trophies.length} ${noun}`;
}
