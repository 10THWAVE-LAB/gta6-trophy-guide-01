// render.js — turns one trophy into its checklist card, and builds the
// progress summary. All text goes through textContent; only the cited
// source links become anchors (plain links, opened only if followed).
import { isSpoiled, spoilerLabel, spoilerHint } from './spoiler.js';

export const GRADE_LABELS = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };
export const KIND_LABELS = {
  story: 'Story',
  side: 'Side story',
  collectible: 'Collectible',
  activity: 'Activity',
  robbery: 'Robbery',
  misc: 'Misc',
  meta: 'Platinum path',
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatCount(trophy) {
  if (trophy.count === undefined) return null;
  if (trophy.countLabel.endsWith('($)')) {
    return `$${trophy.count.toLocaleString('en-US')} ${trophy.countLabel.replace(' ($)', '')}`;
  }
  return `${trophy.count.toLocaleString('en-US')} ${trophy.countLabel}`;
}

export function trophyCard(trophy, state, sources) {
  const earned = state.earned.has(trophy.id);
  const spoiled = isSpoiled(trophy, state);
  const card = el('article', `card${earned ? ' earned' : ''}${trophy.missable ? ' missable-card' : ''}`);
  card.dataset.id = String(trophy.id);

  const checkWrap = el('label', 'card-check');
  checkWrap.title = earned ? 'Mark as not earned' : 'Mark as earned';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned;
  box.setAttribute('aria-label', `Earned: ${spoiled ? spoilerLabel() : trophy.name}`);
  checkWrap.append(box);
  card.append(checkWrap);

  const head = el('div', 'card-head');
  head.append(el('h3', 'card-name', spoiled ? spoilerLabel() : trophy.name));
  head.append(el('span', `badge ${trophy.grade}`, GRADE_LABELS[trophy.grade]));
  head.append(el('span', 'tag', KIND_LABELS[trophy.kind] ?? trophy.kind));
  if (trophy.hidden) head.append(el('span', 'tag hidden-tag', 'Hidden on PSN'));
  if (trophy.missable) head.append(el('span', 'tag missable', 'Missable'));
  const count = formatCount(trophy);
  if (count && !spoiled) head.append(el('span', 'tag', count));
  if (trophy.gs > 0) head.append(el('span', 'tag', `${trophy.gs}G`));
  card.append(head);

  card.append(el('p', 'card-desc', spoiled ? spoilerHint() : trophy.description));

  if (!spoiled) {
    const toggle = el('button', 'card-guide-toggle', 'Read the guide + sources');
    toggle.type = 'button';
    const guideBox = el('div', 'card-guide');
    guideBox.hidden = state.openId !== trophy.id;
    guideBox.append(el('p', null, trophy.guide));
    const srcLine = el('p', 'card-sources', 'Sources: ');
    for (const key of trophy.src) {
      const source = sources[key];
      if (!source) continue;
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = source.name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      srcLine.append(link);
    }
    guideBox.append(srcLine);
    toggle.addEventListener('click', () => {
      guideBox.hidden = !guideBox.hidden;
      toggle.textContent = guideBox.hidden ? 'Read the guide + sources' : 'Hide the guide';
    });
    if (!guideBox.hidden) toggle.textContent = 'Hide the guide';
    card.append(toggle, guideBox);
  }
  return card;
}

export function progressPanel(state) {
  const total = state.trophies.length;
  const earned = state.earned.size;
  const nonPlatinum = state.trophies.filter((t) => t.grade !== 'platinum');
  const earnedNonPlatinum = nonPlatinum.filter((t) => state.earned.has(t.id)).length;
  const pct = Math.round((earnedNonPlatinum / nonPlatinum.length) * 100);
  const gs = state.trophies.filter((t) => state.earned.has(t.id)).reduce((sum, t) => sum + (t.gs || 0), 0);

  const wrap = el('div');
  const top = el('div', 'progress-top');
  const big = el('p', 'progress-big');
  big.append(document.createTextNode(`${earned} / ${total} earned — `));
  big.append(el('span', null, `${pct}% to platinum`));
  top.append(big);
  top.append(el('p', 'progress-sub', `Gamerscore ${gs.toLocaleString('en-US')} / 1,000G · saved in this browser`));
  wrap.append(top);

  const bar = el('div', 'progress-bar');
  const fill = el('div', 'progress-fill');
  fill.style.width = `${pct}%`;
  bar.append(fill);
  wrap.append(bar);

  const counts = el('ul', 'grade-counts');
  for (const grade of ['platinum', 'gold', 'silver', 'bronze']) {
    const ofGrade = state.trophies.filter((t) => t.grade === grade);
    const got = ofGrade.filter((t) => state.earned.has(t.id)).length;
    const li = el('li');
    li.append(el('span', `dot ${grade}`));
    li.append(document.createTextNode(`${GRADE_LABELS[grade]} ${got}/${ofGrade.length}`));
    counts.append(li);
  }
  wrap.append(counts);
  return wrap;
}
