export const featureFields = [
  { name: "age", label: "Age", type: "number" as const, min: 20, max: 100, unit: "years", tooltip: "IHD risk increases after 45 (men) and 55 (women)" },
  { name: "sex", label: "Sex", type: "select" as const, options: [{ value: "1", label: "Male" }, { value: "0", label: "Female" }], tooltip: "Males at higher risk pre-menopause" },
  { name: "cp", label: "Chest Pain Type", type: "select" as const, options: [{ value: "1", label: "Typical Angina" }, { value: "2", label: "Atypical Angina" }, { value: "3", label: "Non-Anginal Pain" }, { value: "4", label: "Asymptomatic" }], tooltip: "Strongest single predictor of IHD" },
  { name: "trestbps", label: "Resting Blood Pressure", type: "number" as const, min: 80, max: 220, unit: "mm Hg", tooltip: "Normal: <120; Elevated: 120-139; High: ≥140" },
  { name: "chol", label: "Serum Cholesterol", type: "number" as const, min: 100, max: 600, unit: "mg/dL", tooltip: "Desirable: <200; Borderline: 200-239; High: ≥240" },
  { name: "fbs", label: "Fasting Blood Sugar > 120", type: "select" as const, options: [{ value: "1", label: "True (>120 mg/dL)" }, { value: "0", label: "False (≤120 mg/dL)" }], tooltip: "FBS > 120 mg/dL suggests diabetes" },
  { name: "restecg", label: "Resting ECG", type: "select" as const, options: [{ value: "0", label: "Normal" }, { value: "1", label: "ST-T Wave Abnormality" }, { value: "2", label: "Left Ventricular Hypertrophy" }], tooltip: "Electrocardiographic results at rest" },
  { name: "thalach", label: "Max Heart Rate Achieved", type: "number" as const, min: 60, max: 220, unit: "bpm", tooltip: "Highest MI feature importance (SHAP: 13.65%)" },
  { name: "exang", label: "Exercise-Induced Angina", type: "select" as const, options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], tooltip: "2nd highest ANOVA importance" },
  { name: "oldpeak", label: "ST Depression (Oldpeak)", type: "number" as const, min: 0, max: 7, step: 0.1, unit: "", tooltip: "ST depression by exercise relative to rest" },
  { name: "slope", label: "Slope of Peak ST Segment", type: "select" as const, options: [{ value: "0", label: "Upsloping" }, { value: "1", label: "Flat" }, { value: "2", label: "Downsloping" }], tooltip: "Downsloping associated with ischaemia" },
  { name: "ca", label: "Major Vessels Colored", type: "select" as const, options: [{ value: "0", label: "0" }, { value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" }], tooltip: "By fluoroscopy; higher = more CAD" },
  { name: "thal", label: "Thalassemia", type: "select" as const, options: [{ value: "0", label: "Normal" }, { value: "1", label: "Fixed Defect" }, { value: "2", label: "Reversible Defect" }], tooltip: "Thallium stress test result" },
];

export const samplePatient: Record<string, string> = {
  age: "52", sex: "1", cp: "4", trestbps: "140", chol: "266",
  fbs: "0", restecg: "1", thalach: "134", exang: "1",
  oldpeak: "2.4", slope: "1", ca: "2", thal: "2",
};

export const mockShapValues = [
  { feature: "oldpeak", value: 2.4, shap: 0.28, direction: "risk" as const },
  { feature: "cp", value: 4, shap: 0.22, direction: "risk" as const },
  { feature: "ca", value: 2, shap: 0.19, direction: "risk" as const },
  { feature: "thal", value: 2, shap: 0.15, direction: "risk" as const },
  { feature: "chol", value: 266, shap: 0.12, direction: "risk" as const },
  { feature: "exang", value: 1, shap: 0.10, direction: "risk" as const },
  { feature: "age", value: 52, shap: 0.08, direction: "risk" as const },
  { feature: "trestbps", value: 140, shap: 0.05, direction: "risk" as const },
  { feature: "thalach", value: 134, shap: -0.12, direction: "protective" as const },
  { feature: "slope", value: 1, shap: -0.04, direction: "protective" as const },
];

export const modelComparison = [
  { model: "XGBoost", accuracy: 95.1, auc: 0.96, f1: 0.94, precision: 93.2, recall: 95.0, status: "Primary" },
  { model: "Random Forest", accuracy: 92.3, auc: 0.93, f1: 0.91, precision: 91.0, recall: 92.5, status: "Backup" },
  { model: "SVM", accuracy: 89.5, auc: 0.90, f1: 0.88, precision: 88.1, recall: 89.8, status: "Evaluated" },
  { model: "Neural Network", accuracy: 87.8, auc: 0.88, f1: 0.86, precision: 86.5, recall: 88.0, status: "Evaluated" },
  { model: "Logistic Regression", accuracy: 86.2, auc: 0.87, f1: 0.85, precision: 85.0, recall: 86.5, status: "Baseline" },
];

export const recommendations = {
  lifestyle: [
    "Quit smoking immediately — smoking doubles IHD risk",
    "Limit alcohol to 1 drink/day (women) or 2 drinks/day (men)",
    "Practice stress management through meditation or yoga for 15-20 min daily",
    "Ensure 7-8 hours of quality sleep per night",
  ],
  diet: [
    "Adopt a Mediterranean or DASH diet emphasising fruits, vegetables, whole grains",
    "Reduce sodium intake to <2,300 mg/day (ideally <1,500 mg/day)",
    "Increase omega-3 fatty acids — eat fish 2-3 times per week",
    "Limit saturated fats to <7% of total daily calories",
  ],
  activity: [
    "Engage in 150 minutes/week of moderate aerobic exercise (brisk walking, cycling)",
    "Include 2-3 sessions of resistance training per week",
    "Avoid prolonged sitting — stand and move every 30 minutes",
    "Gradually increase intensity; consult a physician before starting vigorous exercise",
  ],
  medical: [
    "Schedule an appointment with a cardiologist within 2 weeks",
    "Request a lipid panel and HbA1c test at your next visit",
    "Discuss statin therapy if LDL cholesterol remains >130 mg/dL",
    "Monitor blood pressure regularly — target <130/80 mmHg",
  ],
};
