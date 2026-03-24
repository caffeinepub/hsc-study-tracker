import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlarmClock,
  Archive,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  CloudOff,
  ListTodo,
  LogIn,
  LogOut,
  Moon,
  Pencil,
  Sun,
  Target,
  Timer,
  User,
  X,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Calculator from "./components/Calculator";
import CalendarView from "./components/CalendarView";
import CountdownTimer from "./components/CountdownTimer";
import DailyRoutine from "./components/DailyRoutine";
import Stopwatch from "./components/Stopwatch";
import { useActor } from "./hooks/useActor";
import { useDarkMode } from "./hooks/useDarkMode";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useStudyTracker } from "./hooks/useStudyTracker";
import type { TaskStatus } from "./hooks/useStudyTracker";
import {
  START_DATE,
  TOTAL_DAYS,
  getDayPhase,
  getTasksForDay,
} from "./studyPlanData";

const QUOTES: string[] = [
  "স্বপ্ন দেখো বড়, কাজ করো ছোট ছোট করে।",
  "প্রতিটি দিন একটি নতুন সুযোগ — হাতছাড়া করো না।",
  "আজকের পরিশ্রম আগামীকালের সাফল্য।",
  "ধৈর্য ধরো, সাফল্য আসবেই।",
  "তুমি পারবে, শুধু চেষ্টা করে যাও।",
  "একটু একটু করে এগিয়ে যাও, লক্ষ্যে পৌঁছাবেই।",
  "পরিশ্রমই সাফল্যের চাবিকাঠি।",
  "হার মানা মানেই পরাজয় — এগিয়ে যাও।",
  "প্রতিটি ভোর নতুন করে শুরু করার সুযোগ দেয়।",
  "তোমার স্বপ্ন পূরণের শক্তি তোমার ভেতরেই আছে।",
  "কঠিন সময়ই মানুষকে শক্তিশালী করে।",
  "যে ছেড়ে দেয় না, সেই জেতে।",
  "ছোট ছোট পদক্ষেপেই বড় লক্ষ্য অর্জন হয়।",
  "আজ যা পড়বে, কাল তা কাজে লাগবে।",
  "তোমার মনের শক্তিই তোমার সবচেয়ে বড় অস্ত্র।",
  "সাফল্য আসে তাদের কাছে, যারা চেষ্টা থামায় না।",
  "আজকের ত্যাগই আগামীর পুরস্কার।",
  "নিজেকে বিশ্বাস করো — তুমি পারবেই।",
  "প্রতিটি অধ্যায় শেষ করা একটি জয়।",
  "ব্যর্থতা থেকেই শেখা যায়, হতাশ হয়ো না।",
  "লক্ষ্য স্থির রাখো, সব বাধা সরে যাবে।",
  "তোমার কঠোর পরিশ্রম তোমাকে বিশেষ করে তোলে।",
  "প্রতিদিন একটু ভালো হওয়ার চেষ্টা করো।",
  "তুমি যতটুকু কষ্ট করবে, ততটুকু পাবে।",
  "ভবিষ্যতের তুমি আজকের তোমার প্রতি কৃতজ্ঞ থাকবে।",
  "পড়াশোনা হলো বিনিয়োগ — সবচেয়ে মূল্যবান বিনিয়োগ।",
  "মনোযোগ দিয়ে পড়লে কঠিন বিষয়ও সহজ হয়ে যায়।",
  "আজ কষ্ট করো, ভবিষ্যতে আরাম পাবে।",
  "সেরাটা দেওয়ার চেষ্টা করো — ফলাফল আসবেই।",
  "প্রতিটি প্রশ্নের উত্তর জানার মধ্যে আনন্দ আছে।",
  "জ্ঞানই আলো — নিজেকে আলোকিত করো।",
  "হতাশ হলেও থামো না — চলতে থাকো।",
  "তুমি যা ভাবো তুমি তাই — ইতিবাচক থাকো।",
  "কঠিন পথেই সবচেয়ে সুন্দর গন্তব্য থাকে।",
  "সময় অমূল্য — প্রতিটি মিনিট কাজে লাগাও।",
  "তোমার প্রচেষ্টা কখনো বৃথা যায় না।",
  "আত্মবিশ্বাসই সাফল্যের প্রথম ধাপ।",
  "প্রতিটি সমস্যার একটি সমাধান আছে।",
  "শেখার কোনো শেষ নেই — প্রতিদিন নতুন কিছু শেখো।",
  "তুমি যা হতে চাও, তার জন্য আজই প্রস্তুতি নাও।",
  "একাগ্রতা এবং পরিশ্রম — এই দুটোই যথেষ্ট।",
  "স্বপ্ন যত বড়, পরিশ্রমও তত বেশি করতে হবে।",
  "প্রতিটি বই একটি নতুন দুনিয়া খুলে দেয়।",
  "আজকের মনোযোগ আগামীকালের ফলাফল নির্ধারণ করে।",
  "তোমার সাফল্যের গল্প তুমিই লিখছো — ভালো লেখো।",
  "নিজেকে চ্যালেঞ্জ করো — এটাই প্রগতির পথ।",
  "ক্লান্তি আসে, কিন্তু লক্ষ্য থেকে সরো না।",
  "তোমার পরিশ্রম একদিন সবার সামনে প্রমাণিত হবে।",
  "প্রতিটি পরীক্ষা একটি সুযোগ — ভয় পেয়ো না।",
  "সফল মানুষেরাও একসময় তোমার মতোই শুরু করেছিল।",
  "আজকে যা শিখলে, তা সারাজীবন কাজে আসবে।",
  "মনোবল হারিয়ো না — এটাই তোমার সবচেয়ে বড় শক্তি।",
  "পথ যতই কঠিন হোক, এগিয়ে চলো।",
  "তোমার সংগ্রামই তোমাকে মূল্যবান করে তোলে।",
  "প্রতিদিন সামান্য অগ্রগতিও বড় পরিবর্তন আনে।",
  "নিজের সেরা প্রতিযোগী নিজেই হও।",
  "পড়াশোনায় কোনো শর্টকাট নেই — পরিশ্রম করো।",
  "আজ যে কষ্ট করছো, তা ভবিষ্যতের তোমার জন্য উপহার।",
  "সাফল্য একটি যাত্রা, গন্তব্য নয়।",
  "তুমি যতটা মনে করো তার চেয়ে বেশি সক্ষম।",
  "প্রতিটি নতুন দিন একটি নতুন শুরু।",
  "কঠোর পরিশ্রম কখনো মিথ্যা হয় না।",
  "জ্ঞান অর্জনই হোক তোমার সবচেয়ে বড় লক্ষ্য।",
  "তোমার স্বপ্নকে বাস্তবে রূপ দেওয়ার সময় এখনই।",
  "একদিন তুমি পেছনে তাকাবে এবং গর্বিত হবে।",
  "সাফল্যের জন্য অপেক্ষা নয়, কাজ করো।",
  "প্রতিটি প্রচেষ্টাই তোমাকে লক্ষ্যের কাছাকাছি নিয়ে যাচ্ছে।",
  "হার মানার আগে আরেকবার চেষ্টা করো।",
  "তুমি তোমার সেরা দিনটির অপেক্ষায় আছো।",
  "শেষ পর্যন্ত টিকে থাকাই বিজয়।",
  "তুমি আজ যা পড়ছো, কাল তা তোমার সাথে থাকবে।",
  "আত্মবিশ্বাস এবং পরিশ্রম — এই দুটো থাকলেই হবে।",
  "প্রতিটি দিন একটি সুযোগ — সদ্ব্যবহার করো।",
  "তোমার স্বপ্নকে সত্যি করার শক্তি তোমার মধ্যেই আছে।",
  "অধ্যবসায়ই সাফল্যের মূল রহস্য।",
  "তুমি যা করছো তা গুরুত্বপূর্ণ — মনোযোগ দাও।",
  "প্রতিটি পরীক্ষায় সেরাটা দাও।",
  "আজকের পড়াশোনাই আগামীকালের সাফল্যের ভিত্তি।",
  "নিজেকে বিশ্বাস করো — তুমি অনেক কিছু করতে পারো।",
  "তোমার পথ কঠিন হলেও তুমি শক্তিশালী।",
  "প্রতিটি শিক্ষার্থী একদিন সফল হয়, যদি চেষ্টা চালিয়ে যায়।",
  "আজকের মনোযোগ আগামীকালের নম্বর নির্ধারণ করে।",
  "তোমার সাফল্য অনিবার্য — শুধু চেষ্টা করে যাও।",
  "পড়াশোনার প্রতি ভালোবাসা তোমাকে এগিয়ে নিয়ে যাবে।",
  "তুমি যেটা শুরু করেছো, শেষ পর্যন্ত করে যাও।",
  "প্রতিটি প্রচেষ্টাই তোমাকে লক্ষ্যের কাছাকাছি নিয়ে যাচ্ছে।",
  "হার মানার আগে আরেকবার চেষ্টা করো।",
  "তুমি তোমার সেরা দিনটির অপেক্ষায় আছো।",
  "শেষ পর্যন্ত টিকে থাকাই বিজয়।",
  "স্বপ্নকে বাস্তবে রূপ দেওয়ার একমাত্র পথ হলো কাজ।",
  "তোমার ভবিষ্যত তোমার হাতেই আছে।",
  "প্রতিটি মুহূর্ত মূল্যবান — কাজে লাগাও।",
  "সঠিক পরিশ্রম সঠিক ফল নিয়ে আসে।",
  "তুমি আজকের চ্যালেঞ্জ মোকাবেলা করতে সক্ষম।",
  "সফলতার পথে প্রতিটি পদক্ষেপই গুরুত্বপূর্ণ।",
  "তোমার কঠিন কাজই তোমাকে অনন্য করে তোলে।",
  "প্রতিটি দিনে সেরাটা দেওয়ার চেষ্টা করো।",
  "তোমার স্বপ্ন বড়, তাই পরিশ্রমও বড় হতে হবে।",
  "আজকের অধ্যয়নই আগামীকালের সাফল্য।",
  "তুমি সক্ষম, তুমি যোগ্য, তুমি পারবে।",
  "প্রতিটি বিষয় মনোযোগ দিয়ে পড়লে সহজ হয়ে যায়।",
  "লক্ষ্য থেকে কখনো সরে যেও না।",
  "তোমার পরিশ্রম তোমার সাফল্যের ভিত্তি।",
  "আজ যা শিখছো, তা কাল তোমার কাজে আসবে।",
  "সাফল্যের পথ কঠিন হলেও সুন্দর।",
  "তুমি প্রতিদিন আরো ভালো হচ্ছো।",
  "মনের শক্তি দিয়ে সব বাধা পার করা যায়।",
  "তোমার স্বপ্নের কথা মনে রেখো, চেষ্টা থামিও না।",
  "পড়াশোনায় নিয়মিত থাকলে সাফল্য আসবেই।",
  "তোমার প্রতিটি প্রচেষ্টা মূল্যবান।",
  "আজকে শুরু করো, আগামীকাল সহজ হবে।",
  "তুমি যা করছো তার মূল্য একদিন বুঝতে পারবে।",
  "সেরা ফলাফলের জন্য সেরা প্রচেষ্টা করো।",
  "তোমার কাজই তোমার পরিচয়।",
  "প্রতিটি কঠিন মুহূর্তে মনে রেখো — তুমি পারবে।",
  "সাফল্য তাদের জন্যই আসে, যারা হাল ছাড়ে না।",
  "তোমার পড়াশোনা তোমার ভবিষ্যত গড়ছে।",
  "আজকের কষ্ট আগামীকালের আনন্দ।",
  "তুমি একটু একটু করে এগিয়ে যাচ্ছো — থামো না।",
  "প্রতিটি দিন একটি নতুন সম্ভাবনা নিয়ে আসে।",
  "তোমার মেধা এবং পরিশ্রম — দুটো মিলিয়ে এগিয়ে চলো।",
  "লক্ষ্য স্থির রাখলে পথ সহজ হয়ে যায়।",
  "তুমি যত বেশি পড়বে, তত বেশি জানবে।",
  "আজকের অনুশীলনই আগামীকালের দক্ষতা।",
  "তোমার স্বপ্নকে সত্যি করতে আজ থেকেই শুরু করো।",
  "সাফল্য একদিনে আসে না, ধৈর্য ধরো।",
  "তুমি যতটা ভাবছো তার চেয়ে বেশি পারো।",
  "প্রতিটি ছোট পদক্ষেপই বড় লক্ষ্যের দিকে নিয়ে যায়।",
  "কঠিন পরিশ্রমই সফলতার একমাত্র পথ।",
  "তোমার চেষ্টাই তোমার সবচেয়ে বড় শক্তি।",
  "আজকে যা করছো, তা ভবিষ্যতে কাজে আসবে।",
  "তুমি সেরা — শুধু নিজেকে প্রমাণ করো।",
  "প্রতিটি দিন পড়াশোনায় মনোযোগ দাও।",
  "তোমার লক্ষ্য বড়, তাই প্রচেষ্টাও বড় হওয়া দরকার।",
  "তুমি এগিয়ে যাচ্ছো — থামো না, চলতে থাকো।",
  "সাফল্যের স্বাদ পেতে হলে কষ্ট করতে হবে।",
  "তুমি প্রতিদিন নিজেকে ছাড়িয়ে যাচ্ছো।",
  "আজকের পরিশ্রম আগামীকালের সুখ।",
  "তোমার মনোবল শক্তিশালী রাখো।",
  "প্রতিটি বিষয় ভালোভাবে বুঝে পড়ো।",
  "তুমি যা শিখছো তা তোমার সম্পদ।",
  "আজকে কঠিন হলেও আগামীকাল সহজ হবে।",
  "তোমার স্বপ্ন পূরণের পথে তুমি একা নও।",
  "প্রতিটি দিন নতুন কিছু শিখো।",
  "তোমার উজ্জ্বল ভবিষ্যত তোমার হাতে।",
  "সাফল্য পেতে হলে আজই কাজ শুরু করো।",
  "তুমি পারবে — এই বিশ্বাস রাখো সবসময়।",
  "প্রতিটি চ্যালেঞ্জ তোমাকে আরো শক্তিশালী করছে।",
  "তোমার কঠিন কাজই তোমার সেরা পরিচয়।",
  "আজকের শিক্ষাই আগামীকালের পথপ্রদর্শক।",
  "তুমি যতটা পারো সেটুকু করো — তাতেই সাফল্য।",
  "প্রতিটি দিন শেষে নিজেকে জিজ্ঞেস করো — আজ কি ভালো করলাম?",
  "তোমার প্রতিটি পদক্ষেপই সঠিক দিকে।",
  "আজকে যা শুরু করলে, তা শেষ করো।",
  "তুমি তোমার লক্ষ্যের দিকে এগিয়ে যাচ্ছো।",
  "সাফল্য তাদের জন্যই অপেক্ষা করে যারা থামে না।",
  "তোমার আজকের পরিশ্রম তোমার ভবিষ্যত নির্মাণ করছে।",
  "প্রতিটি নতুন দিন নতুন শুরুর সুযোগ।",
  "তুমি পারো — শুধু বিশ্বাস রাখো।",
];

type Tab = "study" | "routine" | "calendar" | "stopwatch" | "countdown";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "study", label: "পড়ার পরিকল্পনা", icon: <BookOpen size={16} /> },
  { id: "routine", label: "রুটিন", icon: <ListTodo size={16} /> },
  { id: "calendar", label: "ক্যালেন্ডার", icon: <CalendarDays size={16} /> },
  { id: "stopwatch", label: "Stopwatch", icon: <Timer size={16} /> },
  { id: "countdown", label: "Countdown", icon: <AlarmClock size={16} /> },
];

function getDayDate(dayIndex: number): string {
  const d = new Date(START_DATE);
  d.setDate(d.getDate() + dayIndex);
  return d.toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getDayDateShort(dayIndex: number): string {
  const d = new Date(START_DATE);
  d.setDate(d.getDate() + dayIndex);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const statusConfig = {
  0: {
    label: "পড়িনি",
    icon: Clock,
    btnClass:
      "bg-pending-bg text-pending hover:bg-[oklch(0.88_0.02_255)] border border-[oklch(0.82_0.02_255)] dark:bg-[oklch(0.24_0.04_265)] dark:text-[oklch(0.65_0.01_255)] dark:hover:bg-[oklch(0.28_0.05_265)] dark:border-[oklch(0.32_0.06_265)]",
    cardClass: "bg-white border-border dark:bg-card dark:border-border",
    badgeClass: "bg-secondary text-secondary-foreground",
  },
  1: {
    label: "সম্পন্ন ✓",
    icon: CheckCircle2,
    btnClass:
      "bg-success text-success-foreground hover:bg-[oklch(0.56_0.17_151)] dark:hover:bg-[oklch(0.70_0.18_151)]",
    cardClass:
      "bg-success-bg border-[oklch(0.86_0.09_151)] dark:bg-[oklch(0.22_0.06_151)] dark:border-[oklch(0.35_0.10_151)]",
    badgeClass: "bg-success text-success-foreground",
  },
  2: {
    label: "মিস হয়েছে ✗",
    icon: XCircle,
    btnClass:
      "bg-danger text-danger-foreground hover:bg-[oklch(0.50_0.18_25)] dark:hover:bg-[oklch(0.70_0.18_25)]",
    cardClass:
      "bg-danger-bg border-[oklch(0.86_0.08_25)] dark:bg-[oklch(0.22_0.06_25)] dark:border-[oklch(0.35_0.10_25)]",
    badgeClass: "bg-destructive text-destructive-foreground",
  },
} as const;

function TaskCard({
  task,
  slotIndex,
  dayIndex,
  status,
  onMark,
  todayIndex,
}: {
  task: string;
  slotIndex: number;
  dayIndex: number;
  status: TaskStatus;
  onMark: (day: number, slot: number) => void;
  todayIndex: number;
}) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  const isFuture = dayIndex > todayIndex;
  const isClickable = !isFuture && status !== 1;

  const handleClick = () => {
    if (isClickable) onMark(dayIndex, slotIndex);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: slotIndex * 0.08, duration: 0.3 }}
      className={`rounded-xl border p-5 shadow-card flex flex-col gap-4 ${cfg.cardClass}`}
      data-ocid={`task.item.${slotIndex + 1}`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${cfg.badgeClass}`}
        >
          {slotIndex + 1}
        </span>
        <p className="text-sm font-semibold text-foreground leading-snug flex-1">
          {task}
        </p>
      </div>
      <button
        type="button"
        onClick={handleClick}
        disabled={!isClickable}
        className={`w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${cfg.btnClass} ${!isClickable ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
        data-ocid={`task.button.${slotIndex + 1}`}
      >
        <Icon size={16} />
        {isFuture ? "ভবিষ্যৎ" : cfg.label}
      </button>
    </motion.div>
  );
}

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

export default function App() {
  const {
    todayIndex,
    data,
    setData,
    markCompleted,
    getDayStatuses,
    getOverallStats,
  } = useStudyTracker();
  const [viewDay, setViewDay] = useState(todayIndex);
  const [activeTab, setActiveTab] = useState<Tab>("study");
  const { isDark, setIsDark, toggle: toggleDark } = useDarkMode();

  // Internet Identity
  const { identity, login, clear, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const { actor } = useActor();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  // Sync status
  type SyncStatus = "idle" | "syncing" | "synced" | "error";
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoadedRef = useRef(false);
  const loadStartedRef = useRef(false);

  const [secsLeft, setSecsLeft] = useState(getSecondsUntilMidnight);
  useEffect(() => {
    const timer = setInterval(
      () => setSecsLeft(getSecondsUntilMidnight()),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  // Notes state
  const [notes, setNotes] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem("hsc-notes");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [editingNote, setEditingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showBacklog, setShowBacklog] = useState(false);

  // Reset edit mode when switching days
  // biome-ignore lint/correctness/useExhaustiveDependencies: viewDay is intentionally used as trigger
  useEffect(() => {
    setEditingNote(false);
    setShowBacklog(false);
  }, [viewDay]);

  // Load from backend on login
  useEffect(() => {
    if (!isLoggedIn || !actor || loadStartedRef.current) return;
    loadStartedRef.current = true;
    setSyncStatus("syncing");
    actor
      .load()
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed.taskStates) setData(parsed.taskStates);
            if (parsed.notes) {
              setNotes(parsed.notes);
              localStorage.setItem("hsc-notes", JSON.stringify(parsed.notes));
            }
            if (typeof parsed.darkMode === "boolean")
              setIsDark(parsed.darkMode);
          } catch {
            // ignore parse errors
          }
        }
        hasLoadedRef.current = true;
        setSyncStatus("synced");
        if (syncedTimerRef.current) clearTimeout(syncedTimerRef.current);
        syncedTimerRef.current = setTimeout(() => setSyncStatus("idle"), 3000);
      })
      .catch(() => {
        loadStartedRef.current = false;
        setSyncStatus("error");
      });
  }, [isLoggedIn, actor, setData, setIsDark]);

  // Reset refs on logout
  useEffect(() => {
    if (!isLoggedIn) {
      hasLoadedRef.current = false;
      loadStartedRef.current = false;
      setSyncStatus("idle");
    }
  }, [isLoggedIn]);

  // Debounce save to backend when logged in
  useEffect(() => {
    if (!isLoggedIn || !actor) return;
    // Don't save during initial load
    if (!hasLoadedRef.current) return;

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      setSyncStatus("syncing");
      const payload = JSON.stringify({
        taskStates: data,
        notes,
        darkMode: isDark,
      });
      actor
        .save(payload)
        .then(() => {
          setSyncStatus("synced");
          if (syncedTimerRef.current) clearTimeout(syncedTimerRef.current);
          syncedTimerRef.current = setTimeout(
            () => setSyncStatus("idle"),
            3000,
          );
        })
        .catch(() => setSyncStatus("error"));
    }, 500);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [data, notes, isDark, isLoggedIn, actor]);

  const handleEditNote = () => {
    setNoteText(notes[viewDay] ?? "");
    setEditingNote(true);
  };

  const handleSaveNote = () => {
    const updated = { ...notes, [viewDay]: noteText };
    setNotes(updated);
    try {
      localStorage.setItem("hsc-notes", JSON.stringify(updated));
    } catch {}
    setEditingNote(false);
  };

  const handleCancelNote = () => {
    setEditingNote(false);
  };

  const countdownHH = String(Math.floor(secsLeft / 3600)).padStart(2, "0");
  const countdownMM = String(Math.floor((secsLeft % 3600) / 60)).padStart(
    2,
    "0",
  );
  const countdownSS = String(secsLeft % 60).padStart(2, "0");

  // Show one unique quote per day (based on viewDay index)
  const quoteIndex = viewDay % QUOTES.length;

  const tasks = getTasksForDay(viewDay);
  const statuses = getDayStatuses(viewDay);
  const phase = getDayPhase(viewDay);
  const stats = getOverallStats();
  const totalTasks = (() => {
    let t = 0;
    for (let d = 0; d < TOTAL_DAYS; d++) t += getTasksForDay(d).length;
    return t;
  })();
  const progressPct =
    totalTasks > 0 ? Math.round((stats.completed / totalTasks) * 100) : 0;

  const isToday = viewDay === todayIndex;

  const goToPrev = () => setViewDay((d) => Math.max(0, d - 1));
  const goToNext = () => setViewDay((d) => Math.min(TOTAL_DAYS - 1, d + 1));
  const goToToday = () => setViewDay(todayIndex);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header — scrolls away normally */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <img
            src="/assets/generated/icon-192.dim_192x192.png"
            alt="Engineer.ABDULLAH"
            className="w-10 h-10 flex-shrink-0 rounded-lg"
          />
          <div>
            <h1 className="text-xl font-bold leading-tight">
              Engineer.ABDULLAH
            </h1>
            <p className="text-xs opacity-80">
              এইচএসসি স্টাডি ট্র্যাকার · ১৮২ দিনের মাস্টারপ্ল্যান
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Sync status indicator */}
            {isLoggedIn && (
              <AnimatePresence mode="wait">
                {syncStatus === "syncing" && (
                  <motion.span
                    key="syncing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-white/80 flex items-center gap-1 flex-shrink-0"
                    data-ocid="sync.loading_state"
                  >
                    <Cloud size={13} className="animate-pulse" />
                    সিঙ্ক হচ্ছে...
                  </motion.span>
                )}
                {syncStatus === "synced" && (
                  <motion.span
                    key="synced"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-green-300 flex items-center gap-1 flex-shrink-0"
                    data-ocid="sync.success_state"
                  >
                    <Cloud size={13} />
                    সিঙ্ক ✓
                  </motion.span>
                )}
                {syncStatus === "error" && (
                  <motion.span
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-300 flex items-center gap-1 flex-shrink-0"
                    data-ocid="sync.error_state"
                  >
                    <CloudOff size={13} />
                    এরর
                  </motion.span>
                )}
              </AnimatePresence>
            )}

            {/* Login/Logout button */}
            <button
              type="button"
              onClick={isLoggedIn ? clear : login}
              disabled={isLoggingIn || isInitializing}
              aria-label={isLoggedIn ? "লগআউট করুন" : "লগইন করুন"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/25 transition-all duration-200 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              data-ocid="auth.toggle"
            >
              {isLoggingIn || isInitializing ? (
                <span className="w-3.5 h-3.5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : isLoggedIn ? (
                <>
                  <User size={13} />
                  <span className="hidden sm:inline">লগআউট</span>
                  <LogOut size={12} className="hidden sm:inline" />
                </>
              ) : (
                <>
                  <LogIn size={13} />
                  <span className="hidden sm:inline">লগইন</span>
                </>
              )}
            </button>

            {/* Dark mode toggle */}
            <button
              type="button"
              onClick={toggleDark}
              aria-label={isDark ? "Light mode চালু করো" : "Dark mode চালু করো"}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 transition-all duration-200 flex-shrink-0"
              data-ocid="theme.toggle"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={18} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={18} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <div className="text-right">
              <p className="text-xs opacity-75">আজ</p>
              <p className="text-sm font-semibold">Day {todayIndex + 1}</p>
            </div>
          </div>
        </div>
        {/* 24-hour Day Countdown */}
        <div
          className="bg-[oklch(0.36_0.13_251)] px-4 py-3 text-center"
          data-ocid="day_countdown.panel"
        >
          <p className="text-base text-white/75 font-medium tracking-wide">
            ⏳ আজকের দিন শেষ হতে আর
          </p>
          <p
            className="text-5xl font-bold text-white tabular-nums tracking-widest leading-tight mt-1"
            data-ocid="day_countdown.card"
          >
            {countdownHH}:{countdownMM}:{countdownSS}
          </p>
        </div>

        {/* Overall progress */}
        <div className="bg-[oklch(0.40_0.14_251)] px-4 py-2">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <BarChart3 size={14} className="opacity-80 flex-shrink-0" />
            <div className="flex-1">
              <Progress
                value={progressPct}
                className="h-2 bg-[oklch(0.30_0.10_251)]"
              />
            </div>
            <span className="text-xs font-semibold opacity-90 flex-shrink-0">
              {stats.completed}/{totalTasks} ({progressPct}%)
            </span>
          </div>
        </div>
      </header>

      {/* Tab bar — sticky, stays at top when scrolling */}
      <div
        className="sticky top-0 z-30 bg-[oklch(0.35_0.12_251)] border-b border-[oklch(0.30_0.10_251)] shadow-md"
        data-ocid="nav.section"
      >
        <div className="max-w-6xl mx-auto px-2 flex overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border-b-2 flex-shrink-0 ${
                activeTab === tab.id
                  ? "border-white text-white"
                  : "border-transparent text-white/60 hover:text-white/90"
              }`}
              data-ocid="nav.tab"
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <main className="flex-1" data-ocid="main.section">
        <AnimatePresence mode="wait">
          {activeTab === "study" && (
            <motion.div
              key="study"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto w-full px-4 py-6"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Day navigator + tasks */}
                <div className="flex-1 flex flex-col gap-5">
                  {/* Day Navigator */}
                  <div
                    className="bg-primary text-primary-foreground rounded-2xl px-4 py-3 flex items-center gap-3 shadow-card"
                    data-ocid="day.panel"
                  >
                    <button
                      type="button"
                      onClick={goToPrev}
                      disabled={viewDay === 0}
                      className="w-9 h-9 rounded-full flex items-center justify-center bg-[oklch(1_0_0_/_0.15)] hover:bg-[oklch(1_0_0_/_0.25)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      data-ocid="day.pagination_prev"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex-1 text-center">
                      <p className="text-lg font-bold">Day {viewDay + 1}</p>
                      <p className="text-xs opacity-80">
                        {getDayDateShort(viewDay)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={goToNext}
                      disabled={viewDay === TOTAL_DAYS - 1}
                      className="w-9 h-9 rounded-full flex items-center justify-center bg-[oklch(1_0_0_/_0.15)] hover:bg-[oklch(1_0_0_/_0.25)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      data-ocid="day.pagination_next"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  {/* Phase badge */}
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[oklch(0.93_0.04_251)] text-[oklch(0.38_0.14_251)] border border-[oklch(0.82_0.08_251)] dark:bg-[oklch(0.26_0.06_265)] dark:text-[oklch(0.75_0.10_265)] dark:border-[oklch(0.35_0.08_265)] font-semibold">
                      {phase}
                    </Badge>
                    {isToday && (
                      <Badge className="bg-success text-success-foreground font-semibold">
                        আজকের দিন
                      </Badge>
                    )}
                  </div>

                  {/* Notes section */}
                  <div
                    className="bg-card rounded-xl border border-border shadow-card p-4"
                    data-ocid="notes.panel"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Pencil size={14} className="text-primary" />
                        নোটস — Day {viewDay + 1}
                      </h3>
                      {!editingNote && (
                        <button
                          type="button"
                          onClick={handleEditNote}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                          data-ocid="notes.edit_button"
                        >
                          <Pencil size={12} />
                          {notes[viewDay] ? "সম্পাদনা" : "যোগ করুন"}
                        </button>
                      )}
                    </div>
                    {editingNote ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="এখানে নোট লিখুন..."
                          rows={3}
                          className="w-full text-sm border border-border rounded-lg p-2 bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                          data-ocid="notes.textarea"
                          // biome-ignore lint/a11y/noAutofocus: note editing
                          autoFocus
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={handleCancelNote}
                            className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                            data-ocid="notes.cancel_button"
                          >
                            <X size={12} className="inline mr-1" />
                            বাতিল
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveNote}
                            className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                            data-ocid="notes.save_button"
                          >
                            <Check size={12} className="inline mr-1" />
                            সেভ করুন
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p
                        className={`text-sm ${
                          notes[viewDay]
                            ? "text-foreground"
                            : "text-muted-foreground italic"
                        }`}
                        data-ocid="notes.panel"
                      >
                        {notes[viewDay] || "কোনো নোট নেই। যোগ করুন →"}
                      </p>
                    )}
                  </div>

                  {/* Tasks */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={viewDay}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col gap-4"
                    >
                      {tasks.length === 0 ? (
                        <p
                          className="text-center text-muted-foreground py-8"
                          data-ocid="task.empty_state"
                        >
                          এই দিনে কোনো কাজ নেই।
                        </p>
                      ) : (
                        tasks.map((task, slotIndex) => (
                          <TaskCard
                            key={`${viewDay}-${task}`}
                            task={task}
                            slotIndex={slotIndex}
                            dayIndex={viewDay}
                            status={statuses[slotIndex]}
                            onMark={markCompleted}
                            todayIndex={todayIndex}
                          />
                        ))
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* BackLog Card Button */}
                  {tasks.length > 0 &&
                    (() => {
                      const missedTasks: {
                        dayIndex: number;
                        slotIndex: number;
                        taskName: string;
                      }[] = [];
                      for (let d = 0; d < viewDay; d++) {
                        const dayStatuses = getDayStatuses(d);
                        const dayTasks = getTasksForDay(d);
                        dayTasks.forEach((taskName, slotIndex) => {
                          if (dayStatuses[slotIndex] === 2) {
                            missedTasks.push({
                              dayIndex: d,
                              slotIndex,
                              taskName,
                            });
                          }
                        });
                      }
                      const missedCount = missedTasks.length;
                      return (
                        <>
                          <motion.button
                            onClick={() => setShowBacklog((v) => !v)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            data-ocid="backlog.toggle"
                            className={`w-full mt-2 flex items-center justify-between p-4 rounded-xl border-2 transition-colors cursor-pointer ${showBacklog ? "bg-amber-100 dark:bg-amber-950 border-amber-400 dark:border-amber-600" : "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-950"}`}
                          >
                            <div className="flex items-center gap-3">
                              <Archive
                                size={22}
                                className="text-amber-600 dark:text-amber-400"
                              />
                              <span className="font-bold text-amber-800 dark:text-amber-300 text-lg">
                                Back Log
                              </span>
                              {missedCount > 0 && (
                                <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                                  {missedCount}টি মিস
                                </span>
                              )}
                            </div>
                            <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">
                              {showBacklog ? "▲ বন্ধ করুন" : "▼ দেখুন"}
                            </span>
                          </motion.button>

                          <AnimatePresence>
                            {showBacklog && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                                data-ocid="backlog.panel"
                              >
                                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-1">
                                  <h4 className="text-amber-800 dark:text-amber-300 font-bold mb-3 flex items-center gap-2">
                                    <Archive size={16} />
                                    মিস হওয়া ক্লাস
                                  </h4>
                                  {missedCount === 0 ? (
                                    <p
                                      className="text-center text-amber-600 dark:text-amber-400 py-4 font-medium"
                                      data-ocid="backlog.empty_state"
                                    >
                                      কোনো মিস হওয়া ক্লাস নেই 🎉
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      {missedTasks.map((item, idx) => (
                                        <div
                                          key={`backlog-${item.dayIndex}-${item.slotIndex}`}
                                          data-ocid={`backlog.item.${idx + 1}`}
                                          className="flex items-center justify-between bg-white dark:bg-amber-950/60 border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2 gap-3"
                                        >
                                          <div className="flex-1 min-w-0">
                                            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold block">
                                              Day {item.dayIndex + 1}
                                            </span>
                                            <span className="text-sm text-foreground font-medium truncate block">
                                              {item.taskName}
                                            </span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              markCompleted(
                                                item.dayIndex,
                                                item.slotIndex,
                                              )
                                            }
                                            data-ocid={`backlog.complete_button.${idx + 1}`}
                                            className="flex-shrink-0 flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                                          >
                                            <Check size={12} />
                                            সম্পন্ন
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      );
                    })()}
                </div>

                {/* Sidebar */}
                <aside
                  className="lg:w-72 flex flex-col gap-4"
                  data-ocid="sidebar.panel"
                >
                  {/* Stats */}
                  <div className="bg-card rounded-xl border shadow-card p-5">
                    <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                      <BarChart3 size={16} className="text-primary" />
                      সামগ্রিক অগ্রগতি
                    </h3>
                    <div className="space-y-3">
                      <div
                        className="flex items-center justify-between"
                        data-ocid="stats.row"
                      >
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-success" />
                          সম্পন্ন
                        </span>
                        <Badge className="bg-success-bg text-success border-0 font-bold">
                          {stats.completed}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <XCircle size={14} className="text-destructive" />
                          মিস হয়েছে
                        </span>
                        <Badge className="bg-danger-bg text-destructive border-0 font-bold">
                          {stats.missed}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock size={14} className="text-pending" />
                          বাকি
                        </span>
                        <Badge className="bg-pending-bg text-pending border-0 font-bold">
                          {stats.pending}
                        </Badge>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                          <span>সম্পূর্ণতা</span>
                          <span className="font-semibold text-primary">
                            {progressPct}%
                          </span>
                        </div>
                        <Progress value={progressPct} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Phase info */}
                  <div className="bg-card rounded-xl border shadow-card p-5">
                    <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                      <Target size={16} className="text-primary" />
                      বর্তমান ফেজ
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {phase}
                    </p>
                    <div className="mt-3 text-xs">
                      <span className="text-muted-foreground">দেখছেন: </span>
                      <span className="font-semibold text-primary">
                        {getDayDate(viewDay)}
                      </span>
                    </div>
                  </div>

                  {/* Go to today */}
                  {!isToday && (
                    <Button
                      onClick={goToToday}
                      className="w-full bg-primary text-primary-foreground hover:bg-[oklch(0.44_0.14_251)] dark:hover:bg-[oklch(0.72_0.16_251)]"
                      data-ocid="today.primary_button"
                    >
                      <CalendarDays size={16} className="mr-2" />
                      আজকে ফিরে যাও
                    </Button>
                  )}

                  {/* Login status card */}
                  <div
                    className={`rounded-xl border shadow-card p-4 ${
                      isLoggedIn
                        ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                        : "bg-card border-border"
                    }`}
                    data-ocid="auth.card"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {isLoggedIn ? (
                        <Cloud
                          size={14}
                          className="text-green-600 dark:text-green-400"
                        />
                      ) : (
                        <CloudOff size={14} className="text-muted-foreground" />
                      )}
                      <h3 className="text-xs font-bold text-foreground">
                        {isLoggedIn ? "ক্লাউড সিঙ্ক চালু" : "ক্লাউড সিঙ্ক বন্ধ"}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isLoggedIn
                        ? "সব ডিভাইসে data sync হচ্ছে।"
                        : "লগইন করলে laptop ও mobile-এ একই data থাকবে।"}
                    </p>
                    {!isLoggedIn && (
                      <button
                        type="button"
                        onClick={login}
                        disabled={isLoggingIn || isInitializing}
                        className="mt-2 w-full text-xs py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                        data-ocid="auth.primary_button"
                      >
                        <LogIn size={12} className="inline mr-1" />
                        লগইন করুন
                      </button>
                    )}
                  </div>

                  {/* Motivational quote — one per day */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={quoteIndex}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[oklch(0.96_0.04_251)] dark:bg-[oklch(0.22_0.06_265)] rounded-xl border border-[oklch(0.88_0.06_251)] dark:border-[oklch(0.30_0.07_265)] p-5"
                    >
                      <p className="text-xs font-semibold text-primary mb-1">
                        অনুপ্রেরণা 💙 — Day {viewDay + 1}
                      </p>
                      <p className="text-sm text-foreground leading-relaxed italic">
                        &ldquo;{QUOTES[quoteIndex]}&rdquo;
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Day range quick nav */}
                  <div className="bg-card rounded-xl border shadow-card p-5">
                    <h3 className="text-sm font-bold text-foreground mb-3">
                      দ্রুত নেভিগেশন
                    </h3>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from(
                        { length: Math.min(7, TOTAL_DAYS) },
                        (_, i) => {
                          const d = Math.max(0, todayIndex - 3) + i;
                          if (d >= TOTAL_DAYS) return null;
                          const isActive = d === viewDay;
                          const isT = d === todayIndex;
                          return (
                            <button
                              type="button"
                              key={d}
                              onClick={() => setViewDay(d)}
                              className={`text-xs py-1.5 rounded-lg font-medium transition-all ${
                                isActive
                                  ? "bg-primary text-primary-foreground"
                                  : isT
                                    ? "bg-[oklch(0.93_0.04_251)] dark:bg-[oklch(0.26_0.06_265)] text-primary border border-[oklch(0.82_0.08_251)] dark:border-[oklch(0.35_0.08_265)]"
                                    : "bg-secondary text-secondary-foreground hover:bg-[oklch(0.88_0.03_251)] dark:hover:bg-[oklch(0.30_0.05_265)]"
                              }`}
                              data-ocid={`nav.button.${i + 1}`}
                            >
                              {d + 1}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {activeTab === "routine" && (
            <motion.div
              key="routine"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto w-full px-4"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1 min-w-0">
                  <DailyRoutine />
                </div>
                <div className="flex-shrink-0 flex justify-center lg:justify-start">
                  <Calculator darkMode={isDark} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "calendar" && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto w-full px-4"
            >
              <CalendarView />
            </motion.div>
          )}

          {activeTab === "stopwatch" && (
            <motion.div
              key="stopwatch"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto w-full px-4"
            >
              <Stopwatch />
            </motion.div>
          )}

          {activeTab === "countdown" && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto w-full px-4"
            >
              <CountdownTimer />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-card border-t border-border mt-4">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
