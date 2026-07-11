# When To Delegate To Boot Or Persistence

## Decision

Choose whether a task should stay in DDD architecture work or be handed to Spring Boot or Spring persistence specialists.

## Signals/constraints

- Architecture vs implementation focus
- Need for controller/security/config work
- Need for JPA mapping or query detail

## Options

- Stay in DDD
- Delegate to spring-boot-engineer
- Delegate to spring-persistence-engineer

## Recommendation rule


Keep DDD here only when the hard part is the architecture decision; delegate once the task becomes mostly implementation mechanics.

## Tradeoffs

- Staying too long in architecture can block delivery.
- Delegating too early can skip domain clarity.

## Verification

- State the chosen owner and why the other skills were narrower or broader.
