---
name: java-pro
description: |
  Diagnose JVM runtime evidence and decide JDK release or API status. Use for virtual-thread
  migrations with ThreadLocal, pinning, and connection-limit audits; JFR, thread-dump, or GC-log
  diagnosis; JMH benchmarks; runtime packaging; or Java 21/25/26 comparisons, including whether
  Structured Concurrency is preview or stable. Use even when the request already chooses virtual
  threads, supplies JVM evidence, or only asks to verify a Java version or API status. Do not use
  for Spring application or persistence features; route those to spring-boot-engineer or
  spring-persistence-engineer.
metadata:
  framework_role: specialist
  execution_mode: inline
---

# Java Pro

Inspect the project's JDK, build, runtime, and evidence before recommending a platform mechanism.

## Routes

- [Virtual-thread migration](references/tasks/virtual-thread-migration.md)
- [JVM diagnostics](references/tasks/jvm-diagnostics.md)
- [Benchmark design](references/tasks/benchmark-design.md)
- [Runtime packaging](references/tasks/runtime-packaging.md)
- [Concurrency model](references/decisions/choose-concurrency-model.md)
- [HotSpot versus native](references/decisions/hotspot-vs-native.md)

## Constraints

- Distinguish Java 21 and 25 LTS from Java 26 current.
- Check preview/incubator status before proposing APIs; never present Structured Concurrency as stable.
- Diagnose from JFR, thread dumps, GC logs, profiles, or a reproducible benchmark rather than symptoms alone.
- Account for pinning, pools, ThreadLocal usage, warmup, reflection, and packaging constraints.

End with the chosen lane, observed evidence, risk, and a runnable verification command.
