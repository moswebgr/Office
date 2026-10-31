# MosSuite Windows Launcher

Native C++ Windows host using Microsoft Edge WebView2. The interface is shared with the Linux launcher design.

## Build
Open the repository in Visual Studio 2022 with the Desktop development with C++ workload, then build using the workflow in `.github/workflows/mossuite-windows.yml`.

The build downloads the official Microsoft WebView2 SDK NuGet package. Windows requires the Microsoft Edge WebView2 Runtime. Offline app copies are stored under `%LOCALAPPDATA%\\MosSuite\\offline-apps`.

The launcher downloads the same four MosSuite web apps and shared assets as the Linux edition. Apps requiring Microsoft sign-in, cloud services, or external libraries still need internet access.
