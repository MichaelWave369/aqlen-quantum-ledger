# AQLEN ↔ NBG-QM1 · Local evidence graph bridge

AQLEN's React Research Console accepts an NBG-QM1 graph export via
**Import JSON** in the browser. The import adapter recognizes the
\`nbg-qm1-bridge-<seed>\` identity and \`v0.1.0\` version, checks a **narrow
three-node/two-edge contract**, and converts it into the existing AQLEN
dashboard-payload shape.

The adapter does not contact either repository, mutate AQLEN registries,
write persistent memory, promote research claims, or send samples to a server.

## Use

1. Open the NBG GitHub Pages **QM1 Mining** research station.
2. Run the local browser **double-SHA256** scheduler experiment.
3. Choose **Export AQLEN receipt graph** (not the general QM1 receipt).
4. Open the AQLEN React Research Console, choose **Import JSON** and select
   the exported graph. The diagram displays the two simulated/software-only
   evidence anchors and their module dependency.
5. This is a read-only imported **session view**. Reset/reload to return to
   the built-in demonstration. Import is not physical quantum evidence.

## Contracts

- External graph must have \`graph_id\` \`nbg-qm1-bridge-N\` with N from
  0 to 65535, \`version: v0.1.0\`, nodes:
  \`module-qm1\` (type module),
  \`evidence-pow\` and \`evidence-grover\` (type evidence_anchor),
  plus two \`derived_from\` edges.
- All nodes require explicit claim boundaries and restricted source status.
- Software summaries never report measured energy. The PoW node must
  summarize **SEQUENTIAL**, **SEEDED_SHUFFLE**, **NBG_GEAR**.
- Grover summary is an idealized **classical simulation**, not evidence
  of a quantum circuit on hardware.
- The app's existing \`validatePayload\` runs **after** this adapter.
- The source remains untrusted; shape validation is **not scientific
  verification**, cryptographic signing or independent reproducibility.

The adapter does NOT transform these nodes into \`qubit_receipt\`,
\`calibration_receipt\` or \`readiness_score\`.

Local check (from \`web\` directory): \`npm test\`. Static site build:
\`npm run build\`. All original dashboard graph fixtures remain unmodified.
