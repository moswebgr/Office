#define AppName "MosSuite"
#ifndef AppVersion
  #define AppVersion "1.0.0"
#endif
#ifndef SourceDir
  #define SourceDir "dist/MosSuite-Windows-1.0.0"
#endif

[Setup]
AppId={{A7B5C1A2-89B4-4C8A-9E6B-7D2F6E2C4A10}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher=MosSuite
AppPublisherURL=https://moswebgr.github.io/Office/
AppSupportURL=https://github.com/moswebgr/Office/issues
DefaultDirName={localappdata}\Programs\MosSuite
DefaultGroupName=MosSuite
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog
OutputDir=dist
OutputBaseFilename=MosSuite-Setup-{#AppVersion}
SetupIconFile={#SourceDir}\assets\mossuite.ico
UninstallDisplayIcon={app}\assets\mossuite.ico
WizardStyle=modern
ArchitecturesAllowed=x64
ArchitecturesInstallIn64BitMode=x64
Compression=lzma2
SolidCompression=yes
CloseApplications=yes
RestartApplications=no
VersionInfoVersion={#AppVersion}.0
VersionInfoProductName=MosSuite
VersionInfoCompany=MosSuite
VersionInfoDescription=MosSuite desktop launcher installer
ChangesAssociations=no

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Additional shortcuts:"; Flags: unchecked

[Files]
Source: "{#SourceDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{autoprograms}\MosSuite"; Filename: "{app}\MosSuite.exe"; IconFilename: "{app}\assets\mossuite.ico"; WorkingDir: "{app}"
Name: "{autodesktop}\MosSuite"; Filename: "{app}\MosSuite.exe"; IconFilename: "{app}\assets\mossuite.ico"; WorkingDir: "{app}"; Tasks: desktopicon

[Run]
Filename: "{app}\MosSuite.exe"; Description: "Launch MosSuite"; Flags: postinstall nowait skipifsilent
