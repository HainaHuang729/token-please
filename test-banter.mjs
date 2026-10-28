import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:760}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://localhost:8766');await p.waitForFunction(()=>typeof RELAY_BANTER!=='undefined'&&F&&ATLAS_IMG);
assert.equal(await p.evaluate(()=>['Tibo','被爱长大','完整的一生','查 IP'].every(word=>CHAPTERS.some(ch=>ch.cases.some(c=>c.line.includes(word))))),true);
const overflow=await p.evaluate(()=>CHAPTERS.flatMap(ch=>ch.cases.flatMap(c=>[c.line,c.reply,c.approveLine,c.denyLine])).filter(s=>tw(s,8)>176));assert.deepEqual(overflow,[]);
assert.equal(await p.evaluate(()=>new Set(CHAPTERS.flatMap(ch=>ch.cases.map(c=>c.line))).size),30);
for(const [ch,idx,name] of [[0,1,'whale'],[1,1,'flagship'],[3,1,'billing']]){
 await p.evaluate(({ch,idx})=>{newGame();chapterIndex=ch;setChapterRules();go('booth');B.idx=idx;callNext();},{ch,idx});
 for(let i=0;i<45;i++)await p.evaluate(()=>advanceTime(100));
 await p.evaluate(()=>verifyNight());for(let i=0;i<25;i++)await p.evaluate(()=>advanceTime(100));
 await p.screenshot({path:'output/banter-'+name+'.png'});
}
assert.deepEqual(errors,[]);await b.close();console.log('PASS: 30 unique entrances; all dialogue fits; chapter dialogue renders without errors');
