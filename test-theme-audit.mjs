import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1280,height:760}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:8766');await page.waitForFunction(()=>typeof UI!=='undefined'&&ATLAS_IMG);
const tick=async(ms)=>{for(let t=0;t<ms;t+=100)await page.evaluate(()=>advanceTime(100));};
const setup=async(index)=>page.evaluate(i=>{newGame();scene='booth';startDay();const e=newEntrant(relaySpec(RELAY_CASES[i],i),true);B.ent=e;handDocs(e);e.docs[0].big=true;e.docs[0].x=465;e.docs[0].y=190;},index);
const point=async(key,field)=>page.evaluate(({key,field})=>{const d=B.docs.find(d=>d.key===key),f=d.doc.fields[field];return [d.x+f[0]+8,d.y+(f[1]+f[3])/2];},{key,field});
const compare=async(items)=>{await page.evaluate(()=>setInspect(true));for(const [k,f] of items){const [x,y]=await point(k,f);await page.evaluate(({x,y})=>inspectClick(x,y),{x,y});}return await page.evaluate(()=>B.insp.banner);};
// Legal routing has a positive explanation, not merely "no contradiction".
await setup(4);await page.evaluate(()=>verifyNight());await tick(1500);
assert.equal((await compare([['dv','模型'],['receipt','上游']])).title,'代工在授权范围内');
await page.screenshot({path:'output/legal-routing.png'});
await page.evaluate(()=>setInspect(false));
assert.equal((await compare([['receipt','签名']])).title,'签名验证通过');
// A forged receipt cannot establish the upstream identity.
await setup(5);await page.evaluate(()=>verifyNight());await tick(1500);
assert.equal(await page.evaluate(()=>B.docs.find(d=>d.key==='receipt').doc.rows.find(r=>r[0]==='上游')[1]),'无法确认');
assert.equal((await compare([['dv','模型'],['receipt','上游']])).title,'回执未通过验证');
await page.screenshot({path:'output/untrusted-receipt.png'});
// Entire cooperative sequence is required, including ordering.
assert.equal(await page.evaluate(()=>relayVerdict({...RELAY_CASES[9],route:['Claude']}).decision),'deny');
assert.equal(await page.evaluate(()=>relayVerdict({...RELAY_CASES[9],route:['Claude','Qwen','DeepSeek']}).decision),'deny');
assert.equal(await page.evaluate(()=>relaySpec({...RELAY_CASES[9],route:['Claude']},9).receiptRows.find(r=>r[0]==='上游')[1]),'Claude');
// Re-stamping updates both visible mark and narrative decision; no evidence-sheet stamping.
await setup(0);await page.evaluate(()=>{stamp('approve');stamp('deny');});
assert.deepEqual(await page.evaluate(()=>({decision:B.ent.decided,mark:decisionOf(B.ent.docs[0]),marks:B.ent.docs[0].marks.length})),{decision:'deny',mark:'deny',marks:1});
await page.evaluate(()=>{const r={key:'receipt',owner:'desk',big:true,x:465,y:190,marks:[],doc:new Card([['签名','有效']])};r.doc.h=100;B.docs.push(r);stamp('approve');});
assert.equal(await page.evaluate(()=>B.docs.at(-1).marks.length),0);
// Sheet bounds are based on actual dimensions.
await page.evaluate(()=>{const d=B.ent.docs[0];dragStart(d,d.x+5,d.y+5);dragMove(639,359);dragEnd(639,359);});
assert.equal(await page.evaluate(()=>{const d=B.ent.docs[0];return d.x+d.doc.w<=640&&d.y+d.doc.h<=360;}),true);
// A queued receipt does not become verified before it reaches the desk.
await setup(0);await page.evaluate(()=>{printDoc(new Citation(['打印占用']),2,'cit');verifyNight();});await tick(1000);
assert.equal(await page.evaluate(()=>!!B.ent.verified),false);await tick(2000);assert.equal(await page.evaluate(()=>B.ent.verified),true);
// Error path copy and currency, visible in the actual document.
await setup(0);await page.evaluate(()=>{judge({spec:buildQueue()[0],verified:false},'approve');judge({spec:buildQueue()[0],verified:false},'approve');});await tick(4000);
const lines=await page.evaluate(()=>B.docs.filter(d=>d.key==='cit').flatMap(d=>d.doc.lines));
assert(lines.includes('差错扣款：5 token'));assert(!lines.some(s=>/旅客|入境|M\.O\.A/.test(s)));
await page.screenshot({path:'output/error-slip.png'});assert.deepEqual(errors,[]);await browser.close();console.log('PASS: theme semantics, legal routing, fake proof, pipeline completeness, stamp consistency, document bounds, queued evidence, error copy');
