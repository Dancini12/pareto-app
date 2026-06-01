import { useState } from "react";
import { PRESETS } from "../data/presets";

export function WelcomeScreen({ onStart }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  };

  return (
    <div className="welcome">
      <div className="welcome-card">
        <span className="kicker">Ferramenta de Qualidade · 80/20</span>
        <h1>Diagrama de Pareto</h1>
        <p className="welcome-sub">
          Identifique as <strong>poucas causas</strong> responsáveis pela maior
          parte de um problema e concentre esforços onde realmente importa.
        </p>

        <form onSubmit={handleSubmit} className="welcome-form">
          <label className="field-label" htmlFor="empresa-welcome">
            Nome da empresa
          </label>
          <input
            id="empresa-welcome"
            className="welcome-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Empresa XYZ"
            autoFocus
          />
          <button type="submit" className="btn-gerar" disabled={!name.trim()}>
            Começar análise
          </button>
        </form>

        <hr className="welcome-divider" />
        <p className="welcome-examples">ou explore um exemplo pronto:</p>
        <div className="welcome-chips">
          {Object.entries(PRESETS).map(([k, p]) => (
            <button
              key={k}
              className="chip"
              type="button"
              onClick={() => onStart(p.nome, p.dados)}
            >
              {p.nome}
            </button>
          ))}
        </div>

        <p className="author">por Marcel Dancini</p>
      </div>
    </div>
  );
}
