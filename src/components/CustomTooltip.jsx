import { fmt } from "../utils/format";

export function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="tip">
      <strong>{d.categoria}</strong>
      <span>Frequência: {fmt(d.valor)}</span>
      <span>% acumulada: {d.acumuladoPct}%</span>
    </div>
  );
}
