# team1241.github.io

FRC Team 1241 resources site, hosted on GitHub Pages.

## Structure

GitHub Pages is configured to deploy from the `main` branch, `/docs` folder.
Everything under `docs/` is served as-is at https://team1241.github.io/.

## Adding a page

1. Drop a self-contained `.html` file into `docs/`.
2. Add a link to it in `docs/index.html`.
3. Commit and push to `main` — Pages redeploys automatically.

## Utilities

Pully-Generator is included in this repository under **Utilities**. Its complete
source, dependency lockfile, tests, and profile attribution live in
`utilities/pully-generator/`. Its self-contained HTML app and profile license
live in `docs/pully-generator/` and deploy
with this site. No separate hosting or Pully-Generator checkout is required.

To install dependencies and rebuild the included app from the repository root:

```powershell
npm.cmd ci --prefix utilities/pully-generator
node scripts/update-pully-generator.mjs
```

The script builds the local source into `docs/pully-generator/`. Commit the
source and rebuilt files together; the existing `/docs` Pages deployment needs
no additional build step. See `utilities/pully-generator/README.md` for
development and test commands.

The Utilities card opens `docs/pully-generator/index.html` explicitly. The app
embeds its scripts, styles, CAD worker, and WebAssembly, allowing local file
previews as well as GitHub Pages hosting.

## Theme

The home page's light/dark toggle controls the whole site, including every
lesson and Pully-Generator. The choice is remembered in browser storage and
carried on internal links for file previews. Without a saved choice, the site
follows the system theme. Shared behavior is in `docs/theme.js`; lesson and
home-page colors are in `docs/theme.css`.

Widget 1's Ethernet wire insulation keeps its actual colors and white stripes
in both themes; the widget background follows the selected theme.

Validate the shared theme and self-contained app after rebuilding:

```powershell
node --test tests/*.test.cjs
```

## Loading messages and search surprises

Pully-Generator's loading messages live in
`utilities/pully-generator/src/loading-messages.mjs`. They cover FRC, subteams,
engineering, pop culture, and team lore, and rotate randomly during rebuilds.

The home-page search includes at least three original surprises for each of mechanical,
electrical, programming, CAD, manufacturing, drive, strategy, scouting,
business, outreach, media, logistics, and safety. There is one Jeevan/FreeCAD
handoff scenario, three Blaser Swisslube scenarios, and a Team 1285 comeback
chant, alongside the Among Us scene. Electrical also has a lighthearted Nathan
task-queue scene, triggered by `nathan electrical` or `where is nathan`.
Searching `the part` reveals a deliberately cryptic machining reference.

Trigger phrases and their natural search aliases are in
`docs/search-egg-catalog.js`. For example, `can bus`, `cad sketch`, `team budget`,
and `jeevan freecad` reveal automatic screen effects alongside ordinary lesson
results. All 68 surprises are passive effects, with no click-through stories or
mini-games. Screen-wide geometry and particles use 35 themed treatments, with
scenario-specific illustrations. They clear after 4.3 seconds, on another search,
or on Escape. The part effect lasts 4.3 seconds: its archive tray slides in,
the solid model remains unobstructed for about 0.8 seconds, then a label saying
"We don't speak of 'the part'" lands over it. Natural phrases such as `where is the crimper`, `end mill`, `CAD`,
and `Blaser` work; the longest matching phrase takes precedence. Short ambiguous
terms such as `CAN` match only the whole query. Every effect also accepts its
internal short name and displayed title as exact searches. Additional broad aliases
like `terminal`, `logs`, `revisions`, and `camera` are exact searches too; they do not
interrupt unrelated sentences containing those words. Each new matched effect plays
automatically; refining a query that resolves to the same effect does not restart it.
The overlay never intercepts clicks or keyboard focus. Reduced-motion
users receive the punchline without animation. A button optionally replays the effect.
Twelve of the 68 effects (face milling, pocket finishing, tool changing, fixture indexing,
lathe turning, two photo effects, printer, cable labels, coolant, Kraken, and swerve) feature larger animated physical objects. `PID` and `PID tuning` trace
an overshoot settling onto a target. Camera flashes are a single
low-opacity pulse. The cryptic part effect uses artwork generated locally from
the supplied STEP, without distributing the STEP file itself.

Artwork lives in `docs/search-egg-scenes.js`; screen effects live in
`docs/search-egg-effects.js` and `docs/search-egg-effects.css`. Six distinct CNC
scenarios live in `docs/search-cnc-effects.js` and `docs/search-cnc-effects.css`: face
milling, pocket finishing, a tool carousel, origin probing, fixture indexing, and
lathe turning. Try `tool change`, `probe`, `fixture`, or `lathe`; three CNC scenes
reference "the part". `torque` shows a ratchet tightening a bolt and a torque check. `pit` coils a cable
out of a marked walkway. `FTC` and `FIRST Tech Challenge` send a compact robot
across the screen. Component effects for Kraken X60/Talon FX, CANcoder, and
Limelight live in `docs/search-component-effects.js` and its matching CSS.
`motor`, `encoder`, and `Lime` are sufficient triggers. Kraken uses a locally served
[official CTRE product photo](docs/assets/components/README.md). `swerve` steers four
parallel modules, sprouts brief crab claws, then strafes the chassis without changing its heading.
`1241` / `Theory6` use the supplied team logo with a design-build-test loop;
`1285` uses the supplied Biggest Birds logo in the comeback rally. Illustration motion
and responsive styling live in `docs/search-egg-scenes.css`. After editing any
search asset, run `node scripts/update-search-assets.mjs` to update its version
in the home page so cached files do not hide changes.

Visiting team effects live in `docs/search-team-effects.js` and its matching CSS.
Search a number or name: 2056 / OP Robotics, 1114 / Simbotics, 254 / The Cheesy Poofs,
1678 / Citrus Circuits, 2910 / Jack in the Bot, 6328 / Mechanical Advantage, or local
Canadian teams 610 / Crescent Coyotes, 3161 / Tronic Titans, 865 / WARP7,
1334 / OT Devils, and 1246 / Agincourt Skunkworks. The themed symbols are original
illustrations, not official team logos.

Team searches use `docs/search-team-stats.js` to fetch the public
[Statbotics v3 team endpoint](https://statbotics.readthedocs.io/en/latest/).
Stats show lifetime match record, win rate, and current normalized EPA, with source
and retrieval time. No API keys are embedded. Requests time out after three seconds;
successes are cached for five minutes, failures for 30 seconds. Changing the query
or pressing Escape aborts the request and prevents late responses from changing
another team's card. Stats never delay lesson search or animation.
Statbotics returned HTTP 500 during validation on October 11, 2026. Offline
FIRST lifetime totals saved on that date are available for
[1241](https://frc-events.firstinspires.org/team/1241),
[1285](https://frc-events.firstinspires.org/team/1285),
[254](https://frc-events.firstinspires.org/team/254),
[2910](https://frc-events.firstinspires.org/team/2910), and
[3161](https://frc-events.firstinspires.org/team/3161).
These are explicitly labeled dated FIRST snapshots, not live Statbotics data;
teams without a snapshot get an unavailable message and a FIRST link.

Six earlier scenario drawings, seven generic physical actors, the new CNC/torque
artwork, and the three swerve poses were reviewed in the
[Figma storyboard file](https://www.figma.com/design/XoMyqgCSsczJhD08dsngBL).
The supplied images and STEP geometry were kept local. The storyboard checks
static artwork; it does not verify browser animation timing.

Downloaded OpenMoji SVGs are served locally from `docs/assets/easter-eggs/`,
with their license and attribution in the same folder.
The supplied team logos are stored in `docs/assets/logos/`. The Team 1285
comeback scene uses the original Biggest Birds logo.
The Among Us scene uses the supplied original image in `docs/assets/among-us/`.
