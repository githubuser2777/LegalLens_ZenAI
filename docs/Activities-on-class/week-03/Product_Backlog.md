# Step 06 - Product Backlog

# Purpose

This document converts product requirements into a prioritized backlog that can be planned, estimated, and implemented during development.

The backlog focuses on delivering a Minimum Viable Product (MVP) within the project timeline.

---

# Feature Identification

## F01 - PDF Upload

Description:

Allow users to upload contract documents in PDF format.

Related User Stories:

* US-01 Upload Contract

Priority:

P1

---

## F02 - Contract Text Extraction

Description:

Extract readable text from uploaded contracts.

Related User Stories:

* US-02 View Uploaded Contract

Priority:

P1

---

## F03 - Contract Viewer

Description:

Display extracted contract content in a readable format.

Related User Stories:

* US-02 View Uploaded Contract
* US-08 Review Original Contract Clause

Priority:

P1

---

## F04 - AI Risk Analyzer

Description:

Analyze contract content and identify potentially risky clauses.

Related User Stories:

* US-05 Analyze Contract Risks
* US-06 View Risk Severity

Priority:

P1

AI Feature:

Yes

---

## F05 - Risk Dashboard

Description:

Display detected risks, categories, and severity levels.

Related User Stories:

* US-05 Analyze Contract Risks
* US-06 View Risk Severity

Priority:

P1

---

## F06 - Citation Viewer

Description:

Allow users to view the original clause associated with a risk finding.

Related User Stories:

* US-07 View Supporting Citations
* US-08 Review Original Contract Clause

Priority:

P1

---

## F07 - Contract Search

Description:

Search keywords within a contract.

Related User Stories:

* US-03 Search Contract Content

Priority:

P2

---

## F08 - Section Navigation

Description:

Navigate contract sections quickly.

Related User Stories:

* US-04 Navigate Contract Sections

Priority:

P2

---

## F09 - User Registration

Description:

Allow users to create accounts.

Related User Stories:

* US-09 Register Account

Priority:

P3

---

## F10 - User Authentication

Description:

Allow users to log in securely.

Related User Stories:

* US-10 Login Securely

Priority:

P3

---

# Product Backlog

| ID  | Feature             | Priority | Story Points | Sprint   |
| --- | ------------------- | -------- | ------------ | -------- |
| F01 | PDF Upload          | P1       | 3            | Sprint 1 |
| F02 | Text Extraction     | P1       | 5            | Sprint 1 |
| F03 | Contract Viewer     | P1       | 3            | Sprint 1 |
| F04 | AI Risk Analyzer    | P1       | 8            | Sprint 2 |
| F05 | Risk Dashboard      | P1       | 5            | Sprint 2 |
| F06 | Citation Viewer     | P1       | 3            | Sprint 2 |
| F07 | Contract Search     | P2       | 3            | Sprint 3 |
| F08 | Section Navigation  | P2       | 2            | Sprint 3 |
| F09 | User Registration   | P3       | 3            | Sprint 3 |
| F10 | User Authentication | P3       | 3            | Sprint 3 |

---

# MVP Scope

## Included in MVP

### Sprint 1

* F01 PDF Upload
* F02 Text Extraction
* F03 Contract Viewer

### Sprint 2

* F04 AI Risk Analyzer
* F05 Risk Dashboard
* F06 Citation Viewer

These features provide the minimum functionality needed to demonstrate the product vision.

---

# Post-MVP Features

The following features are planned after MVP completion:

* F07 Contract Search
* F08 Section Navigation
* F09 User Registration
* F10 User Authentication

These features improve usability and scalability but are not essential for validating the product concept.

---

# Backlog Prioritization Strategy

## P1 - Must Have

Features required for the MVP to function.

Examples:

* Uploading contracts
* Viewing contracts
* Risk analysis
* Risk verification

---

## P2 - Should Have

Features that improve user experience but are not essential for MVP validation.

Examples:

* Search
* Navigation

---

## P3 - Could Have

Features that support long-term growth and account management.

Examples:

* Registration
* Authentication

---

# Sprint Goals

## Sprint 1 Goal

Enable users to upload and view contract content.

Deliverables:

* PDF Upload
* Text Extraction
* Contract Viewer

---

## Sprint 2 Goal

Enable users to identify and verify contract risks.

Deliverables:

* AI Risk Analyzer
* Risk Dashboard
* Citation Viewer

---

## Sprint 3 Goal

Improve usability and account management.

Deliverables:

* Search
* Navigation
* Authentication

---

# Definition of Done

A backlog item is considered complete when:

* Functional requirements are implemented.
* Code is reviewed.
* Basic testing is completed.
* Documentation is updated.
* Feature is demonstrated successfully.

---

# Final MVP Deliverable

By the end of the project, LegalLens AI should allow users to:

1. Upload a contract.
2. Read extracted contract content.
3. Analyze potential risks.
4. Review risk severity.
5. Verify findings using source citations.

This represents the smallest version of the product capable of delivering meaningful value to users.
