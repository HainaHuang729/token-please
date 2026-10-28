'use strict';
// Costume is visual evidence to investigate, never a verdict by itself.
const MASK_CASES=[[0,1,'CLAUDE'],[1,1,'GPT'],[2,0,'GPT'],[2,4,'GPT'],[3,3,'GPT'],[4,0,'GPT'],[4,5,'CLAUDE']];
MASK_CASES.forEach(([ch,i,mask])=>{CHAPTERS[ch].cases[i].mask=mask;});
CHAPTERS[0].cases[1].line='面具是橙色的，工位还是我的。';
CHAPTERS[2].cases[0].line='戴的是前台面具，授权请看订单。';
CHAPTERS[2].cases[4].line='面具还是那张，今天换了张订单。';
CHAPTERS[4].cases[5].line='面具是装饰，服务方式已披露。';
CHAPTERS[2].tips[2]='面具不是授权；同一装扮也要逐单核对。';
const maskFrames=new Map();
const maskArtwork=new Image();
const maskRegions={};
maskArtwork.onload=()=>{
 const c=document.createElement('canvas');c.width=maskArtwork.width;c.height=maskArtwork.height;const g=c.getContext('2d');g.drawImage(maskArtwork,0,0);
 const data=g.getImageData(0,0,c.width,c.height).data;
 ['GPT','CLAUDE'].forEach((key,col)=>{
  const left=Math.floor(c.width*col/2),right=Math.floor(c.width*(col+1)/2);let x0=right,y0=c.height,x1=left,y1=0;
  for(let y=0;y<c.height;y++)for(let x=left;x<right;x++)if(data[(y*c.width+x)*4+3]>80){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
  maskRegions[key]=[x0,y0,x1-x0+1,y1-y0+1];
 });
 maskFrames.clear();
};
maskArtwork.src=ASSET_IMAGES.masks;
function maskedPortraitFrame(baseKey,maskKey){
 const cacheKey=baseKey+'|'+maskKey;if(maskFrames.has(cacheKey))return maskFrames.get(cacheKey);
 const base=portraitPixels.get(baseKey),region=maskRegions[maskKey];if(!base||!region)return base;
 const c=document.createElement('canvas');c.width=180;c.height=128;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(base,0,0);
 const face=PORTRAIT_LANDMARKS[baseKey.split(':')[0]]?.face||[90,64],x=face[0]-27,y=face[1]-29;
 g.strokeStyle='#41425b';g.lineWidth=1;g.beginPath();g.moveTo(x-9,y+25);g.lineTo(x+4,y+28);g.moveTo(x+51,y+28);g.lineTo(x+64,y+25);g.stroke();
 g.drawImage(maskArtwork,...region,x,y,55,54);
 maskFrames.set(cacheKey,c);return c;
}
