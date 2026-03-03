import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", normal: 1200, malicious: 45 },
  { time: "04:00", normal: 800, malicious: 23 },
  { time: "08:00", normal: 2100, malicious: 89 },
  { time: "12:00", normal: 2800, malicious: 156 },
  { time: "16:00", normal: 3200, malicious: 234 },
  { time: "20:00", normal: 2400, malicious: 98 },
  { time: "24:00", normal: 1800, malicious: 67 },
];

export function TrafficChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 gradient-border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Traffic Over Time</h3>
        <p className="text-sm text-muted-foreground">24-hour traffic analysis</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 17%)" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(215 20% 55%)" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(215 20% 55%)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 47% 8%)",
                border: "1px solid hsl(217 33% 17%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
              }}
              labelStyle={{ color: "hsl(210 40% 98%)" }}
            />
            <Line
              type="monotone"
              dataKey="normal"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
              dot={false}
              name="Normal Traffic"
            />
            <Line
              type="monotone"
              dataKey="malicious"
              stroke="hsl(0 72% 51%)"
              strokeWidth={2}
              dot={false}
              name="Malicious Traffic"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive" />
          <span className="text-sm text-muted-foreground">Malicious</span>
        </div>
      </div>
    </div>
  );
}
