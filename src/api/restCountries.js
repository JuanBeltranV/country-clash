import { fallbackCountries } from "../data/fallbackCountries";
import { findFeature } from "../geo/countries";

const FIELDS = "name,population,flags,cca2,cca3,ccn3";
const URL = `https://restcountries.com/v3.1/all?fields=${FIELDS}`;
const REQUEST_TIMEOUT_MS = 3500;

function getFlagUrl(country) {
  return `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`;
}

function normalizeCountries(countries) {
  return countries
    .map((country) => ({
      ...country,
      flags: {
        svg: country.flags?.svg || getFlagUrl(country),
        png: country.flags?.png || getFlagUrl(country),
        alt: country.flags?.alt || `Bandera de ${country.name.common}`,
      },
    }))
    .filter(
      (country) =>
        typeof country.population === "number" &&
        country.population > 0 &&
        country.cca2 &&
        country.cca3 &&
        findFeature(country)
    );
}

async function fetchRemoteCountries() {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(URL, { signal: controller.signal });
    const data = await res.json();

    if (!res.ok || !Array.isArray(data)) {
      throw new Error("REST Countries returned an unsupported response");
    }

    return data;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

export async function fetchCountries() {
  try {
    const remoteCountries = normalizeCountries(await fetchRemoteCountries());
    if (remoteCountries.length >= 2) {
      return remoteCountries.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
    }
  } catch {
    // Fall back when the legacy public API is unavailable or deprecated.
  }

  return normalizeCountries(fallbackCountries).sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );
}
