import { Book, Coffee, Moon, Sunrise, Utensils, Wind } from "lucide-react";
import { motion } from "motion/react";

type RoutineItem = {
  time: string;
  title: string;
  type: "study" | "prayer" | "rest" | "sleep";
  icon: React.ReactNode;
  description?: string;
};

const routineItems: RoutineItem[] = [
  {
    time: "৫:০০ - ৬:০০ AM",
    title: "ফজর ও সকালের কাজ",
    type: "prayer",
    icon: <Sunrise size={18} />,
    description: "ফজরের নামাজ, ফ্রেশ হওয়া ও দিনের পরিকল্পনা",
  },
  {
    time: "৬:০০ - ৮:৩০ AM",
    title: "প্রথম পড়ার সেশন",
    type: "study",
    icon: <Book size={18} />,
    description: "সকালে মন সতেজ — কঠিন বিষয় পড়ো",
  },
  {
    time: "৮:৩০ - ৯:০০ AM",
    title: "সকালের নাস্তা ও বিশ্রাম",
    type: "rest",
    icon: <Coffee size={18} />,
    description: "পুষ্টিকর নাস্তা করো, একটু হাঁটো",
  },
  {
    time: "৯:০০ - ১২:০০ PM",
    title: "দ্বিতীয় পড়ার সেশন",
    type: "study",
    icon: <Book size={18} />,
    description: "নতুন টপিক পড়া ও নোট তৈরি",
  },
  {
    time: "১২:০০ - ১:৩০ PM",
    title: "দুপুরের নামাজ ও খাবার",
    type: "prayer",
    icon: <Utensils size={18} />,
    description: "যোহরের নামাজ ও দুপুরের খাবার",
  },
  {
    time: "১:৩০ - ৪:০০ PM",
    title: "তৃতীয় পড়ার সেশন",
    type: "study",
    icon: <Book size={18} />,
    description: "MCQ প্র্যাকটিস ও পুরনো পড়া রিভিশন",
  },
  {
    time: "৪:০০ - ৪:৩০ PM",
    title: "আসর নামাজ ও বিশ্রাম",
    type: "rest",
    icon: <Wind size={18} />,
    description: "আসরের নামাজ, হালকা ব্যায়াম বা হাঁটা",
  },
  {
    time: "৪:৩০ - ৭:০০ PM",
    title: "চতুর্থ পড়ার সেশন",
    type: "study",
    icon: <Book size={18} />,
    description: "সৃজনশীল প্রশ্নের উত্তর লেখার অভ্যাস",
  },
  {
    time: "৭:০০ - ৮:৩০ PM",
    title: "মাগরিব, এশার নামাজ ও রাতের খাবার",
    type: "prayer",
    icon: <Utensils size={18} />,
    description: "মাগরিব ও এশার নামাজ, পরিবারের সাথে সময়",
  },
  {
    time: "৮:৩০ - ১১:০০ PM",
    title: "পঞ্চম পড়ার সেশন (রিভিশন)",
    type: "study",
    icon: <Book size={18} />,
    description: "দিনের সব পড়া রিভিশন করো, মুখস্থ করো",
  },
  {
    time: "১১:০০ PM - ৫:০০ AM",
    title: "ঘুম",
    type: "sleep",
    icon: <Moon size={18} />,
    description: "৬ ঘণ্টা ঘুম — মস্তিষ্ককে রিচার্জ করো",
  },
];

const typeStyles = {
  study: {
    card: "bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800/50",
    dot: "bg-blue-500",
    icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/60 dark:text-blue-300",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    line: "bg-blue-200",
  },
  prayer: {
    card: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/50",
    dot: "bg-emerald-500",
    icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300",
    badge:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    line: "bg-emerald-200",
  },
  rest: {
    card: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/50",
    dot: "bg-amber-500",
    icon: "bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-300",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    line: "bg-amber-200",
  },
  sleep: {
    card: "bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-800/50",
    dot: "bg-purple-500",
    icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/60 dark:text-purple-300",
    badge:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
    line: "bg-purple-200",
  },
};

export default function DailyRoutine() {
  const studyHours = 13.5;

  return (
    <div className="max-w-2xl mx-auto py-6 px-2">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <h2 className="text-2xl font-bold text-foreground mb-1">
          প্রতিদিনের রুটিন
        </h2>
        <p className="text-sm text-muted-foreground">
          আদর্শ HSC শিক্ষার্থীর দৈনিক সময়সূচি
        </p>
        <div className="mt-4 flex justify-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 px-3 py-1.5 rounded-full font-medium">
            <Book size={12} /> পড়ার সময়: {studyHours} ঘণ্টা
          </span>
          <span className="flex items-center gap-1.5 text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 px-3 py-1.5 rounded-full font-medium">
            <Utensils size={12} /> নামাজ ও খাবার: ৩.৫ ঘণ্টা
          </span>
          <span className="flex items-center gap-1.5 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300 px-3 py-1.5 rounded-full font-medium">
            <Moon size={12} /> ঘুম: ৬ ঘণ্টা
          </span>
        </div>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-3">
          {routineItems.map((item, i) => {
            const s = typeStyles[item.type];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="flex gap-4"
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0 w-16 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${s.icon} flex items-center justify-center shadow-sm border border-white/20`}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`flex-1 rounded-xl border p-4 shadow-sm ${s.card} mb-1`}
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm text-foreground">
                      {item.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.badge} flex-shrink-0`}
                    >
                      {item.time}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
