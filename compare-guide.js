'use strict';
// Field-location guidance only: selection never depends on the case verdict.
const GUIDE_SPREAD=[582,104,635,123];
function compareGuideEnabled(){return chapterIndex<4||(typeof CHANGED_ORDER_TEST!=='undefined'&&CHANGED_ORDER_TEST)||!!B.insp.userGuide;}
function defaultGuidePair(e){
 if(!e)return ['dv.编号','receipt.回执'];
 const f=e.spec.followup;
 if(f&&!e.supplementReady)return inquiryPair(e);
 if(f&&!e.supplementReviewed)return f.type==='missing'?['dv.'+(f.field==='上游'?'授权':'版本'),'supplement.'+f.field]:f.type==='authorization'?['supplement.上游','log.上游']:['dv.授权','supplement.上游'];
 return ['dv.编号','receipt.回执'];
}
function guideField(key){const [dk,fk]=key.split('.'),d=B.docs.find(v=>v.key===dk);return d?.doc.fields[fk]?{d,field:fk,box:[d.x+d.doc.fields[fk][0],d.y+d.doc.fields[fk][1],d.x+d.doc.fields[fk][2],d.y+d.doc.fields[fk][3]]}:null;}
function guideLabel(key){const [dk,fk]=key.split('.'),names={dv:'订单',receipt:'回执',log:'上游日志',supplement:B.ent?.spec.followup?.type==='authorization'?'补充授权':B.ent?.spec.followup?.type==='retry'?'备用日志':'执行补页'};return (names[dk]||dk)+'「'+fk+'」';}
function currentGuidePair(){return B.insp.guidePair||defaultGuidePair(B.ent);}
function spreadGuideDocuments(){
 const pair=currentGuidePair(),docs=[...new Set(pair.map(k=>guideField(k)?.d))];
 if(docs.some(d=>!d))return;
 docs.forEach((d,i)=>Object.assign(d,{big:true,x:235+i*230,y:140}));
 B.docs=B.docs.filter(d=>!docs.includes(d)).concat(docs);
}
const guideSetInspect=setInspect;
setInspect=function(on){guideSetInspect(on);if(on){B.insp.guidePair=defaultGuidePair(B.ent);if(compareGuideEnabled())spreadGuideDocuments();}};
const guideInspect=inspectClick;
inspectClick=function(x,y){
 if(!B.insp.banner&&inBox(x,y,GUIDE_SPREAD)){B.insp.userGuide=true;spreadGuideDocuments();return;}
 if(!B.insp.banner)for(const key of currentGuidePair()){
  const f=guideField(key);if(!f?.d.big)continue;
  const b=f.box,cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2;
  if(inBox(x,y,[b[0]-15,b[1],b[0]-3,b[1]+12])&&fieldAt(cx,cy)?.d===f.d){x=cx;y=cy;break;}
 }
 guideInspect(x,y);
 const I=B.insp,e=B.ent;if(!I.on||!e||I.banner||I.sel.length!==1)return;
 const first=I.sel[0].key;if(first==='say')return;
 const current=currentGuidePair();if(current.includes(first))return;
 // Both compliant and discrepant comparison definitions contribute equally.
 const pairs=[...e.spec.issues,...(e.spec.confirmations||[])].flatMap(v=>v.pairs).filter(p=>p.includes(first));
 const canonical=[...pairs].sort((a,b)=>a.join('|').localeCompare(b.join('|')));
 const pair=canonical.find(p=>p.every(k=>guideField(k)))||canonical[0];
 I.guidePair=pair||[first];
};
function guideState(){
 const pair=currentGuidePair(),selected=B.insp.sel.map(s=>s.key),missing=pair.filter(k=>!guideField(k));
 const next=pair.find(k=>!selected.includes(k));
 return {pair,selected,next,missing};
}
function drawCompareGuide(){
 const I=B.insp,s=guideState();
 rect(229,102,638,125,UI.navy);
 if(!compareGuideEnabled()){txt(236,109,'自主核查：选择两处字段；需要时打开提示',8,UI.white);uiButton(GUIDE_SPREAD,'显示提示',true,UI.navy);return;}
 if(s.missing.length){
  const dk=s.missing[0].split('.')[0],msg=dk==='receipt'?'先点「调取回执」，拿到记录再比对':dk==='log'?'先调回执，再点「调日志」':dk==='supplement'?'先比对原始疑点，再点「询问」取得补页':'先接单，等待对方交来订单';
  txt(236,105,'材料还没齐',8,UI.amber);txt(236,115,msg,8,UI.white);return;
 }
 const first=s.selected[0]||s.pair[0],second=s.pair.find(k=>k!==first);
 txt(236,104,(s.selected.length?'已选：':'① 先点 ')+guideLabel(first),8,UI.white);
 txt(236,115,second?'② 再点 '+guideLabel(second):'未找到对应项，请改选编号、授权等字段',8,UI.amber);
 uiButton(GUIDE_SPREAD,'摆开材料',true,UI.navy);
 for(const [i,key] of s.pair.entries()){
  const f=guideField(key);if(!f?.d.big)continue;
  const box=f.box;
  // Never draw through another sheet: use the spread control to expose hidden rows.
  const top=fieldAt((box[0]+box[2])/2,(box[1]+box[3])/2);if(top?.d!==f.d)continue;
  const chosen=s.selected.includes(key),color=chosen?UI.cyan:UI.amber;
  outline(box[0]-2,box[1]-1,box[2]+2,box[3]+1,color,2);
  rect(box[0]-15,box[1],box[0]-3,box[1]+12,color);
  txt(box[0]-9,box[1]+2,String(s.selected.length?(key===s.selected[0]?1:2):i+1),8,UI.deep,'ma');
 }
}
const guideText=window.render_game_to_text;
window.render_game_to_text=()=>JSON.stringify({...JSON.parse(guideText()),comparisonGuide:B?.insp.on&&!B.insp.banner?guideState():null});
