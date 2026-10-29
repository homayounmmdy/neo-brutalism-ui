"use client";
import React, {
   useCallback,
   useEffect,
   useMemo,
   useRef,
   useState,
} from "react";
import {
   addDays,
   addMonths,
   getCalendarDays,
   isSameDay,
   parseISO,
   startOfDay,
   toISO,
} from "../utils/date";

/* =====================================================================
 * Private helpers
 * ===================================================================== */
const pad = (n: number) => String(n).padStart(2, "0");

const isSameMonth = (a: Date, b: Date) =>
   a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const isDateInRange = (d: Date, min?: string, max?: string) => {
   const day = startOfDay(d);
   const mn = parseISO(min);
   const mx = parseISO(max);
   if (mn && day < startOfDay(mn)) return false;
   if (mx && day > startOfDay(mx)) return false;
   return true;
};

export const formatMonthLabel = (d: Date) =>
   d.toLocaleDateString(undefined, { month: "long", year: "numeric" });

export const formatAriaDate = (d: Date) =>
   d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
   });

const getNextFocusDate = (cur: Date, key: string): Date | null => {
   switch (key) {
      case "ArrowLeft":
         return addDays(cur, -1);
      case "ArrowRight":
         return addDays(cur, 1);
      case "ArrowUp":
         return addDays(cur, -7);
      case "ArrowDown":
         return addDays(cur, 7);
      case "Home":
         return addDays(cur, -cur.getDay());
      case "End":
         return addDays(cur, 6 - cur.getDay());
      case "PageUp":
         return addMonths(cur, -1);
      case "PageDown":
         return addMonths(cur, 1);
      default:
         return null;
   }
};

/* ---------- time parsing ---------- */
export const parseTime = (s?: string): { h: number; m: number } | null => {
   if (!s) return null;
   const m = s.match(/^(\d{1,2}):(\d{2})/);
   if (!m) return null;
   return { h: +m[1], m: +m[2] };
};

/* ---------- month parsing ---------- */
export const parseMonth = (
   s?: string
): { year: number; month: number } | null => {
   if (!s) return null;
   const m = s.match(/^(\d{4})-(\d{2})$/);
   if (!m) return null;
   return { year: +m[1], month: +m[2] - 1 };
};

/* ---------- week parsing ---------- */
export const parseWeek = (
   s?: string
): { year: number; week: number } | null => {
   if (!s) return null;
   const m = s.match(/^(\d{4})-W(\d{1,2})$/);
   if (!m) return null;
   return { year: +m[1], week: +m[2] };
};

export const getWeeksInYear = (year: number): number => {
   const jan1Day = (new Date(year, 0, 1).getDay() + 6) % 7;
   const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
   return jan1Day === 3 || (isLeap && jan1Day === 2) ? 53 : 52;
};

export const getWeekStart = (year: number, week: number): Date => {
   const jan4 = new Date(year, 0, 4);
   const jan4Day = (jan4.getDay() + 6) % 7;
   const week1Mon = addDays(jan4, -jan4Day);
   return addDays(week1Mon, (week - 1) * 7);
};

export const getISOWeekNumber = (d: Date): number => {
   const date = new Date(d.getTime());
   date.setHours(0, 0, 0, 0);
   date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
   const week1 = new Date(date.getFullYear(), 0, 4);
   return (
      1 +
      Math.round(
         ((date.getTime() - week1.getTime()) / 86400000 -
            3 +
            ((week1.getDay() + 6) % 7)) /
            7
      )
   );
};

/* =====================================================================
 * Hook
 * ===================================================================== */
export type PickerMode = "date" | "time" | "datetime-local" | "month" | "week";

interface Options {
   mode?: PickerMode;
   value?: string;
   onChange?: (v: string) => void;
   min?: string;
   max?: string;
   step?: number;
}

export function useDatePicker({
   mode = "date",
   value,
   onChange,
   min,
   max,
   step = 1,
}: Options) {
   /* ---------- controlled / uncontrolled ---------- */
   const isControlled = value !== undefined;
   const [internal, setInternal] = useState<string>("");
   const currentValue = isControlled ? value : internal;

   const setValue = useCallback(
      (v: string) => {
         if (!isControlled) setInternal(v);
         onChange?.(v);
      },
      [isControlled, onChange]
   );

   /* ---------- open / refs ---------- */
   const [open, setOpen] = useState(false);
   const wrapRef = useRef<HTMLDivElement>(null);
   const triggerRef = useRef<HTMLButtonElement>(null);
   const popupRef = useRef<HTMLDivElement>(null);

   const closeAndFocus = useCallback(() => {
      setOpen(false);
      triggerRef.current?.focus();
   }, []);

   /* ---------- dismiss on outside click / Esc ---------- */
   useEffect(() => {
      if (!open) return;
      const onDown = (e: MouseEvent) => {
         if (!wrapRef.current?.contains(e.target as Node)) closeAndFocus();
      };
      const onKey = (e: KeyboardEvent) => {
         if (e.key === "Escape") closeAndFocus();
      };
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
      return () => {
         document.removeEventListener("mousedown", onDown);
         document.removeEventListener("keydown", onKey);
      };
   }, [open, closeAndFocus]);

   /* ---------- date state (date, datetime-local) ---------- */
   const selectedDate = useMemo(() => {
      if (mode === "date") return parseISO(currentValue);
      if (mode === "datetime-local")
         return parseISO(currentValue.split("T")[0]);
      return null;
   }, [mode, currentValue]);

   const [viewDate, setViewDate] = useState<Date>(
      () => selectedDate ?? new Date()
   );
   const days = useMemo(() => getCalendarDays(viewDate), [viewDate]);
   const today = startOfDay(new Date());

   const isDayDisabled = useCallback(
      (d: Date) => !isDateInRange(d, min, max),
      [min, max]
   );

   /* ---------- time state (time, datetime-local) ---------- */
   const timeParts = useMemo(() => {
      if (mode === "time") return parseTime(currentValue);
      if (mode === "datetime-local")
         return parseTime(currentValue.split("T")[1]);
      return null;
   }, [mode, currentValue]);

   const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
   const minutes = useMemo(() => {
      const s = Math.max(1, Math.min(60, step));
      return Array.from({ length: Math.ceil(60 / s) }, (_, i) => i * s);
   }, [step]);

   /* ---------- month state ---------- */
   const monthParts = useMemo(
      () => (mode === "month" ? parseMonth(currentValue) : null),
      [mode, currentValue]
   );

   const [viewYear, setViewYear] = useState<number>(
      () => monthParts?.year ?? new Date().getFullYear()
   );

   /* ---------- week state ---------- */
   const weekParts = useMemo(
      () => (mode === "week" ? parseWeek(currentValue) : null),
      [mode, currentValue]
   );

   const [viewWeekYear, setViewWeekYear] = useState<number>(
      () => weekParts?.year ?? new Date().getFullYear()
   );

   const weeksInViewYear = useMemo(() => {
      const n = getWeeksInYear(viewWeekYear);
      return Array.from({ length: n }, (_, i) => i + 1);
   }, [viewWeekYear]);

   /* ---------- sync view state on open ---------- */
   useEffect(() => {
      if (!open) return;
      if (mode === "date" || mode === "datetime-local") {
         const focus = selectedDate ?? new Date();
         setViewDate(focus);
         if (mode === "date") {
            requestAnimationFrame(() => {
               popupRef.current
                  ?.querySelector<HTMLButtonElement>(
                     `[data-date="${toISO(focus)}"]`
                  )
                  ?.focus();
            });
         }
      } else if (mode === "month") {
         setViewYear(monthParts?.year ?? new Date().getFullYear());
      } else if (mode === "week") {
         setViewWeekYear(weekParts?.year ?? new Date().getFullYear());
      } else if (mode === "time" || mode === "datetime-local") {
         // scroll selected time into view
         if (timeParts) {
            requestAnimationFrame(() => {
               popupRef.current
                  ?.querySelector(`[data-hour="${timeParts.h}"]`)
                  ?.scrollIntoView({ block: "center" });
               popupRef.current
                  ?.querySelector(`[data-minute="${timeParts.m}"]`)
                  ?.scrollIntoView({ block: "center" });
            });
         }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open]);

   /* =====================================================================
    * Actions
    * ===================================================================== */

   /* ---------- date picks ---------- */
   const pickDate = useCallback(
      (d: Date) => {
         if (isDayDisabled(d)) return;
         if (mode === "datetime-local") {
            const t = timeParts ?? { h: 0, m: 0 };
            setValue(`${toISO(d)}T${pad(t.h)}:${pad(t.m)}`);
         } else {
            setValue(toISO(d));
            closeAndFocus();
         }
      },
      [mode, isDayDisabled, setValue, timeParts, closeAndFocus]
   );

   /* ---------- time picks ---------- */
   const pickHour = useCallback(
      (h: number) => {
         const m = timeParts?.m ?? 0;
         if (mode === "datetime-local") {
            const datePart = currentValue.split("T")[0] || toISO(new Date());
            setValue(`${datePart}T${pad(h)}:${pad(m)}`);
         } else {
            setValue(`${pad(h)}:${pad(m)}`);
         }
      },
      [mode, timeParts, currentValue, setValue]
   );

   const pickMinute = useCallback(
      (m: number) => {
         const h = timeParts?.h ?? 0;
         if (mode === "datetime-local") {
            const datePart = currentValue.split("T")[0] || toISO(new Date());
            setValue(`${datePart}T${pad(h)}:${pad(m)}`);
         } else {
            setValue(`${pad(h)}:${pad(m)}`);
            closeAndFocus();
         }
      },
      [mode, timeParts, currentValue, setValue, closeAndFocus]
   );

   /* ---------- month picks ---------- */
   const pickMonth = useCallback(
      (monthIdx: number) => {
         setValue(`${viewYear}-${pad(monthIdx + 1)}`);
         closeAndFocus();
      },
      [viewYear, setValue, closeAndFocus]
   );

   /* ---------- week picks ---------- */
   const pickWeek = useCallback(
      (week: number) => {
         setValue(`${viewWeekYear}-W${pad(week)}`);
         closeAndFocus();
      },
      [viewWeekYear, setValue, closeAndFocus]
   );

   /* ---------- shared footer actions ---------- */
   const goToday = useCallback(() => {
      const now = new Date();
      switch (mode) {
         case "date":
            if (isDayDisabled(today)) return;
            setValue(toISO(today));
            setViewDate(today);
            break;
         case "time":
            setValue(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
            break;
         case "datetime-local":
            setValue(
               `${toISO(now)}T${pad(now.getHours())}:${pad(now.getMinutes())}`
            );
            break;
         case "month":
            setValue(`${now.getFullYear()}-${pad(now.getMonth() + 1)}`);
            break;
         case "week":
            setValue(`${now.getFullYear()}-W${pad(getISOWeekNumber(now))}`);
            break;
      }
      if (mode !== "datetime-local") closeAndFocus();
   }, [mode, today, isDayDisabled, setValue, closeAndFocus]);

   const clear = useCallback(() => {
      setValue("");
      closeAndFocus();
   }, [setValue, closeAndFocus]);

   /* ---------- nav ---------- */
   const prevYear = useCallback(() => {
      if (mode === "month") setViewYear((y) => y - 1);
      else if (mode === "week") setViewWeekYear((y) => y - 1);
      else
         setViewDate((p) => {
            const d = new Date(p);
            d.setFullYear(d.getFullYear() - 1);
            return d;
         });
   }, [mode]);

   const nextYear = useCallback(() => {
      if (mode === "month") setViewYear((y) => y + 1);
      else if (mode === "week") setViewWeekYear((y) => y + 1);
      else
         setViewDate((p) => {
            const d = new Date(p);
            d.setFullYear(d.getFullYear() + 1);
            return d;
         });
   }, [mode]);

   const prevMonth = useCallback(
      () =>
         setViewDate((p) => {
            const d = new Date(p);
            d.setMonth(d.getMonth() - 1);
            return d;
         }),
      []
   );
   const nextMonth = useCallback(
      () =>
         setViewDate((p) => {
            const d = new Date(p);
            d.setMonth(d.getMonth() + 1);
            return d;
         }),
      []
   );

   /* ---------- keyboard nav on day grid ---------- */
   const onGridKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
         const iso = (e.target as HTMLElement).dataset?.date;
         if (!iso) return;
         const cur = parseISO(iso);
         if (!cur) return;

         const next = getNextFocusDate(cur, e.key);
         if (!next) return;
         e.preventDefault();

         if (!isSameMonth(next, viewDate)) setViewDate(next);
         const target = toISO(next);
         requestAnimationFrame(() => {
            popupRef.current
               ?.querySelector<HTMLButtonElement>(`[data-date="${target}"]`)
               ?.focus();
         });
      },
      [viewDate]
   );

   const onTriggerKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
         if (
            !open &&
            (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")
         ) {
            e.preventDefault();
            setOpen(true);
         }
      },
      [open]
   );

   return {
      mode,
      // shared
      currentValue,
      open,
      setOpen,
      wrapRef,
      triggerRef,
      popupRef,
      closeAndFocus,
      onTriggerKeyDown,
      goToday,
      clear,
      // date
      days,
      selectedDate,
      viewDate,
      today,
      isDayDisabled,
      pickDate,
      onGridKeyDown,
      monthLabel: formatMonthLabel(viewDate),
      prevMonth,
      nextMonth,
      prevYear,
      nextYear,
      // time
      hours,
      minutes,
      timeParts,
      pickHour,
      pickMinute,
      // month
      viewYear,
      monthParts,
      pickMonth,
      // week
      viewWeekYear,
      weeksInViewYear,
      weekParts,
      pickWeek,
      // re-exported for the render
      pad,
      toISO,
      isSameDay,
      formatAriaDate,
      getWeekStart,
   };
}
