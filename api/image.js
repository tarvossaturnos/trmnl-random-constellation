import { getDailyConstellation, getPublicConstellation } from './constellation-data.js';

// A direct image URL for TRMNL <img> layouts. The redirect is followed by the
// renderer, while the selected artwork remains deterministic for the UTC day.
export default function handler(request, response) {
  let constellation;
  try {
    constellation = getPublicConstellation(request, getDailyConstellation());
  } catch {
    return response.status(500).send('Constellation data missing');
  }

  response.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600');
  return response.redirect(302, constellation.image);
}
