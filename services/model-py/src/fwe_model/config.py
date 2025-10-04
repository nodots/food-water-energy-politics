from dataclasses import dataclass

@dataclass
class Coeffs:
    alpha1: float = 0.35
    alpha2: float = 0.15
    alpha3: float = 0.10
    gamma1: float = 0.20
    gamma2: float = 0.05
    gamma3: float = 0.07
    zeta1: float = 0.40
    zeta2: float = 0.10
    zeta3: float = 0.10
    prc_fric_pi: float = 0.20
    prc_fric_ci: float = 0.08

COEFFS = Coeffs()
