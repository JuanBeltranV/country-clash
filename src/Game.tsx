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

export default function Game() {
  const [pool, setPool] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  const [score, setScore] = useState(0);
  const [champion, setChampion] = useState<Country | null>(null);
  const [challenger, setChallenger] = useState<Country | null>(null);

  const [leftRevealed, setLeftRevealed] = useState(false);
  const [rightRevealed, setRightRevealed] = useState(false);

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

  function nextRound(keep: Country) {
    // Elige un retador distinto del campeón actual.
    let c: Country;
    do {
      c = pool[Math.floor(Math.random() * pool.length)];
    } while (c.cca3 === keep.cca3);

    setChampion(keep);
    setChallenger(c);
    setLeftRevealed(true);   // el campeón queda revelado para las siguientes rondas
    setRightRevealed(false); // el nuevo retador llega sin revelar
  }

  function choose(side: "left" | "right") {
    if (!champion || !challenger) return;

    // Revela ambas poblaciones para mostrar el resultado de la ronda
    setLeftRevealed(true);
    setRightRevealed(true);

    const leftPop = champion.population;
    const rightPop = challenger.population;

    const chosenPop = side === "left" ? leftPop : rightPop;
    const otherPop  = side === "left" ? rightPop : leftPop;

    const correct = chosenPop >= otherPop; // empate cuenta como correcto
    setTimeout(() => {
      if (correct) {
        setScore(s => s + 1);
        const newChampion = side === "left" ? champion : challenger;
        nextRound(newChampion);
      } else {
        alert(`❌ Perdiste. Puntaje: ${score}`);
        const [a, b] = pickTwoDistinct(pool);
        setChampion(a);
        setChallenger(b);
        setScore(0);
        setLeftRevealed(false);
        setRightRevealed(false);
      }
    }, 700); // pequeño delay para que el usuario alcance a ver números
  }

  if (loading || !champion || !challenger) {
    return <p className="loading">Cargando…</p>;
  }

  return (
    <div className="wrapper">
      <header className="top">
        <h1>Country Clash — Population Battle</h1>
        <div className="score">Puntaje: {score}</div>
      </header>

      <div className="board">
        <CountryCard country={champion} showPopulation={leftRevealed} onPick={() => choose("left")} />
        <div className="vs">VS</div>
        <CountryCard country={challenger} showPopulation={rightRevealed} onPick={() => choose("right")} />
      </div>

      <p className="hint">
        Elige el país con <b>más población</b>. Si aciertas, se queda a la izquierda y aparece un nuevo retador.
      </p>
    </div>
  );
}
