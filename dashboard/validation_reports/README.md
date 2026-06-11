# Dashboard Validation Reports

This folder is reserved for generated dashboard validation reports.

Planned v0.7 command:

```bash
python tools/write_dashboard_validation_report.py --out dashboard/validation_reports/latest.json
```

Reports should preserve:

- fixture lane: positive, negative, warning,
- pass/fail status,
- validator errors,
- validator warnings,
- payload counts,
- claim-boundary preservation notes.

Generated reports are review artifacts. They do not certify scientific claims.
