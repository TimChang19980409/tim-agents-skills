## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills available in this benchmark workspace.
### Available skills
- java-pro: Expert guidance for Java 21+ platform work: language features, concurrency, JVM/GC, profiling, runtime architecture, build pipelines, and performance engineering. Use proactively when the user asks about virtual threads, CompletableFuture, memory/latency tuning, native image tradeoffs, profiling, startup optimization, or Java-level architecture decisions. Do not use this as the primary skill for Spring Boot controllers, JPA repositories, SecurityFilterChain wiring, application.yml setup, or @SpringBootTest implementation; delegate those to spring-boot-engineer. (file: /Users/ss105213025/.agents/skills/java-pro/SKILL.md)
- spring-boot-engineer: Spring Boot 3.x application delivery skill for REST APIs, WebFlux handlers, validation, configuration, Spring Data JPA, Spring Security 6, Actuator, and Spring-focused testing. Use this whenever the user is building or changing Spring Boot application code such as controllers, services, repositories, DTOs, SecurityFilterChain, application.yml, @ConfigurationProperties, or @SpringBootTest suites. Do not use this as the primary skill for JVM tuning, virtual thread strategy, GC/profiling analysis, native image tradeoffs, or Java-level concurrency design; delegate those to java-pro. (file: /Users/ss105213025/.agents/skills/spring-boot-engineer/SKILL.md)
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
