# Refactor

## When to use

Use this playbook when the user wants to simplify, reorganize, or de-risk existing frontend code without changing product behavior.

## Inputs

- Current implementation files
- Pain points such as mixed responsibilities, duplicated state, or brittle effects
- Constraints around preserving behavior or API compatibility

## Steps

1. Identify the smallest boundary that reduces complexity or coupling.
2. Separate unrelated concerns such as data loading, state orchestration, and layout.
3. Remove derived state or effect-driven logic when render-time derivation or events are clearer.
4. Preserve external behavior and test coverage where possible.
5. Escalate to `component-boundaries` if the real problem is API shape rather than code cleanup.

## Safety gates

- Avoid sweeping renames or file moves with low payoff.
- Keep public component contracts stable unless the user approved an API change.

## Outputs

- A focused refactor plan or diff
- Risk notes for behavioral regressions

## Verification

- Run the tests most likely to catch regressions
- Call out anything intentionally deferred
