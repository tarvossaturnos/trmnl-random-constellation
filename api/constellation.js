import constellations from '../data/constellations.json';

export default function handler(request, response) {
  if (!constellations || constellations.length === 0) {
    return response.status(500).json({ error: "Data missing" });
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceEpoch = Math.floor(Date.now() / msPerDay);
  const todayIndex = daysSinceEpoch % constellations.length;
  
  const data = constellations[todayIndex];

  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');

  return response.status(200).json(data);
}