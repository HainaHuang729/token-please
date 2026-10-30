'use strict';
let campaignRecord={total:0,correct:0,missedFraud:0,wrongReject:0,caughtFraud:0};
const endingReset=newGame;
newGame=function(){endingReset();campaignRecord={total:0,correct:0,missedFraud:0,wrongReject:0,caughtFraud:0};};
const endingJudge=judge;
judge=function(e,dec){const before=B.correct;endingJudge(e,dec);campaignRecord.total++;if(B.correct>before){campaignRecord.correct++;if(e.spec.fraud)campaignRecord.caughtFraud++;}if(e.spec.fraud&&dec==='approve')campaignRecord.missedFraud++;if(e.spec.ok.includes('approve')&&dec==='deny')campaignRecord.wrongReject++;};
const CAMPAIGN_ENDINGS=[
 {id:'leak',title:'套牌通道',condition:'漏放欺诈订单至少 2 单',text:'窗口一直很忙，队伍走得也快。直到投诉寄来，你才发现：有些盖过绿章的名字，从没真正接过单。',note:'下一轮优先核查签名与模型授权。',color:'#a14d43'},
 {id:'closed',title:'空荡的候场室',condition:'误退合规订单至少 3 单',text:'你把每份陌生材料都当成风险。后来候场室安静下来，带着合法授权的人也不再敲窗。',note:'下一轮记得核查合法代工与补充授权。',color:'#776674'},
 {id:'light',title:'最后一盏灯',condition:'正确验收至少 27 单',text:'天亮时，最后一份订单归了档。该退的退了，该过的也过了。小鲸把热饭放在窗边：今天终于能一起下班。',note:'你守住了大多数订单，也愿意给解释留下时间。',color:'#4c735c'},
 {id:'steady',title:'准点交班',condition:'正确验收至少 21 单',text:'交班本上还有几处红字，但大部分订单都找到了去处。下一班接过钥匙，你终于能把凉掉的茶换一杯。',note:'继续练习跨文件比对，减少容易忽略的差错。',color:'#52796c'},
 {id:'training',title:'明天重新上岗',condition:'未达到以上条件',text:'你把没看懂的材料单独夹好。主管没有收走工牌，只在交班本上写了一句：明天从第一份订单重新练。',note:'先练完整流程，再逐步加入复杂规则。',color:'#9b7844'}
];
// Preload separate local plates; the five scenes share the dossier's photo mount.
const ENDING_ART=Object.fromEntries(CAMPAIGN_ENDINGS.map(({id})=>{
 const image=new Image();image.src='pixel-art/endings/'+id+(id==='light'?'':'-characters-v2')+'.png';return [id,image];
}));
function drawEndingArt(id){
 const image=ENDING_ART[id];
 rect(47,83,339,249,'#aa956f');rect(44,80,336,246,'#f3e9ce');
 rect(47,83,334,244,UI.deep);
 if(image.complete&&image.naturalWidth){
  const scale=Math.min(288/image.naturalWidth,162/image.naturalHeight);
  const w=Math.round(image.naturalWidth*scale),h=Math.round(image.naturalHeight*scale);
  G.save();G.imageSmoothingEnabled=false;
  G.drawImage(image,47+Math.floor((288-w)/2),83+Math.floor((162-h)/2),w,h);G.restore();
 }
 // Paper photo corners, rather than another UI panel.
 for(const [x,y,sx,sy] of [[44,80,1,1],[337,80,-1,1],[44,247,1,-1],[337,247,-1,-1]]){
  line(x,y,x+sx*8,y,'#c2a368');line(x,y,x,y+sy*8,'#c2a368');
 }
}
function campaignEnding(r=campaignRecord){return r.missedFraud>=2?CAMPAIGN_ENDINGS[0]:r.wrongReject>=3?CAMPAIGN_ENDINGS[1]:r.correct>=27?CAMPAIGN_ENDINGS[2]:r.correct>=21?CAMPAIGN_ENDINGS[3]:CAMPAIGN_ENDINGS[4];}
function endingLines(text){
 if(LANG==='en')return wrap(text,10,232);
 return text.split('\n').flatMap(paragraph=>{
  const lines=[];let row='';
  // Keep Chinese closing punctuation with the preceding character.
  for(const unit of paragraph.match(/.[，。！？；：、）”’]*/gu)||[]){
   if(row&&tw(row+unit,10)>232){lines.push(row);row='';}row+=unit;
  }
  if(row)lines.push(row);return lines;
 });
}
const endingSummary=drawSummary;
drawSummary=function(){endingSummary();if(chapterIndex===4)uiButton([233,285,407,318],'查看本轮结局',true,UI.red);};
const endingSummaryClick=summaryClick;
summaryClick=function(x,y){if(chapterIndex===4&&inBox(x,y,[233,285,407,318])){go('campaign-ending');return;}endingSummaryClick(x,y);};
function drawCampaignEnding(){
 const e=campaignEnding();archiveBackdrop();archivePaper(30,23,580,276);archiveClip(58,20);archiveClip(563,20);
 txt(51,40,'夜班结案 / 五章完成',10,UI.muted);txt(587,40,e.title,12,e.color,'ra');line(48,65,590,65,UI.line);
 drawEndingArt(e.id);
 endingLines(e.text.replaceAll('。','。\n')).forEach((v,i)=>txt(354,87+i*17,v,10,UI.ink));
 line(354,190,586,190,UI.line);
 endingLines(e.note).forEach((v,i)=>txt(354,202+i*16,v,10,e.color));
 txt(48,256,'正确 '+campaignRecord.correct+' / '+campaignRecord.total+'    查实欺诈 '+campaignRecord.caughtFraud+' 单',10,UI.ink);
 txt(354,256,'漏放欺诈 '+campaignRecord.missedFraud+' 单    误退合规 '+campaignRecord.wrongReject+' 单',10,UI.red);
 txt(48,275,'本结局条件：'+e.condition+'；特殊结局优先。',8,UI.muted);
 txt(48,287,'漏放欺诈2单起 → 误退合规3单起 → 正确27单起 → 正确21单起 → 其余',8,UI.muted);
 uiButton([44,313,294,341],'重新开始五章',true,UI.red);uiButton([346,313,596,341],'返回首页',true,UI.navy);
}
function campaignEndingClick(x,y){if(st()<.6)return;if(inBox(x,y,[44,313,294,341])){newGame();go('news');}else if(inBox(x,y,[346,313,596,341])){newGame();go('title');}}
const endingText=window.render_game_to_text;
window.render_game_to_text=()=>JSON.stringify({...JSON.parse(endingText()),campaignRecord:{...campaignRecord},...(scene==='campaign-ending'?{ending:campaignEnding().id,endingTitle:campaignEnding().title}:{})});
