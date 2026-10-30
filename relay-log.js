'use strict';
// The relay's billing claims and the independently retrieved execution record are separate.
const LOG_BTN=[174,267,218,283];
CHAPTERS.forEach((ch,ci)=>ch.cases.forEach(c=>{if(ci>=2)c.needsLog=true;}));
CHAPTERS[2].cases[2].reported={route:['Claude'],tools:['检索']};
CHAPTERS[3].cases[4].reported={digest:CHAPTERS[3].cases[4].evidence.digest.expected};
CHAPTERS[4].cases[3].reported={tools:['检索','执行']};
CHAPTERS[2].focus='新增：单独调取上游日志，三份材料交叉核对';
CHAPTERS[2].tips[0]='先调回执，再点调日志；两份都到齐才能验收。';
CHAPTERS[2].tips[1]='回执是中转声明，执行日志才是上游实际记录。';
CHAPTERS[3].tips[2]='订单、回执看似相符，也须对照日志指纹。';
const logClaimEqual=(f,a,b)=>['tools','attachments'].includes(f.key)?f.equal(a,b):a===b;
const logVerdict=relayVerdict;
relayVerdict=function(c){const v=logVerdict(c);if(c.needsLog&&c.reported){
 const mismatch=(c.reported.route&&JSON.stringify(c.reported.route)!==JSON.stringify(c.route))||evidenceChecks(c).some(f=>Object.hasOwn(c.reported,f.key)&&!logClaimEqual(f,c.reported[f.key],f.actual));
 if(mismatch){v.reasons.push('中转回执与上游日志不一致');v.decision='deny';}
}return v;};
const logSpec=relaySpec;
relaySpec=function(c,i){
 const s=logSpec(c,i);if(!c.needsLog)return s;
 const route=v=>v.map(m=>m==='DeepSeek'?'DS':m).join('/');
 const claims=c.reported||{};
 s.needsLog=true;
 s.logRows=[['编号',s.contract.orderId],['上游',c.proof?route(c.route):'无法确认'],...evidenceChecks(c).map(f=>[f.receiptLabel,c.proof?(f.show||String)(f.actual):'无法确认']),['签名',c.proof?'有效':'无效']];
 // Comparisons concerning actual execution now point to the independently fetched log.
 const actualKeys=new Set(['上游',...evidenceChecks(c).map(f=>f.receiptLabel)]);
 for(const group of [s.issues,s.confirmations])for(const item of group)item.pairs=item.pairs.map(pair=>pair.map(key=>key.startsWith('receipt.')&&actualKeys.has(key.slice(8))?'log.'+key.slice(8):key));
 const add=(field,bad,title,sub)=>{
  const entry={pairs:[['receipt.'+field,'log.'+field]],title,sub};
  if(bad)entry.ask=[['C','回执与上游日志为什么不同？'],['E','需要按真实执行记录重开回执，并检查交付。',{hold:1.3}]];
  (bad?s.issues:s.confirmations).push(entry);
 };
 if(c.proof){
  s.confirmations.push({pairs:[['dv.编号','log.编号']],title:'日志属于本单',sub:'仍须检查签名与具体执行记录'},{pairs:[['log.签名']],title:'日志签名有效',sub:'签名只证明记录来源，不代表合同履行正确'});
  for(const row of s.receiptRows){
   const field=row[0];if(!actualKeys.has(field))continue;
   const f=evidenceChecks(c).find(f=>f.receiptLabel===field);
   if(field==='上游'&&claims.route)row[1]=route(claims.route);
   else if(f&&Object.hasOwn(claims,f.key))row[1]=(f.show||String)(claims[f.key]);
   const actual=s.logRows.find(r=>r[0]===field)[1],bad=f&&Object.hasOwn(claims,f.key)?!logClaimEqual(f,claims[f.key],f.actual):row[1]!==actual;
   add(field,bad,bad?'回执与日志不一致':field+'记录一致','中转声明与上游实际记录逐项核对');
  }
 }else s.issues.push({pairs:[['log.签名']],title:'日志无法验证',sub:'签名无效，不能采信执行明细'});
 return s;
};
function retrieveLog(){
 const e=B.ent;if(!e||!e.spec.needsLog||e.phase!=='here'||!e.handed)return;
 if(!e.verified){flash('先取得回执，再按本单编号调取日志');return;}
 if(e.logVerified||e.logLoading)return;
 e.logLoading=true;
 const doc=new Card(e.spec.logRows,{title:'上游执行日志',sub:'TRACE',seal:false,valueX:42});
 printDoc(doc,.8,'log',()=>{
  if(B.ent!==e){B.docs=B.docs.filter(d=>d.doc!==doc);return;}
  const d=B.docs.find(d=>d.doc===doc);if(d){d.x=320;d.y=180;}
  const order=B.docs.find(d=>d.key==='dv');if(order?.big){order.x=476;order.y=140;}
  e.logLoading=false;e.logVerified=true;notice('日志已送达','可拖开文件，交叉比对三份材料',UI.cyan);
 });
}
const logInput=boothInput;
boothInput=function(x,y){if(B.ent?.spec.needsLog&&inBox(x,y,LOG_BTN)){retrieveLog();return;}logInput(x,y);};
const logButtons=drawButtons;
drawButtons=function(){logButtons();const e=B.ent;if(!e?.spec.needsLog)return;
 uiButton([126,267,172,283],e.verified?'回执到':e.verifying?'调取中':'调回执',true,e.verified?UI.green:UI.cyan);
 uiButton(LOG_BTN,e.logVerified?'日志到':e.logLoading?'调取中':'调日志',true,e.logVerified?UI.green:UI.lavender);
};
const logHint=hintText;
hintText=function(){const e=B.ent;if(e?.spec.needsLog&&e.verified&&!e.logVerified)return e.logLoading?'正在调取上游执行日志':'点「调日志」，取得第三份材料后交叉比对';return e?.spec.needsLog?logHint().replace('两份材料','三份材料'):logHint();};
const logJudge=judge;
judge=function(e,dec){if(e.verified&&e.spec.needsLog&&!e.logVerified){B.total++;S.stats[dec]=(S.stats[dec]||0)+1;S.stats.wrong++;cite(['验收处理错误','未取得上游执行日志，不能完成验收']);return;}logJudge(e,dec);};
const logCall=callNext;
callNext=function(){if(!B.ent)B.docs=B.docs.filter(d=>d.key!=='log');logCall();};
const logInspect=inspectClick;
inspectClick=function(x,y){logInspect(x,y);const e=B.ent;if(!e)return;const keys=B.insp.sel.map(s=>s.key);
 if(!e.spec.contract.proof&&keys.some(k=>k?.startsWith('log.')))B.insp.banner={title:'日志无法验证',sub:'签名无效，不能采信执行明细',bad:true};
};
const logRules=setChapterRules;
setChapterRules=function(){logRules();if(chapterIndex>=2){const r=RULES.find(r=>r.key==='execution');r.subs.push('回执与日志都须调取，声明须与日志一致');}};
setChapterRules();
const logText=window.render_game_to_text;
window.render_game_to_text=()=>{const s=JSON.parse(logText());if(s.entrant)Object.assign(s.entrant,{needsLog:!!B.ent.spec.needsLog,logVerified:!!B.ent.logVerified,logLoading:!!B.ent.logLoading});s.controls.log=[196,275];return JSON.stringify(s);};
