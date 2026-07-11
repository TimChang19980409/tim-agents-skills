# Coding Principles

- Prefer small, explicit changes over broad rewrites.
- Preserve user edits and unrelated work already present in the tree.
- Use ASCII by default unless the file already relies on Unicode.
- Keep durable guidance in shared docs or repository docs, not in giant entrypoint files.
- Prefer readable, enforceable rules over tool-specific folklore.
- Avoid destructive git operations unless the user explicitly asks for them.
- For repository scripts, follow the existing runtime. When this portfolio owns a new standalone script, prefer Bun + TypeScript, deterministic stdout/stderr, explicit exit codes, and no dependency when the standard library is sufficient.
