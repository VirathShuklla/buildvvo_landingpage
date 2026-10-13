import { Dumbbell, CalendarCheck, IndianRupee, Users, BellRing } from "lucide-react";

const members = [
  { n: "Rahul M.", p: "Quarterly", d: "Renews in 3 days", c: "text-amber-500" },
  { n: "Sneha K.", p: "Annual", d: "Active", c: "text-emerald-500" },
  { n: "Arjun P.", p: "Monthly", d: "Expired · reminder sent", c: "text-rose-500" },
  { n: "Meera S.", p: "Personal training", d: "Active", c: "text-emerald-500" },
];

export const GymBossMockup = () => (
  <div data-testid="gymboss-mockup" className="relative grid grid-cols-[1fr_auto] gap-4 sm:gap-6 items-end">
    <div className="rounded-[20px] border border-white/10 bg-[#0B1528] text-cream overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand"><Dumbbell className="h-3.5 w-3.5" /></span>
          <span className="font-display font-bold text-sm">GymBoss<span className="text-brand">_VVO</span></span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest text-cream/40">Admin · Main Branch</span>
      </div>
      <div className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[[Users, "Active members"], [CalendarCheck, "Check-ins today"], [IndianRupee, "Fees due"]].map(([I, l]) => (
            <div key={l} className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
              <I className="h-3.5 w-3.5 text-brand" />
              <p className="text-[10px] text-cream/50 mt-2 truncate">{l}</p>
              <div className="mt-1.5 h-2 w-12 rounded-full bg-cream/20" />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/10 divide-y divide-white/5">
          {members.map((m) => (
            <div key={m.n} className="flex items-center gap-3 px-3.5 py-2.5 text-[11px]">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-[9px] font-bold">{m.n[0]}</span>
              <span className="flex-1 font-medium truncate">{m.n}</span>
              <span className="hidden sm:inline text-cream/50">{m.p}</span>
              <span className={`${m.c} text-[10px] truncate max-w-[120px]`}>{m.d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="w-[118px] sm:w-[150px] rounded-[26px] border-[5px] border-[#1E2D4A] bg-cream text-navy p-3 shadow-2xl animate-floaty">
      <div className="mx-auto h-1 w-10 rounded-full bg-navy/20 mb-3" />
      <p className="font-display text-xs font-bold">Hi Arjun</p>
      <p className="text-[9px] text-navy/55">Your membership has expired</p>
      <div className="mt-3 rounded-xl bg-navy text-cream p-2.5">
        <BellRing className="h-3 w-3 text-brand" />
        <p className="text-[9px] mt-1.5 leading-snug">Renew now to continue your workouts</p>
        <div className="mt-2 rounded-md bg-brand py-1 text-center text-[9px] font-semibold">Renew plan</div>
      </div>
      <div className="mt-2.5 space-y-1.5">
        <div className="h-1.5 w-full rounded-full bg-navy/10" /><div className="h-1.5 w-3/4 rounded-full bg-navy/10" />
      </div>
    </div>
  </div>
);
