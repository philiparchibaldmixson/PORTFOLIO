# Workflow Review: Vague vs. Orchestrated AI Development

## 1. Correctness & Quality
- **Round 1 (Vague):** The AI provided a standard, generic form. It lacked robust error handling, used client-side placeholders without real structural state, and missed framework-specific best practices (e.g., using native form states instead of state management libraries).
- **Round 2 (Precise):** By specifying Zod and react-hook-form, the code integrated perfectly with our existing stack. Typed schemas ensured compile-time safety, and the implementation strictly adhered to the exact constraints requested.

## 2. Accessibility & Edge Cases
- **Round 1 (Vague):** Completely ignored accessibility. Standard `<input>` tags lacked associated `<label>` tokens or semantic error tags (`aria-invalid`, `aria-describedby`). Edge cases like loading states during submission or network failures were completely unhandled.
- **Round 2 (Precise):** Keyboard navigation works seamlessly out of the box. Form fields correctly toggle accessibility tags dynamically based on validation states. The "dirty state" check successfully intercepts accidental route changes.

## 3. Review & Verification Effort
- **Round 1 (Vague):** High cognitive load for review. I had to manually rewrite parts of the form to support our styling tokens and structural requirements, defeating the purpose of speed.
- **Round 2 (Precise):** Low review overhead. Because the AI was forced to generate tests alongside the implementation, verification was as simple as running `npm test`. The plan-first model ensured structural alignment before a single line of UI was written.

## Conclusion
"Prompting" is a misnomer; software engineering with AI is about strict specification and automated verification. Spending 5 minutes writing a tight specification saved roughly 45 minutes of manual debugging, refactoring, and retrofitting.