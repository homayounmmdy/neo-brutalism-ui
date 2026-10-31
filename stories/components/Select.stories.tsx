import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Select from "../../app/components/Select";
import type {
   SelectOption,
   SelectOptionGroup,
} from "../../app/types/FormFiledType";
import { fn } from "storybook/test";

/* ---------- shared fixtures ---------- */
const fruits: SelectOption[] = [
   { value: "apple", label: "Apple" },
   { value: "banana", label: "Banana" },
   { value: "cherry", label: "Cherry" },
   { value: "date", label: "Date" },
   { value: "elderberry", label: "Elderberry" },
];

const fruitsWithDisabled: SelectOption[] = [
   { value: "apple", label: "Apple" },
   { value: "banana", label: "Banana" },
   { value: "cherry", label: "Cherry (out of stock)", disabled: true },
   { value: "date", label: "Date" },
   { value: "elderberry", label: "Elderberry (out of stock)", disabled: true },
];

const groupedOptions: (SelectOption | SelectOptionGroup)[] = [
   {
      label: "Fruits",
      options: [
         { value: "apple", label: "Apple" },
         { value: "banana", label: "Banana" },
         { value: "cherry", label: "Cherry" },
      ],
   },
   {
      label: "Vegetables",
      options: [
         { value: "carrot", label: "Carrot" },
         { value: "broccoli", label: "Broccoli" },
         { value: "spinach", label: "Spinach" },
      ],
   },
   {
      label: "Grains",
      options: [
         { value: "rice", label: "Rice" },
         { value: "wheat", label: "Wheat" },
         { value: "oats", label: "Oats" },
      ],
   },
];

const manyOptions: SelectOption[] = Array.from({ length: 25 }, (_, i) => ({
   value: `item-${i + 1}`,
   label: `Item ${i + 1}`,
}));

/* ---------- meta ---------- */
const meta: Meta<typeof Select> = {
   title: "Components/Select",
   component: Select,
   tags: ["autodocs"],
   parameters: {
      layout: "centered",
   },
   decorators: [
      (Story) => (
         <div style={{ width: "360px", minHeight: "420px" }}>
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
      multiple: { control: "boolean" },
      disabled: { control: "boolean" },
      required: { control: "boolean" },
      maxHeight: {
         control: { type: "number", min: 100, max: 500, step: 20 },
         description: "Max height (px) of the options list before scrolling",
      },
      className: { control: "text" },
      onChange: { action: "changed" },
   },
   args: {
      options: fruits,
      onChange: fn(),
   },
};

export default meta;
type Story = StoryObj<typeof Select>;

/* ---------- Basic ---------- */
export const Default: Story = {
   args: {
      label: "Fruit",
      placeholder: "Pick a fruit",
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
      const [value, setValue] = useState<string>("banana");
      return <Select {...args} value={value} onChange={setValue} />;
   },
   args: {
      label: "Fruit",
      focusColor: "focus-cyan",
   },
};

/* ---------- Options ---------- */
export const WithDisabledOptions: Story = {
   args: {
      label: "Fruit",
      options: fruitsWithDisabled,
      focusColor: "focus-cyan",
   },
};

export const Grouped: Story = {
   args: {
      label: "Groceries",
      options: groupedOptions,
      focusColor: "focus-cyan",
   },
};

export const EmptyOptions: Story = {
   args: {
      label: "Nothing to choose",
      options: [],
      focusColor: "focus-cyan",
   },
};

export const Scrollable: Story = {
   args: {
      label: "Many options (scrollable)",
      options: manyOptions,
      maxHeight: 180,
      focusColor: "focus-cyan",
   },
};

/* ---------- Multiple ---------- */
export const Multiple: Story = {
   render: (args) => {
      const [value, setValue] = useState<string[]>([]);
      return <Select {...args} value={value} onChange={setValue} />;
   },
   args: {
      label: "Pick fruits",
      multiple: true,
      focusColor: "focus-cyan",
   },
};

export const MultipleWithPreselected: Story = {
   render: (args) => {
      const [value, setValue] = useState<string[]>(["apple", "cherry"]);
      return <Select {...args} value={value} onChange={setValue} />;
   },
   args: {
      label: "Pick fruits",
      multiple: true,
      focusColor: "focus-cyan",
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
      label: "Fruit (required)",
      required: true,
      focusColor: "focus-cyan",
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
         <Select
            label="Yellow accent"
            options={fruits}
            focusColor="focus-yellow"
         />
         <Select label="Cyan accent" options={fruits} focusColor="focus-cyan" />
         <Select label="Red accent" options={fruits} focusColor="focus-red" />
         <Select
            label="Green accent"
            options={fruits}
            focusColor="focus-green"
         />
      </div>
   ),
};

export const StatesShowcase: Story = {
   render: () => (
      <div className="flex flex-col gap-4">
         <Select label="Normal" options={fruits} focusColor="focus-cyan" />
         <Select
            label="Required"
            options={fruits}
            required
            focusColor="focus-cyan"
         />
         <Select
            label="Disabled"
            options={fruits}
            disabled
            focusColor="focus-cyan"
         />
         <Select
            label="With disabled options"
            options={fruitsWithDisabled}
            focusColor="focus-cyan"
         />
         <Select label="Empty" options={[]} focusColor="focus-cyan" />
      </div>
   ),
};

export const ControlledShowcase: Story = {
   render: () => {
      const [single, setSingle] = useState<string>("");
      const [multi, setMulti] = useState<string[]>([]);
      return (
         <div className="flex flex-col gap-4">
            <Select
               label="Single"
               options={groupedOptions}
               value={single}
               onChange={setSingle}
               focusColor="focus-cyan"
            />
            <p className="text-sm font-bold text-black dark:text-gray-200">
               Selected: {single || "(none)"}
            </p>

            <Select
               label="Multiple"
               options={groupedOptions}
               multiple
               value={multi}
               onChange={setMulti}
               focusColor="focus-cyan"
            />
            <p className="text-sm font-bold text-black dark:text-gray-200">
               Selected: {multi.length ? multi.join(", ") : "(none)"}
            </p>
         </div>
      );
   },
};
