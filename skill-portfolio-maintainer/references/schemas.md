# JSON Schemas

This document defines the JSON schemas used by skill-portfolio-maintainer.

---

## evals.json

Defines the evals for a skill. Located at `evals/evals.json` within the skill directory.

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "User's example prompt",
      "expected_output": "Description of expected result",
      "files": ["evals/files/sample1.pdf"],
      "fixture_dir": "evals/files/sample-fixture",
      "support_skills": ["pdf-reader"],
      "expectations": [
        "containsAny:pdf-reader|obsidian-cli"
      ]
    }
  ]
}
```

**Fields:**
- `skill_name`: Name matching the skill's frontmatter
- `evals[].id`: Unique integer identifier
- `evals[].prompt`: The task to execute
- `evals[].expected_output`: Human-readable description of success
- `evals[].files`: Optional list of input file paths (relative to skill root)
- `evals[].fixture_dir`: Optional fixture directory copied into the benchmark workspace
- `evals[].support_skills`: Optional extra skills to stage alongside the primary skill
- `evals[].expectations`: List of verifiable statements

For deterministic OpenCode grading, `expectations` may use these prefixes:

- `contains:<text>`
- `notContains:<text>`
- `containsAny:<text>|<text>`
- `containsAll:<text>|<text>`
- `regex:<pattern>`

### Task-Focused Contract

For the current framework waves, each eval should follow this contract:

- Use `notContains:` when you need to protect against a likely neighboring-skill false positive
- Prefer prompt-only evals unless the task truly needs staged files or fixtures

---

## history.json

Tracks version progression in Improve mode. Located at workspace root.

```json
{
  "started_at": "2026-01-15T10:30:00Z",
  "skill_name": "pdf",
  "current_best": "v2",
  "iterations": [
    {
      "version": "v0",
      "parent": null,
      "expectation_pass_rate": 0.65,
      "grading_result": "baseline",
      "is_current_best": false
    },
    {
      "version": "v1",
      "parent": "v0",
      "expectation_pass_rate": 0.75,
      "grading_result": "won",
      "is_current_best": false
    },
    {
      "version": "v2",
      "parent": "v1",
      "expectation_pass_rate": 0.85,
      "grading_result": "won",
      "is_current_best": true
    }
  ]
}
```

**Fields:**
- `started_at`: ISO timestamp of when improvement started
- `skill_name`: Name of the skill being improved
- `current_best`: Version identifier of the best performer
- `iterations[].version`: Version identifier (v0, v1, ...)
- `iterations[].parent`: Parent version this was derived from
- `iterations[].expectation_pass_rate`: Pass rate from grading
- `iterations[].grading_result`: "baseline", "won", "lost", or "tie"
- `iterations[].is_current_best`: Whether this is the current best version

---

## grading.json

Output from the grader agent. Located at `<run-dir>/grading.json`.

```json
{
  "expectations": [
    {
      "text": "The output includes the name 'John Smith'",
      "passed": true,
      "evidence": "Found in transcript Step 3: 'Extracted names: John Smith, Sarah Johnson'"
    },
    {
      "text": "The spreadsheet has a SUM formula in cell B10",
      "passed": false,
      "evidence": "No spreadsheet was created. The output was a text file."
    }
  ],
  "summary": {
    "passed": 2,
    "failed": 1,
    "total": 3,
    "pass_rate": 0.67
  },
  "execution_metrics": {
    "tool_calls": {
      "Read": 5,
      "Write": 2,
      "Bash": 8
    },
    "total_tool_calls": 15,
    "total_steps": 6,
    "errors_encountered": 0,
    "output_chars": 12450,
    "transcript_chars": 3200
  },
  "timing": {
    "executor_duration_seconds": 165.0,
    "grader_duration_seconds": 26.0,
    "total_duration_seconds": 191.0
  },
  "claims": [
    {
      "claim": "The form has 12 fillable fields",
      "type": "factual",
      "verified": true,
      "evidence": "Counted 12 fields in field_info.json"
    }
  ],
  "user_notes_summary": {
    "uncertainties": ["Used 2023 data, may be stale"],
    "needs_review": [],
    "workarounds": ["Fell back to text overlay for non-fillable fields"]
  },
  "eval_feedback": {
    "suggestions": [
      {
        "assertion": "The output includes the name 'John Smith'",
        "reason": "A hallucinated document that mentions the name would also pass"
      }
    ],
    "overall": "Assertions check presence but not correctness."
  }
}
```

**Fields:**
- `expectations[]`: Graded expectations with evidence
- `summary`: Aggregate pass/fail counts
- `execution_metrics`: Tool usage and output size (from executor's metrics.json)
- `timing`: Wall clock timing (from timing.json)
- `claims`: Extracted and verified claims from the output
- `user_notes_summary`: Issues flagged by the executor
- `eval_feedback`: (optional) Improvement suggestions for the evals, only present when the grader identifies issues worth raising

---

## metrics.json

Output from the executor agent. Located at `<run-dir>/outputs/metrics.json`.

```json
{
  "tool_calls": {
    "Read": 5,
    "Write": 2,
    "Bash": 8,
    "Edit": 1,
    "Glob": 2,
    "Grep": 0
  },
  "total_tool_calls": 18,
  "total_steps": 6,
  "files_created": ["filled_form.pdf", "field_values.json"],
  "errors_encountered": 0,
  "output_chars": 12450,
  "transcript_chars": 3200
}
```

**Fields:**
- `tool_calls`: Count per tool type
- `total_tool_calls`: Sum of all tool calls
- `total_steps`: Number of major execution steps
- `files_created`: List of output files created
- `errors_encountered`: Number of errors during execution
- `output_chars`: Total character count of output files
- `transcript_chars`: Character count of transcript

---

## timing.json

Wall clock timing for a run. Located at `<run-dir>/timing.json`.

**How to capture:** When a subagent task completes, the task notification includes `total_tokens` and `duration_ms`. Save these immediately — they are not persisted anywhere else and cannot be recovered after the fact.

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3,
  "executor_start": "2026-01-15T10:30:00Z",
  "executor_end": "2026-01-15T10:32:45Z",
  "executor_duration_seconds": 165.0,
  "grader_start": "2026-01-15T10:32:46Z",
  "grader_end": "2026-01-15T10:33:12Z",
  "grader_duration_seconds": 26.0
}
```

---

## benchmark.json

Output from the current OpenCode benchmark grader. Located at `_benchmarks/<skill>-workspace/iteration-1/benchmark.json`.

```json
{
  "skill_name": "pdf-reader",
  "generated_at": "2026-03-14T08:00:00.000Z",
  "rows": [
    {
      "eval_id": 1,
      "eval_name": "page-extraction",
      "with_skill": {
        "passRate": 1,
        "total": 3,
        "passed": 3,
        "tokens": 2400,
        "selectedExpectation": {
          "passed": true
        }
      },
      "without_skill": {
        "passRate": 0.33,
        "total": 3,
        "passed": 1,
        "tokens": 1800
      },
      "delta": 0.67
    }
  ],
  "summary": {
    "comparable_evals": 5,
    "with_skill_average_pass_rate": 0.92,
    "without_skill_average_pass_rate": 0.48,
    "with_skill_wins": 4,
    "selected_pass_count": 5,
    "selected_total": 5,
    "selected_pass_rate": 1
  }
}
```

**Fields:**
- `skill_name`: Name of the benchmarked skill
- `generated_at`: ISO timestamp for the grading pass
- `rows[]`: One row per eval, comparing `with_skill` and `without_skill`
  - `with_skill` / `without_skill`: Pass-rate summary for that configuration, or `null` if the run is missing
  - `delta`: `with_skill.passRate - without_skill.passRate`
- Keep the benchmark workspace compact by retaining `benchmark.json`, `benchmark.md`, `opencode.json`, and `README.md`; remove `results.json` after compaction unless debugging requires it.

## portfolio benchmark.json

Output from `scripts/run_portfolio_opencode_trigger_eval.ts`. Located at `_benchmarks/skill-portfolio-workspace/<model-profile>/benchmark.json`.

```json
{
  "workspace": "_benchmarks/skill-portfolio-workspace/opencode-nemotron-3-super-free",
  "generated_at": "2026-04-06T10:55:49.689Z",
  "overall": {
    "model": "opencode/nemotron-3-super-free",
    "status": "completed",
    "total_queries": 180,
    "total_runs": 540,
    "timed_out_runs": 92,
    "query_pass_rate": 0.8278,
    "run_pass_rate": 0.8278
  },
  "per_skill": [
    {
      "skill": "ppt-generation",
      "queries": 12,
      "timed_out_runs": 0,
      "query_pass_rate": 1,
      "run_pass_rate": 1,
      "false_positive_rate": 0
    }
  ],
  "queries": [
    {
      "id": "ppt-generation-1",
      "expected_skill": "ppt-generation",
      "source_tag": "ppt",
      "prompt": "A user asks for help with ppt. Which single skill should handle this request?",
      "runs": 3,
      "correct_runs": 3,
      "pass_rate": 1
    }
  ]
}
```

**Fields:**
- `workspace`: Absolute or repo-relative portfolio workspace path for the run
- `overall`: Model, run status, query/run counts, timeout count, and pass rates
- `per_skill[]`: Skill-level query count, timeout count, pass rates, and false-positive rate
- `queries[]`: Query-level prompt, expected skill, run count, correct-run count, and pass rate
- Keep only `benchmark.json`, `benchmark.md`, `opencode.json`, and `README.md` after compaction; delete `results.json`, `AGENTS.md`, `eval-set.json`, and `runs/`.

## wave-{n}.json

Aggregated summary for a benchmark wave. Located at `_benchmarks/wave-benchmarks/wave-{n}.json`.

```json
{
  "wave": "wave-2",
  "generated_at": "2026-03-14T09:00:00.000Z",
  "skills": [
    {
      "skill": "java-pro",
      "with_skill_average_pass_rate": 0.9,
      "without_skill_average_pass_rate": 0.42,
      "evals_at_or_above_75": 5,
      "total_evals": 5,
      "selected_pass_rate": 1,
      "selected_pass_count": 5,
      "selected_total": 5,
      "passes_threshold": true
    }
  ],
  "summary": {
    "skill_count": 5,
    "passing_skills": 4,
    "all_skills_green": false,
    "with_skill_average_pass_rate": 0.88,
    "without_skill_average_pass_rate": 0.44,
    "trigger_regressions": {
      "queries": 12,
      "passed": 11,
      "pass_rate": 0.9167
    }
  }
}
```

---

## comparison.json

Output from blind comparator. Located at `<grading-dir>/comparison-N.json`.

```json
{
  "winner": "A",
  "reasoning": "Output A provides a complete solution with proper formatting and all required fields. Output B is missing the date field and has formatting inconsistencies.",
  "rubric": {
    "A": {
      "content": {
        "correctness": 5,
        "completeness": 5,
        "accuracy": 4
      },
      "structure": {
        "organization": 4,
        "formatting": 5,
        "usability": 4
      },
      "content_score": 4.7,
      "structure_score": 4.3,
      "overall_score": 9.0
    },
    "B": {
      "content": {
        "correctness": 3,
        "completeness": 2,
        "accuracy": 3
      },
      "structure": {
        "organization": 3,
        "formatting": 2,
        "usability": 3
      },
      "content_score": 2.7,
      "structure_score": 2.7,
      "overall_score": 5.4
    }
  },
  "output_quality": {
    "A": {
      "score": 9,
      "strengths": ["Complete solution", "Well-formatted", "All fields present"],
      "weaknesses": ["Minor style inconsistency in header"]
    },
    "B": {
      "score": 5,
      "strengths": ["Readable output", "Correct basic structure"],
      "weaknesses": ["Missing date field", "Formatting inconsistencies", "Partial data extraction"]
    }
  },
  "expectation_results": {
    "A": {
      "passed": 4,
      "total": 5,
      "pass_rate": 0.80,
      "details": [
        {"text": "Output includes name", "passed": true}
      ]
    },
    "B": {
      "passed": 3,
      "total": 5,
      "pass_rate": 0.60,
      "details": [
        {"text": "Output includes name", "passed": true}
      ]
    }
  }
}
```

---

## analysis.json

Output from post-hoc analyzer. Located at `<grading-dir>/analysis.json`.

```json
{
  "comparison_summary": {
    "winner": "A",
    "winner_skill": "path/to/winner/skill",
    "loser_skill": "path/to/loser/skill",
    "comparator_reasoning": "Brief summary of why comparator chose winner"
  },
  "winner_strengths": [
    "Clear step-by-step instructions for handling multi-page documents",
    "Included validation script that caught formatting errors"
  ],
  "loser_weaknesses": [
    "Vague instruction 'process the document appropriately' led to inconsistent behavior",
    "No script for validation, agent had to improvise"
  ],
  "instruction_following": {
    "winner": {
      "score": 9,
      "issues": ["Minor: skipped optional logging step"]
    },
    "loser": {
      "score": 6,
      "issues": [
        "Did not use the skill's formatting template",
        "Invented own approach instead of following step 3"
      ]
    }
  },
  "improvement_suggestions": [
    {
      "priority": "high",
      "category": "instructions",
      "suggestion": "Replace 'process the document appropriately' with explicit steps",
      "expected_impact": "Would eliminate ambiguity that caused inconsistent behavior"
    }
  ],
  "transcript_insights": {
    "winner_execution_pattern": "Read skill -> Followed 5-step process -> Used validation script",
    "loser_execution_pattern": "Read skill -> Unclear on approach -> Tried 3 different methods"
  }
}
```
