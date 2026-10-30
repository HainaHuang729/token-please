import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1280,height:760}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8766/?design=paper&test=changed');await p.waitForFunction(()=>F&&ATLAS_IMG&&typeof guideState==='function');
const tick=async(ms)=>{for(let i=0;i<ms;i+=100)await p.evaluate(()=>advanceTime(100));};
const click=async(x,y)=>{const r=await p.locator('canvas').boundingBox();await p.mouse.click(r.x+x*r.width/640,r.y+y*r.height/360);};
const setup=async(ch,i)=>{await p.evaluate(({ch,i})=>{newGame();go('booth');B.ent=newEntrant(relaySpec(CHAPTERS[ch].cases[i],ch*100+i),true);handDocs(B.ent);},{ch,i});await tick(3000);};
const field=async(key)=>{const pt=await p.evaluate(key=>{const f=guideField(key);return [(f.box[0]+f.box[2])/2,(f.box[1]+f.box[3])/2];},key);await click(...pt);};
await setup(0,1);await p.evaluate(()=>setInspect(true));assert.deepEqual(await p.evaluate(()=>guideState().missing),['receipt.上游']);await p.screenshot({path:'output/guide-missing.png'});await click(168,275);await tick(2500);await click(608,113);
assert.deepEqual(await p.evaluate(()=>guideState().pair),['dv.授权','receipt.上游']);assert.equal(await p.evaluate(()=>B.insp.banner),null);assert.equal(await p.evaluate(()=>!!B.ent.inquiryUnlocked),false);
await p.screenshot({path:'output/guide-step1.png'});const badge=await p.evaluate(()=>{const b=guideField('dv.授权').box;return [b[0]-9,b[1]+6];});await click(...badge);assert.equal(await p.evaluate(()=>guideState().next),'receipt.上游');assert.equal(await p.evaluate(()=>B.insp.banner),null);await p.screenshot({path:'output/guide-step2.png'});await field('receipt.上游');assert.equal(await p.evaluate(()=>B.insp.banner.inquiry),true);
await click(569,150);await tick(3200);await click(615,335);assert.deepEqual(await p.evaluate(()=>guideState().pair),['dv.授权','supplement.上游']);await field('dv.授权');await field('supplement.上游');assert.equal(await p.evaluate(()=>B.ent.supplementReviewed),true);
// Player chooses a different topic, including selecting the record before the order.
await setup(0,0);await click(168,275);await tick(2500);await click(615,335);await field('receipt.扣款');assert.ok(await p.evaluate(()=>guideState().pair.includes('dv.预算')));assert.equal(await p.evaluate(()=>guideState().next),'dv.预算');await field('dv.预算');assert.equal(await p.evaluate(()=>B.insp.banner.bad),false);
// The hints for every special case are based on workflow, not the answer.
for(const [ch,i,pair] of [[0,2,['dv.授权','receipt.上游']],[1,0,['dv.版本','receipt.实版']],[1,3,['dv.版本','receipt.实版']],[2,0,['dv.授权','log.上游']],[2,4,['dv.授权','log.上游']],[3,2,['dv.重试','log.线路']],[3,6,['dv.重试','log.线路']]]){
 await setup(ch,i);await click(168,275);await tick(2500);if(ch>=2){await click(196,275);await tick(2000);}await click(615,335);assert.deepEqual(await p.evaluate(()=>guideState().pair),pair);assert.equal(await p.evaluate(()=>B.insp.banner),null);await field(pair[0]);await field(pair[1]);assert.equal(await p.evaluate(()=>B.insp.banner.inquiry),true);
}
assert.deepEqual(errors,[]);await b.close();console.log('PASS comparison guide: missing-material prompts, automatic spread, real step1/2 clicks, supplementary-stage update, reverse selection, all8 neutral inquiry hints');
