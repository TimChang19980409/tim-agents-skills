# Write Spec

## When to use

Use this playbook after the design is validated and you're ready to commit the spec to the consumer project's documentation.

## Inputs

- Validated design approach from present-design.
- Consumer project path (not the skills repo).
- Topic or feature name for the spec file.

## Steps

1. Write the validated design to the CONSUMER PROJECT's `docs/specs/YYYY-MM-DD-<topic>-design.md` (NOT the skills repo).
2. Perform self-review: scan for placeholders (TBD/TODO), check internal consistency, verify scope is focused enough for a single plan, and identify ambiguities.
3. Fix issues inline during self-review.
4. After self-review, ask the user to review the spec before proceeding.
5. If the user approves, commit the design document to git (in the consumer project).
6. If a spec already exists for the same topic, version-suffix the new one (e.g., `YYYY-MM-DD-<topic>-design-v2.md`) instead of overwriting.

## Safety gates

- Do not write the spec to the skills repo — it belongs in the consumer project.
- Do not skip self-review before asking for user review.
- Do not commit the spec without user approval.
- Do not overwrite an existing spec without version-suffixing.

## Outputs

- A design spec file in the consumer project's `docs/specs/` directory.
- Self-reviewed, internally consistent, unambiguous spec.
- A committed design document in the consumer project's git history.

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Writing the spec to the skills repo instead of the consumer project.
- [ ] Mistake 2: Skipping self-review and immediately asking for user review.
- [ ] Mistake 3: Committing the spec without user approval.
- [ ] Mistake 4: Overwriting an existing spec without version-suffixing.

### Negative Examples
**Don't write the spec to `brainstorming/references/tasks/` or any skills repo path** — the spec belongs in the consumer project's `docs/specs/` directory.

## Verification

- Confirm the spec file exists in the consumer project's `docs/specs/` directory.
- Verify the spec has no TBD/TODO placeholders.
- Check that you asked for user review before committing.
- Ensure the spec is committed to git in the consumer project.