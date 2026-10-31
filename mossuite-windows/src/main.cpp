#define UNICODE
#define _UNICODE
#include <windows.h>
#include <shellapi.h>
#include <urlmon.h>
#include <shlobj.h>
#include <filesystem>
#include <string>
#include <vector>
#include <sstream>
#include <wrl.h>
#include "WebView2.h"
#pragma comment(lib,"urlmon.lib")
#pragma comment(lib,"shell32.lib")
#pragma comment(lib,"ole32.lib")
#pragma comment(lib,"user32.lib")
using namespace Microsoft::WRL;
namespace fs=std::filesystem;

struct App { const wchar_t* id; const wchar_t* name; const wchar_t* category; const wchar_t* description; const wchar_t* url; const wchar_t* file; };
static const App APPS[] = {
 {L"gridforge",L"GridForge",L"Calendar & planning",L"Plan your time, manage schedules, and organize events.",L"https://moswebgr.github.io/Office/gridforge/",L"gridforge\\index.html"},
 {L"slidespark",L"SlideSpark",L"Presentations",L"Create, edit, and present your slide decks.",L"https://moswebgr.github.io/Office/slidespark/",L"slidespark\\index.html"},
 {L"datanest",L"DataNest",L"Data & tables",L"Keep information structured with tables and records.",L"https://moswebgr.github.io/Office/datanest/",L"datanest\\index.html"},
 {L"mailnest",L"MailNest",L"Email",L"Work with your Outlook mailbox and local drafts.",L"https://moswebgr.github.io/Office/mailnest/",L"mailnest\\index.html"}
};
static const wchar_t* SHARED[] = {L"index.html",L"assets/microsoft-ui.css",L"assets/responsive.css",L"assets/desktop-only.css",L"assets/mossuite-logo.svg",L"assets/microsoft-auth.js"};
static HWND g_hwnd=nullptr;
static ComPtr<ICoreWebView2Controller> g_controller;
static ComPtr<ICoreWebView2> g_webview;
static fs::path g_root;

std::wstring jsonEscape(const std::wstring& s){std::wstring o;for(auto c:s){if(c==L'"'||c==L'\\')o+=L'\\';if(c==L'\n'){o+=L"\\n";continue;}o+=c;}return o;}
std::wstring quote(const std::wstring& s){return L"\""+jsonEscape(s)+L"\"";}
fs::path appFolder(const App& a){return g_root/a.id;}
fs::path entry(const App& a){return appFolder(a)/a.file;}
bool installed(const App& a){return fs::exists(entry(a))&&fs::exists(appFolder(a)/L"assets/mossuite-logo.svg");}
bool downloadFile(const std::wstring& url,const fs::path& dest){std::error_code ec;fs::create_directories(dest.parent_path(),ec);return SUCCEEDED(URLDownloadToFileW(nullptr,url.c_str(),dest.c_str(),0,nullptr));}
const App* findApp(const std::wstring& id){for(auto& a:APPS)if(id==a.id)return &a;return nullptr;}
void respond(const std::wstring& id,const std::wstring& payload){if(!g_webview)return;std::wstring js=L"window.mosSuiteReceive("+quote(id)+L","+payload+L")";g_webview->ExecuteScript(js.c_str(),nullptr);}
std::wstring appList(){std::wstring s=L"[";for(size_t i=0;i<4;i++){auto&a=APPS[i];if(i)s+=L",";s+=L"{\"id\":"+quote(a.id)+L",\"name\":"+quote(a.name)+L",\"category\":"+quote(a.category)+L",\"description\":"+quote(a.description)+L",\"installed\":"+(installed(a)?L"true":L"false")+L"}";}return s+L"]";}
std::wstring getString(const std::wstring& json,const wchar_t* key){auto p=json.find(std::wstring(L"\"")+key+L"\"");if(p==json.npos)return L"";p=json.find(L':',p);if(p==json.npos)return L"";p=json.find(L'"',p);if(p==json.npos)return L"";auto e=json.find(L'"',p+1);return e==json.npos?L"":json.substr(p+1,e-p-1);}
void onMessage(const std::wstring& msg){
 auto cmd=getString(msg,L"command"),id=getString(msg,L"requestId"),appId=getString(msg,L"appId");
 if(cmd==L"list"){respond(id,L"{\"ok\":true,\"apps\":"+appList()+L"}");return;}
 auto a=findApp(appId);if(!a){respond(id,L"{\"ok\":false,\"error\":\"Unknown app\"}");return;}
 if(cmd==L"install"){
  std::wstring base=L"https://raw.githubusercontent.com/moswebgr/Office/main/";
  bool ok=downloadFile(base+a->file,entry(*a));
  for(auto f:SHARED){std::wstring remote=f;std::replace(remote.begin(),remote.end(),L'\\',L'/');if(!downloadFile(base+remote,appFolder(*a)/fs::path(remote)))ok=false;}
  respond(id,ok?L"{\"ok\":true,\"installed\":true}":L"{\"ok\":false,\"error\":\"Download failed. Check your internet connection and try again.\"}");return;
 }
 if(cmd==L"open"){
  if(installed(*a)){auto p=entry(*a).wstring();ShellExecuteW(nullptr,L"open",p.c_str(),nullptr,nullptr,SW_SHOWNORMAL);respond(id,L"{\"ok\":true,\"offline\":true}");}
  else{ShellExecuteW(nullptr,L"open",a->url,nullptr,nullptr,SW_SHOWNORMAL);respond(id,L"{\"ok\":true,\"offline\":false}");}
 }
}
int WINAPI wWinMain(HINSTANCE h,HINSTANCE, PWSTR,int){
 CoInitializeEx(nullptr,COINIT_APARTMENTTHREADED);
 PWSTR local=nullptr;SHGetKnownFolderPath(FOLDERID_LocalAppData,0,nullptr,&local);g_root=fs::path(local)/L"MosSuite"/L"offline-apps";CoTaskMemFree(local);
 WNDCLASSW wc{};wc.lpfnWndProc=[](HWND w,UINT m,WPARAM wp,LPARAM lp)->LRESULT{if(m==WM_SIZE&&g_controller){RECT r;GetClientRect(w,&r);g_controller->put_Bounds(r);return 0;}if(m==WM_DESTROY){PostQuitMessage(0);return 0;}return DefWindowProcW(w,m,wp,lp);};wc.hInstance=h;wc.lpszClassName=L"MosSuiteWindow";wc.hCursor=LoadCursor(nullptr,IDC_ARROW);RegisterClassW(&wc);
 g_hwnd=CreateWindowW(wc.lpszClassName,L"MosSuite Launcher",WS_OVERLAPPEDWINDOW,CW_USEDEFAULT,CW_USEDEFAULT,1180,820,nullptr,nullptr,h,nullptr);ShowWindow(g_hwnd,SW_SHOW);
 CreateCoreWebView2EnvironmentWithOptions(nullptr,nullptr,nullptr,Callback<ICoreWebView2CreateCoreWebView2EnvironmentCompletedHandler>([](HRESULT hr,ICoreWebView2Environment* env)->HRESULT{
  if(FAILED(hr)||!env)return hr;env->CreateCoreWebView2Controller(g_hwnd,Callback<ICoreWebView2CreateCoreWebView2ControllerCompletedHandler>([](HRESULT hr,ICoreWebView2Controller* c)->HRESULT{
   if(FAILED(hr)||!c)return hr;g_controller=c;c->get_CoreWebView2(&g_webview);RECT r;GetClientRect(g_hwnd,&r);c->put_Bounds(r);
   EventRegistrationToken token;g_webview->add_WebMessageReceived(Callback<ICoreWebView2WebMessageReceivedEventHandler>([](ICoreWebView2* w,ICoreWebView2WebMessageReceivedEventArgs* e)->HRESULT{LPWSTR raw=nullptr;if(SUCCEEDED(e->TryGetWebMessageAsString(&raw))&&raw){onMessage(raw);CoTaskMemFree(raw);}return S_OK;}).Get(),&token);
   wchar_t exe[MAX_PATH];GetModuleFileNameW(nullptr,exe,MAX_PATH);fs::path html=fs::path(exe).parent_path()/L"app"/L"index.html";g_webview->Navigate((L"file:///"+html.wstring()).c_str());return S_OK;
  }).Get());return S_OK;
 }).Get());
 MSG msg;while(GetMessageW(&msg,nullptr,0,0)){TranslateMessage(&msg);DispatchMessageW(&msg);}CoUninitialize();return 0;
}