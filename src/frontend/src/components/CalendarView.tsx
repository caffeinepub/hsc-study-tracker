import { motion } from "motion/react";
import { useState } from "react";
import { useStudyTracker } from "../hooks/useStudyTracker";
import { START_DATE, TOTAL_DAYS, getTasksForDay } from "../studyPlanData";

const BN_DAYS = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"];

function getDateForDay(dayIndex: number): Date {
  const d = new Date(START_DATE);
  d.setDate(d.getDate() + dayIndex);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

type MonthGroup = {
  year: number;
  month: number;
  days: { dayIndex: number; date: Date }[];
};

function buildMonthGroups(): MonthGroup[] {
  const groups: MonthGroup[] = [];
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const date = getDateForDay(i);
    const y = date.getFullYear();
    const m = date.getMonth();
    let group = groups.find((g) => g.year === y && g.month === m);
    if (!group) {
      group = { year: y, month: m, days: [] };
      groups.push(group);
    }
    group.days.push({ dayIndex: i, date });
  }
  return groups;
}

const MONTH_GROUPS = buildMonthGroups();

const BN_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

type SlotStatus = { slot: number; status: 0 | 1 | 2 };

export default function CalendarView() {
  const { getDayStatuses, todayIndex } = useStudyTracker();
  const [selected, setSelected] = useState<number | null>(null);
  const today = getDateForDay(todayIndex);

  function getDayColor(dayIndex: number) {
    const statuses = getDayStatuses(dayIndex);
    const tasks = getTasksForDay(dayIndex);
    if (tasks.length === 0)
      return "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500";
    const completed = statuses.filter((s) => s === 1).length;
    const missed = statuses.filter((s) => s === 2).length;
    if (completed === tasks.length) return "bg-emerald-500 text-white";
    if (missed > 0 && completed === 0) return "bg-red-400 text-white";
    if (missed > 0) return "bg-amber-400 text-white";
    if (dayIndex > todayIndex)
      return "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400";
    return "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300";
  }

  const selectedSlots: SlotStatus[] =
    selected !== null
      ? getDayStatuses(selected).map((status, slot) => ({ slot, status }))
      : [];

  return (
    <div className="max-w-4xl mx-auto py-6 px-2">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <h2 className="text-2xl font-bold text-foreground mb-1">ক্যালেন্ডার</h2>
        <p className="text-sm text-muted-foreground">১৮২ দিনের পড়ার অগ্রগতি</p>
        <div className="mt-3 flex justify-center gap-3 flex-wrap text-xs">
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />{" "}
            সম্পন্ন
          </span>
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="w-3 h-3 rounded-sm bg-red-400 inline-block" /> মিস
            হয়েছে
          </span>
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />{" "}
            আংশিক
          </span>
          <span className="flex items-center gap-1.5 text-foreground">
            <span className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-700 border inline-block" />{" "}
            ভবিষ্যৎ
          </span>
        </div>
      </motion.div>

      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 bg-blue-50 border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800/50 rounded-xl p-4 flex items-center justify-between"
          data-ocid="calendar.panel"
        >
          <div>
            <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
              Day {selected + 1}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {getDateForDay(selected).toLocaleDateString("bn-BD", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="flex gap-1.5 mt-2">
              {selectedSlots.map(({ slot, status }) => (
                <span
                  key={slot}
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    status === 1
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                      : status === 2
                        ? "bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  টপিক {slot + 1}:{" "}
                  {status === 1 ? "✓" : status === 2 ? "✗" : "—"}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="text-blue-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-200 text-lg font-bold px-2"
          >
            ✕
          </button>
        </motion.div>
      )}

      <div className="space-y-8">
        {MONTH_GROUPS.map((group, gi) => {
          const firstDay = group.days[0].date.getDay();
          const emptySlots = Array.from({ length: firstDay }, (_, i) => i);
          return (
            <motion.div
              key={`${group.year}-${group.month}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.05 }}
              className="bg-card rounded-xl border shadow-sm p-5"
            >
              <h3 className="font-bold text-base text-foreground mb-4">
                {BN_MONTHS[group.month]} {group.year}
              </h3>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {BN_DAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-semibold text-muted-foreground py-1"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {emptySlots.map((i) => (
                  <div key={`pad-${group.year}-${group.month}-${i}`} />
                ))}
                {group.days.map(({ dayIndex, date }) => {
                  const isToday = isSameDay(date, today);
                  const colorClass = getDayColor(dayIndex);
                  const isSelected = selected === dayIndex;
                  return (
                    <button
                      type="button"
                      key={dayIndex}
                      onClick={() => setSelected(isSelected ? null : dayIndex)}
                      className={`
                        relative aspect-square rounded-lg flex flex-col items-center justify-center
                        text-xs font-semibold transition-all hover:scale-105 cursor-pointer
                        ${colorClass}
                        ${isToday ? "ring-2 ring-primary ring-offset-1 dark:ring-offset-gray-900" : ""}
                        ${isSelected ? "ring-2 ring-offset-1 ring-blue-500 dark:ring-offset-gray-900 scale-105" : ""}
                      `}
                      data-ocid={`calendar.item.${dayIndex + 1}`}
                    >
                      <span className="text-[10px] opacity-70 leading-none">
                        {date.getDate()}
                      </span>
                      <span className="text-[9px] leading-none mt-0.5 opacity-80">
                        D{dayIndex + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
