import { useState } from "react";

export function WelcomeScreen({ onStart, onBack }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  };

  return (
    <div className="welcome">
      <div className="welcome-card">
        <span className="kicker">Novo Projeto</span>
        <h1>Diagrama de Pareto</h1>
        <p className="welcome-sub">
          Informe o nome da empresa para iniciar a análise.
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
          <button type="button" className="btn-back-link" onClick={onBack}>
            ← Voltar para meus projetos
          </button>
        </form>
      </div>
    </div>
  );
}
