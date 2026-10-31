#!/usr/bin/env bash
set -euo pipefail

VERSION="1.0.2"
TAG="launcher-v${VERSION}"
BASE_URL="https://github.com/moswebgr/Office/releases/download/${TAG}"

if ! command -v dpkg >/dev/null 2>&1; then echo "This installer supports Debian/Ubuntu-based Linux only." >&2; exit 1; fi
if ! command -v curl >/dev/null 2>&1; then echo "curl is required; install it with sudo apt-get install curl." >&2; exit 1; fi
ARCH="$(dpkg --print-architecture)"
case "$ARCH" in
  amd64) ASSET="MosSuite-Linux-${VERSION}-amd64.deb" ;;
  arm64) ASSET="MosSuite-Linux-${VERSION}-arm64.deb" ;;
  *) echo "Unsupported architecture: $ARCH (supported: amd64, arm64)." >&2; exit 1 ;;
esac

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT
DEB_PATH="$TMP_DIR/$ASSET"

echo "Detected architecture: $ARCH"
echo "Downloading $ASSET..."
curl --fail --location --retry 3 --output "$DEB_PATH" "$BASE_URL/$ASSET"
if ! dpkg-deb --info "$DEB_PATH" >/dev/null; then echo "Downloaded file is not a valid Debian package." >&2; exit 1; fi
sudo apt-get update
sudo apt-get install -y "$DEB_PATH"
echo "MosSuite installation completed. Find MosSuite in your applications menu."
