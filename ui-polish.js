'use strict';
// Shared feedback uses the game clock, so it remains deterministic in replays.
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const uiEaseOut=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);
let uiNotice=null;
function notice(title,detail,color=UI.cyan){uiNotice={title,detail,color,t:now};}
uiButton=function(box,label,active=false,tone=UI.navy){
 const hover=ptr.mouse&&inBox(ptr.x,ptr.y,box),pressed=hover&&ptr.down;
 const dy=pressed?1:0;
 rect(box[0],box[1]+2,box[2],box[3]+2,active?UI.deep:UI.line);
 rect(box[0],box[1]+dy,box[2],box[3]+dy,active?tone:hover?'#e6f2fc':UI.paper);
 outline(box[0],box[1]+dy,box[2],box[3]+dy,hover?UI.cyan:active?tone:UI.line);
 if(!pressed)line(box[0]+1,box[1]+1,box[2]-1,box[1]+1,active?'#92b1d2':UI.white);
 txt((box[0]+box[2])/2,box[1]+dy+Math.floor((box[3]-box[1]-10)/2),label,10,active?UI.white:UI.ink,'ma');
};
const polishStartDay=startDay;
startDay=function(){uiNotice=null;polishStartDay();};
const polishVerify=verifyNight;
verifyNight=function(){const e=B.ent;polishVerify();if(e?.verifying&&!e.uiRequest){e.uiRequest=now;notice('正在调取','等待核验单打印',UI.lavender);}};
const polishStamp=stamp;
stamp=function(kind){const n=B.presses.length;polishStamp(kind);if(B.presses.length>n)notice(kind==='approve'?'已盖通过章':'已盖退回章','将订单拖回左侧交付方',kind==='approve'?UI.green:UI.red);};
const polishJudge=judge;
judge=function(e,dec){const before=B.correct;polishJudge(e,dec);notice(B.correct>before?'验收记录已归档':'本单存在验收差错',B.correct>before?'正确处理 +5 token':'查看打印的差错单',B.correct>before?UI.green:UI.red);};
const polishButtons=drawButtons;
drawButtons=function(){
 polishButtons();
 const e=B.ent;
 if(e?.verified&&!e.uiReady){e.uiReady=true;notice('回执已送达','比对授权、记录与订单',UI.lavender);}
 if(e?.verifying){
  const p=B.printing,t=p?Math.min(1,(now-p.t0)/p.dur):0;
  rect(128,281,209,282,'#526c83');
  if(t>0)rect(128,281,128+Math.floor(81*t),282,'#cceff1');
 }
 if(uiNotice&&now-uiNotice.t<3.4){
  const p=motionPreference.matches?1:uiEaseOut((now-uiNotice.t)/.18);
  G.save();G.globalAlpha=p;
  rect(232,322,419,354,UI.paper);rect(232,322,234,354,uiNotice.color);
  txt(242,327,uiNotice.title,10,uiNotice.color);txt(242,343,uiNotice.detail,8,UI.muted);G.restore();
 }else{
  txt(234,328,'验收工具',10,UI.muted);txt(234,344,'核验完成后再做决定',8,UI.muted);
 }
};
drawExterior=function(){
 txt(14,38,chapter().name,12,UI.ink);
 txt(14,59,'本章 '+CASE_COUNT+' 单 / 已完成 '+B.total+' 单',8,UI.muted);
 rect(14,76,208,80,'#bdcddd');
 if(B.total)rect(14,76,14+Math.floor(194*B.total/CASE_COUNT),80,UI.cyan);
 txt(14,89,'正确 '+B.correct+'    差错 '+(B.total-B.correct),8,UI.blue);
 B.queue.forEach((s,i)=>{
  const x=230+i*47,done=i<B.total,current=B.ent&&i===B.idx-1;
  rect(x,35,x+41,94,current?UI.paper:done?'#cddfdc':'#e7eef6');
  if(current){outline(x,35,x+41,94,UI.cyan);rect(x,35,x+41,37,UI.cyan);}
  G.save();if(done)G.globalAlpha=.45;uiPortrait(s.person,x+4,41,33,35,'neutral',s.contract?.mask);G.restore();
  txt(x+20,82,done?'完成':current?'办理':String(i+1).padStart(2,'0'),8,done?UI.green:current?UI.cyan:UI.muted,'ma');
 });
 txt(14,113,B.ent?'接入 / '+B.ent.spec.name:'通讯待机 / 等待接单',8,UI.muted);
 // The desk heading yields its row to contextual instructions, avoiding overlap.
 if(B.insp.on)txt(232,113,'证据比对 / 点击对应字段',8,UI.cyan);
};
const polishLower=drawBoothLower;
drawBoothLower=function(){
 polishLower();rect(6,343,215,359,UI.deep);
 const e=B.ent,step=!e?0:!e.verified?1:!e.decided?2:3;
 ['接单','取证','比对','归还'].forEach((s,i)=>{
  const x=9+i*53,lit=i===step;
  rect(x,345,x+44,357,lit?'#365d79':'#203751');
  txt(x+22,348,s,8,lit?'#b9f0df':'#9aadc2','ma');
 });
 if(!e&&!B.ending){outline(5,287,27,322,UI.cyan);}
};
const polishWindow=drawWindow;
drawWindow=function(){
 polishWindow();
 // A brief connection indicator, never a continuous scan across the portrait.
 const e=B.ent;if(e&&now-e.tEnter<.55&&now>=e.tEnter&&!motionPreference.matches){
  const p=uiEaseOut((now-e.tEnter)/.55);line(WIN[0]+3,WIN[3]-2,WIN[0]+Math.floor(197*p),WIN[3]-2,'#9ce2d0');
 }
};
function chapterRail(y,current){
 line(42,y+8,594,y+8,UI.line);
 CHAPTERS.forEach((c,i)=>{
  const x=30+i*119,active=i===current,done=i<current;
  rect(x,y,x+103,y+35,active?UI.navy:done?'#cee4df':'#e0e9f3');
  txt(x+8,y+5,'第 '+(i+1)+' 章',10,active?UI.white:done?UI.green:UI.muted);
  txt(x+8,y+22,c.cases.length+' 单'+(done?' / 已完成':''),8,active?'#b7cee5':UI.muted);
 });
}
drawTitle=function(){
 titleBackdrop();if(showingRoster){drawRoster();return;}
 txt(30,45,'你买的是谁，',12,UI.muted);
 bigText(186,70,'Token, Please!',12,3,UI.ink);
 txt(30,121,'实际干活的，又是谁？',12,UI.blue);
 txt(30,153,'调取回执，核对每一份交付。',10,UI.ink);
 txt(30,175,'允许的代工通过，偷偷换牌退回。',8,UI.muted);
 rect(361,39,609,190,UI.navy);
 txt(374,49,'上游通讯 / 待接入',8,'#b7cee5');
 line(380,149,592,149,'#63809f');
 uiPortrait('DEEPSEEK',370,83,65,70);uiPortrait('CLAUDE',445,65,80,88);uiPortrait('GPT',535,83,65,70);
 txt(485,171,'请出示你的上游',10,'#bcf0e4','ma');
 chapterRail(215,0);
 uiButton([233,285,407,318],'开始第一班',true,UI.cyan);
 txt(320,325,'查看交付方档案',8,UI.blue,'ma');
 txt(14,348,'改编自 IP, PLEASE / ctnyanya',8,UI.muted);txt(626,348,'拖拽操作 · R 调回执 · F 全屏',8,UI.muted,'ra');
};
const polishNews=drawNews;
drawNews=function(){
 polishNews();
 rect(30,65,610,95,'#d4e4f1');rect(30,65,33,95,UI.cyan);
 txt(40,76,chapter().focus,12,UI.ink);
 chapterRail(267,chapterIndex);
};
const polishSummary=drawSummary;
drawSummary=function(){
 polishSummary();
 rect(40,119,600,123,'#becddd');
 if(B.total)rect(40,119,40+Math.floor(560*B.correct/B.total),123,UI.green);
};
// Fade the completed scene in place; controls never move away from hit areas.
for(const name of ['drawTitle','drawNews','drawSummary']){
 const base=window[name];window[name]=function(){
  base();if(!motionPreference.matches&&st()<.22){G.save();G.globalAlpha=1-uiEaseOut(st()/.22);rect(0,26,639,359,UI.desk);G.restore();}
 };
}
const polishRender=render;
render=function(){
 const old=B?.shake;if(B)B.shake=-999;
 polishRender();if(B)B.shake=old;
};
const polishHint=hintText;
hintText=function(){
 if(B.flash&&now<B.flash.t+3.2)return B.flash.text;
 if(B.ent?.decided)return '盖章完成：把订单拖回左侧交付方';
 if(B.ent?.verifying)return '正在打印核验单，请稍候';
 return polishHint();
};

// Quiet communications backdrop keeps facial details distinct from the UI.
drawWindow=function(){
 G.save();G.beginPath();G.rect(WIN[0],WIN[1],WIN_W,WIN_H);G.clip();G.translate(WIN[0],WIN[1]);
 rect(0,0,202,128,'#253e5d');rect(35,0,167,128,'#304b69');
 const e=B.ent,ex=entrantX(e);
 if(e&&ex!==null){
  G.save();if(!motionPreference.matches)G.globalAlpha=uiEaseOut((now-e.tEnter)/.18);
  const movement=portraitMotionState(e);
  pixelPortrait(exprKey(e),motionPreference.matches?11:ex-90,movement.offset,180,128,false,e.spec.contract?.mask,movement);G.restore();
 }else{
  outline(77,32,125,67,'#7594b1');line(90,76,112,76,'#7594b1');line(101,68,101,76,'#7594b1');
  txt(101,89,'等待交付方接入',10,'#bcd1e5','ma');
 }
 for(const [x,y,sx,sy] of [[3,3,1,1],[199,3,-1,1],[3,125,1,-1],[199,125,-1,-1]]){
  line(x,y,x+sx*9,y,'#7190ac');line(x,y,x,y+sy*9,'#7190ac');
 }
 rect(174,7,177,10,e?'#92dac2':'#778ea5');txt(181,6,e?'在线':'待机',8,'#b9d0e4');
 if(e&&now<e.talkUntil){
  for(let i=0;i<4;i++){const h=motionPreference.matches?4:2+Math.floor((Math.sin(now*12+i*1.4)+1)*3);rect(8+i*4,18-h,9+i*4,18,'#92dac2');}
 }
 G.restore();outline(...WIN,'#6682a4');
};
const feedbackLower=drawBoothLower;
drawBoothLower=function(){
 feedbackLower();
 if(drag&&B.ent&&drag.d.owner==='ent'&&drag.d.key===B.ent.spec.primary){
  const ready=!!B.ent.decided;
  rect(31,239,209,261,ready?'#1d6658':'#3b4b61');
  outline(31,239,209,261,ready?'#93d7bf':'#a6b9ce');
  txt(120,245,ready?'拖回此处，归还订单':'先盖章，再归还订单',10,UI.white,'ma');
 }
};
const feedbackCard=Card.prototype.draw;
Card.prototype.draw=function(x,y){
 feedbackCard.call(this,x,y);
 if(drag&&B.docs.some(d=>d.doc===this&&d===drag.d))outline(x-1,y-1,x+this.w,y+this.h,UI.cyan);
};

trayU=function(){
 if(motionPreference.matches)return B.tray.open?1:0;
 const {open,t}=B.tray;
 return open?uiEaseOut((now-t)/.22):1-uiEaseOut((now-t)/.16);
};
