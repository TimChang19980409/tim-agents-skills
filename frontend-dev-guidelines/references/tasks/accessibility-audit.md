# Accessibility Audit

## When to use

Use this playbook when the user is auditing keyboard behavior, labels, announcements, semantics, focus management, or inclusive UI quality.

## Inputs

- Relevant components, screens, or flows
- Existing markup, styling, and interaction behavior
- Any known assistive-technology or keyboard concerns

## Steps

1. Check semantics, landmarks, and naming first.
2. Review keyboard reachability, focus visibility, and focus return paths.
3. Inspect feedback states such as loading, error, and retry messaging.
4. Call out missing reduced-motion handling or touch-target issues when relevant.
5. Delegate to `stagehand-aria-e2e` if the audit depends on browser flow validation.

## Safety gates

- Avoid purely aesthetic comments unless they affect comprehension or accessibility.
- Do not assume browser behavior; verify when real interaction risk exists.

## Outputs

- Accessibility findings with severity and user consequence

## Verification

- Note what was inspected statically versus what still needs browser validation
