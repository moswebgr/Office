# MosSuite

**A free, open-source productivity suite with its own identity.**

MosSuite brings independent productivity apps together in one workspace.

🌐 **Website:** https://moswebgr.github.io/Office/  
🧩 **Unified workspace:** https://moswebgr.github.io/Office/workspace.html  
📦 **Source code:** https://github.com/moswebgr/Office  
💬 **Discord community:** https://discord.gg/jhTGyEAtV  
🐛 **Report a bug:** https://github.com/moswebgr/Office/issues

## Linux desktop launcher

On Debian/Ubuntu, install MosSuite with the automatic architecture-detecting installer:
```bash
curl -fsSL https://raw.githubusercontent.com/moswebgr/Office/main/install-mossuite.sh | bash
```
The installer detects AMD64 or ARM64, downloads the matching `.deb` from the [Releases page](https://github.com/moswebgr/Office/releases), refreshes package lists, and installs it through APT so dependencies are resolved.

For manual installation, use the AMD64 package on most Intel/AMD 64-bit PCs and ARM64 only on ARM computers:
```bash
sudo apt-get install ./MosSuite-Linux-<version>-<architecture>.deb
```
AppImage builds are also published for supported architectures.

## Applications

| App | Purpose |
|---|---|
| GridForge | Calendars, schedules, and events |
| SlideSpark | Creating and presenting slides |
| DataNest | Structured data, tables, and records |
| MailNest | Mail folders, messages, and drafts |

Open apps from the [MosSuite home page](https://moswebgr.github.io/Office/#apps) or [unified workspace](https://moswebgr.github.io/Office/workspace.html).

## Project status

MosSuite is under active development and is not yet a complete, feature-for-feature replacement for Microsoft Office. Features and integrations may vary in completeness. Some data is stored in the current browser profile, so use available export options to keep backups. MosSuite is independent and is not affiliated with Microsoft.

## Run locally

Clone the repository and open `index.html` in a modern browser. The static landing page requires no build step; some browser features may require a local web server.

## License

MIT License.