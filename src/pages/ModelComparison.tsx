import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Trophy, Loader2, AlertCircle, Cpu, Activity, BarChart3, Binary, ShieldCheck } from "lucide-react";
import { modelComparison as mockData } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function ModelComparison() {
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const res = await fetch("/api/metrics");
      if (!res.ok) throw new Error("Failed to fetch model metrics");
      const data = await res.json();
      if (data.message) throw new Error(data.message);
      return data;
    },
    retry: 1,
  });

  // Transform backend metrics to component format
  const displayData = Array.isArray(metrics) ? metrics.map((val: any) => {
    const nameMap: Record<string, string> = {
      XGB: "⭐ XGBoost (Star Model)",
      RF: "Random Forest",
      SVM: "SVM Matrix",
      NN: "Neural Network",
      LR: "Logistic Regression"
    };
    const modelKey = val.model || "";
    return {
      model: nameMap[modelKey] || modelKey,
      accuracy: (val.accuracy * 100).toFixed(1),
      auc: val.auc.toFixed(3),
      f1: (val.f1_score || 0).toFixed(2),
      precision: (val.precision * 100).toFixed(1),
      recall: (val.recall * 100).toFixed(1),
      status: modelKey === "XGB" ? "⭐ High Performance" : (modelKey === "RF" ? "Backup" : "Evaluated")
    };
  }).sort((a, b) => parseFloat(b.accuracy) - parseFloat(a.accuracy)) : [];

  const radarData = displayData.map((m) => ({
    model: m.model.split(" ")[0],
    Accuracy: parseFloat(m.accuracy),
    AUC: parseFloat(m.auc) * 100,
  }));

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-10">
            <div className="absolute -inset-10 animate-pulse-ring rounded-full bg-primary/20" />
            <Cpu className="h-16 w-16 animate-float text-primary relative z-10" />
        </div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-primary via-primary to-blue-600 bg-clip-text text-transparent mb-4">Polling Inference Engine...</h2>
        <p className="text-muted-foreground max-w-sm font-bold text-sm">Aggregating real-time performance validation metrics from the Python backend.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center bg-background relative overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-destructive/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="glass-card rounded-[2.5rem] p-12 border-destructive/20 border-2 max-w-2xl relative z-10">
            <AlertCircle className="mb-6 h-16 w-16 text-destructive mx-auto" />
            <h2 className="text-3xl font-black text-slate-800 mb-4">Metrics Sync Failed</h2>
            <p className="mb-10 text-muted-foreground font-medium leading-relaxed">
              {error.message}. <br/><span className="text-xs opacity-60 italic">Note: Live metrics require a trained model state in backend/models.</span>
            </p>
            <div className="flex flex-col gap-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Rendering Static Calibration Data</p>
                <div className="opacity-40 grayscale pointer-events-none scale-95 blur-[2px]">
                    <MetricsDashboard data={mockData} radar={mockData.map(m => ({ model: m.model.split(" ")[0], Accuracy: m.accuracy, AUC: m.auc * 100 }))} />
                </div>
            </div>
        </div>
      </div>
    );
  }

  return <MetricsDashboard data={displayData} radar={radarData} />;
}

function MetricsDashboard({ data, radar }: { data: any[], radar: any[] }) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen px-6 py-16 bg-background relative overflow-hidden"
    >
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-primary/5 blur-[140px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] bg-blue-500/5 blur-[140px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="mx-auto max-w-7xl">
        <motion.div variants={itemVariants} className="mb-16 text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-2xl">
              <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-4 text-5xl font-black tracking-tight text-slate-800">Performance Matrix</h1>
          <p className="text-lg font-black uppercase tracking-[0.3em] text-primary">Consensus Engine Validation &bull; SF-2 Matrix</p>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">
             Comparative analysis of ensemble architectures optimized for binary IHD classification using the UCI Cleveland clinical benchmarks.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid gap-10 lg:grid-cols-3 mb-16">
            {/* Table Container */}
            <motion.div variants={itemVariants} className="lg:col-span-2 glass-card rounded-[2.5rem] p-10 shadow-elevated border-b-8 border-primary overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                     <h3 className="font-black text-xl tracking-tighter flex items-center gap-3">
                        <Binary className="h-6 w-6 text-primary" />
                        Model Discrepancy Matrix
                     </h3>
                     <Badge className="bg-slate-100 text-slate-800 h-8 px-4 font-black uppercase text-[10px] tracking-widest rounded-xl">Stratified Cross-Val</Badge>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-slate-50">
                        <th className="pb-5 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Architecture</th>
                        <th className="pb-5 text-center font-black uppercase text-[10px] tracking-widest text-muted-foreground">Acc %</th>
                        <th className="pb-5 text-center font-black uppercase text-[10px] tracking-widest text-muted-foreground">AUC</th>
                        <th className="pb-5 text-center font-black uppercase text-[10px] tracking-widest text-muted-foreground">F1</th>
                        <th className="pb-5 text-right font-black uppercase text-[10px] tracking-widest text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {data.map((m, i) => (
                        <tr key={m.model} className="group transition-colors hover:bg-muted/30">
                          <td className="py-5">
                            <div className="flex items-center gap-3">
                              {i === 0 && <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center"><Trophy className="h-4 w-4 text-amber-600" /></div>}
                              <span className="font-black text-sm tracking-tight text-slate-800">{m.model}</span>
                            </div>
                          </td>
                          <td className="py-5 text-center font-black text-primary text-sm">{m.accuracy}%</td>
                          <td className="py-5 text-center font-bold text-muted-foreground text-xs">{m.auc}</td>
                          <td className="py-5 text-center font-bold text-muted-foreground text-xs">{m.f1}</td>
                          <td className="py-5 text-right">
                            <Badge variant="outline" className={`h-7 px-3 font-black uppercase text-[9px] tracking-tighter rounded-lg border-2 ${m.status.includes("⭐") ? "border-primary/40 bg-primary/5 text-primary shadow-sm" : "border-slate-100"}`}>
                                {m.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </motion.div>

            {/* Side Chart Container */}
            <motion.div variants={itemVariants} className="glass-card rounded-[2.5rem] p-10 shadow-elevated border-l-8 border-primary">
                 <h3 className="mb-10 font-black text-xl tracking-tighter flex items-center gap-3">
                    <Activity className="h-6 w-6 text-primary" />
                    Weight Distribution
                 </h3>
                 <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radar}>
                    <PolarGrid strokeOpacity={0.1} />
                    <PolarAngleAxis dataKey="model" tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                    <PolarRadiusAxis domain={[70, 100]} hide />
                    <Radar 
                        name="Acc" 
                        dataKey="Accuracy" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))" 
                        fillOpacity={0.1} 
                        strokeWidth={3}
                    />
                    <Radar 
                        name="AUC" 
                        dataKey="AUC" 
                        stroke="hsl(var(--secondary))" 
                        fill="hsl(var(--secondary))" 
                        fillOpacity={0.1} 
                        strokeWidth={3}
                    />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-elevated)', padding: '15px'}} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="mt-8 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary"><div className="h-2 w-4 rounded-full bg-primary" /> Accuracy</div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-secondary"><div className="h-2 w-4 rounded-full bg-secondary" /> AUC-ROC</div>
                </div>
            </motion.div>
        </div>

        {/* Bottom Bar Chart Container */}
        <motion.div variants={itemVariants} className="glass-card rounded-[3rem] p-12 shadow-elevated mb-16">
            <h3 className="mb-12 font-black text-2xl tracking-tight flex items-center gap-4">
                <div className="h-1 w-12 bg-primary rounded-full transition-all group-hover:w-16" />
                Comparative Accuracy Analytics
            </h3>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={data} margin={{ bottom: 40 }}>
                <XAxis dataKey="model" tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis domain={[70, 100]} hide />
                <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.02)'}}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: 'var(--shadow-elevated)', padding: '16px' }}
                />
                <Bar dataKey="accuracy" radius={[12, 12, 4, 4]} barSize={60}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.model.includes('⭐') ? 'hsl(var(--primary))' : 'hsl(var(--primary)/0.2)'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
        </motion.div>

        {/* Technical Specification Footer */}
        <motion.div variants={itemVariants} className="grid gap-8 sm:grid-cols-3">
              {[
                { label: "Valid Training Set", val: "297 Samples", sub: "CSV Post-Processing", icon: ShieldCheck },
                { label: "Predictor Subset", val: "SF-2 Matrix", sub: "10 Optimized Features", icon: Binary },
                { label: "Evaluation", val: "Stratified k-Fold", sub: "25% Hidden Holdout", icon: Cpu },
              ].map(spec => (
                <div key={spec.label} className="glass-card rounded-[2rem] p-8 shadow-md border-2 border-transparent hover:border-primary/10 transition-all flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center mb-5 shadow-lg">
                        <spec.icon className="h-6 w-6" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{spec.label}</p>
                    <p className="text-xl font-black text-slate-800">{spec.val}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary mt-2 opacity-60">{spec.sub}</p>
                </div>
              ))}
        </motion.div>

        <footer className="mt-20 text-center text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/30">
            Realtime Consensus Validation Engine v2.0.3
        </footer>
      </div>
    </motion.div>
  );
}
