from pydantic import BaseModel, Field
from typing import Dict, List, Literal, Optional

PostureIndex = float  # -1 .. +1
ConflictIntensity = Literal[0,1,2,3]

class ScenarioInput(BaseModel):
    PI: PostureIndex = Field(..., description="Posture Index [-1..+1]; 0=neutral")
    CI: ConflictIntensity = Field(..., description="Conflict Intensity 0..3")
    D_weeks: int = Field(..., ge=0, description="Duration in weeks")
    demand_cal_per_cap_day: int = 2200
    population_m: float = 5.9
    budget_musd: float = 500.0
    seed: Optional[int] = None

class PipelineResult(BaseModel):
    kpis: Dict[str, float]
    diagnostics: Dict[str, float]
    notes: List[str] = []
