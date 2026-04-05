//! Licensed to the .NET Foundation under one or more agreements.
//! The .NET Foundation licenses this file to you under the MIT license.

var e=!1;const t=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,8,1,6,0,6,64,25,11,11])),o=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,15,1,13,0,65,1,253,15,65,2,253,15,253,128,2,11])),n=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11])),r=Symbol.for("wasm promise_control");function i(e,t){let o=null;const n=new Promise((function(n,r){o={isDone:!1,promise:null,resolve:t=>{o.isDone||(o.isDone=!0,n(t),e&&e())},reject:e=>{o.isDone||(o.isDone=!0,r(e),t&&t())}}}));o.promise=n;const i=n;return i[r]=o,{promise:i,promise_control:o}}function s(e){return e[r]}function a(e){e&&function(e){return void 0!==e[r]}(e)||Be(!1,"Promise is not controllable")}const l="__mono_message__",c=["debug","log","trace","warn","info","error"],d="MONO_WASM: ";let u,f,m,g,p,h;function w(e){g=e}function b(e){if(Pe.diagnosticTracing){const t="function"==typeof e?e():e;console.debug(d+t)}}function y(e,...t){console.info(d+e,...t)}function v(e,...t){console.info(e,...t)}function E(e,...t){console.warn(d+e,...t)}function _(e,...t){if(t&&t.length>0&&t[0]&&"object"==typeof t[0]){if(t[0].silent)return;if(t[0].toString)return void console.error(d+e,t[0].toString())}console.error(d+e,...t)}function x(e,t,o){return function(...n){try{let r=n[0];if(void 0===r)r="undefined";else if(null===r)r="null";else if("function"==typeof r)r=r.toString();else if("string"!=typeof r)try{r=JSON.stringify(r)}catch(e){r=r.toString()}t(o?JSON.stringify({method:e,payload:r,arguments:n.slice(1)}):[e+r,...n.slice(1)])}catch(e){m.error(`proxyConsole failed: ${e}`)}}}function j(e,t,o){f=t,g=e,m={...t};const n=`${o}/console`.replace("https://","wss://").replace("http://","ws://");u=new WebSocket(n),u.addEventListener("error",A),u.addEventListener("close",S),function(){for(const e of c)f[e]=x(`console.${e}`,T,!0)}()}function R(e){let t=30;const o=()=>{u?0==u.bufferedAmount||0==t?(e&&v(e),function(){for(const e of c)f[e]=x(`console.${e}`,m.log,!1)}(),u.removeEventListener("error",A),u.removeEventListener("close",S),u.close(1e3,e),u=void 0):(t--,globalThis.setTimeout(o,100)):e&&m&&m.log(e)};o()}function T(e){u&&u.readyState===WebSocket.OPEN?u.send(e):m.log(e)}function A(e){m.error(`[${g}] proxy console websocket error: ${e}`,e)}function S(e){m.debug(`[${g}] proxy console websocket closed: ${e}`,e)}function D(){Pe.preferredIcuAsset=O(Pe.config);let e="invariant"==Pe.config.globalizationMode;if(!e)if(Pe.preferredIcuAsset)Pe.diagnosticTracing&&b("ICU data archive(s) available, disabling invariant mode");else{if("custom"===Pe.config.globalizationMode||"all"===Pe.config.globalizationMode||"sharded"===Pe.config.globalizationMode){const e="invariant globalization mode is inactive and no ICU data archives are available";throw _(`ERROR: ${e}`),new Error(e)}Pe.diagnosticTracing&&b("ICU data archive(s) not available, using invariant globalization mode"),e=!0,Pe.preferredIcuAsset=null}const t="DOTNET_SYSTEM_GLOBALIZATION_INVARIANT",o=Pe.config.environmentVariables;if(void 0===o[t]&&e&&(o[t]="1"),void 0===o.TZ)try{const e=Intl.DateTimeFormat().resolvedOptions().timeZone||null;e&&(o.TZ=e)}catch(e){y("failed to detect timezone, will fallback to UTC")}}function O(e){var t;if((null===(t=e.resources)||void 0===t?void 0:t.icu)&&"invariant"!=e.globalizationMode){const t=e.applicationCulture||(ke?globalThis.navigator&&globalThis.navigator.languages&&globalThis.navigator.languages[0]:Intl.DateTimeFormat().resolvedOptions().locale),o=e.resources.icu;let n=null;if("custom"===e.globalizationMode){if(o.length>=1)return o[0].name}else t&&"all"!==e.globalizationMode?"sharded"===e.globalizationMode&&(n=function(e){const t=e.split("-")[0];return"en"===t||["fr","fr-FR","it","it-IT","de","de-DE","es","es-ES"].includes(e)?"icudt_EFIGS.dat":["zh","ko","ja"].includes(t)?"icudt_CJK.dat":"icudt_no_CJK.dat"}(t)):n="icudt.dat";if(n)for(let e=0;e<o.length;e++){const t=o[e];if(t.virtualPath===n)return t.name}}return e.globalizationMode="invariant",null}(new Date).valueOf();const C=class{constructor(e){this.url=e}toString(){return this.url}};async function k(e,t){try{const o="function"==typeof globalThis.fetch;if(Se){const n=e.startsWith("file://");if(!n&&o)return globalThis.fetch(e,t||{credentials:"same-origin"});p||(h=Ne.require("url"),p=Ne.require("fs")),n&&(e=h.fileURLToPath(e));const r=await p.promises.readFile(e);return{ok:!0,headers:{length:0,get:()=>null},url:e,arrayBuffer:()=>r,json:()=>JSON.parse(r),text:()=>{throw new Error("NotImplementedException")}}}if(o)return globalThis.fetch(e,t||{credentials:"same-origin"});if("function"==typeof read)return{ok:!0,url:e,headers:{length:0,get:()=>null},arrayBuffer:()=>new Uint8Array(read(e,"binary")),json:()=>JSON.parse(read(e,"utf8")),text:()=>read(e,"utf8")}}catch(t){return{ok:!1,url:e,status:500,headers:{length:0,get:()=>null},statusText:"ERR28: "+t,arrayBuffer:()=>{throw t},json:()=>{throw t},text:()=>{throw t}}}throw new Error("No fetch implementation available")}function I(e){return"string"!=typeof e&&Be(!1,"url must be a string"),!M(e)&&0!==e.indexOf("./")&&0!==e.indexOf("../")&&globalThis.URL&&globalThis.document&&globalThis.document.baseURI&&(e=new URL(e,globalThis.document.baseURI).toString()),e}const U=/^[a-zA-Z][a-zA-Z\d+\-.]*?:\/\//,P=/[a-zA-Z]:[\\/]/;function M(e){return Se||Ie?e.startsWith("/")||e.startsWith("\\")||-1!==e.indexOf("///")||P.test(e):U.test(e)}let L,N=0;const $=[],z=[],W=new Map,F={"js-module-threads":!0,"js-module-runtime":!0,"js-module-dotnet":!0,"js-module-native":!0,"js-module-diagnostics":!0},B={...F,"js-module-library-initializer":!0},V={...F,dotnetwasm:!0,heap:!0,manifest:!0},q={...B,manifest:!0},H={...B,dotnetwasm:!0},J={dotnetwasm:!0,symbols:!0},Z={...B,dotnetwasm:!0,symbols:!0},Q={symbols:!0};function G(e){return!("icu"==e.behavior&&e.name!=Pe.preferredIcuAsset)}function K(e,t,o){null!=t||(t=[]),Be(1==t.length,`Expect to have one ${o} asset in resources`);const n=t[0];return n.behavior=o,X(n),e.push(n),n}function X(e){V[e.behavior]&&W.set(e.behavior,e)}function Y(e){Be(V[e],`Unknown single asset behavior ${e}`);const t=W.get(e);if(t&&!t.resolvedUrl)if(t.resolvedUrl=Pe.locateFile(t.name),F[t.behavior]){const e=ge(t);e?("string"!=typeof e&&Be(!1,"loadBootResource response for 'dotnetjs' type should be a URL string"),t.resolvedUrl=e):t.resolvedUrl=ce(t.resolvedUrl,t.behavior)}else if("dotnetwasm"!==t.behavior)throw new Error(`Unknown single asset behavior ${e}`);return t}function ee(e){const t=Y(e);return Be(t,`Single asset for ${e} not found`),t}let te=!1;async function oe(){if(!te){te=!0,Pe.diagnosticTracing&&b("mono_download_assets");try{const e=[],t=[],o=(e,t)=>{!Z[e.behavior]&&G(e)&&Pe.expected_instantiated_assets_count++,!H[e.behavior]&&G(e)&&(Pe.expected_downloaded_assets_count++,t.push(se(e)))};for(const t of $)o(t,e);for(const e of z)o(e,t);Pe.allDownloadsQueued.promise_control.resolve(),Promise.all([...e,...t]).then((()=>{Pe.allDownloadsFinished.promise_control.resolve()})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e})),await Pe.runtimeModuleLoaded.promise;const n=async e=>{const t=await e;if(t.buffer){if(!Z[t.behavior]){t.buffer&&"object"==typeof t.buffer||Be(!1,"asset buffer must be array-like or buffer-like or promise of these"),"string"!=typeof t.resolvedUrl&&Be(!1,"resolvedUrl must be string");const e=t.resolvedUrl,o=await t.buffer,n=new Uint8Array(o);pe(t),await Ue.beforeOnRuntimeInitialized.promise,Ue.instantiate_asset(t,e,n)}}else J[t.behavior]?("symbols"===t.behavior&&(await Ue.instantiate_symbols_asset(t),pe(t)),J[t.behavior]&&++Pe.actual_downloaded_assets_count):(t.isOptional||Be(!1,"Expected asset to have the downloaded buffer"),!H[t.behavior]&&G(t)&&Pe.expected_downloaded_assets_count--,!Z[t.behavior]&&G(t)&&Pe.expected_instantiated_assets_count--)},r=[],i=[];for(const t of e)r.push(n(t));for(const e of t)i.push(n(e));Promise.all(r).then((()=>{Ce||Ue.coreAssetsInMemory.promise_control.resolve()})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e})),Promise.all(i).then((async()=>{Ce||(await Ue.coreAssetsInMemory.promise,Ue.allAssetsInMemory.promise_control.resolve())})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e}))}catch(e){throw Pe.err("Error in mono_download_assets: "+e),e}}}let ne=!1;function re(){if(ne)return;ne=!0;const e=Pe.config,t=[];if(e.assets)for(const t of e.assets)"object"!=typeof t&&Be(!1,`asset must be object, it was ${typeof t} : ${t}`),"string"!=typeof t.behavior&&Be(!1,"asset behavior must be known string"),"string"!=typeof t.name&&Be(!1,"asset name must be string"),t.resolvedUrl&&"string"!=typeof t.resolvedUrl&&Be(!1,"asset resolvedUrl could be string"),t.hash&&"string"!=typeof t.hash&&Be(!1,"asset resolvedUrl could be string"),t.pendingDownload&&"object"!=typeof t.pendingDownload&&Be(!1,"asset pendingDownload could be object"),t.isCore?$.push(t):z.push(t),X(t);else if(e.resources){const o=e.resources;o.wasmNative||Be(!1,"resources.wasmNative must be defined"),o.jsModuleNative||Be(!1,"resources.jsModuleNative must be defined"),o.jsModuleRuntime||Be(!1,"resources.jsModuleRuntime must be defined"),K(z,o.wasmNative,"dotnetwasm"),K(t,o.jsModuleNative,"js-module-native"),K(t,o.jsModuleRuntime,"js-module-runtime"),o.jsModuleDiagnostics&&K(t,o.jsModuleDiagnostics,"js-module-diagnostics");const n=(e,t,o)=>{const n=e;n.behavior=t,o?(n.isCore=!0,$.push(n)):z.push(n)};if(o.coreAssembly)for(let e=0;e<o.coreAssembly.length;e++)n(o.coreAssembly[e],"assembly",!0);if(o.assembly)for(let e=0;e<o.assembly.length;e++)n(o.assembly[e],"assembly",!o.coreAssembly);if(0!=e.debugLevel&&Pe.isDebuggingSupported()){if(o.corePdb)for(let e=0;e<o.corePdb.length;e++)n(o.corePdb[e],"pdb",!0);if(o.pdb)for(let e=0;e<o.pdb.length;e++)n(o.pdb[e],"pdb",!o.corePdb)}if(e.loadAllSatelliteResources&&o.satelliteResources)for(const e in o.satelliteResources)for(let t=0;t<o.satelliteResources[e].length;t++){const r=o.satelliteResources[e][t];r.culture=e,n(r,"resource",!o.coreAssembly)}if(o.coreVfs)for(let e=0;e<o.coreVfs.length;e++)n(o.coreVfs[e],"vfs",!0);if(o.vfs)for(let e=0;e<o.vfs.length;e++)n(o.vfs[e],"vfs",!o.coreVfs);const r=O(e);if(r&&o.icu)for(let e=0;e<o.icu.length;e++){const t=o.icu[e];t.name===r&&n(t,"icu",!1)}if(o.wasmSymbols)for(let e=0;e<o.wasmSymbols.length;e++)n(o.wasmSymbols[e],"symbols",!1)}if(e.appsettings)for(let t=0;t<e.appsettings.length;t++){const o=e.appsettings[t],n=he(o);"appsettings.json"!==n&&n!==`appsettings.${e.applicationEnvironment}.json`||z.push({name:o,behavior:"vfs",cache:"no-cache",useCredentials:!0})}e.assets=[...$,...z,...t]}async function ie(e){const t=await se(e);return await t.pendingDownloadInternal.response,t.buffer}async function se(e){try{return await ae(e)}catch(t){if(!Pe.enableDownloadRetry)throw t;if(Ie||Se)throw t;if(e.pendingDownload&&e.pendingDownloadInternal==e.pendingDownload)throw t;if(e.resolvedUrl&&-1!=e.resolvedUrl.indexOf("file://"))throw t;if(t&&404==t.status)throw t;e.pendingDownloadInternal=void 0,await Pe.allDownloadsQueued.promise;try{return Pe.diagnosticTracing&&b(`Retrying download '${e.name}'`),await ae(e)}catch(t){return e.pendingDownloadInternal=void 0,await new Promise((e=>globalThis.setTimeout(e,100))),Pe.diagnosticTracing&&b(`Retrying download (2) '${e.name}' after delay`),await ae(e)}}}async function ae(e){for(;L;)await L.promise;try{++N,N==Pe.maxParallelDownloads&&(Pe.diagnosticTracing&&b("Throttling further parallel downloads"),L=i());const t=await async function(e){if(e.pendingDownload&&(e.pendingDownloadInternal=e.pendingDownload),e.pendingDownloadInternal&&e.pendingDownloadInternal.response)return e.pendingDownloadInternal.response;if(e.buffer){const t=await e.buffer;return e.resolvedUrl||(e.resolvedUrl="undefined://"+e.name),e.pendingDownloadInternal={url:e.resolvedUrl,name:e.name,response:Promise.resolve({ok:!0,arrayBuffer:()=>t,json:()=>JSON.parse(new TextDecoder("utf-8").decode(t)),text:()=>{throw new Error("NotImplementedException")},headers:{get:()=>{}}})},e.pendingDownloadInternal.response}const t=e.loadRemote&&Pe.config.remoteSources?Pe.config.remoteSources:[""];let o;for(let n of t){n=n.trim(),"./"===n&&(n="");const t=le(e,n);e.name===t?Pe.diagnosticTracing&&b(`Attempting to download '${t}'`):Pe.diagnosticTracing&&b(`Attempting to download '${t}' for ${e.name}`);try{e.resolvedUrl=t;const n=fe(e);if(e.pendingDownloadInternal=n,o=await n.response,!o||!o.ok)continue;return o}catch(e){o||(o={ok:!1,url:t,status:0,statusText:""+e});continue}}const n=e.isOptional||e.name.match(/\.pdb$/)&&Pe.config.ignorePdbLoadErrors;if(o||Be(!1,`Response undefined ${e.name}`),!n){const t=new Error(`download '${o.url}' for ${e.name} failed ${o.status} ${o.statusText}`);throw t.status=o.status,t}y(`optional download '${o.url}' for ${e.name} failed ${o.status} ${o.statusText}`)}(e);return t?(J[e.behavior]||(e.buffer=await t.arrayBuffer(),++Pe.actual_downloaded_assets_count),e):e}finally{if(--N,L&&N==Pe.maxParallelDownloads-1){Pe.diagnosticTracing&&b("Resuming more parallel downloads");const e=L;L=void 0,e.promise_control.resolve()}}}function le(e,t){let o;return null==t&&Be(!1,`sourcePrefix must be provided for ${e.name}`),e.resolvedUrl?o=e.resolvedUrl:(o=""===t?"assembly"===e.behavior||"pdb"===e.behavior?e.name:"resource"===e.behavior&&e.culture&&""!==e.culture?`${e.culture}/${e.name}`:e.name:t+e.name,o=ce(Pe.locateFile(o),e.behavior)),o&&"string"==typeof o||Be(!1,"attemptUrl need to be path or url string"),o}function ce(e,t){return Pe.modulesUniqueQuery&&q[t]&&(e+=Pe.modulesUniqueQuery),e}let de=0;const ue=new Set;function fe(e){try{e.resolvedUrl||Be(!1,"Request's resolvedUrl must be set");const t=function(e){let t=e.resolvedUrl;if(Pe.loadBootResource){const o=ge(e);if(o instanceof Promise)return o;"string"==typeof o&&(t=o)}const o={};return e.cache?o.cache=e.cache:Pe.config.disableNoCacheFetch||(o.cache="no-cache"),e.useCredentials?o.credentials="include":!Pe.config.disableIntegrityCheck&&e.hash&&(o.integrity=e.hash),Pe.fetch_like(t,o)}(e),o={name:e.name,url:e.resolvedUrl,response:t};return ue.add(e.name),o.response.then((()=>{"assembly"==e.behavior&&Pe.loadedAssemblies.push(e.name),de++,Pe.onDownloadResourceProgress&&Pe.onDownloadResourceProgress(de,ue.size)})),o}catch(t){const o={ok:!1,url:e.resolvedUrl,status:500,statusText:"ERR29: "+t,arrayBuffer:()=>{throw t},json:()=>{throw t}};return{name:e.name,url:e.resolvedUrl,response:Promise.resolve(o)}}}const me={resource:"assembly",assembly:"assembly",pdb:"pdb",icu:"globalization",vfs:"configuration",manifest:"manifest",dotnetwasm:"dotnetwasm","js-module-dotnet":"dotnetjs","js-module-native":"dotnetjs","js-module-runtime":"dotnetjs","js-module-threads":"dotnetjs"};function ge(e){var t;if(Pe.loadBootResource){const o=null!==(t=e.hash)&&void 0!==t?t:"",n=e.resolvedUrl,r=me[e.behavior];if(r){const t=Pe.loadBootResource(r,e.name,n,o,e.behavior);return"string"==typeof t?I(t):t}}}function pe(e){e.pendingDownloadInternal=null,e.pendingDownload=null,e.buffer=null,e.moduleExports=null}function he(e){let t=e.lastIndexOf("/");return t>=0&&t++,e.substring(t)}async function we(e){e&&await Promise.all((null!=e?e:[]).map((e=>async function(e){try{const t=e.name;if(!e.moduleExports){const o=ce(Pe.locateFile(t),"js-module-library-initializer");Pe.diagnosticTracing&&b(`Attempting to import '${o}' for ${e}`),e.moduleExports=await import(/*! webpackIgnore: true */o)}Pe.libraryInitializers.push({scriptName:t,exports:e.moduleExports})}catch(t){E(`Failed to import library initializer '${e}': ${t}`)}}(e))))}async function be(e,t){if(!Pe.libraryInitializers)return;const o=[];for(let n=0;n<Pe.libraryInitializers.length;n++){const r=Pe.libraryInitializers[n];r.exports[e]&&o.push(ye(r.scriptName,e,(()=>r.exports[e](...t))))}await Promise.all(o)}async function ye(e,t,o){try{await o()}catch(o){throw E(`Failed to invoke '${t}' on library initializer '${e}': ${o}`),Xe(1,o),o}}function ve(e,t){if(e===t)return e;const o={...t};return void 0!==o.assets&&o.assets!==e.assets&&(o.assets=[...e.assets||[],...o.assets||[]]),void 0!==o.resources&&(o.resources=_e(e.resources||{assembly:[],jsModuleNative:[],jsModuleRuntime:[],wasmNative:[]},o.resources)),void 0!==o.environmentVariables&&(o.environmentVariables={...e.environmentVariables||{},...o.environmentVariables||{}}),void 0!==o.runtimeOptions&&o.runtimeOptions!==e.runtimeOptions&&(o.runtimeOptions=[...e.runtimeOptions||[],...o.runtimeOptions||[]]),Object.assign(e,o)}function Ee(e,t){if(e===t)return e;const o={...t};return o.config&&(e.config||(e.config={}),o.config=ve(e.config,o.config)),Object.assign(e,o)}function _e(e,t){if(e===t)return e;const o={...t};return void 0!==o.coreAssembly&&(o.coreAssembly=[...e.coreAssembly||[],...o.coreAssembly||[]]),void 0!==o.assembly&&(o.assembly=[...e.assembly||[],...o.assembly||[]]),void 0!==o.lazyAssembly&&(o.lazyAssembly=[...e.lazyAssembly||[],...o.lazyAssembly||[]]),void 0!==o.corePdb&&(o.corePdb=[...e.corePdb||[],...o.corePdb||[]]),void 0!==o.pdb&&(o.pdb=[...e.pdb||[],...o.pdb||[]]),void 0!==o.jsModuleWorker&&(o.jsModuleWorker=[...e.jsModuleWorker||[],...o.jsModuleWorker||[]]),void 0!==o.jsModuleNative&&(o.jsModuleNative=[...e.jsModuleNative||[],...o.jsModuleNative||[]]),void 0!==o.jsModuleDiagnostics&&(o.jsModuleDiagnostics=[...e.jsModuleDiagnostics||[],...o.jsModuleDiagnostics||[]]),void 0!==o.jsModuleRuntime&&(o.jsModuleRuntime=[...e.jsModuleRuntime||[],...o.jsModuleRuntime||[]]),void 0!==o.wasmSymbols&&(o.wasmSymbols=[...e.wasmSymbols||[],...o.wasmSymbols||[]]),void 0!==o.wasmNative&&(o.wasmNative=[...e.wasmNative||[],...o.wasmNative||[]]),void 0!==o.icu&&(o.icu=[...e.icu||[],...o.icu||[]]),void 0!==o.satelliteResources&&(o.satelliteResources=function(e,t){if(e===t)return e;for(const o in t)e[o]=[...e[o]||[],...t[o]||[]];return e}(e.satelliteResources||{},o.satelliteResources||{})),void 0!==o.modulesAfterConfigLoaded&&(o.modulesAfterConfigLoaded=[...e.modulesAfterConfigLoaded||[],...o.modulesAfterConfigLoaded||[]]),void 0!==o.modulesAfterRuntimeReady&&(o.modulesAfterRuntimeReady=[...e.modulesAfterRuntimeReady||[],...o.modulesAfterRuntimeReady||[]]),void 0!==o.extensions&&(o.extensions={...e.extensions||{},...o.extensions||{}}),void 0!==o.vfs&&(o.vfs=[...e.vfs||[],...o.vfs||[]]),Object.assign(e,o)}function xe(){const e=Pe.config;if(e.environmentVariables=e.environmentVariables||{},e.runtimeOptions=e.runtimeOptions||[],e.resources=e.resources||{assembly:[],jsModuleNative:[],jsModuleWorker:[],jsModuleRuntime:[],wasmNative:[],vfs:[],satelliteResources:{}},e.assets){Pe.diagnosticTracing&&b("config.assets is deprecated, use config.resources instead");for(const t of e.assets){const o={};switch(t.behavior){case"assembly":o.assembly=[t];break;case"pdb":o.pdb=[t];break;case"resource":o.satelliteResources={},o.satelliteResources[t.culture]=[t];break;case"icu":o.icu=[t];break;case"symbols":o.wasmSymbols=[t];break;case"vfs":o.vfs=[t];break;case"dotnetwasm":o.wasmNative=[t];break;case"js-module-threads":o.jsModuleWorker=[t];break;case"js-module-runtime":o.jsModuleRuntime=[t];break;case"js-module-native":o.jsModuleNative=[t];break;case"js-module-diagnostics":o.jsModuleDiagnostics=[t];break;case"js-module-dotnet":break;default:throw new Error(`Unexpected behavior ${t.behavior} of asset ${t.name}`)}_e(e.resources,o)}}e.debugLevel,e.applicationEnvironment||(e.applicationEnvironment="Production"),e.applicationCulture&&(e.environmentVariables.LANG=`${e.applicationCulture}.UTF-8`),Ue.diagnosticTracing=Pe.diagnosticTracing=!!e.diagnosticTracing,Ue.waitForDebugger=e.waitForDebugger,Pe.maxParallelDownloads=e.maxParallelDownloads||Pe.maxParallelDownloads,Pe.enableDownloadRetry=void 0!==e.enableDownloadRetry?e.enableDownloadRetry:Pe.enableDownloadRetry}let je=!1;async function Re(e){var t;if(je)return void await Pe.afterConfigLoaded.promise;let o;try{if(e.configSrc||Pe.config&&0!==Object.keys(Pe.config).length&&(Pe.config.assets||Pe.config.resources)||(e.configSrc="dotnet.boot.js"),o=e.configSrc,je=!0,o&&(Pe.diagnosticTracing&&b("mono_wasm_load_config"),await async function(e){const t=e.configSrc,o=Pe.locateFile(t);let n=null;void 0!==Pe.loadBootResource&&(n=Pe.loadBootResource("manifest",t,o,"","manifest"));let r,i=null;if(n)if("string"==typeof n)n.includes(".json")?(i=await s(I(n)),r=await Ae(i)):r=(await import(I(n))).config;else{const e=await n;"function"==typeof e.json?(i=e,r=await Ae(i)):r=e.config}else o.includes(".json")?(i=await s(ce(o,"manifest")),r=await Ae(i)):r=(await import(ce(o,"manifest"))).config;function s(e){return Pe.fetch_like(e,{method:"GET",credentials:"include",cache:"no-cache"})}Pe.config.applicationEnvironment&&(r.applicationEnvironment=Pe.config.applicationEnvironment),ve(Pe.config,r)}(e)),xe(),await we(null===(t=Pe.config.resources)||void 0===t?void 0:t.modulesAfterConfigLoaded),await be("onRuntimeConfigLoaded",[Pe.config]),e.onConfigLoaded)try{await e.onConfigLoaded(Pe.config,Le),xe()}catch(e){throw _("onConfigLoaded() failed",e),e}xe(),Pe.afterConfigLoaded.promise_control.resolve(Pe.config)}catch(t){const n=`Failed to load config file ${o} ${t} ${null==t?void 0:t.stack}`;throw Pe.config=e.config=Object.assign(Pe.config,{message:n,error:t,isError:!0}),Xe(1,new Error(n)),t}}function Te(){return!!globalThis.navigator&&(Pe.isChromium||Pe.isFirefox)}async function Ae(e){const t=Pe.config,o=await e.json();t.applicationEnvironment||o.applicationEnvironment||(o.applicationEnvironment=e.headers.get("Blazor-Environment")||e.headers.get("DotNet-Environment")||void 0),o.environmentVariables||(o.environmentVariables={});const n=e.headers.get("DOTNET-MODIFIABLE-ASSEMBLIES");n&&(o.environmentVariables.DOTNET_MODIFIABLE_ASSEMBLIES=n);const r=e.headers.get("ASPNETCORE-BROWSER-TOOLS");return r&&(o.environmentVariables.__ASPNETCORE_BROWSER_TOOLS=r),o}"function"!=typeof importScripts||globalThis.onmessage||(globalThis.dotnetSidecar=!0);const Se="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,De="function"==typeof importScripts,Oe=De&&"undefined"!=typeof dotnetSidecar,Ce=De&&!Oe,ke="object"==typeof window||De&&!Se,Ie=!ke&&!Se;let Ue={},Pe={},Me={},Le={},Ne={},$e=!1;const ze={},We={config:ze},Fe={mono:{},binding:{},internal:Ne,module:We,loaderHelpers:Pe,runtimeHelpers:Ue,diagnosticHelpers:Me,api:Le};function Be(e,t){if(e)return;const o="Assert failed: "+("function"==typeof t?t():t),n=new Error(o);_(o,n),Ue.nativeAbort(n)}function Ve(){return void 0!==Pe.exitCode}function qe(){return Ue.runtimeReady&&!Ve()}function He(){Ve()&&Be(!1,`.NET runtime already exited with ${Pe.exitCode} ${Pe.exitReason}. You can use runtime.runMain() which doesn't exit the runtime.`),Ue.runtimeReady||Be(!1,".NET runtime didn't start yet. Please call dotnet.create() first.")}function Je(){ke&&(globalThis.addEventListener("unhandledrejection",et),globalThis.addEventListener("error",tt))}let Ze,Qe;function Ge(e){Qe&&Qe(e),Xe(e,Pe.exitReason)}function Ke(e){Ze&&Ze(e||Pe.exitReason),Xe(1,e||Pe.exitReason)}function Xe(t,o){var n,r;const i=o&&"object"==typeof o;t=i&&"number"==typeof o.status?o.status:void 0===t?-1:t;const s=i&&"string"==typeof o.message?o.message:""+o;(o=i?o:Ue.ExitStatus?function(e,t){const o=new Ue.ExitStatus(e);return o.message=t,o.toString=()=>t,o}(t,s):new Error("Exit with code "+t+" "+s)).status=t,o.message||(o.message=s);const a=""+(o.stack||(new Error).stack);try{Object.defineProperty(o,"stack",{get:()=>a})}catch(e){}const l=!!o.silent;if(o.silent=!0,Ve())Pe.diagnosticTracing&&b("mono_exit called after exit");else{try{We.onAbort==Ke&&(We.onAbort=Ze),We.onExit==Ge&&(We.onExit=Qe),ke&&(globalThis.removeEventListener("unhandledrejection",et),globalThis.removeEventListener("error",tt)),Ue.runtimeReady?(Ue.jiterpreter_dump_stats&&Ue.jiterpreter_dump_stats(!1),0===t&&(null===(n=Pe.config)||void 0===n?void 0:n.interopCleanupOnExit)&&Ue.forceDisposeProxies(!0,!0),e&&0!==t&&(null===(r=Pe.config)||void 0===r||r.dumpThreadsOnNonZeroExit)):(Pe.diagnosticTracing&&b(`abort_startup, reason: ${o}`),function(e){Pe.allDownloadsQueued.promise_control.reject(e),Pe.allDownloadsFinished.promise_control.reject(e),Pe.afterConfigLoaded.promise_control.reject(e),Pe.wasmCompilePromise.promise_control.reject(e),Pe.runtimeModuleLoaded.promise_control.reject(e),Ue.dotnetReady&&(Ue.dotnetReady.promise_control.reject(e),Ue.afterInstantiateWasm.promise_control.reject(e),Ue.beforePreInit.promise_control.reject(e),Ue.afterPreInit.promise_control.reject(e),Ue.afterPreRun.promise_control.reject(e),Ue.beforeOnRuntimeInitialized.promise_control.reject(e),Ue.afterOnRuntimeInitialized.promise_control.reject(e),Ue.afterPostRun.promise_control.reject(e))}(o))}catch(e){E("mono_exit A failed",e)}try{l||(function(e,t){if(0!==e&&t){const e=Ue.ExitStatus&&t instanceof Ue.ExitStatus?b:_;"string"==typeof t?e(t):(void 0===t.stack&&(t.stack=(new Error).stack+""),t.message?e(Ue.stringify_as_error_with_stack?Ue.stringify_as_error_with_stack(t.message+"\n"+t.stack):t.message+"\n"+t.stack):e(JSON.stringify(t)))}!Ce&&Pe.config&&(Pe.config.logExitCode?Pe.config.forwardConsoleLogsToWS?R("WASM EXIT "+e):v("WASM EXIT "+e):Pe.config.forwardConsoleLogsToWS&&R())}(t,o),function(e){if(ke&&!Ce&&Pe.config&&Pe.config.appendElementOnExit&&document){const t=document.createElement("label");t.id="tests_done",0!==e&&(t.style.background="red"),t.innerHTML=""+e,document.body.appendChild(t)}}(t))}catch(e){E("mono_exit B failed",e)}Pe.exitCode=t,Pe.exitReason||(Pe.exitReason=o),!Ce&&Ue.runtimeReady&&We.runtimeKeepalivePop()}if(Pe.config&&Pe.config.asyncFlushOnExit&&0===t)throw(async()=>{try{await async function(){try{const e=await import(/*! webpackIgnore: true */"process"),t=e=>new Promise(((t,o)=>{e.on("error",o),e.end("","utf8",t)})),o=t(e.stderr),n=t(e.stdout);let r;const i=new Promise((e=>{r=setTimeout((()=>e("timeout")),1e3)}));await Promise.race([Promise.all([n,o]),i]),clearTimeout(r)}catch(e){_(`flushing std* streams failed: ${e}`)}}()}finally{Ye(t,o)}})(),o;Ye(t,o)}function Ye(e,t){if(Ue.runtimeReady&&Ue.nativeExit)try{Ue.nativeExit(e)}catch(e){!Ue.ExitStatus||e instanceof Ue.ExitStatus||E("set_exit_code_and_quit_now failed: "+e.toString())}if(0!==e||!ke)throw Se&&Ne.process?Ne.process.exit(e):Ue.quit&&Ue.quit(e,t),t}function et(e){ot(e,e.reason,"rejection")}function tt(e){ot(e,e.error,"error")}function ot(e,t,o){e.preventDefault();try{t||(t=new Error("Unhandled "+o)),void 0===t.stack&&(t.stack=(new Error).stack),t.stack=t.stack+"",t.silent||(_("Unhandled error:",t),Xe(1,t))}catch(e){}}!function(e){if($e)throw new Error("Loader module already loaded");$e=!0,Ue=e.runtimeHelpers,Pe=e.loaderHelpers,Me=e.diagnosticHelpers,Le=e.api,Ne=e.internal,Object.assign(Le,{INTERNAL:Ne,invokeLibraryInitializers:be}),Object.assign(e.module,{config:ve(ze,{environmentVariables:{}})});const r={mono_wasm_bindings_is_ready:!1,config:e.module.config,diagnosticTracing:!1,nativeAbort:e=>{throw e||new Error("abort")},nativeExit:e=>{throw new Error("exit:"+e)}},l={gitHash:"a612c2a1056fe3265387ae3ff7c94eba1505caf9",config:e.module.config,diagnosticTracing:!1,maxParallelDownloads:16,enableDownloadRetry:!0,_loaded_files:[],loadedFiles:[],loadedAssemblies:[],libraryInitializers:[],workerNextNumber:1,actual_downloaded_assets_count:0,actual_instantiated_assets_count:0,expected_downloaded_assets_count:0,expected_instantiated_assets_count:0,afterConfigLoaded:i(),allDownloadsQueued:i(),allDownloadsFinished:i(),wasmCompilePromise:i(),runtimeModuleLoaded:i(),loadingWorkers:i(),is_exited:Ve,is_runtime_running:qe,assert_runtime_running:He,mono_exit:Xe,createPromiseController:i,getPromiseController:s,assertIsControllablePromise:a,mono_download_assets:oe,resolve_single_asset_path:ee,setup_proxy_console:j,set_thread_prefix:w,installUnhandledErrorHandler:Je,retrieve_asset_download:ie,invokeLibraryInitializers:be,isDebuggingSupported:Te,exceptions:t,simd:n,relaxedSimd:o};Object.assign(Ue,r),Object.assign(Pe,l)}(Fe);let nt,rt,it,st=!1,at=!1;async function lt(e){if(!at){if(at=!0,ke&&Pe.config.forwardConsoleLogsToWS&&void 0!==globalThis.WebSocket&&j("main",globalThis.console,globalThis.location.origin),We||Be(!1,"Null moduleConfig"),Pe.config||Be(!1,"Null moduleConfig.config"),"function"==typeof e){const t=e(Fe.api);if(t.ready)throw new Error("Module.ready couldn't be redefined.");Object.assign(We,t),Ee(We,t)}else{if("object"!=typeof e)throw new Error("Can't use moduleFactory callback of createDotnetRuntime function.");Ee(We,e)}await async function(e){if(Se){const e=await import(/*! webpackIgnore: true */"process"),t=14;if(e.versions.node.split(".")[0]<t)throw new Error(`NodeJS at '${e.execPath}' has too low version '${e.versions.node}', please use at least ${t}. See also https://aka.ms/dotnet-wasm-features`)}const t=/*! webpackIgnore: true */import.meta.url,o=t.indexOf("?");var n;if(o>0&&(Pe.modulesUniqueQuery=t.substring(o)),Pe.scriptUrl=t.replace(/\\/g,"/").replace(/[?#].*/,""),Pe.scriptDirectory=(n=Pe.scriptUrl).slice(0,n.lastIndexOf("/"))+"/",Pe.locateFile=e=>"URL"in globalThis&&globalThis.URL!==C?new URL(e,Pe.scriptDirectory).toString():M(e)?e:Pe.scriptDirectory+e,Pe.fetch_like=k,Pe.out=console.log,Pe.err=console.error,Pe.onDownloadResourceProgress=e.onDownloadResourceProgress,ke&&globalThis.navigator){const e=globalThis.navigator,t=e.userAgentData&&e.userAgentData.brands;t&&t.length>0?Pe.isChromium=t.some((e=>"Google Chrome"===e.brand||"Microsoft Edge"===e.brand||"Chromium"===e.brand)):e.userAgent&&(Pe.isChromium=e.userAgent.includes("Chrome"),Pe.isFirefox=e.userAgent.includes("Firefox"))}Ne.require=Se?await import(/*! webpackIgnore: true */"module").then((e=>e.createRequire(/*! webpackIgnore: true */import.meta.url))):Promise.resolve((()=>{throw new Error("require not supported")})),void 0===globalThis.URL&&(globalThis.URL=C)}(We)}}async function ct(e){return await lt(e),Ze=We.onAbort,Qe=We.onExit,We.onAbort=Ke,We.onExit=Ge,We.ENVIRONMENT_IS_PTHREAD?async function(){(function(){const e=new MessageChannel,t=e.port1,o=e.port2;t.addEventListener("message",(e=>{var n,r;n=JSON.parse(e.data.config),r=JSON.parse(e.data.monoThreadInfo),st?Pe.diagnosticTracing&&b("mono config already received"):(ve(Pe.config,n),Ue.monoThreadInfo=r,xe(),Pe.diagnosticTracing&&b("mono config received"),st=!0,Pe.afterConfigLoaded.promise_control.resolve(Pe.config),ke&&n.forwardConsoleLogsToWS&&void 0!==globalThis.WebSocket&&Pe.setup_proxy_console("worker-idle",console,globalThis.location.origin)),t.close(),o.close()}),{once:!0}),t.start(),self.postMessage({[l]:{monoCmd:"preload",port:o}},[o])})(),await Pe.afterConfigLoaded.promise,function(){const e=Pe.config;e.assets||Be(!1,"config.assets must be defined");for(const t of e.assets)X(t),Q[t.behavior]&&z.push(t)}(),setTimeout((async()=>{try{await oe()}catch(e){Xe(1,e)}}),0);const e=dt(),t=await Promise.all(e);return await ut(t),We}():async function(){var e;await Re(We),re();const t=dt();(async function(){try{const e=ee("dotnetwasm");await se(e),e&&e.pendingDownloadInternal&&e.pendingDownloadInternal.response||Be(!1,"Can't load dotnet.native.wasm");const t=await e.pendingDownloadInternal.response,o=t.headers&&t.headers.get?t.headers.get("Content-Type"):void 0;let n;if("function"==typeof WebAssembly.compileStreaming&&"application/wasm"===o)n=await WebAssembly.compileStreaming(t);else{ke&&"application/wasm"!==o&&E('WebAssembly resource does not have the expected content type "application/wasm", so falling back to slower ArrayBuffer instantiation.');const e=await t.arrayBuffer();Pe.diagnosticTracing&&b("instantiate_wasm_module buffered"),n=Ie?await Promise.resolve(new WebAssembly.Module(e)):await WebAssembly.compile(e)}e.pendingDownloadInternal=null,e.pendingDownload=null,e.buffer=null,e.moduleExports=null,Pe.wasmCompilePromise.promise_control.resolve(n)}catch(e){Pe.wasmCompilePromise.promise_control.reject(e)}})(),setTimeout((async()=>{try{D(),await oe()}catch(e){Xe(1,e)}}),0);const o=await Promise.all(t);return await ut(o),await Ue.dotnetReady.promise,await we(null===(e=Pe.config.resources)||void 0===e?void 0:e.modulesAfterRuntimeReady),await be("onRuntimeReady",[Fe.api]),Le}()}function dt(){const e=ee("js-module-runtime"),t=ee("js-module-native");if(nt&&rt)return[nt,rt,it];"object"==typeof e.moduleExports?nt=e.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${e.resolvedUrl}' for ${e.name}`),nt=import(/*! webpackIgnore: true */e.resolvedUrl)),"object"==typeof t.moduleExports?rt=t.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${t.resolvedUrl}' for ${t.name}`),rt=import(/*! webpackIgnore: true */t.resolvedUrl));const o=Y("js-module-diagnostics");return o&&("object"==typeof o.moduleExports?it=o.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${o.resolvedUrl}' for ${o.name}`),it=import(/*! webpackIgnore: true */o.resolvedUrl))),[nt,rt,it]}async function ut(e){const{initializeExports:t,initializeReplacements:o,configureRuntimeStartup:n,configureEmscriptenStartup:r,configureWorkerStartup:i,setRuntimeGlobals:s,passEmscriptenInternals:a}=e[0],{default:l}=e[1],c=e[2];s(Fe),t(Fe),c&&c.setRuntimeGlobals(Fe),await n(We),Pe.runtimeModuleLoaded.promise_control.resolve(),l((e=>(Object.assign(We,{ready:e.ready,__dotnet_runtime:{initializeReplacements:o,configureEmscriptenStartup:r,configureWorkerStartup:i,passEmscriptenInternals:a}}),We))).catch((e=>{if(e.message&&e.message.toLowerCase().includes("out of memory"))throw new Error(".NET runtime has failed to start, because too much memory was requested. Please decrease the memory by adjusting EmccMaximumHeapSize. See also https://aka.ms/dotnet-wasm-features");throw e}))}const ft=new class{withModuleConfig(e){try{return Ee(We,e),this}catch(e){throw Xe(1,e),e}}withOnConfigLoaded(e){try{return Ee(We,{onConfigLoaded:e}),this}catch(e){throw Xe(1,e),e}}withConsoleForwarding(){try{return ve(ze,{forwardConsoleLogsToWS:!0}),this}catch(e){throw Xe(1,e),e}}withExitOnUnhandledError(){try{return ve(ze,{exitOnUnhandledError:!0}),Je(),this}catch(e){throw Xe(1,e),e}}withAsyncFlushOnExit(){try{return ve(ze,{asyncFlushOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withExitCodeLogging(){try{return ve(ze,{logExitCode:!0}),this}catch(e){throw Xe(1,e),e}}withElementOnExit(){try{return ve(ze,{appendElementOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withInteropCleanupOnExit(){try{return ve(ze,{interopCleanupOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withDumpThreadsOnNonZeroExit(){try{return ve(ze,{dumpThreadsOnNonZeroExit:!0}),this}catch(e){throw Xe(1,e),e}}withWaitingForDebugger(e){try{return ve(ze,{waitForDebugger:e}),this}catch(e){throw Xe(1,e),e}}withInterpreterPgo(e,t){try{return ve(ze,{interpreterPgo:e,interpreterPgoSaveDelay:t}),ze.runtimeOptions?ze.runtimeOptions.push("--interp-pgo-recording"):ze.runtimeOptions=["--interp-pgo-recording"],this}catch(e){throw Xe(1,e),e}}withConfig(e){try{return ve(ze,e),this}catch(e){throw Xe(1,e),e}}withConfigSrc(e){try{return e&&"string"==typeof e||Be(!1,"must be file path or URL"),Ee(We,{configSrc:e}),this}catch(e){throw Xe(1,e),e}}withVirtualWorkingDirectory(e){try{return e&&"string"==typeof e||Be(!1,"must be directory path"),ve(ze,{virtualWorkingDirectory:e}),this}catch(e){throw Xe(1,e),e}}withEnvironmentVariable(e,t){try{const o={};return o[e]=t,ve(ze,{environmentVariables:o}),this}catch(e){throw Xe(1,e),e}}withEnvironmentVariables(e){try{return e&&"object"==typeof e||Be(!1,"must be dictionary object"),ve(ze,{environmentVariables:e}),this}catch(e){throw Xe(1,e),e}}withDiagnosticTracing(e){try{return"boolean"!=typeof e&&Be(!1,"must be boolean"),ve(ze,{diagnosticTracing:e}),this}catch(e){throw Xe(1,e),e}}withDebugging(e){try{return null!=e&&"number"==typeof e||Be(!1,"must be number"),ve(ze,{debugLevel:e}),this}catch(e){throw Xe(1,e),e}}withApplicationArguments(...e){try{return e&&Array.isArray(e)||Be(!1,"must be array of strings"),ve(ze,{applicationArguments:e}),this}catch(e){throw Xe(1,e),e}}withRuntimeOptions(e){try{return e&&Array.isArray(e)||Be(!1,"must be array of strings"),ze.runtimeOptions?ze.runtimeOptions.push(...e):ze.runtimeOptions=e,this}catch(e){throw Xe(1,e),e}}withMainAssembly(e){try{return ve(ze,{mainAssemblyName:e}),this}catch(e){throw Xe(1,e),e}}withApplicationArgumentsFromQuery(){try{if(!globalThis.window)throw new Error("Missing window to the query parameters from");if(void 0===globalThis.URLSearchParams)throw new Error("URLSearchParams is supported");const e=new URLSearchParams(globalThis.window.location.search).getAll("arg");return this.withApplicationArguments(...e)}catch(e){throw Xe(1,e),e}}withApplicationEnvironment(e){try{return ve(ze,{applicationEnvironment:e}),this}catch(e){throw Xe(1,e),e}}withApplicationCulture(e){try{return ve(ze,{applicationCulture:e}),this}catch(e){throw Xe(1,e),e}}withResourceLoader(e){try{return Pe.loadBootResource=e,this}catch(e){throw Xe(1,e),e}}async download(){try{await async function(){lt(We),await Re(We),re(),D(),oe(),await Pe.allDownloadsFinished.promise}()}catch(e){throw Xe(1,e),e}}async create(){try{return this.instance||(this.instance=await async function(){return await ct(We),Fe.api}()),this.instance}catch(e){throw Xe(1,e),e}}async run(){try{return We.config||Be(!1,"Null moduleConfig.config"),this.instance||await this.create(),this.instance.runMainAndExit()}catch(e){throw Xe(1,e),e}}},mt=Xe,gt=ct;Ie||"function"==typeof globalThis.URL||Be(!1,"This browser/engine doesn't support URL API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"),"function"!=typeof globalThis.BigInt64Array&&Be(!1,"This browser/engine doesn't support BigInt64Array API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"),ft.withConfig(/*json-start*/{
  "mainAssemblyName": "SharpCast.Ui",
  "resources": {
    "hash": "sha256-10NsYMb+k9SQN+cWz6KLcoCjfZw67kNg/GYpfrtPc90=",
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
        "name": "System.Private.CoreLib.63o40z1np7.wasm",
        "integrity": "sha256-8o6TFAA7fDF74j6QLSAii15q1ddLGktc0v8Wj28sPRs=",
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
        "name": "Humanizer.hmybd7bz0p.wasm",
        "integrity": "sha256-92ID7uJek8fKffBx6b9S8qZohpfwi0mjqbUPPWk1qtg=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.AspNetCore.Components.Web.wasm",
        "name": "Microsoft.AspNetCore.Components.Web.6y09r1d94n.wasm",
        "integrity": "sha256-DhxJjAEyjrVJ766/37LMqa36VhiVjPV1Prf0K2ZivkY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.AspNetCore.Components.WebAssembly.wasm",
        "name": "Microsoft.AspNetCore.Components.WebAssembly.17ndosg713.wasm",
        "integrity": "sha256-rX5MdaCKJrY+oIaZR88T2aErMPBTi3QHAz/aCWDpppo=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.AspNetCore.Components.wasm",
        "name": "Microsoft.AspNetCore.Components.3pekbcb2sp.wasm",
        "integrity": "sha256-ma21GxKOX7WEVV4NgWZoQdsojAm41vXBWwvlY1PcJd0=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.wasm",
        "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.nnmcno2xng.wasm",
        "integrity": "sha256-szRxBE0pVPoPByitWVImsT5ZNVzI1WotxWc8ElzLKWc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.CSharp.wasm",
        "name": "Microsoft.CodeAnalysis.CSharp.df8hfd5o8z.wasm",
        "integrity": "sha256-F6hjB2uObN+teOfptznqaUCTmIDykWUjqqGeeis7Rjw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.wasm",
        "name": "Microsoft.CodeAnalysis.VisualBasic.16g3yrjguf.wasm",
        "integrity": "sha256-mVK1oeaP7G9j2O75XqJRirJ/UiqlwgzeoPHuYKVPaJY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.wasm",
        "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.9ur51h30jz.wasm",
        "integrity": "sha256-MdFejKxBz2wJda/gFl0zKOawxDN+Elz4sCIcCety434=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.Workspaces.wasm",
        "name": "Microsoft.CodeAnalysis.Workspaces.c3dihulv86.wasm",
        "integrity": "sha256-yAu2rqqQvhof4W5kbWNInCtLmYIYPbm/0vHEJfVe6h8=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.wasm",
        "name": "Microsoft.CodeAnalysis.erp1n29u9n.wasm",
        "integrity": "sha256-VvgzZZPZ5B7lUxBoceWqgqrawKs/BElsjRu+YB9hkIk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Configuration.wasm",
        "name": "Microsoft.Extensions.Configuration.jqj4k4pj3p.wasm",
        "integrity": "sha256-FU9TpGEmQwWgADUtlXFTdJIwsCDEyFtgEJacSi8iIoY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Configuration.Abstractions.wasm",
        "name": "Microsoft.Extensions.Configuration.Abstractions.w7skqr0zek.wasm",
        "integrity": "sha256-3DH5Li3nbKgskNzRybjZBIfXSoxH/TN0wolg2KHl/YQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Configuration.Json.wasm",
        "name": "Microsoft.Extensions.Configuration.Json.dtdoolwb2w.wasm",
        "integrity": "sha256-D1jnvoQnv2aAi2ps5NzM3lqE5jEy+XJit2tS6neJnXM=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.DependencyInjection.wasm",
        "name": "Microsoft.Extensions.DependencyInjection.biel5wh79r.wasm",
        "integrity": "sha256-s7G8VOeZubgxTvjycreEOfE5MEt/lwK71wD4JW8Ga7E=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.DependencyInjection.Abstractions.wasm",
        "name": "Microsoft.Extensions.DependencyInjection.Abstractions.6pgw2c1p0r.wasm",
        "integrity": "sha256-dqHWFgiauImPxBuIyDu7im/+sfQ2BuqHxUV/G5zooUg=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Localization.Abstractions.wasm",
        "name": "Microsoft.Extensions.Localization.Abstractions.43x5416kae.wasm",
        "integrity": "sha256-QEFhdsg7TnWEzcPEU8l+TOLrgSo/5QpC+w4GyyPBU0c=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Localization.wasm",
        "name": "Microsoft.Extensions.Localization.cb9bm1rbxy.wasm",
        "integrity": "sha256-GBItL26hwfzJAhfODgauXLYOIr3YdXcJum6w4k+CtuI=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Logging.Abstractions.wasm",
        "name": "Microsoft.Extensions.Logging.Abstractions.gx2wceouza.wasm",
        "integrity": "sha256-LKUAM1VCk5bSAOODtRsQLd5tYqHecivLfb6hU1P31ho=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Logging.wasm",
        "name": "Microsoft.Extensions.Logging.r2dra2oldd.wasm",
        "integrity": "sha256-DTNxE9CKAiPWTFDFl3niOH75tY1pweWfsMzIaVbhBMI=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Options.wasm",
        "name": "Microsoft.Extensions.Options.reczz9fdao.wasm",
        "integrity": "sha256-kyAfqrJomIcL1R4GSOmRZv0lB4ywJ1XcqxufZCWQzXI=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Primitives.wasm",
        "name": "Microsoft.Extensions.Primitives.7za6xlrecu.wasm",
        "integrity": "sha256-7R0sWRhKvcSoQaFmMrrXBOS1v+DUjxhETvDxEQbHVRQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.JSInterop.WebAssembly.wasm",
        "name": "Microsoft.JSInterop.WebAssembly.mrus3axuke.wasm",
        "integrity": "sha256-wmWkUz8XauAbA+eb0N0RvClESqaj+ct9V3xtGILLnp8=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.JSInterop.wasm",
        "name": "Microsoft.JSInterop.cgekk6rmh0.wasm",
        "integrity": "sha256-LCIww59ycW9eGwMq+au4gxJgb2u6bDmF8BHVXIMk68U=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "SharpCast.ModelConverter.wasm",
        "name": "SharpCast.ModelConverter.4m0aza63oq.wasm",
        "integrity": "sha256-ZFOIr6OxTXDh3lTEk7Cc63PaorNnO60PWsbqmDiTkLA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "SharpCast.Ui.wasm",
        "name": "SharpCast.Ui.mk0pckmoha.wasm",
        "integrity": "sha256-2nTLyBHxWW+SVPagILZiBDuVU/JZ/OhZG4rbnZBtee8=",
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
        "name": "System.Collections.Immutable.m1ix920jir.wasm",
        "integrity": "sha256-morQDlXgecxK4xrgPSr10OVCByhO2k4kFRAMtLT82JY=",
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
        "name": "System.Linq.o76dusf2dl.wasm",
        "integrity": "sha256-TGHMRMTPJXfInSQOFuCmOi5bIZBSR5GFoAutvemjdf8=",
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
        "name": "System.Reflection.Metadata.rvfg37qyy9.wasm",
        "integrity": "sha256-mczK/KZkpqDy7g5RqW+D8AA2zcG7g9Ot+mzKOnyYcyc=",
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
        "name": "System.Runtime.6w4gbb7ns6.wasm",
        "integrity": "sha256-OlxQbiGh/Y6/CKb7Pq8S2YtauexliDQxAT9VWG5YevI=",
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
        "name": "System.Threading.Tasks.Parallel.1chgo2e2ie.wasm",
        "integrity": "sha256-P4Q+RWujXIrRqomGGN/8hf4zUOTIBD7xhzDCmgHsu/E=",
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
          "name": "Humanizer.resources.zedlycdfyb.wasm",
          "integrity": "sha256-1SaSnEIasHnvW59xiOEEkaYfRFFCp1nALxWukICgh3g=",
          "cache": "force-cache"
        }
      ],
      "ar": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.nbjtxu7hnc.wasm",
          "integrity": "sha256-7U9b4TyuBlDBGTW2W435SJtrSuScIwr7+GBWPt37z7I=",
          "cache": "force-cache"
        }
      ],
      "az": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.7ehrn9vh86.wasm",
          "integrity": "sha256-z/tFmEPGktkIyuaDYzi9ICslGYm31c0YJfXf9h2cOQ8=",
          "cache": "force-cache"
        }
      ],
      "bg": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.cn45d0u79f.wasm",
          "integrity": "sha256-OIwyRCOQJoWiXX39JP3EqyWPKNqOcKPjJb53r+fpKUA=",
          "cache": "force-cache"
        }
      ],
      "bn": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.en5wiwwdj9.wasm",
          "integrity": "sha256-Zgl1ImWsXHKwdAfYAc2doqzNcAbCAFSylT1Lp3B9xJY=",
          "cache": "force-cache"
        }
      ],
      "ca": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.op2q7y6d69.wasm",
          "integrity": "sha256-xKCygBXb9ATADGag11NQ6puD686lHWcSQuepRWFrV9k=",
          "cache": "force-cache"
        }
      ],
      "cs": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.a918xv0ncc.wasm",
          "integrity": "sha256-XhXBnOlSgcgMoyKxNF8nyaEDYZLzG0l5G+TX0IA/UFw=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.twnsm9mflg.wasm",
          "integrity": "sha256-DSK+odmVy4U/72dM+VWe5ACOHs/qFWWexAJ7BtbT7Mg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.xfa6pu1alu.wasm",
          "integrity": "sha256-owSBVY320uiTlbt4DYYZnH4X76tZBdbWYGhiA1Sd9jo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.ix8z21lnuz.wasm",
          "integrity": "sha256-CvJq4XNNFrDbRb9aPXqfAYcFvcBxS2X0ESgAKFalqwk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.uv38xb70xb.wasm",
          "integrity": "sha256-qgIv/iIeqUxbEnQ/Bjj70eRBQ/ZzKo5gm2kxF4hg60A=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.19kzaraf2j.wasm",
          "integrity": "sha256-RUdTeKysikZvzJmLdfWhz8xz2vsYBT+WxCvM+zxhA+k=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.k2w3mhwa07.wasm",
          "integrity": "sha256-5AAoE+VEEKjOKppvnO0NXWR+FfDFviAAz6dirSZXXkc=",
          "cache": "force-cache"
        }
      ],
      "da": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.i9ryaqbx9g.wasm",
          "integrity": "sha256-el8dR1td50LcOKih18rCoHH/wy/vu7sHVrEx78uKZLA=",
          "cache": "force-cache"
        }
      ],
      "de": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.78uskj3x9s.wasm",
          "integrity": "sha256-+UeEyCA/LejLbnaE1behcDVpyjgDXBC1YaP3/ISjXW8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.qiezfgxkoi.wasm",
          "integrity": "sha256-vgzOC83AWxeAvx6JfW8Rfzx9rVDUdiGaKmSCEvAu0f0=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.f2gywvfjln.wasm",
          "integrity": "sha256-Kc4HSwAO5vK29dkOuhT//RP6bv4RFv5x3JbDaYRe/OE=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.kj79e7yk6c.wasm",
          "integrity": "sha256-cPgKz8Ta7EArIMOw4NSPMMg7sbmD7FAJ1HOWSQrg9JE=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.duhon6qcbk.wasm",
          "integrity": "sha256-q6Az8tKUDy/zuonwB0FrPxpGMpPIT3jvSTTkGtajyDo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.fr7rfz9kts.wasm",
          "integrity": "sha256-9TRG9OgsETX0LzlmmYw2KTrimnBR/pVdD4nTm983eC8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.jrul1nigrc.wasm",
          "integrity": "sha256-/ws8akfgIPA946chWhnykIj60oqzui+aI7PiBvYc9gc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.qg6lamu4mz.wasm",
          "integrity": "sha256-+lUYT0ZCm3p1XxTF0JHDPBlHKJisVNssAPr2m61/foI=",
          "cache": "force-cache"
        }
      ],
      "el": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.rlww7vroja.wasm",
          "integrity": "sha256-8Z9TJEFQWeS+TY1kD2h4jni6NY5SOMN+NGEdFFi5kNs=",
          "cache": "force-cache"
        }
      ],
      "en": [
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.uwbrm5rwo5.wasm",
          "integrity": "sha256-Di8XyrQnrVcVW4T7Ty6LyJqBlgKicbi6eflvL5O/UTc=",
          "cache": "force-cache"
        }
      ],
      "es": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.mzk5m0tsol.wasm",
          "integrity": "sha256-gp8HX/SExRYmeUaW31Ozjsf6M9rv6BJ40cDPLIWS6h8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.2fps4apfsm.wasm",
          "integrity": "sha256-rqsHaOyox/ciiTtZo5xV+9xkznWGPKgVf1p4PITQ8zQ=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.hxim79cv9u.wasm",
          "integrity": "sha256-VbQC1BlGdcNw7OQRzt+hyN9vno7v9vZ6MmmFONV9Zhk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.a60msc5gi6.wasm",
          "integrity": "sha256-nrlpOygdUMLa6mJ89lLdAWyKCu6AGBpdCQZCHQ259WQ=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.3yea7c6my1.wasm",
          "integrity": "sha256-1Z7bHjH3WePImmXj6sfzKqfREamu5gbyQBjh/B5oE6g=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.8txpr7w59n.wasm",
          "integrity": "sha256-lNHQdm2nofay47a5HX+Q5H/bT4EtLg4uOVIEilIPB0Q=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.gs17fo235q.wasm",
          "integrity": "sha256-0LPqXNHrSpxy0auus32GhLiEWOrSpOk4X3dLIi0IdWo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.41crhu3cl4.wasm",
          "integrity": "sha256-qI5DptmlrmZgtg8E226jQAg0vqdJPZvnIiksivEXqAU=",
          "cache": "force-cache"
        }
      ],
      "fa": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.v92hodnzx5.wasm",
          "integrity": "sha256-PT5A99R4MUO3xMkcu+MwGWCStKnZuzriTIAAfyeaBeM=",
          "cache": "force-cache"
        }
      ],
      "fi": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.49dopjq4dh.wasm",
          "integrity": "sha256-GN5t0pRB4TUo/MlPvJaPVb9d55hgiK8h0/JnBgYD9LI=",
          "cache": "force-cache"
        }
      ],
      "fil": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.y3y67s24ar.wasm",
          "integrity": "sha256-0pYAhl127iG8EDKNlvD/uaaBzL1EBz3OSpvXAnV5jlk=",
          "cache": "force-cache"
        }
      ],
      "fr": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.mfxijt0v7u.wasm",
          "integrity": "sha256-wsARMzGnVLgFcGmgQ87efXbKbKb3VgAoJZC+VpVG8lQ=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.1jmchu9kgf.wasm",
          "integrity": "sha256-DXYc6cSMnYEKjjlU10z4ZDKIR3rJw24PNkFQjVAg/Rc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.nxyt3ca9i7.wasm",
          "integrity": "sha256-5Tb5QIBz1A7O5D8ZZXkNEEHVO4aP/QXTkWSdh6nuiRs=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.5lyj3pleqr.wasm",
          "integrity": "sha256-JxMRkPYOhuiT1zYktyDiFZiB/6Y0GK2GkBlA0si2LQg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.0tcex13g0k.wasm",
          "integrity": "sha256-VM1zN5bZIwp9LZ2bcc9vdd0dFJaalxzx+WmTuBh6W9Y=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.0lbw7v84lk.wasm",
          "integrity": "sha256-pMUK2zqFZZojYeHAO+2dCWPDbz1/hNlDhbqZHoCZYkk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.mw7bxyd1cx.wasm",
          "integrity": "sha256-OmpuoghrvMmkX6qg0xZBDL/zieLnPaiUNXC537v5M7w=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.hssa51pv8u.wasm",
          "integrity": "sha256-vzZ7+fdqgYC8H4oeO+8cQKALOiwJdUUn/b1UFbjZ0wQ=",
          "cache": "force-cache"
        }
      ],
      "he": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.zw2mg11ga0.wasm",
          "integrity": "sha256-Q3wRKdQnsPVcIwrHrSAYdgKIvbfNPNlFULpqVPEHkaM=",
          "cache": "force-cache"
        }
      ],
      "hr": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.xsli1nload.wasm",
          "integrity": "sha256-4esb85uIBi9RUyRzg6x7yfr7l+T4WNwSWS9cncyi6Gw=",
          "cache": "force-cache"
        }
      ],
      "hu": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.5dgfte9mtk.wasm",
          "integrity": "sha256-mUVlwAoruNgYdsYF4hNUw1cANrcgqADClb3rNAfBF4I=",
          "cache": "force-cache"
        }
      ],
      "hy": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.trnumoyy15.wasm",
          "integrity": "sha256-2aliENd2ZbZ3v+WbDcdFLnrJQ2opVn1x+Kx9I4GGaIM=",
          "cache": "force-cache"
        }
      ],
      "id": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.7g4rvsxys6.wasm",
          "integrity": "sha256-ubF+ARxMjtXz1dGUJIxQTCXZxW/OwqKC1+UCDyXRg1c=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.miehj7qdhl.wasm",
          "integrity": "sha256-vrJzoFqwr/VtCLRwCxfVlTGINeqriwoBhP1JdxYL44A=",
          "cache": "force-cache"
        }
      ],
      "is": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.mtyk5olxv8.wasm",
          "integrity": "sha256-tv0PyAL/FlTTAWk5/hMzMFCV5tLfP97+m1ELY6xoYl4=",
          "cache": "force-cache"
        }
      ],
      "it": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.38kij0ihqs.wasm",
          "integrity": "sha256-HXbw64Fr0Zm/H6W6nabDSwrOqhTaErWAwp7/g01C93w=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.puwdb4kxhw.wasm",
          "integrity": "sha256-bx3tYLvEpOfMviXmUR9pUTILukdj+VBodw40bBvf7ks=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.iq2tgsxh7r.wasm",
          "integrity": "sha256-5vygcBxPavXTsMvG3TIBjKY16wX9SXdB+1IpyMYqxE4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.2hachj3qf9.wasm",
          "integrity": "sha256-+rJG2BR8xEeVztvRwvjje3MUz3pTHXtd0Aqba5waiK4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.xndxp3rbhz.wasm",
          "integrity": "sha256-bdh4tB9ULS5XLkYrwBqQ9UMdxO/Eswru3PBWPz+7MnY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.zt36s7opzu.wasm",
          "integrity": "sha256-5zBFIBWPbjFeCLw7Xsd9ZB7wdNEGLrSeZMLM8g2G+Is=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.k2wkf7t3s8.wasm",
          "integrity": "sha256-XFqlyThLxHRA7uL2blMZ5Y6Sl7Ftz8JOdtg+GTy8ItY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.o3j432rqrv.wasm",
          "integrity": "sha256-tJRVZGNaqA19R0R7L64/rz/N4HEM44j0W5lOrAih8tY=",
          "cache": "force-cache"
        }
      ],
      "ja": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.o8glpy68ka.wasm",
          "integrity": "sha256-iNk9ImXkp9+15BN69eDUaShCuC9S4G5LZ6cmWaS7Djo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.3kqyxpifwm.wasm",
          "integrity": "sha256-DaBi9Ajg2O6c13kHbmxP+7KbgS2pfZEcJnoHkoaouaY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.oqxcfypbpj.wasm",
          "integrity": "sha256-MEPSNbRhBo7LLZ0+q1/Tj1FxfRGb7r89FFzIcbtmdu4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.gmr50p933z.wasm",
          "integrity": "sha256-GG8/KLkfVGl+OvzcmBXckSvHdlt1s/b9/dok/CWvBJg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.hu86yp5g11.wasm",
          "integrity": "sha256-t9elFDHp7LGnxEocgLZRoyFx7Ey9VoAb6yie+YdycFY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.93fwyaqel7.wasm",
          "integrity": "sha256-Zf4YQmMVCxgYGqnkz9QvqZEg2kMJjsIhFEobDw/0Azk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.6ydrix4n4z.wasm",
          "integrity": "sha256-XvVDR01x6RN6BdmeIa/vY/cGPgvqliwAHfqdDzSDJLk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.fgij3tpwqy.wasm",
          "integrity": "sha256-0RTuZ2Q5ncembdx1CCxct1oUoXRRRwEQ15N6eavkQWg=",
          "cache": "force-cache"
        }
      ],
      "ko": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.0t47wlnsva.wasm",
          "integrity": "sha256-7OcGh3jmdSLgqhPs9ZfgecLfU8+ZOUwQxjxpeFUgvR0=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.bp234bdujy.wasm",
          "integrity": "sha256-ke8XtUf+4m25xP0Qs39ryCS235nJjz6WizZMBy7lNeM=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dqtqrrbrjm.wasm",
          "integrity": "sha256-BdBnJdWVGophql3s9sQzqW6bchfg8OjbbAZHnXGejmo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.vi17fpcv10.wasm",
          "integrity": "sha256-d/be6B5QR9sGqNg0iuPQ4fOVyWI/50x0IFdXKNSi/Rc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.vri9jfytj5.wasm",
          "integrity": "sha256-tUkOSWbXEV7mK7pa7UObtJKYCoVguFUMj3VRRF0xWf8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.5ocsmx07ez.wasm",
          "integrity": "sha256-JelEuFlE08AMeqsWE1PR9+jwtieO38o8hEo9z/wC39s=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.b1sticklb0.wasm",
          "integrity": "sha256-L7VVAX3VTvIgZU474lTeBHgiuQxYl6NmSzRF+cmUjnk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.jy75guktlb.wasm",
          "integrity": "sha256-i3+I9u4m61IIrWv6efvdZjCQpO8j1nhdrMJ2UEfxGio=",
          "cache": "force-cache"
        }
      ],
      "ku": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.yo7muqpv5j.wasm",
          "integrity": "sha256-jlknHYi+Ihv6DwdUjb0+qrvAhO6DD+7/8V8c4p8wjQE=",
          "cache": "force-cache"
        }
      ],
      "lb": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.ee6i8bx6rz.wasm",
          "integrity": "sha256-5pRckU4+B90PYYS/SVDi+nGw7mOae3cFEb3dspJRs6s=",
          "cache": "force-cache"
        }
      ],
      "lt": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.hfd3uxjc6c.wasm",
          "integrity": "sha256-vZhhu4aAYqodenkHD6Hq+boKMt75+5MTLFcXxgZiPa4=",
          "cache": "force-cache"
        }
      ],
      "lv": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.5ya6rwltxa.wasm",
          "integrity": "sha256-7Yc/ru497VdOl2Fm81e7HT9L8ao4CS6sHzyxGrrkRu8=",
          "cache": "force-cache"
        }
      ],
      "ms": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.h8tmx1mjla.wasm",
          "integrity": "sha256-gcKvyaA4IXh9p5OXhE+jqouxoSO9/KLiTqGBai9XwEE=",
          "cache": "force-cache"
        }
      ],
      "mt": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.oh0levnh0y.wasm",
          "integrity": "sha256-vE+kzF5806MDo6Hb0z3HUKUmhTQ535RKKtTzJtfbZLk=",
          "cache": "force-cache"
        }
      ],
      "nb": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.tf49jwkm7o.wasm",
          "integrity": "sha256-ubHfsrBBgjEuRotRiMEWYZQa3H70E/FESqyYqDPluZA=",
          "cache": "force-cache"
        }
      ],
      "nl": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.hffdzfevof.wasm",
          "integrity": "sha256-Xc46twGVOLZVC27yj/6m70/9dK1d9UHVxsLCxVc7KcU=",
          "cache": "force-cache"
        }
      ],
      "pl": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.01e6mww1cs.wasm",
          "integrity": "sha256-fN3mbIJh3ByLk2oxIa5i3ucXR724D6iBgZaMSKjmgiY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.7vgwd3747g.wasm",
          "integrity": "sha256-nVkS/MOcBS6Titt62ZcZyufKaaRWMcD5O8R46llSvRo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.s5wqb5jumu.wasm",
          "integrity": "sha256-UPSZbnzGlFMo0zVa/HJFHpAMg71T7QXE2hJOzR3Phbs=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.zschwj1wsz.wasm",
          "integrity": "sha256-E7dZG86saYEOXkgPD7VYye0CKo9C6mXsxBe5tXbrKho=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.ss5rik3zab.wasm",
          "integrity": "sha256-5JeUgRL5OsvibVYllwte6hvNm3f0yvYK7Unsnq4Ermc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.kddnrje2p6.wasm",
          "integrity": "sha256-eCr/kTEM/lEQgRTKfKtnQpXvPZM7RH7sFTQtP7yglW0=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.aozvshmubu.wasm",
          "integrity": "sha256-ptmMN4yy7w33vNswuxcAGfRZ3bU+fb+OPLTEYaDYWMc=",
          "cache": "force-cache"
        }
      ],
      "pt-BR": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.cb8w7z3gga.wasm",
          "integrity": "sha256-GPVHcJP1/kNim8ZyqbvDdxy3unbNoPweKaDIdHaJOXU=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.y8p7o1wypw.wasm",
          "integrity": "sha256-krd2UIEhG7t8HHty4nyHAljVnfn6gqzBn1We1gAFQLk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.1nstpkpk8i.wasm",
          "integrity": "sha256-PU9QBM0MrfNN5qb6TDaoyTpi4zH9mfqLq9qtsdPxjrc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.7yahgb1qkz.wasm",
          "integrity": "sha256-r/1s0lJNjXwiKvAKQ9rWibYKIrvetFlfvuYN2YPj1KY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.b85f71hxnh.wasm",
          "integrity": "sha256-OyN6udXk/9lxjF7Isgxnb9gs2svrh0/KH3NQcvTz++0=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.7y97jvbmw3.wasm",
          "integrity": "sha256-4dJOQ+FOZPLjj7cMIF6s5MlmNRJOjmLaUPO/Nn8MF7U=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.zv156ps1rf.wasm",
          "integrity": "sha256-MZ2Nk6Px9uy5e2UyGvLKtsWhfNoJpEhTF2kz0OiBbZ4=",
          "cache": "force-cache"
        }
      ],
      "pt": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.45e8r2bkz4.wasm",
          "integrity": "sha256-mOx0qvjRISky3DEZMrns7NSEibL1M3Z/bSsdEPK16zI=",
          "cache": "force-cache"
        }
      ],
      "ro": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.62k07yobko.wasm",
          "integrity": "sha256-ciu4PMFME0eT+jRkTcO91QFJHYHg09iCdQBo/RtZWoQ=",
          "cache": "force-cache"
        }
      ],
      "ru": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.3bmv893s2n.wasm",
          "integrity": "sha256-UYGSsEXrhrCsZwl0bcHkd8ioBLKDVbNyDKk6WiS4HhQ=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.6o8h5a7s2a.wasm",
          "integrity": "sha256-2rw29vx+wnLc6ays+Dr4/MfOewDWP3wE0UEaTwyh3S8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dpk6yazkd5.wasm",
          "integrity": "sha256-UaiTpeLfoLlZB7k+dztw4YOwh2R/yUY+LQ/4uE4LyDo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.0yxjgi59s5.wasm",
          "integrity": "sha256-aKWMbZD/Bcfvsr3TaMMEBt3C0niLxs09W62AuT+Umyg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.v0bbfe7ukp.wasm",
          "integrity": "sha256-j2NaN6UuUYFIjmQ7mjFbBxCP2LkKzNVEwWyPtjSySL8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.5cfnmmqxmq.wasm",
          "integrity": "sha256-ZXvqXJrbrtpzoDczhp+ACXH8FidftfRPKcEArQwL3ko=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.jrtuwdet4j.wasm",
          "integrity": "sha256-0Xnb8+I6FK+UeuOIXmECjBa2JXg6A242nqE/3WxwJ1k=",
          "cache": "force-cache"
        }
      ],
      "sk": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.ps8bz7a6q3.wasm",
          "integrity": "sha256-t19abUba6NuMpQSbLzCJHQXRDDrWkv+5kcboBu3kN2M=",
          "cache": "force-cache"
        }
      ],
      "sl": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.bm92e0dxk0.wasm",
          "integrity": "sha256-zYQJnGYFiYGc8NYfYBnDJFSbTc8caxJbBzRxLsXs5VY=",
          "cache": "force-cache"
        }
      ],
      "sr-Latn": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.pyttf29owa.wasm",
          "integrity": "sha256-8YMAkSwN0oJfYXopm10qea1XwD/Le002wKhWiUI+/54=",
          "cache": "force-cache"
        }
      ],
      "sr": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.bx6daa15xa.wasm",
          "integrity": "sha256-T2bjQVB/GTst24hStZd5s0Zq26p3ff2WxEF7V5R47Xw=",
          "cache": "force-cache"
        }
      ],
      "sv": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.tbmzd5d9tj.wasm",
          "integrity": "sha256-ycyYFMOL/tknLaaws15e0E9xhmD/ZqWmiTO6y8Qk6Pk=",
          "cache": "force-cache"
        }
      ],
      "th": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.xsmlf4ekya.wasm",
          "integrity": "sha256-T7qryYnuiyq2V0MmlWgF5dgpNyEWh3fhDIauY/fYrvo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.ayvikncfl3.wasm",
          "integrity": "sha256-QkK+fjno0bNDRWLLc5ctqB4qyg7tfnVTl7A1CGZ+Ibc=",
          "cache": "force-cache"
        }
      ],
      "tl": [
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.1oyv986e2g.wasm",
          "integrity": "sha256-QWp2Q3hjD94XZk5v5GwKexMkFnGpMlUy5wpK7FBIrXM=",
          "cache": "force-cache"
        }
      ],
      "tr": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.s0nry54gj9.wasm",
          "integrity": "sha256-tHwoYa7Wr+ToJ2r4HtCuomjY0kEtJe41WtYWzZHyQjM=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.3cpfp24kxn.wasm",
          "integrity": "sha256-A29HTkgCyRY6F4NtY01GDQfQIIktLmWoluEWSyP+A6s=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.uizefrs9ny.wasm",
          "integrity": "sha256-VmZv/UnPi7FPtmNb6KSyKSy/oT5u1RsDPKIkQNSgErg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.453oln03ka.wasm",
          "integrity": "sha256-6NbGE0e+xVJkT7LatizeNCL/5xTQi48G8D3xdyZjbyw=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.umwk8ohnvi.wasm",
          "integrity": "sha256-Nho6fJ5UDrpeYTSzu/uzpBhiQsE0y9T41j/y29hBdic=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.uphkrecjin.wasm",
          "integrity": "sha256-TvYmqtEe4SHWyXEOsAD3XkdfNFV4cvB0eac/AmDHE9Q=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.supgpk80d0.wasm",
          "integrity": "sha256-HBDpI1dSfTKUI/LMl9LtFInbN7GMcHa0u+/Q26DeFGA=",
          "cache": "force-cache"
        }
      ],
      "uk": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.qxgr29vqsw.wasm",
          "integrity": "sha256-fgTY6d0vr+Qze5ectEHC9Wr44+4jkw9N3FkWVHKjRNQ=",
          "cache": "force-cache"
        }
      ],
      "uz-Cyrl-UZ": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.sdzbae0j4h.wasm",
          "integrity": "sha256-4IkEvCJ42KFUApjiCHxO9Kxam/lGHfybiEddghQAdng=",
          "cache": "force-cache"
        }
      ],
      "uz-Latn-UZ": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.3zg54c09y9.wasm",
          "integrity": "sha256-L1kACUIHNfE3zMjuXOwNaKNF3l08whSxo6Uv+Vjm85I=",
          "cache": "force-cache"
        }
      ],
      "vi": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.y9x9ncb6vx.wasm",
          "integrity": "sha256-SpidJ9dJE1KY7H+GJemj72gJ9/iWagxvShBFes4sChY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.jdotvcmh74.wasm",
          "integrity": "sha256-WRB8RDwieU/bKCg8Q4gvuF0jIQB6irUtg5uRxAqUcDY=",
          "cache": "force-cache"
        }
      ],
      "zh-CN": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.zpgmsw7mzt.wasm",
          "integrity": "sha256-2fXj75ck/ObHUIOpcRsz9EWU53EMn4HfWdzr5QSB9yo=",
          "cache": "force-cache"
        }
      ],
      "zh-Hans": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.bg0l3i54ck.wasm",
          "integrity": "sha256-dU9EyXYGZK3xhZnOv1eR+PkPvjRMLWaa9XJ4M27D4QE=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.fs88kym2we.wasm",
          "integrity": "sha256-geU/R390Fg/DPw4EbOze7yy5TVnti6+PVJmex0ZSbSo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.hx2jjh9mf9.wasm",
          "integrity": "sha256-a4OiCzt7JbjlbHS49JCgCY88sQLiif7HS9hKIfUKj7s=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.gbijbf25ij.wasm",
          "integrity": "sha256-fMp6Y/UTCnVuz9F/diZo/iD9K3EPL1K0ps869HvJrIc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.79zy19plb4.wasm",
          "integrity": "sha256-BeR+mcoX6merz2aRAariIdPIv05U5ngQbnQuFgjM7Jc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.7horqp1cux.wasm",
          "integrity": "sha256-Vd3bxvKNtYGElc5RwOQP4bi9g2XzFt6OAu0l1EhrE/Q=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.uoqbwu4d5d.wasm",
          "integrity": "sha256-3jN67QIzaCYlN25M3byvmhrUypuE8F57E786mKscmB8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.Ui.resources.wasm",
          "name": "SharpCast.Ui.resources.kfpqgts8n5.wasm",
          "integrity": "sha256-QGfUQ3tGqW9tuPEzqMjSZwRTQlplQVqGlEDI/BbMvYI=",
          "cache": "force-cache"
        }
      ],
      "zh-Hant": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.wnrtortf6t.wasm",
          "integrity": "sha256-TCXgCqjmMOst2Ide3RgjX1bcnWEmhy3etHvlbp1Rne0=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.ra50fj1r2c.wasm",
          "integrity": "sha256-04XcBRjXn+IKppX5jACWNYk2wDXqH86RMNi7pcWjeEY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.nlbexjoxba.wasm",
          "integrity": "sha256-xSB7bMK5Y8KOYtZjBTJ+ysPnxrkmH/a0TcaQmldtABY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.umvqfgpaxf.wasm",
          "integrity": "sha256-puEhRs38bllKTmOzKiMD30wxemHc2JFStJD6x517FLQ=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.3snf57yw91.wasm",
          "integrity": "sha256-I+faSZQeRQFN2BzixxJuBuUjWMqF160ffFHjb1yOvlE=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.hz9zb8k7nm.wasm",
          "integrity": "sha256-s9fnrOJAkwfS27dcYcdKwBrg2SNKfPa97nG8zVjmqGU=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.cw5kdl8sc3.wasm",
          "integrity": "sha256-3Hv6IJP0lj56wSIUL0jYPDINIz1sLup1I5Tt9uwIlGU=",
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
