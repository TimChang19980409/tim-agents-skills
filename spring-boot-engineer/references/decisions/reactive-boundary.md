# Reactive Boundary

## Decision

Choose whether a Spring endpoint should stay blocking MVC, move to WebFlux, or keep an explicit boundary.

## Signals/constraints

- Existing stack is MVC or WebFlux
- Downstream work is blocking or non-blocking
- Need for streaming or consistency with the current app

## Options

- Stay on MVC
- Use WebFlux end-to-end
- Keep an explicit boundary

## Recommendation rule

Prefer consistency with the existing app and keep blocking work out of reactive paths unless a hybrid boundary is explicitly desired.

## Tradeoffs

- WebFlux helps non-blocking workloads but adds complexity.
- MVC is simpler for blocking services.

## Verification

- State the chosen boundary and which blocking/reactive mismatch was avoided.
