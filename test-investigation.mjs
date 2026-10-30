import {chromium} from 'playwright';import assert from 'node:assert/strict';import {compareEvidence} from './investigation-test-helpers.mjs';
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1280,height:760}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8766/?design=paper&test=changed');await p.waitForFunction(()=>F&&ATLAS_IMG&&typeof inquiryPair==='function');
const tick=async(ms)=>{for(let i=0;i<ms;i+=100)await p.evaluate(()=>advanceTime(100));};
const click=async(x,y)=>{const r=await p.locator('canvas').boundingBox();await p.mouse.click(r.x+x*r.width/640,r.y+y*r.height/360);};
const setup=async(ch,i)=>{await p.evaluate(({ch,i})=>{newGame();go('booth');B.ent=newEntrant(relaySpec(CHAPTERS[ch].cases[i],ch*100+i),true);handDocs(B.ent);},{ch,i});await tick(3000);await click(168,275);await tick(2500);if(await p.evaluate(()=>B.ent.spec.needsLog)){await click(196,275);await tick(2000);}};
await setup(0,1);await click(185,114);await tick(2500);assert.equal(await p.evaluate(()=>!!B.ent.supplementReady),false);assert.equal(await p.evaluate(()=>!!B.ent.inquiryUnlocked),false);
await compareEvidence(p,['dv.预算','receipt.扣款']);assert.equal(await p.evaluate(()=>!!B.ent.inquiryUnlocked),false);
let banner=await compareEvidence(p,['dv.授权','receipt.上游']);assert.equal(banner.inquiry,true);assert.equal(banner.bad,false);await p.screenshot({path:'output/investigation-lead.png'});
await click(569,150);await tick(3200);assert.equal(await p.evaluate(()=>B.ent.supplementReady),true);assert.equal(await p.evaluate(()=>!!B.ent.supplementReviewed),false);
await p.evaluate(()=>judge(B.ent,'deny'));assert.equal(await p.evaluate(()=>S.stats.wrong),1);await tick(1800);
await click(474,335);assert.equal(await p.evaluate(()=>!!B.ent.fraudMarked),false);
await compareEvidence(p,['dv.授权','supplement.上游']);assert.equal(await p.evaluate(()=>B.ent.supplementReviewed),true);assert.equal(await p.evaluate(()=>B.ent.fraudEvidence.title),'交付模型不符');await p.screenshot({path:'output/investigation-proof.png'});
await click(474,335);assert.equal(await p.evaluate(()=>B.ent.fraudMarked),true);await p.evaluate(()=>judge(B.ent,'deny'));assert.equal(await p.evaluate(()=>B.correct),1);
// A tool discrepancy cannot be used as evidence of cross-brand substitution.
await setup(2,2);await compareEvidence(p,['dv.工具','log.执行']);assert.equal(await p.evaluate(()=>B.insp.banner.bad),true);await click(474,335);assert.equal(await p.evaluate(()=>!!B.ent.fraudMarked),false);await compareEvidence(p,['dv.授权','log.上游']);await click(474,335);assert.equal(await p.evaluate(()=>B.ent.fraudMarked),true);
// Ordinary compliant orders still need no comparison checklist.
await setup(0,0);await p.evaluate(()=>judge(B.ent,'approve'));assert.equal(await p.evaluate(()=>B.correct),1);assert.equal(await p.evaluate(()=>B.ent.fraudEvidence||null),null);
assert.deepEqual(errors,[]);await b.close();console.log('PASS investigation chain: blocked direct inquiry, unrelated comparisons, lead/ask button, post-print review gate, fraud evidence specificity, normal approval, entrant isolation');
