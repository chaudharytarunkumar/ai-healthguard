import { FileText, Download, ExternalLink, BookOpen, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      icon: BookOpen
    },
    {
      title: "ML Pipeline & Colab Notebook",
      desc: "Live training scripts, dataset cleaning (SMOTE), and model optimization (XGBoost) logic.",
      file: "/AiHealth_Guard_Colab_Pipeline.ipynb",
      type: "IPYNB",
      icon: Cpu
    }
  ];

  return (
    <div className="min-h-screen px-4 py-12 bg-muted/30">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary uppercase tracking-widest px-3 py-1">Project Assets</Badge>
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Project Documentation</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            Review the technical foundations, product requirements, and academic reporting for the AiHealth Guard diagnostic system.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-16">
          {documents.map((doc, i) => (
            <div 
                key={doc.title} 
                className={`group relative rounded-3xl border bg-card p-8 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-8 duration-700`}
                style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${doc.primary ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-accent text-accent-foreground'}`}>
                <doc.icon className="h-7 w-7" />
              </div>
              <div className="mb-2 flex items-center justify-between">
                <Badge variant="secondary" className="font-mono text-[10px]">{doc.type}</Badge>
                {doc.primary && <Badge className="bg-risk-moderate hover:bg-risk-moderate">Recommended</Badge>}
              </div>
              <h3 className="mb-3 text-xl font-bold">{doc.title}</h3>
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">{doc.desc}</p>
              
              <div className="flex gap-3 mt-auto">
                <Button asChild variant={doc.primary ? "default" : "outline"} className="flex-1 gap-2">
                    <a href={doc.file} download>
                        <Download className="h-4 w-4" /> Download
                    </a>
                </Button>
                {doc.type === "PDF" && (
                    <Button variant="ghost" asChild className="px-3">
                        <a href={doc.file} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* PDF Preview Section */}
        <div className="rounded-3xl border bg-card p-4 shadow-card overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Interactive Preview: Final Report</span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                  <a href="/AIHealthGuard_Project_Report.pdf" target="_blank" className="text-xs gap-1">
                      Full Screen <ExternalLink className="h-3 w-3" />
                  </a>
              </Button>
          </div>
          <div className="relative aspect-[16/9] w-full bg-muted">
            <iframe 
              src="/AIHealthGuard_Project_Report.pdf#toolbar=0" 
              className="absolute inset-0 h-full w-full border-0 lg:aspect-[16/10]"
              title="Project Report Preview"
            />
          </div>
          <div className="p-4 bg-muted/50 text-center text-xs text-muted-foreground italic">
              Note: Embedded viewer may vary by browser. Use the download button above for the full experience.
          </div>
        </div>
      </div>
    </div>
  );
}
