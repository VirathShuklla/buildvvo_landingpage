import { useEffect, useState } from "react";
import { Mail, Phone, Trash2, Building2, Globe2, Send, PhoneCall, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { api, formatErr } from "../../lib/api";
import { StatusSelect } from "./StatusControls";

const fmt = (iso) => new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const inp = "w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

const Row = ({ label, children }) => (
  <div className="grid grid-cols-[120px_1fr] gap-3 py-2.5 text-sm border-b border-border/60 last:border-0">
    <span className="text-muted-foreground">{label}</span><span className="break-words">{children}</span>
  </div>
);

export const LeadSheet = ({ lead, onClose, onUpdate, onDelete, canDelete }) => {
  const [note, setNote] = useState("");
  const [source, setSource] = useState("");
  useEffect(() => { setSource(lead?.source || ""); setNote(""); }, [lead?.id, lead?.source]);

  const patch = async (body, msg) => {
    try {
      const { data } = await api.patch(`/leads/${lead.id}`, body);
      onUpdate(data);
      if (msg) toast.success(msg);
    } catch (e) { toast.error(formatErr(e)); }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    try {
      const { data } = await api.post(`/leads/${lead.id}/notes`, { text: note });
      onUpdate(data);
      setNote("");
      toast.success("Note added");
    } catch (e) { toast.error(formatErr(e)); }
  };

  const del = async () => {
    try { await api.delete(`/leads/${lead.id}`); onDelete(lead.id); toast.success("Lead deleted"); } catch (e) { toast.error(formatErr(e)); }
  };

  return (
    <Sheet open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-background" data-testid="lead-detail-sheet">
        {lead && (
          <div className="space-y-7">
            <SheetHeader className="text-left">
              <SheetTitle className="font-display text-2xl font-extrabold" data-testid="lead-detail-name">{lead.name}</SheetTitle>
              <SheetDescription>Received {fmt(lead.created_at)}</SheetDescription>
            </SheetHeader>

            <div className="flex flex-wrap items-center gap-2">
              <StatusSelect value={lead.status} onChange={(s) => patch({ status: s }, `Status updated to ${s}`)} testid="lead-detail-status-select" />
              {lead.consultation && <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1.5 text-xs font-semibold"><PhoneCall className="h-3.5 w-3.5" />Consultation requested</span>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a href={`tel:${lead.phone}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm hover:border-primary transition-colors" data-testid="lead-detail-call"><Phone className="h-4 w-4" />Call</a>
              <a href={`https://wa.me/${lead.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] text-white py-2.5 text-sm" data-testid="lead-detail-whatsapp">WhatsApp</a>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <Row label="Phone"><span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{lead.phone}</span></Row>
              <Row label="Email"><a className="inline-flex items-center gap-1.5 text-primary" href={`mailto:${lead.email}`}><Mail className="h-3.5 w-3.5" />{lead.email}</a></Row>
              <Row label="Company"><span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{lead.company || "—"}</span></Row>
              <Row label="Software">{lead.software_type}</Row>
              <Row label="Budget">{lead.budget}</Row>
              <Row label="Timeline">{lead.timeline}</Row>
              <Row label="Heard via">{lead.heard_about || "—"}</Row>
              <Row label="Landing page"><span className="inline-flex items-center gap-1.5 font-mono text-xs"><Globe2 className="h-3.5 w-3.5" />{lead.landing_page || "—"}</span></Row>
              {lead.utm_campaign && <Row label="Campaign">{lead.utm_campaign} {lead.utm_medium && `· ${lead.utm_medium}`}</Row>}
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Project description</p>
              <p className="rounded-2xl bg-secondary/60 p-4 text-sm leading-relaxed whitespace-pre-wrap" data-testid="lead-detail-description">{lead.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="block">
                <span className="text-sm font-semibold">Follow-up date</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button data-testid="lead-detail-followup-input" className={`${inp} mt-2 flex items-center gap-2 text-left`}>
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      {lead.follow_up_date ? new Date(lead.follow_up_date + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : <span className="text-muted-foreground">Pick a date</span>}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={lead.follow_up_date ? new Date(lead.follow_up_date + "T00:00:00") : undefined}
                      onSelect={(d) => patch(d ? { follow_up_date: format(d, "yyyy-MM-dd") } : { clear_follow_up: true }, "Follow-up updated")} initialFocus />
                    {lead.follow_up_date && (
                      <button onClick={() => patch({ clear_follow_up: true }, "Follow-up cleared")} data-testid="lead-detail-followup-clear" className="w-full border-t border-border py-2.5 text-sm text-destructive hover:bg-secondary">Clear date</button>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
              <label className="block">
                <span className="text-sm font-semibold">Lead source</span>
                <div className="mt-2 flex gap-2">
                  <input data-testid="lead-detail-source-input" className={inp} value={source} onChange={(e) => setSource(e.target.value)} list="source-options" />
                  <button onClick={() => patch({ source }, "Source updated")} disabled={!source || source === lead.source} data-testid="lead-detail-source-save" className="rounded-xl bg-navy text-cream dark:bg-cream dark:text-navy px-3 text-sm disabled:opacity-40">Save</button>
                </div>
                <datalist id="source-options">{["Google", "Instagram", "LinkedIn", "Facebook", "Direct", "Referral", "WhatsApp"].map((s) => <option key={s} value={s} />)}</datalist>
              </label>
            </div>

            <div>
              <p className="text-sm font-semibold mb-3">Notes ({lead.notes.length})</p>
              <div className="flex gap-2">
                <textarea data-testid="lead-detail-note-input" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note about this lead…" className={`${inp} resize-none`} />
                <button onClick={addNote} data-testid="lead-detail-add-note-button" className="grid w-12 place-items-center rounded-xl bg-primary text-white hover:bg-[#3651D4] transition-colors" aria-label="Add note"><Send className="h-4 w-4" /></button>
              </div>
              <ul className="mt-4 space-y-3" data-testid="lead-detail-notes-list">
                {[...lead.notes].reverse().map((n, i) => (
                  <li key={i} className="rounded-xl border border-border p-3.5">
                    <p className="text-sm whitespace-pre-wrap">{n.text}</p>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">{n.author ? `${n.author} · ` : ""}{fmt(n.created_at)}</p>
                  </li>
                ))}
              </ul>
            </div>

            {canDelete && <AlertDialog>
              <AlertDialogTrigger asChild>
                <button data-testid="lead-detail-delete-button" className="inline-flex items-center gap-2 text-sm text-destructive hover:underline"><Trash2 className="h-4 w-4" />Delete lead</button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                  <AlertDialogDescription>This permanently removes {lead.name}'s enquiry and notes.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-testid="lead-delete-cancel">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={del} data-testid="lead-delete-confirm" className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
