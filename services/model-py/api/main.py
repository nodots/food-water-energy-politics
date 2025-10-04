from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fwe_model.types import ScenarioInput
from fwe_model.pipeline import run_pipeline

app = FastAPI(title="FWE Model API", version="0.1.0")

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run-scenario")
def run_scenario(req: ScenarioInput):
    result = run_pipeline(req)
    return result.model_dump()
