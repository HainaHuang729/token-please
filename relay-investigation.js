'use strict';
// Comparison establishes an inquiry lead and keeps the evidence used for a fraud finding.
function inquiryPair(e){
 const f=e.spec.followup;if(!f)return null;
 return f.type==='missing'?['dv.'+(f.field==='上游'?'授权':'版本'),'receipt.'+f.field]:f.type==='authorization'?['dv.授权','log.上游']:['dv.重试','log.线路'];
}
function sameEvidence(a,b){return a.length===b.length&&[...a].sort().join('|')===[...b].sort().join('|');}
function fraudIssue(issue,e){
 if(!e.spec.fraud)return false;
 return ['交付模型不符','回执无法验证','日志无法验证','代工未获本单授权','备用线路未获授权','备用日志签名无效','补件签名无效'].includes(issue.title);
}
const investigationSpec=relaySpec;
relaySpec=function(c,i){const s=investigationSpec(c,i);if(c.followup?.type==='retry')s.logRows.push(['线路','首次调用']);return s;};
const investigationAsk=askDelivery;
askDelivery=function(){const e=B.ent;if(e?.spec.followup&&!e.supplementReady&&!e.inquiryUnlocked){
 if(e.phase!=='here'||!e.handed)return;
 setInspect(true);flash('先比对相关记录，指出疑点后才能追问');return;
}investigationAsk();};
const investigationInspect=inspectClick;
inspectClick=function(x,y){
 const e=B.ent;
 if(B.insp.banner?.inquiry&&inBox(x,y,ASK_BTN)){askDelivery();return;}
 investigationInspect(x,y);
 if(!e||B.ent!==e||!B.insp.on||!e.verified)return;
 const keys=B.insp.sel.map(s=>s.key),f=e.spec.followup;
 const present=keys.length&&keys.every(k=>{const [dk,fk]=k.split('.');return B.docs.some(d=>d.key===dk&&d.doc.fields[fk]);});
 if(!present)return;
 const lead=inquiryPair(e);
 const leads=lead?[lead,...(lead[0]==='dv.授权'?[[lead[0].replace('授权','模型'),lead[1]]]:[])]:[];
 if(f&&!e.supplementReady&&leads.some(pair=>sameEvidence(keys,pair))){
  e.inquiryUnlocked=true;
  B.insp.banner={title:'已发现待查疑点',sub:f.type==='missing'?'执行记录缺页，向交付方索取原件':f.type==='authorization'?'原单授权与实际模型不同，追问补充授权':'登记有重试，现有日志仅覆盖首次调用',bad:false,ask:true,inquiry:true};
  return;
 }
 const issue=e.spec.issues.find(v=>v.pairs.some(p=>sameEvidence(p,keys)));
 if(issue&&B.insp.banner?.bad&&fraudIssue(issue,e)){
  e.fraudEvidence={title:issue.title,fields:[...keys]};
  B.insp.banner.sub='已留存欺诈证据；可标记欺诈并退回';
 }
 if(f&&e.supplementReady){
  const finalPair=f.type==='missing'?['dv.'+(f.field==='上游'?'授权':'版本'),'supplement.'+f.field]:f.type==='authorization'?['supplement.上游','log.上游']:['dv.授权','supplement.上游'];
  const finalPairs=[finalPair,...(finalPair[0]==='dv.授权'?[['dv.模型',finalPair[1]]]:[])];
  if(finalPairs.some(pair=>sameEvidence(keys,pair))&&B.insp.banner)e.supplementReviewed=true;
 }
};
const investigationFraud=toggleFraud;
toggleFraud=function(){const e=B.ent;if(e&&!e.fraudMarked&&!e.fraudEvidence){flash('先用比对指出假签名或未授权换牌的证据');return;}investigationFraud();};
const investigationJudge=judge;
judge=function(e,dec){
 const error=e.fraudMarked&&!e.fraudEvidence?'标记欺诈前，须比对并指出相关证据':e.spec.followup&&e.supplementReady&&!e.supplementReviewed?'取得补件后，须比对实际模型或版本再验收':null;
 if(error){B.total++;S.stats[dec]=(S.stats[dec]||0)+1;S.stats.wrong++;cite(['验收处理错误',error]);return;}
 investigationJudge(e,dec);
};
const investigationHint=hintText;
hintText=function(){const e=B.ent,f=e?.spec.followup;if(f&&e.verified&&(!e.spec.needsLog||e.logVerified)){
 if(!e.inquiryUnlocked)return f.type==='missing'?'比对订单'+(f.field==='上游'?'授权':'版本')+'与回执'+f.field+'，查明缺页':f.type==='authorization'?'比对订单授权与日志上游，再追问授权补件':'比对订单重试与日志线路，再追问备用记录';
 if(e.supplementReady&&!e.supplementReviewed)return f.type==='authorization'?'比对补充授权上游与日志上游，查清是否获准':'比对订单与补页中的'+(f.field||'上游')+'，完成调查';
 }return investigationHint();};
const investigationButtons=drawButtons;
drawButtons=function(){investigationButtons();const e=B.ent;if(e?.spec.followup&&!e.inquiryUnlocked&&e.handed&&e.phase==='here'&&!B.insp.on)uiButton(DELIVERY_ASK,'找疑点',true,UI.navy);};
const investigationRules=setChapterRules;
setChapterRules=function(){investigationRules();RULES.find(r=>r.key==='proof').subs.push('先比对缺项，再询问；补页仍须比对');const fraud=RULES.find(r=>r.key==='model');fraud.subs.push('标欺诈前须用比对指出相关证据');};
setChapterRules();
CHAPTERS[0].tips[2]='比对缺页解锁询问，补齐后再比对模型。';
CHAPTERS[1].tips[2]='比对版本缺页再追问；补页须核对完整版本。';
CHAPTERS[2].tips[2]='先比对原单授权与日志上游，再追问补件。';
CHAPTERS[3].tips[2]='比对重试登记与首次线路，追问备用日志。';
const investigationText=window.render_game_to_text;
window.render_game_to_text=()=>JSON.stringify({...JSON.parse(investigationText()),investigation:B?.ent?{inquiryUnlocked:!!B.ent.inquiryUnlocked,supplementReviewed:!!B.ent.supplementReviewed,fraudEvidence:B.ent.fraudEvidence||null}:null});
