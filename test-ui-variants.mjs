import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:850}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto('http://localhost:8766');await p.waitForFunction(()=>F&&ATLAS_IMG&&typeof UI_VARIANTS!=='undefined');
const tick=async(ms)=>{for(let t=0;t<ms;t+=100)await p.evaluate(()=>advanceTime(100));};
const pos=async(x,y)=>{const box=await p.locator('canvas').boundingBox();return [box.x+x*box.width/640,box.y+y*box.height/360];};
const click=async(x,y)=>p.mouse.click(...await pos(x,y));
const drag=async(x,y,a,c)=>{await p.mouse.move(...await pos(x,y));await p.mouse.down();await p.mouse.move(...await pos(a,c),{steps:10});await p.mouse.up();};
for(const design of ['terminal','paper','dispatch']){
 await p.click('[data-variant="'+design+'"]');await p.evaluate(()=>{newGame();go('title');});await p.waitForTimeout(300);await p.screenshot({path:'output/design-'+design+'-title.png'});
 await click(320,300);await p.waitForTimeout(800);assert.equal(await p.evaluate(()=>scene),'news',design+' briefing');await click(520,325);await p.waitForTimeout(300);assert.equal(await p.evaluate(()=>scene),'booth',design+' desk');await click(109,199);await tick(4500);
 assert.equal(await p.evaluate(()=>B.ent.spec.person),'GPT');await drag(54,270,465,200);await click(168,275);await tick(2200);assert.equal(await p.evaluate(()=>B.ent.verified),true);
 const before=await p.evaluate(()=>JSON.stringify({order:B.ent.spec.id,docs:B.docs.map(d=>[d.key,d.x,d.y]),idx:B.idx}));
 await p.evaluate(()=>{const current=uiVariant;setUiVariant(current==='paper'?'terminal':'paper');setUiVariant(current);});
 assert.equal(await p.evaluate(()=>JSON.stringify({order:B.ent.spec.id,docs:B.docs.map(d=>[d.key,d.x,d.y]),idx:B.idx})),before);
 await p.screenshot({path:'output/design-'+design+'-desk.png'});
 await click(628,222);await tick(400);await click(500,215);await tick(1600);const d=await p.evaluate(()=>{const d=B.docs.find(d=>d.key==='dv');return [d.x,d.y];});await drag(d[0]+15,d[1]+50,100,230);await tick(2000);assert.equal(await p.evaluate(()=>B.correct),1);
}
await p.reload();assert.equal(await p.evaluate(()=>uiVariant),'dispatch');assert.deepEqual(errors,[]);await b.close();console.log('PASS: all three designs, real drag/verify/stamp/return, switching preserves order and documents, theme persists');
