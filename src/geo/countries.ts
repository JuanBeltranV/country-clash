// src/geo/countries.ts
import * as d3 from "d3-geo";
import { feature } from "topojson-client";
import world110 from "world-atlas/countries-110m.json";

type G = GeoJSON.Geometry;
type FC<P = any> = GeoJSON.FeatureCollection<G, P>;
type F<P = any>  = GeoJSON.Feature<G, P>;

// TopoJSON -> GeoJSON
const countriesFC = feature(
  world110 as unknown as any,
  (world110 as unknown as any).objects.countries
) as unknown as FC;

// Normaliza a "NNN" (tres dígitos con ceros a la izquierda)
function pad3(n: string | number): string {
  const s = String(n).trim();
  return /^\d+$/.test(s) ? s.padStart(3, "0") : s.toUpperCase();
}

// Índice por id normalizado (usa strings siempre)
const byId3 = new Map<string, F>();
for (const ft of countriesFC.features as any[]) {
  const rawId = (ft as any).id;          // puede ser number o string
  if (rawId !== undefined && rawId !== null) {
    byId3.set(pad3(rawId), ft);
  }
}

// Fallback: algunos datasets traen ISO3 en distintas props
function getISO3(props: Record<string, any> = {}) {
  const keys = ["iso_a3","ISO_A3","adm0_a3","ADM0_A3","gu_a3","GU_A3","wb_a3","WB_A3"];
  for (const k of keys) {
    const v = props[k];
    if (typeof v === "string" && v.length === 3) return v.toUpperCase();
  }
  return undefined;
}

export function findFeature(country: { ccn3?: string; cca3: string }): F | undefined {
  // 1) Lo más confiable: ISO numérico (ccn3) -> id del TopoJSON normalizado
  if (country.ccn3) {
    const key = pad3(country.ccn3);   // e.g. "076", "152"
    const f = byId3.get(key);
    if (f) return f;
  }

  // 2) Fallback por ISO3 en propiedades
  const target = country.cca3.toUpperCase();
  const f2 = (countriesFC.features as any[]).find((ft) => getISO3(ft.properties) === target);
  if (f2) return f2 as F;

  // 3) (Opcional) overrides manuales para casos especiales (XKX/Kosovo, etc.)
  // if (target === "XKX") { ... }

  // console.warn("Sin outline para:", country.cca3, country.ccn3);
  return undefined;
}

export function buildProjector(geom: F, size = 360) {
  const projection = d3.geoMercator().fitSize([size, size], geom as any);
  const path = d3.geoPath(projection as any);
  return { path, size };
}
