# 🤖 BotDetect
### ML-Powered Twitter Bot Detection System  

A full-stack web application that detects Twitter bot accounts using machine learning models like **SVM, Random Forest, and XGBoost**.

---

## 📌 Overview  
BotShield is designed to identify fake or automated Twitter accounts by analyzing user behavior and metadata.  
It combines a modern frontend with a Python-based backend and trained ML models.

---

## 🚨 Problem Statement  
Social media platforms face critical issues due to bot activity:
- Fake followers and engagement  
- Spam and malicious content  
- Spread of misinformation  

This project provides an automated ML-based solution to detect bots efficiently.

---

## ✨ Features  
- 🧠 Multiple ML models for prediction  
- 🌐 Full-stack web application  
- ⚡ API-based predictions  
- 📊 Model evaluation and comparison  
- 💾 Pre-trained models ready to use  

---

## 🧠 Models Used  
- **Support Vector Machine (SVM)**  
- **Random Forest**  
- **XGBoost**  

---

## 🛠 Tech Stack  

### Frontend  
- Next.js  
- TypeScript  
- Tailwind CSS  

### Backend  
- Python (Flask / FastAPI)  

### Machine Learning  
- Scikit-learn  
- XGBoost  
- Pandas  
- NumPy  

---

## 📁 Project Structure  

```
Bot_Detection_using_ML/
├── app/                      # Next.js app pages
├── components/               # UI components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions
├── public/                   # Static assets
├── styles/                   # Tailwind & CSS files
├── python_backend/           # Backend (Flask / API)

├── random_forest_model.pkl   # Trained Random Forest model
├── svm_model.pkl             # Trained SVM model
├── xgboost_model.pkl         # Trained XGBoost model

├── test_api.py               # API testing script
├── inspect_models.py         # Model inspection script

├── package.json              # Project dependencies
├── next.config.mjs           # Next.js config
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind config

└── README.md                 # Project documentation
```
