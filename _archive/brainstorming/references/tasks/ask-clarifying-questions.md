# Ask Clarifying Questions

## When to use

Use this playbook when you need to understand the user's requirements, constraints, and success criteria before proposing designs.

## Inputs

- The user's initial request or feature description
- Any context already gathered (e.g., from explore-project-context)
- The project scope and tech stack (if already known)

## Steps

1. Ask ONE question at a time — never multiple questions in a single message.
2. Prefer multiple-choice options over open-ended questions when possible.
3. Focus on understanding: purpose, constraints, success criteria, and non-goals.
4. For large projects, assess scope first — if the request spans multiple independent subsystems, decompose before continuing.
5. If a topic needs deeper exploration, break it into multiple questions rather than overwhelming with one large query.
6. Wait for the user's answer before asking the next question.

## Safety gates

- Do not ask more than one question per message.
- Do not present overwhelming lists of questions at once.
- Do not skip scope assessment for large, multi-subsystem requests.
- Do not assume constraints or success criteria — ask explicitly.

## Outputs

- A clear understanding of the problem statement, purpose, and goals.
- Explicit constraints and non-goals.
- Defined success criteria.
- A decomposed scope if the original request was too large.

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Asking multiple questions in a single message without prioritization.
- [ ] Mistake 2: Presenting open-ended questions without bounded options when multiple-choice would work.
- [ ] Mistake 3: Assuming constraints or success criteria without asking.
- [ ] Mistake 4: Treating a multi-subsystem feature as a single unit without scope decomposition.

### Negative Examples
**Don't ask:** "What's the tech stack? What are the constraints? When do you need this done?" — this overwhelms the user. Ask one question, wait, then ask the next.

## Verification

- Confirm you asked only one question per message.
- Use phrases like "First, I need to understand..." or "One more question..." to signal the sequential process.
- If the request was large, explicitly state the scope decomposition before proceeding.