import { getDailyConstellation, getPublicConstellation } from './constellation-data.js';

export default function handler(request, response) {
  let constellation;
  try {
    constellation = getPublicConstellation(request, getDailyConstellation());
  } catch {
    return response.status(500).json({ error: "Data missing" });
  }

  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 's-maxage=14400, stale-while-revalidate=86400');

  return response.status(200).json(constellation);
}
