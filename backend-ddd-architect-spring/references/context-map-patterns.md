# Context Map Patterns

## Pattern Catalog

1. `customer_supplier`
- Use when downstream can influence upstream contract evolution.
- Keep clear SLA and version policy.

2. `conformist`
- Use when downstream must adopt upstream model as is.
- Accept higher coupling and track risk.

3. `acl`
- Use when upstream model should not pollute downstream model.
- Implement translation at an explicit anti-corruption boundary.

4. `open_host_service`
- Use when one context exposes a stable integration API for multiple consumers.
- Pair with published language and versioning rules.

5. `shared_kernel`
- Use only when collaboration overhead is manageable.
- Keep kernel narrow and governed.

6. `partnership`
- Use when two teams co-evolve a shared area.
- Require synchronized planning and release cadence.

## Pattern Selection Rules

1. Choose `acl` when integrating legacy or volatile upstream models.
2. Choose `conformist` only for low-differentiation domains.
3. Choose `open_host_service` for platform-like provider contexts.
4. Choose `shared_kernel` only for very stable, small shared abstractions.

## Relationship Documentation Template

Use this per relation:

- `upstream`:
- `downstream`:
- `pattern`:
- `contract`:
- `versioning_policy`:
- `failure_mode`:
- `rationale`:
