import type { Country } from "../api/restCountries";
import { buildProjector, findFeatureByCCA3 } from "../geo/countries";

export function CountryCard({
  country,
  showPopulation,
  onPick,
}: {
  country: Country;
  showPopulation: boolean;
  onPick: () => void;
}) {
  const feature = findFeatureByCCA3(country.cca3);
  const proj = feature ? buildProjector(feature, 220) : null;

  return (
    <button className="card" onClick={onPick} aria-label={`Elegir ${country.name.common}`}>
      <div className="outline">
        {proj ? (
          <svg
            width={proj.size}
            height={proj.size}
            viewBox={`0 0 ${proj.size} ${proj.size}`}
            role="img"
            aria-label={`Mapa de ${country.name.common}`}
          >
            <path d={proj.path(feature as any)!} />
          </svg>
        ) : (
          <div className="outline-fallback">🗺️</div>
        )}
      </div>

      <img
        className="flag"
        src={country.flags.svg || country.flags.png}
        alt={country.flags.alt || `Bandera de ${country.name.common}`}
        loading="lazy"
      />

      <h3 className="name">{country.name.common}</h3>

      <div className="meta">
        {showPopulation ? (
          <span className="pop">{country.population.toLocaleString()} hab.</span>
        ) : (
          <span className="hidden">¿Cuál tiene más población?</span>
        )}
      </div>
    </button>
  );
}
