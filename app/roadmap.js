// roadmap.js — the road to the platinum in four stages, built from the
// official descriptions and the cited guides: which chapters and missions,
// which collectibles and counts, in what order. The one missable trophy
// is flagged in stage 1, where it has to be earned.
export const STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Play the story',
    time: '60–80 hours',
    blurb:
      'Five chapters, 12 story trophies, all automatic as the chapters and missions end. Do the Chapter 1 balcony meditation with Lucia at Jason’s house right after Down to Earth — it is the only trophy that may be missable, and there is no mission replay. Keep a manual save at the start of every chapter (15 manual slots plus autosave), scan vehicles and study animals as you travel, and never touch a cheat on your trophy save: cheats disable trophies and saving.',
  },
  {
    stage: 2,
    title: 'Stage 2 — Side stories & strangers',
    time: 'about 10 hours',
    blurb:
      'Finish the five side-character strands — Andy, Kenton, Billy, Randy and Tyrone — each ending in a finale trophy, hunt the unique animal for Bret, and complete 8 Strangers & Freaks strands across Leonida. Kenton vanishes after Chapter 1 and comes back later. These strands stay open in free roam after the credits, and Strangers & Freaks is not part of the 100% checklist.',
  },
  {
    stage: 3,
    title: 'Stage 3 — The 100% grind',
    time: 'about 100 hours',
    blurb:
      'After the credits the 100% checklist appears under Progress > Stats > 100% Completion, and A Long Road is the gold at the end of it. The checklist is lenient — 200 of 277 vehicles, 100 of 255 animals, 70 of 80 challenges, 15 of 18 card sets, 15 of 18 meditations — with no slack only on the 42 shooting-range golds and the 42 drone time trials. Work the collectibles, activities, robberies and money trophies here; most of them pop while clearing the checklist.',
  },
  {
    stage: 4,
    title: 'Stage 4 — Cleanup & the platinum',
    time: 'a few hours',
    blurb:
      'The one-off miscellaneous trophies: the airport departure, the Rhino tanks, the Ocean Beach cocktail, the showroom smash, the bowling alley and the rest. A few of these had no confirmed method at launch — check the cited guides for the latest confirmed steps. When the last one pops, Vice Got a Price! follows immediately.',
  },
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderRoadmap(state, container) {
  container.replaceChildren();
  const intro = el(
    'p',
    'roadmap-intro',
    'One playthrough, about 200 hours, no online trophies and no difficulty settings. Follow the stages in order; every trophy below links back to its guide in the checklist. ',
  );
  const strong = el('strong', null, 'The single rule: do the Chapter 1 meditation before Chapter 1 ends.');
  intro.append(strong);
  container.append(intro);

  for (const info of STAGES) {
    const section = el('section', 'stage');
    const heading = el('h2');
    heading.append(document.createTextNode(`${info.title} `));
    heading.append(el('span', 'stage-time', `· ${info.time}`));
    section.append(heading);
    section.append(el('p', null, info.blurb));
    const list = el('ul', 'stage-trophies');
    const trophies = state.trophies.filter((t) => t.stage === info.stage);
    for (const trophy of trophies) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#/checklist?open=${trophy.id}`;
      if (state.earned.has(trophy.id)) link.className = 'earned';
      link.append(el('span', `dot ${trophy.grade}`));
      link.append(document.createTextNode(trophy.missable ? `⚠ ${trophy.name}` : trophy.name));
      item.append(link);
      list.append(item);
    }
    section.append(list);
    container.append(section);
  }
}
