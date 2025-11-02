// src/api/restCountries.ts
import { findFeature } from "../geo/countries";

const FIELDS = "name,population,flags,cca3,ccn3"; // Trae los campos necesarios
const URL = `https://restcountries.com/v3.1/all?fields=${FIELDS}`;

export type Country = {
  name: { common: string };
  population: number;
  flags: { svg?: string; png?: string; alt?: string };
  cca3: string;   // Código ISO3 (ej: CHL, BRA)
  ccn3?: string;  // Código numérico ISO (ej: "152", "076")
};

export async function fetchCountries(): Promise<Country[]> {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("REST Countries request failed");

  const data: Country[] = await res.json();

  // 🔹 Filtramos solo los países válidos y con silueta (feature)
  const filtered = data.filter(
    (c) =>
      typeof c.population === "number" &&
      c.population > 0 &&
      c.cca3 &&
      findFeature(c) // ← asegúrate de que tenga mapa
  );

  // 🔹 Orden alfabético
  return filtered.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );
}
