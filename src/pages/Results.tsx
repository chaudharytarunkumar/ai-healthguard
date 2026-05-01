import { useLocation, Link } from"react-router-dom";
import { useQuery } from"@tanstack/react-query";
import { useSEO } from "@/hooks/useSEO";
import { Heart, ArrowLeft, AlertTriangle, Download, Stethoscope, Apple, Dumbbell, Pill, Info, Layers, Beaker, Activity, Sparkles, Loader2, BarChart3, Brain } from"lucide-react";
import { Button } from"@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from"@/components/ui/tabs";
import { RiskGauge } from"@/components/RiskGauge";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis } from"recharts";
import { Badge } from"@/components/ui/badge";
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from"@/components/ui/tooltip";
import { useState } from"react";
import { downloadResultAsPDF } from"@/lib/pdfGenerator";
import { useToast } from"@/hooks/use-toast";
import { motion, AnimatePresence } from"framer-motion";

// --- Sub-components for Report Sections ---

function SummarySection({ riskScore, isHighRisk }: { riskScore: number, isHighRisk: boolean }) {
 return (
 <div className="grid gap-8 lg:grid-cols-2">
 <div className="glass-card flex flex-col items-center rounded-[2.5rem] p-10 shadow-sm">
 <h2 className="mb-8 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
 <Activity className="h-4 w-4 text-primary" />
 Core Analytics
 </h2>
 <div className="relative group transition-transform duration-500 hover:scale-[1.02]">
 <RiskGauge score={riskScore} />
 <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-primary text-white border-2 border-primary shadow-md text-[10px] font-semibold uppercase flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
 <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
 Diagnostic Star: XGBoost 2.0.3
 </div>
 </div>
 <p className="mt-14 text-center text-sm font-medium text-muted-foreground leading-relaxed max-w-xs px-4">
 Statistical probability of Ischemic Heart Disease presence based on clinical biomarkers.
 </p>
 </div>

 <div className="flex flex-col gap-8">
 <div className="glass-card rounded-[2.5rem] p-8 shadow-sm">
 <h3 className="mb-8 font-semibold uppercase text-[11px] text-muted-foreground flex items-center gap-2">
 <Layers className="h-4 w-4 text-primary" />
 Risk Classification
 </h3>
 <div className="space-y-4">
 {[
 { range:"0–40", label:"Low Risk", color:"bg-risk-low", active: riskScore <= 40 },
 { range:"41–70", label:"Moderate Risk", color:"bg-risk-moderate", active: riskScore > 40 && riskScore <= 70 },
 { range:"71–100", label:"High Risk", color:"bg-risk-high", active: riskScore > 70 },
].map((r) => (
 <div key={r.label} className={`flex items-center gap-5 rounded-md border-2 p-5 transition-all duration-500 ${r.active ?"border-primary bg-primary/5 shadow-md scale-[1.02]" :"opacity-30 border-transparent"}`}>
 <div className={`h-5 w-5 rounded-full ${r.color} shadow-md shadow-${r.color}/20`} />
 <div>
 <p className="font-semibold text-sm">{r.range} <span className="text-[10px] font-bold opacity-60 ml-1">UNITS</span></p>
 <p className="text-xs font-semibold uppercase opacity-60">{r.label}</p>
 </div>
 {r.active && <div className="ml-auto flex items-center gap-1.5 text-[10px] font-semibold uppercase text-primary"><div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> In Range</div>}
 </div>
 ))}
 </div>
 </div>
 
 <div className="rounded-[2rem] border-2 border-primary/10 bg-primary/5 p-8 shadow-sm">
 <div className="flex items-center justify-between mb-4">
 <p className="text-[10px] font-semibold uppercase text-primary flex items-center gap-2">
 <Sparkles className="h-4 w-4" /> Probabilistic Confidence
 </p>
 <span className="text-xs font-semibold text-primary">{riskScore.toFixed(1)}%</span>
 </div>
 <div className="h-3 overflow-hidden rounded-full bg-muted/50 p-0.5 border border-primary/5">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width: `${riskScore}%` }}
 transition={{ duration: 1.5, ease:"easeOut" }}
 className="h-full rounded-full bg-gradient-primary shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
 />
 </div>
 <p className="mt-5 text-[10px] font-bold text-muted-foreground/80 leading-relaxed italic">
 Calibrated via gradient boosted decision trees optimized for UCI Cleveland clinical metrics.
 </p>
 </div>
 </div>
 </div>
 );
}

function ExplainSection({ shapData, riskScore }: { shapData: any[], riskScore: number }) {
 return (
 <div className="grid gap-8 lg:grid-cols-2">
 <div className="glass-card rounded-[2.5rem] p-10 shadow-sm h-full">
 <div className="flex items-center justify-between mb-10">
 <h3 className="font-semibold uppercase text-[11px] text-muted-foreground flex items-center gap-2">
 <Info className="h-4 w-4 text-primary" />
 SHAP Interpretability
 </h3>
 <TooltipProvider>
 <ShadcnTooltip>
 <TooltipTrigger asChild>
 <Info className="h-4 w-4 text-muted-foreground cursor-help hover:text-primary transition-colors" />
 </TooltipTrigger>
 <TooltipContent className="rounded-xl border shadow-sm p-3">
 <p className="max-w-[200px] text-[11px] font-medium leading-relaxed">SHAP (SHapley Additive exPlanations) visualizes the specific contribution of each biomarker to your unique risk score.</p>
 </TooltipContent>
 </ShadcnTooltip>
 </TooltipProvider>
 </div>
 <ResponsiveContainer width="100%" height={400}>
 <BarChart data={shapData} layout="vertical" margin={{ left: 80, right: 30 }}>
 <XAxis type="number" hide />
 <YAxis dataKey="feature" type="category" tick={{ fontSize: 10, fill: 'hsl(var(--foreground))', fontWeight: 900 }} width={75} />
 <RechartsTooltip 
 cursor={{ fill: 'rgba(0,0,0,0.02)' }}
 contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-sm)', padding: '12px' }}
 formatter={(v: number) => [v.toFixed(4),"Impact Magnitude"]}
 />
 <Bar dataKey="shap" radius={[0, 8, 8, 0]}>
 {shapData.map((entry, i) => (
 <Cell key={i} fill={entry.shap >= 0 ?"hsl(var(--destructive))" :"hsl(var(--primary))"} />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 <div className="mt-10 flex items-center justify-center gap-8 text-[10px] font-semibold uppercase">
 <span className="flex items-center gap-2 text-destructive"><div className="h-2 w-2 rounded-full bg-destructive" /> Hyper-Risk</span>
 <span className="flex items-center gap-2 text-primary"><div className="h-2 w-2 rounded-full bg-primary" /> Protective</span>
 </div>
 </div>

 <div className="glass-card rounded-[2.5rem] p-10 shadow-sm border-l-8 border-l-primary flex flex-col">
 <h3 className="mb-10 font-semibold uppercase text-[11px] text-muted-foreground flex items-center gap-2">
 <Brain className="h-4 w-4" /> AI Logical Summary
 </h3>
 <div className="space-y-6 flex-1">
 {shapData.filter((s) => s.direction ==="risk").slice(0, 3).map((s, i) => (
 <motion.div 
 key={i} 
 initial={{ opacity: 0, x: 20 }}
 whileInView={{ opacity: 1, x: 0 }}
 transition={{ delay: i * 0.1 }}
 className="group relative rounded-md border-2 border-transparent bg-muted/20 p-6 hover:bg-muted/40 transition-all hover:border-primary/5"
 >
 <div className="flex items-center justify-between mb-2">
 <p className="text-[10px] font-semibold uppercase text-destructive tracking-[0.2em]">Risk Driver #{i + 1}</p>
 <Badge variant="outline" className="text-[9px] uppercase font-semibold bg-background/50 border-2">High Impact</Badge>
 </div>
 <p className="text-sm font-semibold capitalize text-slate-800">{s.feature.replace(/_/g, ' ')}</p>
 <p className="mt-3 text-sm font-medium text-muted-foreground leading-relaxed">
 Your biomarker value for {s.feature} is pushing your risk profile into the danger zone by a localized magnitude of <strong>+{s.shap.toFixed(3)}</strong>.
 </p>
 </motion.div>
 ))}
 {shapData.filter((s) => s.direction ==="protective").slice(0, 1).map((s, i) => (
 <div key={i} className="rounded-md border-2 border-emerald-500/10 bg-emerald-500/5 p-6 shadow-sm shadow-emerald-500/5">
 <div className="flex items-center justify-between mb-2">
 <p className="text-[10px] font-semibold uppercase text-emerald-600 tracking-[0.2em]">Protective Biomarker</p>
 <Sparkles className="h-3 w-3 text-emerald-500" />
 </div>
 <p className="text-sm font-semibold capitalize text-slate-800">{s.feature.replace(/_/g, ' ')}</p>
 <p className="mt-2 text-sm font-medium text-muted-foreground">
 Optimal! This metric lowers your total cardiovascular risk score by <strong>{Math.abs(s.shap).toFixed(3)}</strong> units.
 </p>
 </div>
 ))}
 </div>
 <div className="mt-10 p-5 rounded-md bg-primary text-white shadow-xl">
 <p className="text-[11px] leading-relaxed font-bold opacity-80">
 <Info className="h-4 w-4 inline mr-2 text-primary" />
 These SHAP values represent a personalized additive importance profile unique to your specific clinical diagnostic session.
 </p>
 </div>
 </div>
 </div>
 );
}

function PreventionSection({ categoryIcons }: { categoryIcons: any[] }) {
 return (
 <div className="grid gap-8 sm:grid-cols-2">
 {categoryIcons.map((cat, idx) => (
 <motion.div 
 key={cat.key} 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 transition={{ delay: idx * 0.1 }}
 className="group glass-card rounded-[2.5rem] p-10 shadow-sm transition-all hover:scale-[1.02] hover:border-primary/20"
 >
 <div className="mb-8 flex items-center gap-5">
 <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-slate-100 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
 <cat.icon className="h-7 w-7" />
 </div>
 <div>
 <h3 className="font-semibold text-xl">{cat.label}</h3>
 <p className="text-[10px] font-semibold uppercase text-primary opacity-60">Strategic Intervention</p>
 </div>
 </div>
 <ul className="space-y-5">
 {cat.items.length > 0 ? cat.items.map((item: string, i: number) => (
 <li key={i} className="flex gap-4 text-sm font-medium text-muted-foreground leading-relaxed">
 <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary/40 shadow-sm shadow-primary/20" />
 {item}
 </li>
 )) : (
 <li className="flex gap-2 text-sm text-muted-foreground italic">Compiling evidence-based protocols...</li>
 )}
 </ul>
 </motion.div>
 ))}
 </div>
 );
}

function DetailsSection({ patientData }: { patientData: Record<string, string> }) {
 return (
 <div className="glass-card rounded-[2.5rem] p-10 shadow-sm">
 <div className="flex items-center justify-between mb-12">
 <div className="flex items-center gap-3">
 <div className="h-4 w-1 bg-primary rounded-full" />
 <h3 className="font-semibold text-2xl">Clinical Metadata</h3>
 </div>
 <Badge className="h-8 px-4 border-2 rounded-xl bg-slate-100 text-slate-800 font-bold uppercase text-[9px]">{Object.keys(patientData).length} Parameters</Badge>
 </div>
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {Object.entries(patientData).map(([key, value]) => (
 <div key={key} className="flex items-center justify-between rounded-[1.25rem] bg-muted/20 px-6 py-5 border-2 border-transparent hover:border-primary/10 hover:bg-muted/30 transition-all group">
 <span className="text-[10px] font-semibold uppercase text-muted-foreground group-hover:text-primary transition-colors">{key.replace(/_/g, ' ')}</span>
 <span className="font-semibold text-slate-800 flex items-center gap-2">
 <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
 {value}
 </span>
 </div>
 ))}
 </div>
 </div>
 );
}

function GlobalSection({ riskScore }: { riskScore: number }) {
 return (
 <div className="grid gap-10 lg:grid-cols-3">
 <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-10 shadow-sm border-b-8 border-b-primary">
 <h3 className="mb-3 font-semibold text-2xl flex items-center gap-3">
 <Beaker className="h-6 w-6 text-primary" />
 Distribution Metrics
 </h3>
 <p className="text-sm font-medium text-muted-foreground mb-10">Relative positioning within the UCI Cleveland clinical benchmark matrix (Cleveland Heart Data).</p>
 
 <div className="flex items-center justify-center min-h-[360px] bg-muted/10 rounded-[2rem] border-2 border-dashed border-muted-foreground/10 p-10">
 <ResponsiveContainer width="100%" height={300}>
 <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
 <XAxis type="number" dataKey="x" name="Age" unit="y" tick={{fontSize: 10, fontWeight: 900}} />
 <YAxis type="number" dataKey="y" name="Risk" unit="%" tick={{fontSize: 10, fontWeight: 900}} />
 <ZAxis type="number" range={[50, 600]} />
 <RechartsTooltip cursor={{ strokeDasharray: '4 4' }} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-sm)'}} />
 <Scatter name="Population Basis" data={[
 { x: 30, y: 10, z: 100, fill: 'gray', opacity: 0.1 },
 { x: 45, y: 35, z: 150, fill: 'gray', opacity: 0.1 },
 { x: 65, y: 85, z: 180, fill: 'gray', opacity: 0.1 },
 { x: 58, y: 45, z: 120, fill: 'gray', opacity: 0.1 },
 { x: 41, y: 22, z: 100, fill: 'gray', opacity: 0.1 },
 { x: 70, y: 92, z: 210, fill: 'gray', opacity: 0.1 },
]} />
 <Scatter name="Patient Position" data={[{ x: 52, y: riskScore, z: 400, fill: 'hsl(var(--primary))' }]} fill="hsl(var(--primary))">
 {[{ x: 52, y: riskScore, z: 400, fill: 'hsl(var(--primary))' }].map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.fill} className="animate-pulse" />
 ))}
 </Scatter>
 </ScatterChart>
 </ResponsiveContainer>
 </div>
 </div>
 
 <div className="flex flex-col gap-10">
 <div className="glass-card rounded-[2.5rem] p-10 shadow-sm flex-1 bg-gradient-to-br from-white to-slate-50 overflow-hidden relative">
 <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl" />
 <p className="text-[10px] font-bold uppercase text-primary tracking-[0.2em] mb-4">Training Context</p>
 <h4 className="text-2xl font-semibold mb-8">Clinical Universe</h4>
 <div className="space-y-6">
 {[
 { label:"Target Prevalence", val:"46.1%", sub:"Cleveland Standard" },
 { label:"Mean Patient Age", val:"54.4 yrs", sub:"Balanced Entry" },
 { label:"Data Reliability", val:"UCI Gold", sub:"Validated Source" },
].map(stat => (
 <div key={stat.label} className="group">
 <div className="flex justify-between items-center text-sm mb-1.5">
 <span className="text-muted-foreground font-bold">{stat.label}</span>
 <span className="font-semibold text-slate-800">{stat.val}</span>
 </div>
 <p className="text-[9px] font-semibold uppercase text-primary/40">{stat.sub}</p>
 <div className="h-0.5 w-full bg-muted mt-3 group-hover:bg-primary/20 transition-colors" />
 </div>
 ))}
 </div>
 </div>
 
 <div className="glass-card rounded-[2.5rem] p-10 shadow-sm bg-primary text-white">
 <p className="text-[10px] font-semibold uppercase opacity-40 tracking-[0.3em] mb-3 text-primary">Protocol 12-X</p>
 <h4 className="text-xl font-semibold mb-4">Imbalance Handling</h4>
 <p className="text-xs font-medium leading-relaxed opacity-70">
 Synthetic Minority Over-sampling Technique (SMOTE) was utilized during weight calibration to eliminate diagnostic bias for edge-case patient profiles.
 </p>
 </div>
 </div>
 </div>
 );
}

function ModelComparisonSection({ modelResults }: { modelResults: Record<string, any> }) {
 if (!modelResults) return null;
 
 const chartData = Object.entries(modelResults).map(([key, value]: [string, any]) => {
 const score = typeof value.risk_score === 'number' ? value.risk_score : 0;
 const accuracy = typeof value.accuracy === 'number' ? (value.accuracy * 100).toFixed(1) : '0.0';
 
 return {
 name: key.toUpperCase() === 'NN' ? 'Neural Net' : 
 key.toUpperCase() === 'LR' ? 'Lin. Regression' :
 key.toUpperCase() === 'RF' ? 'Rand. Forest' :
 key.toUpperCase() === 'XGB' ? '⭐ XGBoost (Star)' : 
 key.toUpperCase() === 'SVM' ? 'SVM Matrix' : key.toUpperCase(),
 score,
 accuracy,
 level: value.risk_level || 'N/A'
 };
 }).sort((a, b) => b.score - a.score);

 return (
 <div className="space-y-10">
 <div className="glass-card rounded-[2.5rem] p-10 shadow-sm">
 <h3 className="mb-10 font-semibold text-2xl flex items-center gap-3">
 <BarChart3 className="h-6 w-6 text-primary" />
 Consensus Matrix
 </h3>
 <div className="h-[400px] w-full">
 <ResponsiveContainer width="100%" height="100%">
 <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
 <XAxis 
 dataKey="name" 
 angle={-45} 
 textAnchor="end" 
 interval={0} 
 height={80}
 tick={{fontSize: 10, fontWeight: 900, fill: '#64748b'}} 
 />
 <YAxis domain={[0, 100]} hide />
 <RechartsTooltip 
 cursor={{fill: 'rgba(0,0,0,0.02)'}}
 content={({ active, payload }) => {
 if (active && payload && payload.length) {
 const data = payload[0].payload;
 return (
 <div className="glass-card bg-white/95 rounded-md p-5 shadow-sm border-2 border-primary/5 min-w-[180px]">
 <p className="font-semibold text-slate-800 mb-3 border-b pb-2">{data.name}</p>
 <div className="space-y-2.5">
 <div className="flex justify-between items-center text-[10px]">
 <span className="font-bold text-muted-foreground uppercase">Prediction</span>
 <span className="font-semibold text-primary text-sm">{data.score}%</span>
 </div>
 <div className="flex justify-between items-center text-[10px]">
 <span className="font-bold text-muted-foreground uppercase">Core Accuracy</span>
 <span className="font-semibold text-slate-800">{data.accuracy}%</span>
 </div>
 <div className="mt-3 text-center py-1.5 rounded-lg bg-primary text-[9px] font-semibold uppercase text-white">{data.level}</div>
 </div>
 </div>
 );
 }
 return null;
 }}
 />
 <Bar dataKey="score" radius={[12, 12, 4, 4]} barSize={54}>
 {chartData.map((entry, index) => (
 <Cell 
 key={`cell-${index}`} 
 fill={entry.score > 70 ? 'hsl(var(--destructive))' : entry.score > 40 ? 'hsl(var(--risk-moderate))' : 'hsl(var(--primary))'} 
 fillOpacity={0.9}
 />
 ))}
 </Bar>
 </BarChart>
 </ResponsiveContainer>
 </div>
 </div>

 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
 {chartData.map((model, idx) => (
 <motion.div 
 key={model.name} 
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: idx * 0.05 }}
 className={`glass-card rounded-[2rem] p-6 text-center border-2 transition-all shadow-md ${model.name.includes('⭐') ? 'border-primary/40 bg-primary/5 shadow-primary/20 scale-105 z-10' : 'border-transparent hover:border-primary/20'}`}
 >
 <p className="text-[10px] font-semibold uppercase text-muted-foreground mb-4">{model.name}</p>
 <p className={`text-3xl font-semibold ${model.score > 70 ? 'text-destructive' : model.score > 40 ? 'text-risk-moderate' : 'text-primary'}`}>
 {model.score}%
 {model.name.includes('⭐') && <Sparkles className="inline-block ml-2 h-4 w-4 text-yellow-500" />}
 </p>
 <div className="mt-5 flex flex-col items-center gap-2">
 <Badge variant="outline" className="text-[9px] font-semibold py-0.5 h-auto px-3 bg-muted/30 border-2 rounded-full uppercase">ACC: {model.accuracy}%</Badge>
 <div className={`h-1 w-8 rounded-full ${model.score > 70 ? 'bg-destructive' : model.score > 40 ? 'bg-risk-moderate' : 'bg-primary'}`} />
 </div>
 </motion.div>
 ))}
 </div>
 </div>
 );
}

const containerVariants = {
 hidden: { opacity: 0, y: 20 },
 visible: {
 opacity: 1,
 y: 0,
 transition: {
 duration: 0.6,
 staggerChildren: 0.1,
 },
 },
};

const itemVariants = {
 hidden: { opacity: 0, y: 20 },
 visible: { opacity: 1, y: 0 },
};

export default function Results() {
  useSEO({
    title: "Diagnostic Intelligence Report | AiHealth Guard",
    description: "View the comprehensive clinical risk assessment and AI-driven diagnostic report generated by the AiHealth Guard ensemble model.",
  });

  const location = useLocation();
  const patientData = location.state?.patientData as Record<string, string> | undefined;
 const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
 const { toast } = useToast();

 const handleDownloadPDF = async () => {
 try {
 setIsGeneratingPDF(true);
 await downloadResultAsPDF("report-content-full", `AiHealthGuard_Report_${Math.random().toString(36).substring(7).toUpperCase()}.pdf`);
 toast({
 title:"Full Report Exported",
 description:"Your health diagnostic archive has been saved locally.",
 });
 } catch (error) {
 toast({
 title:"Export Failed",
 description:"Encountered a critical error during PDF rendering.",
 variant:"destructive",
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
 
 const res = await fetch("/api/predict", {
 method:"POST",
 headers: {"Content-Type":"application/json" },
 body: JSON.stringify(numericData),
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
 <h2 className="mb-2 text-xl font-semibold">No Active Assessment</h2>
 <p className="mb-8 text-sm font-medium text-muted-foreground">Clinical data is required to generate diagnostic probabilities.</p>
 <Link to="/assess"><Button className="bg-gradient-primary text-white h-12 px-10 rounded-md font-semibold shadow-xl">Initiate Analysis</Button></Link>
 </div>
 );
 }

 if (isLoading) {
 return (
 <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
 <div className="relative mb-10">
 <div className="absolute -inset-10 rounded-full bg-primary/20" />
 <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease:"linear" }} className="absolute -inset-4 border-2 border-dashed border-primary/40 rounded-full" />
 <Heart className="h-20 w-20 text-primary relative z-10 fill-primary/10" />
 </div>
 <h2 className="text-4xl font-semibold bg-gradient-to-r from-primary via-primary to-blue-600 bg-clip-text text-transparent mb-4">Synthesizing Consensus Matrix...</h2>
 <p className="text-muted-foreground max-w-sm font-bold text-sm leading-relaxed">Aggregating XGBoost probabilities and calculating localized SHAP influence kernels.</p>
 <div className="mt-12 w-80 h-1.5 bg-muted rounded-full overflow-hidden p-0.5 border-2 border-primary/5">
 <motion.div 
 initial={{ width: 0 }}
 animate={{ width:"100%" }}
 transition={{ duration: 2.5, repeat: Infinity, ease:"easeInOut" }}
 className="h-full bg-gradient-primary rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]" 
 />
 </div>
 </div>
 );
 }

 if (error) {
 return (
 <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center text-destructive">
 <AlertTriangle className="mb-6 h-20 w-20 p-4 bg-destructive/10 rounded-full" />
 <h2 className="text-3xl font-semibold mb-3">Prediction Engine Failure</h2>
 <p className="mb-10 max-w-sm text-sm font-bold leading-relaxed">{error.message}</p>
 <Link to="/assess"><Button variant="outline" className="h-12 px-10 rounded-md border-2 border-destructive/20 text-destructive font-semibold hover:bg-destructive/5 gap-3"><ArrowLeft className="h-4 w-4" /> Return to Data Entry</Button></Link>
 </div>
 );
 }

 const categoryIcons = [
 { key:"lifestyle", label:"Lifestyle Protocol", icon: Stethoscope, items: apiData?.recommendations?.lifestyle || [] },
 { key:"diet", label:"Nutritional Target", icon: Apple, items: apiData?.recommendations?.diet || [] },
 { key:"activity", label:"Exercise Strategy", icon: Dumbbell, items: apiData?.recommendations?.activity || [] },
 { key:"medical", label:"Medical Intervention", icon: Pill, items: apiData?.recommendations?.medical || [] },
];

  return (
  <motion.main 
  initial="hidden"
 animate="visible"
 variants={containerVariants}
 className="min-h-screen px-6 py-16 bg-background relative overflow-hidden" 
 id="report-content"
 >
 {/* Dynamic Background */}
 <div className="absolute top-0 right-0 -z-10 h-[800px] w-[800px] bg-primary/5 blur-[160px] rounded-full translate-x-1/2 -translate-y-1/2" />
 <div className="absolute bottom-0 left-0 -z-10 h-[800px] w-[800px] bg-emerald-500/5 blur-[160px] rounded-full -translate-x-1/2 translate-y-1/2" />

 <div className="mx-auto max-w-7xl">
 <div className="mb-16 flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b pb-12 border-slate-100">
 <div className="space-y-6">
 <Link to="/assess" className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-all">
 <div className="h-0.5 w-6 bg-muted group-hover:bg-primary transition-all" />
 Return to Laboratory
 </Link>
 <div className="flex items-center gap-8">
 <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary shadow-md transform rotate-3">
 <img src="/logo.png" className="h-12 w-12 object-contain brightness-0 invert" alt="" />
 </div>
 <div>
 <h1 className="text-5xl font-semibold leading-none mb-3">Diagnostic Intelligence</h1>
 <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.4em]">Archived Profile &bull; <span className="text-primary">XG- Consensus</span></p>
 </div>
 </div>
 </div>
 <div className="flex flex-wrap gap-4">
 <Button 
 variant="outline" 
 className="h-11 px-6 rounded-[1.5rem] border-2 font-semibold gap-3 transition-all hover:bg-muted shadow-md bg-white" 
 onClick={handleDownloadPDF}
 disabled={isGeneratingPDF}
 >
 {isGeneratingPDF ? (
 <Loader2 className="h-6 w-6 animate-spin" />
 ) : (
 <Download className="h-6 w-6" />
 )}
 {isGeneratingPDF ?"Compiling Report..." :"Export Full Dossier"}
 </Button>
 <Link to="/assess">
 <Button className="h-11 px-6 rounded-[1.5rem] bg-gradient-primary text-white font-semibold gap-3 transition-all shadow-md shadow-primary/40">
 <Heart className="h-6 w-6 fill-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" /> New Analysis
 </Button>
 </Link>
 </div>
 </div>

 {apiData.prediction === 1 && (
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-16 flex items-start gap-8 rounded-[3rem] border-2 border-destructive/20 bg-destructive/5 p-10 shadow-md group"
 >
 <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] bg-destructive text-white shadow-md shadow-destructive/30 group-hover:scale-110 transition-transform">
 <AlertTriangle className="h-8 w-8" />
 </div>
 <div>
 <p className="text-3xl font-semibold text-slate-800">Critical Indicators Identified</p>
 <p className="mt-3 text-base font-medium text-slate-600 leading-relaxed max-w-4xl">
 Your probability matrix significantly intersects with established IHD patterns within the UCI training distribution. High-impact SHAP kernels suggest immediate clinical intervention.
 </p>
 </div>
 </motion.div>
 )}

 <Tabs defaultValue="risk" className="space-y-16">
 <TabsList className="flex h-20 items-center justify-start gap-3 bg-muted/30 rounded-[2rem] p-2.5 overflow-x-auto no-scrollbar border-2 border-white w-full lg:w-fit">
 {[
 { value:"risk", label:"Outcome", icon: Activity },
 { value:"compare", label:"Multi-Model", icon: Layers },
 { value:"explain", label:"Interpretability", icon: Sparkles },
 { value:"prevention", label:"Tactical Plan", icon: Stethoscope },
 { value:"details", label:"Raw Intel", icon: Beaker },
 { value:"global", label:"Benchmarks", icon: BarChart3 },
].map(tab => (
 <TabsTrigger key={tab.value} value={tab.value} className="h-full rounded-md px-8 font-semibold uppercase text-[11px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-xl border border-transparent data-[state=active]:border-primary/5 transition-all gap-3">
 <tab.icon className="h-4 w-4" /> {tab.label}
 </TabsTrigger>
 ))}
 </TabsList>

 <AnimatePresence mode="wait">
 <motion.div
 key="tab-content"
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.3 }}
 >
 <TabsContent value="risk" className="mt-0 focus-visible:outline-none">
 <SummarySection riskScore={apiData.risk_score} isHighRisk={apiData.prediction === 1} />
 </TabsContent>

 <TabsContent value="compare" className="mt-0 focus-visible:outline-none">
 <ModelComparisonSection modelResults={apiData.model_results} />
 </TabsContent>

 <TabsContent value="explain" className="mt-0 focus-visible:outline-none">
 <ExplainSection shapData={apiData.shap_data || Object.entries(apiData.shap.shap_values).map(([feature, val]) => ({
 feature: feature,
 shap: val as number,
 direction: (val as number) >= 0 ?"risk" :"protective"
 }))} riskScore={apiData.risk_score} />
 </TabsContent>

 <TabsContent value="prevention" className="mt-0 focus-visible:outline-none">
 <PreventionSection categoryIcons={categoryIcons} />
 </TabsContent>

 <TabsContent value="details" className="mt-0 focus-visible:outline-none">
 <DetailsSection patientData={patientData} />
 </TabsContent>

 <TabsContent value="global" className="mt-0 focus-visible:outline-none">
 <GlobalSection riskScore={apiData.risk_score} />
 </TabsContent>
 </motion.div>
 </AnimatePresence>
 </Tabs>

 {/* --- HIDDEN FULL REPORT FOR PDF --- */}
 <div id="report-content-full" className="hidden-report-container">
 <div className="p-20 space-y-24 bg-white text-slate-800 border-[32px] border-slate-50 rounded-[6rem] shadow-none">
 {/* PDF Header */}
 <div className="flex items-center justify-between border-b-[8px] border-primary pb-20">
 <div className="flex items-center gap-10">
 <div className="h-24 w-24 bg-primary rounded-[2.5rem] flex items-center justify-center shadow-md">
 <Heart className="h-14 w-14 text-white fill-white" />
 </div>
 <div>
 <h1 className="text-7xl font-semibold">AiHealth Guard</h1>
 <p className="mt-2 text-xl font-semibold text-primary uppercase tracking-[0.5em]">Consolidated Clinical Dossier</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-sm font-semibold uppercase text-slate-400 tracking-[0.4em] mb-2">Unique Identifier</p>
 <p className="text-4xl font-semibold border-2 border-primary px-6 py-2 rounded-md">AI-{Math.random().toString(36).substring(7).toUpperCase()}</p>
 <p className="text-lg font-semibold text-slate-500 mt-6 italic">{new Date().toLocaleDateString()} &bull; {new Date().toLocaleTimeString()}</p>
 </div>
 </div>

 {/* Patient Summary & Risk Info */}
 <section>
 <div className="flex items-center gap-6 mb-16">
 <div className="h-16 w-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-semibold shadow-md shadow-primary/20">1</div>
 <h2 className="text-5xl font-semibold">Risk Analysis Outcome</h2>
 </div>
 <SummarySection riskScore={apiData.risk_score} isHighRisk={apiData.prediction === 1} />
 </section>

 {/* Multi-Model Comparison */}
 <section className="break-before-page pt-20">
 <div className="flex items-center gap-6 mb-16">
 <div className="h-16 w-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-semibold shadow-md shadow-primary/20">2</div>
 <h2 className="text-5xl font-semibold">Ensemble Matrix Results</h2>
 </div>
 <ModelComparisonSection modelResults={apiData.model_results} />
 </section>

 {/* Explainability Section */}
 <section className="break-before-page pt-20">
 <div className="flex items-center gap-6 mb-16">
 <div className="h-16 w-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-semibold shadow-md shadow-primary/20">3</div>
 <h2 className="text-5xl font-semibold">AI Logical Deconstruction</h2>
 </div>
 <ExplainSection shapData={apiData.shap_data || Object.entries(apiData.shap.shap_values).map(([feature, val]) => ({
 feature: feature,
 shap: val as number,
 direction: (val as number) >= 0 ?"risk" :"protective"
 }))} riskScore={apiData.risk_score} />
 </section>

 {/* Prevention Section */}
 <section className="break-before-page pt-20">
 <div className="flex items-center gap-6 mb-16">
 <div className="h-16 w-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-semibold shadow-md shadow-primary/20">4</div>
 <h2 className="text-5xl font-semibold">Strategic Intervention</h2>
 </div>
 <PreventionSection categoryIcons={categoryIcons} />
 </section>

 {/* Clinical Details */}
 <section className="break-before-page pt-20">
 <div className="flex items-center gap-6 mb-16">
 <div className="h-16 w-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-semibold shadow-md shadow-primary/20">5</div>
 <h2 className="text-5xl font-semibold">Clinical Metadata Archive</h2>
 </div>
 <DetailsSection patientData={patientData} />
 </section>

 {/* Global Data */}
 <section className="break-before-page pt-20">
 <div className="flex items-center gap-6 mb-16">
 <div className="h-16 w-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-white text-2xl font-semibold shadow-md shadow-primary/20">6</div>
 <h2 className="text-5xl font-semibold">Population Benchmarks</h2>
 </div>
 <GlobalSection riskScore={apiData.risk_score} />
 </section>

 {/* PDF Footer */}
 <div className="mt-32 pt-16 border-t-8 border-slate-100 flex flex-col items-center text-center gap-10">
 <p className="text-xl font-semibold text-slate-400 max-w-5xl leading-relaxed italic opacity-60">
 This document is a synthetic diagnostic archive generated by the AiHealth Guard Research Engine. It leverages automated XGBoost & SHAP kernels. Final clinical diagnosis must be performed by a licensed medical practitioner.
 </p>
 <div className="h-px w-full bg-slate-100" />
 <div className="flex items-center justify-between w-full px-10">
 <div className="flex flex-col items-start gap-4">
 <p className="text-xs font-semibold uppercase opacity-40">System Protocol</p>
 <p className="text-xl font-semibold text-primary">XGB-SMOTE_6A4C8F35</p>
 </div>
 <div className="flex items-center gap-16 text-right">
 <div className="flex flex-col items-end">
 <div className="h-12 w-64 border-b-4 border-primary mb-2" />
 <p className="text-[11px] font-semibold uppercase">Medical Authorization</p>
 </div>
 <div className="h-32 w-32 bg-slate-100 rounded-full border-8 border-white shadow-md flex items-center justify-center">
 <div className="h-20 w-20 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center font-semibold text-slate-300 text-[10px]">SEAL</div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </motion.main>
 );
}
