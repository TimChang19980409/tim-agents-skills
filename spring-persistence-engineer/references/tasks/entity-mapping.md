# Entity Mapping

## When to use

Use when designing or correcting entity mappings, associations, IDs, or schema-aligned persistence models.

## Inputs

- Current entity or schema shape
- Active Spring Boot / Hibernate lane
- Portability constraints

## Steps

1. Classify the request into this task instead of a neighboring skill or decision.
2. Load `references/hibernate-mapping-and-performance.md` for deeper details only when needed.
3. Recommend the smallest safe change or plan for entity mapping.
4. End with concrete verification steps tied to the task.

## Safety gates

- Do not mix Boot 3.5 and Hibernate 7 guidance.
- Do not hide vendor-specific behavior when correctness depends on it.

## Outputs

- A focused recommendation or implementation plan for entity mapping

## Anti-patterns

### Common Mistakes
- [ ] Mistake 1: Using Hibernate-specific annotations when portability across databases is a requirement
- [ ] Mistake 2: Defining bidirectional associations without considering which side owns the FK
- [ ] Mistake 3: Adding @GeneratedValue(strategy = GenerationType.IDENTITY) without checking pool size under load

### Negative Examples
**Don't use @Transient on fields that should be persisted just because they need custom serialization logic** — move the serialization concern into a proper converter (@Convert) instead, so the field remains queryable and persistable.

## Verification

- State the migration or repository checks that prove the mapping.
