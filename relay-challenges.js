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
 ['材料带齐了，今天排队挺快。','还是熟悉的配方，请走流程。','这单我留了回执，麻烦核一下。','上次退回后，这次重新交付。','计划列好了，先完成这一单。'],
 ['客户选了路由，授权在订单上。','自建机房还在加班，我先交单。','又见面了，今天排班也很满。','这单材料分开放了，你对一下。','老熟人了，流程还是照常走。','我把完整型号写在回执里了。'],
 ['长材料已处理，记录在上游。','小数点也上班，财务还没下班。','这次材料补全了，请重新核验。','自动路由跑完了，回执请查收。','新账单带来了，旧账单作废。','工牌没换，具体型号看记录。','这单很顺利，材料交给你。'],
 ['纸张挺正式，验签就交给你了。','协作记录已整理，请逐项核验。','参与者都列好了，流程在回执上。','这次有签名，编号也请对一下。','各位都忙完了，记录按实际填写。','机房照常运行，服务方式已披露。','账单这次改过，麻烦再检查。','最后一单了，别急着关机。']
];
CHAPTERS.forEach((ch,ci)=>{
 ch.cases.forEach((c,i)=>{
  c.orderId='R-'+String(ci*100+i+1).padStart(3,'0');
  if(ci>0){c.line=subtleEntrances[ci-1][i];c.receiptLine=['回执请查收，别用我的表情作证。','我先等你核对，不替回执抢答。','熟人也走流程，工牌不算免检卡。'][i%3];}
 });
});
CHAPTERS[1].tips[2]='签名有效仍须核对编号；拿错回执退回整改。';
CHAPTERS[3].tips[2]='小数照实比较，不可四舍五入；旧规继续。';
CHAPTERS[4].tips[2]='可能同时有多项错误，所有旧规继续生效。';
