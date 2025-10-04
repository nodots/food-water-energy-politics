import axios from "axios";

export interface RunScenarioReq {
  PI: number;
  CI: 0 | 1 | 2 | 3;
  D_weeks: number;
  demand_cal_per_cap_day?: number;
  population_m?: number;
  budget_musd?: number;
  seed?: number;
}

export interface RunScenarioResp {
  kpis: Record<string, number>;
  diagnostics: Record<string, number>;
  notes: string[];
}

export function makeClient(baseURL = "http://localhost:8081") {
  const http = axios.create({ baseURL, timeout: 30000 });
  return {
    async runScenario(req: RunScenarioReq): Promise<RunScenarioResp> {
      const { data } = await http.post<RunScenarioResp>("/run-scenario", req);
      return data;
    }
  };
}
