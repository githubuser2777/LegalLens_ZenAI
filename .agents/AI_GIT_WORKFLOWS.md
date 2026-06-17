# AI_GIT_WORKFLOW.md

# Purpose

This document defines how AI coding assistants and developers should collaborate through Git during project development.

The objective is to maintain a clean repository, predictable commits, and traceable changes.

Applies to:

* Cursor
* Claude Code
* Codex
* Gemini CLI
* Roo Code
* Cline
* Human Contributors

---

# Development Flow

Task

↓

Branch

↓

Implementation

↓

Testing

↓

Pull Request

↓

Review

↓

Merge

No direct commits to main.

---

# Branch Strategy

Main Branch

main

Purpose:

Production-ready code only.

Must remain stable.

---

Development Branch

develop

Purpose:

Integration branch for completed features.

---

Feature Branches

feature/<feature-name>

Examples:

feature/pdf-upload

feature/rag-pipeline

feature/risk-analysis

feature/chat-interface

feature/citations

---

Bug Fix Branches

fix/<bug-name>

Examples:

fix/pdf-parser-error

fix/vector-search-timeout

---

Documentation Branches

docs/<topic>

Examples:

docs/api-specification

docs/rag-design

---

# AI Task Workflow

Before making changes:

1. Read PRODUCT_DIRECTION.md
2. Read AGENT_GUIDE.md
3. Read related documentation
4. Understand current architecture

Do not implement features that contradict product direction.

---

# Commit Strategy

Each commit should contain one logical change.

Good:

feat: add pdf upload endpoint

Good:

fix: resolve chunk overlap bug

Bad:

misc updates

Bad:

final changes

---

# Commit Types

feat

New functionality

fix

Bug fixes

docs

Documentation updates

refactor

Code restructuring

test

Testing improvements

perf

Performance improvements

chore

Maintenance tasks

---

# Pull Request Requirements

Every PR must include:

Purpose

What changed

Testing performed

Known limitations

Screenshots if UI changed

---

# AI Coding Rules

AI should:

* Create small commits
* Preserve architecture
* Follow existing patterns
* Add documentation
* Avoid unnecessary dependencies

AI should not:

* Rewrite unrelated code
* Introduce breaking changes
* Remove documentation
* Change architecture without approval

---

# Documentation Updates

If a feature changes:

Update:

* README.md
* API_SPECIFICATION.md
* SYSTEM_ARCHITECTURE.md

When necessary.

Documentation is part of the feature.

---

# Testing Requirements

Before merge:

Backend

* Unit tests pass

Frontend

* Build succeeds

RAG

* Retrieval tests pass

API

* Endpoint tests pass

---

# Merge Conditions

A branch may be merged when:

* Feature works
* Tests pass
* Documentation updated
* No critical issues remain

---

# Emergency Fixes

Only critical production issues may bypass normal workflow.

All emergency fixes must be documented afterward.

---

# Definition Of Done

A task is complete when:

* Code works
* Tests pass
* Documentation updated
* Review completed
* Ready for deployment

Code alone is not considered done.
