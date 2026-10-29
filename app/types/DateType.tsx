interface BaseDateInputProps {
   label?: string;
   id?: string;
   name?: string;
   className?: string;
   focusColor?: string;
   placeholder?: string;
   disabled?: boolean;
   required?: boolean;
   value?: string;
   onChange?: (value: string) => void;
}

export interface DateModeProps extends BaseDateInputProps {
   type?: "date";
   min?: string;
   max?: string;
}

export interface TimeModeProps extends BaseDateInputProps {
   type: "time";
   min?: string;
   max?: string;
   step?: number;
}

export interface DateTimeLocalModeProps extends BaseDateInputProps {
   type: "datetime-local";
   min?: string;
   max?: string;
   step?: number;
}

export interface MonthModeProps extends BaseDateInputProps {
   type: "month";
   min?: string;
   max?: string;
}

export interface WeekModeProps extends BaseDateInputProps {
   type: "week";
   min?: string;
   max?: string;
}

export type DatePickerType =
   | DateModeProps
   | TimeModeProps
   | DateTimeLocalModeProps
   | MonthModeProps
   | WeekModeProps;

export type NativeDateInputType =
   | TimeModeProps
   | DateTimeLocalModeProps
   | MonthModeProps
   | WeekModeProps;
