# Eval Strategy

## Decision

Choose whether a skill should be tested with routing-only prompts, concrete task prompts, or a mix.

## Signals/constraints

- Objective verifiability
- Need to prove route selection vs execution quality
- User preference for specific tasks

## Options

- Use concrete task prompts
- Use routing-only prompts
- Mix both

## Recommendation rule

Default to concrete task prompts and add routing-only cases only where boundary failures are realistic.

## Tradeoffs

- Concrete tasks prove content consumption but take more effort.
- Routing-only cases are cheaper but weaker evidence for real use.

## Verification

- State the chosen eval mix and why it fits the skill.
