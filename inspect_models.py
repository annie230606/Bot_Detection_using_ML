import joblib
import pickle
import sys

def inspect_model(path):
    print(f"Inspecting {path}")
    try:
        try:
            model = joblib.load(path)
        except Exception:
            with open(path, 'rb') as f:
                model = pickle.load(f)

        print(f"Type: {type(model)}")
        if hasattr(model, 'feature_names_in_'):
            print(f"Features: {list(model.feature_names_in_)}")
        elif hasattr(model, 'get_booster'):
            print(f"Features: {model.get_booster().feature_names}")
    except Exception as e:
        print(f"Error: {e}")

inspect_model('c:/Users/Annie/Downloads/botdetect-realdata/project-modified/random_forest_model.pkl')
inspect_model('c:/Users/Annie/Downloads/botdetect-realdata/project-modified/svm_model.pkl')
inspect_model('c:/Users/Annie/Downloads/botdetect-realdata/project-modified/xgboost_model.pkl')
