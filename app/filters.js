// filters.js — the kind chips, the grade and earned dropdowns, and the one
// function that applies them all (plus search) to the trophy list.
import { matchesQuery } from './search.js';

export const KIND_FILTERS = [
  { id: 'all', label: 'All 55' },
  { id: 'story', label: 'Story' },
  { id: 'missable', label: 'Missable' },
  { id: 'collectible', label: 'Collectibles' },
  { id: 'activity', label: 'Activities' },
  { id: 'side', label: 'Side stories' },
  { id: 'robbery', label: 'Robberies' },
  { id: 'misc', label: 'Misc & money' },
];

// The platinum and 100% live under "Misc & money" so every trophy has a home.
function kindMatches(trophy, filter) {
  if (filter === 'all') return true;
  if (filter === 'missable') return trophy.missable;
  if (filter === 'misc') return trophy.kind === 'misc' || trophy.kind === 'meta';
  return trophy.kind === filter;
}

export function applyFilters(trophies, state) {
  return trophies.filter((trophy) => {
    if (!kindMatches(trophy, state.filter)) return false;
    if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
    if (state.earnedFilter === 'earned' && !state.earned.has(trophy.id)) return false;
    if (state.earnedFilter === 'unearned' && state.earned.has(trophy.id)) return false;
    return matchesQuery(trophy, state.query, state);
  });
}
