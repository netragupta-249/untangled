import { useState, useEffect } from "react";
import SignInPage from "../sign";
import { Show } from "@clerk/react";

// ─── Semantic color system ─────────────────────────────────────────────────────
// Coral   #E8674A  → Urgent / deadline / immediate
// Peach   #F09060  → Important
// Yellow  #F0BC3A  → Upcoming
// Mint    #52B788  → Completed / confirmed / no action
// Blue    #4A90E0  → Info / schedule
// Lavender#8B6FE8  → Opportunity / AI / discovery
// Cream   #F8F4EE  → Neutral

type Screen = "welcome"|"personal"|"sources"|"processing"|"dash"|"detail"|"conflict"|"opps"|"updates"|"info-gap";
type NavItem = "overview"|"action"|"schedule"|"opps"|"updates";
type Priority = "urgent"|"important"|"upcoming"|"opportunity"|"missing"|"action";

// ─── Tokens ───────────────────────────────────────────────────────────────────
const P: Record<Priority,{bg:string;text:string;border:string;label:string;dot?:string}> = {
  urgent:      {bg:"#FEF0ED",text:"#E8674A",border:"#F8C4B8",label:"Urgent",dot:"#E8674A"},
  important:   {bg:"#FEF5EE",text:"#F09060",border:"#F8D4C0",label:"High Priority",dot:"#F09060"},
  upcoming:    {bg:"#FEFAEE",text:"#C49030",border:"#F5E4A8",label:"Upcoming",dot:"#F0BC3A"},
  opportunity: {bg:"#F2EEFE",text:"#8B6FE8",border:"#C8BCE8",label:"Opportunity",dot:"#8B6FE8"},
  missing:     {bg:"#FFFAEC",text:"#9B7A20",border:"#F0E0A0",label:"Missing Info"},
  action:      {bg:"#EEF4FE",text:"#4A90E0",border:"#B8D0F8",label:"Action",dot:"#4A90E0"},
};

// ─── Shared components ────────────────────────────────────────────────────────
function Logo({ sm }: { sm?: boolean }) {
  return (
    <div className={`flex items-center gap-2 flex-shrink-0`}>
      <div className={`rounded-2xl flex items-center justify-center ${sm?"w-8 h-8":"w-10 h-10"}`}
        style={{background:"linear-gradient(135deg,#E8674A 0%,#8B6FE8 100%)"}}>
        <svg width={sm?15:19} height={sm?15:19} viewBox="0 0 20 20" fill="none">
          <path d="M5.5 7c0-1.2 1-2 2.5-2h4c1.5 0 2.5.8 2.5 2M5.5 13c0 1.2 1 2 2.5 2h4c1.5 0 2.5-.8 2.5-2M6 10h8" stroke="white" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      </div>
      <span className={`font-['DM_Serif_Display',serif] tracking-tight text-[#1C1917] ${sm?"text-lg":"text-2xl"}`}>Untangled</span>
    </div>
  );
}

function Badge({p,sm}:{p:Priority;sm?:boolean}) {
  const t = P[p];
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full border ${sm?"text-[10px] px-2 py-0.5":"text-xs px-2.5 py-1"}`}
      style={{background:t.bg,color:t.text,borderColor:t.border}}>
      {t.dot&&<span className={`rounded-full flex-shrink-0 ${p==="urgent"?"animate-pulse":""}`} style={{width:sm?5:6,height:sm?5:6,background:t.dot}}/>}
      {t.label}
    </span>
  );
}

function Chip({name,color}:{name:string;color?:string}) {
  return (
    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border"
      style={{background:(color||"#8B8B8B")+"15",color:color||"#8B8B8B",borderColor:(color||"#8B8B8B")+"30"}}>
      {name}
    </span>
  );
}

function GradBtn({children,onClick,full,sm}:{children:React.ReactNode;onClick?:()=>void;full?:boolean;sm?:boolean}) {
  return (
    <button onClick={onClick}
      className={`${full?"w-full":""} ${sm?"px-5 py-2.5 text-sm":"px-8 py-4 text-base"} font-semibold rounded-2xl text-white transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]`}
      style={{background:"linear-gradient(135deg,#E8674A 0%,#C84A30 100%)",boxShadow:"0 4px 16px rgba(232,103,74,0.35)"}}>
      {children}
    </button>
  );
}

// Card wrapper
function C({children,className="",style={}}:{children:React.ReactNode;className?:string;style?:React.CSSProperties}) {
  return (
    <div className={`bg-white rounded-3xl border border-[#EDE7DF] shadow-[0_2px_12px_rgba(0,0,0,0.06)] ${className}`} style={style}>
      {children}
    </div>
  );
}

// ─── SCREEN 1: Welcome ─────────────────────────────────────────────────────────
function Welcome({go}:{go:()=>void}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <nav className="px-14 py-5 flex items-center justify-between">
        <Logo/>
        <div className="flex items-center gap-6 text-sm font-medium text-[#8A8078]">
          <a className="hover:text-[#1C1917] transition-colors cursor-pointer">How it works</a>
          <a className="hover:text-[#1C1917] transition-colors cursor-pointer">For students</a>
          <button onClick={go} className="px-5 py-2.5 rounded-xl bg-[#1C1917] text-white hover:bg-[#2C2921] transition-colors">
            Sign in
          </button>
        </div>
      </nav>

      <div className="flex-1 flex items-center px-14 gap-10 max-w-[1440px] mx-auto w-full pb-10">
        {/* LEFT */}
        <div className="flex-1 max-w-[540px]">
          <div className="inline-flex items-center gap-2 border border-[#F8C4B8] rounded-full px-4 py-1.5 mb-8 text-xs font-semibold tracking-widest" style={{background:"#FEF0ED",color:"#E8674A"}}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8674A] animate-pulse"/>
            AI CAMPUS ASSISTANT
          </div>

          <h1 className="font-['DM_Serif_Display',serif] text-[62px] leading-[1.06] text-[#1C1917] mb-6" style={{letterSpacing:"-0.02em"}}>
            Campus chaos?<br/>
            We've got it{" "}
            <span className="grad-text">untangled.</span>
          </h1>

          <p className="text-[17px] text-[#6A625A] leading-relaxed mb-10 max-w-[440px]">
            Turn hundreds of campus announcements into the deadlines, actions, conflicts and opportunities that actually matter.
          </p>

          <GradBtn onClick={go}>Get Started →</GradBtn>

          <p className="text-sm text-[#A09890] mt-5 mb-8 font-medium">Less scrolling. More clarity.</p>

          {/* Trust indicators */}
          <div className="grid grid-cols-2 gap-2 max-w-[360px]">
            {[
              {icon:"✓",label:"Deadlines extracted",color:"#52B788"},
              {icon:"✓",label:"Conflicts detected",color:"#4A90E0"},
              {icon:"✓",label:"Opportunities found",color:"#8B6FE8"},
              {icon:"✓",label:"No invented information",color:"#E8674A"},
            ].map(t=>(
              <div key={t.label} className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{background:t.color}}>{t.icon}</span>
                <span className="text-xs text-[#6A625A] font-medium">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — abstract viz */}
        <div className="flex-1 flex items-center justify-center relative" style={{minHeight:480}}>
          {/* Background blobs */}
          <div className="absolute w-80 h-80 rounded-full opacity-50 pointer-events-none"
            style={{background:"radial-gradient(ellipse,#F8D4B0 0%,#FAF7F2 75%)",top:"10%",left:"5%",animation:"blob-morph 10s ease-in-out infinite"}}/>
          <div className="absolute w-64 h-64 rounded-full opacity-40 pointer-events-none"
            style={{background:"radial-gradient(ellipse,#DDD0F8 0%,#FAF7F2 75%)",bottom:"5%",right:"8%",animation:"blob-morph 13s ease-in-out infinite reverse"}}/>
          <div className="absolute w-48 h-48 rounded-full opacity-35 pointer-events-none"
            style={{background:"radial-gradient(ellipse,#F8ECA8 0%,#FAF7F2 75%)",top:"15%",right:"15%",animation:"blob-morph 9s ease-in-out infinite 2s"}}/>

          {/* Floating chaos cards */}
          {[
            {text:"Workshop · Today",sub:"College Email",color:"#E8674A",bg:"#FEF0ED",top:12,left:0,anim:"float-a",delay:"0s"},
            {text:"Class Cancelled",sub:"Class Group",color:"#4A90E0",bg:"#EEF4FE",top:28,right:0,anim:"float-b",delay:"1.5s"},
            {text:"Scholarship · Sep 20",sub:"Notices",color:"#F0BC3A",bg:"#FEFAEE",top:55,left:2,anim:"float-c",delay:"0.8s"},
            {text:"Hackathon",sub:"College Email",color:"#8B6FE8",bg:"#F2EEFE",bottom:28,right:2,anim:"float-a",delay:"2.2s"},
            {text:"Society Meeting",sub:"Societies",color:"#F09060",bg:"#FEF5EE",bottom:10,left:14,anim:"float-b",delay:"1.1s"},
            {text:"Registration closes 8 PM",sub:"AI Club",color:"#E8674A",bg:"#FEF0ED",top:8,right:20,anim:"float-c",delay:"3s"},
          ].map((c,i)=>(
            <div key={i} className={c.anim+" absolute"} style={{
              top:c.top!=null?`${c.top}%`:undefined,
              bottom:c.bottom!=null?`${c.bottom}%`:undefined,
              left:c.left!=null?`${c.left}%`:undefined,
              right:c.right!=null?`${c.right}%`:undefined,
              animationDelay:c.delay,zIndex:2}}>
              <div className="rounded-2xl px-3.5 py-2.5 shadow-md border" style={{background:c.bg,borderColor:c.color+"30",minWidth:130}}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-2 h-2 rounded-full" style={{background:c.color}}/>
                  <span className="text-[10px] font-medium" style={{color:c.color}}>{c.sub}</span>
                </div>
                <p className="text-xs font-semibold text-[#1C1917] leading-snug">{c.text}</p>
              </div>
            </div>
          ))}

          {/* Soft arrows */}
          <svg className="absolute pointer-events-none opacity-20" width="100%" height="100%" viewBox="0 0 500 480" style={{zIndex:3}}>
            <defs>
              <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E8674A" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#8B6FE8" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path d="M80 80 Q 200 240 240 240" stroke="url(#lg1)" strokeWidth="1.5" fill="none" strokeDasharray="4 3"/>
            <path d="M420 120 Q 320 200 260 240" stroke="url(#lg1)" strokeWidth="1.5" fill="none" strokeDasharray="4 3"/>
            <path d="M60 280 Q 160 280 240 250" stroke="url(#lg1)" strokeWidth="1.5" fill="none" strokeDasharray="4 3"/>
            <path d="M420 360 Q 340 310 265 248" stroke="url(#lg1)" strokeWidth="1.5" fill="none" strokeDasharray="4 3"/>
          </svg>

          {/* Central action plan card */}
          <div className="relative z-10 float-a" style={{animationDelay:"0.3s"}}>
            <div className="rounded-3xl shadow-2xl" style={{
              background:"linear-gradient(145deg,#FFFFFF 0%,#FFF8F5 100%)",
              border:"2px solid",
              borderImage:"linear-gradient(135deg,#E8674A,#8B6FE8) 1",
              borderRadius:24,
              padding:"24px 28px",
              width:260,
              outline:"2px solid transparent",
              boxShadow:"0 20px 60px rgba(0,0,0,0.12),0 0 0 2px rgba(139,111,232,0.2)",
            }}>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{background:"linear-gradient(135deg,#E8674A,#8B6FE8)"}}>
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <p className="font-['DM_Serif_Display',serif] text-sm text-[#1C1917]">Your Action Plan</p>
                  <p className="text-[10px] text-[#A09890]">5 things need your attention</p>
                </div>
              </div>
              {[
                {done:true,label:"Check DBMS classroom",time:"Tomorrow · 9 AM",p:"urgent" as Priority},
                {done:false,label:"Register — AI Workshop",time:"Today · 8:00 PM",p:"urgent" as Priority},
                {done:false,label:"Submit scholarship",time:"Today · 11:59 PM",p:"important" as Priority},
                {done:false,label:"National Hackathon",time:"Sep 25",p:"upcoming" as Priority},
              ].map((item,i)=>(
                <div key={i} className={`flex items-center gap-3 py-2.5 border-b last:border-0 border-[#F5EDE5] ${item.done?"opacity-40":""}`}>
                  <div className="w-4 h-4 rounded-[4px] flex items-center justify-center flex-shrink-0"
                    style={{background:item.done?"#52B788":"transparent",border:item.done?"none":`2px solid ${P[item.p].text}`}}>
                    {item.done&&<span className="text-white text-[8px] font-bold">✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-semibold text-[#1C1917] truncate ${item.done?"line-through":""}`}>{item.label}</p>
                    <p className="text-[9px] font-mono" style={{color:P[item.p].text}}>{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 2: Personalization ────────────────────────────────────────────────
function Personal({go}:{go:()=>void}) {
  const [year,setYear] = useState("First Year");
  const [branch,setBranch] = useState("Computer Science & Engineering");
  const [sel,setSel] = useState(["AI & Technology","Hackathons","Workshops"]);
  const pills = ["AI & Technology","Hackathons","Societies","Workshops","Scholarships","Sports","Competitions","Research"];
  const pillColors = ["#8B6FE8","#E8674A","#F09060","#4A90E0","#F0BC3A","#52B788","#E8674A","#4A90E0"];
  const toggle = (p:string)=>setSel(s=>s.includes(p)?s.filter(x=>x!==p):[...s,p]);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{background:"#FAF7F2"}}>
      {/* Blobs */}
      <div className="absolute pointer-events-none" style={{width:400,height:400,borderRadius:"60% 40% 70% 30%/50% 60% 40% 70%",background:"radial-gradient(#F8D4B0,transparent 70%)",top:-100,right:-100,opacity:0.5,animation:"blob-morph 12s infinite"}}/>
      <div className="absolute pointer-events-none" style={{width:300,height:300,borderRadius:"40% 60% 30% 70%/60% 40% 70% 30%",background:"radial-gradient(#DDD0F8,transparent 70%)",bottom:-80,left:-80,opacity:0.5,animation:"blob-morph 10s infinite reverse"}}/>

      <nav className="px-14 py-5 flex items-center justify-between relative z-10">
        <Logo/>
        <div className="flex items-center gap-3 text-xs font-mono text-[#A09890]">
          <div className="flex gap-1.5">
            {[1,2,3].map(n=><div key={n} className="w-6 h-1.5 rounded-full" style={{background:n===1?"linear-gradient(90deg,#E8674A,#8B6FE8)":"#EDE7DF"}}/>)}
          </div>
          <span>01 / 03</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-8 py-6 relative z-10">
        <C className="w-full max-w-2xl p-10">
          <h2 className="font-['DM_Serif_Display',serif] text-4xl text-[#1C1917] mb-2">Let's make Untangled yours.</h2>
          <p className="text-[#6A625A] mb-8">Tell us what matters to you. We'll handle the noise.</p>

          <div className="space-y-7">
            {/* Year */}
            <div>
              <label className="block text-xs font-semibold tracking-widest text-[#A09890] uppercase mb-3">Year</label>
              <div className="flex gap-3 flex-wrap">
                {["First Year","Second Year","Third Year","Fourth Year"].map(y=>(
                  <button key={y} onClick={()=>setYear(y)}
                    className="flex items-center gap-2.5 text-sm font-medium transition-all">
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{borderColor:year===y?"#E8674A":"#D8D0C8"}}>
                      {year===y&&<div className="w-2.5 h-2.5 rounded-full" style={{background:"#E8674A"}}/>}
                    </div>
                    <span style={{color:year===y?"#1C1917":"#6A625A"}}>{y}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold tracking-widest text-[#A09890] uppercase mb-3">Branch</label>
              <div className="relative">
                <select value={branch} onChange={e=>setBranch(e.target.value)}
                  className="w-full py-3.5 px-4 pr-10 rounded-2xl border border-[#EDE7DF] bg-[#FDFAF7] text-[#1C1917] text-sm font-medium outline-none appearance-none transition-all"
                  style={{}}>
                  {["Computer Science & Engineering","Electronics & Communication","Mechanical Engineering","Civil Engineering","Information Technology"].map(b=>(
                    <option key={b}>{b}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A09890] pointer-events-none">▾</div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-xs font-semibold tracking-widest text-[#A09890] uppercase mb-3">What interests you?</label>
              <div className="flex flex-wrap gap-2.5">
                {pills.map((p,i)=>{
                  const s=sel.includes(p); const c=pillColors[i];
                  return (
                    <button key={p} onClick={()=>toggle(p)}
                      className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
                      style={s?{background:c+"22",color:c,borderColor:c+"60"}:{background:"white",color:"#6A625A",borderColor:"#EDE7DF"}}>
                      {s&&"✓ "}{p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview */}
            {sel.length>0&&(
              <div className="rounded-2xl p-4 border" style={{background:"#F2EEFE",borderColor:"#C8BCE8"}}>
                <p className="text-xs font-semibold text-[#8B6FE8] mb-1">Your Untangled feed</p>
                <p className="text-sm text-[#4A3A78]">
                  {sel.slice(0,3).join(", ")}{sel.length>3?" and more":""} will receive higher relevance.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#F0EAE2]">
            <span className="text-sm text-[#B0A898]">Almost there →</span>
            <GradBtn onClick={go} sm>Continue →</GradBtn>
          </div>
        </C>
      </div>
    </div>
  );
}

// ─── SCREEN 3: Sources ────────────────────────────────────────────────────────
function Sources({go}:{go:()=>void}) {
  const srcs = [
    {name:"College Email",icon:"📧",count:23,color:"#4A90E0",bg:"#EEF4FE",border:"#B8D0F8"},
    {name:"Class Groups",icon:"💬",count:47,color:"#8B6FE8",bg:"#F2EEFE",border:"#C8BCE8"},
    {name:"Society Channels",icon:"✨",count:18,color:"#F09060",bg:"#FEF5EE",border:"#F8D4C0"},
    {name:"College Notices",icon:"📢",count:12,color:"#F0BC3A",bg:"#FEFAEE",border:"#F5E4A8"},
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <nav className="px-14 py-5 flex items-center justify-between">
        <Logo/>
        <div className="flex items-center gap-3 text-xs font-mono text-[#A09890]">
          <div className="flex gap-1.5">
            {[1,2,3].map(n=><div key={n} className="w-6 h-1.5 rounded-full" style={{background:n<=2?"linear-gradient(90deg,#E8674A,#8B6FE8)":"#EDE7DF"}}/>)}
          </div>
          <span>02 / 03</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-10 py-6">
        <div className="w-full max-w-[860px]">
          <div className="text-center mb-10">
            <h2 className="font-['DM_Serif_Display',serif] text-5xl text-[#1C1917] mb-3">Bring everything together.</h2>
            <p className="text-lg text-[#6A625A]">Your campus information is everywhere. Untangled brings it into one calm place.</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {srcs.map(s=>(
              <div key={s.name} className="card-lift rounded-3xl p-6 border" style={{background:s.bg,borderColor:s.border}}>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="font-semibold text-sm text-[#1C1917] mb-1">{s.name}</h3>
                <div className="flex items-end gap-1 mb-3">
                  <span className="text-3xl font-bold" style={{color:s.color}}>{s.count}</span>
                  <span className="text-xs text-[#6A625A] mb-1">updates</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold" style={{color:"#52B788"}}>
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white" style={{background:"#52B788"}}>✓</span>
                  Connected
                </div>
              </div>
            ))}
          </div>

          <C className="p-6 mb-6 flex items-center justify-between">
            <div>
              <p className="font-['DM_Serif_Display',serif] text-2xl text-[#1C1917]">100 updates waiting to be untangled</p>
              <p className="text-sm text-[#A09890] mt-1">From 4 connected campus sources</p>
            </div>
            <div className="text-4xl font-bold text-[#1C1917]">100</div>
          </C>

          <div className="text-center">
            <GradBtn onClick={go}>Sync Everything →</GradBtn>
            <p className="text-xs text-[#B0A898] mt-3 max-w-sm mx-auto">
              Untangled organizes your updates without hiding opportunities or filling gaps with assumptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 4: Processing ─────────────────────────────────────────────────────
function Processing({go}:{go:()=>void}) {
  const steps = ["Reading announcements","Grouping repeated updates","Extracting deadlines","Detecting schedule conflicts","Finding opportunities","Checking incomplete information"];
  const chips = [
    {label:"Deadlines",color:"#E8674A",bg:"#FEF0ED",delay:"0s",orbit:"orbit-1",speed:"4s"},
    {label:"Conflicts",color:"#4A90E0",bg:"#EEF4FE",delay:"0.5s",orbit:"orbit-2",speed:"5s"},
    {label:"Duplicates",color:"#F09060",bg:"#FEF5EE",delay:"1s",orbit:"orbit-3",speed:"6s"},
    {label:"Opportunities",color:"#8B6FE8",bg:"#F2EEFE",delay:"1.5s",orbit:"orbit-4",speed:"4.5s"},
    {label:"Actions",color:"#52B788",bg:"#EDFAF3",delay:"2s",orbit:"orbit-5",speed:"5.5s"},
    {label:"Missing info",color:"#F0BC3A",bg:"#FEFAEE",delay:"2.5s",orbit:"orbit-6",speed:"7s"},
  ];

  const [done,setDone] = useState<number[]>([]);
  const [fin,setFin] = useState(false);
  useEffect(()=>{
    steps.forEach((_,i)=>setTimeout(()=>setDone(p=>[...p,i]),800+i*800));
    setTimeout(()=>setFin(true),800+steps.length*800+600);
  },[]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{background:"#FAF7F2"}}>
      {/* Big gradient bg */}
      <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse 80% 70% at 50% 40%,#F8D4B0 0%,#F0E4F8 40%,#FAF7F2 80%)",opacity:0.7}}/>

      <div className="relative z-10 flex gap-16 items-center max-w-5xl w-full px-10">
        {/* AI Orb + orbiting chips */}
        <div className="flex-shrink-0 relative" style={{width:320,height:320}}>
          {/* Orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full flex items-center justify-center"
            style={{background:"linear-gradient(135deg,#E8674A 0%,#8B6FE8 100%)",animation:"pulse-orb 3s ease-in-out infinite",boxShadow:"0 0 0 0 rgba(139,111,232,0.3),0 0 60px rgba(240,160,120,0.2)"}}>
            <Logo sm/>
          </div>

          {/* Orbit rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-[#8B6FE8]/15"/>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-[#E8674A]/10"/>

          {/* Floating chips */}
          {chips.map((chip,i)=>(
            <div key={i} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{animation:`${chip.orbit} ${chip.speed} linear infinite`,animationDelay:chip.delay}}>
              <div className="px-3 py-1.5 rounded-full text-[11px] font-semibold border shadow-md"
                style={{background:chip.bg,color:chip.color,borderColor:chip.color+"40",whiteSpace:"nowrap"}}>
                {chip.label}
              </div>
            </div>
          ))}
        </div>

        {/* Right text */}
        <div className="flex-1">
          <h1 className="font-['DM_Serif_Display',serif] text-4xl text-[#1C1917] mb-3 leading-tight">Untangling your campus…</h1>
          <p className="text-[#6A625A] mb-8">Finding what matters without losing what doesn't.</p>

          <div className="space-y-3 mb-8">
            {steps.map((step,i)=>{
              const isDone=done.includes(i);
              const isActive=!isDone&&done.length===i;
              return (
                <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${isDone||isActive?"opacity-100":"opacity-25"}`}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{background:isDone?"#52B788":isActive?"white":"#EDE7DF",border:isActive?"2px solid #52B788":"none"}}>
                    {isDone?<span className="text-white text-[10px] font-bold">✓</span>:isActive?<div className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse"/>:null}
                  </div>
                  <span className={`text-sm font-medium ${isDone?"text-[#1C1917]":"text-[#6A625A]"}`}>{step}</span>
                </div>
              );
            })}
          </div>

          {/* Progress */}
          <div className="w-full bg-[#EDE7DF] rounded-full h-2 mb-3">
            <div className="h-2 rounded-full transition-all duration-700"
              style={{width:`${(done.length/steps.length)*100}%`,background:"linear-gradient(90deg,#F0BC3A,#E8674A,#8B6FE8)"}}/>
          </div>

          <div className="flex items-center gap-3 text-sm mb-8">
            <span className="font-semibold text-[#1C1917]">100 announcements</span>
            <span className="text-2xl" style={{color:"#8B6FE8"}}>→</span>
            <span className="font-bold text-lg" style={{color:"#52B788"}}>67 meaningful updates</span>
          </div>

          {fin&&<GradBtn onClick={go}>View my action plan →</GradBtn>}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard data ───────────────────────────────────────────────────────────
interface Task { id:string; title:string; deadline:string; p:Priority; source:string; detail?:string; }
const TASKS:Task[] = [
  {id:"1",title:"Register for AI Workshop",deadline:"Today · 8:00 PM",p:"urgent",source:"College Tech Club",detail:"12 seats remaining"},
  {id:"2",title:"Submit Scholarship Application",deadline:"Today · 11:59 PM",p:"important",source:"College Notices",detail:"Deadline approaching"},
  {id:"3",title:"Complete Coding Society Registration",deadline:"Deadline not mentioned",p:"missing",source:"Society Channels"},
  {id:"4",title:"Register for National Hackathon",deadline:"September 25",p:"upcoming",source:"College Email"},
  {id:"5",title:"Confirm Research Talk Registration",deadline:"September 18",p:"action",source:"College Notices"},
];

// ─── SCREEN 5: Dashboard ──────────────────────────────────────────────────────
function Dashboard({onDetail,onConflict,onOpps,onInfoGap}:{onDetail:(id:string)=>void;onConflict:()=>void;onOpps:()=>void;onInfoGap:()=>void}) {
  const [nav,setNav] = useState<NavItem>("overview");
  const [checked,setChecked] = useState<string[]>([]);
  const toggle=(id:string)=>setChecked(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const navItems:[NavItem,string][] = [
    ["overview","Overview"],
    ["action","Action Plan"],
    ["schedule","Schedule"],
    ["opps","Opportunities"],
    ["updates","Updates"],
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* Top navigation — light, warm, premium */}
      <header className="bg-white border-b border-[#EDE7DF] sticky top-0 z-30"
        style={{boxShadow:"0 1px 16px rgba(0,0,0,0.04)"}}>
        <div className="max-w-[1440px] mx-auto px-10 h-[64px] flex items-center justify-between">
          {/* Logo */}
          <Logo sm/>

          {/* Center nav */}
          <nav className="flex items-center gap-1">
            {navItems.map(([id,label])=>{
              const active=nav===id;
              return (
                <button key={id} onClick={()=>setNav(id)}
                  className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background:active?"linear-gradient(135deg,#FEF0ED,#F2EEFE)":"transparent",
                    color:active?"#E8674A":"#6A625A",
                    fontWeight:active?700:500,
                  }}>
                  {label}
                  {id==="action"&&(TASKS.length-checked.length>0)&&(
                    <span className="absolute -top-0.5 -right-0.5 text-[9px] font-bold text-white rounded-full w-4 h-4 flex items-center justify-center"
                      style={{background:"#E8674A"}}>{TASKS.length-checked.length}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl hover:bg-[#F5EDE5] flex items-center justify-center text-[#6A625A] transition-colors">
              🔔<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E8674A] rounded-full border border-white"/>
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{background:"linear-gradient(135deg,#E8674A,#8B6FE8)"}}>A</div>
          </div>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1440px] mx-auto px-10 py-10">

          {(nav==="overview"||nav==="action")&&(
            <>
              {/* ── Greeting ── */}
              <div className="mb-8">
                <p className="text-xs font-bold tracking-widest text-[#B0A898] uppercase mb-2">Your campus, untangled</p>
                <h1 className="font-['DM_Serif_Display',serif] text-[42px] leading-tight text-[#1C1917] mb-1">Good afternoon 👋</h1>
                <p className="text-lg text-[#6A625A] mb-6">We've untangled the noise for you.</p>

                {/* Stat pills */}
                <div className="flex gap-3">
                  {[
                    {v:"50",l:"Updates",bg:"#EEF4FE",c:"#4A90E0",border:"#B8D0F8"},
                    {v:"5", l:"Actions",bg:"#FEF5EE",c:"#F09060",border:"#F8D4C0"},
                    {v:"2", l:"Conflicts",bg:"#FEF0ED",c:"#E8674A",border:"#F8C4B8"},
                    {v:"8", l:"Opportunities",bg:"#F2EEFE",c:"#8B6FE8",border:"#C8BCE8"},
                  ].map(s=>(
                    <div key={s.l} className="flex items-center gap-3 px-5 py-3 rounded-2xl border"
                      style={{background:s.bg,borderColor:s.border}}>
                      <span className="text-2xl font-bold" style={{color:s.c}}>{s.v}</span>
                      <span className="text-sm font-medium" style={{color:s.c+"CC"}}>{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Action Plan — hero card ── */}
              <C className="mb-6 overflow-hidden">
                {/* Card header */}
                <div className="px-8 py-5 flex items-center justify-between border-b border-[#F5EDE5]"
                  style={{background:"linear-gradient(135deg,#FFFAF7 0%,#F8F4FF 100%)"}}>
                  <div>
                    <h2 className="font-['DM_Serif_Display',serif] text-2xl text-[#1C1917]">Your Action Plan</h2>
                    <p className="text-sm text-[#A09890] mt-0.5">
                      {TASKS.length-checked.length} of {TASKS.length} things need your attention
                    </p>
                  </div>
                  <div className="flex items-center gap-5">
                    {/* Progress */}
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-[#EDE7DF] rounded-full h-2">
                        <div className="h-2 rounded-full transition-all duration-500"
                          style={{width:`${(checked.length/TASKS.length)*100}%`,background:"#52B788"}}/>
                      </div>
                      <span className="text-sm font-semibold" style={{color:"#52B788"}}>{checked.length}/{TASKS.length}</span>
                    </div>
                    <button className="text-sm font-semibold text-[#E8674A] hover:underline">View all →</button>
                  </div>
                </div>

                {/* Task rows */}
                <div className="divide-y divide-[#FAF5F0]">
                  {TASKS.map(task=>{
                    const done=checked.includes(task.id);
                    const t=P[task.p];
                    return (
                      <div key={task.id}
                        className={`px-8 py-4 flex items-center gap-5 group transition-colors hover:bg-[#FFFCFA] ${done?"opacity-45":""}`}>
                        {/* Priority accent stripe */}
                        <div className="w-1 h-12 rounded-full flex-shrink-0 transition-all"
                          style={{background:done?"#E8E0D8":t.text+"70"}}/>
                        {/* Checkbox */}
                        <input type="checkbox" className="u-check" checked={done} onChange={()=>toggle(task.id)}/>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                            <span className={`font-semibold text-[15px] text-[#1C1917] ${done?"line-through opacity-60":""}`}>
                              {task.title}
                            </span>
                            <Badge p={task.p} sm/>
                            {done&&<span className="text-[10px] font-semibold text-[#52B788] bg-[#EDFAF3] px-2 py-0.5 rounded-full border border-[#B8E8D0]">✓ Completed</span>}
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs font-mono font-semibold"
                              style={{color:task.p==="urgent"?"#E8674A":task.p==="missing"?"#9B7A20":"#A09890"}}>
                              {task.deadline}
                            </span>
                            {task.detail&&(
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{background:t.bg,color:t.text}}>{task.detail}</span>
                            )}
                            <Chip name={task.source} color={t.text}/>
                          </div>
                        </div>
                        {/* Detail arrow */}
                        <button
                          onClick={()=>task.p==="missing"?onInfoGap():onDetail(task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-all w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{background:t.bg,color:t.text}}>→</button>
                      </div>
                    );
                  })}
                </div>
              </C>

              {/* ── 3-column below ── */}
              <div className="grid grid-cols-3 gap-5">
                {/* Col 1 — Schedule Conflict */}
                <div className="rounded-3xl p-6 card-lift border"
                  style={{background:"linear-gradient(150deg,#FFF8F6 0%,#FEF0EC 100%)",borderColor:"#F8C4B8"}}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                      style={{background:"#E8674A22"}}>⚠</div>
                    <h3 className="font-semibold text-[#1C1917]">Schedule Conflict</h3>
                  </div>
                  <div className="space-y-3 mb-4">
                    {[
                      {l:"AI Workshop",t:"3:00 – 5:00 PM",c:"#E8674A"},
                      {l:"Coding Society Meeting",t:"4:00 – 6:00 PM",c:"#8B6FE8"},
                    ].map(e=>(
                      <div key={e.l} className="flex items-start gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{background:e.c}}/>
                        <div>
                          <p className="text-sm font-semibold text-[#1C1917] leading-tight">{e.l}</p>
                          <p className="text-xs font-mono text-[#A09890]">{e.t}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl px-4 py-2.5 mb-4 text-center"
                    style={{background:"linear-gradient(135deg,#E8674A,#F09060)"}}>
                    <p className="text-xs font-bold text-white tracking-wide">1 hour overlap</p>
                  </div>
                  <button onClick={onConflict}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:text-white"
                    style={{borderColor:"#F8C4B8",color:"#E8674A"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#E8674A"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    Review →
                  </button>
                </div>

                {/* Col 2 — Coming Up */}
                <div className="rounded-3xl p-6 card-lift border"
                  style={{background:"linear-gradient(150deg,#F4F8FF 0%,#EEF4FE 100%)",borderColor:"#C0D4F8"}}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                      style={{background:"#4A90E022"}}>📅</div>
                    <h3 className="font-semibold text-[#1C1917]">Coming Up</h3>
                  </div>
                  <div className="space-y-1 mb-5">
                    {[
                      {l:"Scholarship",d:"Sep 20",c:"#F09060"},
                      {l:"Society Recruitment",d:"Sep 22",c:"#8B6FE8"},
                      {l:"Hackathon",d:"Sep 25",c:"#4A90E0"},
                    ].map(i=>(
                      <div key={i.l} className="flex items-center justify-between py-2.5 border-b last:border-0 border-white/60">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:i.c}}/>
                          <span className="text-sm text-[#1C1917] font-medium">{i.l}</span>
                        </div>
                        <span className="text-xs font-mono font-semibold" style={{color:i.c}}>{i.d}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={()=>setNav("schedule")}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:text-white"
                    style={{borderColor:"#B8D0F8",color:"#4A90E0"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#4A90E0"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    View schedule →
                  </button>
                </div>

                {/* Col 3 — Discover */}
                <div className="rounded-3xl p-6 card-lift border"
                  style={{background:"linear-gradient(150deg,#FEFAEE 0%,#F4EFFE 100%)",borderColor:"#E0D4F8"}}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                      style={{background:"#8B6FE822"}}>✨</div>
                    <h3 className="font-semibold text-[#1C1917]">Discover</h3>
                  </div>
                  <p className="text-xs font-semibold mb-4 ml-10" style={{color:"#8B6FE8"}}>3 opportunities you might like</p>
                  <div className="space-y-1 mb-5">
                    {[
                      {l:"AI Workshop",c:"#E8674A",tag:"Today"},
                      {l:"National Hackathon",c:"#8B6FE8",tag:"Sep 25"},
                      {l:"Research Talk",c:"#4A90E0",tag:"Sep 22"},
                    ].map(o=>(
                      <div key={o.l} className="flex items-center justify-between py-2.5 border-b last:border-0 border-white/60">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:o.c}}/>
                          <span className="text-sm text-[#1C1917] font-medium">{o.l}</span>
                        </div>
                        <span className="text-[11px] font-mono text-[#A09890]">{o.tag}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={onOpps}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:text-white"
                    style={{borderColor:"#C8BCE8",color:"#8B6FE8"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#8B6FE8"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    Explore →
                  </button>
                </div>
              </div>

              {/* ── Needs attention strip ── */}
              {nav==="overview"&&(
                <div className="grid grid-cols-2 gap-4 mt-5">
                  <C className="p-5" style={{borderLeft:"4px solid #E8674A"}}>
                    <div className="flex items-start justify-between mb-2">
                      <Badge p="urgent" sm/>
                      <Chip name="College Email" color="#E8674A"/>
                    </div>
                    <h4 className="font-semibold text-sm text-[#1C1917] mb-1">AI Workshop</h4>
                    <p className="text-sm text-[#6A625A] mb-3">Registration closes <strong className="text-[#1C1917]">today at 8:00 PM.</strong> Only 12 seats remaining.</p>
                    <button onClick={()=>onDetail("1")} className="text-xs font-bold text-white px-4 py-2 rounded-xl" style={{background:"#E8674A"}}>Register now</button>
                  </C>
                  <C className="p-5" style={{borderLeft:"4px solid #4A90E0"}}>
                    <div className="flex items-start justify-between mb-2">
                      <Badge p="action" sm/>
                      <Chip name="Class Groups" color="#4A90E0"/>
                    </div>
                    <h4 className="font-semibold text-sm text-[#1C1917] mb-1">DBMS Class Cancelled</h4>
                    <p className="text-sm text-[#6A625A]">Tomorrow's 10:00 AM class cancelled. Replacement at 9:00 AM Room 302.</p>
                    <p className="text-xs mt-2 font-semibold" style={{color:"#52B788"}}>✓ No action required</p>
                  </C>
                </div>
              )}
            </>
          )}

          {nav==="schedule"&&<ScheduleView onConflict={onConflict}/>}
          {nav==="opps"&&<OppsView/>}
          {nav==="updates"&&<UpdatesView/>}

          <div className="h-10"/>
        </div>
      </div>
    </div>
  );
}

function ScheduleView({onConflict}:{onConflict:()=>void}) {
  return (
    <div className="space-y-5">
      <div className="mb-2">
        <h2 className="font-['DM_Serif_Display',serif] text-3xl text-[#1C1917] mb-1">Schedule</h2>
        <p className="text-[#6A625A] text-sm">Your commitments for the week</p>
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          <C className="p-7">
            <div className="space-y-3">
              {[
                {time:"9:00 AM",label:"DBMS Lab (Room 302)",note:"Replacement class — check notice",color:"#4A90E0"},
                {time:"3:00 PM",label:"AI Workshop",note:"Lab 204, CS Block · 12 seats remaining",color:"#E8674A"},
                {time:"4:00 PM",label:"Coding Society Meeting",note:"CS Seminar Hall · ⚠ Conflicts with AI Workshop",color:"#8B6FE8"},
              ].map(e=>(
                <div key={e.label} className="flex items-center gap-4">
                  <span className="text-xs font-mono text-[#A09890] w-16 text-right flex-shrink-0">{e.time}</span>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background:e.color}}/>
                  <div className="flex-1 py-3.5 px-4 rounded-2xl border" style={{borderColor:e.color+"30",background:e.color+"08"}}>
                    <p className="font-semibold text-sm text-[#1C1917]">{e.label}</p>
                    <p className="text-xs mt-0.5" style={{color:e.color}}>{e.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </C>
          <div className="rounded-2xl p-5 border" style={{background:"#FEF0ED",borderColor:"#F8C4B8"}}>
            <div className="flex items-center gap-2 mb-2"><span>⚠️</span><span className="text-sm font-semibold text-[#E8674A]">Schedule conflict detected</span></div>
            <p className="text-sm text-[#6A625A] mb-3">AI Workshop and Coding Society Meeting overlap 4:00–5:00 PM.</p>
            <button onClick={onConflict} className="text-xs font-semibold text-[#E8674A] underline">Review conflict →</button>
          </div>
        </div>
        <C className="p-5">
          <h4 className="font-semibold text-sm text-[#1C1917] mb-4">📅 Upcoming</h4>
          {[{l:"Scholarship",d:"Sep 20"},{l:"Research Talk",d:"Sep 22"},{l:"Hackathon",d:"Sep 25"}].map(i=>(
            <div key={i.l} className="flex justify-between py-2.5 border-b last:border-0 border-[#F5EDE5]">
              <span className="text-sm text-[#1C1917]">{i.l}</span>
              <span className="text-xs font-mono text-[#4A90E0]">{i.d}</span>
            </div>
          ))}
        </C>
      </div>
    </div>
  );
}

function OppsView() {
  const [filter,setFilter] = useState("All");
  const filters = ["All","Technology","Societies","Competitions","Scholarships","Research","Sports"];
  const opps = [
    {title:"National Hackathon",cat:"Competition",catC:"#8B6FE8",date:"Sep 25",src:"College Email",badge:"#F2EEFE",bc:"#8B6FE8",seats:null,desc:"Open to all branches. Prizes up to ₹1 lakh."},
    {title:"AI Research Talk",cat:"Research",catC:"#4A90E0",date:"Sep 18",src:"College Notices",badge:"#EEF4FE",bc:"#4A90E0",seats:"30 seats",desc:"By visiting faculty from IIT. Registrations open."},
    {title:"Coding Society Recruitment",cat:"Society",catC:"#F09060",date:"Deadline not mentioned",src:"Society Channels",badge:"#FEF5EE",bc:"#F09060",seats:null,desc:"Join the coding society. All branches welcome."},
    {title:"AI Workshop",cat:"Technology",catC:"#E8674A",date:"Today · 8 PM",src:"College Email",badge:"#FEF0ED",bc:"#E8674A",seats:"12 seats",desc:"Hands-on PyTorch and Computer Vision session."},
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-['DM_Serif_Display',serif] text-4xl text-[#1C1917] mb-2">Don't miss the good stuff.</h2>
        <p className="text-lg text-[#6A625A]">Not urgent doesn't mean not valuable.</p>
      </div>
      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
            style={filter===f?{background:"linear-gradient(135deg,#E8674A,#8B6FE8)",color:"white",borderColor:"transparent"}:{background:"white",color:"#6A625A",borderColor:"#EDE7DF"}}>
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {opps.map(o=>(
          <div key={o.title} className="card-lift rounded-3xl border overflow-hidden" style={{background:"white",borderColor:"#EDE7DF"}}>
            <div className="h-2 w-full" style={{background:o.bc}}/>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full border" style={{background:o.badge,color:o.bc,borderColor:o.bc+"40"}}>{o.cat}</span>
                {o.seats&&<span className="text-[10px] font-bold font-mono" style={{color:"#E8674A"}}>{o.seats}</span>}
              </div>
              <h3 className="font-semibold text-base text-[#1C1917] mb-1">{o.title}</h3>
              <p className="text-xs text-[#6A625A] mb-2">{o.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono" style={{color:o.bc}}>{o.date}</span>
                <Chip name={o.src} color={o.bc}/>
              </div>
              <button className="w-full mt-4 py-2.5 rounded-2xl text-xs font-semibold border-2 transition-all hover:text-white" style={{borderColor:o.bc,color:o.bc,"--hover-bg":o.bc} as React.CSSProperties}
                onMouseEnter={e=>(e.currentTarget.style.background=o.bc)}
                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                Explore →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpdatesView() {
  const [filter,setFilter] = useState("All");
  const [q,setQ] = useState("");
  const updates = [
    {id:"u1",title:"AI Workshop",p:"urgent" as Priority,date:"Today · 8:00 PM",srcs:["College Email","AI Club","Class Group"],grouped:3,action:true},
    {id:"u2",title:"Scholarship Application",p:"important" as Priority,date:"Today · 11:59 PM",srcs:["College Notices"],grouped:1,action:true},
    {id:"u3",title:"DBMS Class Cancelled",p:"action" as Priority,date:"Tomorrow",srcs:["Class Groups"],grouped:1,action:false},
    {id:"u4",title:"Coding Society Recruitment",p:"opportunity" as Priority,date:"Deadline TBA",srcs:["Society Channels"],grouped:2,action:true},
    {id:"u5",title:"National Hackathon",p:"upcoming" as Priority,date:"Sep 25",srcs:["College Email"],grouped:1,action:true},
    {id:"u6",title:"Research Talk",p:"opportunity" as Priority,date:"Sep 22",srcs:["College Notices","College Email"],grouped:2,action:false},
  ];
  const filt = updates.filter(u=>u.title.toLowerCase().includes(q.toLowerCase())&&(filter==="All"||(filter==="Urgent"&&u.p==="urgent")||(filter==="Upcoming"&&u.p==="upcoming")||(filter==="Opportunities"&&u.p==="opportunity")||(filter==="No Action Required"&&!u.action)));
  return (
    <div>
      <h2 className="font-['DM_Serif_Display',serif] text-3xl text-[#1C1917] mb-1">Everything, finally untangled.</h2>
      <p className="text-[#6A625A] text-sm mb-5">67 unique updates from 100 announcements across 4 sources</p>
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A09890]">🔍</span>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search updates…"
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#EDE7DF] bg-white text-sm outline-none focus:border-[#E8674A] transition-colors"/>
      </div>
      <div className="flex gap-2 flex-wrap mb-5">
        {["All","Urgent","Upcoming","Opportunities","Completed","No Action Required"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            className="px-4 py-2 rounded-full text-sm font-medium border transition-all"
            style={filter===f?{background:"#1C1917",color:"white",borderColor:"#1C1917"}:{background:"white",color:"#6A625A",borderColor:"#EDE7DF"}}>
            {f}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filt.map(u=>(
          <C key={u.id} className="p-5 card-lift">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="font-semibold text-sm text-[#1C1917]">{u.title}</span>
                  <Badge p={u.p} sm/>
                  {u.grouped>1&&<span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:"#F2EEFE",color:"#8B6FE8"}}>{u.grouped} SOURCES</span>}
                  {!u.action&&<span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EDFAF3] text-[#52B788] border border-[#B8E8D0]">No action required</span>}
                </div>
                <div className="text-xs font-mono text-[#A09890] mb-1.5">{u.date}</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-[#B0A898]">Mentioned in:</span>
                  {u.srcs.map(s=><Chip key={s} name={s}/>)}
                </div>
              </div>
              <button className="px-4 py-2 text-xs font-semibold border border-[#EDE7DF] hover:border-[#E8674A] text-[#6A625A] hover:text-[#E8674A] rounded-xl transition-colors flex-shrink-0">
                View details →
              </button>
            </div>
          </C>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN 6: Detail ─────────────────────────────────────────────────────────
function Detail({id,back}:{id:string;back:()=>void}) {
  const task = TASKS.find(t=>t.id===id)??TASKS[0];
  const t = P[task.p];
  const originals:Record<string,string> = {
    "1":"📢 AI Workshop — Registration Open!\n\nDear Students,\n\nAI & ML Club hosting intensive AI Workshop on Sep 18 from 3:00–5:00 PM in Lab 204, CS Block.\n\nTopics: Intro to Neural Networks, Hands-on PyTorch, Computer Vision.\n\nOnly 12 seats. Register by today at 8:00 PM.\n\nLink: forms.college.edu/ai-workshop\n\n— AI & ML Club",
    "2":"Reminder: State Scholarship Deadline\n\nAll eligible students must complete applications before 11:59 PM tonight.\n\nRequired: income certificate, marksheets, bank details.\n\nPortal: scholarship.state.gov.in\n\n— Academic Office",
    "3":"📣 Coding Society Recruitment!\n\nCoding Society recruiting new members for 2024–25. All branches welcome.\n\n[No deadline mentioned in the original announcement.]\n\n— Coding Society",
    "4":"National Level Hackathon — Team Registration\n\nTeams of 2–4. Prize: ₹1,00,000. Problem statements revealed on day.\n\nDeadline: Sep 20 (extended).\n\n— Hackathon Cell",
    "5":"AI Research Talk — Confirmation Needed\n\nAll interested students confirm your attendance for the research talk on Sep 18.\n\nCapacity limited to 30. Link: forms.college.edu/research-talk\n\n— Research & Innovation Cell",
  };
  const checks:Record<string,{label:string;ok:boolean}[]> = {
    "1":[{label:"Deadline found",ok:true},{label:"Limited seats mentioned",ok:true},{label:"Venue not mentioned",ok:false}],
    "2":[{label:"Deadline found",ok:true},{label:"Portal link provided",ok:true},{label:"Eligibility criteria",ok:true}],
    "3":[{label:"Deadline found",ok:false},{label:"Registration link present",ok:true},{label:"Eligibility criteria",ok:false}],
    "4":[{label:"Deadline found",ok:true},{label:"Prize amount mentioned",ok:true},{label:"Problem statements revealed",ok:false}],
    "5":[{label:"Deadline found",ok:true},{label:"Venue confirmed",ok:false},{label:"Registration link present",ok:true}],
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-white/70 backdrop-blur border-b border-[#EDE7DF] px-10 flex items-center gap-4" style={{height:60}}>
        <button onClick={back} className="w-8 h-8 rounded-xl hover:bg-[#F5EDE5] flex items-center justify-center text-[#6A625A] text-lg transition-colors">←</button>
        <Logo sm/><span className="text-[#D8D0C8]">/</span><span className="text-sm text-[#6A625A]">{task.title}</span>
      </header>
      <div className="max-w-2xl mx-auto px-8 py-10">
        <div className="flex items-center gap-2 mb-4"><Badge p={task.p}/><Chip name={task.source} color={t.text}/></div>
        <h1 className="font-['DM_Serif_Display',serif] text-4xl text-[#1C1917] mb-3">{task.title}</h1>
        <p className="text-xl font-semibold mb-8" style={{color:t.text}}>
          {task.p==="urgent"?"Registration closes today at 8:00 PM.":task.deadline}
        </p>
        <div className="space-y-4">
          {task.p==="urgent"&&(
            <div className="rounded-2xl p-5 border" style={{background:t.bg,borderColor:t.border}}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{color:t.text}}>Action Required</p>
              <p className="text-sm text-[#1C1917] mb-4">Register before the deadline to secure your spot.</p>
              <button className="px-6 py-2.5 rounded-xl text-sm font-bold text-white" style={{background:t.text}}>Register now</button>
            </div>
          )}
          <C className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#A09890] mb-2">What do I need to do?</p>
            <p className="text-sm text-[#1C1917] leading-relaxed">
              {task.p==="missing"?"Check the original announcement. Untangled cannot determine urgency without a confirmed deadline.":"Register or take action before the deadline to secure your spot."}
            </p>
          </C>
          <C className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#A09890] mb-2">Why am I seeing this?</p>
            <p className="text-sm text-[#1C1917] leading-relaxed">
              {task.p==="urgent"?"Registration has a near-term deadline and only 12 seats remain.":task.p==="missing"?"This opportunity matches your interests but has incomplete information — no deadline was found in the announcement.":"This event matches your registered interests."}
            </p>
          </C>
          <C className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#A09890] mb-3">Information check</p>
            <div className="space-y-2">
              {(checks[task.id]??checks["1"]).map(c=>(
                <div key={c.label} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{background:c.ok?"#52B788":"#F0BC3A"}}>
                    {c.ok?"✓":"⚠"}
                  </span>
                  <span className="text-sm text-[#1C1917]">{c.label}</span>
                </div>
              ))}
            </div>
          </C>
          <C className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#A09890] mb-3">Source</p>
            <div className="flex gap-2 mb-5 flex-wrap">
              <Chip name={task.source} color={t.text}/>
              {task.id==="1"&&<Chip name="AI Club" color="#8B6FE8"/>}
            </div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-sm text-[#1C1917]">Original Announcement</p>
              <button className="text-xs font-semibold hover:underline" style={{color:t.text}}>View Original →</button>
            </div>
            <div className="rounded-2xl p-4 border border-[#EDE7DF] font-['JetBrains_Mono',monospace] text-xs text-[#6A625A] whitespace-pre-line leading-relaxed" style={{background:"#FDFAF7"}}>
              {originals[task.id]??"Original not available."}
            </div>
            <p className="text-[10px] text-[#B0A898] italic mt-2">Untangled does not fabricate information. Only confirmed details are shown.</p>
          </C>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 7: Conflict ───────────────────────────────────────────────────────
function Conflict({back}:{back:()=>void}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-white/70 backdrop-blur border-b border-[#EDE7DF] px-10 flex items-center gap-4" style={{height:60}}>
        <button onClick={back} className="w-8 h-8 rounded-xl hover:bg-[#F5EDE5] flex items-center justify-center text-[#6A625A] text-lg transition-colors">←</button>
        <Logo sm/><span className="text-[#D8D0C8]">/</span><span className="text-sm text-[#6A625A]">Schedule Conflict</span>
      </header>
      <div className="max-w-2xl mx-auto px-8 py-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-4" style={{background:"#FEF0ED",color:"#E8674A",border:"1px solid #F8C4B8"}}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#E8674A] animate-pulse"/>⚡ Conflict Detected
        </span>
        <h1 className="font-['DM_Serif_Display',serif] text-4xl text-[#1C1917] mb-2">Something's overlapping.</h1>
        <p className="text-[#6A625A] mb-8">Untangled found a conflict between two commitments.</p>

        {/* Visual timeline */}
        <C className="p-7 mb-5">
          <div className="relative" style={{height:230}}>
            {/* Hour marks */}
            {["3 PM","4 PM","5 PM","6 PM"].map((t,i)=>(
              <div key={t} className="absolute flex items-center gap-3" style={{top:i*64,left:0,right:0}}>
                <span className="text-xs font-mono text-[#A09890] w-12 text-right flex-shrink-0">{t}</span>
                <div className="flex-1 border-t border-dashed border-[#EDE7DF]"/>
              </div>
            ))}
            {/* AI Workshop 3-5 PM → 0 to 128px */}
            <div className="absolute rounded-2xl flex flex-col justify-between p-4" style={{top:8,left:72,width:200,height:124,background:"linear-gradient(150deg,#FFF0EB,#FFE4D8)",border:"1.5px solid #F8C4B8"}}>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#E8674A]"/><span className="text-xs font-bold text-[#E8674A]">AI Workshop</span></div>
              <div>
                <div className="text-[10px] font-mono text-[#A09890]">3:00 PM ━━━━━━━━━ 5:00 PM</div>
              </div>
            </div>
            {/* Coding Society 4-6 PM → 64 to 192px */}
            <div className="absolute rounded-2xl flex flex-col justify-between p-4" style={{top:72,left:290,width:200,height:124,background:"linear-gradient(150deg,#F5F0FF,#EAE0FF)",border:"1.5px solid #C8BCE8"}}>
              <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#8B6FE8]"/><span className="text-xs font-bold text-[#8B6FE8]">Coding Society Meeting</span></div>
              <div>
                <div className="text-[10px] font-mono text-[#A09890]">4:00 PM ━━━━━━━━━ 6:00 PM</div>
              </div>
            </div>
            {/* Overlap 4-5 PM → 64 to 128px */}
            <div className="absolute rounded-xl flex items-center justify-center" style={{top:72,left:200,width:88,height:60,background:"linear-gradient(135deg,#E8674A,#F09060)",opacity:0.9}}>
              <div className="text-center">
                <p className="text-[9px] font-bold text-white uppercase tracking-wide">Overlap</p>
                <p className="text-[10px] font-mono text-white font-bold">4–5 PM</p>
              </div>
            </div>
          </div>
        </C>

        {/* Overlap callout */}
        <div className="rounded-2xl p-5 mb-5 border" style={{background:"#FEF0ED",borderColor:"#F8C4B8"}}>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-2xl font-mono" style={{color:"#E8674A"}}>4:00 PM – 5:00 PM</span>
          </div>
          <p className="text-sm font-semibold" style={{color:"#E8674A"}}>1 hour overlap</p>
        </div>

        <C className="p-6 mb-5">
          <p className="font-semibold text-[#1C1917] mb-2">These commitments overlap.</p>
          <p className="text-sm text-[#6A625A] leading-relaxed">Untangled surfaces the conflict so you can decide what works best for you. We do not recommend which event you should skip — that's your call.</p>
        </C>

        <div className="grid grid-cols-2 gap-4">
          {[
            {label:"AI Workshop",time:"3:00–5:00 PM · Lab 204",c:"#E8674A",bg:"#FEF0ED",bc:"#F8C4B8"},
            {label:"Coding Society Meeting",time:"4:00–6:00 PM · CS Hall",c:"#8B6FE8",bg:"#F2EEFE",bc:"#C8BCE8"},
          ].map(e=>(
            <C key={e.label} className="p-5">
              <div className="flex items-center gap-2 mb-1"><div className="w-2.5 h-2.5 rounded-full" style={{background:e.c}}/><span className="font-semibold text-sm text-[#1C1917]">{e.label}</span></div>
              <p className="text-xs text-[#A09890] mb-4">{e.time}</p>
              <button className="w-full py-2.5 rounded-xl text-xs font-bold border-2 transition-all hover:text-white"
                style={{borderColor:e.bc,color:e.c}}
                onMouseEnter={ev=>ev.currentTarget.style.background=e.c}
                onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
                View details →
              </button>
            </C>
          ))}
        </div>
        <div className="text-center mt-5">
          <button className="px-8 py-3 rounded-2xl font-semibold text-sm border-2 border-[#EDE7DF] text-[#6A625A] hover:border-[#1C1917] transition-colors">
            View both details
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 10: Info Gap ──────────────────────────────────────────────────────
function InfoGap({back}:{back:()=>void}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <header className="bg-white/70 backdrop-blur border-b border-[#EDE7DF] px-10 flex items-center gap-4" style={{height:60}}>
        <button onClick={back} className="w-8 h-8 rounded-xl hover:bg-[#F5EDE5] flex items-center justify-center text-[#6A625A] text-lg transition-colors">←</button>
        <Logo sm/><span className="text-[#D8D0C8]">/</span><span className="text-sm text-[#6A625A]">Information Gap</span>
      </header>
      <div className="max-w-2xl mx-auto px-8 py-10">
        <h1 className="font-['DM_Serif_Display',serif] text-4xl text-[#1C1917] mb-2">Something's missing.</h1>
        <p className="text-[#6A625A] mb-8">Untangled found these announcements but couldn't confirm all the details. We don't guess.</p>
        <div className="space-y-4">
          {[
            {title:"Coding Society Recruitment",summary:"Registration is open. All branches and years are welcome.",gap:"Deadline not mentioned",original:"📣 Coding Society Recruitment!\n\nCoding Society is now recruiting for 2024–25. All branches welcome.\n\nFill the form below.\n\n— Coding Society\n\n[No deadline was stated in this announcement.]"},
            {title:"Technical Fest Registration",summary:"Annual technical fest registration is now open.",gap:"Venue and timing not confirmed yet",original:"Technical Fest 2024 — Registrations Open\n\nDetails about venue and schedule will be shared soon.\n\n— Student Activities"},
          ].map(item=>(
            <C key={item.title} className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{background:"#FEFAEE",border:"1.5px solid #F5E4A8"}}>⚠</div>
                <div className="flex-1">
                  <h3 className="font-['DM_Serif_Display',serif] text-xl text-[#1C1917] mb-1">{item.title}</h3>
                  <p className="text-sm text-[#6A625A] mb-4">{item.summary}</p>
                  <div className="rounded-2xl p-4 border mb-4" style={{background:"#FEFAEE",borderColor:"#F5E4A8"}}>
                    <p className="text-sm font-bold mb-1" style={{color:"#9B7A20"}}>⚠ {item.gap}</p>
                    <p className="text-xs text-[#6A625A] italic">"Untangled couldn't find a deadline in the original announcement."</p>
                  </div>
                  <div className="rounded-2xl p-4 border border-[#EDE7DF] mb-3 font-['JetBrains_Mono',monospace] text-xs text-[#6A625A] whitespace-pre-line leading-relaxed" style={{background:"#FDFAF7"}}>
                    {item.original}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-[#B0A898] italic">Untangled never invents or estimates missing information.</p>
                    <button className="text-xs font-semibold text-[#E8674A] hover:underline">View Original →</button>
                  </div>
                </div>
              </div>
            </C>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen] = useState<Screen>("welcome");
  const [taskId,setTaskId] = useState("1");
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    
  <>
    <Show when="signed-out">
       {showSignIn ? (
    <SignInPage />
  ) : (
    <Welcome go={() => setShowSignIn(true)} />
  )}
</Show>

<Show when="signed-in">
  {screen==="welcome"    && <Welcome go={()=>setScreen("personal")}/>}
  {screen==="personal"   && <Personal go={()=>setScreen("sources")}/>}
  {screen==="sources"    && <Sources go={()=>setScreen("processing")}/>}
  {screen==="processing" && <Processing go={()=>setScreen("dash")}/>}
  {screen==="dash"       && <Dashboard
    onDetail={id=>{setTaskId(id);setScreen("detail");}}
    onConflict={()=>setScreen("conflict")}
    onOpps={()=>setScreen("opps")}
    onInfoGap={()=>setScreen("info-gap")}/>}
  {screen==="detail"     && <Detail id={taskId} back={()=>setScreen("dash")}/>}
  {screen==="conflict"   && <Conflict back={()=>setScreen("dash")}/>}
  {screen==="info-gap"   && <InfoGap back={()=>setScreen("dash")}/>}
</Show>
  </>
);
}
