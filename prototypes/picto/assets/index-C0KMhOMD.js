(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=class{constructor(){this.routes={},this.currentRoute=null,this.beforeEach=null,window.addEventListener(`hashchange`,()=>this._resolve())}register(e,t){return this.routes[e]=t,this}guard(e){return this.beforeEach=e,this}navigate(e){window.location.hash=e}start(){this._resolve()}_resolve(){let e=window.location.hash.slice(1)||`/`;if(this.beforeEach){let t=this.beforeEach(e);if(t&&t!==e){this.navigate(t);return}}let t=this.routes[e];if(!t){this.navigate(`/`);return}if(this.currentRoute&&this.currentRoute!==e){let e=this.routes[this.currentRoute];if(e&&typeof e.onLeave==`function`){let t=`page-${this.currentRoute.replace(/\//g,`-`).replace(/^-/,``)}`;e.onLeave(document.getElementById(t))}}document.querySelectorAll(`.page`).forEach(e=>{e.classList.remove(`active`),e.inert=!0,e.setAttribute(`aria-hidden`,`true`)});let n=`page-${e.replace(/\//g,`-`).replace(/^-/,``)}`,r=document.getElementById(n);if(r)t.update&&t.update(r),requestAnimationFrame(()=>{r.classList.add(`active`),r.inert=!1,r.removeAttribute(`aria-hidden`),this._focusPage(r)});else{let e=document.getElementById(`app`),r=document.createElement(`div`);r.id=n,r.className=`page`,r.inert=!0,r.setAttribute(`aria-hidden`,`true`),t.render(r),e.appendChild(r),requestAnimationFrame(()=>{r.classList.add(`active`),r.inert=!1,r.removeAttribute(`aria-hidden`),this._focusPage(r)})}this.currentRoute=e,this._updateNav(e)}_focusPage(e){let t=e.querySelector(`h1, .page-title`);t&&(t.setAttribute(`tabindex`,`-1`),t.focus({preventScroll:!0}))}_updateNav(e){document.querySelectorAll(`.nav-item`).forEach(t=>{t.dataset.route===e?(t.classList.add(`active`),t.setAttribute(`aria-current`,`page`)):(t.classList.remove(`active`),t.removeAttribute(`aria-current`))})}},t=`picto_db`,n=`images`,r=1,i=null;function a(){return i||(i=new Promise((e,i)=>{if(typeof indexedDB>`u`){i(Error(`IndexedDB not supported`));return}let a=indexedDB.open(t,r);a.onupgradeneeded=()=>{let e=a.result;e.objectStoreNames.contains(n)||e.createObjectStore(n)},a.onsuccess=()=>e(a.result),a.onerror=()=>i(a.error)}),i)}async function o(e,t){let r=await a();return new Promise((i,a)=>{let o=r.transaction(n,`readwrite`);o.objectStore(n).put(t,e),o.oncomplete=()=>i(),o.onerror=()=>a(o.error)})}async function s(){let e=await a();return new Promise((t,r)=>{let i=new Map,a=e.transaction(n,`readonly`).objectStore(n).openCursor();a.onsuccess=()=>{let e=a.result;e?(i.set(e.key,e.value),e.continue()):t(i)},a.onerror=()=>r(a.error)})}async function c(){let e=await a();return new Promise((t,r)=>{let i=e.transaction(n,`readwrite`);i.objectStore(n).clear(),i.oncomplete=()=>t(),i.onerror=()=>r(i.error)})}var l=`picto_store`,u=[`cat`,`dog`];function d(e){return{id:e,nickname:``,petType:`cat`,mood:`calm`,activity:`idle`,disturbance:`ok`,paired:!1,pairCode:``,lastUpdate:Date.now()}}function f(){return{currentView:`self`,petStyle:`styleA`,users:{self:d(`self`),partner:d(`partner`)},polaroids:[],shortMessages:[],setupComplete:!1}}var p=new class{constructor(){this._listeners=new Map,this._state=this._load()}async init(){try{let e=await s(),t=!1;for(let n of this._state.polaroids)e.has(n.id)?n.imageData=e.get(n.id):n.imageData&&(await o(n.id,n.imageData),t=!0);t&&this._save()}catch(e){console.warn(`Failed to load polaroid images:`,e)}}get state(){return this._state}get currentUser(){return this._state.users[this._state.currentView]}get partnerUser(){return this._state.currentView===`self`?this._state.users.partner:this._state.users.self}switchView(){this._state.currentView=this._state.currentView===`self`?`partner`:`self`,this._save(),this._notify(`viewSwitch`),this._notify(`stateChange`)}setPetStyle(e){this._state.petStyle=e,this._save(),this._notify(`styleChange`),this._notify(`stateChange`)}updateCurrentUser(e){Object.assign(this.currentUser,e,{lastUpdate:Date.now()}),this._save(),this._notify(`stateChange`),this._notify(`statusUpdate`)}completePairing(e,t){Object.assign(this._state.users.self,e,{paired:!0,lastUpdate:Date.now()}),Object.assign(this._state.users.partner,t,{paired:!0,lastUpdate:Date.now()}),this._state.setupComplete=!0,this._state.currentView=`self`,this._save(),this._notify(`stateChange`)}async addPolaroid(e){let t=Date.now(),n=globalThis.crypto?.randomUUID?.()||`${t}-${Math.random()}`;return await o(n,e.imageData),this._state.polaroids.unshift({id:n,imageData:e.imageData,caption:e.caption||``,moodTag:e.moodTag||``,stickers:e.stickers||[],sender:this._state.currentView,senderNickname:this.currentUser.nickname,timestamp:t}),this._save(),this._notify(`polaroidAdded`),this._notify(`stateChange`),n}addShortMessage(e,t){this._state.shortMessages.unshift({id:Date.now(),text:e,duration:t,sender:this._state.currentView,senderNickname:this.currentUser.nickname,timestamp:Date.now()}),this._save(),this._notify(`messageAdded`),this._notify(`stateChange`)}getLatestPartnerMessage(){let e=this._state.currentView===`self`?`partner`:`self`,t=Date.now();return this._state.shortMessages.find(n=>n.sender===e?n.duration===-1?!0:t<n.timestamp+n.duration*60*1e3:!1)}getLatestPartnerPolaroid(){let e=this._state.currentView===`self`?`partner`:`self`;return this._state.polaroids.find(t=>t.sender===e)}on(e,t){return this._listeners.has(e)||this._listeners.set(e,[]),this._listeners.get(e).push(t),()=>{let n=this._listeners.get(e),r=n.indexOf(t);r>-1&&n.splice(r,1)}}reset(){this._state=f(),c().catch(()=>{}),this._save(),this._notify(`stateChange`)}get isSetupComplete(){return this._state.setupComplete}_load(){try{let e=localStorage.getItem(l);if(e){let t=JSON.parse(e),n=f(),r={...n,...t,currentView:[`self`,`partner`].includes(t.currentView)?t.currentView:`self`,petStyle:`styleA`,polaroids:Array.isArray(t.polaroids)?t.polaroids:[],shortMessages:Array.isArray(t.shortMessages)?t.shortMessages:[],setupComplete:t.setupComplete===!0,users:{self:{...n.users.self,...t.users?.self||{}},partner:{...n.users.partner,...t.users?.partner||{}}}};for(let e of[`self`,`partner`])u.includes(r.users[e].petType)||(r.users[e].petType=`cat`);return r}}catch(e){console.warn(`Failed to load state:`,e)}return f()}_save(){try{let e={...this._state,polaroids:this._state.polaroids.map(({imageData:e,...t})=>t)};localStorage.setItem(l,JSON.stringify(e))}catch(e){console.warn(`Failed to save state:`,e)}}_notify(e){(this._listeners.get(e)||[]).forEach(e=>e(this._state))}},m={black:`#1A1A1A`,white:`#FFFFFF`,happy:`#F4C542`,happyCheek:`#F28E8E`,calm:`#A8D8C8`,tired:`#B8C8E8`,miss:`#E8B4B8`,sad:`#8FA8BF`,sadTear:`#5D9CEC`,angry:`#E85050`,anxious:`#9C8CB9`,anxiousSweat:`#5D9CEC`,sleepy:`#5B6E80`,sleepyZ:`#A8C8E8`,excited:`#F4A261`,excitedStar:`#FFD1A9`,quiet:`#D8C8B8`,heartOk:`#81B29A`,heartLater:`#F2CC8F`,heartNo:`#E07A5F`,heartSeen:`#E8E5E0`,heartRed:`#E76F51`,bookCover:`#C89870`,briefcase:`#B38B6D`,gamepad:`#E56B6F`,ramen:`#F4A261`,bed:`#98A8C8`,bus:`#F2CC8F`,shoe:`#81B29A`,clapper:`#3D405B`,headphone:`#5B6E80`,bubble:`#A8D8C8`,friends:`#E07A5F`,battery:`#81B29A`,cat:`#E07A5F`,dog:`#F2CC8F`},h={happy:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outline -->
      <rect x="4" y="1" width="8" height="14" fill="${m.black}"/>
      <rect x="2" y="2" width="12" height="12" fill="${m.black}"/>
      <rect x="1" y="4" width="14" height="8" fill="${m.black}"/>
      <!-- Body -->
      <rect x="5" y="2" width="6" height="12" fill="${m.happy}"/>
      <rect x="3" y="3" width="10" height="10" fill="${m.happy}"/>
      <rect x="2" y="5" width="12" height="6" fill="${m.happy}"/>
      <!-- Eyes -->
      <rect x="4" y="6" width="2" height="2" fill="${m.black}"/>
      <rect x="10" y="6" width="2" height="2" fill="${m.black}"/>
      <!-- Cheeks -->
      <rect x="3" y="9" width="2" height="1" fill="${m.happyCheek}"/>
      <rect x="11" y="9" width="2" height="1" fill="${m.happyCheek}"/>
      <!-- Smile -->
      <rect x="5" y="10" width="6" height="1" fill="${m.black}"/>
      <rect x="5" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="9" width="1" height="1" fill="${m.black}"/>
    </svg>
  `,calm:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="1" width="8" height="14" fill="${m.black}"/>
      <rect x="2" y="2" width="12" height="12" fill="${m.black}"/>
      <rect x="1" y="4" width="14" height="8" fill="${m.black}"/>
      <rect x="5" y="2" width="6" height="12" fill="${m.calm}"/>
      <rect x="3" y="3" width="10" height="10" fill="${m.calm}"/>
      <rect x="2" y="5" width="12" height="6" fill="${m.calm}"/>
      <!-- Eyes (Relaxed / closed) -->
      <rect x="4" y="7" width="3" height="1" fill="${m.black}"/>
      <rect x="9" y="7" width="3" height="1" fill="${m.black}"/>
      <!-- Mouth -->
      <rect x="7" y="10" width="2" height="1" fill="${m.black}"/>
    </svg>
  `,tired:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="1" width="8" height="14" fill="${m.black}"/>
      <rect x="2" y="2" width="12" height="12" fill="${m.black}"/>
      <rect x="1" y="4" width="14" height="8" fill="${m.black}"/>
      <rect x="5" y="2" width="6" height="12" fill="${m.tired}"/>
      <rect x="3" y="3" width="10" height="10" fill="${m.tired}"/>
      <rect x="2" y="5" width="12" height="6" fill="${m.tired}"/>
      <!-- Eyes (tired slants) -->
      <rect x="4" y="6" width="2" height="1" fill="${m.black}"/>
      <rect x="5" y="7" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="6" width="2" height="1" fill="${m.black}"/>
      <rect x="10" y="7" width="1" height="1" fill="${m.black}"/>
      <!-- Mouth (gasping open) -->
      <rect x="6" y="9" width="4" height="3" fill="${m.black}"/>
      <rect x="7" y="10" width="2" height="1" fill="${m.white}"/>
    </svg>
  `,miss:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="1" width="8" height="14" fill="${m.black}"/>
      <rect x="2" y="2" width="12" height="12" fill="${m.black}"/>
      <rect x="1" y="4" width="14" height="8" fill="${m.black}"/>
      <rect x="5" y="2" width="6" height="12" fill="${m.miss}"/>
      <rect x="3" y="3" width="10" height="10" fill="${m.miss}"/>
      <rect x="2" y="5" width="12" height="6" fill="${m.miss}"/>
      <!-- Pleading Eyes (Big glossy) -->
      <rect x="4" y="6" width="3" height="3" fill="${m.black}"/>
      <rect x="9" y="6" width="3" height="3" fill="${m.black}"/>
      <rect x="4" y="6" width="1" height="1" fill="${m.white}"/>
      <rect x="9" y="6" width="1" height="1" fill="${m.white}"/>
      <!-- Cheeks pink -->
      <rect x="3" y="9" width="1" height="1" fill="${m.happyCheek}"/>
      <rect x="12" y="9" width="1" height="1" fill="${m.happyCheek}"/>
      <!-- Curved cute mouth -->
      <rect x="7" y="10" width="2" height="1" fill="${m.black}"/>
      <rect x="6" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="9" y="9" width="1" height="1" fill="${m.black}"/>
    </svg>
  `,sad:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="1" width="8" height="14" fill="${m.black}"/>
      <rect x="2" y="2" width="12" height="12" fill="${m.black}"/>
      <rect x="1" y="4" width="14" height="8" fill="${m.black}"/>
      <rect x="5" y="2" width="6" height="12" fill="${m.sad}"/>
      <rect x="3" y="3" width="10" height="10" fill="${m.sad}"/>
      <rect x="2" y="5" width="12" height="6" fill="${m.sad}"/>
      <!-- Sad slant eyes -->
      <rect x="4" y="7" width="2" height="1" fill="${m.black}"/>
      <rect x="4" y="6" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="7" width="2" height="1" fill="${m.black}"/>
      <rect x="11" y="6" width="1" height="1" fill="${m.black}"/>
      <!-- Tear -->
      <rect x="3" y="8" width="1" height="2" fill="${m.sadTear}"/>
      <rect x="4" y="9" width="1" height="1" fill="${m.sadTear}"/>
      <!-- Frown -->
      <rect x="6" y="11" width="4" height="1" fill="${m.black}"/>
      <rect x="6" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="9" y="12" width="1" height="1" fill="${m.black}"/>
    </svg>
  `,angry:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="1" width="8" height="14" fill="${m.black}"/>
      <rect x="2" y="2" width="12" height="12" fill="${m.black}"/>
      <rect x="1" y="4" width="14" height="8" fill="${m.black}"/>
      <rect x="5" y="2" width="6" height="12" fill="${m.angry}"/>
      <rect x="3" y="3" width="10" height="10" fill="${m.angry}"/>
      <rect x="2" y="5" width="12" height="6" fill="${m.angry}"/>
      <!-- Angry eyebrows/eyes -->
      <rect x="4" y="6" width="2" height="2" fill="${m.black}"/>
      <rect x="10" y="6" width="2" height="2" fill="${m.black}"/>
      <rect x="3" y="5" width="2" height="1" fill="${m.black}"/>
      <rect x="11" y="5" width="2" height="1" fill="${m.black}"/>
      <!-- Angry Frown -->
      <rect x="6" y="10" width="4" height="1" fill="${m.black}"/>
      <rect x="5" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="11" width="1" height="1" fill="${m.black}"/>
    </svg>
  `,anxious:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="1" width="8" height="14" fill="${m.black}"/>
      <rect x="2" y="2" width="12" height="12" fill="${m.black}"/>
      <rect x="1" y="4" width="14" height="8" fill="${m.black}"/>
      <rect x="5" y="2" width="6" height="12" fill="${m.anxious}"/>
      <rect x="3" y="3" width="10" height="10" fill="${m.anxious}"/>
      <rect x="2" y="5" width="12" height="6" fill="${m.anxious}"/>
      <!-- Worried dot eyes -->
      <rect x="4" y="7" width="2" height="2" fill="${m.black}"/>
      <rect x="10" y="7" width="2" height="2" fill="${m.black}"/>
      <!-- Eyebrows raised -->
      <rect x="4" y="5" width="2" height="1" fill="${m.black}"/>
      <rect x="10" y="5" width="2" height="1" fill="${m.black}"/>
      <!-- Sweat droplet -->
      <rect x="12" y="5" width="2" height="2" fill="${m.anxiousSweat}"/>
      <rect x="13" y="7" width="1" height="1" fill="${m.anxiousSweat}"/>
      <!-- Squiggly mouth -->
      <rect x="6" y="11" width="4" height="1" fill="${m.black}"/>
      <rect x="5" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="10" width="1" height="1" fill="${m.black}"/>
    </svg>
  `,sleepy:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="1" width="8" height="14" fill="${m.black}"/>
      <rect x="2" y="2" width="12" height="12" fill="${m.black}"/>
      <rect x="1" y="4" width="14" height="8" fill="${m.black}"/>
      <rect x="5" y="2" width="6" height="12" fill="${m.sleepy}"/>
      <rect x="3" y="3" width="10" height="10" fill="${m.sleepy}"/>
      <rect x="2" y="5" width="12" height="6" fill="${m.sleepy}"/>
      <!-- Sleeping closed eyes -->
      <rect x="4" y="8" width="2" height="1" fill="${m.black}"/>
      <rect x="10" y="8" width="2" height="1" fill="${m.black}"/>
      <!-- Sleeping mouth -->
      <rect x="7" y="10" width="2" height="2" fill="${m.black}"/>
      <!-- Floating Zzz -->
      <path d="M11 2h3v1l-2 2h2v1h-3v-1l2-2h-2v-1z" fill="${m.sleepyZ}"/>
      <path d="M1 9h2v1l-1 1h1v1h-2v-1l1-1h-1v-1z" fill="${m.sleepyZ}"/>
    </svg>
  `,excited:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="1" width="8" height="14" fill="${m.black}"/>
      <rect x="2" y="2" width="12" height="12" fill="${m.black}"/>
      <rect x="1" y="4" width="14" height="8" fill="${m.black}"/>
      <rect x="5" y="2" width="6" height="12" fill="${m.excited}"/>
      <rect x="3" y="3" width="10" height="10" fill="${m.excited}"/>
      <rect x="2" y="5" width="12" height="6" fill="${m.excited}"/>
      <!-- Star Eyes -->
      <rect x="5" y="6" width="1" height="3" fill="${m.black}"/>
      <rect x="4" y="7" width="3" height="1" fill="${m.black}"/>
      <rect x="11" y="6" width="1" height="3" fill="${m.black}"/>
      <rect x="10" y="7" width="3" height="1" fill="${m.black}"/>
      <!-- Open excited mouth -->
      <rect x="6" y="10" width="4" height="3" fill="${m.black}"/>
      <rect x="7" y="11" width="2" height="2" fill="${m.happyCheek}"/>
    </svg>
  `,quiet:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="1" width="8" height="14" fill="${m.black}"/>
      <rect x="2" y="2" width="12" height="12" fill="${m.black}"/>
      <rect x="1" y="4" width="14" height="8" fill="${m.black}"/>
      <rect x="5" y="2" width="6" height="12" fill="${m.quiet}"/>
      <rect x="3" y="3" width="10" height="10" fill="${m.quiet}"/>
      <rect x="2" y="5" width="12" height="6" fill="${m.quiet}"/>
      <!-- Eyes dot -->
      <rect x="4" y="7" width="2" height="2" fill="${m.black}"/>
      <rect x="10" y="7" width="2" height="2" fill="${m.black}"/>
      <!-- Zip Mouth -->
      <rect x="6" y="10" width="4" height="1" fill="${m.black}"/>
      <rect x="7" y="10" width="1" height="1" fill="${m.white}"/>
      <rect x="9" y="10" width="1" height="1" fill="${m.white}"/>
    </svg>
  `,studying:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Book Outline -->
      <rect x="2" y="3" width="12" height="10" fill="${m.black}"/>
      <!-- Cover -->
      <rect x="3" y="4" width="10" height="8" fill="${m.bookCover}"/>
      <!-- Pages -->
      <rect x="4" y="5" width="4" height="6" fill="${m.white}"/>
      <rect x="8" y="5" width="4" height="6" fill="${m.white}"/>
      <!-- Spine & bookmarks -->
      <rect x="7" y="4" width="2" height="8" fill="${m.black}"/>
      <rect x="8" y="4" width="1" height="4" fill="${m.angry}"/>
    </svg>
  `,working:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Briefcase Outline -->
      <rect x="2" y="5" width="12" height="9" fill="${m.black}"/>
      <rect x="6" y="3" width="4" height="3" fill="${m.black}"/>
      <!-- Briefcase handle inner -->
      <rect x="7" y="4" width="2" height="1" fill="${m.white}"/>
      <!-- Body -->
      <rect x="3" y="6" width="10" height="7" fill="${m.briefcase}"/>
      <!-- Lock clasp -->
      <rect x="7" y="9" width="2" height="2" fill="${m.happy}"/>
      <rect x="7" y="9" width="2" height="2" stroke="${m.black}" stroke-width="0.5"/>
    </svg>
  `,gaming:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Retro Controller Outline -->
      <rect x="1" y="4" width="14" height="8" fill="${m.black}"/>
      <rect x="2" y="3" width="12" height="10" fill="${m.black}"/>
      <!-- Body -->
      <rect x="2" y="5" width="12" height="6" fill="${m.sleepy}"/>
      <rect x="3" y="4" width="10" height="8" fill="${m.sleepy}"/>
      <!-- D-Pad (Plus shape) -->
      <rect x="4" y="6" width="3" height="3" fill="${m.black}"/>
      <rect x="5" y="5" width="1" height="5" fill="${m.black}"/>
      <!-- Action buttons (Red) -->
      <rect x="10" y="7" width="1.5" height="1.5" fill="${m.gamepad}"/>
      <rect x="12" y="6" width="1.5" height="1.5" fill="${m.gamepad}"/>
    </svg>
  `,eating:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Ramen Bowl Outline -->
      <rect x="3" y="7" width="10" height="7" fill="${m.black}"/>
      <rect x="4" y="13" width="8" height="1" fill="${m.black}"/>
      <!-- Bowl Body -->
      <rect x="4" y="8" width="8" height="5" fill="${m.angry}"/>
      <rect x="5" y="12" width="6" height="1" fill="${m.angry}"/>
      <!-- Noodle Soup -->
      <rect x="4" y="8" width="8" height="1" fill="${m.happy}"/>
      <!-- Chopsticks -->
      <rect x="2" y="2" width="10" height="1" fill="${m.bookCover}" transform="rotate(30 2 2)"/>
      <rect x="2" y="4" width="10" height="1" fill="${m.bookCover}" transform="rotate(30 2 4)"/>
    </svg>
  `,sleeping:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Bed frame -->
      <rect x="1" y="6" width="14" height="8" fill="${m.black}"/>
      <rect x="2" y="5" width="1" height="9" fill="${m.black}"/>
      <rect x="13" y="8" width="1" height="6" fill="${m.black}"/>
      <!-- Bed sheet / Pillow -->
      <rect x="3" y="7" width="10" height="6" fill="${m.bed}"/>
      <rect x="3" y="7" width="3" height="3" fill="${m.white}"/>
      <rect x="3" y="7" width="3" height="3" stroke="${m.black}" stroke-width="0.5"/>
    </svg>
  `,commuting:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Retro bus/train -->
      <rect x="1" y="3" width="14" height="10" fill="${m.black}"/>
      <rect x="2" y="4" width="12" height="8" fill="${m.bus}"/>
      <!-- Windows -->
      <rect x="3" y="5" width="3" height="3" fill="${m.white}"/>
      <rect x="7" y="5" width="3" height="3" fill="${m.white}"/>
      <rect x="11" y="5" width="2" height="3" fill="${m.white}"/>
      <!-- Wheels -->
      <rect x="3" y="12" width="3" height="3" fill="${m.black}"/>
      <rect x="10" y="12" width="3" height="3" fill="${m.black}"/>
      <rect x="4" y="13" width="1" height="1" fill="${m.white}"/>
      <rect x="11" y="13" width="1" height="1" fill="${m.white}"/>
    </svg>
  `,walking:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Sneaker / Shoe outline -->
      <rect x="1" y="7" width="14" height="7" fill="${m.black}"/>
      <!-- Sneaker body green -->
      <rect x="2" y="8" width="12" height="5" fill="${m.shoe}"/>
      <rect x="2" y="8" width="5" height="5" fill="${m.white}"/>
      <!-- Shoelaces -->
      <rect x="8" y="9" width="3" height="1" fill="${m.white}"/>
      <rect x="9" y="11" width="3" height="1" fill="${m.white}"/>
      <rect x="10" y="8" width="1" height="4" fill="${m.black}"/>
    </svg>
  `,movie:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Clapperboard Outline -->
      <rect x="2" y="3" width="12" height="11" fill="${m.black}"/>
      <!-- Clapper top stripes -->
      <rect x="3" y="4" width="10" height="3" fill="${m.clapper}"/>
      <rect x="4" y="4" width="2" height="2" fill="${m.white}"/>
      <rect x="8" y="4" width="2" height="2" fill="${m.white}"/>
      <rect x="11" y="4" width="1" height="2" fill="${m.white}"/>
      <!-- Clapper bottom -->
      <rect x="3" y="8" width="10" height="5" fill="${m.black}"/>
      <rect x="5" y="9" width="6" height="3" fill="${m.clapper}"/>
    </svg>
  `,music:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Headphones band -->
      <rect x="3" y="2" width="10" height="12" fill="${m.black}"/>
      <rect x="4" y="3" width="8" height="10" fill="${m.white}"/>
      <!-- Earcups -->
      <rect x="2" y="7" width="3" height="6" fill="${m.black}"/>
      <rect x="11" y="7" width="3" height="6" fill="${m.black}"/>
      <!-- Accent colors on cups -->
      <rect x="3" y="8" width="1" height="4" fill="${m.headphone}"/>
      <rect x="12" y="8" width="1" height="4" fill="${m.headphone}"/>
    </svg>
  `,idle:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Thought bubble outline -->
      <rect x="3" y="3" width="10" height="8" fill="${m.black}"/>
      <rect x="4" y="2" width="8" height="10" fill="${m.black}"/>
      <rect x="4" y="3" width="8" height="8" fill="${m.white}"/>
      <!-- Small dots for bubble -->
      <rect x="11" y="11" width="2" height="2" fill="${m.black}"/>
      <rect x="12" y="12" width="2" height="2" fill="${m.black}"/>
      <rect x="12" y="12" width="1" height="1" fill="${m.white}"/>
      <rect x="11" y="11" width="1" height="1" fill="${m.white}"/>
      <!-- Dots inside thought -->
      <rect x="6" y="6" width="1" height="1" fill="${m.black}"/>
      <rect x="8" y="6" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="6" width="1" height="1" fill="${m.black}"/>
    </svg>
  `,friends:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Two pixel heads standing -->
      <!-- Left head -->
      <rect x="2" y="3" width="5" height="5" fill="${m.black}"/>
      <rect x="3" y="4" width="3" height="3" fill="${m.friends}"/>
      <!-- Right head -->
      <rect x="8" y="3" width="5" height="5" fill="${m.black}"/>
      <rect x="9" y="4" width="3" height="3" fill="${m.calm}"/>
      <!-- Joint hands body -->
      <rect x="1" y="8" width="14" height="6" fill="${m.black}"/>
      <rect x="2" y="9" width="4" height="5" fill="${m.friends}"/>
      <rect x="9" y="9" width="4" height="5" fill="${m.calm}"/>
      <rect x="7" y="10" width="1" height="1" fill="${m.white}"/>
    </svg>
  `,charging:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Battery shell outline -->
      <rect x="2" y="4" width="11" height="8" fill="${m.black}"/>
      <rect x="13" y="6" width="2" height="4" fill="${m.black}"/>
      <!-- Battery content -->
      <rect x="3" y="5" width="9" height="6" fill="${m.white}"/>
      <rect x="4" y="6" width="4" height="4" fill="${m.battery}"/>
      <!-- Bolt / heart detail -->
      <rect x="9" y="7" width="2" height="2" fill="${m.angry}"/>
      <rect x="10" y="6" width="1" height="4" fill="${m.angry}"/>
    </svg>
  `,ok:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outline -->
      <rect x="4" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="9" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="3" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="3" width="2" height="1" fill="${m.black}"/>
      <rect x="12" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="2" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="1" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="14" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="2" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="3" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="12" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="4" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="11" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="5" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="6" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="9" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="13" width="2" height="1" fill="${m.black}"/>
      <!-- Fill -->
      <rect x="4" y="3" width="3" height="1" fill="${m.heartOk}"/>
      <rect x="9" y="3" width="3" height="1" fill="${m.heartOk}"/>
      <rect x="3" y="4" width="10" height="1" fill="${m.heartOk}"/>
      <rect x="2" y="5" width="12" height="3" fill="${m.heartOk}"/>
      <rect x="3" y="8" width="10" height="1" fill="${m.heartOk}"/>
      <rect x="4" y="9" width="8" height="1" fill="${m.heartOk}"/>
      <rect x="5" y="10" width="6" height="1" fill="${m.heartOk}"/>
      <rect x="6" y="11" width="4" height="1" fill="${m.heartOk}"/>
      <rect x="7" y="12" width="2" height="1" fill="${m.heartOk}"/>
      <!-- Highlight -->
      <rect x="4" y="4" width="1" height="3" fill="${m.white}"/>
      <rect x="5" y="5" width="1" height="1" fill="${m.white}"/>
    </svg>
  `,later:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outline -->
      <rect x="4" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="9" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="3" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="3" width="2" height="1" fill="${m.black}"/>
      <rect x="12" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="2" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="1" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="14" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="2" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="3" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="12" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="4" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="11" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="5" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="6" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="9" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="13" width="2" height="1" fill="${m.black}"/>
      <!-- Fill -->
      <rect x="4" y="3" width="3" height="1" fill="${m.heartLater}"/>
      <rect x="9" y="3" width="3" height="1" fill="${m.heartLater}"/>
      <rect x="3" y="4" width="10" height="1" fill="${m.heartLater}"/>
      <rect x="2" y="5" width="12" height="3" fill="${m.heartLater}"/>
      <rect x="3" y="8" width="10" height="1" fill="${m.heartLater}"/>
      <rect x="4" y="9" width="8" height="1" fill="${m.heartLater}"/>
      <rect x="5" y="10" width="6" height="1" fill="${m.heartLater}"/>
      <rect x="6" y="11" width="4" height="1" fill="${m.heartLater}"/>
      <rect x="7" y="12" width="2" height="1" fill="${m.heartLater}"/>
      <!-- Highlight -->
      <rect x="4" y="4" width="1" height="3" fill="${m.white}"/>
      <rect x="5" y="5" width="1" height="1" fill="${m.white}"/>
    </svg>
  `,no:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outline -->
      <rect x="4" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="9" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="3" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="3" width="2" height="1" fill="${m.black}"/>
      <rect x="12" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="2" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="1" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="14" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="2" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="3" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="12" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="4" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="11" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="5" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="6" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="9" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="13" width="2" height="1" fill="${m.black}"/>
      <!-- Fill -->
      <rect x="4" y="3" width="3" height="1" fill="${m.heartNo}"/>
      <rect x="9" y="3" width="3" height="1" fill="${m.heartNo}"/>
      <rect x="3" y="4" width="10" height="1" fill="${m.heartNo}"/>
      <rect x="2" y="5" width="12" height="3" fill="${m.heartNo}"/>
      <rect x="3" y="8" width="10" height="1" fill="${m.heartNo}"/>
      <rect x="4" y="9" width="8" height="1" fill="${m.heartNo}"/>
      <rect x="5" y="10" width="6" height="1" fill="${m.heartNo}"/>
      <rect x="6" y="11" width="4" height="1" fill="${m.heartNo}"/>
      <rect x="7" y="12" width="2" height="1" fill="${m.heartNo}"/>
      <!-- Highlight -->
      <rect x="4" y="4" width="1" height="3" fill="${m.white}"/>
      <rect x="5" y="5" width="1" height="1" fill="${m.white}"/>
    </svg>
  `,seen:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outline -->
      <rect x="4" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="9" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="3" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="3" width="2" height="1" fill="${m.black}"/>
      <rect x="12" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="2" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="1" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="14" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="2" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="3" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="12" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="4" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="11" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="5" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="6" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="9" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="13" width="2" height="1" fill="${m.black}"/>
      <!-- Fill -->
      <rect x="4" y="3" width="3" height="1" fill="${m.heartSeen}"/>
      <rect x="9" y="3" width="3" height="1" fill="${m.heartSeen}"/>
      <rect x="3" y="4" width="10" height="1" fill="${m.heartSeen}"/>
      <rect x="2" y="5" width="12" height="3" fill="${m.heartSeen}"/>
      <rect x="3" y="8" width="10" height="1" fill="${m.heartSeen}"/>
      <rect x="4" y="9" width="8" height="1" fill="${m.heartSeen}"/>
      <rect x="5" y="10" width="6" height="1" fill="${m.heartSeen}"/>
      <rect x="6" y="11" width="4" height="1" fill="${m.heartSeen}"/>
      <rect x="7" y="12" width="2" height="1" fill="${m.heartSeen}"/>
      <!-- Highlight -->
      <rect x="4" y="4" width="1" height="3" fill="${m.white}"/>
      <rect x="5" y="5" width="1" height="1" fill="${m.white}"/>
    </svg>
  `,heart:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outline -->
      <rect x="4" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="9" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="3" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="3" width="2" height="1" fill="${m.black}"/>
      <rect x="12" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="2" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="1" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="14" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="2" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="3" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="12" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="4" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="11" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="5" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="6" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="9" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="13" width="2" height="1" fill="${m.black}"/>
      <!-- Fill -->
      <rect x="4" y="3" width="3" height="1" fill="${m.heartRed}"/>
      <rect x="9" y="3" width="3" height="1" fill="${m.heartRed}"/>
      <rect x="3" y="4" width="10" height="1" fill="${m.heartRed}"/>
      <rect x="2" y="5" width="12" height="3" fill="${m.heartRed}"/>
      <rect x="3" y="8" width="10" height="1" fill="${m.heartRed}"/>
      <rect x="4" y="9" width="8" height="1" fill="${m.heartRed}"/>
      <rect x="5" y="10" width="6" height="1" fill="${m.heartRed}"/>
      <rect x="6" y="11" width="4" height="1" fill="${m.heartRed}"/>
      <rect x="7" y="12" width="2" height="1" fill="${m.heartRed}"/>
      <!-- Highlight -->
      <rect x="4" y="4" width="1" height="3" fill="${m.white}"/>
      <rect x="5" y="5" width="1" height="1" fill="${m.white}"/>
    </svg>
  `,emptyPhoto:`
    <svg viewBox="0 0 24 24" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Camera Empty state placeholder -->
      <rect x="3" y="6" width="18" height="13" fill="${m.black}"/>
      <rect x="4" y="7" width="16" height="11" fill="${m.white}"/>
      <rect x="8" y="4" width="8" height="2" fill="${m.black}"/>
      <rect x="9" y="5" width="6" height="1" fill="${m.sleepyZ}"/>
      <circle cx="12" cy="12" r="3" fill="${m.black}"/>
      <circle cx="12" cy="12" r="2" fill="${m.sleepy}"/>
    </svg>
  `,moodHeader:`
    <svg viewBox="0 0 16 16" class="pixel-icon text-header-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="12" height="8" fill="${m.black}"/>
      <rect x="3" y="4" width="10" height="6" fill="${m.white}"/>
      <rect x="4" y="11" width="2" height="2" fill="${m.black}"/>
      <rect x="6" y="13" width="2" height="2" fill="${m.black}"/>
      <rect x="5" y="11" width="1" height="1" fill="${m.white}"/>
      <rect x="7" y="13" width="1" height="1" fill="${m.white}"/>
    </svg>
  `,activityHeader:`
    <svg viewBox="0 0 16 16" class="pixel-icon text-header-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Target -->
      <rect x="1" y="7" width="14" height="2" fill="${m.black}"/>
      <rect x="7" y="1" width="2" height="14" fill="${m.black}"/>
      <circle cx="8" cy="8" r="4.5" stroke="${m.black}" fill="none" stroke-width="1.5"/>
      <circle cx="8" cy="8" r="2.5" fill="${m.angry}"/>
      <circle cx="8" cy="8" r="1" fill="${m.black}"/>
    </svg>
  `,disturbHeader:`
    <svg viewBox="0 0 16 16" class="pixel-icon text-header-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Bell -->
      <path d="M7 1h2v2H7V1zm-3 4h8v6H4V5zm-2 6h12v2H2v-2zm5 2h2v2H7v-2z" fill="${m.black}"/>
      <path d="M5 6h6v4H5V6zm-1 5h8v1H4v-1z" fill="${m.happy}"/>
    </svg>
  `,messageHeader:`
    <svg viewBox="0 0 16 16" class="pixel-icon text-header-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Bubble -->
      <rect x="2" y="3" width="12" height="9" fill="${m.black}"/>
      <rect x="3" y="4" width="10" height="7" fill="${m.white}"/>
      <rect x="4" y="12" width="3" height="2" fill="${m.black}"/>
      <rect x="5" y="12" width="1.5" height="1.5" fill="${m.white}"/>
      <rect x="5" y="7" width="6" height="1.5" fill="${m.black}"/>
    </svg>
  `,durationHeader:`
    <svg viewBox="0 0 16 16" class="pixel-icon text-header-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Hourglass -->
      <rect x="3" y="2" width="10" height="12" fill="${m.black}"/>
      <rect x="4" y="3" width="8" height="10" fill="${m.white}"/>
      <!-- Sand sand-clock waist -->
      <polygon points="4,3 12,3 9,7 12,11 4,11 7,7" fill="${m.bus}"/>
      <rect x="7" y="7" width="2" height="2" fill="${m.black}"/>
    </svg>
  `,allTab:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Paint Palette -->
      <path d="M3 2h10v2h2v8h-2v2H3v-2H1V4h2V2z" fill="${m.black}"/>
      <path d="M4 3h8v2h2v6H4V3zm-1 8h10v2H3v-2z" fill="${m.white}"/>
      <!-- Colors -->
      <rect x="4" y="4" width="2" height="2" fill="${m.angry}"/>
      <rect x="7" y="4" width="2" height="2" fill="${m.happy}"/>
      <rect x="10" y="4" width="2" height="2" fill="${m.calm}"/>
      <rect x="5" y="7" width="2" height="2" fill="${m.miss}"/>
    </svg>
  `,photoTab:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Camera Tab -->
      <rect x="1" y="4" width="14" height="9" fill="${m.black}"/>
      <rect x="5" y="2" width="6" height="2" fill="${m.black}"/>
      <rect x="2" y="5" width="12" height="7" fill="${m.white}"/>
      <circle cx="8" cy="8.5" r="2" fill="${m.black}"/>
      <circle cx="8" cy="8.5" r="1" fill="${m.calm}"/>
    </svg>
  `,messageTab:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Love Letter Tab -->
      <rect x="1" y="3" width="14" height="10" fill="${m.black}"/>
      <rect x="2" y="4" width="12" height="8" fill="${m.white}"/>
      <!-- Envelope folds -->
      <path d="M2 4l6 4 6-4" stroke="${m.black}" stroke-width="1" fill="none"/>
      <rect x="7" y="6.5" width="2" height="2" fill="${m.angry}"/>
    </svg>
  `,petCat:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Compact avatar aligned with the canonical full-size in-app cat -->
      <rect x="3" y="2" width="3" height="3" fill="#C9874F"/>
      <rect x="10" y="2" width="3" height="3" fill="#C9874F"/>
      <rect x="4" y="1" width="1" height="1" fill="#8B5634"/>
      <rect x="11" y="1" width="1" height="1" fill="#8B5634"/>
      <rect x="4" y="2" width="1" height="2" fill="#F4A3AC"/>
      <rect x="11" y="2" width="1" height="2" fill="#F4A3AC"/>

      <rect x="3" y="4" width="10" height="7" fill="#C9874F"/>
      <rect x="6" y="4" width="1" height="1" fill="#8B5634"/>
      <rect x="8" y="4" width="1" height="2" fill="#8B5634"/>
      <rect x="10" y="4" width="1" height="1" fill="#8B5634"/>

      <!-- Canonical block eyes, tiny cat muzzle and whiskers -->
      <rect x="5" y="6" width="2" height="2" fill="#2D2521"/>
      <rect x="9" y="6" width="2" height="2" fill="#2D2521"/>
      <rect x="5" y="6" width="1" height="1" fill="#FFFFFF"/>
      <rect x="9" y="6" width="1" height="1" fill="#FFFFFF"/>
      <rect x="6" y="8" width="4" height="2" fill="#F4C99B"/>
      <rect x="7" y="8" width="2" height="1" fill="#B85C6B"/>
      <rect x="1" y="8" width="2" height="1" fill="#8B5634"/>
      <rect x="13" y="8" width="2" height="1" fill="#8B5634"/>
      <rect x="3" y="9" width="2" height="1" fill="#F29AA5"/>
      <rect x="11" y="9" width="2" height="1" fill="#F29AA5"/>

      <rect x="3" y="11" width="10" height="2" fill="#E56B6F"/>
      <rect x="4" y="13" width="3" height="2" fill="#E56B6F"/>
    </svg>
  `,petDog:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Upright ears shared with the full-size caramel puppy -->
      <rect x="4" y="1" width="2" height="1" fill="#D89B65"/>
      <rect x="10" y="1" width="2" height="1" fill="#D89B65"/>
      <rect x="3" y="2" width="3" height="3" fill="#D89B65"/>
      <rect x="10" y="2" width="3" height="3" fill="#D89B65"/>
      <rect x="4" y="2" width="1" height="3" fill="#FFAEBC"/>
      <rect x="11" y="2" width="1" height="3" fill="#FFAEBC"/>

      <!-- Compact caramel face and cream blaze -->
      <rect x="3" y="4" width="10" height="7" fill="#D89B65"/>
      <rect x="7" y="4" width="2" height="3" fill="#FAF5EB"/>
      <rect x="5" y="6" width="1" height="2" fill="#2D2D2D"/>
      <rect x="10" y="6" width="1" height="2" fill="#2D2D2D"/>
      <rect x="6" y="8" width="4" height="2" fill="#FAF5EB"/>
      <rect x="7" y="8" width="2" height="1" fill="#2D2D2D"/>
      <rect x="3" y="9" width="2" height="1" fill="#FFD2A8"/>
      <rect x="11" y="9" width="2" height="1" fill="#FFD2A8"/>

      <!-- Red scarf from the full-size sprite -->
      <rect x="3" y="11" width="10" height="2" fill="#E56B6F"/>
      <rect x="4" y="13" width="3" height="2" fill="#E56B6F"/>
    </svg>
  `,styleCandy:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Candy style wrapper -->
      <rect x="2" y="5" width="12" height="6" fill="${m.black}"/>
      <rect x="5" y="3" width="6" height="10" fill="${m.black}"/>
      <rect x="5" y="4" width="6" height="8" fill="${m.miss}"/>
      <!-- Twist ends -->
      <rect x="3" y="6" width="2" height="4" fill="${m.angry}"/>
      <rect x="11" y="6" width="2" height="4" fill="${m.angry}"/>
    </svg>
  `,stylePixel:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Retro Joystick -->
      <rect x="7" y="1" width="2" height="10" fill="${m.black}"/>
      <circle cx="8" cy="3" r="2.5" fill="${m.angry}"/>
      <rect x="2" y="11" width="12" height="4" fill="${m.black}"/>
      <rect x="3" y="12" width="10" height="2" fill="${m.sleepy}"/>
      <rect x="10" y="12" width="2" height="2" fill="${m.angry}"/>
    </svg>
  `,styleLofi:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Teacup -->
      <rect x="2" y="4" width="10" height="9" fill="${m.black}"/>
      <!-- Handle -->
      <rect x="11" y="6" width="3" height="5" fill="${m.black}"/>
      <rect x="12" y="7" width="1" height="3" fill="${m.white}"/>
      <!-- Cup Inner -->
      <rect x="3" y="5" width="8" height="7" fill="${m.white}"/>
      <rect x="3" y="5" width="8" height="2" fill="${m.calm}"/>
      <!-- Steam -->
      <rect x="4" y="1" width="1" height="2" fill="${m.sleepyZ}"/>
      <rect x="7" y="1" width="1" height="2" fill="${m.sleepyZ}"/>
      <rect x="9" y="1" width="1" height="2" fill="${m.sleepyZ}"/>
    </svg>
  `,moodCalmBubble:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Cloud -->
      <rect x="2" y="7" width="12" height="7" fill="${m.black}"/>
      <rect x="4" y="5" width="10" height="8" fill="${m.black}"/>
      <rect x="6" y="3" width="6" height="10" fill="${m.black}"/>
      <rect x="3" y="8" width="10" height="5" fill="${m.white}"/>
      <rect x="5" y="6" width="8" height="6" fill="${m.white}"/>
      <rect x="7" y="4" width="4" height="6" fill="${m.white}"/>
    </svg>
  `,moodTiredBubble:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Battery low -->
      <rect x="3" y="4" width="10" height="8" fill="${m.black}"/>
      <rect x="13" y="6" width="1" height="4" fill="${m.black}"/>
      <rect x="4" y="5" width="8" height="6" fill="${m.white}"/>
      <rect x="5" y="6" width="2" height="4" fill="${m.angry}"/>
    </svg>
  `,moodMissBubble:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outline -->
      <rect x="4" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="9" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="3" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="3" width="2" height="1" fill="${m.black}"/>
      <rect x="12" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="2" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="1" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="14" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="2" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="3" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="12" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="4" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="11" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="5" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="6" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="9" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="13" width="2" height="1" fill="${m.black}"/>
      <!-- Fill -->
      <rect x="4" y="3" width="3" height="1" fill="${m.miss}"/>
      <rect x="9" y="3" width="3" height="1" fill="${m.miss}"/>
      <rect x="3" y="4" width="10" height="1" fill="${m.miss}"/>
      <rect x="2" y="5" width="12" height="3" fill="${m.miss}"/>
      <rect x="3" y="8" width="10" height="1" fill="${m.miss}"/>
      <rect x="4" y="9" width="8" height="1" fill="${m.miss}"/>
      <rect x="5" y="10" width="6" height="1" fill="${m.miss}"/>
      <rect x="6" y="11" width="4" height="1" fill="${m.miss}"/>
      <rect x="7" y="12" width="2" height="1" fill="${m.miss}"/>
      <!-- Highlight -->
      <rect x="4" y="4" width="1" height="3" fill="${m.white}"/>
      <rect x="5" y="5" width="1" height="1" fill="${m.white}"/>
    </svg>
  `,moodSadBubble:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Rain Cloud -->
      <rect x="3" y="3" width="10" height="6" fill="${m.black}"/>
      <rect x="4" y="4" width="8" height="5" fill="${m.sleepy}"/>
      <!-- Rain drops -->
      <rect x="5" y="10" width="1" height="2" fill="${m.sadTear}"/>
      <rect x="8" y="11" width="1" height="2" fill="${m.sadTear}"/>
      <rect x="11" y="9" width="1" height="2" fill="${m.sadTear}"/>
    </svg>
  `,moodAngryBubble:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Anger cross mark -->
      <rect x="4" y="2" width="8" height="12" fill="${m.angry}"/>
      <rect x="2" y="4" width="12" height="8" fill="${m.angry}"/>
      <!-- Cross lines black -->
      <rect x="7" y="2" width="2" height="12" fill="${m.black}"/>
      <rect x="2" y="7" width="12" height="2" fill="${m.black}"/>
      <rect x="4" y="4" width="2" height="2" fill="${m.black}"/>
      <rect x="10" y="4" width="2" height="2" fill="${m.black}"/>
      <rect x="4" y="10" width="2" height="2" fill="${m.black}"/>
      <rect x="10" y="10" width="2" height="2" fill="${m.black}"/>
    </svg>
  `,moodAnxiousBubble:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Splashing sweat drops -->
      <path d="M2 3l1-1h1v1L3 4H2V3zm10 0l-1-1h-1v1l1 1h1V3zM4 9h2v2H4V9zm6 0h2v2h-2V9z" fill="${m.anxiousSweat}"/>
      <path d="M1 4h4v2H1V4zm10 0h4v2h-4V4zm-8 4v2h2V8H3zm8 0v2h2V8h-2z" fill="${m.black}"/>
    </svg>
  `,moodSleepyBubble:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Zzz Zzz -->
      <path d="M2 8h3v1l-2 2h2v1h-3v-1l2-2h-2v-1zm7-6h4v1l-3 3h3v1h-4v-1l3-3h-3v-1z" fill="${m.black}"/>
      <path d="M3 9h1v1h-1v-1zm7-6h1v1h-1v-1z" fill="${m.sleepyZ}"/>
    </svg>
  `,moodExcitedBubble:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Big Sparkle Star -->
      <rect x="7" y="1" width="2" height="14" fill="${m.black}"/>
      <rect x="1" y="7" width="14" height="2" fill="${m.black}"/>
      <rect x="5" y="5" width="6" height="6" fill="${m.black}"/>
      <rect x="6" y="3" width="4" height="10" fill="${m.black}"/>
      <rect x="3" y="6" width="10" height="4" fill="${m.black}"/>
      <!-- Yellow Star Core -->
      <rect x="7" y="3" width="2" height="10" fill="${m.happy}"/>
      <rect x="3" y="7" width="10" height="2" fill="${m.happy}"/>
      <rect x="6" y="5" width="4" height="6" fill="${m.happy}"/>
      <rect x="7" y="6" width="2" height="4" fill="${m.white}"/>
    </svg>
  `,moodQuietBubble:`
    <svg viewBox="0 0 16 16" class="pixel-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Shush / Dot dots -->
      <rect x="3" y="7" width="2" height="2" fill="${m.black}"/>
      <rect x="7" y="7" width="2" height="2" fill="${m.black}"/>
      <rect x="11" y="7" width="2" height="2" fill="${m.black}"/>
      <rect x="3" y="7" width="2" height="2" fill="${m.quiet}" transform="translate(0, 1)"/>
    </svg>
  `,stickerHeart:`
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outline -->
      <rect x="4" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="9" y="2" width="3" height="1" fill="${m.black}"/>
      <rect x="3" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="3" width="2" height="1" fill="${m.black}"/>
      <rect x="12" y="3" width="1" height="1" fill="${m.black}"/>
      <rect x="2" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="4" width="1" height="1" fill="${m.black}"/>
      <rect x="1" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="14" y="5" width="1" height="3" fill="${m.black}"/>
      <rect x="2" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="13" y="8" width="1" height="1" fill="${m.black}"/>
      <rect x="3" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="12" y="9" width="1" height="1" fill="${m.black}"/>
      <rect x="4" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="11" y="10" width="1" height="1" fill="${m.black}"/>
      <rect x="5" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="10" y="11" width="1" height="1" fill="${m.black}"/>
      <rect x="6" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="9" y="12" width="1" height="1" fill="${m.black}"/>
      <rect x="7" y="13" width="2" height="1" fill="${m.black}"/>
      <!-- Fill -->
      <rect x="4" y="3" width="3" height="1" fill="#FF8E9E"/>
      <rect x="9" y="3" width="3" height="1" fill="#FF8E9E"/>
      <rect x="3" y="4" width="10" height="1" fill="#FF8E9E"/>
      <rect x="2" y="5" width="12" height="3" fill="#FF8E9E"/>
      <rect x="3" y="8" width="10" height="1" fill="#FF8E9E"/>
      <rect x="4" y="9" width="8" height="1" fill="#FF8E9E"/>
      <rect x="5" y="10" width="6" height="1" fill="#FF8E9E"/>
      <rect x="6" y="11" width="4" height="1" fill="#FF8E9E"/>
      <rect x="7" y="12" width="2" height="1" fill="#FF8E9E"/>
      <!-- Highlight -->
      <rect x="4" y="4" width="1" height="3" fill="${m.white}"/>
      <rect x="5" y="5" width="1" height="1" fill="${m.white}"/>
    </svg>
  `,stickerStar:`
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="1" width="2" height="14" fill="${m.black}"/>
      <rect x="1" y="7" width="14" height="2" fill="${m.black}"/>
      <rect x="5" y="5" width="6" height="6" fill="${m.black}"/>
      <rect x="6" y="3" width="4" height="10" fill="${m.black}"/>
      <rect x="3" y="6" width="10" height="4" fill="${m.black}"/>
      <rect x="7" y="2" width="2" height="12" fill="#F4C542"/>
      <rect x="2" y="7" width="12" height="2" fill="#F4C542"/>
      <rect x="6" y="4" width="4" height="8" fill="#F4C542"/>
      <rect x="4" y="6" width="8" height="4" fill="#F4C542"/>
      <rect x="7" y="7" width="2" height="2" fill="${m.white}"/>
    </svg>
  `,stickerPaw:`
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="8" width="6" height="5" fill="${m.black}"/>
      <rect x="6" y="7" width="4" height="7" fill="${m.black}"/>
      <rect x="3" y="4" width="2" height="3" fill="${m.black}"/>
      <rect x="6" y="3" width="2" height="3" fill="${m.black}"/>
      <rect x="9" y="3" width="2" height="3" fill="${m.black}"/>
      <rect x="12" y="4" width="2" height="3" fill="${m.black}"/>
      <rect x="6" y="9" width="4" height="3" fill="#FF8E9E"/>
      <rect x="7" y="8" width="2" height="5" fill="#FF8E9E"/>
      <rect x="3.5" y="4.5" width="1" height="1.5" fill="#FF8E9E"/>
      <rect x="6.5" y="3.5" width="1" height="1.5" fill="#FF8E9E"/>
      <rect x="9.5" y="3.5" width="1" height="1.5" fill="#FF8E9E"/>
      <rect x="12.5" y="4.5" width="1" height="1.5" fill="#FF8E9E"/>
    </svg>
  `,stickerRibbon:`
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="3" width="6" height="6" fill="${m.black}"/>
      <rect x="2" y="4" width="4" height="4" fill="#FF8E9E"/>
      <rect x="3" y="5" width="2" height="2" fill="${m.white}"/>
      <rect x="9" y="3" width="6" height="6" fill="${m.black}"/>
      <rect x="10" y="4" width="4" height="4" fill="#FF8E9E"/>
      <rect x="11" y="5" width="2" height="2" fill="${m.white}"/>
      <rect x="6" y="5" width="4" height="4" fill="${m.black}"/>
      <rect x="7" y="6" width="2" height="2" fill="#FF5E7E"/>
      <rect x="2" y="9" width="2" height="4" fill="${m.black}"/>
      <rect x="2" y="9" width="1" height="3" fill="#FF8E9E"/>
      <rect x="12" y="9" width="2" height="4" fill="${m.black}"/>
      <rect x="13" y="9" width="1" height="3" fill="#FF8E9E"/>
    </svg>
  `,stickerDrink:`
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="1" width="2" height="5" fill="#FF8E9E"/>
      <rect x="10" y="2" width="2" height="1" fill="#FF8E9E"/>
      <rect x="3" y="5" width="10" height="10" fill="${m.black}"/>
      <rect x="4" y="6" width="8" height="8" fill="#A8D8C8"/>
      <rect x="2" y="4" width="12" height="2" fill="${m.black}"/>
      <rect x="3" y="5" width="10" height="1" fill="${m.white}"/>
      <rect x="4" y="9" width="8" height="2" fill="#F4C542"/>
    </svg>
  `,stickerGlasses:`
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="6" width="14" height="5" fill="${m.black}"/>
      <rect x="2" y="7" width="4" height="3" fill="#3D405B"/>
      <rect x="3" y="7" width="1" height="1" fill="${m.white}"/>
      <rect x="10" y="7" width="4" height="3" fill="#3D405B"/>
      <rect x="11" y="7" width="1" height="1" fill="${m.white}"/>
      <rect x="7" y="7" width="2" height="1" fill="${m.black}"/>
    </svg>
  `,stickerCrown:`
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 4l3 3 4-4 4 4 3-4v8H1V4z" fill="${m.black}"/>
      <rect x="1" y="11" width="14" height="3" fill="${m.black}"/>
      <path d="M2 6.5l2 2 4-4 4 4 2-2v4.5H2V6.5z" fill="#F4C542"/>
      <rect x="2" y="11" width="12" height="2" fill="#F4C542"/>
      <rect x="7" y="11" width="2" height="2" fill="#E85050"/>
      <rect x="4" y="2" width="1" height="1" fill="${m.white}"/>
      <rect x="11" y="2" width="1" height="1" fill="${m.white}"/>
    </svg>
  `,stickerDino:`
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="8" height="12" fill="${m.black}"/>
      <rect x="9" y="5" width="5" height="5" fill="${m.black}"/>
      <rect x="4" y="3" width="6" height="10" fill="#81B29A"/>
      <rect x="9" y="6" width="4" height="3" fill="#81B29A"/>
      <rect x="11" y="4" width="1" height="1.5" fill="${m.black}"/>
      <rect x="5" y="8" width="3" height="4" fill="#F4EAD4"/>
      <rect x="1" y="9" width="3" height="4" fill="${m.black}"/>
      <rect x="2" y="10" width="2" height="2" fill="#81B29A"/>
    </svg>
  `,stickerIceCream:`
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 8l4 7 4-7H4z" fill="${m.black}"/>
      <path d="M5 8.5l3 5.5 3-5.5H5z" fill="#C89870"/>
      <rect x="3" y="3" width="10" height="6" fill="${m.black}"/>
      <rect x="4" y="2" width="8" height="6" fill="${m.black}"/>
      <rect x="4" y="4" width="8" height="4" fill="#FF8E9E"/>
      <rect x="5" y="3" width="6" height="4" fill="#FF8E9E"/>
      <rect x="7" y="1" width="2" height="2" fill="#E85050"/>
    </svg>
  `,stickerRainbow:`
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="9" width="14" height="6" fill="${m.black}"/>
      <rect x="2" y="8" width="12" height="6" fill="${m.black}"/>
      <rect x="4" y="6" width="8" height="6" fill="${m.black}"/>
      <rect x="2" y="9" width="12" height="5" fill="#E85050"/>
      <rect x="4" y="7" width="8" height="7" fill="#F4C542"/>
      <rect x="5" y="8" width="6" height="6" fill="#A8D8C8"/>
      <rect x="6" y="9" width="4" height="6" fill="${m.white}"/>
      <rect x="6" y="9" width="4" height="1" fill="${m.black}"/>
    </svg>
  `,cameraFlash:`
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="9,1 2,9 7,9 5,15 13,7 8,7" fill="#F4C542" stroke="${m.black}" stroke-width="1.5"/>
    </svg>
  `,cameraFlip:`
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13,8 A5,5 0 1,0 7,13" stroke="${m.black}" stroke-width="2" fill="none"/>
      <path d="M3,8 A5,5 0 1,0 9,3" stroke="${m.black}" stroke-width="2" fill="none"/>
      <polygon points="13,5 13,9 9,9" fill="${m.black}"/>
      <polygon points="3,11 3,7 7,7" fill="${m.black}"/>
    </svg>
  `},g={catBody:`#E07A5F`,catDark:`#C6654E`,catEar:`#E07A5F`,catEarInner:`#F4A261`,catNose:`#1A1A1A`,catEye:`#1A1A1A`,catWhisker:`#C6654E`,catMouth:`#1A1A1A`,catCheek:`#F0B0B0`,dogBody:`#F2CC8F`,dogDark:`#D4A86A`,dogBelly:`#FAF7F2`,dogEarInner:`#D4A86A`,dogNose:`#1A1A1A`,dogEye:`#1A1A1A`,dogCheek:`#F0C890`,dogTongue:`#E56B6F`,white:`#FFFFFF`,black:`#1A1A1A`,transparent:`transparent`,angry:`#E85050`,desk:`#B89878`,deskDark:`#987858`,screen:`#A8D8E8`,screenGlow:`#C8E8F0`,keyboard:`#D0D0D0`,gamepad:`#888888`,gamepadBtn:`#E85050`,headphone:`#505050`,headphonePad:`#707070`,blanket:`#B8C8E8`,blanketDark:`#98A8C8`,window:`#C8E0F0`,windowFrame:`#D8C8B8`,pillow:`#E8E0D8`,musicNote:`#E8B4B8`,rainCloud:`#A0A8B0`,rainDrop:`#88A0B8`,heart:`#E8B4B8`,star:`#F5D76E`,book:`#C89870`,food:`#F0C878`,zzz:`#A8B8C8`};function _(e){let t=Math.floor(e/5)%4;return t===1?{x:.5,y:-.5}:t===2?{x:.5,y:0}:t===3?{x:.5,y:.5}:{x:0,y:0}}function v(e){let t=Math.floor(e/12)%4;return t===1?{leftFootY:-1,rightFootY:0,bodyWalkBob:-1}:t===3?{leftFootY:0,rightFootY:-1,bodyWalkBob:-1}:{leftFootY:0,rightFootY:0,bodyWalkBob:0}}var y=class{constructor(e,t={}){this.canvas=e,this.ctx=e.getContext(`2d`),this.pixelSize=t.pixelSize||8,this.gridSize=32,this.petType=t.petType||`cat`,this.mood=t.mood||`calm`,this.activity=t.activity||`idle`,this.petStyle=t.petStyle||`styleA`,this.frame=0,this.animTimer=null,this.bobOffset=0,this.bobDir=1;let n=this.gridSize*this.pixelSize,r=t.displaySize||n;this.canvas.width=n,this.canvas.height=n,this.canvas.style.width=`${r}px`,this.canvas.style.height=`${r}px`,this.canvas.style.imageRendering=`pixelated`}setStyle(e){this.petStyle=e}setPixel(e,t,n){n===`transparent`||!n||(this.ctx.fillStyle=n,this.ctx.fillRect(e*this.pixelSize,t*this.pixelSize,this.pixelSize,this.pixelSize))}_drawPixelSprite(e,t,n,r){for(let i=0;i<n.length;i++){let a=n[i];for(let n=0;n<a.length;n++){let o=a[n];o!==`.`&&r[o]&&this.setPixel(e+n,t+i,r[o])}}}clear(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}fillRect(e,t,n,r,i){this.ctx.fillStyle=i,this.ctx.fillRect(e*this.pixelSize,t*this.pixelSize,n*this.pixelSize,r*this.pixelSize)}strokeRect(e,t,n,r,i){this.fillRect(e,t,n,1,i),this.fillRect(e,t+r-1,n,1,i),this.fillRect(e,t,1,r,i),this.fillRect(e+n-1,t,1,r,i)}setState(e,t){this.mood=e,this.activity=t,this.frame=0}startAnimation(){if(this.animTimer)return;if(typeof window<`u`&&window.matchMedia?.(`(prefers-reduced-motion: reduce)`).matches){this.render();return}let e=()=>{this.frame++,this.bobOffset=Math.sin(this.frame*.06)*.55,this.render(),this.animTimer=requestAnimationFrame(e)};e()}stopAnimation(){this.animTimer&&=(cancelAnimationFrame(this.animTimer),null)}render(){this.clear(),this._getScene()()}_getScene(){let e=this.activity,t=this.mood,n={gaming:()=>this._drawGamingScene(),studying:()=>this._drawStudyingScene(),working:()=>this._drawWorkingScene(),sleeping:()=>this._drawSleepingScene(),music:()=>this._drawMusicScene(),eating:()=>this._drawEatingScene(),movie:()=>this._drawMovieScene(),walking:()=>this._drawWalkingScene(),commuting:()=>this._drawCommutingScene(),friends:()=>this._drawFriendsScene(),charging:()=>this._drawChargingScene()};return n[e]?()=>{n[e](),this._drawMoodCue(e)}:t===`happy`?()=>this._drawHappyIdleScene():t===`miss`?()=>this._drawMissScene():t===`sad`?()=>this._drawSadScene():t===`angry`?()=>this._drawAngryScene():t===`sleepy`?()=>this._drawSleepyIdleScene():t===`excited`?()=>this._drawExcitedScene():t===`anxious`?()=>this._drawAnxiousScene():t===`quiet`?()=>this._drawQuietScene():t===`tired`?()=>this._drawTiredScene():()=>this._drawCalmIdleScene()}_getMoodExpression(e=`open`){return{happy:`happy`,calm:e,tired:`half-closed`,miss:e,sad:`closed`,angry:`angry`,anxious:`anxious`,sleepy:`closed`,excited:`happy`,quiet:`closed`}[this.mood]||e}_getPetColors(){let e=this.petStyle;if(e===`styleC`)switch(this.petType){case`dog`:return{body:`#C5B49F`,dark:`#A0907F`,earInner:`#E5D8C8`,nose:`#4A4540`,eye:`#4A4540`,cheek:`#D0C2B0`,belly:`#E5E0DA`,tongue:`#E09898`};default:return{body:`#9F8170`,dark:`#7A6050`,earInner:`#C5B49F`,nose:`#4A4540`,eye:`#4A4540`,cheek:`#C8B0A0`,belly:`#E5E0DA`,whisker:`#7A6050`}}else if(e===`styleA`)switch(this.petType){case`dog`:return{body:`#D89B65`,dark:`#B07548`,earInner:`#FFAEBC`,nose:`#2D2D2D`,eye:`#2D2D2D`,cheek:`#FFD2A8`,belly:`#FAF5EB`,tongue:`#FF6F61`};default:return{body:`#C9874F`,dark:`#8B5634`,earInner:`#F4A3AC`,nose:`#B85C6B`,eye:`#2D2521`,cheek:`#F29AA5`,belly:`#F4C99B`,whisker:`#8B5634`}}else switch(this.petType){case`dog`:return{body:`#D09458`,dark:`#A36C38`,earInner:`#7A4B24`,nose:`#1A1A1A`,eye:`#1A1A1A`,cheek:`#E8B67D`,belly:`#FAF7F2`,tongue:`#FF8E9E`};default:return{body:`#E07A5F`,dark:`#C6654E`,earInner:`#FFAEBC`,nose:`#FFAEBC`,eye:`#4E8060`,cheek:`#F28E8E`,belly:`#FFFFFF`,whisker:`#C6654E`}}}_drawEyes(e,t,n,r){if(n===`closed`){this.fillRect(e+4,t+1,3,1,r.eye),this.fillRect(e+9,t+1,3,1,r.eye);return}if(n===`happy`){this.setPixel(e+4,t+1,r.eye),this.setPixel(e+5,t,r.eye),this.setPixel(e+6,t+1,r.eye),this.setPixel(e+9,t+1,r.eye),this.setPixel(e+10,t,r.eye),this.setPixel(e+11,t+1,r.eye);return}if(n===`angry`){this.setPixel(e+4,t-1,r.eye),this.fillRect(e+5,t,2,1,r.eye),this.fillRect(e+9,t,2,1,r.eye),this.setPixel(e+11,t-1,r.eye),this.fillRect(e+5,t+1,2,3,r.eye),this.fillRect(e+9,t+1,2,3,r.eye),this.setPixel(e+5,t+1,g.white),this.setPixel(e+9,t+1,g.white);return}if(n===`anxious`){this.fillRect(e+4,t,2,1,r.eye),this.setPixel(e+6,t-1,r.eye),this.setPixel(e+9,t-1,r.eye),this.fillRect(e+10,t,2,1,r.eye),this.fillRect(e+5,t+1,2,3,r.eye),this.fillRect(e+9,t+1,2,3,r.eye),this.setPixel(e+5,t+1,g.white),this.setPixel(e+9,t+1,g.white);return}this.petStyle===`styleA`?n===`open`?(this.fillRect(e+5,t,2,3,r.eye),this.fillRect(e+9,t,2,3,r.eye),this.setPixel(e+5,t,g.white),this.setPixel(e+9,t,g.white)):n===`half-closed`&&(this.fillRect(e+5,t+1,2,2,r.eye),this.fillRect(e+9,t+1,2,2,r.eye),this.setPixel(e+5,t+1,g.white),this.setPixel(e+9,t+1,g.white)):this.petStyle===`styleC`?(n===`open`||n===`half-closed`)&&(this.fillRect(e+5,t+1,1,1,r.eye),this.fillRect(e+10,t+1,1,1,r.eye)):n===`open`?(this.fillRect(e+4,t,3,3,g.white),this.fillRect(e+9,t,3,3,g.white),this.setPixel(e+5,t+1,r.eye),this.setPixel(e+10,t+1,r.eye)):n===`half-closed`&&(this.fillRect(e+4,t,3,3,g.white),this.fillRect(e+9,t,3,3,g.white),this.fillRect(e+4,t,3,1,r.body),this.fillRect(e+9,t,3,1,r.body),this.setPixel(e+5,t+1,r.eye),this.setPixel(e+10,t+1,r.eye))}_drawLyingEyes(e,t,n,r){n===`closed`?(this.fillRect(e+3,t+9,2,1,r.eye),this.fillRect(e+7,t+9,2,1,r.eye)):this.petStyle===`styleA`?(this.fillRect(e+3,t+8,2,2,r.eye),this.fillRect(e+7,t+8,2,2,r.eye),this.setPixel(e+3,t+8,g.white),this.setPixel(e+7,t+8,g.white)):this.petStyle===`styleC`?(this.fillRect(e+4,t+9,1,1,r.eye),this.fillRect(e+7,t+9,1,1,r.eye)):(this.fillRect(e+3,t+8,2,2,g.white),this.fillRect(e+7,t+8,2,2,g.white),this.setPixel(e+3,t+9,r.eye),this.setPixel(e+7,t+9,r.eye))}_drawPetSittingStyleB(e,t,n=`open`,r=0,i,a,o,s,c,l){let u=this._getPetColors(),d={".":`transparent`,"#":`#1A1A1A`,B:u.body,D:u.dark,S:u.dark,I:u.earInner,W:u.belly,G:u.eye,E:`#1A1A1A`,C:u.cheek,R:`#D84040`,L:`#F5D76E`,K:`#E56B6F`};if(this.petType!==`dog`){let t=+(this.frame%150>130&&Math.sin(this.frame*.5)>0),r=+(this.frame%180>160&&Math.sin(this.frame*.5)>0),l=Array(10).fill(null).map(()=>Array(16).fill(`.`)),f=t;l[0+f][3]=`#`,l[1+f][2]=`#`,l[1+f][3]=`I`,l[1+f][4]=`#`,l[2+f][1]=`#`,l[2+f][2]=`I`,l[2+f][3]=`B`,l[2+f][4]=`I`,l[2+f][5]=`#`;let p=r;l[0+p][12]=`#`,l[1+p][11]=`#`,l[1+p][12]=`I`,l[1+p][13]=`#`,l[2+p][10]=`#`,l[2+p][11]=`I`,l[2+p][12]=`B`,l[2+p][13]=`I`,l[2+p][14]=`#`;for(let e=6;e<=9;e++)l[2][e]=`#`;for(let e=3;e<=7;e++){l[e][1]=`#`;for(let t=2;t<=13;t++)l[e][t]=`B`;l[e][14]=`#`}l[4][3]=`D`,l[4][7]=`D`,l[4][8]=`D`,l[4][12]=`D`,n===`closed`?(l[6][3]=`#`,l[6][4]=`#`,l[6][11]=`#`,l[6][12]=`#`):n===`happy`?(l[5][3]=`#`,l[5][5]=`#`,l[5][11]=`#`,l[5][13]=`#`,l[6][4]=`#`,l[6][12]=`#`):n===`angry`?(l[5][3]=`#`,l[6][4]=`#`,l[6][5]=`#`,l[6][10]=`#`,l[6][11]=`#`,l[5][12]=`#`):n===`anxious`?(l[6][3]=`#`,l[5][4]=`#`,l[7][5]=`G`,l[5][11]=`#`,l[6][12]=`#`,l[7][10]=`G`):(l[5][3]=`G`,l[5][4]=`G`,l[5][11]=`G`,l[5][12]=`G`,l[6][3]=`E`,l[6][4]=`E`,l[6][11]=`E`,l[6][12]=`E`),l[6][7]=`I`,l[6][8]=`I`,l[7][7]=`#`,l[7][8]=`#`;for(let e=6;e<=9;e++)l[7][e]=`W`;for(let e=5;e<=10;e++)l[8][e]=`W`;l[7][2]=`C`,l[7][3]=`C`,l[7][12]=`C`,l[7][13]=`C`,l[8][4]=`#`,l[8][11]=`#`;for(let e=5;e<=10;e++)l[9][e]=`#`;this._drawPixelSprite(o,a,l.map(e=>e.join(``)),d),this._drawPixelSprite(e,i+8,[`...##########...`,`..#RRRRRRRRRR#..`,`.#BRRRLLLLRRRB#.`,`.#BBBBWL#WBBBB#.`,`.#BBDBWWWWBDDB#.`,`.#BBBBWWWWBBBB#.`,`.#BBBBWWWWBBBB#.`,`..#BBBBBBBBBB#..`,`...##########...`],d);let m=[`####`,`#BB#`];this._drawPixelSprite(e+3,i+16+s,m,d),this._drawPixelSprite(e+9,i+16+c,m,d);let{x:h,y:g}=_(this.frame);this.fillRect(e+14,i+12,2,2,`#1A1A1A`),this.fillRect(e+14,i+13,1,1,u.body);let v=e+15+ +(h>0),y=i+11+g;this.fillRect(v,y,2,2,`#1A1A1A`),this.fillRect(v,y+1,1,1,u.body);let b=e+16+h,x=i+9+g;this.fillRect(b,x,2,2,`#1A1A1A`),this.fillRect(b+1,x+1,1,1,u.dark)}else{Math.floor(this.frame/8)%4;let t=Array(13).fill(null).map(()=>Array(16).fill(`.`)),r=+(this.frame%150>130&&Math.sin(this.frame*.5)>0),l=+(this.frame%180>160&&Math.sin(this.frame*.5)>0),f=4-r;t[0][f]=`#`,t[1][f-1]=`#`,t[1][f]=`I`,t[1][f+1]=`#`,t[2][f-1]=`#`,t[2][f]=`I`,t[2][f+1]=`B`;let p=11+l;t[0][p]=`#`,t[1][p-1]=`#`,t[1][p]=`I`,t[1][p+1]=`#`,t[2][p-1]=`B`,t[2][p]=`I`,t[2][p+1]=`#`;for(let e=5;e<=10;e++)t[2][e]===`.`&&(t[2][e]=`#`);t[3][4]=`#`;for(let e=5;e<=10;e++)t[3][e]=e===7||e===8?`W`:`B`;t[3][11]=`#`;for(let e=2;e<=6;e++){t[e+2][4]=`#`;for(let n=5;n<=10;n++)e<=2?t[e+2][n]=n===7||n===8?`W`:`B`:t[e+2][n]=`B`;t[e+2][11]=`#`}t[9][5]=`#`;for(let e=6;e<=9;e++)t[9][e]=`W`;t[9][10]=`#`,t[10][5]=`#`;for(let e=6;e<=9;e++)t[10][e]=`W`;t[10][7]=`E`,t[10][8]=`E`,t[10][10]=`#`;let m=n===`happy`||this.mood===`happy`||this.mood===`excited`;t[11][6]=`#`,t[11][7]=m?`I`:`W`,t[11][8]=m?`I`:`W`,t[11][9]=`#`;for(let e=6;e<=9;e++)t[12][e]=`#`;n===`closed`?(t[7][5]=`#`,t[7][10]=`#`):n===`happy`?(t[6][5]=`#`,t[6][9]=`#`,t[7][5]=`#`,t[7][6]=`#`,t[7][9]=`#`,t[7][10]=`#`):n===`angry`?(t[6][5]=`#`,t[7][6]=`#`,t[7][9]=`#`,t[6][10]=`#`):n===`anxious`?(t[7][5]=`#`,t[6][6]=`#`,t[6][9]=`#`,t[7][10]=`#`):(t[7][5]=`E`,t[7][10]=`E`),t[9][4]=`C`,t[9][11]=`C`,this._drawPixelSprite(o,a-2,t.map(e=>e.join(``)),d),this._drawPixelSprite(e,i+8,[`...##########...`,`..#KKKKKKKKKK#..`,`.#BKKKKKKKKKKB#.`,`.#BBBBWWWWBBBB#.`,`.#BBSBWWWWBSBB#.`,`.#BBBBWWWWBBBB#.`,`.#BBBBWWWWBBBB#.`,`..#BBBBBBBBBB#..`,`...##########...`],d);let h=[`####`,`#SS#`];this._drawPixelSprite(e+3,i+16+s,h,d),this._drawPixelSprite(e+9,i+16+c,h,d);let{x:g,y:v}=_(this.frame);this.fillRect(e+14,i+12,2,2,`#1A1A1A`),this.fillRect(e+14,i+13,1,1,u.body);let y=e+15+g,b=i+11+v;this.fillRect(y,b,2,2,`#1A1A1A`),this.fillRect(y,b+1,1,1,u.body);let x=e+16+g,S=i+9+v;this.fillRect(x,S,2,2,`#1A1A1A`),this.fillRect(x+1,S+1,1,1,u.dark)}}_drawPetSitting(e,t,n=`open`,r=0){let i=this._getPetColors(),a=0,o=0,s=0;this.activity===`walking`&&({leftFootY:a,rightFootY:o,bodyWalkBob:s}=v(this.frame));let{headX:c,headY:l}=this._getSittingHeadAnchor(e,t,s),u=l,d=6,f=8,p=0;r===1?(u=l-1,d=7,f=6,p=1):r===2&&(u=l+1,d=5,f=10,p=-1);let m=n;if(n===`open`){let e=this.frame%180;e>=170&&e<172?m=`half-closed`:e>=172&&e<178?m=`closed`:e>=178&&e<180&&(m=`half-closed`)}if(this.petStyle===`styleB`){this._drawPetSittingStyleB(e,t,m,r,l,u,c,a,o,s),this._drawMoodPosture(e,l,i);return}if(this.petType!==`dog`){let t=+(this.frame%170>152&&Math.sin(this.frame*.55)>0);this.fillRect(c+3-t,u,3,2,i.body),this.setPixel(c+4-t,u-1,i.dark),this.setPixel(c+4-t,u,i.earInner),this.fillRect(c+10,u,3,2,i.body),this.setPixel(c+11,u-1,i.dark),this.setPixel(c+11,u,i.earInner);let{x:n,y:r}=_(this.frame);this.fillRect(e+12,l+12,2,2,i.body),this.fillRect(e+12+n,l+10+r,2,3,i.body),this.fillRect(e+13+n,l+9+r,1,2,i.dark),this.fillRect(c+3,u+1,10,9,i.body),this.setPixel(c+6,u+1,i.dark),this.fillRect(c+8,u+1,1,2,i.dark),this.setPixel(c+10,u+1,i.dark),this._drawEyes(c,u+4,m,i),this.fillRect(c+6,u+7,4,2,i.belly),this.fillRect(c+7,u+7,2,1,i.nose),this.setPixel(c+7,u+8,i.dark),this.setPixel(c+8,u+8,i.dark),this.fillRect(c+1,u+7,2,1,i.whisker||i.dark),this.setPixel(c+2,u+9,i.whisker||i.dark),this.fillRect(c+13,u+7,2,1,i.whisker||i.dark),this.setPixel(c+13,u+9,i.whisker||i.dark),this.fillRect(c+3,u+8,2,1,i.cheek),this.fillRect(c+11,u+8,2,1,i.cheek),this.fillRect(e+4+p,l+9,f,d,i.body),this.fillRect(e+6+p,l+10,f-4,d-2,i.belly),this.fillRect(e+4+p,l+8,f,1,`#E56B6F`),this.fillRect(e+5+p,l+9,3,2,`#E56B6F`),this.fillRect(e+4,l+14+a,3,2,i.body),this.fillRect(e+9,l+14+o,3,2,i.body),this.fillRect(e+4,l+15+a,2,1,i.dark),this.fillRect(e+10,l+15+o,2,1,i.dark)}else{let t=+(this.frame%150>130&&Math.sin(this.frame*.5)>0),n=+(this.frame%180>160&&Math.sin(this.frame*.5)>0);this.fillRect(c+4-t,u-1,1,1,i.body),this.fillRect(c+3-t,u,1,1,i.body),this.fillRect(c+4-t,u,1,3,i.earInner),this.fillRect(c+11+n,u-1,1,1,i.body),this.fillRect(c+12+n,u,1,1,i.body),this.fillRect(c+11+n,u,1,3,i.earInner),this.fillRect(c+3,u+1,10,9,i.body),this.fillRect(c+7,u+1,2,2,i.belly),this._drawEyes(c,u+4,m,i),this.fillRect(c+6,u+7,4,2,i.belly),this.fillRect(c+7,u+9,2,1,i.belly),this.fillRect(c+7,u+7,2,1,i.nose),this.setPixel(c+7,u+8,i.dark),this.setPixel(c+8,u+8,i.dark),(m===`happy`||this.mood===`happy`||this.mood===`excited`)&&this.fillRect(c+7,u+9,2,1,i.tongue||g.dogTongue),this.fillRect(c+3,u+8,2,1,i.cheek),this.fillRect(c+11,u+8,2,1,i.cheek),this.fillRect(e+4+p,l+9,f,d,i.body),this.fillRect(e+5+p,l+10,f-2,d-2,i.belly),this.fillRect(e+4+p,l+8,f,1,`#E56B6F`),this.fillRect(e+5+p,l+9,3,2,`#E56B6F`),this.fillRect(e+4,l+14+a,3,2,i.body),this.fillRect(e+9,l+14+o,3,2,i.body),this.fillRect(e+4,l+15+a,2,1,i.dark),this.fillRect(e+10,l+15+o,2,1,i.dark);let{x:r,y:s}=_(this.frame);this.fillRect(e+12,l+10,2,1,i.body),this.fillRect(e+13+r,l+9+s,2,1,i.body),this.fillRect(e+14+r,l+8+s,1,2,i.dark)}this._drawMoodPosture(e,l,i)}_drawMoodPosture(e,t,n){if(this.mood===`angry`){this.fillRect(e+3,t+11,2,2,n.dark),this.fillRect(e+11,t+11,2,2,n.dark);return}this.mood===`anxious`&&(this.fillRect(e+3,t+10,2,3,n.body),this.fillRect(e+11,t+10,2,3,n.body),this.setPixel(e+5,t+12,n.dark),this.setPixel(e+10,t+12,n.dark))}_getSittingHeadAnchor(e,t,n=0){let r=Math.round(this.bobOffset),i=this.activity===`music`||this.mood===`happy`||this.mood===`excited`?Math.round(Math.sin(this.frame*.08)):0,a=t+r+n,o=this.petStyle===`styleB`&&this.petType===`dog`?a-2:a;return{headX:e+i,headY:a,visualHeadY:o}}_drawHeadphones(e,t){this.fillRect(e+5,t-3,6,1,g.headphone),this.fillRect(e+3,t-2,2,1,g.headphone),this.fillRect(e+11,t-2,2,1,g.headphone),this.fillRect(e+2,t-1,1,5,g.headphone),this.fillRect(e+13,t-1,1,5,g.headphone),this.fillRect(e+1,t+3,2,4,g.headphonePad),this.fillRect(e+13,t+3,2,4,g.headphonePad),this.setPixel(e+2,t+4,`#8A8A8A`),this.setPixel(e+13,t+4,`#8A8A8A`)}_drawPetLyingStyleB(e,t,n=`closed`){let r=this._getPetColors(),i={".":`transparent`,"#":`#1A1A1A`,B:r.body,D:r.dark,S:r.dark,I:r.earInner,W:r.belly,G:r.eye,E:`#1A1A1A`,C:r.cheek,R:`#D84040`,L:`#F5D76E`,K:`#E56B6F`},a=t+(Math.sin(this.frame*.08)>0?0:-1);if(this.petType!==`dog`){let o=`B##B#B##B#`;n===`open`?o=`BGGB#BGGB#`:n===`happy`&&(o=`B##B#B##B#`);let s=[`..#.....#...`,`.#I#...#I#..`,`#IBI###IBI#.`,`#BBBBBBBBB#.`,`#BDBBDBBDB#.`,`#BBBBBBBBB#.`,`#`+o+`.`,`.#BWWWWWB#..`,`..#######...`];this._drawPixelSprite(e,a+6,s,i),this._drawPixelSprite(e+9,t+9,[`##########...`,`#BBBBBBBB#...`,`#BBWWWWBB#...`,`#BBWWWWBB#...`,`##########...`],i),this._drawPixelSprite(e+17,t+12,[`###`,`#B#`],i);let{x:c,y:l}=_(this.frame);this.fillRect(e+18,t+9,2,2,`#1A1A1A`),this.fillRect(e+18,t+10,1,1,r.body);let u=e+19+c,d=t+8+l;this.fillRect(u,d,3,3,`#1A1A1A`),this.fillRect(u+1,d+1,1,1,r.dark)}else{this._drawPixelSprite(e,a+6,[`....#..#....`,`...#I##I#...`,`..#BIBBBI#..`,`..#BBWBB#...`,`.#BBBWBBB#..`,`.#B#BW#B##..`,`.#BBBBBBB#..`,`..#DDWWWD#..`,`...#WWEEW#..`,`....####....`],i),this._drawPixelSprite(e+9,t+9,[`##########...`,`#BBBBBBBB#...`,`#BBWWWWBB#...`,`#BBWWWWBB#...`,`##########...`],i),this._drawPixelSprite(e+17,t+12,[`###`,`#S#`],i);let{x:n,y:o}=_(this.frame);this.fillRect(e+18,t+9,2,2,`#1A1A1A`),this.fillRect(e+18,t+10,1,1,r.body);let s=e+19+n,c=t+8+o;this.fillRect(s,c,3,3,`#1A1A1A`),this.fillRect(s+1,c+1,1,1,r.dark)}}_drawPetLying(e,t,n=`closed`){if(this.petStyle===`styleB`){this._drawPetLyingStyleB(e,t,n);return}let r=this._getPetColors(),i=t+(Math.sin(this.frame*.08)>0?0:-1);if(this.fillRect(e+2,i+6,8,6,r.body),this.petType===`dog`?(this.fillRect(e+1,i+7,2,4,r.body),this.fillRect(e+1,i+8,1,2,r.earInner),this.fillRect(e+9,i+7,2,4,r.body),this.fillRect(e+10,i+8,1,2,r.earInner),this.fillRect(e+5,i+6,2,2,r.belly)):(this.setPixel(e+4,i+4,r.body),this.fillRect(e+3,i+5,2,1,r.body),this.setPixel(e+4,i+5,r.earInner),this.setPixel(e+7,i+4,r.body),this.fillRect(e+7,i+5,2,1,r.body),this.setPixel(e+7,i+5,r.earInner),this.fillRect(e+2,i+8,10,3,r.body)),this.petType===`dog`)this._drawLyingEyes(e,i,n,r);else{let t=`#FFE066`;n===`closed`?(this.fillRect(e+4,i+8,2,1,r.dark),this.fillRect(e+8,i+8,2,1,r.dark)):(this.fillRect(e+4,i+8,2,2,t),this.setPixel(e+5,i+9,`#1A1A1A`),this.fillRect(e+8,i+8,2,2,t),this.setPixel(e+8,i+9,`#1A1A1A`))}if(this.petType===`dog`?(this.fillRect(e+4,i+10,4,1,r.belly),this.fillRect(e+5,i+11,2,1,r.belly),this.fillRect(e+5,i+10,2,1,r.nose)):(this.setPixel(e+7,i+10,r.nose),this.fillRect(e+6,i+11,2,1,r.dark)),this.fillRect(e+9,t+9,10,4,r.body),this.fillRect(e+10,t+10,8,2,r.belly),this.fillRect(e+18,t+11,2,2,r.body),this.petType===`cat`){let{x:n,y:i}=_(this.frame);this.fillRect(e+19+n,t+9+i,2,1,r.dark),this.fillRect(e+20+n,t+8+i,2,2,r.dark)}else if(this.petType===`dog`){let{x:n,y:i}=_(this.frame);this.fillRect(e+19+n,t+8+i,2,1,r.body),this.fillRect(e+20+n,t+7+i,2,1,r.dark)}}_drawCalmIdleScene(){let e=this.frame%180>170;this._drawPetSitting(9,6,e?`closed`:`open`)}_drawHappyIdleScene(){let e=this.frame%120,t=0,n=0;e<30&&(t=Math.sin(e/30*Math.PI),n=e<4?2:e>=4&&e<12?1:e>=12&&e<22?0:e>=22&&e<26?1:2);let r=6-Math.round(t*2);this._drawPetSitting(9,r,`happy`,n),this.frame%60<30&&(this._drawStar(3,3),this._drawStar(25,5))}_drawMissScene(){this.fillRect(0,0,14,18,g.window),this.fillRect(0,0,14,1,g.windowFrame),this.fillRect(0,0,1,18,g.windowFrame),this.fillRect(6,0,2,18,g.windowFrame),this.fillRect(0,8,14,2,g.windowFrame),this.fillRect(13,0,1,18,g.windowFrame),this.fillRect(0,17,14,1,g.windowFrame),this._drawPetSitting(14,6,`open`);let e=2+Math.sin(this.frame*.05)*2;this._drawHeart(24,Math.round(e)),this.frame%120<60&&this._drawHeart(20,Math.round(e+3))}_drawSadScene(){this._drawPetSitting(9,8,`closed`),this.fillRect(7,1,8,3,g.rainCloud),this.fillRect(6,2,10,2,g.rainCloud),this.fillRect(9,0,4,1,g.rainCloud);let e=this.frame%20;e<5?(this.setPixel(8,5+e,g.rainDrop),this.setPixel(12,4+e,g.rainDrop),this.setPixel(15,5+e,g.rainDrop)):e<10&&(this.setPixel(9,e-1,g.rainDrop),this.setPixel(13,e,g.rainDrop),this.setPixel(10,e-2,g.rainDrop))}_drawAngryScene(){this._drawPetSitting(9,6,`angry`),this.frame%40<25&&(this.setPixel(22,3,g.angry),this.setPixel(23,4,g.angry),this.setPixel(24,3,g.angry),this.setPixel(23,2,g.angry),this.setPixel(5,2,g.angry),this.setPixel(6,3,g.angry),this.setPixel(7,2,g.angry),this.setPixel(6,1,g.angry))}_drawSleepyIdleScene(){let e=this.frame%60>10;this._drawPetSitting(9,6,e?`closed`:`open`);let t=Math.floor(this.frame/30)%3;this._drawZzz(22,2-t)}_drawExcitedScene(){let e=this.frame%60,t=0,n=0;e<24&&(t=Math.sin(e/24*Math.PI),n=e<3?2:e>=3&&e<10?1:e>=10&&e<18?0:e>=18&&e<21?1:2);let r=6-Math.round(t*2.5);this._drawPetSitting(9,r,`happy`,n),this.frame%30<15?(this._drawStar(3,2),this._drawStar(26,3),this._drawStar(5,8),this._drawStar(24,10)):(this._drawStar(4,5),this._drawStar(25,7))}_drawAnxiousScene(){this._drawPetSitting(9,6,`anxious`),this.frame%60<40&&(this.setPixel(22,5,g.rainDrop),this.setPixel(22,6,g.rainDrop),this.setPixel(23,6,g.rainDrop))}_drawQuietScene(){this._drawPetSitting(9,6,`closed`),this.frame%80<60&&(this.setPixel(22,10,g.rainCloud),this.frame%80<40&&this.setPixel(24,10,g.rainCloud),this.frame%80<20&&this.setPixel(26,10,g.rainCloud))}_drawTiredScene(){let e=this.frame%40>8;this._drawPetSitting(9,7,e?`closed`:`open`),this.strokeRect(22,3,6,4,g.rainCloud),this.fillRect(28,4,1,2,g.rainCloud),this.fillRect(23,4,2,2,g.angry)}_drawGamingScene(){let e=this._getMoodExpression(`open`);this._drawPetSitting(9,6,e),this.fillRect(5,20,8,4,g.gamepad),this.fillRect(4,21,10,2,g.gamepad),this.fillRect(6,21,1,2,g.black),this.fillRect(5,22,3,1,g.black),this.setPixel(11,21,g.gamepadBtn),this.setPixel(12,22,g.star),this.frame%30<15?(this.fillRect(20,2,8,5,g.screenGlow),this.fillRect(21,3,6,3,g.screen)):(this.fillRect(20,2,8,5,g.screen),this.fillRect(21,3,6,3,g.screenGlow))}_drawStudyingScene(){this.fillRect(0,20,32,2,g.desk),this.fillRect(0,22,32,10,g.deskDark),this.fillRect(2,17,8,4,g.book),this.fillRect(6,17,1,4,g.deskDark),this.fillRect(3,18,3,2,g.white),this.fillRect(7,18,2,2,g.white),this.mood===`tired`||this.mood===`sleepy`?(this._drawPetLying(8,10,`closed`),this._drawZzz(24,5)):this._drawPetSitting(12,4,this._getMoodExpression(`open`))}_drawWorkingScene(){this.fillRect(0,20,32,2,g.desk),this.fillRect(0,22,32,10,g.deskDark),this.fillRect(2,10,12,9,g.black),this.fillRect(3,11,10,7,g.screen),this.fillRect(6,19,4,2,g.black);let e=this.frame%60<30?3:5;this.fillRect(4,12,8,1,g.screenGlow),this.fillRect(4,14,6,1,g.screenGlow),this.fillRect(4,12+e,this.frame%15/2,1,g.white),this._drawPetSitting(16,4,this._getMoodExpression(this.frame%10<3?`closed`:`open`)),this.fillRect(15,19,10,2,g.keyboard);for(let e=0;e<4;e++)this.setPixel(16+e*2,19,g.rainCloud)}_drawSleepingSceneStyleB(){let e=this._getPetColors(),t={".":`transparent`,"#":`#1A1A1A`,B:e.body,D:e.dark,S:e.dark,I:e.earInner,W:e.belly,G:e.eye,E:`#1A1A1A`,C:e.cheek,R:`#D84040`,L:`#F5D76E`,K:`#E56B6F`},n=Math.sin(this.frame*.05)>0?0:-1;this.fillRect(1,13,12,5,`#1A1A1A`),this.fillRect(2,14,10,3,g.pillow),this.fillRect(3,13,8,1,g.pillow),this.petType===`dog`?this._drawPixelSprite(3,9+n,[`...#####....`,`..#WWWWW#...`,`.#DDWWWDD#..`,`#DDDBBBDDD#.`,`#DDBBBBBDD#.`,`#DDB#B#BDD#.`,`#DDBBBBDD#..`,`.#DDWWWD#...`,`..#WWEEW#...`,`...####.....`],t):this._drawPixelSprite(3,9+n,[`..#.....#...`,`.#I#...#I#..`,`#IBI###IBI#.`,`#BBBBBBBBB#.`,`#BDBBDBBDB#.`,`#BBBBBBBBB#.`,`#B##B#B##B#.`,`.#BWWWWWB#..`,`..#######...`],t),this.fillRect(1,16,28,10,`#1A1A1A`),this.fillRect(2,17,26,8,g.blanket),this.fillRect(3,16,24,2,g.blanket);for(let e=0;e<12;e++)this.setPixel(4+e*2,19,g.blanketDark);n===-1&&this.fillRect(3,16,24,1,g.blanketDark),this._drawZzz(18,4-Math.floor(this.frame/40)%3)}_drawSleepingScene(){if(this.petStyle===`styleB`){this._drawSleepingSceneStyleB();return}this.fillRect(2,14,10,4,g.pillow),this.fillRect(3,13,8,1,g.pillow),this.fillRect(2,17,26,8,g.blanket),this.fillRect(3,16,24,2,g.blanket);for(let e=0;e<12;e++)this.setPixel(4+e*2,19,g.blanketDark);let e=Math.sin(this.frame*.05)>0?0:-1,t=this._getPetColors();this.fillRect(4,10+e,8,6,t.body),this.petType===`dog`&&this.fillRect(7,10+e,2,2,t.belly),this.petType,this.setPixel(5,9+e,t.body),this.setPixel(5,10+e,t.earInner),this.setPixel(10,9+e,t.body),this.setPixel(10,10+e,t.earInner),this.fillRect(5,12+e,2,1,t.eye),this.fillRect(9,12+e,2,1,t.eye),this.fillRect(7,13+e,2,1,t.nose),e===-1&&this.fillRect(3,16,24,1,g.blanketDark),this._drawZzz(18,4-Math.floor(this.frame/40)%3)}_drawMusicScene(){this._drawPetSitting(9,6,this._getMoodExpression(`happy`));let{headX:e,visualHeadY:t}=this._getSittingHeadAnchor(9,6);this._drawHeadphones(e,t);let n=Math.sin(this.frame*.06)*2;this._drawMusicNote(24,3+Math.round(n)),this.frame%60<40&&this._drawMusicNote(27,6+Math.round(-n))}_drawEatingScene(){this.fillRect(0,21,32,2,g.desk),this.fillRect(0,23,32,9,g.deskDark),this.fillRect(3,18,8,4,g.white),this.fillRect(4,17,6,1,g.white),this.fillRect(4,18,6,2,g.food),this._drawPetSitting(14,5,this._getMoodExpression(this.frame%20<8?`closed`:`happy`)),this.frame%30<10&&this._drawStar(5,14)}_drawMovieScene(){this.fillRect(0,2,16,12,g.black),this.fillRect(1,3,14,10,g.screen),this.frame%40<20?(this.fillRect(2,4,12,8,g.screenGlow),this.fillRect(4,6,4,3,g.mood_happy||g.star)):(this.fillRect(2,4,12,8,`#88B0D0`),this.fillRect(6,5,6,4,g.screen)),this._drawPetSitting(18,6,this._getMoodExpression(`open`))}_drawWalkingScene(){this.fillRect(0,26,32,6,`#C8D8B0`),this.fillRect(2,16,3,10,`#A0B080`),this.fillRect(1,14,5,4,`#90A870`),this.fillRect(26,18,3,8,`#A0B080`),this.fillRect(25,16,5,4,`#90A870`);let e=this.frame%60<30;this._getPetColors(),this._drawPetSitting(12,8,this._getMoodExpression(`happy`)),e&&(this.setPixel(8,16,g.rainCloud),this.setPixel(7,18,g.rainCloud),this.setPixel(6,17,g.rainCloud))}_drawCommutingScene(){this.fillRect(0,4,32,20,`#D0D8D8`),this.fillRect(2,6,12,10,g.window),this.fillRect(18,6,12,10,g.window);let e=Math.floor(this.frame/3)%16;this.fillRect(2+e,10,3,2,`#90C090`),this.fillRect(22-e,9,4,3,`#80B080`),this.fillRect(15,0,2,8,g.rainCloud),this.fillRect(14,7,4,2,g.rainCloud),this._drawPetSitting(11,10,this._getMoodExpression(`open`))}_drawFriendsScene(){this._drawPetSitting(9,6,this._getMoodExpression(`happy`)),this.fillRect(1,14,4,5,g.rainCloud),this.fillRect(2,12,2,2,g.rainCloud),this.fillRect(26,14,4,5,g.rainCloud),this.fillRect(27,12,2,2,g.rainCloud),this.frame%60<30&&(this.fillRect(3,8,4,3,g.white),this.setPixel(4,11,g.white)),this.frame%60>=20&&(this.fillRect(24,9,5,3,g.white),this.setPixel(26,12,g.white))}_drawChargingScene(){this._drawPetSitting(9,6,this._getMoodExpression(`closed`)),this.strokeRect(23,2,7,4,g.black),this.fillRect(30,3,1,2,g.black);let e=Math.floor(this.frame/30)%4;for(let t=0;t<e;t++)this.fillRect(24+t*2,3,1,2,g.accent_mint||`#A8D8C8`);this.frame%40<25&&(this.setPixel(21,1,g.star),this.setPixel(22,1,g.star),this.setPixel(21,2,g.star),this.setPixel(20,2,g.star),this.setPixel(22,0,g.star)),e>=3&&this._drawStar(4,4)}_drawMoodCue(e){let[t,n]={gaming:[2,2],studying:[26,2],working:[15,2],sleeping:[2,3],music:[2,2],eating:[26,3],movie:[3,17],walking:[15,2],commuting:[2,1],friends:[14,2],charging:[2,2]}[e]||[2,2];switch(this.mood){case`happy`:this._drawStar(t,n);break;case`calm`:this.fillRect(t,n+1,4,1,g.screen),this.setPixel(t+1,n,g.screenGlow);break;case`tired`:this.strokeRect(t,n,5,3,g.rainCloud),this.setPixel(t+5,n+1,g.rainCloud),this.setPixel(t+1,n+1,g.angry);break;case`miss`:this.fillRect(t,n,2,2,g.musicNote),this.fillRect(t+4,n,2,2,g.musicNote),this.fillRect(t+2,n+1,2,1,g.musicNote);break;case`sad`:this.fillRect(t,n,1,2,g.rainDrop),this.fillRect(t+3,n+1,1,2,g.rainDrop);break;case`angry`:this.fillRect(t+1,n,1,4,g.angry),this.fillRect(t,n+1,4,1,g.angry),this.setPixel(t+3,n,g.angry);break;case`anxious`:this.setPixel(t+1,n,g.rainDrop),this.fillRect(t,n+1,3,2,g.rainDrop),this.setPixel(t+1,n+3,g.rainDrop);break;case`sleepy`:this.fillRect(t,n,4,1,g.zzz),this.setPixel(t+2,n+1,g.zzz),this.fillRect(t,n+2,4,1,g.zzz);break;case`excited`:this._drawStar(t,n),this._drawStar(t+4,n+2);break;case`quiet`:this.setPixel(t,n+1,g.rainCloud),this.setPixel(t+2,n+1,g.rainCloud),this.setPixel(t+4,n+1,g.rainCloud);break;default:break}}_drawStar(e,t){this.setPixel(e+1,t,g.star),this.setPixel(e,t+1,g.star),this.setPixel(e+1,t+1,g.star),this.setPixel(e+2,t+1,g.star),this.setPixel(e+1,t+2,g.star)}_drawHeart(e,t){this.setPixel(e,t,g.heart),this.setPixel(e+1,t,g.heart),this.setPixel(e+3,t,g.heart),this.setPixel(e+4,t,g.heart),this.setPixel(e,t+1,g.heart),this.setPixel(e+1,t+1,g.heart),this.setPixel(e+2,t+1,g.heart),this.setPixel(e+3,t+1,g.heart),this.setPixel(e+4,t+1,g.heart),this.setPixel(e+1,t+2,g.heart),this.setPixel(e+2,t+2,g.heart),this.setPixel(e+3,t+2,g.heart),this.setPixel(e+2,t+3,g.heart)}_drawMusicNote(e,t){this.setPixel(e,t,g.musicNote),this.setPixel(e,t+1,g.musicNote),this.setPixel(e,t+2,g.musicNote),this.setPixel(e,t+3,g.musicNote),this.setPixel(e+1,t,g.musicNote),this.setPixel(e+2,t,g.musicNote),this.setPixel(e+2,t+1,g.musicNote),this.setPixel(e-1,t+3,g.musicNote),this.setPixel(e,t+4,g.musicNote)}_drawZzz(e,t){this.fillRect(e,t,3,1,g.zzz),this.setPixel(e+2,t+1,g.zzz),this.setPixel(e+1,t+2,g.zzz),this.fillRect(e,t+3,3,1,g.zzz),this.fillRect(e+4,t+2,2,1,g.zzz),this.setPixel(e+5,t+3,g.zzz),this.fillRect(e+4,t+4,2,1,g.zzz)}resize(e){this.pixelSize=e;let t=this.gridSize*e;this.canvas.width=t,this.canvas.height=t,this.canvas.style.width=`${t}px`,this.canvas.style.height=`${t}px`,this.render()}},b=[{id:`happy`,emoji:`😊`,label:`开心`,color:`var(--mood-happy)`,bg:`var(--mood-happy-bg)`,iconSvg:h.happy},{id:`calm`,emoji:`😌`,label:`平静`,color:`var(--mood-calm)`,bg:`var(--mood-calm-bg)`,iconSvg:h.calm},{id:`tired`,emoji:`😩`,label:`有点累`,color:`var(--mood-tired)`,bg:`var(--mood-tired-bg)`,iconSvg:h.tired},{id:`miss`,emoji:`🥺`,label:`想你`,color:`var(--mood-miss)`,bg:`var(--mood-miss-bg)`,iconSvg:h.miss},{id:`sad`,emoji:`😢`,label:`难过`,color:`var(--mood-sad)`,bg:`var(--mood-sad-bg)`,iconSvg:h.sad},{id:`angry`,emoji:`😤`,label:`生气`,color:`var(--mood-angry)`,bg:`var(--mood-angry-bg)`,iconSvg:h.angry},{id:`anxious`,emoji:`😰`,label:`有点不安`,color:`var(--mood-anxious)`,bg:`var(--mood-anxious-bg)`,iconSvg:h.anxious},{id:`sleepy`,emoji:`😴`,label:`困了`,color:`var(--mood-sleepy)`,bg:`var(--mood-sleepy-bg)`,iconSvg:h.sleepy},{id:`excited`,emoji:`🤩`,label:`兴奋`,color:`var(--mood-excited)`,bg:`var(--mood-excited-bg)`,iconSvg:h.excited},{id:`quiet`,emoji:`🤫`,label:`想安静`,color:`var(--mood-quiet)`,bg:`var(--mood-quiet-bg)`,iconSvg:h.quiet}],x=[{id:`studying`,emoji:`📚`,label:`学习`,iconSvg:h.studying},{id:`working`,emoji:`💼`,label:`工作`,iconSvg:h.working},{id:`gaming`,emoji:`🎮`,label:`玩游戏`,iconSvg:h.gaming},{id:`eating`,emoji:`🍜`,label:`吃饭`,iconSvg:h.eating},{id:`sleeping`,emoji:`🛌`,label:`睡觉`,iconSvg:h.sleeping},{id:`commuting`,emoji:`🚌`,label:`通勤`,iconSvg:h.commuting},{id:`walking`,emoji:`🚶`,label:`散步`,iconSvg:h.walking},{id:`movie`,emoji:`🎬`,label:`看电影`,iconSvg:h.movie},{id:`music`,emoji:`🎧`,label:`听歌`,iconSvg:h.music},{id:`idle`,emoji:`💭`,label:`发呆`,iconSvg:h.idle},{id:`friends`,emoji:`👫`,label:`和朋友一起`,iconSvg:h.friends},{id:`charging`,emoji:`🔋`,label:`休息充电`,iconSvg:h.charging}],S=Object.freeze({happy:{expression:`happy`,cue:`星光`},calm:{expression:`放松眼神`,cue:`平稳光标`},tired:{expression:`半闭眼`,cue:`低电量`},miss:{expression:`望向远处`,cue:`相连信号`},sad:{expression:`闭眼低落`,cue:`雨滴`},angry:{expression:`压低眉眼与紧握前爪`,cue:`怒意折线`},anxious:{expression:`偏斜眉眼与缩肩`,cue:`汗滴`},sleepy:{expression:`闭眼`,cue:`睡意 Z`},excited:{expression:`弯眼`,cue:`双星光`},quiet:{expression:`闭眼内收`,cue:`省略号`}}),C=Object.freeze({studying:{scene:`书桌`,prop:`展开的书`},working:{scene:`工作桌`,prop:`显示器与键盘`},gaming:{scene:`游戏角`,prop:`手柄与发光屏幕`},eating:{scene:`餐桌`,prop:`食碗`},sleeping:{scene:`床铺`,prop:`枕头与毛毯`},commuting:{scene:`车厢`,prop:`车窗与扶手`},walking:{scene:`户外小路`,prop:`树木与行走线`},movie:{scene:`放映室`,prop:`电影屏幕`},music:{scene:`听歌角`,prop:`耳机与音符`},idle:{scene:`安静角落`,prop:`待机姿态`},friends:{scene:`朋友身边`,prop:`同伴剪影`},charging:{scene:`休息角`,prop:`充电电池`}});function w(e,t){let n=E(e),r=D(t),i=S[n.id],a=C[r.id];return{key:`${n.id}:${r.id}`,mood:n,activity:r,moodDirection:i,activityDirection:a,description:`${n.label}的表情和${i.cue}，配合${r.label}的${a.scene}与${a.prop}。`}}var T=[{id:`ok`,emoji:`💚`,label:`可以联系`,hint:`现在可以联系。`,iconSvg:h.ok},{id:`later`,emoji:`💛`,label:`晚点回复`,hint:`可能会晚些回复。`,iconSvg:h.later},{id:`no`,emoji:`🧡`,label:`需要一点空间`,hint:`现在更适合留些空间。`,iconSvg:h.no},{id:`seen`,emoji:`🤍`,label:`只想被看见`,hint:`看见就好，不必开启聊天。`,iconSvg:h.seen}];function E(e){return b.find(t=>t.id===e)||b[1]}function D(e){return x.find(t=>t.id===e)||x[9]}function O(e){return T.find(t=>t.id===e)||T[0]}function k(e,t,n){let r=D(n),i={happy:`很开心`,calm:`很平静`,tired:`有点累`,miss:`有点想你`,sad:`有些难过`,angry:`有点生气`,anxious:`有些不安`,sleepy:`有点困`,excited:`很兴奋`,quiet:`想安静一会儿`},a=i[t]||i.calm;return n===`idle`?`${e}现在${a}。`:`${e}现在${a}，正在${r.label}。`}var A={render(e){e.innerHTML=`
      <div class="splash" id="splash-screen">
        <div class="splash-logo">
          <div class="splash-brand-lockup" aria-label="Picto 片刻">
            <img class="splash-brand-mark" src="./picto-logo.svg" width="72" height="72" alt="" />
            <div class="splash-brand-type"><div class="brand-en">Picto</div><div class="brand-cn">片刻</div></div>
          </div>
        </div>
        <div class="splash-slogan">不必开启聊天，也能轻轻看见彼此的当下。</div>
        <div class="splash-pet">
          <canvas id="splash-pet-canvas" class="pet-render-safe"></canvas>
        </div>
        <div class="splash-local-note">本地互动原型 · 内容仅在当前设备演示</div>
        <button type="button" class="splash-tap" id="splash-enter">开始本地体验</button>
      </div>
    `;let t=new y(e.querySelector(`#splash-pet-canvas`),{pixelSize:6,petType:`cat`,petStyle:p.state.petStyle});t.setState(`happy`,`idle`),t.startAnimation();let n=()=>{t.stopAnimation(),p.isSetupComplete?window.location.hash=`/home`:window.location.hash=`/pairing`};e.querySelector(`#splash-enter`).addEventListener(`click`,n),setTimeout(()=>{(window.location.hash===``||window.location.hash===`#/`||window.location.hash===`#`)&&n()},4e3)}},j=[{id:`cat`,name:`像素猫`,emoji:`🐱`,iconSvg:h.petCat},{id:`dog`,name:`像素狗`,emoji:`🐶`,iconSvg:h.petDog}],M={render(e){let t=``,n=`cat`,r=``,i=`dog`,a={};e.innerHTML=`
      <div class="pairing">
        <div class="pairing-header">
          <h1>创建本地双人体验</h1>
          <p>在当前浏览器设置两个体验角色</p>
        </div>

        <!-- Step 1: Your nickname -->
        <div class="pairing-step active" id="pair-step-1">
          <div class="step-label">第 1 步</div>
          <h2 style="font-family: var(--font-body); font-size: var(--text-lg); margin-bottom: var(--space-sm);">你的昵称</h2>
          <p style="font-size: var(--text-sm); color: var(--text-tertiary); margin-bottom: var(--space-lg);">此昵称仅用于当前设备上的演示</p>
          <input 
            type="text" 
            class="input-field" 
            id="self-nickname" 
            placeholder="输入你的昵称..."
            maxlength="10"
            autocomplete="off"
          />
          <div style="margin-top: var(--space-xl); text-align: center;">
            <button class="btn btn--primary" id="step1-next">下一步</button>
          </div>
        </div>

        <!-- Step 2: Choose pet -->
        <div class="pairing-step" id="pair-step-2">
          <div class="step-label">第 2 步</div>
          <h2 style="font-family: var(--font-body); font-size: var(--text-lg); margin-bottom: var(--space-sm);">选择你的像素分身</h2>
          <p style="font-size: var(--text-sm); color: var(--text-tertiary); margin-bottom: var(--space-lg);">猫和狗是两种可选的分身形象</p>
          <div class="pet-selector" id="pet-selector">
            ${j.map(e=>`
              <button type="button" class="pet-option ${e.id===`cat`?`selected`:``}" data-pet="${e.id}" aria-pressed="${e.id===`cat`}">
                <canvas id="pet-preview-${e.id}" class="pet-render-safe" width="128" height="128"></canvas>
                <span class="pet-name">${e.iconSvg} ${e.name}</span>
              </button>
            `).join(``)}
          </div>
          <div style="margin-top: var(--space-xl); text-align: center;">
            <button class="btn btn--primary" id="step2-next">下一步</button>
          </div>
        </div>

        <!-- Step 3: Second local role -->
        <div class="pairing-step" id="pair-step-3">
          <div class="step-label">第 3 步</div>
          <h2 style="font-family: var(--font-body); font-size: var(--text-lg); margin-bottom: var(--space-sm);">设置对方角色</h2>
          <p style="font-size: var(--text-sm); color: var(--text-tertiary); margin-bottom: var(--space-lg);">为另一个体验角色设置昵称和像素分身</p>
          
          <input 
            type="text" 
            class="input-field" 
            id="partner-nickname" 
            placeholder="对方的昵称……"
            maxlength="10"
            autocomplete="off"
            style="margin-bottom: var(--space-lg);"
          />
          
          <h3 style="font-family: var(--font-body); font-size: var(--text-base); margin-bottom: var(--space-md); color: var(--text-secondary);">对方的像素分身</h3>
          <div class="pet-selector" id="partner-pet-selector">
            ${j.map(e=>`
              <button type="button" class="pet-option ${e.id===`dog`?`selected`:``}" data-pet="${e.id}" aria-pressed="${e.id===`dog`}">
                ${e.iconSvg}
                <span class="pet-name">${e.name}</span>
              </button>
            `).join(``)}
          </div>

          <div class="pairing-code" style="margin-top: var(--space-lg);">
            <p style="font-size: var(--text-sm); color: var(--text-secondary);">本地双人体验</p>
            <p style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-xs);">这是本地演示，不会连接真实账号</p>
          </div>

          <div style="margin-top: var(--space-lg); text-align: center;">
            <button class="btn btn--primary" id="step3-next">完成设置</button>
          </div>
        </div>

        <div class="step-dots" id="step-dots">
          <div class="step-dot active" data-step="1"></div>
          <div class="step-dot" data-step="2"></div>
          <div class="step-dot" data-step="3"></div>
        </div>
      </div>
    `,j.forEach(t=>{let n=e.querySelector(`#pet-preview-${t.id}`);if(n){n.style.width=`80px`,n.style.height=`80px`,n.style.imageRendering=`pixelated`;let e=new y(n,{pixelSize:4,petType:t.id,petStyle:p.state.petStyle});e.setState(`happy`,`idle`),e.startAnimation(),a[t.id]=e}});function o(t){e.querySelectorAll(`.pairing-step`).forEach(e=>e.classList.remove(`active`)),e.querySelector(`#pair-step-${t}`).classList.add(`active`),e.querySelectorAll(`.step-dot`).forEach(e=>e.classList.remove(`active`)),e.querySelector(`.step-dot[data-step="${t}"]`).classList.add(`active`)}e.querySelector(`#step1-next`).addEventListener(`click`,()=>{let n=e.querySelector(`#self-nickname`);if(t=n.value.trim(),!t){n.style.borderColor=`var(--mood-angry)`,n.setAttribute(`placeholder`,`请输入昵称...`);return}o(2)}),e.querySelector(`#pet-selector`).addEventListener(`click`,t=>{let r=t.target.closest(`.pet-option`);r&&(e.querySelectorAll(`#pet-selector .pet-option`).forEach(e=>{e.classList.remove(`selected`),e.setAttribute(`aria-pressed`,`false`)}),r.classList.add(`selected`),r.setAttribute(`aria-pressed`,`true`),n=r.dataset.pet)}),e.querySelector(`#step2-next`).addEventListener(`click`,()=>{o(3)}),e.querySelector(`#partner-pet-selector`).addEventListener(`click`,t=>{let n=t.target.closest(`.pet-option`);n&&(e.querySelectorAll(`#partner-pet-selector .pet-option`).forEach(e=>{e.classList.remove(`selected`),e.setAttribute(`aria-pressed`,`false`)}),n.classList.add(`selected`),n.setAttribute(`aria-pressed`,`true`),i=n.dataset.pet)}),e.querySelector(`#step3-next`).addEventListener(`click`,()=>{r=e.querySelector(`#partner-nickname`).value.trim()||`另一半`,Object.values(a).forEach(e=>e.stopAnimation()),p.completePairing({nickname:t,petType:n},{nickname:r,petType:i}),window.location.hash=`/home`})}},N={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`};function P(e){return String(e??``).replace(/[&<>"']/g,e=>N[e])}var F=null;function I(e){let t=Date.now()-e,n=Math.floor(t/6e4);if(n<1)return`刚刚`;if(n<60)return`${n}分钟前`;let r=Math.floor(n/60);return r<24?`${r}小时前`:`${Math.floor(r/24)}天前`}function L(e){let t=p.partnerUser,n=p.currentUser;E(t.mood),D(t.activity);let r=O(t.disturbance),i=k(t.nickname,t.mood,t.activity),a=p.getLatestPartnerMessage(),o=p.getLatestPartnerPolaroid(),s=P(t.nickname),c=P(n.nickname),l={happy:h.happy,calm:h.moodCalmBubble,tired:h.moodTiredBubble,miss:h.moodMissBubble,sad:h.moodSadBubble,angry:h.moodAngryBubble,anxious:h.moodAnxiousBubble,sleepy:h.moodSleepyBubble,excited:h.moodExcitedBubble,quiet:h.moodQuietBubble};e.innerHTML=`
    <div class="home">
      <div class="home-header">
        <div>
          <span class="partner-name">${s} 的片刻</span>
          <div class="experience-context">当前角色：${c} · 本地演示</div>
        </div>
        <div class="home-actions">
          <button class="switch-btn" id="switch-view-btn" aria-label="从 ${c} 切换到 ${s}">
            切换角色
          </button>
        </div>
      </div>

      <div class="home-pet-area">
        <div class="pet-cabin-pod">
          <div class="cabin-status-bar">
            <div class="status-indicator">
              <div class="status-dot"></div>
              <span>${s} · 本地状态</span>
            </div>
            <div class="battery" style="display: flex; align-items: center; gap: 4px;">
              ${h.heart} <span>${I(t.lastUpdate)}</span>
            </div>
          </div>
          <div class="cabin-screen-bezel">
            <div class="cabin-screen ${t.mood}${a?` has-message`:``}">
              <canvas id="home-pet-canvas" class="cabin-pet-canvas pet-render-safe"></canvas>
              <div class="mood-bubble" id="home-mood-bubble" style="top: 8px; right: 8px;">${l[t.mood]||h.happy}</div>
              ${a?`<div class="short-msg-bubble" style="bottom: 8px;">「${P(a.text)}」</div>`:``}
            </div>
          </div>
        </div>
      </div>

      <div class="home-status">
        <div class="status-text">${P(i)}</div>
        <div class="disturb-text" style="margin-top: var(--space-xs); display: flex; align-items: center; justify-content: center; gap: 6px;">
          ${r.iconSvg} <span>${r.hint}</span>
        </div>
        <div style="font-size: var(--text-xs); color: var(--text-tertiary); margin-top: var(--space-xs);">
          更新于 ${I(t.lastUpdate)}
        </div>
      </div>

      <div class="home-cards">
        ${o?`
          <div class="home-polaroid-wrap">
            <div class="washi-tape top-center yellow" style="width: 70px; height: 16px;"></div>
            <button type="button" class="home-polaroid-preview latest" id="goto-wall-btn" aria-label="查看片刻墙中的最近照片">
              <div class="thumb-wrapper" style="position: relative; width: 64px; height: 64px; border-radius: var(--radius-sm); overflow: hidden; flex-shrink: 0; background: var(--bg-warm); border: 1px solid var(--border-light);">
                <img class="polaroid-thumb" src="${o.imageData}" alt="最近的片刻" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                ${(o.stickers||[]).map(e=>`
                  <div class="sticker-display" style="position: absolute; left: ${e.x}%; top: ${e.y}%; transform: translate(-50%, -50%) rotate(${e.rotate}deg); font-size: 11px; pointer-events: none; user-select: none;">
                    ${e.content}
                  </div>
                `).join(``)}
              </div>
              <div class="polaroid-info">
                <div class="caption">${P(o.caption||`一个片刻`)}</div>
                <div class="time">${I(o.timestamp)}</div>
              </div>
            </button>
          </div>
        `:`
          <div class="home-polaroid-preview" style="justify-content: center; align-items: center; flex-direction: column; padding: var(--space-lg); border: 2px dashed var(--border-light); background: transparent; border-radius: var(--radius-lg); box-shadow: none;">
            <div style="text-align: center; color: var(--text-tertiary); font-size: var(--text-sm);">
              <div class="empty-icon" style="margin-bottom: var(--space-xs); display: flex; justify-content: center;">
                ${h.emptyPhoto}
              </div>
              对方还没有留下照片
            </div>
          </div>
        `}
      </div>
    </div>
  `;let u=e.querySelector(`#home-pet-canvas`);F&&F.stopAnimation(),F=new y(u,{pixelSize:8,displaySize:212,petType:t.petType,petStyle:p.state.petStyle}),F.setState(t.mood,t.activity),F.startAnimation(),e.querySelector(`#switch-view-btn`)?.addEventListener(`click`,()=>{let t=e.querySelector(`.home-pet-area`);t?(t.classList.add(`switching`),setTimeout(()=>{p.switchView();let t=e.querySelector(`.home-pet-area`);t&&(t.classList.add(`switching`),setTimeout(()=>{t.classList.remove(`switching`)},20))},200)):p.switchView()}),e.querySelector(`#goto-wall-btn`)?.addEventListener(`click`,()=>{window.location.hash=`/wall`})}var R={render(e){L(e),p.on(`stateChange`,()=>{window.location.hash===`#/home`&&L(e)})},update(e){L(e)},onLeave(){F&&F.stopAnimation()}},z=null;function B(e){let t=p.currentUser,n=t.mood,r=t.activity,i=t.disturbance,a=w(n,r);e.innerHTML=`
    <div class="set-status">
      <div class="page-title">现在的我</div>
      <div class="experience-context" style="text-align: center;">正在为 ${P(t.nickname)} 更新 · 仅保存在当前设备</div>

      <!-- Pet preview pinned at the top -->
      <div class="status-preview-top">
        <div class="retro-tv-monitor">
          <div class="tv-screen-bezel">
            <div class="tv-screen status-preview-screen mood-${n}">
              <canvas id="status-preview-canvas" class="pet-render-safe" role="img" aria-label="${a.description}"></canvas>
            </div>
          </div>
        </div>
        <div class="preview-text" id="preview-status-text" aria-live="polite">
          <span class="preview-axis"><span class="preview-axis-label">表情</span>${E(n).iconSvg}<strong>${E(n).label}</strong></span>
          <span class="preview-axis"><span class="preview-axis-label">场景</span>${D(r).iconSvg}<strong>${D(r).label}</strong></span>
        </div>
      </div>

      <!-- Mood Section (swipe horizontally) -->
      <div class="status-section">
        <div class="section-title status-section-heading">
          <span class="status-section-heading__label">${h.moodHeader} <span>心情</span></span>
          <span class="section-current" id="mood-current">已选 · ${E(n).label}</span>
        </div>
        <div class="hscroll" id="mood-grid">
          ${b.map(e=>`
            <button class="btn--mood ${e.id===n?`selected`:``}" data-mood="${e.id}" aria-pressed="${e.id===n}">
              <span class="pixel-icon">${e.iconSvg}</span>
              <span class="label">${e.label}</span>
            </button>
          `).join(``)}
        </div>
      </div>

      <!-- Activity Section (swipe horizontally) -->
      <div class="status-section">
        <div class="section-title status-section-heading">
          <span class="status-section-heading__label">${h.activityHeader} <span>正在做什么</span></span>
          <span class="section-current" id="activity-current">已选 · ${D(r).label}</span>
        </div>
        <div class="hscroll" id="activity-grid">
          ${x.map(e=>`
            <button class="btn--mood ${e.id===r?`selected`:``}" data-activity="${e.id}" aria-pressed="${e.id===r}">
              <span class="pixel-icon">${e.iconSvg}</span>
              <span class="label">${e.label}</span>
            </button>
          `).join(``)}
        </div>
      </div>

      <!-- Disturbance Section (swipe horizontally) -->
      <div class="status-section">
        <div class="section-title status-section-heading">
          <span class="status-section-heading__label">${h.disturbHeader} <span>联系偏好</span></span>
          <span class="section-current" id="disturbance-current">已选 · ${O(i).label}</span>
        </div>
        <div class="hscroll disturb-scroll" id="disturb-list">
          ${T.map(e=>`
            <button type="button" class="disturb-option ${e.id===i?`selected`:``}" data-disturb="${e.id}" aria-pressed="${e.id===i}">
              <span class="pixel-icon">${e.iconSvg}</span>
              <span class="disturb-text">${e.label}</span>
            </button>
          `).join(``)}
        </div>
      </div>

      <!-- Submit -->
      <div class="submit-area">
        <button class="btn btn--primary" id="submit-status" aria-live="polite">更新我的状态</button>
      </div>
    </div>
  `;let o=e.querySelector(`#status-preview-canvas`);z&&z.stopAnimation(),z=new y(o,{pixelSize:4,petType:t.petType,petStyle:p.state.petStyle}),z.setState(n,r),z.startAnimation();function s(t,n){e.querySelector(`#${t}`).textContent=`已选 · ${n}`}function c(e,t){if(!e||!t||e.scrollWidth<=e.clientWidth)return;let n=Math.max(0,t.offsetLeft-(e.clientWidth-t.offsetWidth)/2),r=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?`auto`:`smooth`;e.scrollTo({left:n,behavior:r})}requestAnimationFrame(()=>{c(e.querySelector(`#mood-grid`),e.querySelector(`#mood-grid .selected`)),c(e.querySelector(`#activity-grid`),e.querySelector(`#activity-grid .selected`))});function l(){z.setState(n,r),z.render();let t=E(n),i=D(r),a=w(n,r);s(`mood-current`,t.label),s(`activity-current`,i.label),e.querySelector(`#preview-status-text`).innerHTML=`<span class="preview-axis"><span class="preview-axis-label">表情</span>${t.iconSvg}<strong>${t.label}</strong></span><span class="preview-axis"><span class="preview-axis-label">场景</span>${i.iconSvg}<strong>${i.label}</strong></span>`,o.setAttribute(`aria-label`,a.description);let c=e.querySelector(`.status-preview-screen`);c.className=`tv-screen status-preview-screen mood-${n}`}e.querySelector(`#mood-grid`).addEventListener(`click`,t=>{let r=t.target.closest(`.btn--mood`);!r||!r.dataset.mood||(e.querySelectorAll(`#mood-grid .btn--mood`).forEach(e=>{e.classList.remove(`selected`),e.setAttribute(`aria-pressed`,`false`)}),r.classList.add(`selected`),r.setAttribute(`aria-pressed`,`true`),n=r.dataset.mood,l(),c(e.querySelector(`#mood-grid`),r))}),e.querySelector(`#activity-grid`).addEventListener(`click`,t=>{let n=t.target.closest(`.btn--mood`);!n||!n.dataset.activity||(e.querySelectorAll(`#activity-grid .btn--mood`).forEach(e=>{e.classList.remove(`selected`),e.setAttribute(`aria-pressed`,`false`)}),n.classList.add(`selected`),n.setAttribute(`aria-pressed`,`true`),r=n.dataset.activity,l(),c(e.querySelector(`#activity-grid`),n))}),e.querySelector(`#disturb-list`).addEventListener(`click`,t=>{let n=t.target.closest(`.disturb-option`);n&&(e.querySelectorAll(`.disturb-option`).forEach(e=>{e.classList.remove(`selected`),e.setAttribute(`aria-pressed`,`false`)}),n.classList.add(`selected`),n.setAttribute(`aria-pressed`,`true`),i=n.dataset.disturb,s(`disturbance-current`,O(i).label))}),e.querySelector(`#submit-status`).addEventListener(`click`,()=>{p.updateCurrentUser({mood:n,activity:r,disturbance:i});let t=e.querySelector(`#submit-status`);t.textContent=`状态已更新`,t.style.background=`var(--accent-mint)`,t.style.color=`var(--text-primary)`,setTimeout(()=>{window.location.hash=`/home`},800)})}var V={render(e){B(e)},update(e){B(e)},onLeave(){z&&z.stopAnimation()}};function H(){try{let e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),n=e.createGain();t.type=`triangle`,t.frequency.setValueAtTime(150,e.currentTime),t.frequency.exponentialRampToValueAtTime(10,e.currentTime+.05),n.gain.setValueAtTime(.6,e.currentTime),n.gain.exponentialRampToValueAtTime(.01,e.currentTime+.05),t.connect(n),n.connect(e.destination),t.start(),t.stop(e.currentTime+.05);let r=e.sampleRate*.15,i=e.createBuffer(1,r,e.sampleRate),a=i.getChannelData(0);for(let e=0;e<r;e++)a[e]=Math.random()*2-1;let o=e.createBufferSource();o.buffer=i;let s=e.createBiquadFilter();s.type=`bandpass`,s.frequency.value=1200,s.Q.value=3;let c=e.createGain();c.gain.setValueAtTime(.3,e.currentTime),c.gain.exponentialRampToValueAtTime(.01,e.currentTime+.12),o.connect(s),s.connect(c),c.connect(e.destination),o.start()}catch(e){console.warn(`Web Audio shutter sound failed:`,e)}}function U(e){document.body.classList.remove(`polaroid-printing`);let t=null,n=``,r=[],i=!1,a=null,o=null,s=`user`,c=!1,l=!1,u=!1,d=!1,f=!1,m=p.partnerUser;e.innerHTML=`
    <div class="polaroid-page">
      <div class="page-title">拍一片刻</div>
      <div class="page-desc">用复古拍立得记录这一刻；照片仅保存在当前设备。</div>
      <div class="experience-context" style="text-align: center;">当前角色：${P(p.currentUser.nickname)}</div>

      <!-- The physical retro camera device -->
      <div class="picto-camera-device">
        
        <!-- Header: logo and LEDs -->
        <div class="camera-device-header">
          <div class="camera-logo-text">
            Picto
            <!-- Cute pixel cat SVG -->
            <svg class="camera-logo-cat-svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="2" height="3" fill="#E07A5F"/>
              <rect x="12" y="2" width="2" height="3" fill="#E07A5F"/>
              <rect x="4" y="4" width="8" height="10" fill="#E07A5F"/>
              <rect x="2" y="5" width="2" height="7" fill="#E07A5F"/>
              <rect x="12" y="5" width="2" height="7" fill="#E07A5F"/>
              <rect x="4" y="6" width="2" height="2" fill="#1A1A1A"/>
              <rect x="10" y="6" width="2" height="2" fill="#1A1A1A"/>
              <rect x="7" y="8" width="2" height="1" fill="#1A1A1A"/>
              <rect x="5" y="9" width="6" height="1" fill="#F0B0B0"/>
            </svg>
          </div>
          <div class="led-lights">
            <div class="led-light power on" id="camera-led-power" title="状态指示灯"></div>
            <div class="led-light flash" id="camera-led-flash" title="闪光灯指示灯"></div>
          </div>
        </div>

        <!-- Viewfinder Container -->
        <div class="camera-viewfinder-container">
          <div class="camera-viewfinder" id="camera-viewfinder-screen">
            <!-- Dynamic stream or animated fallback pet -->
          </div>
          
          <!-- Viewfinder Overlay controls -->
          <button class="viewfinder-btn close" id="btn-close-camera" title="返回">✕</button>
          <button class="viewfinder-btn flash" id="btn-flash-toggle" title="闪光灯" style="display: flex; align-items: center; justify-content: center;">${h.cameraFlash}</button>
          <button class="viewfinder-btn zoom" id="btn-zoom-toggle" title="变焦">1x</button>
          <button class="viewfinder-btn flip" id="btn-flip-toggle" title="翻转镜头" style="display: flex; align-items: center; justify-content: center;">${h.cameraFlip}</button>
          
          <!-- Shutter flash overlay -->
          <div class="shutter-flash-overlay" id="shutter-flash-overlay"></div>

          <!-- State 2 overlay (拍摄中) -->
          <div class="screen-overlay" id="capture-overlay">
            <div class="overlay-icon" style="display: flex; justify-content: center; align-items: center;">${h.photoTab}</div>
            <div class="overlay-text" style="font-family: var(--font-pixel);">咔嚓!</div>
          </div>

          <!-- State 3 overlay (照片打印中) -->
          <div class="screen-overlay print-overlay" id="print-overlay">
            <div class="overlay-icon heart-icon" style="display: flex; justify-content: center; align-items: center;">${h.heart}</div>
            <div class="overlay-text" style="margin-top: 8px;">正在打印你的片刻...</div>
          </div>
        </div>

        <!-- Camera Deck with controls -->
        <div class="camera-deck">
          <div class="rainbow-stripe"></div>
          <div class="deck-buttons">
            <button class="btn-gallery" id="btn-camera-gallery" title="片刻墙" style="display: flex; align-items: center; justify-content: center;">${h.allTab}</button>
            <div class="btn-shutter-container">
              <button class="btn-shutter" id="btn-camera-shutter" title="快门" style="display: flex; align-items: center; justify-content: center;">${h.photoTab}</button>
            </div>
            <button class="btn-stickers-mode" id="btn-camera-stickers-mode" title="说明" style="display: flex; align-items: center; justify-content: center;">${h.petCat}</button>
          </div>
        </div>

        <!-- Paper slot for printing -->
        <div class="camera-printer-slot"></div>

        <!-- Printer outlet container -->
        <div class="camera-printer-card-container" id="camera-printer-card-container">
          <div class="polaroid-card printing-out" id="printed-polaroid-card">
            <div class="photo-wrapper" id="polaroid-photo-wrapper">
              <img src="" id="polaroid-image" alt="片刻照片" />
            </div>
            <div class="polaroid-bottom">
              <div class="polaroid-caption" id="printed-caption">这一刻想说什么...</div>
              <div class="polaroid-meta">
                <span class="polaroid-time" id="printed-time">05.20 12:00</span>
                <span class="polaroid-mood-tag" id="printed-mood-tag" style="display: inline-flex; align-items: center; gap: 4px;">
                  ${b.find(e=>e.id===`calm`).iconSvg} <span>平静</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <input type="file" id="camera-file-input" accept="image/*" style="display: none;" />
      <p class="inline-feedback" id="camera-feedback" role="status" aria-live="polite"></p>

      <!-- Stickers & Customization Panel (Hidden until printed) -->
      <div class="stickers-customization-panel hidden" id="stickers-customization-panel">
        <div class="stickers-deco-section">
          <div class="section-title">添加贴纸装饰</div>
          <div class="stickers-deco-presets" id="stickers-presets-list">
            <button class="btn-sticker-preset" data-sticker="stickerHeart">${h.stickerHeart}</button>
            <button class="btn-sticker-preset" data-sticker="stickerStar">${h.stickerStar}</button>
            <button class="btn-sticker-preset" data-sticker="stickerPaw">${h.stickerPaw}</button>
            <button class="btn-sticker-preset" data-sticker="stickerRibbon">${h.stickerRibbon}</button>
            <button class="btn-sticker-preset" data-sticker="stickerDrink">${h.stickerDrink}</button>
            <button class="btn-sticker-preset" data-sticker="stickerGlasses">${h.stickerGlasses}</button>
            <button class="btn-sticker-preset" data-sticker="stickerCrown">${h.stickerCrown}</button>
            <button class="btn-sticker-preset" data-sticker="stickerDino">${h.stickerDino}</button>
            <button class="btn-sticker-preset" data-sticker="stickerIceCream">${h.stickerIceCream}</button>
            <button class="btn-sticker-preset" data-sticker="stickerRainbow">${h.stickerRainbow}</button>
          </div>
        </div>

        <div class="polaroid-form">
          <div>
            <div class="section-title">写一句话</div>
            <input 
              type="text" 
              class="input-field" 
              id="editor-caption" 
              placeholder="这一刻想说什么..."
              maxlength="30"
            />
            <div style="font-size: var(--text-xs); color: var(--text-tertiary); text-align: right; margin-top: 4px;">
              <span id="editor-caption-count">0</span>/30
            </div>
          </div>

          <div>
            <div class="section-title">当前心情</div>
            <div class="mood-tags" id="editor-mood-tags"></div>
          </div>

          <div class="submit-area" style="margin-top: var(--space-xs); display: flex; gap: var(--space-sm);">
            <button class="btn btn--secondary" id="btn-reselect" style="flex: 1;">重拍</button>
            <button class="btn btn--primary" id="btn-send-moment" style="flex: 2;">保存到片刻墙</button>
          </div>
        </div>
      </div>
    </div>
  `;let g=e.querySelector(`#camera-file-input`),_=e.querySelector(`#editor-caption`),v=e.querySelector(`#editor-mood-tags`),x=e.querySelector(`#camera-feedback`);function S(e){x.textContent=e}function C(){a&&=(a.getTracks().forEach(e=>e.stop()),null)}function w(){let t=e.querySelector(`#camera-viewfinder-screen`);t.innerHTML=`
      <div class="viewfinder-fallback">
        <canvas id="viewfinder-pet-canvas" class="pet-render-safe"></canvas>
        <button class="viewfinder-fallback-upload-btn" id="fallback-upload-btn">选择本地图片</button>
        <div class="viewfinder-fallback-tip">暂时无法使用相机，你仍可以选择本地照片</div>
      </div>
    `,t.querySelector(`#fallback-upload-btn`).addEventListener(`click`,e=>{e.stopPropagation(),g.click()});let n=t.querySelector(`#viewfinder-pet-canvas`);o&&o.stopAnimation(),o=new y(n,{pixelSize:6,petType:m.petType,petStyle:p.state.petStyle}),o.setState(m.mood,m.activity),o.startAnimation()}function T(){C(),t=null,o&&=(o.stopAnimation(),null);let n=e.querySelector(`#camera-viewfinder-screen`);n.innerHTML=``;let r=document.createElement(`video`);if(r.className=`viewfinder-video`,r.autoplay=!0,r.playsInline=!0,r.muted=!0,c&&r.classList.add(`zoomed`),!navigator.mediaDevices?.getUserMedia){i=!1,S(`当前浏览器不支持相机，已切换为本地演示画面。`),w();return}navigator.mediaDevices.getUserMedia({video:{facingMode:s,width:{ideal:480},height:{ideal:480}},audio:!1}).then(t=>{a=t,n.appendChild(r),r.srcObject=t,i=!0,e.querySelector(`#camera-led-flash`).classList.toggle(`on`,l)}).catch(e=>{console.info(`Camera unavailable; using the local photo fallback.`,e.name),i=!1,S(`相机不可用，已切换为本地演示画面。`),w()})}g.addEventListener(`change`,n=>{let r=n.target.files[0];if(!r)return;let i=new FileReader;i.onload=n=>{t=n.target.result,o&&=(o.stopAnimation(),null),C();let r=e.querySelector(`#camera-viewfinder-screen`);r.innerHTML=`
        <div class="viewfinder-fallback">
          <img src="${t}" style="width: 100%; height: 100%; object-fit: cover;" />
          <button class="viewfinder-fallback-upload-btn" id="fallback-upload-btn">重新选择</button>
        </div>
      `,r.querySelector(`#fallback-upload-btn`).addEventListener(`click`,e=>{e.stopPropagation(),g.click()})},i.readAsDataURL(r)}),e.querySelector(`#btn-close-camera`).addEventListener(`click`,()=>{C(),window.location.hash=`/home`});let E=e.querySelector(`#btn-flash-toggle`);E.addEventListener(`click`,()=>{l=!l,E.classList.toggle(`active`,l),e.querySelector(`#camera-led-flash`).classList.toggle(`on`,l)});let D=e.querySelector(`#btn-zoom-toggle`);D.addEventListener(`click`,()=>{c=!c,D.textContent=c?`2x`:`1x`;let t=e.querySelector(`.viewfinder-video`);t&&t.classList.toggle(`zoomed`,c)}),e.querySelector(`#btn-flip-toggle`).addEventListener(`click`,()=>{s=s===`user`?`environment`:`user`,T()}),e.querySelector(`#btn-camera-gallery`).addEventListener(`click`,()=>{C(),window.location.hash=`/wall`}),e.querySelector(`#btn-camera-stickers-mode`).addEventListener(`click`,()=>{S(`拍摄后可添加并拖动贴纸；双击贴纸可以移除。`)}),e.querySelector(`#btn-camera-shutter`).addEventListener(`click`,()=>{if(u||d||f)return;if(i&&a){let n=e.querySelector(`.viewfinder-video`);if(n){let e=document.createElement(`canvas`);e.width=640,e.height=640;let r=e.getContext(`2d`),i=n.videoWidth,a=n.videoHeight,o=Math.min(i,a),s=(i-o)/2,l=(a-o)/2;if(c){let e=o/1.6,t=s+(o-e)/2,i=l+(o-e)/2;r.drawImage(n,t,i,e,e,0,0,640,640)}else r.drawImage(n,s,l,o,o,0,0,640,640);t=e.toDataURL(`image/jpeg`)}}else{let n=e.querySelector(`#viewfinder-pet-canvas`);n&&!t&&(t=n.toDataURL(`image/png`))}if(!t){S(`请允许使用相机，或先选择一张本地照片。`);return}u=!0,H();let n=e.querySelector(`#shutter-flash-overlay`);n.classList.add(`active`),setTimeout(()=>n.classList.remove(`active`),350);let r=e.querySelector(`#capture-overlay`);r.classList.add(`visible`),setTimeout(()=>{r.classList.remove(`visible`),u=!1,d=!0,document.body.classList.add(`polaroid-printing`);let n=e.querySelector(`#print-overlay`);n.classList.add(`visible`);let i=e.querySelector(`#camera-led-power`);i.classList.remove(`on`),i.classList.add(`printing`);let a=e.querySelector(`#polaroid-image`);a.src=t;let o=e.querySelector(`#printed-time`),s=new Date;o.textContent=`${(s.getMonth()+1).toString().padStart(2,`0`)}.${s.getDate().toString().padStart(2,`0`)} ${s.getHours().toString().padStart(2,`0`)}:${s.getMinutes().toString().padStart(2,`0`)}`,e.querySelector(`#camera-printer-card-container`).classList.add(`expanded`),e.querySelector(`#printed-polaroid-card`).classList.add(`slide-down`),setTimeout(()=>{d=!1,f=!0,document.body.classList.remove(`polaroid-printing`),n.classList.remove(`visible`),i.classList.remove(`printing`),i.classList.add(`on`),C();let t=e.querySelector(`#stickers-customization-panel`);t.classList.remove(`hidden`),t.scrollIntoView({behavior:`smooth`,block:`nearest`})},3500)},800)});function O(e,t){let n=!1,i,a,o,s,c=e.parentElement;function l(t){n=!0;let r=t.touches?t.touches[0].clientX:t.clientX,c=t.touches?t.touches[0].clientY:t.clientY;i=r,a=c,o=parseFloat(e.style.left)||50,s=parseFloat(e.style.top)||50,t.cancelable&&t.preventDefault()}function u(r){if(!n)return;let l=r.touches?r.touches[0].clientX:r.clientX,u=r.touches?r.touches[0].clientY:r.clientY,d=l-i,f=u-a,p=c.getBoundingClientRect(),m=d/p.width*100,h=f/p.height*100,g=o+m,_=s+h;g=Math.max(5,Math.min(95,g)),_=Math.max(5,Math.min(95,_)),t.x=Math.round(g*10)/10,t.y=Math.round(_*10)/10,e.style.left=`${t.x}%`,e.style.top=`${t.y}%`}function d(){n=!1}e.addEventListener(`mousedown`,l),e.addEventListener(`touchstart`,l,{passive:!1}),window.addEventListener(`mousemove`,u),window.addEventListener(`touchmove`,u,{passive:!1}),window.addEventListener(`mouseup`,d),window.addEventListener(`touchend`,d),e.addEventListener(`dblclick`,n=>{n.stopPropagation(),r=r.filter(e=>e.id!==t.id),e.remove()});let f=0;e.addEventListener(`touchend`,n=>{let i=new Date().getTime(),a=i-f;a<300&&a>0&&(n.preventDefault(),r=r.filter(e=>e.id!==t.id),e.remove()),f=i})}e.querySelector(`#stickers-presets-list`).addEventListener(`click`,t=>{let n=t.target.closest(`.btn-sticker-preset`);if(!n)return;let i=h[n.dataset.sticker],a=e.querySelector(`#polaroid-photo-wrapper`),o=Date.now(),s=Math.floor(Math.random()*30)-15,c={id:o,content:i,x:50,y:50,rotate:s};r.push(c);let l=document.createElement(`div`);l.className=`draggable-sticker`,l.dataset.id=o,l.style.left=`50%`,l.style.top=`50%`,l.style.transform=`translate(-50%, -50%) rotate(${s}deg)`,l.innerHTML=`${i}<span class="sticker-delete-indicator">✕</span>`,a.appendChild(l),O(l,c)}),_.addEventListener(`input`,()=>{let t=_.value;e.querySelector(`#editor-caption-count`).textContent=t.length,e.querySelector(`#printed-caption`).textContent=t||`这一刻想说什么...`}),v.innerHTML=b.map(e=>`
    <button class="btn--preset" data-mood="${e.id}" style="display: inline-flex; align-items: center; gap: 4px;">${e.iconSvg} <span>${e.label}</span></button>
  `).join(``),v.addEventListener(`click`,t=>{let r=t.target.closest(`.btn--preset`);if(!r)return;v.querySelectorAll(`.btn--preset`).forEach(e=>e.classList.remove(`selected`)),r.classList.add(`selected`),n=r.dataset.mood;let i=b.find(e=>e.id===n),a=e.querySelector(`#printed-mood-tag`);a&&i&&(a.innerHTML=`${i.iconSvg} <span>${i.label}</span>`)});function k(){t=null,r=[],f=!1,d=!1,u=!1,document.body.classList.remove(`polaroid-printing`),e.querySelector(`#stickers-customization-panel`).classList.add(`hidden`),e.querySelector(`#camera-printer-card-container`).classList.remove(`expanded`);let i=e.querySelector(`#printed-polaroid-card`);i.classList.remove(`slide-down`),i.style=``,e.querySelectorAll(`.draggable-sticker`).forEach(e=>e.remove()),_.value=``,e.querySelector(`#editor-caption-count`).textContent=`0`,e.querySelector(`#printed-caption`).textContent=`这一刻想说什么...`,v.querySelectorAll(`.btn--preset`).forEach(e=>e.classList.remove(`selected`)),n=``,e.querySelector(`#printed-mood-tag`).innerHTML=`${b.find(e=>e.id===`calm`).iconSvg} <span>平静</span>`,T()}e.querySelector(`#btn-reselect`).addEventListener(`click`,()=>{k()}),e.querySelector(`#btn-send-moment`).addEventListener(`click`,async()=>{if(!t)return;let i=e.querySelector(`#btn-send-moment`);i.disabled=!0,i.textContent=`正在保存`;try{await p.addPolaroid({imageData:t,caption:_.value.trim()||``,moodTag:n,stickers:r})}catch(e){console.warn(`Failed to save polaroid:`,e),i.disabled=!1,i.textContent=`重新保存`,S(`照片未能保存。请检查浏览器存储权限后重试。`);return}i.textContent=`已保存`,S(`照片已保存在当前设备的片刻墙。`),i.style.background=`var(--accent-mint)`,i.style.color=`var(--text-primary)`;let a=e.querySelector(`#printed-polaroid-card`);a.style.transition=`transform 0.8s cubic-bezier(0.47, 0, 0.745, 0.715), opacity 0.8s`,a.style.transform=`translateY(550px) rotate(15deg)`,a.style.opacity=`0`,setTimeout(()=>{window.location.hash=`/home`},1e3)}),T(),e._restartCamera=()=>{k()},e._hashListener&&window.removeEventListener(`hashchange`,e._hashListener),e._hashListener=()=>{window.location.hash!==`#/polaroid`&&(document.body.classList.remove(`polaroid-printing`),C(),o&&o.stopAnimation())},window.addEventListener(`hashchange`,e._hashListener)}var W={render(e){U(e)},update(e){e._restartCamera&&e._restartCamera()}},G=[`我刚刚想你了一下`,`今天有点累`,`先忙一会儿`,`晚点找你`,`不用回，我只是想说一下`,`今天辛苦了`],K=[{value:30,label:`30 分钟`},{value:60,label:`1 小时`},{value:180,label:`3 小时`},{value:-1,label:`不自动消失`}];function q(e){let t=p.currentUser,n=60;e.innerHTML=`
    <div class="short-msg-page">
      <div class="page-title">留一句</div>
      <div class="page-desc">写下一句短话，加入本地演示，不会发送到其他设备。</div>
      <div class="experience-context" style="text-align: center;">当前角色：${P(t.nickname)}</div>

      <!-- Input -->
      <div class="msg-input-area" style="padding: var(--space-xs) 0 var(--space-md); max-width: 320px; width: 100%; margin: 0 auto; box-sizing: border-box;">
        <div class="sticky-letter-note">
          <textarea
            class="textarea-field"
            id="msg-input"
            placeholder="写下这一刻想说的话……"
            maxlength="30"
            rows="2"
            style="border: none; padding: 0; margin: 0; box-shadow: none;"
          ></textarea>
          <div class="char-count" style="text-align: right; font-size: var(--text-xs); color: var(--text-tertiary); margin-top: 4px; font-family: var(--font-ui);">
            <span id="msg-count">0</span>/30
          </div>
        </div>
      </div>

      <!-- Preset messages -->
      <div class="message-section quick-message-section">
        <div class="section-title" style="font-size: var(--text-sm); display: flex; align-items: center; gap: 6px;">
          ${h.messageHeader} <span>快捷短句</span>
        </div>
        <div class="preset-messages" id="preset-messages">
          ${G.map(e=>`
            <button class="btn--preset" data-msg="${e}">${e}</button>
          `).join(``)}
        </div>
      </div>

      <!-- Duration -->
      <div class="message-section duration-section">
        <div class="section-title" style="font-size: var(--text-sm); display: flex; align-items: center; gap: 6px;">
          ${h.durationHeader} <span>首页显示时长</span>
        </div>
        <div class="duration-selector" id="duration-selector">
          ${K.map(e=>`
            <button class="duration-option ${e.value===n?`selected`:``}" data-duration="${e.value}" aria-pressed="${e.value===n}">
              ${e.label}
            </button>
          `).join(``)}
        </div>
      </div>

      <!-- Submit -->
      <div class="submit-area">
        <button class="btn btn--primary" id="send-msg" aria-describedby="msg-feedback" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
          保存这句 <span class="pixel-icon" style="width: 18px; height: 18px; display: inline-block;">${h.messageTab}</span>
        </button>
        <p class="inline-feedback" id="msg-feedback" role="status" aria-live="polite"></p>
      </div>
    </div>
  `;let r=e.querySelector(`#msg-input`),i=e.querySelector(`#msg-count`);r.addEventListener(`input`,()=>{i.textContent=r.value.length}),e.querySelector(`#preset-messages`).addEventListener(`click`,t=>{let n=t.target.closest(`.btn--preset`);n&&(r.value=n.dataset.msg,i.textContent=r.value.length,e.querySelectorAll(`#preset-messages .btn--preset`).forEach(e=>e.classList.remove(`selected`)),n.classList.add(`selected`))}),e.querySelector(`#duration-selector`).addEventListener(`click`,t=>{let r=t.target.closest(`.duration-option`);r&&(e.querySelectorAll(`.duration-option`).forEach(e=>{e.classList.remove(`selected`),e.setAttribute(`aria-pressed`,`false`)}),r.classList.add(`selected`),r.setAttribute(`aria-pressed`,`true`),n=parseInt(r.dataset.duration))}),e.querySelector(`#send-msg`).addEventListener(`click`,()=>{let t=r.value.trim();if(!t){let t=e.querySelector(`#msg-feedback`);t.textContent=`先写下一句，再保存到片刻墙。`,r.setAttribute(`aria-invalid`,`true`),r.focus(),setTimeout(()=>{t.textContent=``},1500);return}r.removeAttribute(`aria-invalid`),p.addShortMessage(t,n);let i=e.querySelector(`#send-msg`);i.textContent=`已保存`,e.querySelector(`#msg-feedback`).textContent=`短句已保存在当前设备。`,i.style.background=`var(--accent-mint)`,i.style.color=`var(--text-primary)`,setTimeout(()=>{window.location.hash=`/home`},1e3)})}var J={render(e){q(e)},update(e){q(e)}},Y=`all`;function X(e){let t=new Date(e);return`${t.getMonth()+1}/${t.getDate()} ${t.getHours().toString().padStart(2,`0`)}:${t.getMinutes().toString().padStart(2,`0`)}`}function Z(e){let t=b.find(t=>t.id===e);return t?`<span class="polaroid-mood-tag" style="display: inline-flex; align-items: center; gap: 4px; vertical-align: middle;">${t.iconSvg}<span>${t.label}</span></span>`:``}function Q(e){let t=p.state.polaroids||[],n=p.state.shortMessages||[],r=t,i=n;Y===`photo`?i=[]:Y===`message`&&(r=[]);let a=[];r.forEach(e=>a.push({type:`polaroid`,data:e,ts:e.timestamp})),i.forEach(e=>a.push({type:`message`,data:e,ts:e.timestamp})),a.sort((e,t)=>t.ts-e.ts);let o=a.length===0;e.innerHTML=`
    <div class="wall-page cork-board-bg" style="min-height: 100dvh; box-sizing: border-box;">
      <div class="page-title">片刻墙</div>
      <div class="experience-context" style="text-align: center; margin-bottom: var(--space-md);">当前设备上的照片与短句</div>

      <!-- Filter Tabs -->
      <div class="wall-filter-tabs" id="wall-filter-tabs">
        <button class="btn-filter-tab ${Y===`all`?`active`:``}" data-filter="all" aria-pressed="${Y===`all`}" style="display: inline-flex; align-items: center; justify-content: center;">
          ${h.allTab}<span>全部</span>
        </button>
        <button class="btn-filter-tab ${Y===`photo`?`active`:``}" data-filter="photo" aria-pressed="${Y===`photo`}" style="display: inline-flex; align-items: center; justify-content: center;">
          ${h.photoTab}<span>照片</span>
        </button>
        <button class="btn-filter-tab ${Y===`message`?`active`:``}" data-filter="message" aria-pressed="${Y===`message`}" style="display: inline-flex; align-items: center; justify-content: center;">
          ${h.messageTab}<span>短句</span>
        </button>
      </div>

      ${o?`
        <div class="wall-empty">
          <div class="empty-text">这里还没有共同片刻</div>
          <p style="font-size: var(--text-sm); color: var(--text-tertiary); margin-top: var(--space-sm);">
            留一句或保存一张照片，它会出现在这里
          </p>
          <div class="wall-empty__actions">
            <button type="button" class="wall-empty__action" id="wall-empty-message">
              ${h.messageTab}<span>留一句</span>
            </button>
            <button type="button" class="wall-empty__action" id="wall-empty-photo">
              ${h.photoTab}<span>拍一片刻</span>
            </button>
          </div>
        </div>
      `:`
        <div class="wall-grid" id="wall-grid">
          ${a.map((e,t)=>{let n=[-2.5,2,-1.5,2.5,-2,1.5,-3,3],r=n[t%n.length];if(e.type===`polaroid`){let n=e.data;return`
                <div class="wall-item" style="animation-delay: ${t*60}ms; transform: rotate(${r}deg);">
                  <!-- Retro metal push-pin at the top -->
                  <div class="push-pin"></div>
                  <div class="wall-polaroid">
                    <div class="photo-wrapper">
                      <img src="${n.imageData}" alt="${P(n.caption||`片刻`)}" loading="lazy" />
                      ${(n.stickers||[]).map(e=>`
                        <div class="sticker-display" style="left: ${e.x}%; top: ${e.y}%; transform: translate(-50%, -50%) rotate(${e.rotate}deg);">
                          ${e.content}
                        </div>
                      `).join(``)}
                    </div>
                    <div class="wall-caption">${P(n.caption||``)}</div>
                    <div class="wall-time">
                      ${X(n.timestamp)}
                      ${n.moodTag?` · ${Z(n.moodTag)}`:``}
                      ${n.senderNickname?` · ${P(n.senderNickname)}`:``}
                    </div>
                  </div>
                </div>
              `}else{let n=e.data,i=[`pink`,`yellow`,`blue`,`green`],a=i[t%i.length];return`
                <div class="wall-item" style="animation-delay: ${t*60}ms; transform: rotate(${r}deg);">
                  <!-- Washi Tape decorative element on top-left -->
                  <div class="washi-tape top-left ${a}"></div>
                  <div class="wall-message-slip ${a}">
                    <div class="slip-text">「${P(n.text)}」</div>
                    <div class="slip-time">
                      ${X(n.timestamp)}
                      ${n.senderNickname?` · ${P(n.senderNickname)}`:``}
                    </div>
                  </div>
                </div>
              `}}).join(``)}
        </div>
      `}
    </div>
  `,e.querySelector(`#wall-filter-tabs`)?.addEventListener(`click`,t=>{let n=t.target.closest(`.btn-filter-tab`);n&&(Y=n.dataset.filter,Q(e))}),e.querySelector(`#wall-empty-message`)?.addEventListener(`click`,()=>{window.location.hash=`/short-message`}),e.querySelector(`#wall-empty-photo`)?.addEventListener(`click`,()=>{window.location.hash=`/polaroid`})}var ee={render(e){Q(e),p.on(`stateChange`,()=>{window.location.hash===`#/wall`&&Q(e)})},update(e){Q(e)}};document.getElementById(`app`);function te(){let e=document.createElement(`nav`);return e.className=`bottom-nav`,e.id=`bottom-nav`,e.setAttribute(`aria-label`,`主要导航`),e.innerHTML=`
    <button class="nav-item active" data-route="/home" id="nav-home">
      <span class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="camera-logo-cat-svg">
          <!-- Roof -->
          <rect x="11" y="2" width="2" height="2" fill="#1A1A1A"/>
          <rect x="9" y="4" width="6" height="2" fill="#1A1A1A"/>
          <rect x="10" y="4" width="4" height="1" fill="#E56B6F"/>
          <rect x="7" y="6" width="10" height="2" fill="#1A1A1A"/>
          <rect x="8" y="6" width="8" height="1" fill="#E56B6F"/>
          <rect x="5" y="8" width="14" height="2" fill="#1A1A1A"/>
          <rect x="6" y="8" width="12" height="1" fill="#E56B6F"/>
          <!-- Base / Walls -->
          <rect x="5" y="10" width="14" height="11" fill="#1A1A1A"/>
          <rect x="6" y="10" width="12" height="10" fill="#F4EDE0"/>
          <!-- Door -->
          <rect x="8" y="14" width="4" height="6" fill="#1A1A1A"/>
          <rect x="9" y="15" width="2" height="5" fill="#B38B6D"/>
          <circle cx="10" cy="17" r="0.5" fill="#F4D068"/>
          <!-- Window -->
          <rect x="13" y="12" width="4" height="4" fill="#1A1A1A"/>
          <rect x="14" y="13" width="2" height="2" fill="#A8C8E8"/>
          <!-- Chimney -->
          <rect x="15" y="4" width="2" height="4" fill="#1A1A1A"/>
          <rect x="15" y="5" width="2" height="2" fill="#E56B6F"/>
        </svg>
      </span>
      <span class="nav-label">首页</span>
    </button>
    <button class="nav-item" data-route="/status" id="nav-status">
      <span class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="camera-logo-cat-svg">
          <!-- Large Sparkle -->
          <rect x="11" y="2" width="2" height="2" fill="#1A1A1A"/>
          <rect x="11" y="4" width="2" height="3" fill="#F5D76E"/>
          <rect x="11" y="9" width="2" height="2" fill="#1A1A1A"/>
          <rect x="11" y="7" width="2" height="2" fill="#F5D76E"/>
          <rect x="8" y="5" width="2" height="2" fill="#1A1A1A"/>
          <rect x="10" y="5" width="1" height="2" fill="#F5D76E"/>
          <rect x="14" y="5" width="2" height="2" fill="#1A1A1A"/>
          <rect x="13" y="5" width="1" height="2" fill="#F5D76E"/>
          <rect x="11" y="5" width="2" height="2" fill="#FFFFFF"/>
          
          <!-- Small Sparkle -->
          <rect x="5" y="12" width="2" height="2" fill="#1A1A1A"/>
          <rect x="5" y="14" width="2" height="1" fill="#A8D8C8"/>
          <rect x="5" y="17" width="2" height="2" fill="#1A1A1A"/>
          <rect x="5" y="15" width="2" height="2" fill="#A8D8C8"/>
          <rect x="3" y="14" width="2" height="2" fill="#1A1A1A"/>
          <rect x="4" y="14" width="1" height="2" fill="#A8D8C8"/>
          <rect x="7" y="14" width="2" height="2" fill="#1A1A1A"/>
          <rect x="6" y="14" width="1" height="2" fill="#A8D8C8"/>
          <rect x="5" y="14" width="2" height="2" fill="#FFFFFF"/>
        </svg>
      </span>
      <span class="nav-label">设置状态</span>
    </button>
    <button class="nav-item" data-route="/polaroid" id="nav-polaroid">
      <span class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="camera-logo-cat-svg">
          <!-- Camera Body -->
          <rect x="3" y="6" width="18" height="12" fill="#1A1A1A"/>
          <rect x="4" y="7" width="16" height="10" fill="#C4B8D8"/>
          <!-- Shutter Button / Flash -->
          <rect x="5" y="4" width="3" height="2" fill="#1A1A1A"/>
          <rect x="6" y="4" width="1" height="2" fill="#FF8E9E"/>
          <rect x="14" y="4" width="4" height="2" fill="#1A1A1A"/>
          <rect x="15" y="5" width="2" height="1" fill="#FFFFFF"/>
          <!-- Lens -->
          <rect x="8" y="9" width="8" height="7" fill="#1A1A1A"/>
          <rect x="9" y="10" width="6" height="5" fill="#8FA8BF"/>
          <rect x="10" y="11" width="2" height="2" fill="#1A1A1A"/>
          <rect x="13" y="11" width="1" height="1" fill="#FFFFFF"/>
          <!-- Stripe -->
          <rect x="4" y="11" width="3" height="2" fill="#FFD1A9"/>
        </svg>
      </span>
      <span class="nav-label">拍一片刻</span>
    </button>
    <button class="nav-item" data-route="/message" id="nav-message">
      <span class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="camera-logo-cat-svg">
          <!-- Bubble Outer -->
          <rect x="3" y="4" width="18" height="12" fill="#1A1A1A"/>
          <rect x="4" y="5" width="16" height="10" fill="#FFFFFF"/>
          <!-- Bubble tail -->
          <rect x="6" y="16" width="4" height="2" fill="#1A1A1A"/>
          <rect x="7" y="16" width="2" height="1" fill="#FFFFFF"/>
          <rect x="8" y="18" width="2" height="2" fill="#1A1A1A"/>
          <!-- Dots -->
          <rect x="7" y="9" width="2" height="2" fill="#1A1A1A"/>
          <rect x="11" y="9" width="2" height="2" fill="#1A1A1A"/>
          <rect x="15" y="9" width="2" height="2" fill="#1A1A1A"/>
        </svg>
      </span>
      <span class="nav-label">留一句</span>
    </button>
    <button class="nav-item" data-route="/wall" id="nav-wall">
      <span class="nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="camera-logo-cat-svg">
          <!-- Frame -->
          <rect x="3" y="4" width="18" height="16" fill="#1A1A1A"/>
          <rect x="4" y="5" width="16" height="14" fill="#FFFFFF"/>
          <!-- Inner Image -->
          <rect x="5" y="6" width="14" height="10" fill="#1A1A1A"/>
          <rect x="6" y="7" width="12" height="8" fill="#8FA8BF"/>
          <!-- Grass / Hills -->
          <rect x="6" y="11" width="12" height="4" fill="#81B29A"/>
          <rect x="9" y="10" width="9" height="1" fill="#81B29A"/>
          <!-- Sun -->
          <rect x="14" y="8" width="2" height="2" fill="#F5D76E"/>
          <!-- Pinned tape -->
          <rect x="10" y="2" width="4" height="3" fill="#A8D8C8" opacity="0.8"/>
          <rect x="10" y="2" width="4" height="3" stroke="#1A1A1A" stroke-width="0.5"/>
        </svg>
      </span>
      <span class="nav-label">片刻墙</span>
    </button>
  `,document.body.appendChild(e),e.querySelectorAll(`.nav-item`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.route;window.location.hash=t})}),e}var ne=te(),$=new e;$.register(`/`,A).register(`/pairing`,M).register(`/home`,R).register(`/status`,V).register(`/polaroid`,W).register(`/message`,J).register(`/wall`,ee),$.guard(e=>{let t=[`/home`,`/status`,`/polaroid`,`/message`,`/wall`].includes(e);return ne.style.display=t?`flex`:`none`,!p.isSetupComplete&&t?`/pairing`:e}),p.init().finally(()=>$.start());