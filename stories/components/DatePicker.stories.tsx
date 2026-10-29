import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import DatePicker from "../../app/components/DatePicker";
import { getTodayISO, addDaysISO } from "../../app/utils/date";
import { fn } from "storybook/test";

const meta: Meta<typeof DatePicker> = {
   title: "Components/DatePicker",
   component: DatePicker,
   tags: ["autodocs"],
   parameters: {
      layout: "centered",
   },
   decorators: [
      (Story) => (
         <div style={{ width: "360px", minHeight: "460px" }}>
            <Story />
         </div>
      ),
   ],
   argTypes: {
      focusColor: {
         control: "select",
         options: ["focus-yellow", "focus-cyan", "focus-red", "focus-green"],
         description: "Accent color applied to the popup and focused trigger",
      },
      label: { control: "text" },
      placeholder: { control: "text" },
      disabled: { control: "boolean" },
      required: { control: "boolean" },
      min: {
         control: "text",
         description: "Minimum selectable date (YYYY-MM-DD)",
      },
      max: {
         control: "text",
         description: "Maximum selectable date (YYYY-MM-DD)",
      },
      className: { control: "text" },
      onChange: { action: "changed" },
   },
   args: {
      onChange: fn(),
   },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

/* ---------- Basic ---------- */
export const Default: Story = {
   args: {
      label: "Date",
      placeholder: "Select date",
      focusColor: "focus-cyan",
   },
};

export const WithoutLabel: Story = {
   args: {
      placeholder: "No label here",
      focusColor: "focus-yellow",
   },
};

export const WithValue: Story = {
   render: (args) => {
      const [value, setValue] = useState<string>(getTodayISO());
      return <DatePicker {...args} value={value} onChange={setValue} />;
   },
   args: {
      label: "Appointment",
      focusColor: "focus-cyan",
   },
};

export const WithMinMax: Story = {
   render: (args) => {
      const [value, setValue] = useState<string>("");
      return <DatePicker {...args} value={value} onChange={setValue} />;
   },
   args: {
      label: "Within next 30 days",
      focusColor: "focus-cyan",
      min: getTodayISO(),
      max: addDaysISO(30),
   },
};

/* ---------- Focus variants ---------- */
export const Yellow: Story = {
   args: { label: "Yellow accent", focusColor: "focus-yellow" },
};

export const Cyan: Story = {
   args: { label: "Cyan accent", focusColor: "focus-cyan" },
};

export const Red: Story = {
   args: { label: "Red accent", focusColor: "focus-red" },
};

export const Green: Story = {
   args: { label: "Green accent", focusColor: "focus-green" },
};

/* ---------- States ---------- */
export const Required: Story = {
   args: {
      label: "Date of birth",
      focusColor: "focus-cyan",
      required: true,
   },
};

export const Disabled: Story = {
   args: {
      label: "Disabled",
      focusColor: "focus-green",
      disabled: true,
   },
};

/* ---------- Showcase ---------- */
export const AllColors: Story = {
   render: () => (
      <div className="flex flex-col gap-4">
         <DatePicker label="Yellow accent" focusColor="focus-yellow" />
         <DatePicker label="Cyan accent" focusColor="focus-cyan" />
         <DatePicker label="Red accent" focusColor="focus-red" />
         <DatePicker label="Green accent" focusColor="focus-green" />
      </div>
   ),
};

export const StatesShowcase: Story = {
   render: () => (
      <div className="flex flex-col gap-4">
         <DatePicker label="Normal" focusColor="focus-cyan" />
         <DatePicker label="Required" required focusColor="focus-cyan" />
         <DatePicker label="Disabled" disabled focusColor="focus-cyan" />
         <DatePicker
            label="With min (today)"
            min={getTodayISO()}
            focusColor="focus-cyan"
         />
         <DatePicker
            label="With max (today)"
            max={getTodayISO()}
            focusColor="focus-cyan"
         />
      </div>
   ),
};

export const ControlledShowcase: Story = {
   render: () => {
      const [date, setDate] = useState<string>("");
      return (
         <div className="flex flex-col gap-3">
            <DatePicker
               label="Choose a date"
               value={date}
               onChange={setDate}
               focusColor="focus-cyan"
            />
            <p className="text-sm font-bold text-black dark:text-gray-200">
               Selected: {date || "(none)"}
            </p>
         </div>
      );
   },
};
