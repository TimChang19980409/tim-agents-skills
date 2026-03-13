# Performance Review

## When to use

Use this playbook when the user asks why a frontend experience is slow, expensive, or re-rendering too much.

## Inputs

- Hot paths, components, or routes under suspicion
- Evidence such as slow interactions, waterfalls, or bundle complaints
- Existing framework and data layer

## Steps

1. Check network waterfalls and duplicated async work before micro-optimizations.
2. Review bundle boundaries, lazy loading, and unnecessary client code.
3. Look for render churn from effects, duplicated state, unstable props, or broad subscriptions.
4. Inspect DOM weight, list rendering, and layout or paint-heavy patterns.
5. Load `react-best-practices` or `vercel-react-best-practices` when deeper performance heuristics are needed.

## Safety gates

- Do not prescribe memoization everywhere by default.
- Avoid performance advice that fights the repo's current framework model.

## Outputs

- Performance findings ordered by likely impact
- Concrete next fixes rather than general optimization advice

## Verification

- Prefer measurements, targeted tests, or reproducible steps over intuition alone
