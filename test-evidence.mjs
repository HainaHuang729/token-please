import {chromium} from 'playwright';import assert from 'node:assert/strict';
const browser=await chromium.launch();const p=await browser.newPage({viewport:{width:1280,height:760}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8766');await p.waitForFunction(()=>typeof EVIDENCE_FIELDS!=='undefined'&&F&&ATLAS_IMG);
const cases=[['revision','v2.10','v2.1'],['cache','禁止','已命中'],['tools',['检索','执行'],['检索']],['digest','A7C59F','A7C59E'],['attachments',['A01','B02'],['A01','B20']],['format','JSON','Markdown']];
const tick=async(ms)=>{for(let i=0;i<ms;i+=100)await p.evaluate(()=>advanceTime(100));};
const click=async(x,y)=>{const b=await p.locator('canvas').boundingBox();await p.mouse.click(b.x+x*b.width/640,b.y+y*b.height/360);};
for(const [key,expected,actual] of cases){
 const result=await p.evaluate(({key,expected,actual})=>{
  const c={...RELAY_CASES[0],evidence:{[key]:{expected,actual}}};const bad=relayVerdict(c),good=relayVerdict({...c,evidence:{[key]:{expected,actual:key==='cache'?'未命中':expected}}});
  newGame();chapterIndex=4;setChapterRules();go('booth');B.ent=newEntrant(relaySpec(c,0),true);handDocs(B.ent);const d=B.ent.docs[0];d.big=true;d.x=465;d.y=145;verifyNight();return {bad,good};
 },{key,expected,actual});
 assert.equal(result.bad.decision,'deny');assert.equal(result.bad.fraud,false);assert.equal(result.good.decision,'approve');await tick(2300);
 const points=await p.evaluate(key=>{const f=EVIDENCE_FIELDS.find(x=>x.key===key);setInspect(true);return [['dv',f.label],['receipt',f.receiptLabel]].map(([k,label])=>{const d=B.docs.find(x=>x.key===k),r=d.doc.fields[label];return [d.x+r[0]+12,d.y+(r[1]+r[3])/2];});},key);
 for(const [x,y] of points)await click(x,y);
 assert.equal(await p.evaluate(()=>B.insp.banner?.bad),true,key+' actual field clicks');
 await p.screenshot({path:'output/evidence-'+key+'.png'});
}
// Positive cases, no assumption that any difference is an error.
assert.deepEqual(await p.evaluate(()=>[
 relayVerdict({...RELAY_CASES[0],evidence:{cache:{expected:'允许',actual:'已命中'}}}).decision,
 relayVerdict({...RELAY_CASES[0],evidence:{tools:{expected:['检索','执行'],actual:['执行','检索']}}}).decision,
 relayVerdict({...RELAY_CASES[0],evidence:{attachments:{expected:['A01','B02'],actual:['B02','A01']}}}).decision,
 relayVerdict({...RELAY_CASES[0],evidence:{attachments:{expected:['A01','B02'],actual:['A01','A01']}}}).decision
]),['approve','approve','approve','deny']);
// Signed metadata stays hidden if proof is invalid; only false signature is usable evidence.
assert.equal(await p.evaluate(()=>relaySpec({...RELAY_CASES[5],evidence:{digest:{expected:'AAA',actual:'BBB'}}},0).receiptRows.at(-1)[1]),'无法确认');
// All chapter cards fit desk; fields and rendered values have corresponding hit boxes.
const layout=await p.evaluate(()=>CHAPTERS.flatMap(ch=>ch.cases.map(c=>{const s=relaySpec(c,0);return [s.docs[0].doc,...[new Card(s.receiptRows,{seal:false,valueX:42})]].every(d=>d.h<=152&&d.rows.every(([k,v])=>d.fields[k]&&tw(v,8)<=d.w-d.valueX-6));})));assert(layout.every(Boolean));
await p.evaluate(()=>{newGame();chapterIndex=4;setChapterRules();go('booth');toggleRules();});
assert.equal(await p.evaluate(()=>B.ruleInst.doc.npages),3);await p.screenshot({path:'output/evidence-rulebook.png'});
const tab=await p.evaluate(()=>{const d=B.ruleInst,r=d.doc.tab;return [d.x+(r[0]+r[2])/2,d.y+(r[1]+r[3])/2];});
await click(...tab);assert.equal(await p.evaluate(()=>B.ruleInst.doc.page),0);await click(...tab);assert.equal(await p.evaluate(()=>B.ruleInst.doc.page),1);
// Signed compliant cache use receives a positive comparison, not a discrepancy.
await p.evaluate(()=>{newGame();chapterIndex=2;setChapterRules();go('booth');B.ent=newEntrant(relaySpec(CHAPTERS[2].cases[0],200),true);handDocs(B.ent);Object.assign(B.ent.docs[0],{big:true,x:465,y:145});verifyNight();});await tick(2300);await p.evaluate(()=>retrieveLog());await tick(1800);await p.evaluate(()=>{B.docs.find(d=>d.key==='log').x=230;});
const goodPoints=await p.evaluate(()=>{setInspect(true);return [['dv','缓存'],['log','命中']].map(([key,k])=>{const d=B.docs.find(x=>x.key===key),f=d.doc.fields[k];return [d.x+f[0]+12,d.y+(f[1]+f[3])/2];});});
for(const pt of goodPoints)await click(...pt);assert.equal(await p.evaluate(()=>B.insp.banner.title),'缓存符合约定');assert.equal(await p.evaluate(()=>B.insp.banner.bad),false);
await p.screenshot({path:'output/evidence-authorized-cache.png'});
assert.deepEqual(errors,[]);await browser.close();console.log('PASS six new discrepancy types, compliant controls, real field comparisons, hidden untrusted evidence, card fit and rulebook pages');
