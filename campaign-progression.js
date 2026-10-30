'use strict';
// Keep authored source cases as regression fixtures; the playable campaign has its own pacing.
const CAMPAIGN_CHAPTERS=structuredClone(CHAPTERS);
const cc=(ch,i)=>CAMPAIGN_CHAPTERS[ch].cases[i];
CAMPAIGN_CHAPTERS[0].cases=[cc(0,0),cc(0,2),cc(0,1),cc(0,3)];
// Chapter two: a clean example, one downgrade, then exact-version inquiries.
cc(1,2).receiptId=cc(1,2).orderId;
cc(1,1).evidence.revision.actual=cc(1,1).evidence.revision.expected;
CAMPAIGN_CHAPTERS[1].cases=[cc(1,2),cc(1,1),cc(1,0),cc(1,3),cc(1,4)];
// Chapter three: first learn to retrieve a log, then interpret a separate authorization.
cc(2,0).evidence={};cc(2,1).evidence={};cc(2,2).evidence={};
cc(2,2).reported={route:['Claude']};
cc(2,3).receiptId=cc(2,3).orderId;delete cc(2,3).evidence.tools;
cc(2,4).evidence={};
CAMPAIGN_CHAPTERS[2].cases=[cc(2,1),cc(2,0),cc(2,2),cc(2,3),cc(2,4),cc(2,5)];
// Chapter four isolates each new check before introducing a retry and a combined case.
cc(3,0).evidence={};cc(3,1).evidence={};
cc(3,4).evidence={digest:cc(3,4).evidence.digest};delete cc(3,4).reported;
cc(3,3).charge=cc(3,3).budget;cc(3,3).evidence={attachments:cc(3,3).evidence.attachments};
cc(3,5).route=[...cc(3,5).allowed];
CAMPAIGN_CHAPTERS[3].cases=[cc(3,0),cc(3,1),cc(3,4),cc(3,3),cc(3,2),cc(3,5),cc(3,6)];
// The final shift includes valid exceptions and revisits metadata from earlier chapters.
cc(4,5).evidence.cache.actual='未命中';
cc(4,4).evidence.revision={expected:'v2.10',actual:'v2.1'};delete cc(4,4).evidence.cache;
cc(4,6).evidence={tools:cc(4,6).evidence.tools,revision:{expected:'v2.10',actual:'v2.10'},digest:{expected:'A7C79F',actual:'A7C79E'}};
cc(4,7).evidence={format:cc(4,7).evidence.format,attachments:{expected:['A01','B02'],actual:['A01','A01']},cache:cc(4,7).evidence.cache};
CAMPAIGN_CHAPTERS[4].cases=[cc(4,1),cc(4,0),cc(4,2),cc(4,4),cc(4,5),cc(4,3),cc(4,6),cc(4,7)];
Object.assign(CAMPAIGN_CHAPTERS[0],{focus:'先学完整流程，再练缺页与换牌',tips:['第一单：调回执、核对、盖章，再归还订单。','第二单：比对缺页，询问补齐后再判断。','发现换牌证据后，才会出现欺诈标记。']});
Object.assign(CAMPAIGN_CHAPTERS[1],{focus:'先看完整型号，再核对精确版本',tips:['先看一单完整记录，再练同品牌型号差异。','缺版本页时先比对，再询问；补齐也可能合规。','不同版本号不能互换；其余旧规则继续。']});
Object.assign(CAMPAIGN_CHAPTERS[2],{focus:'先熟悉三份材料，再处理授权例外',tips:['第一单练调日志：回执是声明，日志是执行记录。','之后核查补充授权，编号、签名和模型须一致。','后半章再查缓存与工具；不能拿上一单授权套用。']});
Object.assign(CAMPAIGN_CHAPTERS[3],{focus:'先单项核查，再查备用线路',tips:['前四单依次练输入数量、收费、指纹和附件。','看见重试登记，须比对并询问最终线路。','有重试不等于违规，最终交付符合授权就可通过。']});
Object.assign(CAMPAIGN_CHAPTERS[4],{focus:'综合验收：旧规则交叉出现',tips:['先看完整协作示例，再核查遗漏、顺序和格式。','版本、指纹与附件也会回来，不要只盯新字段。','本章保留合规例外；按证据判断，不凭经验退回。']});
chapter=function(){return CAMPAIGN_CHAPTERS[chapterIndex];};
function campaignControl(name){
 const e=B?.ent;
 if(name==='rules')return true;
 if(name==='verify')return !!e?.handed;
 if(name==='compare')return !!(B?.insp.on||e?.verified);
 if(name==='log')return !!(e?.spec.needsLog&&e.verified);
 if(name==='ask')return !!(e?.verified&&(e.spec.followup||S.tut.questionUnlocked||chapterIndex>0));
 if(name==='fraud')return !!(S.tut.fraudUnlocked||e?.fraudEvidence||e?.fraudMarked);
 if(name==='stamp')return !!(e?.verified&&(!e.spec.needsLog||e.logVerified)&&(!e.spec.followup||e.supplementReviewed));
 return true;
}
const controlBoxes=()=>[[VERIFY_BTN,'verify'],[[126,267,172,283],'verify'],[LOG_BTN,'log'],[INSPECT_BTN,'compare'],[DELIVERY_ASK,'ask'],[FRAUD_BTN,'fraud']];
const progressiveButton=uiButton;
uiButton=function(box,...args){if(scene==='booth'&&B){const match=controlBoxes().find(([b])=>b.every((v,i)=>v===box[i]));if(match&&!campaignControl(match[1]))return;}return progressiveButton(box,...args);};
const progressiveInput=boothInput;
boothInput=function(x,y){for(const [box,name]of controlBoxes())if(inBox(x,y,box)&&!campaignControl(name))return;progressiveInput(x,y);};
const progressiveTray=drawTray;
drawTray=function(){if(campaignControl('stamp')||B.tray.open)progressiveTray();};
const progressiveSetTray=setTray;
setTray=function(open){if(open&&!campaignControl('stamp')){flash('先完成本单核验，印章栏随后开放');return;}progressiveSetTray(open);};
const progressiveInspect=inspectClick;
inspectClick=function(x,y){progressiveInspect(x,y);if(B.ent?.inquiryUnlocked)S.tut.questionUnlocked=true;if(B.ent?.fraudEvidence)S.tut.fraudUnlocked=true;};
const progressiveHint=hintText;
hintText=function(){const e=B.ent;if(e?.verified&&!e.spec.followup&&(!e.spec.needsLog||e.logVerified)&&!S.tut.stamped)return '核对完成后拉开右侧印章栏，盖章再归还订单';return progressiveHint();};
const progressionText=window.render_game_to_text;
window.render_game_to_text=()=>JSON.stringify({...JSON.parse(progressionText()),availableControls:Object.fromEntries(['rules','verify','compare','log','ask','fraud','stamp'].map(k=>[k,campaignControl(k)]))});
