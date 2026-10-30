'use strict';
// Testimony points to evidence; only existing document comparisons decide validity.
const DELIVERY_ASK=[160,106,210,122];
const DELIVERY_TOPICS=[
 {field:'编号',other:'回执',doc:'receipt',line:'我把这单的回执夹进来了。'},
 {field:'授权',other:'上游',doc:'actual',line:'谁接的这单，你查执行记录吧。'},
 {field:'输入',other:'转发',doc:'receipt',line:'材料我交了，你看看收齐没。'},
 {field:'预算',other:'扣款',doc:'receipt',line:'钱是中转站扣的，我也想对账。'},
 {field:'版本',other:'实版',doc:'actual',line:'版本号太像了，我怕拿错包。'},
 {field:'缓存',other:'命中',doc:'actual',line:'这次有没有用旧答案？查记录吧。'},
 {field:'工具',other:'执行',doc:'actual',line:'工具跑没跑，日志里应该有。'},
 {field:'指纹',other:'实纹',doc:'actual',line:'文件一样长，不一定是同一份。'},
 {field:'附件',other:'实件',doc:'actual',line:'附件名字像，你帮我对下编号。'},
 {field:'格式',other:'输出',doc:'actual',line:'能打开不算完，还得看格式。'}
];
const ISSUE_REPLIES={
 '回执不属于本单':'啊，夹错了。真签名也不能顶用。',
 '回执无法验证':'这张查不到？那我得回去问清楚。',
 '交付模型不符':'我以为能顶班，没看这单授权。',
 '协作顺序不符':'人都到了，没想到顺序排错了。',
 '输入被截断':'少的那段不能当没事，我去补。',
 '收费超出预算':'这笔我没报过，得找中转站退。',
 '模型版本不符':'我当成同一个版本了。得重跑。',
 '缓存使用未获授权':'省了一次调用，却没问你同意。',
 '工具执行不符':'光写做过没用，得把执行补上。',
 '输入内容被替换':'长度对也没用，文件拿错了。',
 '附件交付不符':'原来夹错附件了，我回去找。',
 '输出格式不符':'我顾着内容了，格式得重交。',
 '回执与日志不一致':'回执是照订单填的，没对日志。',
 '日志无法验证':'来源都查不到，这份不能算。'
};
const dialogueSpec=relaySpec;
relaySpec=function(c,i){
 const s=dialogueSpec(c,i);
 s.deliveryTopics=DELIVERY_TOPICS.filter(t=>s.docs[0].doc.rows.some(r=>r[0]===t.field));
 for(const issue of s.issues){
 let reply=ISSUE_REPLIES[issue.title]||'你指出来的这项，我带回去核对。';
 if(issue.title==='工具执行不符'){
  const tools=c.evidence?.tools;
  reply=tools?.actual.some(t=>!tools.expected.includes(t))?'多跑的工具没授权，这次越界了。':'工具没跑齐，我回去补执行。';
 }
 issue.ask=[['C','这两项对不上，你再看看。',{hold:1.1}],['E',reply,{hold:1.6}]];
 }
 return s;
};
function askDelivery(){
 const e=B.ent;if(!e||e.phase!=='here'||!e.handed||B.cut||B.event)return;
 if(now<e.busyUntil){flash('等对方说完，再问下一项');return;}
 const topics=e.spec.deliveryTopics;if(!topics?.length)return;
 const topic=topics[(e.deliveryAsked||0)%topics.length];e.deliveryAsked=(e.deliveryAsked||0)+1;
 const doc=topic.doc==='actual'?(e.spec.needsLog?'log':'receipt'):topic.doc;
 e.testimonies=e.testimonies||{};e.testimonies[topic.line]={...topic,doc};
 setInspect(false);
 runSteps([['C','这单的'+topic.field+'，说说吧。',{hold:.8}],['E',topic.line,{hold:1.5}]]);
 flash('比对模式点这句说明，可定位核查字段');
}
const dialogueInput=boothInput;
boothInput=function(x,y){if(!B.insp.on&&inBox(x,y,DELIVERY_ASK)){askDelivery();return;}dialogueInput(x,y);};
const dialogueButtons=drawButtons;
drawButtons=function(){dialogueButtons();if(B.ent?.handed&&B.ent.phase==='here'&&!B.insp.on)uiButton(DELIVERY_ASK,'问交付',true,UI.navy);};
const dialogueInspect=inspectClick;
inspectClick=function(x,y){
 const e=B.ent,hit=fieldAt(x,y),topic=hit?.key==='say'&&e?.testimonies?.[hit.ln.text];
 if(!topic){dialogueInspect(x,y);return;}
 const target=B.docs.find(d=>d.key===topic.doc);
 if(!target){flash(topic.doc==='log'?'这句要查上游日志，先调日志':'这句要查计费回执，先调回执');return;}
 const order=B.docs.find(d=>d.key==='dv');if(!order||order.returned)return;
 Object.assign(order,{big:true,x:476,y:140});Object.assign(target,{big:true,x:240,y:131});
 B.docs=B.docs.filter(d=>d!==order&&d!==target).concat([order,target]);
 const f=order.doc.fields[topic.field];
 B.insp.banner=null;B.insp.sel=[{key:'dv.'+topic.field,d:order,box:()=>[order.x+f[0],order.y+f[1],order.x+f[2],order.y+f[3]]}];
 flash('已选订单「'+topic.field+'」，再点记录「'+topic.other+'」');
};
const dialogueText=window.render_game_to_text;
window.render_game_to_text=()=>JSON.stringify({...JSON.parse(dialogueText()),deliveryDialogue:B?.ent?{asked:B.ent.deliveryAsked||0,testimonies:B.ent.testimonies||{},button:DELIVERY_ASK}:null});
