import pandas as pd

from sklearn.model_selection import train_test_split
import os

# Define the expected feature columns
FEATURE_COLUMNS = [
    'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
    'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
]

def load_cleveland_dataset():
    """
    Loads the Heart Disease dataset from the local 'heart' directory.
    """
    # The dataset path based on the user's uploaded structure
    DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'heart', 'processed.cleveland.data')
    
    # Load dataset with column names since it doesn't have a header. Also handle '?' as NA
    df = pd.read_csv(DATA_PATH, names=FEATURE_COLUMNS + ['target'], na_values='?')
    
    X = df[FEATURE_COLUMNS]
    y = df['target']
    
    # Convert target to binary (0 = No IHD, 1 = IHD)
    y = y.apply(lambda val: 1 if val > 0 else 0)
    
    return X, y

def get_train_test_data(test_size=0.25, random_state=42):
    """
    Splits the dataset into training and testing sets.
    """
    X, y = load_cleveland_dataset()
    return train_test_split(X, y, test_size=test_size, random_state=random_state, stratify=y)
