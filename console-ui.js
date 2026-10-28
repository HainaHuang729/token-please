'use strict';
// Visual system: a dispatch console, preserving the document engine's coordinates.
SPEAKER.splice(0,4,6,288,26,321);
const UI={ink:'#20334e',muted:'#64768c',line:'#b8c8da',paper:'#f7faff',desk:'#dce6f0',navy:'#213958',deep:'#172b46',blue:'#345fc4',cyan:'#147d91',lavender:'#745ea8',green:'#237c66',red:'#b75359',white:'#f4f8ff',amber:'#e5bb5d'};
Object.assign(K,{INK:UI.deep,DESK:UI.desk,DESK_D:'#b2c3d5',DESK_L:'#e9eff6',METAL_D:UI.navy,METAL_L:'#6b87a8',WHITE:UI.white,GREY:'#a4bad1',GREY_D:UI.muted,CLAUDE:UI.blue,CLAUDE_L:'#a9dfe8',GREEN:UI.green,GREEN_D:'#1a5d50',GREEN_L:'#8bc8b0',RED:UI.red,RED_D:'#8d3e49',RED_L:'#f0a0a5',PAPER:UI.paper,TEXT:UI.ink,TEXT_L:UI.muted,BOOK:UI.navy,BOOK_L:UI.blue});
function uiPortrait(key,x,y,w,h,expr='neutral',mask=null){
 const a=SPR[key+':'+expr]||SPR[key+':neutral'];
 if(a)pixelPortrait(key+':'+expr,x,y,w,h,true,mask);
}
function uiButton(box,label,active=false,tone=UI.navy){
 rect(...box,active?tone:UI.paper);outline(...box,active?tone:UI.line);
 txt((box[0]+box[2])/2,box[1]+Math.floor((box[3]-box[1]-10)/2),label,10,active?UI.white:UI.ink,'ma');
}
function consoleBase(){
 rect(0,0,639,359,UI.desk);
 rect(0,0,639,25,UI.navy);
 txt(12,8,'Token, Please!',10,UI.white);
 txt(500,9,'章节 '+(chapterIndex+1)+' / '+CHAPTERS.length,8,'#adc6df','ra');
 rect(0,124,219,359,UI.deep);
 rect(220,124,639,359,UI.desk);
 rect(220,124,222,359,UI.line);
 for(let x=236;x<630;x+=16)for(let y=145;y<310;y+=16)pt(x,y,'#c5d3e1');
 rect(228,311,632,312,UI.line);
}
drawBg=consoleBase;
drawExterior=function(){
 txt(14,39,chapter().name,12,UI.ink);
 txt(14,60,'核对承诺，确认实际交付。',8,UI.muted);
 txt(14,84,'已处理 '+B.total+' / '+CASE_COUNT+'    正确 '+B.correct,10,UI.blue);
 const queue=B.queue;
 queue.forEach((s,i)=>{
  const x=230+i*40,done=i<B.idx-1||(!B.ent&&i<B.idx),current=B.ent&&i===B.idx-1;
  rect(x,35,x+35,91,current?'#becfed':done?'#d0dddF':'#eaf0f7');
  if(current)rect(x,35,x+35,37,UI.blue);
  G.save();if(done)G.globalAlpha=.45;uiPortrait(s.person,x+2,40,31,37);G.restore();
  txt(x+17,81,String(i+1).padStart(2,'0'),8,current?UI.blue:UI.muted,'ma');
 });
 txt(14,113,B.ent?'当前交付方 / '+B.ent.spec.name:'交付方等待接入',8,UI.muted);
 txt(232,113,'证据工作区',8,UI.muted);
};
drawWindow=function(){
 G.save();G.beginPath();G.rect(WIN[0],WIN[1],WIN_W,WIN_H);G.clip();G.translate(WIN[0],WIN[1]);
 rect(0,0,202,128,'#304c70');
 for(let y=12;y<128;y+=20)line(0,y,202,y,'#3b577b');
 for(let x=22;x<203;x+=40)line(x,0,x,128,'#3b577b');
 const e=B.ent,ex=entrantX(e);
 if(e&&ex!==null){pixelPortrait(exprKey(e),ex-90,0,180,129);}
 else{txt(101,48,'通讯待机',12,'#c1d2e7','ma');txt(101,69,'点击下方接收下一单',8,'#a4bad1','ma');}
 rect(5,5,8,8,e?'#8bd5bf':'#91a6bd');
 G.restore();outline(...WIN,'#6682a4');
};
// Preserve per-field hit areas while giving orders and upstream records distinct identities.
Card.prototype.draw=function(x,y){
 const receipt=this.title.includes('回执'),accent=receipt?UI.lavender:UI.cyan;
 rect(x+2,y+3,x+this.w+1,y+this.h+2,'#b2c2d4');rect(x,y,x+this.w-1,y+this.h-1,UI.paper);
 outline(x,y,x+this.w-1,y+this.h-1,UI.line);rect(x,y,x+this.w-1,y+15,accent);
 txt(x+6,y+4,this.title,10,UI.white);
 this.shown.forEach(([k,v],i)=>{
  const yy=y+20+i*14;txt(x+8,yy,k,10,UI.muted);
  txt(x+this.valueX,yy,v,tw(v,10)>this.w-this.valueX-6?8:10,UI.ink);
  line(x+6,yy+11,x+this.w-7,yy+11,'#e1e8f1');
 });
};
lineBoxes=function(){return B.lines.slice(-3).map((ln,i)=>{const size=tw(ln.text,10)>180?8:10;return {ln,size,box:[30,288+i*17,214,303+i*17]};});};
drawBoothLower=function(){
 const idle=!B.ent&&!B.ending&&B.idx<B.queue.length;
 rect(6,288,26,321,idle?UI.cyan:'#3b516f');
 txt(16,292,'接',10,UI.white,'ma');txt(16,307,'单',10,UI.white,'ma');
 for(const {ln,size,box} of lineBoxes()){
  rect(...box,ln.who==='C'?'#294966':'#243d5b');
  txt(35,box[1]+3,ln.text,size,ln.who==='C'?'#a9dfe8':UI.white,'la',(typeof motionPreference!=='undefined'&&motionPreference.matches)?999:Math.floor(Math.max(0,now-ln.t)*26));
 }
 for(const d of B.docs)if(!d.big){rect(d.x,d.y,d.x+18,d.y+12,'#e5f3f5');rect(d.x,d.y,d.x+18,d.y+3,UI.cyan);}
 txt(10,348,'接单 → 核验 → 比对 → 签收',8,'#a4bad1');
 if(!B.ent)txt(41,270,'待收件',8,'#a4bad1');
 else if(B.docs.some(d=>d.owner==='ent'&&!d.big))txt(72,270,'拖到右侧',8,'#a4bad1');
};
drawButtons=function(){
 uiButton(FRAUD_BTN,B.ent?.fraudMarked?'撤销欺诈标记':'标记欺诈',!!B.ent?.fraudMarked,UI.red);
 uiButton(RULE_BTN,'条款',!!B.ruleInst,UI.blue);
 uiButton(INSPECT_BTN,B.insp.on?'结束':'比对',B.insp.on,UI.blue);
 uiButton(VERIFY_BTN,B.ent?.verifying?'正在调取':B.ent?.verified?'回执已到':'调取回执',true,B.ent?.verified?UI.green:UI.cyan);
};
drawHint=function(){
 if(B.insp.on)return;
 const text=hintText();if(!text)return;
 const size=tw(text,10)>290?8:10;
 txt(632,113,text,size,UI.blue,'ra');
};
function titleBackdrop(){
 rect(0,0,639,359,'#e7eef6');
 rect(0,0,639,25,UI.navy);txt(16,8,'中转站 / 夜班交付台',10,UI.white);
 txt(500,9,'五个章节 · 逐步解锁规则',8,'#c2d2e4','ra');
}
drawTitle=function(){
 titleBackdrop();if(showingRoster){drawRoster();return;}
 txt(30,44,'你买的是谁，',12,UI.muted);
 bigText(186,69,'Token, Please!',12,3,UI.ink);
 txt(30,121,'实际干活的，又是谁？',12,UI.blue);
 txt(30,153,'调出上游记录，核对每一份交付。',10,UI.ink);
 txt(30,173,'放行授权代工，退回缩水订单，识破套牌。',8,UI.muted);
 line(366,117,610,117,'#afc2da');line(410,117,455,90,'#afc2da');line(455,90,520,117,'#afc2da');
 uiPortrait('DEEPSEEK',365,73,72,90);uiPortrait('CLAUDE',441,44,89,110);uiPortrait('GPT',537,73,72,90);
 txt(491,174,'请出示你的上游',10,UI.cyan,'ma');
 line(30,202,610,202,UI.line);
 CHAPTERS.forEach((c,i)=>{const x=30+i*119;txt(x,222,'第 '+(i+1)+' 章',10,UI.blue);txt(x,246,c.cases.length+' 份订单',8,UI.muted);});
 uiButton([233,285,407,318],'开始值班',true,UI.blue);
 txt(320,325,'查看交付方档案',8,UI.blue,'ma');
 txt(14,348,'改编自 IP, PLEASE / ctnyanya',8,UI.muted);txt(626,348,'拖拽操作 · R 调回执 · F 全屏',8,UI.muted,'ra');
};
drawRoster=function(){
 txt(320,33,'交付方档案',12,UI.ink,'ma');
 MODEL_CAST.forEach(([key,label],i)=>{
  const x=20+(i%5)*124,y=53+Math.floor(i/5)*130;
  rect(x,y,x+102,y+114,UI.paper);outline(x,y,x+102,y+114,UI.line);
  uiPortrait(key,x+10,y+4,82,88);txt(x+51,y+99,label,10,UI.ink,'ma');
 });
 txt(320,338,'点击返回。角色身份不决定订单是否合规。',8,UI.muted,'ma');
};
drawNews=function(){
 titleBackdrop();
 txt(40,43,chapter().name,12,UI.blue);
 txt(40,76,chapter().focus,12,UI.ink);
 txt(40,101,chapter().story,10,UI.muted);
 chapter().tips.forEach((s,i)=>{const y=139+i*43;txt(42,y,'0'+(i+1),12,UI.cyan);txt(82,y,s,10,UI.ink);line(82,y+27,597,y+27,UI.line);});
 uiButton([430,310,610,338],'了解，开始接单',true,UI.blue);
 txt(40,322,'本章 '+CASE_COUNT+' 单 · 旧规则继续生效',8,UI.muted);
};
drawSummary=function(){
 titleBackdrop();txt(40,46,chapter().name+' / 结算',12,UI.blue);
 bigText(244,76,B.correct===CASE_COUNT?'本章交付，全部核清。':'交班前，记下这些差错。',12,2,UI.ink);
 line(40,116,600,116,UI.line);
 const rows=[['正确验收',B.correct+' / '+B.total],['查实欺诈',(B.frauds||0)+' 单'],['值班收入',B.pay+' token'],['差错扣款',(B.fines?'-'+B.fines:'0')+' token']];
 rows.forEach(([label,value],i)=>{const y=137+i*28;txt(52,y,label,12,UI.muted);txt(346,y,value,12,i===3?UI.red:UI.ink,'ra');});
 rect(400,137,598,238,UI.navy);txt(499,153,'本班结算',10,'#b9cce0','ma');bigText(499,181,String(B.pay-B.fines),12,3,UI.white);txt(565,216,'token',10,'#b9cce0');
 txt(320,261,'累计正确 '+(S.stats.correct||0)+' 单 · 今日功德，按 token 结算。',10,UI.muted,'ma');
 uiButton([233,285,407,318],chapterIndex<CHAPTERS.length-1?'进入下一章':'重新开始五章',true,UI.blue);
 txt(320,342,'本局合同与服务记录为虚构剧情。',8,UI.muted,'ma');
};
