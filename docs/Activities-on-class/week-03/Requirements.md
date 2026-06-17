# Step 05 - Requirements

# Purpose

This document defines the primary scenarios, epics, and user stories for the LegalLens AI MVP.

The requirements focus on solving the core problem: helping users understand contracts before signing them.

---

# Scenarios

## Scenario 1: Rental Contract Review

### Actor

Student Tenant

### Goal

Understand potential risks before signing a rental agreement.

### Flow

1. User receives a rental contract.
2. User uploads the PDF.
3. System extracts contract content.
4. User starts risk analysis.
5. System identifies risky clauses.
6. User reviews explanations and citations.
7. User reads original clauses.
8. User decides whether to proceed.

### Expected Outcome

The user understands important risks before signing.

---

## Scenario 2: Employment Contract Review

### Actor

Employee

### Goal

Understand restrictions and obligations within an employment contract.

### Flow

1. User uploads employment contract.
2. System processes the document.
3. Risk analysis highlights important clauses.
4. User reviews findings.
5. User verifies citations.

### Expected Outcome

The user understands contractual obligations before accepting employment.

---

## Scenario 3: Freelancer Agreement Review

### Actor

Freelancer

### Goal

Identify financial and liability risks.

### Flow

1. User uploads service agreement.
2. System analyzes contract content.
3. Risk analyzer highlights concerning clauses.
4. User reviews findings and citations.

### Expected Outcome

The user gains a better understanding of potential risks.

---

# Epics

## Epic 1: Contract Management

Users can upload and review contracts.

### Business Value

Provides the foundation for all contract analysis activities.

---

## Epic 2: Contract Exploration

Users can inspect and navigate contract content efficiently.

### Business Value

Improves contract readability and accessibility.

---

## Epic 3: Risk Analysis

Users can identify potentially risky clauses.

### Business Value

Helps users focus on important sections quickly.

---

## Epic 4: Evidence and Transparency

Users can verify analysis results.

### Business Value

Builds trust in the system.

---

## Epic 5: User Security

Users can securely manage personal contracts.

### Business Value

Protects user privacy and document access.

---

# User Stories

## Epic 1: Contract Management

### US-01 Upload Contract

As a user,

I want to upload a PDF contract,

so that I can analyze it.

Priority: High

AI Involved: No

---

### US-02 View Uploaded Contract

As a user,

I want to view extracted contract content,

so that I can review the document.

Priority: High

AI Involved: No

---

## Epic 2: Contract Exploration

### US-03 Search Contract Content

As a user,

I want to search keywords inside a contract,

so that I can quickly find relevant clauses.

Priority: Medium

AI Involved: No

---

### US-04 Navigate Contract Sections

As a user,

I want to browse contract sections easily,

so that I can understand document structure.

Priority: Medium

AI Involved: No

---

## Epic 3: Risk Analysis

### US-05 Analyze Contract Risks

As a user,

I want the system to identify potentially risky clauses,

so that I can focus on important sections.

Priority: High

AI Involved: Yes

---

### US-06 View Risk Severity

As a user,

I want risks categorized by severity,

so that I can prioritize my attention.

Priority: High

AI Involved: Yes

---

## Epic 4: Evidence and Transparency

### US-07 View Supporting Citations

As a user,

I want every risk finding linked to original clauses,

so that I can verify the analysis.

Priority: High

AI Involved: Yes

---

### US-08 Review Original Contract Clause

As a user,

I want to open the cited clause,

so that I can understand the context.

Priority: High

AI Involved: No

---

## Epic 5: User Security

### US-09 Register Account

As a user,

I want to create an account,

so that I can save my contracts.

Priority: Medium

AI Involved: No

---

### US-10 Login Securely

As a user,

I want secure authentication,

so that only I can access my documents.

Priority: Medium

AI Involved: No

---

# MVP User Stories

The MVP will focus on the following stories:

* US-01 Upload Contract
* US-02 View Uploaded Contract
* US-05 Analyze Contract Risks
* US-06 View Risk Severity
* US-07 View Supporting Citations
* US-08 Review Original Contract Clause

These stories directly support the primary value proposition of the product.

---

# Non-MVP User Stories

The following stories may be implemented later:

* US-03 Search Contract Content
* US-04 Navigate Contract Sections
* US-09 Register Account
* US-10 Login Securely

These features improve usability but are not required for demonstrating the core MVP.
