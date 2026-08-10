import { getDailyConstellation, getPublicConstellation } from './constellation-data.js';

export default function handler(request, response) {
  let data;
  try {
    data = getPublicConstellation(request, getDailyConstellation());
  } catch {
    return response.status(500).send("Geen data gevonden.");
  }
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TRMNL Preview: ${data.name}</title>
      <style>
        html,
        body {
            width: 100%;
            height: 100%;
            margin: 0;
            overflow: hidden;
            background: #ffffff;
            font-family: sans-serif;
        }

        .layout-container {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            overflow: hidden;
        }

        .map-area {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 11.67%;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3% 2.5%;
            box-sizing: border-box;
            overflow: hidden;
        }

        .constellation-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
        }

        .title-bar {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 11.67%;
            background-color: #ffffff;
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            padding: 1% 1.75%;
            box-sizing: border-box;
            border-top: 1px solid #b5b5b5;
        }

        .title-text {
            font-family: sans-serif;
            color: #000000;
            font-size: clamp(10px, min(2.5vw, 4.17vh), 20px);
            font-weight: bold;
            white-space: nowrap;
        }

        .subtitle-text {
            margin-left: 6px;
            font-size: clamp(7px, min(1.75vw, 2.92vh), 14px);
            font-style: italic;
            color: #555555;
        }

        .description-text {
            width: 100%;
            margin-top: 2px;
            font-size: clamp(7px, min(1.5vw, 2.5vh), 12px);
            color: #555555;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
      </style>
    </head>
    <body>

        <div class="layout-container">
            <div class="map-area">
                <img class="constellation-image" src="${data.image}" alt="${data.name}">
            </div>

            <div class="title-bar">
                <span class="title-text">${data.name}</span>
                <span class="subtitle-text">(${data.latin})</span>
                <span class="description-text">${data.description}</span>
            </div>
        </div>

    </body>
    </html>
  `;

  response.setHeader('Content-Type', 'text/html');
  return response.status(200).send(html);
}
