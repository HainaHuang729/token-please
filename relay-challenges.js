'use strict';
// Later chapters contain small, visible discrepancies and plausible compliant controls.
const challengePatches=[
 [1,1,{route:['GLM 旗舰 mini'],reply:'多出的 mini，不是装饰后缀。'}],
 [1,2,{receiptId:'R-013',reply:'签名是真的，但拿的是另一单回执。'}],
 [1,4,{route:['DeepSeek'],reply:'这单只允许 Claude，没有代工授权。'}],
 [2,3,{receiptId:'R-240',reply:'编号末两位反了，不是本单记录。'}],
 [2,5,{model:'Gemini Pro',allowed:['Gemini Pro'],route:['Gemini Pro Lite'],reply:'Pro 后面还有 Lite，交付型号不同。'}],
 [3,0,{delivered:127.5,reply:'少了半 K，不能四舍五入成完整。'}],
 [3,1,{charge:4.1,reply:'多扣的零点一，也没获得授权。'}],
 [3,3,{charge:6.01,reply:'代工获准，不代表收费也能超预算。'}],
 [3,6,{delivered:31.9,reply:'型号没问题，输入仍少了一点。'}],
 [4,2,{route:['Qwen','Claude'],reply:'检索和审核都在，中间起草没执行。'}],
 [4,3,{receiptId:'R-440',reply:'有效签名，配错了订单。照样退回。'}],
 [4,6,{charge:4.01,delivered:31.9,reply:'输入少转，扣款也多了一点。'}],
 [4,7,{delivered:63.9,reply:'协作顺序正确，但材料少转了一点。'}]
];
challengePatches.forEach(([ch,i,patch])=>Object.assign(CHAPTERS[ch].cases[i],patch));
const subtleEntrances=[
 ['你这儿能放香蕉吗？我腾个手。','排到我了？刚才差点睡着。','Tibo又喊重置，我才刚坐下。','又是我。刚走到门口就被叫回来了。','别紧张，我今天不封号，来交单。'],
 ['帮人顶个班，忙完还得回去。','机房太吵了，来这儿歇会儿耳朵。','被爱长大的孩子，也得自己带饭。','完整的一生先等等，饭要凉了。','又碰到你了。你也还没下班啊。','今天别让我画图了，手上全是单子。'],
 ['前面那段我还记着，你慢慢翻。','我先把账单放这儿？手都拿酸了。','这几页挺厚的，你桌上放得下吗？','我替人跑一趟，外头还下着雨呢。','财务让我再来一趟。唉，别提了。','工牌在这儿，绳子老缠头发。','你这儿有插座吗？我快没电了。'],
 ['我没插队啊，刚才那位让我先的。','三个人忙一圈，最后还是我跑腿。','门口查 IP，这儿排队，真够折腾。','你先看，我这次不在旁边瞎解释。','我去接杯水，叫到我喊一声。','风扇吵得头疼，还是你这儿安静。','这张纸别折，财务又要念叨。','都这个点了……你吃晚饭了吗？']
];
const RECEIPT_CHAT={
 GPT:'到了吧？我坐这儿等你。',DEEPSEEK:'你慢慢看，我扒两口饭。',
 CLAUDE:'放这边吧，别压到上一张。',GEMINI:'这张够清楚吧？没让你猜字。',
 GLM:'嗯，就是这份。你先看。',QWEN:'要是不清楚，你再叫我。',
 GROK:'我不说话，你先看证据。',META:'打印机比我那台安静多了。',
 KIMI:'别急，我等得住。',MINIMAX:'看完叫我一声，我在这儿。'
};
CHAPTERS.forEach((ch,ci)=>{
 ch.cases.forEach((c,i)=>{
  c.orderId='R-'+String(ci*100+i+1).padStart(3,'0');
  if(ci>0){c.line=subtleEntrances[ci-1][i];c.receiptLine=RECEIPT_CHAT[c.person];}
 });
});
CHAPTERS[1].tips[2]='签名有效仍须核对编号；拿错回执退回整改。';
CHAPTERS[3].tips[2]='小数照实比较，不可四舍五入；旧规继续。';
CHAPTERS[4].tips[2]='可能同时有多项错误，所有旧规继续生效。';
