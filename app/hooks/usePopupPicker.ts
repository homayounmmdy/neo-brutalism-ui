"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface UsePopupPickerOptions {
   value?: string;
   onChange?: (v: string) => void;
}

/**
 * Popup plumbing shared by DatePicker / TimePicker / MonthPicker / WeekPicker.
 * Owns: controlled/uncontrolled value, open state, refs, outside-click,
 * Escape-to-close, and "open on Enter/Space/ArrowDown" for the trigger.
 *
 * Does NOT own: which field the value represents, how the panel is rendered,
 * or how keyboard navigation inside the panel works — those are picker-specific.
 */
export function usePopupPicker({ value, onChange }: UsePopupPickerOptions) {
   /* ---- controlled / uncontrolled value ---- */
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

   /* ---- open state + refs ---- */
   const [open, setOpen] = useState(false);
   const wrapRef = useRef<HTMLDivElement>(null);
   const triggerRef = useRef<HTMLButtonElement>(null);

   const closeAndFocusTrigger = useCallback(() => {
      setOpen(false);
      triggerRef.current?.focus();
   }, []);

   /* ---- dismiss: outside click + Escape ---- */
   useEffect(() => {
      if (!open) return;
      const onDown = (e: MouseEvent) => {
         if (!wrapRef.current?.contains(e.target as Node))
            closeAndFocusTrigger();
      };
      const onKey = (e: KeyboardEvent) => {
         if (e.key === "Escape") closeAndFocusTrigger();
      };
      document.addEventListener("mousedown", onDown);
      document.addEventListener("keydown", onKey);
      return () => {
         document.removeEventListener("mousedown", onDown);
         document.removeEventListener("keydown", onKey);
      };
   }, [open, closeAndFocusTrigger]);

   /* ---- trigger keyboard: open on Enter/Space/ArrowDown ---- */
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
      currentValue,
      setValue,
      open,
      setOpen,
      wrapRef,
      triggerRef,
      closeAndFocusTrigger,
      onTriggerKeyDown,
   };
}
