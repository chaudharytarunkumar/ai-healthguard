import { modelComparison } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

export default function ModelComparison() {
  const radarData = modelComparison.map((m) => ({
    model: m.model.split(" ")[0],
    Accuracy: m.accuracy,
    AUC: m.auc * 100,
    F1: m.f1 * 100,
    Precision: m.precision,
    Recall: m.recall,
  }));

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Model Comparison Dashboard</h1>
          <p className="text-muted-foreground">
            Performance metrics for all five ML classifiers on the UCI Cleveland Heart Disease Dataset
          </p>
        </div>

        {/* Metrics Table */}
        <div className="mb-8 overflow-x-auto rounded-2xl border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold">Model</th>
                <th className="px-4 py-3 text-center font-semibold">Accuracy</th>
                <th className="px-4 py-3 text-center font-semibold">AUC-ROC</th>
                <th className="px-4 py-3 text-center font-semibold">F1-Score</th>
                <th className="px-4 py-3 text-center font-semibold">Precision</th>
                <th className="px-4 py-3 text-center font-semibold">Recall</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {modelComparison.map((m, i) => (
                <tr key={m.model} className={`border-b last:border-0 ${i === 0 ? "bg-accent/50" : ""}`}>
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      {i === 0 && <Trophy className="h-4 w-4 text-risk-moderate" />}
                      {m.model}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-mono">{m.accuracy}%</td>
                  <td className="px-4 py-3 text-center font-mono">{m.auc.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center font-mono">{m.f1.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center font-mono">{m.precision}%</td>
                  <td className="px-4 py-3 text-center font-mono">{m.recall}%</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={m.status === "Primary" ? "default" : "secondary"} className={m.status === "Primary" ? "bg-gradient-primary text-primary-foreground" : ""}>
                      {m.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-semibold">Accuracy Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelComparison} margin={{ bottom: 60 }}>
                <XAxis dataKey="model" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="hsl(210, 80%, 45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-semibold">Multi-Metric Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="model" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis domain={[80, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Accuracy" dataKey="Accuracy" stroke="hsl(210, 80%, 45%)" fill="hsl(210, 80%, 45%)" fillOpacity={0.2} />
                <Radar name="AUC" dataKey="AUC" stroke="hsl(170, 50%, 45%)" fill="hsl(170, 50%, 45%)" fillOpacity={0.2} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROC Curve placeholder */}
        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-card">
          <h3 className="mb-4 font-semibold">ROC Curves (All Models)</h3>
          <div className="flex h-48 items-center justify-center rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground">[ROC Curve Plot — requires backend model data]</p>
          </div>
        </div>
      </div>
    </div>
  );
}
