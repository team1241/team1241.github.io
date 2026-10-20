# Hex Spacer Generator / Spacer Lab

This dedicated browser CAD tool generates WCP-style round plastic spacers for
1/2-inch and 3/8-inch hex shafts. React and Three.js provide the interface and
preview; Replicad and Open CASCADE WebAssembly generate solid CAD in a browser
worker.

## Hosting and builds

The self-contained production page lives in `docs/spacer-generator/` and deploys
with the Team 1241 GitHub Pages site. There is no backend or separate app host.

From the repository root, using Node.js 22.12 or later:

```powershell
npm.cmd ci --prefix utilities/spacer-generator
node scripts/update-spacer-generator.mjs
```

For development:

```powershell
npm.cmd run dev --prefix utilities/spacer-generator
```

## Profiles and print fit

- 1/2-inch hex: 3/4-inch outside diameter.
- 3/8-inch hex: 5/8-inch outside diameter.
- Every hex bore adds 0.30 mm across flats for a practical printed fit.
- Widths below 0.8 mm are rejected as impractical for typical 0.2 mm-layer FDM
  printing.

The outer dimensions follow WCP's published plastic spacer sizes. Test one
spacer against the intended shaft and printer before producing a full set.

## Batch files

The app accepts one text file for 1/2-inch hex spacers and a separate text file
for 3/8-inch hex spacers. Put one spacer width on each line. Plain numbers use
the unit currently selected in the app; append `mm`, `in`, `inch`, `inches`, or
`"` to override it. Blank lines and text after `#` are ignored. The batch export
downloads one ZIP containing STEP or STL files for all valid, unique widths.

## Verification

```powershell
npm.cmd test --prefix utilities/spacer-generator
node scripts/update-spacer-generator.mjs
```

Tests cover profile dimensions, the 0.30 mm allowance, printable cutoff, text
parsing, ZIP creation, CAD geometry, STEP/STL export, drawings, panning, and
camera framing.
