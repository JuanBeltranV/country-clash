const FIELDS = "name,population,flags,cca3";
const URL = `https://restcountries.com/v3.1/all?fields=${FIELDS}`;

export type Country = {
  name: { common: string };
  population: number;
  flags: { svg?: string; png?: string; alt?: string };
  cca3: string; // ISO3, ej: CHL, BRA
};

export async function fetchCountries(): Promise<Country[]> {
  const res = await fetch(URL);
  if (!res.ok) throw new Error("REST Countries request failed");
  const data: Country[] = await res.json();

  return data
    .filter(c => typeof c.population === "number" && c.population > 0 && c.cca3)
    .sort((a, b) => a.name.common.localeCompare(b.name.common));
}
