# MosSuite

**A free, open-source productivity suite with its own identity.**

MosSuite brings independent productivity apps together in one workspace. The project aims to make everyday productivity tools more accessible to Linux users and the wider open-source community, while keeping its own names, branding, and direction.

🌐 **Website:** https://moswebgr.github.io/Office/  
🧩 **Unified workspace:** https://moswebgr.github.io/Office/workspace.html  
📦 **Source code:** https://github.com/moswebgr/Office  
💬 **Discord community:** https://discord.gg/jhTGyEAtV  
🐛 **Report a bug or suggest a feature:** [Open an issue](https://github.com/moswebgr/Office/issues)

## Applications

| App | Purpose | Current focus |
|---|---|---|
| **GridForge** | Calendar and schedule management | Calendar views, events, and event import/export |
| **SlideSpark** | Presentation creation | Create and edit slides, organize content, use design tools, and present slides |
| **DataNest** | Structured data management | Tables, custom fields, records, and CSV import/export |
| **MailNest** | Email workspace | Mail folders and message views, composing email, local drafts, and connection controls |

Open apps from the [MosSuite home page](https://moswebgr.github.io/Office/#apps) or use the [unified workspace](https://moswebgr.github.io/Office/workspace.html).

## Built with Linux users in mind

MosSuite is intended to give Linux users more open-source productivity options in one place. The browser-based apps can be used on Linux with a modern browser. **SlideSpark also has a Linux desktop packaging project**; check the repository's [Releases](https://github.com/moswebgr/Office/releases) for packages that are actually published.

Linux packaging and support can vary by app, release, and CPU architecture. Do not assume that every app currently has a native Linux installer.

## Project principles

- **Free and open source:** inspect the code, report problems, and help improve the project.
- **Independent identity:** MosSuite has its own app names and branding.
- **Practical data portability:** standard formats such as CSV are supported where implemented.
- **Honest feature status:** some features work locally in the browser; other workflows may require provider access, configuration, or additional development.
- **Community-led improvement:** issues and pull requests help shape the roadmap.
- **No affiliation with third-party office-suite vendors:** MosSuite is an independent project.

## Current status and limitations

MosSuite is under active development and should not yet be treated as a complete, production-ready replacement for every office or productivity workflow. The repository includes the landing page, shared workspace, and browser-based foundations for its apps. Features and integrations may vary in completeness.

Some data is stored in the current browser profile, so use available export options to keep backups. Cloud synchronization, shared accounts, and real-time collaboration are not available across the whole suite by default. MailNest's external email workflows require valid provider connection and configuration; an interface control alone does not mean that sending or syncing is enabled.

Please check the relevant app and release notes before relying on a feature for important work.

## Run locally

1. Clone or download this repository.
2. Open `index.html` in a modern browser to view the landing page.
3. Open an app from its directory: `gridforge/`, `slidespark/`, `datanest/`, or `mailnest/`.

No build step is required for the static landing page. Some browser features and provider integrations may require serving the files through a local web server or configuring the relevant service.

## Publish with GitHub Pages

The public site is hosted at https://moswebgr.github.io/Office/.

To check or configure GitHub Pages:

1. Open repository **Settings → Pages**.
2. Select the publishing method configured for this repository.
3. If using **Deploy from a branch**, choose branch `main` and folder `/ (root)`.
4. Save and check the **Actions** tab for deployment status.

## Contributing

**Contributions of all experience levels are welcome.** You can help with code, testing, accessibility, documentation, Linux packaging, bug reports, and ideas.

### Good ways to get started

1. Browse [open issues](https://github.com/moswebgr/Office/issues).
2. Look for issues labelled `good first issue` or `help wanted`, when available.
3. If you plan a larger change, open an issue first so we can discuss the approach.
4. Fork the repository, create a focused branch, and make your changes.
5. Test the change and open a pull request with a clear description and testing notes.

When reporting a bug, include the app, operating system and browser (or package version), steps to reproduce it, what you expected, and what happened. Please remove passwords, tokens, API keys, and personal data from reports and screenshots.

You do **not** need direct write access to contribute: you can work from a fork and submit a pull request. Changes are reviewed before they are merged.

## Contributors & credits

We want to recognize the people who help make MosSuite better. Contributors may be credited for meaningful code, testing, documentation, design, accessibility, bug reports, and Linux packaging contributions. Once contributions are accepted, the project can add contributors to a credits section or dedicated contributors page.

## License

MosSuite is released under the [MIT License](LICENSE).
