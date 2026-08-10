# TRMNL Random Constellation

Version 2.0 renders one of the 88 constellations each UTC day for a TRMNL
display.

- Large, black star points and fine charcoal connecting lines
- White background by default
- Locally stored PNG artwork, so the display no longer depends on an external
  image host or CSS colour filters
- Each constellation is generated with an internal safe margin and displayed
  with `object-fit: contain`, so it always fits in the map area

## Endpoints

- `/api/constellation` returns the constellation data for the day, including an
  absolute URL for its artwork.
- `/api` shows an 800×480 browser preview using the same layout rules.

Use the contents of [trmnl-layout.html](trmnl-layout.html) as the TRMNL layout
template.

## Artwork

The 88 generated assets live in `public/constellations/`. To regenerate them:

```sh
npm run build:art
```

This needs Python 3 with Pillow and internet access only while building; the
deployed application serves the generated images locally. Attribution and the
MIT license for the input stick-figure data are in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Verification

```sh
npm test
```
