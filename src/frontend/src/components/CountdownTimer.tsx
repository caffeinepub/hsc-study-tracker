import { AlarmClock, Pause, Play, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

function formatDisplay(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const PRESETS = [
  { label: "Pomodoro", sublabel: "২৫ মিনিট", seconds: 25 * 60 },
  { label: "Pomodoro", sublabel: "৫০ মিনিট", seconds: 50 * 60 },
  { label: "৪৫ মিনিট", sublabel: "Long session", seconds: 45 * 60 },
  { label: "১ ঘণ্টা", sublabel: "Power hour", seconds: 60 * 60 },
  { label: "২ ঘণ্টা", sublabel: "Deep work", seconds: 120 * 60 },
];

export default function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalConfigured = hours * 3600 + minutes * 60 + seconds;

  useEffect(() => {
    if (running && remaining !== null && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r === null || r <= 1) {
            setRunning(false);
            setFinished(true);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining]);

  const start = useCallback(() => {
    if (remaining === null) {
      const total = totalConfigured;
      if (total === 0) return;
      setRemaining(total);
    }
    setFinished(false);
    setRunning(true);
  }, [remaining, totalConfigured]);

  const pause = useCallback(() => setRunning(false), []);

  const reset = useCallback(() => {
    setRunning(false);
    setRemaining(null);
    setFinished(false);
  }, []);

  const applyPreset = useCallback((sec: number) => {
    setRunning(false);
    setRemaining(null);
    setFinished(false);
    setHours(Math.floor(sec / 3600));
    setMinutes(Math.floor((sec % 3600) / 60));
    setSeconds(sec % 60);
  }, []);

  const displaySeconds = remaining ?? totalConfigured;
  const progress =
    remaining !== null && totalConfigured > 0
      ? ((totalConfigured - remaining) / totalConfigured) * 100
      : 0;

  return (
    <div className="max-w-lg mx-auto py-6 px-2">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-foreground mb-1">
          Countdown Timer
        </h2>
        <p className="text-sm text-muted-foreground">পড়ার সময় সেট করো</p>
      </motion.div>

      {/* Presets */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {PRESETS.map((p) => (
          <button
            key={p.seconds}
            type="button"
            onClick={() => applyPreset(p.seconds)}
            className="flex flex-col items-center py-2.5 px-3 rounded-xl border border-border bg-card hover:bg-secondary hover:border-primary transition-all text-center group"
            data-ocid="countdown.button"
          >
            <span className="text-sm font-bold text-foreground group-hover:text-primary">
              {p.label}
            </span>
            <span className="text-xs text-muted-foreground">{p.sublabel}</span>
          </button>
        ))}
      </div>

      {/* Time input */}
      {remaining === null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          {[
            { label: "ঘণ্টা", value: hours, setter: setHours, max: 23 },
            { label: "মিনিট", value: minutes, setter: setMinutes, max: 59 },
            { label: "সেকেন্ড", value: seconds, setter: setSeconds, max: 59 },
          ].map((field, i) => (
            <div key={field.label} className="flex flex-col items-center gap-1">
              {i > 0 && (
                <span
                  className="absolute text-2xl font-bold text-muted-foreground"
                  style={{ marginTop: "2px", marginLeft: "-1.5rem" }}
                >
                  :
                </span>
              )}
              <input
                type="number"
                min={0}
                max={field.max}
                value={field.value}
                onChange={(e) =>
                  field.setter(
                    Math.min(
                      field.max,
                      Math.max(0, Number.parseInt(e.target.value) || 0),
                    ),
                  )
                }
                className="w-16 h-14 text-center text-2xl font-bold font-mono border-2 border-border rounded-xl focus:outline-none focus:border-primary bg-card text-foreground"
                data-ocid="countdown.input"
              />
              <span className="text-xs text-muted-foreground">
                {field.label}
              </span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Circular display */}
      <motion.div
        className="relative mx-auto mb-6 flex items-center justify-center"
        style={{ width: 220, height: 220 }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 220 220"
        >
          <circle
            cx="110"
            cy="110"
            r="98"
            fill="none"
            stroke="oklch(0.93 0.04 251)"
            strokeWidth="12"
          />
          <motion.circle
            cx="110"
            cy="110"
            r="98"
            fill="none"
            stroke="oklch(0.52 0.18 251)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 98}
            strokeDashoffset={2 * Math.PI * 98 * (1 - progress / 100)}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="text-center z-10">
          <AnimatePresence mode="wait">
            {finished ? (
              <motion.div
                key="done"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
                className="text-center"
                data-ocid="countdown.success_state"
              >
                <p className="text-3xl">🎉</p>
                <p className="text-sm font-bold text-primary mt-1">সময় শেষ!</p>
              </motion.div>
            ) : (
              <motion.div
                key="timer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                data-ocid="countdown.panel"
              >
                <p
                  className={`font-mono text-4xl font-bold ${
                    running && displaySeconds <= 10
                      ? "text-red-500"
                      : running
                        ? "text-primary"
                        : "text-foreground"
                  }`}
                >
                  {formatDisplay(displaySeconds)}
                </p>
                {running && (
                  <p className="text-xs text-muted-foreground mt-1">চলছে...</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-3 justify-center">
        {!running ? (
          <button
            type="button"
            onClick={start}
            disabled={totalConfigured === 0 && remaining === null}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-primary hover:bg-[oklch(0.44_0.14_251)] dark:hover:bg-[oklch(0.72_0.16_251)] text-primary-foreground transition-all shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            data-ocid="countdown.primary_button"
          >
            <Play size={16} /> শুরু করো
          </button>
        ) : (
          <button
            type="button"
            onClick={pause}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-md hover:scale-105 active:scale-95"
            data-ocid="countdown.toggle"
          >
            <Pause size={16} /> পজ করো
          </button>
        )}
        <button
          type="button"
          onClick={reset}
          disabled={remaining === null && !finished}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 text-gray-700 transition-all shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          data-ocid="countdown.delete_button"
        >
          <RotateCcw size={16} /> রিসেট
        </button>
      </div>

      {finished && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4 text-sm font-semibold text-emerald-500"
        >
          অভিনন্দন! তুমি সেশন সম্পন্ন করেছো 🌟
        </motion.p>
      )}

      <div className="mt-6 text-center">
        <AlarmClock size={14} className="inline mr-1 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          টাইমার শেষ হলে ব্রাউজার নোটিফিকেশন পাবে না — পেজে থাকো
        </span>
      </div>
    </div>
  );
}
