import {
  ComposedChart, Bar, Line, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";

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

  const pctCategorias =
    chartData.length > 0
      ? Math.round((vitalCount / chartData.length) * 100)
      : 0;

  return (
    <div className="card">
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
  );
}
