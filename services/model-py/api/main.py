from fastapi import FastAPI
from fwe_model.types import ScenarioInput
from fwe_model.pipeline import run_pipeline

app = FastAPI(title="FWE Model API", version="0.1.0")


@app.post("/run-scenario")
def run_scenario(req: ScenarioInput):
    result = run_pipeline(req)
    return result.model_dump()
