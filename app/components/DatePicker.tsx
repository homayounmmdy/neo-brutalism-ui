"use client";
import React from "react";
import { getWeekStart, useDatePicker } from "../hooks/useDatePicker";
import type { DatePickerType, NativeDateInputType } from "../types/DateType";
import { formatDisplay } from "../utils/date";

/* =====================================================================
 * Constants
 * ===================================================================== */
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_SHORT = [
   "Jan",
   "Feb",
   "Mar",
   "Apr",
   "May",
   "Jun",
   "Jul",
   "Aug",
   "Sep",
   "Oct",
   "Nov",
   "Dec",
];

const LABEL_CLASS =
   "mb-2 block text-sm font-black text-black transition-colors dark:text-gray-200";

/* =====================================================================
 * Icons
 * ===================================================================== */
const CalendarIcon = () => (
   <svg
      className="datepicker-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
   >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
   </svg>
);

const ClockIcon = () => (
   <svg
      className="datepicker-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
   >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
   </svg>
);

const Chevron = ({ d }: { d: string }) => (
   <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
   >
      <path d={d} />
   </svg>
);

/* =====================================================================
 * Display formatters (per mode)
 * ===================================================================== */
const pad = (n: number) => String(n).padStart(2, "0");

const formatTimeDisplay = (v: string): string => {
   const m = v.match(/^(\d{1,2}):(\d{2})/);
   if (!m) return v;
   const d = new Date();
   d.setHours(+m[1], +m[2], 0, 0);
   return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
   });
};

const formatMonthDisplay = (v: string): string => {
   const m = v.match(/^(\d{4})-(\d{2})$/);
   if (!m) return v;
   const d = new Date(+m[1], +m[2] - 1, 1);
   return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
};

const formatWeekDisplay = (v: string): string => {
   const m = v.match(/^(\d{4})-W(\d{1,2})$/);
   if (!m) return v;
   return `W${pad(+m[2])} · ${m[1]}`;
};

const formatDateTimeDisplay = (v: string): string => {
   if (!v) return "";
   const [datePart, timePart] = v.split("T");
   const dateStr = formatDisplay(datePart);
   return timePart ? `${dateStr}, ${formatTimeDisplay(timePart)}` : dateStr;
};

const formatByMode = (mode: string, value: string): string => {
   if (!value) return "";
   switch (mode) {
      case "date":
         return formatDisplay(value);
      case "time":
         return formatTimeDisplay(value);
      case "month":
         return formatMonthDisplay(value);
      case "week":
         return formatWeekDisplay(value);
      case "datetime-local":
         return formatDateTimeDisplay(value);
      default:
         return value;
   }
};

/* =====================================================================
 * Component
 * ===================================================================== */
const DatePicker: React.FC<DatePickerType> = (props) => {
   const mode = (props.type ?? "date") as
      | "date"
      | "time"
      | "datetime-local"
      | "month"
      | "week";

   const {
      focusColor,
      label,
      className,
      value,
      onChange,
      min,
      max,
      placeholder,
      disabled,
      required,
      id,
      name,
      ...rest
   } = props as NativeDateInputType & { type?: "date" };

   const step = "step" in props ? props.step : undefined;

   /* ----------------------------------------------------------------
    * Destructure the hook — do NOT keep `p = useDatePicker(...)` and
    * then access `p.open`. That makes `p` ref-like and triggers the
    * "Cannot access refs during render" compiler error.
    * ---------------------------------------------------------------- */
   const {
      // state
      currentValue,
      open,
      setOpen,
      // refs — used ONLY in ref={...}
      wrapRef,
      triggerRef,
      popupRef,
      // shared actions
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
      monthLabel,
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
      // helpers
      toISO,
      isSameDay,
      formatAriaDate,
   } = useDatePicker({ mode, value, onChange, min, max, step });

   const popupId = React.useId();
   const accentClass = focusColor
      ? `datepicker-${focusColor.replace("focus-", "")}`
      : "";

   const displayValue = formatByMode(mode, currentValue);
   const triggerPlaceholder =
      placeholder ??
      (mode === "time"
         ? "Select time"
         : mode === "month"
           ? "Select month"
           : mode === "week"
             ? "Select week"
             : mode === "datetime-local"
               ? "Select date & time"
               : "Select date");

   return (
      <div ref={wrapRef} className={`datepicker-wrap relative ${accentClass}`}>
         {label && (
            <label htmlFor={id} className={LABEL_CLASS}>
               {label}
            </label>
         )}

         <button
            ref={triggerRef}
            type="button"
            id={id}
            disabled={disabled}
            onClick={() => setOpen((o) => !o)}
            onKeyDown={onTriggerKeyDown}
            className={`input ${focusColor ?? ""} bg-white text-left flex items-center justify-between gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={popupId}
            aria-required={required || undefined}
            {...rest}
         >
            <span className={currentValue ? "" : "opacity-50 font-normal"}>
               {displayValue || triggerPlaceholder}
            </span>
            {mode === "time" ? <ClockIcon /> : <CalendarIcon />}
         </button>

         {name && <input type="hidden" name={name} value={currentValue} />}

         {open && (
            <div
               id={popupId}
               ref={popupRef}
               role="dialog"
               aria-label={`Choose ${mode}`}
               className={`datepicker-popup datepicker-popup-${mode}`}
            >
               {/* ---------- HEADER ---------- */}
               <div className="datepicker-header">
                  {(mode === "date" ||
                     mode === "datetime-local" ||
                     mode === "month" ||
                     mode === "week") && (
                     <button
                        type="button"
                        className="datepicker-nav"
                        aria-label="Previous year"
                        onClick={prevYear}
                     >
                        <Chevron d="M11 18l-6-6 6-6 M18 18l-6-6 6-6" />
                     </button>
                  )}
                  {(mode === "date" || mode === "datetime-local") && (
                     <button
                        type="button"
                        className="datepicker-nav"
                        aria-label="Previous month"
                        onClick={prevMonth}
                     >
                        <Chevron d="M15 18l-6-6 6-6" />
                     </button>
                  )}
                  <span className="datepicker-title">
                     {mode === "month" && viewYear}
                     {mode === "week" && viewWeekYear}
                     {(mode === "date" || mode === "datetime-local") &&
                        monthLabel}
                     {mode === "time" && "Select time"}
                  </span>
                  {(mode === "date" || mode === "datetime-local") && (
                     <button
                        type="button"
                        className="datepicker-nav"
                        aria-label="Next month"
                        onClick={nextMonth}
                     >
                        <Chevron d="M9 18l6-6-6-6" />
                     </button>
                  )}
                  {(mode === "date" ||
                     mode === "datetime-local" ||
                     mode === "month" ||
                     mode === "week") && (
                     <button
                        type="button"
                        className="datepicker-nav"
                        aria-label="Next year"
                        onClick={nextYear}
                     >
                        <Chevron d="M13 18l6-6-6-6 M6 18l6-6-6-6" />
                     </button>
                  )}
               </div>

               {/* ---------- BODY ---------- */}

               {/* ===== DATE ===== */}
               {mode === "date" && (
                  <div className="datepicker-grid" onKeyDown={onGridKeyDown}>
                     {WEEKDAYS.map((w) => (
                        <div key={w} className="datepicker-dow">
                           {w}
                        </div>
                     ))}
                     {days.map((d) => {
                        const iso = toISO(d);
                        const outside =
                           d.getMonth() !== viewDate.getMonth() ||
                           d.getFullYear() !== viewDate.getFullYear();
                        const isToday = isSameDay(d, today);
                        const isSelected =
                           !!selectedDate && isSameDay(d, selectedDate);
                        const isDisabled = isDayDisabled(d);
                        return (
                           <button
                              key={iso}
                              type="button"
                              data-date={iso}
                              onClick={() => pickDate(d)}
                              disabled={isDisabled}
                              aria-pressed={isSelected}
                              aria-label={formatAriaDate(d)}
                              className={[
                                 "datepicker-day",
                                 outside && "datepicker-day-outside",
                                 isToday && "datepicker-day-today",
                                 isSelected && "datepicker-day-selected",
                              ]
                                 .filter(Boolean)
                                 .join(" ")}
                           >
                              {d.getDate()}
                           </button>
                        );
                     })}
                  </div>
               )}

               {/* ===== MONTH ===== */}
               {mode === "month" && (
                  <div className="datepicker-months">
                     {MONTH_SHORT.map((label, i) => {
                        const isSelected = monthParts?.month === i;
                        return (
                           <button
                              key={label}
                              type="button"
                              className={`datepicker-month ${isSelected ? "datepicker-month-selected" : ""}`}
                              onClick={() => pickMonth(i)}
                              aria-pressed={isSelected}
                           >
                              {label}
                           </button>
                        );
                     })}
                  </div>
               )}

               {/* ===== WEEK ===== */}
               {mode === "week" && (
                  <div className="datepicker-weeks">
                     {weeksInViewYear.map((w) => {
                        const start = getWeekStart(viewWeekYear, w);
                        const end = new Date(
                           start.getFullYear(),
                           start.getMonth(),
                           start.getDate() + 6
                        );
                        const isSelected = weekParts?.week === w;
                        const fmt = (d: Date) =>
                           d.toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                           });
                        return (
                           <button
                              key={w}
                              type="button"
                              className={`datepicker-week ${isSelected ? "datepicker-week-selected" : ""}`}
                              onClick={() => pickWeek(w)}
                              aria-pressed={isSelected}
                           >
                              <span className="datepicker-week-num">
                                 W{pad(w)}
                              </span>
                              <span className="datepicker-week-range">
                                 {fmt(start)} – {fmt(end)}
                              </span>
                           </button>
                        );
                     })}
                  </div>
               )}

               {/* ===== TIME ===== */}
               {mode === "time" && (
                  <div className="datepicker-time">
                     <div className="datepicker-time-col">
                        {hours.map((h) => (
                           <button
                              key={h}
                              type="button"
                              data-hour={h}
                              className={`datepicker-time-btn ${timeParts?.h === h ? "datepicker-time-selected" : ""}`}
                              onClick={() => pickHour(h)}
                           >
                              {pad(h)}
                           </button>
                        ))}
                     </div>
                     <div className="datepicker-time-col">
                        {minutes.map((m) => (
                           <button
                              key={m}
                              type="button"
                              data-minute={m}
                              className={`datepicker-time-btn ${timeParts?.m === m ? "datepicker-time-selected" : ""}`}
                              onClick={() => pickMinute(m)}
                           >
                              {pad(m)}
                           </button>
                        ))}
                     </div>
                  </div>
               )}

               {/* ===== DATETIME-LOCAL ===== */}
               {mode === "datetime-local" && (
                  <div className="datepicker-datetime">
                     <div className="datepicker-grid" onKeyDown={onGridKeyDown}>
                        {WEEKDAYS.map((w) => (
                           <div key={w} className="datepicker-dow">
                              {w}
                           </div>
                        ))}
                        {days.map((d) => {
                           const iso = toISO(d);
                           const outside =
                              d.getMonth() !== viewDate.getMonth() ||
                              d.getFullYear() !== viewDate.getFullYear();
                           const isToday = isSameDay(d, today);
                           const isSelected =
                              !!selectedDate && isSameDay(d, selectedDate);
                           const isDisabled = isDayDisabled(d);
                           return (
                              <button
                                 key={iso}
                                 type="button"
                                 data-date={iso}
                                 onClick={() => pickDate(d)}
                                 disabled={isDisabled}
                                 aria-pressed={isSelected}
                                 aria-label={formatAriaDate(d)}
                                 className={[
                                    "datepicker-day",
                                    outside && "datepicker-day-outside",
                                    isToday && "datepicker-day-today",
                                    isSelected && "datepicker-day-selected",
                                 ]
                                    .filter(Boolean)
                                    .join(" ")}
                              >
                                 {d.getDate()}
                              </button>
                           );
                        })}
                     </div>
                     <div className="datepicker-time datepicker-time-inline">
                        <div className="datepicker-time-col">
                           {hours.map((h) => (
                              <button
                                 key={h}
                                 type="button"
                                 data-hour={h}
                                 className={`datepicker-time-btn ${timeParts?.h === h ? "datepicker-time-selected" : ""}`}
                                 onClick={() => pickHour(h)}
                              >
                                 {pad(h)}
                              </button>
                           ))}
                        </div>
                        <div className="datepicker-time-col">
                           {minutes.map((m) => (
                              <button
                                 key={m}
                                 type="button"
                                 data-minute={m}
                                 className={`datepicker-time-btn ${timeParts?.m === m ? "datepicker-time-selected" : ""}`}
                                 onClick={() => pickMinute(m)}
                              >
                                 {pad(m)}
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               )}

               {/* ---------- FOOTER ---------- */}
               <div className="datepicker-footer">
                  <button type="button" onClick={goToday}>
                     {mode === "time" || mode === "datetime-local"
                        ? "Now"
                        : mode === "month"
                          ? "This month"
                          : mode === "week"
                            ? "This week"
                            : "Today"}
                  </button>
                  <button
                     type="button"
                     onClick={clear}
                     disabled={!currentValue}
                  >
                     Clear
                  </button>
                  {(mode === "time" || mode === "datetime-local") && (
                     <button type="button" onClick={closeAndFocus}>
                        Done
                     </button>
                  )}
               </div>
            </div>
         )}
      </div>
   );
};

export default DatePicker;
