# AQLEN Ω v0.2 Dashboard Data Model

Purpose: define the first dashboard shape for AQLEN Ω.

The dashboard should make the ledger visible without exaggerating the maturity of the underlying science or product.

## Dashboard principle

Every number, claim, status, and recommendation must trace back to at least one receipt or evidence anchor.

If a value is unknown, assumed, simulated, or literature-supported rather than measured, the dashboard should show that status plainly.

## Primary dashboard views

### 1. Evidence Lane View

Shows the evidence anchors currently used by AQLEN.

Fields:

- evidence ID
- title
- platform family
- source type
- date/year
- claim summary
- safe wording
- boundary note
- linked modules

Purpose:

- prevent merged claims
- show which evidence supports which architecture choices
- keep public language source-aware

### 2. 10-Layer Architecture View

Shows the v0.2 module registry.

Fields:

- module number
- module name
- purpose
- inputs
- outputs
- boundary note
- open issues
- related receipt types

Purpose:

- turn the poster into product architecture
- make each module buildable
- keep design language connected to ledger objects

### 3. Qubit Provenance View

Shows device/qubit identity and manufacturing lineage.

Fields:

- qubit ID
- wafer/batch/die/device references
- material/process notes
- geometry notes
- calibration history links
- known risk flags

Purpose:

- answer where the qubit came from
- connect fab variation to performance data

### 4. Error Timeline View

Shows noise-origin events and drift across time.

Fields:

- event ID
- timestamp
- qubit/device references
- operation context
- suspected source
- confidence
- evidence/source status
- downstream calibration actions

Purpose:

- detect repeated error patterns
- support drift and mitigation analysis

### 5. Calibration Receipts View

Shows before/action/after calibration receipts.

Fields:

- calibration receipt ID
- qubit/device reference
- before metrics
- action taken
- after metrics
- delta
- residual risk
- human reviewer

Purpose:

- make calibration learning reusable
- preserve what was tried and whether it helped

### 6. Readiness Score View

Shows bounded readiness scores for specific QEC or system targets.

Fields:

- score ID
- target context
- score value
- readiness band
- score inputs
- source status per input
- missing values
- boundary notes
- linked evidence anchors

Purpose:

- avoid one-number hype
- make score confidence visible
- show which assumptions drive the score

### 7. Claim Boundary View

Shows safe vs unsafe wording.

Fields:

- claim type
- status
- safe wording
- unsafe wording
- supporting evidence
- current release status

Purpose:

- protect the project from overclaiming
- prepare public-safe copy for posters, README, deck, and website

## Source-status labels

Every important dashboard value should be one of:

- measured
- simulated
- literature-supported
- assumed
- unknown
- reviewer-entered
- derived

## Minimal data objects

```text
evidence_anchor
qubit_provenance_receipt
noise_origin_event
calibration_drift_receipt
readiness_score
module_registry_entry
claim_boundary_entry
```

## Minimal graph edges

```text
evidence_anchor supports module_registry_entry
qubit_provenance_receipt observes device_or_qubit
noise_origin_event occurs_on qubit_provenance_receipt
calibration_drift_receipt responds_to noise_origin_event
readiness_score summarizes receipt_set
readiness_score uses evidence_anchor
claim_boundary_entry constrains public_claim
```

## First dashboard build target

AQLEN v0.2 dashboard should be a read-only prototype first.

Recommended screens:

1. Overview
2. Evidence Lanes
3. Module Stack
4. Error Timeline
5. Calibration Receipts
6. Readiness Score
7. Claim Boundaries

## Non-goals for v0.2

- no live quantum hardware integration
- no claim of autonomous experiment execution
- no production QEC certification
- no hidden confidence assumptions

## Acceptance test

A reviewer should be able to click any score, claim, or recommendation and answer:

1. What receipt supports this?
2. What evidence anchor supports this?
3. What is assumed or unknown?
4. What claim boundary applies?
