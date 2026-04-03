import { Users, BookOpen, GraduationCap } from "lucide-react";
import logo from "@/assets/logo.png";

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

export default function About() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="mb-4 flex justify-center">
            <img src={logo} alt="AiHealth Guard" className="h-16 w-16 object-contain" />
          </div>
          <h1 className="mb-3 text-3xl font-bold">About AiHealth Guard</h1>
          <p className="text-muted-foreground">
            A B.Tech Major Project — AI-Based Ischemic Heart Disease Risk Prediction & Prevention System
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Project Info */}
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <GraduationCap className="h-5 w-5 text-accent-foreground" />
              </div>
              <h2 className="font-semibold">Project Details</h2>
            </div>
            <dl className="space-y-2 text-sm">
              {[
                ["Institution", "G. L. Bajaj Group of Institutions, Mathura"],
                ["Department", "Computer Science and Engineering"],
                ["Faculty Advisor", "Er. Ankit Pachouri, Assistant Professor"],
                ["Academic Year", "2025–2026"],
                ["Dataset", "UCI Cleveland Heart Disease (303 samples)"],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="shrink-0 font-medium text-foreground">{k}:</dt>
                  <dd className="text-muted-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Team */}
          <div className="rounded-2xl border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <Users className="h-5 w-5 text-accent-foreground" />
              </div>
              <h2 className="font-semibold">Team Members</h2>
            </div>
            <div className="space-y-3">
              {team.map((t) => (
                <div key={t.name} className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* References */}
        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
              <BookOpen className="h-5 w-5 text-accent-foreground" />
            </div>
            <h2 className="font-semibold">Research References</h2>
          </div>
          <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
            {papers.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-risk-moderate/30 bg-risk-moderate/5 p-4 text-center text-sm text-muted-foreground">
          <img src={logo} alt="" className="mx-auto mb-2 h-5 w-5 object-contain" />
          <strong>Disclaimer:</strong> AiHealth Guard is an academic project and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider.
        </div>
      </div>
    </div>
  );
}
