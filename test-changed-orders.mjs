import {unlockInquiry,reviewSupplement,collectFraudEvidence} from './investigation-test-helpers.mjs';
import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1280,height:760}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8766/?design=paper&test=changed');await p.waitForFunction(()=>F&&ATLAS_IMG&&CHANGED_ORDER_TEST);
const tick=async(ms)=>{for(let i=0;i<ms;i+=100)await p.evaluate(()=>advanceTime(100));};
const click=async(x,y)=>{const r=await p.locator('canvas').boundingBox();await p.mouse.click(r.x+x*r.width/640,r.y+y*r.height/360);};
await tick(500);await p.screenshot({path:'output/changed-orders-menu.png'});
await click(100,295);await tick(1100);assert.equal(await p.evaluate(()=>CASE_COUNT),8);await click(520,325);await tick(500);
assert.deepEqual(await p.evaluate(()=>B.queue.map(s=>s.contract.orderId)),['R-003','R-002','R-101','R-104','R-201','R-205','R-303','R-307']);
for(let i=0;i<8;i++){
 await click(109,199);await tick(4200);await click(168,275);await tick(2400);
 if(await p.evaluate(()=>B.ent.spec.needsLog)){await click(196,275);await tick(2000);}
 await unlockInquiry(p);await click(185,114);await tick(3200);assert.equal(await p.evaluate(()=>B.ent.supplementReady),true);
 await reviewSupplement(p);if(await p.evaluate(()=>B.ent.spec.fraud))await collectFraudEvidence(p);
 await p.evaluate(()=>{B.ent.fraudMarked=B.ent.spec.fraud;judge(B.ent,B.ent.spec.ok[0]);B.docs=B.docs.filter(d=>d.owner!=='ent');B.ent=null;B.lastFinish=now;});
}
assert.equal(await p.evaluate(()=>B.correct),8);
await p.evaluate(()=>go('summary'));await tick(300);await click(320,300);assert.equal(await p.evaluate(()=>scene),'title');
for(let i=0;i<8;i++){
 await click(80+(i%2)*280,95+Math.floor(i/2)*46);await tick(1000);assert.equal(await p.evaluate(()=>CASE_COUNT),1);await click(520,325);await tick(300);assert.equal(await p.evaluate(()=>B.queue.length),1);await p.getByRole('button',{name:'返回测试合集',exact:true}).click();assert.equal(await p.evaluate(()=>scene),'title');
}
await click(400,295);await p.waitForURL(u=>!u.searchParams.has('test'));assert.equal(await p.evaluate(()=>CHANGED_ORDER_TEST),false);assert.equal(await p.evaluate(()=>chapterIndex),0);assert.equal(await p.evaluate(()=>buildQueue().length),4);assert.deepEqual(errors,[]);await b.close();console.log('PASS changed-order collection: 8 exact cases, inquiry/scoring, summary return, 8 single-case selections, toolbar exit and untouched normal campaign');
