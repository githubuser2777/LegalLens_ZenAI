# AI Usage Log - Week 02

## Project

LegalLens AI

## Week

Week 02 - Product Analysis & AI Feature Proposal

## Team Goal

Analyze the product idea, define a realistic MVP scope, and determine whether AI should be a core component or a supporting feature.

---

# Tasks Performed

## Task 1: Product Analysis

### Objective

Understand the problem space, target users, and MVP scope before starting implementation.

### AI Assistance

AI was used as a Product Analyst to:

* Analyze the legal contract review problem.
* Identify target user groups.
* Compare existing solutions.
* Suggest MVP boundaries.
* Identify potential project risks.

### Prompt

```text
Analyze an AI-powered contract analysis platform for a student software engineering project.

Provide:

1. Target users
2. User pain points
3. MVP scope
4. Core features
5. Risks
6. Success criteria

Keep the MVP realistic for a 10-week student project.
```

### Output Summary

AI identified:

* Students
* Employees
* Freelancers
* Consumers

as primary users.

AI also recommended limiting the MVP to:

* PDF Upload
* Text Extraction
* Risk Detection
* Basic Contract Review

instead of attempting a full legal platform.

### Human Review

The team reviewed the suggestions and adjusted the scope to better match the project timeline.

Decision:

Accepted with modifications.

---

## Task 2: AI Feature Evaluation

### Objective

Determine whether multiple AI features were necessary.

### Initial Idea

Several AI features were considered:

* Contract Summary
* Risk Detection
* Plain Language Translation
* Contract Question Answering

### AI Assistance

AI was asked to evaluate the value, complexity, and feasibility of each feature.

### Prompt

```text
For a 10-week software engineering course project, evaluate these AI features:

- Contract Summary
- Risk Detection
- Plain Language Translation
- Contract QA

Which feature provides the highest value while remaining realistic for a student team?
```

### Output Summary

AI concluded:

* Risk Detection provides the best balance of value and complexity.
* Contract QA requires a significantly larger architecture.
* Translation overlaps with summarization.
* Too many AI features would make the project AI-heavy.

### Human Review

The team agreed with the analysis.

Decision:

Use only one primary AI feature for MVP.

---

## Task 3: AI Feature Proposal

### Objective

Design a single AI feature aligned with course requirements.

### Selected Feature

AI Risk Analyzer

### Reason for Selection

The feature:

* Solves a real user problem.
* Demonstrates meaningful AI usage.
* Is easier to implement than a complete RAG chatbot.
* Keeps AI as a supporting tool rather than the entire product.

### Expected Inputs

* Contract text

### Expected Outputs

* Risk category
* Severity level
* Explanation
* Source citation

---

# Important Decisions

## Decision 1

AI should support the product, not define the entire product.

Status:

Accepted

---

## Decision 2

The product must remain useful if AI is disabled.

Status:

Accepted

Reason:

This is one of the required project defense questions.

---

## Decision 3

Use only one AI feature in the MVP.

Status:

Accepted

Selected Feature:

AI Risk Analyzer

---

# Lessons Learned

### Lesson 1

Starting implementation before product analysis can lead to unnecessary complexity.

### Lesson 2

Not every useful feature should be included in the MVP.

### Lesson 3

A smaller, focused AI feature is easier to implement, test, explain, and defend.

### Lesson 4

AI-generated suggestions require human evaluation and decision-making.

---

# AI Tools Used

| Tool    | Purpose                |
| ------- | ---------------------- |
| ChatGPT | Product analysis       |
| ChatGPT | MVP scoping            |
| ChatGPT | AI feature evaluation  |
| ChatGPT | Documentation drafting |

---

# Human Contributions

The team:

* Reviewed all AI outputs.
* Reduced feature scope.
* Selected the final MVP direction.
* Chose the AI Risk Analyzer feature.
* Approved final project decisions.

---

# Challenges Encountered

### Challenge

The initial concept included too many AI features.

### Resolution

The team simplified the design and retained only the feature with the highest value-to-complexity ratio.

---

# Week 02 Deliverables

Completed:

* PRODUCT_ANALYSIS.md
* AI_FEATURE_PROPOSAL.md
* ai-logs/week-02.md

Status:

Completed Successfully

---

# Reflection

AI was useful for brainstorming, product analysis, and evaluating alternative approaches.

However, final decisions regarding scope, priorities, and feasibility were made by the team after reviewing AI recommendations.

The team learned that successful software engineering involves controlling complexity rather than continuously adding features.
