import { useEffect, useState } from "react";
import { fetchCountries } from "./api/restCountries";
import { CountryCard } from "./components/CountryCard";

function pickTwoFirst(arr) {
  return [arr[0], arr[1]];
}

function shuffleCountries(countries) {
  const shuffled = [...countries];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

const REVEAL_DELAY_MS = 1200;

export default function Game() {
  const [pool, setPool] = useState([]);
  const [nextIndex, setNextIndex] = useState(2);
  const [loading, setLoading] = useState(true);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

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
        const shuffled = shuffleCountries(data);

        if (shuffled.length < 2) {
          console.error("No hay suficientes países para jugar");
          return;
        }

        const [a, b] = pickTwoFirst(shuffled);

        setPool(shuffled);
        setLeftCountry(a);
        setRightCountry(b);
        setNextIndex(2);
        setScore(0);
        setBestScore(0);
        setLeftRevealed(false);
        setRightRevealed(false);

        console.log("Países disponibles:", shuffled.length);
        console.log("Puntaje máximo posible:", shuffled.length - 2);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function resetRunWithSamePool() {
    if (pool.length < 2) return;

    const shuffled = shuffleCountries(pool);
    const [a, b] = pickTwoFirst(shuffled);

    setPool(shuffled);
    setLeftCountry(a);
    setRightCountry(b);
    setNextIndex(2);
    setScore(0);
    setLeftRevealed(false);
    setRightRevealed(false);
    setEmphasizeNow(false);
    setLostModalOpen(false);
  }

  function advanceWithRightAsNewLeft(nextScoreValue) {
    if (!rightCountry || pool.length < 2) return;

    if (nextIndex >= pool.length) {
      setLastScore(nextScoreValue);
      setBestScore((prev) => Math.max(prev, nextScoreValue));
      setLostModalOpen(true);
      return;
    }

    setLeftCountry(rightCountry);
    setRightCountry(pool[nextIndex]);
    setLeftRevealed(true);
    setRightRevealed(false);
    setEmphasizeNow(false);
    setNextIndex((idx) => idx + 1);
  }

  function choose(side) {
    if (!leftCountry || !rightCountry) return;

    setLeftRevealed(true);
    setRightRevealed(true);
    setEmphasizeNow(true);

    const leftPop = leftCountry.population;
    const rightPop = rightCountry.population;
    const chosenPop = side === "left" ? leftPop : rightPop;
    const otherPop = side === "left" ? rightPop : leftPop;
    const correct = chosenPop >= otherPop;

    setTimeout(() => {
      if (correct) {
        const nextScore = score + 1;
        setScore(nextScore);
        setBestScore((prev) => Math.max(prev, nextScore));
        advanceWithRightAsNewLeft(nextScore);
      } else {
        setLastScore(score);
        setBestScore((prev) => Math.max(prev, score));
        setLostModalOpen(true);
      }
    }, REVEAL_DELAY_MS);
  }

  if (loading || !leftCountry || !rightCountry) {
    return (
      <main className="loading-screen">
        <div className="loader" aria-hidden="true" />
        <p>Cargando países...</p>
      </main>
    );
  }

  return (
    <div className="wrapper">
      <header className="top">
        <h1>Country Clash</h1>
        <p>¿Qué país tiene más población?</p>
      </header>

      <main className="board" aria-hidden={lostModalOpen}>
        <CountryCard
          country={leftCountry}
          showPopulation={leftRevealed}
          emphasize={emphasizeNow}
          size={360}
          onPick={() => choose("left")}
        />
        <div className="vs">VS</div>
        <CountryCard
          country={rightCountry}
          showPopulation={rightRevealed}
          emphasize={emphasizeNow}
          size={360}
          onPick={() => choose("right")}
        />
      </main>

      <footer className="footer">
        <div className="score">
          Puntaje: {score} &nbsp;|&nbsp; Mejor: {bestScore}
        </div>
      </footer>

      {lostModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Perdiste</h2>
            <p className="modal-sub">
              Puntaje obtenido: <b>{lastScore}</b>
            </p>
            <button className="btn btn-primary" onClick={resetRunWithSamePool}>
              Reiniciar partida
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
