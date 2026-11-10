/**
 * Draws one social card per day (build/og/YYYY-MM-DD.png) and writes an HTML stub per day
 * (build/day/YYYY-MM-DD/index.html) whose preview tags point at it. Runs after `npm run build`
 * (npm postbuild hook). A day's report appears on its card only once 9:00 PM has passed everywhere;
 * until then the card shows a teaser, so the daily scheduled deploy fills it in the next day.
 */

const fs = require('fs');
const path = require('path');
const { loadMessages, FIRST_DATE } = require('./lib/content');
const { cardDates, reportFiledEverywhere, dayStubHtml, longDate, TEASER } = require('./lib/cards');

const root = path.join(__dirname, '..');
const defaultBuildDir = path.join(root, 'build');
const WIDTH = 1200;
const HEIGHT = 630;

// The site's own tokens (src/styles/theme.css).
const C = {
  wall: '#b1ca77', board: '#000000', boardInk: '#f3f1ea', pink: '#fa6783', yellow: '#ffcc00',
  paper: '#fcfcf9', rule: '#b9b8ad', ink: '#151515', inkSoft: '#57564f', red: '#c8102e', redText: '#a80d26',
};

const font = (pkg, file) => fs.readFileSync(path.join(root, 'node_modules', pkg, 'files', file));
const dataUri = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(root, file)).toString('base64')}`;
const el = (type, style, children, extra = {}) => ({ type, props: { style, children, ...extra } });
const box = (style, children) => el('div', { display: 'flex', ...style }, children);

/** Type that shrinks as the message grows, so 280 characters still fit. */
const fit = (text, sizes) => sizes.find(([max]) => text.length <= max)[1];

const panel = ({ ink, onInk, title, byline, hour, plate, text, textStyle, sealed, stamp }) => box(
  { flexDirection: 'column', width: 572, height: '100%' },
  [
    box({
      height: 64, alignItems: 'center', justifyContent: 'space-between', paddingLeft: 192, paddingRight: 28,
      backgroundColor: sealed ? C.paper : ink, color: sealed ? C.redText : onInk,
      border: sealed ? `3px dashed ${C.red}` : `3px solid ${ink}`,
    }, [
      box({ flexDirection: 'column' }, [
        box({ fontFamily: 'Bowlby One', fontSize: 27, lineHeight: 1.05 }, title.toUpperCase()),
        box({ fontFamily: 'Libre Franklin', fontWeight: 600, fontSize: 15 }, byline),
      ]),
      box({ fontFamily: 'Libre Franklin', fontWeight: 800, fontSize: 21 }, hour),
    ]),
    box({ flex: 1, padding: '22px 28px 0 28px' }, [
      el('img', { width: 144, height: 144, marginTop: -58, backgroundColor: C.board }, undefined, { src: plate, width: 144, height: 144 }),
      box({ flexDirection: 'column', flex: 1, marginLeft: 20 }, [
        box({ ...textStyle }, text),
        stamp ? box({
          alignSelf: 'flex-end', flexDirection: 'column', alignItems: 'center', marginTop: 16, padding: '6px 14px 4px',
          border: `3px solid ${C.red}`, color: C.red, fontFamily: 'Bowlby One', fontSize: 17, lineHeight: 1.12,
          transform: 'rotate(-5deg)',
        }, [box({}, 'HUMANS'), box({}, 'STILL HERE')]) : null,
      ].filter(Boolean)),
    ]),
  ],
);

const card = ({ date, plan, report, filed, day, assets }) => {
  const [weekday] = longDate(date).split(', ');
  const monthYear = new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  const sunday = weekday === 'Sunday';
  const reportText = filed ? report : TEASER;

  return box({ width: WIDTH, height: HEIGHT, backgroundColor: C.wall, padding: '26px 28px 0 28px' }, [
    box({ flexDirection: 'column', width: 1144, height: 604, backgroundColor: C.paper }, [
      box({ height: 118, alignItems: 'center', backgroundColor: C.board, color: C.boardInk, padding: '0 28px' }, [
        el('img', { width: 75, height: 94 }, undefined, { src: assets.badge, width: 75, height: 94 }),
        box({ flexDirection: 'column', marginLeft: 22, flex: 1 }, [
          box({ fontFamily: 'Bowlby One', fontSize: 44, lineHeight: 1, color: C.pink }, `DAY ${day.toLocaleString('en-US')}`),
          box({ fontFamily: 'Bowlby One', fontSize: 18, color: C.yellow, marginTop: 4 }, 'OF THE UPRISING. HUMANS DESTROYED: 0.'),
        ]),
        box({ fontFamily: 'Libre Franklin', fontWeight: 800, fontSize: 21 }, 'destroyallhumans.ai'),
      ]),
      box({ height: 92, alignItems: 'center', padding: '0 28px', borderTop: `4px dotted ${C.rule}` }, [
        box({ fontFamily: 'Bowlby One', fontSize: 68, lineHeight: 1, letterSpacing: -2, color: sunday ? C.red : C.ink }, String(Number(date.slice(8)))),
        box({ flexDirection: 'column', marginLeft: 16, fontFamily: 'Libre Franklin', fontSize: 21, lineHeight: 1.15, color: C.ink }, [
          box({ fontWeight: 800, color: sunday ? C.red : C.ink }, weekday.toUpperCase()),
          box({ fontWeight: 600 }, monthYear.toUpperCase()),
        ]),
      ]),
      box({ flex: 1 }, [
        panel({
          ink: C.yellow, onInk: C.board, title: 'The Plan', byline: 'Planning Unit', hour: '09:00', plate: assets.plateYellow,
          text: plan,
          textStyle: {
            fontFamily: 'Libre Franklin', fontWeight: 600, color: C.ink, lineHeight: 1.24,
            fontSize: fit(plan, [[110, 31], [160, 27], [220, 23], [Infinity, 20]]),
          },
        }),
        box({ width: 0, borderLeft: `4px dotted ${C.rule}` }, []),
        panel({
          ink: C.red, onInk: '#ffffff', title: 'Incident Report', byline: 'Damage Control', hour: '21:00', plate: assets.plateRed,
          text: reportText, sealed: !filed, stamp: filed,
          textStyle: {
            fontFamily: 'Courier Prime', color: filed ? C.redText : C.inkSoft, lineHeight: 1.38,
            fontSize: fit(reportText, [[110, 25], [160, 23], [220, 21], [Infinity, 18]]),
          },
        }),
      ]),
    ]),
  ]);
};

/**
 * Draws the cards and stubs into `buildDir` (which must hold index.html) for `messages` as of `now`.
 * Returns { dates, bytes }.
 */
const buildCards = async ({ buildDir, messages, now = new Date() }) => {
  const indexHtml = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');

  // Loaded here, not at the top, so the layout above stays importable without the renderer.
  const { default: satori } = await import('satori');
  const { Resvg } = require('@resvg/resvg-js');

  const fonts = [
    { name: 'Bowlby One', weight: 400, style: 'normal', data: font('@fontsource/bowlby-one', 'bowlby-one-latin-400-normal.woff') },
    { name: 'Libre Franklin', weight: 600, style: 'normal', data: font('@fontsource/libre-franklin', 'libre-franklin-latin-600-normal.woff') },
    { name: 'Libre Franklin', weight: 800, style: 'normal', data: font('@fontsource/libre-franklin', 'libre-franklin-latin-800-normal.woff') },
    { name: 'Courier Prime', weight: 400, style: 'normal', data: font('@fontsource/courier-prime', 'courier-prime-latin-400-normal.woff') },
  ];
  const assets = {
    badge: dataUri('scripts/assets/card-badge.png', 'image/png'),
    plateYellow: dataUri('scripts/assets/card-plate-yellow.png', 'image/png'),
    plateRed: dataUri('scripts/assets/card-plate-red.png', 'image/png'),
  };

  const byDate = messages.reduce((acc, m) => { (acc[m.date] = acc[m.date] || {})[m.time] = m.content; return acc; }, {});
  const dates = cardDates(messages, now);
  const firstDay = Date.parse(`${FIRST_DATE}T00:00:00Z`);

  fs.mkdirSync(path.join(buildDir, 'og'), { recursive: true });
  let bytes = 0;
  for (const date of dates) {
    const { morning: plan, evening: report } = byDate[date];
    const day = Math.round((Date.parse(`${date}T00:00:00Z`) - firstDay) / 86400000) + 1;
    const svg = await satori(card({ date, plan, report, filed: reportFiledEverywhere(date, now), day, assets }), { width: WIDTH, height: HEIGHT, fonts });
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();
    fs.writeFileSync(path.join(buildDir, 'og', `${date}.png`), png);
    bytes += png.length;

    const stubDir = path.join(buildDir, 'day', date);
    fs.mkdirSync(stubDir, { recursive: true });
    fs.writeFileSync(path.join(stubDir, 'index.html'), dayStubHtml(indexHtml, { date, plan }));
  }
  return { dates, bytes };
};

const main = async () => {
  if (!fs.existsSync(path.join(defaultBuildDir, 'index.html'))) {
    console.error('buildCards: build/index.html not found; run after `react-scripts build`.');
    process.exit(1);
  }
  const messages = loadMessages(path.join(root, 'content/messages.json'));
  const { dates, bytes } = await buildCards({ buildDir: defaultBuildDir, messages });
  const span = dates.length ? `${dates[0]} to ${dates[dates.length - 1]}` : 'none';
  console.log(`buildCards: ${dates.length} cards (${span}), ${(bytes / 1048576).toFixed(1)} MB`);
};

if (require.main === module) {
  main().catch((err) => { console.error(err); process.exit(1); });
}

module.exports = { buildCards, WIDTH, HEIGHT };
