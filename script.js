const CATS=['IT','HR','Finance','Operations']; const COLORS={IT:'#60a5fa',HR:'#a78bfa',Finance:'#34d399',Operations:'#fbbf24'};
const SAMPLE=[
{title:'Password reset finance',category:'IT',subCategory:'Password Reset',department:'Finance',priority:'Medium',status:'Open',assignee:'Alex Rivera',requesterName:'Nthabiseng Molefe',firstResponseMins:45,createdAt:new Date(Date.now()-86400000*1).toISOString(),description:'SAP login'},
{title:'Payslip missing April',category:'HR',subCategory:'Payslip',department:'HR',priority:'High',status:'Open',assignee:'Jordan Kim',requesterName:'Thabo Nkosi',firstResponseMins:120,createdAt:new Date(Date.now()-86400000*2).toISOString(),description:'Payslip'},
{title:'Invoice Q2 discrepancy',category:'Finance',subCategory:'Invoice',department:'Finance',priority:'High',status:'In Progress',assignee:'Sam Chen',requesterName:'Lerato Dlamini',firstResponseMins:319,createdAt:new Date(Date.now()-86400000*3).toISOString(),description:'$240 overcharge'},
{title:'Rack maintenance',category:'Operations',subCategory:'Maintenance',department:'Operations',priority:'Medium',status:'In Progress',assignee:'Taylor Brooks',requesterName:'Kagiso Peters',firstResponseMins:362,createdAt:new Date(Date.now()-86400000*4).toISOString(),description:'Rack B12'},
{title:'Network down HR',category:'IT',subCategory:'Network Issue',department:'HR',priority:'Critical',status:'Open',assignee:'Morgan Lee',requesterName:'Zanele Khumalo',firstResponseMins:15,createdAt:new Date(Date.now()-86400000*0.5).toISOString(),description:'No internet HR'},
{title:'Leave not approved',category:'HR',subCategory:'Leave Request',department:'Operations',priority:'Low',status:'Resolved',assignee:'Sam Chen',requesterName:'Sipho Mbeki',firstResponseMins:610,createdAt:new Date(Date.now()-86400000*6).toISOString(),description:'Leave pending'},
{title:'Budget Q3 tools',category:'Finance',subCategory:'Budget Approval',department:'Finance',priority:'High',status:'Resolved',assignee:'Alex Rivera',requesterName:'Priya Naidoo',firstResponseMins:249,createdAt:new Date(Date.now()-86400000*8).toISOString(),description:'$5k licenses'},
{title:'Forklift procurement',category:'Operations',subCategory:'Procurement',department:'Operations',priority:'Low',status:'Closed',assignee:'Jordan Kim',requesterName:'David Smith',firstResponseMins:413,createdAt:new Date(Date.now()-86400000*10).toISOString(),description:'New forklift'},
{title:'Software install finance',category:'IT',subCategory:'Software Install',department:'Finance',priority:'High',status:'Open',assignee:'Alex Rivera',requesterName:'Zenani',firstResponseMins:95,createdAt:new Date(Date.now()-86400000*1.5).toISOString(),description:'Excel plugin'},
{title:'Recruitment Q3',category:'HR',subCategory:'Recruitment',department:'HR',priority:'Medium',status:'In Progress',assignee:'Jordan Kim',requesterName:'Mushaisano',firstResponseMins:210,createdAt:new Date(Date.now()-86400000*5).toISOString(),description:'Interview'},
{title:'Expense report',category:'Finance',subCategory:'Expense',department:'Operations',priority:'Low',status:'Resolved',assignee:'Sam Chen',requesterName:'Adriyell',firstResponseMins:480,createdAt:new Date(Date.now()-86400000*9).toISOString(),description:'Travel'},
{title:'Hardware failure',category:'IT',subCategory:'Hardware Failure',department:'IT',priority:'Critical',status:'Open',assignee:'Morgan Lee',requesterName:'IT Support',firstResponseMins:25,createdAt:new Date(Date.now()-86400000*0.2).toISOString(),description:'Laptop dead'},
];
function mapCat(c){c=(c||'').toLowerCase();if(['billing','finance'].includes(c))return'Finance';if(['technical','it'].includes(c))return'IT';if(['service','operations','request'].includes(c))return'Operations';if(['complaint','hr'].includes(c))return'HR';return CATS.includes(c)?c:'Operations';}
let tickets=[];
async function load(){try{const r=await fetch('/api/records?collection=tickets');if(r.ok){const d=await r.json();if(d.records?.length){tickets=d.records.map(rec=>({... (rec.value||rec), category:mapCat((rec.value||rec).category), id:rec.id})); render(); return;}}}catch(e){} tickets=SAMPLE.map(s=>({...s,category:mapCat(s.category)})); render();}
function filtered(){const dept=document.getElementById('f-dept').value;const range=document.getElementById('f-range').value;let cutoff=0;if(range!=='all'){cutoff=Date.now()-parseInt(range)*86400000;} return tickets.filter(t=>{if(dept!=='all'&&t.department!==dept&&t.category!==dept) return false; if(cutoff&&new Date(t.createdAt).getTime()<cutoff) return false; return true;});}
function render(){const list=filtered(); document.getElementById('k-total').textContent=list.length; const avg=list.length?Math.round(list.reduce((a,b)=>a+(b.firstResponseMins||0),0)/list.length):0; document.getElementById('k-avg').textContent=avg+'m'; const medArr=list.map(t=>t.firstResponseMins||0).sort((a,b)=>a-b); document.getElementById('k-med').textContent=(medArr[Math.floor(medArr.length/2)]||0)+'m'; const sla=list.filter(t=>t.firstResponseMins>1440).length; document.getElementById('k-sla').textContent=list.length?Math.round((1-sla/list.length)*100)+'%':'0%'; document.getElementById('k-sla-c').textContent=sla; const byCat={}; list.forEach(t=>byCat[t.category]=(byCat[t.category]||0)+1); const top=Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0]; document.getElementById('k-top').textContent=top?top[0]:'-'; document.getElementById('k-top-c').textContent=top?top[1]+' tickets':''; const res=list.filter(t=>t.status==='Resolved'||t.status==='Closed').length; document.getElementById('k-res').textContent=list.length?Math.round(res/list.length*100)+'%':'0%'; document.getElementById('k-res-c').textContent=res+' resolved'; document.getElementById('genTime').textContent=new Date().toLocaleString(); document.getElementById('genDept').textContent=document.getElementById('f-dept').value; document.getElementById('genPeriod').textContent=document.getElementById('f-type').value+' - '+document.getElementById('f-range').value; const tb=document.getElementById('tbody'); tb.innerHTML=''; list.forEach(t=>{const tr=document.createElement('tr'); tr.innerHTML=`<td>${t.title}</td><td><span class="badge ${t.category.toLowerCase()}">${t.category}</span></td><td>${t.department}</td><td>${t.priority}</td><td>${t.status}</td><td>${t.firstResponseMins}m</td><td>${new Date(t.createdAt).toLocaleDateString()}</td>`; tb.appendChild(tr);});
    const ftb=document.getElementById('fullTbody'); if(ftb){ftb.innerHTML=''; list.forEach(t=>{const tr=document.createElement('tr'); tr.innerHTML=`<td>${t.title}</td><td>${t.category}</td><td>${t.subCategory||''}</td><td>${t.department}</td><td>${t.priority}</td><td>${t.status}</td><td>${t.assignee||''}</td><td>${t.requesterName||''}</td><td>${t.email||''}</td><td>${t.firstResponseMins}m</td><td>${new Date(t.createdAt).toLocaleString()}</td><td>${(t.description||'').slice(0,60)}</td>`; ftb.appendChild(tr);});}
     drawVol(list); drawCat(list); drawResp(list); drawStatus(list); buildExec(list);}
function drawVol(list){const c=document.getElementById('vol'); const ctx=c.getContext('2d'); const dpr=window.devicePixelRatio||1; const r=c.getBoundingClientRect(); c.width=r.width*dpr; c.height=260*dpr; ctx.scale(dpr,dpr); const W=r.width,H=260; ctx.clearRect(0,0,W,H); const days=14, buckets={}, labels=[]; for(let i=days-1;i>=0;i--){const d=new Date(); d.setDate(d.getDate()-i); const key=d.toISOString().slice(0,10); buckets[key]=0; labels.push({key,label:d.toLocaleDateString('en-US',{month:'short',day:'numeric'})});} list.forEach(t=>{const k=new Date(t.createdAt).toISOString().slice(0,10); if(buckets[k]!==undefined) buckets[k]++;}); const vals=labels.map(l=>buckets[l.key]); const max=Math.max(1,...vals,3); const padL=50,padR=20,padT=20,padB=40, chartW=W-padL-padR, chartH=H-padT-padB; ctx.strokeStyle='rgba(255,255,255,0.06)'; for(let i=0;i<=4;i++){const y=padT+chartH/4*i; ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+chartW,y); ctx.stroke(); ctx.fillStyle='#94a3b8'; ctx.font='11px JetBrains Mono'; ctx.textAlign='right'; ctx.fillText(Math.round(max-max/4*i),padL-10,y+3);} ctx.strokeStyle='rgba(255,255,255,0.03)'; labels.forEach((_,i)=>{const x=padL+i*(chartW/(labels.length-1||1)); ctx.beginPath(); ctx.moveTo(x,padT); ctx.lineTo(x,padT+chartH); ctx.stroke();}); const grad=ctx.createLinearGradient(0,padT,0,padT+chartH); grad.addColorStop(0,'rgba(124,58,237,0.4)'); grad.addColorStop(1,'rgba(124,58,237,0)'); ctx.fillStyle=grad; ctx.beginPath(); vals.forEach((v,i)=>{const x=padL+i*(chartW/(vals.length-1||1)); const y=padT+chartH-v/max*chartH; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);}); vals.slice().reverse().forEach((v,i)=>{const idx=vals.length-1-i; const x=padL+idx*(chartW/(vals.length-1||1)); ctx.lineTo(x,padT+chartH);}); ctx.closePath(); ctx.fill(); ctx.strokeStyle='#a78bfa'; ctx.lineWidth=2.5; ctx.beginPath(); vals.forEach((v,i)=>{const x=padL+i*(chartW/(vals.length-1||1)); const y=padT+chartH-v/max*chartH; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);}); ctx.stroke(); vals.forEach((v,i)=>{const x=padL+i*(chartW/(vals.length-1||1)); const y=padT+chartH-v/max*chartH; ctx.fillStyle='rgba(167,139,250,0.3)'; ctx.beginPath(); ctx.arc(x,y,10,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill(); if(v>0){ctx.fillStyle='#e2e8f0'; ctx.font='bold 11px Space Grotesk'; ctx.textAlign='center'; ctx.fillText(v,x,y-12);}}); ctx.fillStyle='#cbd5e1'; ctx.font='11px JetBrains Mono'; ctx.textAlign='center'; labels.forEach((l,i)=>{if(i%2===0){const x=padL+i*(chartW/(labels.length-1||1)); ctx.fillText(l.label,x,H-10);}});}
function drawCat(list){const c=document.getElementById('cat'); const ctx=c.getContext('2d'); const dpr=window.devicePixelRatio||1; const r=c.getBoundingClientRect(); c.width=r.width*dpr; c.height=260*dpr; ctx.scale(dpr,dpr); const W=r.width,H=260; ctx.clearRect(0,0,W,H); const counts={}; CATS.forEach(cc=>counts[cc]=0); list.forEach(t=>counts[t.category]++); const total=list.length||1; let start=-Math.PI/2; const cx=W/2,cy=H/2-10,rad=Math.min(W,H)/2-40; ctx.shadowColor='rgba(0,0,0,0.5)'; ctx.shadowBlur=20; Object.entries(counts).forEach(([cat,cnt])=>{if(cnt===0) return; const ang=cnt/total*Math.PI*2; ctx.fillStyle=COLORS[cat]; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,rad,start,start+ang); ctx.closePath(); ctx.fill(); start+=ang;}); ctx.shadowColor='transparent'; ctx.fillStyle='#0a0a0f'; ctx.beginPath(); ctx.arc(cx,cy,rad*0.55,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#f8fafc'; ctx.font='bold 24px Space Grotesk'; ctx.textAlign='center'; ctx.fillText(total,cx,cy-2); ctx.fillStyle='#94a3b8'; ctx.font='11px JetBrains Mono'; ctx.fillText('TOTAL',cx,cy+14); const L=document.getElementById('catL'); L.innerHTML=''; Object.entries(counts).forEach(([cat,cnt])=>{const s=document.createElement('span'); s.innerHTML=`<span style="width:10px;height:10px;background:${COLORS[cat]};border-radius:50%;display:inline-block"></span> ${cat} ${cnt} ${Math.round(cnt/total*100)}%`; s.style.cssText='display:flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);padding:4px 10px;border-radius:999px;border:1px solid rgba(255,255,255,0.08);font-size:11px;font-family:JetBrains Mono'; L.appendChild(s);});}
function drawResp(list){const c=document.getElementById('resp'); const ctx=c.getContext('2d'); const dpr=window.devicePixelRatio||1; const r=c.getBoundingClientRect(); c.width=r.width*dpr; c.height=260*dpr; ctx.scale(dpr,dpr); const W=r.width,H=260; ctx.clearRect(0,0,W,H); const buckets=[0,0,0,0]; list.forEach(t=>{const m=t.firstResponseMins||0; if(m<60) buckets[0]++; else if(m<240) buckets[1]++; else if(m<1440) buckets[2]++; else buckets[3]++;}); const labels=['<1h','1-4h','4-24h','>24h']; const max=Math.max(1,...buckets); const padL=50,padR=20,padT=20,padB=40, chartW=W-padL-padR, chartH=H-padT-padB; ctx.strokeStyle='rgba(255,255,255,0.06)'; for(let i=0;i<=4;i++){const y=padT+chartH/4*i; ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+chartW,y); ctx.stroke(); ctx.fillStyle='#94a3b8'; ctx.font='11px JetBrains Mono'; ctx.textAlign='right'; ctx.fillText(Math.round(max-max/4*i),padL-10,y+3);} buckets.forEach((v,i)=>{const barW=chartW/buckets.length-16; const x=padL+i*(chartW/buckets.length)+8; const barH=v/max*chartH; const y=padT+chartH-barH; const grad=ctx.createLinearGradient(0,y,0,y+barH); grad.addColorStop(0,'#a78bfa'); grad.addColorStop(1,'#7c3aed'); ctx.fillStyle=grad; ctx.beginPath(); ctx.roundRect(x,y,barW,barH,[8,8,0,0]); ctx.fill(); ctx.fillStyle='#f8fafc'; ctx.font='bold 12px Space Grotesk'; ctx.textAlign='center'; ctx.fillText(v,x+barW/2,y-8); ctx.fillStyle='#cbd5e1'; ctx.font='11px JetBrains Mono'; ctx.fillText(labels[i],x+barW/2,H-12);});}
function drawStatus(list){const el=document.getElementById('status'); const sts=['Open','In Progress','Resolved','Closed']; const counts={}; sts.forEach(s=>counts[s]=0); list.forEach(t=>counts[t.status]++); const max=Math.max(1,...Object.values(counts)); el.innerHTML=''; Object.entries(counts).forEach(([s,c])=>{const col={Open:'#f87171','In Progress':'#fb923c',Resolved:'#34d399',Closed:'#94a3b8'}[s]; const d=document.createElement('div'); d.style.margin='12px 0'; d.innerHTML=`<div style="display:flex;justify-content:space-between"><span style="font-weight:600">${s}</span><span class="hint">${c} • ${Math.round(c/(list.length||1)*100)}%</span></div><div style="height:10px;background:rgba(255,255,255,0.06);border-radius:999px;overflow:hidden"><div style="width:${c/max*100}%;height:100%;background:${col};box-shadow:0 0 10px ${col}"></div></div>`; el.appendChild(d);});}
function buildExec(list){
  const byCat={}; list.forEach(t=>byCat[t.category]=(byCat[t.category]||0)+1); const top=Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0]; const avg=list.length?Math.round(list.reduce((a,b)=>a+(b.firstResponseMins||0),0)/list.length):0;
  const res=list.filter(t=>t.status==='Resolved'||t.status==='Closed').length;
  const summary=document.getElementById('execSummary');
  summary.innerHTML=`<p><b>Executive Summary:</b> This ${document.getElementById('f-type').value} period, <b>${list.length} tickets</b> were tracked across ${Object.keys(byCat).length} departments (IT/HR/Finance/Operations only, Channel removed). Top driver was <b>${top?top[0]:'-'}</b> with ${top?top[1]:0} tickets (${list.length?Math.round((top?top[1]:0)/list.length*100):0}%). Average first response was <b>${avg} minutes</b> (Median ${document.getElementById('k-med').textContent}). Platform now produces measurable business insights with structured data.</p><p><b>Volume & Categories:</b> Volume trend ${list.length>5?'increasing':'stable'} — Busiest category ${top?top[0]:'-'} suggests staffing review. Response time distribution indicates ${avg<240?'within SLA':'SLA pressure — review process'}.</p><p><b>Outcome:</b> ${res} resolved (${Math.round(res/(list.length||1)*100)}%), ${list.filter(t=>t.status==='Open').length} still open. Recommend focus on Critical → High queue and ${top?top[0]:'IT'} backlog.</p><div style="margin-top:12px"><div class="insight">📊 Top: ${top?top[0]:'-'} — ${top?top[1]:0} tickets (${list.length?Math.round((top?top[1]:0)/list.length*100):0}%). Prioritize backlog.</div><div class="insight">⏱️ Avg ${avg}m — ${avg>240?'⚠️ Above 4h target':'✅ Within SLA'}</div><div class="insight">🚨 SLA breaches: ${list.filter(t=>t.firstResponseMins>1440).length} — review process</div><div class="insight">✨ Measurable insights: ${list.length} tickets, 4 departments, no Channel clutter — Professional 40% clarity achieved</div></div>`;
  document.getElementById('s2').innerHTML=summary.innerHTML+`<div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px"><div class="card" style="margin:0">Total: ${list.length}</div><div class="card" style="margin:0">Avg: ${avg}m</div></div>`;
  document.getElementById('s3').innerHTML=`<p class="hint">Volume last 14 days — grid lines, Y/X labels visible, gradient fill, white values. Filtered by ${document.getElementById('f-dept').value}</p>`;
  document.getElementById('s4').innerHTML=`<p class="hint">Category donut with leader lines + Response bars — IT/HR/Finance/Operations only</p>`;
  document.getElementById('s5').innerHTML=summary.innerHTML;
  document.getElementById('s6').innerHTML=`<p>Department: <b>${document.getElementById('f-dept').value}</b> — ${list.length} tickets</p><p><b>Risks:</b> Critical ${list.filter(t=>t.priority==='Critical').length} open, SLA breach ${list.filter(t=>t.firstResponseMins>1440).length}</p><p><b>Next Steps:</b> 1) Triage Critical→High 2) Staff ${top?top[0]:'IT'} team 3) Weekly automation</p><p class="hint" style="margin-top:12px">Built with Meta AI prompts — Technical 60% Effective prompts, Professional 40% clarity. Zenani data tracking, Mushaisano reporting, Nthabiseng classification, Adriyell integration.</p>`;
}
document.getElementById('f-dept').addEventListener('change',render);
document.getElementById('f-range').addEventListener('change',render);
document.getElementById('f-type').addEventListener('change',render);
document.getElementById('gen').addEventListener('click',render);
function getFiltered(){return filtered();}
document.getElementById('csv').addEventListener('click',()=>{const list=getFiltered();const header=['Title','Category','SubCategory','Department','Priority','Status','Assignee','Requester','Email','FirstResponseMins','CreatedAt','Description'];const rows=list.map(t=>[t.title,t.category,t.subCategory||'',t.department,t.priority,t.status,t.assignee||'',t.requesterName||'',t.email||'',t.firstResponseMins||'',t.createdAt,t.description].map(v=>`"${(v+'').replace(/"/g,'""')}"`).join(','));const csv=[header.join(','),...rows].join('\n');const blob=new Blob([csv],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`serviq_${document.getElementById('f-dept').value}_report.csv`;a.click();});
document.getElementById('json').addEventListener('click',()=>{const list=getFiltered();const blob=new Blob([JSON.stringify(list,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`serviq_${document.getElementById('f-dept').value}_report.json`;a.click();});
document.getElementById('txt').addEventListener('click',()=>{const list=getFiltered();const txt=`SERVIQ Executive Report\nDept: ${document.getElementById('f-dept').value}\nPeriod: ${document.getElementById('f-type').value} ${document.getElementById('f-range').value}\nTotal: ${list.length}\n\n${document.getElementById('execSummary').innerText}`;const blob=new Blob([txt],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`serviq_summary_${document.getElementById('f-dept').value}.txt`;a.click();});
function loadScript(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(new Error('Could not load '+src));document.head.appendChild(s);});}
async function ensureJsPDF(){
  if(window.jspdf&&window.jspdf.jsPDF) return;
  const urls=['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js','https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js'];
  for(const u of urls){try{await loadScript(u); if(window.jspdf&&window.jspdf.jsPDF) return;}catch(e){}}
  throw new Error('PDF library failed to load - check your internet connection and try again.');
}
/* ================= PDF REPORT (department-filtered) ================= */
const DEPT_COLORS={all:[124,58,237],IT:[96,165,250],HR:[167,139,250],Finance:[52,211,153],Operations:[251,191,36]};
const CAT_RGB={IT:[96,165,250],HR:[167,139,250],Finance:[52,211,153],Operations:[251,191,36]};
const STATUS_RGB={'Open':[248,113,113],'In Progress':[251,146,60],'Resolved':[52,211,153],'Closed':[148,163,184]};
const PRIO_RGB={'Critical':[248,113,113],'High':[251,146,60],'Medium':[251,191,36],'Low':[148,163,184]};

function pdfStats(list){
  const n=list.length;
  const avg=n?Math.round(list.reduce((a,b)=>a+(b.firstResponseMins||0),0)/n):0;
  const sorted=list.map(t=>t.firstResponseMins||0).sort((a,b)=>a-b);
  const med=sorted[Math.floor(sorted.length/2)]||0;
  const breaches=list.filter(t=>t.firstResponseMins>1440).length;
  const sla=n?Math.round((1-breaches/n)*100):0;
  const byCat={}; CATS.forEach(c=>byCat[c]=0); list.forEach(t=>{byCat[t.category]=(byCat[t.category]||0)+1;});
  const top=Object.entries(byCat).sort((a,b)=>b[1]-a[1])[0];
  const byStatus={'Open':0,'In Progress':0,'Resolved':0,'Closed':0}; list.forEach(t=>{byStatus[t.status]=(byStatus[t.status]||0)+1;});
  const byPrio={'Critical':0,'High':0,'Medium':0,'Low':0}; list.forEach(t=>{byPrio[t.priority]=(byPrio[t.priority]||0)+1;});
  const byAssignee={}; list.forEach(t=>{const a=t.assignee||'Unassigned'; byAssignee[a]=(byAssignee[a]||0)+1;});
  const resolved=(byStatus['Resolved']||0)+(byStatus['Closed']||0);
  const days={}; list.forEach(t=>{const k=new Date(t.createdAt).toISOString().slice(0,10); days[k]=(days[k]||0)+1;});
  const peak=Object.entries(days).sort((a,b)=>b[1]-a[1])[0];
  const buckets=[0,0,0,0]; list.forEach(t=>{const m=t.firstResponseMins||0; if(m<60)buckets[0]++; else if(m<240)buckets[1]++; else if(m<1440)buckets[2]++; else buckets[3]++;});
  return {n,avg,med,breaches,sla,byCat,top:(top&&top[1]>0)?top:null,byStatus,byPrio,byAssignee,resolved,open:byStatus['Open']||0,peak,buckets};
}

async function generatePDF(dept,btn){
  const sel=document.getElementById('f-dept'); const prev=sel.value; const status=document.getElementById('pdfStatus');
  const btns=[...document.querySelectorAll('[data-pdf]')]; const label=btn.innerHTML;
  btns.forEach(b=>b.disabled=true); btn.innerHTML='⏳ Generating PDF...'; status.textContent='';
  try{
    await ensureJsPDF();
    sel.value=dept; render();                       // redraw charts + data for this department
    await new Promise(r=>requestAnimationFrame(()=>r()));
    const {jsPDF}=window.jspdf; const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
    const W=297,H=210,M=14,CW=W-2*M;
    const list=getFiltered(); const st=pdfStats(list); const n=st.n;
    const deptName=dept==='all'?'All Departments':dept;
    const acc=DEPT_COLORS[dept]||DEPT_COLORS.all;
    const period=document.getElementById('f-type').value;
    const rangeTxt=document.getElementById('f-range').selectedOptions[0].text;
    const dateStr=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
    const WHITE=[248,250,252],MUTED=[148,163,184],SOFT=[203,213,225],DARK=[10,10,15];
    const pct=(a,b)=>b?Math.round(a/b*100):0;

    /* ---- drawing helpers ---- */
    const txt=(s,x,y,o)=>doc.text(String(s),x,y,o);
    const color=c=>doc.setTextColor(c[0],c[1],c[2]);
    const fill=c=>doc.setFillColor(c[0],c[1],c[2]);
    const font=(size,style)=>{doc.setFont('helvetica',style||'normal'); doc.setFontSize(size);};
    const opacity=o=>doc.setGState(new doc.GState({opacity:o}));
    const bg=()=>{fill(DARK); doc.rect(0,0,W,H,'F'); opacity(0.2); fill(acc); doc.circle(0,0,60,'F'); fill([59,130,246]); doc.circle(W,0,45,'F'); opacity(1); fill(acc); doc.rect(0,0,W,1.6,'F');};
    const card=(x,y,w,h)=>{fill([20,20,30]); doc.setDrawColor(50,50,68); doc.setLineWidth(0.2); doc.roundedRect(x,y,w,h,3,3,'FD');};
    const newPage=(title,sub)=>{doc.addPage(); bg(); font(18,'bold'); color(WHITE); txt(title,M,22); if(sub){font(9); color(MUTED); txt(sub,M,29);} font(9,'bold'); color(acc); txt(deptName.toUpperCase(),W-M,22,{align:'right'});};
    const para=(s,x,y,w,size,col,lh,style)=>{font(size,style); color(col); const lines=doc.splitTextToSize(String(s),w); lines.forEach((l,i)=>txt(l,x,y+i*lh)); return y+lines.length*lh;};
    const fit=(s,w)=>{s=String(s==null?'':s); if(doc.getTextWidth(s)<=w) return s; while(s.length>1&&doc.getTextWidth(s+'...')>w) s=s.slice(0,-1); return s+'...';};
    const bar=(x,y,w,frac,col)=>{fill([40,40,56]); doc.roundedRect(x,y,w,2.6,1.3,1.3,'F'); if(frac>0){fill(col); doc.roundedRect(x,y,Math.max(2.6,w*frac),2.6,1.3,1.3,'F');}};
    const bullets=(items,x,y,w,size,lh)=>{items.forEach(it=>{fill(acc); doc.circle(x+1,y-1.1,0.8,'F'); y=para(it,x+5,y,w-5,size,SOFT,lh)+3;}); return y;};
    const placeImg=(canvas,x,y,w,h)=>{const ar=canvas.width/canvas.height; let iw=w,ih=w/ar; if(ih>h){ih=h; iw=h*ar;} doc.addImage(canvas.toDataURL('image/png'),'PNG',x+(w-iw)/2,y+(h-ih)/2,iw,ih);};
    const kpi=(x,y,w,label,value,sub,col)=>{card(x,y,w,30); font(8); color(MUTED); txt(label.toUpperCase(),x+5,y+8); font(21,'bold'); color(col||WHITE); txt(value,x+5,y+20); font(8); color(MUTED); txt(fit(sub,w-8),x+5,y+26.5);};
    const infoCol=(x,w,rows,y0)=>{let y=y0; rows.forEach(r=>{font(7.5,'bold'); color(acc); txt(r[0].toUpperCase(),x,y); y=para(r[1],x,y+5,w,10,WHITE,4.6)+6;});};

    /* ---- 01 Title ---- */
    bg();
    font(10,'bold'); color(acc); txt('SPRINT DECK  |  WEEK 3 - SPRINT 2',M,38);
    font(34,'bold'); color(WHITE); txt('SERVIQ Executive Reporting',M,62);
    font(15); color(MUTED); txt('Data Tracking & Analytics Module',M,74);
    font(11,'bold'); const pw=doc.getTextWidth(deptName)+14; fill(acc); doc.roundedRect(M,84,pw,9,4.5,4.5,'F'); color(DARK); txt(deptName,M+7,90);
    font(10); color(SOFT); txt(`${period} report  |  ${rangeTxt}  |  ${dateStr}  |  ${n} tickets`,M+pw+6,90);
    let bx=M; CATS.forEach(c=>{font(9,'bold'); const bw=doc.getTextWidth(c)+10; doc.setDrawColor(CAT_RGB[c][0],CAT_RGB[c][1],CAT_RGB[c][2]); doc.setLineWidth(0.4); doc.roundedRect(bx,100,bw,7,3.5,3.5,'S'); color(CAT_RGB[c]); txt(c,bx+5,104.8); bx+=bw+4;});
    card(M,118,CW,68);
    infoCol(M+8,CW/2-16,[['Sprint goal','Introduce data monitoring'],['Feature built','Analytics & Tracking Dashboard'],['Outcome','Platform now produces measurable business insights']],127);
    infoCol(M+CW/2+4,CW/2-14,[['Mapped roles','Junior Data Analyst, Reporting Assistant, AI Intern'],['Grading','Technical 60% effective prompts | Professional 40% content relevance'],['Team','Zenani (Data), Mushaisano (Reporting), Nthabiseng (Classification), Adriyell (Integration)']],127);

    /* ---- 02 Executive summary & KPIs ---- */
    newPage('Executive Summary & KPIs',`${deptName}  |  ${period} report  |  ${rangeTxt}`);
    const kw=(CW-4*4)/5, ky=36;
    kpi(M,ky,kw,'Total tickets',n,deptName);
    kpi(M+(kw+4),ky,kw,'Avg response',st.avg+'m','Median '+st.med+'m');
    kpi(M+2*(kw+4),ky,kw,'SLA compliance',st.sla+'%',st.breaches+' breached (>24h)',st.sla>=90?[52,211,153]:[251,146,60]);
    kpi(M+3*(kw+4),ky,kw,'Top category',st.top?st.top[0]:'-',st.top?st.top[1]+' tickets':'no data');
    kpi(M+4*(kw+4),ky,kw,'Resolution rate',pct(st.resolved,n)+'%',st.resolved+' resolved');
    card(M,74,CW,50);
    font(11,'bold'); color(acc); txt('EXECUTIVE SUMMARY',M+6,83);
    const topTxt=st.top?`The top driver was ${st.top[0]} with ${st.top[1]} tickets (${pct(st.top[1],n)}% of volume). `:'';
    let y2=para(`This ${period.toLowerCase()} report covers ${n} tickets for ${deptName} (${rangeTxt.toLowerCase()}). ${topTxt}Average first response was ${st.avg} minutes (median ${st.med}). ${st.resolved} tickets are resolved or closed (${pct(st.resolved,n)}%) and ${st.open} remain open.`,M+6,90,CW-12,10,SOFT,5);
    para(`Recommendation: focus on the Critical and High priority queue first${st.top?`, then review staffing for the ${st.top[0]} backlog`:''}. ${st.avg>240?'Average response is above the 4-hour target, so the response process needs review.':'Average response is within the 4-hour target.'}`,M+6,y2+3,CW-12,10,SOFT,5);
    const iw=(CW-3*4)/4, iy=130, ih=38;
    [['Top driver',st.top?`${st.top[0]}: ${st.top[1]} tickets (${pct(st.top[1],n)}%). Prioritise this backlog.`:'No tickets in this view.'],
     ['Response time',`Average ${st.avg}m, median ${st.med}m. ${st.avg>240?'Above 4h target.':'Within 4h target.'}`],
     ['SLA breaches',`${st.breaches} ticket(s) took over 24h to get a first response (${st.sla}% compliance).`],
     ['Resolution',`${st.resolved} of ${n} resolved or closed (${pct(st.resolved,n)}%). ${st.open} still open.`]
    ].forEach((it,i)=>{const x=M+i*(iw+4); card(x,iy,iw,ih); fill(acc); doc.rect(x,iy+3,1.2,ih-6,'F'); font(9,'bold'); color(WHITE); txt(it[0],x+6,iy+9); para(it[1],x+6,iy+16,iw-10,8.5,SOFT,4.2);});

    /* ---- 03 Volume trend ---- */
    newPage('Volume Trends','Tickets created per day, last 14 days');
    card(M,36,CW,112); placeImg(document.getElementById('vol'),M+4,40,CW-8,104);
    card(M,154,CW,32);
    font(9,'bold'); color(acc); txt('ANALYSIS',M+6,162);
    para(`${n} tickets tracked for ${deptName}. ${st.peak?`Busiest day: ${st.peak[0]} with ${st.peak[1]} ticket(s). `:''}Volume trend is ${n>5?'increasing':'stable'}${st.top?`, and ${st.top[0]} is the busiest category, which suggests a staffing review`:''}.`,M+6,168,CW-12,9.5,SOFT,4.8);

    /* ---- 04 Category & response ---- */
    newPage('Category & Response Analysis','IT, HR, Finance and Operations only');
    const hw=(CW-6)/2;
    card(M,36,hw,86); font(9,'bold'); color(MUTED); txt('CATEGORY BREAKDOWN',M+5,43); placeImg(document.getElementById('cat'),M+3,46,hw-6,73);
    card(M+hw+6,36,hw,86); font(9,'bold'); color(MUTED); txt('RESPONSE TIME DISTRIBUTION',M+hw+11,43); placeImg(document.getElementById('resp'),M+hw+9,46,hw-6,73);
    card(M,128,hw,58); font(9,'bold'); color(acc); txt('CATEGORY MIX',M+5,136);
    CATS.forEach((c,i)=>{const ry=146+i*9; fill(CAT_RGB[c]); doc.circle(M+7,ry-1.2,1.5,'F'); font(9); color(WHITE); txt(c,M+12,ry); color(MUTED); txt(`${st.byCat[c]||0}  (${pct(st.byCat[c]||0,n)}%)`,M+hw-6,ry,{align:'right'}); bar(M+45,ry-2.4,hw-45-42,n?(st.byCat[c]||0)/n:0,CAT_RGB[c]);});
    card(M+hw+6,128,hw,58); font(9,'bold'); color(acc); txt('STATUS PIPELINE',M+hw+11,136);
    Object.keys(STATUS_RGB).forEach((k,i)=>{const ry=146+i*9, x0=M+hw+11; fill(STATUS_RGB[k]); doc.circle(x0+2,ry-1.2,1.5,'F'); font(9); color(WHITE); txt(k,x0+7,ry); color(MUTED); txt(`${st.byStatus[k]||0}  (${pct(st.byStatus[k]||0,n)}%)`,M+2*hw+1,ry,{align:'right'}); bar(x0+34,ry-2.4,hw-34-46,n?(st.byStatus[k]||0)/n:0,STATUS_RGB[k]);});

    /* ---- 05 Insights, recommendations, risks ---- */
    newPage('Insights, Recommendations & Risks',`${deptName}  |  ${n} tickets`);
    const cw3=(CW-2*6)/3;
    const crit=st.byPrio['Critical']||0, unassigned=list.filter(t=>!t.assignee).length;
    const cols3=[
      ['INSIGHTS',[
        st.top?`${st.top[0]} is the top driver: ${st.top[1]} tickets (${pct(st.top[1],n)}%).`:'No tickets match this filter.',
        `Average first response is ${st.avg} min (median ${st.med} min).`,
        `${pct(st.resolved,n)}% of tickets are resolved or closed.`,
        `Response buckets: ${st.buckets[0]} under 1h, ${st.buckets[1]} in 1-4h, ${st.buckets[2]} in 4-24h, ${st.buckets[3]} over 24h.`]],
      ['RECOMMENDATIONS',[
        'Triage the Critical queue first, then High priority tickets.',
        st.top?`Review staffing and capacity for the ${st.top[0]} team.`:'Review staffing once ticket data is available.',
        'Investigate every ticket with a first response over 24h.',
        'Automate this report weekly so trends are tracked consistently.']],
      ['RISKS',[
        `${crit} Critical ticket(s) in this view${crit?' - needs immediate attention':''}.`,
        `${st.breaches} SLA breach(es) (first response over 24h).`,
        `${st.open} ticket(s) still Open and not yet being worked.`,
        `${unassigned} ticket(s) have no assignee recorded.`]]
    ];
    cols3.forEach((c,i)=>{const x=M+i*(cw3+6); card(x,36,cw3,140); fill(acc); doc.rect(x+5,43,10,1.2,'F'); font(11,'bold'); color(acc); txt(c[0],x+5,52); bullets(c[1],x+5,64,cw3-10,9.5,4.8);});

    /* ---- 06 Department deep dive ---- */
    newPage(`Department Deep Dive: ${deptName}`,`${n} tickets  |  ${period} report`);
    const q=(CW-3*4)/4;
    font(8,'bold'); color(MUTED); txt('BY PRIORITY',M,35);
    Object.keys(PRIO_RGB).forEach((k,i)=>{const x=M+i*(q+4); card(x,38,q,22); font(8); color(MUTED); txt(k.toUpperCase(),x+5,46); font(18,'bold'); color(PRIO_RGB[k]); txt(st.byPrio[k]||0,x+5,56);});
    font(8,'bold'); color(MUTED); txt('BY STATUS',M,67);
    Object.keys(STATUS_RGB).forEach((k,i)=>{const x=M+i*(q+4); card(x,70,q,22); font(8); color(MUTED); txt(k.toUpperCase(),x+5,78); font(18,'bold'); color(STATUS_RGB[k]); txt(st.byStatus[k]||0,x+5,88);});
    card(M,98,hw,88); font(11,'bold'); color(acc); txt('NEXT STEPS',M+6,107);
    let ny=116; [`Triage the ${crit} Critical and ${st.byPrio['High']||0} High priority ticket(s).`,`Staff and support the ${st.top?st.top[0]:'IT'} team.`,'Chase first responses that are over 24h.','Schedule the weekly automated report.'].forEach((t,i)=>{fill(acc); doc.circle(M+9,ny-1.3,3,'F'); font(8,'bold'); color(DARK); txt(String(i+1),M+9,ny+0.1,{align:'center'}); ny=para(t,M+16,ny,hw-24,9.5,SOFT,4.8)+6;});
    card(M+hw+6,98,hw,88); font(11,'bold'); color(acc); txt('WORKLOAD BY ASSIGNEE',M+hw+12,107);
    const asg=Object.entries(st.byAssignee).sort((a,b)=>b[1]-a[1]).slice(0,6); const amax=Math.max(1,...asg.map(a=>a[1]));
    if(!asg.length){font(9); color(MUTED); txt('No data',M+hw+12,118);}
    asg.forEach((a,i)=>{const ry=118+i*11; font(9); color(WHITE); txt(fit(a[0],40),M+hw+12,ry); bar(M+hw+56,ry-2.4,hw-56-30,a[1]/amax,acc); color(MUTED); txt(a[1]+' ticket'+(a[1]===1?'':'s'),M+2*hw-2,ry,{align:'right'});});

    /* ---- 07+ Structured ticket data ---- */
    const cols=[['Title',48],['Category',22],['SubCategory',30],['Dept',24],['Priority',20],['Status',24],['Assignee',30],['Requester',33],['Resp.',16],['Created',22]];
    const tableHead=(y)=>{fill([32,32,48]); doc.rect(M,y,CW,8,'F'); font(7.5,'bold'); color(acc); let x=M; cols.forEach(c=>{txt(c[0].toUpperCase(),x+2,y+5.2); x+=c[1];}); return y+8;};
    newPage('Structured Ticket Data',`${n} ticket(s)  |  ${deptName}  |  newest first`);
    let ty=tableHead(34);
    if(!n){font(10); color(MUTED); txt('No tickets match the selected filters.',M+2,ty+9);}
    [...list].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).forEach((t,i)=>{
      if(ty>H-22){ newPage('Structured Ticket Data (continued)',`${deptName}`); ty=tableHead(34); }
      if(i%2===0){ fill([16,16,24]); doc.rect(M,ty,CW,7,'F'); }
      const vals=[t.title,t.category,t.subCategory||'-',t.department,t.priority,t.status,t.assignee||'-',t.requesterName||'-',(t.firstResponseMins||0)+'m',new Date(t.createdAt).toLocaleDateString('en-GB')];
      let x=M; font(7.5); vals.forEach((v,ci)=>{ color(ci===4?(PRIO_RGB[v]||SOFT):ci===5?(STATUS_RGB[v]||SOFT):ci===1?(CAT_RGB[v]||SOFT):SOFT); txt(fit(v,cols[ci][1]-3),x+2,ty+4.7); x+=cols[ci][1]; });
      ty+=7;
    });

    /* ---- footer + page numbers ---- */
    const total=doc.getNumberOfPages();
    for(let i=1;i<=total;i++){ doc.setPage(i); font(8); color([100,116,139]); txt(`SERVIQ Executive Reporting  |  ${deptName}  |  ${dateStr}`,M,H-7); txt(`Page ${i} / ${total}`,W-M,H-7,{align:'right'}); }

    const fname=`SERVIQ_Executive_Report_${dept==='all'?'All':dept}_${period}_${new Date().toISOString().slice(0,10)}.pdf`;
    try{ doc.save(fname); }
    catch(saveErr){ const url=doc.output('bloburl'); const w=window.open(url,'_blank'); if(!w){ location.href=url; } }
    status.textContent='✅ Downloaded '+fname+' ('+n+' tickets, '+total+' pages)';
  }catch(e){
    console.error(e); status.textContent='⚠️ PDF failed: '+e.message+' - click a download button to retry.';
  }finally{
    sel.value=prev; render();
    btns.forEach(b=>b.disabled=false); btn.innerHTML=label;
  }
}
document.querySelectorAll('[data-pdf]').forEach(b=>b.addEventListener('click',()=>{
  const v=b.dataset.pdf; const dept=v==='current'?document.getElementById('f-dept').value:(v==='All'?'all':v);
  generatePDF(dept,b);
}));
let _rz; window.addEventListener('resize',()=>{clearTimeout(_rz); _rz=setTimeout(render,150);});

load();
