import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Target,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useStudyTracker } from "./hooks/useStudyTracker";
import type { TaskStatus } from "./hooks/useStudyTracker";
import {
  START_DATE,
  TOTAL_DAYS,
  getDayPhase,
  getTasksForDay,
} from "./studyPlanData";

const QUOTES = [
  "স্বপ্ন দেখো বড়, কাজ করো ছোট ছোট করে।",
  "প্রতিটি দিন একটি নতুন সুযোগ।",
  "আজকের পরিশ্রম আগামীকালের সাফল্য।",
  "ধৈর্য ধরো, সাফল্য আসবেই।",
  "তুমি পারবে, শুধু চেষ্টা করে যাও।",
  "একটু একটু করে এগিয়ে যাও, লক্ষ্যে পৌঁছাবেই।",
  "পরিশ্রমই সাফল্যের চাবিকাঠি।",
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
      "bg-pending-bg text-pending hover:bg-[oklch(0.88_0.02_255)] border border-[oklch(0.82_0.02_255)]",
    cardClass: "bg-white border-border",
    badgeClass: "bg-secondary text-secondary-foreground",
  },
  1: {
    label: "সম্পন্ন ✓",
    icon: CheckCircle2,
    btnClass:
      "bg-success text-success-foreground hover:bg-[oklch(0.56_0.17_151)]",
    cardClass: "bg-success-bg border-[oklch(0.86_0.09_151)]",
    badgeClass: "bg-success text-success-foreground",
  },
  2: {
    label: "মিস হয়েছে ✗",
    icon: XCircle,
    btnClass: "bg-danger text-danger-foreground hover:bg-[oklch(0.50_0.18_25)]",
    cardClass: "bg-danger-bg border-[oklch(0.86_0.08_25)]",
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

export default function App() {
  const { todayIndex, markCompleted, getDayStatuses, getOverallStats } =
    useStudyTracker();
  const [viewDay, setViewDay] = useState(todayIndex);
  const quoteIndex = useMemo(
    () => Math.floor(Math.random() * QUOTES.length),
    [],
  );

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
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <BookOpen size={28} className="flex-shrink-0" />
          <div>
            <h1 className="text-xl font-bold leading-tight">
              HSC Study Tracker
            </h1>
            <p className="text-xs opacity-80">
              এইচএসসি স্টাডি ট্র্যাকার · ১৮২ দিনের মাস্টারপ্ল্যান
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs opacity-75">আজ</p>
            <p className="text-sm font-semibold">Day {todayIndex + 1}</p>
          </div>
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

      <main
        className="flex-1 max-w-6xl mx-auto w-full px-4 py-6"
        data-ocid="main.section"
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
                <p className="text-xs opacity-80">{getDayDateShort(viewDay)}</p>
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
              <Badge
                className="bg-[oklch(0.93_0.04_251)] text-[oklch(0.38_0.14_251)] border border-[oklch(0.82_0.08_251)] text-xs px-3 py-1"
                data-ocid="phase.tab"
              >
                <Target size={12} className="mr-1.5" />
                {phase}
              </Badge>
              {isToday && (
                <Badge className="bg-success text-success-foreground text-xs px-3 py-1">
                  আজকের দিন
                </Badge>
              )}
            </div>

            {/* Task Cards */}
            <AnimatePresence mode="wait">
              <motion.div
                key={viewDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                data-ocid="task.list"
              >
                {tasks.length === 0 ? (
                  <div
                    className="col-span-3 bg-white rounded-xl border p-10 text-center text-muted-foreground"
                    data-ocid="task.empty_state"
                  >
                    <CalendarDays
                      size={40}
                      className="mx-auto mb-3 opacity-30"
                    />
                    <p className="font-medium">এই দিনের কোনো টাস্ক নেই।</p>
                  </div>
                ) : (
                  tasks.map((task, slotIndex) => (
                    <TaskCard
                      key={`task-${viewDay}-${task}`}
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
          </div>

          {/* Sidebar */}
          <aside
            className="lg:w-72 flex flex-col gap-4"
            data-ocid="sidebar.panel"
          >
            {/* Stats */}
            <div className="bg-white rounded-xl border shadow-card p-5">
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
            <div className="bg-white rounded-xl border shadow-card p-5">
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
                className="w-full bg-primary text-primary-foreground hover:bg-[oklch(0.44_0.14_251)]"
                data-ocid="today.primary_button"
              >
                <CalendarDays size={16} className="mr-2" />
                আজকে ফিরে যাও
              </Button>
            )}

            {/* Motivational quote */}
            <div className="bg-[oklch(0.96_0.04_251)] rounded-xl border border-[oklch(0.88_0.06_251)] p-5">
              <p className="text-xs font-semibold text-primary mb-1">
                অনুপ্রেরণা 💙
              </p>
              <p className="text-sm text-foreground leading-relaxed italic">
                &ldquo;{QUOTES[quoteIndex]}&rdquo;
              </p>
            </div>

            {/* Day range quick nav */}
            <div className="bg-white rounded-xl border shadow-card p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">
                দ্রুত নেভিগেশন
              </h3>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: Math.min(7, TOTAL_DAYS) }, (_, i) => {
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
                            ? "bg-[oklch(0.93_0.04_251)] text-primary border border-[oklch(0.82_0.08_251)]"
                            : "bg-secondary text-secondary-foreground hover:bg-[oklch(0.88_0.03_251)]"
                      }`}
                      data-ocid={`nav.button.${i + 1}`}
                    >
                      {d + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-white border-t border-border mt-4">
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
