import { useCallback, useEffect, useState } from "react";
import {
  TOTAL_DAYS,
  getTasksForDay,
  getTodayDayNumber,
} from "../studyPlanData";

const STORAGE_KEY = "hsc_study_tracker_v1";

// Status: 0 = pending, 1 = completed, 2 = missed
export type TaskStatus = 0 | 1 | 2;

export type CompletionData = Record<number, Record<number, TaskStatus>>;

function loadData(): CompletionData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CompletionData;
  } catch {
    // ignore
  }
  return {};
}

function saveData(data: CompletionData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useStudyTracker() {
  const todayIndex = getTodayDayNumber();
  const [data, setData] = useState<CompletionData>(loadData);

  // Sync to localStorage whenever data changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  const getStatus = useCallback(
    (dayIndex: number, slotIndex: number): TaskStatus => {
      const dayData = data[dayIndex];
      const stored = dayData?.[slotIndex];
      if (stored === 1) return 1;
      // If the day is past (before today), it's missed
      if (dayIndex < todayIndex) return 2;
      return 0;
    },
    [data, todayIndex],
  );

  const markCompleted = useCallback((dayIndex: number, slotIndex: number) => {
    setData((prev) => {
      const dayData = { ...(prev[dayIndex] ?? {}) };
      dayData[slotIndex] = 1;
      return { ...prev, [dayIndex]: dayData };
    });
  }, []);

  const getDayStatuses = useCallback(
    (dayIndex: number): TaskStatus[] => {
      const tasks = getTasksForDay(dayIndex);
      return tasks.map((_, slotIndex) => getStatus(dayIndex, slotIndex));
    },
    [getStatus],
  );

  const getOverallStats = useCallback(() => {
    let completed = 0;
    let missed = 0;
    let pending = 0;
    for (let d = 0; d < TOTAL_DAYS; d++) {
      const tasks = getTasksForDay(d);
      tasks.forEach((_, slotIndex) => {
        const status = getStatus(d, slotIndex);
        if (status === 1) completed++;
        else if (status === 2) missed++;
        else pending++;
      });
    }
    return { completed, missed, pending };
  }, [getStatus]);

  return {
    todayIndex,
    getStatus,
    markCompleted,
    getDayStatuses,
    getOverallStats,
  };
}
