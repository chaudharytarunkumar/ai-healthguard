def calculate_risk_score(probability):
    """
    Converts a probability [0.0 - 1.0] to a Risk Score [0 - 100].
    """
    score = int(round(probability * 100))
    
    if score <= 40:
        level = "LOW RISK"
    elif score <= 70:
        level = "MODERATE RISK"
    else:
        level = "HIGH RISK"
        
    return score, level
