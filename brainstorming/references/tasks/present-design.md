# Present Design

## When to use

Use this playbook after clarifying questions are answered and you're ready to propose design approaches for the feature.

## Inputs

- Clarified problem statement, purpose, and goals.
- Explicit constraints and success criteria.
- Scope (either single feature or decomposed chunks).
- Project context from explore-project-context.

## Steps

1. Propose 2-3 different approaches with clear trade-offs.
2. Lead with your recommended option and explain why it's the best fit.
3. Present design in sections scaled to complexity: few sentences if straightforward, up to 200-300 words if nuanced.
4. After each section, ask whether it looks right before continuing.
5. Cover key areas: architecture, components, data flow, error handling, testing.
6. Design for isolation and clarity — small units with clear purpose, well-defined interfaces.
7. Be ready to loop back to ask clarifying questions if the design reveals gaps.

## Safety gates

- Do not present only one option without trade-offs.
- Do not overwhelm with large blocks of text without checkpoints.
- Do not ignore the project's existing patterns and tech stack.
- Do not proceed to implementation without user agreement on the design.

## Outputs

- 2-3 design approaches with trade-offs.
- A recommended option with clear rationale.
- Design sections covering architecture, components, data flow, error handling, testing.
- User agreement on the chosen approach.

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Presenting only one option without alternatives.
- [ ] Mistake 2: Dumping a large design document without checkpoints.
- [ ] Mistake 3: Ignoring existing project patterns or tech stack.
- [ ] Mistake 4: Designing large, monolithic components instead of isolated, purposeful units.

### Negative Examples
**Don't write a 50-line design block and ask "does this look right?" at the end** — break it into sections, ask after each one.

## Verification

- Confirm you presented 2-3 approaches with trade-offs.
- Check that you recommended one option with explicit rationale.
- Verify you asked for confirmation after each section.
- Ensure the design references existing patterns when applicable.