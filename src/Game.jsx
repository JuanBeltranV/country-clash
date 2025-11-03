import { useEffect, useState } from "react";
import { fetchCountries } from "./api/restCountries";
import { CountryCard } from "./components/CountryCard";

function pickTwoFirst(arr) {
  // Solo agarro los dos primeros países del arreglo barajado
  return [arr[0], arr[1]];
}

const REVEAL_DELAY_MS = 1200; // tiempo de revelado de población

export default function Game() {
  // Estados principales del juego
  const [pool, setPool] = useState([]);          // mazo barajado de países
  const [nextIndex, setNextIndex] = useState(2); // próximo país nuevo
  const [loading, setLoading] = useState(true);

  const [score, setScore] = useState(0);         // puntaje actual
  const [bestScore, setBestScore] = useState(0); // mejor puntaje de esta sesión

  const [leftCountry, setLeftCountry] = useState(null);
  const [rightCountry, setRightCountry] = useState(null);

  // Control visual
  const [leftRevealed, setLeftRevealed] = useState(false);
  const [rightRevealed, setRightRevealed] = useState(false);
  const [emphasizeNow, setEmphasizeNow] = useState(false);

  // Modal de “perdiste”
  const [lostModalOpen, setLostModalOpen] = useState(false);
  const [lastScore, setLastScore] = useState(0); // puntaje de la corrida que acabo de perder

  // Carga inicial del juego
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCountries();

        // Barajo los países (mezclo el orden)
        const shuffled = [...data].sort(() => Math.random() - 0.5);

        if (shuffled.length < 2) {
          console.error("No hay suficientes países para jugar");
          return;
        }

        const [a, b] = pickTwoFirst(shuffled);

        // Seteo el estado inicial del juego
        setPool(shuffled);
        setLeftCountry(a);
        setRightCountry(b);
        setNextIndex(2);
        setScore(0);
        setBestScore(0); // por si algún día recargo manualmente desde aquí
        setLeftRevealed(false);
        setRightRevealed(false);

        console.log("Países disponibles:", shuffled.length);
        console.log("Puntaje máximo posible:", shuffled.length - 2);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Reinicia el juego usando el mismo pool barajado
  function resetRunWithSamePool() {
    if (pool.length < 2) return;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const [a, b] = pickTwoFirst(shuffled);

    setPool(shuffled);
    setLeftCountry(a);
    setRightCountry(b);
    setNextIndex(2);
    setScore(0);               // el score actual sí lo reinicio
    // OJO: el bestScore no lo toco, así se mantiene mientras no recargue la página
    setLeftRevealed(false);
    setRightRevealed(false);
    setEmphasizeNow(false);
    setLostModalOpen(false);
  }

  // Atajo: reinicia todo para una nueva corrida
  function startNewGame() {
    resetRunWithSamePool();
  }

  // Cada vez que acierto:
  // → el país derecho pasa a la izquierda
  // → el siguiente del pool entra a la derecha
  // recibo nextScore para poder manejar el caso "corrida perfecta"
  function advanceWithRightAsNewLeft(nextScoreValue) {
    if (!rightCountry || pool.length < 2) return;

    // Si ya no hay países nuevos, llegué al máximo sin repetir
    if (nextIndex >= pool.length) {
      setLastScore(nextScoreValue);
      setBestScore((prev) => Math.max(prev, nextScoreValue));
      setLostModalOpen(true);
      return;
    }

    const newLeft = rightCountry;
    const newRight = pool[nextIndex];

    setLeftCountry(newLeft);
    setRightCountry(newRight);
    setLeftRevealed(true);
    setRightRevealed(false);
    setEmphasizeNow(false);

    setNextIndex((idx) => idx + 1);
  }

  // Lógica de comparación al elegir un país
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
        // Calculo el nuevo score yo mismo para poder reutilizarlo
        const nextScore = score + 1;

        // Actualizo el score actual
        setScore(nextScore);

        // Actualizo el mejor puntaje si corresponde
        setBestScore((prev) => Math.max(prev, nextScore));

        // Continúo el juego con el nuevo estado
        advanceWithRightAsNewLeft(nextScore);
      } else {
        // Guardar el puntaje con el que acabo de perder
        setLastScore(score);

        // Actualizar mejor puntaje también aquí
        setBestScore((prev) => Math.max(prev, score));

        setLostModalOpen(true);
      }
    }, REVEAL_DELAY_MS);
  }

  // Estado de carga
  if (loading || !leftCountry || !rightCountry) {
    return <p className="loading">Cargando…</p>;
  }

  // Render principal del juego
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
        <div className="vs">VS</div>
        <CountryCard
          country={rightCountry}
          showPopulation={rightRevealed}
          emphasize={emphasizeNow}
          size={360}
          onPick={() => choose("right")}
        />
      </div>

      <footer className="footer">
        {/* Muestro puntaje actual y mejor puntaje de esta sesión */}
        <div className="score">
          Puntaje: {score} &nbsp;|&nbsp; Mejor: {bestScore}
        </div>
      </footer>

      {/* Modal de derrota */}
      {lostModalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Perdiste</h2>
            <p className="modal-sub">
              Puntaje obtenido: <b>{lastScore}</b>
            </p>
            <button className="btn btn-primary" onClick={startNewGame}>
              Reiniciar partida
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
