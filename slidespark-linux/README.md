# SlideSpark for Linux

Standalone Linux desktop edition of SlideSpark, the MosSuite presentation editor. The app UI is bundled locally and does not require a browser to launch.

## Packages and compatibility

GitHub Actions builds packages for **x86_64 (Intel/AMD 64-bit)** and **ARM64**:

- **AppImage** — portable option for many desktop Linux distributions.
- **DEB** — Debian, Ubuntu, Linux Mint and compatible distributions.
- **RPM** — Fedora, openSUSE and compatible distributions.
- **Pacman package** — Arch Linux and compatible distributions.
- **TAR.GZ** — portable archive for manual setup and other distributions.

No single Linux package can guarantee compatibility with every distribution/version. AppImage or TAR.GZ is usually the broadest starting point; older systems may need compatible system libraries. AppImage may require FUSE compatibility on some distributions.

## Download and run

Download the package matching your CPU architecture and distribution from the repository's GitHub Releases page.

For AppImage:

```bash
chmod +x SlideSpark-*-x64.AppImage
./SlideSpark-*-x64.AppImage
```

## Build from source

Requires Node.js 20+ and npm.

```bash
cd slidespark-linux
npm install
npm run dist:linux
```

The build copies the repository's `SlideSpark.png` into the packaging resources so the installed desktop application receives its icon. Build artifacts are created in `slidespark-linux/dist/`.

Release publishing happens when a version tag such as `v1.0.1` is pushed. GitHub Actions then builds packages for x64 and ARM64 and attaches them to the GitHub Release.

SlideSpark is an independent MosSuite project and is not affiliated with Microsoft.
