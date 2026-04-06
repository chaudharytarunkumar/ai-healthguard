import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Info, Sparkles, RotateCcw, ChevronRight, ChevronLeft, ClipboardList, Activity, Beaker } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { featureFields, samplePatient } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { id: "personal", title: "Basic Information", icon: ClipboardList, fields: ["age", "sex"] },
  { id: "clinical", title: "Clinical Biomarkers", icon: Beaker, fields: ["trestbps", "chol", "thalach", "oldpeak", "fbs", "restecg"] },
  { id: "history", title: "Patient History", icon: Activity, fields: ["cp", "exang", "slope", "ca", "thal"] }
];

export default function RiskAssessment() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const currentSection = sections[currentSectionIdx];

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const fillSample = () => {
    setFormData(samplePatient);
    setErrors({});
    toast({ title: "Sample data loaded", description: "A 52-year-old male test case has been filled in." });
  };

  const clearForm = () => {
    setFormData({});
    setErrors({});
    setCurrentSectionIdx(0);
  };

  const validateSection = (idx: number) => {
    const sectionFields = sections[idx].fields;
    const newErrors: Record<string, string> = {};
    let isValid = true;

    sectionFields.forEach((fieldName) => {
      const field = featureFields.find(f => f.name === fieldName);
      if (!field) return;

      if (!formData[fieldName] && formData[fieldName] !== "0") {
        newErrors[fieldName] = "Required";
        isValid = false;
      } else if (field.type === "number") {
        const val = parseFloat(formData[fieldName]);
        if (isNaN(val)) {
          newErrors[fieldName] = "Invalid";
          isValid = false;
        } else if (field.min !== undefined && val < field.min) {
          newErrors[fieldName] = `< ${field.min}`;
          isValid = false;
        } else if (field.max !== undefined && val > field.max) {
          newErrors[fieldName] = `> ${field.max}`;
          isValid = false;
        }
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const nextSection = () => {
    if (validateSection(currentSectionIdx)) {
      setCurrentSectionIdx(prev => Math.min(prev + 1, sections.length - 1));
    } else {
      toast({ title: "Check Fields", description: "Please complete all fields in this section.", variant: "destructive" });
    }
  };

  const prevSection = () => {
    setCurrentSectionIdx(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSection(currentSectionIdx)) {
      toast({ title: "Validation Error", description: "Please fix the highlighted fields.", variant: "destructive" });
      return;
    }
    
    // Final check for all fields (just in case they jumped around)
    const allValid = sections.every((_, i) => validateSection(i));
    if (!allValid) {
        toast({ title: "Missing Data", description: "Some sections are incomplete.", variant: "destructive" });
        return;
    }

    navigate("/results", { state: { patientData: formData } });
  };

  const progress = ((currentSectionIdx + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen px-6 py-12 bg-background relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 h-[500px] w-[500px] bg-teal-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-primary shadow-xl shadow-primary/20"
          >
            <Heart className="h-10 w-10 text-white fill-white/20" />
          </motion.div>
          <h1 className="mb-3 text-4xl font-black tracking-tight sm:text-5xl">Risk Assessment</h1>
          <p className="text-lg font-medium text-muted-foreground max-w-lg mx-auto">
            Input your parameters to run the multi-model IHD prediction engine.
          </p>
        </div>

        {/* Multi-step Container */}
        <div className="relative glass-card rounded-[2.5rem] p-8 sm:p-12 shadow-elevated">
          {/* Progress bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
               <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Section {currentSectionIdx + 1} of {sections.length}</span>
               <span className="text-xs font-bold text-muted-foreground">{currentSection.title}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-primary/5">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" 
               />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSection.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid gap-8 sm:grid-cols-2"
              >
                {currentSection.fields.map((fieldName) => {
                  const field = featureFields.find(f => f.name === fieldName);
                  if (!field) return null;
                  return (
                    <div key={fieldName} className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={fieldName} className="text-[13px] font-black uppercase tracking-widest text-muted-foreground">
                          {field.label}
                        </Label>
                        <TooltipProvider>
                           <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 cursor-help text-primary/60 transition-colors hover:text-primary" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-[240px] rounded-xl p-3 border shadow-elevated">
                              <p className="text-xs font-medium leading-relaxed">{field.tooltip}</p>
                              {field.type === "number" && (
                                <p className="mt-2 text-[10px] font-black uppercase text-primary">
                                  Allowed: {field.min}–{field.max} {field.unit}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="relative group">
                        {field.type === "number" ? (
                          <>
                            <Input
                              id={fieldName}
                              type="number"
                              step={field.step || 1}
                              placeholder={`${field.min} ${field.unit || ""}`}
                              value={formData[fieldName] || ""}
                              onChange={(e) => handleChange(fieldName, e.target.value)}
                              className={`h-14 rounded-2xl border-2 bg-muted/30 px-6 font-bold transition-all focus:bg-background focus:ring-4 focus:ring-primary/10 ${errors[fieldName] ? "border-destructive/50" : "border-transparent hover:border-primary/20 focus:border-primary"}`}
                            />
                            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-muted-foreground/60">{field.unit}</span>
                          </>
                        ) : (
                          <Select
                            value={formData[fieldName] || ""}
                            onValueChange={(v) => handleChange(fieldName, v)}
                          >
                            <SelectTrigger className={`h-14 rounded-2xl border-2 bg-muted/30 px-6 font-bold transition-all focus:bg-background ${errors[fieldName] ? "border-destructive/50" : "border-transparent hover:border-primary/20 focus:border-primary"}`}>
                              <SelectValue placeholder="Selection..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border p-1 shadow-elevated">
                              {field.options?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="rounded-xl font-medium focus:bg-primary/5 focus:text-primary transition-colors">
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        {errors[fieldName] && (
                           <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] font-bold text-destructive mt-1.5 ml-4 uppercase tracking-wider">{errors[fieldName]}</motion.p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Form Controls */}
            <div className="mt-16 flex items-center justify-between gap-4">
               <div className="flex gap-4">
                  <Button type="button" variant="ghost" onClick={fillSample} className="h-12 rounded-xl text-primary font-bold gap-2">
                    <Sparkles className="h-4 w-4" /> <span className="hidden sm:inline">Fill Sample</span>
                  </Button>
                  <Button type="button" variant="ghost" onClick={clearForm} className="h-12 rounded-xl text-muted-foreground font-bold gap-2 hover:text-destructive">
                    <RotateCcw className="h-4 w-4" /> <span className="hidden sm:inline">Reset</span>
                  </Button>
               </div>

               <div className="flex gap-4">
                  {currentSectionIdx > 0 && (
                    <Button type="button" variant="outline" onClick={prevSection} className="h-14 px-8 rounded-2xl border-2 font-black gap-2 transition-all hover:bg-muted active:scale-95">
                      <ChevronLeft className="h-5 w-5" /> Back
                    </Button>
                  )}
                  
                  {currentSectionIdx < sections.length - 1 ? (
                    <Button type="button" onClick={nextSection} className="h-14 px-8 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 gap-2 transition-all hover:translate-x-1 active:scale-95 shadow-xl">
                      Proceed <ChevronRight className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button type="submit" className="h-14 px-10 rounded-2xl bg-gradient-primary text-white font-black gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/30">
                      <Heart className="h-5 w-5 fill-white" /> Compute Analytics
                    </Button>
                  )}
               </div>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 italic px-4">
           Secure Session &bull; Private Diagnostics &bull; No Persistent Storage
        </p>
      </div>
    </div>
  );
}
