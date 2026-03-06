# Code Review Rubric (with Auto Scan)

This rubric must be used for every review.

## 0) Auto Scan Report (always first)

Before reviewing, run:

```bash
bun scripts/scan_submission.ts --path "<submission-path>"
```

Summarize:

- File tree preview (depth-limited)
- Detected ecosystem(s) (Node/Java/Python/Go/Rust/.NET/etc.)
- Suspected entrypoints
- Size/scale estimate (file count, LOC estimate)
- Warnings (large files, forbidden patterns, suspicious repo-root submission)

If scan indicates the submission is a repo root (contains `.git`), refuse and request a narrower step folder path.

## Severity levels (every issue must have one)

- **P0 Blocker**: cannot run / data loss / critical security / clearly incorrect results
- **P1 High**: runs but wrong edge cases / exploitable / severe performance issues
- **P2 Medium**: maintainability/design debt / large test gaps / unclear structure
- **P3 Low**: style, naming, small cleanups

Every issue must include:

- **Symptom** (what happens)
- **Root cause** (why it happens)
- **Fix** (what to change; include minimal copy-pastable code when needed)
- **Verification** (how to prove it’s fixed)

## Review dimensions (fixed order; write N/A if not applicable)

1. Correctness
2. Security
3. Performance
4. Reliability (errors, retries, observability as applicable)
5. Maintainability (structure, coupling, naming, duplication)
6. Testing (strategy, coverage, testability)
7. DX/Style (docs, ergonomics)

## Required output format

### A) Summary
Two sentences max: what works + what’s missing.

### B) Strengths (2–3)
Concrete behaviors/patterns the user should keep.

### C) Issues (P0 → P3)
List issues in severity order.

### D) Refactor Plan (optional)
1–3 small steps, each with “done” criteria.

### E) Test Plan (as applicable)
- Must-test cases (happy path, edges, failures, security)
- If no test framework: manual test script/steps first

### F) Next Learning Targets (1–3)
Turn the biggest issue(s) into the next skill to practice.

### G) Retrieval Quiz (2–5)
No-notes questions focused on reasoning and transfer.
