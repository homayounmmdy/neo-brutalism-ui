"use client";

import React, {
   forwardRef,
   useEffect,
   useImperativeHandle,
   useRef,
} from "react";
import { CheckboxType } from "../types/FormFiledType";

const CheckIcon = () => (
   <svg
      className="checkbox-check"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
   >
      <path d="M20 6L9 17l-5-5" />
   </svg>
);

const Checkbox = forwardRef<HTMLInputElement, CheckboxType>(
   (
      {
         focusColor,
         label,
         description,
         indeterminate,
         size = "md",
         className,
         id,
         disabled,
         ...rest
      },
      ref
   ) => {
      const internalRef = useRef<HTMLInputElement>(null);
      useImperativeHandle(
         ref,
         () => internalRef.current as HTMLInputElement,
         []
      );

      // `indeterminate` can only be set imperatively.
      useEffect(() => {
         if (internalRef.current)
            internalRef.current.indeterminate = !!indeterminate;
      }, [indeterminate]);

      const accentClass = focusColor
         ? `datepicker-${focusColor.replace("focus-", "")}`
         : "";

      return (
         <label
            htmlFor={id}
            className={`checkbox-wrap ${accentClass} ${className ?? ""}`}
            data-size={size}
            data-disabled={disabled ? "true" : undefined}
         >
            <input
               ref={internalRef}
               type="checkbox"
               id={id}
               disabled={disabled}
               className="checkbox-input"
               {...rest}
            />
            <span className="checkbox-box" aria-hidden="true">
               <CheckIcon />
               <span className="checkbox-dash" />
            </span>
            {(label || description) && (
               <span className="checkbox-content">
                  {label && <span className="checkbox-label">{label}</span>}
                  {description && (
                     <span className="checkbox-description">{description}</span>
                  )}
               </span>
            )}
         </label>
      );
   }
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
