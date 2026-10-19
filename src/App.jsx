import { useEffect, useRef, useState } from 'react';

const initialDuration = { minutes: '1', seconds: '0', milliseconds: '0' };

function toMilliseconds(duration) {
  return Number(duration.minutes) * 60000 + Number(duration.seconds) * 1000 + Number(duration.milliseconds);
}

export default function App() {
  const [duration, setDuration] = useState(initialDuration);
  const [remaining, setRemaining] = useState(toMilliseconds(initialDuration));
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);
  const total = toMilliseconds(duration);

  useEffect(() => {
    if (!running) return;

    let frame;

    function tick() {
      const nextRemaining = Math.max(0, Math.ceil(deadline.current - performance.now()));
      setRemaining(nextRemaining);

      if (nextRemaining === 0) {
        setRunning(false);
        return;
      }

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  function changeDuration(field, value, maximum) {
    const sanitized = value.replace(/\D/g, '');
    const nextDuration = {
      ...duration,
      [field]: sanitized === '' ? '' : String(Math.min(maximum, Number(sanitized))),
    };

    setDuration(nextDuration);
    setRemaining(toMilliseconds(nextDuration));
  }

  function toggleTimer() {
    if (running) {
      setRemaining(Math.max(0, Math.ceil(deadline.current - performance.now())));
      setRunning(false);
      return;
    }

    const nextRemaining = remaining > 0 ? remaining : total;
    if (nextRemaining === 0) return;

    deadline.current = performance.now() + nextRemaining;
    setRemaining(nextRemaining);
    setRunning(true);
  }

  function resetTimer() {
    setRunning(false);
    setRemaining(total);
  }

  const minutes = String(Math.floor(remaining / 60000)).padStart(2, '0');
  const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
  const milliseconds = String(remaining % 1000).padStart(3, '0');
  const finished = remaining === 0 && total > 0;
  const status = running ? 'En marcha' : finished ? 'Tiempo terminado' : remaining < total ? 'En pausa' : 'Listo para empezar';

  return (
    <main className="page">
      <section className="timer" aria-labelledby="timer-title">
        <span className="eyebrow">ATLAS / PROYECTO DE PRUEBA</span>
        <h1 id="timer-title">Cronómetro</h1>
        <p className="description">Configura tu tiempo y comienza la cuenta atrás.</p>

        <fieldset className="duration-fields" disabled={running}>
          <legend>Duración</legend>
          <label className="duration-field">
            <span>Minutos</span>
            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3} value={duration.minutes} onChange={(event) => changeDuration('minutes', event.target.value, 999)} aria-label="Minutos" />
          </label>
          <label className="duration-field">
            <span>Segundos</span>
            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={2} value={duration.seconds} onChange={(event) => changeDuration('seconds', event.target.value, 59)} aria-label="Segundos" />
          </label>
          <label className="duration-field">
            <span>Milisegundos</span>
            <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={3} value={duration.milliseconds} onChange={(event) => changeDuration('milliseconds', event.target.value, 999)} aria-label="Milisegundos" />
          </label>
        </fieldset>

        <div className={`time-display${finished ? ' time-display-finished' : ''}`} role="timer" aria-label={`${minutes} minutos, ${seconds} segundos y ${milliseconds} milisegundos`}>
          <span className="time-unit">
            <span className="time-digits">{minutes}</span>
            <span className="time-label">MIN</span>
          </span>
          <span className="time-separator" aria-hidden="true">:</span>
          <span className="time-unit">
            <span className="time-digits">{seconds}</span>
            <span className="time-label">SEG</span>
          </span>
          <span className="time-separator" aria-hidden="true">.</span>
          <span className="time-unit">
            <span className="time-digits time-digits-ms">{milliseconds}</span>
            <span className="time-label">MS</span>
          </span>
        </div>

        <p className="timer-status" role="status">{total === 0 ? 'Introduce una duración mayor que cero' : status}</p>
        <div className="timer-actions">
          <button className="action-button action-button-primary" type="button" onClick={toggleTimer} disabled={total === 0}>{running ? 'Pausa' : remaining < total && !finished ? 'Continuar' : 'Start'}</button>
          <button className="action-button" type="button" onClick={resetTimer} disabled={!running && remaining === total}>Reiniciar</button>
        </div>
        <p className="hint">Cambiar la duración reinicia la cuenta. El tiempo no se guarda al recargar.</p>
        <footer className="stack">React <span aria-hidden="true">·</span> Docker <span aria-hidden="true">·</span> Atlas</footer>
      </section>
    </main>
  );
}
