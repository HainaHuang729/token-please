'use strict';
// Local design comparison: rendering changes only; input/evidence coordinates stay shared.
const UI_VARIANTS={
 terminal:{name:'01 复古终端',desk:'#182b36',paper:'#dce5cf',ink:'#1e3336',muted:'#8aa6a6',line:'#48616b',navy:'#0e202a',deep:'#10232d',blue:'#ddbc6d',cyan:'#407c80',lavender:'#746d87',green:'#4e886b',red:'#b65c53',white:'#eef0dc',amber:'#ddbc6d'},
 paper:{name:'02 纸质审单台',desk:'#c4bdb0',paper:'#f0ecdf',ink:'#343631',muted:'#65665c',line:'#999b8c',navy:'#424f47',deep:'#39463e',blue:'#69594e',cyan:'#506c60',lavender:'#77687c',green:'#4b725b',red:'#a0443d',white:'#f5f0df',amber:'#c4a564'},
 dispatch:{name:'03 调度控制室',desk:'#d5dee8',paper:'#f4f7fa',ink:'#24354c',muted:'#5b7186',line:'#aabaca',navy:'#273c57',deep:'#1c304a',blue:'#355f9b',cyan:'#267c87',lavender:'#746caa',green:'#3c7963',red:'#ab5362',white:'#f4f8ff',amber:'#d5ae65'}
};
const designPreview=['localhost','127.0.0.1',''].includes(location.hostname)||new URLSearchParams(location.search).has('design');
let uiVariant='terminal';
function setUiVariant(value){
 if(!UI_VARIANTS[value])return;uiVariant=value;Object.assign(UI,UI_VARIANTS[value]);
 Object.assign(K,{INK:UI.deep,DESK:UI.desk,DESK_D:UI.line,DESK_L:UI.paper,METAL_D:UI.navy,METAL_L:UI.line,WHITE:UI.white,GREY_D:UI.muted,PAPER:UI.paper,TEXT:UI.ink,TEXT_L:UI.muted,BOOK:UI.navy,BOOK_L:UI.blue,GREEN:UI.green,RED:UI.red});
 document.body.dataset.design=value;document.body.style.background=UI.desk;
 document.querySelectorAll('[data-variant]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.variant===value)));
 try{localStorage.setItem('token-please-design',value);}catch{}
}
const bar=document.createElement('nav');bar.id='design-switcher';bar.setAttribute('aria-label','界面方案');
for(const [key,v] of Object.entries(UI_VARIANTS)){const b=document.createElement('button');b.textContent=v.name;b.dataset.variant=key;b.type='button';b.onclick=()=>setUiVariant(key);bar.appendChild(b);}if(designPreview)document.body.appendChild(bar);
const designStyle=document.createElement('style');designStyle.textContent=`
body{box-sizing:border-box;padding-top:${designPreview?38:0}px}#design-switcher{position:fixed;inset:0 0 auto;height:36px;display:flex;align-items:center;gap:4px;padding-left:10px;background:#172a3e;border-bottom:2px solid #7793a7;z-index:2}
#design-switcher button{font:12px monospace;color:#c2d1dd;background:transparent;border:1px solid transparent;padding:5px 10px;cursor:pointer}#design-switcher button[aria-pressed=true]{background:#dce6eb;color:#20384a;border-color:#edf5f5}#design-switcher button:focus-visible{outline:2px solid #e2bb63}.ui{z-index:4;top:8px}
@media(max-width:700px){#design-switcher{padding-left:3px;gap:1px}#design-switcher button{font-size:10px;padding:5px 4px}.ui{top:9px;opacity:1}.ui button{font-size:9px;padding:2px 3px}}
`;document.head.appendChild(designStyle);
fit=function(){const s=Math.min(innerWidth/W,(innerHeight-(designPreview?40:0))/H);canvasEl.style.width=Math.floor(W*s)+'px';canvasEl.style.height=Math.floor(H*s)+'px';};addEventListener('resize',()=>{if(canvasEl)fit();});
let preferred;try{preferred=localStorage.getItem('token-please-design');}catch{}setUiVariant(designPreview?(new URLSearchParams(location.search).get('design')||preferred||'paper'):'paper');
if(typeof canvasEl!=='undefined'&&canvasEl)fit();
drawBg=function(){
 rect(0,0,639,359,UI.desk);rect(0,0,639,26,UI.navy);txt(12,8,'Token, Please!',10,UI.white);
 txt(500,9,'TOKEN '+(B.pay-B.fines)+' / 第 '+(chapterIndex+1)+' 章',8,UI.white,'ra');
 rect(0,124,219,359,UI.deep);
 if(uiVariant==='terminal'){
  for(let y=130;y<310;y+=10)line(229,y,633,y,'#203642');
  for(let x=230;x<640;x+=20)line(x,130,x,309,'#203642');
  outline(226,127,635,310,UI.line);txt(236,296,'> 等待订单 / 核验上游',8,UI.muted);
 }else if(uiVariant==='paper'){
  rect(230,132,632,310,'#a9a998');rect(227,129,629,307,'#dcd8c9');
  for(let y=150;y<304;y+=18)line(237,y,620,y,'#c9c8b7');
  rect(234,125,261,135,'#858d7e');rect(590,125,618,135,'#858d7e');
  txt(247,287,'订单与回执请放在此处',8,UI.muted);
 }else{
  rect(228,130,632,308,'#e6edf3');outline(228,130,632,308,UI.line);
  rect(228,130,231,308,UI.cyan);line(430,142,430,296,'#cad6e0');
  txt(244,290,'拖动材料自由摆放',8,UI.muted);txt(446,290,'点击字段进行比对',8,UI.muted);
 }
 line(228,316,632,316,UI.line);
};
drawExterior=function(){
 const dark=uiVariant==='terminal',fg=dark?UI.white:UI.ink;
 txt(12,37,chapter().name,12,fg);txt(12,58,'已处理 '+B.total+' / '+CASE_COUNT+'    差错 '+(B.total-B.correct),8,dark?UI.muted:UI.muted);
 if(uiVariant==='paper'){
  rect(12,76,103,98,UI.paper);outline(12,76,103,98,UI.line);txt(20,83,'本班 '+(B.pay-B.fines)+' token',8,UI.ink);
  txt(115,83,'逐单核验',10,UI.red);
 }else{rect(12,79,206,84,UI.line);if(B.total)rect(12,79,12+Math.floor(194*B.total/CASE_COUNT),84,UI.cyan);txt(12,93,dark?'> upstream.inspect':'核对承诺 / 验收交付',8,dark?UI.amber:UI.muted);}
 B.queue.forEach((s,i)=>{
  const x=230+i*47,done=i<B.total,active=!!B.ent&&i===B.idx-1;
  if(uiVariant==='terminal'){
   if(active)rect(x,32,x+41,99,'#314955');
   outline(x,34,x+41,76,active?UI.amber:UI.line);uiPortrait(s.person,x+4,37,33,35,'neutral',s.contract?.mask);
   txt(x+20,84,done?'OK':active?'> '+String(i+1):String(i+1).padStart(2,'0'),8,active?UI.amber:UI.muted,'ma');
  }else if(uiVariant==='paper'){
   rect(x+2,40,x+42,96,'#a4a497');rect(x,35,x+40,93,UI.paper);rect(x+13,32,x+27,37,'#858d7e');
   uiPortrait(s.person,x+3,40,34,34,'neutral',s.contract?.mask);txt(x+20,80,done?'归档':String(i+1).padStart(2,'0'),8,active?UI.red:UI.muted,'ma');if(active)line(x+6,91,x+34,91,UI.red);
  }else{
   line(x+20,93,x+67,93,UI.line);rect(x,34,x+41,84,active?UI.navy:UI.paper);uiPortrait(s.person,x+4,38,33,34,'neutral',s.contract?.mask);
   rect(x+17,91,x+22,96,done?UI.green:active?UI.cyan:UI.line);txt(x+20,75,String(i+1).padStart(2,'0'),8,active?UI.white:UI.muted,'ma');
  }
 });
 txt(12,113,B.ent?'接入 / '+B.ent.spec.name:'等待交付方接入',8,dark?UI.white:UI.muted);
 if(B.insp.on)txt(232,113,'比对证据 / 点击对应字段',8,dark?UI.amber:UI.cyan);
};
drawWindow=function(){
 G.save();G.beginPath();G.rect(WIN[0],WIN[1],WIN_W,WIN_H);G.clip();G.translate(WIN[0],WIN[1]);
 const paper=uiVariant==='paper',terminal=uiVariant==='terminal';
 rect(0,0,202,128,paper?'#b6bbad':terminal?'#142630':'#263f59');
 if(paper){rect(35,5,168,127,'#d4d7c9');rect(38,8,165,124,'#c2c9b8');}
 else if(terminal){for(let y=4;y<128;y+=8)line(0,y,202,y,'#1e3540');}
 else{rect(31,0,171,128,'#37546d');line(31,0,31,128,'#58758b');line(171,0,171,128,'#58758b');}
 const e=B.ent,ex=entrantX(e);
 if(e&&ex!==null){const m=portraitMotionState(e);pixelPortrait(exprKey(e),motionPreference.matches?11:ex-90,m.offset,180,128,false,e.spec.contract?.mask,m);}
 else{drawNextOrderIcon();}
 rect(6,6,9,9,e?UI.green:UI.muted);txt(14,5,e?'接入中':'待机',8,paper?UI.ink:UI.white);
 G.restore();outline(...WIN,UI.line);
};
const variantCard=Card.prototype.draw;
Card.prototype.draw=function(x,y){variantCard.call(this,x,y);if(uiVariant==='paper'){line(x+4,y+17,x+this.w-5,y+17,UI.ink);}else if(uiVariant==='terminal'){rect(x,y,x+2,y+this.h-1,UI.amber);}};
uiButton=function(box,label,active=false,tone=UI.navy){
 const hover=ptr.mouse&&inBox(ptr.x,ptr.y,box),down=hover&&ptr.down,dy=down?1:0;
 const terminal=uiVariant==='terminal';rect(box[0]+1,box[1]+2,box[2]+1,box[3]+2,UI.line);
 rect(box[0],box[1]+dy,box[2],box[3]+dy,active?tone:terminal?UI.deep:UI.paper);
 outline(box[0],box[1]+dy,box[2],box[3]+dy,hover?UI.amber:active?tone:UI.line);
 txt((box[0]+box[2])/2,box[1]+dy+Math.floor((box[3]-box[1]-10)/2),label,10,active||terminal?UI.white:UI.ink,'ma');
};
// Theme-specific dialogue materials and preserved return target.
drawBoothLower=function(){
 const paper=uiVariant==='paper',idle=!B.ent&&!B.ending&&B.idx<B.queue.length;
 for(const {ln,size,box} of lineBoxes()){
  rect(...box,paper?UI.paper:UI.navy);
  rect(box[0],box[1],box[0]+1,box[3],ln.who==='C'?UI.cyan:UI.amber);
  txt(35,box[1]+3,ln.text,size,paper?UI.ink:ln.who==='C'?'#b4ddd9':UI.white,'la',motionPreference.matches?999:Math.floor(Math.max(0,now-ln.t)*26));
 }
 for(const d of B.docs)if(!d.big){rect(d.x,d.y,d.x+18,d.y+12,UI.paper);rect(d.x,d.y,d.x+18,d.y+3,UI.cyan);}
 if(!B.ent)txt(41,270,'待收件',8,'#bbcfcc');else if(B.docs.some(d=>d.owner==='ent'&&!d.big))txt(72,270,'拖到右侧',8,'#bbcfcc');
 const e=B.ent,step=!e?0:!e.verified?1:!e.decided?2:3;
 ['接单','取证','比对','归还'].forEach((s,i)=>{const x=9+i*53,lit=i===step;rect(x,345,x+44,357,lit?UI.cyan:UI.navy);txt(x+22,348,s,8,lit?UI.white:'#a5b6b6','ma');});
 if(drag&&e&&drag.d.owner==='ent'&&drag.d.key===e.spec.primary){rect(31,239,209,261,e.decided?UI.green:UI.navy);outline(31,239,209,261,UI.white);txt(120,245,e.decided?'拖回此处，归还订单':'先盖章，再归还订单',10,UI.white,'ma');}
};
const themedCard=Card.prototype.draw;
Card.prototype.draw=function(x,y){const old=UI.muted;if(uiVariant==='terminal')UI.muted='#52685d';try{themedCard.call(this,x,y);}finally{UI.muted=old;}};
titleBackdrop=function(){rect(0,0,639,359,UI.paper);rect(0,0,639,25,UI.navy);txt(16,8,'中转站 / 夜班交付台',10,UI.white);txt(500,9,'五章 / 三十单 / 逐步更新规则',8,UI.white,'ra');};
drawTitle=function(){
 titleBackdrop();if(showingRoster){drawRoster();return;}
 if(uiVariant==='terminal'){
  rect(0,26,639,210,UI.desk);outline(24,40,616,196,UI.line);
  txt(38,53,'> relay.authenticate',10,UI.amber);bigText(191,80,'Token, Please!',12,3,UI.white);
  txt(38,135,'前台报的名字，后台真的认吗？',10,UI.white);txt(38,159,'接收订单 / 调取上游 / 核对交付',8,UI.muted);
  ['GPT','DEEPSEEK','CLAUDE'].forEach((key,i)=>{const x=380+i*73;outline(x,59,x+65,157,UI.line);uiPortrait(key,x+2,63,61,79);txt(x+32,146,key==='DEEPSEEK'?'DS':key,8,UI.white,'ma');});
 }else if(uiVariant==='paper'){
  rect(0,26,639,210,UI.desk);rect(27,44,613,199,UI.line);rect(23,40,609,195,UI.paper);
  rect(44,34,88,45,UI.navy);rect(546,34,590,45,UI.navy);txt(44,57,'夜班验收 / 第 001 号',10,UI.muted);
  bigText(202,83,'Token, Please!',12,3,UI.ink);line(44,121,342,121,UI.line);
  txt(44,139,'请出示你的上游。',12,UI.red);txt(44,164,'逐单比对，亲手盖章。',10,UI.muted);
  ['CLAUDE','GPT','DEEPSEEK'].forEach((key,i)=>{const x=377+i*70;rect(x+2,62,x+60,161,UI.line);rect(x,60,x+58,159,'#e3e3d6');uiPortrait(key,x+2,66,54,73);txt(x+29,145,'0'+(i+1),8,UI.ink,'ma');});
 }else{
  rect(0,26,639,210,UI.desk);rect(26,42,157,193,UI.navy);txt(40,54,'交付方 / 接入',8,UI.white);uiPortrait('DEEPSEEK',36,71,111,111);
  bigText(323,59,'Token, Please!',12,2,UI.ink);txt(320,101,'你买的是谁，',12,UI.ink,'ma');txt(320,123,'实际干活的又是谁？',12,UI.cyan,'ma');
  line(172,158,461,158,UI.line);txt(320,174,'核对承诺，验收每一份交付。',8,UI.muted,'ma');
  rect(477,42,613,193,UI.paper);rect(477,42,613,60,UI.cyan);txt(490,47,'核验工作台',10,UI.white);
  ['订单授权','上游记录','实际用量'].forEach((s,i)=>{txt(491,78+i*31,s,10,UI.ink);line(491,95+i*31,599,95+i*31,UI.line);});
 }
 chapterRail(220,0);uiButton([233,285,407,318],'开始第一班',true,UI.cyan);txt(320,325,'查看交付方档案',8,UI.ink,'ma');
 txt(14,348,'改编自 IP, PLEASE / ctnyanya',8,UI.muted);txt(626,348,'拖拽操作 · R 调回执 · F 全屏',8,UI.muted,'ra');
};
chapterRail=function(y,current){
 CHAPTERS.forEach((c,i)=>{const x=30+i*119,active=i===current,done=i<current;
  rect(x,y,x+103,y+35,active?UI.navy:UI.paper);outline(x,y,x+103,y+35,UI.line);
  if(uiVariant==='paper')rect(x+5,y-2,x+20,y+1,UI.line);
  txt(x+8,y+5,'第 '+(i+1)+' 章',10,active?UI.white:done?UI.green:UI.ink);
  txt(x+8,y+22,c.cases.length+' 单'+(done?' / 已完成':''),8,active?UI.white:UI.ink);
 });
};
for(const name of ['drawNews','drawSummary','drawRoster']){const original=window[name];window[name]=function(...args){const old=UI.muted;if(uiVariant==='terminal')UI.muted='#52685d';try{return original(...args);}finally{UI.muted=old;}};}
const designButtons=drawButtons;
drawButtons=function(){const old=UI.muted;if(uiVariant==='terminal'&&uiNotice&&now-uiNotice.t<3.4)UI.muted='#52685d';try{designButtons();}finally{UI.muted=old;}};
