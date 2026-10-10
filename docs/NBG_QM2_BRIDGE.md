# NBG-QM2 repeated-trial evidence import (AQLEN)

AQLEN's React console now accepts NBG's **QM2 full repeated-trial JSON receipt**
directly via its existing **Import JSON** control. It is converted, in memory,
to the existing AQLEN dashboard payload, not written to AQLEN's ledger.

## Workflow

1. Open NBG's [QM2 research lab](https://michaelwave369.github.io/NestedBubbleGear/#qm2).
2. Run the browser benchmark with 3, 6, or 9 rounds.
3. Download the **full QM2 experiment receipt**.
4. Open the [AQLEN research console](https://michaelwave369.github.io/aqlen-quantum-ledger/).
5. Click **Import JSON** and select that QM2 JSON receipt. Select graph nodes
   to inspect the protocol, per-strategy median and quartiles, the
   self-reported reference audit, and paired ratio summaries.

Existing QM1 graph imports and generic dashboard imports remain supported.

## Qualification boundary

AQLEN's QM2 adapter performs **structural and arithmetic consistency** checks:
- Exact \`nbg.qm2.repeated-trial.v1\` and \`nbg.qm2.receipt.v1\` identifiers.
- Strict \`SOFTWARE_MEASURED_WITH_SYNTHETIC_INPUTS\` origin and
  \`DEMONSTRATION_ONLY\` authority, no promotion, null physical energy.
- Only declared domains / trial counts / SHA-256d toy targets; three
  known scheduler strategies in every round.
- Shared header seed per paired round, identical full-domain hashes,
  accepted-hit counts, unique nonces (as **self-reported**), reported
  reference-audit controls and balanced order positions.
- Arithmetic re-derivation of median, quartiles, mean, standard
  deviation, throughput from elapsed time and paired throughput ratios.
- Import is rejected if the version, control flags or arithmetic disagree.

**Important:** This is not independent cryptographic verification. AQLEN
does not rehash the entire claimed nonce universe when importing a receipt.
An attacker could forge self-consistent metrics and pass the checks.
The adapter does not verify hardware, energy, science, statistical
significance, Bitcoin consensus rules or quantum effects.

The imported graph is a **temporary local session view**. No external calls,
storage writes, cloud uploads, network mining, AQLEN readiness updates, or
qubit/calibration receipt promotion take place.

The original exported QM2 receipt remains in the user's control.
The public viewer's existing 2 MB import limit still applies.

## Acceptance

From AQLEN's \`web/\`: \`npm test && npm run build\`.
Integration tests use an intentionally self-consistent synthetic receipt fixture
with the exact QM2 v1 shape; this is a **shape/arithmetic** fixture, not a genuine
SHA-256d measurement. Negative tests tamper with controls, measured trials,
reference hit counts, distributions, and provenance.

No NBG source checkout or dependency is required for runtime or CI.
