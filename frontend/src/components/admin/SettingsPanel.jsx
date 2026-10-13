import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { api, formatErr } from "../../lib/api";
import { useSite } from "../../context/SiteContext";

const CONTACT = [
  ["whatsapp_number", "WhatsApp number", "Country code + number, digits only (e.g. 919876543210)"],
  ["phone", "Phone (displayed)", "+91 98765 43210"],
  ["email", "Contact email", "hello@buildvvo.com"],
  ["address", "Office address", "City, State, India"],
  ["business_hours", "Business hours", "Mon – Sat, 10 AM – 7 PM IST"],
];
const TRACKING = [
  ["ga4_id", "Google Analytics 4 Measurement ID", "G-XXXXXXXXXX"],
  ["google_ads_id", "Google Ads Conversion ID", "AW-XXXXXXXXX"],
  ["google_ads_label", "Google Ads Conversion Label", "AbCdEfGhIjk"],
  ["meta_pixel_id", "Meta Pixel ID", "123456789012345"],
];
const inp = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-[border-color,box-shadow]";

const Group = ({ title, text, fields, form, set }) => (
  <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
    <p className="font-display text-xl font-bold">{title}</p>
    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    <div className="mt-6 grid gap-5 sm:grid-cols-2">
      {fields.map(([k, label, ph]) => (
        <label key={k} className="block">
          <span className="text-sm font-medium">{label}</span>
          <input data-testid={`admin-settings-${k.replace(/_/g, "-")}-input`} className={`${inp} mt-2`} value={form[k] || ""} placeholder={ph} onChange={(e) => set(k, e.target.value)} />
        </label>
      ))}
    </div>
  </div>
);

export const SettingsPanel = () => {
  const { setSettings } = useSite();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get("/settings").then(({ data }) => setForm(data)); }, []);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.put("/settings", form);
      setForm(data);
      setSettings(data);
      toast.success("Settings saved — changes are live on the website");
    } catch (e) { toast.error(formatErr(e)); } finally { setSaving(false); }
  };

  if (!form) return <p className="text-muted-foreground">Loading settings…</p>;
  return (
    <div className="space-y-6 max-w-4xl" data-testid="admin-settings-panel">
      <div>
        <p className="eyebrow mb-2">Settings</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold">Website settings</h1>
      </div>
      <Group title="Contact details" text="Shown in the footer, contact page and WhatsApp buttons across the website." fields={CONTACT} form={form} set={set} />
      <Group title="Marketing & tracking" text="Leave blank to disable. Once set, page views, form submissions, WhatsApp clicks and consultation requests are tracked automatically." fields={TRACKING} form={form} set={set} />
      <button onClick={save} disabled={saving} data-testid="admin-settings-save-button" className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-7 py-3.5 text-sm font-medium hover:bg-[#3651D4] transition-colors disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save settings
      </button>
    </div>
  );
};
