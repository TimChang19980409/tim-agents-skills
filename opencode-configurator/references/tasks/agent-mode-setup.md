# Agent Mode Setup

## When to use

Use when configuring project modes, agents, browser automation, or oh-my-opencode orchestration.

## Inputs

- Workflow goal
- Need for agents/modes/browser automation
- Relevant config scope

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/oh-my-opencode-cheatsheet.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for agent mode setup.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not reset whole harness configs for a narrow change.
- Do not confuse project-local setup with user-default setup.

## Outputs

- A focused recommendation or implementation plan for agent mode setup

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Resetting entire harness configs when only a narrow change is needed
- [ ] Mistake 2: Confusing project-local agent mode setup with user-level default configuration
- [ ] Mistake 3: Configuring browser automation without verifying the browser binary path is correct

### Negative Examples
**Don't configure an agent mode without setting explicit boundaries on what it can execute** — agents without guardrails can run destructive commands; always pair agent enablement with explicit permission rules.

## Verification

- State the startup or mode-selection check that confirms the setup works.
