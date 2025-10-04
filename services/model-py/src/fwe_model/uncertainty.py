import numpy as np
from .config import COEFFS

def multipliers(PI: float, CI: int, D_weeks: int, rng: np.random.Generator):
    M_deliv = np.exp(-(COEFFS.alpha1*CI + COEFFS.alpha2*(D_weeks/12) + COEFFS.alpha3*abs(PI)))
    delta_ins = COEFFS.gamma1*CI + COEFFS.gamma2*(D_weeks/12) + COEFFS.gamma3*abs(PI)
    M_prc_fric = 1.0 + COEFFS.prc_fric_pi*max(0, PI) + COEFFS.prc_fric_ci*CI
    M_margin = 1.0 + COEFFS.zeta1*CI + COEFFS.zeta2*(D_weeks/12) + COEFFS.zeta3*abs(PI)
    jitter = rng.normal(0, 0.01)
    return {
        "M_deliv": float(np.clip(M_deliv + jitter, 0.1, 1.0)),
        "delta_ins": float(max(0.0, delta_ins)),
        "M_prc_fric": float(M_prc_fric),
        "M_margin": float(M_margin),
    }
