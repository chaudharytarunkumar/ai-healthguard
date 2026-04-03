import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Info, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { featureFields, samplePatient } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

export default function RiskAssessment() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

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
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    featureFields.forEach((f) => {
      if (!formData[f.name] && formData[f.name] !== "0") {
        newErrors[f.name] = `${f.label} is required`;
      }
      if (f.type === "number" && formData[f.name]) {
        const val = parseFloat(formData[f.name]);
        if (isNaN(val)) newErrors[f.name] = "Must be a number";
        else if (f.min !== undefined && val < f.min) newErrors[f.name] = `Min: ${f.min}`;
        else if (f.max !== undefined && val > f.max) newErrors[f.name] = `Max: ${f.max}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({ title: "Validation Error", description: "Please fix the highlighted fields.", variant: "destructive" });
      return;
    }
    // Navigate to results with form data
    navigate("/results", { state: { patientData: formData } });
  };

  // Compute BMI if height/weight present (bonus feature)
  const heightM = formData.height ? parseFloat(formData.height) / 100 : 0;
  const weightKg = formData.weight ? parseFloat(formData.weight) : 0;
  const bmi = heightM > 0 && weightKg > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : null;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary">
            <Heart className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">IHD Risk Assessment</h1>
          <p className="text-muted-foreground">
            Enter your clinical parameters below. Hover over <Info className="inline h-3.5 w-3.5" /> icons for reference ranges.
          </p>
        </div>

        {/* Action buttons */}
        <div className="mb-6 flex justify-center gap-3">
          <Button variant="outline" onClick={fillSample} className="gap-2">
            <Sparkles className="h-4 w-4" /> Load Sample Data
          </Button>
          <Button variant="ghost" onClick={clearForm} className="gap-2 text-muted-foreground">
            <RotateCcw className="h-4 w-4" /> Clear
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="rounded-2xl border bg-card p-6 shadow-card sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featureFields.map((field) => (
                <div key={field.name} className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor={field.name} className="text-sm font-medium">
                      {field.label}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-xs">{field.tooltip}</p>
                        {field.type === "number" && field.unit && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Range: {field.min}–{field.max} {field.unit}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {field.type === "number" ? (
                    <div className="relative">
                      <Input
                        id={field.name}
                        type="number"
                        step={field.step || 1}
                        min={field.min}
                        max={field.max}
                        placeholder={`${field.min}–${field.max}`}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className={errors[field.name] ? "border-destructive" : ""}
                      />
                      {field.unit && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                          {field.unit}
                        </span>
                      )}
                    </div>
                  ) : (
                    <Select
                      value={formData[field.name] || ""}
                      onValueChange={(v) => handleChange(field.name, v)}
                    >
                      <SelectTrigger className={errors[field.name] ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {errors[field.name] && (
                    <p className="text-xs text-destructive">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            {bmi && (
              <div className="mt-5 rounded-lg bg-accent p-3 text-sm">
                <span className="font-medium text-accent-foreground">Calculated BMI:</span>{" "}
                <span className="font-bold">{bmi}</span> kg/m²
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="mt-6 text-center">
            <Button type="submit" size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2 px-10 text-base font-semibold">
              <Heart className="h-5 w-5" />
              Predict IHD Risk
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              No data is stored or transmitted — all computation is session-based.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
