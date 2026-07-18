"use client";

import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const notificationFrequencyEnum = z.enum([
  "immediate",
  "daily",
  "never",
]);

export const settingsFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers."),
  email: z.string().email("Enter a valid email address."),
  frequency: notificationFrequencyEnum,
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const defaultValues: SettingsFormValues = {
  username: "",
  email: "",
  frequency: "daily",
};

function defaultOnSubmit(values: SettingsFormValues) {
  // Standalone fallback so the component works without a caller-supplied handler.
  // eslint-disable-next-line no-console
  console.log("SettingsForm submitted:", values);
}

interface SettingsFormProps {
  onSubmit?: (values: SettingsFormValues) => void | Promise<void>;
  initialValues?: Partial<SettingsFormValues>;
}

export default function SettingsForm({
  onSubmit = defaultOnSubmit,
  initialValues,
}: SettingsFormProps) {
  const formId = useId();
  const usernameErrorId = `${formId}-username-error`;
  const emailErrorId = `${formId}-email-error`;
  const frequencyErrorId = `${formId}-frequency-error`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting, isSubmitSuccessful },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { ...defaultValues, ...initialValues },
  });

  // Guard against losing unsaved changes on tab close / refresh / external navigation.
  // Note: this does not cover in-app client-side route changes (e.g. Next.js router,
  // React Router). That needs a router-specific navigation guard layered on top.
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitSuccessful) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmitSuccessful]);

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values);
    // Resets isDirty so the beforeunload guard stops firing after a clean save.
    reset(values);
  });

  return (
    <form onSubmit={submitHandler} noValidate aria-busy={isSubmitting}>
      <div>
        <label htmlFor={`${formId}-username`}>Username</label>
        <input
          id={`${formId}-username`}
          type="text"
          autoComplete="username"
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? usernameErrorId : undefined}
          {...register("username")}
        />
        {errors.username && (
          <span id={usernameErrorId} role="alert">
            {errors.username.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-email`}>Email</label>
        <input
          id={`${formId}-email`}
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? emailErrorId : undefined}
          {...register("email")}
        />
        {errors.email && (
          <span id={emailErrorId} role="alert">
            {errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-frequency`}>Notification frequency</label>
        <select
          id={`${formId}-frequency`}
          aria-invalid={!!errors.frequency}
          aria-describedby={errors.frequency ? frequencyErrorId : undefined}
          {...register("frequency")}
        >
          <option value="immediate">Immediate</option>
          <option value="daily">Daily</option>
          <option value="never">Never</option>
        </select>
        {errors.frequency && (
          <span id={frequencyErrorId} role="alert">
            {errors.frequency.message}
          </span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
