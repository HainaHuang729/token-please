import {unlockInquiry,reviewSupplement,collectFraudEvidence} from './investigation-test-helpers.mjs';
import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1280,height:760}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8766/?design=paper');await p.waitForFunction(()=>F&&ATLAS_IMG&&typeof authorizedSupplement==='function');
const tick=async(ms)=>{for(let i=0;i<ms;i+=100)await p.evaluate(()=>advanceTime(100));};
const click=async(x,y)=>{const r=await p.locator('canvas').boundingBox();await p.mouse.click(r.x+x*r.width/640,r.y+y*r.height/360);};
for(const [ch,i,bad] of [[0,1,true],[0,2,false],[1,0,false],[1,3,true]]){
 await p.evaluate(({ch,i})=>{newGame();chapterIndex=ch;setChapterRules();go('booth');B.ent=newEntrant(relaySpec(CHAPTERS[ch].cases[i],ch*100+i),true);handDocs(B.ent);},{ch,i});await tick(3000);
 await click(185,114);assert.equal(await p.evaluate(()=>!!B.ent.supplementLoading),false,'requires receipt first');await click(168,275);await tick(2500);
 assert.equal(await p.evaluate(()=>B.ent.verified),true);assert.equal(await p.evaluate(()=>B.docs.some(d=>d.key==='supplement')),false);
 assert.equal(await p.evaluate(()=>B.docs.find(d=>d.key==='receipt').doc.rows.find(r=>r[0]===B.ent.spec.followup.field)[1]),'缺页 / 待补');
 assert.ok(await p.evaluate(()=>B.lines.some(l=>l.text==='咦，打印少了一页。你问我拿。')));
 await p.evaluate(()=>judge(B.ent,B.ent.spec.ok[0]));assert.equal(await p.evaluate(()=>B.correct),0);await tick(2000);
 await unlockInquiry(p);await click(185,114);await click(185,114);await tick(3200);assert.equal(await p.evaluate(()=>B.docs.filter(d=>d.key==='supplement').length),1);assert.equal(await p.evaluate(()=>B.ent.supplementReady),true);
 const pts=await p.evaluate(()=>{setInspect(true);const order=B.docs.find(d=>d.key==='dv'),supp=B.docs.find(d=>d.key==='supplement'),field=B.ent.spec.followup.field;Object.assign(order,{big:true,x:235,y:140});Object.assign(supp,{x:465,y:140});B.docs=B.docs.filter(d=>d!==order&&d!==supp).concat([order,supp]);return [[order,field==='上游'?'授权':'版本'],[supp,field]].map(([d,k])=>{const f=d.doc.fields[k];return [d.x+f[0]+8,d.y+f[1]+6];});});for(const pt of pts)await click(...pt);
 assert.equal(!!(await p.evaluate(()=>B.insp.banner.bad)),bad);await p.evaluate(()=>{B.ent.fraudMarked=B.ent.spec.fraud;judge(B.ent,B.ent.spec.ok[0]);});assert.equal(await p.evaluate(()=>B.correct),1);
 await p.screenshot({path:`output/early-dialogue-${ch}-${i}.png`});
}
assert.deepEqual(errors,[]);await b.close();console.log('PASS early dialogue: four missing-page cases, unavailable fields before asking, real question clicks, legal/illegal model and version comparisons, no automatic confession, missing-page penalties');
