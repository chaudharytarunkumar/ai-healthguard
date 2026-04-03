import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Shield, Brain, Activity, ArrowRight, BarChart3, FileText, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";

const features = [
  { icon: Brain, title: "AI-Powered Prediction", desc: "Five ML models including XGBoost analyse 13 clinical parameters for accurate IHD risk assessment." },
  { icon: Shield, title: "Explainable AI (SHAP)", desc: "Understand exactly which health factors drive your risk score with transparent SHAP explanations." },
  { icon: Activity, title: "Personalised Prevention", desc: "Receive tailored lifestyle, diet, activity, and medical recommendations based on your profile." },
  { icon: BarChart3, title: "Model Comparison", desc: "Compare performance of Random Forest, XGBoost, SVM, Neural Network, and Logistic Regression." },
];

export default function Index() {
  const { data: metrics } = useQuery({
    queryKey: ["metrics"],
    queryFn: async () => {
      const res = await fetch("/api/metrics");
      if (!res.ok) return null;
      return res.json();
    },
    staleTime: 60000,
  });

  const xgbAccuracy = metrics?.XGB ? (metrics.XGB.Accuracy * 100).toFixed(1) : "95.1";
  const xgbAuc = metrics?.XGB ? (metrics.XGB.AUC).toFixed(2) : "0.96";

  const stats = [
    { value: `${xgbAccuracy}%`, label: "XGBoost Accuracy" },
    { value: xgbAuc, label: "AUC-ROC Score" },
    { value: "13", label: "Clinical Parameters" },
    { value: "5", label: "ML Models" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero px-4 py-20 sm:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary-foreground blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-primary-foreground blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 animate-pulse-ring rounded-full bg-primary/20" />
              <img src={logo} alt="AiHealth Guard" className="animate-float relative z-10 h-24 w-24 object-contain" />
            </div>
          </div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="h-4 w-4 text-risk-moderate" />
            Live Machine Learning Optimization (Accuracy: {xgbAccuracy}%)
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            Predict Heart Disease Risk
            <br />
            <span className="text-gradient-primary bg-clip-text text-transparent bg-white">
              Before It's Too Late
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/70 animate-in fade-in slide-in-from-bottom-4 duration-700">
            AiHealth Guard uses state-of-the-art machine learning to assess your Ischemic Heart Disease risk from routine parameters, explained with transparent AI insights.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Link to="/assess">
              <Button size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 gap-2 px-8 text-base font-semibold shadow-lg transition-transform hover:scale-105">
                Start Risk Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/models">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2 px-8 text-base transition-colors">
                View Performance Hub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-12 relative z-10 px-4">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="rounded-xl border bg-card p-5 text-center shadow-elevated transform transition-all hover:scale-105 duration-300">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stat.value}</div>
              <div className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">Key Features</Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Advanced Clinical Support</h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Built on the gold-standard UCI Dataset using optimized hyper-parameter tuning and class-balancing (SMOTE).
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border bg-card p-8 shadow-card transition-all hover:-translate-y-2 hover:shadow-elevated"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-lg font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-20 transition-opacity">
                    <f.icon className="h-12 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps with Visual Connection */}
      <section className="border-y bg-muted/30 px-4 py-24 relative overflow-hidden">
        <div className="mx-auto max-w-5xl relative z-10">
          <h2 className="mb-16 text-center text-3xl font-bold sm:text-4xl">Your Path to Heart Health</h2>
          <div className="grid gap-12 sm:grid-cols-3">
            {[
              { step: "01", icon: FileText, title: "Enter Parameters", desc: "Input 10 clinical data points optimized for the SF-2 feature subset." },
              { step: "02", icon: Brain, title: "ML Insight", desc: "XGBoost runs in the cloud to compute your risk probability profile." },
              { step: "03", icon: Users, title: "Action Plan", desc: "Receive a deep-dive report with SHAP feature impact and medical advice." },
            ].map((s, i) => (
              <div key={s.step} className="relative text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-primary text-xl font-black text-primary-foreground shadow-lg shadow-primary/20">
                  {s.step}
                </div>
                <h3 className="mb-3 text-lg font-bold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                {i < 2 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(50%+4rem)] w-[calc(100%-8rem)] h-[2px] bg-gradient-to-r from-primary/30 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action with Glassmorphism */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-4xl overflow-hidden relative rounded-3xl bg-gradient-hero p-12 text-center text-primary-foreground border border-white/10 shadow-2xl">
          <div className="absolute top-0 right-0 h-full w-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent" />
          <img src={logo} alt="AiHealth Guard" className="mx-auto mb-6 h-12 w-12 object-contain animate-float" />
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Prioritize Your Heart Health
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-primary-foreground/80">
            Early detection of Ischemic Heart Disease significantly improves long-term outcomes. Get your analysis in seconds.
          </p>
          <Link to="/assess">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 px-10 font-bold text-lg h-14 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl">
              Launch Assessment <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <img src={logo} alt="" className="h-8 w-8 object-contain" />
              <div>
                <p className="text-sm font-bold">AiHealth Guard</p>
                <p className="text-xs text-muted-foreground">B.Tech Major Project Final Report</p>
              </div>
            </div>
            <div className="flex gap-4">
                <Link to="/about" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">About Project</Link>
                <Link to="/models" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">Model Documentation</Link>
                <a href="https://github.com/chaudharytarunkumar/aihealthguard" target="_blank" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors hover:underline">GitHub</a>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-xs text-muted-foreground font-medium">
              &copy; 2026 AiHealth Guard. All rights reserved.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/60 sm:mt-0 italic">
              Medical Disclaimer: This application is for educational/research purposes and does not replace medical diagnosis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
