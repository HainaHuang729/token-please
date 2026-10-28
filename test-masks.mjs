import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:760}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8766');await p.waitForFunction(()=>typeof MASK_CASES!=='undefined'&&F&&ATLAS_IMG);
assert.equal(await p.evaluate(()=>MASK_CASES.length),7);
for(const [ch,i,mask] of await p.evaluate(()=>MASK_CASES)){
 const info=await p.evaluate(({ch,i,mask})=>{
  newGame();chapterIndex=ch;setChapterRules();go('booth');B.idx=i+1;const spec=buildQueue()[i];B.ent=newEntrant(spec,true);handDocs(B.ent);B.ent.docs[0].big=true;B.ent.docs[0].x=465;B.ent.docs[0].y=190;advanceTime(500);render();
  const original=relayVerdict({...spec.contract,mask:undefined}),actual=relayVerdict(spec.contract);
  const snap=expr=>{G.clearRect(0,0,180,128);pixelPortrait(spec.person+':'+expr,0,0,180,128,false,mask);return F.toDataURL();};setCtx(F.getContext('2d'));const still=snap('neutral'),talk=snap('talk');render();
  return {original,actual,equal:still===talk,mask:JSON.parse(render_game_to_text()).entrant.mask};
 },{ch,i,mask});
 assert.deepEqual(info.actual,info.original);assert.equal(info.equal,true);assert.equal(info.mask,mask);
 await p.screenshot({path:`output/mask-${ch}-${i}.png`});
}
assert.equal(await p.evaluate(()=>relayVerdict(CHAPTERS[2].cases[0]).decision),'approve');
assert.equal(await p.evaluate(()=>relayVerdict(CHAPTERS[2].cases[4]).decision),'deny');
assert.deepEqual(errors,[]);await b.close();console.log('PASS: 7 masked appearances, stable talking frames, same-mask legal/illegal pair, costume does not alter verdict');
