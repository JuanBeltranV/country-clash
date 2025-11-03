import { findFeature } from "../geo/countries";

const FIELDS = "name,population,flags,cca3,ccn3";
const URL = `https://restcountries.com/v3.1/all?fields=${FIELDS}`;

export async function fetchCountries() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("REST Countries request failed");

  const data = await res.json();

  // Solo países con población válida y silueta disponible
  const filtered = data.filter(
    (c) =>
      typeof c.population === "number" &&
      c.population > 0 &&
      c.cca3 &&
      findFeature(c)
  );

  return filtered.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );
}
