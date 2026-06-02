import {
  ComposedChart, Bar, Line, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";
import { fmt } from "../utils/format";

export function ParetoChart({ chartData, threshold, vitalCount, vitalShare, companyName, submitted }) {
  if (!submitted) {
    return (
      <div className="card chart-placeholder">
        <div className="placeholder-inner">
          <div className="placeholder-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="20" width="8" height="24" rx="2" fill="#1a2d5a" opacity=".9"/>
              <rect x="16" y="12" width="8" height="32" rx="2" fill="#1a2d5a" opacity=".6"/>
              <rect x="28" y="28" width="8" height="16" rx="2" fill="#b8cce0"/>
              <rect x="40" y="34" width="8" height="10" rx="2" fill="#b8cce0"/>
              <path d="M8 32 L20 20 L32 30 L44 14" stroke="#c8a030" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p>
            Preencha os dados ao lado e clique em{" "}
            <strong>Gerar Diagrama</strong> para visualizar os resultados.
          </p>
          <span className="placeholder-hint">
            Você precisa de ao menos 2 categorias com valores preenchidos.
          </span>
        </div>
      </div>
    );
  }

  const total = chartData.reduce((s, r) => s + r.valor, 0);
  const vitais = chartData.slice(0, vitalCount);
  const triviais = chartData.slice(vitalCount);
  const pctCategorias = chartData.length > 0
    ? Math.round((vitalCount / chartData.length) * 100)
    : 0;

  return (
    <div className="chart-area">
      <div className="card" id="chart-card">
        {companyName && (
          <div className="company-tag">{companyName}</div>
        )}

        <div className="insight">
          {chartData.length > 0 ? (
            <>
              <b>{vitalCount}</b> de {chartData.length} categorias
              {" "}(apenas <b>{pctCategorias}%</b> delas) concentram{" "}
              <b>{Math.round(vitalShare)}%</b> do total — são as{" "}
              <b>poucas vitais</b>. Concentre esforços aí primeiro.
            </>
          ) : (
            <>Adicione categorias com valores para gerar o diagrama.</>
          )}
        </div>

        <div style={{ width: "100%", height: 380 }}>
          <ResponsiveContainer>
            <ComposedChart
              data={chartData}
              margin={{ top: 16, right: 16, left: 0, bottom: 56 }}
            >
              <CartesianGrid stroke="#dce6f4" vertical={false} />
              <XAxis
                dataKey="categoria"
                angle={-32}
                textAnchor="end"
                interval={0}
                height={70}
                tick={{ fontSize: 11, fill: "#6b80a8" }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: "#6b80a8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                unit="%"
                tick={{ fontSize: 11, fill: "#6b80a8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#00000008" }} />
              <ReferenceLine
                yAxisId="right"
                y={threshold}
                stroke="#c8a030"
                strokeDasharray="5 4"
                label={{
                  value: `${threshold}%`,
                  position: "right",
                  fill: "#c8a030",
                  fontSize: 11,
                }}
              />
              <Bar yAxisId="left" dataKey="valor" radius={[4, 4, 0, 0]} maxBarSize={56}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.vital ? "#1a2d5a" : "#b8cce0"} />
                ))}
              </Bar>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="acumuladoPct"
                stroke="#c8a030"
                strokeWidth={2.4}
                dot={{ r: 3, fill: "#c8a030" }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="legend">
          <span><i className="dot" style={{ background: "#1a2d5a" }} /> Poucas vitais</span>
          <span><i className="dot" style={{ background: "#b8cce0" }} /> Muitas triviais</span>
          <span>
            <i className="dot" style={{ background: "#c8a030", borderRadius: "999px" }} />
            {" "}% acumulada
          </span>
        </div>
      </div>

      {/* Análise textual */}
      {chartData.length > 0 && (
        <div className="card analysis-card" id="analysis-card">
          <h2 className="analysis-title">Análise e Recomendações</h2>

          <p className="analysis-intro">
            A análise do Diagrama de Pareto
            {companyName ? <> para <strong>{companyName}</strong></> : ""} indica que{" "}
            <strong>{vitalCount}</strong>{" "}
            {vitalCount === 1 ? "categoria concentra" : "categorias concentram"}{" "}
            <strong>{Math.round(vitalShare)}%</strong> do total de ocorrências.
            Essas são as <strong>poucas vitais</strong> e devem receber{" "}
            <strong>atenção prioritária</strong> nos planos de melhoria.
          </p>

          <div className="analysis-section">
            <div className="analysis-section-header vital">
              Categorias prioritárias — poucas vitais
            </div>
            <div className="analysis-items">
              {vitais.map((d, i) => {
                const pct = total > 0 ? Math.round((d.valor / total) * 100) : 0;
                return (
                  <div key={i} className="analysis-item vital-item">
                    <div className="analysis-item-rank">{i + 1}º</div>
                    <div className="analysis-item-info">
                      <strong>{d.categoria}</strong>
                      <span>{fmt(d.valor)} ocorrências · {pct}% do total · {d.acumuladoPct}% acumulado</span>
                    </div>
                    <div
                      className="analysis-item-bar"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {triviais.length > 0 && (
            <div className="analysis-section">
              <div className="analysis-section-header trivial">
                Categorias secundárias — muitas triviais
              </div>
              <div className="analysis-items">
                {triviais.map((d, i) => {
                  const pct = total > 0 ? Math.round((d.valor / total) * 100) : 0;
                  return (
                    <div key={i} className="analysis-item trivial-item">
                      <div className="analysis-item-rank trivial-rank">{vitalCount + i + 1}º</div>
                      <div className="analysis-item-info">
                        <strong>{d.categoria}</strong>
                        <span>{fmt(d.valor)} ocorrências · {pct}% do total</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="analysis-recommendation">
            <strong>Recomendação:</strong> Concentre os esforços de melhoria nas{" "}
            <strong>{vitalCount}</strong>{" "}
            {vitalCount === 1 ? "categoria destacada" : "categorias destacadas"} acima.
            Resolver apenas essas causas pode eliminar aproximadamente{" "}
            <strong>{Math.round(vitalShare)}%</strong> dos problemas totais,
            com muito mais eficiência do que tentar resolver todos ao mesmo tempo.
          </div>

          <button className="btn-pdf no-print" onClick={() => window.print()}>
            Gerar PDF
          </button>
        </div>
      )}
    </div>
  );
}
