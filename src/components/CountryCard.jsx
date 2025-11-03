import { buildProjector, findFeature } from "../geo/countries";

export function CountryCard({
  country,
  showPopulation,
  emphasize = false,
  size = 360,
  onPick,
}) {
  const feature = findFeature(country);
  const proj = feature ? buildProjector(feature, size) : null;

  return (
    <button className="card" onClick={onPick} aria-label={`Elegir ${country.name.common}`}>
      <div className="outline">
        {proj && feature ? (
          <svg
            width={proj.size}
            height={proj.size}
            viewBox={`0 0 ${proj.size} ${proj.size}`}
            role="img"
            aria-label={`Mapa de ${country.name.common}`}
          >
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>
            <path
              d={proj.path(feature)}
              fill="url(#grad)"
              stroke="#60a5fa"
              strokeWidth="1.2"
            />
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
          <span className={`pop revealed ${emphasize ? "emph" : ""}`}>
            {Number(country.population).toLocaleString()} hab.
          </span>
        ) : (
          <span className="hidden">¿Cuál tiene más población?</span>
        )}
      </div>
    </button>
  );
}
