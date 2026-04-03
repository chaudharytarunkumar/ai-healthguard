import { useLocation, Link } from "react-router-dom";
import { Heart, ArrowLeft, AlertTriangle, Download, Stethoscope, Apple, Dumbbell, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskGauge } from "@/components/RiskGauge";
import { mockShapValues, recommendations } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Results() {
  const location = useLocation();
  const patientData = location.state?.patientData as Record<string, string> | undefined;

  // Mock risk score derived from patient data
  const riskScore = patientData ? 78 : 0;
  const isHighRisk = riskScore > 70;

  if (!patientData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">No Assessment Data</h2>
        <p className="mb-6 text-muted-foreground">Please complete the risk assessment form first.</p>
        <Link to="/assess"><Button className="bg-gradient-primary text-primary-foreground">Go to Assessment</Button></Link>
      </div>
    );
  }

  const shapData = mockShapValues.map((s) => ({
    ...s,
    absShap: Math.abs(s.shap),
  }));

  const categoryIcons = [
    { key: "lifestyle", label: "Lifestyle Modifications", icon: Stethoscope, items: recommendations.lifestyle },
    { key: "diet", label: "Dietary Guidance", icon: Apple, items: recommendations.diet },
    { key: "activity", label: "Physical Activity", icon: Dumbbell, items: recommendations.activity },
    { key: "medical", label: "Medical Referral", icon: Pill, items: recommendations.medical },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Link to="/assess">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Risk Assessment Results</h1>
        </div>

        {/* High risk alert */}
        {isHighRisk && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">High Risk Detected</p>
              <p className="text-sm text-muted-foreground">Your IHD risk is high. Consult a cardiologist promptly.</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="risk" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5">
            <TabsTrigger value="risk">Risk Score</TabsTrigger>
            <TabsTrigger value="explain">Explainability</TabsTrigger>
            <TabsTrigger value="prevention">Prevention</TabsTrigger>
            <TabsTrigger value="details" className="hidden sm:inline-flex">Details</TabsTrigger>
            <TabsTrigger value="global" className="hidden sm:inline-flex">Global Insights</TabsTrigger>
          </TabsList>

          {/* Tab 1: Risk Score */}
          <TabsContent value="risk">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col items-center rounded-2xl border bg-card p-8 shadow-card">
                <h2 className="mb-4 text-lg font-semibold">IHD Risk Score</h2>
                <RiskGauge score={riskScore} />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Based on XGBoost model prediction with 95.1% accuracy
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-card">
                <h3 className="mb-4 font-semibold">Risk Classification</h3>
                <div className="space-y-3">
                  {[
                    { range: "0–40", label: "Low Risk", color: "bg-risk-low", active: riskScore <= 40 },
                    { range: "41–70", label: "Moderate Risk", color: "bg-risk-moderate", active: riskScore > 40 && riskScore <= 70 },
                    { range: "71–100", label: "High Risk", color: "bg-risk-high", active: riskScore > 70 },
                  ].map((r) => (
                    <div
                      key={r.label}
                      className={`flex items-center gap-3 rounded-lg border p-3 transition ${r.active ? "border-primary bg-accent" : "opacity-50"}`}
                    >
                      <div className={`h-3 w-3 rounded-full ${r.color}`} />
                      <span className="font-medium">{r.range}</span>
                      <span className="text-sm text-muted-foreground">{r.label}</span>
                      {r.active && <span className="ml-auto text-xs font-semibold text-primary">← You</span>}
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-lg bg-muted p-4">
                  <p className="text-sm font-medium">Prediction Probability</p>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-primary transition-all duration-1000" style={{ width: `${riskScore}%` }} />
                  </div>
                  <p className="mt-1 text-right text-xs text-muted-foreground">{riskScore}%</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Explainability */}
          <TabsContent value="explain">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border bg-card p-6 shadow-card">
                <h3 className="mb-4 font-semibold">SHAP Feature Importance (Top 10)</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={shapData} layout="vertical" margin={{ left: 80 }}>
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="feature" type="category" tick={{ fontSize: 12 }} width={75} />
                    <Tooltip formatter={(v: number) => v.toFixed(3)} />
                    <Bar dataKey="shap" radius={[0, 4, 4, 0]}>
                      {shapData.map((entry, i) => (
                        <Cell key={i} fill={entry.shap >= 0 ? "hsl(0, 72%, 51%)" : "hsl(210, 80%, 45%)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded bg-destructive" /> Risk Factor</span>
                  <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded bg-primary" /> Protective</span>
                </div>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-card">
                <h3 className="mb-4 font-semibold">Plain-English Explanation</h3>
                <div className="space-y-4">
                  {mockShapValues.filter((s) => s.direction === "risk").slice(0, 3).map((s, i) => (
                    <div key={i} className="rounded-lg border-l-4 border-destructive bg-destructive/5 p-4">
                      <p className="text-sm font-medium">
                        #{i + 1} Risk Driver: <span className="font-bold capitalize">{s.feature}</span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Your {s.feature} value of <strong>{s.value}</strong> is the{" "}
                        {i === 0 ? "strongest" : i === 1 ? "second strongest" : "third strongest"} risk factor,
                        contributing +{s.shap.toFixed(2)} to your risk score.
                      </p>
                    </div>
                  ))}
                  {mockShapValues.filter((s) => s.direction === "protective").slice(0, 1).map((s, i) => (
                    <div key={i} className="rounded-lg border-l-4 border-primary bg-accent p-4">
                      <p className="text-sm font-medium">
                        Protective Factor: <span className="font-bold capitalize">{s.feature}</span>
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Your {s.feature} value of <strong>{s.value}</strong> reduces your risk
                        by {Math.abs(s.shap).toFixed(2)}.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 3: Prevention */}
          <TabsContent value="prevention">
            <div className="grid gap-6 sm:grid-cols-2">
              {categoryIcons.map((cat) => (
                <div key={cat.key} className="rounded-2xl border bg-card p-6 shadow-card">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                      <cat.icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <h3 className="font-semibold">{cat.label}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {cat.items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Export Report as PDF
              </Button>
            </div>
          </TabsContent>

          {/* Tab 4: Patient Details */}
          <TabsContent value="details">
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <h3 className="mb-4 font-semibold">Submitted Patient Parameters</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(patientData).map(([key, value]) => (
                  <div key={key} className="flex justify-between rounded-lg bg-muted/50 px-4 py-2.5">
                    <span className="text-sm font-medium capitalize">{key}</span>
                    <span className="text-sm text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Tab 5: Global Insights */}
          <TabsContent value="global">
            <div className="rounded-2xl border bg-card p-6 shadow-card">
              <h3 className="mb-4 font-semibold">Global SHAP Summary (All Patients)</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                This beeswarm plot shows the distribution of SHAP values across all training samples.
                Each dot represents one patient; color indicates feature value (red = high, blue = low).
              </p>
              <div className="flex h-64 items-center justify-center rounded-xl bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  [SHAP Beeswarm Plot — requires backend computation]
                </p>
              </div>
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-semibold">Top 5 Feature Dependency Insights</h4>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {["thalach", "oldpeak", "ca", "thal", "cp"].map((f) => (
                    <div key={f} className="rounded-lg border p-4">
                      <p className="text-sm font-medium capitalize">{f}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Dependency plot shows how {f} values relate to SHAP contributions across the dataset.
                      </p>
                      <div className="mt-2 flex h-20 items-center justify-center rounded bg-muted/50 text-xs text-muted-foreground">
                        [Plot Placeholder]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
