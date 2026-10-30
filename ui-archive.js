'use strict';
// Night archive art direction. Existing input coordinates and document fields remain authoritative.
Object.assign(UI_VARIANTS.paper,{name:'02 深夜纸档室',desk:'#403b32',paper:'#e7ddbf',ink:'#302f2c',muted:'#736653',line:'#9f8b65',navy:'#283a43',deep:'#202f36',blue:'#7f493b',cyan:'#4d776d',lavender:'#776674',green:'#4c735c',red:'#a14d43',white:'#f3e9ce',amber:'#c2a368'});
const archiveChoice=new URLSearchParams(location.search).get('design');
let archiveMigrated=false;try{archiveMigrated=localStorage.getItem('token-please-art-direction')==='archive-v1';localStorage.setItem('token-please-art-direction','archive-v1');}catch{}
setUiVariant(archiveChoice&&UI_VARIANTS[archiveChoice]?archiveChoice:!designPreview||!archiveMigrated?'paper':uiVariant);
const archiveNav=document.querySelector('[data-variant="paper"]');if(archiveNav)archiveNav.textContent=UI_VARIANTS.paper.name;
const archiveCss=document.createElement('style');archiveCss.textContent='body[data-design="paper"] #design-switcher{background:#202f36;border-color:#9f8b65}body[data-design="paper"] #design-switcher button[aria-pressed="true"]{background:#e7ddbf;color:#302f2c}body[data-design="paper"] .ui button{background:#283a43;color:#f3e9ce;border-color:#9f8b65}';document.head.appendChild(archiveCss);
function archiveBackdrop(){
 rect(0,0,639,359,'#302f2c');
 if(typeof ARCHIVE_BG!=='undefined'&&ARCHIVE_BG.complete&&ARCHIVE_BG.naturalWidth){G.save();G.imageSmoothingEnabled=false;G.drawImage(ARCHIVE_BG,0,0,640,360);G.restore();}
 else{rect(0,0,639,112,'#26353b');rect(0,113,639,359,'#514637');for(let y=124;y<360;y+=23){line(0,y,639,y,'#3e372e');line(0,y+2,639,y+2,'#67573e');}}
}
function archivePaper(x,y,w,h,tone=UI.paper){
 rect(x+4,y+5,x+w+3,y+h+4,'#201f1b');rect(x+2,y+2,x+w+1,y+h+1,'#aa956f');rect(x,y,x+w-1,y+h-1,tone);
 outline(x,y,x+w-1,y+h-1,'#aa956f');line(x+3,y+3,x+w-4,y+3,'#f5ebd0');
 // Fixed edge wear: never generate fresh noise during animation.
 for(let n=0;n<Math.floor(h/19);n++){const yy=y+7+n*19;line(x+2,yy,x+4+(n%3),yy,'#cab990');}
 for(let n=0;n<Math.floor(w/31);n++){const xx=x+8+n*31;line(xx,y+h-4,xx+6,y+h-4,'#cdbb95');}
}
function archiveClip(x,y){rect(x,y,x+15,y+5,'#342f28');outline(x+2,y-3,x+13,y+5,'#c0a36c');line(x+5,y-2,x+10,y-2,'#e6ce95');}
function archivePlate(x,y,w,label){rect(x+1,y+2,x+w+1,y+20,'#151f24');rect(x,y,x+w,y+18,UI.navy);outline(x,y,x+w,y+18,UI.line);pt(x+4,y+4,UI.amber);pt(x+w-4,y+14,UI.amber);txt(x+w/2,y+5,label,10,UI.white,'ma');}
const archiveBase=drawBg;
drawBg=function(){if(uiVariant!=='paper'){archiveBase();return;}archiveBackdrop();
 rect(0,0,639,25,UI.deep);line(0,25,639,25,UI.line);txt(12,8,'Token, Please! / 夜班档案室',10,UI.white);txt(502,9,'TOKEN '+(B.pay-B.fines)+' / 第 '+(chapterIndex+1)+' 章',8,UI.white,'ra');
 // Felt writing pad keeps evidence legible against the illustrated room.
 rect(223,126,638,317,'#282b27');outline(225,128,636,315,'#7e7155');outline(228,131,633,312,'#4f5140');
 rect(0,282,219,359,'#26343a');line(220,126,220,359,'#a18a61');
};
const archiveExterior=drawExterior;
drawExterior=function(){if(uiVariant!=='paper'){archiveExterior();return;}
 archivePlate(8,34,203,chapter().name);archivePaper(12,61,194,39);txt(21,69,'已办 '+B.total+' / '+CASE_COUNT+'    差错 '+(B.total-B.correct),10,UI.ink);txt(21,85,'逐单查验 · 凭据归档',8,UI.muted);
 B.queue.forEach((s,i)=>{const x=230+i*47,active=!!B.ent&&i===B.idx-1,done=i<B.total;
 archivePaper(x,37,40,62,done?'#c6c4a9':'#e8dfc6');archiveClip(x+12,34);
 G.save();if(done)G.globalAlpha=.55;uiPortrait(s.person,x+3,43,34,36,'neutral',s.contract?.mask);G.restore();
 txt(x+20,85,done?'归档':String(i+1).padStart(2,'0'),8,active?UI.red:UI.ink,'ma');if(active){line(x+4,96,x+35,96,UI.red);line(x+4,97,x+35,97,UI.red);}
 });
 rect(8,105,211,123,UI.navy);txt(17,110,B.ent?'窗口 / '+B.ent.spec.name:'窗口 / 等候交单',8,UI.white);
 if(B.insp.on){rect(229,105,635,123,UI.navy);txt(237,110,'比对模式：选两处字段，查明矛盾',8,UI.white);}
};
const archiveWindow=drawWindow;
drawWindow=function(){if(uiVariant!=='paper'){archiveWindow();return;}
 G.save();G.beginPath();G.rect(WIN[0],WIN[1],WIN_W,WIN_H);G.clip();G.translate(WIN[0],WIN[1]);
 rect(0,0,202,128,'#243541');rect(8,0,194,122,'#1b2a36');
 for(let i=0;i<7;i++){const x=12+i*28,y=38+(i*17)%27;rect(x,y,x+22,127,'#30414a');for(let j=0;j<3;j++)rect(x+5,y+9+j*19,x+8,y+13+j*19,j===1?'#a88c53':'#51616a');}
 line(20,0,20,128,'#5c594b');line(182,0,182,128,'#5c594b');line(0,26,202,26,'#5c594b');
 const e=B.ent,ex=entrantX(e);if(e&&ex!==null){const m=portraitMotionState(e);pixelPortrait(exprKey(e),motionPreference.matches?11:ex-90,m.offset,180,128,false,e.spec.contract?.mask,m);}
 else{drawNextOrderIcon();}
 rect(0,124,202,128,'#907750');G.restore();outline(...WIN,'#b39a68');outline(WIN[0]-2,WIN[1]-2,WIN[2]+2,WIN[3]+2,'#514534');
};
const archiveCard=Card.prototype.draw;
Card.prototype.draw=function(x,y){if(uiVariant!=='paper'){archiveCard.call(this,x,y);return;}
 const log=this.title.includes('日志'),receipt=this.title.includes('回执'),tone=log?'#ead9af':receipt?'#e2d9df':'#e6dec3',band=log?'#b99755':receipt?'#776674':'#52796c';
 archivePaper(x,y,this.w,this.h,tone);rect(x+2,y+2,x+this.w-3,y+15,band);txt(x+7,y+4,this.title,10,log?'#292a26':UI.white);archiveClip(x+this.w-22,y-2);
 this.shown.forEach(([k,v],i)=>{const yy=y+20+i*14;txt(x+8,yy,k,10,'#6c6151');txt(x+this.valueX,yy,v,tw(v,10)>this.w-this.valueX-6?8:10,UI.ink);line(x+6,yy+11,x+this.w-7,yy+11,'#c1b69c');});
};
const archiveButton=uiButton;
uiButton=function(box,label,active=false,tone=UI.navy){if(uiVariant!=='paper'){archiveButton(box,label,active,tone);return;}
 const hover=ptr.mouse&&inBox(ptr.x,ptr.y,box),dy=hover&&ptr.down?1:0;
 rect(box[0]+2,box[1]+3,box[2]+2,box[3]+3,'#171e20');rect(box[0],box[1]+dy,box[2],box[3]+dy,active?tone:UI.navy);outline(box[0],box[1]+dy,box[2],box[3]+dy,hover?'#f2d795':UI.line);
 if(box[3]-box[1]>22)outline(box[0]+3,box[1]+3+dy,box[2]-3,box[3]-3+dy,'#b5a078');
 txt((box[0]+box[2])/2,box[1]+dy+Math.floor((box[3]-box[1]-10)/2),label,10,UI.white,'ma');
};
const archiveTitle=drawTitle;
drawTitle=function(){if(uiVariant!=='paper'){archiveTitle();return;}if(showingRoster){drawRoster();return;}archiveBackdrop();
 archivePaper(32,30,330,203);archiveClip(68,27);archiveClip(309,27);
 txt(56,49,'模型交付核验处 / 夜班档案',10,UI.muted);bigText(192,78,'Token, Please!',12,3,UI.ink);line(55,114,337,114,UI.line);
 txt(56,131,'请出示你的上游。',12,UI.red);txt(56,158,'前台报的名字，后台真的认吗？',10,UI.ink);txt(56,184,'收单 · 取证 · 比对 · 盖章',10,UI.muted);
 [['DEEPSEEK',391,41],['GPT',502,63],['CLAUDE',411,145]].forEach(([key,x,y],i)=>{archivePaper(x,y,86,104);archiveClip(x+33,y-3);rect(x+6,y+8,x+79,y+83,'#bdc3b5');uiPortrait(key,x+7,y+9,72,74);txt(x+43,y+90,key==='DEEPSEEK'?'DeepSeek':key,8,UI.ink,'ma');});
 archivePaper(512,184,96,61,'#dfcd98');txt(524,196,'十位模型',10,UI.ink);txt(524,215,'一个夜班。',10,UI.ink);
 chapterRail(246,0);uiButton([233,285,407,318],'开始值班',true,UI.red);rect(245,322,395,338,UI.navy);txt(320,326,'查看交付方档案',8,UI.white,'ma');
 txt(12,348,'改编自 IP, PLEASE / ctnyanya',8,UI.white);txt(626,348,'拖拽操作 · R 调回执 · F 全屏',8,UI.white,'ra');
};
const archiveRail=chapterRail;
chapterRail=function(y,current){if(uiVariant!=='paper'){archiveRail(y,current);return;}CHAPTERS.forEach((c,i)=>{const x=30+i*119;archivePaper(x,y,103,32,i===current?'#d9c596':'#dcd5bc');txt(x+8,y+5,'第 '+(i+1)+' 章',10,i===current?UI.red:UI.ink);txt(x+8,y+20,c.cases.length+' 份订单'+(i<current?' / 完成':''),8,UI.muted);});};
const archiveNews=drawNews;
drawNews=function(){if(uiVariant!=='paper'){archiveNews();return;}archiveBackdrop();archivePaper(30,27,580,274);archiveClip(67,24);archiveClip(558,24);
 txt(51,45,'值班交接 / '+chapter().name,12,UI.ink);line(51,66,588,66,UI.line);txt(51,79,chapter().focus,10,UI.red);txt(51,102,chapter().story,10,UI.muted);
 chapter().tips.forEach((s,i)=>{const y=139+i*46;rect(50,y-3,75,y+19,UI.navy);txt(63,y+3,'0'+(i+1),10,UI.white,'ma');txt(89,y,s,10,UI.ink);line(89,y+27,582,y+27,'#c5b895');});
 archivePlate(30,315,300,'本章 '+CASE_COUNT+' 单 · 旧规继续生效');uiButton([430,310,610,338],'开始验收',true,UI.red);
};
const archiveSummary=drawSummary;
drawSummary=function(){if(uiVariant!=='paper'){archiveSummary();return;}archiveBackdrop();archivePaper(35,28,355,239);archiveClip(68,25);
 txt(56,47,'交班报告',12,UI.ink);txt(56,70,chapter().name,10,UI.muted);line(55,90,368,90,UI.line);
 const rows=[['正确验收',B.correct+' / '+B.total],['查实欺诈',(B.frauds||0)+' 单'],['值班收入',B.pay+' token'],['差错扣款',B.fines+' token']];
 rows.forEach(([k,v],i)=>{const y=106+i*28;txt(57,y,k,12,UI.muted);txt(365,y,v,12,i===3?UI.red:UI.ink,'ra');line(55,y+20,367,y+20,'#c3b591');});
 txt(57,228,'净收入',12,UI.ink);txt(365,228,(B.pay-B.fines)+' token',12,UI.green,'ra');
 archivePaper(419,51,181,188,'#dfd2ad');txt(436,68,'值班备忘',12,UI.ink);line(435,88,582,88,UI.line);txt(436,104,'纸面会说话，',10,UI.ink);txt(436,123,'数字不会撒谎。',10,UI.ink);txt(436,154,'累计正确 '+S.stats.correct+' 单',10,UI.muted);
 outline(438,187,581,222,UI.red);txt(510,199,B.correct===CASE_COUNT?'核验无误':'差错已归档',12,UI.red,'ma');
 uiButton([233,285,407,318],chapterIndex<CHAPTERS.length-1?'进入下一章':'重新开始五章',true,UI.cyan);rect(160,334,480,351,UI.navy);txt(320,339,'本局合同与服务记录为虚构剧情。',8,UI.white,'ma');
};
const archiveRoster=drawRoster;
drawRoster=function(){if(uiVariant!=='paper'){archiveRoster();return;}archiveBackdrop();archivePlate(216,16,208,'交付方档案 / 十位模型');
 MODEL_CAST.forEach(([key,label],i)=>{const x=20+(i%5)*124,y=58+Math.floor(i/5)*130;archivePaper(x,y,102,114);archiveClip(x+43,y-3);rect(x+6,y+8,x+95,y+92,'#bcc1b1');uiPortrait(key,x+10,y+9,82,83);txt(x+51,y+99,label,10,UI.ink,'ma');});
 rect(134,327,506,350,UI.navy);txt(320,335,'点击返回 · 看凭据，不凭角色身份判断',8,UI.white,'ma');
};
const archiveHint=drawHint;
drawHint=function(){if(uiVariant!=='paper'){archiveHint();return;}if(B.insp.on)return;const text=hintText();if(!text)return;rect(229,105,635,123,UI.navy);txt(628,110,text,tw(text,10)>390?8:10,UI.white,'ra');};
const archiveTray=drawTray;
drawTray=function(){if(uiVariant!=='paper'){archiveTray();return;}const tx=trayX(),u=trayU(),hx=tx-13;
 rect(hx,204,tx-1,244,'#493e30');outline(hx,204,tx-1,244,UI.line);txt(hx+4,209,B.tray.open?'>':'<',10,UI.white);txt(hx+3,223,'印',8,UI.white);txt(hx+3,233,'章',8,UI.white);if(u<=0)return;
 rect(tx+3,TRAY_Y0+4,tx+TRAY_W+3,TRAY_Y1+4,'#171e20');rect(tx,TRAY_Y0,tx+TRAY_W,TRAY_Y1,'#69553b');outline(tx,TRAY_Y0,tx+TRAY_W,TRAY_Y1,'#bba06d');line(tx+4,TRAY_Y0+4,tx+TRAY_W-4,TRAY_Y0+4,'#8c7350');
 for(const [label,kind,col] of [['验收通过','approve',UI.green],['退回整改','deny',UI.red]]){const off=B.presses.some(p=>p.kind===kind&&now>=p.t&&now<p.t+.22)?3:0,x=tx+(kind==='approve'?10:90),y=TRAY_Y0+8+off;rect(x,y,x+64,y+38-off,'#292d29');rect(x+2,y+19,x+62,y+35-off,col);outline(x+2,y+19,x+62,y+35-off,'#d5bf8e');rect(x+24,y+3,x+40,y+18,'#2b2b24');rect(x+20,y,x+44,y+8,'#886843');line(x+22,y+1,x+42,y+1,'#bc9760');txt(x+32,y+25,label,8,UI.white,'ma');}
};
for(const name of ['drawTitle','drawNews','drawSummary']){const original=window[name];window[name]=function(...args){original(...args);if(uiVariant==='paper'&&!motionPreference.matches&&st()<.22){G.save();G.globalAlpha=1-uiEaseOut(st()/.22);rect(0,0,639,359,UI.deep);G.restore();}};}
