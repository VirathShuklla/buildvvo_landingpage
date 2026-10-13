export const STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];

const STYLE = {
  New: "bg-[#4965E9]/12 text-[#4965E9]",
  Contacted: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  Qualified: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "Proposal Sent": "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  Won: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  Lost: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

export const StatusBadge = ({ status }) => (
  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STYLE[status]}`}>{status}</span>
);

export const StatusSelect = ({ value, onChange, testid }) => (
  <select
    data-testid={testid}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none cursor-pointer ${STYLE[value]}`}
  >
    {STATUSES.map((s) => <option key={s} value={s} className="bg-card text-foreground">{s}</option>)}
  </select>
);
