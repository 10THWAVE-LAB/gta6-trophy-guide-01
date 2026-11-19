// storage.js — progress lives in the browser only: localStorage for the
// earned set and the spoiler setting, plus export to a file and import back.
export const EARNED_KEY = 'leonida-legend-earned-v1';
export const SPOILER_KEY = 'leonida-legend-spoiler-v1';

export function loadEarned() {
  try {
    const raw = JSON.parse(localStorage.getItem(EARNED_KEY) ?? '[]');
    if (!Array.isArray(raw)) return new Set();
    return new Set(raw.filter((id) => Number.isInteger(id)));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function loadSpoiler() {
  return localStorage.getItem(SPOILER_KEY) === '1';
}

export function saveSpoiler(on) {
  localStorage.setItem(SPOILER_KEY, on ? '1' : '0');
}

export function exportProgress(earned) {
  const payload = {
    app: 'leonida-legend',
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'leonida-legend-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

// Accepts this guide's export format, or a bare array of trophy ids or
// names (the plain checklist format). Returns a Set of ids, or null.
export async function importProgress(file, trophies) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const raw = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(raw)) return null;
  const byName = new Map(trophies.map((t) => [t.name.toLowerCase(), t.id]));
  const ids = new Set();
  for (const item of raw) {
    if (Number.isInteger(item) && trophies.some((t) => t.id === item)) ids.add(item);
    else if (typeof item === 'string' && byName.has(item.toLowerCase())) ids.add(byName.get(item.toLowerCase()));
  }
  return ids;
}
