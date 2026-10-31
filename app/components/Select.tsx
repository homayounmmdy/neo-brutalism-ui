"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
   SelectOption,
   SelectOptionGroup,
   SelectType,
} from "../types/FormFiledType";

const isGroup = (x: SelectOption | SelectOptionGroup): x is SelectOptionGroup =>
   Array.isArray((x as SelectOptionGroup).options);

const flatten = (opts: (SelectOption | SelectOptionGroup)[]): SelectOption[] =>
   opts.flatMap((o) => (isGroup(o) ? o.options : o));

const CheckIcon = () => (
   <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
   >
      <path d="M20 6L9 17l-5-5" />
   </svg>
);

const Chevron = ({ open }: { open: boolean }) => (
   <svg
      className="datepicker-icon"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
         transform: open ? "rotate(180deg)" : undefined,
         transition: "transform 120ms",
      }}
   >
      <path d="M6 9l6 6 6-6" />
   </svg>
);

const Select: React.FC<SelectType> = ({
   focusColor,
   label,
   className,
   options,
   placeholder = "Select…",
   multiple = false,
   value,
   onChange,
   disabled,
   required,
   id,
   name,
   maxHeight = 260,
   ...rest
}) => {
   const isControlled = value !== undefined;
   const [internal, setInternal] = useState<string | string[]>(
      multiple ? [] : ""
   );
   const currentValue = isControlled ? value! : internal;
   const currentArray = Array.isArray(currentValue)
      ? currentValue
      : currentValue
        ? [currentValue]
        : [];

   const [open, setOpen] = useState(false);
   const [activeIndex, setActiveIndex] = useState(-1);
   const [search, setSearch] = useState("");
   const searchTimer = useRef<number | null>(null);

   const wrapRef = useRef<HTMLDivElement>(null);
   const triggerRef = useRef<HTMLButtonElement>(null);
   const listRef = useRef<HTMLDivElement>(null);
   const popupId = useRef(
      `sel-${Math.random().toString(36).slice(2, 9)}`
   ).current;

   const allOptions = useMemo(() => flatten(options), [options]);
   const selectedSet = useMemo(() => new Set(currentArray), [currentArray]);

   const selectedLabels = useMemo(
      () =>
         allOptions.filter((o) => selectedSet.has(o.value)).map((o) => o.label),
      [allOptions, selectedSet]
   );

   const triggerText = selectedLabels.length
      ? selectedLabels.join(", ")
      : placeholder;

   const commit = (next: string | string[]) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
   };

   const close = () => {
      setOpen(false);
      setSearch("");
      triggerRef.current?.focus();
   };

   const toggleValue = (val: string) => {
      if (!multiple) {
         commit(val);
         close();
         return;
      }
      const set = new Set(selectedSet);
      if (set.has(val)) set.delete(val);
      else set.add(val);
      commit(Array.from(set));
   };

   const clearAll = () => commit(multiple ? [] : "");

   /* Seed active index when opening */
   useEffect(() => {
      if (!open) return;
      const firstSelected = allOptions.findIndex((o) =>
         selectedSet.has(o.value)
      );
      const idx =
         firstSelected >= 0
            ? firstSelected
            : allOptions.findIndex((o) => !o.disabled);
      setActiveIndex(idx);
      requestAnimationFrame(() => {
         listRef.current
            ?.querySelector<HTMLElement>(`[data-index="${idx}"]`)
            ?.focus();
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open]);

   /* Dismissal */
   useEffect(() => {
      if (!open) return;
      const onDown = (e: MouseEvent) => {
         if (!wrapRef.current?.contains(e.target as Node)) close();
      };
      const onKey = (e: KeyboardEvent) => {
         if (e.key === "Escape") close();
      };
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
      return () => {
         document.removeEventListener("mousedown", onDown);
         document.removeEventListener("keydown", onKey);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [open]);

   const moveTo = (dir: 1 | -1) => {
      if (!allOptions.length) return;
      let i = activeIndex;
      for (let n = 0; n < allOptions.length; n++) {
         i = (i + dir + allOptions.length) % allOptions.length;
         if (!allOptions[i].disabled) break;
      }
      setActiveIndex(i);
      requestAnimationFrame(() => {
         listRef.current
            ?.querySelector<HTMLElement>(`[data-index="${i}"]`)
            ?.focus();
      });
   };

   const jumpTo = (i: number) => {
      setActiveIndex(i);
      requestAnimationFrame(() => {
         listRef.current
            ?.querySelector<HTMLElement>(`[data-index="${i}"]`)
            ?.focus();
      });
   };

   const typeAhead = (char: string) => {
      if (searchTimer.current) window.clearTimeout(searchTimer.current);
      const next = (search + char).toLowerCase();
      setSearch(next);
      searchTimer.current = window.setTimeout(() => setSearch(""), 500);
      const i = allOptions.findIndex(
         (o) => !o.disabled && o.label.toLowerCase().startsWith(next)
      );
      if (i >= 0) jumpTo(i);
   };

   const onTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (open) return;
      if (
         e.key === "ArrowDown" ||
         e.key === "ArrowUp" ||
         e.key === "Enter" ||
         e.key === " "
      ) {
         e.preventDefault();
         setOpen(true);
      }
   };

   const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key.length === 1 && e.key !== " ") {
         typeAhead(e.key);
         return;
      }
      switch (e.key) {
         case "ArrowDown":
            e.preventDefault();
            moveTo(1);
            break;
         case "ArrowUp":
            e.preventDefault();
            moveTo(-1);
            break;
         case "Home": {
            e.preventDefault();
            const i = allOptions.findIndex((o) => !o.disabled);
            if (i >= 0) jumpTo(i);
            break;
         }
         case "End": {
            e.preventDefault();
            const i = [...allOptions].reverse().findIndex((o) => !o.disabled);
            if (i >= 0) jumpTo(allOptions.length - 1 - i);
            break;
         }
         case "Enter":
         case " ": {
            e.preventDefault();
            const opt = allOptions[activeIndex];
            if (opt && !opt.disabled) toggleValue(opt.value);
            break;
         }
         case "Tab":
            setOpen(false);
            break;
      }
   };

   const renderOption = (opt: SelectOption, flatIdx: number) => {
      const isSel = selectedSet.has(opt.value);
      const isActive = flatIdx === activeIndex;
      return (
         <div
            key={opt.value}
            id={`${popupId}-opt-${flatIdx}`}
            role="option"
            aria-selected={isSel}
            aria-disabled={opt.disabled || undefined}
            tabIndex={isActive ? 0 : -1}
            data-index={flatIdx}
            onMouseEnter={() => !opt.disabled && setActiveIndex(flatIdx)}
            onClick={() => !opt.disabled && toggleValue(opt.value)}
            className={[
               "select-option",
               isActive && "select-option-active",
               isSel && "select-option-selected",
               opt.disabled && "select-option-disabled",
            ]
               .filter(Boolean)
               .join(" ")}
         >
            {multiple && (
               <span className="select-check" aria-hidden="true">
                  {isSel && <CheckIcon />}
               </span>
            )}
            <span className="select-option-label">{opt.label}</span>
            {!multiple && isSel && <CheckIcon />}
         </div>
      );
   };

   let idx = 0;
   const rendered: React.ReactNode[] = [];
   for (const item of options) {
      if (isGroup(item)) {
         rendered.push(
            <div key={`g-${item.label}`} role="group" aria-label={item.label}>
               <div className="select-group-label" role="presentation">
                  {item.label}
               </div>
               {item.options.map((opt) => renderOption(opt, idx++))}
            </div>
         );
      } else {
         rendered.push(renderOption(item, idx++));
      }
   }

   const accentClass = focusColor
      ? `datepicker-${focusColor.replace("focus-", "")}`
      : "";

   return (
      <div ref={wrapRef} className={`datepicker-wrap relative ${accentClass}`}>
         {label && (
            <label
               htmlFor={id}
               className="mb-2 block text-sm font-black text-black transition-colors dark:text-gray-200"
            >
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
            className={`input ${focusColor} bg-white text-left flex items-center justify-between gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={popupId}
            aria-required={required || undefined}
            {...rest}
         >
            <span
               className={`select-trigger-text ${selectedLabels.length ? "" : "opacity-50 font-normal"}`}
            >
               {triggerText}
            </span>
            <Chevron open={open} />
         </button>

         {/* Form submission */}
         {name &&
            (multiple ? (
               currentArray.map((v) => (
                  <input key={v} type="hidden" name={name} value={v} />
               ))
            ) : (
               <input
                  type="hidden"
                  name={name}
                  value={(currentValue as string) ?? ""}
               />
            ))}

         {open && (
            <div
               id={popupId}
               role="listbox"
               aria-multiselectable={multiple || undefined}
               aria-label={label || placeholder}
               className="datepicker-popup select-popup"
            >
               <div
                  className="select-options"
                  ref={listRef}
                  tabIndex={-1}
                  onKeyDown={onListKeyDown}
                  style={{ maxHeight }}
               >
                  {rendered.length ? (
                     rendered
                  ) : (
                     <div className="select-empty">No options</div>
                  )}
               </div>

               <div className="select-footer">
                  <button type="button" onClick={close}>
                     Done
                  </button>
                  <button
                     type="button"
                     onClick={clearAll}
                     disabled={selectedLabels.length === 0}
                  >
                     Clear
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default Select;
