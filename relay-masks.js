'use strict';
// Costume is visual evidence to investigate, never a verdict by itself.
const MASK_CASES=[[0,1,'CLAUDE'],[1,1,'GPT'],[2,0,'GPT'],[2,4,'GPT'],[3,3,'GPT'],[4,0,'GPT'],[4,5,'CLAUDE']];
MASK_CASES.forEach(([ch,i,mask])=>{CHAPTERS[ch].cases[i].mask=mask;});
CHAPTERS[0].cases[1].line='被爱长大的鲸，也得戴套壳面具。';
CHAPTERS[2].cases[0].line='戴的是前台面具，授权请看订单。';
CHAPTERS[2].cases[4].line='面具还是那张，今天换了张订单。';
CHAPTERS[4].cases[5].line='面具是装饰，服务方式已披露。';
CHAPTERS[2].tips[2]='面具不是授权；同一装扮也要逐单核对。';
const maskFrames=new Map();
// Crops are taken from the current neutral portraits, not a separate look-alike atlas.
const maskRegions={GPT:[70,34,47,49],CLAUDE:[66,25,49,53]};
function maskedPortraitFrame(baseKey,maskKey){
 const cacheKey=baseKey+'|'+maskKey;if(maskFrames.has(cacheKey))return maskFrames.get(cacheKey);
 const base=portraitPixels.get(baseKey),target=portraitPixels.get(maskKey+':neutral');if(!base||!target)return base;
 const c=document.createElement('canvas');c.width=180;c.height=128;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(base,0,0);
 const face=PORTRAIT_LANDMARKS[baseKey.split(':')[0]]?.face||[90,64],x=face[0]-24,y=face[1]-29;
 // Use the actual target portrait, so the mask has exactly the same face and bangs.
 const crop=maskRegions[maskKey];
 g.strokeStyle='#363344';g.lineWidth=2;g.beginPath();g.moveTo(x-8,y+25);g.lineTo(x+6,y+24);g.moveTo(x+42,y+24);g.lineTo(x+56,y+25);g.stroke();
 const contour=()=>{g.beginPath();g.moveTo(x+8,y+5);g.lineTo(x+25,y);g.lineTo(x+42,y+6);g.lineTo(x+48,y+23);g.lineTo(x+42,y+39);g.lineTo(x+26,y+49);g.lineTo(x+11,y+41);g.lineTo(x,y+24);g.closePath();};
 g.save();g.translate(1,2);contour();g.fillStyle='#171b2a';g.fill();g.restore();
 g.save();contour();g.clip();g.fillStyle='#f8e4d4';g.fillRect(x,y,49,50);g.drawImage(target,...crop,x,y,49,50);g.restore();
 contour();g.strokeStyle=maskKey==='GPT'?'#b5a0d7':'#d59153';g.lineWidth=1;g.stroke();
 g.fillStyle='#e7dccd';g.fillRect(x+1,y+23,2,3);g.fillRect(x+45,y+23,2,3);
 maskFrames.set(cacheKey,c);return c;
}
