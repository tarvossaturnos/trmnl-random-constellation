#!/usr/bin/env python3
"""Build the consistent, TRMNL-ready constellation artwork for version 2.0.

The generated PNGs use a public MIT-licensed stick-figure data set. Every
constellation is fitted to its own bounds, drawn with fine charcoal lines and
large black star points, and stored locally for reliable TRMNL rendering.
"""

from __future__ import annotations

import io
import json
import math
import re
import unicodedata
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "constellations.json"
OUTPUT_DIR = ROOT / "public" / "constellations"
GEOMETRY_URL = (
    "https://gist.githubusercontent.com/Ma-Pe-Ma/"
    "c54f683afcb87441ea0d9a1ad3624e7a/raw/"
    "957e08fa5c18c54e0a6e375384a0df58f7c923cb/Constellations.json"
)
CANVAS_LONG_EDGE = 1200
PADDING = 72
LINE_VALUE = 86
STAR_VALUE = 8


def fetch_geometry() -> list[dict]:
    request = Request(GEOMETRY_URL, headers={"User-Agent": "TRMNL constellation asset builder"})
    with urlopen(request, timeout=30) as response:
        return json.load(io.TextIOWrapper(response, encoding="utf-8"))


def filename_for(item: dict) -> str:
    source = item.get("source_image", item["image"])
    stem = Path(source.split("?")[0]).stem.removesuffix("-pattern")
    if stem == "image":
        stem = unicodedata.normalize("NFKD", item["latin"]).encode("ascii", "ignore").decode().lower()
        stem = re.sub(r"[^a-z0-9]+", "-", stem).strip("-")
    return f"{stem}.png"


def unwrap_right_ascension(stars: list[dict]) -> list[float]:
    """Place constellations that cross RA 0h next to each other, not at both edges."""
    values = sorted(star["RA"] for star in stars)
    if len(values) < 2:
        return values
    gaps = [values[index + 1] - values[index] for index in range(len(values) - 1)]
    gaps.append(values[0] + 24 - values[-1])
    start = values[(gaps.index(max(gaps)) + 1) % len(values)]
    return [star["RA"] if star["RA"] >= start else star["RA"] + 24 for star in stars]


def render_artwork(geometry: dict) -> Image.Image:
    stars = geometry["STARS"]
    mean_declination = sum(star["DEC"] for star in stars) / len(stars)
    # Right ascension is stored in hours; scale it to degrees at this latitude
    # so the stick figure keeps its real visual proportions.
    x_values = [
        value * 15 * math.cos(math.radians(mean_declination))
        for value in unwrap_right_ascension(stars)
    ]
    y_values = [-star["DEC"] for star in stars]
    x_min, x_max = min(x_values), max(x_values)
    y_min, y_max = min(y_values), max(y_values)
    x_range = max(x_max - x_min, 0.5)
    y_range = max(y_max - y_min, 0.5)
    drawable_long_edge = CANVAS_LONG_EDGE - PADDING * 2
    scale = drawable_long_edge / max(x_range, y_range)
    width = round(x_range * scale + PADDING * 2)
    height = round(y_range * scale + PADDING * 2)

    coordinates = [
        (
            round((x_value - x_min) * scale + PADDING),
            round((y_value - y_min) * scale + PADDING),
        )
        for x_value, y_value in zip(x_values, y_values)
    ]
    artwork = Image.new("L", (width, height), 255)
    draw = ImageDraw.Draw(artwork)

    for line in geometry["LINES"]:
        points = [coordinates[index] for index in line["INDICES"]]
        if len(points) > 1:
            draw.line(points, fill=LINE_VALUE, width=3, joint="curve")

    for star, (x, y) in zip(stars, coordinates):
        radius = max(9, min(23, round(24 - star["MAG"] * 3.2)))
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=STAR_VALUE)
    return artwork


def main() -> None:
    geometry_by_latin = {
        item["META"]["NAME"]["LA"]: item for item in fetch_geometry()
    }
    # The source data spells this historical Latin name without the diaeresis.
    geometry_by_latin["Boötes"] = geometry_by_latin["Bootes"]

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    constellations = json.loads(DATA_FILE.read_text())
    for item in constellations:
        geometry = geometry_by_latin[item["latin"]]
        filename = filename_for(item)
        render_artwork(geometry).save(OUTPUT_DIR / filename, optimize=True)
        item.pop("source_image", None)
        item["image"] = f"/constellations/{filename}"
        print(f"built {item['name']}: public/constellations/{filename}")
    DATA_FILE.write_text(json.dumps(constellations, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
