# Review

## When to use

Use this playbook when the user asks for a frontend code review, PR review, or architecture review rather than implementation.

## Inputs

- The files or diff under review
- Repo conventions and framework context
- The user's goal: correctness, maintainability, performance, or UX quality

## Steps

1. Inspect behavioral risks first, then maintainability and consistency.
2. Prioritize findings that can cause bugs, regressions, or confusing UX.
3. Reference repo-local patterns before suggesting new abstractions.
4. Load `react-best-practices` or `web-design-guidelines` only if the review is explicitly performance- or checklist-heavy.

## Safety gates

- Do not turn the review into a rewrite proposal unless the current design is unsafe.
- Avoid generic style nitpicks without user impact.

## Outputs

- Findings first, ordered by severity and grounded in concrete files or behaviors

## Verification

- Mention testing gaps, missing coverage, or unverified interaction paths
