import * as d3 from "d3-geo";
import { feature } from "topojson-client";
import world110 from "world-atlas/countries-110m.json";

// TopoJSON -> GeoJSON
const countriesFC = feature(
  world110,
  world110.objects.countries
);

// Normaliza a "NNN" (tres dígitos con ceros a la izquierda)
function pad3(n) {
  const s = String(n).trim();
  return /^\d+$/.test(s) ? s.padStart(3, "0") : s.toUpperCase();
}

// Índice por id normalizado
const byId3 = new Map();
for (const ft of countriesFC.features) {
  const rawId = ft.id;
  if (rawId !== undefined && rawId !== null) {
    byId3.set(pad3(rawId), ft);
  }
}

// Fallback ISO3 en props (no siempre está)
function getISO3(props = {}) {
  const keys = ["iso_a3","ISO_A3","adm0_a3","ADM0_A3","gu_a3","GU_A3","wb_a3","WB_A3"];
  for (const k of keys) {
    const v = props[k];
    if (typeof v === "string" && v.length === 3) return v.toUpperCase();
  }
  return undefined;
}

export function findFeature(country) {
  if (country.ccn3) {
    const key = pad3(country.ccn3); // ej: "076", "152"
    const f = byId3.get(key);
    if (f) return f;
  }
  const target = country.cca3.toUpperCase();
  const f2 = countriesFC.features.find((ft) => getISO3(ft.properties) === target);
  if (f2) return f2;

  // Aquí podrías poner overrides manuales (ej. XKX/Kosovo)
  return undefined;
}

export function buildProjector(geom, size = 360) {
  const projection = d3.geoMercator().fitSize([size, size], geom);
  const path = d3.geoPath(projection);
  return { path, size };
}
