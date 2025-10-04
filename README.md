# Food • Water • Energy • Politics (Posture-aware Model)

This repo contains a Python FastAPI microservice that runs a minimal posture-aware FWE model **and** a TypeScript CLI/SDK to drive it.

## Quick start

### Python API
```bash
cd services/model-py
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# Install GLPK if not present (mac: brew install glpk)
uvicorn api.main:app --port 8081
```

### TypeScript CLI
```bash
cd ts
npm i
npm run dev -- run --pi 0 --ci 2 --weeks 12
```

### Docker (API only)
```bash
cd services/model-py
docker build -t fwe-model:dev .
docker run -p 8081:8081 fwe-model:dev
```

## React dashboard
Use the single-file component I shared in ChatGPT to create a Vite React app and point it to the API (or drop it into a `ui/` folder if you later add one).

## What’s inside
- `services/model-py`: FastAPI + Pyomo + simple uncertainty/simulation blocks
- `ts`: SDK + CLI to run scenarios from Node/TS

## Next steps
- Add proper calibration (SALib / PyMC), hedging/margin layer, and water/energy coupling.
- Add a React UI package (Vite) that calls the API.
