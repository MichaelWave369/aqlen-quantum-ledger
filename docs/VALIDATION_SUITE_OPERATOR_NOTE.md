# Validation Suite Operator Note

When the dashboard validator fails, do not treat it as a cosmetic problem. Treat it as a ledger integrity signal.

A broken edge, missing boundary, duplicated node, or corrupted trace can cause the dashboard to imply a stronger or cleaner relationship than the payload actually supports.

Use:

```bash
python tools/validate_dashboard_fixture_suite.py
```

Then triage with:

```text
docs/DASHBOARD_VALIDATION_TRIAGE_GUIDE.md
```
