'use strict';
// Costume is visual evidence to investigate, never a verdict by itself.
const MASK_CASES=[[0,1,'CLAUDE'],[1,1,'GPT'],[2,0,'GPT'],[2,4,'GPT'],[3,3,'GPT'],[4,0,'GPT'],[4,5,'CLAUDE']];
MASK_CASES.forEach(([ch,i,mask])=>{CHAPTERS[ch].cases[i].mask=mask;});
CHAPTERS[0].cases[1].line='面具是橙色的，工位还是我的。';
CHAPTERS[2].cases[0].line='戴的是前台面具，授权请看订单。';
CHAPTERS[2].cases[4].line='面具还是那张，今天换了张订单。';
CHAPTERS[4].cases[5].line='面具是装饰，服务方式已披露。';
CHAPTERS[2].tips[2]='面具不是授权；同一装扮也要逐单核对。';
const MASK_TONES={GPT:'#d9c7ed',CLAUDE:'#edb785',DEEPSEEK:'#8fcbdf',GEMINI:'#b5ade8',GLM:'#b9afc2',QWEN:'#a0b4da',GROK:'#d4b48b',META:'#c5d7eb',KIMI:'#a7afc9',MINIMAX:'#e9b6cf'};
const maskFrames=new Map();
function maskedPortraitFrame(baseKey,maskKey){
 const cacheKey=baseKey+'|'+maskKey;if(maskFrames.has(cacheKey))return maskFrames.get(cacheKey);
 const base=portraitPixels.get(baseKey),face=portraitPixels.get(maskKey+':neutral');if(!base||!face)return base;
 const c=document.createElement('canvas');c.width=180;c.height=128;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(base,0,0);
 // Straps and stepped edge make the face read as a worn prop, not a model swap.
 const x=62,y=40,w=58,h=52;
 g.fillStyle='#252d45';g.fillRect(43,y+20,94,3);g.fillStyle='#c8bfc3';g.fillRect(43,y+20,94,1);
 const shape=(dx,dy)=>{g.beginPath();g.moveTo(x+6+dx,y+dy);g.lineTo(x+w-6+dx,y+dy);g.lineTo(x+w+dx,y+6+dy);g.lineTo(x+w+dx,y+h-13+dy);g.lineTo(x+w-12+dx,y+h+dy);g.lineTo(x+12+dx,y+h+dy);g.lineTo(x+dx,y+h-13+dy);g.lineTo(x+dx,y+6+dy);g.closePath();};
 shape(2,3);g.fillStyle='#172238';g.fill();shape(0,0);g.fillStyle='#fff6e2';g.fill();
 g.save();shape(0,0);g.clip();
 g.fillStyle=MASK_TONES[maskKey]||'#c9d3df';g.fillRect(x+3,y+3,w-6,h-6);
 g.drawImage(face,67,38,48,49,x+5,y+4,w-10,h-9);
 g.restore();
 g.fillStyle='#f9f3dd';g.fillRect(x,y+20,3,5);g.fillRect(x+w-3,y+20,3,5);
 g.fillStyle='#44516a';g.fillRect(x+1,y+21,1,2);g.fillRect(x+w-2,y+21,1,2);
 maskFrames.set(cacheKey,c);return c;
}
