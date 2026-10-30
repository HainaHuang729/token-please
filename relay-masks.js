'use strict';
// Costume is visual evidence to investigate, never a verdict by itself.
const MASK_CASES=[[0,1,'CLAUDE'],[1,1,'GPT'],[2,0,'GPT'],[2,4,'GPT'],[3,3,'GPT'],[4,0,'GPT'],[4,5,'CLAUDE']];
MASK_CASES.forEach(([ch,i,mask])=>{CHAPTERS[ch].cases[i].mask=mask;});
CHAPTERS[0].cases[1].line='这面具勒得慌。办完我就摘了。';
CHAPTERS[2].cases[0].line='这面具借来的，绳子有点短。';
CHAPTERS[2].cases[4].line='还是这张面具。别笑，新的没到。';
CHAPTERS[4].cases[5].line='戴半天了，鼻梁都压红了。';
CHAPTERS[2].tips[2]='面具不是授权；同一装扮也要逐单核对。';
const maskFrames=new Map();
// Crops are taken from the current neutral portraits, not a separate look-alike atlas.
const maskRegions={GPT:[70,34,47,49],CLAUDE:[66,25,49,53]};
// Eye centers measured in each registered 124x124 portrait (atlas inset is 28,4).
const MASK_EYES={
 GPT:[[56,55],[78,62]],CLAUDE:[[53,53],[73,47]],
 DEEPSEEK:[[52,60],[72,58]],GLM:[[56,57],[76,52]],
 QWEN:[[54,57],[74,51]],GROK:[[50,59],[71,55]],META:[[49,56],[70,48]]
};
function maskTransform(actor,mask){
 const source=MASK_EYES[mask],dest=MASK_EYES[actor];if(!source||!dest)return null;
 const [s,t]=source.map(([x,y])=>[x+28,y+4]),[u,v]=dest.map(([x,y])=>[x+28,y+4]);
 const sx=t[0]-s[0],sy=t[1]-s[1],dx=v[0]-u[0],dy=v[1]-u[1],den=sx*sx+sy*sy;
 const a=(dx*sx+dy*sy)/den,b=(dy*sx-dx*sy)/den;
 return {a,b,tx:u[0]-a*s[0]+b*s[1],ty:u[1]-b*s[0]-a*s[1]};
}
function maskedPortraitFrame(baseKey,maskKey){
 const cacheKey=baseKey+'|'+maskKey;if(maskFrames.has(cacheKey))return maskFrames.get(cacheKey);
 const base=portraitPixels.get(baseKey),target=portraitPixels.get(maskKey+':neutral'),actor=baseKey.split(':')[0],m=maskTransform(actor,maskKey);
 if(!base||!target||!m)return base;
 const c=document.createElement('canvas');c.width=180;c.height=128;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(base,0,0);
 const [x,y,w,h]=maskRegions[maskKey];
 // The same similarity transform aligns both eyes, rather than translating a generic face box.
 g.save();g.transform(m.a,m.b,-m.b,m.a,m.tx,m.ty);
 g.strokeStyle='#363344';g.lineWidth=1.5;g.beginPath();g.moveTo(x-5,y+h*.52);g.lineTo(x+5,y+h*.5);g.moveTo(x+w-5,y+h*.5);g.lineTo(x+w+5,y+h*.52);g.stroke();
 const contour=()=>{g.beginPath();g.moveTo(x+w*.16,y+h*.1);g.lineTo(x+w*.5,y);g.lineTo(x+w*.86,y+h*.12);g.lineTo(x+w,y+h*.46);g.lineTo(x+w*.86,y+h*.78);g.lineTo(x+w*.53,y+h);g.lineTo(x+w*.22,y+h*.82);g.lineTo(x,y+h*.48);g.closePath();};
 g.save();g.translate(0,1);contour();g.fillStyle='#171b2a';g.fill();g.restore();
 g.save();contour();g.clip();g.fillStyle='#f8e4d4';g.fillRect(x,y,w,h);g.drawImage(target,x,y,w,h,x,y,w,h);g.restore();
 contour();g.strokeStyle=maskKey==='GPT'?'#b5a0d7':'#d59153';g.lineWidth=1;g.stroke();
 g.fillStyle='#e7dccd';g.fillRect(x+1,y+h*.48,2,3);g.fillRect(x+w-3,y+h*.48,2,3);g.restore();
 maskFrames.set(cacheKey,c);return c;
}
