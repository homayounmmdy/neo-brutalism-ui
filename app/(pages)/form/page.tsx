"use client";

import Checkbox from "@/app/components/Checkbox";
import CheckboxGroup from "@/app/components/CheckboxGroup";
import DatePicker from "@/app/components/DatePicker";
import Input from "@/app/components/Input";
import Select from "@/app/components/Select.tsx";
import Textarea from "@/app/components/Textarea";
import { addDaysISO, getTodayISO } from "@/app/utils/date";
import React, { useState } from "react";

/* ---------- Layout helpers (not form controls) ---------- */

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
   title,
   children,
}) => (
   <section className="space-y-4">
      <h2 className="border-b-4 border-black pb-2 text-lg font-black text-black dark:border-gray-200 dark:text-gray-200">
         {title}
      </h2>
      {children}
   </section>
);

/** Minimal wrapper for the *plain* fields — layout only, no control styling. */
const Field: React.FC<{
   label: string;
   htmlFor?: string;
   hint?: string;
   children: React.ReactNode;
}> = ({ label, htmlFor, hint, children }) => (
   <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm">
         {label}
      </label>
      {children}
      {hint && <p className="text-xs opacity-60">{hint}</p>}
   </div>
);

/* ---------- Page ---------- */

export default function FormPage() {
   const [date, setDate] = useState(getTodayISO());
   const [time, setTime] = useState("09:00");
   const [dateTime, setDateTime] = useState("");
   const [month, setMonth] = useState("");
   const [week, setWeek] = useState("");

   return (
      <main className="mx-auto max-w-3xl space-y-10 px-4 py-10 text-black dark:text-gray-200">
         <header>
            <h1 className="text-2xl font-black">Form field reference</h1>
            <p className="text-sm opacity-60">
               Custom: Input · Textarea · DatePicker. Everything else is a
               native field to be upgraded later.
            </p>
         </header>

         <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            {/* ============ TEXT INPUTS (CUSTOM) ============ */}
            <Section title="Text inputs — custom Input">
               <Input
                  id="text"
                  label="Text"
                  focusColor="focus-cyan"
                  placeholder="Plain text"
               />
               <Input
                  id="email"
                  type="email"
                  label="Email"
                  focusColor="focus-green"
                  placeholder="you@example.com"
               />
               <Input
                  id="password"
                  type="password"
                  label="Password"
                  focusColor="focus-red"
                  placeholder="••••••••"
               />
               <Input
                  id="number"
                  type="number"
                  label="Number"
                  focusColor="focus-yellow"
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={42}
               />
               <Input
                  id="tel"
                  type="tel"
                  label="Telephone"
                  focusColor="focus-cyan"
                  placeholder="+1 555 000 0000"
               />
               <Input
                  id="url"
                  type="url"
                  label="URL"
                  focusColor="focus-green"
                  placeholder="https://example.com"
               />
               <Input
                  id="search"
                  type="search"
                  label="Search"
                  focusColor="focus-yellow"
                  placeholder="Search…"
               />
               <Input
                  id="disabled"
                  label="Disabled"
                  focusColor="focus-cyan"
                  defaultValue="Read-only value"
                  disabled
               />
            </Section>

            {/* ============ TEXTAREA (CUSTOM) ============ */}
            <Section title="Multiline — custom Textarea">
               <Textarea
                  id="message"
                  label="Message"
                  focusColor="focus-cyan"
                  placeholder="Write something…"
                  rows={4}
               />
               <Textarea
                  id="bio"
                  label="Bio"
                  focusColor="focus-red"
                  placeholder="Tell us about yourself"
                  rows={3}
               />
            </Section>

            {/* ============ DATE / TIME ============ */}
            <Section title="Date & time">
               <DatePicker
                  id="dob"
                  label="Date (custom DatePicker)"
                  focusColor="focus-cyan"
                  max={getTodayISO()}
                  value={date}
                  onChange={setDate}
               />

               <DatePicker
                  id="delivery"
                  label="Date — bounded range"
                  focusColor="focus-green"
                  min={getTodayISO()}
                  max={addDaysISO(30)}
               />

               <DatePicker
                  id="time"
                  type="time"
                  label="Time"
                  focusColor="focus-cyan"
                  step={60}
                  value={time}
                  onChange={setTime}
               />

               <DatePicker
                  id="datetime-local"
                  type="datetime-local"
                  label="Date & time (local)"
                  focusColor="focus-green"
                  value={dateTime}
                  onChange={setDateTime}
               />

               <DatePicker
                  id="month"
                  type="month"
                  label="Month"
                  focusColor="focus-yellow"
                  value={month}
                  onChange={setMonth}
               />

               <DatePicker
                  id="week"
                  type="week"
                  label="Week"
                  focusColor="focus-red"
                  value={week}
                  onChange={setWeek}
               />
            </Section>

            {/* ============ SELECT ============ */}

            <Section title="Select — custom">
               <Select
                  id="plan"
                  label="Plan"
                  focusColor="focus-cyan"
                  placeholder="Choose a plan…"
                  options={[
                     { value: "free", label: "Free" },
                     { value: "pro", label: "Pro" },
                     { value: "team", label: "Team" },
                     { value: "ent", label: "Enterprise", disabled: true },
                  ]}
               />

               <Select
                  id="country"
                  label="Country (grouped)"
                  focusColor="focus-green"
                  options={[
                     {
                        label: "Europe",
                        options: [
                           { value: "de", label: "Germany" },
                           { value: "fr", label: "France" },
                           { value: "es", label: "Spain" },
                        ],
                     },
                     {
                        label: "Asia",
                        options: [
                           { value: "jp", label: "Japan" },
                           { value: "kr", label: "Korea" },
                           { value: "vn", label: "Vietnam" },
                        ],
                     },
                  ]}
               />

               <Select
                  id="tags"
                  label="Tags (multiple)"
                  focusColor="focus-red"
                  multiple
                  placeholder="Pick some tags…"
                  options={[
                     { value: "react", label: "React" },
                     { value: "ts", label: "TypeScript" },
                     { value: "tailwind", label: "Tailwind" },
                     { value: "node", label: "Node.js" },
                     { value: "go", label: "Go" },
                  ]}
               />

               <Select
                  id="disabled-sel"
                  label="Disabled"
                  focusColor="focus-yellow"
                  disabled
                  value="pro"
                  options={[{ value: "pro", label: "Pro" }]}
               />
            </Section>

            {/* ============ CHECKBOX ============ */}

            <Section title="Checkbox — custom">
               {/* Single */}
               <Checkbox
                  id="terms"
                  label="Accept terms"
                  description="You agree to the Terms of Service and Privacy Policy."
                  focusColor="focus-cyan"
               />

               {/* Single disabled */}
               <Checkbox
                  id="newsletter"
                  label="Subscribe to newsletter"
                  focusColor="focus-green"
                  disabled
               />

               {/* Sizes */}
               <div className="flex items-center gap-6">
                  <Checkbox size="sm" label="Small" focusColor="focus-yellow" />
                  <Checkbox
                     size="md"
                     label="Medium"
                     focusColor="focus-yellow"
                     defaultChecked
                  />
                  <Checkbox size="lg" label="Large" focusColor="focus-yellow" />
               </div>

               {/* Group with select-all */}
               <CheckboxGroup
                  id="interests"
                  name="interests"
                  label="Interests"
                  focusColor="focus-red"
                  showSelectAll
                  options={[
                     { value: "design", label: "Design" },
                     { value: "code", label: "Code" },
                     { value: "music", label: "Music" },
                     { value: "sports", label: "Sports", disabled: true },
                  ]}
               />

               {/* Horizontal group */}
               <CheckboxGroup
                  id="notifications"
                  name="notifications"
                  label="Notifications"
                  focusColor="focus-green"
                  orientation="horizontal"
                  options={[
                     { value: "email", label: "Email" },
                     { value: "sms", label: "SMS" },
                     { value: "push", label: "Push" },
                  ]}
               />
            </Section>

            {/* ============ RADIO ============ */}
            <Section title="Radio">
               <fieldset className="space-y-2">
                  <legend className="mb-1 text-sm">Plan</legend>
                  {["Free", "Pro", "Enterprise"].map((plan) => (
                     <div key={plan} className="flex items-center gap-2">
                        <input
                           id={`radio-${plan}`}
                           type="radio"
                           name="plan"
                           value={plan.toLowerCase()}
                           defaultChecked={plan === "Pro"}
                        />
                        <label htmlFor={`radio-${plan}`} className="text-sm">
                           {plan}
                        </label>
                     </div>
                  ))}
               </fieldset>
            </Section>

            {/* ============ FILE / RANGE / COLOR ============ */}
            <Section title="File · Range · Color">
               <Field
                  label="File upload"
                  htmlFor="file"
                  hint="PNG, JPG up to 2MB."
               >
                  <input id="file" type="file" accept="image/*" />
               </Field>

               <Field label="Multiple files" htmlFor="file-multi">
                  <input id="file-multi" type="file" multiple />
               </Field>

               <Field label="Range" htmlFor="range">
                  <input
                     id="range"
                     type="range"
                     min={0}
                     max={100}
                     step={5}
                     defaultValue={50}
                  />
               </Field>

               <Field label="Color" htmlFor="color">
                  <input id="color" type="color" defaultValue="#22d3ee" />
               </Field>
            </Section>

            {/* ============ MISC ============ */}
            <Section title="Misc">
               <input type="hidden" name="formToken" defaultValue="abc-123" />

               <Field label="Read-only" htmlFor="readonly">
                  <input id="readonly" defaultValue="Cannot edit" readOnly />
               </Field>

               <div className="flex flex-wrap gap-3 pt-2">
                  <button type="submit">Submit</button>
                  <button type="reset">Reset</button>
               </div>
            </Section>
         </form>
      </main>
   );
}
