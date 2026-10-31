# MosSuite Linux Desktop

MosSuite is packaged as a real Linux desktop application. The Debian and RPM packages register MosSuite in the desktop application menu; AppImage is the portable alternative.

## Install

1. Open [GitHub Releases](https://github.com/moswebgr/Office/releases/latest).
2. Download the package for your CPU architecture:
   - Ubuntu, Debian, Linux Mint: `.deb`
   - Fedora and compatible distributions: `.rpm`
   - Other distributions: `.AppImage`
3. Install the downloaded package using your distribution's package installer. For Debian/Ubuntu, you can also run:

   ```bash
   sudo apt install ./MosSuite-Linux-1.0.1-amd64.deb
   ```

4. Open **MosSuite** from the applications menu.

The AppImage can be made executable and launched directly:

```bash
chmod +x MosSuite-Linux-1.0.1-x64.AppImage
./MosSuite-Linux-1.0.1-x64.AppImage
```

## Notes

- Requires an internet connection; the suite's applications load from MosSuite online services.
- MailNest continues to use Microsoft sign-in.
- Releases are built for x64 and ARM64 Linux systems.
