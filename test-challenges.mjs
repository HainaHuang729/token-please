import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:760}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8766');await p.waitForFunction(()=>typeof challengePatches!=='undefined'&&F&&ATLAS_IMG);
assert.deepEqual(await p.evaluate(()=>CHAPTERS.map(ch=>ch.cases.filter(c=>relayVerdict(c).decision==='deny').length)),[1,3,4,5,6]);
assert.equal(await p.evaluate(()=>relayVerdict(CHAPTERS[1].cases[2]).fraud),false);
assert.equal(await p.evaluate(()=>relayVerdict({...CHAPTERS[3].cases[1],charge:4}).decision),'approve');
assert.equal(await p.evaluate(()=>relayVerdict({...CHAPTERS[3].cases[0],delivered:128}).decision),'approve');
assert.equal(await p.evaluate(()=>relayVerdict(CHAPTERS[4].cases[6]).reasons.length),2);
// Speaking and idle use exactly the same registered body pixels for all ten characters.
for(const [key] of await p.evaluate(()=>MODEL_CAST)){
 const equal=await p.evaluate(key=>{setCtx(F.getContext('2d'));G.clearRect(0,0,640,360);pixelPortrait(key+':neutral',0,0,180,128);const a=F.toDataURL();G.clearRect(0,0,640,360);pixelPortrait(key+':talk',0,0,180,128);return a===F.toDataURL();},key);
 assert.equal(equal,true,key);
}
await p.evaluate(()=>{showingRoster=true;go('title');advanceTime(300);});await p.screenshot({path:'output/consistent-roster.png'});
const tick=async(ms)=>{for(let t=0;t<ms;t+=100)await p.evaluate(()=>advanceTime(100));};
for(const [ch,idx,field,receiptField,title,file] of [[1,2,'编号','回执','回执不属于本单','id'],[1,1,'模型','上游','交付模型不符','suffix'],[3,0,'输入','转发','输入被截断','input'],[3,3,'预算','扣款','收费超出预算','charge']]){
 await p.evaluate(({ch,idx})=>{newGame();chapterIndex=ch;setChapterRules();go('booth');B.idx=idx+1;B.ent=newEntrant(buildQueue()[idx],true);handDocs(B.ent);const d=B.ent.docs[0];d.big=true;d.x=465;d.y=190;verifyNight();},{ch,idx});await tick(2400);
 assert.equal(await p.evaluate(()=>B.lines.some(l=>l.text===B.ent.spec.reply)),false,'no automatic confession');
 await p.evaluate(({field,receiptField})=>{setInspect(true);for(const [key,f] of [['dv',field],['receipt',receiptField]]){const d=B.docs.find(d=>d.key===key),a=d.doc.fields[f];inspectClick(d.x+a[0]+8,d.y+(a[1]+a[3])/2);}},{field,receiptField});
 assert.equal(await p.evaluate(()=>B.insp.banner.title),title);
 await p.screenshot({path:'output/subtle-'+file+'.png'});
}
assert.deepEqual(errors,[]);await b.close();console.log('PASS: 19 discrepant orders, exact boundaries, 10 stable portraits, no automatic confessions, subtle evidence comparison');
