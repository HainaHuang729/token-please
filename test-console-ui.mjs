import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:8766');await page.waitForFunction(()=>typeof UI!=='undefined'&&ATLAS_IMG);
async function click(x,y){const b=await page.locator('canvas').boundingBox();await page.touchscreen.tap(b.x+x*b.width/640,b.y+y*b.height/360);}
async function tick(ms){for(let i=0;i<ms;i+=100)await page.evaluate(()=>advanceTime(100));}
await click(320,300);await tick(1000);assert.equal(await page.evaluate(()=>scene),'news');
await page.screenshot({path:'output/mobile-briefing.png'});
await click(520,325);await click(16,300);await tick(4000);
assert.equal(await page.evaluate(()=>B.ent.spec.person),'GPT');
await click(168,275);await tick(1200);assert.equal(await page.evaluate(()=>B.ent.verified),true);
await page.screenshot({path:'output/mobile-console.png'});
await page.setViewportSize({width:390,height:844});
assert.equal(await page.locator('#rotate').isVisible(),true);
await page.getByRole('button',{name:'先竖着玩'}).click();
assert.equal(await page.locator('#rotate').isVisible(),false);
await page.screenshot({path:'output/mobile-portrait.png'});
assert.deepEqual(errors,[]);await browser.close();console.log('PASS: landscape touch entry/verification, portrait guidance, no page errors');
