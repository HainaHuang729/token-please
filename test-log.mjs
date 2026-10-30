import {unlockInquiry,reviewSupplement,collectFraudEvidence} from './investigation-test-helpers.mjs';
import {chromium} from 'playwright';import assert from 'node:assert/strict';
const browser=await chromium.launch();const p=await browser.newPage({viewport:{width:1280,height:760}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8766');await p.waitForFunction(()=>typeof retrieveLog==='function'&&F&&ATLAS_IMG);
const tick=async(ms)=>{for(let i=0;i<ms;i+=100)await p.evaluate(()=>advanceTime(100));};
const pos=async(x,y)=>{const b=await p.locator('canvas').boundingBox();return [b.x+x*b.width/640,b.y+y*b.height/360];};
const click=async(x,y)=>p.mouse.click(...await pos(x,y));
const setup=async(ch,idx)=>p.evaluate(({ch,idx})=>{newGame();chapterIndex=ch;setChapterRules();go('booth');B.idx=idx+1;B.ent=newEntrant(relaySpec(CHAPTERS[ch].cases[idx],ch*100+idx),true);handDocs(B.ent);Object.assign(B.ent.docs[0],{big:true,x:476,y:140});},{ch,idx});
await setup(2,2);
await click(196,275);assert.equal(await p.evaluate(()=>!!B.ent.logLoading),false,'receipt must arrive first');
await click(168,275);await tick(1700);await click(196,275);await click(196,275);assert.equal(await p.evaluate(()=>!!B.ent.logVerified),false,'not verified during printing');await tick(1500);
assert.equal(await p.evaluate(()=>B.docs.filter(d=>d.key==='log').length),1);assert.equal(await p.evaluate(()=>B.ent.logVerified),true);
await p.screenshot({path:'output/three-documents.png'});
// All three sheets can be selected and the log can be dragged independently.
const before=await p.evaluate(()=>{const d=B.docs.find(d=>d.key==='log');return [d.x,d.y];});
await p.mouse.move(...await pos(before[0]+10,before[1]+8));await p.mouse.down();await p.mouse.move(...await pos(245,145),{steps:12});await p.mouse.up();
assert.notDeepEqual(await p.evaluate(()=>{const d=B.docs.find(d=>d.key==='log');return [d.x,d.y];}),before);
// Position the desired pair on top; compare actual field clicks.
const compare=async(a,b)=>{
 const points=await p.evaluate(({a,b})=>{setInspect(true);const da=B.docs.find(d=>d.key===a[0]),db=B.docs.find(d=>d.key===b[0]);Object.assign(da,{x:235,y:140});Object.assign(db,{x:465,y:140});B.docs=B.docs.filter(d=>d!==da&&d!==db).concat([da,db]);return [a,b].map(([key,field])=>{const d=B.docs.find(d=>d.key===key),f=d.doc.fields[field];return [d.x+f[0]+12,d.y+(f[1]+f[3])/2];});},{a,b});
 for(const pt of points)await click(...pt);return p.evaluate(()=>B.insp.banner);
};
assert.equal((await compare(['receipt','上游'],['log','上游'])).title,'回执与日志不一致');await p.screenshot({path:'output/log-model-conflict.png'});
assert.equal((await compare(['dv','授权'],['log','上游'])).title,'交付模型不符');
await setup(3,4);await click(168,275);await tick(1700);await click(196,275);await tick(1500);
assert.equal(await p.evaluate(()=>B.docs.find(d=>d.key==='dv').doc.rows.find(r=>r[0]==='指纹')[1]===B.docs.find(d=>d.key==='receipt').doc.rows.find(r=>r[0]==='实纹')[1]),true);
assert.equal((await compare(['receipt','实纹'],['log','实纹'])).bad,true);
assert.equal((await compare(['dv','指纹'],['log','实纹'])).title,'输入内容被替换');await p.screenshot({path:'output/log-digest-conflict.png'});
// Required log check actually affects scoring.
await setup(2,0);await click(168,275);await tick(1700);await p.evaluate(()=>judge(B.ent,'approve'));assert.equal(await p.evaluate(()=>B.correct),0);assert.equal(await p.evaluate(()=>S.stats.wrong),1);
await setup(2,0);await click(168,275);await tick(1700);await click(196,275);await tick(1500);await unlockInquiry(p);await p.evaluate(()=>askDelivery());await tick(3000);await reviewSupplement(p);await p.evaluate(()=>judge(B.ent,'approve'));assert.equal(await p.evaluate(()=>B.correct),1);
// Stale records do not survive a new entrant, including an in-flight log print.
await p.evaluate(()=>{B.ent=null;callNext();});assert.equal(await p.evaluate(()=>B.docs.some(d=>d.key==='log')),false);
await setup(2,0);await click(168,275);await tick(1700);await click(196,275);await p.evaluate(()=>{B.ent=null;callNext();});await tick(1500);assert.equal(await p.evaluate(()=>B.docs.some(d=>d.key==='log')),false);
assert.deepEqual(errors,[]);await browser.close();console.log('PASS: third-file retrieval, print gating, duplicates, independent dragging, cross-document conflicts, scoring, stale-log cleanup');
