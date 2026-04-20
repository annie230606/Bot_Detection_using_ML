import pickle
import joblib
import os
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)

# Paths to the model files (relative to the root of the nextjs project)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RF_MODEL_PATH = os.path.join(BASE_DIR, 'random_forest_model.pkl')
SVM_MODEL_PATH = os.path.join(BASE_DIR, 'svm_model.pkl')
XGB_MODEL_PATH = os.path.join(BASE_DIR, 'xgboost_model.pkl')

rf_model = None
svm_model = None
xgb_model = None

try:
    rf_model = joblib.load(RF_MODEL_PATH)
    print("Random Forest model loaded successfully.")
except Exception as e:
    print(f"Error loading RF model: {e}")

try:
    svm_model = joblib.load(SVM_MODEL_PATH)
    print("SVM model loaded successfully.")
except Exception as e:
    try:
        with open(SVM_MODEL_PATH, 'rb') as f:
            svm_model = pickle.load(f)
        print("SVM model loaded successfully (with pickle).")
    except Exception as e2:
        print(f"Error loading SVM model: {e2}")

try:
    xgb_model = joblib.load(XGB_MODEL_PATH)
    print("XGBoost model loaded successfully.")
except Exception as e:
    try:
        with open(XGB_MODEL_PATH, 'rb') as f:
            xgb_model = pickle.load(f)
        print("XGBoost model loaded successfully (with pickle).")
    except Exception as e2:
        print(f"Error loading XGBoost model: {e2}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # 1. Map available Next.js data to variables
        follower_count = data.get('follower_count', 0)
        verified = 1 if data.get('verified', False) else 0
        has_location = 1 if data.get('has_location', False) else 0
        tweet_length = data.get('tweet_length', 0)
        
        # 2. Build DataFrame for RF and SVM (14 features)
        rf_svm_features = {
            'Unnamed: 0': [0],
            'default_profile': [1],
            'default_profile_image': [0],
            'favourites_count': [0],
            'followers_count': [follower_count],
            'friends_count': [0],
            'geo_enabled': [has_location],
            'lang': [0], # Usually categorical encoded, default 0
            'profile_background_image_url': [0],
            'profile_image_url': [0],
            'statuses_count': [tweet_length], # Dummy proxy
            'verified': [verified],
            'average_tweets_per_day': [0.5],
            'account_age_days': [100]
        }
        df_rf_svm = pd.DataFrame(rf_svm_features)

        # 3. Build DataFrame for XGBoost (13 features)
        xgb_features = {
            'Unnamed: 0': [0],
            'default_profile': [1],
            'default_profile_image': [0],
            'favourites_count': [0],
            'followers_count': [follower_count],
            'friends_count': [0],
            'geo_enabled': [has_location],
            'lang': [0],
            'statuses_count': [tweet_length], # Dummy proxy
            'verified': [verified],
            'average_tweets_per_day': [0.5],
            'account_age_days': [100],
            'description_length': [0]
        }
        df_xgb = pd.DataFrame(xgb_features)
        
        results = {}

        if svm_model:
            if hasattr(svm_model, 'predict_proba'):
                proba = svm_model.predict_proba(df_rf_svm)[0]
                bot_prob = float(proba[1]) if len(proba) > 1 else (1.0 if float(svm_model.predict(df_rf_svm)[0]) > 0.5 else 0.0)
            else:
                pred = svm_model.predict(df_rf_svm)[0]
                bot_prob = 1.0 if pred > 0.5 else 0.0

            prediction_label = "BOT" if bot_prob > 0.5 else "HUMAN"
            confidence = bot_prob if prediction_label == "BOT" else 1.0 - bot_prob
            
            results['svm'] = {
                'prediction': prediction_label,
                'confidence': round(confidence, 3),
                'model': 'SVM'
            }
            
        if rf_model:
            if hasattr(rf_model, 'predict_proba'):
                proba = rf_model.predict_proba(df_rf_svm)[0]
                bot_prob = float(proba[1]) if len(proba) > 1 else (1.0 if float(rf_model.predict(df_rf_svm)[0]) > 0.5 else 0.0)
            else:
                pred = rf_model.predict(df_rf_svm)[0]
                bot_prob = 1.0 if pred > 0.5 else 0.0

            prediction_label = "BOT" if bot_prob > 0.5 else "HUMAN"
            confidence = bot_prob if prediction_label == "BOT" else 1.0 - bot_prob
            
            results['random_forest'] = {
                'prediction': prediction_label,
                'confidence': round(confidence, 3),
                'model': 'Random Forest'
            }

        if xgb_model:
            if hasattr(xgb_model, 'predict_proba'):
                proba = xgb_model.predict_proba(df_xgb)[0]
                bot_prob = float(proba[1]) if len(proba) > 1 else (1.0 if float(xgb_model.predict(df_xgb)[0]) > 0.5 else 0.0)
            else:
                pred = xgb_model.predict(df_xgb)[0]
                bot_prob = 1.0 if pred > 0.5 else 0.0

            prediction_label = "BOT" if bot_prob > 0.5 else "HUMAN"
            confidence = bot_prob if prediction_label == "BOT" else 1.0 - bot_prob
            
            results['xgboost'] = {
                'prediction': prediction_label,
                'confidence': round(confidence, 3),
                'model': 'XGBoost'
            }

        results['features_received'] = data

        return jsonify(results)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000, debug=True)
