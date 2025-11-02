import world from "world-countries";
import * as d3 from "d3-geo";

// world-countries exporta un array de GeoJSON Feature de países.
// Cada feature incluye propiedades con 'cca3' que usaremos para mapear con REST Countries.
export type WorldCountryFeature = (typeof world)[number];

export function findFeatureByCCA3(cca3: string) {
  const up = cca3.toUpperCase();
  return world.find(f => (f as any).cca3?.toUpperCase() === up);
}

export function buildProjector(geom: WorldCountryFeature, size = 220) {
  // Ajusta el país a un cuadrado size x size usando Mercator.
  const projection = d3.geoMercator().fitSize([size, size], geom as any);
  const path = d3.geoPath(projection as any);
  return { path, size };
}
