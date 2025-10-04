#!/usr/bin/env node
import { Command } from "commander";
import { makeClient } from "./sdk.js";

const program = new Command();

program
  .name("fwe")
  .description("FWE posture-aware model CLI")
  .version("0.1.0");

program.command("run")
  .requiredOption("--pi <num>", "Posture Index -1..+1", (v)=>parseFloat(v))
  .requiredOption("--ci <int>", "Conflict Intensity 0..3", (v)=>parseInt(v))
  .requiredOption("--weeks <int>", "Duration in weeks", (v)=>parseInt(v))
  .option("--pop <num>", "Population (millions)", (v)=>parseFloat(v), 5.9)
  .option("--budget <num>", "Budget (M USD)", (v)=>parseFloat(v), 500)
  .option("--seed <int>", "Random seed", (v)=>parseInt(v))
  .option("--host <url>", "Model API URL", "http://localhost:8081")
  .action(async (opts) => {
    const client = makeClient(opts.host);
    const resp = await client.runScenario({
      PI: opts.pi, CI: opts.ci, D_weeks: opts.weeks,
      population_m: opts.pop, budget_musd: opts.budget, seed: opts.seed
    });
    console.log("KPIs:", resp.kpis);
    console.log("Diagnostics:", resp.diagnostics);
    if (resp.notes?.length) {
      console.log("Notes:");
      for (const n of resp.notes) console.log(" -", n);
    }
  });

program.parseAsync().catch((e) => {
  console.error(e);
  process.exit(1);
});
