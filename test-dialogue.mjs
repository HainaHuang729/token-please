import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1280,height:760}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8766/?design=paper');await p.waitForFunction(()=>F&&ATLAS_IMG&&typeof askDelivery==='function');
const tick=async(ms)=>{for(let i=0;i<ms;i+=100)await p.evaluate(()=>advanceTime(100));};
const click=async(x,y)=>{const r=await p.locator('canvas').boundingBox();await p.mouse.click(r.x+x*r.width/640,r.y+y*r.height/360);};
const setup=async(ch,i)=>{await p.evaluate(({ch,i})=>{newGame();S.tut.questionUnlocked=true;chapterIndex=ch;setChapterRules();go('booth');B.ent=newEntrant(relaySpec(CHAPTERS[ch].cases[i],ch*100+i),true);handDocs(B.ent);},{ch,i});await tick(3000);};
console.log(await p.evaluate(()=>{const bad=[];for(const line of [...DELIVERY_TOPICS.map(t=>t.line),...Object.values(ISSUE_REPLIES)])if(tw(line,10)>176)bad.push(line);return {longLines:bad};}));
await setup(1,2);const expected=await p.evaluate(()=>B.ent.spec.ok);await click(168,275);await tick(2500);await click(185,114);await tick(2600);assert.equal(await p.evaluate(()=>B.ent.deliveryAsked),1);
await p.screenshot({path:'output/dialogue-question.png'});
const testimony=async()=>{await p.evaluate(()=>setInspect(true));const pt=await p.evaluate(()=>{const l=lineBoxes().find(l=>B.ent.testimonies[l.ln.text]);return [l.box[0]+8,l.box[1]+7];});await click(...pt);};
await p.evaluate(()=>{window.testMissingReceipt=B.docs.find(d=>d.key==='receipt');B.docs=B.docs.filter(d=>d.key!=='receipt');});await testimony();assert.equal(await p.evaluate(()=>B.insp.sel.length),0,'missing receipt cannot become evidence');
await p.evaluate(()=>B.docs.push(window.testMissingReceipt));await testimony();assert.equal(await p.evaluate(()=>B.insp.sel[0].key),'dv.编号');
const pt=await p.evaluate(()=>{const d=B.docs.find(d=>d.key==='receipt'),f=d.doc.fields['回执'];return [d.x+f[0]+8,d.y+f[1]+5];});await click(...pt);assert.equal(await p.evaluate(()=>B.insp.banner.title),'回执不属于本单');await p.screenshot({path:'output/dialogue-evidence.png'});
await click(569,150);await tick(1600);assert.ok(await p.evaluate(()=>B.lines.some(l=>l.text===ISSUE_REPLIES['回执不属于本单'])));assert.deepEqual(await p.evaluate(()=>B.ent.spec.ok),expected);assert.equal(await p.evaluate(()=>!!B.ent.fraudMarked),false);
// A legal order offers the same route into comparison.
await setup(0,0);await click(168,275);await tick(2600);await click(185,114);await tick(2600);await testimony();const legal=await p.evaluate(()=>{const d=B.docs.find(d=>d.key==='receipt'),f=d.doc.fields['回执'];return [d.x+f[0]+8,d.y+f[1]+5];});await click(...legal);assert.equal(await p.evaluate(()=>B.insp.banner.bad),false);
// Third-document testimony must point to the independently fetched log.
await setup(2,2);await click(168,275);await tick(2500);await p.evaluate(()=>{B.ent.deliveryAsked=1;askDelivery();});await tick(2600);assert.equal(await p.evaluate(()=>Object.values(B.ent.testimonies)[0].doc),'log');assert.equal(await p.evaluate(()=>B.ent.spec.ok[0]),'deny');
assert.deepEqual(errors,[]);await b.close();console.log('PASS dialogue: actual clicks, missing-evidence guard, statement-to-field comparison, issue-specific response, legal control, upstream-log target; verdict unchanged');
