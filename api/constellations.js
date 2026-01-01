export default function handler(request, response) {
  const constellations = [
    {
      name: "Orion",
      latin: "Orion",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Orion_IAU.svg/1024px-Orion_IAU.svg.png",
      description: "De Jager. Dominant in de winterhemel."
    },
    {
      name: "Grote Beer",
      latin: "Ursa Major",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Ursa_Major_IAU.svg/1024px-Ursa_Major_IAU.svg.png",
      description: "Bevat het bekende Steelpannetje."
    },
    {
      name: "Cassiopeia",
      latin: "Cassiopeia",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Cassiopeia_IAU.svg/1024px-Cassiopeia_IAU.svg.png",
      description: "De 'W' vorm tegenover de Grote Beer."
    },
    {
      name: "Zwaan",
      latin: "Cygnus",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Cygnus_IAU.svg/1024px-Cygnus_IAU.svg.png",
      description: "De noorderkruis, vliegt door de Melkweg."
    },
    {
      name: "Leeuw",
      latin: "Leo",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Leo_IAU.svg/1024px-Leo_IAU.svg.png",
      description: "Herkenbaar aan het 'vraagteken' (sikkel)."
    },
    {
      name: "Schorpioen",
      latin: "Scorpius",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Scorpius_IAU.svg/1024px-Scorpius_IAU.svg.png",
      description: "Zichtbaar in de zomer, laag aan de horizon."
    },
    {
      name: "Tweelingen",
      latin: "Gemini",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Gemini_IAU.svg/1024px-Gemini_IAU.svg.png",
      description: "Castor en Pollux, de twee heldere broers."
    },
    {
      name: "Stier",
      latin: "Taurus",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Taurus_IAU.svg/1024px-Taurus_IAU.svg.png",
      description: "De rode ster Aldebaran is het oog."
    },
    {
      name: "Pegasus",
      latin: "Pegasus",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Pegasus_IAU.svg/1024px-Pegasus_IAU.svg.png",
      description: "Het vliegende paard, herkenbaar vierkant."
    },
    {
      name: "Andromeda",
      latin: "Andromeda",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Andromeda_IAU.svg/1024px-Andromeda_IAU.svg.png",
      description: "Bevat ons buur-sterrenstelsel."
    },
    {
      name: "Lier",
      latin: "Lyra",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Lyra_IAU.svg/1024px-Lyra_IAU.svg.png",
      description: "Met Wega, een van de helderste sterren."
    },
    {
      name: "Boogschutter",
      latin: "Sagittarius",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Sagittarius_IAU.svg/1024px-Sagittarius_IAU.svg.png",
      description: "Het theepotje, hart van de Melkweg."
    }
  ];

  // Tijd logica: Roteert elke dag om middernacht
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSinceEpoch = Math.floor(Date.now() / msPerDay);
  const todayIndex = daysSinceEpoch % constellations.length;
  
  const todaysConstellation = constellations[todayIndex];

  // Cache headers voor TRMNL refresh rate
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Cache-Control', 's-maxage=14400, stale-while-revalidate=86400');

  return response.status(200).json(todaysConstellation);
}