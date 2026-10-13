import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { api, formatErr } from "../../lib/api";
import { getAttribution, trackLead, trackEvent } from "../../lib/tracking";
import { SOFTWARE_TYPES, BUDGETS, TIMELINES, HEARD_ABOUT } from "../../data/content";

const STEPS = ["Your details", "What you need", "Budget & timeline", "Project brief"];
const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Field = ({ label, error, children }) => (
  <label className="block">
    <span className="text-sm font-medium">{label}</span>
    <div className="mt-2">{children}</div>
    {error && <span className="mt-1.5 block text-xs text-destructive" data-testid="lead-form-error">{error}</span>}
  </label>
);

const inputCls = "w-full rounded-xl border border-input bg-background px-4 py-3.5 text-[15px] outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-4 focus:ring-primary/15 placeholder:text-muted-foreground/60";

const Choice = ({ active, onClick, children, testid }) => (
  <button type="button" onClick={onClick} data-testid={testid}
    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-[15px] transition-[border-color,background-color,color] duration-200 ${
      active ? "border-primary bg-primary/10 text-foreground font-medium" : "border-input hover:border-foreground/30"}`}>
    {children}
    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${active ? "border-primary bg-primary text-white" : "border-input"}`}>
      {active && <Check className="h-3 w-3" />}
    </span>
  </button>
);

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const LeadForm = ({ initialType = "", compact = false }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({
    name: "", company: "", phone: "", email: "", software_type: SOFTWARE_TYPES.includes(initialType) ? initialType : "",
    budget: "", timeline: "", description: "", heard_about: "", consultation: true, website: "",
  });
  const set = (k, v) => { setF((p) => ({ ...p, [k]: v })); setErrors((e) => ({ ...e, [k]: undefined })); };

  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (f.name.trim().length < 2) e.name = "Please enter your name";
      if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid 10-digit phone number";
      if (!EMAIL_RX.test(f.email.trim())) e.email = "Enter a valid email address";
    }
    if (s === 1 && !f.software_type) e.software_type = "Select the type of software you need";
    if (s === 2) {
      if (!f.budget) e.budget = "Select an estimated budget";
      if (!f.timeline) e.timeline = "Select an expected timeline";
    }
    if (s === 3 && f.description.trim().length < 10) e.description = "Tell us a little more (at least 10 characters)";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (!validate(step)) return;
    if (step === 0) trackEvent("lead_form_start");
    setStep((s) => s + 1);
  };

  const submit = async () => {
    if (!validate(3)) return;
    setLoading(true);
    const attr = getAttribution();
    try {
      await api.post("/leads", { ...f, ...attr });
      trackLead({ software_type: f.software_type, budget: f.budget, consultation: f.consultation });
      navigate("/thank-you", { state: { name: f.name.split(" ")[0], software_type: f.software_type, consultation: f.consultation } });
    } catch (e) {
      toast.error(formatErr(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="lead-form" className={`rounded-[24px] border border-border bg-card text-card-foreground ${compact ? "p-6 sm:p-8" : "p-6 sm:p-10"} shadow-[0_30px_70px_-40px_rgba(16,29,53,0.35)]`}>
      <div className="flex items-center justify-between mb-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary" data-testid="lead-form-step-indicator">Step {step + 1} of 4</p>
        <p className="text-sm text-muted-foreground">{STEPS[step]}</p>
      </div>
      <div className="grid grid-cols-4 gap-1.5 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-[width] duration-500" style={{ width: i <= step ? "100%" : "0%" }} />
          </div>
        ))}
      </div>

      <input type="text" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website", e.target.value)} className="hidden" aria-hidden="true" />

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name *" error={errors.name}><input data-testid="lead-form-step-1-name-input" className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" /></Field>
              <Field label="Company"><input data-testid="lead-form-step-1-company-input" className={inputCls} value={f.company} onChange={(e) => set("company", e.target.value)} placeholder="Company / business name" /></Field>
              <Field label="Phone number *" error={errors.phone}><input data-testid="lead-form-step-1-phone-input" className={inputCls} type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" /></Field>
              <Field label="Work email *" error={errors.email}><input data-testid="lead-form-step-1-email-input" className={inputCls} type="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" /></Field>
            </div>
          )}
          {step === 1 && (
            <div>
              <p className="font-display text-xl font-bold mb-5">What type of software do you need?</p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {SOFTWARE_TYPES.map((t) => (
                  <Choice key={t} active={f.software_type === t} onClick={() => set("software_type", t)} testid={`lead-form-type-${slug(t)}`}>{t}</Choice>
                ))}
              </div>
              {errors.software_type && <p className="mt-3 text-xs text-destructive" data-testid="lead-form-error">{errors.software_type}</p>}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-7">
              <div>
                <p className="font-display text-xl font-bold mb-4">Estimated budget</p>
                <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-3">
                  {BUDGETS.map((b) => <Choice key={b} active={f.budget === b} onClick={() => set("budget", b)} testid={`lead-form-budget-${slug(b) || "x"}-${BUDGETS.indexOf(b)}`}>{b}</Choice>)}
                </div>
                {errors.budget && <p className="mt-3 text-xs text-destructive" data-testid="lead-form-error">{errors.budget}</p>}
              </div>
              <div>
                <p className="font-display text-xl font-bold mb-4">Expected timeline</p>
                <div className="grid gap-2.5 sm:grid-cols-3">
                  {TIMELINES.map((t) => <Choice key={t} active={f.timeline === t} onClick={() => set("timeline", t)} testid={`lead-form-timeline-${slug(t)}`}>{t}</Choice>)}
                </div>
                {errors.timeline && <p className="mt-3 text-xs text-destructive" data-testid="lead-form-error">{errors.timeline}</p>}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-5">
              <Field label="Describe your project *" error={errors.description}>
                <textarea data-testid="lead-form-description-input" rows={5} className={`${inputCls} resize-none`} value={f.description} onChange={(e) => set("description", e.target.value)}
                  placeholder="What problem are you trying to solve? How does your team work today? Any must-have features?" />
              </Field>
              <Field label="How did you hear about us?">
                <select data-testid="lead-form-heard-about-select" className={inputCls} value={f.heard_about} onChange={(e) => set("heard_about", e.target.value)}>
                  <option value="">Select (optional)</option>
                  {HEARD_ABOUT.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </Field>
              <label className="flex items-start gap-3 rounded-xl border border-input p-4 cursor-pointer hover:border-foreground/30 transition-colors">
                <input data-testid="lead-form-consultation-checkbox" type="checkbox" checked={f.consultation} onChange={(e) => set("consultation", e.target.checked)} className="mt-1 h-4 w-4 accent-[#4965E9]" />
                <span>
                  <span className="block text-[15px] font-medium">Yes, I'd like a free consultation call</span>
                  <span className="block text-sm text-muted-foreground">A 30-minute call with our team to discuss your requirements. No obligation.</span>
                </span>
              </label>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-9 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} data-testid="lead-form-back-button" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium hover:bg-foreground/5 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        ) : (
          <p className="flex items-center gap-2 text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5" /> Your details stay confidential</p>
        )}
        {step < 3 ? (
          <button type="button" onClick={next} data-testid="lead-form-next-button" className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-7 py-3.5 text-sm font-medium hover:bg-[#3651D4] transition-colors">
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={loading} data-testid="lead-form-submit-button" className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-7 py-3.5 text-sm font-medium hover:bg-[#3651D4] transition-colors disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Submit Enquiry
          </button>
        )}
      </div>
    </div>
  );
};
