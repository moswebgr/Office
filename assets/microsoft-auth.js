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
    #mos-ms-auth{position:absolute;z-index:99999;right:16px;top:50%;transform:translateY(-50%);font:14px/1.4 "Segoe UI",system-ui,sans-serif;color:#f5f5f5}
    #mos-ms-auth *{box-sizing:border-box}
    #mos-ms-auth .mos-auth-btn{display:flex;align-items:center;justify-content:center;width:44px;height:44px;min-height:44px;padding:0;border:1px solid #555;border-radius:50%;background:#212121;color:#fff;box-shadow:0 4px 18px #0008;cursor:pointer;font:600 14px "Segoe UI",system-ui,sans-serif}
    #mos-ms-auth .mos-auth-btn:hover{background:#303030}#mos-ms-auth .mos-profile-icon{width:21px;height:21px;display:block}#mos-ms-auth #mos-auth-label{display:none}
    #mos-ms-auth .mos-ms-logo{display:inline-grid;grid-template-columns:repeat(2,8px);grid-template-rows:repeat(2,8px);gap:2px;flex:none}
    #mos-ms-auth .mos-ms-logo i:nth-child(1){background:#f25022}#mos-ms-auth .mos-ms-logo i:nth-child(2){background:#7fba00}#mos-ms-auth .mos-ms-logo i:nth-child(3){background:#00a4ef}#mos-ms-auth .mos-ms-logo i:nth-child(4){background:#ffb900}
    #mos-ms-auth .mos-auth-name{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    #mos-ms-auth .mos-auth-menu{display:none;position:absolute;right:0;top:52px;width:min(320px,calc(100vw - 24px));padding:14px;background:#212121;border:1px solid #444;border-radius:12px;box-shadow:0 8px 28px #0009;max-height:calc(100dvh - 82px);overflow:auto}
    #mos-ms-auth .mos-auth-menu.open{display:block}
    #mos-ms-auth .mos-auth-menu p{margin:4px 4px 12px;color:#ddd;overflow-wrap:anywhere}
    #mos-ms-auth .mos-profile-title{font-weight:700;margin:0 4px 4px}
    #mos-ms-auth .mos-settings{border-top:1px solid #444;margin-top:12px;padding-top:12px}
    #mos-ms-auth .mos-settings label{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:10px 4px;color:#eee}
    #mos-ms-auth .mos-settings select{max-width:145px;padding:6px;border:1px solid #555;border-radius:6px;background:#303030;color:#fff}
    #mos-ms-auth .mos-menu-actions{display:grid;gap:8px}
    #mos-ms-auth .mos-menu-actions button{min-height:38px}
    #mos-ms-auth .mos-auth-btn:focus-visible,#mos-ms-auth button:focus-visible{outline:2px solid #60a5fa;outline-offset:2px}
    #mos-ms-auth .mos-auth-menu button{width:100%;padding:9px 10px;border:1px solid #555;border-radius:7px;background:#303030;color:white;cursor:pointer}#mos-ms-auth #mos-auth-action{display:flex;align-items:center;justify-content:center;gap:10px;background:#fff;color:#242424;border-color:#fff;font-weight:650}#mos-ms-auth #mos-auth-action .mos-ms-logo{width:18px;height:18px;grid-template-columns:repeat(2,8px);grid-template-rows:repeat(2,8px)}
    #mos-ms-auth .mos-auth-status{font-size:12px;color:#ddd;margin:0 4px 8px}
    @media(max-width:640px){#mos-ms-auth{right:10px}#mos-ms-auth .mos-auth-btn{width:40px;height:40px;min-height:40px;padding:0;font-size:12px}#mos-ms-auth .mos-auth-menu{top:48px}}
  `;
  document.head.appendChild(css);
  const root = document.createElement('div');
  root.id = 'mos-ms-auth';
  root.innerHTML = '<button class="mos-auth-btn" type="button" id="mos-auth-main" aria-label="Profile and settings" aria-haspopup="true" aria-expanded="false" title="Profile & settings"><svg class="mos-profile-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 20c.6-3.4 3.1-5.2 7-5.2s6.4 1.8 7 5.2"></path></svg><span id="mos-auth-label">Profile</span></button><section class="mos-auth-menu" id="mos-auth-menu" aria-label="Account and settings"><div class="mos-profile-title">Profile & settings</div><p id="mos-auth-account">Not signed in</p><div class="mos-auth-status" id="mos-auth-status" role="status"></div><div class="mos-menu-actions"><button type="button" id="mos-auth-action"><span class="mos-ms-logo" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>Sign in with Microsoft</span></button></div><div class="mos-settings"><div class="mos-profile-title">MosSuite settings</div><label>Language <select id="mos-pref-language"><option value="en">English</option><option value="el">Ελληνικά</option></select></label><button type="button" id="mos-pref-save">Save preferences</button><p id="mos-pref-status" aria-live="polite"></p></div></section>';
  const headerTarget = document.querySelector('.header-inner') ||
    document.querySelector('.topbar') ||
    document.querySelector('.app-header') ||
    document.querySelector('.toolbar') ||
    document.querySelector('.menubar') ||
    document.querySelector('header');
  if(headerTarget){
    headerTarget.appendChild(root);
    if(getComputedStyle(headerTarget).position==='static') headerTarget.style.position='relative';
    /* Keep the profile button in the normal page header flow.
       Do not make the header sticky: it should scroll away with the page. */
    if(headerTarget.matches('.header-inner')){
      headerTarget.style.minHeight='76px';
    }else{
      headerTarget.style.paddingRight='68px';
    }
  }else{
    document.body.appendChild(root);
    root.style.top='16px';
    root.style.transform='none';
  }
  const main = root.querySelector('#mos-auth-main');
  const label = root.querySelector('#mos-auth-label');
  const menu = root.querySelector('#mos-auth-menu');
  const accountText = root.querySelector('#mos-auth-account');
  const status = root.querySelector('#mos-auth-status');
  const action = root.querySelector('#mos-auth-action');
  const prefLanguage = root.querySelector('#mos-pref-language');
  const prefSave = root.querySelector('#mos-pref-save');
  const prefStatus = root.querySelector('#mos-pref-status');
  let client = null;
  let initialized = false;
  let busy = false;
  let initError = '';
  function currentAccount(){return client && (client.getActiveAccount() || client.getAllAccounts()[0]) || null;}
  async function graphAccessToken(){
    if(!client || !initialized) throw new Error('Microsoft sign-in is not ready. Please sign in first.');
    let account=currentAccount();
    if(!account) throw new Error('Sign in with Microsoft before sharing an event.');
    const request={account,scopes:['Calendars.ReadWrite']};
    try{
      const result=await client.acquireTokenSilent(request);
      return result.accessToken;
    }catch(error){
      const result=await client.acquireTokenPopup({...request,prompt:'select_account'});
      if(result&&result.account)client.setActiveAccount(result.account);
      return result.accessToken;
    }
  }
  async function createOutlookInvite(event,email){
    const token=await graphAccessToken();
    const body={
      subject:event.title,
      body:{contentType:'text',content:[event.notes||'',event.location?'Location: '+event.location:''].filter(Boolean).join('\\n\\n')},
      start:{dateTime:(event.start||'')+'T'+(event.startTime||'09:00')+':00',timeZone:'GTB Standard Time'},
      end:{dateTime:(event.end||event.start||'')+'T'+(event.endTime||'10:00')+':00',timeZone:'GTB Standard Time'},
      location:event.location?{displayName:event.location}:undefined,
      attendees:[{emailAddress:{address:email,name:email},type:'required'}],
      allowNewTimeProposals:true
    };
    const response=await fetch('https://graph.microsoft.com/v1.0/me/events',{
      method:'POST',
      headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
      body:JSON.stringify(body)
    });
    if(!response.ok){
      let detail='Microsoft Graph request failed ('+response.status+').';
      try{const data=await response.json();detail=data.error&&data.error.message||detail}catch(_){}
      throw new Error(detail+' Verify that Calendars.ReadWrite is enabled for the Microsoft app.');
    }
    return response.json();
  }
  window.MosSuiteMicrosoftCalendar={
    isSignedIn:()=>!!currentAccount(),
    account:()=>currentAccount(),
    createInvite:createOutlookInvite
  };
  function applyPreferences(){
    let prefs={};try{prefs=JSON.parse(localStorage.getItem('mossuite-preferences')||'{}');}catch(_){}
    prefLanguage.value=prefs.language||'en';
    document.documentElement.removeAttribute('data-mos-theme');
    document.documentElement.style.colorScheme='';
    document.documentElement.lang=prefLanguage.value;
  }
  prefSave.addEventListener('click',function(){
    const prefs={language:prefLanguage.value};
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
      label.textContent = 'Profile';
      accountText.textContent = 'Not signed in';
      action.innerHTML = '<span class="mos-ms-logo" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span>Sign in with Microsoft</span>';
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
    menu.classList.toggle('open');
    main.setAttribute('aria-expanded',menu.classList.contains('open')?'true':'false');
  });
  action.addEventListener('click',async function(){
    if(!client||busy)return;
    const account=currentAccount();
    if(!account){
      if(!initialized){status.textContent=initError||'Microsoft sign-in is still loading. Please try again in a moment.';return;}
      try{
        setBusy(true,'Redirecting to Microsoft sign-in…');
        sessionStorage.setItem('mos-ms-return-url', window.location.href);
        await client.loginRedirect({scopes:['openid','profile','email'],prompt:'select_account',redirectUri});
      }catch(error){
        setBusy(false,error && error.errorCode==='user_cancelled'?'Sign-in cancelled.':'Sign-in failed: '+(error && (error.errorMessage||error.message)||'check the Microsoft app registration and redirect URI'));
        menu.classList.add('open');
        console.error('MosSuite Microsoft sign-in error:',error);
      }
      return;
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
  document.addEventListener('click',function(event){if(!root.contains(event.target)){menu.classList.remove('open');main.setAttribute('aria-expanded','false');}});
  function loadMsal(){
    if(window.msal && window.msal.PublicClientApplication){init();return;}
    const urls=[msalUrl,'https://cdn.jsdelivr.net/npm/@azure/msal-browser@2.39.0/lib/msal-browser.min.js'];
    function tryLoad(index){
      const s=document.createElement('script');s.src=urls[index];s.async=true;
      s.onload=function(){if(window.msal&&window.msal.PublicClientApplication)init();else if(index+1<urls.length)tryLoad(index+1);else failLoad();};
      s.onerror=function(){if(index+1<urls.length)tryLoad(index+1);else failLoad();};
      document.head.appendChild(s);
    }
    function failLoad(){initError='Microsoft sign-in library could not be loaded. Check your connection or content blockers.';setBusy(false,initError);main.setAttribute('aria-expanded','false');}
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
      menu.classList.remove('open');
      main.setAttribute('aria-expanded','false');
      console.error('MosSuite MSAL initialization error:',error);
    }
  }
  loadMsal();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();