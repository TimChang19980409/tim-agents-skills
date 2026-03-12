## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills available in this benchmark workspace.
### Available skills
- java-pro: Use this skill for Java 21+ platform work: concurrency models, JVM and GC behavior, profiling, benchmarking, runtime packaging, and Java module or runtime architecture decisions. Trigger when the user is migrating batch jobs or backend runtimes to virtual threads or structured concurrency; choosing between CompletableFuture, executors, and other Java concurrency approaches; diagnosing memory, thread-dump, CPU, startup, latency, or profiling issues; comparing HotSpot with GraalVM native image; or reasoning about module boundaries, modular-monolith tradeoffs, observability, and platform-level design. Do not use it for Spring Boot feature delivery such as REST endpoints, auth flows, transactional business services, JPA mappings, application.yml, or @SpringBootTest implementation; delegate those to spring-boot-engineer. (file: /Users/ss105213025/.agents/skills/java-pro/SKILL.md)
- spring-boot-engineer: Use this skill whenever the user wants application code or configuration inside a Spring Boot 3.x service changed. This is the default skill for Spring Boot feature delivery. Trigger for building REST endpoints or WebFlux handlers; refactoring controller, service, repository, entity, and DTO layers; Bean Validation and @ControllerAdvice; Spring Data JPA mappings, projections, and transactions; SecurityFilterChain plus OAuth2 or JWT login flows; application.yml, profiles, and @ConfigurationProperties; Actuator and Spring Cloud wiring; and Spring-focused tests such as @SpringBootTest, MockMvc, WebMvcTest, DataJpaTest, and other test slices. Do not use it as the primary skill for JVM tuning, virtual threads, GC or profiling analysis, native image tradeoffs, or Java concurrency architecture; delegate those concerns to java-pro. (file: /Users/ss105213025/.agents/skills/spring-boot-engineer/SKILL.md)
### How to use skills
- Discovery: The list above is the skills available in this session.
- Trigger rules: If the user request clearly matches a skill description shown above, you must use that skill for that turn.
- How to use a skill:
  1) Open its `SKILL.md`.
  2) Read only enough to follow the workflow.
  3) If `references/` exists, load only the files needed for the task.
- Coordination and sequencing:
  - Choose the minimal set of skills that covers the request.
  - Announce which skill you are using and why in one short line.
- Safety and fallback:
  - If a skill cannot be applied cleanly, say so briefly and continue with the best fallback.
