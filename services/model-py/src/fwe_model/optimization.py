from pyomo.environ import ConcreteModel, Var, NonNegativeReals, Objective, Constraint, maximize
import pandas as pd

def solve_procurement(prices: pd.DataFrame, contracts: pd.DataFrame, multipliers: dict, budget_musd: float):
    df = contracts.merge(prices, on="commodity", how="left").copy()
    df["adj_price"] = df["price"] * (1.0 + multipliers["delta_ins"]) * multipliers["M_prc_fric"]
    df["adj_tons"] = df["tons"] * multipliers["M_deliv"]

    m = ConcreteModel()
    idx = list(df.index)
    m.x = Var(idx, domain=NonNegativeReals)  # tons

    total_cost = sum(m.x[i] * df.loc[i, "adj_price"] for i in idx)
    m.Budget = Constraint(expr=total_cost <= budget_musd * 1_000_000)
    m.Caps = Constraint(expr=sum(m.x[i] for i in idx) <= sum(df["adj_tons"]))

    cal_from_ton = [ (df.loc[i,"kcal_per_kg"] * 1000.0) for i in idx ]
    total_cals = sum(m.x[i]*cal_from_ton[i] for i in idx)
    m.Obj = Objective(expr=total_cals, sense=maximize)

    from pyomo.opt import SolverFactory
    opt = SolverFactory("glpk")
    res = opt.solve(m, tee=False)

    buy_plan = []
    for i in idx:
        buy_plan.append({
            "commodity": df.loc[i, "commodity"],
            "tons": float(m.x[i].value or 0.0),
            "unit_price": float(df.loc[i, "adj_price"]),
        })

    total_cost_val = sum(p["tons"]*p["unit_price"] for p in buy_plan)
    total_cals_val = sum(p["tons"]*(df.loc[df["commodity"]==p["commodity"],"kcal_per_kg"].iloc[0]*1000.0) for p in buy_plan)

    return {
        "buy_plan": buy_plan,
        "total_cost_usd": total_cost_val,
        "total_calories": total_cals_val
    }
