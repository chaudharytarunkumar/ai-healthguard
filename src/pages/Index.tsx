import { Link } from "react-router-dom";
import { Shield, Brain, Activity, ArrowRight, BarChart3, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const features = [
  { icon: Brain, title: "AI-Powered Prediction", desc: "Five ML models including XGBoost analyse 13 clinical parameters for accurate IHD risk assessment." },
  { icon: Shield, title: "Explainable AI (SHAP)", desc: "Understand exactly which health factors drive your risk score with transparent SHAP explanations." },
  { icon: Activity, title: "Personalised Prevention", desc: "Receive tailored lifestyle, diet, activity, and medical recommendations based on your profile." },
  { icon: BarChart3, title: "Model Comparison", desc: "Compare performance of Random Forest, XGBoost, SVM, Neural Network, and Logistic Regression." },
];

const stats = [
  { value: "95.1%", label: "Model Accuracy" },
  { value: "0.96", label: "AUC-ROC Score" },
  { value: "13", label: "Clinical Parameters" },
  { value: "5", label: "ML Models" },
];

export default function Index() {
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
            <img src={logo} alt="AiHealth Guard" className="h-20 w-20 object-contain" />
          </div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground">
            <img src={logo} alt="" className="h-4 w-4 object-contain" />
            AI-Based Ischemic Heart Disease Risk Prediction
          </div>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Predict Heart Disease Risk
            <br />
            <span className="text-gradient-primary">
              Before It's Too Late
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/70">
            AiHealth Guard uses machine learning to assess your Ischemic Heart Disease risk from routine health parameters,
            explains the reasoning with Explainable AI, and provides personalised prevention plans.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/assess">
              <Button size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 gap-2 px-8 text-base font-semibold">
                Start Risk Assessment
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/models">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2 px-8 text-base">
                View Model Performance
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-12 relative z-10 px-4">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-card p-5 text-center shadow-elevated">
              <div className="text-2xl font-bold text-gradient-primary">{stat.value}</div>
              <div className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">How AiHealth Guard Works</h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              A comprehensive clinical decision support tool powered by five state-of-the-art machine learning models.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                  <f.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/50 px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Three Simple Steps</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "01", icon: FileText, title: "Enter Health Data", desc: "Fill in 13 routine clinical parameters — no invasive tests required." },
              { step: "02", icon: Brain, title: "AI Analysis", desc: "Our XGBoost model predicts your IHD risk with SHAP-based explanations." },
              { step: "03", icon: Users, title: "Get Your Plan", desc: "Receive a personalised prevention report with actionable recommendations." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-lg font-bold text-primary-foreground">
                  {s.step}
                </div>
                <h3 className="mb-2 font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-hero p-10 text-center sm:p-14">
          <img src={logo} alt="AiHealth Guard" className="mx-auto mb-4 h-10 w-10 object-contain" />
          <h2 className="mb-3 text-2xl font-bold text-primary-foreground sm:text-3xl">
            Take Control of Your Heart Health Today
          </h2>
          <p className="mb-6 text-primary-foreground/70">
            Early detection is the best prevention. Complete your free risk assessment in under 5 minutes.
          </p>
          <Link to="/assess">
            <Button size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 gap-2 px-8 font-semibold">
              Start Free Assessment <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <img src={logo} alt="" className="h-4 w-4 object-contain" />
            AiHealth Guard — B.Tech Major Project, G. L. Bajaj Group of Institutions
          </div>
          <p className="text-xs text-muted-foreground">
            Disclaimer: Not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
        </div>
      </footer>
    </div>
  );
}
