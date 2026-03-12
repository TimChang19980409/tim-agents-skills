## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills available in this benchmark workspace.
### Available skills
- java-pro: Use this skill for Java 21+ platform work and runtime architecture decisions. Trigger when the user is migrating services, batch jobs, or workers to virtual threads or structured concurrency; choosing between CompletableFuture, executors, and other concurrency models; diagnosing GC, memory, thread-dump, CPU, startup, or profiling issues; benchmarking with JMH; comparing HotSpot with GraalVM native image; or reasoning about Java module boundaries, modular-monolith tradeoffs, observability, and platform-level design. Do not use it as the primary skill for Spring Boot controllers, JPA repositories, SecurityFilterChain wiring, application.yml, or @SpringBootTest implementation; delegate those to spring-boot-engineer. (file: /Users/ss105213025/.agents/skills/java-pro/SKILL.md)
- spring-boot-engineer: Use this skill whenever the user asks to build, refactor, secure, configure, or test a Spring Boot 3.x application. Trigger for REST APIs, WebFlux handlers, controller/service/repository/DTO layering, Bean Validation, @ControllerAdvice, Spring Data JPA, transactions, SecurityFilterChain, OAuth2 or JWT setup, application.yml, profiles, @ConfigurationProperties, Actuator and Spring Cloud wiring, and Spring-focused tests such as @SpringBootTest, MockMvc, WebMvcTest, or DataJpaTest. Do not use it as the primary skill for JVM tuning, virtual threads, GC or profiling analysis, native image tradeoffs, or Java concurrency architecture; delegate those concerns to java-pro. (file: /Users/ss105213025/.agents/skills/spring-boot-engineer/SKILL.md)
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
