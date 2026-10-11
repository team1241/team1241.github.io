# Pully-Generator / Pulley Lab

The complete browser-based HTD timing pulley configurator lives in this
repository. React and Three.js provide the interface and preview; Replicad and
Open CASCADE WebAssembly generate solid CAD in a background browser worker.

## Hosting and builds

This tool is part of the Team 1241 resources site. Its self-contained production
HTML lives in `docs/pully-generator/` and deploys with the existing GitHub Pages setup.
There is no separate app host, CAD service, API key, or backend.

From the repository root, using Node.js 22.12 or later:

```powershell
npm.cmd ci --prefix utilities/pully-generator
node scripts/update-pully-generator.mjs
```

Commit the source changes and rebuilt `docs/pully-generator/` files together.
The build script uses only the source and dependencies inside this repository.

For development:

```powershell
npm.cmd run dev --prefix utilities/pully-generator
```

The resources return link targets the parent site's index. The production HTML
embeds JavaScript, CSS, a Blob-based CAD worker, and WebAssembly bytes so it also
opens in a local file preview. The home page controls the theme for the entire
site; the app imports the shared behavior from `docs/theme.js`.

## Features

- HTD 5M and 3M pulleys, 12–100 teeth, with dimensional validation.
- Inch and millimeter inputs, drawings, measurements, and CAD exports.
- 1/2-inch and 3/8-inch hex bores with configurable clearance and orientation.
- Standard, tube-insert, and bearing-cone variants with flange options.
- Interactive 3D preview, orthographic views, projection and display controls.
- Front and side drawings, light/dark themes, and STEP and binary STL export.
- An Inventor import guide; native IPT generation is not implemented.

## Geometry and attribution

The adapted droftarts community HTD profile data and generated designs carry
the attribution and share-alike terms in `public/PROFILE-NOTICE.txt`, which is
also published with the tool. The reference source is `profile-reference.scad`;
`scripts/extract-profiles.mjs` extracts the original profile coordinates.
This is not a certified manufacturing profile. Test belt and shaft fit against
your hardware.

## Verification

```powershell
npm.cmd test --prefix utilities/pully-generator
node scripts/update-pully-generator.mjs
```

Tests cover CAD geometry and exports, dimensional validation, unit conversion,
drawings, panning, and camera framing. Generated test files are ignored.
