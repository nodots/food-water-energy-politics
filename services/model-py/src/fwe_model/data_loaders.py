import pandas as pd

def load_baseline_prices() -> pd.DataFrame:
    data = [
        {"commodity": "rice", "price": 500.0, "kcal_per_kg": 3600.0, "protein_g_per_kg": 70.0},
        {"commodity": "wheat", "price": 330.0, "kcal_per_kg": 3400.0, "protein_g_per_kg": 110.0},
        {"commodity": "poultry_eq", "price": 1800.0, "kcal_per_kg": 2390.0, "protein_g_per_kg": 270.0},
        {"commodity": "edible_oil", "price": 1000.0, "kcal_per_kg": 8840.0, "protein_g_per_kg": 0.0},
    ]
    return pd.DataFrame(data)

def load_contract_volumes() -> pd.DataFrame:
    data = [
        {"commodity": "rice", "tons": 300_000},
        {"commodity": "wheat", "tons": 400_000},
        {"commodity": "poultry_eq", "tons": 80_000},
        {"commodity": "edible_oil", "tons": 60_000},
    ]
    return pd.DataFrame(data)
