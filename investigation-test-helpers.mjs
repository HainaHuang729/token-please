// Drive real field clicks; never inject investigation state into entrants.
export async function compareEvidence(page,keys){
 const points=await page.evaluate(keys=>{
  setInspect(true);const docs=[...new Set(keys.map(k=>k.split('.')[0]))].map(k=>B.docs.find(d=>d.key===k));
  if(docs.some(d=>!d))throw Error('Required comparison document missing: '+keys);
  docs.forEach((d,i)=>Object.assign(d,{big:true,x:235+i*230,y:140}));B.docs=B.docs.filter(d=>!docs.includes(d)).concat(docs);
  return keys.map(k=>{const [dk,fk]=k.split('.'),d=docs.find(d=>d.key===dk),f=d.doc.fields[fk];return [d.x+f[0]+8,d.y+f[1]+6];});
 },keys);
 for(const [x,y] of points){const b=await page.locator('canvas').boundingBox();await page.mouse.click(b.x+x*b.width/640,b.y+y*b.height/360);}
 return page.evaluate(()=>B.insp.banner);
}
export async function unlockInquiry(page){await compareEvidence(page,await page.evaluate(()=>inquiryPair(B.ent)));await page.evaluate(()=>{setInspect(false);const d=B.docs.find(d=>d.key==='dv');if(d){Object.assign(d,{big:true,x:476,y:140});B.docs=B.docs.filter(v=>v!==d).concat(d);}});}
export async function reviewSupplement(page){
 const keys=await page.evaluate(()=>{const f=B.ent.spec.followup;return f.type==='missing'?['dv.'+(f.field==='上游'?'授权':'版本'),'supplement.'+f.field]:f.type==='authorization'?['supplement.上游','log.上游']:['dv.授权','supplement.上游'];});
 await compareEvidence(page,keys);await page.evaluate(()=>{setInspect(false);const d=B.docs.find(d=>d.key==='dv');if(d){Object.assign(d,{big:true,x:476,y:140});B.docs=B.docs.filter(v=>v!==d).concat(d);}});
}
export async function collectFraudEvidence(page){
 const keys=await page.evaluate(()=>B.ent.spec.issues.filter(v=>fraudIssue(v,B.ent)).flatMap(v=>v.pairs).find(p=>p.every(k=>{const [dk,fk]=k.split('.');return B.docs.some(d=>d.key===dk&&d.doc.fields[fk]);})));
 if(!keys)throw Error('No visible fraud evidence');await compareEvidence(page,keys);await page.evaluate(()=>{setInspect(false);const d=B.docs.find(d=>d.key==='dv');if(d){Object.assign(d,{big:true,x:476,y:140});B.docs=B.docs.filter(v=>v!==d).concat(d);}});
}
