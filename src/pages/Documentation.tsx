import { FileText, Download, ExternalLink, BookOpen, Cpu, Sparkles, Files, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

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

export default function Documentation() {
  const documents = [
    {
      title: "Project Final Report",
      desc: "Comprehensive 8-page final year B.Tech major project report including ML methodology, EDA, and system architecture.",
      file: "/AIHealthGuard_Project_Report.pdf",
      type: "PDF",
      icon: FileText,
      primary: true
    },
    {
      title: "Product Requirements Document (PRD)",
      desc: "Core functional and non-functional requirements, user personas, and health diagnostic scope.",
      file: "/AiHealth_Guard_PRD.docx",
      type: "DOCX",
      icon: BookOpen,
      primary: false
    },
    {
      title: "ML Pipeline & Colab Notebook",
      desc: "Live training scripts, dataset cleaning (SMOTE), and model optimization (XGBoost) logic.",
      file: "/AiHealth_Guard_Colab_Pipeline.ipynb",
      type: "IPYNB",
      icon: Cpu,
      primary: false
    }
  ];

  return (
    <div className="min-h-screen px-6 py-16 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-primary/5 blur-[160px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] bg-emerald-500/5 blur-[160px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl"
      >
        <motion.div variants={itemVariants} className="mb-16 text-center">
          <Badge variant="outline" className="mb-6 border-primary/20 bg-primary/5 text-primary uppercase font-black tracking-[0.3em] px-5 py-1.5 rounded-full">Archive & Specs</Badge>
          <h1 className="mb-4 text-5xl font-black tracking-tighter text-slate-900 sm:text-6xl">Project Documentation</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg font-medium opacity-80 leading-relaxed">
            Exploration of the technical foundations, product strategy, and clinical validation protocols of the AiHealth Guard ecosystem.
          </p>
        </motion.div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {documents.map((doc, i) => (
            <motion.div 
              key={doc.title} 
              variants={itemVariants}
              className={`group relative glass-card rounded-[2.5rem] p-10 shadow-elevated transition-all hover:scale-[1.02] border-2 border-transparent hover:border-primary/10 flex flex-col`}
            >
              <div className={`mb-10 flex h-16 w-16 items-center justify-center rounded-[1.25rem] transition-all group-hover:scale-110 ${doc.primary ? 'bg-slate-900 text-white shadow-2xl' : 'bg-muted/30 text-muted-foreground group-hover:bg-primary group-hover:text-white'}`}>
                <doc.icon className="h-8 w-8" />
              </div>
              <div className="mb-4 flex items-center justify-between">
                <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest border-2 rounded-lg bg-background/50 px-3">{doc.type}</Badge>
                {doc.primary && <Badge className="bg-primary text-white font-black text-[9px] uppercase tracking-tighter rounded-lg shadow-sm">Master Copy</Badge>}
              </div>
              <h3 className="mb-4 text-2xl font-black tracking-tight text-slate-900 leading-tight">{doc.title}</h3>
              <p className="mb-10 text-sm font-medium leading-relaxed text-muted-foreground flex-1">{doc.desc}</p>
              
              <div className="flex gap-4">
                <Button asChild className={`flex-1 h-14 rounded-2xl font-black gap-3 shadow-xl transition-all active:scale-95 ${doc.primary ? 'bg-gradient-primary text-white shadow-primary/30' : 'bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-none'}`}>
                    <a href={doc.file} download>
                        <Download className="h-5 w-5" /> Download
                    </a>
                </Button>
                {doc.type === "PDF" && (
                    <Button variant="outline" size="icon" asChild className="h-14 w-14 rounded-2xl border-2 hover:bg-muted active:scale-95 shadow-lg bg-white">
                        <a href={doc.file} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-5 w-5" />
                        </a>
                    </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Stats or Features Bar */}
        <motion.div variants={itemVariants} className="mb-20 grid gap-8 sm:grid-cols-3">
             {[
                { label: "Dataset Context", text: "Cleveland UCI", icon: Files },
                { label: "Clinical Precision", text: "SHAP Integrated", icon: Sparkles },
                { label: "Deployment", text: "React/Python", icon: Cpu }
             ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-5 p-6 rounded-[2rem] bg-muted/20 border-2 border-transparent">
                    <div className="h-12 w-12 rounded-xl bg-white border shadow-sm flex items-center justify-center text-primary"><feat.icon className="h-5 w-5" /></div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{feat.label}</p>
                        <p className="font-black text-slate-900">{feat.text}</p>
                    </div>
                </div>
             ))}
        </motion.div>

        {/* PDF Preview Section */}
        <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative glass-card rounded-[3rem] p-5 shadow-elevated overflow-hidden border-2 border-white/50 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between p-8 border-b border-muted/30">
                  <div className="flex items-center gap-5 mb-4 sm:mb-0">
                      <div className="h-3 w-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                      <div>
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                             <FileText className="h-3 w-3" /> Technical Review Case Study
                        </span>
                        <h4 className="font-black text-xl tracking-tighter text-slate-900 mt-1">interactive_report_preview.pdf</h4>
                      </div>
                  </div>
                  <Button variant="outline" className="h-11 px-6 rounded-xl border-2 font-black transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 active:scale-95 shadow-md bg-white" asChild>
                      <a href="/AIHealthGuard_Project_Report.pdf" target="_blank" className="gap-2 uppercase text-[10px] tracking-widest">
                          Full Protocol Review <ExternalLink className="h-3 w-3" />
                      </a>
                  </Button>
              </div>
              <div className="relative aspect-[16/10] w-full bg-slate-50/50 rounded-b-[2rem] overflow-hidden">
                <iframe 
                  src="/AIHealthGuard_Project_Report.pdf#toolbar=0" 
                  className="absolute inset-0 h-full w-full border-0"
                  title="Project Report Preview"
                />
                <div className="absolute inset-0 pointer-events-none border-[12px] border-white/10 rounded-b-[2rem]" />
              </div>
              <div className="p-10 bg-slate-900 text-center text-[11px] font-bold text-white/40 tracking-widest uppercase">
                  <Info className="h-3 w-3 inline mr-2 text-primary" />
                  Live clinical documentation archive &bull; Confidentiality Protocol Enabled
              </div>
            </div>
        </motion.div>

        <footer className="mt-24 text-center text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">
            &copy; 2026 AiHealth Guard Repository &bull; Institutional Access Only
        </footer>
      </motion.div>
    </div>
  );
}
