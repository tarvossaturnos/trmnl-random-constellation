import constellations from '../data/constellations.json';

export default function handler(request, response) {
  if (!constellations || constellations.length === 0) {
    return response.status(500).send("Geen data gevonden.");
  }

  const now = new Date();
  const seed = now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate();
  
  const x = Math.sin(seed) * 10000;
  const random0to1 = x - Math.floor(x);
  
  const randomIndex = Math.floor(random0to1 * constellations.length);
  const data = constellations[randomIndex];
  
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

        /* --- JOUW NIEUWE TRMNL CSS (Sandwich Layout) --- */
        
        .layout-container {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: #000000;
            overflow: hidden;
        }

        .description-bar {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 40px;
            background-color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 10px;
            box-sizing: border-box;
            z-index: 20;
            border-bottom: 2px solid #000000;
        }

        .description-text {
            color: #000000;
            font-size: 14px;
            font-family: sans-serif;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
        }

        .map-area {
            width: 100%;
            height: calc(100% - 75px); 
            top: 40px;
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden; 
        }

        .constellation-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
            
            /* Dikke lijnen filter */
            filter: 
            invert(1)
            drop-shadow(0 0 1px white)
            drop-shadow(0 0 1px white);
            
            transform: scale(1.5);
            transform-origin: center center;
        }

        .title_bar {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 35px;
            background-color: #ffffff;
            display: flex;
            align-items: center;
            padding-left: 10px;
            z-index: 20;
            border-top: 2px solid #000000;
        }

        .icon-small {
            width: 20px;
            height: 20px;
            margin-right: 8px;
            filter: grayscale(1); 
        }

        .title-text {
            font-family: sans-serif;
            color: #000000;
            font-size: 18px;
            font-weight: bold;
            white-space: nowrap;
        }

        .subtitle-text {
            margin-left: 6px;
            font-size: 14px;
            font-style: italic;
            color: #444;
            padding-top: 2px;
        }
      </style>
    </head>
    <body>

        <div class="trmnl-device">
            
            <div class="layout-container">
                <div class="description-bar">
                    <span class="description-text">${data.description}</span>
                </div>
                
                <div class="map-area">
                    <img 
                    class="constellation-image"
                    src="${data.image}"
                    alt="${data.name}"
                    >
                </div>

                <div class="title_bar">
                    <img class="icon-small" src="https://cdn-icons-png.flaticon.com/512/2107/2107957.png">
                    <span class="title-text">${data.name}</span>
                    <span class="subtitle-text">(${data.latin})</span>
                </div>
            </div>

        </div>

    </body>
    </html>
  `;

  response.setHeader('Content-Type', 'text/html');
  return response.status(200).send(html);
}