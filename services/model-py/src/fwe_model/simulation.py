import numpy as np

def logistics_delay_days(M_deliv: float, CI: int, D_weeks: int, rng: np.random.Generator) -> float:
    base = 3.0 + 2.0*CI + 0.2*(D_weeks) + (1.0 - M_deliv)*10.0
    noise = np.exp(rng.normal(0.0, 0.3))
    return float(max(0.0, base * noise))
