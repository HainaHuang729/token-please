'use strict';
// Landmarks measured on the native 180x128 frame, not on the source-sheet grid.
// Face centers for the registered generated sheets (native 180x128 frame).
const PORTRAIT_LANDMARKS={
 GPT:{face:[90,65]}, GEMINI:{face:[90,65]}, GLM:{face:[91,65]},
 DEEPSEEK:{face:[90,70]}, CLAUDE:{face:[90,60]}, QWEN:{face:[92,65]},
 GROK:{face:[89,68]}, META:{face:[90,64]}, KIMI:{face:[90,64]}, MINIMAX:{face:[90,64]}
};
const facialFrames=new Map();
function portraitMotionState(e,time=now){
 if(motionPreference.matches)return {blink:false,speaking:false,offset:0,frame:0};
 const phase=Math.max(0,time-e.tEnter),seed=MODEL_CAST.findIndex(([k])=>k===e.spec.person)*.31;
 const cycle=(phase+seed)%4.6;
 const blinkFrame=cycle>4.32?(cycle<4.39?1:cycle<4.49?2:cycle<4.56?3:0):0;
 const speaking=time<e.talkUntil,frame=blinkFrame||(speaking?[4,5,4,0][Math.floor(time*7)%4]:0);
 return {blink:!!blinkFrame,speaking,offset:e.spec.person==='GPT'?0:Math.round(Math.sin(phase*2*Math.PI/3.8)*.85),frame};
}
function animatedPortraitFrame(source,key,state){
 const actor=key.split(':')[0];
 const frame=state?.frame??(state?.blink?2:state?.speaking?4:0);
 if(!frame)return source;
 const name='anim:'+actor+':'+frame,a=SPR[name];if(!a)return source;
 if(facialFrames.has(name))return facialFrames.get(name);
 const c=document.createElement('canvas');c.width=180;c.height=128;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
 g.drawImage(ATLAS_IMG,a[0],a[1],a[2],a[3],a[4]||0,a[5]||0,a[2],a[3]);facialFrames.set(name,c);return c;
}
