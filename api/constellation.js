import constellations from '../data/constellations.json';

export default function handler(request, response) {
  if (!constellations || constellations.length === 0) {
    return response.status(500).json({ error: "Data missing" });
  }

  const now = new Date();
  const seed = now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate();

  const x = Math.sin(seed) * 10000;
  const random0to1 = x - Math.floor(x);

  const randomIndex = Math.floor(random0to1 * constellations.length);
  const todaysConstellation = constellations[randomIndex];

  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 's-maxage=14400, stale-while-revalidate=86400');

  return response.status(200).json(todaysConstellation);
}