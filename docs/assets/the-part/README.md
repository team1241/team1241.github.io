# The part

`the-part.svg` is an upright axonometric illustration generated locally from the
user-supplied `26-1241-P3200.stp` on October 11, 2026. It depicts the actual STEP
geometry; the search surprise deliberately leaves its history unexplained.
Flat faces share consistent lighting; a depth buffer suppresses hidden edges.
The source STEP file has not been uploaded to an external service or bundled
with the site.

To regenerate after installing the pulley utility dependencies:

```powershell
node scripts/build-part-artwork.mjs 'C:/path/to/26-1241-P3200.stp'
```
