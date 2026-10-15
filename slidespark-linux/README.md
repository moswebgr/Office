# SlideSpark for Linux

Standalone Linux desktop edition of SlideSpark, the MosSuite presentation editor. It packages the app UI locally and does not require a browser to launch.

## Download

Download the latest **AppImage** (portable) or **.deb** (Debian/Ubuntu) from the GitHub Releases page for this repository.

## Run the AppImage

```bash
chmod +x SlideSpark-*-x64.AppImage
./SlideSpark-*-x64.AppImage
```

On some Linux systems, AppImage may require FUSE 2 compatibility. If it does not launch, use the .deb package where supported.

## Build from source

Requires Node.js 20+ and npm.

```bash
cd slidespark-linux
npm install
npm run dist:linux
```

Packages are created in `slidespark-linux/dist/`. To publish downloadable release assets, push a version tag such as `v1.0.0`; GitHub Actions builds Linux x64 AppImage and Debian packages and attaches them to a GitHub Release.

## Notes

- The Linux package targets x86_64 (Intel/AMD 64-bit) Linux desktops.
- SlideSpark's presentation editor is bundled locally. Internet access may still be needed for features that rely on external sign-in or web resources.
- MosSuite / SlideSpark is an independent project and is not affiliated with Microsoft.
