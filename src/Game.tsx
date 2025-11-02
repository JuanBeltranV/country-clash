import { useEffect, useState } from "react";
import type { Country } from "./api/restCountries";
import { fetchCountries } from "./api/restCountries";
import { CountryCard } from "./components/CountryCard";

function pickTwoDistinct<T>(arr: T[]) {
  const i = Math.floor(Math.random() * arr.length);
  let j = Math.floor(Math.random() * arr.length);
  if (j === i) j = (j + 1) % arr.length;
  return [arr[i], arr[j]] as [T, T];
}

const REVEAL_DELAY_MS = 1200;

export default function Game() {
  const [pool, setPool] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  const [score, setScore] = useState(0);
  const [champion, setChampion] = useState<Country | null>(null);
  const [challenger, setChallenger] = useState<Country | null>(null);

  const [leftRevealed, setLeftRevealed] = useState(false);
  const [rightRevealed, setRightRevealed] = useState(false);
  const [emphasizeNow, setEmphasizeNow] = useState(false);

  // Modal de derrota
  const [lostModalOpen, setLostModalOpen] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCountries();
        setPool(data);
        const [a, b] = pickTwoDistinct(data);
        setChampion(a);
        setChallenger(b);
        setScore(0);
        setLeftRevealed(false);
        setRightRevealed(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function startNewGame() {
    if (pool.length < 2) return;
    const [a, b] = pickTwoDistinct(pool);
    setChampion(a);
    setChallenger(b);
    setScore(0);
    setLeftRevealed(false);
    setRightRevealed(false);
    setEmphasizeNow(false);
    setLostModalOpen(false);
  }

  function nextRound(keep: Country) {
    let c: Country;
    do {
      c = pool[Math.floor(Math.random() * pool.length)];
    } while (c.cca3 === keep.cca3);

    setChampion(keep);
    setChallenger(c);
    setLeftRevealed(true);     // el campeón queda visible
    setRightRevealed(false);   // el retador entra oculto
    setEmphasizeNow(false);
  }

  function choose(side: "left" | "right") {
    if (!champion || !challenger) return;

    // Revela ambas poblaciones y activa énfasis visual
    setLeftRevealed(true);
    setRightRevealed(true);
    setEmphasizeNow(true);

    const leftPop = champion.population;
    const rightPop = challenger.population;
    const chosenPop = side === "left" ? leftPop : rightPop;
    const otherPop  = side === "left" ? rightPop : leftPop;

    const correct = chosenPop >= otherPop; // empate = correcto
    setTimeout(() => {
      if (correct) {
        setScore(s => s + 1);
        const newChampion = side === "left" ? champion : challenger;
        nextRound(newChampion);
      } else {
        // Mostrar modal en vez de alert
        setLastScore(score);
        setLostModalOpen(true);
        // dejamos los países revelados para que el usuario vea el resultado
      }
    }, REVEAL_DELAY_MS);
  }

  if (loading || !champion || !challenger) {
    return <p className="loading">Cargando…</p>;
  }

  return (
    <div className="wrapper">
      <header className="top">
        <h1>Country Clash — Population Battle</h1>
      </header>

      <div className="board" aria-hidden={lostModalOpen}>
        <CountryCard
          country={champion}
          showPopulation={leftRevealed}
          emphasize={emphasizeNow}
          size={360}
          onPick={() => choose("left")}
        />
        <div className="vs" aria-label="versus">VS</div>
        <CountryCard
          country={challenger}
          showPopulation={rightRevealed}
          emphasize={emphasizeNow}
          size={360}
          onPick={() => choose("right")}
        />
      </div>

      <footer className="footer" aria-hidden={lostModalOpen}>
        <div className="score">Puntaje: {score}</div>
      </footer>

      {/* Modal de derrota */}
      {lostModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="lose-title">
          <div className="modal">
            <h2 id="lose-title">Perdiste</h2>
            <p className="modal-sub">Puntaje obtenido: <b>{lastScore}</b></p>
            <button className="btn btn-primary" onClick={startNewGame}>
              Reiniciar partida
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
