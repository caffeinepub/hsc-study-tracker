import { Flag, RotateCcw, Square, Timer } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const centis = Math.floor((ms % 1000) / 10);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  // Keep elapsedRef in sync for use in the effect without adding it as a dep
  elapsedRef.current = elapsed;

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally omits elapsed to avoid restart on every tick
  useEffect(() => {
    if (running) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setElapsed(offsetRef.current + (Date.now() - startTimeRef.current));
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      offsetRef.current = elapsedRef.current;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const toggle = useCallback(() => setRunning((r) => !r), []);

  const reset = useCallback(() => {
    setRunning(false);
    setElapsed(0);
    setLaps([]);
    offsetRef.current = 0;
    elapsedRef.current = 0;
  }, []);

  const addLap = useCallback(() => {
    if (running || elapsed > 0) {
      setLaps((prev) => [...prev, elapsed]);
    }
  }, [running, elapsed]);

  return (
    <div className="max-w-lg mx-auto py-6 px-2">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-foreground mb-1">Stopwatch</h2>
        <p className="text-sm text-muted-foreground">পড়ার সময় মাপো</p>
      </motion.div>

      {/* Display */}
      <motion.div
        className="bg-gradient-to-br from-[oklch(0.25_0.10_251)] to-[oklch(0.18_0.08_251)] rounded-2xl p-8 text-center shadow-xl mb-6"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div
          className={`font-mono text-5xl font-bold tracking-tight ${
            running
              ? "text-blue-300"
              : elapsed > 0
                ? "text-amber-300"
                : "text-white"
          }`}
          data-ocid="stopwatch.panel"
        >
          {formatTime(elapsed)}
        </div>
        {running && (
          <motion.div
            className="mt-3 flex justify-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 bg-blue-300 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 0.8,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-3 justify-center mb-6">
        <button
          type="button"
          onClick={toggle}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:scale-105 active:scale-95 ${
            running
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-primary hover:bg-[oklch(0.44_0.14_251)] dark:hover:bg-[oklch(0.72_0.16_251)] text-primary-foreground"
          }`}
          data-ocid="stopwatch.toggle"
        >
          {running ? <Square size={16} /> : <Timer size={16} />}
          {running ? "থামাও" : "শুরু করো"}
        </button>
        <button
          type="button"
          onClick={addLap}
          disabled={elapsed === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          data-ocid="stopwatch.secondary_button"
        >
          <Flag size={16} /> ল্যাপ
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={elapsed === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 text-gray-700 transition-all shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          data-ocid="stopwatch.delete_button"
        >
          <RotateCcw size={16} /> রিসেট
        </button>
      </div>

      {/* Laps */}
      <AnimatePresence>
        {laps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-xl border shadow-sm overflow-hidden"
            data-ocid="stopwatch.list"
          >
            <div className="px-4 py-3 border-b bg-secondary">
              <h3 className="text-sm font-bold text-foreground">ল্যাপ তালিকা</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {[...laps].reverse().map((lapTime, revIdx) => {
                const idx = laps.length - revIdx;
                const prevLap =
                  revIdx < laps.length - 1 ? laps[laps.length - revIdx - 2] : 0;
                const lapDiff = lapTime - prevLap;
                return (
                  <motion.div
                    key={lapTime}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between px-4 py-2.5 border-b last:border-0 hover:bg-secondary/50"
                    data-ocid={`stopwatch.item.${idx}`}
                  >
                    <span className="text-sm font-medium text-muted-foreground">
                      ল্যাপ {idx}
                    </span>
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-foreground">
                        {formatTime(lapTime)}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        +{formatTime(lapDiff)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {laps.length === 0 && elapsed === 0 && (
        <div
          className="text-center py-8 text-muted-foreground text-sm"
          data-ocid="stopwatch.empty_state"
        >
          স্টার্ট বাটন চাপো এবং পড়া শুরু করো 🚀
        </div>
      )}
    </div>
  );
}
