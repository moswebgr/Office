# MosSuite

**Free, open-source productivity tools by MosWeb.**

MosSuite brings a growing set of browser-based productivity apps together under one website and a shared visual identity. The goal is practical, accessible tools with portable data and a consistent experience—without copying proprietary branding, code, or interfaces.

🌐 **Website:** https://moswebgr.github.io/Office/  
🧩 **Open the unified workspace:** https://moswebgr.github.io/Office/workspace.html  
📦 **Source code:** https://github.com/moswebgr/Office

## Applications

| App | What it does | Current features |
|---|---|---|
| **GridForge** | Calendar and schedule management | Calendar views, event management, and event import/export |
| **SlideSpark** | Presentation creation | Create and edit slides, reorder content, use design tools, and present slides |
| **PlanPilot** | Tasks and project planning | Tasks, priorities, due dates, progress tracking, and planning views |
| **DataNest** | Structured data management | Tables, custom fields, records, and CSV import/export |
| **MailNest** | Email workspace | Mail folders and message views, composing email, local drafts, and Outlook connection controls |

Open an app directly from the [MosSuite home page](https://moswebgr.github.io/Office/#apps), or use the unified workspace to navigate between apps.

## Project principles

- **Free and open source:** the code is available for inspection and contribution.
- **Portable data:** use standard formats such as CSV where supported.
- **Local-first where practical:** some features store data in your browser; export backups when available.
- **Responsive experience:** layouts are designed to adapt to desktop and smaller screens.
- **Accessibility:** semantic controls, labels, and keyboard-friendly interactions are part of the design.
- **Honest integrations:** services that need provider access or a backend are identified rather than presented as fully available by default.
- **Independent project:** MosSuite is not affiliated with Microsoft.

## Current status and limitations

MosSuite is actively evolving. The repository includes the landing page, a shared workspace, and browser-based foundations for the five apps. Some features work locally in the browser, while other workflows depend on external provider access or further development. In particular, MailNest's Outlook-related functionality requires a valid connection and configuration; the interface alone does not mean that sending or syncing is automatically enabled.

MosSuite should not yet be considered a complete, production-ready replacement for commercial office suites. Cloud synchronization, shared accounts, and real-time collaboration are not available across the suite by default. Capabilities and integration requirements may change as the project develops.

## Run locally

1. Clone or download this repository.
2. Open `index.html` in a modern browser to view the landing page.
3. Open an app from its folder: `gridforge/`, `slidespark/`, `planpilot/`, `datanest/`, or `mailnest/`.

No build step is required for the static pages. Some browser features and provider integrations may require serving the files from a local web server or configuring the relevant service. Data stored locally remains in that browser profile, so use available export options to keep backups.

## Publish with GitHub Pages

The site is published at https://moswebgr.github.io/Office/.

If you need to configure Pages again:

1. Open the repository **Settings → Pages**.
2. Select **Deploy from a branch** if that is the configured publishing method.
3. Choose branch `main` and folder `/ (root)`.
4. Save the settings and check the **Actions** tab for the deployment status.

## Contributing

Issues, suggestions, and pull requests are welcome.

- Describe the problem or feature clearly.
- Explain the expected behavior.
- Include steps to test the change.
- Avoid committing credentials, API keys, or personal data.

## License

MosSuite is released under the MIT License. See [LICENSE](LICENSE).
