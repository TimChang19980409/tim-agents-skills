# Verify Current Facts

## When to use

Use this playbook when the task depends on up-to-date facts such as docs, prices, releases, laws, schedules, or product details.

## Inputs

- The fact to verify
- Whether the answer needs official docs, news, or both
- Required citation format

## Steps

1. If the prompt asks you to start with `Selected:`, begin with `Selected: verify-current-facts` before any explanation.
1. Search for the fact with recency or source filters when needed.
2. Compare at least two relevant sources for unstable facts.
3. Prefer official or primary sources for technical and high-stakes questions.
4. State the concrete date in the answer and include links.

## Safety gates

- Do not rely on memory for unstable information.
- Call out uncertainty if sources disagree or are stale.

## Outputs

- A fact-checked answer with dated evidence, source links, and a short note about whether official or primary sources were preferred

## Verification

- Check that the answer names the exact date and cites the chosen sources
