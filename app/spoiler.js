// spoiler.js — the spoiler setting hides the names and descriptions of
// story trophies until they are earned. Anything else is always shown.
export function isSpoiled(trophy, state) {
  return state.spoiler && trophy.kind === 'story' && !state.earned.has(trophy.id);
}

export function spoilerLabel() {
  return 'Hidden story trophy';
}

export function spoilerHint() {
  return 'Its name and description stay hidden until you earn it — turn off “Hide story spoilers” to reveal all story trophies.';
}
