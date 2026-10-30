'use strict';
// Fictional newspaper interludes; contract rules remain in the following briefing.
const RELAY_NEWS = [
 {headline:'同名模型，怎么还分大小杯？',body:'本报接到用户反映：订单上写着旗舰，到手却是轻量版。卖家解释“都是一家人”，买家表示“那你也不能拿小杯收大杯的钱”。中转站今晚起核对完整型号与版本，名字只差一位，也得看清。',side:'饭点采访 / DeepSeek',quote:'“我吃大米，不吃鱼粮。还有，别在我刚盛好饭的时候叫号。”',brief:'Gemini 和 GLM 已领到排队号码。窗口提醒：不要把版本号的小数点看成灰尘。'},
 {headline:'代班可以，别偷偷替人打卡',body:'自动路由服务开始接单。有人授权换模型省点 token，也有人坚持只要原装。中转站表示：代工本身不是问题，关键是这一单有没有同意。为核对实际执行情况，第三章起增加上游执行日志。',side:'候场闲聊 / GPT',quote:'“刚轮到我就重置？行，我再排一次。这个号你可别给别人。”',brief:'回执说做过，不代表真的做过。工具调用和缓存使用，今晚也要留下记录。'},
 {headline:'长文送达，附件怎么少了一份？',body:'长文本专线刚开通，就有用户发现材料“瘦了”。还有人收到了同名附件，打开却是另一份内容。值班处将核对输入数量、内容指纹与附件清单；多传一份旧文件，也补不上缺少的新文件。',side:'失物招领 / Kimi',quote:'“谁把我的第三份附件拿走了？不是名字带个三就算第三份啊。”',brief:'MiniMax 带着新账单前来复核。预算照旧，所谓“顺手帮忙”的费用也不能擅自加。'},
 {headline:'三位都来了，活却没按顺序干',body:'协作专线出现奇怪交付：先写结论，再补检索；名单一个不少，过程全乱了。最后一班将同时检查协作顺序、输出格式和执行记录。盖了真签名的回执，也可能属于另一份订单。',side:'窗口来信 / Claude',quote:'“我说的是先查再写。你都写完了才问我要查什么，我怎么接？”',brief:'Grok 带来新材料。工作人员提醒：上一单合格，不等于下一单可以闭眼盖章。'}
];
let relayNewsReport='';
const newsSummaryClick=summaryClick;
summaryClick=function(x,y){
 const previous=chapterIndex;
 const report=B.correct===B.total?'上一班全部验收无误，值班处请你继续保持。':`上一班完成 ${B.total} 单，正确 ${B.correct} 单。差错已归档，下一班请逐项核对。`;
 newsSummaryClick(x,y);
 if(scene==='news'&&chapterIndex===previous+1){relayNewsReport=report;go('newspaper');}
};
function drawRelayNews(){
 const n=RELAY_NEWS[chapterIndex-1];if(!n)return;
 archiveBackdrop();archivePaper(36,13,568,294,'#e7ddbf');archiveClip(61,10);archiveClip(574,10);
 const ink='#302f2c',muted='#736653',red='#944b40';
 txt(320,25,'中转站晚报',12,ink,'ma');
 txt(53,46,'夜班特刊 / 第 '+chapterIndex+' 期',8,muted);txt(586,46,'TOKEN EVENING / 虚构新闻',8,muted,'ra');
 line(51,61,588,61,ink);line(51,64,588,64,ink);
 txt(54,76,n.headline,12,ink);
 const paragraph=(s,x,y,width,size=10)=>{const rows=wrap(s,size,width);rows.forEach((v,i)=>txt(x,y+i*15,v,size,ink));return y+rows.length*15;};
 paragraph(n.body,54,101,326);
 rect(54,161,379,190,'#d9cfaf');txt(63,167,'本期关注',8,red);
 txt(63,179,['完整型号 / 版本编号','订单授权 / 上游日志','内容指纹 / 附件清单','协作顺序 / 输出格式'][chapterIndex-1],8,ink);
 line(396,77,396,235,'#b7a581');
 txt(411,78,n.side,10,red);paragraph(n.quote,411,101,174);
 line(54,202,379,202,'#b7a581');txt(54,213,'站内快讯',10,red);paragraph(n.brief,54,232,326);
 pixelPortrait(['DEEPSEEK','GPT','KIMI','CLAUDE'][chapterIndex-1]+':neutral',462,137,60,60,true);
 txt(411,207,'读报后领取交接单',8,muted);txt(411,222,'规则以当班合同为准',8,muted);
 line(54,272,586,272,ink);txt(54,284,relayNewsReport,8,ink);
 uiButton([430,315,610,343],'领取交接单',true,UI.red);txt(38,327,'读完新闻，再开始下一班。',10,UI.white);
}
const newsText=window.render_game_to_text;
window.render_game_to_text=()=>JSON.stringify({...JSON.parse(newsText()),...(scene==='newspaper'?{newspaper:{issue:chapterIndex,...RELAY_NEWS[chapterIndex-1],report:relayNewsReport},continueButton:[430,315,610,343]}:{})});
