import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
for(const reducedMotion of ['no-preference','reduce']){
 const page=await browser.newPage({viewport:{width:1280,height:760},reducedMotion});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:8766');await page.waitForFunction(()=>typeof motionPreference!=='undefined'&&F&&ATLAS_IMG);
 const result=await page.evaluate(()=>{
  newGame();go('news');render();const first=F.toDataURL();now+=.3;render();
  return {same:first===F.toDataURL(),reduced:motionPreference.matches};
 });
 assert.equal(result.reduced,reducedMotion==='reduce');assert.equal(result.same,reducedMotion==='reduce');
 await page.screenshot({path:'output/ui-briefing-'+reducedMotion+'.png'});
 await page.evaluate(()=>{go('booth');const e=newEntrant(buildQueue()[0],true);B.ent=e;B.idx=1;handDocs(e);e.docs[0].big=true;e.docs[0].x=465;e.docs[0].y=190;verifyNight();advanceTime(250);});
 await page.screenshot({path:'output/ui-print-'+reducedMotion+'.png'});
 await page.evaluate(()=>{advanceTime(1000);stamp('approve');render();});
 assert.equal(await page.evaluate(()=>uiNotice.title),'已盖通过章');
 await page.screenshot({path:'output/ui-stamp-'+reducedMotion+'.png'});
 assert.deepEqual(errors,[]);await page.close();
}
await browser.close();console.log('PASS: scene feedback, printing/stamp states and reduced-motion static transition');
