# MosSuite

**A free, open-source productivity suite with its own identity.**

MosSuite brings independent productivity apps together in one workspace. It aims to provide alternatives to familiar commercial productivity tools, with its own app names, branding, and direction. The project aims to make everyday productivity tools more accessible to Linux users and the wider open-source community.

🌐 **Website:** https://moswebgr.github.io/Office/  
🧩 **Unified workspace:** https://moswebgr.github.io/Office/workspace.html  
📦 **Source code:** https://github.com/moswebgr/Office  
💬 **Discord community:** https://discord.gg/jhTGyEAtV  
🐛 **Report a bug or suggest a feature:** [Open an issue](https://github.com/moswebgr/Office/issues)

## Applications

MosSuite's apps are independent projects designed to offer alternatives to familiar Microsoft productivity applications. The comparisons below explain the intended category; they do not imply identical features or affiliation with Microsoft.

| MosSuite app | Alternative to | What it is for |
|---|---|---|
| **GridForge** | Microsoft Outlook Calendar | Organizing calendars, schedules, and events, with event import/export |
| **SlideSpark** | Microsoft PowerPoint | Creating, editing, organizing, designing, and presenting slides |
| **DataNest** | Microsoft Excel | Working with structured data, tables, custom fields, and records, with CSV import/export |
| **MailNest** | Microsoft Outlook Mail | Working with mail folders and messages, composing email, managing local drafts, and configuring mail connections |

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
- **Independent project:** MosSuite is not affiliated with Microsoft. Product names are used only to describe the types of tools MosSuite aims to provide alternatives to.

## Current status and limitations

MosSuite is under active development and should not yet be treated as a complete, feature-for-feature replacement for Microsoft Office or every productivity workflow. The repository includes the landing page, shared workspace, and browser-based foundations for its apps. Features and integrations may vary in completeness.

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
