def compute_kpis(total_calories: float, population_m: float, demand_cal_per_cap_day: int, delay_days: float):
    cal_per_day_needed = population_m * 1_000_000 * demand_cal_per_cap_day
    days_of_supply = total_calories / cal_per_day_needed
    return {
        "days_of_supply_calories": float(days_of_supply),
        "mean_logistics_delay_days": float(delay_days),
    }
