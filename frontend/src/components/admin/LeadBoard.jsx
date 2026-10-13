import { useState } from "react";
import { DndContext, DragOverlay, PointerSensor, TouchSensor, KeyboardSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { CalendarClock, GripVertical, PhoneCall } from "lucide-react";
import { STATUSES } from "./StatusControls";

const DOT = { New: "#4965E9", Contacted: "#8B9BB4", Qualified: "#F5A524", "Proposal Sent": "#A78BFA", Won: "#22A06B", Lost: "#E5484D" };
const today = () => new Date().toISOString().slice(0, 10);
const fmt = (d) => new Date(d.length === 10 ? d + "T00:00:00" : d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");

const CardBody = ({ lead, dragging }) => {
  const overdue = lead.follow_up_date && lead.follow_up_date <= today() && !["Won", "Lost"].includes(lead.status);
  return (
    <div className={`rounded-xl border bg-card p-3.5 text-left ${dragging ? "border-primary shadow-2xl rotate-[1.5deg]" : "border-border hover:border-foreground/25"} transition-[border-color,box-shadow]`}>
      <div className="flex items-start gap-2">
        <GripVertical className="h-4 w-4 mt-0.5 text-muted-foreground/50 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm flex items-center gap-1.5 truncate">{lead.name}{lead.consultation && <PhoneCall className="h-3 w-3 text-primary shrink-0" />}</p>
          <p className="text-xs text-muted-foreground truncate">{lead.company || lead.phone}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
        <span className="rounded-full bg-secondary px-2 py-0.5">{lead.software_type}</span>
        <span className="rounded-full bg-secondary px-2 py-0.5 font-mono">{lead.budget}</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{lead.source} · {fmt(lead.created_at)}</span>
        {lead.follow_up_date && <span className={`inline-flex items-center gap-1 ${overdue ? "text-amber-600 dark:text-amber-400 font-semibold" : ""}`}><CalendarClock className="h-3 w-3" />{fmt(lead.follow_up_date)}</span>}
      </div>
    </div>
  );
};

const DraggableCard = ({ lead, onOpen }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id, data: { lead } });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} onClick={() => onOpen(lead.id)} data-testid={`board-card-${lead.id}`}
      className={`touch-manipulation cursor-grab active:cursor-grabbing ${isDragging ? "opacity-30" : ""}`}>
      <CardBody lead={lead} />
    </div>
  );
};

const Column = ({ status, leads, onOpen }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} data-testid={`board-column-${slug(status)}`}
      className={`snap-start flex flex-col rounded-2xl border p-3 min-h-[420px] transition-colors ${isOver ? "border-primary bg-primary/5" : "border-border bg-secondary/50"}`}>
      <div className="flex items-center justify-between px-1.5 pb-3">
        <span className="flex items-center gap-2 text-sm font-semibold"><span className="h-2 w-2 rounded-full" style={{ background: DOT[status] }} />{status}</span>
        <span className="rounded-full bg-card border border-border px-2 py-0.5 font-mono text-[11px]" data-testid={`board-column-count-${slug(status)}`}>{leads.length}</span>
      </div>
      <div className="flex flex-col gap-2.5 flex-1">
        {leads.map((l) => <DraggableCard key={l.id} lead={l} onOpen={onOpen} />)}
        {!leads.length && <div className="flex-1 grid place-items-center rounded-xl border border-dashed border-border text-xs text-muted-foreground py-8">Drop leads here</div>}
      </div>
    </div>
  );
};

export const LeadBoard = ({ leads, onMove, onOpen }) => {
  const [dragLead, setDragLead] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );
  const onDragEnd = ({ active, over }) => {
    setDragLead(null);
    const lead = leads.find((l) => l.id === active.id);
    if (lead && over && over.id !== lead.status) onMove(lead, over.id);
  };
  return (
    <DndContext sensors={sensors} onDragStart={({ active }) => setDragLead(active.data.current.lead)} onDragEnd={onDragEnd} onDragCancel={() => setDragLead(null)}>
      <p className="text-xs text-muted-foreground -mt-2">Drag a card to another column to update its status. On touch screens, press and hold to drag.</p>
      <div data-testid="admin-lead-board" className="grid grid-flow-col auto-cols-[minmax(250px,1fr)] xl:auto-cols-[minmax(0,1fr)] gap-3 overflow-x-auto pb-3 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
        {STATUSES.map((s) => <Column key={s} status={s} leads={leads.filter((l) => l.status === s)} onOpen={onOpen} />)}
      </div>
      <DragOverlay dropAnimation={{ duration: 180 }}>{dragLead && <CardBody lead={dragLead} dragging />}</DragOverlay>
    </DndContext>
  );
};
