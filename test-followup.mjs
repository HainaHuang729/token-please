import {unlockInquiry,reviewSupplement,collectFraudEvidence} from './investigation-test-helpers.mjs';
import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1280,height:760}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8766/?design=paper');await p.waitForFunction(()=>F&&ATLAS_IMG&&typeof authorizedSupplement==='function');
const tick=async(ms)=>{for(let i=0;i<ms;i+=100)await p.evaluate(()=>advanceTime(100));};
const click=async(x,y)=>{const r=await p.locator('canvas').boundingBox();await p.mouse.click(r.x+x*r.width/640,r.y+y*r.height/360);};
const setup=async(ch,i)=>{await p.evaluate(({ch,i})=>{newGame();chapterIndex=ch;setChapterRules();go('booth');B.ent=newEntrant(relaySpec(CHAPTERS[ch].cases[i],ch*100+i),true);handDocs(B.ent);Object.assign(B.ent.docs[0],{big:true,x:476,y:140});},{ch,i});await tick(3000);await click(168,275);await tick(2500);await click(196,275);await tick(2500);};
const compare=async(a,b)=>{const pts=await p.evaluate(({a,b})=>{setInspect(true);const da=B.docs.find(d=>d.key===a[0]),db=B.docs.find(d=>d.key===b[0]);Object.assign(da,{x:235,y:140});Object.assign(db,{x:465,y:140});B.docs=B.docs.filter(d=>d!==da&&d!==db).concat([da,db]);return [a,b].map(([k,f])=>{const d=B.docs.find(d=>d.key===k),r=d.doc.fields[f];return [d.x+r[0]+8,d.y+r[1]+6];});},{a,b});for(const pt of pts)await click(...pt);return p.evaluate(()=>B.insp.banner);};
for(const [ch,i,decision,fraud] of [[2,0,'approve',false],[2,4,'deny',true],[3,2,'approve',false],[3,6,'deny',true]]){
 await setup(ch,i);assert.equal(await p.evaluate(()=>B.docs.some(d=>d.key==='supplement')),false);assert.equal(await p.evaluate(()=>!!B.ent.supplementReady),false);
 await p.evaluate(()=>judge(B.ent,B.ent.spec.ok[0]));assert.equal(await p.evaluate(()=>S.stats.wrong),1,'missing supplemental document must fail');await tick(2000);
 await unlockInquiry(p);await click(185,114);await click(185,114);await tick(3200);assert.equal(await p.evaluate(()=>B.docs.filter(d=>d.key==='supplement').length),1);assert.equal(await p.evaluate(()=>B.ent.supplementReady),true);
 let banner;
 if(ch===2)banner=await compare(['dv','编号'],['supplement','编号']);else banner=await compare(['dv','授权'],['supplement','上游']);
 assert.equal(!!banner.bad,decision==='deny');
 if(ch===2&&i===0){banner=await compare(['supplement','上游'],['log','上游']);assert.equal(banner.bad,false);assert.equal(banner.title,'代工获补充授权');}
 assert.equal(await p.evaluate(()=>B.ent.spec.ok[0]),decision);assert.equal(await p.evaluate(()=>B.ent.spec.fraud),fraud);
 await reviewSupplement(p);if(fraud)await collectFraudEvidence(p);
 await p.evaluate(fraud=>{B.ent.fraudMarked=fraud;},fraud);await p.evaluate(dec=>judge(B.ent,dec),decision);assert.equal(await p.evaluate(()=>B.correct),1);
 await p.screenshot({path:`output/followup-${ch}-${i}.png`});
}
// Queued print is discarded if its entrant is replaced.
await setup(2,0);await unlockInquiry(p);await p.evaluate(()=>{printDoc(new Citation(['队列测试']),4,'cit');askDelivery();});await tick(1200);await p.evaluate(()=>{B.ent=null;callNext();});await tick(6000);assert.equal(await p.evaluate(()=>B.docs.some(d=>d.key==='supplement')),false);assert.equal(await p.evaluate(()=>!!B.ent.supplementReady),false);
assert.deepEqual(errors,[]);await b.close();console.log('PASS four gated cases, legal/illegal authorizations and retries, actual field clicks, missing-material penalties, verdicts, duplicates, stale-queue cleanup');
