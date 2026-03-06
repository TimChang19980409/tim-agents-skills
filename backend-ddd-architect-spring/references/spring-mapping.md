# Mapping DDD to Spring Boot

## Target Structure

Map each bounded context to one service or one modular package set.

Example module layout:

- `com.example.<context>.controller`
- `com.example.<context>.application`
- `com.example.<context>.domain`
- `com.example.<context>.infrastructure`

## Layer Guidance

1. `controller`
- Handle transport concerns only.
- Convert request DTO to application command.

2. `application`
- Orchestrate use cases.
- Manage transaction boundaries and domain service calls.

3. `domain`
- Hold entities, value objects, aggregates, domain services, domain events.
- Keep framework dependencies minimal.

4. `infrastructure`
- Implement repositories and adapters.
- Handle messaging and external system clients.

## Integration Guidance

1. Raise domain events inside transaction boundary if needed for internal workflows.
2. Publish integration events through outbox or reliable messaging process.
3. Place anti-corruption adapters in infrastructure layer and map external contracts to internal model.

## Spring-Specific Notes

1. Prefer constructor injection.
2. Keep JPA annotations close to aggregate persistence model; avoid leaking persistence concerns into application services.
3. Use explicit package boundaries to prevent accidental cross-context imports.
