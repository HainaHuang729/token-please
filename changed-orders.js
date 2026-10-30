'use strict';
// Local test collection, opt-in through ?test=changed; the normal campaign is untouched.
const CHANGED_ORDER_TEST=new URLSearchParams(location.search).get('test')==='changed';
if(CHANGED_ORDER_TEST){
 const entries=CAMPAIGN_CHAPTERS.flatMap((ch,ci)=>ch.cases.flatMap((c,i)=>c.followup?[{c,ci,i}]:[]));
 const labels={missing:'缺页核查',authorization:'补充授权',retry:'备用线路'};
 let selected=null;
 const collection=()=>selected===null?entries:[entries[selected]];
 chapter=function(){return {name:'改动订单 · 测试合集',focus:'本次只测试询问与补件流程',story:'本次测试 '+collection().length+' 份订单；请按实际证据验收。',tips:['先比对缺项或矛盾，再点询问取得关键材料。','补件到手再比对；标欺诈须指出相关证据。','可连续测试八单，或返回列表单独重测。'],cases:collection().map(e=>e.c)};};
 const campaignRules=setChapterRules;
 setChapterRules=function(){chapterIndex=4;campaignRules();CASE_COUNT=collection().length;};
 buildQueue=function(){return collection().map(({c,ci,i})=>relaySpec(c,ci*100+i));};
 const campaignNewGame=newGame;
 newGame=function(){campaignNewGame();chapterIndex=4;setChapterRules();};
 function startCollection(index){selected=index;showingRoster=false;newGame();go('news');}
 drawTitle=function(){
  archiveBackdrop();archivePaper(25,16,590,325);archiveClip(52,13);archiveClip(583,13);
  txt(45,32,'改动订单测试合集',12,UI.ink);txt(592,35,'LOCAL / 8 CASES',8,UI.muted,'ra');
  txt(45,55,'只收录新增询问与补件的八单；点击卡片可单独测试。',10,UI.muted);
  entries.forEach(({c,ci,i},n)=>{
   const x=44+(n%2)*280,y=81+Math.floor(n/2)*46;
   rect(x,y,x+270,y+37,'#dcd2b7');outline(x,y,x+270,y+37,UI.line);
   txt(x+10,y+6,'第 '+(ci+1)+' 章 / 第 '+(i+1)+' 单 · '+c.orderId,10,UI.ink);
   txt(x+10,y+23,labels[c.followup.type]+' / '+c.name,8,UI.muted);txt(x+256,y+23,'试',8,UI.red,'ra');
  });
  uiButton([44,279,314,310],'连续测试全部八单',true,UI.red);
  uiButton([324,279,594,310],'返回正式五章',true,UI.navy);
  txt(45,324,'合集独立计分 · 不改正式章节 · 不提前显示答案',8,UI.muted);
 };
 titleClick=function(x,y){
  for(let n=0;n<entries.length;n++){const bx=44+(n%2)*280,by=81+Math.floor(n/2)*46;if(inBox(x,y,[bx,by,bx+270,by+37])){startCollection(n);return;}}
  if(inBox(x,y,[44,279,314,310]))startCollection(null);
  if(inBox(x,y,[324,279,594,310])){const url=new URL(location.href);url.searchParams.delete('test');location.href=url.href;}
 };
 const collectionBg=drawBg;
 drawBg=function(){collectionBg();rect(310,3,510,22,UI.deep);txt(502,9,'TOKEN '+(B.pay-B.fines)+' / 测试合集',8,UI.white,'ra');};
 const collectionSummary=drawSummary;
 drawSummary=function(){collectionSummary();rect(220,278,420,323,UI.deep);uiButton([233,285,407,318],'返回测试合集',true,UI.red);};
 summaryClick=function(x,y){if(inBox(x,y,[233,285,407,318])){selected=null;newGame();go('title');}};
 // Exit to the picker during a run without having to finish the rest of the queue.
 const back=document.createElement('button');back.textContent='返回测试合集';back.type='button';back.style.cssText='background:#283a43;color:#f3e9ce;border:1px solid #9f8b65;padding:4px 8px;cursor:pointer';
 const toolbar=document.querySelector('.ui')||document.body;toolbar.appendChild(back);
 back.addEventListener('click',()=>{selected=null;showingRoster=false;newGame();go('title');});
 const collectionText=window.render_game_to_text;
 window.render_game_to_text=()=>JSON.stringify({...JSON.parse(collectionText()),testCollection:{mode:selected===null?'all':'single',count:collection().length,orders:collection().map(e=>e.c.orderId)}});
}
