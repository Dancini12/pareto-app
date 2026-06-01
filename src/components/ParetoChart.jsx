import {
  ComposedChart, Bar, Line, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";
import { CustomTooltip } from "./CustomTooltip";

export function ParetoChart({ chartData, threshold, vitalCount, vitalShare }) {
  const pctCategorias =
    chartData.length > 0
      ? Math.round((vitalCount / chartData.length) * 100)
      : 0;

  return (
    <div className="card">
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
            <CartesianGrid stroke="#ece5d7" vertical={false} />
            <XAxis
              dataKey="categoria"
              angle={-32}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fontSize: 11, fill: "#7c7464" }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 11, fill: "#7c7464" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              unit="%"
              tick={{ fontSize: 11, fill: "#7c7464" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#00000008" }} />
            <ReferenceLine
              yAxisId="right"
              y={threshold}
              stroke="#c4521e"
              strokeDasharray="5 4"
              label={{
                value: `${threshold}%`,
                position: "right",
                fill: "#c4521e",
                fontSize: 11,
              }}
            />
            <Bar yAxisId="left" dataKey="valor" radius={[4, 4, 0, 0]} maxBarSize={56}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.vital ? "#c4521e" : "#d8cdb8"} />
              ))}
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="acumuladoPct"
              stroke="#1c3a4a"
              strokeWidth={2.4}
              dot={{ r: 3, fill: "#1c3a4a" }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="legend">
        <span><i className="dot" style={{ background: "#c4521e" }} /> Poucas vitais</span>
        <span><i className="dot" style={{ background: "#d8cdb8" }} /> Muitas triviais</span>
        <span>
          <i className="dot" style={{ background: "#1c3a4a", borderRadius: "999px" }} />
          {" "}% acumulada
        </span>
      </div>
    </div>
  );
}
