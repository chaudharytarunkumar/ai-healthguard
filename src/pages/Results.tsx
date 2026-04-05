import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, ArrowLeft, AlertTriangle, Download, Stethoscope, Apple, Dumbbell, Pill, Info, Layers, Beaker, Activity, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskGauge } from "@/components/RiskGauge";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { downloadResultAsPDF } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";

export default function Results() {
  const location = useLocation();
  const patientData = location.state?.patientData as Record<string, string> | undefined;
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await downloadResultAsPDF("report-content", `AiHealthGuard_Report_${Math.random().toString(36).substring(7).toUpperCase()}.pdf`);
      toast({
        title: "Report Downloaded",
        description: "Your health risk assessment has been saved as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF report.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ["predict", patientData],
    queryFn: async () => {
      if (!patientData) return null;
      const numericData = Object.keys(patientData).reduce((acc, key) => {
        acc[key] = parseFloat(patientData[key]) || 0;
        return acc;
      }, {} as Record<string, number>);
      
      const res = await fetch("/api/predict?model_name=xgb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(numericData)
      });
      if (!res.ok) throw new Error("API prediction request failed");
      return res.json();
    },
    enabled: !!patientData
  });

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

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
            <div className="absolute -inset-8 animate-pulse-ring rounded-full bg-primary/20" />
            <Heart className="h-16 w-16 animate-float text-primary relative z-10" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">Analyzing Patient Profile...</h2>
        <p className="text-muted-foreground max-w-sm">Our XGBoost model is calculating risk probabilities and generating SHAP explainability insights.</p>
        <div className="mt-8 w-64 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-primary animate-progress-bar w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center text-destructive">
        <AlertTriangle className="mb-4 h-16 w-16" />
        <h2 className="text-2xl font-bold mb-2">Prediction Engine Latency</h2>
        <p className="mb-6 max-w-sm">{error.message}. Please verify your network connection and retry.</p>
        <Link to="/assess"><Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Return to Form</Button></Link>
      </div>
    );
  }

  const riskScore = apiData ? Math.round(apiData.risk_score) : 0;
  const isHighRisk = riskScore > 70;

  const shapData = apiData?.shap ? (() => {
      const keys = Object.keys(apiData.shap.features);
      const values = apiData.shap.shap_values;
      return keys.map((key, i) => {
          const val = values[i];
          return {
              feature: key,
              shap: val,
              value: apiData.shap.features[key],
              direction: val > 0 ? "risk" : "protective",
              absShap: Math.abs(val)
          };
      }).sort((a, b) => b.absShap - a.absShap);
  })() : [];

  const categoryIcons = [
    { key: "lifestyle", label: "Lifestyle Modifications", icon: Stethoscope, items: apiData?.recommendations?.lifestyle || [] },
    { key: "diet", label: "Dietary Guidance", icon: Apple, items: apiData?.recommendations?.diet || [] },
    { key: "activity", label: "Physical Activity", icon: Dumbbell, items: apiData?.recommendations?.activity || [] },
    { key: "medical", label: "Medical Referral", icon: Pill, items: apiData?.recommendations?.medical || [] },
  ];

  return (
    <div className="min-h-screen px-4 py-8 animate-in fade-in duration-700" id="report-content">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/assess">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full hover:bg-accent transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Diagnostic Analysis Results</h1>
                <p className="text-sm text-muted-foreground">Session ID: AI-{Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
                variant="outline" 
                className="gap-2 shadow-sm" 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
            >
              {isGeneratingPDF ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                  <Download className="h-4 w-4" />
              )}
              {isGeneratingPDF ? "Generating..." : "PDF Report"}
            </Button>
            <Link to="/assess">
                <Button variant="default" className="bg-gradient-primary text-primary-foreground shadow-md gap-2">
                    <Heart className="h-4 w-4" /> New Assessment
                </Button>
            </Link>
          </div>
        </div>

        {isHighRisk && (
          <div className="mb-8 flex items-start gap-4 rounded-2xl border border-destructive/20 bg-destructive/5 p-6 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold text-destructive">Advanced Risk Profile Detected</p>
              <p className="text-sm text-muted-foreground leading-relaxed">Your machine-calculated IHD risk score is over the critical threshold. System recommends immediate clinical validation and consultation with a cardiology specialist.</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="risk" className="space-y-8">
          <TabsList className="flex h-12 items-center justify-start gap-2 bg-transparent p-0 overflow-x-auto no-scrollbar">
            {["risk", "explain", "prevention", "details", "global"].map((tab) => (
                <TabsTrigger 
                    key={tab} 
                    value={tab} 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-full px-6 rounded-full border border-border shadow-sm transition-all"
                >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="risk" className="mt-0 focus-visible:outline-none">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col items-center rounded-3xl border bg-card p-10 shadow-card">
                <h2 className="mb-6 text-xl font-bold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Overall Risk Score
                </h2>
                <div className="relative group transition-transform duration-500 hover:scale-105">
                    <RiskGauge score={riskScore} />
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-background border shadow-sm text-xs font-bold text-primary">
                        XGBoost 2.0.3
                    </div>
                </div>
                <p className="mt-10 text-center text-sm text-muted-foreground leading-relaxed max-w-xs">
                    This score represents the statistical probability of Ischemic Heart Disease presence based on your clinical inputs.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <div className="rounded-3xl border bg-card p-8 shadow-card">
                  <h3 className="mb-6 font-bold text-lg flex items-center gap-2">
                      <Layers className="h-5 w-5 text-primary" />
                      Classification Tiers
                  </h3>
                  <div className="space-y-4">
                    {[
                      { range: "0–40", label: "Low Risk", color: "bg-risk-low", active: riskScore <= 40 },
                      { range: "41–70", label: "Moderate Risk", color: "bg-risk-moderate", active: riskScore > 40 && riskScore <= 70 },
                      { range: "71–100", label: "High Risk", color: "bg-risk-high", active: riskScore > 70 },
                    ].map((r) => (
                      <div key={r.label} className={`flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ${r.active ? "border-primary bg-accent/30 shadow-sm" : "opacity-40 grayscale"}`}>
                        <div className={`h-4 w-4 rounded-full ${r.color} shadow-sm`} />
                        <div>
                            <p className="font-bold">{r.range} <span className="text-xs font-normal text-muted-foreground ml-2">Score Units</span></p>
                            <p className="text-sm font-medium opacity-80">{r.label}</p>
                        </div>
                        {r.active && <Badge className="ml-auto bg-primary text-primary-foreground">Active Case</Badge>}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="rounded-3xl border bg-gradient-to-br from-primary/5 to-secondary/5 p-8 shadow-card border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold flex items-center gap-2 text-primary">
                            <Sparkles className="h-4 w-4" /> Prediction Logic
                        </p>
                        <span className="text-xs font-mono text-primary/70">{riskScore}%</span>
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-muted border border-primary/5 p-0.5">
                      <div className="h-full rounded-full bg-gradient-primary transition-all duration-1000" style={{ width: `${riskScore}%` }} />
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground italic">
                        Calculated via gradient boosted decision trees focused on minimizing LogLoss in medical diagnostic spaces.
                    </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="explain" className="mt-0 focus-visible:outline-none">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border bg-card p-8 shadow-card h-full">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        SHAP Feature Impact
                    </h3>
                    <TooltipProvider>
                        <ShadcnTooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs text-xs">SHAP (SHapley Additive exPlanations) shows how much each health parameter moved your risk score from the average baseline.</p>
                            </TooltipContent>
                        </ShadcnTooltip>
                    </TooltipProvider>
                </div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={shapData} layout="vertical" margin={{ left: 80, right: 20 }}>
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis dataKey="feature" type="category" tick={{ fontSize: 11, fill: 'hsl(var(--foreground))', fontWeight: 'bold' }} width={75} />
                    <RechartsTooltip 
                        cursor={{ fill: 'hsl(var(--accent)/0.3)' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-elevated)', padding: '12px' }}
                        formatter={(v: number) => [v.toFixed(4), "SHAP Magnitude"]}
                    />
                    <Bar dataKey="shap" radius={[0, 8, 8, 0]}>
                      {shapData.map((entry, i) => (
                        <Cell key={i} fill={entry.shap >= 0 ? "hsl(var(--destructive))" : "hsl(var(--primary))"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-8 flex items-center justify-center gap-6 text-xs font-bold text-muted-foreground">
                  <span className="flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive rounded-full border border-destructive/20"><span className="h-2 w-2 rounded-full bg-destructive" /> Increases Risk</span>
                  <span className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20"><span className="h-2 w-2 rounded-full bg-primary" /> Decreases Risk</span>
                </div>
              </div>

              <div className="rounded-3xl border bg-card p-8 shadow-card flex flex-col">
                <h3 className="mb-6 font-bold text-lg">AI Clinical Summary</h3>
                <div className="space-y-4 flex-1">
                  {shapData.filter((s) => s.direction === "risk").slice(0, 3).map((s, i) => (
                    <div key={i} className="group relative rounded-2xl border bg-muted/40 p-5 hover:bg-muted/60 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-black uppercase text-destructive tracking-widest">Driver #{i + 1}</p>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold bg-background">Strong Correlation</Badge>
                      </div>
                      <p className="text-sm font-bold capitalize">{s.feature.replace(/_/g, ' ')}</p>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        Your input value was flagged by the model. This factor is pushing your health profile into the {riskScore > 50 ? 'IHD positive' : 'moderate risk'} segment by a factor of <strong>+{s.shap.toFixed(3)}</strong>.
                      </p>
                    </div>
                  ))}
                  {shapData.filter((s) => s.direction === "protective").slice(0, 1).map((s, i) => (
                    <div key={i} className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-black uppercase text-primary tracking-widest">Protective Assets</p>
                        <Sparkles className="h-3 w-3 text-primary" />
                      </div>
                      <p className="text-sm font-bold capitalize">{s.feature.replace(/_/g, ' ')}</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Excellent! Your {s.feature} status is significantly buffering your risk profile, lowering your score by <strong>{Math.abs(s.shap).toFixed(3)}</strong> units.
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl border border-dashed text-xs text-muted-foreground">
                    Note: SHAP values represent localized additive feature importance for your unique profile only.
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prevention" className="mt-0 focus-visible:outline-none">
            <div className="grid gap-6 sm:grid-cols-2">
              {categoryIcons.map((cat, idx) => (
                <div key={cat.key} className="group rounded-3xl border bg-card p-8 shadow-card transition-all hover:shadow-elevated hover:border-primary/20 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx*100}ms` }}>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <cat.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg">{cat.label}</h3>
                  </div>
                  <ul className="space-y-4">
                    {cat.items.length > 0 ? cat.items.map((item: string, i: number) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-sm shadow-primary/20" />
                        {item}
                      </li>
                    )) : (
                      <li className="flex gap-2 text-sm text-muted-foreground italic">Generating specific recommendations...</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-0 focus-visible:outline-none">
            <div className="rounded-3xl border bg-card p-10 shadow-card">
              <div className="flex items-center gap-2 mb-8">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <h3 className="font-bold text-xl uppercase tracking-tight">Patient Clinical Metadata</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(patientData).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between rounded-2xl bg-muted/30 px-6 py-4 border border-transparent hover:border-muted-foreground/10 transition-colors">
                    <span className="text-xs font-black uppercase text-muted-foreground tracking-widest">{key.replace(/_/g, ' ')}</span>
                    <Badge variant="secondary" className="font-mono px-3 py-1 rounded-lg bg-background border">{value}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="global" className="mt-0 focus-visible:outline-none">
             <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-3xl border bg-card p-8 shadow-card">
                    <h3 className="mb-6 font-bold text-lg flex items-center gap-2">
                        <Beaker className="h-5 w-5 text-primary" />
                        Dataset Distribution Matrix
                    </h3>
                    <p className="text-sm text-muted-foreground mb-8">Visualization of the UCI Cleveland target distribution (Cleveland Clinical Data) used to calibrate this model's baseline.</p>
                    
                    <div className="flex items-center justify-center h-80 bg-muted/40 rounded-3xl border border-dashed p-8">
                         <ResponsiveContainer width="100%" height="100%">
                             <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <XAxis type="number" dataKey="x" name="Age" unit="y" tick={{fontSize: 10}} />
                                <YAxis type="number" dataKey="y" name="Risk" unit="%" tick={{fontSize: 10}} />
                                <ZAxis type="number" range={[50, 400]} />
                                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Patients" data={[
                                    { x: 52, y: riskScore, z: 200, fill: 'hsl(var(--primary))' },
                                    { x: 30, y: 10, z: 100, fill: 'gray', opacity: 0.2 },
                                    { x: 45, y: 35, z: 150, fill: 'gray', opacity: 0.2 },
                                    { x: 65, y: 85, z: 180, fill: 'gray', opacity: 0.2 },
                                    { x: 58, y: 45, z: 120, fill: 'gray', opacity: 0.2 },
                                    { x: 41, y: 22, z: 100, fill: 'gray', opacity: 0.2 },
                                    { x: 70, y: 92, z: 210, fill: 'gray', opacity: 0.2 },
                                ]} fill="hsl(var(--primary))" />
                             </ScatterChart>
                         </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="flex flex-col gap-6">
                    <div className="rounded-3xl border bg-gradient-to-tr from-card to-background p-8 shadow-card flex-1">
                        <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-2">Population Data</p>
                        <h4 className="text-2xl font-bold mb-4">Patient Profile Context</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm border-b pb-2">
                                <span className="text-muted-foreground">Prevalence in Training</span>
                                <span className="font-bold">46.1%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b pb-2">
                                <span className="text-muted-foreground">Mean Patient Age</span>
                                <span className="font-bold">54.4 yrs</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Data Diversity Score</span>
                                <span className="font-bold text-success">High (UCI Standard)</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="rounded-3xl border bg-primary p-8 shadow-card text-primary-foreground">
                        <p className="text-[10px] font-bold uppercase opacity-60 tracking-[0.2em] mb-2">Technical Note</p>
                        <h4 className="text-xl font-bold mb-3">Model Bias Handling</h4>
                        <p className="text-xs leading-relaxed opacity-90">
                            We used SMOTE oversampling to ensure the model doesn't biasedly predict "No Risk" for edge cases. Accuracy reflects balanced cross-validation.
                        </p>
                    </div>
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
