import {spawn} from 'node:child_process';
import {mkdir,writeFile,readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=process.cwd(),out=path.join(root,'qa-output');
await mkdir(out,{recursive:true});
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const server=spawn(process.execPath,['server.mjs'],{cwd:root,windowsHide:true,stdio:'pipe'});
const browser=spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=9421','--user-data-dir='+path.join(root,'.qa-browser'),'about:blank'],{windowsHide:true,stdio:'ignore'});
let ws;
try{
 let targets;
 for(let i=0;i<80;i++){try{targets=await(await fetch('http://127.0.0.1:9421/json')).json();if(targets.some(t=>t.type==='page'))break;}catch{}await pause(150);}
 const target=targets?.find(t=>t.type==='page');assert(target,'browser CDP target unavailable');
 ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 let seq=0;const pending=new Map(),errors=[];
 ws.onmessage=e=>{const msg=JSON.parse(e.data);if(msg.id){const p=pending.get(msg.id);if(p){pending.delete(msg.id);if(msg.error)p.reject(Error(JSON.stringify(msg.error)));else p.resolve(msg.result);}}else if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params.exceptionDetails.text+': '+(msg.params.exceptionDetails.exception?.description||''));};
 function cdp(method,params={}){return new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});}
 async function ev(expression){const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;}
 const click=selector=>ev(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)throw Error('Missing: '+${JSON.stringify(selector)});if(el.disabled)throw Error('Disabled: '+${JSON.stringify(selector)});el.click();return true;})()`);
 const fill=(selector,value)=>ev(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el)throw Error('Missing field');el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 async function submit(selector){await ev(`document.querySelector(${JSON.stringify(selector)}).requestSubmit()`);await pause(80);}
 async function go(hash){await ev(`location.hash=${JSON.stringify(hash)}`);await pause(80);}
 const count=sel=>ev(`document.querySelectorAll(${JSON.stringify(sel)}).length`);
 const text=sel=>ev(`document.querySelector(${JSON.stringify(sel)})?.textContent`);
 async function modalClose(){if(await ev('document.querySelector("#modal").open'))await click('[data-action="close"]');}
 async function mode(id){await go('#modes');await click(`[data-action="mode"][data-id="${id}"]`);}
 async function draw(n){for(let i=0;i<n;i++)await click('[data-action="pick"]');}
 async function screenshot(name,w,h){await cdp('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<600});await pause(150);await ev('scrollTo(0,0)');const shot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(path.join(out,name),Buffer.from(shot.data,'base64'));}
 await cdp('Runtime.enable');await cdp('Page.enable');await cdp('Page.navigate',{url:'http://127.0.0.1:4173/'});await pause(650);await ev('localStorage.clear()');await cdp('Page.reload');await pause(350);
 assert.equal(await count('.spread-card'),18);assert((await text('.hero')).includes('165'));
 await screenshot('desktop.png',1440,1180);
 await screenshot('mobile.png',390,1200);
 assert(await ev('document.documentElement.scrollWidth<=innerWidth'),'mobile horizontal overflow');
 await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
 await fill('#search','凯尔特');assert.equal(await count('.spread-card'),1);await fill('#search','');
 await click('.spread-card .favorite');assert(await ev('JSON.parse(localStorage.getItem("moonlit.favorites")).length===1'));
 await click('.hero [data-action="spread"]');await submit('#spread-form');await draw(1);await click('[data-action="reveal-all"]');assert.equal(await count('.orientation'),1);await fill('#round-note','此刻想到：先完成一个小行动。');await click('[data-action="note-save"]');assert(await ev('JSON.parse(localStorage.getItem("moonlit.history")).at(-1).results[0].note.includes("小行动")'));
 await click('[data-action="clarify"]');await submit('#clarifier-form');await draw(1);await click('[data-action="reveal-all"]');assert.equal(await count('.clarifier-mark'),1);assert.equal(await count('.orientation'),2);
 await screenshot('reading.png',1440,1100);
 await mode('free');await fill('[name="count"]','78');await submit('#mode-form');await draw(78);await click('[data-action="reveal-all"]');await click('[data-action="save-round"]');assert(await ev('(()=>{const x=JSON.parse(localStorage.getItem("moonlit.history")).at(-1);return x.results.length===78&&new Set(x.results.map(r=>r.cardId)).size===78})()'));
 await mode('branch');await submit('#mode-form');await draw(3);await click('[data-action="reveal-all"]');await click('[data-action="branch"]');await click('[data-action="branch-choice"]');await draw(1);await click('[data-action="reveal-all"]');assert.equal(await count('.orientation'),4);assert.equal(await count('.clarifier-mark'),1);
 await mode('clarify');await submit('#mode-form');await draw(3);await click('[data-action="reveal-all"]');assert.equal(await count('.orientation'),3);
 await mode('duo');await fill('[name="count"]','1');await submit('#mode-form');await draw(1);assert(await ev('document.querySelector("[data-action=reveal-all]").disabled'));await click('[data-action="select-result"]');assert.equal(await count('.orientation'),0);await draw(1);await click('[data-action="reveal-all"]');assert.equal(await count('.orientation'),2);
 await mode('story');await submit('#mode-form');await draw(1);assert.equal(await count('.orientation'),1);await draw(1);assert.equal(await count('.orientation'),1,'story must wait for text before next participant');await fill('#round-note','旅人在月光下发现一封信。');await click('[data-action="note-save"]');await draw(1);assert.equal(await count('.orientation'),2);
 await mode('blind');await submit('#mode-form');await draw(1);await click('[data-action="reveal-all"]');assert.equal(await count('.keywords'),0);await click('[data-action="unlock"]');assert.equal(await count('.keywords'),0);await fill('#round-note','我看到了流动与可能。');await click('[data-action="unlock"]');assert.equal(await count('.keywords'),1);
 await mode('builder');await fill('#builder-name','测试星光牌阵');await fill('[data-position-x="0"]','25');await submit('#builder-form');assert.equal(await count('.custom-list .journal-entry'),1);await click('.custom-list [data-action="spread"]');await submit('#spread-form');assert.equal(await count('.custom-positioned'),1);assert((await ev('document.querySelector(".result-slot").style.left')).includes('25%'));
 await mode('quiz');await submit('#quiz-form');for(let i=0;i<10;i++){await click('[data-action="quiz-answer"]');await click('[data-action="quiz-next"]');}assert((await text('.quiz-area')).includes('完成 10 题'));
 for(const kind of ['keyword','reverse']){await mode('quiz');await fill('[name="kind"]',kind);await submit('#quiz-form');assert.equal(await count('.quiz-options button'),4);await click('[data-action="quiz-answer"]');assert.equal(await count('.quiz-feedback'),1);}
 await mode('recommend');await submit('#recommend-form');assert.equal(await count('[data-action="recommend-spread"]'),1);await click('[data-action="recommend-spread"]');assert.equal(await count('#spread-form'),1);await modalClose();
 await mode('recommend');await fill('[name="people"]','3');await submit('#recommend-form');assert.equal(await count('[data-action="recommend-mode"]'),1);await modalClose();
 await mode('physical');await submit('#physical-setup-form');await fill('[name="card-0"]','17');await fill('[name="orientation-0"]','reverse');await submit('#physical-cards-form');assert.equal(await count('.orientation.reverse'),1);assert(await ev('JSON.parse(localStorage.getItem("moonlit.history")).at(-1).physical===true'));
 await go('#journal');await click('[data-action="journal-tab"][data-id="history"]');await click('[data-action="history-open"]');await fill('.history-note','回看时补充的一点想法。');assert(await ev('JSON.parse(localStorage.getItem("moonlit.history")).some(x=>x.results.some(r=>r.note==="回看时补充的一点想法。"))'));await modalClose();
 await cdp('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:out});
 await click('[data-action="export"]');await pause(350);
 const backups=(await readdir(out)).filter(n=>n.endsWith('.json'));assert(backups.length,'export should download a backup');
 const backupPath=path.join(out,backups.at(-1));const backup=JSON.parse(await readFile(backupPath,'utf8'));assert.equal(backup.format,'moonlit-tarot-v1');assert(backup.history.length>=5);assert.equal(backup.custom.length,1);
 const oldHistoryCount=backup.history.length;
 await ev('localStorage.clear()');await cdp('Page.reload');await pause(250);
 await click('[data-action="import"]');
 const doc=await cdp('DOM.getDocument');const fileNode=await cdp('DOM.querySelector',{nodeId:doc.root.nodeId,selector:'#backup-file'});
 await cdp('DOM.setFileInputFiles',{nodeId:fileNode.nodeId,files:[backupPath]});await pause(250);
 assert(await ev(`JSON.parse(localStorage.getItem('moonlit.history')).length===${oldHistoryCount}`),'backup must restore history');
 assert(await ev('JSON.parse(localStorage.getItem("moonlit.custom")).length===1'),'backup must restore custom layouts');
 assert(await ev('JSON.parse(localStorage.getItem("moonlit.favorites")).length===1'),'backup must restore favorites');
 await click('[data-action="import"]');const doc2=await cdp('DOM.getDocument');const file2=await cdp('DOM.querySelector',{nodeId:doc2.root.nodeId,selector:'#backup-file'});await cdp('DOM.setFileInputFiles',{nodeId:file2.nodeId,files:[backupPath]});await pause(250);
 assert(await ev(`JSON.parse(localStorage.getItem('moonlit.history')).length===${oldHistoryCount}`),'backup merge must not duplicate records');
 await click('[data-action="journal-tab"][data-id="custom"]');await click('.custom-list [data-action="spread"]');await submit('#spread-form');
 await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:1000,deviceScaleFactor:1,mobile:true});assert(await ev('document.documentElement.scrollWidth<=innerWidth'),'custom layout must fit mobile');
 await go('#home');await screenshot('final-desktop.png',1440,1180);await screenshot('final-mobile.png',390,1200);
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS: responsive layouts, search, favorites, 78-card no-repeat exhaustion, 10 modes, blind unlock, group reveal, custom layout, 10 quiz questions, physical import, notes persistence, backup export/restore/deduplication.');
 console.log('Screenshots: '+out);
}finally{if(ws?.readyState===1){try{ws.send(JSON.stringify({id:999999,method:'Browser.close'}));}catch{}ws.close();}server.kill();setTimeout(()=>browser.kill(),500).unref();}
