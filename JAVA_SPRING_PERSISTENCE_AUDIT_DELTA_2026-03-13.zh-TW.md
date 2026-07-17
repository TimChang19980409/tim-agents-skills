# Java / Spring Persistence Audit 差異說明（2026-03-13）

[English](JAVA_SPRING_PERSISTENCE_AUDIT_DELTA_2026-03-13.md) | 繁體中文

此文件記錄 portfolio 的異動：新增 `spring-persistence-engineer` 作為 core host，並保留 `rdbms-data-modeling` 作為 archive specialist。

## 為什麼需要新的 Core Host

- 既有的 `java-pro`、`spring-boot-engineer` 與 `backend-ddd-architect-spring` 分工清楚，但 persistence-heavy 的需求仍落在 application assembly 與 domain architecture 之間的空隙。
- Spring Data JPA、Hibernate `6.x` / `7.x` 與多 RDBMS 取捨的規模，已足以支撐獨立 host。
- 若將這些內容放入 `spring-boot-engineer`，該 skill 的範圍會過大，並增加與 `java-pro`、`backend-ddd-architect-spring` 的觸發碰撞。

## 新的邊界

- `spring-persistence-engineer`：entities、repositories、fetch plans、locking、batching、Hibernate lane selection 與 RDBMS portability。
- `spring-boot-engineer`：controllers、DTOs、validation、security、config、actuator 與 Spring application assembly。
- `java-pro`：JVM、concurrency、profiling、runtime 與 platform architecture。
- `backend-ddd-architect-spring`：domain boundaries、context maps、aggregates 與 invariants。
- `_archive/rdbms-data-modeling`：schema-first 與 vendor-comparison 的深入分析，必須明確載入。

## 對 Portfolio 的影響

- Core roster 從 13 個增加為 14 個有效 skills。
- Java / Spring / Backend family 現在有獨立 persistence host，不再把所有 persistence 工作導向 application assembly skill。
- 在不過度擴張預設有效觸發範圍的前提下，保留跨 vendor data-modeling 深度。
