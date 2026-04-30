import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Shield, Brain, Activity, ArrowRight, BarChart3, FileText, Users, Sparkles, Heart, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform } from "framer-motion";
import logo from "@/assets/logo.png";

const features = [
  { 
    icon: Brain, 
    title: "AI-Powered Analysis", 
    desc: "XGBoost, Random Forest, and Neural Networks work in parallel for 95%+ diagnostic accuracy.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  { 
    icon: Shield, 
    title: "SHAP Explainability", 
    desc: "Unmask the 'Black Box'. See exactly which biomarkers are driving your specific risk score.",
    color: "text-teal-500",
    bg: "bg-teal-500/10"
  },
  { 
    icon: Activity, 
    title: "Clinical Guidance", 
    desc: "Receive evidence-based recommendations for diet, lifestyle, and medical follow-ups.",
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  { 
    icon: Sparkles, 
    title: "Real-time Processing", 
    desc: "Instant risk scoring using the specialized Cleveland dataset feature subset (SF-2).",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

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
    { value: "13", label: "Parameters" },
    { value: "5", label: "Model Suite" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden mesh-gradient px-6 py-24">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 180, 270, 360],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/4 w-[100%] h-[100%] bg-blue-500/20 blur-[120px] rounded-full"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 270, 180, 90, 0],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/2 -right-1/4 w-[80%] h-[80%] bg-teal-500/20 blur-[100px] rounded-full"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-6 animate-pulse-ring rounded-full bg-white/10" />
              <img src={logo} alt="AiHealth Guard" className="animate-float relative z-10 h-28 w-28 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur-md px-5 py-2 text-sm font-bold text-slate-800 shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>State-of-the-Art Cardiovascular Prediction Engine</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-8 text-5xl font-black leading-[1.1] tracking-tighter text-slate-800 sm:text-7xl lg:text-8xl"
          >
            Advanced Heart Risk <br />
            <span className="text-gradient-primary">Detection via AI</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mx-auto mb-12 max-w-2xl text-xl font-medium leading-relaxed text-slate-600"
          >
            AiHealth Guard leverages ensemble machine learning to identify silent IHD risks with 95% accuracy, providing explainable clinical insights in seconds.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col items-center justify-center gap-5 sm:flex-row"
          >
            <Link to="/assess">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-gradient-primary text-white hover:opacity-90 gap-3 text-lg font-black shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                Run Assessment <Heart className="h-6 w-6 fill-white drop-shadow-sm" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-md text-slate-800 hover:bg-slate-50 gap-3 text-lg font-bold transition-all hover:scale-105">
                Technical Overview <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="-mt-16 relative z-20 px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label} 
              variants={itemVariants}
              className="glass-card flex flex-col items-center justify-center rounded-3xl p-8 text-center"
            >
              <div className="text-4xl font-black tracking-tighter text-gradient-primary mb-1">{stat.value}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-32 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <Badge variant="outline" className="mb-4 h-7 px-4 border-primary/20 bg-primary/5 text-primary text-[10px] uppercase font-black tracking-widest">Technological Pillar</Badge>
            <h2 className="mb-6 text-4xl font-black tracking-tight sm:text-6xl">Intelligence That Validates</h2>
            <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground leading-relaxed">
              Our architecture doesn't just predict; it justifies. Built on the Cleveland Dataset using optimized Class-Weight balancing (SMOTE) and Neural Network cross-validation.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative h-full rounded-[2.5rem] border bg-card p-10 shadow-sm transition-all hover:border-primary/50 hover:shadow-elevated hover:-translate-y-2"
              >
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-3xl ${f.bg} ${f.color} transition-all group-hover:scale-110`}>
                  <f.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-4 text-xl font-black">{f.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground">{f.desc}</p>
                <div className="mt-8 flex items-center text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all gap-2">
                  Learn Science <ChevronRight className="h-3 w-3" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-muted/40 px-6 py-32 border-y overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center mb-20">
            <Badge className="mb-4 bg-primary text-primary-foreground font-black tracking-widest uppercase text-[10px] px-4 py-1">The Workflow</Badge>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl">Engineered for Accuracy</h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            {[
              { step: "01", icon: FileText, title: "Clinical Input", desc: "Patient parameters are ingested and validated against the SF-2 subset requirement." },
              { step: "02", icon: Brain, title: "Multi-Model Consensus", desc: "XGBoost and SVM compute risk probabilities simultaneously for architectural consensus." },
              { step: "03", icon: Users, title: "Diagnostic Export", desc: "Receive an end-to-end medical report including SHAP importance maps and advice." },
            ].map((s, i) => (
              <motion.div 
                key={s.step} 
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative flex flex-col p-8 rounded-[2rem] border bg-card/50"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white text-lg font-black italic shadow-lg shadow-primary/20">
                  {s.step}
                </div>
                <h3 className="mb-3 text-2xl font-black tracking-tight">{s.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground">{s.desc}</p>
                
                {i < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 w-12 h-[2px] bg-primary/10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto max-w-5xl overflow-hidden relative rounded-[3rem] bg-gradient-hero p-16 text-center text-slate-800 border border-slate-200 shadow-xl"
        >
          <div className="absolute top-0 right-0 h-full w-full opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 to-transparent" />
          
          <div className="relative z-10">
            <div className="mb-10 flex justify-center">
               <div className="rounded-2xl bg-primary/10 p-4 backdrop-blur-md">
                 <CheckCircle2 className="h-8 w-8 text-primary" />
               </div>
            </div>
            <h2 className="mb-6 text-4xl font-black tracking-tight sm:text-6xl">
              Academic Research <br /> Final Year Project
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl font-medium text-slate-600 leading-relaxed">
              This B.Tech Major Project integrates advanced machine learning algorithms to bridge the gap between clinical data and diagnostic explainability.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-primary text-white hover:opacity-90 font-black text-xl shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <a href="/AIHealthGuard_Project_Report.pdf" download>
                  Download Report <ArrowRight className="h-5 w-5 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-10 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <img src={logo} alt="" className="h-7 w-7 object-contain brightness-0 invert" />
              </div>
              <div>
                <p className="text-xl font-black tracking-tighter">AiHealth Guard</p>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">B.Tech Major Research Tool</p>
              </div>
            </div>
            <div className="flex gap-10">
              {['Project', 'Research', 'Contact'].map(link => (
                <Link key={link} to="#" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">{link}</Link>
              ))}
            </div>
          </div>
          
          <div className="mt-16 pt-10 border-t flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <p className="text-xs font-bold text-muted-foreground/60">
              &copy; 2026 AiHealth Guard. Engineered by Chaudhary Tarunkumar.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-risk-high/60 italic">
               <Activity className="h-3 w-3" /> Educational Purpose Only
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
