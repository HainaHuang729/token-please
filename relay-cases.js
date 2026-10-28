'use strict';
// Fictional contracts and trusted upstream records. No real provider API is called.
const RELAY_CASES = [
 {person:'GPT',name:'GPT',model:'GPT',allowed:['GPT'],auth:'仅限原装',context:32,budget:8,route:['GPT'],delivered:32,charge:8,proof:true,line:'原装调用。请把订单和上游回执一起看。',reply:'调用编号也对上了，不靠自报家门。'},
 {person:'DEEPSEEK',name:'DeepSeek',model:'Claude',allowed:['Claude'],auth:'禁止代工',context:32,budget:8,route:['DeepSeek'],delivered:32,charge:8,proof:true,line:'我只是来代班的，价格不是我定的。',reply:'门口写 Claude，后台其实是我。'},
 {person:'GLM',name:'GLM',model:'GLM 旗舰',allowed:['GLM 旗舰'],auth:'禁止降级',context:32,budget:6,route:['GLM 轻量'],delivered:32,charge:6,proof:true,line:'旗舰忙不过来，我先用轻量版顶一下。',reply:'客户还没同意降级，我就先接单了。'},
 {person:'GEMINI',name:'Gemini',model:'Gemini',allowed:['Gemini'],auth:'仅限原装',context:64,budget:8,route:['Gemini'],delivered:64,charge:8,proof:true,line:'订单指定的模型和输入，都照约定转发了。',reply:'型号、交付和扣款，都写在回执上。'},
 {person:'QWEN',name:'Qwen',model:'GPT',allowed:['GPT','Qwen'],auth:'可转 Qwen',context:32,budget:6,route:['Qwen'],delivered:32,charge:4,proof:true,line:'订单选了自动路由，允许交给我。',reply:'用户同意了代工，账单也按实际结算。'},
 {person:'GROK',name:'Grok',model:'Grok',allowed:['Grok'],auth:'仅限原装',context:32,budget:6,route:['Grok'],delivered:32,charge:6,proof:false,line:'这张回执看起来很官方，对吧？',reply:'上游查不到编号？模板做得挺像的。'},
 {person:'META',name:'Meta',model:'Meta 自建',allowed:['Meta 自建'],auth:'已披露自建',context:32,budget:4,route:['Meta 自建'],delivered:32,charge:4,proof:true,line:'自建服务已披露，没有冒充官方接口。',reply:'合同允许自建，权重来源也登记了。'},
 {person:'KIMI',name:'Kimi',model:'Kimi',allowed:['Kimi'],auth:'不许截断',context:128,budget:8,route:['Kimi'],delivered:32,charge:8,proof:true,line:'型号没换，但前面的材料被中转站删了。',reply:'客户买了长上下文，我只收到末尾。'},
 {person:'MINIMAX',name:'MiniMax',model:'MiniMax',allowed:['MiniMax'],auth:'预算内交付',context:32,budget:4,route:['MiniMax'],delivered:32,charge:9,proof:true,line:'调用是我完成的，额外收费得问中转商。',reply:'报价 4 token，实际扣了 9 token。'},
 {person:'CLAUDE',name:'Claude',model:'协作流水线',allowed:['Qwen','DeepSeek','Claude'],auth:'Qwen/DS/Claude',context:64,budget:12,sequence:['Qwen','DeepSeek','Claude'],route:['Qwen','DeepSeek','Claude'],delivered:64,charge:10,proof:true,line:'Qwen 检索，小鲸起草，我负责最后审核。',reply:'三个参与者都在订单的授权名单里。'}
];
function relayVerdict(c){
 const unauthorized=c.route.filter(m=>!c.allowed.includes(m));
 const substitution=unauthorized.some(m=>!c.allowed.some(a=>a.split(' ')[0]===m.split(' ')[0]));
 const reasons=[];
 if(c.proof&&c.receiptId&&c.orderId&&c.receiptId!==c.orderId)reasons.push('签名有效，但回执编号不属于本单');
 if(!c.proof)reasons.push('上游签名无效，回执编号查无记录');
 if(unauthorized.length)reasons.push('实际模型不在订单授权范围');
 if(c.sequence&&JSON.stringify(c.route)!==JSON.stringify(c.sequence))reasons.push('协作步骤缺失或顺序不符');
 if(c.delivered<c.context)reasons.push('实际转发的输入少于订单约定');
 if(c.charge>c.budget)reasons.push('实际扣款超过订单预算');
 return {decision:reasons.length?'deny':'approve',fraud:!c.proof||substitution,reasons};
}
function relaySpec(c,i){
 const id=c.orderId||'R-'+String(i+1).padStart(3,'0');
 c={...c,orderId:id};const v=relayVerdict(c);
 const routeLabel=c.route.map(m=>m==='DeepSeek'?'DS':m).join('/');
 const rows=[['编号',id],['模型',c.model],['授权',c.auth],['输入',c.context+'K'],['预算',c.budget+' token']];
 const receiptRows=[['回执',c.receiptId||(c.proof?id:'X-999')],['上游',c.proof?routeLabel:'无法确认'],['转发',c.proof?c.delivered+'K':'无法确认'],['扣款',c.charge+' token'],['签名',c.proof?'有效':'无效']];
 const issues=[];
 const add=(pairs,title,sub)=>issues.push({pairs,title,sub,ask:[['C','请解释这项记录。'],['E',c.reply,{hold:1.3}]]});
 if(c.proof&&c.receiptId&&c.receiptId!==id)add([['dv.编号','receipt.回执']],'回执不属于本单','签名有效仍须核对订单编号');
 if(!c.proof)add([['receipt.签名'],['dv.编号','receipt.回执']],'回执无法验证','调用编号不符，且上游签名无效');
 if(c.route.some(m=>!c.allowed.includes(m)))add([['dv.模型','receipt.上游'],['dv.授权','receipt.上游']],'交付模型不符','核对授权范围；同品牌降级也须同意');
 if(c.sequence&&JSON.stringify(c.route)!==JSON.stringify(c.sequence))add([['dv.授权','receipt.上游']],'协作顺序不符','须按订单列出的完整顺序执行');
 if(c.delivered<c.context)add([['dv.输入','receipt.转发']],'输入被截断','实际转发少于订单约定');
 if(c.charge>c.budget)add([['dv.预算','receipt.扣款']],'收费超出预算','本局订单未授权额外收费');
 const confirmations=[
 {pairs:[['dv.编号','receipt.回执']],title:'订单编号一致',sub:'仍须检查签名、交付和扣款'},
 {pairs:[['receipt.签名']],title:'签名验证通过',sub:'签名有效不代表交付符合合同'},
 {pairs:[['dv.模型','receipt.上游'],['dv.授权','receipt.上游']],title:c.sequence?'协作步骤符合约定':c.route[0]!==c.model?'代工在授权范围内':'交付模型符合授权',sub:c.sequence?'上游步骤与订单顺序一致':c.route[0]!==c.model?'订单明确允许该模型参与交付':'本项核对通过，继续查看其他字段'},
 {pairs:[['dv.输入','receipt.转发']],title:'输入转发量符合约定',sub:'本单没有发现输入截断'},
 {pairs:[['dv.预算','receipt.扣款']],title:'扣款未超预算',sub:'按实际调用结算，低于预算也可通过'}
 ];
 return {confirmations:c.proof?confirmations:[],person:c.person,name:c.name,voice:130+Math.max(0,RELAY_CASES.findIndex(x=>x.person===c.person))*7,intro:[['E',c.line,{hold:1.5}]],primary:'dv',
 docs:[{key:'dv',doc:new Card(rows,{title:'交付订单',sub:id,seal:false,valueX:42})}],
 ok:[v.decision],issues,reason:v.reasons.join('；'),needsVerify:true,fraud:v.fraud,contract:c,receiptRows,
 reply:c.reply,receiptLine:c.receiptLine,react:{approve:[['E',v.decision==='approve'?(c.approveLine||'验收完成。按合同交付，合作愉快。'):'这份回执真的能通过？',{hold:1.2}]],deny:[['E',v.decision==='deny'?(c.denyLine||'收到。让中转商带整改说明回来。'):'订单允许这样交付，请再核对一下。',{hold:1.2}]]}};
}
