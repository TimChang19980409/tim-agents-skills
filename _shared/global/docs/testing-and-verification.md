# Testing And Verification

- Run the smallest verification that proves the change and scales up only when needed.
- Prefer repository-native validation commands and static checks over ad hoc spot checks.
- If a task changes routing, configuration, or generated artifacts, add or update a check that makes regressions visible.
- Report what was verified and what could not be run.
- Keep retained benchmark artifacts compact; raw traces and staged trees are temporary unless debugging requires them.
