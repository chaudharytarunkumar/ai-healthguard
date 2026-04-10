import { Users, BookOpen, GraduationCap, Heart, Award, ShieldCheck } from "lucide-react";
import logo from "@/assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";

const team = [
  { name: "Tarun Kumar", role: "Developer" },
  { name: "Sakshi Rajput", role: "Developer" },
  { name: "Prashant Prajapati", role: "Developer" },
];

const papers = [
  "Chang et al. (2022) — AI Model for Heart Disease Detection, Healthcare Analytics",
  "El-Sofany et al. (2024) — Predicting Heart Disease with ML & Explainable AI, Scientific Reports",
  "Alshraideh et al. (2024) — Heart Attack Prediction, Applied Computational Intelligence",
  "Bani Hani & Ahmad (2023) — ML for IHD: Systematic Review, Current Cardiology Reviews",
  "Vu et al. (2025) — ML Model for Predicting CHD, JMIR Cardio",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
};

export default function About() {
  return (
    <div className="min-h-screen px-6 py-16 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-teal-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl"
      >
        <motion.div variants={itemVariants} className="mb-16 text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-slate-900 shadow-2xl transform rotate-3">
            <img src={logo} alt="AiHealth Guard" className="h-14 w-14 object-contain brightness-0 invert" />
          </div>
          <h1 className="mb-4 text-5xl font-black tracking-tight text-slate-900 sm:text-6xl">About AiHealth Guard</h1>
          <p className="text-lg font-black uppercase tracking-[0.3em] text-primary max-w-2xl mx-auto">
            B.Tech Major Project &bull; CSE &bull; 2025–26
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Project Info */}
          <motion.div variants={itemVariants} className="glass-card rounded-[2.5rem] p-10 shadow-elevated border-l-8 border-l-primary flex flex-col h-full">
            <div className="mb-8 flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-black text-xl tracking-tight">Institutional Basis</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Academic Context</p>
              </div>
            </div>
            <dl className="space-y-6 flex-1">
              {[
                ["Institution", "G. L. Bajaj Group of Institutions, Mathura", Award],
                ["Faculty Advisor", "Er. Tanya Shrivastava", Users],
                ["Dataset Matrix", "UCI Cleveland Heart Data", Heart],
                ["Model Engine", "Consensus (XGB/NN/RF)", ShieldCheck],
              ].map(([k, v, Icon]: any) => (
                <div key={k} className="flex gap-4">
                  <div className="mt-1 h-8 w-8 rounded-xl bg-muted/30 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <dt className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{k}</dt>
                    <dd className="text-sm font-black text-slate-900 mt-1">{v}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Team */}
          <motion.div variants={itemVariants} className="glass-card rounded-[2.5rem] p-10 shadow-elevated h-full">
            <div className="mb-10 flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
                <Users className="h-7 w-7" />
              </div>
              <div>
                <h2 className="font-black text-xl tracking-tight">Project Team</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Engineering Core</p>
              </div>
            </div>
            <div className="space-y-4">
              {team.map((t) => (
                <div key={t.name} className="flex items-center gap-5 rounded-[1.5rem] bg-muted/20 px-6 py-5 border-2 border-transparent hover:border-primary/5 hover:bg-muted/30 transition-all group">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-sm font-black text-white shadow-lg group-hover:scale-110 transition-transform">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-tight text-slate-900">{t.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-0.5">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* References */}
        <motion.div variants={itemVariants} className="mt-10 glass-card rounded-[2.5rem] p-10 shadow-elevated">
          <div className="mb-8 flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <h2 className="font-black text-xl tracking-tight">Research Backbone</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Clinical Literature</p>
            </div>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2">
            {papers.map((p, i) => (
              <li key={i} className="flex gap-4 p-5 rounded-2xl bg-muted/10 border-2 border-transparent hover:shadow-sm hover:bg-muted/20 transition-all group">
                 <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-primary/20 group-hover:bg-primary transition-colors mt-2" />
                 <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">{p}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Disclaimer */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 rounded-[2rem] border-2 border-primary/10 bg-primary/5 p-8 text-center backdrop-blur-sm"
        >
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
              <ShieldCheck className="h-6 w-6" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-4 italic">Safety Protocol &bull; Clinical Disclaimer</p>
          <p className="text-sm font-medium text-slate-600 max-w-3xl mx-auto leading-relaxed">
            AiHealth Guard is an academic project designed for diagnostic research. It is not a clinical tool. All predictions must be validated by a licensed cardiologist. Professional medical consultation is required for any diagnostic decisions.
          </p>
        </motion.div>

        <footer className="mt-16 text-center text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">
            &copy; 2026 AiHealth Guard Project &bull; All Rights Reserved
        </footer>
      </motion.div>
    </div>
  );
}
