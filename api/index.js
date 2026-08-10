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
        /* --- SIMULATOR CSS --- */
        body {
            background: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: sans-serif;
        }
        .trmnl-device {
            width: 800px;
            height: 480px;
            background: white;
            position: relative;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            border: 10px solid #111;
            border-radius: 10px;
            overflow: hidden;
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
            bottom: 56px;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 14px 20px;
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
            height: 56px;
            background-color: #ffffff;
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            padding: 5px 14px;
            box-sizing: border-box;
            border-top: 1px solid #b5b5b5;
        }

        .title-text {
            font-family: sans-serif;
            color: #000000;
            font-size: 20px;
            font-weight: bold;
            white-space: nowrap;
        }

        .subtitle-text {
            margin-left: 6px;
            font-size: 14px;
            font-style: italic;
            color: #555555;
        }

        .description-text {
            width: 100%;
            margin-top: 2px;
            font-size: 12px;
            color: #555555;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
      </style>
    </head>
    <body>

        <div class="trmnl-device">
            
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

        </div>

    </body>
    </html>
  `;

  response.setHeader('Content-Type', 'text/html');
  return response.status(200).send(html);
}
