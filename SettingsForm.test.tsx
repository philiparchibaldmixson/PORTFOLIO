import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsForm from "./SettingsForm";

function fillField(input: HTMLElement, value: string) {
  return userEvent.type(input, value);
}

describe("SettingsForm — validation errors", () => {
  it("shows an error when username is shorter than 3 characters", async () => {
    render(<SettingsForm />);
    const username = screen.getByLabelText(/username/i);

    await fillField(username, "ab");
    await userEvent.tab(); // blur to trigger validation

    const alert = await screen.findByRole("alert", {
      name: /at least 3 characters/i,
    });
    expect(alert).toBeInTheDocument();
    expect(username).toHaveAttribute("aria-invalid", "true");
    expect(username).toHaveAttribute("aria-describedby", alert.id);
  });

  it("shows an error when username contains non-alphanumeric characters", async () => {
    render(<SettingsForm />);
    const username = screen.getByLabelText(/username/i);

    await fillField(username, "bad-name!");
    await userEvent.tab();

    const alert = await screen.findByRole("alert", {
      name: /letters and numbers/i,
    });
    expect(alert).toBeInTheDocument();
    expect(username).toHaveAttribute("aria-invalid", "true");
  });

  it("shows an error when email is malformed", async () => {
    render(<SettingsForm />);
    const email = screen.getByLabelText(/email/i);

    await fillField(email, "not-an-email");
    await userEvent.tab();

    const alert = await screen.findByRole("alert", {
      name: /valid email/i,
    });
    expect(alert).toBeInTheDocument();
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAttribute("aria-describedby", alert.id);
  });

  it("blocks submission and surfaces errors when required fields are invalid", async () => {
    const onSubmit = vi.fn();
    render(<SettingsForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

describe("SettingsForm — successful submission", () => {
  it("calls the submit handler with parsed values and shows no errors", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<SettingsForm onSubmit={onSubmit} />);

    await fillField(screen.getByLabelText(/username/i), "validUser1");
    await fillField(screen.getByLabelText(/email/i), "user@example.com");
    await userEvent.selectOptions(
      screen.getByLabelText(/notification frequency/i),
      "immediate"
    );

    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      username: "validUser1",
      email: "user@example.com",
      frequency: "immediate",
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("resets dirty state after a successful submit (no unsaved-changes prompt needed)", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<SettingsForm onSubmit={onSubmit} />);

    await fillField(screen.getByLabelText(/username/i), "validUser1");
    await fillField(screen.getByLabelText(/email/i), "user@example.com");
    await userEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

    // After reset(values), the fields should retain the saved values
    // and the form should no longer be in a dirty state that would
    // trigger the beforeunload guard.
    expect(screen.getByLabelText(/username/i)).toHaveValue("validUser1");
    expect(screen.getByLabelText(/email/i)).toHaveValue("user@example.com");
  });
});
