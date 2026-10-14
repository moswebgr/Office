# MosSuite

**A free, open-source productivity suite by MosWeb.**

MosSuite is a planned family of independent, interoperable productivity tools with a shared design system and a central website. The project aims to offer practical alternatives to paid office and collaboration software—without copying proprietary branding, code, or interfaces.

🌐 **Website:** GitHub Pages can publish `index.html` from the `main` branch once Pages is enabled in repository settings.

## Applications

MosSuite focuses on five apps:

| App | Purpose | Current foundation |
|---|---|---|
| **GridForge** | Spreadsheets, formulas, CSV import/export | Editable spreadsheet and CSV support |
| **SlideSpark** | Presentations and slide layouts | Create, reorder and present slides |
| **PlanPilot** | Tasks and project planning | Tasks, due dates and priorities |
| **DataNest** | Lightweight database and data tables | Tables, records and CSV import/export |
| **MailNest** | Email workspace | Inbox interface and local drafts; mail sending/provider integration is not enabled by default |

## Principles

- Free to use, with source code available.
- Open standards and portable user data.
- Privacy-first, with local-first functionality where practical.
- Responsive layouts for desktop, tablet and mobile.
- Accessibility and keyboard navigation.
- Shared authentication and integrations only when a secure backend is ready.
- No claim of compatibility or affiliation with Microsoft.

## Current status

This repository contains the public landing page and browser-based foundations for the five MosSuite apps. These are useful starting implementations, not production-ready substitutes for commercial office/collaboration suites. Features are local-first where practical; hosted services, shared accounts, real-time collaboration, and cloud sync are not implemented.

## Run locally

Open `index.html` in a modern browser to view the landing page. The selected applications live in `gridforge/`, `slidespark/`, `planpilot/`, `datanest/`, and `mailnest/`. No build step is required. Storage is local to the browser where supported; export backups regularly.

## Publish with GitHub Pages

1. Open the repository **Settings → Pages**.
2. Choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`.
4. Save and wait for GitHub Pages to publish the site.

## Contributing

Issues and pull requests are welcome. Before contributing, check the roadmap and describe the feature, its intended behavior, and how it was tested.

## License

MIT. See [LICENSE](LICENSE).
