# 🛡️ AiHealth Guard

### *Advanced Cardiovascular Risk Assessment through Explainable AI*

AiHealth Guard is a sophisticated machine learning platform developed as a **B.Tech Major Project** to predict the risk of Ischemic Heart Disease (IHD). By analyzing 13 key clinical parameters, the system provides high-accuracy risk scores and transparent "why" explanations using SHAP (SHapley Additive exPlanations).

---

## 🚀 Key Features

- **Multi-Model Inference Engine**: Implements five distinct ML architectures:
    - **XGBoost** (Primary Model - High Precision)
    - **Random Forest** (Robust Ensemble)
    - **SVM** (Kernel-based Classification)
    - **Neural Network** (Deep Learning via TensorFlow)
    - **Logistic Regression** (Statistical Baseline)
- **Explainable AI (XAI)**: Integrated SHAP dashboard that visualizes exactly which clinical factors (e.g., cholesterol, blood pressure) increased or decreased a patient's risk score.
- **Diagnostic PDF Reports**: Generate and download professional cardiovascular health summaries for clinical review.
- **Model Comparison Hub**: Live performance metrics (Accuracy, AUC-ROC, F1-Score) for all implemented models on the UCI Cleveland dataset.
- **Premium UI/UX**: Modern glassmorphic interface built with React, ShadcnUI, and Framer Motion for a seamless diagnostic experience.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS & Lucide Icons
- **Components**: Radix UI / Shadcn UI
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts & html2canvas (for PDF)

### Backend
- **API Framework**: FastAPI (Python)
- **ML Engine**: Scikit-learn, XGBoost, TensorFlow
- **Explainability**: SHAP (KernelExplainer)
- **Data Manipulation**: Pandas & NumPy

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### 1. Clone & Navigate
```bash
git clone https://github.com/chaudharytarunkumar/aihealthguard.git
cd aihealthguard
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run training pipeline (optional, models are pre-included)
python backend/train.py

# Start Backend Server
python backend/main.py
```

### 3. Frontend Setup
```bash
# Install dependencies
npm install

# Start Development Server
npm run dev
```

---

## 📊 Model Performance

| Model | Accuracy | AUC-ROC | Primary Use |
| :--- | :--- | :--- | :--- |
| **XGBoost** | 95.1% | 0.96 | Live Diagnostics |
| **Random Forest** | 93.4% | 0.94 | Validation |
| **SVM** | 89.2% | 0.91 | Baseline |

---

## ⚖️ Medical Disclaimer
**AiHealth Guard is for educational and research purposes only.** It uses the UCI Cleveland Heart Disease dataset for demonstration. Results should not be treated as professional medical advice. Always consult a qualified cardiologist for clinical diagnosis.

---

## 👨‍💻 Author
**Tarun Kumar Chaudhary**  
*B.Tech Major Project Final Report - 2026*  

[GitHub Portfolio](https://github.com/chaudharytarunkumar)
