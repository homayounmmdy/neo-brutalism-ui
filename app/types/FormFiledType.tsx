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
