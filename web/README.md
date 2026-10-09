# AQLEN Ω Research Console (React)

A static React + Vite companion for the public AQLEN quantum ledger. This is a **research viewer**, not a quantum simulator, quantum device controller, remote ledger service, or certification of scientific truth.

## Run locally

From the repository root:

    cd web
    npm install
    npm test
    npm run dev

For a production build, run `npm run build`. The result is `web/dist`.

## Privacy and source of data

- The default graph is bundled at build time from `dashboard/receipt_graph_dashboard_demo.json`. It contains illustrative data.
- JSON imports are processed entirely in the browser's memory. The application does not upload the file, call a backend, retain imported data between sessions, or operate quantum hardware.
- Graph validation checks shape, IDs, claim boundaries and link integrity. It does not confirm experiments or scientific source claims.
- Claim boundaries and warnings are always visible in the interface.
- Never commit private or sensitive laboratory data to a public repository or Pages build.

## Enable GitHub Pages

1. Merge the React Pages pull request to `main`.
2. Under **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source.
3. The **Publish AQLEN React console** workflow builds and deploys on pushes to `main`. You may also run it manually in **Actions**.
4. Visit https://michaelwave369.github.io/aqlen-quantum-ledger/.

Vite's base path is set to `/aqlen-quantum-ledger/`. The prior standalone renderer under `dashboard/` is unchanged.

## Claim posture and licensing

The console never asserts that fault-tolerant quantum computing is solved or that readiness scoring demonstrates quantum advantage. See `docs/CLAIM_BOUNDARY_MATRIX.md`, `docs/DASHBOARD_PAYLOAD_SCHEMA_v0_7.md` and `docs/LOCAL_FIRST_DASHBOARD_BOUNDARY.md`.

The repository software is offered under the root MIT `LICENSE`. Third-party literature, logos, figures and externally owned material retain their own rights and attribution requirements.
