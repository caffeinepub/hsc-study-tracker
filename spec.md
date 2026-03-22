# HSC Study Tracker

## Current State
The app has a single-page study tracker showing Day 1-182 topics as buttons. Each day has up to 3 topics that can be marked complete (green) or auto-marked missed (red). There's a sidebar with stats, phase info, motivational quotes, and quick navigation.

## Requested Changes (Diff)

### Add
- **Tab navigation** at the top: Study Plan | রুটিন | ক্যালেন্ডার | Stopwatch | Countdown
- **Daily Routine tab** (রুটিন): A fixed daily schedule table showing time slots and activities (e.g., Morning - Fajr, Exercise; 6am-8am - Study; 8am-9am - Breakfast; etc.). Static but visually appealing timetable.
- **Calendar tab**: Monthly calendar view showing all 182 days. Each day cell color-coded: green if all tasks done, red if any missed, yellow if partially done, grey if future, blue for today.
- **Stopwatch tab**: A functional stopwatch with Start/Stop/Reset buttons. Shows HH:MM:SS.ms format.
- **Countdown Timer tab**: A configurable countdown timer. User can set hours/minutes/seconds, then Start/Pause/Reset. Plays visual alert when done.

### Modify
- App layout: Wrap existing study plan content in a tab panel so it only shows when "Study Plan" tab is active.

### Remove
- Nothing removed.

## Implementation Plan
1. Add tab state to App.tsx (`activeTab`: 'study' | 'routine' | 'calendar' | 'stopwatch' | 'countdown')
2. Create `DailyRoutine.tsx` component with a styled time-table
3. Create `CalendarView.tsx` component with monthly calendar using study data
4. Create `Stopwatch.tsx` component with start/stop/reset and elapsed time display
5. Create `CountdownTimer.tsx` component with configurable time input and countdown
6. Wrap existing main content in tab panel, add tab bar to header or just below header
