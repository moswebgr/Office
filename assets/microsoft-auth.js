/* MosSuite Microsoft account sign-in and local profile/settings (MSAL). */
(function(){
  'use strict';
  /* Capture currentScript immediately: it is null inside DOMContentLoaded. */
  const scriptElement = document.currentScript;
  const scriptUrl = scriptElement && scriptElement.src
    ? scriptElement.src : new URL('assets/microsoft-auth.js', document.baseURI).href;
  function start(){
  const siteBase = new URL('../', scriptUrl);
  const redirectUri = new URL('auth-callback.html', siteBase).href;
  const clientId = 'bb80cbb4-e711-42b9-96df-9b3eb0d85e94';
  const msalUrl = 'https://alcdn.msauth.net/browser/2.39.0/js/msal-browser.min.js';
  const css = document.createElement('style');
  css.textContent = `
    #mos-ms-auth{position:fixed;z-index:99999;right:16px;top:12px;font:14px/1.4 "Segoe UI",system-ui,sans-serif;color:#f5f5f5}
    #mos-ms-auth *{box-sizing:border-box}
    #mos-ms-auth .mos-auth-btn{display:flex;align-items:center;justify-content:center;gap:10px;min-height:44px;padding:10px 15px;border:1px solid #555;border-radius:8px;background:#212121;color:#fff;box-shadow:0 4px 18px #0008;cursor:pointer;font:600 14px "Segoe UI",system-ui,sans-serif}
    #mos-ms-auth .mos-auth-btn:hover{background:#303030}
    #mos-ms-auth .mos-ms-logo{display:inline-grid;grid-template-columns:repeat(2,8px);grid-template-rows:repeat(2,8px);gap:2px;flex:none}
    #mos-ms-auth .mos-ms-logo i:nth-child(1){background:#f25022}#mos-ms-auth .mos-ms-logo i:nth-child(2){background:#7fba00}#mos-ms-auth .mos-ms-logo i:nth-child(3){background:#00a4ef}#mos-ms-auth .mos-ms-logo i:nth-child(4){background:#ffb900}
    #mos-ms-auth .mos-auth-name{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    #mos-ms-auth .mos-auth-menu{display:none;position:absolute;right:0;top:52px;width:min(320px,calc(100vw - 24px));padding:14px;background:#212121;border:1px solid #444;border-radius:12px;box-shadow:0 8px 28px #0009;max-height:calc(100dvh - 82px);overflow:auto}
    #mos-ms-auth .mos-auth-menu.open{display:block}
    #mos-ms-auth .mos-auth-menu p{margin:4px 4px 12px;color:#ddd;overflow-wrap:anywhere}\n    #mos-ms-auth .mos-profile-title{font-weight:700;margin:0 4px 4px}\n    #mos-ms-auth .mos-settings{border-top:1px solid #444;margin-top:12px;padding-top:12px}\n    #mos-ms-auth .mos-settings label{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:10px 4px;color:#eee}\n    #mos-ms-auth .mos-settings select{max-width:145px;padding:6px;border:1px solid #555;border-radius:6px;background:#303030;color:#fff}\n    #mos-ms-auth .mos-menu-actions{display:grid;gap:8px}\n    #mos-ms-auth .mos-menu-actions button{min-height:38px}\n    #mos-ms-auth .mos-auth-btn:focus-visible,#mos-ms-auth button:focus-visible{outline:2px solid #60a5fa;outline-offset:2px}
    #mos-ms-auth .mos-auth-menu button{width:100%;padding:9px 10px;border:1px solid #555;border-radius:7px;background:#303030;color:white;cursor:pointer}
    #mos-ms-auth .mos-auth-status{font-size:12px;color:#ddd;margin:0 4px 8px}
    @media(max-width:640px){#mos-ms-auth{right:10px;top:8px}#mos-ms-auth .mos-auth-btn{min-height:40px;padding:8px 10px;font-size:12px}#mos-ms-auth .mos-auth-menu{top:48px}}
  `;
  document.head.appendChild(css);
  const root = document.createElement('div');
  root.id = 'mos-ms-auth';
  root.innerHTML = '<button class="mos-auth-btn" type="button" id="mos-auth-main"><span class="mos-ms-logo" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span id="mos-auth-label">Sign in with Microsoft</span></button><section class="mos-auth-menu" id="mos-auth-menu" aria-label="Account and settings"><div class="mos-profile-title">Microsoft account</div><p id="mos-auth-account">Not signed in</p><div class="mos-auth-status" id="mos-auth-status" role="status"></div><div class="mos-menu-actions"><button type="button" id="mos-auth-action">Sign in</button></div><div class="mos-settings"><div class="mos-profile-title">MosSuite settings</div><label>Appearance <select id="mos-pref-theme"><option value="system">System</option><option value="dark">Dark</option><option value="light">Light</option></select></label><label>Language <select id="mos-pref-language"><option value="en">English</option><option value="el">Ελληνικά</option></select></label><button type="button" id="mos-pref-save">Save preferences</button><p id="mos-pref-status" aria-live="polite"></p></div></section>';
  document.body.appendChild(root);
  const main = root.querySelector('#mos-auth-main');
  const label = root.querySelector('#mos-auth-label');
  const menu = root.querySelector('#mos-auth-menu');
  const accountText = root.querySelector('#mos-auth-account');
  const status = root.querySelector('#mos-auth-status');
  const action = root.querySelector('#mos-auth-action');\n  const prefTheme = root.querySelector('#mos-pref-theme');\n  const prefLanguage = root.querySelector('#mos-pref-language');\n  const prefSave = root.querySelector('#mos-pref-save');\n  const prefStatus = root.querySelector('#mos-pref-status');
  let client = null;
  let initialized = false;
  let busy = false;
  let initError = '';
  function currentAccount(){return client && (client.getActiveAccount() || client.getAllAccounts()[0]) || null;}
  function applyPreferences(){
    let prefs={};try{prefs=JSON.parse(localStorage.getItem('mossuite-preferences')||'{}');}catch(_){}
    prefTheme.value=prefs.theme||'system';prefLanguage.value=prefs.language||'en';
    document.documentElement.dataset.mosTheme=prefTheme.value;
    document.documentElement.lang=prefLanguage.value;
    if(prefTheme.value==='light'){document.documentElement.style.colorScheme='light';}
    else if(prefTheme.value==='dark'){document.documentElement.style.colorScheme='dark';}
    else{document.documentElement.style.colorScheme='';}
  }
  prefSave.addEventListener('click',function(){
    const prefs={theme:prefTheme.value,language:prefLanguage.value};
    localStorage.setItem('mossuite-preferences',JSON.stringify(prefs));
    applyPreferences();prefStatus.textContent='Preferences saved on this device.';
  });
  applyPreferences();
  function showAccount(account){
    if(account){
      client.setActiveAccount(account);
      label.textContent = account.name || account.username || 'Microsoft account';
      accountText.textContent = account.username || account.name || 'Signed in';
      menu.classList.remove('open');
      action.textContent = 'Sign out';
    } else {
      label.textContent = 'Sign in with Microsoft';
      accountText.textContent = 'Not signed in';
      action.textContent = 'Sign in';
      menu.classList.remove('open');
    }
  }
  function setBusy(value,message){
    busy=value;main.disabled=value;action.disabled=value;
    status.textContent=message||'';
    main.style.opacity=value?'.7':'1';
  }
  main.addEventListener('click',async function(){
    if(busy)return;
    if(!client || !initialized){
      status.textContent=initError||'Microsoft sign-in is still loading. Please wait a moment and click again.';
      menu.classList.add('open');
      return;
    }
    const account=currentAccount();
    if(account){menu.classList.toggle('open');return;}
    try{
      menu.classList.add('open');
      setBusy(true,'Redirecting to Microsoft sign-in…');
      sessionStorage.setItem('mos-ms-return-url', window.location.href);
      await client.loginRedirect({scopes:['openid','profile','email'],prompt:'select_account',redirectUri});
    }catch(error){
      setBusy(false,error && error.errorCode==='user_cancelled'?'Sign-in cancelled.':'Sign-in failed: '+(error && (error.errorMessage||error.message)||'check the Microsoft app registration and redirect URI'));
      menu.classList.add('open');
      console.error('MosSuite Microsoft sign-in error:',error);
    }
  });
  action.addEventListener('click',async function(){
    if(!client||busy)return;
    const account=currentAccount();
    if(!account){
      main.click();return;
    }
    try{
      setBusy(true,'Signing out…');
      sessionStorage.setItem('mos-ms-return-url', window.location.href);
      await client.logoutRedirect({account,postLogoutRedirectUri:redirectUri});
    }catch(error){
      setBusy(false,'Sign-out failed. Please try again.');
      console.error('MosSuite Microsoft sign-out error:',error);
    }
  });
  document.addEventListener('click',function(event){if(!root.contains(event.target))menu.classList.remove('open');});
  function loadMsal(){
    if(window.msal && window.msal.PublicClientApplication){init();return;}
    const urls=[msalUrl,'https://cdn.jsdelivr.net/npm/@azure/msal-browser@2.39.0/lib/msal-browser.min.js'];
    function tryLoad(index){
      const s=document.createElement('script');s.src=urls[index];s.async=true;
      s.onload=function(){if(window.msal&&window.msal.PublicClientApplication)init();else if(index+1<urls.length)tryLoad(index+1);else failLoad();};
      s.onerror=function(){if(index+1<urls.length)tryLoad(index+1);else failLoad();};
      document.head.appendChild(s);
    }
    function failLoad(){initError='Microsoft sign-in library could not be loaded. Check your connection or content blockers.';setBusy(false,initError);menu.classList.add('open');}
    tryLoad(0);
  }
  async function init(){
    try{
      client=new window.msal.PublicClientApplication({
        auth:{clientId,authority:'https://login.microsoftonline.com/common',redirectUri,postLogoutRedirectUri:redirectUri},
        cache:{cacheLocation:'localStorage',storeAuthStateInCookie:false}
      });
      await client.initialize();
      const result=await client.handleRedirectPromise();
      if(result&&result.account)client.setActiveAccount(result.account);
      initialized=true;
      initError='';
      showAccount(currentAccount());
    }catch(error){
      initError='Microsoft sign-in setup failed: '+(error && (error.errorMessage||error.message)||'verify the Client ID, supported account types, and SPA redirect URI in Microsoft Entra.');
      setBusy(false,initError);
      menu.classList.add('open');
      console.error('MosSuite MSAL initialization error:',error);
    }
  }
  loadMsal();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();