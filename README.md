# MosSuite

**A free, open-source productivity suite by MosWeb.**

MosSuite is a planned family of independent, interoperable productivity tools with a shared design system and a central website. The project aims to offer practical alternatives to paid office and collaboration software—without copying proprietary branding, code, or interfaces.

🌐 **Website:** GitHub Pages can publish `index.html` from the `main` branch once Pages is enabled in repository settings.

## Planned applications

| App | Purpose | First milestone |
|---|---|---|
| **WriteFlow** | Documents, rich text, export to Markdown/HTML, later DOCX | Browser-based editor with local saving |
| **GridForge** | Spreadsheets, formulas, CSV import/export, charts | Editable grid and CSV support |
| **SlideSpark** | Presentations and slide layouts | Create, reorder and present slides |
| **MailNest** | Email client interface for user-configured providers | Responsive inbox UI; no mail service included initially |
| **NoteHarbor** | Notes, notebooks, tags and search | Local-first notes and full-text search |
| **CloudShelf** | File library, sharing concepts and storage integrations | File dashboard UI; storage backend later |
| **MeetMesh** | Team chat and video-meeting entry point | Chat prototype; real-time server later |
| **PlanPilot** | Tasks, calendars and project planning | Tasks, due dates and board view |
| **DiagramDock** | Flowcharts, diagrams and whiteboards | Canvas with basic shapes and connectors |
| **DataNest** | Lightweight database and form builder | Tables, fields and CSV import/export |

Names are working titles and should be checked for trademark/domain conflicts before public commercial launch.

## Principles

- Free to use, with source code available.
- Open standards and portable user data.
- Privacy-first, with local-first functionality where practical.
- Responsive layouts for desktop, tablet and mobile.
- Accessibility and keyboard navigation.
- Shared authentication and integrations only when a secure backend is ready.
- No claim of compatibility or affiliation with Microsoft.

## Current status

This repository contains the public landing page, project roadmap, and the first functional WriteFlow browser editor. WriteFlow supports rich-text editing, headings, lists, alignment, links, word/character counts, local browser autosave, opening plain-text/Markdown files, HTML export, and printing. It is a local-first prototype, not a cloud document service; drafts stay in the current browser. The other application cards remain planned scope, not completed applications.

## Run locally

Open `index.html` in a modern browser to view the landing page. Open `writeflow/index.html` to use WriteFlow. Both are static HTML files and do not require a build step. WriteFlow saves drafts to the browser's local storage; export documents regularly as backups.

## Publish with GitHub Pages

1. Open the repository **Settings → Pages**.
2. Choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`.
4. Save and wait for GitHub Pages to publish the site.

## Contributing

Issues and pull requests are welcome. Before contributing, check the roadmap and describe the feature, its intended behavior, and how it was tested.

## License

MIT. See [LICENSE](LICENSE).
