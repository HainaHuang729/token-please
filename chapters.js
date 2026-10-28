'use strict';
// Each chapter introduces a small number of suppliers and one inspection concept.
const copyCase=(i,patch={})=>({...RELAY_CASES[i],...patch});
const originalCase=(i,patch={})=>copyCase(i,{model:RELAY_CASES[i].name,allowed:[RELAY_CASES[i].name],auth:'仅限原装',route:[RELAY_CASES[i].name],proof:true,context:32,delivered:32,budget:8,charge:6,sequence:undefined,line:'这次按原装订单交付，请核对记录。',reply:'人物还是我，订单请重新检查。',...patch});
const CHAPTERS=[
 {name:'第一章 · 第一班岗',focus:'新增：核验编号、签名与模型授权',story:'试营业第一晚，先接待三位交付方。',tips:['每单调回执，检查实际模型是否获授权。','偷偷跨品牌换模型：标记欺诈并退回。','其余字段本章均合规，先练熟盖章归还。'],cases:[copyCase(0),copyCase(1),originalCase(9),originalCase(1,{line:'又见面了。这次订单写的就是 DeepSeek。'})]},
 {name:'第二章 · 同名不同款',focus:'新增：同品牌也不能擅自降级',story:'订单变多了，Gemini 和 GLM 加入交付队列。',tips:['沿用上章规则，每单必须核验。','旗舰换成轻量版也违规，但不标跨牌欺诈。','名字相同不代表型号相同，核对完整型号。'],cases:[copyCase(3),copyCase(2),copyCase(0),copyCase(2,{route:['GLM 旗舰'],line:'轻量版已撤回，这次补上旗舰调用。',reply:'同一个型号已重新交付。'}),originalCase(9)]},
 {name:'第三章 · 合法的代班',focus:'新增：以授权范围验收代工与自建',story:'自动路由上线，Qwen 与 Meta 来报到。',tips:['允许的替代模型可以通过，不标欺诈。','自建服务已披露且获授权，也可通过。','看授权而不是看脸；同一人可能换一份订单。'],cases:[copyCase(4),copyCase(6),copyCase(1),originalCase(1),copyCase(4,{allowed:['GPT'],auth:'禁止代工',line:'还是我来做，但这单没勾选自动路由。',reply:'上一单的授权不能沿用到这一单。'}),copyCase(3)]},
 {name:'第四章 · 少传与多收',focus:'新增：输入不可截断，扣款不得超预算',story:'长文本订单上线，Kimi 和 MiniMax 加入。',tips:['输入与转发对照，少传材料就退回。','预算与扣款对照，超收也要退回整改。','缩水和超收本身不标欺诈，其他旧规继续。'],cases:[copyCase(7),copyCase(8),copyCase(7,{delivered:128,line:'材料补齐了，请查这次的转发数量。',reply:'这一次完整转发了 128K。'}),copyCase(4),copyCase(8,{charge:4,line:'额外费用已撤销，这次只扣 4 token。',reply:'请核对新回执上的实际扣款。'}),copyCase(2),copyCase(0)]},
 {name:'第五章 · 最后一跳',focus:'新增：协作必须完整且按约定顺序',story:'Grok 带来新回执，协作订单也接入中转站。',tips:['协作名单相同还不够，步骤和顺序也要一致。','签名无效不能采信，标记欺诈并退回。','所有旧规继续生效，完成最后八份订单。'],cases:[copyCase(5),copyCase(9),copyCase(9,{route:['Claude'],line:'前面的协作步骤省了，我直接交稿。',reply:'虽然是授权参与者，但没有走完整流程。'}),originalCase(5,{line:'这次带来了真实签名，麻烦重新验收。'}),copyCase(9,{route:['DeepSeek','Qwen','Claude'],line:'三位都参加了，只是先写作后检索。',reply:'实际执行顺序与订单不一致。'}),copyCase(6),copyCase(8),copyCase(9,{line:'完整顺序重新执行完毕，交最后一单。'})]}
];
let chapterIndex=0;
function chapter(){return CHAPTERS[chapterIndex];}
const chapterNewGame=newGame;
newGame=function(){chapterNewGame();chapterIndex=0;setChapterRules();};
function setChapterRules(){
 CASE_COUNT=chapter().cases.length;
 const entries=[['proof','每单核验编号与签名','假回执须标记欺诈并退回'],['model','模型须在订单授权内','未授权跨品牌替换：标欺诈并退回']];
 if(chapterIndex>=1)entries.push(['tier','同品牌也不能擅自降级','型号不符须退回整改']);
 if(chapterIndex>=2)entries[1]=['model','按授权范围验收原装与代工','已授权代工、自建可通过；未授权换牌标欺诈'];
 if(chapterIndex>=3)entries.push(['delivery','输入和收费须符合订单','输入少传或扣款超预算：退回整改']);
 if(chapterIndex>=4)entries.push(['sequence','协作须按完整顺序执行','漏步骤或顺序不符：退回整改']);
 RULES.splice(0,RULES.length,...entries.map(([key,head,sub],i)=>({day:1,page:0,key,isNew:chapterIndex===0||(chapterIndex===1&&key==='tier')||(chapterIndex===2&&key==='model')||(chapterIndex===3&&key==='delivery')||(chapterIndex===4&&key==='sequence'),head:'§'+(i+1)+' '+head,subs:[sub]})));
}
buildQueue=function(){return chapter().cases.map((c,i)=>relaySpec(c,chapterIndex*100+i));};
summaryClick=function(x,y){
 if(!inBox(x,y,[233,285,407,318]))return;
 if(chapterIndex<CHAPTERS.length-1){chapterIndex++;setChapterRules();}else newGame();
 go('news');
};
setChapterRules();
const chapterText=window.render_game_to_text;
window.render_game_to_text=()=>JSON.stringify({...JSON.parse(chapterText()),chapter:chapterIndex+1,chapterTitle:chapter().name,chapterCount:CHAPTERS.length,rules:RULES.map(r=>r.head),campaignCorrect:S.stats?.correct||0});
// Preserve the atlas's native pixel detail; avoid a second downsample and color crush.
const portraitPixels=new Map();
function pixelPortrait(key,x,y,w,h,crop=false,mask=null,motion=null){
 key=key.split(':')[0]+':neutral';
 const a=SPR[key];if(!a)return;
 if(!portraitPixels.has(key)){
  const c=document.createElement('canvas');c.width=180;c.height=128;
  const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  g.drawImage(ATLAS_IMG,a[0],a[1],a[2],a[3],a[4]||0,a[5]||0,a[2],a[3]);
  // Remove detached atlas fragments; retain the main connected silhouette.
  const im=g.getImageData(0,0,180,128),seen=new Uint8Array(180*128);let largest=[];
  for(let seed=0;seed<seen.length;seed++){
   if(seen[seed]||im.data[seed*4+3]<80)continue;
   const part=[seed];seen[seed]=1;
   for(let n=0;n<part.length;n++){
    const j=part[n],x=j%180,y=Math.floor(j/180);
    for(const k of [x>0?j-1:-1,x<179?j+1:-1,y>0?j-180:-1,y<127?j+180:-1])
     if(k>=0&&!seen[k]&&im.data[k*4+3]>=80){seen[k]=1;part.push(k);}
   }
   if(part.length>largest.length)largest=part;
  }
  const keep=new Uint8Array(seen.length);largest.forEach(i=>keep[i]=1);
  for(let i=0;i<keep.length;i++)if(!keep[i]||i%180<32||i%180>147||Math.floor(i/180)>125)im.data[i*4+3]=0;
  g.putImageData(im,0,0);
  portraitPixels.set(key,c);
 }
 let source=portraitPixels.get(key);
 if(mask){
  if(!portraitPixels.has(mask+':neutral')){G.save();G.globalAlpha=0;pixelPortrait(mask+':neutral',0,0,180,128);G.restore();}
  source=maskedPortraitFrame(key,mask);
 }
 if(!mask&&motion)source=animatedPortraitFrame(source,key,motion);
 G.save();G.imageSmoothingEnabled=false;
 if(crop){const side=Math.round(Math.min(w,h));G.drawImage(source,28,4,124,124,Math.round(x+(w-side)/2),Math.round(y+(h-side)/2),side,side);}
 else G.drawImage(source,Math.round(x),Math.round(y),Math.round(w),Math.round(h));
 G.restore();
}
