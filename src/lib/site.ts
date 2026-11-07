import type { LucideIcon } from "lucide-react";
import {
  Apple,
  Carrot,
  Flower2,
  Leaf,
  Microscope,
  Sprout,
  Trees,
  Warehouse,
  GraduationCap,
  FlaskConical,
  Award,
  Landmark,
} from "lucide-react";

export const site = {
  name: "Horticulture Master",
  tagline: "CUET-PG | ICAR JRF | ICAR SRF | ASRB NET | Competitive Exams",
  shortDescription:
    "Exam-focused horticulture preparation for CUET-PG, ICAR JRF, ICAR SRF and ASRB NET aspirants — quizzes, study materials and agriculture job updates in one place.",
  /**
   * Community links. Leave empty until the real channel URL is available —
   * empty links render as "Link coming soon" instead of a dead button.
   */
  /** Public Google Drive folder whose PDFs power the study material library. */
  driveFolderId: "1rUg6IsLG_h_UiHdpFfrV4JVMUqajaMQ2",
  materialColumns: {
    notes: "Horticulture Master notes",
    books: "Other books",
  },
  social: {
    telegramChannel: "https://t.me/Horticulturemaster",
    telegramGroup: "https://t.me/horticulturmasterquiz",
    whatsapp: "https://chat.whatsapp.com/KLNOleZhkCv1AzzI6nhDg0",
    youtube: "",
  },
} as const;

export const mainNav = [
  { to: "/", label: "Home" },
  { to: "/quizzes", label: "Quizzes" },
  { to: "/materials", label: "Study Materials" },
  { to: "/jobs", label: "Jobs" },
  { to: "/updates", label: "Exams & News" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export type Exam = {
  code: string;
  name: string;
  summary: string;
  icon: LucideIcon;
};

export const exams: Exam[] = [
  {
    code: "CUET-PG",
    name: "Common University Entrance Test (PG)",
    summary: "Entrance route for M.Sc. admissions in horticulture and allied agricultural disciplines.",
    icon: GraduationCap,
  },
  {
    code: "ICAR JRF",
    name: "Junior Research Fellowship",
    summary: "Fellowship-linked preparation for Master's programmes at agricultural universities.",
    icon: FlaskConical,
  },
  {
    code: "ICAR SRF",
    name: "Senior Research Fellowship",
    summary: "Advanced subject depth for Ph.D. admission and fellowship in horticultural sciences.",
    icon: Award,
  },
  {
    code: "ASRB NET",
    name: "National Eligibility Test",
    summary: "Eligibility for Assistant Professor / Lecturer roles in agricultural universities.",
    icon: Landmark,
  },
];

export type Subject = { slug: string; name: string; focus: string; icon: LucideIcon };

export const subjects: Subject[] = [
  { slug: "vegetable-science", name: "Vegetable Science", focus: "Crop production, breeding & seed technology", icon: Carrot },
  { slug: "fruit-science", name: "Fruit Science", focus: "Pomology, orchard management & propagation", icon: Apple },
  { slug: "floriculture", name: "Floriculture & Landscaping", focus: "Commercial flowers, loose flowers & design", icon: Flower2 },
  { slug: "plantation-spices", name: "Plantation, Spices & MAP", focus: "Plantation, spice, medicinal & aromatic crops", icon: Leaf },
  { slug: "post-harvest", name: "Post-Harvest Technology", focus: "Physiology, storage & value addition", icon: Warehouse },
  { slug: "propagation", name: "Propagation & Nursery", focus: "Sexual & asexual propagation, nursery systems", icon: Sprout },
  { slug: "plant-physiology", name: "Plant Physiology & Biotech", focus: "Growth regulators, tissue culture & genetics", icon: Microscope },
  { slug: "general-horticulture", name: "General Horticulture", focus: "Fundamentals, statistics & agri-current affairs", icon: Trees },
];
