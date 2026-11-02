"use client";

import React, { useState } from "react";
import Checkbox from "./Checkbox";
import { CheckboxGroupType } from "../types/FormFiledType";

const CheckboxGroup: React.FC<CheckboxGroupType> = ({
   focusColor,
   label,
   options,
   value,
   onChange,
   orientation = "vertical",
   showSelectAll = false,
   size,
   disabled,
   name,
   id,
   className,
}) => {
   const isControlled = value !== undefined;
   const [internal, setInternal] = useState<string[]>([]);
   const current = isControlled ? value! : internal;

   const update = (next: string[]) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
   };

   const toggle = (v: string) => {
      update(
         current.includes(v) ? current.filter((x) => x !== v) : [...current, v]
      );
   };

   const enabledValues = options.filter((o) => !o.disabled).map((o) => o.value);
   const allChecked =
      enabledValues.length > 0 &&
      enabledValues.every((v) => current.includes(v));
   const someChecked = current.length > 0 && !allChecked;

   const toggleAll = () => update(allChecked ? [] : enabledValues);

   return (
      <fieldset id={id} className={`checkbox-group ${className ?? ""}`}>
         {label && <legend className="checkbox-group-legend">{label}</legend>}

         {showSelectAll && (
            <Checkbox
               focusColor={focusColor}
               label="Select all"
               size={size}
               disabled={disabled}
               checked={allChecked}
               indeterminate={someChecked}
               onChange={toggleAll}
            />
         )}

         <div className={`checkbox-group-list checkbox-group-${orientation}`}>
            {options.map((opt) => (
               <Checkbox
                  key={opt.value}
                  id={id ? `${id}-${opt.value}` : undefined}
                  name={name}
                  value={opt.value}
                  label={opt.label}
                  description={opt.description}
                  size={size}
                  disabled={disabled || opt.disabled}
                  focusColor={focusColor}
                  checked={current.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
               />
            ))}
         </div>
      </fieldset>
   );
};

export default CheckboxGroup;
