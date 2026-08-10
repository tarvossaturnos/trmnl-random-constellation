import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const constellations = require('../data/constellations.json');

export function getDailyConstellation(date = new Date()) {
  if (!constellations?.length) {
    throw new Error('Constellation data is missing');
  }

  const seed =
    date.getUTCFullYear() * 10000 +
    (date.getUTCMonth() + 1) * 100 +
    date.getUTCDate();
  const random = Math.sin(seed) * 10000;
  const index = Math.floor((random - Math.floor(random)) * constellations.length);

  return constellations[index];
}

export function getPublicConstellation(request, constellation = getDailyConstellation()) {
  const { source_image, ...publicConstellation } = constellation;
  const image = publicConstellation.image;

  if (!image.startsWith('/')) {
    return publicConstellation;
  }

  const forwardedProtocol = request.headers['x-forwarded-proto'];
  const protocol = (forwardedProtocol || 'https').split(',')[0].trim();
  const host = (
    request.headers['x-forwarded-host'] ||
    request.headers.host ||
    process.env.VERCEL_URL ||
    ''
  ).split(',')[0].trim();

  return {
    ...publicConstellation,
    image: host ? `${protocol}://${host}${image}` : image,
  };
}
