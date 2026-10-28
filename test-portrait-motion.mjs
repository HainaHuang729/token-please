import {chromium} from 'playwright';import assert from 'node:assert/strict';import fs from 'node:fs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:760}});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:8766');await p.waitForFunction(()=>typeof PORTRAIT_LANDMARKS!=='undefined'&&F&&ATLAS_IMG&&maskRegions.GPT);
const data=await p.evaluate(()=>{
 const c=document.createElement('canvas');c.width=1200;c.height=480;const g=c.getContext('2d');g.imageSmoothingEnabled=false;const checks=[];
 MODEL_CAST.forEach(([key],i)=>{
  pixelPortrait(key,0,0,180,128);const src=portraitPixels.get(key+':neutral'),blink=animatedPortraitFrame(src,key,{blink:true,speaking:false}),talk=animatedPortraitFrame(src,key,{blink:false,speaking:true});
  const a=src.getContext('2d').getImageData(0,0,180,128).data;
  for(const [kind,frame] of [['blink',blink],['talk',talk]]){const d=frame.getContext('2d').getImageData(0,0,180,128).data;let changed=0,outside=0;for(let j=0;j<a.length;j+=4)if(a.slice(j,j+4).some((v,k)=>v!==d[j+k])){changed++;const x=j/4%180,y=Math.floor(j/4/180);if(y<40||y>86||x<60||x>119)outside++;}checks.push({key,kind,changed,outside});}
  const x=i%5*240,y=Math.floor(i/5)*240;g.fillStyle='#304b69';g.fillRect(x,y,240,240);g.fillStyle='white';g.font='12px monospace';g.fillText(key+'   idle / blink',x+5,y+14);g.drawImage(src,60,40,60,50,x,y+20,120,100);g.drawImage(blink,60,40,60,50,x+120,y+20,120,100);g.fillText('talk',x+5,y+135);g.drawImage(talk,60,40,60,50,x,y+140,120,100);
 });return {image:c.toDataURL(),checks};
});for(const c of data.checks){assert(c.changed>0,c.key);assert.equal(c.outside,0,c.key+' '+c.kind);}fs.writeFileSync('output/portrait-animation-review.png',Buffer.from(data.image.split(',')[1],'base64'));
await p.evaluate(()=>{newGame();go('booth');B.idx=2;B.ent=newEntrant(buildQueue()[1],true);handDocs(B.ent);advanceTime(500);});await p.screenshot({path:'output/mask-v2-live.png'});
assert.equal(await p.evaluate(()=>new Set([0,1,2,3].map(t=>portraitMotionState(B.ent,B.ent.tEnter+t).offset)).size)>1,true);
await p.emulateMedia({reducedMotion:'reduce'});assert.deepEqual(await p.evaluate(()=>portraitMotionState(B.ent)),{blink:false,speaking:false,offset:0});assert.deepEqual(errors,[]);await b.close();console.log('PASS: all ten actors blink/talk locally, breathing moves, reduced-motion stays still, mask art loaded');
