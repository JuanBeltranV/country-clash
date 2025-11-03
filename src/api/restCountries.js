import { findFeature } from "../geo/countries";

// Campos que me interesan de la API de RestCountries
const FIELDS = "name,population,flags,cca3,ccn3";
const URL = `https://restcountries.com/v3.1/all?fields=${FIELDS}`;

export async function fetchCountries() {
  // Llamo a la API
  const res = await fetch(URL);
  if (!res.ok) throw new Error("REST Countries request failed");

  const data = await res.json();

  // Filtro: solo países válidos con población y silueta disponible
  // (para evitar países sin mapa o datos incompletos)
  const filtered = data.filter(
    (c) =>
      typeof c.population === "number" &&
      c.population > 0 &&
      c.cca3 &&
      findFeature(c) // solo los que tengan forma en world-atlas
  );

  // Devuelvo la lista ordenada alfabéticamente
  return filtered.sort((a, b) => a.name.common.localeCompare(b.name.common));
}
