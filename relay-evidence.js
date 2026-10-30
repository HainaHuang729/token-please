'use strict';
// Fictional signed execution metadata, compared with the customer's explicit contract.
// Identity, quality and permissions are separate: these defects require return, not fraud.
const EVIDENCE_FIELDS=[
 {key:'revision',label:'版本',receiptLabel:'实版',title:'模型版本不符',rule:'版本须逐字一致，不能用旧快照顶替',equal:(a,b)=>a===b},
 {key:'cache',label:'缓存',receiptLabel:'命中',title:'缓存使用未获授权',rule:'仅当订单允许缓存时，缓存命中才可通过',equal:(a,b)=>a==='允许'||b==='未命中'},
 {key:'tools',label:'工具',receiptLabel:'执行',title:'工具执行不符',rule:'工具须全部执行且不得越权；排列先后不限',equal:(a,b)=>JSON.stringify([...new Set(a)].sort())===JSON.stringify([...new Set(b)].sort()),show:v=>v.length?v.join('/'):'无'},
 {key:'digest',label:'指纹',receiptLabel:'实纹',title:'输入内容被替换',rule:'长度相同仍须核对指纹，必须逐字一致',equal:(a,b)=>a===b},
 {key:'attachments',label:'附件',receiptLabel:'实件',title:'附件交付不符',rule:'附件编号须全部一致，顺序不限；重复件不算补齐',equal:(a,b)=>JSON.stringify([...a].sort())===JSON.stringify([...b].sort()),show:v=>v.length?v.join('/'):'无'},
 {key:'format',label:'格式',receiptLabel:'输出',title:'输出格式不符',rule:'必须满足订单指定格式，JSON 不等于纯文本',equal:(a,b)=>a===b}
];
function evidenceChecks(c){return EVIDENCE_FIELDS.filter(f=>c.evidence?.[f.key]).map(f=>{
 const {expected,actual}=c.evidence[f.key];return {...f,expected,actual,valid:f.equal(expected,actual)};
});}
const originalRelayVerdict=relayVerdict;
relayVerdict=function(c){const v=originalRelayVerdict(c);for(const f of evidenceChecks(c))if(!f.valid)v.reasons.push(f.title);v.decision=v.reasons.length?'deny':'approve';return v;};
const originalRelaySpec=relaySpec;
relaySpec=function(c,i){
 const s=originalRelaySpec(c,i),rows=[...s.docs[0].doc.rows];
 for(const f of evidenceChecks(c)){
  const show=f.show||String,pairs=[['dv.'+f.label,'receipt.'+f.receiptLabel]];
  rows.push([f.label,show(f.expected)]);s.receiptRows.push([f.receiptLabel,c.proof?show(f.actual):'无法确认']);
  if(c.proof&&!f.valid)s.issues.push({pairs,title:f.title,sub:f.rule,ask:[['C','请解释这两项记录。'],['E','按本单约定核对，这项需要重新交付。',{hold:1.3}]]});
  else if(c.proof)s.confirmations.push({pairs,title:f.label+'符合约定',sub:f.rule});
 }
 s.docs[0].doc=new Card(rows,{title:'交付订单',sub:s.contract.orderId,seal:false,valueX:42});
 return s;
};
// No extra fields in the tutorial. Later orders have at most three additional pairs.
CHAPTERS.forEach((ch,ci)=>ch.cases.forEach((c,i)=>{
 const pair=(expected,actual=expected)=>({expected,actual});
 if(ci===1)c.evidence={revision:pair('v2.10')};
 if(ci===2)c.evidence={cache:pair(i%2?'禁止':'允许',i%2?'未命中':'已命中'),tools:pair(i%2?[]:['检索'])};
 if(ci===3)c.evidence={digest:pair('A7C'+(i+1)+'9F'),attachments:pair(['A01','B02'])};
 if(ci===4)c.evidence={format:pair(i%2?'JSON':'纯文本'),cache:pair(i%2?'禁止':'允许','未命中'),tools:pair(i%2?['检索','执行']:[])};
}));
function evidencePatch(ch,i,key,actual){CHAPTERS[ch].cases[i].evidence[key].actual=actual;}
evidencePatch(1,1,'revision','v2.01'); // suffix downgrade plus transposed snapshot
evidencePatch(1,3,'revision','v2.1'); // same model, different pinned version
// Tool order is irrelevant here; collaborative model order retains its separate rule.
evidencePatch(2,0,'tools',['检索']);
evidencePatch(2,2,'tools',['检索','执行']);
evidencePatch(2,3,'cache','已命中');
evidencePatch(2,5,'tools',['检索']);
evidencePatch(3,0,'digest','A7C19E');
evidencePatch(3,1,'attachments',['A01','B20']);
evidencePatch(3,3,'attachments',['A01','A01']);
evidencePatch(3,4,'digest','A7C59E'); // exact token count and budget, wrong content
evidencePatch(4,1,'tools',['执行','检索']); // legitimate reordered tool set
evidencePatch(4,2,'format','JSON');
evidencePatch(4,3,'tools',['检索']);
evidencePatch(4,5,'cache','已命中'); // disclosed self-hosting is legal, caching is not
evidencePatch(4,6,'tools',['执行']);
evidencePatch(4,7,'format','Markdown');
CHAPTERS[1].focus='新增：核对完整型号与版本快照';
CHAPTERS[1].tips[1]='版本逐字一致；v2.10 与 v2.1 不同。';
CHAPTERS[2].focus='新增：代工授权、缓存与工具执行';
CHAPTERS[2].tips[1]='缓存须获准；工具不能漏执行或越权。';
CHAPTERS[2].tips[2]='工具排列不限；自建与角色面具不作判据。';
CHAPTERS[3].focus='新增：输入指纹、附件、转发量与扣款';
CHAPTERS[3].tips[0]='输入长度正确，也可能换了内容；核对指纹。';
CHAPTERS[3].tips[1]='附件编号须齐全；重复件不能顶替缺件。';
CHAPTERS[4].focus='新增：输出格式；综合核对全部旧规';
CHAPTERS[4].tips[0]='输出格式须一致；协作步骤仍须按序。';
CHAPTERS[4].tips[1]='单据新增字段均可比对；假签名仍须标欺诈。';
const evidenceChapterRules=setChapterRules;
setChapterRules=function(){
 evidenceChapterRules();
 const extra=[
  [1,'snapshot','版本须逐字一致','旧快照或近似版本号不能顶替'],
  [2,'execution','缓存与工具须获授权','工具全部执行，不得越权；工具顺序不限'],
  [3,'material','指纹及附件须匹配','指纹逐字一致；附件齐全且不能重复替代'],
  [4,'format','输出格式须一致','新增字段异常退回；不因此单独标欺诈']
 ];
 for(const [ch,key,head,sub] of extra)if(chapterIndex>=ch)RULES.push({day:1,page:1,key,isNew:chapterIndex===ch,head:'§ '+head,subs:[sub]});
};
setChapterRules();
