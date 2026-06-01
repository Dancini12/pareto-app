import { useState, useMemo } from "react";
import { PRESETS } from "./data/presets";
import { DataTable } from "./components/DataTable";
import { ParetoChart } from "./components/ParetoChart";
import "./styles/App.css";

export default function App() {
  const [rows, setRows] = useState(PRESETS.reclamacoes.dados);
  const [threshold, setThreshold] = useState(80);

  const { chartData, vitalCount, vitalShare } = useMemo(() => {
    const limpos = rows
      .filter((r) => r.categoria.trim() !== "" && Number(r.valor) > 0)
      .map((r) => ({ categoria: r.categoria, valor: Number(r.valor) }))
      .sort((a, b) => b.valor - a.valor);

    const total = limpos.reduce((s, r) => s + r.valor, 0) || 1;

    let acumulado = 0;
    let vitalCount = 0;
    let atingiu = false;
    const chartData = limpos.map((r) => {
      acumulado += r.valor;
      const acumuladoPct = (acumulado / total) * 100;
      const vital = !atingiu;
      if (!atingiu) {
        vitalCount += 1;
        if (acumuladoPct >= threshold) atingiu = true;
      }
      return {
        categoria: r.categoria,
        valor: r.valor,
        acumuladoPct: Number(acumuladoPct.toFixed(1)),
        vital,
      };
    });

    const somaVital = chartData
      .slice(0, vitalCount)
      .reduce((s, r) => s + r.valor, 0);
    const vitalShare = (somaVital / total) * 100;

    return { chartData, vitalCount, vitalShare };
  }, [rows, threshold]);

  return (
    <div className="wrap">
      <div className="head">
        <div className="kicker">Ferramenta de Qualidade · 80/20</div>
        <h1>Diagrama de Pareto</h1>
        <p className="sub">
          Digite as categorias e suas frequências. O app ordena, calcula a
          porcentagem acumulada e destaca as <b>poucas vitais</b> — as poucas
          causas responsáveis pela maior parte do problema.
        </p>
      </div>

      <div className="grid">
        <DataTable
          rows={rows}
          setRows={setRows}
          threshold={threshold}
          setThreshold={setThreshold}
        />
        <ParetoChart
          chartData={chartData}
          threshold={threshold}
          vitalCount={vitalCount}
          vitalShare={vitalShare}
        />
      </div>
    </div>
  );
}
