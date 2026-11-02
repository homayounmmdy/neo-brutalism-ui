import React from "react";

type ColorsVariant = "yellow" | "cyan" | "red" | "green";

export type ButtonType = {
   children?: React.ReactNode;
   color?: `btn-${ColorsVariant}` | "btn-null";
   buttonSize?: "sm" | "md" | "lg" | "xl";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type InputType = {
   focusColor?: `focus-${ColorsVariant}`;
   label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export type TextareaType = {
   focusColor?: `focus-${ColorsVariant}`;
   label?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export type SelectOption = {
   value: string;
   label: string;
   disabled?: boolean;
};

export type SelectOptionGroup = {
   label: string;
   options: SelectOption[];
};

export type SelectType = {
   focusColor?: `focus-${ColorsVariant}`;
   label?: string;
   placeholder?: string;
   options: (SelectOption | SelectOptionGroup)[];
   multiple?: boolean;
   value?: string | string[];
   onChange?: (value: string | string[]) => void;
   disabled?: boolean;
   required?: boolean;
   id?: string;
   name?: string;
   maxHeight?: number;
} & Omit<
   React.ButtonHTMLAttributes<HTMLButtonElement>,
   "value" | "onChange" | "type" | "disabled" | "children" | "onClick"
>;

export type CheckboxType = {
   focusColor?: `focus-${ColorsVariant}`;
   label?: string;
   description?: string;
   indeterminate?: boolean;
   size?: "sm" | "md" | "lg";
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size">;

export type CheckboxGroupOption = {
   value: string;
   label: string;
   description?: string;
   disabled?: boolean;
};

export type CheckboxGroupType = {
   focusColor?: `focus-${ColorsVariant}`;
   label?: string;
   options: CheckboxGroupOption[];
   value?: string[];
   onChange?: (value: string[]) => void;
   orientation?: "vertical" | "horizontal";
   showSelectAll?: boolean;
   size?: "sm" | "md" | "lg";
   disabled?: boolean;
   name?: string;
   id?: string;
   className?: string;
};
