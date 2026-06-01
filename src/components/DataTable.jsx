import { PRESETS } from "../data/presets";

export function DataTable({
  rows, setRows, threshold, setThreshold,
  canSubmit, onSubmit, onReset,
}) {
  const update = (i, campo, v) =>
    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [campo]: v } : r))
    );
  const remove = (i) => setRows((prev) => prev.filter((_, idx) => idx !== i));
  const add = () => setRows((prev) => [...prev, { categoria: "", valor: "" }]);

  return (
    <div className="card">
      <h2>Dados</h2>

      <div className="presets">
        {Object.entries(PRESETS).map(([k, p]) => (
          <button
            key={k}
            className="chip"
            onClick={() => { setRows(p.dados); onReset(); }}
          >
            {p.nome}
          </button>
        ))}
      </div>

      <table>
        <thead>
          <tr>
            <th>Categoria</th>
            <th style={{ textAlign: "right" }}>Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>
                <input
                  value={r.categoria}
                  placeholder="Ex: Atraso na entrega"
                  onChange={(e) => update(i, "categoria", e.target.value)}
                />
              </td>
              <td>
                <input
                  className="val"
                  type="number"
                  value={r.valor}
                  placeholder="0"
                  onChange={(e) => update(i, "valor", e.target.value)}
                />
              </td>
              <td>
                <button className="del" onClick={() => remove(i)} title="Remover linha">
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="table-hint">
        Para remover uma linha, clique no <strong>×</strong> ao lado dela.
      </p>
      <button className="add" onClick={add}>+ adicionar linha</button>

      <div className="thr">
        <span>Linha de corte:</span>
        <input
          type="number"
          min="1"
          max="100"
          value={threshold}
          onChange={(e) =>
            setThreshold(Math.min(100, Math.max(1, Number(e.target.value) || 80)))
          }
        />
        <span>%</span>
      </div>

      <button
        className="btn-gerar"
        onClick={onSubmit}
        disabled={!canSubmit}
        title={!canSubmit ? "Preencha ao menos 2 categorias com valores" : ""}
      >
        Gerar Diagrama
      </button>
    </div>
  );
}
