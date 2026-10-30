import {chromium} from 'playwright';import assert from 'node:assert/strict';
import {unlockInquiry,reviewSupplement,collectFraudEvidence} from './investigation-test-helpers.mjs';
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1280,height:760}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto((process.env.GAME_URL||'http://localhost:8766/')+'?design=paper');await p.waitForFunction(()=>F&&ATLAS_IMG&&typeof CAMPAIGN_ENDINGS!=='undefined');
const tick=async(ms)=>{for(let i=0;i<ms;i+=100)await p.evaluate(()=>advanceTime(100));};
const click=async(x,y)=>{const r=await p.locator('canvas').boundingBox();await p.mouse.click(r.x+x*r.width/640,r.y+y*r.height/360);};
assert.deepEqual(await p.evaluate(()=>CAMPAIGN_CHAPTERS.map(ch=>ch.cases.filter(c=>relayVerdict(c).decision==='deny').length)),[1,3,4,5,6]);
assert.equal(await p.evaluate(()=>CAMPAIGN_CHAPTERS[0].cases[1].followup.type),'missing');assert.equal(await p.evaluate(()=>relayVerdict(CAMPAIGN_CHAPTERS[0].cases[1]).decision),'approve');
assert.equal(await p.evaluate(()=>CAMPAIGN_CHAPTERS[2].cases[0].followup||null),null);
assert.ok(await p.evaluate(()=>CAMPAIGN_CHAPTERS[3].cases.slice(0,4).every(c=>relayVerdict(c).reasons.length===1)));
assert.ok(await p.evaluate(()=>['revision','digest','attachments'].every(k=>CAMPAIGN_CHAPTERS[4].cases.some(c=>c.evidence[k]))));
await p.evaluate(()=>{newGame();go('booth');});assert.deepEqual(await p.evaluate(()=>Object.fromEntries(['rules','verify','compare','log','ask','fraud','stamp'].map(k=>[k,campaignControl(k)]))),{rules:true,verify:false,compare:false,log:false,ask:false,fraud:false,stamp:false});await p.screenshot({path:'output/progression-empty.png'});
await click(109,199);await tick(4200);assert.equal(await p.evaluate(()=>campaignControl('verify')),true);await click(615,335);assert.equal(await p.evaluate(()=>B.insp.on),false);await click(628,222);assert.equal(await p.evaluate(()=>B.tray.open),false);await click(168,275);await tick(2500);assert.equal(await p.evaluate(()=>campaignControl('compare')),true);assert.equal(await p.evaluate(()=>campaignControl('stamp')),true);assert.equal(await p.evaluate(()=>campaignControl('fraud')),false);await p.screenshot({path:'output/progression-first-order.png'});
// Fraud control unlocks from real evidence, not from the case's hidden answer.
await p.evaluate(()=>{newGame();go('booth');B.ent=newEntrant(buildQueue()[2],true);handDocs(B.ent);});await tick(3000);await click(168,275);await tick(2500);assert.equal(await p.evaluate(()=>campaignControl('stamp')),false);await unlockInquiry(p);await click(185,114);await tick(3000);assert.equal(await p.evaluate(()=>campaignControl('fraud')),false);await reviewSupplement(p);await collectFraudEvidence(p);assert.equal(await p.evaluate(()=>campaignControl('fraud')),true);assert.equal(await p.evaluate(()=>campaignControl('stamp')),true);
// Last chapter guidance is opt-in; normal earlier chapters remain guided.
await p.evaluate(()=>{newGame();chapterIndex=4;setChapterRules();go('booth');B.ent=newEntrant(buildQueue()[0],true);handDocs(B.ent);verifyNight();});await tick(2500);await click(615,335);assert.equal(await p.evaluate(()=>compareGuideEnabled()),false);await click(608,113);assert.equal(await p.evaluate(()=>compareGuideEnabled()),true);
// Track real judged decisions, including procedural mistakes, across chapter changes.
await p.evaluate(()=>{newGame();go('booth');const good=newEntrant(relaySpec(RELAY_CASES[0],0),true);good.verified=true;judge(good,'deny');const bad=newEntrant(relaySpec(RELAY_CASES[1],1),true);bad.verified=true;judge(bad,'approve');});assert.deepEqual(await p.evaluate(()=>[campaignRecord.total,campaignRecord.wrongReject,campaignRecord.missedFraud]),[2,1,1]);
const outcomes=[['leak',28,2,0],['closed',27,0,3],['light',27,1,2],['steady',21,1,2],['training',20,1,2]];
await p.waitForFunction(()=>Object.values(ENDING_ART).every(image=>image.complete&&image.naturalWidth>0));
assert.equal(await p.evaluate(()=>new Set(Object.values(ENDING_ART).map(image=>image.src)).size),5);
assert.ok(await p.evaluate(()=>CAMPAIGN_ENDINGS.every(e=>{
 const image=ENDING_ART[e.id];
 return image.src.endsWith('/'+e.id+(e.id==='light'?'':'-characters-v2')+'.png')&&Math.abs(image.naturalWidth/image.naturalHeight-16/9)<.01
  &&87+(endingLines(e.text.replaceAll('。','。\n')).length-1)*17+10<190
  &&202+(endingLines(e.note).length-1)*16+10<246
  &&endingLines(e.text).every(row=>tw(row,10)<=232&&!/^[，。！？；：、）”’]/u.test(row));
})));
for(const [id,correct,missedFraud,wrongReject] of outcomes){await p.evaluate(r=>{campaignRecord={total:30,caughtFraud:CAMPAIGN_CHAPTERS.flatMap(ch=>ch.cases).filter(c=>relayVerdict(c).fraud).length-r.missedFraud,...r};chapterIndex=4;go('summary');summaryClick(320,300);},{correct,missedFraud,wrongReject});assert.equal(await p.evaluate(()=>scene),'campaign-ending');assert.equal(await p.evaluate(()=>campaignEnding().id),id);await tick(750);await p.screenshot({path:`output/ending-${id}.png`});}
await click(160,327);assert.equal(await p.evaluate(()=>scene),'news');assert.equal(await p.evaluate(()=>campaignRecord.total),0);assert.equal(await p.evaluate(()=>chapterIndex),0);
await p.evaluate(()=>{chapterIndex=4;go('campaign-ending');});await tick(750);await click(480,327);assert.equal(await p.evaluate(()=>scene),'title');assert.equal(await p.evaluate(()=>campaignRecord.total),0);
assert.deepEqual(errors,[]);await b.close();console.log('PASS pacing, isolated learning cases, later mixed rules, progressive controls, evidence unlock, optional final hints, metrics, five ending priorities and reset');
