# 31 — Content QA, Review and Approval

## Table of contents

1. Role of this file
2. Core operating principle
3. Scope
4. Required distinctions
5. Authority and dependency order
6. QA lifecycle and states
7. Review modes
8. Risk-based review depth
9. Minimum inputs before review
10. Review ownership and separation of duties
11. Reviewer roles
12. Review assignment
13. Acceptance criteria
14. Review order
15. Intake and completeness gate
16. Brief and scope conformance
17. Structural QA
18. Editorial QA
19. Evidence and fact-check QA
20. SEO QA
21. Multilingual QA
22. Brand and conversion QA
23. Legal, privacy, security, and high-stakes review
24. Accessibility and inclusive-content QA
25. Visual, media, and asset QA
26. Link and reference QA
27. Metadata and machine-readable QA
28. UI, CMS, and rendered-content QA
29. Cross-version consistency
30. Issue taxonomy
31. Issue severity
32. Publication blockers
33. Issue records
34. Comment standards
35. Resolution and evidence of closure
36. Disagreement and escalation
37. Approval authority
38. Approval rules
39. Conditional approval
40. Rejection and return for revision
41. Material-change control
42. Approval expiry and re-review
43. Emergency and time-sensitive publishing
44. Batch and campaign review
45. AI-assisted QA and review
46. Review independence and conflicts of interest
47. Audit trail and retention
48. Handoff to publishing
49. Production verification
50. Corrections after publication
51. Required QA record
52. Required approval record
53. Review summary template
54. Content QA quality score
55. Metrics and process improvement
56. Anti-patterns
57. Pre-publication master checklist
58. Post-publication validation checklist
59. Definition of done

---

## 1. Role of this file

This file is the canonical standard for reviewing, accepting, rejecting, approving, and validating Neetrino content before and immediately after publication.

It converts the requirements established in the brief, outline, editorial, SEO, evidence, and multilingual references into a controlled final quality gate.

It answers:

- what must be reviewed;
- who may review and approve it;
- which review sequence applies;
- how issues are classified and resolved;
- which defects block publication;
- what constitutes valid approval;
- when approval expires;
- what must be checked after implementation and publication.

This file does not replace specialist standards. It coordinates their verification.

---

## 2. Core operating principle

Content may be published only when its material requirements have been independently checked, unresolved risk is visible, approval authority is explicit, and the implemented version matches the approved version.

Review is a decision process, not a comment count.

The objective is not to make every reviewer personally prefer every sentence. The objective is to establish that the content is accurate, useful, compliant, strategically aligned, technically intact, and safe to publish.

The governing rule is:

> No approval without defined acceptance criteria, no issue closure without verification, and no publication without version identity.

---

## 3. Scope

This standard applies to:

- service and landing pages;
- articles and educational resources;
- case studies;
- comparison and alternative pages;
- product and feature content;
- technical and implementation guides;
- campaign pages and conversion assets;
- downloadable resources;
- localized Armenian, English, and Russian versions;
- material updates to existing pages;
- content embedded in product interfaces when it performs a marketing, instructional, legal, or decision-support role;
- metadata, structured content, citations, links, and media that form part of the publication package.

It applies to original, translated, AI-assisted, imported, migrated, refreshed, merged, and repurposed content.

It does not define routine software code review, infrastructure QA, or visual-design approval except where those affect the published content experience.

---

## 4. Required distinctions

### 4.1 Self-check

A review performed by the creator before handoff. It is mandatory but does not satisfy independent-review requirements.

### 4.2 Specialist review

A focused review against a defined domain standard, such as evidence, SEO, translation, legal, security, accessibility, or technical accuracy.

### 4.3 Editorial review

A review of clarity, usefulness, voice, structure, reader logic, and publication quality.

### 4.4 Proofreading

A late-stage check for surface defects such as spelling, punctuation, formatting, broken text, and typographic inconsistency. Proofreading is not substantive review.

### 4.5 QA

A systematic comparison of the content package and its implementation against explicit requirements and acceptance criteria.

### 4.6 Review

An evidence-based assessment that may produce comments, issues, decisions, or recommendations.

### 4.7 Approval

A recorded authorization by a person with defined authority to move a specific version to the next state.

### 4.8 Acceptance

Confirmation that a requirement or deliverable meets its stated criteria. Acceptance may occur at component level without authorizing publication.

### 4.9 Sign-off

A formal approval attached to an identified version and scope. Informal messages such as “looks good” are not sign-off unless the context, version, authority, and decision are unambiguous and recorded.

### 4.10 Issue

A documented gap between the reviewed artifact and an applicable requirement.

### 4.11 Preference

A non-binding stylistic opinion that does not identify a violated requirement, reader harm, business risk, or measurable improvement.

### 4.12 Blocker

An issue that prevents publication until resolved or formally handled under an authorized exception process.

### 4.13 Approved version

The exact content package to which all required approvals apply.

### 4.14 Implemented version

The version entered into the CMS, application, design, or publishing system.

### 4.15 Production-verified version

The live version that has passed post-publication checks and is confirmed to match the approved intent.

---

## 5. Authority and dependency order

Review must use the following authority order:

1. binding legal, regulatory, contractual, privacy, security, and platform requirements;
2. approved business facts, product truth, and evidence records;
3. approved content brief and page specification;
4. `26_CONTENT_OUTLINE_AND_INFORMATION_ARCHITECTURE.md`;
5. `27_CONTENT_WRITING_AND_EDITORIAL_STANDARDS.md`;
6. `28_ON_PAGE_SEO_AND_CONTENT_OPTIMIZATION.md`;
7. `29_EVIDENCE_EEAT_AND_FACT_CHECKING.md`;
8. `30_MULTILINGUAL_TRANSLATION_AND_LOCALIZATION_STANDARDS.md`;
9. this QA, review, and approval standard;
10. channel-specific or campaign-specific instructions;
11. individual reviewer preference.

When requirements conflict, the higher authority prevails. The conflict must be recorded when it changes scope, meaning, risk, or acceptance criteria.

This file governs the review process. The specialist reference governs the substantive correctness of the item being reviewed.

---

## 6. QA lifecycle and states

Every content package must have one current state:

| State | Meaning | Permitted next states |
| --- | --- | --- |
| `DRAFTING` | Content is being created | `SELF_CHECK` |
| `SELF_CHECK` | Creator is checking completeness | `READY_FOR_REVIEW`, `DRAFTING` |
| `READY_FOR_REVIEW` | Required inputs are complete and frozen for review | `IN_REVIEW`, `DRAFTING` |
| `IN_REVIEW` | Assigned reviewers are evaluating the version | `CHANGES_REQUIRED`, `APPROVAL_PENDING` |
| `CHANGES_REQUIRED` | One or more required changes remain | `DRAFTING`, `READY_FOR_REVIEW` |
| `APPROVAL_PENDING` | Required reviews passed; sign-off is pending | `APPROVED`, `CHANGES_REQUIRED`, `REJECTED` |
| `APPROVED` | Named version is authorized for implementation | `IN_IMPLEMENTATION`, `REVIEW_EXPIRED` |
| `IN_IMPLEMENTATION` | Approved content is being entered into the delivery system | `IMPLEMENTED`, `CHANGES_REQUIRED` |
| `IMPLEMENTED` | Implementation is complete but not live-verified | `PUBLISHED`, `CHANGES_REQUIRED` |
| `PUBLISHED` | Content is live; validation is pending | `PRODUCTION_VERIFIED`, `ROLLBACK_REQUIRED` |
| `PRODUCTION_VERIFIED` | Live content passed required validation | `MAINTENANCE`, `CORRECTION_REQUIRED` |
| `REJECTED` | Publication is not authorized in the current scope | `DRAFTING`, `CLOSED` |
| `REVIEW_EXPIRED` | Prior approval no longer applies | `READY_FOR_REVIEW` |
| `CORRECTION_REQUIRED` | A live defect requires correction | `IN_IMPLEMENTATION`, `ROLLBACK_REQUIRED` |
| `ROLLBACK_REQUIRED` | Live content must be withdrawn or reverted | `CLOSED`, `DRAFTING` |
| `MAINTENANCE` | Content is live under normal monitoring | `READY_FOR_REVIEW`, `CORRECTION_REQUIRED` |

State changes must be intentional and attributable. A file being moved into a “final” folder does not change its governance state.

---

## 7. Review modes

### 7.1 Standard review

Used for ordinary new content and material updates. It includes all applicable specialist gates and final approval.

### 7.2 Lean review

Used for low-risk, limited-scope changes such as non-material typo fixes, formatting corrections, or replacement of a broken link with an equivalent destination.

Lean review must not be used when the change affects:

- meaning;
- claims or numbers;
- legal interpretation;
- security or privacy guidance;
- search intent or canonical ownership;
- CTA or commercial promise;
- translation equivalence;
- product functionality;
- eligibility, pricing, availability, or terms.

### 7.3 Extended review

Used for high-risk content, major launches, regulated subjects, security or privacy statements, material comparative claims, research reports, and pages with significant contractual or reputational impact.

### 7.4 Localization review

Used when an approved source is translated or localized. It requires target-language review plus verification that evidence, links, offers, and locale-specific requirements remain applicable.

### 7.5 Refresh review

Used for an existing live page. It must distinguish unchanged approved content from modified units and assess whether surrounding context has made old claims stale.

### 7.6 Migration review

Used when content moves between CMSs, domains, templates, or applications. It emphasizes completeness, URL behavior, metadata, structured data, links, assets, formatting, and tracking continuity.

### 7.7 Emergency review

Used only when delay creates greater material risk than a shortened review. It never removes mandatory legal, safety, privacy, security, factual, or approval controls.

---

## 8. Risk-based review depth

Assign one review-risk level before review begins:

| Level | Typical content | Minimum review |
| --- | --- | --- |
| `Q0` | Surface-only correction with no meaning change | self-check + implementation verification |
| `Q1` | Low-risk routine content with established facts | creator self-check + independent editorial review |
| `Q2` | Standard public content influencing understanding or conversion | editorial + applicable SEO/evidence/translation review + owner approval |
| `Q3` | Material commercial, technical, comparative, or reputation-sensitive content | independent specialists + senior owner approval + production validation |
| `Q4` | Legal, regulated, safety, privacy, security, or high-stakes content | qualified domain review + explicit accountable approval + documented evidence and exception prohibition |

Risk is determined by potential harm, not by word count.

If different sections have different risk, apply the highest level to the affected unit and any dependent statements. Do not unnecessarily subject unrelated low-risk units to high-risk review.

---

## 9. Minimum inputs before review

A package is not `READY_FOR_REVIEW` unless it includes:

- content identifier and working title;
- content type and intended channel;
- approved brief or documented acceptance criteria;
- page owner and accountable approver;
- exact review version or immutable comparison reference;
- change summary for updates;
- intended language and locale;
- applicable risk level;
- evidence and source records for material claims;
- SEO specification when applicable;
- link and asset inventory when applicable;
- glossary or protected terminology for multilingual work;
- known constraints, open decisions, and explicit exclusions;
- requested review types and named reviewers;
- target publication date;
- implementation destination or CMS context.

If an input is unavailable, the reviewer must classify it as:

- not applicable;
- deferred with an authorized owner and due point;
- missing and blocking;
- missing but non-blocking with documented residual risk.

Silence is not a valid classification.

---

## 10. Review ownership and separation of duties

Every content package must have:

- one content owner;
- one review coordinator, who may also be the content owner for `Q0–Q1` work;
- named specialist reviewers where required;
- one accountable approver;
- one implementation owner;
- one production-validation owner.

For `Q3–Q4` content, the creator must not be the sole reviewer or sole approver.

The same person may perform multiple roles only when:

- the risk level permits it;
- required competence exists;
- the conflict of interest is acceptable;
- the decision remains independently verifiable.

Approval authority cannot be inferred from seniority alone. It must be assigned for the content, domain, or campaign.

---

## 11. Reviewer roles

### 11.1 Creator

- produces the content package;
- performs the self-check;
- maps changes to requirements;
- responds to issues;
- does not mark disputed material issues closed unilaterally.

### 11.2 Content owner

- protects the page purpose, audience, scope, and lifecycle;
- decides ordinary content trade-offs;
- confirms business intent and acceptance criteria;
- remains accountable after publication.

### 11.3 Editorial reviewer

- checks usefulness, logic, clarity, voice, structure, and readability;
- distinguishes defects from preferences;
- ensures the content fulfills the reader promise.

### 11.4 Evidence or fact-check reviewer

- verifies material claims, numbers, quotations, citations, and certainty;
- applies the evidence standard;
- records unresolved uncertainty.

### 11.5 SEO reviewer

- checks intent alignment, page ownership, metadata, internal linking, answer usefulness, and indexation-related content decisions;
- does not force keyword changes that damage meaning or readability.

### 11.6 Language reviewer

- checks native quality and locale fitness;
- verifies semantic equivalence against the approved source;
- protects glossary and terminology decisions.

### 11.7 Domain expert

- verifies technical, commercial, legal, operational, or regulated substance;
- states the limits of their review authority.

### 11.8 Legal, privacy, or security reviewer

- evaluates content within the assigned specialist domain;
- may impose a blocker when publication creates unacceptable exposure;
- must not be replaced by generic editorial approval for `Q4` material.

### 11.9 Accessibility reviewer

- checks whether content can be understood and navigated by the intended range of users;
- evaluates headings, link labels, alternatives, captions, and plain-language needs.

### 11.10 Approver

- reviews the consolidated state, open risks, and required specialist outcomes;
- authorizes or rejects the named version;
- does not approve content outside assigned authority.

### 11.11 Implementer

- implements the approved package without silent editorial change;
- records necessary implementation deviations;
- returns material deviations for re-review.

### 11.12 Production validator

- checks the live output independently from the CMS editing view;
- confirms that publication did not introduce defects or omit approved elements.

---

## 12. Review assignment

Each assignment must state:

- artifact and exact version;
- requested review type;
- risk level;
- applicable criteria;
- scope and exclusions;
- due date;
- decision expected: comment, accept, approve, or advise;
- required output format;
- dependencies and known open issues.

“Please review” is insufficient for material work because it does not define what decision is being requested.

Reviewers must decline or narrow an assignment when they lack the context, competence, authority, or time required for a reliable decision.

---

## 13. Acceptance criteria

Acceptance criteria must be testable. They should identify:

- required audience outcome;
- mandatory topics and exclusions;
- factual and evidence requirements;
- tone and language requirements;
- SEO and page-ownership requirements;
- conversion requirements;
- compliance constraints;
- required assets, links, and metadata;
- implementation constraints;
- measurable publication conditions.

Bad criterion:

> Make the page stronger.

Valid criterion:

> The opening must identify the service, target customer, core problem, and primary outcome without relying on the CTA or later sections.

Criteria added after review begins must be labeled as new scope, not presented as defects in the submitted version.

---

## 14. Review order

Use this default sequence:

1. creator self-check;
2. intake and completeness gate;
3. scope and structure review;
4. substantive editorial review;
5. evidence and domain review;
6. SEO review;
7. translation or locale review;
8. legal, privacy, security, or high-stakes review where applicable;
9. copyedit and proofreading;
10. consolidated issue resolution;
11. final approval;
12. implementation QA;
13. production validation.

Parallel specialist review is permitted when:

- the version is stable enough;
- reviewer scopes are distinct;
- the coordinator will reconcile conflicts;
- later changes will be rechecked by affected reviewers.

Do not proofread unstable content line by line before material structural issues are resolved.

---

## 15. Intake and completeness gate

Before substantive review, confirm:

- correct file and version;
- all expected sections are present;
- tracked decisions and unresolved questions are visible;
- placeholders are labeled;
- evidence is accessible;
- assets and links are identifiable;
- locale is declared;
- comparison baseline is available for updates;
- no hidden comment or unresolved revision changes the intended reading;
- the reviewer can access the intended rendered context.

If the package is materially incomplete, return it without performing a full review. Record why the gate failed so that review effort is not mistaken for approval.

---

## 16. Brief and scope conformance

Verify that the content:

- serves the approved audience and reader state;
- fulfills the page promise;
- answers the intended reader task;
- covers `must cover` items;
- respects exclusions;
- uses the approved page type and conversion role;
- preserves the agreed differentiation;
- does not expand into an unauthorized product, legal, or commercial promise;
- clearly identifies any intentional departure from the brief.

A better sentence that serves the wrong page purpose is still a QA failure.

---

## 17. Structural QA

Apply `26_CONTENT_OUTLINE_AND_INFORMATION_ARCHITECTURE.md` and verify:

- one clear H1 and page purpose;
- answer-first opening where applicable;
- logical section sequence;
- heading hierarchy and labels;
- no orphan, duplicate, or empty sections;
- each section fulfills a defined contract;
- progressive disclosure matches reader needs;
- lists, tables, definitions, and examples use the correct format;
- conversion elements appear at appropriate decision points;
- the page can be scanned on mobile;
- in-page navigation works when required;
- the ending resolves the reader task rather than merely stopping.

Structural issues must be corrected before final line editing when they require significant content movement or deletion.

---

## 18. Editorial QA

Apply `27_CONTENT_WRITING_AND_EDITORIAL_STANDARDS.md` and verify:

- meaning is clear on first reasonable reading;
- claims use calibrated certainty;
- sentences and paragraphs are controlled;
- jargon is necessary and explained appropriately;
- the voice is recognizably Neetrino and appropriate to context;
- the tone respects the reader;
- transitions preserve logic;
- examples are credible and useful;
- analysis, fact, opinion, and recommendation are distinguishable;
- repetition adds value rather than padding;
- promotional language does not outrun evidence;
- CTA language is specific and truthful;
- spelling, grammar, punctuation, capitalization, and typography are correct;
- no drafting notes, prompt residue, placeholders, or model instructions remain.

The reviewer must preserve deliberate voice. Copyediting must not flatten every sentence into generic corporate prose.

---

## 19. Evidence and fact-check QA

Apply `29_EVIDENCE_EEAT_AND_FACT_CHECKING.md` and verify:

- material claims appear in the claim inventory;
- each required claim has fit evidence;
- sources are inspected, not merely cited;
- numbers are recalculated or traced to their origin;
- dates, versions, jurisdiction, and scope are applicable;
- comparisons use a disclosed baseline;
- causal language matches the evidence;
- quotations and testimonials are authentic and authorized;
- credentials, logos, partners, awards, and results are provable;
- citations sit near the claims they support;
- contradictory evidence is disclosed or resolved;
- first-party experience is labeled and bounded;
- AI output is not treated as evidence;
- sensitive evidence is protected and appropriately redacted;
- E-E-A-T signals correspond to real proof.

Any reviewer who changes a material claim must trigger evidence re-verification for that claim.

---

## 20. SEO QA

Apply `28_ON_PAGE_SEO_AND_CONTENT_OPTIMIZATION.md` and verify:

- the page owns a defined intent and does not create avoidable cannibalization;
- title, H1, slug, and description are aligned but not mechanically duplicated;
- the opening provides a useful primary answer;
- terms and entities are used naturally and accurately;
- semantic coverage is sufficient for the task;
- the page contributes information gain;
- internal links have valid targets and descriptive anchors;
- external links are purposeful;
- image filenames, alt text, and captions are appropriate;
- structured-data recommendations are eligible and truthful;
- canonical and indexation intent are recorded;
- localized versions target the correct locale intent;
- optimization has not degraded readability, factual accuracy, or conversion clarity.

SEO review is not approval to alter product truth or evidence-backed wording without the relevant owner.

---

## 21. Multilingual QA

Apply `30_MULTILINGUAL_TRANSLATION_AND_LOCALIZATION_STANDARDS.md` and verify each target language independently and against the source.

Check:

- complete semantic coverage;
- preservation of claims, limitations, conditions, and certainty;
- native grammar and natural expression;
- correct register and brand voice;
- approved terminology and transliteration;
- numbers, currencies, dates, units, names, URLs, and variables;
- localized CTA intent;
- locale-specific keyword and metadata choices;
- evidence applicability in the target locale;
- UI length and layout constraints;
- consistency across Armenian, English, and Russian versions;
- source changes that may have made a translation stale.

A linguistically fluent translation fails QA if it changes the offer, claim, risk, or reader action.

---

## 22. Brand and conversion QA

Verify that:

- the company, service, product, and offer are represented accurately;
- value propositions are specific and supported;
- the content does not invent capabilities, clients, integrations, timelines, guarantees, or outcomes;
- differentiation is credible;
- commercial language matches the intended funnel stage;
- CTA hierarchy is coherent;
- the promised action matches the destination;
- forms request proportionate information;
- urgency and scarcity are genuine;
- no dark pattern, deceptive framing, or hidden condition is introduced;
- contact, pricing, availability, and eligibility details are current.

Conversion improvement cannot justify misleading content.

---

## 23. Legal, privacy, security, and high-stakes review

Qualified review is required when content materially addresses:

- contracts, rights, obligations, warranties, or liability;
- privacy, consent, cookies, tracking, or personal data;
- security controls, certifications, vulnerabilities, or guarantees;
- health, financial, legal, safety, or regulated decisions;
- promotions, competitions, disclosures, or jurisdiction-specific advertising;
- intellectual property, licensing, or third-party rights;
- employment or discriminatory eligibility criteria.

Verify:

- jurisdiction and effective date;
- approved terminology;
- mandatory disclosures and disclaimers;
- evidence for compliance claims;
- consistency with actual practice and governing documents;
- absence of absolute guarantees unless formally authorized;
- correct owner and escalation route.

Editorial or business approval cannot waive a specialist `Q4` blocker.

---

## 24. Accessibility and inclusive-content QA

Verify:

- heading order supports navigation;
- links make sense out of context;
- instructions do not rely only on color, position, shape, sound, or gesture;
- image alternatives describe function or relevant content;
- decorative images are handled appropriately;
- captions or transcripts exist when required;
- tables have understandable headers and reading order;
- language is plain enough for the intended reader;
- abbreviations are expanded when needed;
- error, form, and CTA text is understandable;
- content avoids unnecessary stereotypes, exclusion, or stigmatizing language;
- translated versions preserve accessibility meaning;
- downloadable artifacts remain usable.

Accessibility review evaluates the rendered experience, not only the source copy.

---

## 25. Visual, media, and asset QA

For every image, video, diagram, chart, icon, and downloadable asset, verify:

- it belongs to the correct content unit;
- it is accurate and not misleading;
- rights, consent, and attribution are documented when required;
- labels and values match the text;
- the latest approved version is used;
- crop, resolution, compression, and aspect ratio are acceptable;
- mobile rendering preserves essential information;
- captions and alt text are accurate;
- embedded text is localized where required;
- filenames and destinations are correct;
- no confidential or personal data is exposed;
- charts disclose source, period, unit, and relevant baseline.

Decorative polish must not obscure evidence or imply unsupported precision.

---

## 26. Link and reference QA

Check all internal, external, anchor, file, email, telephone, CTA, and navigation links.

Verify:

- the destination resolves;
- the destination is the intended one;
- protocol and domain are correct;
- anchors point to existing identifiers;
- locale links preserve language where intended;
- tracking parameters are authorized and correctly formed;
- external sources support the adjacent claim;
- links do not expose preview, private, staging, or temporary URLs;
- redirects do not create avoidable chains or loops;
- downloadable files are current and safe;
- link labels describe the destination or action;
- open-in-new-tab behavior follows the product standard.

Automated link checking is useful but does not confirm semantic correctness.

---

## 27. Metadata and machine-readable QA

Where applicable, verify:

- SEO title and meta description;
- canonical URL;
- robots and indexation instructions;
- hreflang relationships;
- Open Graph and social metadata;
- structured data type, eligibility, values, and visible-content consistency;
- author, publisher, date published, and date modified;
- image metadata and social-preview assets;
- content identifiers, taxonomy, and CMS fields;
- feed, sitemap, and search-index inclusion expectations;
- analytics and campaign identifiers;
- locale and language declarations.

Machine-readable claims must never exceed what users can verify on the visible page.

---

## 28. UI, CMS, and rendered-content QA

After implementation, review the actual rendered content at required breakpoints and states.

Check:

- no content is missing, duplicated, truncated, or reordered;
- typography and spacing preserve meaning and hierarchy;
- lists, tables, quotes, code, and callouts render correctly;
- variables and personalization produce valid grammar;
- forms, buttons, accordions, tabs, and navigation work;
- required content is not hidden behind a broken interaction;
- responsive behavior is usable;
- locale switching preserves the correct page;
- special characters and Armenian/Russian text encode correctly;
- metadata and previews reflect the approved package;
- assets load with appropriate alternatives;
- cookie or consent states do not invalidate required messaging;
- the live URL and canonical behavior are correct.

CMS presence is not proof of production correctness.

---

## 29. Cross-version consistency

For content with multiple versions, verify consistency across:

- source and translations;
- desktop and mobile presentations;
- page copy and metadata;
- visible claims and structured data;
- landing page and linked forms;
- article and social preview;
- current and downloadable versions;
- marketing copy and product behavior;
- content package and production output.

Differences are allowed only when they are intentional, documented, and appropriate to the channel or locale.

---

## 30. Issue taxonomy

Use one primary code per issue:

| Code | Category |
| --- | --- |
| `QA-SCP` | scope or brief mismatch |
| `QA-STR` | structure or information architecture |
| `QA-EDT` | editorial clarity, voice, or readability |
| `QA-FCT` | factual accuracy |
| `QA-EVD` | evidence or citation |
| `QA-SEO` | search alignment or on-page SEO |
| `QA-L10N` | translation or localization |
| `QA-TRM` | terminology inconsistency |
| `QA-BRN` | brand or product truth |
| `QA-CNV` | CTA or conversion path |
| `QA-LGL` | legal or regulatory |
| `QA-PRV` | privacy or personal data |
| `QA-SEC` | security claim or exposure |
| `QA-ACC` | accessibility or inclusive content |
| `QA-MED` | image, video, chart, or asset |
| `QA-LNK` | link or destination |
| `QA-MTD` | metadata or machine-readable content |
| `QA-IMP` | CMS or implementation mismatch |
| `QA-RND` | rendering or responsive behavior |
| `QA-VRS` | version, stale copy, or uncontrolled change |
| `QA-PRF` | proofreading or formatting |
| `QA-GOV` | ownership, authority, or approval record |
| `QA-OPS` | workflow, handoff, or deadline risk |

Use secondary tags when an issue spans categories. Do not duplicate one root problem into multiple independent issues unless each requires a separate owner or validation method.

---

## 31. Issue severity

### `S0 — Note`

No defect. A clarification, observation, or optional idea. It does not require resolution before approval.

### `S1 — Minor`

A limited defect that does not materially change meaning, decision quality, compliance, or core usability. It should normally be fixed before publication but may be deferred by the content owner.

### `S2 — Major`

A defect that materially weakens usefulness, clarity, completeness, search alignment, conversion, consistency, or professional quality. It blocks approval until fixed or accepted by the authorized risk owner.

### `S3 — Critical`

A defect that creates material factual, legal, privacy, security, reputational, accessibility, commercial, or user-harm risk. Publication is prohibited until resolved and re-verified.

### `S4 — Stop-publication`

An immediate and severe risk requiring publication cancellation, rollback, or escalation. Examples include exposure of confidential data, dangerous instructions, materially deceptive claims, unlawful content, or publication of the wrong client/product/version.

Severity is based on consequence and reach, not how easy the issue is to fix.

---

## 32. Publication blockers

Publication is blocked when any of the following remains:

- unresolved `S3` or `S4` issue;
- unresolved `S2` issue without authorized risk acceptance;
- missing required specialist review;
- missing accountable approver;
- unverified material claim;
- missing or inapplicable legal disclosure;
- unsupported guarantee, comparison, performance result, partnership, certification, or customer claim;
- exposure of personal, confidential, credential, or security-sensitive information;
- wrong product, offer, price, locale, jurisdiction, or version;
- broken primary CTA, form, purchase, booking, or contact path;
- incorrect canonical, indexation, or redirect behavior that materially affects the page;
- incomplete or materially misleading translation;
- missing consent or rights for a material asset or testimonial;
- approval applied to a version that differs materially from implementation;
- placeholder, fabricated citation, prompt instruction, or unreviewed AI claim in final content;
- inability to identify the live owner and correction route for `Q3–Q4` content.

Deadline pressure does not lower blocker severity.

---

## 33. Issue records

Every `S2–S4` issue and any disputed `S1` issue must include:

```markdown
### QA issue

- Issue ID:
- Content ID:
- Version:
- Location:
- Category code:
- Severity:
- Requirement violated:
- Observed condition:
- User or business impact:
- Required outcome:
- Suggested change, if useful:
- Owner:
- Reviewer:
- Date raised:
- Status:
- Resolution:
- Closure evidence:
- Closed by:
- Closure date:
- Re-review required: yes/no
```

An issue should identify the problem and acceptance condition. It should not require the reviewer to ghostwrite the entire solution unless that is part of the assigned role.

---

## 34. Comment standards

Review comments must be:

- attributable;
- specific to a location or requirement;
- classified as required, recommended, question, or note;
- proportionate to impact;
- written respectfully;
- free from hidden scope expansion;
- resolvable by the assigned owner.

Use:

- **Required:** a requirement is violated or risk is unacceptable;
- **Recommended:** a meaningful improvement with no approval blocker;
- **Question:** missing context prevents a reliable judgment;
- **Note:** non-actionable information.

Avoid:

- “I don’t like this” without a reason;
- rewriting voice as personal taste;
- vague comments such as “fix SEO” or “make it better”;
- resolving substantive disputes inside unrelated line comments;
- marking an issue solved because text changed without checking the result.

---

## 35. Resolution and evidence of closure

An issue may be closed only when one of these outcomes is recorded:

- corrected and verified;
- requirement shown to be already satisfied;
- duplicate of another controlled issue;
- out of scope with owner confirmation;
- accepted risk by authorized owner where permitted;
- superseded by an approved change in requirement;
- rejected as preference with review-coordinator rationale.

For `S2–S4` issues, “done” from the creator is not closure. The reviewer or delegated verifier must confirm the resulting version.

Closure evidence may include:

- exact revised text;
- version diff;
- source or calculation;
- screenshot of rendered implementation;
- test result;
- specialist confirmation;
- live URL and observed behavior.

---

## 36. Disagreement and escalation

Resolve disagreements in this order:

1. identify the exact requirement and decision at issue;
2. distinguish fact, risk, strategy, and preference;
3. gather missing evidence or context;
4. consult the owner of the governing standard;
5. escalate to the accountable approver or domain authority;
6. record the final decision, rationale, and residual risk.

The loudest participant does not become the standard owner.

No reviewer may silently delete another reviewer’s unresolved issue. Conflicting decisions must remain visible until reconciled.

---

## 37. Approval authority

Approval must come from the role accountable for the relevant consequence:

| Decision | Typical authority |
| --- | --- |
| Editorial readiness | content or editorial owner |
| Business and offer accuracy | service, product, or business owner |
| Evidence sufficiency | evidence reviewer or accountable domain owner |
| SEO readiness | assigned SEO owner |
| Translation readiness | qualified target-language owner |
| Legal/compliance readiness | authorized legal or compliance reviewer |
| Privacy readiness | privacy owner |
| Security statements | security owner |
| Final publication | designated accountable approver |
| Production correctness | implementation or release owner plus validator |

One final approver may rely on specialist sign-offs but cannot retroactively create missing specialist competence.

---

## 38. Approval rules

Valid approval must identify:

- content ID and title;
- exact version or checksum-equivalent reference;
- included languages and channels;
- scope of approval;
- completed required reviews;
- open non-blocking issues;
- accepted residual risk;
- conditions or expiry date;
- approver name and role;
- approval decision and timestamp.

Approval applies only to the named version and scope.

The following are not valid approval:

- silence after a review request;
- participation in a meeting;
- editing the document;
- resolving one’s own comments;
- an emoji without established decision context;
- approval of a source language assumed to cover unreviewed translations;
- approval of copy assumed to cover a materially different CMS implementation.

---

## 39. Conditional approval

Conditional approval is allowed only when:

- remaining conditions are explicit;
- no `S3–S4` issue remains;
- each condition has an owner and verification method;
- publication cannot occur until conditions are confirmed, unless the approver explicitly authorizes a permitted post-publication item;
- the condition does not delegate away mandatory specialist authority.

Record conditional approval as `APPROVAL_PENDING` until all pre-publication conditions are closed.

Do not use conditional approval to disguise incomplete work.

---

## 40. Rejection and return for revision

Reject or return the package when:

- the brief is not fulfilled;
- the version is too unstable for efficient review;
- required inputs are absent;
- issue volume indicates systemic rework rather than isolated corrections;
- the content creates unacceptable risk;
- the intended outcome cannot be achieved within the approved scope;
- reviewers cannot establish product or factual truth;
- the wrong review mode was selected.

The return decision must include:

- reason;
- blocking criteria;
- expected revision outcome;
- owner;
- whether a full or focused re-review will be required.

---

## 41. Material-change control

After approval, classify every change:

| Level | Change | Required action |
| --- | --- | --- |
| `C0` | formatting-only with no semantic or functional effect | implementation verification |
| `C1` | minor copy correction preserving meaning | focused editorial check |
| `C2` | meaning, CTA, metadata, link, evidence wording, or translated unit changes | affected specialist re-review |
| `C3` | material scope, claim, offer, structure, legal, privacy, security, or product change | approval invalidated; full relevant review |
| `C4` | emergency correction or rollback-worthy change | stop publication or invoke emergency workflow |

Examples of material change include:

- adding or removing a limitation;
- changing a number, date, price, result, or comparison;
- altering CTA destination or commercial promise;
- replacing a source;
- changing title, canonical intent, or page ownership;
- updating one language without reconciling others;
- changing structured data independently of visible content.

Implementers must not make silent `C2–C4` changes.

---

## 42. Approval expiry and re-review

Approval expires when:

- a `C3–C4` change occurs;
- a source, offer, product, law, policy, price, or material fact changes;
- the stated approval validity date passes;
- publication is delayed long enough that freshness is uncertain;
- a new contradiction or risk is discovered;
- the intended channel, audience, locale, or jurisdiction changes materially;
- implementation cannot be shown to match the approved package;
- the approving authority withdraws approval within its remit.

Time-based validity should be defined for volatile content. Stable evergreen copy may use event-based re-review triggers.

---

## 43. Emergency and time-sensitive publishing

Emergency publishing requires:

- documented reason for urgency;
- named incident or business owner;
- explicit risk level;
- minimum mandatory specialist checks;
- exact known omissions;
- approval from the accountable emergency authority;
- planned completion or correction time;
- immediate post-publication validation;
- rollback path.

Never skip verification of:

- identity of the affected product, company, or incident;
- safety-critical facts;
- personal or confidential data;
- legal or security consequences;
- primary user action;
- publication destination.

Emergency workflow shortens latency, not accountability.

---

## 44. Batch and campaign review

For repeated or templated content:

- approve the template, variables, data source, and generation rules;
- identify fields that require item-level review;
- test representative edge cases;
- validate language inflection and variable combinations;
- define batch-level stop conditions;
- sample outputs using a documented method;
- review all `Q3–Q4` items individually unless a qualified authority approves an equivalent deterministic control;
- preserve traceability from each output to its inputs and template version.

A correct template does not guarantee correct input data.

---

## 45. AI-assisted QA and review

AI may assist with:

- checklist execution;
- comparison against a brief;
- extraction of claims, links, numbers, and named entities;
- cross-language discrepancy detection;
- style and terminology consistency;
- broken-link and formatting detection;
- version-diff summaries;
- possible issue identification;
- creation of review records.

AI must not be treated as:

- a source of factual confirmation;
- final legal, privacy, security, medical, financial, or regulatory authority;
- a substitute for native-language approval where nuance is material;
- an accountable approver;
- proof that content was reviewed merely because a prompt was run.

Human reviewers must verify AI-raised and AI-cleared material issues. Confidential or personal data must not be provided to an unauthorized model or environment.

Record material AI involvement when it influenced issue identification or resolution.

---

## 46. Review independence and conflicts of interest

Reviewers must disclose when:

- they created the claim or evidence being independently checked;
- their performance is directly measured by approval;
- they own the vendor, product, or partnership being evaluated;
- they lack independence required by policy or regulation;
- they cannot challenge the approver without consequence;
- they have a personal or commercial conflict affecting judgment.

For `Q3–Q4` content, assign an alternative reviewer when the conflict could reasonably weaken trust in the decision.

Independence does not mean lack of context. Reviewers need enough context to understand the intended claim and consequence.

---

## 47. Audit trail and retention

Retain, according to applicable policy:

- approved brief and acceptance criteria;
- submitted review version;
- issue log and material comments;
- evidence and source records;
- specialist decisions;
- exceptions and risk acceptance;
- approval record;
- implementation change record;
- production-validation result;
- correction and rollback history.

The record must allow a later reviewer to answer:

- what was approved;
- by whom;
- against which requirements;
- with what evidence;
- what changed afterward;
- what appeared in production.

Do not retain sensitive evidence longer or more broadly than authorized.

---

## 48. Handoff to publishing

The approved publication package must include:

- final approved copy by language;
- content ID and version;
- page title, H1, slug, and metadata;
- canonical and indexation instructions;
- headings and component order;
- links and CTA destinations;
- media files, alt text, captions, and credits;
- structured-data requirements;
- author and date fields;
- redirects where applicable;
- analytics or campaign parameters;
- implementation notes and protected elements;
- approval record;
- known non-blocking issues;
- post-publication validation owner and checklist.

The handoff must distinguish editable copy from instructions. Implementation notes must not accidentally appear on the live page.

---

## 49. Production verification

Production verification must occur after publication and within a timeframe proportionate to risk.

Verify:

- correct URL and locale;
- live copy matches the approved version;
- title, metadata, canonical, robots, hreflang, and structured data;
- headings, links, CTA, forms, and interactive components;
- images, video, files, alt text, and captions;
- mobile and desktop rendering;
- analytics and conversion tracking where required;
- no staging, preview, draft, or private identifiers remain;
- cache and localization behavior do not show stale content;
- redirects and old URLs behave as specified;
- search or social preview readiness where immediately testable;
- no deployment introduced unrelated content regression.

Record `PRODUCTION_VERIFIED` only after the live version passes applicable checks.

---

## 50. Corrections after publication

When a live issue is found:

1. record the issue and time detected;
2. assess severity and exposure;
3. decide correct, unpublish, or rollback;
4. notify required owners;
5. preserve evidence of the defective version when lawful and safe;
6. implement the smallest safe correction;
7. re-review all materially affected units;
8. validate production;
9. add correction or transparency notice when required;
10. update the maintenance trigger or process control.

Do not silently correct a material public error when transparency is required for reader trust, contractual accuracy, or policy.

---

## 51. Required QA record

```markdown
# Content QA Record

## 1. Identity

- Content ID:
- Title:
- Page/content type:
- Language(s) and locale(s):
- Channel and destination:
- Review version:
- Previous live version, if any:
- Risk level: Q0/Q1/Q2/Q3/Q4
- Review mode:

## 2. Ownership

- Creator:
- Content owner:
- Review coordinator:
- Implementer:
- Production validator:
- Accountable approver:

## 3. Inputs

- Approved brief:
- Acceptance criteria:
- Change summary:
- Evidence record:
- SEO specification:
- Glossary/translation source:
- Assets and link inventory:
- Known constraints:

## 4. Required reviews

| Review | Required | Reviewer | Version | Status | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Self-check | | | | | | |
| Editorial | | | | | | |
| Evidence/fact-check | | | | | | |
| SEO | | | | | | |
| Translation/localization | | | | | | |
| Domain/technical | | | | | | |
| Legal/compliance | | | | | | |
| Privacy/security | | | | | | |
| Accessibility | | | | | | |
| Implementation | | | | | | |

## 5. Issue summary

| Severity | Open | Closed | Accepted risk |
| --- | ---: | ---: | ---: |
| S0 | | | |
| S1 | | | |
| S2 | | | |
| S3 | | | |
| S4 | | | |

## 6. Blocker assessment

- Publication blockers present: yes/no
- Blocker IDs:
- Missing reviews:
- Residual risks:
- Exceptions:

## 7. Implementation

- Handoff date:
- Implemented version:
- Material deviations:
- Re-review completed:
- Production URL:

## 8. Production validation

- Validation date:
- Validator:
- Result:
- Defects found:
- Corrective actions:
- Final state:
```

---

## 52. Required approval record

```markdown
# Content Approval Record

- Content ID:
- Title:
- Exact approved version:
- Languages/locales covered:
- Channels/destinations covered:
- Risk level:
- Required reviews completed:
- Open S0–S1 issues:
- Open S2 issues and authorized risk acceptance:
- S3–S4 issues open: none required
- Conditions:
- Approval validity or expiry trigger:
- Decision: approved/rejected/returned
- Approver name:
- Approver role and authority:
- Decision date and time:
- Approval note:
```

Approval records must be linked to the QA record and approved artifact.

---

## 53. Review summary template

```markdown
# Review Summary

## Outcome

- Review type:
- Version reviewed:
- Decision: pass/pass with non-blocking changes/changes required/reject
- Re-review required: yes/no

## Material findings

1. [Issue ID — severity — summary]

## Required actions

1. [Owner — required outcome — due point]

## Non-blocking recommendations

1. [Recommendation]

## Scope and limitations

- Reviewed:
- Not reviewed:
- Assumptions:
- Dependencies:

## Reviewer

- Name:
- Role:
- Date:
```

---

## 54. Content QA quality score

Score each criterion from `0` to `4`:

- `0` — absent, false, or uncontrolled;
- `1` — materially deficient;
- `2` — partly adequate but important gaps remain;
- `3` — meets the standard;
- `4` — exceptionally clear, verified, and reusable.

| # | Criterion | Score |
| ---: | --- | ---: |
| 1 | Brief and scope conformance | /4 |
| 2 | Audience and reader-task fulfillment | /4 |
| 3 | Structural integrity | /4 |
| 4 | Editorial clarity and voice | /4 |
| 5 | Factual accuracy | /4 |
| 6 | Evidence and citation fitness | /4 |
| 7 | Certainty and limitation calibration | /4 |
| 8 | SEO and page-ownership alignment | /4 |
| 9 | Terminology consistency | /4 |
| 10 | Multilingual semantic equivalence | /4 |
| 11 | Brand, product, and offer accuracy | /4 |
| 12 | CTA and conversion integrity | /4 |
| 13 | Legal, privacy, and security readiness | /4 |
| 14 | Accessibility and inclusive content | /4 |
| 15 | Link and asset integrity | /4 |
| 16 | Metadata and machine-readable consistency | /4 |
| 17 | Rendered implementation quality | /4 |
| 18 | Issue resolution and closure evidence | /4 |
| 19 | Approval traceability | /4 |
| 20 | Production validation readiness | /4 |

Maximum score: `80`.

Interpretation:

- `72–80`: strong publication readiness;
- `64–71`: publishable only if no blocker exists and weaker criteria are understood;
- `52–63`: material revision required;
- below `52`: not ready for approval.

Score is a diagnostic aid, not a substitute for blocker rules. A package scoring `79` with one privacy exposure is still blocked.

Any applicable criterion scored `0` or `1` requires an explicit issue. Any high-risk criterion below `3` blocks `Q3–Q4` approval unless the governing authority defines a stricter or formally permitted alternative.

---

## 55. Metrics and process improvement

Track process metrics without rewarding superficial speed:

- first-pass acceptance rate;
- issues by category and severity;
- defect escape rate after publication;
- average review and resolution time by risk level;
- re-review cycles;
- late scope-change rate;
- approval-to-publication deviation rate;
- broken-link and implementation defect rate;
- translation discrepancy rate;
- evidence blocker rate;
- correction and rollback frequency;
- recurring root causes;
- reviewer workload and bottlenecks.

Do not optimize for fewer comments. Optimize for fewer material defects, clearer requirements, faster reliable decisions, and lower correction cost.

When a defect recurs, improve the earliest responsible control: brief, source data, template, glossary, workflow, automation, or ownership.

---

## 56. Anti-patterns

Prohibited or unreliable practices include:

- using “final” in the filename as approval evidence;
- treating self-review as independent review;
- asking everyone to review everything;
- reviewing without acceptance criteria;
- adding new requirements after submission and calling them defects;
- confusing preference with quality;
- resolving comments without verifying changes;
- approving a draft while implementation continues to change;
- allowing CMS editors to make silent material rewrites;
- using one language approval for all locales;
- performing only spellcheck on fact-sensitive content;
- counting citations without checking source fitness;
- accepting broken primary CTAs as post-launch cleanup;
- letting deadline owners downgrade risk unilaterally;
- using AI approval as accountable sign-off;
- hiding unresolved issues in chat or meetings;
- approving without knowing the exact version;
- marking published content complete before live validation;
- applying quality scores mechanically while ignoring blockers;
- retaining sensitive review evidence without access control.

---

## 57. Pre-publication master checklist

### Governance and identity

- [ ] Content ID, title, version, locale, destination, and owner are recorded.
- [ ] Review risk and mode are assigned.
- [ ] Required reviewers and approver are named.
- [ ] The reviewed version is stable and identifiable.
- [ ] The change summary is complete.
- [ ] Acceptance criteria are explicit.
- [ ] Reviewer scopes and exclusions are recorded.

### Brief and reader outcome

- [ ] Audience and reader state match the brief.
- [ ] Page promise and primary task are fulfilled.
- [ ] Mandatory scope is covered.
- [ ] Excluded scope has not been introduced.
- [ ] Content type and funnel role are correct.
- [ ] Differentiation and value-add are visible.

### Structure and editorial quality

- [ ] Opening establishes relevance and primary answer.
- [ ] Section order follows reader logic.
- [ ] Heading hierarchy is valid.
- [ ] Each section has a necessary function.
- [ ] Lists, tables, callouts, and examples use appropriate formats.
- [ ] Voice and tone match the context.
- [ ] Claims, opinions, and recommendations are distinguishable.
- [ ] Certainty matches evidence.
- [ ] Copy is clear, concise, and grammatically correct.
- [ ] No placeholders, prompts, notes, or tracked-change residue remain.

### Evidence and trust

- [ ] Material claims are inventoried.
- [ ] Required evidence is present and fit.
- [ ] Numbers, dates, versions, and comparisons are verified.
- [ ] Causal and predictive wording is calibrated.
- [ ] Citations support the adjacent claims.
- [ ] Quotations, testimonials, logos, credentials, and results are authorized.
- [ ] Contradictory or missing evidence is handled.
- [ ] Authorship and E-E-A-T signals are truthful.

### SEO and discovery

- [ ] Search intent and page ownership are confirmed.
- [ ] Title, H1, slug, and meta description are approved.
- [ ] Primary answer and semantic coverage are adequate.
- [ ] Internal links and anchors are intentional.
- [ ] Canonical and indexation instructions are recorded.
- [ ] Structured data is eligible and visible-content-consistent.
- [ ] Image optimization and alt text are complete.

### Multilingual quality

- [ ] Source-of-truth version is identified.
- [ ] Every target language is complete.
- [ ] Meaning, limits, claims, numbers, and CTA intent are equivalent.
- [ ] Native-language review is complete where required.
- [ ] Glossary and terminology are consistent.
- [ ] Locale-specific evidence, links, offer, SEO, and legal context are valid.
- [ ] Layout constraints are satisfied.

### Brand, conversion, and compliance

- [ ] Product, service, and offer claims match reality.
- [ ] CTA labels and destinations match.
- [ ] Pricing, eligibility, timing, and availability are current.
- [ ] No false urgency, scarcity, guarantee, or dark pattern appears.
- [ ] Required legal, privacy, security, and regulatory reviews are complete.
- [ ] Required disclosures and disclaimers are present.
- [ ] Personal and confidential information is protected.

### Accessibility, media, and links

- [ ] Headings and links support accessible navigation.
- [ ] Media alternatives, captions, and transcripts are complete.
- [ ] Instructions do not rely on one sensory characteristic.
- [ ] Tables and downloads are usable.
- [ ] Asset rights, consent, credits, and versions are correct.
- [ ] All links and anchors resolve to intended destinations.
- [ ] No staging, temporary, private, or unsafe destination remains.

### Issues and approval

- [ ] All `S2–S4` issues have verified outcomes.
- [ ] No `S3–S4` issue remains open.
- [ ] Any permitted residual risk has authorized acceptance.
- [ ] Required specialist sign-offs are recorded.
- [ ] Approval identifies the exact version and scope.
- [ ] Approval conditions are closed.
- [ ] Handoff package is complete.
- [ ] Implementation and production-validation owners are assigned.

---

## 58. Post-publication validation checklist

- [ ] Correct page, domain, path, language, and locale are live.
- [ ] Live content matches the approved version.
- [ ] H1, headings, paragraphs, lists, tables, and callouts render correctly.
- [ ] No text is missing, duplicated, truncated, or corrupted.
- [ ] Armenian, English, Russian, and special characters display correctly.
- [ ] Images, video, charts, downloads, captions, and alt text work.
- [ ] Internal, external, anchor, email, phone, and CTA links work.
- [ ] Forms and primary conversion flows complete successfully.
- [ ] Desktop and mobile layouts preserve meaning and usability.
- [ ] Title, meta description, canonical, robots, hreflang, and structured data are correct.
- [ ] Social preview assets and text are correct where applicable.
- [ ] Redirects and previous URLs behave as specified.
- [ ] Analytics and conversion tracking work where required.
- [ ] Cache, personalization, consent, and locale states show the intended content.
- [ ] No draft, preview, staging, private, or internal instruction is exposed.
- [ ] Any implementation deviation has been reviewed.
- [ ] New production issues are recorded and triaged.
- [ ] Production-validation owner has recorded the result.
- [ ] Final state is `PRODUCTION_VERIFIED` or corrective action is active.

---

## 59. Definition of done

Content is done only when:

- the approved brief and acceptance criteria are fulfilled;
- all required reviews are complete;
- material claims and specialist domains are verified;
- no publication blocker remains;
- issues have traceable outcomes;
- an authorized approver has approved the exact version and scope;
- implementation matches the approved package;
- the live experience has passed production validation;
- ownership, maintenance, and correction routes remain clear.

`APPROVED` is not the same as `PUBLISHED`.

`PUBLISHED` is not the same as `PRODUCTION_VERIFIED`.

The process is complete only when the user can receive the intended content safely, accurately, and as approved.
