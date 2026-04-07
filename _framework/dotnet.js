//! Licensed to the .NET Foundation under one or more agreements.
//! The .NET Foundation licenses this file to you under the MIT license.

var e=!1;const t=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,8,1,6,0,6,64,25,11,11])),o=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,15,1,13,0,65,1,253,15,65,2,253,15,253,128,2,11])),n=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11])),r=Symbol.for("wasm promise_control");function i(e,t){let o=null;const n=new Promise((function(n,r){o={isDone:!1,promise:null,resolve:t=>{o.isDone||(o.isDone=!0,n(t),e&&e())},reject:e=>{o.isDone||(o.isDone=!0,r(e),t&&t())}}}));o.promise=n;const i=n;return i[r]=o,{promise:i,promise_control:o}}function s(e){return e[r]}function a(e){e&&function(e){return void 0!==e[r]}(e)||Be(!1,"Promise is not controllable")}const l="__mono_message__",c=["debug","log","trace","warn","info","error"],d="MONO_WASM: ";let u,f,m,g,p,h;function w(e){g=e}function b(e){if(Pe.diagnosticTracing){const t="function"==typeof e?e():e;console.debug(d+t)}}function y(e,...t){console.info(d+e,...t)}function v(e,...t){console.info(e,...t)}function E(e,...t){console.warn(d+e,...t)}function _(e,...t){if(t&&t.length>0&&t[0]&&"object"==typeof t[0]){if(t[0].silent)return;if(t[0].toString)return void console.error(d+e,t[0].toString())}console.error(d+e,...t)}function x(e,t,o){return function(...n){try{let r=n[0];if(void 0===r)r="undefined";else if(null===r)r="null";else if("function"==typeof r)r=r.toString();else if("string"!=typeof r)try{r=JSON.stringify(r)}catch(e){r=r.toString()}t(o?JSON.stringify({method:e,payload:r,arguments:n.slice(1)}):[e+r,...n.slice(1)])}catch(e){m.error(`proxyConsole failed: ${e}`)}}}function j(e,t,o){f=t,g=e,m={...t};const n=`${o}/console`.replace("https://","wss://").replace("http://","ws://");u=new WebSocket(n),u.addEventListener("error",A),u.addEventListener("close",S),function(){for(const e of c)f[e]=x(`console.${e}`,T,!0)}()}function R(e){let t=30;const o=()=>{u?0==u.bufferedAmount||0==t?(e&&v(e),function(){for(const e of c)f[e]=x(`console.${e}`,m.log,!1)}(),u.removeEventListener("error",A),u.removeEventListener("close",S),u.close(1e3,e),u=void 0):(t--,globalThis.setTimeout(o,100)):e&&m&&m.log(e)};o()}function T(e){u&&u.readyState===WebSocket.OPEN?u.send(e):m.log(e)}function A(e){m.error(`[${g}] proxy console websocket error: ${e}`,e)}function S(e){m.debug(`[${g}] proxy console websocket closed: ${e}`,e)}function D(){Pe.preferredIcuAsset=O(Pe.config);let e="invariant"==Pe.config.globalizationMode;if(!e)if(Pe.preferredIcuAsset)Pe.diagnosticTracing&&b("ICU data archive(s) available, disabling invariant mode");else{if("custom"===Pe.config.globalizationMode||"all"===Pe.config.globalizationMode||"sharded"===Pe.config.globalizationMode){const e="invariant globalization mode is inactive and no ICU data archives are available";throw _(`ERROR: ${e}`),new Error(e)}Pe.diagnosticTracing&&b("ICU data archive(s) not available, using invariant globalization mode"),e=!0,Pe.preferredIcuAsset=null}const t="DOTNET_SYSTEM_GLOBALIZATION_INVARIANT",o=Pe.config.environmentVariables;if(void 0===o[t]&&e&&(o[t]="1"),void 0===o.TZ)try{const e=Intl.DateTimeFormat().resolvedOptions().timeZone||null;e&&(o.TZ=e)}catch(e){y("failed to detect timezone, will fallback to UTC")}}function O(e){var t;if((null===(t=e.resources)||void 0===t?void 0:t.icu)&&"invariant"!=e.globalizationMode){const t=e.applicationCulture||(ke?globalThis.navigator&&globalThis.navigator.languages&&globalThis.navigator.languages[0]:Intl.DateTimeFormat().resolvedOptions().locale),o=e.resources.icu;let n=null;if("custom"===e.globalizationMode){if(o.length>=1)return o[0].name}else t&&"all"!==e.globalizationMode?"sharded"===e.globalizationMode&&(n=function(e){const t=e.split("-")[0];return"en"===t||["fr","fr-FR","it","it-IT","de","de-DE","es","es-ES"].includes(e)?"icudt_EFIGS.dat":["zh","ko","ja"].includes(t)?"icudt_CJK.dat":"icudt_no_CJK.dat"}(t)):n="icudt.dat";if(n)for(let e=0;e<o.length;e++){const t=o[e];if(t.virtualPath===n)return t.name}}return e.globalizationMode="invariant",null}(new Date).valueOf();const C=class{constructor(e){this.url=e}toString(){return this.url}};async function k(e,t){try{const o="function"==typeof globalThis.fetch;if(Se){const n=e.startsWith("file://");if(!n&&o)return globalThis.fetch(e,t||{credentials:"same-origin"});p||(h=Ne.require("url"),p=Ne.require("fs")),n&&(e=h.fileURLToPath(e));const r=await p.promises.readFile(e);return{ok:!0,headers:{length:0,get:()=>null},url:e,arrayBuffer:()=>r,json:()=>JSON.parse(r),text:()=>{throw new Error("NotImplementedException")}}}if(o)return globalThis.fetch(e,t||{credentials:"same-origin"});if("function"==typeof read)return{ok:!0,url:e,headers:{length:0,get:()=>null},arrayBuffer:()=>new Uint8Array(read(e,"binary")),json:()=>JSON.parse(read(e,"utf8")),text:()=>read(e,"utf8")}}catch(t){return{ok:!1,url:e,status:500,headers:{length:0,get:()=>null},statusText:"ERR28: "+t,arrayBuffer:()=>{throw t},json:()=>{throw t},text:()=>{throw t}}}throw new Error("No fetch implementation available")}function I(e){return"string"!=typeof e&&Be(!1,"url must be a string"),!M(e)&&0!==e.indexOf("./")&&0!==e.indexOf("../")&&globalThis.URL&&globalThis.document&&globalThis.document.baseURI&&(e=new URL(e,globalThis.document.baseURI).toString()),e}const U=/^[a-zA-Z][a-zA-Z\d+\-.]*?:\/\//,P=/[a-zA-Z]:[\\/]/;function M(e){return Se||Ie?e.startsWith("/")||e.startsWith("\\")||-1!==e.indexOf("///")||P.test(e):U.test(e)}let L,N=0;const $=[],z=[],W=new Map,F={"js-module-threads":!0,"js-module-runtime":!0,"js-module-dotnet":!0,"js-module-native":!0,"js-module-diagnostics":!0},B={...F,"js-module-library-initializer":!0},V={...F,dotnetwasm:!0,heap:!0,manifest:!0},q={...B,manifest:!0},H={...B,dotnetwasm:!0},J={dotnetwasm:!0,symbols:!0},Z={...B,dotnetwasm:!0,symbols:!0},Q={symbols:!0};function G(e){return!("icu"==e.behavior&&e.name!=Pe.preferredIcuAsset)}function K(e,t,o){null!=t||(t=[]),Be(1==t.length,`Expect to have one ${o} asset in resources`);const n=t[0];return n.behavior=o,X(n),e.push(n),n}function X(e){V[e.behavior]&&W.set(e.behavior,e)}function Y(e){Be(V[e],`Unknown single asset behavior ${e}`);const t=W.get(e);if(t&&!t.resolvedUrl)if(t.resolvedUrl=Pe.locateFile(t.name),F[t.behavior]){const e=ge(t);e?("string"!=typeof e&&Be(!1,"loadBootResource response for 'dotnetjs' type should be a URL string"),t.resolvedUrl=e):t.resolvedUrl=ce(t.resolvedUrl,t.behavior)}else if("dotnetwasm"!==t.behavior)throw new Error(`Unknown single asset behavior ${e}`);return t}function ee(e){const t=Y(e);return Be(t,`Single asset for ${e} not found`),t}let te=!1;async function oe(){if(!te){te=!0,Pe.diagnosticTracing&&b("mono_download_assets");try{const e=[],t=[],o=(e,t)=>{!Z[e.behavior]&&G(e)&&Pe.expected_instantiated_assets_count++,!H[e.behavior]&&G(e)&&(Pe.expected_downloaded_assets_count++,t.push(se(e)))};for(const t of $)o(t,e);for(const e of z)o(e,t);Pe.allDownloadsQueued.promise_control.resolve(),Promise.all([...e,...t]).then((()=>{Pe.allDownloadsFinished.promise_control.resolve()})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e})),await Pe.runtimeModuleLoaded.promise;const n=async e=>{const t=await e;if(t.buffer){if(!Z[t.behavior]){t.buffer&&"object"==typeof t.buffer||Be(!1,"asset buffer must be array-like or buffer-like or promise of these"),"string"!=typeof t.resolvedUrl&&Be(!1,"resolvedUrl must be string");const e=t.resolvedUrl,o=await t.buffer,n=new Uint8Array(o);pe(t),await Ue.beforeOnRuntimeInitialized.promise,Ue.instantiate_asset(t,e,n)}}else J[t.behavior]?("symbols"===t.behavior&&(await Ue.instantiate_symbols_asset(t),pe(t)),J[t.behavior]&&++Pe.actual_downloaded_assets_count):(t.isOptional||Be(!1,"Expected asset to have the downloaded buffer"),!H[t.behavior]&&G(t)&&Pe.expected_downloaded_assets_count--,!Z[t.behavior]&&G(t)&&Pe.expected_instantiated_assets_count--)},r=[],i=[];for(const t of e)r.push(n(t));for(const e of t)i.push(n(e));Promise.all(r).then((()=>{Ce||Ue.coreAssetsInMemory.promise_control.resolve()})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e})),Promise.all(i).then((async()=>{Ce||(await Ue.coreAssetsInMemory.promise,Ue.allAssetsInMemory.promise_control.resolve())})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e}))}catch(e){throw Pe.err("Error in mono_download_assets: "+e),e}}}let ne=!1;function re(){if(ne)return;ne=!0;const e=Pe.config,t=[];if(e.assets)for(const t of e.assets)"object"!=typeof t&&Be(!1,`asset must be object, it was ${typeof t} : ${t}`),"string"!=typeof t.behavior&&Be(!1,"asset behavior must be known string"),"string"!=typeof t.name&&Be(!1,"asset name must be string"),t.resolvedUrl&&"string"!=typeof t.resolvedUrl&&Be(!1,"asset resolvedUrl could be string"),t.hash&&"string"!=typeof t.hash&&Be(!1,"asset resolvedUrl could be string"),t.pendingDownload&&"object"!=typeof t.pendingDownload&&Be(!1,"asset pendingDownload could be object"),t.isCore?$.push(t):z.push(t),X(t);else if(e.resources){const o=e.resources;o.wasmNative||Be(!1,"resources.wasmNative must be defined"),o.jsModuleNative||Be(!1,"resources.jsModuleNative must be defined"),o.jsModuleRuntime||Be(!1,"resources.jsModuleRuntime must be defined"),K(z,o.wasmNative,"dotnetwasm"),K(t,o.jsModuleNative,"js-module-native"),K(t,o.jsModuleRuntime,"js-module-runtime"),o.jsModuleDiagnostics&&K(t,o.jsModuleDiagnostics,"js-module-diagnostics");const n=(e,t,o)=>{const n=e;n.behavior=t,o?(n.isCore=!0,$.push(n)):z.push(n)};if(o.coreAssembly)for(let e=0;e<o.coreAssembly.length;e++)n(o.coreAssembly[e],"assembly",!0);if(o.assembly)for(let e=0;e<o.assembly.length;e++)n(o.assembly[e],"assembly",!o.coreAssembly);if(0!=e.debugLevel&&Pe.isDebuggingSupported()){if(o.corePdb)for(let e=0;e<o.corePdb.length;e++)n(o.corePdb[e],"pdb",!0);if(o.pdb)for(let e=0;e<o.pdb.length;e++)n(o.pdb[e],"pdb",!o.corePdb)}if(e.loadAllSatelliteResources&&o.satelliteResources)for(const e in o.satelliteResources)for(let t=0;t<o.satelliteResources[e].length;t++){const r=o.satelliteResources[e][t];r.culture=e,n(r,"resource",!o.coreAssembly)}if(o.coreVfs)for(let e=0;e<o.coreVfs.length;e++)n(o.coreVfs[e],"vfs",!0);if(o.vfs)for(let e=0;e<o.vfs.length;e++)n(o.vfs[e],"vfs",!o.coreVfs);const r=O(e);if(r&&o.icu)for(let e=0;e<o.icu.length;e++){const t=o.icu[e];t.name===r&&n(t,"icu",!1)}if(o.wasmSymbols)for(let e=0;e<o.wasmSymbols.length;e++)n(o.wasmSymbols[e],"symbols",!1)}if(e.appsettings)for(let t=0;t<e.appsettings.length;t++){const o=e.appsettings[t],n=he(o);"appsettings.json"!==n&&n!==`appsettings.${e.applicationEnvironment}.json`||z.push({name:o,behavior:"vfs",cache:"no-cache",useCredentials:!0})}e.assets=[...$,...z,...t]}async function ie(e){const t=await se(e);return await t.pendingDownloadInternal.response,t.buffer}async function se(e){try{return await ae(e)}catch(t){if(!Pe.enableDownloadRetry)throw t;if(Ie||Se)throw t;if(e.pendingDownload&&e.pendingDownloadInternal==e.pendingDownload)throw t;if(e.resolvedUrl&&-1!=e.resolvedUrl.indexOf("file://"))throw t;if(t&&404==t.status)throw t;e.pendingDownloadInternal=void 0,await Pe.allDownloadsQueued.promise;try{return Pe.diagnosticTracing&&b(`Retrying download '${e.name}'`),await ae(e)}catch(t){return e.pendingDownloadInternal=void 0,await new Promise((e=>globalThis.setTimeout(e,100))),Pe.diagnosticTracing&&b(`Retrying download (2) '${e.name}' after delay`),await ae(e)}}}async function ae(e){for(;L;)await L.promise;try{++N,N==Pe.maxParallelDownloads&&(Pe.diagnosticTracing&&b("Throttling further parallel downloads"),L=i());const t=await async function(e){if(e.pendingDownload&&(e.pendingDownloadInternal=e.pendingDownload),e.pendingDownloadInternal&&e.pendingDownloadInternal.response)return e.pendingDownloadInternal.response;if(e.buffer){const t=await e.buffer;return e.resolvedUrl||(e.resolvedUrl="undefined://"+e.name),e.pendingDownloadInternal={url:e.resolvedUrl,name:e.name,response:Promise.resolve({ok:!0,arrayBuffer:()=>t,json:()=>JSON.parse(new TextDecoder("utf-8").decode(t)),text:()=>{throw new Error("NotImplementedException")},headers:{get:()=>{}}})},e.pendingDownloadInternal.response}const t=e.loadRemote&&Pe.config.remoteSources?Pe.config.remoteSources:[""];let o;for(let n of t){n=n.trim(),"./"===n&&(n="");const t=le(e,n);e.name===t?Pe.diagnosticTracing&&b(`Attempting to download '${t}'`):Pe.diagnosticTracing&&b(`Attempting to download '${t}' for ${e.name}`);try{e.resolvedUrl=t;const n=fe(e);if(e.pendingDownloadInternal=n,o=await n.response,!o||!o.ok)continue;return o}catch(e){o||(o={ok:!1,url:t,status:0,statusText:""+e});continue}}const n=e.isOptional||e.name.match(/\.pdb$/)&&Pe.config.ignorePdbLoadErrors;if(o||Be(!1,`Response undefined ${e.name}`),!n){const t=new Error(`download '${o.url}' for ${e.name} failed ${o.status} ${o.statusText}`);throw t.status=o.status,t}y(`optional download '${o.url}' for ${e.name} failed ${o.status} ${o.statusText}`)}(e);return t?(J[e.behavior]||(e.buffer=await t.arrayBuffer(),++Pe.actual_downloaded_assets_count),e):e}finally{if(--N,L&&N==Pe.maxParallelDownloads-1){Pe.diagnosticTracing&&b("Resuming more parallel downloads");const e=L;L=void 0,e.promise_control.resolve()}}}function le(e,t){let o;return null==t&&Be(!1,`sourcePrefix must be provided for ${e.name}`),e.resolvedUrl?o=e.resolvedUrl:(o=""===t?"assembly"===e.behavior||"pdb"===e.behavior?e.name:"resource"===e.behavior&&e.culture&&""!==e.culture?`${e.culture}/${e.name}`:e.name:t+e.name,o=ce(Pe.locateFile(o),e.behavior)),o&&"string"==typeof o||Be(!1,"attemptUrl need to be path or url string"),o}function ce(e,t){return Pe.modulesUniqueQuery&&q[t]&&(e+=Pe.modulesUniqueQuery),e}let de=0;const ue=new Set;function fe(e){try{e.resolvedUrl||Be(!1,"Request's resolvedUrl must be set");const t=function(e){let t=e.resolvedUrl;if(Pe.loadBootResource){const o=ge(e);if(o instanceof Promise)return o;"string"==typeof o&&(t=o)}const o={};return e.cache?o.cache=e.cache:Pe.config.disableNoCacheFetch||(o.cache="no-cache"),e.useCredentials?o.credentials="include":!Pe.config.disableIntegrityCheck&&e.hash&&(o.integrity=e.hash),Pe.fetch_like(t,o)}(e),o={name:e.name,url:e.resolvedUrl,response:t};return ue.add(e.name),o.response.then((()=>{"assembly"==e.behavior&&Pe.loadedAssemblies.push(e.name),de++,Pe.onDownloadResourceProgress&&Pe.onDownloadResourceProgress(de,ue.size)})),o}catch(t){const o={ok:!1,url:e.resolvedUrl,status:500,statusText:"ERR29: "+t,arrayBuffer:()=>{throw t},json:()=>{throw t}};return{name:e.name,url:e.resolvedUrl,response:Promise.resolve(o)}}}const me={resource:"assembly",assembly:"assembly",pdb:"pdb",icu:"globalization",vfs:"configuration",manifest:"manifest",dotnetwasm:"dotnetwasm","js-module-dotnet":"dotnetjs","js-module-native":"dotnetjs","js-module-runtime":"dotnetjs","js-module-threads":"dotnetjs"};function ge(e){var t;if(Pe.loadBootResource){const o=null!==(t=e.hash)&&void 0!==t?t:"",n=e.resolvedUrl,r=me[e.behavior];if(r){const t=Pe.loadBootResource(r,e.name,n,o,e.behavior);return"string"==typeof t?I(t):t}}}function pe(e){e.pendingDownloadInternal=null,e.pendingDownload=null,e.buffer=null,e.moduleExports=null}function he(e){let t=e.lastIndexOf("/");return t>=0&&t++,e.substring(t)}async function we(e){e&&await Promise.all((null!=e?e:[]).map((e=>async function(e){try{const t=e.name;if(!e.moduleExports){const o=ce(Pe.locateFile(t),"js-module-library-initializer");Pe.diagnosticTracing&&b(`Attempting to import '${o}' for ${e}`),e.moduleExports=await import(/*! webpackIgnore: true */o)}Pe.libraryInitializers.push({scriptName:t,exports:e.moduleExports})}catch(t){E(`Failed to import library initializer '${e}': ${t}`)}}(e))))}async function be(e,t){if(!Pe.libraryInitializers)return;const o=[];for(let n=0;n<Pe.libraryInitializers.length;n++){const r=Pe.libraryInitializers[n];r.exports[e]&&o.push(ye(r.scriptName,e,(()=>r.exports[e](...t))))}await Promise.all(o)}async function ye(e,t,o){try{await o()}catch(o){throw E(`Failed to invoke '${t}' on library initializer '${e}': ${o}`),Xe(1,o),o}}function ve(e,t){if(e===t)return e;const o={...t};return void 0!==o.assets&&o.assets!==e.assets&&(o.assets=[...e.assets||[],...o.assets||[]]),void 0!==o.resources&&(o.resources=_e(e.resources||{assembly:[],jsModuleNative:[],jsModuleRuntime:[],wasmNative:[]},o.resources)),void 0!==o.environmentVariables&&(o.environmentVariables={...e.environmentVariables||{},...o.environmentVariables||{}}),void 0!==o.runtimeOptions&&o.runtimeOptions!==e.runtimeOptions&&(o.runtimeOptions=[...e.runtimeOptions||[],...o.runtimeOptions||[]]),Object.assign(e,o)}function Ee(e,t){if(e===t)return e;const o={...t};return o.config&&(e.config||(e.config={}),o.config=ve(e.config,o.config)),Object.assign(e,o)}function _e(e,t){if(e===t)return e;const o={...t};return void 0!==o.coreAssembly&&(o.coreAssembly=[...e.coreAssembly||[],...o.coreAssembly||[]]),void 0!==o.assembly&&(o.assembly=[...e.assembly||[],...o.assembly||[]]),void 0!==o.lazyAssembly&&(o.lazyAssembly=[...e.lazyAssembly||[],...o.lazyAssembly||[]]),void 0!==o.corePdb&&(o.corePdb=[...e.corePdb||[],...o.corePdb||[]]),void 0!==o.pdb&&(o.pdb=[...e.pdb||[],...o.pdb||[]]),void 0!==o.jsModuleWorker&&(o.jsModuleWorker=[...e.jsModuleWorker||[],...o.jsModuleWorker||[]]),void 0!==o.jsModuleNative&&(o.jsModuleNative=[...e.jsModuleNative||[],...o.jsModuleNative||[]]),void 0!==o.jsModuleDiagnostics&&(o.jsModuleDiagnostics=[...e.jsModuleDiagnostics||[],...o.jsModuleDiagnostics||[]]),void 0!==o.jsModuleRuntime&&(o.jsModuleRuntime=[...e.jsModuleRuntime||[],...o.jsModuleRuntime||[]]),void 0!==o.wasmSymbols&&(o.wasmSymbols=[...e.wasmSymbols||[],...o.wasmSymbols||[]]),void 0!==o.wasmNative&&(o.wasmNative=[...e.wasmNative||[],...o.wasmNative||[]]),void 0!==o.icu&&(o.icu=[...e.icu||[],...o.icu||[]]),void 0!==o.satelliteResources&&(o.satelliteResources=function(e,t){if(e===t)return e;for(const o in t)e[o]=[...e[o]||[],...t[o]||[]];return e}(e.satelliteResources||{},o.satelliteResources||{})),void 0!==o.modulesAfterConfigLoaded&&(o.modulesAfterConfigLoaded=[...e.modulesAfterConfigLoaded||[],...o.modulesAfterConfigLoaded||[]]),void 0!==o.modulesAfterRuntimeReady&&(o.modulesAfterRuntimeReady=[...e.modulesAfterRuntimeReady||[],...o.modulesAfterRuntimeReady||[]]),void 0!==o.extensions&&(o.extensions={...e.extensions||{},...o.extensions||{}}),void 0!==o.vfs&&(o.vfs=[...e.vfs||[],...o.vfs||[]]),Object.assign(e,o)}function xe(){const e=Pe.config;if(e.environmentVariables=e.environmentVariables||{},e.runtimeOptions=e.runtimeOptions||[],e.resources=e.resources||{assembly:[],jsModuleNative:[],jsModuleWorker:[],jsModuleRuntime:[],wasmNative:[],vfs:[],satelliteResources:{}},e.assets){Pe.diagnosticTracing&&b("config.assets is deprecated, use config.resources instead");for(const t of e.assets){const o={};switch(t.behavior){case"assembly":o.assembly=[t];break;case"pdb":o.pdb=[t];break;case"resource":o.satelliteResources={},o.satelliteResources[t.culture]=[t];break;case"icu":o.icu=[t];break;case"symbols":o.wasmSymbols=[t];break;case"vfs":o.vfs=[t];break;case"dotnetwasm":o.wasmNative=[t];break;case"js-module-threads":o.jsModuleWorker=[t];break;case"js-module-runtime":o.jsModuleRuntime=[t];break;case"js-module-native":o.jsModuleNative=[t];break;case"js-module-diagnostics":o.jsModuleDiagnostics=[t];break;case"js-module-dotnet":break;default:throw new Error(`Unexpected behavior ${t.behavior} of asset ${t.name}`)}_e(e.resources,o)}}e.debugLevel,e.applicationEnvironment||(e.applicationEnvironment="Production"),e.applicationCulture&&(e.environmentVariables.LANG=`${e.applicationCulture}.UTF-8`),Ue.diagnosticTracing=Pe.diagnosticTracing=!!e.diagnosticTracing,Ue.waitForDebugger=e.waitForDebugger,Pe.maxParallelDownloads=e.maxParallelDownloads||Pe.maxParallelDownloads,Pe.enableDownloadRetry=void 0!==e.enableDownloadRetry?e.enableDownloadRetry:Pe.enableDownloadRetry}let je=!1;async function Re(e){var t;if(je)return void await Pe.afterConfigLoaded.promise;let o;try{if(e.configSrc||Pe.config&&0!==Object.keys(Pe.config).length&&(Pe.config.assets||Pe.config.resources)||(e.configSrc="dotnet.boot.js"),o=e.configSrc,je=!0,o&&(Pe.diagnosticTracing&&b("mono_wasm_load_config"),await async function(e){const t=e.configSrc,o=Pe.locateFile(t);let n=null;void 0!==Pe.loadBootResource&&(n=Pe.loadBootResource("manifest",t,o,"","manifest"));let r,i=null;if(n)if("string"==typeof n)n.includes(".json")?(i=await s(I(n)),r=await Ae(i)):r=(await import(I(n))).config;else{const e=await n;"function"==typeof e.json?(i=e,r=await Ae(i)):r=e.config}else o.includes(".json")?(i=await s(ce(o,"manifest")),r=await Ae(i)):r=(await import(ce(o,"manifest"))).config;function s(e){return Pe.fetch_like(e,{method:"GET",credentials:"include",cache:"no-cache"})}Pe.config.applicationEnvironment&&(r.applicationEnvironment=Pe.config.applicationEnvironment),ve(Pe.config,r)}(e)),xe(),await we(null===(t=Pe.config.resources)||void 0===t?void 0:t.modulesAfterConfigLoaded),await be("onRuntimeConfigLoaded",[Pe.config]),e.onConfigLoaded)try{await e.onConfigLoaded(Pe.config,Le),xe()}catch(e){throw _("onConfigLoaded() failed",e),e}xe(),Pe.afterConfigLoaded.promise_control.resolve(Pe.config)}catch(t){const n=`Failed to load config file ${o} ${t} ${null==t?void 0:t.stack}`;throw Pe.config=e.config=Object.assign(Pe.config,{message:n,error:t,isError:!0}),Xe(1,new Error(n)),t}}function Te(){return!!globalThis.navigator&&(Pe.isChromium||Pe.isFirefox)}async function Ae(e){const t=Pe.config,o=await e.json();t.applicationEnvironment||o.applicationEnvironment||(o.applicationEnvironment=e.headers.get("Blazor-Environment")||e.headers.get("DotNet-Environment")||void 0),o.environmentVariables||(o.environmentVariables={});const n=e.headers.get("DOTNET-MODIFIABLE-ASSEMBLIES");n&&(o.environmentVariables.DOTNET_MODIFIABLE_ASSEMBLIES=n);const r=e.headers.get("ASPNETCORE-BROWSER-TOOLS");return r&&(o.environmentVariables.__ASPNETCORE_BROWSER_TOOLS=r),o}"function"!=typeof importScripts||globalThis.onmessage||(globalThis.dotnetSidecar=!0);const Se="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,De="function"==typeof importScripts,Oe=De&&"undefined"!=typeof dotnetSidecar,Ce=De&&!Oe,ke="object"==typeof window||De&&!Se,Ie=!ke&&!Se;let Ue={},Pe={},Me={},Le={},Ne={},$e=!1;const ze={},We={config:ze},Fe={mono:{},binding:{},internal:Ne,module:We,loaderHelpers:Pe,runtimeHelpers:Ue,diagnosticHelpers:Me,api:Le};function Be(e,t){if(e)return;const o="Assert failed: "+("function"==typeof t?t():t),n=new Error(o);_(o,n),Ue.nativeAbort(n)}function Ve(){return void 0!==Pe.exitCode}function qe(){return Ue.runtimeReady&&!Ve()}function He(){Ve()&&Be(!1,`.NET runtime already exited with ${Pe.exitCode} ${Pe.exitReason}. You can use runtime.runMain() which doesn't exit the runtime.`),Ue.runtimeReady||Be(!1,".NET runtime didn't start yet. Please call dotnet.create() first.")}function Je(){ke&&(globalThis.addEventListener("unhandledrejection",et),globalThis.addEventListener("error",tt))}let Ze,Qe;function Ge(e){Qe&&Qe(e),Xe(e,Pe.exitReason)}function Ke(e){Ze&&Ze(e||Pe.exitReason),Xe(1,e||Pe.exitReason)}function Xe(t,o){var n,r;const i=o&&"object"==typeof o;t=i&&"number"==typeof o.status?o.status:void 0===t?-1:t;const s=i&&"string"==typeof o.message?o.message:""+o;(o=i?o:Ue.ExitStatus?function(e,t){const o=new Ue.ExitStatus(e);return o.message=t,o.toString=()=>t,o}(t,s):new Error("Exit with code "+t+" "+s)).status=t,o.message||(o.message=s);const a=""+(o.stack||(new Error).stack);try{Object.defineProperty(o,"stack",{get:()=>a})}catch(e){}const l=!!o.silent;if(o.silent=!0,Ve())Pe.diagnosticTracing&&b("mono_exit called after exit");else{try{We.onAbort==Ke&&(We.onAbort=Ze),We.onExit==Ge&&(We.onExit=Qe),ke&&(globalThis.removeEventListener("unhandledrejection",et),globalThis.removeEventListener("error",tt)),Ue.runtimeReady?(Ue.jiterpreter_dump_stats&&Ue.jiterpreter_dump_stats(!1),0===t&&(null===(n=Pe.config)||void 0===n?void 0:n.interopCleanupOnExit)&&Ue.forceDisposeProxies(!0,!0),e&&0!==t&&(null===(r=Pe.config)||void 0===r||r.dumpThreadsOnNonZeroExit)):(Pe.diagnosticTracing&&b(`abort_startup, reason: ${o}`),function(e){Pe.allDownloadsQueued.promise_control.reject(e),Pe.allDownloadsFinished.promise_control.reject(e),Pe.afterConfigLoaded.promise_control.reject(e),Pe.wasmCompilePromise.promise_control.reject(e),Pe.runtimeModuleLoaded.promise_control.reject(e),Ue.dotnetReady&&(Ue.dotnetReady.promise_control.reject(e),Ue.afterInstantiateWasm.promise_control.reject(e),Ue.beforePreInit.promise_control.reject(e),Ue.afterPreInit.promise_control.reject(e),Ue.afterPreRun.promise_control.reject(e),Ue.beforeOnRuntimeInitialized.promise_control.reject(e),Ue.afterOnRuntimeInitialized.promise_control.reject(e),Ue.afterPostRun.promise_control.reject(e))}(o))}catch(e){E("mono_exit A failed",e)}try{l||(function(e,t){if(0!==e&&t){const e=Ue.ExitStatus&&t instanceof Ue.ExitStatus?b:_;"string"==typeof t?e(t):(void 0===t.stack&&(t.stack=(new Error).stack+""),t.message?e(Ue.stringify_as_error_with_stack?Ue.stringify_as_error_with_stack(t.message+"\n"+t.stack):t.message+"\n"+t.stack):e(JSON.stringify(t)))}!Ce&&Pe.config&&(Pe.config.logExitCode?Pe.config.forwardConsoleLogsToWS?R("WASM EXIT "+e):v("WASM EXIT "+e):Pe.config.forwardConsoleLogsToWS&&R())}(t,o),function(e){if(ke&&!Ce&&Pe.config&&Pe.config.appendElementOnExit&&document){const t=document.createElement("label");t.id="tests_done",0!==e&&(t.style.background="red"),t.innerHTML=""+e,document.body.appendChild(t)}}(t))}catch(e){E("mono_exit B failed",e)}Pe.exitCode=t,Pe.exitReason||(Pe.exitReason=o),!Ce&&Ue.runtimeReady&&We.runtimeKeepalivePop()}if(Pe.config&&Pe.config.asyncFlushOnExit&&0===t)throw(async()=>{try{await async function(){try{const e=await import(/*! webpackIgnore: true */"process"),t=e=>new Promise(((t,o)=>{e.on("error",o),e.end("","utf8",t)})),o=t(e.stderr),n=t(e.stdout);let r;const i=new Promise((e=>{r=setTimeout((()=>e("timeout")),1e3)}));await Promise.race([Promise.all([n,o]),i]),clearTimeout(r)}catch(e){_(`flushing std* streams failed: ${e}`)}}()}finally{Ye(t,o)}})(),o;Ye(t,o)}function Ye(e,t){if(Ue.runtimeReady&&Ue.nativeExit)try{Ue.nativeExit(e)}catch(e){!Ue.ExitStatus||e instanceof Ue.ExitStatus||E("set_exit_code_and_quit_now failed: "+e.toString())}if(0!==e||!ke)throw Se&&Ne.process?Ne.process.exit(e):Ue.quit&&Ue.quit(e,t),t}function et(e){ot(e,e.reason,"rejection")}function tt(e){ot(e,e.error,"error")}function ot(e,t,o){e.preventDefault();try{t||(t=new Error("Unhandled "+o)),void 0===t.stack&&(t.stack=(new Error).stack),t.stack=t.stack+"",t.silent||(_("Unhandled error:",t),Xe(1,t))}catch(e){}}!function(e){if($e)throw new Error("Loader module already loaded");$e=!0,Ue=e.runtimeHelpers,Pe=e.loaderHelpers,Me=e.diagnosticHelpers,Le=e.api,Ne=e.internal,Object.assign(Le,{INTERNAL:Ne,invokeLibraryInitializers:be}),Object.assign(e.module,{config:ve(ze,{environmentVariables:{}})});const r={mono_wasm_bindings_is_ready:!1,config:e.module.config,diagnosticTracing:!1,nativeAbort:e=>{throw e||new Error("abort")},nativeExit:e=>{throw new Error("exit:"+e)}},l={gitHash:"a612c2a1056fe3265387ae3ff7c94eba1505caf9",config:e.module.config,diagnosticTracing:!1,maxParallelDownloads:16,enableDownloadRetry:!0,_loaded_files:[],loadedFiles:[],loadedAssemblies:[],libraryInitializers:[],workerNextNumber:1,actual_downloaded_assets_count:0,actual_instantiated_assets_count:0,expected_downloaded_assets_count:0,expected_instantiated_assets_count:0,afterConfigLoaded:i(),allDownloadsQueued:i(),allDownloadsFinished:i(),wasmCompilePromise:i(),runtimeModuleLoaded:i(),loadingWorkers:i(),is_exited:Ve,is_runtime_running:qe,assert_runtime_running:He,mono_exit:Xe,createPromiseController:i,getPromiseController:s,assertIsControllablePromise:a,mono_download_assets:oe,resolve_single_asset_path:ee,setup_proxy_console:j,set_thread_prefix:w,installUnhandledErrorHandler:Je,retrieve_asset_download:ie,invokeLibraryInitializers:be,isDebuggingSupported:Te,exceptions:t,simd:n,relaxedSimd:o};Object.assign(Ue,r),Object.assign(Pe,l)}(Fe);let nt,rt,it,st=!1,at=!1;async function lt(e){if(!at){if(at=!0,ke&&Pe.config.forwardConsoleLogsToWS&&void 0!==globalThis.WebSocket&&j("main",globalThis.console,globalThis.location.origin),We||Be(!1,"Null moduleConfig"),Pe.config||Be(!1,"Null moduleConfig.config"),"function"==typeof e){const t=e(Fe.api);if(t.ready)throw new Error("Module.ready couldn't be redefined.");Object.assign(We,t),Ee(We,t)}else{if("object"!=typeof e)throw new Error("Can't use moduleFactory callback of createDotnetRuntime function.");Ee(We,e)}await async function(e){if(Se){const e=await import(/*! webpackIgnore: true */"process"),t=14;if(e.versions.node.split(".")[0]<t)throw new Error(`NodeJS at '${e.execPath}' has too low version '${e.versions.node}', please use at least ${t}. See also https://aka.ms/dotnet-wasm-features`)}const t=/*! webpackIgnore: true */import.meta.url,o=t.indexOf("?");var n;if(o>0&&(Pe.modulesUniqueQuery=t.substring(o)),Pe.scriptUrl=t.replace(/\\/g,"/").replace(/[?#].*/,""),Pe.scriptDirectory=(n=Pe.scriptUrl).slice(0,n.lastIndexOf("/"))+"/",Pe.locateFile=e=>"URL"in globalThis&&globalThis.URL!==C?new URL(e,Pe.scriptDirectory).toString():M(e)?e:Pe.scriptDirectory+e,Pe.fetch_like=k,Pe.out=console.log,Pe.err=console.error,Pe.onDownloadResourceProgress=e.onDownloadResourceProgress,ke&&globalThis.navigator){const e=globalThis.navigator,t=e.userAgentData&&e.userAgentData.brands;t&&t.length>0?Pe.isChromium=t.some((e=>"Google Chrome"===e.brand||"Microsoft Edge"===e.brand||"Chromium"===e.brand)):e.userAgent&&(Pe.isChromium=e.userAgent.includes("Chrome"),Pe.isFirefox=e.userAgent.includes("Firefox"))}Ne.require=Se?await import(/*! webpackIgnore: true */"module").then((e=>e.createRequire(/*! webpackIgnore: true */import.meta.url))):Promise.resolve((()=>{throw new Error("require not supported")})),void 0===globalThis.URL&&(globalThis.URL=C)}(We)}}async function ct(e){return await lt(e),Ze=We.onAbort,Qe=We.onExit,We.onAbort=Ke,We.onExit=Ge,We.ENVIRONMENT_IS_PTHREAD?async function(){(function(){const e=new MessageChannel,t=e.port1,o=e.port2;t.addEventListener("message",(e=>{var n,r;n=JSON.parse(e.data.config),r=JSON.parse(e.data.monoThreadInfo),st?Pe.diagnosticTracing&&b("mono config already received"):(ve(Pe.config,n),Ue.monoThreadInfo=r,xe(),Pe.diagnosticTracing&&b("mono config received"),st=!0,Pe.afterConfigLoaded.promise_control.resolve(Pe.config),ke&&n.forwardConsoleLogsToWS&&void 0!==globalThis.WebSocket&&Pe.setup_proxy_console("worker-idle",console,globalThis.location.origin)),t.close(),o.close()}),{once:!0}),t.start(),self.postMessage({[l]:{monoCmd:"preload",port:o}},[o])})(),await Pe.afterConfigLoaded.promise,function(){const e=Pe.config;e.assets||Be(!1,"config.assets must be defined");for(const t of e.assets)X(t),Q[t.behavior]&&z.push(t)}(),setTimeout((async()=>{try{await oe()}catch(e){Xe(1,e)}}),0);const e=dt(),t=await Promise.all(e);return await ut(t),We}():async function(){var e;await Re(We),re();const t=dt();(async function(){try{const e=ee("dotnetwasm");await se(e),e&&e.pendingDownloadInternal&&e.pendingDownloadInternal.response||Be(!1,"Can't load dotnet.native.wasm");const t=await e.pendingDownloadInternal.response,o=t.headers&&t.headers.get?t.headers.get("Content-Type"):void 0;let n;if("function"==typeof WebAssembly.compileStreaming&&"application/wasm"===o)n=await WebAssembly.compileStreaming(t);else{ke&&"application/wasm"!==o&&E('WebAssembly resource does not have the expected content type "application/wasm", so falling back to slower ArrayBuffer instantiation.');const e=await t.arrayBuffer();Pe.diagnosticTracing&&b("instantiate_wasm_module buffered"),n=Ie?await Promise.resolve(new WebAssembly.Module(e)):await WebAssembly.compile(e)}e.pendingDownloadInternal=null,e.pendingDownload=null,e.buffer=null,e.moduleExports=null,Pe.wasmCompilePromise.promise_control.resolve(n)}catch(e){Pe.wasmCompilePromise.promise_control.reject(e)}})(),setTimeout((async()=>{try{D(),await oe()}catch(e){Xe(1,e)}}),0);const o=await Promise.all(t);return await ut(o),await Ue.dotnetReady.promise,await we(null===(e=Pe.config.resources)||void 0===e?void 0:e.modulesAfterRuntimeReady),await be("onRuntimeReady",[Fe.api]),Le}()}function dt(){const e=ee("js-module-runtime"),t=ee("js-module-native");if(nt&&rt)return[nt,rt,it];"object"==typeof e.moduleExports?nt=e.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${e.resolvedUrl}' for ${e.name}`),nt=import(/*! webpackIgnore: true */e.resolvedUrl)),"object"==typeof t.moduleExports?rt=t.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${t.resolvedUrl}' for ${t.name}`),rt=import(/*! webpackIgnore: true */t.resolvedUrl));const o=Y("js-module-diagnostics");return o&&("object"==typeof o.moduleExports?it=o.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${o.resolvedUrl}' for ${o.name}`),it=import(/*! webpackIgnore: true */o.resolvedUrl))),[nt,rt,it]}async function ut(e){const{initializeExports:t,initializeReplacements:o,configureRuntimeStartup:n,configureEmscriptenStartup:r,configureWorkerStartup:i,setRuntimeGlobals:s,passEmscriptenInternals:a}=e[0],{default:l}=e[1],c=e[2];s(Fe),t(Fe),c&&c.setRuntimeGlobals(Fe),await n(We),Pe.runtimeModuleLoaded.promise_control.resolve(),l((e=>(Object.assign(We,{ready:e.ready,__dotnet_runtime:{initializeReplacements:o,configureEmscriptenStartup:r,configureWorkerStartup:i,passEmscriptenInternals:a}}),We))).catch((e=>{if(e.message&&e.message.toLowerCase().includes("out of memory"))throw new Error(".NET runtime has failed to start, because too much memory was requested. Please decrease the memory by adjusting EmccMaximumHeapSize. See also https://aka.ms/dotnet-wasm-features");throw e}))}const ft=new class{withModuleConfig(e){try{return Ee(We,e),this}catch(e){throw Xe(1,e),e}}withOnConfigLoaded(e){try{return Ee(We,{onConfigLoaded:e}),this}catch(e){throw Xe(1,e),e}}withConsoleForwarding(){try{return ve(ze,{forwardConsoleLogsToWS:!0}),this}catch(e){throw Xe(1,e),e}}withExitOnUnhandledError(){try{return ve(ze,{exitOnUnhandledError:!0}),Je(),this}catch(e){throw Xe(1,e),e}}withAsyncFlushOnExit(){try{return ve(ze,{asyncFlushOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withExitCodeLogging(){try{return ve(ze,{logExitCode:!0}),this}catch(e){throw Xe(1,e),e}}withElementOnExit(){try{return ve(ze,{appendElementOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withInteropCleanupOnExit(){try{return ve(ze,{interopCleanupOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withDumpThreadsOnNonZeroExit(){try{return ve(ze,{dumpThreadsOnNonZeroExit:!0}),this}catch(e){throw Xe(1,e),e}}withWaitingForDebugger(e){try{return ve(ze,{waitForDebugger:e}),this}catch(e){throw Xe(1,e),e}}withInterpreterPgo(e,t){try{return ve(ze,{interpreterPgo:e,interpreterPgoSaveDelay:t}),ze.runtimeOptions?ze.runtimeOptions.push("--interp-pgo-recording"):ze.runtimeOptions=["--interp-pgo-recording"],this}catch(e){throw Xe(1,e),e}}withConfig(e){try{return ve(ze,e),this}catch(e){throw Xe(1,e),e}}withConfigSrc(e){try{return e&&"string"==typeof e||Be(!1,"must be file path or URL"),Ee(We,{configSrc:e}),this}catch(e){throw Xe(1,e),e}}withVirtualWorkingDirectory(e){try{return e&&"string"==typeof e||Be(!1,"must be directory path"),ve(ze,{virtualWorkingDirectory:e}),this}catch(e){throw Xe(1,e),e}}withEnvironmentVariable(e,t){try{const o={};return o[e]=t,ve(ze,{environmentVariables:o}),this}catch(e){throw Xe(1,e),e}}withEnvironmentVariables(e){try{return e&&"object"==typeof e||Be(!1,"must be dictionary object"),ve(ze,{environmentVariables:e}),this}catch(e){throw Xe(1,e),e}}withDiagnosticTracing(e){try{return"boolean"!=typeof e&&Be(!1,"must be boolean"),ve(ze,{diagnosticTracing:e}),this}catch(e){throw Xe(1,e),e}}withDebugging(e){try{return null!=e&&"number"==typeof e||Be(!1,"must be number"),ve(ze,{debugLevel:e}),this}catch(e){throw Xe(1,e),e}}withApplicationArguments(...e){try{return e&&Array.isArray(e)||Be(!1,"must be array of strings"),ve(ze,{applicationArguments:e}),this}catch(e){throw Xe(1,e),e}}withRuntimeOptions(e){try{return e&&Array.isArray(e)||Be(!1,"must be array of strings"),ze.runtimeOptions?ze.runtimeOptions.push(...e):ze.runtimeOptions=e,this}catch(e){throw Xe(1,e),e}}withMainAssembly(e){try{return ve(ze,{mainAssemblyName:e}),this}catch(e){throw Xe(1,e),e}}withApplicationArgumentsFromQuery(){try{if(!globalThis.window)throw new Error("Missing window to the query parameters from");if(void 0===globalThis.URLSearchParams)throw new Error("URLSearchParams is supported");const e=new URLSearchParams(globalThis.window.location.search).getAll("arg");return this.withApplicationArguments(...e)}catch(e){throw Xe(1,e),e}}withApplicationEnvironment(e){try{return ve(ze,{applicationEnvironment:e}),this}catch(e){throw Xe(1,e),e}}withApplicationCulture(e){try{return ve(ze,{applicationCulture:e}),this}catch(e){throw Xe(1,e),e}}withResourceLoader(e){try{return Pe.loadBootResource=e,this}catch(e){throw Xe(1,e),e}}async download(){try{await async function(){lt(We),await Re(We),re(),D(),oe(),await Pe.allDownloadsFinished.promise}()}catch(e){throw Xe(1,e),e}}async create(){try{return this.instance||(this.instance=await async function(){return await ct(We),Fe.api}()),this.instance}catch(e){throw Xe(1,e),e}}async run(){try{return We.config||Be(!1,"Null moduleConfig.config"),this.instance||await this.create(),this.instance.runMainAndExit()}catch(e){throw Xe(1,e),e}}},mt=Xe,gt=ct;Ie||"function"==typeof globalThis.URL||Be(!1,"This browser/engine doesn't support URL API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"),"function"!=typeof globalThis.BigInt64Array&&Be(!1,"This browser/engine doesn't support BigInt64Array API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"),ft.withConfig(/*json-start*/{
  "mainAssemblyName": "SharpCast.Ui",
  "resources": {
    "hash": "sha256-hJ/NPKtqfgEg5chgjAKJr6nm12o5JFJdV+EG9GagO8k=",
    "jsModuleNative": [
      {
        "name": "dotnet.native.ykrnppwhq2.js"
      }
    ],
    "jsModuleRuntime": [
      {
        "name": "dotnet.runtime.peu2mfb29t.js"
      }
    ],
    "wasmNative": [
      {
        "name": "dotnet.native.53ez3dx5uy.wasm",
        "integrity": "sha256-Ebk+Km0uqtdo/srKe0YcuUOlFykCcKVkBt03gTWt0aU=",
        "cache": "force-cache"
      }
    ],
    "icu": [
      {
        "virtualPath": "icudt.dat",
        "name": "icudt.oh1zvcfom8.dat",
        "integrity": "sha256-tO5O5YzMTVSaKBboxAqezOQL9ewmupzV2JrB5Rkc8a4=",
        "cache": "force-cache"
      }
    ],
    "coreAssembly": [
      {
        "virtualPath": "System.Private.CoreLib.wasm",
        "name": "System.Private.CoreLib.w3f0hfnk8c.wasm",
        "integrity": "sha256-fAlzHDROV4U8OYuXMlakW3beR/aAbbLzmXpGFx/8q28=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.InteropServices.JavaScript.wasm",
        "name": "System.Runtime.InteropServices.JavaScript.bp9v1jxw1s.wasm",
        "integrity": "sha256-IeA7pB0f/o3eZVGm+sIm8RKPcsD69THNJym/etwOWYI=",
        "cache": "force-cache"
      }
    ],
    "assembly": [
      {
        "virtualPath": "BlazorMonaco.wasm",
        "name": "BlazorMonaco.98tzo6dc2v.wasm",
        "integrity": "sha256-R8FyBgovIXHO+Iv0CZyrVhS+T30U6xRRX4tNBwjDfI8=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Blazored.LocalStorage.wasm",
        "name": "Blazored.LocalStorage.12n6dz54qr.wasm",
        "integrity": "sha256-OaMAAd5n7ORfyur5e3QIyEVKJ76MKIvwbg7/icnnYcU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Humanizer.wasm",
        "name": "Humanizer.js5rjd66n3.wasm",
        "integrity": "sha256-7YJIoQSe7fPqXJ6ICleTpQrAuKxwRyoSyqhVbiUW9+M=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.AspNetCore.Components.Web.wasm",
        "name": "Microsoft.AspNetCore.Components.Web.xpgh9cff8o.wasm",
        "integrity": "sha256-G4gNBkGjp7bT7Aav1GHPEOubQuNUB/OqdX86rDZ/bO0=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.AspNetCore.Components.WebAssembly.wasm",
        "name": "Microsoft.AspNetCore.Components.WebAssembly.6mpsp4vhj9.wasm",
        "integrity": "sha256-UhZk300zoMXr0ZQaOsa3rNwCznOb1dbXJs/q7E6CMxc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.AspNetCore.Components.wasm",
        "name": "Microsoft.AspNetCore.Components.iyxo2qj65q.wasm",
        "integrity": "sha256-6lvaZbuK55E+KMlRMQFBZVCe25AKvD/qGr/1xyJ+rFA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.wasm",
        "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.10o91ncu97.wasm",
        "integrity": "sha256-wX7KPYkGUjdpHyGAQvuh3OJsYnSsudexZrxeEfarHJ8=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.CSharp.wasm",
        "name": "Microsoft.CodeAnalysis.CSharp.xv6xy9lxny.wasm",
        "integrity": "sha256-46hP9SEAmaXLp7Ar/9vf0x9LEH63B6hGIgBhKLJOGb0=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.wasm",
        "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.zd9cdazw7d.wasm",
        "integrity": "sha256-h3/yG2l7fNFrtl/gpHZjGaBNwrCRbX839AG8DbDyLHU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.wasm",
        "name": "Microsoft.CodeAnalysis.VisualBasic.yxbsu6nxle.wasm",
        "integrity": "sha256-dpFyLyB4vFA5LLk905FV9PVIxFvaASNH4zzMIMsW4ZY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.Workspaces.wasm",
        "name": "Microsoft.CodeAnalysis.Workspaces.c3fzy1zvro.wasm",
        "integrity": "sha256-2NJwarZQnQ6+Sw3A6emSucH+TVchBEmjHPALqIAvnwE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.wasm",
        "name": "Microsoft.CodeAnalysis.x2194rep5q.wasm",
        "integrity": "sha256-uV2wwX+2lH4AkcFaRVanAi+Zy21KnZnA2liYPLLJ8dA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Configuration.Abstractions.wasm",
        "name": "Microsoft.Extensions.Configuration.Abstractions.h3x7gkd3wi.wasm",
        "integrity": "sha256-TRP7en/tYrB0OHj3n5BVZ5BQH3VTIuLi7/i+WeKRXyM=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Configuration.Json.wasm",
        "name": "Microsoft.Extensions.Configuration.Json.awfv43uy1f.wasm",
        "integrity": "sha256-OjISDzBleMVRyG6rOCMR1WjrrnGHVnlAEGfRtLYXksQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Configuration.wasm",
        "name": "Microsoft.Extensions.Configuration.zdophn6obr.wasm",
        "integrity": "sha256-SetdHnoubSXEfLfgohBpm7QWFpANyybYdHUQHXJmcGQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.DependencyInjection.Abstractions.wasm",
        "name": "Microsoft.Extensions.DependencyInjection.Abstractions.ltbaej7kzp.wasm",
        "integrity": "sha256-WcT1vUeszrpfonLvfpXC0bXnQbZadmxa/BY7XvN0b3g=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.DependencyInjection.wasm",
        "name": "Microsoft.Extensions.DependencyInjection.v5oamk32cs.wasm",
        "integrity": "sha256-0+7FoXi8qX9UOWUcJEkpWmpCeA2BdjpaL4hJLqxr2ak=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Localization.Abstractions.wasm",
        "name": "Microsoft.Extensions.Localization.Abstractions.ngk880jlu2.wasm",
        "integrity": "sha256-l5FiJTw9fzFR1YoFxLmEfLL/66IV479Hp8pQu+r+3HA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Localization.wasm",
        "name": "Microsoft.Extensions.Localization.ywcwjpftt0.wasm",
        "integrity": "sha256-YjAEWNu9hHIkybrnQfBzzsesPRr7ew/FVVkpt0vMyjc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Logging.Abstractions.wasm",
        "name": "Microsoft.Extensions.Logging.Abstractions.8s9o2lar7c.wasm",
        "integrity": "sha256-eKKdYzMRJdijQtBkXR4FYOa9jwm5e/vPKa6VELEbFHc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Logging.wasm",
        "name": "Microsoft.Extensions.Logging.0wppuax7wd.wasm",
        "integrity": "sha256-sJqpG/RCGV21wJcp+Ca7vgs8N+Bnsy8prLw0oPmmV8Y=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Options.wasm",
        "name": "Microsoft.Extensions.Options.0iglx6m0j5.wasm",
        "integrity": "sha256-yD8Pd4Px7n1i/tM2ey8Pwl4ZU/22M7Ck8Tbpp188L94=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Primitives.wasm",
        "name": "Microsoft.Extensions.Primitives.sxwmyjz82q.wasm",
        "integrity": "sha256-wPHyXmdrduba3eHx418PJMQVjpA/rpfj5v5LIH2suHI=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.JSInterop.wasm",
        "name": "Microsoft.JSInterop.8me6rzk2u6.wasm",
        "integrity": "sha256-gLaMp4dEHaEhafi9/TC4da9I9nxqJ7EIzXybj/xtxRA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.JSInterop.WebAssembly.wasm",
        "name": "Microsoft.JSInterop.WebAssembly.jnpc95ilb1.wasm",
        "integrity": "sha256-IbbB/XtjYWT/H76RKR7XCkmdE5Vo4ubHSshoYiq9Od0=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "SharpCast.ModelConverter.wasm",
        "name": "SharpCast.ModelConverter.83hvlbwclo.wasm",
        "integrity": "sha256-vFZoHoGHCpmpjsX1EhYq1mdUd3kAHxJRHXHsg/MSyyE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "SharpCast.Ui.wasm",
        "name": "SharpCast.Ui.vrrs4ljmfl.wasm",
        "integrity": "sha256-myOVrZWQU/svi2eQmglW6pO5tnauE5SmVvriGkhu/7c=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.wasm",
        "name": "System.fv399lvvsg.wasm",
        "integrity": "sha256-20jVhUzIwd4iBa37tc3g3OaofHfBeJaMcRCVn9IZFoU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.wasm",
        "name": "System.Collections.9v11rrz21x.wasm",
        "integrity": "sha256-S0mLCfKldpr9aXtZ65fx9fEsKWN8Cz9q2H5dblfKX14=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.Concurrent.wasm",
        "name": "System.Collections.Concurrent.hjo99grjwa.wasm",
        "integrity": "sha256-fT01c+4ZvuQIm8ROS0CpN1VIY0mCR1r78E5oaZVwNTg=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.Immutable.wasm",
        "name": "System.Collections.Immutable.9yz78be8y0.wasm",
        "integrity": "sha256-waU+7kkedY5ORPCJ2g9mpp6ApGQmu0JDGQQfIURlNNg=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.NonGeneric.wasm",
        "name": "System.Collections.NonGeneric.g4t2yg8noh.wasm",
        "integrity": "sha256-8OGfas2+YrsBlEjMpjUhYRwAm5XIJLrjuVmeAdaKVGo=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.Specialized.wasm",
        "name": "System.Collections.Specialized.kf6oj3723y.wasm",
        "integrity": "sha256-cPoGP5uNuIzo6aOitQFRRpM8SvF52PXBEfY3RYF9F9M=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ComponentModel.Primitives.wasm",
        "name": "System.ComponentModel.Primitives.szw6964n3u.wasm",
        "integrity": "sha256-eJLFZ/9k8R2cFTYr2NBKdfefSOT5Hae+WGSbC2yo7dQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ComponentModel.TypeConverter.wasm",
        "name": "System.ComponentModel.TypeConverter.icrgoch27s.wasm",
        "integrity": "sha256-jrn5AHe05R/JXTjQKGZON8FamPt4REr8My5EKyAj4jA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ComponentModel.wasm",
        "name": "System.ComponentModel.87e9suq6nz.wasm",
        "integrity": "sha256-JKTTvsOJYGxxPrp0Bfo016Od0pGkQ4K42ix8qFy8X/k=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Composition.AttributedModel.wasm",
        "name": "System.Composition.AttributedModel.8rzqainyyq.wasm",
        "integrity": "sha256-fAb0jTGrDRb/Ly1IXvoEnYJfrz8MBye4zFjt02nMo2U=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Composition.Convention.wasm",
        "name": "System.Composition.Convention.jf1zeek5hf.wasm",
        "integrity": "sha256-AciZSrESYwC4KU2/d9UJqwTgDDmOQA5hpmg50sDqHac=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Composition.Hosting.wasm",
        "name": "System.Composition.Hosting.e34d2g66uz.wasm",
        "integrity": "sha256-+rdwoU5P89ph2WqlaceKN8T/2juughU2SDidAHby32w=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Composition.Runtime.wasm",
        "name": "System.Composition.Runtime.bsv1yrn43f.wasm",
        "integrity": "sha256-1YrFeJPimTz+LDr3jkZmn801FZ3MnrqSgipdwqTdIz8=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Composition.TypedParts.wasm",
        "name": "System.Composition.TypedParts.oz2ut0mn5s.wasm",
        "integrity": "sha256-pMd0NDsJG6d31aN31kU1bpOuZDEG7RaYleALWz38k98=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Console.wasm",
        "name": "System.Console.7nxrnigfqa.wasm",
        "integrity": "sha256-E6IpBSw+OqIkt6l7aG2gMOLuHGSvI33Pvh7N1jhZ1kU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.DiagnosticSource.wasm",
        "name": "System.Diagnostics.DiagnosticSource.dolp4tc98b.wasm",
        "integrity": "sha256-A66pErVQmWzd9L9TmmKXLfVxBNRQf5WfTKLfQCNLniY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.FileVersionInfo.wasm",
        "name": "System.Diagnostics.FileVersionInfo.o29zam22vo.wasm",
        "integrity": "sha256-UOWCiMpOAZ2PEFoxudDa4zy2q1EHej4cdG+azLyohLE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.Process.wasm",
        "name": "System.Diagnostics.Process.0bsrsaeub4.wasm",
        "integrity": "sha256-9NNK6G9KTumjiEUQTPlRXUL+WwPvsJsL9TkfBKcas7M=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.StackTrace.wasm",
        "name": "System.Diagnostics.StackTrace.tmsxcj6pf2.wasm",
        "integrity": "sha256-NWcbUv6RsaAkP6nz9/+Y86fmii8/8pVQMX5VgfnY0Hg=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.TraceSource.wasm",
        "name": "System.Diagnostics.TraceSource.uuem2z527n.wasm",
        "integrity": "sha256-So29X3X9cYOjo0S4eu57O9YQmIgdAfLirhgISjhl/F8=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.Tracing.wasm",
        "name": "System.Diagnostics.Tracing.4zjvmd9i0p.wasm",
        "integrity": "sha256-IE8/WZKpot3a+qnEY7pxZaULYEZvHG5/6oML459rybw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Globalization.wasm",
        "name": "System.Globalization.y4kztv4ncj.wasm",
        "integrity": "sha256-TpbZNiukHomcVxWmzaNtrOdkqQsHFAUU4HKaiY82cvs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.IO.Compression.wasm",
        "name": "System.IO.Compression.3pr4xextt0.wasm",
        "integrity": "sha256-N25BSANd7lpX5OjOmckTgrp+24VzbdDaWsARKMBiY9c=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.IO.MemoryMappedFiles.wasm",
        "name": "System.IO.MemoryMappedFiles.xgadhn55do.wasm",
        "integrity": "sha256-QXMBawlUMy4aldlJ3i/179EAD6T/tVPjLgphUDCpkRY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.IO.Pipelines.wasm",
        "name": "System.IO.Pipelines.bexphe70w4.wasm",
        "integrity": "sha256-U44Uv68MfAU2lmVwa8jxj42M2yX1ylEMxwNzlrq/gdM=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Linq.Expressions.wasm",
        "name": "System.Linq.Expressions.mjxa05vfqo.wasm",
        "integrity": "sha256-rlMQEzLI1oPK+suWW61PizsA3uqOBON0FrTmAlv04Fg=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Linq.wasm",
        "name": "System.Linq.e0y3ez5xa3.wasm",
        "integrity": "sha256-7pil8wp9ynIHYG64juDt8TitpwLj8U/7Q0Cr5MlR8/U=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Memory.wasm",
        "name": "System.Memory.7590tvrkyd.wasm",
        "integrity": "sha256-S/eqmqR9/FlFlibf1DUYKkYh45kTW0yQixJRcF3vHpk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.Http.wasm",
        "name": "System.Net.Http.7ixkiiq1jc.wasm",
        "integrity": "sha256-n6C0dgxjgDhPd+EahlTv7j9oBdLzN3YcuUcHLUlKXys=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.Primitives.wasm",
        "name": "System.Net.Primitives.5j5ae3dc60.wasm",
        "integrity": "sha256-gcSyjZCWlkUbsdHp/weRBWjtTl8KHsHa0LkHE9Xvnjw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ObjectModel.wasm",
        "name": "System.ObjectModel.g2y6xf58h6.wasm",
        "integrity": "sha256-+J5IhfhUJ5c+2mPpyIXrfJbZdTQOU/HvgVfOvZC6pxQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Private.Uri.wasm",
        "name": "System.Private.Uri.tyy8f6eki4.wasm",
        "integrity": "sha256-BYq4PfjtX25hxWXBI9nFgu8o+XnIKGsaOozvA36iKHo=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Private.Xml.Linq.wasm",
        "name": "System.Private.Xml.Linq.a3jfphs3e3.wasm",
        "integrity": "sha256-mtRkiNK0Opb2nYhCA4RziBR7C/dPolQl17+4C6+S3U4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Private.Xml.wasm",
        "name": "System.Private.Xml.l7xf5s8p8r.wasm",
        "integrity": "sha256-H9WpM1MeoajZIJlVcY5N1Ugh50b2Goe156DJOvNk+70=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Reflection.Metadata.wasm",
        "name": "System.Reflection.Metadata.wujlrlxnfw.wasm",
        "integrity": "sha256-OGll/fICjYHCpLndyR/jRNM81Ant4twB1jTdKMc+p+w=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Reflection.Primitives.wasm",
        "name": "System.Reflection.Primitives.lg453s6jhx.wasm",
        "integrity": "sha256-K2dHZVozWF20IBvCR0NaRvqyPeP218yL61JX80aatJw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.InteropServices.wasm",
        "name": "System.Runtime.InteropServices.vro54kczau.wasm",
        "integrity": "sha256-VR8XJT/x+sCMPYNmeQh+rxOWuabIFNUG6XmN6GPY1U4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.Intrinsics.wasm",
        "name": "System.Runtime.Intrinsics.48nw7txs5b.wasm",
        "integrity": "sha256-lEjgMGZLDZBv1+LeAuVFAqayqSBoKEv8vSceT0IcAmA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.Loader.wasm",
        "name": "System.Runtime.Loader.t2bqwgvh8q.wasm",
        "integrity": "sha256-lUr2qgvsSEpZP4AdF/NubYclESItkOTLrgT8Ibt5XTI=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.Numerics.wasm",
        "name": "System.Runtime.Numerics.tx4r2x2e3f.wasm",
        "integrity": "sha256-wVcKrQxHI5wDTIAKx/EMll7OX0gIREWpuIrc+MEslYQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.Serialization.Primitives.wasm",
        "name": "System.Runtime.Serialization.Primitives.nlpn0pkslg.wasm",
        "integrity": "sha256-WyXsPJwtu9Jv93wS9wzbnmAc82dxlxyq8dSKaLTmEeU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.wasm",
        "name": "System.Runtime.n8g0e8zgoo.wasm",
        "integrity": "sha256-yY9oD4Ix+QGdScalsLsyYHu/3wzje+o4fq6qpIkx25M=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Security.Cryptography.wasm",
        "name": "System.Security.Cryptography.8u6xrtnak2.wasm",
        "integrity": "sha256-4B8VU2weQOF91uRoIhAKXzoc6aejiJRFCJj5Jc2y8Uc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.Encoding.CodePages.wasm",
        "name": "System.Text.Encoding.CodePages.pnlq5exhgs.wasm",
        "integrity": "sha256-JV2b+dwBAuRshW9wHs6V+FPMptAVZHJalT+pfAUFvpc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.Encoding.Extensions.wasm",
        "name": "System.Text.Encoding.Extensions.ysqip37lrb.wasm",
        "integrity": "sha256-Mq0pBtZ4pdpV97xcnyLYA2SfVnO35wECsnUyu23LoFk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.Encodings.Web.wasm",
        "name": "System.Text.Encodings.Web.1t1de7t3v8.wasm",
        "integrity": "sha256-m9sWG1pLMOm4f+5mpsgucim0tRkahlvrglfEC0qQR78=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.Json.wasm",
        "name": "System.Text.Json.cl2flpv2vc.wasm",
        "integrity": "sha256-IJwy9qRHipPCu7VvPfR3d0BrVJsg0Eq7vcZnxcg6Scw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.RegularExpressions.wasm",
        "name": "System.Text.RegularExpressions.rab2qgcxkc.wasm",
        "integrity": "sha256-sz9lS2TbuI05OmZ4rnIyWju/QSp49GwgRyBaF/bbfqs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.wasm",
        "name": "System.Threading.62uv7ycvxv.wasm",
        "integrity": "sha256-7livzb3/R39lfqdxFcKx2DSEGamoM0VW6L6s4d7s0IY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.Channels.wasm",
        "name": "System.Threading.Channels.1in2omo5mi.wasm",
        "integrity": "sha256-edMhggfFdBlzs1S59wc4lKsc2R56z8H2z7bQy62lOfg=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.Tasks.Parallel.wasm",
        "name": "System.Threading.Tasks.Parallel.10t8eoymze.wasm",
        "integrity": "sha256-L+1uTKn5QSqR0beCidMhoU7p2bWi32girgQbmXwWMI4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.Thread.wasm",
        "name": "System.Threading.Thread.b4u0nmp5dj.wasm",
        "integrity": "sha256-e/ew4qoriUBe3yZU+L/oKaCmRksilRL6ZQZAeSF4Ss8=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.ThreadPool.wasm",
        "name": "System.Threading.ThreadPool.naei8upx4r.wasm",
        "integrity": "sha256-IdeHkd6JBmPt/y55Jpq6ByBgc1SZtm6IfbmhwM1pydE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.Linq.wasm",
        "name": "System.Xml.Linq.55sa1dphju.wasm",
        "integrity": "sha256-B45e+WTL2VicVkqRzonMAYf3a4yI96CpyM4IYzSqzNw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.ReaderWriter.wasm",
        "name": "System.Xml.ReaderWriter.w0gm8y204y.wasm",
        "integrity": "sha256-YBVfj7EtVRT0a0GoeTuW9MpCjkyRHDl64ow7pgZFnLw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.XDocument.wasm",
        "name": "System.Xml.XDocument.t2jyze2pix.wasm",
        "integrity": "sha256-FfD2rhF69Nc9SkdL/FP1GquU5u60FJU3Uj2Aq6T8oco=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.XPath.wasm",
        "name": "System.Xml.XPath.tnldcgix7y.wasm",
        "integrity": "sha256-FyUkz0PtJXj2gsG9eAteyUK2hy6U0Tmt3sSDnYHifRM=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.XPath.XDocument.wasm",
        "name": "System.Xml.XPath.XDocument.f8vb9rj2r0.wasm",
        "integrity": "sha256-3xekAeNuzDMskNJ/a39c4PHq5Iy/gyfhSnwnfzuGqeg=",
        "cache": "force-cache"
      }
    ],
    "satelliteResources": {
      "af": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.jdn6yrzxh5.wasm",
          "integrity": "sha256-19nFhBPfHHZ8q2TJTT+DOEYzEfxw+vKE3lBCYENIIqU=",
          "cache": "force-cache"
        }
      ],
      "ar": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.m2q15mljuk.wasm",
          "integrity": "sha256-wnjLOLXKD0GkkaVb5r2rkOGUbzpv8rYkS8T6+KjZmuA=",
          "cache": "force-cache"
        }
      ],
      "az": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.lib4nykf0w.wasm",
          "integrity": "sha256-s63SdYtKHd+HfezcXE2sJfq2EQA+GtGxzip1MQhKKDg=",
          "cache": "force-cache"
        }
      ],
      "bg": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.mrgi6ndaz0.wasm",
          "integrity": "sha256-YvfQv6vVtEk8zaw2okfMjbKDanbEFaoG6FIB2HAad/M=",
          "cache": "force-cache"
        }
      ],
      "bn": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.2y30d6xbja.wasm",
          "integrity": "sha256-+ug1yCy38UUUGqGAe8uagIJ+9bqg/kGHoSOCkJheRa8=",
          "cache": "force-cache"
        }
      ],
      "ca": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.1klb6banz5.wasm",
          "integrity": "sha256-H4zjEOnmJjfmJNYJdXNf8ZU/Du6ozo2h7DEh72MgIKw=",
          "cache": "force-cache"
        }
      ],
      "cs": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.c6tpks8an8.wasm",
          "integrity": "sha256-9ONKpZP4Czl7TcykTkroNkDqe/6+E0/iBXSjw/iSAWw=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.hsewbfk94b.wasm",
          "integrity": "sha256-H+aR00P9xR7aMjAxN/USOTN4DddbK8qIRxuqx/wGYf4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.rpasp4ofwi.wasm",
          "integrity": "sha256-wVFZb5F66mGW8s0kAzaYf2ipUTp10/gnov3lFEc6nWs=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.81xfe5v8k4.wasm",
          "integrity": "sha256-BLlPCGUMRpKc01I9GAHlrsF6TD0kjcXcNv2lqIIiqio=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.a32ljndpjh.wasm",
          "integrity": "sha256-KkMWvcJDtfS/EknV+F2z3Ajx/Yfi+0KjvipBatmLYHc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.mp1ia8xdpm.wasm",
          "integrity": "sha256-1mwSgBJP5CWO98P7R/J+TZg8FawAKW6K+KoZh791YXo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.g0aiozlzit.wasm",
          "integrity": "sha256-MJetx8mkLp5GnMRO6UKQWemsfYhf+kFtpW7okeRQDRQ=",
          "cache": "force-cache"
        }
      ],
      "da": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.0mc54hsf3q.wasm",
          "integrity": "sha256-GLeFLupweXQVOAZR9pputiS069y84oCIYobPgdJBnUU=",
          "cache": "force-cache"
        }
      ],
      "de": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.604odd4mwd.wasm",
          "integrity": "sha256-upStYK6VuEy3Ss1plOexw48vLkczGFgFmrLzcnQOG3U=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.vxxv59btmg.wasm",
          "integrity": "sha256-k5aPgszpJdEOvrtKCWfO8JWT+f1IuHu228QL00lNzzM=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.6m3vjowy3e.wasm",
          "integrity": "sha256-Dvd9ZLuH/JZHMk7OjvxukvOLUAUz/zTLYI6k3tkMjd4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.pxd88938t1.wasm",
          "integrity": "sha256-cwtdv0daAciSEbII/WniRsumK+N88tSz5Q66m/ytJzc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.zuhbvqq2qx.wasm",
          "integrity": "sha256-K3aZxp3dSMUZy6gEycl3inWIPd8a6ocTRrNETr/3Yz8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.24extqq8fz.wasm",
          "integrity": "sha256-TrXH4yFpvladrlpQ8NnARyisJvsm7CILOmVim5KeCEM=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.kjobto9k4a.wasm",
          "integrity": "sha256-AH6v4mqfZ3t5m6Eiu1sP/W5uyqYZbYE3oS9PciDNviQ=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.3u777bybon.wasm",
          "integrity": "sha256-a3YuDUuAu7J+gzdpDO8H5UyRpf7ff9zmRt4tkwo5b0U=",
          "cache": "force-cache"
        }
      ],
      "el": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.ufcydoiley.wasm",
          "integrity": "sha256-hp/qv7cfaGXTXgvAsFReeVkK6DmUgu5ZkC78OA1Rw1g=",
          "cache": "force-cache"
        }
      ],
      "en": [
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.y1hhor6hrq.wasm",
          "integrity": "sha256-aovdKTPYBqDdiqok+68KbxPkuIibEIv9uxET1hEa82o=",
          "cache": "force-cache"
        }
      ],
      "es": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.k59f81z5ni.wasm",
          "integrity": "sha256-GPiXTe4uBJEOBI35Q+y5+Z9rYEfkG4iM+1R7ppa4AgE=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.v8zjlwtxey.wasm",
          "integrity": "sha256-L/69E/EclEMf9S7bafnSgYekwnBVLnv7vFaXEbGicVc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.sq38xjbnec.wasm",
          "integrity": "sha256-DN7W0NqXUgnhL+KipbRVLNRt91OiPmLfwXMs9wHO1BA=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.3bg78grpp2.wasm",
          "integrity": "sha256-T4Z4+PO1ATZZJpw3OjtMfzzuLk2l4BpzFugIng+DTSA=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.2d7h94ubjp.wasm",
          "integrity": "sha256-hhjF5pDPPg5SMhj9NFFtindiC86cH+3qcitWKSod+Sg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.z0tr5j29bp.wasm",
          "integrity": "sha256-s3xLLBshtDduF7qV99yatuKEFR4p3jXX4xJtxtNTGzA=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.9myde676ua.wasm",
          "integrity": "sha256-f3m6U69548/Odno7ikZuS8mk94YhwgAUNbIBWErdsS4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.173urm2fmt.wasm",
          "integrity": "sha256-U6HeWSHS3j+0vK+qBBdV/BIFsLaTxr33joyMqnthdT8=",
          "cache": "force-cache"
        }
      ],
      "fa": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.5e6c4i16bo.wasm",
          "integrity": "sha256-o7jxjqEef1DU+bNIGFOnLl6aSyZOCZOSGk5UvzAYoxE=",
          "cache": "force-cache"
        }
      ],
      "fi": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.mepg9tcpvo.wasm",
          "integrity": "sha256-niHPMJgPwRUFS78saQe2hi9JSErgWMJuR5C0d11T9N4=",
          "cache": "force-cache"
        }
      ],
      "fil": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.7e19hggyb7.wasm",
          "integrity": "sha256-sR//gDKaZNnQJjz6OSeWOs/RWlKxlBjo4GhLCi4ReUQ=",
          "cache": "force-cache"
        }
      ],
      "fr": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.xkld73c32p.wasm",
          "integrity": "sha256-gYGi3mhqtbwbW1hCOazFBj0sLKMGzSWEvSX4FJRRESI=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.65v1goonzi.wasm",
          "integrity": "sha256-6gM3pJJsbXQcTAAxFI8EppwZjHPd9m73MuvfaK73LjU=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.230dwxaqre.wasm",
          "integrity": "sha256-rqWY4OmAzBBBn0bC971hecc5BvI8YbkaG8CTmChAbBc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.v2rvrlx9lu.wasm",
          "integrity": "sha256-11moL1kbFWtgSeBAgTKpGQtLZw4ZgP7tjeMc+O4JANY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.78q6nlq5vf.wasm",
          "integrity": "sha256-uWoUPD3upNyhHYGkvbSHo1AsPhddvAbTyclPtJH70bs=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.vc8axwnisk.wasm",
          "integrity": "sha256-z3ngaKEr0UEl/0qLyhFbMpmr+9js7C61VFfvauYIJII=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.pr0p85emfr.wasm",
          "integrity": "sha256-JWzb/iB+OUckL2IM2o+1HeCSCE+kSiG8TXUk64QV61c=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.v3py6egw3m.wasm",
          "integrity": "sha256-m3FLMP/j5OIhIDQpYPhFTMYjUjaaNT87GNXyHtvlgV4=",
          "cache": "force-cache"
        }
      ],
      "he": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.ifsqwknkt6.wasm",
          "integrity": "sha256-ko2nMyNvibCT5o/i6nXt82GMnUpixpl6d3cvy426x9g=",
          "cache": "force-cache"
        }
      ],
      "hr": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.79hbyyyap5.wasm",
          "integrity": "sha256-G/akfl1X/GB9Mb8i2BZnfD08kij59xQCmXLumknmByg=",
          "cache": "force-cache"
        }
      ],
      "hu": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.7xaixct9el.wasm",
          "integrity": "sha256-NXfueIkeEPC7fzoRK6R6ExQRdreyKCLtXT5PsZctFPA=",
          "cache": "force-cache"
        }
      ],
      "hy": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.7a9l838cmp.wasm",
          "integrity": "sha256-P5Zpggf/xI57TXFVFjkXYUob5m0CDKfR9NzdqJB+Mpc=",
          "cache": "force-cache"
        }
      ],
      "id": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.0u1xmyvx8i.wasm",
          "integrity": "sha256-iFXOuoV6Gjp306xvZErmvV7Nvs7sHlibubQ5Aq25Acs=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.8hu8qpoe8h.wasm",
          "integrity": "sha256-TKonSujLlv4Ko91wPy2SgEOkdZq9OPEqki46/SW8FYQ=",
          "cache": "force-cache"
        }
      ],
      "is": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.qd8nyryyy8.wasm",
          "integrity": "sha256-Lti9XwVicL80hDSn7vS68If3WSyDXxLpzuCGUPaTNDY=",
          "cache": "force-cache"
        }
      ],
      "it": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.ao88to7rf0.wasm",
          "integrity": "sha256-6qoFkb+Lagk3dDD5fdo16j8czanZIt1xysPJNAEcy10=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.tcz86aqdii.wasm",
          "integrity": "sha256-A41qCZRWvtTEAWWJY0TAozUhb9O9c6eM07/kykyhqj8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.uxbczdi1bv.wasm",
          "integrity": "sha256-cn7IW62cH4Z/BpJYSLQSUaqHiu7mBjdiK5zPaXZyZIc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.jhbtgzzziv.wasm",
          "integrity": "sha256-Z0uDjmh23KIIuTyzjOnC+BbJfyCiBH4UZMU7hjYxCZY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.qnm9gdz2wm.wasm",
          "integrity": "sha256-ChEhMQdQfPL0qPqVJ1o8zKYQYGP/FxQeCGmmBNK0CJQ=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.899fbrzu3n.wasm",
          "integrity": "sha256-nMN9qgAnVf04HILGK6fBVoNyy/wLcz8qOHDsJa0ZHdg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.vtwmm8455h.wasm",
          "integrity": "sha256-TTpaZ9dPic3j6iIobZ4XQDA2iy1P3nxysWWyI6v6YFA=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.25uc8h88k2.wasm",
          "integrity": "sha256-lo8hC55KdOUh8MWvDt7AMAzDH0Tw0/0ETXNkMNVlCwY=",
          "cache": "force-cache"
        }
      ],
      "ja": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.ljilqzpin6.wasm",
          "integrity": "sha256-ISfmPOPRgmhy5g9SqCIOb/R6jWSDRArDGOHSlekxXq8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.mqrsi4g6hm.wasm",
          "integrity": "sha256-bt27nZuOph9K0qsUQwyAm/vZtkyzY8vI8WfZmyE76GU=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.qi58amcgrv.wasm",
          "integrity": "sha256-8u8PIEnqWXsmRGAyDyDdtt1xjyPcLR2DhopxAmJHv+Q=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.0lf7z3b9bk.wasm",
          "integrity": "sha256-XNYYFXYxTxbeJZ86CxD+H9Ont8R6zcTbOmnlbo2jL2A=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.cvuuxlgdc4.wasm",
          "integrity": "sha256-yGyZByQnInkrQyQh8Hu5KiL60k0r2ROudTZMsQAV9YI=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.rumwupeapv.wasm",
          "integrity": "sha256-s30IS4DjEK5YpquhNDqfY0gSbWva3iOqlPVIpwYWEPU=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.mu033zkdqi.wasm",
          "integrity": "sha256-DvarVg3ioz1ZRnZSorLVm5iR5+aXJdDhWEPo9zwfYpU=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.rfn6blvk63.wasm",
          "integrity": "sha256-2fTPPMZlXnqfdSs6dTaeffWiglum33N7wWgm4/gMTD8=",
          "cache": "force-cache"
        }
      ],
      "ko": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.xi8qttippi.wasm",
          "integrity": "sha256-VyHdsZ/qvSbz7oPodZOqnt0AafVfKrL+ZfoJ4v7vIC4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.w667i45er1.wasm",
          "integrity": "sha256-6DJxtJpx2fT0II5B1BSU8Fq3VFxri+Tsga47qcmgfD0=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.yukpxea6p1.wasm",
          "integrity": "sha256-2g5Osjjknj11C6kgOjNmpnZzuzJH0P1K/rDj7EKPO/w=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.6013b9390i.wasm",
          "integrity": "sha256-Krk+0bEgdFW52V+f8Vwpg8f/+ycCUHNtxutn4rwFg5E=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.4jzmmqgjhc.wasm",
          "integrity": "sha256-YJupqf2zV1NP1PIn59NmjW6155+gpvDW69aPd6mr6IM=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.lrrk785pkt.wasm",
          "integrity": "sha256-keDOqfs6wWIJH28y6LdSFXp5SbRSWhMjCgREwHORNk4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.1i598sn7wp.wasm",
          "integrity": "sha256-51NQ6dgKCgv1tdTP1rnpKNlNfYxTm3VGpGH3d/KL2eQ=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.xk8p4o5su4.wasm",
          "integrity": "sha256-T9TvVd/CAjCb4dlpwJzMLbbQQjGu+l1EQK1pUbBtpx4=",
          "cache": "force-cache"
        }
      ],
      "ku": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.rlhy18aq1d.wasm",
          "integrity": "sha256-n25FzL3DiK9KQeh3QdxjBjVCcyy8B0w8xoPNokSK88o=",
          "cache": "force-cache"
        }
      ],
      "lb": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.l93eyypep6.wasm",
          "integrity": "sha256-CUJcgzDb3vNcG8okWiiD0vMo0Jjld3Ze8HoisItQEk0=",
          "cache": "force-cache"
        }
      ],
      "lt": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.pixmtgky9p.wasm",
          "integrity": "sha256-MZAAQavd7L0/NMfzo9H4KMc0Ox+98QiBUOyqm8pHTHg=",
          "cache": "force-cache"
        }
      ],
      "lv": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.4cf66el357.wasm",
          "integrity": "sha256-JGG7xk53lYochMhP9aFpzO86q3KGhRD6mPSYdO3UWpA=",
          "cache": "force-cache"
        }
      ],
      "ms": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.1vyxw0l4i9.wasm",
          "integrity": "sha256-Q2H47JdHdAmLY7xA12/2ovKmvflDTZZS+lCQ/Lkv9GI=",
          "cache": "force-cache"
        }
      ],
      "mt": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.c3914s2kux.wasm",
          "integrity": "sha256-SHguSReE76sGRlDosgWydmNxR+gcCH7/EDfHeKYuNkY=",
          "cache": "force-cache"
        }
      ],
      "nb": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.tnv7qd54or.wasm",
          "integrity": "sha256-CZoSy5rQiTYKR3lnTdkEHFEwAr7eTm364PuJYrdhNUo=",
          "cache": "force-cache"
        }
      ],
      "nl": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.1m0adf1oi2.wasm",
          "integrity": "sha256-ZwUdyyalTFXZDMmIfTLWzcXTREzwwnQTxfk29CSLB44=",
          "cache": "force-cache"
        }
      ],
      "pl": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.g594rjfh9o.wasm",
          "integrity": "sha256-VF7epIe87z9jPgXCoZmgqHN3CTPwptvqCC/MfbwEltM=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.jyke2x3mr9.wasm",
          "integrity": "sha256-ZYjdk9iHEzPki7kysrzh6F749QTV+UOBW/wyqHHhBPw=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.2850hrip2t.wasm",
          "integrity": "sha256-jogz17upY8LApZrAVgo40nVzMOt/QzIOMK3ZGDMDPvk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.pkkl37h0b7.wasm",
          "integrity": "sha256-acrNHyizPo0grnN1A2IsojZhMFw1e6aAmySEWRFgS3w=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.coi5rkddta.wasm",
          "integrity": "sha256-NDeB0vnTnFKTGixAVnHw+avVt3npQpiwJiJZ/i7fL8k=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.h21zj2gxsn.wasm",
          "integrity": "sha256-15Sr5c1teqveR+6/EY9F3SL6tPPYaGcan08HUbS8v08=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.3vzmth5zeu.wasm",
          "integrity": "sha256-8W+fPvkUYoGfdeVgS10UmU5Uhd/fgoOKZTMzj3Wv/fM=",
          "cache": "force-cache"
        }
      ],
      "pt-BR": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.uyfu5odncn.wasm",
          "integrity": "sha256-qj5X6h5kbS+JExp6KXZcRWCoGIb8eEZP2tswYbiSL6M=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.xnxms5r6dp.wasm",
          "integrity": "sha256-7VOwlnciaRkKBzFZYFnuEfTV+8zLWXv3rp4XGrqlv/A=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.mtq0wfb2wo.wasm",
          "integrity": "sha256-ynOG/4oYq8l+erF+fm0Zp2pSQNObN48s8Fa88sy7p7I=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.h2xikf0kso.wasm",
          "integrity": "sha256-F1ipTNmalODxFbuOaf2kBM8SvNJOIvM9MWmTEsHlywg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.u64dqwxru7.wasm",
          "integrity": "sha256-dgBEbqRXunln7floDH3mYnSaitSDu9AUNCea43nH9Ks=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.jyppyzu9iz.wasm",
          "integrity": "sha256-qz1Qw2aSkl8B0xMPI9/KNYM8w5XTDaHo7lER2luuQhc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.3oqan5zvqu.wasm",
          "integrity": "sha256-fb/aJqQI8NjEurD+h8gGpNnYPRQ0hfEUDNSQQCd/L+8=",
          "cache": "force-cache"
        }
      ],
      "pt": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.dw4kbd51rr.wasm",
          "integrity": "sha256-M9sccPq3ilfPy7yvr8pELdEYty3NaEAwRkWuiZumA9E=",
          "cache": "force-cache"
        }
      ],
      "ro": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.xa07t5n9o5.wasm",
          "integrity": "sha256-SR44di54E348X+nZ3RpNNXZKfg4+OMRryZntj62GF+E=",
          "cache": "force-cache"
        }
      ],
      "ru": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.wdj6gugi5f.wasm",
          "integrity": "sha256-pG/wv+hFOk5HjdU1DpP7OwqitNnEabYpdXaeMjN/zIo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.91w4076acj.wasm",
          "integrity": "sha256-LdeObvUJ9KA8d4W1qXJl615BKuPQsezaj2BfiVP4hZk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.jogtuy4qo6.wasm",
          "integrity": "sha256-s19+gtgKKS43fSO/pp+bpOQQJofHpQ8dLqdYY63YRew=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.x3vlsm8e6u.wasm",
          "integrity": "sha256-vUQFMW6GxSEimy0tS9AbG81jGjddAEld03l7JEa+hkY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.ao6mnylmh5.wasm",
          "integrity": "sha256-Stqhdxtk9ysjQIIQ5NDNeqtKCAzdhkumhpU9vlNLfZI=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.l813aq67pl.wasm",
          "integrity": "sha256-+8TNF/+Y7eqVTkV6zpfALnnHY/TQCBwqD1/Y/5hXsGQ=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.9g7x66w7em.wasm",
          "integrity": "sha256-B/7inj38HVz42r4DOupQhFrTdVdotts+m+N44EEodfg=",
          "cache": "force-cache"
        }
      ],
      "sk": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.9x28gy37kc.wasm",
          "integrity": "sha256-M3cRUYxxjBuoQdvAKiRy960HrHYlLTr3S4xXC+wJwpU=",
          "cache": "force-cache"
        }
      ],
      "sl": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.e7md3wiry0.wasm",
          "integrity": "sha256-VgvTtYI1xHO03SRKw15y/KcjbfYiALd2CeJ30j5u5DE=",
          "cache": "force-cache"
        }
      ],
      "sr-Latn": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.isqpt7qr6i.wasm",
          "integrity": "sha256-4myaT3WO6nE82daRVAX+/Ax6EhCKba4xfcWjTguEnCA=",
          "cache": "force-cache"
        }
      ],
      "sr": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.cjpkl1pv6g.wasm",
          "integrity": "sha256-SOfLAfV7TRk9njdTUM85wg9Ea5AgfYsyXwR0P90bZH0=",
          "cache": "force-cache"
        }
      ],
      "sv": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.f1krlsurya.wasm",
          "integrity": "sha256-M2OWg3Aqhl0f1wXwfnh6R1zTEqbWT1hjlH05VeK5puM=",
          "cache": "force-cache"
        }
      ],
      "th": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.zvqrnu3tc9.wasm",
          "integrity": "sha256-39/a7nP0xsVlxovvLN7X62PA/TkWqQPaHHBOfJL/F60=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.57ilp09nuo.wasm",
          "integrity": "sha256-YVh9rPtDFupQUG8Q/bF9yDRheeNoUSyUtPS5vZK8qfw=",
          "cache": "force-cache"
        }
      ],
      "tl": [
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.jlzy3c9m11.wasm",
          "integrity": "sha256-t4srZ8+Y0EhSx9GhX8opJLlNaWzIgzSyz/gtBzUquvQ=",
          "cache": "force-cache"
        }
      ],
      "tr": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.5d7au0kulq.wasm",
          "integrity": "sha256-yeFtvpZsNRdBbQOxTG2ka3TSBG6dMZB5fpXhGIj53CU=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.0fl422du6f.wasm",
          "integrity": "sha256-lOByBypYrBnt9PBusgdTHZxsv72Rq1KpOUcDtAzSh7Y=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.ghmzlzuqu6.wasm",
          "integrity": "sha256-lF2UXJZnZZNL7pvvyQtyTCpWKPErjS3sAe7y9rxSPY0=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.aaxpa604q3.wasm",
          "integrity": "sha256-wpYxeqd9eLIwSN8o6XBbfsmqTvPOUfSq6JrM+0z0ajM=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.5ls5d3i284.wasm",
          "integrity": "sha256-ByeLxuhIU/q5LRyemc0+bfZAActG2KeYAP6fhWquvrM=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.4kji20qe02.wasm",
          "integrity": "sha256-fGpIbnURfTzZgK4DK7EtQugTfYAWYc8fRxnRTN1TqCo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.balvu325ig.wasm",
          "integrity": "sha256-g6fO0gN2HuYsW1VxgT3ayEGKmhnjWb3ZRxNpMvftdEA=",
          "cache": "force-cache"
        }
      ],
      "uk": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.tkorifj7mt.wasm",
          "integrity": "sha256-02xTIJd0VS31a2sr9a8wrrop83z9NMNY/zSuGVxJx1E=",
          "cache": "force-cache"
        }
      ],
      "uz-Cyrl-UZ": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.a4bspw263u.wasm",
          "integrity": "sha256-tv+3utRUf4mDuKv8cchUzw3gNs3u31KLMDKVjsJAcAk=",
          "cache": "force-cache"
        }
      ],
      "uz-Latn-UZ": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.lij0v80ewo.wasm",
          "integrity": "sha256-zYE3H5yNbsggkUemc8JhF7+T8jPCwTmJeJkq2jEskWA=",
          "cache": "force-cache"
        }
      ],
      "vi": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.6y6hi0l8mu.wasm",
          "integrity": "sha256-kiBK+xb0SkCc9ZQXtFbnqPus6n7auLhxdeT51vbtu5U=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.af4nh7no0r.wasm",
          "integrity": "sha256-JhMbltl26eEYivptXoMo6tOcYyrdc0Kpnu5z7X5gDG4=",
          "cache": "force-cache"
        }
      ],
      "zh-CN": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.qs9uwihv5z.wasm",
          "integrity": "sha256-5vp7CFKZAFSGQFNtLp5G6jW7GwJRswR66RNZgdz/E7Q=",
          "cache": "force-cache"
        }
      ],
      "zh-Hans": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.gljyib8evy.wasm",
          "integrity": "sha256-TAped9//SkL37GmFTKmBUZK/hiLfeBkq0HgXFiSHTfk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.gz271w5ore.wasm",
          "integrity": "sha256-3Hs3sB8QVwdmnygfdNdfeKfszF7Nxxpvnfb8W18yygo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.lk1w1c7fx4.wasm",
          "integrity": "sha256-C6//DFRPKgz2+Nvk9459ExzItMPjU8HD0r0eIbCUmV8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.6uk48mwfmt.wasm",
          "integrity": "sha256-fiKcS6PZzZEQ9tLseDQnYyamXA95hsQHTY8oFkeaLWY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.l28v9gh64c.wasm",
          "integrity": "sha256-Y0xv1sxQcJ21/bgLLgqgjHszoLiTHNUD2uOupwJ8EgE=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.xhtu1237hh.wasm",
          "integrity": "sha256-KzYFmFxGltKkasPIccZRJ1hNgT4NLnTN2x0MlXqVoLk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.rlu4g7dcqt.wasm",
          "integrity": "sha256-ETBr46IZRMj+2tNs8gr2E0hLfDpakRTOMJ7/+FLfs+E=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.r5kb8b85rb.wasm",
          "integrity": "sha256-MfF+f0cGU+XXV+d0uhOPDAVPRmky7H6L6GAZ5I+dOsw=",
          "cache": "force-cache"
        }
      ],
      "zh-Hant": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.99c9jzyifr.wasm",
          "integrity": "sha256-s1rynTDQArjoswop0z179XN8VtZaMHYEUlGVMCBfatU=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.3nns6w5rk9.wasm",
          "integrity": "sha256-UUNpcQMCok6z4XgTHRuP0BsmZRdPRcpH/GNC58nMT1w=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.kpbt63jybg.wasm",
          "integrity": "sha256-eL1TwPeiHI2voq2KJ4zJ2FBEPoA6+NpwZ39cdNY7xKA=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.jic4h9fcq1.wasm",
          "integrity": "sha256-W30BMrzNbR4G0lTQD/HwtzbskLhJpNU+dplSpDFD+zI=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.9fdjsi0xk8.wasm",
          "integrity": "sha256-S9GKWmYyGWXneo19uaGBu4ZwUzgqMMiYxhJoyxN8b8Q=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.puibxh8qp0.wasm",
          "integrity": "sha256-MdluAOmuKOc57MhIMgi32nB16Dx7Q6Tqt/UiVIqIJN4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.4bc7409yr9.wasm",
          "integrity": "sha256-8DEJNRQ/nVyviJOVoJxkG3CNFuqhRity7XNmkTEE/Ag=",
          "cache": "force-cache"
        }
      ]
    }
  },
  "debugLevel": 0,
  "linkerEnabled": true,
  "globalizationMode": "all",
  "extensions": {
    "blazor": {}
  },
  "runtimeConfig": {
    "runtimeOptions": {
      "configProperties": {
        "Microsoft.AspNetCore.Components.Routing.RegexConstraintSupport": false,
        "Microsoft.Extensions.DependencyInjection.VerifyOpenGenericServiceTrimmability": true,
        "System.ComponentModel.DefaultValueAttribute.IsSupported": false,
        "System.ComponentModel.Design.IDesignerHost.IsSupported": false,
        "System.ComponentModel.TypeConverter.EnableUnsafeBinaryFormatterInDesigntimeLicenseContextSerialization": false,
        "System.ComponentModel.TypeDescriptor.IsComObjectDescriptorSupported": false,
        "System.Data.DataSet.XmlSerializationIsSupported": false,
        "System.Diagnostics.Debugger.IsSupported": false,
        "System.Diagnostics.Metrics.Meter.IsSupported": false,
        "System.Diagnostics.Tracing.EventSource.IsSupported": false,
        "System.GC.Server": true,
        "System.Globalization.Invariant": false,
        "System.TimeZoneInfo.Invariant": false,
        "System.Linq.Enumerable.IsSizeOptimized": true,
        "System.Net.Http.EnableActivityPropagation": false,
        "System.Net.Http.WasmEnableStreamingResponse": true,
        "System.Net.SocketsHttpHandler.Http3Support": false,
        "System.Reflection.Metadata.MetadataUpdater.IsSupported": false,
        "System.Resources.ResourceManager.AllowCustomResourceTypes": false,
        "System.Resources.UseSystemResourceKeys": true,
        "System.Runtime.CompilerServices.RuntimeFeature.IsDynamicCodeSupported": true,
        "System.Runtime.InteropServices.BuiltInComInterop.IsSupported": false,
        "System.Runtime.InteropServices.EnableConsumingManagedCodeFromNativeHosting": false,
        "System.Runtime.InteropServices.EnableCppCLIHostActivation": false,
        "System.Runtime.InteropServices.Marshalling.EnableGeneratedComInterfaceComImportInterop": false,
        "System.Runtime.Serialization.EnableUnsafeBinaryFormatterSerialization": false,
        "System.StartupHookProvider.IsSupported": false,
        "System.Text.Encoding.EnableUnsafeUTF7Encoding": false,
        "System.Text.Json.JsonSerializer.IsReflectionEnabledByDefault": true,
        "System.Threading.Thread.EnableAutoreleasePool": false,
        "Microsoft.AspNetCore.Components.Endpoints.NavigationManager.DisableThrowNavigationException": false
      }
    }
  }
}/*json-end*/);export{gt as default,ft as dotnet,mt as exit};
