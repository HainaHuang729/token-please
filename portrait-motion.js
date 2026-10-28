'use strict';
// Landmarks measured on the native 180x128 frame, not on the source-sheet grid.
const PORTRAIT_LANDMARKS={
 GPT:{eyes:[[78,54,10,8],[100,60,10,7]],mouth:[90,72],face:[93,64]},
 GEMINI:{eyes:[[78,56,10,8],[100,50,12,9]],mouth:[95,68],face:[93,61]},
 GLM:{eyes:[[70,53,10,8],[94,48,11,8]],mouth:[87,66],face:[87,58]},
 DEEPSEEK:{eyes:[[64,59,11,8],[86,58,12,8]],mouth:[82,74],face:[81,66]},
 CLAUDE:{eyes:[[64,53,11,8],[86,45,12,9]],mouth:[79,64],face:[81,56]},
 QWEN:{eyes:[[77,54,12,7],[99,46,12,9]],mouth:[93,66],face:[92,58]},
 GROK:{eyes:[[75,57,11,8],[97,50,12,9]],mouth:[92,68],face:[92,61]},
 META:{eyes:[[70,53,12,8],[91,45,12,8]],mouth:[87,64],face:[87,58]},
 KIMI:{eyes:[[65,54,11,8],[86,47,12,8]],mouth:[83,65],face:[85,58]},
 MINIMAX:{eyes:[[70,52,12,8],[92,45,12,8]],mouth:[86,63],face:[88,57]}
};
const facialFrames=new Map();
function portraitMotionState(e,time=now){
 if(motionPreference.matches)return {blink:false,speaking:false,offset:0};
 const phase=Math.max(0,time-e.tEnter),seed=MODEL_CAST.findIndex(([k])=>k===e.spec.person)*.31;
 return {blink:(phase+seed)%4.6>4.43,speaking:time<e.talkUntil&&Math.floor(time*6)%2===0,offset:Math.round(Math.sin(phase*2*Math.PI/3.8)*.85)};
}
function animatedPortraitFrame(source,key,state){
 if(!state||(!state.blink&&!state.speaking))return source;
 const actor=key.split(':')[0],marks=PORTRAIT_LANDMARKS[actor];if(!marks)return source;
 const cacheKey=actor+'|'+!!state.blink+'|'+!!state.speaking;if(facialFrames.has(cacheKey))return facialFrames.get(cacheKey);
 const c=document.createElement('canvas');c.width=180;c.height=128;const g=c.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(source,0,0);
 if(state.blink){
  const [mx,my]=marks.mouth,samples=[[-3,-5],[3,-5],[0,-8]].map(([dx,dy])=>g.getImageData(mx+dx,my+dy,1,1).data);
  const skin=[0,1,2].map(k=>Math.round(samples.reduce((n,p)=>n+p[k],0)/samples.length));
  for(const [x,y,w,h] of marks.eyes){
   g.fillStyle=`rgb(${skin[0]},${skin[1]},${skin[2]})`;g.fillRect(x+1,y,w-2,h);g.fillRect(x,y+1,w,h-2);
   g.strokeStyle='#594252';g.lineWidth=1;const lid=y+Math.floor(h/2);
   g.beginPath();g.moveTo(x,lid);g.lineTo(x+3,lid+2);g.lineTo(x+w-3,lid+2);g.lineTo(x+w,lid);g.stroke();
  }
 }
 if(state.speaking){const [x,y]=marks.mouth;g.fillStyle='#8c4157';g.fillRect(x-1,y-1,3,1);g.fillRect(x-2,y,5,1);g.fillStyle='#e895a5';g.fillRect(x-1,y+1,3,1);}
 facialFrames.set(cacheKey,c);return c;
}
