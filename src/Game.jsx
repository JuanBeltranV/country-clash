import { useEffect, useState } from "react";
import { fetchCountries } from "./api/restCountries";
import { CountryCard } from "./components/CountryCard";

function pickTwoDistinct(arr) {
  const i = Math.floor(Math.random() * arr.length);
  let j = Math.floor(Math.random() * arr.length);
  if (j === i) j = (j + 1) % arr.length;
  return [arr[i], arr[j]];
}

const REVEAL_DELAY_MS = 1200;

export default function Game() {
  const [pool, setPool] = useState([]);
  const [loading, setLoading] = useState(true);

  const [score, setScore] = useState(0);
  const [leftCountry, setLeftCountry] = useState(null);
  const [rightCountry, setRightCountry] = useState(null);

  const [leftRevealed, setLeftRevealed] = useState(false);
  const [rightRevealed, setRightRevealed] = useState(false);
  const [emphasizeNow, setEmphasizeNow] = useState(false);

  const [lostModalOpen, setLostModalOpen] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCountries();
        setPool(data);
        const [a, b] = pickTwoDistinct(data);
        setLeftCountry(a);
        setRightCountry(b);
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
    setLeftCountry(a);
    setRightCountry(b);
    setScore(0);
    setLeftRevealed(false);
    setRightRevealed(false);
    setEmphasizeNow(false);
    setLostModalOpen(false);
  }

  // Siempre el de la derecha pasa a la izquierda
  function advanceWithRightAsNewLeft() {
    if (!rightCountry) return;
    const newLeft = rightCountry;
    let newRight;
    do {
      newRight = pool[Math.floor(Math.random() * pool.length)];
    } while (newRight.cca3 === newLeft.cca3);

    setLeftCountry(newLeft);
    setRightCountry(newRight);
    setLeftRevealed(true);
    setRightRevealed(false);
    setEmphasizeNow(false);
  }

  function choose(side) {
    if (!leftCountry || !rightCountry) return;

    setLeftRevealed(true);
    setRightRevealed(true);
    setEmphasizeNow(true);

    const leftPop = leftCountry.population;
    const rightPop = rightCountry.population;
    const chosenPop = side === "left" ? leftPop : rightPop;
    const otherPop  = side === "left" ? rightPop : leftPop;

    const correct = chosenPop >= otherPop;

    setTimeout(() => {
      if (correct) {
        setScore((s) => s + 1);
        advanceWithRightAsNewLeft();
      } else {
        setLastScore(score);
        setLostModalOpen(true);
      }
    }, REVEAL_DELAY_MS);
  }

  if (loading || !leftCountry || !rightCountry) {
    return <p className="loading">Cargando…</p>;
  }

  return (
    <div className="wrapper">
      <header className="top">
        <h1>Country Clash - Population Battle</h1>
      </header>

      <div className="board" aria-hidden={lostModalOpen}>
        <CountryCard
          country={leftCountry}
          showPopulation={leftRevealed}
          emphasize={emphasizeNow}
          size={360}
          onPick={() => choose("left")}
        />
        <div className="vs" aria-label="versus">VS</div>
        <CountryCard
          country={rightCountry}
          showPopulation={rightRevealed}
          emphasize={emphasizeNow}
          size={360}
          onPick={() => choose("right")}
        />
      </div>

      <footer className="footer" aria-hidden={lostModalOpen}>
        <div className="score">Puntaje: {score}</div>
      </footer>

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
