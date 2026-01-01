import constellations from '../data/constellations.json';

export default function handler(request, response) {
  if (!constellations || constellations.length === 0) {
    return response.status(500).send("Geen data gevonden.");
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceEpoch = Math.floor(Date.now() / msPerDay);
  const todayIndex = daysSinceEpoch % constellations.length;
  const data = constellations[todayIndex];
  
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TRMNL Preview: ${data.name}</title>
      <style>
        /* BROWSER SETUP (Simulator) */
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
            width: 800px; /* TRMNL breedte */
            height: 480px; /* TRMNL hoogte */
            background: white;
            position: relative;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            border: 10px solid #111;
            border-radius: 10px;
            overflow: hidden;
        }

        /* --- JOUW TRMNL CSS --- */
        
        .layout-container {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: #000000;
            overflow: hidden;
        }
        
        .map-area {
            width: 100%;
            height: calc(100% - 35px); 
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .constellation-image {
            width: 90%;
            height: 90%;
            object-fit: contain;
            filter: invert(1); 
        }
        
        .description-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 5px 10px;
            background: rgba(0,0,0, 0.7); 
            color: #cccccc;
            font-size: 14px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            box-sizing: border-box; /* Belangrijk voor padding */
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
            box-sizing: border-box;
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
            overflow: hidden;
            text-overflow: ellipsis;
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
                <div class="map-area">
                    <img 
                    class="constellation-image"
                    src="${data.image}"
                    alt="${data.name}"
                    >
                    <div class="description-overlay">
                    ${data.description}
                    </div>
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