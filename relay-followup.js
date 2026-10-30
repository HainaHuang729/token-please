'use strict';
// Authored cases: information is disclosed only after an explicit question.
// Tutorial: one substituted model and one legitimate supplier both arrive with a missing execution page.
for(const i of [1,2]){const c=CHAPTERS[0].cases[i];c.followup={type:'missing',field:'上游',value:c.route.join('/'),signed:true};}
// Chapter two adds an exact-version page, again with legal and illegal controls.
for(const i of [0,3]){const c=CHAPTERS[1].cases[i];c.followup={type:'missing',field:'实版',value:c.evidence.revision.actual,signed:true};}
Object.assign(CHAPTERS[2].cases[0],{allowed:['GPT'],auth:'GPT / 待补件',followup:{type:'authorization',model:'Qwen',signed:true}});
Object.assign(CHAPTERS[2].cases[4],{auth:'GPT / 待补件',followup:{type:'authorization',model:'Qwen',signed:true,orderId:'R-204'}});
Object.assign(CHAPTERS[3].cases[2],{followup:{type:'retry',model:'Kimi',signed:true}});
Object.assign(CHAPTERS[3].cases[6],{delivered:32,followup:{type:'retry',model:'DeepSeek',signed:true}});
const followupVerdict=relayVerdict;
function authorizedSupplement(c){return c.followup?.type==='authorization'&&c.followup.signed&&(!c.followup.orderId||c.followup.orderId===c.orderId);}
relayVerdict=function(c){
 const f=c.followup;
 const v=followupVerdict(authorizedSupplement(c)?{...c,allowed:[...c.allowed,f.model]}:c);
 if(f?.type==='authorization'&&!authorizedSupplement(c))v.reasons.push('补充授权不属于本单或签名无效');
 if(f?.type==='retry'&&(!f.signed||!c.allowed.includes(f.model))){v.reasons.push(!f.signed?'备用日志签名无效':'备用线路使用未授权模型');v.fraud=true;}
 v.decision=v.reasons.length?'deny':'approve';return v;
};
const followupSpec=relaySpec;
relaySpec=function(c,i){
 const s=followupSpec(c,i),f=c.followup;if(!f)return s;
 s.followup=f;
 if(f.type==='missing'){
  const row=s.receiptRows.find(r=>r[0]===f.field);row[1]='缺页 / 待补';
  s.reply=s.receiptLine='咦，打印少了一页。你问我拿。';
  for(const list of [s.issues,s.confirmations])for(const entry of list)entry.pairs=entry.pairs.map(pair=>pair.map(k=>k==='receipt.'+f.field?'supplement.'+f.field:k));
  const orderField=f.field==='上游'?'授权':'版本';
  s.deliveryTopics=s.deliveryTopics.map(t=>t.other===f.field?{...t,doc:'supplement'}:t);
  s.confirmations.push({pairs:[['dv.'+orderField,'receipt.'+f.field]],title:'执行页尚未补齐',sub:'点击「问缺页」，取得记录后再比较'});
 }

 if(f.type==='retry')s.docs[0].doc=new Card([...s.docs[0].doc.rows,['重试','已登记 / 待补']],{title:'交付订单',sub:s.contract.orderId,seal:false,valueX:42});
 if(f.type==='authorization'){
  // The original order is intentionally insufficient; the amendment is separate evidence.
  const pairIsModel=p=>p.some(k=>k==='dv.授权'||k==='dv.模型')&&p.some(k=>k.endsWith('.上游'));
  for(const list of [s.issues,s.confirmations])for(let j=list.length-1;j>=0;j--){list[j].pairs=list[j].pairs.filter(p=>!pairIsModel(p));if(!list[j].pairs.length)list.splice(j,1);}
  s.confirmations.push({pairs:[['dv.授权','log.上游'],['dv.模型','log.上游']],title:'补充授权尚待核查',sub:'点击「问补件」，取得本单授权后再判断'});
 }
 return s;
};
const followupAsk=askDelivery;
askDelivery=function(){
 const e=B.ent,f=e?.spec.followup;if(!f||e.supplementReady){followupAsk();return;}
 if(e.phase!=='here'||!e.handed||B.cut||B.event)return;
 if(e.supplementLoading){flash('补充材料正在打印，请稍等');return;}
 if(now<e.busyUntil){flash('等对方说完，再问补充材料');return;}
 if(!e.verified||(e.spec.needsLog&&!e.logVerified)){flash(e.spec.needsLog?'先取得回执和上游日志，再追问补充材料':'先调回执，查看哪一页缺失');return;}
 setInspect(false);e.supplementLoading=true;
 const auth=f.type==='authorization',missing=f.type==='missing',id=f.orderId||e.spec.contract.orderId;
 runSteps([['C',missing?(f.field==='上游'?'执行页呢？实际是谁接的单？':'版本那页没了，能补原件吗？'):auth?'你说有补充授权，原件呢？':'这单重试过吗？备用记录呢？',{hold:.8}],['E',missing?'我找到了，给你补上。':auth?'在包里，我以为夹进去了。':'重试过一次。我把那份也调来。',{hold:1.5}]]);
 const doc=new Card([['编号',id],[missing?f.field:'上游',missing?f.value:f.model],['签名',f.signed?'有效':'无效'],['用途',missing?'补齐执行缺页':auth?'追加模型授权':'最终交付线路']],{title:missing?'执行记录补页':auth?'补充授权书':'备用线路日志',sub:'EXTRA',seal:false,valueX:42});
 // Reveal only after the answer, and guard both queued and in-flight printing.
 later(1,()=>{if(B.ent!==e)return;printDoc(doc,.8,'supplement',()=>{
  if(B.ent!==e){B.docs=B.docs.filter(d=>d.doc!==doc);return;}
  e.supplementReady=true;e.supplementLoading=false;
  const d=B.docs.find(d=>d.doc===doc);Object.assign(d,{x:320,y:180});
  const order=B.docs.find(d=>d.key==='dv');if(order?.big)Object.assign(order,{x:476,y:140});
  const s=e.spec,c=s.contract;
  const add=(pairs,bad,title,sub)=>{const v={pairs,title,sub};if(bad)v.ask=[['C','这份补件也对不上。',{hold:1}],['E',auth?'拿错了，这份不能算你的授权。':'切了备用线路，却没问客户。',{hold:1.5}]];(bad?s.issues:s.confirmations).push(v);};
  add([['dv.编号','supplement.编号']],id!==c.orderId,'补件'+(id===c.orderId?'属于本单':'不属于本单'),'编号必须一致，真签名不能替别单授权');
  add([['supplement.签名']],!f.signed,f.signed?'补件签名有效':'补件签名无效','仍须核对编号和授权范围');
  if(auth){
   const approved=authorizedSupplement(c)&&f.model===c.route[0];
   s.confirmations=s.confirmations.filter(v=>v.title!=='补充授权尚待核查');
   add([['supplement.上游','log.上游'],['dv.授权','log.上游'],['dv.模型','log.上游']],!approved,approved?'代工获补充授权':'代工未获本单授权','补件须属于本单、签名有效，并覆盖实际模型');
  }else if(!missing)add([['dv.授权','supplement.上游'],['dv.模型','supplement.上游']],!c.allowed.includes(f.model),'备用线路'+(c.allowed.includes(f.model)?'在授权内':'未获授权'),'最终交付也须符合订单授权，不能只看首次调用');
  notice('补充材料已送达','核对编号、签名与实际模型',UI.cyan);
 });});
};
const followupButtons=drawButtons;
drawButtons=function(){followupButtons();const e=B.ent;if(e?.spec.followup&&!e.supplementReady&&e.handed&&e.phase==='here'&&!B.insp.on)uiButton(DELIVERY_ASK,e.supplementLoading?'调取中':e.spec.followup.type==='missing'?'问缺页':e.spec.followup.type==='authorization'?'问补件':'问重试',true,UI.red);};
const followupHint=hintText;
hintText=function(){const e=B.ent;if(e?.spec.followup&&!e.supplementReady&&e.verified&&(!e.spec.needsLog||e.logVerified))return e.supplementLoading?'补充材料正在送达':e.spec.followup.type==='missing'?'回执有缺页：点窗口「问缺页」，补齐后再核对':e.spec.followup.type==='authorization'?'原单提到补件：点「问补件」，索取补充授权':'本单有重试登记：点「问重试」，索取备用日志';return followupHint();};
const followupJudge=judge;
judge=function(e,dec){if(e.spec.followup&&e.verified&&(!e.spec.needsLog||e.logVerified)&&!e.supplementReady){B.total++;S.stats[dec]=(S.stats[dec]||0)+1;S.stats.wrong++;cite(['验收处理错误','未询问并取得本单补充材料，不能完成验收']);return;}followupJudge(e,dec);};
const followupNext=callNext;
callNext=function(){if(!B.ent)B.docs=B.docs.filter(d=>d.key!=='supplement');followupNext();};
const followupRules=setChapterRules;
setChapterRules=function(){followupRules();RULES.find(r=>r.key==='proof').subs.push('回执缺页：询问补齐，不能只凭口头说明');if(chapterIndex>=2)RULES.push({day:1,page:2,key:'supplement',head:'§ 补件与备用线路',subs:['提示有补件：询问后才能完成验收','补充授权须同单、签名有效、模型相符','重试须查看最终线路；未授权换牌标欺诈']});};
setChapterRules();
CHAPTERS[0].tips[2]='回执缺页时点「问缺页」；补齐后再核对模型。';
CHAPTERS[1].tips[2]='版本页缺失须询问补齐；有缺页不代表有欺诈。';
CHAPTERS[2].tips[2]='提示补件时须询问；授权核对编号、签名、模型。';
CHAPTERS[3].tips[2]='重试须询问备用日志，最终模型也要在授权内。';
const followupText=window.render_game_to_text;
window.render_game_to_text=()=>{const state=JSON.parse(followupText());if(B?.ent?.spec.followup)state.followup={type:B.ent.spec.followup.type,loading:!!B.ent.supplementLoading,ready:!!B.ent.supplementReady};return JSON.stringify(state);};
