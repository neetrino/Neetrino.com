# 33 — Content Operations Master Workflow

## Table of contents

1. Role of this file
2. Core operating principle
3. Scope
4. Required distinctions
5. Authority hierarchy
6. Canonical reference map
7. Operating lifecycle
8. Work classes
9. Risk levels
10. Roles and accountability
11. Separation of duties
12. Intake gate
13. Request record
14. Triage and routing
15. Discovery and business context
16. Audience, intent, and journey
17. Keyword and topic research
18. SERP, competitor, and evidence discovery
19. Gap, cluster, and page-role decision
20. Briefing gate
21. Outline and information architecture
22. Research and evidence gate
23. Drafting and editorial production
24. SEO optimization
25. Translation and localization
26. QA, review, and approval
27. Publishing implementation
28. Release and production validation
29. Measurement handoff
30. Maintenance and refresh cycle
31. Workflow variants
32. Status model
33. Stage-entry and stage-exit contracts
34. Required records and artifact chain
35. Version and source-of-truth control
36. Change control
37. Dependency and blocker management
38. Handoff protocol
39. Service-level expectations
40. Communication and decision records
41. Batch and campaign operations
42. Multilingual operations
43. High-risk and regulated content
44. Emergency workflow
45. AI-assisted operations
46. Automation boundaries
47. Tool and platform neutrality
48. Metrics and operational health
49. Quality and throughput balance
50. Governance and auditability
51. Exceptions and escalation
52. Anti-patterns
53. Master workflow record
54. Stage-gate checklist
55. Operational quality score
56. Definition of done
57. Relationship to other canonical references
58. Final governing rule

---

## 1. Role of this file

This file is the canonical operating map for the complete Neetrino content system.

It determines:

- which workflow applies to a request;
- which canonical reference governs each stage;
- what must exist before work begins;
- what each stage must produce;
- who owns, reviews, approves, implements, and validates the work;
- which gates may block progression;
- how versions, changes, exceptions, and evidence are recorded;
- how a production result returns to measurement, maintenance, and future planning.

This file coordinates the system. It does not replace the detailed standards inside the referenced files.

When this file and a specialist reference appear to overlap, this file governs routing, stage order, ownership, and handoffs; the specialist reference governs the quality and execution rules within its domain.

## 2. Core operating principle

Content is not complete when text has been written. It is complete only when the correct, approved version has been implemented, verified in production, assigned an owner, and connected to measurement and maintenance.

Every material deliverable must move through an explicit chain:

`request → decision → research → brief → structure → draft → evidence → optimization → localization → QA → approval → implementation → publication → production validation → measurement → maintenance`

The chain may be shortened only by an authorized workflow variant. It may not be shortened by silently omitting controls.

## 3. Scope

This workflow applies to:

- website pages;
- service and solution pages;
- landing pages;
- articles and knowledge-base content;
- comparison, alternative, and decision-support pages;
- case studies;
- technical and instructional content;
- campaign content with a durable web destination;
- multilingual content in Armenian, English, and Russian;
- new content, refreshes, migrations, consolidations, and retirements;
- content created by people, AI-assisted systems, agencies, or mixed teams.

It also governs supporting artifacts such as briefs, outlines, evidence records, translation records, QA records, field maps, and production-validation records.

Purely ephemeral social content may use a format-specific system, but any claims, brand facts, offers, links, or destination pages remain subject to the applicable canonical references.

## 4. Required distinctions

### 4.1 Request

A stated need. A request is not yet an approved content assignment.

### 4.2 Work item

A uniquely identified unit of content operations with a defined owner, scope, state, risk, and artifact chain.

### 4.3 Stage

A bounded part of the workflow with explicit entry conditions, activities, outputs, and exit criteria.

### 4.4 Gate

A decision point that prevents progression until defined conditions are satisfied or an authorized exception is recorded.

### 4.5 Handoff

The controlled transfer of an approved artifact, responsibility, and unresolved context from one owner or stage to another.

### 4.6 Review

Evaluation against specified requirements. Review does not itself grant publication authority.

### 4.7 Approval

An accountable decision that a specific version may proceed to the next controlled stage.

### 4.8 Implementation

Placement and configuration of approved content in its delivery environment.

### 4.9 Production validation

Evidence that the live result matches the approved and implemented package and functions as intended.

### 4.10 Maintenance

Ongoing ownership of accuracy, relevance, performance, technical integrity, and lifecycle decisions after publication.

### 4.11 Workflow variant

An approved path that changes required depth or sequence without removing necessary accountability.

### 4.12 Exception

A documented, authorized departure from a default requirement, including reason, risk, compensating control, owner, and expiry.

## 5. Authority hierarchy

Apply requirements in this order:

1. law, regulation, contract, privacy, security, and platform constraints;
2. verified company facts, approved service knowledge, and current business decisions;
3. approved project scope and accountable-owner decisions;
4. this master workflow for routing, gates, and handoffs;
5. specialist canonical references for execution quality;
6. approved brief, outline, records, and version-specific decisions;
7. tool defaults, templates, and individual preferences.

Lower authority may not silently override higher authority.

If two same-level sources conflict, stop the affected decision, identify the accountable owner, record the resolution, and update the stale source where appropriate.

## 6. Canonical reference map

| Stage or decision | Primary canonical reference | Required outcome |
| --- | --- | --- |
| System routing | `00_SYSTEM_OVERVIEW.md` and this file | Correct work class and reference path |
| Global content and SEO constraints | `01_GLOBAL_CONTENT_AND_SEO_RULES.md` | Non-negotiable system rules applied |
| Output packaging | `02_OUTPUT_STANDARDS.md`, `03_OUTPUT_TEMPLATES.md` | Correct deliverable form |
| Brand and company facts | `10_NEETRINO_BRAND_PROFILE.md` | Approved identity and claims |
| Website and conversion role | `11_WEBSITE_CONTENT_AND_CONVERSION_GOALS.md` | Page purpose and desired action |
| Services and capabilities | `12_NEETRINO_SERVICES_KNOWLEDGE.md` | Accurate service representation |
| Audience | `20_AUDIENCE_AND_BUYER_PERSONAS.md` | Defined primary reader |
| Intent and journey | `21_SEARCH_INTENT_AND_CUSTOMER_JOURNEY.md` | Intent and journey stage locked |
| Keyword and topic selection | `22_KEYWORD_RESEARCH_AND_TOPIC_SELECTION.md` | Search target and topic decision |
| SERP and competitor research | `23_SERP_ANALYSIS_AND_COMPETITOR_RESEARCH.md` | Current search-landscape evidence |
| Gap and cluster strategy | `24_CONTENT_GAP_AND_CLUSTER_STRATEGY.md` | Page role and portfolio fit |
| Brief and page plan | `25_CONTENT_BRIEF_AND_PAGE_PLANNING.md` | Approved brief contract |
| Outline and architecture | `26_CONTENT_OUTLINE_AND_INFORMATION_ARCHITECTURE.md` | Approved structural contract |
| Writing and editing | `27_CONTENT_WRITING_AND_EDITORIAL_STANDARDS.md` | Editorially complete draft |
| On-page optimization | `28_ON_PAGE_SEO_AND_CONTENT_OPTIMIZATION.md` | Search-aligned publication package |
| Evidence and fact-checking | `29_EVIDENCE_EEAT_AND_FACT_CHECKING.md` | Verified claims and evidence record |
| Translation and localization | `30_MULTILINGUAL_TRANSLATION_AND_LOCALIZATION_STANDARDS.md` | Reconciled locale versions |
| QA and approval | `31_CONTENT_QA_REVIEW_AND_APPROVAL.md` | Version-specific approval |
| Publishing and validation | `32_CONTENT_PUBLISHING_IMPLEMENTATION_AND_VALIDATION.md` | Production-verified release |

Supporting domain or format files may add requirements. They may not weaken the controls above.

## 7. Operating lifecycle

The standard lifecycle has fifteen controlled stages:

1. Intake
2. Triage
3. Context discovery
4. Audience and intent definition
5. Search and market research
6. Portfolio and page decision
7. Briefing
8. Outlining
9. Research and evidence completion
10. Drafting and editing
11. Optimization and localization
12. QA and approval
13. Implementation and release
14. Production validation
15. Measurement and maintenance

Stages may overlap operationally only when dependencies are explicit and rework risk is accepted by the accountable owner. A downstream artifact cannot receive final approval while a material upstream dependency remains unresolved.

## 8. Work classes

Every work item must be classified before assignment:

| Code | Work class | Typical result |
| --- | --- | --- |
| `W1` | Create | New canonical page or content asset |
| `W2` | Refresh | Existing URL updated without changing its primary role |
| `W3` | Reposition | Existing page changes intent, audience, or primary promise |
| `W4` | Localize | Approved source adapted for another locale |
| `W5` | Optimize | Search, conversion, clarity, or usability improvements |
| `W6` | Merge | Multiple assets consolidated into one canonical owner |
| `W7` | Split | One asset divided into distinct page roles |
| `W8` | Migrate | Content or URLs moved between systems, domains, or structures |
| `W9` | Correct | Published error, defect, or compliance problem repaired |
| `W10` | Retire | Content archived, redirected, unpublished, or deleted by policy |

Mixed work must identify one primary class and any secondary classes.

## 9. Risk levels

Assign an operations risk level at triage:

| Level | Description | Minimum control |
| --- | --- | --- |
| `R0` | Cosmetic, non-material change | Owner self-check and implementation validation |
| `R1` | Low-risk standard content | Lean or standard workflow |
| `R2` | Material business, SEO, or conversion content | Standard workflow with specialist review |
| `R3` | High-impact technical, financial, legal-adjacent, security, privacy, or migration content | Extended workflow and independent specialist approval |
| `R4` | Regulated, safety-critical, contractual, or severe incident content | Named accountable authority, domain review, strict evidence, and controlled release |

Risk is determined by potential harm, reversibility, audience reach, claim sensitivity, search impact, commercial impact, privacy exposure, and technical complexity—not by word count.

Risk may increase at any stage. A higher classification applies immediately to remaining work and may require re-review of completed stages.

## 10. Roles and accountability

One person may hold several roles when risk permits, but every role must be explicit.

- **Requester:** states the need and supplies initial context.
- **Content operations owner:** owns routing, workflow state, dependencies, and completion.
- **Business owner:** confirms business objective, offer, priorities, and material company facts.
- **Strategist:** owns audience, intent, topic, portfolio, and page-role decisions.
- **Researcher:** gathers current search, competitor, domain, and source evidence.
- **Brief owner:** converts approved decisions into the production contract.
- **Writer:** produces content within the approved contract.
- **Editor:** improves argument, clarity, voice, structure, and correctness.
- **Fact-checker or domain reviewer:** validates material claims and domain meaning.
- **SEO reviewer:** validates search alignment and on-page decisions.
- **Language reviewer:** validates target-language quality and cross-language equivalence.
- **Approver:** authorizes a specific package to proceed.
- **Implementer:** configures the approved package in the publishing environment.
- **Release owner:** authorizes and coordinates production release.
- **Production validator:** verifies the live result.
- **Performance owner:** monitors outcomes and initiates lifecycle decisions.
- **Maintenance owner:** remains accountable for freshness and future correction.

## 11. Separation of duties

For `R2–R4` work:

- the creator may not be the only final reviewer;
- the implementer may not approve an unrecorded deviation from approved content;
- the production validator should be different from the implementer when practical;
- legal, privacy, security, or regulated approvals must come from the designated authority;
- approval must not be granted to an unspecified or moving version.

For `R0–R1`, roles may be combined, but the identity of the responsible person and the validation evidence must remain recorded.

## 12. Intake gate

No work item enters production planning without:

- a stated business need or problem;
- a requested outcome;
- a known requester;
- an initial audience or acknowledged audience gap;
- a target asset, channel, or page type;
- relevant deadline or timing constraint;
- known languages and markets;
- known dependencies and supplied source material;
- an initial risk screen.

Missing information must be requested, explicitly assumed, or recorded as a blocker. It must not disappear into the writer's imagination.

## 13. Request record

The request record must contain:

```markdown
# Content Request

- Work-item ID:
- Request title:
- Requester:
- Date received:
- Business owner:
- Requested outcome:
- Business problem:
- Target asset or URL:
- Primary market and locale:
- Additional locales:
- Intended audience:
- Desired action:
- Deadline and reason:
- Supplied sources and assets:
- Known constraints:
- Known claims or approvals required:
- Initial work class:
- Initial risk level:
- Open questions:
- Intake decision: ACCEPT / CLARIFY / HOLD / REJECT / DUPLICATE
```

## 14. Triage and routing

Triage must decide:

1. whether the request belongs in the content system;
2. whether an existing asset already owns the need;
3. whether the correct action is create, refresh, reposition, localize, optimize, merge, split, migrate, correct, or retire;
4. which canonical references are mandatory;
5. the risk level and required review depth;
6. who owns the next decision;
7. whether the deadline is compatible with required controls.

Duplicate or competing requests must be reconciled before parallel production begins.

## 15. Discovery and business context

Before search strategy or drafting:

- confirm the business objective;
- confirm the relevant service, product, capability, limitation, and offer;
- identify current approved company facts;
- identify unavailable, disputed, confidential, or outdated information;
- distinguish what Neetrino knows, believes, offers, has experienced, and can prove;
- record stakeholder assumptions that require confirmation.

Business context is complete when a writer can accurately state what the page may promise and what it must not imply.

## 16. Audience, intent, and journey

Define:

- one primary reader;
- relevant secondary readers;
- excluded readers where necessary;
- reader awareness and prior knowledge;
- primary problem or decision;
- primary search or non-search intent;
- journey stage;
- objections, risks, and desired next action;
- the change the content should create in understanding or behavior.

A page for everyone has not completed this stage.

## 17. Keyword and topic research

When search discovery is relevant:

- establish locale-specific demand;
- separate topic, keyword, entity, question, and intent;
- identify primary and supporting query clusters;
- evaluate business relevance and realistic authority;
- record uncertainty and tool/date context;
- avoid translating keyword lists between locales without target-market research.

The output is a topic decision, not a pile of keywords.

## 18. SERP, competitor, and evidence discovery

Research must determine:

- what current results satisfy;
- dominant page types and intent patterns;
- information users receive and still lack;
- relevant competitors and non-commercial authorities;
- evidence availability and freshness;
- claims that require primary or specialist sources;
- opportunities for genuine information gain.

Research snapshots must include market, locale, date, and material limitations.

## 19. Gap, cluster, and page-role decision

Before briefing, decide:

- whether the asset belongs in the content portfolio;
- its canonical page role;
- parent, child, sibling, and internal-link relationships;
- whether another page already owns the same intent;
- create, update, merge, split, or retire implications;
- the distinct value the page will add.

Cannibalization and duplication are planning failures, not post-publication surprises.

## 20. Briefing gate

The brief may be approved only when it defines:

- page identity and action;
- audience, intent, journey, and reader state;
- page promise, thesis, and primary answer;
- must-cover, should-cover, may-cover, and excluded scope;
- differentiation and information gain;
- evidence and claim plan;
- search, internal-link, conversion, and CTA plan;
- localization, design, technical, and measurement requirements;
- owners, dependencies, acceptance criteria, and change rules.

The approved brief becomes the production contract.

## 21. Outline and information architecture

The outline must convert the brief into a reader path with:

- answer-first opening logic where appropriate;
- section contracts rather than heading labels alone;
- complete scope coverage;
- evidence placement;
- component, table, list, media, and interaction decisions;
- progressive disclosure;
- conversion and internal-link placement;
- mobile, accessibility, and multilingual considerations;
- explicit dependencies and unresolved questions.

Final drafting should not begin while the structural contract has material gaps.

## 22. Research and evidence gate

Before material claims are finalized:

- create or update the claim inventory;
- assign risk and evidence requirements;
- inspect the actual sources;
- verify dates, jurisdictions, versions, calculations, and attribution;
- separate fact, inference, opinion, estimate, and example;
- resolve contradictions or disclose uncertainty;
- record sources that may expire or require maintenance.

Unsupported claims must be removed, narrowed, qualified, or blocked.

## 23. Drafting and editorial production

Drafting must follow the approved brief and outline while preserving appropriate editorial judgment.

Required production passes:

1. promise and scope;
2. argument and completeness;
3. evidence and claim discipline;
4. reader and brand voice;
5. clarity and line editing;
6. search and answer extraction;
7. terminology, copyediting, and localization readiness;
8. final proof against the current source-of-truth package.

Material departures from the brief require change control, not quiet improvisation.

## 24. SEO optimization

Optimization must validate:

- intent and canonical ownership;
- title, H1, slug, metadata, and opening alignment;
- semantic and entity coverage;
- information gain and answer usefulness;
- internal and external links;
- media, structured components, and schema eligibility;
- canonical, robots, indexation, and localization requirements;
- conversion alignment without keyword distortion.

Optimization may improve delivery. It may not falsify claims, weaken readability, or change business meaning without authorization.

## 25. Translation and localization

Localization begins from an approved or explicitly frozen source version.

Each locale must preserve:

- meaning, certainty, evidence, and legal effect;
- brand voice and reader intent;
- CTA and conversion purpose;
- protected identifiers, variables, links, and data;
- locale-specific terminology, SEO intent, formats, and cultural fit.

All locale versions must be reconciled after material source changes. A translated page is a governed version, not a detached derivative.

## 26. QA, review, and approval

QA must evaluate the complete publication package against its brief, specialist standards, and acceptance criteria.

Approval requires:

- all required reviews completed;
- publication blockers closed;
- material issues resolved with evidence;
- exceptions authorized and recorded;
- the approved version uniquely identified;
- implementation instructions and dependencies included;
- approval authority and timestamp recorded.

`REVIEWED`, `APPROVED`, `IMPLEMENTED`, and `PRODUCTION_VERIFIED` are separate states.

## 27. Publishing implementation

Implementation begins only from an approved package.

The implementer must preserve:

- visible copy and semantic structure;
- URL, locale, and routing decisions;
- metadata, canonical, robots, hreflang, and schema;
- links, redirects, media, alt text, and files;
- forms, CTAs, interactions, analytics, and consent controls;
- authorship, citations, disclosures, and trust fields.

Any material deviation must be returned for authorization before release.

## 28. Release and production validation

Release requires:

- staging acceptance where applicable;
- named release and rollback owners;
- timing and dependency confirmation;
- pre-publication validation passed;
- recovery method available for material-risk work.

After release, verify the live result, not merely the CMS preview. Production validation includes content, routes, metadata, indexation controls, locale relationships, assets, interactions, analytics, performance-sensitive behavior, and search/social previews as applicable.

## 29. Measurement handoff

Every durable production asset must leave publishing with:

- baseline or acknowledged absence of baseline;
- primary success metric;
- supporting and guardrail metrics;
- analytics and event ownership;
- observation window;
- reporting cadence;
- expected leading and lagging signals;
- decision thresholds where known;
- performance owner and review date.

Publication without measurement ownership is an unfinished operational handoff.

## 30. Maintenance and refresh cycle

Maintenance must monitor:

- factual and source freshness;
- service, product, pricing, legal, technical, and personnel changes;
- search intent and result shifts;
- traffic, engagement, conversion, and assisted outcomes;
- broken links, media, forms, schema, and locale relationships;
- overlap, decay, and portfolio redundancy;
- user feedback, support questions, and sales objections.

Maintenance decisions are:

`KEEP / MONITOR / REFRESH / REOPTIMIZE / REPOSITION / MERGE / SPLIT / MIGRATE / CORRECT / RETIRE`

Any decision other than `KEEP` or `MONITOR` creates a new controlled work item or version.

## 31. Workflow variants

### 31.1 Lean workflow

Allowed for `R0–R1` changes with stable facts, no new material claims, no URL or intent change, and low reversibility cost.

Minimum stages: intake, triage, edit, self-check, required specialist check, implementation, production validation, record update.

### 31.2 Standard workflow

Default for new or materially updated business content. Uses all relevant stages and independent review.

### 31.3 Extended workflow

Required for `R3–R4`, migrations, major repositioning, regulated topics, high-impact claims, or complex multilingual releases.

Adds formal evidence review, named authorities, recovery planning, stricter separation of duties, and documented observation.

### 31.4 Localization-only workflow

Allowed when the source package is current and approved, page role is unchanged, and target-locale research requirements are known. It still requires locale SEO, linguistic/domain review, implementation, and production validation.

### 31.5 Correction workflow

Prioritizes risk containment, accurate correction, affected-locale reconciliation, transparency where required, and post-fix verification.

### 31.6 Retirement workflow

Requires traffic, link, legal-retention, redirect, archive, analytics, and dependent-content decisions before removal.

## 32. Status model

Use only defined states:

`REQUESTED → TRIAGED → DISCOVERY → PLANNED → BRIEF_APPROVED → OUTLINE_APPROVED → IN_PRODUCTION → SPECIALIST_REVIEW → QA → APPROVED → IMPLEMENTING → STAGING_VALIDATED → RELEASE_READY → PUBLISHED → PRODUCTION_VERIFIED → MONITORING → MAINTENANCE`

Terminal or control states:

`BLOCKED / ON_HOLD / RETURNED / REJECTED / CANCELLED / ROLLED_BACK / UNPUBLISHED / RETIRED`

Rules:

- state changes require an owner and timestamp;
- `BLOCKED` requires a blocker, resolution owner, and next review point;
- `RETURNED` requires the stage and reason;
- `APPROVED` identifies the exact approved version;
- `PUBLISHED` does not imply `PRODUCTION_VERIFIED`;
- `MAINTENANCE` does not mean ownership has ended.

## 33. Stage-entry and stage-exit contracts

Each stage must declare:

| Contract field | Requirement |
| --- | --- |
| Entry inputs | Named artifacts and versions required to start |
| Entry authority | Person or state permitting entry |
| Stage owner | One accountable operational owner |
| Activities | Work governed by the applicable specialist reference |
| Output | Named artifact, decision, or validated state |
| Exit criteria | Objective conditions for completion |
| Review | Required reviewer or self-check |
| Handoff target | Next owner or stage |
| Open items | Explicit non-blocking issues carried forward |
| Blockers | Unresolved issues preventing exit |

No stage is complete because someone says it is “basically done.”

## 34. Required records and artifact chain

The artifact chain must be sufficient to reconstruct why the live result exists in its current form.

Depending on scope and risk, it includes:

1. request record;
2. triage and routing decision;
3. research and source records;
4. topic, cluster, and page-role decision;
5. approved content brief;
6. approved outline record;
7. draft and editorial change history;
8. claim inventory and evidence records;
9. optimization record;
10. translation and localization records;
11. QA issues and approval record;
12. publication package manifest;
13. field map and implementation record;
14. release and production-validation record;
15. measurement and maintenance record.

Lean workflows may combine records, but required decisions and accountability must remain identifiable.

## 35. Version and source-of-truth control

Every material artifact must include:

- work-item ID;
- content or page ID;
- locale;
- version identifier;
- status;
- owner;
- last material update;
- upstream source version;
- approval state where applicable.

Rules:

- one version is the current production source of truth per locale and target;
- approval attaches to content bytes or an equivalent immutable version, not a filename alone;
- later edits invalidate approval according to change severity;
- translations identify their source version;
- implementation identifies the approved package version;
- production validation identifies the deployed version and live URL.

## 36. Change control

Classify changes:

| Level | Change | Required action |
| --- | --- | --- |
| `C0` | Formatting with no rendered or semantic effect | Record if needed; no re-approval |
| `C1` | Minor wording or presentation | Owner check and affected validation |
| `C2` | Material editorial, SEO, CTA, evidence, or locale change | Targeted specialist re-review and approval |
| `C3` | Audience, intent, scope, claim, offer, URL, template, or data-flow change | Return to affected upstream stage and full dependent review |
| `C4` | Legal, privacy, security, regulated, contractual, or severe-risk change | Stop release; named authority and extended workflow |

The highest affected dimension determines the change level.

## 37. Dependency and blocker management

A blocker record must include:

- blocker ID and description;
- affected stage and artifact;
- severity and risk;
- blocking owner;
- resolution owner;
- required decision or evidence;
- date identified;
- target resolution date;
- workaround, if any;
- status and closure evidence.

Non-blocking open items may move forward only when their downstream effect is understood and an owner accepts them.

## 38. Handoff protocol

Every material handoff must include:

- work-item and artifact identity;
- exact current version and state;
- completed exit criteria;
- required next action;
- applicable canonical references;
- accepted assumptions;
- unresolved non-blocking items;
- blockers and dependencies;
- protected elements that must not change;
- responsible sender and receiver;
- acceptance timestamp.

The receiver must confirm completeness or return the package. Silence is not acceptance.

## 39. Service-level expectations

Workflow timing must be defined by risk and business need, not a universal arbitrary deadline.

Each work item should record:

- priority;
- requested date;
- committed date;
- review response window;
- blocker response owner;
- approval validity window where relevant;
- production observation window;
- maintenance review date.

When time is insufficient for required controls, reduce scope, change the release plan, or invoke an authorized emergency workflow. Do not counterfeit completeness.

## 40. Communication and decision records

Record decisions when they alter:

- audience, intent, page role, or scope;
- claims, evidence, certainty, or attribution;
- offer, CTA, pricing, or commercial meaning;
- URL, canonical ownership, redirects, or indexation;
- locale strategy or source-of-truth language;
- review requirements or accepted risk;
- implementation behavior;
- publication, rollback, correction, or retirement.

Decision records must state the decision, reason, authority, evidence, affected artifacts, date, and follow-up.

## 41. Batch and campaign operations

Batch work requires:

- a batch definition and shared invariant set;
- item-level IDs and states;
- a representative pilot before scale when risk is material;
- reusable field mapping and validation rules;
- exception detection rather than blind template application;
- item-level claim, locale, URL, and production validation where those differ;
- controlled rollout and stop criteria;
- batch summary plus item-level traceability.

One approved template does not approve every populated claim.

## 42. Multilingual operations

For HY–EN–RU production:

- identify the source-of-truth language and version;
- define whether release is simultaneous or staggered;
- assign locale owners and reviewers;
- conduct locale-specific keyword and SERP work when search is relevant;
- maintain shared protected facts and terminology;
- reconcile claims, links, CTA intent, metadata, and dates;
- validate hreflang, alternates, canonicals, routing, and language discovery;
- propagate material corrections to all affected locales;
- record intentionally non-equivalent market adaptations.

No locale may silently become stale while continuing to appear current.

## 43. High-risk and regulated content

`R3–R4` work additionally requires:

- named domain and accountable authorities;
- primary-source preference and jurisdiction/version control;
- explicit claim inventory;
- privacy and confidential-data review;
- legal, security, financial, medical, or regulatory review as applicable;
- stricter change and approval expiry rules;
- release, rollback, and correction plans;
- post-publication monitoring and escalation contacts.

AI or editorial confidence cannot substitute for professional authority.

## 44. Emergency workflow

Emergency handling is allowed only when delay creates greater risk than controlled acceleration.

Required minimum:

1. incident or urgency owner;
2. defined affected audience and harm;
3. smallest safe scope;
4. essential fact and authority check;
5. explicit approval for the emergency version;
6. controlled implementation and live validation;
7. visible correction or disclosure where required;
8. retrospective review and permanent replacement deadline.

Emergency publication is temporary controlled debt, not permission to abandon records.

## 45. AI-assisted operations

AI may assist with:

- classification and routing suggestions;
- research organization and source extraction;
- outline and draft alternatives;
- terminology and consistency checks;
- claim extraction and issue detection;
- translation drafts;
- metadata and schema drafts;
- checklist execution and comparison;
- performance pattern exploration.

AI may not independently:

- approve facts, legal meaning, or regulated claims;
- invent company experience, evidence, clients, results, or citations;
- grant final approval;
- authorize material deviations;
- publish or alter production without assigned authority;
- resolve ambiguity by hiding it;
- treat generated confidence as verification.

AI output inherits the review requirements of the content it affects.

## 46. Automation boundaries

Automation is appropriate for repeatable, observable, and reversible tasks such as:

- status transitions after validated events;
- required-field checks;
- version and locale comparison;
- broken-link and metadata checks;
- reminders for review, approval expiry, or content freshness;
- analytics collection and anomaly flags;
- batch record generation.

Automation must not silently decide material meaning, evidence fitness, legal risk, brand promises, or final approval.

Every automated mutation must have an owner, log, failure state, and recovery method.

## 47. Tool and platform neutrality

The workflow is independent of CMS, project-management, analytics, translation, and AI tools.

Tool configuration must support the workflow's required identities, states, records, permissions, approvals, and audit trail. If a tool cannot represent a required control, use an adjacent authoritative record or change the implementation; do not remove the control to fit the tool.

## 48. Metrics and operational health

Track at least:

- intake-to-triage time;
- cycle time by work class and risk;
- time spent blocked;
- first-pass brief, outline, QA, and production-validation acceptance rates;
- issue counts by type, severity, and stage detected;
- rework caused by upstream ambiguity;
- approval-to-publication time;
- implementation deviations;
- post-publication defects and rollback rate;
- stale-content rate;
- refresh completion rate;
- performance outcomes by content role.

Metrics diagnose the system. They must not reward rushed approvals, shallow reviews, unnecessary output volume, or hidden defects.

## 49. Quality and throughput balance

Operational optimization follows this order:

1. remove unnecessary waiting and duplicate work;
2. clarify decisions and inputs earlier;
3. reuse approved structures, terminology, and records;
4. automate deterministic checks;
5. scale review depth by risk;
6. preserve human judgment where meaning or harm is material.

Skipping evidence or approval is not throughput improvement. It is deferred failure with better calendar optics.

## 50. Governance and auditability

The system must be able to answer:

- who requested the work;
- why it was created or changed;
- which sources and decisions governed it;
- which version was reviewed and approved;
- who made and accepted material changes;
- what was implemented and released;
- whether production was verified;
- who owns measurement and maintenance;
- how errors and exceptions were resolved.

Retention depth must match legal, contractual, operational, and risk requirements.

## 51. Exceptions and escalation

An exception record requires:

```markdown
# Workflow Exception

- Exception ID:
- Work-item ID:
- Requirement affected:
- Requested deviation:
- Business reason:
- Risk created:
- Compensating control:
- Affected artifacts and locales:
- Exception owner:
- Approving authority:
- Effective date:
- Expiry or review date:
- Closure requirement:
- Decision: APPROVED / REJECTED / EXPIRED / CLOSED
```

Escalate when:

- authority is unclear;
- material facts conflict;
- evidence is insufficient;
- risk exceeds the assigned workflow;
- deadline conflicts with mandatory control;
- stakeholder preference contradicts audience, legal, security, or factual requirements;
- production behavior differs materially from the approved package.

## 52. Anti-patterns

Prohibited operating patterns include:

- drafting before deciding the page role;
- using a keyword list as a brief;
- treating an outline as optional for complex content;
- adding evidence after claims are already locked;
- translating an unapproved or moving source;
- letting each locale invent different facts;
- combining review and approval into “looks good”;
- approving filenames instead of versions;
- allowing the implementer to rewrite approved meaning silently;
- treating staging as proof of production;
- publishing without production validation;
- measuring only traffic when the page has a business purpose;
- leaving published content without an owner or review trigger;
- hiding blockers in chat threads;
- using urgency to erase accountability;
- using AI output as evidence;
- applying a batch template without item-level exception checks;
- calling work complete because the text file exists.

## 53. Master workflow record

```markdown
# Content Operations Record

## 1. Identity

- Work-item ID:
- Title:
- Primary work class:
- Secondary work classes:
- Content/page ID:
- Target URL or asset:
- Primary locale:
- Additional locales:
- Risk level:
- Priority:

## 2. Ownership

- Requester:
- Content operations owner:
- Business owner:
- Strategist:
- Production owner:
- Approver:
- Implementation owner:
- Release owner:
- Performance owner:
- Maintenance owner:

## 3. Scope and decision

- Business objective:
- Primary audience:
- Intent and journey stage:
- Page role:
- Primary promise:
- Desired action:
- Included scope:
- Excluded scope:
- Dependencies:
- Constraints:

## 4. Required references

- Mandatory canonical files:
- Domain-specific files:
- Format-specific files:
- External authorities:

## 5. Stage control

| Stage | Owner | Input version | Status | Output version | Exit evidence | Date |
| --- | --- | --- | --- | --- | --- | --- |
| Intake | | | | | | |
| Triage | | | | | | |
| Discovery | | | | | | |
| Research | | | | | | |
| Brief | | | | | | |
| Outline | | | | | | |
| Evidence | | | | | | |
| Draft and edit | | | | | | |
| SEO | | | | | | |
| Localization | | | | | | |
| QA and approval | | | | | | |
| Implementation | | | | | | |
| Release | | | | | | |
| Production validation | | | | | | |
| Measurement handoff | | | | | | |

## 6. Versions

- Current working version:
- Approved package version:
- Implemented version:
- Production version:
- Source-of-truth locale/version:

## 7. Issues and exceptions

- Open blockers:
- Accepted non-blocking items:
- Exceptions:
- Material decisions:
- Required re-review triggers:

## 8. Production and maintenance

- Publication date:
- Production validation result:
- Baseline:
- Primary metric:
- Guardrail metrics:
- Observation window:
- Next review date:
- Freshness triggers:
- Final operational state:
```

## 54. Stage-gate checklist

### Intake and routing

- [ ] Business need and requested outcome are clear.
- [ ] Requester and accountable business owner are identified.
- [ ] Work class, risk, priority, locale, and target asset are assigned.
- [ ] Existing canonical ownership and duplication were checked.
- [ ] Required references and roles are selected.

### Strategy and research

- [ ] Audience, problem, intent, journey, and desired action are defined.
- [ ] Company facts and service claims use current approved sources.
- [ ] Search, competitor, and evidence research is current for the market.
- [ ] Page role, portfolio fit, and differentiation are decided.
- [ ] Material uncertainty and missing evidence are visible.

### Planning

- [ ] Brief contains scope, promise, evidence, SEO, conversion, locale, and acceptance criteria.
- [ ] Brief has an owner and approval state.
- [ ] Outline maps scope to a complete reader path.
- [ ] Evidence, components, internal links, and CTAs have planned locations.
- [ ] Material dependencies are resolved or formally carried.

### Production

- [ ] Draft follows the approved brief and outline.
- [ ] Material deviations passed change control.
- [ ] Claims, numbers, quotations, and company statements are verified.
- [ ] Editorial, brand, clarity, and accessibility standards are met.
- [ ] SEO improves discoverability without distorting meaning.

### Localization

- [ ] Source-of-truth version is frozen and identifiable.
- [ ] Target-locale terminology, search intent, and formats are correct.
- [ ] Meaning, certainty, evidence, CTA intent, and protected data are preserved.
- [ ] All locales are reconciled after material changes.
- [ ] Locale relationships and implementation requirements are documented.

### QA and approval

- [ ] Required reviewers are independent where risk requires it.
- [ ] All publication blockers are closed.
- [ ] Issues have severity, owner, resolution, and closure evidence.
- [ ] Exceptions are authorized, bounded, and recorded.
- [ ] Approval identifies the exact package version.

### Implementation and release

- [ ] Approved package, field mapping, and protected elements are complete.
- [ ] URLs, locales, metadata, canonicals, hreflang, schema, links, media, and interactions are implemented.
- [ ] Material deviations were returned for authorization.
- [ ] Staging and pre-release checks passed where required.
- [ ] Release and rollback owners are known.

### Production validation

- [ ] Live content matches the approved package.
- [ ] Routes, metadata, indexation controls, locale relations, forms, and analytics work.
- [ ] Defects are classified and resolved, accepted, or rolled back.
- [ ] Production verification is recorded separately from publication.
- [ ] Observation requirements are active.

### Measurement and maintenance

- [ ] Baseline, success metrics, guardrails, owner, and review window are assigned.
- [ ] Freshness and correction triggers are defined.
- [ ] Locale and dependent-page maintenance is included.
- [ ] Performance findings can create a new controlled work item.
- [ ] Final operational state and next review date are recorded.

## 55. Operational quality score

Score each dimension from `0` to `5`:

| Dimension | Question |
| --- | --- |
| Intake clarity | Was the actual business need understood? |
| Routing accuracy | Was the correct work class and workflow chosen? |
| Authority integrity | Were decisions made by the correct owners? |
| Audience and intent | Was the target reader and task specific? |
| Research fitness | Was research current, relevant, and market-specific? |
| Portfolio logic | Did the asset have a distinct canonical role? |
| Brief quality | Did the brief function as a complete contract? |
| Structural quality | Did the outline provide a coherent reader path? |
| Evidence integrity | Were material claims supportable and calibrated? |
| Editorial quality | Was the content clear, useful, accurate, and on-brand? |
| SEO alignment | Did optimization serve intent and canonical ownership? |
| Localization integrity | Were locale versions semantically and operationally sound? |
| QA depth | Did review match risk and close material issues? |
| Version control | Were source, approved, implemented, and live versions traceable? |
| Implementation fidelity | Did the environment preserve the approved package? |
| Release control | Were dependencies, recovery, and timing managed? |
| Production validation | Was the live result actually verified? |
| Measurement readiness | Were outcomes observable and owned? |
| Maintenance readiness | Were freshness and lifecycle controls assigned? |
| Auditability | Can the decision and artifact chain be reconstructed? |

Maximum score: `100`.

Interpretation:

- `90–100`: operationally excellent;
- `80–89`: ready with minor improvement opportunities;
- `70–79`: conditionally acceptable only if no blocker exists;
- `60–69`: return to affected stages;
- below `60`: workflow failure;
- any mandatory blocker overrides the numeric score.

## 56. Definition of done

A work item is done only when:

- the requested business outcome and final scope are traceable;
- all applicable stages have passed or authorized exceptions exist;
- the artifact chain is current and internally consistent;
- claims and evidence are verified to the required risk level;
- every locale is approved or explicitly outside scope;
- the exact approved package was implemented;
- the production result was validated;
- defects and open items have owners and accepted dispositions;
- measurement and maintenance ownership are active;
- the next review or lifecycle trigger is recorded;
- the final state is not merely `PUBLISHED`, but `PRODUCTION_VERIFIED` or an explicitly controlled alternative.

## 57. Relationship to other canonical references

Use this file to answer:

- What workflow applies?
- What comes next?
- What must exist before the next stage?
- Who owns the decision and handoff?
- Which detailed reference governs the work?
- What evidence proves completion?

Use the specialist files to answer how to perform and evaluate the work inside their domain.

If a specialist file adds a stricter requirement, apply it. If a specialist file is silent about stage order or ownership, this file governs.

## 58. Final governing rule

No content operation is complete because a draft was delivered, a reviewer reacted, a CMS entry was saved, or a URL became public.

Completion requires a traceable chain from business need to verified production result, followed by measurable ownership and a defined maintenance future.
