# DOM Inspect

## When to use

Use this playbook when the task needs DOM text, CSS values, screenshots, mobile emulation, or app-context JavaScript.

## Inputs

- Target selector or UI surface
- Required inspection mode: screenshot, text extraction, CSS, or eval

## Steps

1. Choose the narrowest inspection command that answers the question.
2. Use exact CLI syntax such as `obsidian dev:dom selector="<selector>" text`, `obsidian dev:css selector="<selector>" prop=<property>`, or `obsidian dev:screenshot path=<path>`.
3. Keep selectors explicit and reproducible.

## Safety gates

- Avoid screenshots when text or CSS inspection is sufficient.
- Do not assume DOM structure without inspecting it.

## Outputs

- The exact inspection command with `selector=` or `prop=` syntax and what it proves

## Verification

- State the selector, target surface, and expected evidence
