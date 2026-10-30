'use strict';
// Standalone night-shift scenario. Base engine © ctnyanya, MIT.
const FRAUD_BTN = [430,322,518,354];
const VERIFY_BTN = [126, 267, 211, 283];
const MODEL_CAST = [
  ['GPT','GPT'],['GEMINI','Gemini'],['GLM','GLM'],['DEEPSEEK','DeepSeek'],['CLAUDE','Claude'],
  ['QWEN','Qwen'],['GROK','Grok'],['META','Meta'],['KIMI','Kimi'],['MINIMAX','MiniMax']
];
let CASE_COUNT = 4;
const ROSTER_BTN = [233,321,407,337];
let showingRoster = false;

RULES.splice(0, RULES.length,
 {day:1,page:0,key:'proof',head:'§1 每单必须核验上游',subs:['订单编号须与回执一致，签名有效']},
 {day:1,page:0,key:'model',head:'§2 交付须在授权范围',subs:['代工须授权；协作按约定顺序执行']},
 {day:1,page:0,key:'delivery',head:'§3 交付与收费按合同',subs:['输入不得截断，扣款不得超预算']},
 {day:1,page:0,key:'fraud',head:'§4 欺诈须标记并退回',subs:['伪造回执、未授权跨品牌替换：标记', '同品牌降级、缩水、超收：退回整改']}
);
DATES[1]='2026.10.28';WEEKDAYS[1]='星期三';
INTRO.splice(0,INTRO.length,['你是模型中转站验收员。','订单写的是谁，实际交付的又是谁？']);
NEWS[1]={h1:'请出示你的上游',sub:'每单核验订单与签名回执。按授权模型、交付上下文和预算验收。',h2:'允许的代工可以通过。偷偷换牌或伪造回执：标记欺诈，再盖退回章。',icon:'gate'};
buildQueue=function(){return RELAY_CASES.map(relaySpec);};
const baseCallNext=callNext;
callNext=function(){if(!B.ent)B.docs=B.docs.filter(d=>d.key!=='receipt');baseCallNext();};
function verifyNight() {
  const e=B.ent;
  if(!e || e.phase!=='here' || !e.handed || e.verified) return;
  if(e.verifying)return;
  e.verifying=true;
  printDoc(new Card(e.spec.receiptRows,{title:e.spec.needsLog?'中转计费回执':'回执核验单',sub:'CHECK',color:C.SAGE,colorD:C.SAGE_D,seal:false,valueX:42}),0.7,'receipt',()=>{if(B.ent===e){e.verified=true;e.verifying=false;}});
  say('C','正在调取记录，请与订单逐项核对。');
  const receiptLine=chapterIndex===0?e.spec.reply:(e.spec.receiptLine||'记录已到，请按本单材料验收。');
  if(receiptLine)runSteps([['E',receiptLine,{hold:1.5}]],0.8);
}
function toggleFraud(){
 const e=B.ent;
 if(!e||e.phase!=='here'||!e.handed)return;
 if(!e.verified){flash('先核验签名回执，不能凭角色外观标记');return;}
 e.fraudMarked=!e.fraudMarked;
 flash(e.fraudMarked?'已标记欺诈；还须盖退回章并归还订单':'已撤销欺诈标记');
}
const baseBoothInput=boothInput;
boothInput=function(x,y){ if(inBox(x,y,FRAUD_BTN)){toggleFraud();return;} if(inBox(x,y,VERIFY_BTN)){verifyNight();return;} baseBoothInput(x,y); };
const baseDrawButtons=drawButtons;
drawButtons=function(){
  button(RULE_BTN,'§','合同',!!B.ruleInst);button(INSPECT_BTN,'?','比对',B.insp.on);
  rect(...FRAUD_BTN,B.ent?.fraudMarked?K.RED_D:K.METAL_D);outline(...FRAUD_BTN,K.METAL_L);
  txt(474,335,B.ent?.fraudMarked?'已标欺诈':'标记欺诈',10,K.WHITE,'ma');
  rect(...VERIFY_BTN,K.METAL_D); outline(...VERIFY_BTN,K.METAL_L);
  txt(168,270,B.ent?.verifying?'调取中':B.ent?.verified?'已核验':'核验 [R]',10,K.WHITE,'ma');
  const avatar=SPR['CLAUDE:neutral'];
  if(avatar){G.drawImage(ATLAS_IMG,avatar[0],avatar[1],avatar[2],avatar[3],577,30,43,48);txt(598,82,'CLAUDE',8,K.CLAUDE_L,'ma');}
  rect(428,49,555,62,K.PAPER_D);txt(433,52,'订单与交付必须一致',8,K.TEXT);
  rect(6,5,230,22,K.INK);txt(12,9,'中转站验收 / '+Math.min(B.idx,CASE_COUNT)+' / '+CASE_COUNT,10,K.WHITE);
};
judge=function(e,dec){
 B.total++;S.stats[dec]=(S.stats[dec]||0)+1;
 let error=null;
 if(!e.verified)error='未核验上游回执，不能完成验收';
 else if(!!e.fraudMarked!==e.spec.fraud)error=e.spec.fraud?'发现套牌或假回执，须标记欺诈':'无证据标记欺诈；应按合同处理';
 else if(!e.spec.ok.includes(dec))error=dec==='approve'?e.spec.reason:'交付符合订单授权，不应退回';
 if(error){S.stats.wrong++;cite(['验收处理错误',error]);}
 else{B.correct++;B.pay+=5;S.stats.correct++;if(e.fraudMarked)B.frauds=(B.frauds||0)+1;}
};
hintText=function(){
 if(B.flash&&now<B.flash.t+3.2)return B.flash.text;
 const e=B.ent;
 if(!e)return '点窗口中央的交单图标，叫下一位';
 if(!e.handed)return '交付方正在提交订单';
 if(!B.docs.some(d=>d.owner==='ent'&&d.big))return '把左下订单拖到工作区';
 if(!e.verified)return '点「调取回执」，取得本单记录';
 if(!S.tut.tray)return '核对两份材料，再拉开右侧印章栏';
 return '绿章通过 / 红章退回；套牌须标记欺诈';
};
loadSave=()=>null;
chooseLang('zh'); scene='title';
drawTitle=function(){
  drawBg();darken(0.82);
  if(showingRoster){drawRoster();return;}
  MODEL_CAST.forEach(([key,label],i)=>{
    const a=SPR[key+':neutral'],x=20+i*60;
    if(a)G.drawImage(ATLAS_IMG,a[0],a[1],a[2],a[3],x,22,50,55);
    txt(x+25,82,label,8,K.WHITE,'ma');
  });
  rect(0,100,639,203,K.METAL_D);
  bigText(320,117,'模型中转站',12,4,K.WHITE,K.INK);
  txt(320,175,'请出示你的上游',12,K.CLAUDE_L,'ma');
  txt(320,227,'原装？代工？套牌？按合同与回执验收。',10,K.WHITE,'ma');
  txt(320,250,'调取上游 / 比对订单 / 标记欺诈 / 盖章归还',10,K.GREY,'ma');
  rect(233,285,407,318,K.GREEN_D);outline(233,285,407,318,K.GREEN_L);
  txt(320,296,'开始验收',12,K.WHITE,'ma');
  txt(320,325,'角色图鉴 · 点击查看',8,K.GREY,'ma');
  txt(320,347,'基于 ctnyanya 的 IP, PLEASE · MIT / 字体 OFL',8,K.GREY,'ma');
};
function drawRoster(){
  txt(320,8,'十位模型角色',12,K.WHITE,'ma');
  MODEL_CAST.forEach(([key,label],i)=>{
    const x=20+(i%5)*124,y=30+Math.floor(i/5)*143,a=SPR[key+':neutral'];
    rect(x,y,x+102,y+126,K.METAL_D);
    if(a)G.drawImage(ATLAS_IMG,a[0],a[1],a[2],a[3],x+4,y+4,94,103);
    txt(x+51,y+111,label,10,K.WHITE,'ma');
  });
  txt(320,338,'点击返回 · 模型角色不代表真假，按本局合同判断',10,K.CLAUDE_L,'ma');
}
titleClick=function(x,y){
  if(showingRoster){showingRoster=false;return;}
  if(inBox(x,y,ROSTER_BTN)){showingRoster=true;return;}
  if(inBox(x,y,[233,285,407,318])){newGame();go('news');}
};
drawSummary=function(){
  drawBg();darken(0.92);
  txt(320,38,'中转站交班报告',12,K.GREY,'ma');
  bigText(320,80,B.correct===CASE_COUNT?'证据守门人':B.correct>=Math.ceil(CASE_COUNT*0.7)?'仍有未解之处':'需要重新培训',12,2,K.WHITE);
  txt(320,133,'正确验收 '+B.correct+' / '+B.total+' 份订单',12,K.CLAUDE_L,'ma');
  txt(320,159,'工资 '+B.pay+'  /  罚款 '+B.fines+'  /  结余 '+(B.pay-B.fines)+' token',10,K.WHITE,'ma');
  txt(320,205,'授权代工可以通过，偷偷换牌必须查明。',12,K.WHITE,'ma');
  txt(320,184,'正确标记欺诈 '+(B.frauds||0)+' 单',10,K.GREY,'ma');
  txt(320,230,'本作为虚构同人游戏，规则仅用于本局剧情。',10,K.GREY,'ma');
  rect(233,285,407,318,K.GREEN_D);outline(233,285,407,318,K.GREEN_L);
  txt(320,296,'重新开始验收',12,K.WHITE,'ma');
};
summaryClick=function(x,y){if(inBox(x,y,[233,285,407,318])){newGame();go('news');}};
window.addEventListener('keydown',e=>{
  if(e.key.toLowerCase()==='r'&&scene==='booth')verifyNight();
  if(e.key.toLowerCase()==='f')document.getElementById('full').click();
});
// Virtual clock shares the production update/render path.
let nightOffset=0;
loop=function(ts){now=ts/1000+nightOffset;update();render();requestAnimationFrame(loop);};
window.advanceTime=function(ms){nightOffset+=ms/1000;now+=ms/1000;update();render();};
window.render_game_to_text=()=>JSON.stringify({scene,showingRoster,caseCount:CASE_COUNT,cast:MODEL_CAST.map(x=>x[1]),coordinates:'640x360; origin top-left, x right, y down',
  processed:B?.total||0,correct:B?.correct||0,entrant:B?.ent?{name:B.ent.spec.name,portrait:B.ent.spec.person,mask:B.ent.spec.contract?.mask||null,phase:B.ent.phase,verified:!!B.ent.verified,verifying:!!B.ent.verifying,fraudMarked:!!B.ent.fraudMarked}:null,
  documents:B?.docs.map(d=>({key:d.key,x:d.x,y:d.y,big:d.big,rows:d.doc.rows,marks:d.marks}))||[],
  controls:{fraud:[474,335],call:center(SPEAKER),verify:[168,275],tray:[628,222],approve:[483,220],deny:[562,220]}});

// Explain compliant differences instead of treating every different name as suspicious.
const inspectRelayBase=inspectClick;
inspectClick=function(x,y){
 inspectRelayBase(x,y);
 const I=B.insp,e=B.ent;
 if(!e||!I.on||I.banner?.bad||!e.verified)return;
 const keys=I.sel.map(s=>s.key).sort();
 if(!e.spec.contract.proof&&keys.some(k=>k?.startsWith('receipt.'))){I.banner={title:'回执未通过验证',sub:'签名无效，无法确认实际模型与输入',bad:true};return;}
 const matching=e.spec.confirmations?.find(c=>c.pairs.some(p=>JSON.stringify([...p].sort())===JSON.stringify(keys)));
 if(matching)I.banner={title:matching.title,sub:matching.sub,bad:false};
};
