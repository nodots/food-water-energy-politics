import numpy as np
from .types import ScenarioInput, PipelineResult
from .data_loaders import load_baseline_prices, load_contract_volumes
from .uncertainty import multipliers
from .optimization import solve_procurement
from .simulation import logistics_delay_days
from .kpis import compute_kpis

def run_pipeline(inp: ScenarioInput) -> PipelineResult:
    rng = np.random.default_rng(inp.seed)
    prices = load_baseline_prices()
    contracts = load_contract_volumes()

    mult = multipliers(inp.PI, inp.CI, inp.D_weeks, rng)
    opt = solve_procurement(prices, contracts, mult, inp.budget_musd)

    delay = logistics_delay_days(mult["M_deliv"], inp.CI, inp.D_weeks, rng)
    kpis = compute_kpis(opt["total_calories"], inp.population_m, inp.demand_cal_per_cap_day, delay)

    diags = {
        **mult,
        "total_cost_usd": opt["total_cost_usd"],
        "total_calories": opt["total_calories"],
    }
    notes = [
        "This MVP maximizes calories; you can multi-objective (protein, cost, risk) later.",
        "Swap GLPK with CBC/Gurobi for speed; add hedging layer once ready.",
    ]
    return PipelineResult(kpis=kpis, diagnostics=diags, notes=notes)
