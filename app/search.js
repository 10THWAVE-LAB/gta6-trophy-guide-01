// search.js — find a trophy by name (or by a word in its description or
// guide) in a glance. A spoiled story trophy never matches a query, so a
// search cannot leak a hidden name.
import { isSpoiled } from './spoiler.js';

export function matchesQuery(trophy, query, state) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (isSpoiled(trophy, state)) return false;
  const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
  return q.split(/\s+/).every((word) => haystack.includes(word));
}
