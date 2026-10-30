import {unlockInquiry,reviewSupplement,collectFraudEvidence} from './investigation-test-helpers.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1280,height:760}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:8766');await page.waitForFunction(()=>typeof render_game_to_text==='function'&&typeof F!=='undefined'&&ATLAS_IMG);
assert.equal(await page.evaluate(()=>new Set(buildQueue().map(s=>s.person)).size),3);
assert.equal(await page.evaluate(()=>MODEL_CAST.every(([k])=>SPR[k+':neutral']&&SPR[k+':talk'])),true);
const tick=async(ms)=>{for(let t=0;t<ms;t+=100)await page.evaluate(()=>advanceTime(100));};
const box=await page.locator('canvas').boundingBox();
const pos=(x,y)=>[box.x+x*box.width/640,box.y+y*box.height/360];
const click=async(x,y)=>page.mouse.click(...pos(x,y));
const drag=async(x,y,a,b)=>{await page.mouse.move(...pos(x,y));await page.mouse.down();await page.mouse.move(...pos(a,b),{steps:12});await page.mouse.up();};
await click(320,326);assert.equal(await page.evaluate(()=>showingRoster),true);await page.screenshot({path:'output/roster.png'});await click(320,338);
await click(320,300);await tick(1000);await page.screenshot({path:'output/briefing.png'});await click(520,325);await tick(500);
for(let ch=0;ch<5;ch++){
 const count=4+ch;
 assert.equal(await page.evaluate(()=>CASE_COUNT),count);
 assert.equal(await page.evaluate(()=>chapterIndex),ch);
 assert.equal(await page.evaluate(()=>RULES.filter(r=>r.isNew).length),2);
 assert.equal(await page.evaluate(()=>new Set(CHAPTERS.slice(0,chapterIndex+1).flatMap(c=>c.cases.map(s=>s.person))).size),[3,5,7,9,10][ch]);
 await page.screenshot({path:'output/chapter-'+(ch+1)+'-desk.png'});
 for(let i=0;i<count;i++){

 await click(109,199);await tick(4500);
 assert.equal(await page.evaluate(()=>B.ent.handed),true);
 await drag(54,270,465,200);
 if(i===0){await click(545,335);await page.screenshot({path:'output/contract.png'});await click(545,335);}
 {
   await click(168,275);await tick(2200);
   assert.equal(await page.evaluate(()=>B.ent.verified),true);
   assert.equal(await page.evaluate(()=>B.docs.filter(d=>d.key==='receipt').length),1);
   await click(168,275);await tick(500);
   assert.equal(await page.evaluate(()=>B.docs.filter(d=>d.key==='receipt').length),1);
 }
 if(ch>=2){await click(196,275);await tick(2000);assert.equal(await page.evaluate(()=>B.ent.logVerified),true);}
 if(await page.evaluate(()=>!!B.ent.spec.followup)){await unlockInquiry(page);await click(185,114);await tick(3200);assert.equal(await page.evaluate(()=>B.ent.supplementReady),true);await reviewSupplement(page);}
 if(await page.evaluate(()=>B.ent.spec.fraud)){await collectFraudEvidence(page);await click(474,335);assert.equal(await page.evaluate(()=>B.ent.fraudMarked),true);}
 await page.screenshot({path:'output/cast-'+i+'.png'});
 if(i===0)await page.screenshot({path:'output/gpt.png'});
 if(i===1)await page.screenshot({path:'output/verified.png'});
 const p=await page.evaluate(()=>{const d=B.docs.find(d=>d.key==='dv');return [d.x,d.y];});
 await drag(p[0]+10,p[1]+10,475,200);
 await click(628,222);await tick(500);
 await click((await page.evaluate(()=>B.ent.spec.ok[0]))==='approve'?500:580,215);await tick(1600);
 assert.equal(await page.evaluate(()=>B.docs.find(d=>d.key==='dv').marks.length),1);
 const d=await page.evaluate(()=>{const d=B.docs.find(d=>d.key==='dv');return [d.x,d.y];});
 await drag(d[0]+15,d[1]+50,100,230);await tick(4000);
 assert.equal(await page.evaluate(()=>B.total),i+1);
}

 assert.equal(await page.evaluate(()=>B.correct),count);
 await tick(5000);assert.equal(await page.evaluate(()=>scene),'summary');
 await page.screenshot({path:'output/chapter-'+(ch+1)+'-summary.png'});
 await click(320,300);await tick(1000);
 if(ch<4){assert.equal(await page.evaluate(()=>scene),'newspaper');await click(520,329);await tick(1000);}
 await page.screenshot({path:'output/chapter-next-'+(ch+1)+'.png'});
 if(ch===4){assert.equal(await page.evaluate(()=>scene),'campaign-ending');assert.equal(await page.evaluate(()=>campaignEnding().id),'light');await page.screenshot({path:'output/ending-perfect.png'});await click(160,327);await tick(1000);}
 await click(520,325);await tick(500);
}
assert.equal(await page.evaluate(()=>chapterIndex),0);
assert.equal(await page.evaluate(()=>B.total),0);
assert.equal(await page.evaluate(()=>S.stats.correct),0);
assert.deepEqual(errors,[]);
await browser.close();console.log('PASS: 30 orders, five chapter transitions, progressive cast/rules, campaign reset, no page errors');
