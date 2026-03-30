# Finastra Intelligence Suite

A production-grade, multi-application intelligence platform for Finastra, built entirely on React, Vite, Tailwind CSS, and Playwright. The suite consists of an orchestrating landing page, a deterministic lead generation engine, and an automated presentation deck generator.

## 🏗️ Architecture

The repository is structured as a **Single Unified Web Application**.

**`landing-page/`**: The unified entry point to the Finastra Intelligence suite. It uses `react-router` to cleanly segment the application into modules, sharing styles and dependencies:
1. **Landing Hub (`/`)**: Dynamic video embeds and routing into the respective web applications.
2. **Lead Generation Engine (`/lead-gen`)**: The deterministic scoring and hypothesis generation engine. Pulls live FDIC data, computes features locally, scores all US banks across 34 Finastra products using heuristic models, and renders a segmented leaderboard with CSV export capabilities.
3. **Value-Selling Pitchbook (`/pitchbook`)**: Generates bespoke, data-driven pitch decks on the fly using Live FDIC metrics (efficiency ratio, net income, NIM, etc.). The deck dynamically sizes to a 16:9 10-slide presentation optimized for C-suite buyers.

## 🚀 Quick Start

The entire suite runs off a single Vite configuration on a single port (default `5175`).

```bash
# Start the unified suite
cd landing-page
npm install
npm run dev
```

## 🧪 Testing Stack

The project uses a comprehensive testing approach ensuring logic correctness, live API integrity, and E2E behavioral validation.

### Scripts
Run the following from the **Repository Root** (`c:\Users\vcham\Documents\VS Code Programs\Finastra\`):

- **`npm run test:all`** - Runs all unit tests and all Playwright UI tests
- **`npm run test:unit`** - Runs all logic/feature unit tests via Vitest in `landing-page`
- **`npm run test:e2e`** - Runs the E2E Playwright browser automation suite in `landing-page`

### Test Layers

1. **Determinism (Vitest)**
    - Verifies numeric stability in the `lending_score`, `payments_score`, and `combined_score`.
    - Pure logic assertions on hypothesis mapping and CSV exports.
    - Presentation math, currency parsing, and numeric rendering validated.
2. **FDIC Live API Integrity (Vitest)**
    - Specific tests mapped directly against the FDIC API (`/institutions` and `/financials`).
    - Verifies real JPM and BofA data to ensure FDIC schema has not changed and values (like `EEFFR` and `NONII`) are correctly populated.
    - Enforces the **Fail Loudly** doctrine for broken upstream APIs.
3. **End-to-End Visual Flow (Playwright)**
    - Confirms that the `/lead-gen` board renders and that segmentation selects interact properly.
    - Confirms that the `/pitchbook` search triggers 10 valid slides without console unhandled runtime errors.

## 📐 Design Philosophy

1. **Fail Loudly Doctrine**: Silent failures are strictly prohibited. Missing live FDIC metrics trigger visible fallback errors rather than silently substituting `0`.
2. **Zero Mock Data in Prod**: Logic tests use fixed objects, but integrity tests *always* hit the live network.
3. **Pure Frontend**: Deprecated backend infrastructure and SQLite have been migrated seamlessly to browser-based React runtimes, vastly simplifying the deployment topology.
4. **Rich Aesthetics**: Uses native Finastra magenta (fuchsia/purple) gradients, Tailwind-powered glassmorphism panels, and container layout algorithms.
