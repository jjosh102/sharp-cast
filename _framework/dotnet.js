//! Licensed to the .NET Foundation under one or more agreements.
//! The .NET Foundation licenses this file to you under the MIT license.

var e=!1;const t=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,8,1,6,0,6,64,25,11,11])),o=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,15,1,13,0,65,1,253,15,65,2,253,15,253,128,2,11])),n=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11])),r=Symbol.for("wasm promise_control");function i(e,t){let o=null;const n=new Promise((function(n,r){o={isDone:!1,promise:null,resolve:t=>{o.isDone||(o.isDone=!0,n(t),e&&e())},reject:e=>{o.isDone||(o.isDone=!0,r(e),t&&t())}}}));o.promise=n;const i=n;return i[r]=o,{promise:i,promise_control:o}}function s(e){return e[r]}function a(e){e&&function(e){return void 0!==e[r]}(e)||Be(!1,"Promise is not controllable")}const l="__mono_message__",c=["debug","log","trace","warn","info","error"],d="MONO_WASM: ";let u,f,m,g,p,h;function w(e){g=e}function b(e){if(Pe.diagnosticTracing){const t="function"==typeof e?e():e;console.debug(d+t)}}function y(e,...t){console.info(d+e,...t)}function v(e,...t){console.info(e,...t)}function E(e,...t){console.warn(d+e,...t)}function _(e,...t){if(t&&t.length>0&&t[0]&&"object"==typeof t[0]){if(t[0].silent)return;if(t[0].toString)return void console.error(d+e,t[0].toString())}console.error(d+e,...t)}function x(e,t,o){return function(...n){try{let r=n[0];if(void 0===r)r="undefined";else if(null===r)r="null";else if("function"==typeof r)r=r.toString();else if("string"!=typeof r)try{r=JSON.stringify(r)}catch(e){r=r.toString()}t(o?JSON.stringify({method:e,payload:r,arguments:n.slice(1)}):[e+r,...n.slice(1)])}catch(e){m.error(`proxyConsole failed: ${e}`)}}}function j(e,t,o){f=t,g=e,m={...t};const n=`${o}/console`.replace("https://","wss://").replace("http://","ws://");u=new WebSocket(n),u.addEventListener("error",A),u.addEventListener("close",S),function(){for(const e of c)f[e]=x(`console.${e}`,T,!0)}()}function R(e){let t=30;const o=()=>{u?0==u.bufferedAmount||0==t?(e&&v(e),function(){for(const e of c)f[e]=x(`console.${e}`,m.log,!1)}(),u.removeEventListener("error",A),u.removeEventListener("close",S),u.close(1e3,e),u=void 0):(t--,globalThis.setTimeout(o,100)):e&&m&&m.log(e)};o()}function T(e){u&&u.readyState===WebSocket.OPEN?u.send(e):m.log(e)}function A(e){m.error(`[${g}] proxy console websocket error: ${e}`,e)}function S(e){m.debug(`[${g}] proxy console websocket closed: ${e}`,e)}function D(){Pe.preferredIcuAsset=O(Pe.config);let e="invariant"==Pe.config.globalizationMode;if(!e)if(Pe.preferredIcuAsset)Pe.diagnosticTracing&&b("ICU data archive(s) available, disabling invariant mode");else{if("custom"===Pe.config.globalizationMode||"all"===Pe.config.globalizationMode||"sharded"===Pe.config.globalizationMode){const e="invariant globalization mode is inactive and no ICU data archives are available";throw _(`ERROR: ${e}`),new Error(e)}Pe.diagnosticTracing&&b("ICU data archive(s) not available, using invariant globalization mode"),e=!0,Pe.preferredIcuAsset=null}const t="DOTNET_SYSTEM_GLOBALIZATION_INVARIANT",o=Pe.config.environmentVariables;if(void 0===o[t]&&e&&(o[t]="1"),void 0===o.TZ)try{const e=Intl.DateTimeFormat().resolvedOptions().timeZone||null;e&&(o.TZ=e)}catch(e){y("failed to detect timezone, will fallback to UTC")}}function O(e){var t;if((null===(t=e.resources)||void 0===t?void 0:t.icu)&&"invariant"!=e.globalizationMode){const t=e.applicationCulture||(ke?globalThis.navigator&&globalThis.navigator.languages&&globalThis.navigator.languages[0]:Intl.DateTimeFormat().resolvedOptions().locale),o=e.resources.icu;let n=null;if("custom"===e.globalizationMode){if(o.length>=1)return o[0].name}else t&&"all"!==e.globalizationMode?"sharded"===e.globalizationMode&&(n=function(e){const t=e.split("-")[0];return"en"===t||["fr","fr-FR","it","it-IT","de","de-DE","es","es-ES"].includes(e)?"icudt_EFIGS.dat":["zh","ko","ja"].includes(t)?"icudt_CJK.dat":"icudt_no_CJK.dat"}(t)):n="icudt.dat";if(n)for(let e=0;e<o.length;e++){const t=o[e];if(t.virtualPath===n)return t.name}}return e.globalizationMode="invariant",null}(new Date).valueOf();const C=class{constructor(e){this.url=e}toString(){return this.url}};async function k(e,t){try{const o="function"==typeof globalThis.fetch;if(Se){const n=e.startsWith("file://");if(!n&&o)return globalThis.fetch(e,t||{credentials:"same-origin"});p||(h=Ne.require("url"),p=Ne.require("fs")),n&&(e=h.fileURLToPath(e));const r=await p.promises.readFile(e);return{ok:!0,headers:{length:0,get:()=>null},url:e,arrayBuffer:()=>r,json:()=>JSON.parse(r),text:()=>{throw new Error("NotImplementedException")}}}if(o)return globalThis.fetch(e,t||{credentials:"same-origin"});if("function"==typeof read)return{ok:!0,url:e,headers:{length:0,get:()=>null},arrayBuffer:()=>new Uint8Array(read(e,"binary")),json:()=>JSON.parse(read(e,"utf8")),text:()=>read(e,"utf8")}}catch(t){return{ok:!1,url:e,status:500,headers:{length:0,get:()=>null},statusText:"ERR28: "+t,arrayBuffer:()=>{throw t},json:()=>{throw t},text:()=>{throw t}}}throw new Error("No fetch implementation available")}function I(e){return"string"!=typeof e&&Be(!1,"url must be a string"),!M(e)&&0!==e.indexOf("./")&&0!==e.indexOf("../")&&globalThis.URL&&globalThis.document&&globalThis.document.baseURI&&(e=new URL(e,globalThis.document.baseURI).toString()),e}const U=/^[a-zA-Z][a-zA-Z\d+\-.]*?:\/\//,P=/[a-zA-Z]:[\\/]/;function M(e){return Se||Ie?e.startsWith("/")||e.startsWith("\\")||-1!==e.indexOf("///")||P.test(e):U.test(e)}let L,N=0;const $=[],z=[],W=new Map,F={"js-module-threads":!0,"js-module-runtime":!0,"js-module-dotnet":!0,"js-module-native":!0,"js-module-diagnostics":!0},B={...F,"js-module-library-initializer":!0},V={...F,dotnetwasm:!0,heap:!0,manifest:!0},q={...B,manifest:!0},H={...B,dotnetwasm:!0},J={dotnetwasm:!0,symbols:!0},Z={...B,dotnetwasm:!0,symbols:!0},Q={symbols:!0};function G(e){return!("icu"==e.behavior&&e.name!=Pe.preferredIcuAsset)}function K(e,t,o){null!=t||(t=[]),Be(1==t.length,`Expect to have one ${o} asset in resources`);const n=t[0];return n.behavior=o,X(n),e.push(n),n}function X(e){V[e.behavior]&&W.set(e.behavior,e)}function Y(e){Be(V[e],`Unknown single asset behavior ${e}`);const t=W.get(e);if(t&&!t.resolvedUrl)if(t.resolvedUrl=Pe.locateFile(t.name),F[t.behavior]){const e=ge(t);e?("string"!=typeof e&&Be(!1,"loadBootResource response for 'dotnetjs' type should be a URL string"),t.resolvedUrl=e):t.resolvedUrl=ce(t.resolvedUrl,t.behavior)}else if("dotnetwasm"!==t.behavior)throw new Error(`Unknown single asset behavior ${e}`);return t}function ee(e){const t=Y(e);return Be(t,`Single asset for ${e} not found`),t}let te=!1;async function oe(){if(!te){te=!0,Pe.diagnosticTracing&&b("mono_download_assets");try{const e=[],t=[],o=(e,t)=>{!Z[e.behavior]&&G(e)&&Pe.expected_instantiated_assets_count++,!H[e.behavior]&&G(e)&&(Pe.expected_downloaded_assets_count++,t.push(se(e)))};for(const t of $)o(t,e);for(const e of z)o(e,t);Pe.allDownloadsQueued.promise_control.resolve(),Promise.all([...e,...t]).then((()=>{Pe.allDownloadsFinished.promise_control.resolve()})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e})),await Pe.runtimeModuleLoaded.promise;const n=async e=>{const t=await e;if(t.buffer){if(!Z[t.behavior]){t.buffer&&"object"==typeof t.buffer||Be(!1,"asset buffer must be array-like or buffer-like or promise of these"),"string"!=typeof t.resolvedUrl&&Be(!1,"resolvedUrl must be string");const e=t.resolvedUrl,o=await t.buffer,n=new Uint8Array(o);pe(t),await Ue.beforeOnRuntimeInitialized.promise,Ue.instantiate_asset(t,e,n)}}else J[t.behavior]?("symbols"===t.behavior&&(await Ue.instantiate_symbols_asset(t),pe(t)),J[t.behavior]&&++Pe.actual_downloaded_assets_count):(t.isOptional||Be(!1,"Expected asset to have the downloaded buffer"),!H[t.behavior]&&G(t)&&Pe.expected_downloaded_assets_count--,!Z[t.behavior]&&G(t)&&Pe.expected_instantiated_assets_count--)},r=[],i=[];for(const t of e)r.push(n(t));for(const e of t)i.push(n(e));Promise.all(r).then((()=>{Ce||Ue.coreAssetsInMemory.promise_control.resolve()})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e})),Promise.all(i).then((async()=>{Ce||(await Ue.coreAssetsInMemory.promise,Ue.allAssetsInMemory.promise_control.resolve())})).catch((e=>{throw Pe.err("Error in mono_download_assets: "+e),Xe(1,e),e}))}catch(e){throw Pe.err("Error in mono_download_assets: "+e),e}}}let ne=!1;function re(){if(ne)return;ne=!0;const e=Pe.config,t=[];if(e.assets)for(const t of e.assets)"object"!=typeof t&&Be(!1,`asset must be object, it was ${typeof t} : ${t}`),"string"!=typeof t.behavior&&Be(!1,"asset behavior must be known string"),"string"!=typeof t.name&&Be(!1,"asset name must be string"),t.resolvedUrl&&"string"!=typeof t.resolvedUrl&&Be(!1,"asset resolvedUrl could be string"),t.hash&&"string"!=typeof t.hash&&Be(!1,"asset resolvedUrl could be string"),t.pendingDownload&&"object"!=typeof t.pendingDownload&&Be(!1,"asset pendingDownload could be object"),t.isCore?$.push(t):z.push(t),X(t);else if(e.resources){const o=e.resources;o.wasmNative||Be(!1,"resources.wasmNative must be defined"),o.jsModuleNative||Be(!1,"resources.jsModuleNative must be defined"),o.jsModuleRuntime||Be(!1,"resources.jsModuleRuntime must be defined"),K(z,o.wasmNative,"dotnetwasm"),K(t,o.jsModuleNative,"js-module-native"),K(t,o.jsModuleRuntime,"js-module-runtime"),o.jsModuleDiagnostics&&K(t,o.jsModuleDiagnostics,"js-module-diagnostics");const n=(e,t,o)=>{const n=e;n.behavior=t,o?(n.isCore=!0,$.push(n)):z.push(n)};if(o.coreAssembly)for(let e=0;e<o.coreAssembly.length;e++)n(o.coreAssembly[e],"assembly",!0);if(o.assembly)for(let e=0;e<o.assembly.length;e++)n(o.assembly[e],"assembly",!o.coreAssembly);if(0!=e.debugLevel&&Pe.isDebuggingSupported()){if(o.corePdb)for(let e=0;e<o.corePdb.length;e++)n(o.corePdb[e],"pdb",!0);if(o.pdb)for(let e=0;e<o.pdb.length;e++)n(o.pdb[e],"pdb",!o.corePdb)}if(e.loadAllSatelliteResources&&o.satelliteResources)for(const e in o.satelliteResources)for(let t=0;t<o.satelliteResources[e].length;t++){const r=o.satelliteResources[e][t];r.culture=e,n(r,"resource",!o.coreAssembly)}if(o.coreVfs)for(let e=0;e<o.coreVfs.length;e++)n(o.coreVfs[e],"vfs",!0);if(o.vfs)for(let e=0;e<o.vfs.length;e++)n(o.vfs[e],"vfs",!o.coreVfs);const r=O(e);if(r&&o.icu)for(let e=0;e<o.icu.length;e++){const t=o.icu[e];t.name===r&&n(t,"icu",!1)}if(o.wasmSymbols)for(let e=0;e<o.wasmSymbols.length;e++)n(o.wasmSymbols[e],"symbols",!1)}if(e.appsettings)for(let t=0;t<e.appsettings.length;t++){const o=e.appsettings[t],n=he(o);"appsettings.json"!==n&&n!==`appsettings.${e.applicationEnvironment}.json`||z.push({name:o,behavior:"vfs",cache:"no-cache",useCredentials:!0})}e.assets=[...$,...z,...t]}async function ie(e){const t=await se(e);return await t.pendingDownloadInternal.response,t.buffer}async function se(e){try{return await ae(e)}catch(t){if(!Pe.enableDownloadRetry)throw t;if(Ie||Se)throw t;if(e.pendingDownload&&e.pendingDownloadInternal==e.pendingDownload)throw t;if(e.resolvedUrl&&-1!=e.resolvedUrl.indexOf("file://"))throw t;if(t&&404==t.status)throw t;e.pendingDownloadInternal=void 0,await Pe.allDownloadsQueued.promise;try{return Pe.diagnosticTracing&&b(`Retrying download '${e.name}'`),await ae(e)}catch(t){return e.pendingDownloadInternal=void 0,await new Promise((e=>globalThis.setTimeout(e,100))),Pe.diagnosticTracing&&b(`Retrying download (2) '${e.name}' after delay`),await ae(e)}}}async function ae(e){for(;L;)await L.promise;try{++N,N==Pe.maxParallelDownloads&&(Pe.diagnosticTracing&&b("Throttling further parallel downloads"),L=i());const t=await async function(e){if(e.pendingDownload&&(e.pendingDownloadInternal=e.pendingDownload),e.pendingDownloadInternal&&e.pendingDownloadInternal.response)return e.pendingDownloadInternal.response;if(e.buffer){const t=await e.buffer;return e.resolvedUrl||(e.resolvedUrl="undefined://"+e.name),e.pendingDownloadInternal={url:e.resolvedUrl,name:e.name,response:Promise.resolve({ok:!0,arrayBuffer:()=>t,json:()=>JSON.parse(new TextDecoder("utf-8").decode(t)),text:()=>{throw new Error("NotImplementedException")},headers:{get:()=>{}}})},e.pendingDownloadInternal.response}const t=e.loadRemote&&Pe.config.remoteSources?Pe.config.remoteSources:[""];let o;for(let n of t){n=n.trim(),"./"===n&&(n="");const t=le(e,n);e.name===t?Pe.diagnosticTracing&&b(`Attempting to download '${t}'`):Pe.diagnosticTracing&&b(`Attempting to download '${t}' for ${e.name}`);try{e.resolvedUrl=t;const n=fe(e);if(e.pendingDownloadInternal=n,o=await n.response,!o||!o.ok)continue;return o}catch(e){o||(o={ok:!1,url:t,status:0,statusText:""+e});continue}}const n=e.isOptional||e.name.match(/\.pdb$/)&&Pe.config.ignorePdbLoadErrors;if(o||Be(!1,`Response undefined ${e.name}`),!n){const t=new Error(`download '${o.url}' for ${e.name} failed ${o.status} ${o.statusText}`);throw t.status=o.status,t}y(`optional download '${o.url}' for ${e.name} failed ${o.status} ${o.statusText}`)}(e);return t?(J[e.behavior]||(e.buffer=await t.arrayBuffer(),++Pe.actual_downloaded_assets_count),e):e}finally{if(--N,L&&N==Pe.maxParallelDownloads-1){Pe.diagnosticTracing&&b("Resuming more parallel downloads");const e=L;L=void 0,e.promise_control.resolve()}}}function le(e,t){let o;return null==t&&Be(!1,`sourcePrefix must be provided for ${e.name}`),e.resolvedUrl?o=e.resolvedUrl:(o=""===t?"assembly"===e.behavior||"pdb"===e.behavior?e.name:"resource"===e.behavior&&e.culture&&""!==e.culture?`${e.culture}/${e.name}`:e.name:t+e.name,o=ce(Pe.locateFile(o),e.behavior)),o&&"string"==typeof o||Be(!1,"attemptUrl need to be path or url string"),o}function ce(e,t){return Pe.modulesUniqueQuery&&q[t]&&(e+=Pe.modulesUniqueQuery),e}let de=0;const ue=new Set;function fe(e){try{e.resolvedUrl||Be(!1,"Request's resolvedUrl must be set");const t=function(e){let t=e.resolvedUrl;if(Pe.loadBootResource){const o=ge(e);if(o instanceof Promise)return o;"string"==typeof o&&(t=o)}const o={};return e.cache?o.cache=e.cache:Pe.config.disableNoCacheFetch||(o.cache="no-cache"),e.useCredentials?o.credentials="include":!Pe.config.disableIntegrityCheck&&e.hash&&(o.integrity=e.hash),Pe.fetch_like(t,o)}(e),o={name:e.name,url:e.resolvedUrl,response:t};return ue.add(e.name),o.response.then((()=>{"assembly"==e.behavior&&Pe.loadedAssemblies.push(e.name),de++,Pe.onDownloadResourceProgress&&Pe.onDownloadResourceProgress(de,ue.size)})),o}catch(t){const o={ok:!1,url:e.resolvedUrl,status:500,statusText:"ERR29: "+t,arrayBuffer:()=>{throw t},json:()=>{throw t}};return{name:e.name,url:e.resolvedUrl,response:Promise.resolve(o)}}}const me={resource:"assembly",assembly:"assembly",pdb:"pdb",icu:"globalization",vfs:"configuration",manifest:"manifest",dotnetwasm:"dotnetwasm","js-module-dotnet":"dotnetjs","js-module-native":"dotnetjs","js-module-runtime":"dotnetjs","js-module-threads":"dotnetjs"};function ge(e){var t;if(Pe.loadBootResource){const o=null!==(t=e.hash)&&void 0!==t?t:"",n=e.resolvedUrl,r=me[e.behavior];if(r){const t=Pe.loadBootResource(r,e.name,n,o,e.behavior);return"string"==typeof t?I(t):t}}}function pe(e){e.pendingDownloadInternal=null,e.pendingDownload=null,e.buffer=null,e.moduleExports=null}function he(e){let t=e.lastIndexOf("/");return t>=0&&t++,e.substring(t)}async function we(e){e&&await Promise.all((null!=e?e:[]).map((e=>async function(e){try{const t=e.name;if(!e.moduleExports){const o=ce(Pe.locateFile(t),"js-module-library-initializer");Pe.diagnosticTracing&&b(`Attempting to import '${o}' for ${e}`),e.moduleExports=await import(/*! webpackIgnore: true */o)}Pe.libraryInitializers.push({scriptName:t,exports:e.moduleExports})}catch(t){E(`Failed to import library initializer '${e}': ${t}`)}}(e))))}async function be(e,t){if(!Pe.libraryInitializers)return;const o=[];for(let n=0;n<Pe.libraryInitializers.length;n++){const r=Pe.libraryInitializers[n];r.exports[e]&&o.push(ye(r.scriptName,e,(()=>r.exports[e](...t))))}await Promise.all(o)}async function ye(e,t,o){try{await o()}catch(o){throw E(`Failed to invoke '${t}' on library initializer '${e}': ${o}`),Xe(1,o),o}}function ve(e,t){if(e===t)return e;const o={...t};return void 0!==o.assets&&o.assets!==e.assets&&(o.assets=[...e.assets||[],...o.assets||[]]),void 0!==o.resources&&(o.resources=_e(e.resources||{assembly:[],jsModuleNative:[],jsModuleRuntime:[],wasmNative:[]},o.resources)),void 0!==o.environmentVariables&&(o.environmentVariables={...e.environmentVariables||{},...o.environmentVariables||{}}),void 0!==o.runtimeOptions&&o.runtimeOptions!==e.runtimeOptions&&(o.runtimeOptions=[...e.runtimeOptions||[],...o.runtimeOptions||[]]),Object.assign(e,o)}function Ee(e,t){if(e===t)return e;const o={...t};return o.config&&(e.config||(e.config={}),o.config=ve(e.config,o.config)),Object.assign(e,o)}function _e(e,t){if(e===t)return e;const o={...t};return void 0!==o.coreAssembly&&(o.coreAssembly=[...e.coreAssembly||[],...o.coreAssembly||[]]),void 0!==o.assembly&&(o.assembly=[...e.assembly||[],...o.assembly||[]]),void 0!==o.lazyAssembly&&(o.lazyAssembly=[...e.lazyAssembly||[],...o.lazyAssembly||[]]),void 0!==o.corePdb&&(o.corePdb=[...e.corePdb||[],...o.corePdb||[]]),void 0!==o.pdb&&(o.pdb=[...e.pdb||[],...o.pdb||[]]),void 0!==o.jsModuleWorker&&(o.jsModuleWorker=[...e.jsModuleWorker||[],...o.jsModuleWorker||[]]),void 0!==o.jsModuleNative&&(o.jsModuleNative=[...e.jsModuleNative||[],...o.jsModuleNative||[]]),void 0!==o.jsModuleDiagnostics&&(o.jsModuleDiagnostics=[...e.jsModuleDiagnostics||[],...o.jsModuleDiagnostics||[]]),void 0!==o.jsModuleRuntime&&(o.jsModuleRuntime=[...e.jsModuleRuntime||[],...o.jsModuleRuntime||[]]),void 0!==o.wasmSymbols&&(o.wasmSymbols=[...e.wasmSymbols||[],...o.wasmSymbols||[]]),void 0!==o.wasmNative&&(o.wasmNative=[...e.wasmNative||[],...o.wasmNative||[]]),void 0!==o.icu&&(o.icu=[...e.icu||[],...o.icu||[]]),void 0!==o.satelliteResources&&(o.satelliteResources=function(e,t){if(e===t)return e;for(const o in t)e[o]=[...e[o]||[],...t[o]||[]];return e}(e.satelliteResources||{},o.satelliteResources||{})),void 0!==o.modulesAfterConfigLoaded&&(o.modulesAfterConfigLoaded=[...e.modulesAfterConfigLoaded||[],...o.modulesAfterConfigLoaded||[]]),void 0!==o.modulesAfterRuntimeReady&&(o.modulesAfterRuntimeReady=[...e.modulesAfterRuntimeReady||[],...o.modulesAfterRuntimeReady||[]]),void 0!==o.extensions&&(o.extensions={...e.extensions||{},...o.extensions||{}}),void 0!==o.vfs&&(o.vfs=[...e.vfs||[],...o.vfs||[]]),Object.assign(e,o)}function xe(){const e=Pe.config;if(e.environmentVariables=e.environmentVariables||{},e.runtimeOptions=e.runtimeOptions||[],e.resources=e.resources||{assembly:[],jsModuleNative:[],jsModuleWorker:[],jsModuleRuntime:[],wasmNative:[],vfs:[],satelliteResources:{}},e.assets){Pe.diagnosticTracing&&b("config.assets is deprecated, use config.resources instead");for(const t of e.assets){const o={};switch(t.behavior){case"assembly":o.assembly=[t];break;case"pdb":o.pdb=[t];break;case"resource":o.satelliteResources={},o.satelliteResources[t.culture]=[t];break;case"icu":o.icu=[t];break;case"symbols":o.wasmSymbols=[t];break;case"vfs":o.vfs=[t];break;case"dotnetwasm":o.wasmNative=[t];break;case"js-module-threads":o.jsModuleWorker=[t];break;case"js-module-runtime":o.jsModuleRuntime=[t];break;case"js-module-native":o.jsModuleNative=[t];break;case"js-module-diagnostics":o.jsModuleDiagnostics=[t];break;case"js-module-dotnet":break;default:throw new Error(`Unexpected behavior ${t.behavior} of asset ${t.name}`)}_e(e.resources,o)}}e.debugLevel,e.applicationEnvironment||(e.applicationEnvironment="Production"),e.applicationCulture&&(e.environmentVariables.LANG=`${e.applicationCulture}.UTF-8`),Ue.diagnosticTracing=Pe.diagnosticTracing=!!e.diagnosticTracing,Ue.waitForDebugger=e.waitForDebugger,Pe.maxParallelDownloads=e.maxParallelDownloads||Pe.maxParallelDownloads,Pe.enableDownloadRetry=void 0!==e.enableDownloadRetry?e.enableDownloadRetry:Pe.enableDownloadRetry}let je=!1;async function Re(e){var t;if(je)return void await Pe.afterConfigLoaded.promise;let o;try{if(e.configSrc||Pe.config&&0!==Object.keys(Pe.config).length&&(Pe.config.assets||Pe.config.resources)||(e.configSrc="dotnet.boot.js"),o=e.configSrc,je=!0,o&&(Pe.diagnosticTracing&&b("mono_wasm_load_config"),await async function(e){const t=e.configSrc,o=Pe.locateFile(t);let n=null;void 0!==Pe.loadBootResource&&(n=Pe.loadBootResource("manifest",t,o,"","manifest"));let r,i=null;if(n)if("string"==typeof n)n.includes(".json")?(i=await s(I(n)),r=await Ae(i)):r=(await import(I(n))).config;else{const e=await n;"function"==typeof e.json?(i=e,r=await Ae(i)):r=e.config}else o.includes(".json")?(i=await s(ce(o,"manifest")),r=await Ae(i)):r=(await import(ce(o,"manifest"))).config;function s(e){return Pe.fetch_like(e,{method:"GET",credentials:"include",cache:"no-cache"})}Pe.config.applicationEnvironment&&(r.applicationEnvironment=Pe.config.applicationEnvironment),ve(Pe.config,r)}(e)),xe(),await we(null===(t=Pe.config.resources)||void 0===t?void 0:t.modulesAfterConfigLoaded),await be("onRuntimeConfigLoaded",[Pe.config]),e.onConfigLoaded)try{await e.onConfigLoaded(Pe.config,Le),xe()}catch(e){throw _("onConfigLoaded() failed",e),e}xe(),Pe.afterConfigLoaded.promise_control.resolve(Pe.config)}catch(t){const n=`Failed to load config file ${o} ${t} ${null==t?void 0:t.stack}`;throw Pe.config=e.config=Object.assign(Pe.config,{message:n,error:t,isError:!0}),Xe(1,new Error(n)),t}}function Te(){return!!globalThis.navigator&&(Pe.isChromium||Pe.isFirefox)}async function Ae(e){const t=Pe.config,o=await e.json();t.applicationEnvironment||o.applicationEnvironment||(o.applicationEnvironment=e.headers.get("Blazor-Environment")||e.headers.get("DotNet-Environment")||void 0),o.environmentVariables||(o.environmentVariables={});const n=e.headers.get("DOTNET-MODIFIABLE-ASSEMBLIES");n&&(o.environmentVariables.DOTNET_MODIFIABLE_ASSEMBLIES=n);const r=e.headers.get("ASPNETCORE-BROWSER-TOOLS");return r&&(o.environmentVariables.__ASPNETCORE_BROWSER_TOOLS=r),o}"function"!=typeof importScripts||globalThis.onmessage||(globalThis.dotnetSidecar=!0);const Se="object"==typeof process&&"object"==typeof process.versions&&"string"==typeof process.versions.node,De="function"==typeof importScripts,Oe=De&&"undefined"!=typeof dotnetSidecar,Ce=De&&!Oe,ke="object"==typeof window||De&&!Se,Ie=!ke&&!Se;let Ue={},Pe={},Me={},Le={},Ne={},$e=!1;const ze={},We={config:ze},Fe={mono:{},binding:{},internal:Ne,module:We,loaderHelpers:Pe,runtimeHelpers:Ue,diagnosticHelpers:Me,api:Le};function Be(e,t){if(e)return;const o="Assert failed: "+("function"==typeof t?t():t),n=new Error(o);_(o,n),Ue.nativeAbort(n)}function Ve(){return void 0!==Pe.exitCode}function qe(){return Ue.runtimeReady&&!Ve()}function He(){Ve()&&Be(!1,`.NET runtime already exited with ${Pe.exitCode} ${Pe.exitReason}. You can use runtime.runMain() which doesn't exit the runtime.`),Ue.runtimeReady||Be(!1,".NET runtime didn't start yet. Please call dotnet.create() first.")}function Je(){ke&&(globalThis.addEventListener("unhandledrejection",et),globalThis.addEventListener("error",tt))}let Ze,Qe;function Ge(e){Qe&&Qe(e),Xe(e,Pe.exitReason)}function Ke(e){Ze&&Ze(e||Pe.exitReason),Xe(1,e||Pe.exitReason)}function Xe(t,o){var n,r;const i=o&&"object"==typeof o;t=i&&"number"==typeof o.status?o.status:void 0===t?-1:t;const s=i&&"string"==typeof o.message?o.message:""+o;(o=i?o:Ue.ExitStatus?function(e,t){const o=new Ue.ExitStatus(e);return o.message=t,o.toString=()=>t,o}(t,s):new Error("Exit with code "+t+" "+s)).status=t,o.message||(o.message=s);const a=""+(o.stack||(new Error).stack);try{Object.defineProperty(o,"stack",{get:()=>a})}catch(e){}const l=!!o.silent;if(o.silent=!0,Ve())Pe.diagnosticTracing&&b("mono_exit called after exit");else{try{We.onAbort==Ke&&(We.onAbort=Ze),We.onExit==Ge&&(We.onExit=Qe),ke&&(globalThis.removeEventListener("unhandledrejection",et),globalThis.removeEventListener("error",tt)),Ue.runtimeReady?(Ue.jiterpreter_dump_stats&&Ue.jiterpreter_dump_stats(!1),0===t&&(null===(n=Pe.config)||void 0===n?void 0:n.interopCleanupOnExit)&&Ue.forceDisposeProxies(!0,!0),e&&0!==t&&(null===(r=Pe.config)||void 0===r||r.dumpThreadsOnNonZeroExit)):(Pe.diagnosticTracing&&b(`abort_startup, reason: ${o}`),function(e){Pe.allDownloadsQueued.promise_control.reject(e),Pe.allDownloadsFinished.promise_control.reject(e),Pe.afterConfigLoaded.promise_control.reject(e),Pe.wasmCompilePromise.promise_control.reject(e),Pe.runtimeModuleLoaded.promise_control.reject(e),Ue.dotnetReady&&(Ue.dotnetReady.promise_control.reject(e),Ue.afterInstantiateWasm.promise_control.reject(e),Ue.beforePreInit.promise_control.reject(e),Ue.afterPreInit.promise_control.reject(e),Ue.afterPreRun.promise_control.reject(e),Ue.beforeOnRuntimeInitialized.promise_control.reject(e),Ue.afterOnRuntimeInitialized.promise_control.reject(e),Ue.afterPostRun.promise_control.reject(e))}(o))}catch(e){E("mono_exit A failed",e)}try{l||(function(e,t){if(0!==e&&t){const e=Ue.ExitStatus&&t instanceof Ue.ExitStatus?b:_;"string"==typeof t?e(t):(void 0===t.stack&&(t.stack=(new Error).stack+""),t.message?e(Ue.stringify_as_error_with_stack?Ue.stringify_as_error_with_stack(t.message+"\n"+t.stack):t.message+"\n"+t.stack):e(JSON.stringify(t)))}!Ce&&Pe.config&&(Pe.config.logExitCode?Pe.config.forwardConsoleLogsToWS?R("WASM EXIT "+e):v("WASM EXIT "+e):Pe.config.forwardConsoleLogsToWS&&R())}(t,o),function(e){if(ke&&!Ce&&Pe.config&&Pe.config.appendElementOnExit&&document){const t=document.createElement("label");t.id="tests_done",0!==e&&(t.style.background="red"),t.innerHTML=""+e,document.body.appendChild(t)}}(t))}catch(e){E("mono_exit B failed",e)}Pe.exitCode=t,Pe.exitReason||(Pe.exitReason=o),!Ce&&Ue.runtimeReady&&We.runtimeKeepalivePop()}if(Pe.config&&Pe.config.asyncFlushOnExit&&0===t)throw(async()=>{try{await async function(){try{const e=await import(/*! webpackIgnore: true */"process"),t=e=>new Promise(((t,o)=>{e.on("error",o),e.end("","utf8",t)})),o=t(e.stderr),n=t(e.stdout);let r;const i=new Promise((e=>{r=setTimeout((()=>e("timeout")),1e3)}));await Promise.race([Promise.all([n,o]),i]),clearTimeout(r)}catch(e){_(`flushing std* streams failed: ${e}`)}}()}finally{Ye(t,o)}})(),o;Ye(t,o)}function Ye(e,t){if(Ue.runtimeReady&&Ue.nativeExit)try{Ue.nativeExit(e)}catch(e){!Ue.ExitStatus||e instanceof Ue.ExitStatus||E("set_exit_code_and_quit_now failed: "+e.toString())}if(0!==e||!ke)throw Se&&Ne.process?Ne.process.exit(e):Ue.quit&&Ue.quit(e,t),t}function et(e){ot(e,e.reason,"rejection")}function tt(e){ot(e,e.error,"error")}function ot(e,t,o){e.preventDefault();try{t||(t=new Error("Unhandled "+o)),void 0===t.stack&&(t.stack=(new Error).stack),t.stack=t.stack+"",t.silent||(_("Unhandled error:",t),Xe(1,t))}catch(e){}}!function(e){if($e)throw new Error("Loader module already loaded");$e=!0,Ue=e.runtimeHelpers,Pe=e.loaderHelpers,Me=e.diagnosticHelpers,Le=e.api,Ne=e.internal,Object.assign(Le,{INTERNAL:Ne,invokeLibraryInitializers:be}),Object.assign(e.module,{config:ve(ze,{environmentVariables:{}})});const r={mono_wasm_bindings_is_ready:!1,config:e.module.config,diagnosticTracing:!1,nativeAbort:e=>{throw e||new Error("abort")},nativeExit:e=>{throw new Error("exit:"+e)}},l={gitHash:"44525024595742ebe09023abe709df51de65009b",config:e.module.config,diagnosticTracing:!1,maxParallelDownloads:16,enableDownloadRetry:!0,_loaded_files:[],loadedFiles:[],loadedAssemblies:[],libraryInitializers:[],workerNextNumber:1,actual_downloaded_assets_count:0,actual_instantiated_assets_count:0,expected_downloaded_assets_count:0,expected_instantiated_assets_count:0,afterConfigLoaded:i(),allDownloadsQueued:i(),allDownloadsFinished:i(),wasmCompilePromise:i(),runtimeModuleLoaded:i(),loadingWorkers:i(),is_exited:Ve,is_runtime_running:qe,assert_runtime_running:He,mono_exit:Xe,createPromiseController:i,getPromiseController:s,assertIsControllablePromise:a,mono_download_assets:oe,resolve_single_asset_path:ee,setup_proxy_console:j,set_thread_prefix:w,installUnhandledErrorHandler:Je,retrieve_asset_download:ie,invokeLibraryInitializers:be,isDebuggingSupported:Te,exceptions:t,simd:n,relaxedSimd:o};Object.assign(Ue,r),Object.assign(Pe,l)}(Fe);let nt,rt,it,st=!1,at=!1;async function lt(e){if(!at){if(at=!0,ke&&Pe.config.forwardConsoleLogsToWS&&void 0!==globalThis.WebSocket&&j("main",globalThis.console,globalThis.location.origin),We||Be(!1,"Null moduleConfig"),Pe.config||Be(!1,"Null moduleConfig.config"),"function"==typeof e){const t=e(Fe.api);if(t.ready)throw new Error("Module.ready couldn't be redefined.");Object.assign(We,t),Ee(We,t)}else{if("object"!=typeof e)throw new Error("Can't use moduleFactory callback of createDotnetRuntime function.");Ee(We,e)}await async function(e){if(Se){const e=await import(/*! webpackIgnore: true */"process"),t=14;if(e.versions.node.split(".")[0]<t)throw new Error(`NodeJS at '${e.execPath}' has too low version '${e.versions.node}', please use at least ${t}. See also https://aka.ms/dotnet-wasm-features`)}const t=/*! webpackIgnore: true */import.meta.url,o=t.indexOf("?");var n;if(o>0&&(Pe.modulesUniqueQuery=t.substring(o)),Pe.scriptUrl=t.replace(/\\/g,"/").replace(/[?#].*/,""),Pe.scriptDirectory=(n=Pe.scriptUrl).slice(0,n.lastIndexOf("/"))+"/",Pe.locateFile=e=>"URL"in globalThis&&globalThis.URL!==C?new URL(e,Pe.scriptDirectory).toString():M(e)?e:Pe.scriptDirectory+e,Pe.fetch_like=k,Pe.out=console.log,Pe.err=console.error,Pe.onDownloadResourceProgress=e.onDownloadResourceProgress,ke&&globalThis.navigator){const e=globalThis.navigator,t=e.userAgentData&&e.userAgentData.brands;t&&t.length>0?Pe.isChromium=t.some((e=>"Google Chrome"===e.brand||"Microsoft Edge"===e.brand||"Chromium"===e.brand)):e.userAgent&&(Pe.isChromium=e.userAgent.includes("Chrome"),Pe.isFirefox=e.userAgent.includes("Firefox"))}Ne.require=Se?await import(/*! webpackIgnore: true */"module").then((e=>e.createRequire(/*! webpackIgnore: true */import.meta.url))):Promise.resolve((()=>{throw new Error("require not supported")})),void 0===globalThis.URL&&(globalThis.URL=C)}(We)}}async function ct(e){return await lt(e),Ze=We.onAbort,Qe=We.onExit,We.onAbort=Ke,We.onExit=Ge,We.ENVIRONMENT_IS_PTHREAD?async function(){(function(){const e=new MessageChannel,t=e.port1,o=e.port2;t.addEventListener("message",(e=>{var n,r;n=JSON.parse(e.data.config),r=JSON.parse(e.data.monoThreadInfo),st?Pe.diagnosticTracing&&b("mono config already received"):(ve(Pe.config,n),Ue.monoThreadInfo=r,xe(),Pe.diagnosticTracing&&b("mono config received"),st=!0,Pe.afterConfigLoaded.promise_control.resolve(Pe.config),ke&&n.forwardConsoleLogsToWS&&void 0!==globalThis.WebSocket&&Pe.setup_proxy_console("worker-idle",console,globalThis.location.origin)),t.close(),o.close()}),{once:!0}),t.start(),self.postMessage({[l]:{monoCmd:"preload",port:o}},[o])})(),await Pe.afterConfigLoaded.promise,function(){const e=Pe.config;e.assets||Be(!1,"config.assets must be defined");for(const t of e.assets)X(t),Q[t.behavior]&&z.push(t)}(),setTimeout((async()=>{try{await oe()}catch(e){Xe(1,e)}}),0);const e=dt(),t=await Promise.all(e);return await ut(t),We}():async function(){var e;await Re(We),re();const t=dt();(async function(){try{const e=ee("dotnetwasm");await se(e),e&&e.pendingDownloadInternal&&e.pendingDownloadInternal.response||Be(!1,"Can't load dotnet.native.wasm");const t=await e.pendingDownloadInternal.response,o=t.headers&&t.headers.get?t.headers.get("Content-Type"):void 0;let n;if("function"==typeof WebAssembly.compileStreaming&&"application/wasm"===o)n=await WebAssembly.compileStreaming(t);else{ke&&"application/wasm"!==o&&E('WebAssembly resource does not have the expected content type "application/wasm", so falling back to slower ArrayBuffer instantiation.');const e=await t.arrayBuffer();Pe.diagnosticTracing&&b("instantiate_wasm_module buffered"),n=Ie?await Promise.resolve(new WebAssembly.Module(e)):await WebAssembly.compile(e)}e.pendingDownloadInternal=null,e.pendingDownload=null,e.buffer=null,e.moduleExports=null,Pe.wasmCompilePromise.promise_control.resolve(n)}catch(e){Pe.wasmCompilePromise.promise_control.reject(e)}})(),setTimeout((async()=>{try{D(),await oe()}catch(e){Xe(1,e)}}),0);const o=await Promise.all(t);return await ut(o),await Ue.dotnetReady.promise,await we(null===(e=Pe.config.resources)||void 0===e?void 0:e.modulesAfterRuntimeReady),await be("onRuntimeReady",[Fe.api]),Le}()}function dt(){const e=ee("js-module-runtime"),t=ee("js-module-native");if(nt&&rt)return[nt,rt,it];"object"==typeof e.moduleExports?nt=e.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${e.resolvedUrl}' for ${e.name}`),nt=import(/*! webpackIgnore: true */e.resolvedUrl)),"object"==typeof t.moduleExports?rt=t.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${t.resolvedUrl}' for ${t.name}`),rt=import(/*! webpackIgnore: true */t.resolvedUrl));const o=Y("js-module-diagnostics");return o&&("object"==typeof o.moduleExports?it=o.moduleExports:(Pe.diagnosticTracing&&b(`Attempting to import '${o.resolvedUrl}' for ${o.name}`),it=import(/*! webpackIgnore: true */o.resolvedUrl))),[nt,rt,it]}async function ut(e){const{initializeExports:t,initializeReplacements:o,configureRuntimeStartup:n,configureEmscriptenStartup:r,configureWorkerStartup:i,setRuntimeGlobals:s,passEmscriptenInternals:a}=e[0],{default:l}=e[1],c=e[2];s(Fe),t(Fe),c&&c.setRuntimeGlobals(Fe),await n(We),Pe.runtimeModuleLoaded.promise_control.resolve(),l((e=>(Object.assign(We,{ready:e.ready,__dotnet_runtime:{initializeReplacements:o,configureEmscriptenStartup:r,configureWorkerStartup:i,passEmscriptenInternals:a}}),We))).catch((e=>{if(e.message&&e.message.toLowerCase().includes("out of memory"))throw new Error(".NET runtime has failed to start, because too much memory was requested. Please decrease the memory by adjusting EmccMaximumHeapSize. See also https://aka.ms/dotnet-wasm-features");throw e}))}const ft=new class{withModuleConfig(e){try{return Ee(We,e),this}catch(e){throw Xe(1,e),e}}withOnConfigLoaded(e){try{return Ee(We,{onConfigLoaded:e}),this}catch(e){throw Xe(1,e),e}}withConsoleForwarding(){try{return ve(ze,{forwardConsoleLogsToWS:!0}),this}catch(e){throw Xe(1,e),e}}withExitOnUnhandledError(){try{return ve(ze,{exitOnUnhandledError:!0}),Je(),this}catch(e){throw Xe(1,e),e}}withAsyncFlushOnExit(){try{return ve(ze,{asyncFlushOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withExitCodeLogging(){try{return ve(ze,{logExitCode:!0}),this}catch(e){throw Xe(1,e),e}}withElementOnExit(){try{return ve(ze,{appendElementOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withInteropCleanupOnExit(){try{return ve(ze,{interopCleanupOnExit:!0}),this}catch(e){throw Xe(1,e),e}}withDumpThreadsOnNonZeroExit(){try{return ve(ze,{dumpThreadsOnNonZeroExit:!0}),this}catch(e){throw Xe(1,e),e}}withWaitingForDebugger(e){try{return ve(ze,{waitForDebugger:e}),this}catch(e){throw Xe(1,e),e}}withInterpreterPgo(e,t){try{return ve(ze,{interpreterPgo:e,interpreterPgoSaveDelay:t}),ze.runtimeOptions?ze.runtimeOptions.push("--interp-pgo-recording"):ze.runtimeOptions=["--interp-pgo-recording"],this}catch(e){throw Xe(1,e),e}}withConfig(e){try{return ve(ze,e),this}catch(e){throw Xe(1,e),e}}withConfigSrc(e){try{return e&&"string"==typeof e||Be(!1,"must be file path or URL"),Ee(We,{configSrc:e}),this}catch(e){throw Xe(1,e),e}}withVirtualWorkingDirectory(e){try{return e&&"string"==typeof e||Be(!1,"must be directory path"),ve(ze,{virtualWorkingDirectory:e}),this}catch(e){throw Xe(1,e),e}}withEnvironmentVariable(e,t){try{const o={};return o[e]=t,ve(ze,{environmentVariables:o}),this}catch(e){throw Xe(1,e),e}}withEnvironmentVariables(e){try{return e&&"object"==typeof e||Be(!1,"must be dictionary object"),ve(ze,{environmentVariables:e}),this}catch(e){throw Xe(1,e),e}}withDiagnosticTracing(e){try{return"boolean"!=typeof e&&Be(!1,"must be boolean"),ve(ze,{diagnosticTracing:e}),this}catch(e){throw Xe(1,e),e}}withDebugging(e){try{return null!=e&&"number"==typeof e||Be(!1,"must be number"),ve(ze,{debugLevel:e}),this}catch(e){throw Xe(1,e),e}}withApplicationArguments(...e){try{return e&&Array.isArray(e)||Be(!1,"must be array of strings"),ve(ze,{applicationArguments:e}),this}catch(e){throw Xe(1,e),e}}withRuntimeOptions(e){try{return e&&Array.isArray(e)||Be(!1,"must be array of strings"),ze.runtimeOptions?ze.runtimeOptions.push(...e):ze.runtimeOptions=e,this}catch(e){throw Xe(1,e),e}}withMainAssembly(e){try{return ve(ze,{mainAssemblyName:e}),this}catch(e){throw Xe(1,e),e}}withApplicationArgumentsFromQuery(){try{if(!globalThis.window)throw new Error("Missing window to the query parameters from");if(void 0===globalThis.URLSearchParams)throw new Error("URLSearchParams is supported");const e=new URLSearchParams(globalThis.window.location.search).getAll("arg");return this.withApplicationArguments(...e)}catch(e){throw Xe(1,e),e}}withApplicationEnvironment(e){try{return ve(ze,{applicationEnvironment:e}),this}catch(e){throw Xe(1,e),e}}withApplicationCulture(e){try{return ve(ze,{applicationCulture:e}),this}catch(e){throw Xe(1,e),e}}withResourceLoader(e){try{return Pe.loadBootResource=e,this}catch(e){throw Xe(1,e),e}}async download(){try{await async function(){lt(We),await Re(We),re(),D(),oe(),await Pe.allDownloadsFinished.promise}()}catch(e){throw Xe(1,e),e}}async create(){try{return this.instance||(this.instance=await async function(){return await ct(We),Fe.api}()),this.instance}catch(e){throw Xe(1,e),e}}async run(){try{return We.config||Be(!1,"Null moduleConfig.config"),this.instance||await this.create(),this.instance.runMainAndExit()}catch(e){throw Xe(1,e),e}}},mt=Xe,gt=ct;Ie||"function"==typeof globalThis.URL||Be(!1,"This browser/engine doesn't support URL API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"),"function"!=typeof globalThis.BigInt64Array&&Be(!1,"This browser/engine doesn't support BigInt64Array API. Please use a modern version. See also https://aka.ms/dotnet-wasm-features"),ft.withConfig(/*json-start*/{
  "mainAssemblyName": "SharpCast",
  "resources": {
    "hash": "sha256-MErSRw/2LzYz3bsJT0ZWdNkK5h0d14A74vNn8oI9VMk=",
    "jsModuleNative": [
      {
        "name": "dotnet.native.87vtjjdetb.js"
      }
    ],
    "jsModuleRuntime": [
      {
        "name": "dotnet.runtime.2tx45g8lli.js"
      }
    ],
    "wasmNative": [
      {
        "name": "dotnet.native.befq3iek54.wasm",
        "integrity": "sha256-cxtEpYwNaw5SZcxjGX5684Bzda4TyKmrK7bSsnG0NtA=",
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
        "virtualPath": "System.Runtime.InteropServices.JavaScript.wasm",
        "name": "System.Runtime.InteropServices.JavaScript.yzg2xf6fe9.wasm",
        "integrity": "sha256-jj+hXeHxXtNJ/yFTBFkWF83+YlrVlIlndehUiym2PoQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Private.CoreLib.wasm",
        "name": "System.Private.CoreLib.cdyvrhjssb.wasm",
        "integrity": "sha256-QDELDm+IsNTmUcTi8Ka+cJTTmBRwVZIb8mDYAv59r98=",
        "cache": "force-cache"
      }
    ],
    "assembly": [
      {
        "virtualPath": "Blazored.LocalStorage.wasm",
        "name": "Blazored.LocalStorage.12n6dz54qr.wasm",
        "integrity": "sha256-OaMAAd5n7ORfyur5e3QIyEVKJ76MKIvwbg7/icnnYcU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "BlazorMonaco.wasm",
        "name": "BlazorMonaco.98tzo6dc2v.wasm",
        "integrity": "sha256-R8FyBgovIXHO+Iv0CZyrVhS+T30U6xRRX4tNBwjDfI8=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Humanizer.wasm",
        "name": "Humanizer.hmybd7bz0p.wasm",
        "integrity": "sha256-92ID7uJek8fKffBx6b9S8qZohpfwi0mjqbUPPWk1qtg=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.AspNetCore.Components.wasm",
        "name": "Microsoft.AspNetCore.Components.t19hne202k.wasm",
        "integrity": "sha256-EdfuwOL+h1Z5fyS4OEnlhgeDyWljgGxcVlRjiWuOVYs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.AspNetCore.Components.Web.wasm",
        "name": "Microsoft.AspNetCore.Components.Web.cumx11h7m2.wasm",
        "integrity": "sha256-5AYe8ZVoCMYa/qfeXuMMoh5PdGeKoYXkEngKJolI89I=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.AspNetCore.Components.WebAssembly.wasm",
        "name": "Microsoft.AspNetCore.Components.WebAssembly.w71hcxgn57.wasm",
        "integrity": "sha256-bJCY1ygK/FYhjL5/xo0ALw+3jOfedxQ6PyAiN4IblFY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.wasm",
        "name": "Microsoft.CodeAnalysis.erp1n29u9n.wasm",
        "integrity": "sha256-VvgzZZPZ5B7lUxBoceWqgqrawKs/BElsjRu+YB9hkIk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.CSharp.wasm",
        "name": "Microsoft.CodeAnalysis.CSharp.df8hfd5o8z.wasm",
        "integrity": "sha256-F6hjB2uObN+teOfptznqaUCTmIDykWUjqqGeeis7Rjw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.wasm",
        "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.nnmcno2xng.wasm",
        "integrity": "sha256-szRxBE0pVPoPByitWVImsT5ZNVzI1WotxWc8ElzLKWc=",
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
        "virtualPath": "Microsoft.Extensions.Configuration.wasm",
        "name": "Microsoft.Extensions.Configuration.33kpvunugc.wasm",
        "integrity": "sha256-EScOvyLYbGHyXzhFvrjRm2JZrZ6rIDhmUXRvPgDTopY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Configuration.Abstractions.wasm",
        "name": "Microsoft.Extensions.Configuration.Abstractions.vydvg25cgq.wasm",
        "integrity": "sha256-if+LK/X2QiubYZTpryZvRrMyTu2U2TFOuAkbwh3zGOA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Configuration.Json.wasm",
        "name": "Microsoft.Extensions.Configuration.Json.dsinhvif0g.wasm",
        "integrity": "sha256-I9RchUtUIR389BC9FoYb+kicxmt1RhJha7WRlbfEbBQ=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.DependencyInjection.wasm",
        "name": "Microsoft.Extensions.DependencyInjection.pi2ppnurq1.wasm",
        "integrity": "sha256-/xFWt3jRxK/ZcK2J615CnjA+T1PdmL72LQA51c6Ef9o=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.DependencyInjection.Abstractions.wasm",
        "name": "Microsoft.Extensions.DependencyInjection.Abstractions.713dggwn9b.wasm",
        "integrity": "sha256-m2AsB18Yy79TM0tKZEIe1+lBY6lC60cpco+RKEVs8Qk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Localization.wasm",
        "name": "Microsoft.Extensions.Localization.en4qwohzi2.wasm",
        "integrity": "sha256-9hWN+RTArWa+C3GDiw+VOw2yuSzBuSju+sFT3nDTMAs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Localization.Abstractions.wasm",
        "name": "Microsoft.Extensions.Localization.Abstractions.707xfv0ub5.wasm",
        "integrity": "sha256-t2z8tW2o7TJyP5Wcn2gdYdX/bwKZTbijQOaj6wph1zc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Logging.wasm",
        "name": "Microsoft.Extensions.Logging.efb40z18hz.wasm",
        "integrity": "sha256-2o41anbTbxpSDCdgiXgltHqZusjWuT1+M9amuIjDsAM=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Logging.Abstractions.wasm",
        "name": "Microsoft.Extensions.Logging.Abstractions.pglh7hpf0p.wasm",
        "integrity": "sha256-6SFn1yXUkW5ojems29nhL0wxHJikvBroOz+s7KEOTa0=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Options.wasm",
        "name": "Microsoft.Extensions.Options.i5851wiypt.wasm",
        "integrity": "sha256-hnny8dNDfJgEp2x8R5JSUNSlKzSwv/h+sdHJyUCyHBU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.Extensions.Primitives.wasm",
        "name": "Microsoft.Extensions.Primitives.ggysv59g1w.wasm",
        "integrity": "sha256-kB+vcJr9OWqlhFNDqdl4hrCesoHelSc6j+I64ymVhe0=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.JSInterop.wasm",
        "name": "Microsoft.JSInterop.hb0bcpu4p5.wasm",
        "integrity": "sha256-o7nQt+QUPdH7HKEm1IaZzQ44pqMwtqCN1j42uJhuUqw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "Microsoft.JSInterop.WebAssembly.wasm",
        "name": "Microsoft.JSInterop.WebAssembly.58jjh3bwur.wasm",
        "integrity": "sha256-FTVJx7gilBV/VWu+ibz7K8ueo7JUXPGj94aH0rf2FXQ=",
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
        "virtualPath": "System.Collections.Concurrent.wasm",
        "name": "System.Collections.Concurrent.y67duwgfbq.wasm",
        "integrity": "sha256-VnzXUOV4uUHzoL+ABP142+tazmyN0WhyWWyp0+vwyCY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.Immutable.wasm",
        "name": "System.Collections.Immutable.c1adz8vsp2.wasm",
        "integrity": "sha256-8Hhdve+QcuLcu64uaF5Fr6IQbzTLMp1rC+m05bnDVBk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.NonGeneric.wasm",
        "name": "System.Collections.NonGeneric.opogmjvm6v.wasm",
        "integrity": "sha256-5KxX7XMVNUvPUWKdT10jvHRDtJu1XPR1Q1ZaSVfW2TA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.Specialized.wasm",
        "name": "System.Collections.Specialized.3b9enihgyg.wasm",
        "integrity": "sha256-YcoSsBTYJFP4icvmIPqCB+Kdt55OmKuxq7xT8iEnhDE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Collections.wasm",
        "name": "System.Collections.yc73ovo5oh.wasm",
        "integrity": "sha256-/gPwrNrF3lGPsd7D/L17b9LR1CBvF16m5lQLlsb7FLc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ComponentModel.Primitives.wasm",
        "name": "System.ComponentModel.Primitives.o099schdfd.wasm",
        "integrity": "sha256-GM7/qTnSS33+flp7LWkjQ2krHRfq21hSm1xiGTfhM0k=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ComponentModel.TypeConverter.wasm",
        "name": "System.ComponentModel.TypeConverter.h9q0mf3buh.wasm",
        "integrity": "sha256-9ebv/KwivP1mwwC5v2V6XjatXG4La2wXodE2i6My6U4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ComponentModel.wasm",
        "name": "System.ComponentModel.zvpmoupymb.wasm",
        "integrity": "sha256-j4xVR2d1tpwZrUoag5ugeqAMDDfGXlE9q1rpeRzeLQY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Console.wasm",
        "name": "System.Console.0fnntho1eg.wasm",
        "integrity": "sha256-tEgtBRWtW+eeALlkax0cxshOyRXdFAYigFFbrLn6cnI=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.DiagnosticSource.wasm",
        "name": "System.Diagnostics.DiagnosticSource.yb70lppe2a.wasm",
        "integrity": "sha256-4pFxQ2YmLmeNTav63LvYDfmNaAWMXFxHmYQ2S+udfxU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.FileVersionInfo.wasm",
        "name": "System.Diagnostics.FileVersionInfo.1xkjkrxrxq.wasm",
        "integrity": "sha256-paD4f8WsNsVSdA3eJSuH0OVa+fCtrA2xRjdM48K6/FE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.Process.wasm",
        "name": "System.Diagnostics.Process.cz32xu67fu.wasm",
        "integrity": "sha256-qJmDR5svofYa1tEnDJfH9yDo+6299C8T8X/NdfF6eso=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.StackTrace.wasm",
        "name": "System.Diagnostics.StackTrace.umqvcwc4tp.wasm",
        "integrity": "sha256-lmT9kHX6R9dKvUasyMnTcsg/Sxd1aUD+qBZD4ukibsI=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.TraceSource.wasm",
        "name": "System.Diagnostics.TraceSource.bqj05u8fn9.wasm",
        "integrity": "sha256-4wC5S+D50gcN8N5QTXgm/jiGoumhq/HFEIrATcpUJ24=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Diagnostics.Tracing.wasm",
        "name": "System.Diagnostics.Tracing.2lvn3un22t.wasm",
        "integrity": "sha256-pgo6hDMDyM5JOQYN8WuNu2UBYL+Vl/HRMbSrbook+wo=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Globalization.wasm",
        "name": "System.Globalization.4ahc8d1dax.wasm",
        "integrity": "sha256-hHFpvRnrz0KVDXuB3CucF6BhGGx8k4AwCVXbPFubPIU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.IO.Compression.wasm",
        "name": "System.IO.Compression.3586f79hoe.wasm",
        "integrity": "sha256-tylJMs4K7TYK+BCTv3tTJSDpRQG93jec+3AIndy3RCs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.IO.MemoryMappedFiles.wasm",
        "name": "System.IO.MemoryMappedFiles.qgltlir0mr.wasm",
        "integrity": "sha256-6n5XxvQ/4nNueQ6ckaMGo6bCgVGDdMhl6BFkG9u5Wes=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.IO.Pipelines.wasm",
        "name": "System.IO.Pipelines.23mjs38mxf.wasm",
        "integrity": "sha256-jn56t1s7iyUJNXjt5Zo6Wm9n3wzIT6R6g5vtBODjxAA=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Linq.Expressions.wasm",
        "name": "System.Linq.Expressions.legdp6oxev.wasm",
        "integrity": "sha256-sxqsuBUiH3fYZup03gWdgmIgPmT04awKfVCg8Uqsv24=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Linq.wasm",
        "name": "System.Linq.trmijgb7ig.wasm",
        "integrity": "sha256-Nxnm1EKW1lLhBY1Ats4OsZwJ4XTDCMaSG3HhFftB0Xc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Memory.wasm",
        "name": "System.Memory.3lizzr8j6d.wasm",
        "integrity": "sha256-19ea9loiAYpEt/apd3osW9q9VteZjtM2TDA1KX+J15U=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.Http.wasm",
        "name": "System.Net.Http.zs5pzwfchi.wasm",
        "integrity": "sha256-o1ydD3d4Xk1ZuoZ734Wqz+7a3alMH124k/o8TJaAwvM=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Net.Primitives.wasm",
        "name": "System.Net.Primitives.7t134mcgzu.wasm",
        "integrity": "sha256-64fWWqjptfExUUYS/t2CQE2OsRglPaOI2oUXbCye2Aw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.ObjectModel.wasm",
        "name": "System.ObjectModel.b353x0glz3.wasm",
        "integrity": "sha256-hz2rWeNLC39vJbaz5H81ptciH4Hn+kffpdqt/ZrcE3s=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Private.Uri.wasm",
        "name": "System.Private.Uri.7wcqsp81ob.wasm",
        "integrity": "sha256-OdzKqEGKzWD9WO6DnXHcSysD6oS22vgMshfNJQuZL1A=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Private.Xml.Linq.wasm",
        "name": "System.Private.Xml.Linq.48sruw9j0y.wasm",
        "integrity": "sha256-pHXH7Xab0C0ASR+ovYFQhBfVUyJdxD0NSxnXCN/wSVk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Private.Xml.wasm",
        "name": "System.Private.Xml.xswgutbc0o.wasm",
        "integrity": "sha256-ESwSnyI8Oic/H1nD6h98fk72a4fyBFm3IevnOjT4zRw=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Reflection.Metadata.wasm",
        "name": "System.Reflection.Metadata.8dth8jjhzr.wasm",
        "integrity": "sha256-7FIjBJuB6SEl/QAsBdc+FNsv65nXP9qnLEm4OtpGhqs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Reflection.Primitives.wasm",
        "name": "System.Reflection.Primitives.hqiia9qdp1.wasm",
        "integrity": "sha256-WR1LZkbvb3tGyhatNsT3G9tRemHQOzlXPhcaRNmLmck=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.InteropServices.wasm",
        "name": "System.Runtime.InteropServices.8d6y61bjkl.wasm",
        "integrity": "sha256-RNFm6JZ1acmZ/myPxCEhiXWI03cH3hPy3UjDHwrcXYU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.Intrinsics.wasm",
        "name": "System.Runtime.Intrinsics.j9vypni9ii.wasm",
        "integrity": "sha256-OVjoJ+Fvw82Nn9IX10YlXvhMgWMI5f1W1a/v7a+2bd0=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.Loader.wasm",
        "name": "System.Runtime.Loader.zssb0qqjqr.wasm",
        "integrity": "sha256-bZH2dxNSbGifJkXqxIaNJ/Lxgi4fGHcHCuY1oUvY7Rc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.Numerics.wasm",
        "name": "System.Runtime.Numerics.d5harzqson.wasm",
        "integrity": "sha256-r4NFUoZd7xzSDMc1L+0HarLlyRUCZXVu3UDUiFDEbyY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.Serialization.Primitives.wasm",
        "name": "System.Runtime.Serialization.Primitives.j05lczl1w1.wasm",
        "integrity": "sha256-o5TlMR+B6D17a737vQZeKs+u5tNJsatz4udfVdn+lPk=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Runtime.wasm",
        "name": "System.Runtime.p6p287ga65.wasm",
        "integrity": "sha256-/w8tkv5gNtzH/WZMA/V+IIVmyPtqEdHbJr/JWkLJQw4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Security.Cryptography.wasm",
        "name": "System.Security.Cryptography.2x824fntqk.wasm",
        "integrity": "sha256-WpbmmzCIr6fbhreVpYqgCht5uHYclFbActJHcvA19qU=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.Encoding.CodePages.wasm",
        "name": "System.Text.Encoding.CodePages.1y94zt125y.wasm",
        "integrity": "sha256-p82emTNun0Tt5tADH3vC9aTFnKPvmz4HENVlYSUwBvE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.Encoding.Extensions.wasm",
        "name": "System.Text.Encoding.Extensions.bxcvrssgkb.wasm",
        "integrity": "sha256-L/5dee+TqIFApzN+80xpPbtb4kbNZluny5iBEPJdS4I=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.Encodings.Web.wasm",
        "name": "System.Text.Encodings.Web.jr14ggfk6o.wasm",
        "integrity": "sha256-7yEMRdPcUlhAd1aNGsHJu1UI+D3j1tIwjQdqzgYC2GY=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.Json.wasm",
        "name": "System.Text.Json.bdlx7ut8oc.wasm",
        "integrity": "sha256-kaYWEP+AA2mhQgKTsAh4f9//c3PP087zIXvW0+S1Hq4=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Text.RegularExpressions.wasm",
        "name": "System.Text.RegularExpressions.6e6g7lr7xu.wasm",
        "integrity": "sha256-Xs+hTqNIPm5VTBUzdKQTeasiP51zdvz7uPf+1cE4yr8=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.Channels.wasm",
        "name": "System.Threading.Channels.zjrx2c8at7.wasm",
        "integrity": "sha256-QQSVX6lrh/Htq7WLCGQFlcXl5JlQRGqmUXrq44opr0Q=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.Tasks.Parallel.wasm",
        "name": "System.Threading.Tasks.Parallel.wifmwlek5x.wasm",
        "integrity": "sha256-GGwMTEG32YErhhI7xUpUpQqd25yR5OYPr7I6pPjOdFM=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.Thread.wasm",
        "name": "System.Threading.Thread.3zg6299q27.wasm",
        "integrity": "sha256-b7EvEd4zPbAChkK1gLtnt9GT8gD6fmHcaRK62XTE93w=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.ThreadPool.wasm",
        "name": "System.Threading.ThreadPool.250f3guh07.wasm",
        "integrity": "sha256-ig78HLXJRKvLite5ZDuhBginMXJI5RzVKAiFABE9J3s=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Threading.wasm",
        "name": "System.Threading.ot2rwfeolf.wasm",
        "integrity": "sha256-9Bw/emvUkGev30niHeko5USJTRaDU/KfDB6rwrtXtPE=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.Linq.wasm",
        "name": "System.Xml.Linq.bno46imr5t.wasm",
        "integrity": "sha256-x8MB2DkAOXhOCsJ/AzpobuVUqt727s2bp6fDdDQ1d8A=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.ReaderWriter.wasm",
        "name": "System.Xml.ReaderWriter.b5yzdnwihr.wasm",
        "integrity": "sha256-nwALs6aUvnBUipOa0xUh4bpP6BrlDSxulnaktHikIUs=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.XDocument.wasm",
        "name": "System.Xml.XDocument.iaismzcosm.wasm",
        "integrity": "sha256-ZrKEdfRhIO6IHjtcsJEJvy4dkvnXQNRNgjMdqdiUJlg=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.XPath.XDocument.wasm",
        "name": "System.Xml.XPath.XDocument.n8gvgyrsc3.wasm",
        "integrity": "sha256-9+tXAQojlaMIPnxd5U2b5WKR7cWW3UakF054vHDnt/s=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.Xml.XPath.wasm",
        "name": "System.Xml.XPath.waw0iunch7.wasm",
        "integrity": "sha256-iJ0/sSlQstg39csOZS3By1EP+ZDovpxDTuf1nU3b2Cc=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "System.wasm",
        "name": "System.l9jolnojrw.wasm",
        "integrity": "sha256-d1dcH2nxptL8QLqZqtRI5G+lrjrbUKrUOnC/yloVB98=",
        "cache": "force-cache"
      },
      {
        "virtualPath": "SharpCast.wasm",
        "name": "SharpCast.5xw2iccs3z.wasm",
        "integrity": "sha256-1ypOYkMCruWiQaZyx579r8zaWtxtKTX3yQDIELLDJVI=",
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
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.k2w3mhwa07.wasm",
          "integrity": "sha256-5AAoE+VEEKjOKppvnO0NXWR+FfDFviAAz6dirSZXXkc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.xfa6pu1alu.wasm",
          "integrity": "sha256-owSBVY320uiTlbt4DYYZnH4X76tZBdbWYGhiA1Sd9jo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.twnsm9mflg.wasm",
          "integrity": "sha256-DSK+odmVy4U/72dM+VWe5ACOHs/qFWWexAJ7BtbT7Mg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.uv38xb70xb.wasm",
          "integrity": "sha256-qgIv/iIeqUxbEnQ/Bjj70eRBQ/ZzKo5gm2kxF4hg60A=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.ix8z21lnuz.wasm",
          "integrity": "sha256-CvJq4XNNFrDbRb9aPXqfAYcFvcBxS2X0ESgAKFalqwk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.19kzaraf2j.wasm",
          "integrity": "sha256-RUdTeKysikZvzJmLdfWhz8xz2vsYBT+WxCvM+zxhA+k=",
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
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.jrul1nigrc.wasm",
          "integrity": "sha256-/ws8akfgIPA946chWhnykIj60oqzui+aI7PiBvYc9gc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.f2gywvfjln.wasm",
          "integrity": "sha256-Kc4HSwAO5vK29dkOuhT//RP6bv4RFv5x3JbDaYRe/OE=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.qiezfgxkoi.wasm",
          "integrity": "sha256-vgzOC83AWxeAvx6JfW8Rfzx9rVDUdiGaKmSCEvAu0f0=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.duhon6qcbk.wasm",
          "integrity": "sha256-q6Az8tKUDy/zuonwB0FrPxpGMpPIT3jvSTTkGtajyDo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.kj79e7yk6c.wasm",
          "integrity": "sha256-cPgKz8Ta7EArIMOw4NSPMMg7sbmD7FAJ1HOWSQrg9JE=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.fr7rfz9kts.wasm",
          "integrity": "sha256-9TRG9OgsETX0LzlmmYw2KTrimnBR/pVdD4nTm983eC8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.resources.wasm",
          "name": "SharpCast.resources.9b1hcu0bem.wasm",
          "integrity": "sha256-G1uuqxlrs9PA7+EhcfTlYgq/51k+kICUT5rDWO8i5Aw=",
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
      "es": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.mzk5m0tsol.wasm",
          "integrity": "sha256-gp8HX/SExRYmeUaW31Ozjsf6M9rv6BJ40cDPLIWS6h8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.gs17fo235q.wasm",
          "integrity": "sha256-0LPqXNHrSpxy0auus32GhLiEWOrSpOk4X3dLIi0IdWo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.hxim79cv9u.wasm",
          "integrity": "sha256-VbQC1BlGdcNw7OQRzt+hyN9vno7v9vZ6MmmFONV9Zhk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.2fps4apfsm.wasm",
          "integrity": "sha256-rqsHaOyox/ciiTtZo5xV+9xkznWGPKgVf1p4PITQ8zQ=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.3yea7c6my1.wasm",
          "integrity": "sha256-1Z7bHjH3WePImmXj6sfzKqfREamu5gbyQBjh/B5oE6g=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.a60msc5gi6.wasm",
          "integrity": "sha256-nrlpOygdUMLa6mJ89lLdAWyKCu6AGBpdCQZCHQ259WQ=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.8txpr7w59n.wasm",
          "integrity": "sha256-lNHQdm2nofay47a5HX+Q5H/bT4EtLg4uOVIEilIPB0Q=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.resources.wasm",
          "name": "SharpCast.resources.40p5oewi16.wasm",
          "integrity": "sha256-LGLEhPs/yS6RBEX7JNZmylQkaf9LlJKZ9HIW6nBQk0Y=",
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
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.mw7bxyd1cx.wasm",
          "integrity": "sha256-OmpuoghrvMmkX6qg0xZBDL/zieLnPaiUNXC537v5M7w=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.nxyt3ca9i7.wasm",
          "integrity": "sha256-5Tb5QIBz1A7O5D8ZZXkNEEHVO4aP/QXTkWSdh6nuiRs=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.1jmchu9kgf.wasm",
          "integrity": "sha256-DXYc6cSMnYEKjjlU10z4ZDKIR3rJw24PNkFQjVAg/Rc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.0tcex13g0k.wasm",
          "integrity": "sha256-VM1zN5bZIwp9LZ2bcc9vdd0dFJaalxzx+WmTuBh6W9Y=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.5lyj3pleqr.wasm",
          "integrity": "sha256-JxMRkPYOhuiT1zYktyDiFZiB/6Y0GK2GkBlA0si2LQg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.0lbw7v84lk.wasm",
          "integrity": "sha256-pMUK2zqFZZojYeHAO+2dCWPDbz1/hNlDhbqZHoCZYkk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.resources.wasm",
          "name": "SharpCast.resources.ptaf96c27k.wasm",
          "integrity": "sha256-c1qmS0VheNyDvcSadbzBXtAwYGdRTyn/yWYyU3kezWg=",
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
          "virtualPath": "SharpCast.resources.wasm",
          "name": "SharpCast.resources.vkyg9l6joo.wasm",
          "integrity": "sha256-8a+Me7RxVl/LhY2JEFc71tl1B6KTaR3hCEOTGJbcSHY=",
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
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.k2wkf7t3s8.wasm",
          "integrity": "sha256-XFqlyThLxHRA7uL2blMZ5Y6Sl7Ftz8JOdtg+GTy8ItY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.iq2tgsxh7r.wasm",
          "integrity": "sha256-5vygcBxPavXTsMvG3TIBjKY16wX9SXdB+1IpyMYqxE4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.puwdb4kxhw.wasm",
          "integrity": "sha256-bx3tYLvEpOfMviXmUR9pUTILukdj+VBodw40bBvf7ks=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.xndxp3rbhz.wasm",
          "integrity": "sha256-bdh4tB9ULS5XLkYrwBqQ9UMdxO/Eswru3PBWPz+7MnY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.2hachj3qf9.wasm",
          "integrity": "sha256-+rJG2BR8xEeVztvRwvjje3MUz3pTHXtd0Aqba5waiK4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.zt36s7opzu.wasm",
          "integrity": "sha256-5zBFIBWPbjFeCLw7Xsd9ZB7wdNEGLrSeZMLM8g2G+Is=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.resources.wasm",
          "name": "SharpCast.resources.o9qooj628v.wasm",
          "integrity": "sha256-BEECu6kUq9iUNxn/3FnxKItrKa/l+2l6xMUXg4pYxgU=",
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
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.6ydrix4n4z.wasm",
          "integrity": "sha256-XvVDR01x6RN6BdmeIa/vY/cGPgvqliwAHfqdDzSDJLk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.oqxcfypbpj.wasm",
          "integrity": "sha256-MEPSNbRhBo7LLZ0+q1/Tj1FxfRGb7r89FFzIcbtmdu4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.3kqyxpifwm.wasm",
          "integrity": "sha256-DaBi9Ajg2O6c13kHbmxP+7KbgS2pfZEcJnoHkoaouaY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.hu86yp5g11.wasm",
          "integrity": "sha256-t9elFDHp7LGnxEocgLZRoyFx7Ey9VoAb6yie+YdycFY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.gmr50p933z.wasm",
          "integrity": "sha256-GG8/KLkfVGl+OvzcmBXckSvHdlt1s/b9/dok/CWvBJg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.93fwyaqel7.wasm",
          "integrity": "sha256-Zf4YQmMVCxgYGqnkz9QvqZEg2kMJjsIhFEobDw/0Azk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.resources.wasm",
          "name": "SharpCast.resources.880jg1b8q1.wasm",
          "integrity": "sha256-6OuHRWgapatQm7d5m4c9Gop9Zku14QP7/+SK7fSJQsk=",
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
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.b1sticklb0.wasm",
          "integrity": "sha256-L7VVAX3VTvIgZU474lTeBHgiuQxYl6NmSzRF+cmUjnk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dqtqrrbrjm.wasm",
          "integrity": "sha256-BdBnJdWVGophql3s9sQzqW6bchfg8OjbbAZHnXGejmo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.bp234bdujy.wasm",
          "integrity": "sha256-ke8XtUf+4m25xP0Qs39ryCS235nJjz6WizZMBy7lNeM=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.vri9jfytj5.wasm",
          "integrity": "sha256-tUkOSWbXEV7mK7pa7UObtJKYCoVguFUMj3VRRF0xWf8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.vi17fpcv10.wasm",
          "integrity": "sha256-d/be6B5QR9sGqNg0iuPQ4fOVyWI/50x0IFdXKNSi/Rc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.5ocsmx07ez.wasm",
          "integrity": "sha256-JelEuFlE08AMeqsWE1PR9+jwtieO38o8hEo9z/wC39s=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.resources.wasm",
          "name": "SharpCast.resources.ow9lh53i5g.wasm",
          "integrity": "sha256-mEW1FifsaQXUoU3urOs9vrpMve05iys+xwuEPLZTpGc=",
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
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.aozvshmubu.wasm",
          "integrity": "sha256-ptmMN4yy7w33vNswuxcAGfRZ3bU+fb+OPLTEYaDYWMc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.s5wqb5jumu.wasm",
          "integrity": "sha256-UPSZbnzGlFMo0zVa/HJFHpAMg71T7QXE2hJOzR3Phbs=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.7vgwd3747g.wasm",
          "integrity": "sha256-nVkS/MOcBS6Titt62ZcZyufKaaRWMcD5O8R46llSvRo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.ss5rik3zab.wasm",
          "integrity": "sha256-5JeUgRL5OsvibVYllwte6hvNm3f0yvYK7Unsnq4Ermc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.zschwj1wsz.wasm",
          "integrity": "sha256-E7dZG86saYEOXkgPD7VYye0CKo9C6mXsxBe5tXbrKho=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.kddnrje2p6.wasm",
          "integrity": "sha256-eCr/kTEM/lEQgRTKfKtnQpXvPZM7RH7sFTQtP7yglW0=",
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
      "pt-BR": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.cb8w7z3gga.wasm",
          "integrity": "sha256-GPVHcJP1/kNim8ZyqbvDdxy3unbNoPweKaDIdHaJOXU=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.zv156ps1rf.wasm",
          "integrity": "sha256-MZ2Nk6Px9uy5e2UyGvLKtsWhfNoJpEhTF2kz0OiBbZ4=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.1nstpkpk8i.wasm",
          "integrity": "sha256-PU9QBM0MrfNN5qb6TDaoyTpi4zH9mfqLq9qtsdPxjrc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.y8p7o1wypw.wasm",
          "integrity": "sha256-krd2UIEhG7t8HHty4nyHAljVnfn6gqzBn1We1gAFQLk=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.b85f71hxnh.wasm",
          "integrity": "sha256-OyN6udXk/9lxjF7Isgxnb9gs2svrh0/KH3NQcvTz++0=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.7yahgb1qkz.wasm",
          "integrity": "sha256-r/1s0lJNjXwiKvAKQ9rWibYKIrvetFlfvuYN2YPj1KY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.7y97jvbmw3.wasm",
          "integrity": "sha256-4dJOQ+FOZPLjj7cMIF6s5MlmNRJOjmLaUPO/Nn8MF7U=",
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
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.jrtuwdet4j.wasm",
          "integrity": "sha256-0Xnb8+I6FK+UeuOIXmECjBa2JXg6A242nqE/3WxwJ1k=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.dpk6yazkd5.wasm",
          "integrity": "sha256-UaiTpeLfoLlZB7k+dztw4YOwh2R/yUY+LQ/4uE4LyDo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.6o8h5a7s2a.wasm",
          "integrity": "sha256-2rw29vx+wnLc6ays+Dr4/MfOewDWP3wE0UEaTwyh3S8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.v0bbfe7ukp.wasm",
          "integrity": "sha256-j2NaN6UuUYFIjmQ7mjFbBxCP2LkKzNVEwWyPtjSySL8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.0yxjgi59s5.wasm",
          "integrity": "sha256-aKWMbZD/Bcfvsr3TaMMEBt3C0niLxs09W62AuT+Umyg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.5cfnmmqxmq.wasm",
          "integrity": "sha256-ZXvqXJrbrtpzoDczhp+ACXH8FidftfRPKcEArQwL3ko=",
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
      "sr": [
        {
          "virtualPath": "Humanizer.resources.wasm",
          "name": "Humanizer.resources.bx6daa15xa.wasm",
          "integrity": "sha256-T2bjQVB/GTst24hStZd5s0Zq26p3ff2WxEF7V5R47Xw=",
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
          "virtualPath": "SharpCast.resources.wasm",
          "name": "SharpCast.resources.vmx7649y7n.wasm",
          "integrity": "sha256-BwxZvQhv0QAbfeFd8KxWWE221Y2AsLmlhX5sGVODYVs=",
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
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.supgpk80d0.wasm",
          "integrity": "sha256-HBDpI1dSfTKUI/LMl9LtFInbN7GMcHa0u+/Q26DeFGA=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.uizefrs9ny.wasm",
          "integrity": "sha256-VmZv/UnPi7FPtmNb6KSyKSy/oT5u1RsDPKIkQNSgErg=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.3cpfp24kxn.wasm",
          "integrity": "sha256-A29HTkgCyRY6F4NtY01GDQfQIIktLmWoluEWSyP+A6s=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.umwk8ohnvi.wasm",
          "integrity": "sha256-Nho6fJ5UDrpeYTSzu/uzpBhiQsE0y9T41j/y29hBdic=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.453oln03ka.wasm",
          "integrity": "sha256-6NbGE0e+xVJkT7LatizeNCL/5xTQi48G8D3xdyZjbyw=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.uphkrecjin.wasm",
          "integrity": "sha256-TvYmqtEe4SHWyXEOsAD3XkdfNFV4cvB0eac/AmDHE9Q=",
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
          "virtualPath": "SharpCast.resources.wasm",
          "name": "SharpCast.resources.tj6raqv5i1.wasm",
          "integrity": "sha256-6XvYFjJS3Bxd8PbzfU+cqMRrU5pTIdVssKM7NJBm8qA=",
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
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.uoqbwu4d5d.wasm",
          "integrity": "sha256-3jN67QIzaCYlN25M3byvmhrUypuE8F57E786mKscmB8=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.hx2jjh9mf9.wasm",
          "integrity": "sha256-a4OiCzt7JbjlbHS49JCgCY88sQLiif7HS9hKIfUKj7s=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.fs88kym2we.wasm",
          "integrity": "sha256-geU/R390Fg/DPw4EbOze7yy5TVnti6+PVJmex0ZSbSo=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.79zy19plb4.wasm",
          "integrity": "sha256-BeR+mcoX6merz2aRAariIdPIv05U5ngQbnQuFgjM7Jc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.gbijbf25ij.wasm",
          "integrity": "sha256-fMp6Y/UTCnVuz9F/diZo/iD9K3EPL1K0ps869HvJrIc=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.7horqp1cux.wasm",
          "integrity": "sha256-Vd3bxvKNtYGElc5RwOQP4bi9g2XzFt6OAu0l1EhrE/Q=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "SharpCast.resources.wasm",
          "name": "SharpCast.resources.q14lmigs7o.wasm",
          "integrity": "sha256-vmXJeXMituFLye77kweN2ikDhQbHFnz2qlu8RPoZJGE=",
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
          "virtualPath": "Microsoft.CodeAnalysis.resources.wasm",
          "name": "Microsoft.CodeAnalysis.resources.cw5kdl8sc3.wasm",
          "integrity": "sha256-3Hv6IJP0lj56wSIUL0jYPDINIz1sLup1I5Tt9uwIlGU=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.resources.nlbexjoxba.wasm",
          "integrity": "sha256-xSB7bMK5Y8KOYtZjBTJ+ysPnxrkmH/a0TcaQmldtABY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.CSharp.Workspaces.resources.ra50fj1r2c.wasm",
          "integrity": "sha256-04XcBRjXn+IKppX5jACWNYk2wDXqH86RMNi7pcWjeEY=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.resources.3snf57yw91.wasm",
          "integrity": "sha256-I+faSZQeRQFN2BzixxJuBuUjWMqF160ffFHjb1yOvlE=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.VisualBasic.Workspaces.resources.umvqfgpaxf.wasm",
          "integrity": "sha256-puEhRs38bllKTmOzKiMD30wxemHc2JFStJD6x517FLQ=",
          "cache": "force-cache"
        },
        {
          "virtualPath": "Microsoft.CodeAnalysis.Workspaces.resources.wasm",
          "name": "Microsoft.CodeAnalysis.Workspaces.resources.hz9zb8k7nm.wasm",
          "integrity": "sha256-s9fnrOJAkwfS27dcYcdKwBrg2SNKfPa97nG8zVjmqGU=",
          "cache": "force-cache"
        }
      ],
      "en": [
        {
          "virtualPath": "SharpCast.resources.wasm",
          "name": "SharpCast.resources.z33ow68k3e.wasm",
          "integrity": "sha256-QWIK4W8VWH3nUZt+8Zw5ZXWD1ML+4EflIlpsKSrCmnc=",
          "cache": "force-cache"
        }
      ],
      "tl": [
        {
          "virtualPath": "SharpCast.resources.wasm",
          "name": "SharpCast.resources.fkxe1herqo.wasm",
          "integrity": "sha256-kTnpZYsuoQXd1wokB1f9V/1dKa+oh7qFUDjjrox0/Q4=",
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
