import {
  Code2, Boxes, Users, Smartphone, Globe, Workflow, Dumbbell, HeartPulse, GraduationCap,
  Warehouse, Factory, ShoppingBag, Rocket, FileSpreadsheet, Unplug, EyeOff, Clock3, Puzzle, TrendingDown,
} from "lucide-react";

export const SOFTWARE_TYPES = [
  "Custom Software", "ERP System", "CRM System", "Web Application", "Mobile App",
  "Inventory Management", "Business Automation", "Not Sure Yet",
];
export const BUDGETS = ["Under ₹50K", "₹50K–₹1.5L", "₹1.5L–₹5L", "₹5L+", "Not Sure"];
export const TIMELINES = ["As soon as possible", "Within 1 month", "1–3 months", "3–6 months", "Flexible"];
export const HEARD_ABOUT = ["Google Search", "Instagram", "LinkedIn", "Facebook", "Referral / Word of mouth", "Other"];

export const SERVICES = [
  {
    slug: "custom-software-development", title: "Custom Software Development", short: "Custom Software",
    icon: Code2, formType: "Custom Software",
    tagline: "Software shaped around the way your business actually works.",
    summary: "When off-the-shelf tools force you into workarounds, we design and build software that fits your exact processes — and grows with you.",
    seoTitle: "Custom Software Development Company in India",
    seoDesc: "BuildVVO builds custom business software in India — tailored to your workflows, owned by you, and built to scale. Get a free consultation.",
    problems: ["Your team juggles 4–5 tools that don't talk to each other", "Critical data lives in spreadsheets and WhatsApp chats", "Generic SaaS forces you to change how you work", "Monthly per-user subscriptions keep climbing"],
    features: ["Workflow discovery & process mapping", "Role-based access for every team", "Dashboards and reports you actually use", "Integrations with payment, SMS, WhatsApp & accounting tools", "Cloud deployment with backups", "Full source-code ownership"],
  },
  {
    slug: "erp-development", title: "ERP Development", short: "ERP Systems", icon: Boxes, formType: "ERP System",
    tagline: "One system for purchase, inventory, production, sales and accounts.",
    summary: "We build ERP systems that connect every department on a single source of truth, without the bloat and licensing cost of enterprise suites.",
    seoTitle: "Custom ERP Software Development in India",
    seoDesc: "Custom ERP development for Indian manufacturers, distributors and SMEs. Inventory, purchase, production, GST billing and reporting in one system.",
    problems: ["Stock numbers never match reality", "Purchase, sales and accounts work in silos", "Month-end reporting takes days", "Enterprise ERPs are too expensive and too complex"],
    features: ["Inventory & multi-warehouse stock", "Purchase orders & vendor management", "Production / BOM planning", "GST-ready invoicing", "Approval workflows", "Real-time management dashboards"],
  },
  {
    slug: "crm-development", title: "CRM Development", short: "CRM Systems", icon: Users, formType: "CRM System",
    tagline: "Never lose a lead, a follow-up, or a customer again.",
    summary: "A CRM built around your sales cycle — capture enquiries from every channel, automate follow-ups, and see exactly where revenue comes from.",
    seoTitle: "Custom CRM Software Development in India",
    seoDesc: "Custom CRM development for Indian businesses — lead capture, pipeline tracking, WhatsApp follow-ups and sales analytics built around your process.",
    problems: ["Leads slip through because follow-ups are manual", "No visibility into which channel brings customers", "Sales data is scattered across personal phones", "Generic CRMs don't fit your sales stages"],
    features: ["Multi-channel lead capture", "Custom pipeline stages", "Automated reminders & follow-ups", "WhatsApp / email / SMS integration", "Team performance tracking", "Source & conversion analytics"],
  },
  {
    slug: "web-application-development", title: "Web Application Development", short: "Web Applications", icon: Globe, formType: "Web Application",
    tagline: "Fast, secure web platforms your customers and team love to use.",
    summary: "From customer portals to internal tools and SaaS products, we build responsive web applications engineered for speed, security and scale.",
    seoTitle: "Web Application Development Company in India",
    seoDesc: "BuildVVO develops secure, fast web applications in India — customer portals, internal tools, booking systems and SaaS platforms.",
    problems: ["Customers can't self-serve, so your team handles everything manually", "Your current system is slow and breaks under load", "You need a portal for clients, vendors or franchisees", "You have a SaaS idea but no technical team"],
    features: ["Customer & partner portals", "Booking and order systems", "SaaS platforms with subscriptions", "Payment gateway integration", "Admin panels & analytics", "Mobile-first responsive UI"],
  },
  {
    slug: "mobile-app-development", title: "Mobile App Development", short: "Mobile Apps", icon: Smartphone, formType: "Mobile App",
    tagline: "Android and iOS apps that put your business in your customers' pocket.",
    summary: "We design and build mobile apps for customers, field staff and members — connected to your back-office so everything stays in sync.",
    seoTitle: "Mobile App Development Company in India (Android & iOS)",
    seoDesc: "Android and iOS app development for Indian businesses — customer apps, field-staff apps and member apps connected to your business systems.",
    problems: ["Field staff report work over calls and paper", "Customers expect to book, pay and track on their phone", "Your competitors already have an app", "Your web system has no mobile experience"],
    features: ["Android & iOS from one codebase", "Push notifications", "Offline-friendly field apps", "Payments & UPI integration", "Location & attendance tracking", "Play Store / App Store publishing"],
  },
  {
    slug: "business-automation", title: "Business Automation", short: "Automation", icon: Workflow, formType: "Business Automation",
    tagline: "Stop paying people to copy data between systems.",
    summary: "We automate repetitive operational work — reminders, invoicing, reporting, data entry — so your team can focus on work that grows the business.",
    seoTitle: "Business Process Automation Services in India",
    seoDesc: "Automate invoicing, reminders, reports, WhatsApp notifications and data entry. BuildVVO builds business automation for Indian SMEs.",
    problems: ["Hours lost every week on manual data entry", "Payment and renewal reminders are sent by hand", "Reports are compiled manually from multiple sources", "Errors creep in when data is copied between tools"],
    features: ["Automated WhatsApp / SMS / email reminders", "Scheduled reports", "Invoice & receipt generation", "System-to-system integrations", "Approval workflows", "Inventory & reorder alerts"],
  },
];

export const INDUSTRIES = [
  { key: "gyms", name: "Gyms & Fitness Studios", icon: Dumbbell, pains: ["Missed membership renewals", "Manual attendance & fee tracking", "No view across branches"], build: ["Member & fee management", "Automated renewal reminders", "Check-in & attendance", "Trainer and branch dashboards"] },
  { key: "healthcare", name: "Healthcare & Clinics", icon: HeartPulse, pains: ["Appointment chaos and no-shows", "Paper patient records", "Billing done by hand"], build: ["Appointment booking & reminders", "Digital patient records", "Billing & pharmacy stock", "Doctor schedules"] },
  { key: "education", name: "Education & Coaching", icon: GraduationCap, pains: ["Fee follow-ups eat staff time", "Attendance on paper registers", "Parents want updates"], build: ["Student & fee management", "Attendance & results", "Parent communication", "Online test & course portals"] },
  { key: "warehouses", name: "Warehouses & Logistics", icon: Warehouse, pains: ["Stock mismatches", "Slow dispatch", "No real-time visibility"], build: ["Inventory & bin tracking", "Inward / outward entries", "Dispatch & delivery tracking", "Barcode / QR workflows"] },
  { key: "manufacturing", name: "Manufacturing", icon: Factory, pains: ["Production planning in Excel", "Raw material shortages", "No costing visibility"], build: ["Production & BOM planning", "Raw material & purchase", "Quality checkpoints", "Job costing reports"] },
  { key: "retail", name: "Retail & Distribution", icon: ShoppingBag, pains: ["Billing and stock out of sync", "Multiple outlets, no central view", "Dealer orders over phone"], build: ["POS & GST billing", "Multi-outlet inventory", "Dealer / distributor ordering apps", "Loyalty & customer data"] },
  { key: "startups", name: "Startups", icon: Rocket, pains: ["Idea but no tech team", "Need an MVP fast and on budget", "Must scale after launch"], build: ["MVP design & development", "SaaS platforms", "Mobile apps", "Scalable cloud architecture"] },
];

export const PROBLEMS = [
  { icon: FileSpreadsheet, title: "Running on spreadsheets", text: "Critical data scattered across Excel files, notebooks and chats — and nobody trusts the numbers." },
  { icon: Unplug, title: "Disconnected tools", text: "Billing, stock, CRM and accounts live in separate apps. Your team re-types the same data every day." },
  { icon: EyeOff, title: "No real-time visibility", text: "You only find out what happened last month at month-end — when it's too late to act." },
  { icon: Clock3, title: "Hours lost to manual work", text: "Reminders, follow-ups, reports and approvals are all done by hand, slowing everyone down." },
  { icon: Puzzle, title: "Software that doesn't fit", text: "Generic tools force your team into workarounds instead of supporting how you really operate." },
  { icon: TrendingDown, title: "Growth creates chaos", text: "Every new branch, product or employee adds more confusion instead of more revenue." },
];

export const PROCESS = [
  { n: "01", title: "Discovery Call", text: "A free consultation to understand your business, current workflow and the problems worth solving." },
  { n: "02", title: "Scope & Proposal", text: "A clear written scope, timeline and fixed quote — so you know exactly what you're getting before you commit." },
  { n: "03", title: "Design & Prototype", text: "Clickable screens of your software so you can see and approve it before development begins." },
  { n: "04", title: "Build in Sprints", text: "Development in short cycles with regular demos. You see progress every step of the way." },
  { n: "05", title: "Launch & Training", text: "Deployment, data migration and hands-on training for your team so adoption is smooth." },
  { n: "06", title: "Support & Growth", text: "Ongoing maintenance, improvements and new features as your business evolves." },
];

export const WHY = [
  { title: "Business first, code second", text: "We start with your operations and outcomes, not technology buzzwords. Every feature must earn its place." },
  { title: "You own everything", text: "Full source code and data ownership. No lock-in, no surprise per-user licensing." },
  { title: "Transparent, fixed-scope pricing", text: "A written scope and clear quote before work begins. No vague hourly bills." },
  { title: "Direct access to the builders", text: "Talk directly to the people designing and writing your software — no layers of account managers." },
  { title: "Built for Indian businesses", text: "GST invoicing, UPI payments, WhatsApp notifications and IST support built in from day one." },
  { title: "Support after launch", text: "We stay with you after go-live with maintenance, fixes and improvements." },
];

export const FAQS = [
  { q: "How much does custom software cost?", a: "It depends on scope. Smaller tools and automations can start under ₹50K, while full ERP or multi-platform systems are larger investments. After a free discovery call, we share a written scope with a fixed quote so there are no surprises." },
  { q: "How long does it take to build?", a: "Simple tools and automations typically take 2–4 weeks. Web applications and CRMs usually take 1–3 months, and larger ERP systems 3–6 months. We break work into phases so you can start using core features early." },
  { q: "Will I own the source code?", a: "Yes. You get full ownership of the source code and your data. There is no lock-in." },
  { q: "Why custom software instead of an off-the-shelf tool?", a: "Off-the-shelf tools work when your process is generic. When your team relies on workarounds, multiple disconnected apps or growing per-user fees, custom software that fits your exact workflow is often more efficient and cost-effective long term." },
  { q: "Do you provide support after launch?", a: "Yes. We offer post-launch support and maintenance, including bug fixes, updates and new features as your business grows." },
  { q: "Can you integrate with tools we already use?", a: "Usually, yes — including payment gateways, WhatsApp, SMS, email, accounting tools and existing databases. We confirm feasibility during discovery." },
  { q: "What happens after I submit an enquiry?", a: "Our team reviews your requirements and contacts you within one business day to schedule a free consultation and understand your project in detail." },
];
