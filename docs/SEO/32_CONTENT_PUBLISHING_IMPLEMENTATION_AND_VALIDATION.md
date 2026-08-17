# 32 — Content Publishing, Implementation and Validation

## Table of contents

1. Role of this file
2. Core operating principle
3. Scope
4. Required distinctions
5. Authority and dependency order
6. Publishing lifecycle and states
7. Implementation risk levels
8. Required inputs and entry gate
9. Roles and accountability
10. Publication package and version freeze
11. Environment and access control
12. CMS model and field mapping
13. Page type and template selection
14. URL, slug, and routing implementation
15. Locale and multilingual implementation
16. Visible content implementation
17. Headings and semantic structure
18. Metadata implementation
19. Canonical, robots, and indexation controls
20. Hreflang and language discovery
21. Structured data implementation
22. Links and navigation
23. Redirects and URL migrations
24. Media, files, and asset delivery
25. Accessibility implementation
26. Components, CTAs, forms, and interactions
27. Author, date, ownership, and trust fields
28. Evidence, citations, and disclosures
29. Analytics, events, and campaign attribution
30. Consent, privacy, security, and legal controls
31. Performance and delivery quality
32. Responsive and cross-browser rendering
33. Staging implementation and review
34. Implementation comparison and deviation control
35. Pre-publication technical validation
36. Release planning and scheduling
37. Cache, CDN, and propagation controls
38. Publication execution
39. Production smoke test
40. Production content validation
41. Search and social validation
42. Monitoring and observation window
43. Defect severity and response
44. Rollback, unpublish, and hotfix
45. Emergency publishing
46. Batch, migration, and programmatic publishing
47. AI-assisted implementation and validation
48. Audit trail and retention
49. Handoff to measurement and maintenance
50. Required implementation record
51. Required release and validation record
52. Field-mapping template
53. Implementation quality score
54. Metrics and process improvement
55. Anti-patterns
56. Pre-publication master checklist
57. Post-publication validation checklist
58. Publication blockers
59. Definition of done

---

## 1. Role of this file

This file is the canonical standard for implementing approved Neetrino content in a CMS, application, website, or other publishing system and validating the resulting live experience.

It governs the controlled transition from an approved content package to a production-verified publication.

It answers:

- what must be included in the publishing handoff;
- how approved content maps to system fields and components;
- which implementation changes are permitted;
- what must be tested in staging and production;
- how releases, redirects, tracking, cache, and rollback are controlled;
- what evidence proves that the live result matches the approved intent;
- when publication must stop, be corrected, or be reversed.

This file does not decide whether draft content deserves approval. That authority belongs to `31_CONTENT_QA_REVIEW_AND_APPROVAL.md`. This file ensures that the approved decision is implemented faithfully and safely.

---

## 2. Core operating principle

Publication is complete only when the correct approved version is live at the correct destination, behaves as intended, is machine-readable as specified, and has passed recorded production validation.

The governing rule is:

> Implement from an identified approved package, release through a controlled path, and verify the live result rather than assuming deployment success equals publication success.

A successful CMS save, build, or deployment proves only that a system accepted a change. It does not prove that users, search engines, assistive technologies, analytics tools, or localized routes receive the intended result.

---

## 3. Scope

This standard applies to:

- new pages and page replacements;
- updates, refreshes, corrections, and removals;
- Armenian, English, Russian, and other localized versions;
- service pages, landing pages, articles, case studies, guides, product content, and campaign assets;
- CMS-managed and code-managed content;
- metadata, structured data, redirects, hreflang, canonicals, robots directives, and sitemaps;
- images, video, downloadable files, captions, credits, and alt text;
- CTAs, forms, calculators, accordions, tabs, and other content-bearing interactions;
- analytics events, campaign parameters, consent-dependent tracking, and conversion destinations;
- manual, imported, migrated, templated, and programmatically generated publications;
- staging, preview, production, rollback, and post-release validation.

It does not replace software engineering release standards, infrastructure security policy, visual-design systems, or legal review. It governs those parts of implementation that determine whether published content is correct, discoverable, accessible, measurable, and safe.

---

## 4. Required distinctions

### 4.1 Approved package

The exact version of copy, metadata, assets, instructions, and decisions authorized under `31_CONTENT_QA_REVIEW_AND_APPROVAL.md`.

### 4.2 Implementation

The act of mapping and entering approved material into the target publishing system.

### 4.3 Deployment

The technical release of code, configuration, data, or content to an environment. Deployment may include content but is not synonymous with valid publication.

### 4.4 Publication

The act of making content available at its intended public or authorized destination.

### 4.5 Validation

An evidence-based comparison of the rendered and machine-readable result against explicit requirements.

### 4.6 Smoke test

A rapid check of critical availability, identity, routing, rendering, and primary action immediately after release.

### 4.7 Production verification

The complete applicable post-publication validation that permits the state `PRODUCTION_VERIFIED`.

### 4.8 Deviation

Any difference between the approved package and the implemented result, including visible, behavioral, metadata, asset, or machine-readable differences.

### 4.9 Hotfix

A narrow urgent correction applied to a live defect under controlled change and re-validation.

### 4.10 Rollback

Restoration of a known acceptable prior state or removal of the defective release.

### 4.11 Unpublish

Removal of public availability without necessarily restoring the prior version.

### 4.12 Propagation

The period during which caches, CDNs, search systems, previews, or distributed services may show different versions.

---

## 5. Authority and dependency order

Apply requirements in this order:

1. binding legal, regulatory, contractual, privacy, security, and platform requirements;
2. approved business facts, product truth, and authorized system behavior;
3. the exact approval and QA records from `31_CONTENT_QA_REVIEW_AND_APPROVAL.md`;
4. `25_CONTENT_BRIEF_AND_PAGE_PLANNING.md`;
5. `26_CONTENT_OUTLINE_AND_INFORMATION_ARCHITECTURE.md`;
6. `27_CONTENT_WRITING_AND_EDITORIAL_STANDARDS.md`;
7. `28_ON_PAGE_SEO_AND_CONTENT_OPTIMIZATION.md`;
8. `29_EVIDENCE_EEAT_AND_FACT_CHECKING.md`;
9. `30_MULTILINGUAL_TRANSLATION_AND_LOCALIZATION_STANDARDS.md`;
10. this publishing, implementation, and validation standard;
11. approved channel, template, design-system, analytics, and release instructions;
12. implementer preference.

When requirements conflict, pause the affected unit and obtain an authoritative decision. Do not silently resolve material conflict through layout, rewriting, omission, fallback behavior, or technical convenience.

---

## 6. Publishing lifecycle and states

| State | Meaning | Permitted next states |
| --- | --- | --- |
| `APPROVED` | A named package is authorized for implementation | `PACKAGE_FROZEN`, `REVIEW_EXPIRED` |
| `PACKAGE_FROZEN` | Inputs, identity, and scope are fixed | `IN_IMPLEMENTATION`, `CHANGES_REQUIRED` |
| `IN_IMPLEMENTATION` | Content is being mapped and entered | `STAGING_READY`, `CHANGES_REQUIRED` |
| `STAGING_READY` | Implementation is available for controlled validation | `STAGING_VALIDATED`, `CHANGES_REQUIRED` |
| `STAGING_VALIDATED` | Applicable staging checks passed | `RELEASE_READY`, `CHANGES_REQUIRED` |
| `RELEASE_READY` | Release plan, authority, and rollback path are confirmed | `PUBLISHING`, `REVIEW_EXPIRED` |
| `PUBLISHING` | Release is in progress | `PUBLISHED`, `RELEASE_FAILED` |
| `PUBLISHED` | Intended destination is live; full validation is pending | `PRODUCTION_VERIFIED`, `CORRECTION_REQUIRED`, `ROLLBACK_REQUIRED` |
| `PRODUCTION_VERIFIED` | Live experience passed all applicable checks | `MONITORING`, `CORRECTION_REQUIRED` |
| `MONITORING` | Observation window or normal maintenance is active | `CLOSED`, `CORRECTION_REQUIRED` |
| `CHANGES_REQUIRED` | Implementation or package requires correction | `IN_IMPLEMENTATION`, `READY_FOR_REVIEW` |
| `REVIEW_EXPIRED` | Approval no longer covers the intended release | `READY_FOR_REVIEW` |
| `RELEASE_FAILED` | Publication did not complete as planned | `RELEASE_READY`, `ROLLBACK_REQUIRED` |
| `CORRECTION_REQUIRED` | A live defect requires action | `HOTFIX`, `ROLLBACK_REQUIRED`, `UNPUBLISHING` |
| `HOTFIX` | An authorized urgent correction is in progress | `PUBLISHED`, `ROLLBACK_REQUIRED` |
| `ROLLBACK_REQUIRED` | Prior acceptable state must be restored | `ROLLING_BACK` |
| `ROLLING_BACK` | Reversion is in progress | `ROLLED_BACK`, `RELEASE_FAILED` |
| `ROLLED_BACK` | Prior acceptable state is restored and verified | `CLOSED`, `IN_IMPLEMENTATION` |
| `UNPUBLISHING` | Content is being withdrawn | `UNPUBLISHED`, `RELEASE_FAILED` |
| `UNPUBLISHED` | Intended public access has been removed and verified | `CLOSED`, `IN_IMPLEMENTATION` |
| `CLOSED` | Release record is complete | — |

Every state change must identify the content version, environment, actor, time, and result.

---

## 7. Implementation risk levels

| Level | Typical scope | Minimum control |
| --- | --- | --- |
| `P0` | non-public preview or trivial non-semantic correction | implementer self-check and destination check |
| `P1` | low-risk existing page update with no routing, claim, form, or indexation change | field comparison, staging or preview check, production smoke test |
| `P2` | new standard page, localized page, media change, or metadata change | independent staging validation and recorded production verification |
| `P3` | commercial landing page, URL migration, form, analytics, schema, high-traffic page, or material claim | named release owner, specialist checks, rollback plan, observation window |
| `P4` | legal, privacy, security, health, financial, incident, sitewide, or irreversible/high-impact release | separation of duties, explicit authority, tested rollback, real-time validation and escalation coverage |

Use the highest applicable level. Risk is determined by consequence, reach, reversibility, volatility, and system coupling—not by word count.

---

## 8. Required inputs and entry gate

Implementation may begin only when the package contains, as applicable:

- content ID, exact approved version, and approval record;
- target environment, domain, route, page type, and owner;
- final copy for every in-scope locale;
- title, H1, slug, metadata, canonical, indexation, and hreflang instructions;
- component order, heading hierarchy, and content-field mapping expectations;
- links, CTA labels, destinations, behaviors, and tracking rules;
- assets, filenames, crop guidance, alt text, captions, credits, and licenses;
- structured-data type and source fields;
- author, reviewer, dates, disclosures, and evidence references;
- redirects, retired URLs, and migration rules;
- analytics events, parameters, consent classification, and test method;
- known constraints, approved exceptions, and non-blocking issues;
- implementation validator, release owner, approver, and rollback owner;
- release window and validation deadline.

Reject or return an incomplete package when missing information could change meaning, routing, compliance, discoverability, accessibility, measurement, or rollback safety.

---

## 9. Roles and accountability

### 9.1 Content owner

Owns approved intent, scope, business accuracy, and decisions requiring content authority.

### 9.2 Implementation owner

Maps the approved package into the publishing system and records deviations and technical constraints.

### 9.3 CMS editor or developer

Performs the authorized system change within assigned permissions.

### 9.4 Specialist validator

Validates a defined domain such as SEO, localization, accessibility, analytics, legal controls, security, or structured data.

### 9.5 Release owner

Controls timing, readiness, dependencies, communication, and go/no-go decision execution.

### 9.6 Production validator

Checks the live result independently where risk requires and records the outcome.

### 9.7 Rollback owner

Has access, authority, and instructions to restore or withdraw the release.

### 9.8 Accountable authority

Accepts residual risk and authorizes exceptional or high-risk publication.

For `P3–P4`, the implementer must not be the sole production validator. A person cannot compensate for missing authority by wearing several role labels in the same record.

---

## 10. Publication package and version freeze

Before implementation:

1. assign an immutable package or revision identifier;
2. record included files, locales, assets, and configuration;
3. record the target routes and environments;
4. confirm the approval covers the full intended scope;
5. freeze material copy and instructions;
6. create a change log for implementation-stage decisions;
7. define which fields may receive mechanical formatting only;
8. define re-review triggers.

Permitted mechanical changes may include system-required escaping, typographic normalization, or safe line wrapping when they do not alter meaning or presentation intent.

Any change to claims, numbers, limitations, CTA intent, legal meaning, source, language meaning, URL ownership, indexation, structured data, or conversion behavior invalidates the affected approval until re-reviewed.

---

## 11. Environment and access control

- use the correct account, workspace, project, site, tenant, and locale;
- distinguish local, preview, staging, and production visibly;
- apply least-privilege access;
- require stronger publishing permissions than draft-editing permissions where supported;
- protect production credentials and personal data;
- avoid shared anonymous accounts;
- record material changes by attributable identity;
- verify preview access does not expose confidential or embargoed content;
- ensure staging is blocked from search indexing unless explicitly intended;
- do not copy production personal data into uncontrolled preview environments;
- confirm backups, version history, or another recovery method before `P3–P4` changes.

Never publish merely because the editor interface resembles the intended site. Confirm the environment and canonical domain directly.

---

## 12. CMS model and field mapping

Create an explicit mapping between each approved content unit and its system destination.

At minimum distinguish:

- page name versus browser title;
- H1 versus internal record label;
- visible excerpt versus meta description;
- slug versus full route;
- primary content versus reusable global component;
- image source versus social image;
- alt text versus caption versus credit;
- publication date versus modified date;
- author display name versus internal owner;
- visible FAQ versus structured FAQ fields;
- canonical URL versus current preview URL;
- locale code versus language label;
- CTA display text versus destination and event identifier.

Do not place implementation notes, reviewer comments, placeholder text, source IDs, or internal labels into user-visible fields.

When a CMS cannot represent an approved requirement, record the limitation and obtain a decision before substitution or omission.

---

## 13. Page type and template selection

Verify that the chosen template supports:

- the approved information hierarchy;
- required content components and their order;
- correct heading semantics;
- locale-specific layout and text expansion;
- media dimensions and captions;
- author, date, disclosure, and citation needs;
- schema and metadata requirements;
- form and CTA behaviors;
- accessibility and responsive behavior;
- intended indexation and canonical behavior.

Do not force content into a superficially similar template if it changes page intent, removes required proof, creates duplicate structured data, or makes critical content inaccessible.

---

## 14. URL, slug, and routing implementation

Validate:

- exact protocol, host, subdomain, path, and trailing-slash policy;
- normalized lowercase or platform-approved casing;
- approved locale prefix or domain strategy;
- correct transliteration or localized slug;
- absence of draft IDs, dates, duplicate suffixes, or temporary paths unless approved;
- uniqueness within the routing namespace;
- route collision and reserved-path risks;
- behavior with and without trailing slash, case variants, and common legacy forms;
- consistency between visible links, canonical, hreflang, sitemap, and redirects;
- preservation of query parameters required for function or attribution.

Do not change a live URL solely to make it aesthetically cleaner. Require an approved migration decision and redirect plan.

---

## 15. Locale and multilingual implementation

For every locale:

- map the correct approved translation to the correct route and locale code;
- preserve variables, names, technical terms, numbers, claims, and limitations;
- verify fallback behavior does not mix languages unintentionally;
- verify locale switching preserves equivalent page identity where intended;
- ensure links resolve to the appropriate localized destination or documented fallback;
- test text expansion, line breaks, punctuation, quotation marks, pluralization, and grammatical variables;
- implement localized metadata, structured content, dates, currencies, and formats;
- confirm Armenian characters and Cyrillic text render and encode correctly;
- prevent one locale update from silently overwriting another;
- verify the default locale and missing-translation behavior;
- record intentional non-equivalence or unavailable locales.

Language switching must not redirect users to a non-equivalent homepage when an equivalent page exists.

---

## 16. Visible content implementation

Compare the implemented copy against the approved source for:

- all paragraphs, headings, labels, captions, notes, lists, tables, and quotations;
- punctuation, special characters, superscripts, subscripts, symbols, and non-breaking elements;
- numbers, units, prices, dates, versions, and certainty language;
- emphasis and link boundaries;
- ordered list sequence and table relationships;
- disclaimers, limitations, exceptions, and disclosure placement;
- whitespace or truncation that changes interpretation;
- hidden, collapsed, tabbed, modal, or mobile-only content;
- reusable global content that may affect other pages.

Formatting must support meaning. Do not convert structured lists or tables into visually similar but semantically unrelated blocks without approval.

---

## 17. Headings and semantic structure

- implement one intended primary H1 unless the application has a justified alternative semantic model;
- preserve the logical order of sections;
- use heading levels for hierarchy, not visual size;
- avoid skipped levels that obscure nesting;
- ensure accordion, tab, card, and modal headings remain meaningful;
- confirm repeated component titles do not create misleading structure;
- ensure visually hidden headings are purposeful and accessible;
- keep title, H1, breadcrumb, navigation label, and anchor text distinct when specified;
- verify in rendered markup, not only in the editor.

---

## 18. Metadata implementation

Implement and validate, as applicable:

- HTML title;
- meta description;
- Open Graph title, description, image, URL, and type;
- social-platform equivalents;
- language and locale metadata;
- author and publication metadata;
- app-specific preview fields;
- favicon or brand preview behavior when release-specific;
- feed, card, or listing excerpt;
- filename and MIME metadata for downloadable assets.

Metadata must be localized and aligned with visible truth. It must not introduce unsupported claims, omitted limitations, stale prices, or a different page intent.

Test rendered output and social preview sources where practical; CMS field population alone is insufficient.

---

## 19. Canonical, robots, and indexation controls

Verify:

- the canonical points to the intended normalized production URL;
- self-canonical behavior is correct unless an approved consolidation applies;
- preview, staging, parameter, duplicate, and alternate routes behave as designed;
- robots meta and HTTP headers agree;
- `noindex`, `nofollow`, `nosnippet`, cache, and archive directives are intentional;
- authentication, firewall, or environment rules do not contradict indexation intent;
- canonical is not redirected, blocked, non-200, or mapped to the wrong locale;
- pagination or faceted variants follow the approved strategy;
- sitemap inclusion matches indexation intent.

A canonical is a signal, not an access-control mechanism. Sensitive content must be protected by actual authorization.

---

## 20. Hreflang and language discovery

For localized page groups:

- include every approved equivalent locale;
- use valid language and region codes;
- ensure reciprocal references;
- point each entry to an indexable final URL;
- include self-reference where the implementation strategy requires it;
- use `x-default` only for an intentional default or selector destination;
- avoid mapping non-equivalent pages as translations;
- keep HTML, HTTP, and sitemap implementations consistent;
- verify canonicals do not collapse legitimate locale variants;
- test locale routes after redirects and cache normalization.

---

## 21. Structured data implementation

Structured data must:

- describe visible, current, eligible content;
- use the correct schema type and required properties;
- match names, dates, prices, ratings, author identity, FAQs, and offers shown to users;
- use stable entity identifiers where defined;
- link organizations, authors, services, products, and pages consistently;
- avoid fabricated reviews, ratings, awards, credentials, or availability;
- avoid marking hidden or inaccessible content as visible content;
- use correct locale and URL values;
- contain valid syntax after rendering;
- remain accurate when templates reuse data.

Validate syntax and substantive truth. A green validator does not prove eligibility, accuracy, or search-engine display.

---

## 22. Links and navigation

Validate every material link for:

- correct final destination and locale;
- intended internal or external status;
- meaningful anchor text;
- protocol and domain correctness;
- absence of staging, localhost, editor, signed, expired, or private URLs;
- redirect chain and broken-link behavior;
- fragment and anchor behavior;
- download filename and file type;
- security attributes where needed;
- sponsored, user-generated, or other relationship attributes where applicable;
- opening behavior and focus management;
- analytics parameters without personal or secret data.

Check breadcrumbs, menus, cards, footer links, related content, and programmatic listings—not only links inside body copy.

---

## 23. Redirects and URL migrations

For every changed or retired URL:

- inventory known source variants;
- map each source to the closest valid destination;
- use the approved temporary or permanent redirect status;
- prevent loops, chains, soft 404s, and mass redirects to irrelevant homepages;
- preserve path and parameters only when intentional and safe;
- update internal links, canonical, hreflang, sitemap, and campaign destinations;
- verify old and new routes in production;
- retain redirect ownership and review date;
- plan removal only when evidence and policy permit it.

For content deletion, choose deliberately among redirect, replacement, archive, gone response, authentication, or unpublish. A redirect is not mandatory when no useful equivalent exists.

---

## 24. Media, files, and asset delivery

For each asset verify:

- approved source and version;
- ownership, permission, license, consent, and credit;
- correct crop, orientation, aspect ratio, focal point, and responsive variants;
- legibility of embedded text;
- accurate alt text, caption, transcript, and description where required;
- meaningful filename and correct MIME type;
- compression and quality balance;
- width and height declarations where applicable;
- lazy/eager loading appropriate to position and performance;
- no confidential metadata, hidden layers, comments, or location data remain;
- downloadable files open, are current, and match their labels;
- replacement does not reuse a stale cached asset unintentionally.

Do not use the same alt text as caption by default. They serve different purposes.

---

## 25. Accessibility implementation

Validate at least:

- semantic landmarks and heading order;
- keyboard access and visible focus;
- accessible names for controls, icons, links, and form fields;
- alt text and decorative-image handling;
- labels, instructions, errors, and success messages;
- color contrast and non-color status cues;
- reading order and reflow;
- zoom and text resizing;
- captions, transcripts, and audio controls;
- table headers and relationships;
- descriptive link and button text;
- language declaration and language changes;
- motion, timeout, autoplay, and reduced-motion behavior;
- screen-reader exposure of hidden, collapsed, and dynamic content.

Automated checks may support but must not replace applicable keyboard, screen-reader, and human comprehension checks.

---

## 26. Components, CTAs, forms, and interactions

For every interactive unit verify:

- approved label, hierarchy, destination, and intent;
- all states: default, hover, focus, active, loading, disabled, success, empty, and error;
- validation rules and helpful error copy;
- data submission destination and recipient;
- confirmation page, message, email, or next step;
- duplicate-submission behavior;
- keyboard, touch, and assistive-technology operation;
- required consent and privacy explanation;
- preservation of locale and campaign attribution;
- failure behavior when scripts, APIs, email, CRM, or third parties are unavailable;
- prevention of test submissions reaching live operational queues unless planned;
- rate limiting and abuse controls where applicable.

A visually correct CTA that goes to the wrong destination is a production defect, not a minor design issue.

---

## 27. Author, date, ownership, and trust fields

Implement only verified and approved:

- author or organization identity;
- reviewer identity and role;
- publication and modification dates;
- credentials, affiliations, awards, certifications, and partnerships;
- contact details and responsible owner;
- editorial policy, correction policy, methodology, or disclosure links;
- testimonial and case-study attribution;
- logo and trademark usage.

Do not auto-update a visible “last updated” date when no material review or change occurred. System timestamps are not editorial evidence.

---

## 28. Evidence, citations, and disclosures

- preserve the relationship between each material claim and its supporting source;
- ensure citation numbers, footnotes, anchors, and bibliography entries remain synchronized;
- keep quotations exact and attributed;
- ensure source links resolve to the intended material;
- implement methodology, sample, timeframe, limitation, sponsorship, affiliate, AI, or conflict disclosures where required;
- preserve access dates or archived references when specified;
- protect confidential evidence while showing the approved public substantiation;
- ensure charts and tables retain source and methodology notes;
- prevent tooltips, mobile layouts, or content truncation from hiding essential limitations.

---

## 29. Analytics, events, and campaign attribution

For every required measurement point define and verify:

- event name and version;
- trigger condition;
- page, component, CTA, form, and locale identifiers;
- required properties and allowed values;
- consent category and activation condition;
- deduplication behavior;
- attribution and UTM preservation;
- success versus attempt semantics;
- test environment filtering;
- destination platform and reporting owner;
- exclusion of secrets, sensitive content, and unauthorized personal data.

Test with observable evidence. A tag existing in source code does not prove that it fires once, with correct data, after valid consent.

Do not delay publication for optional analytics unless its absence violates an approved acceptance criterion. Do block publication when measurement is essential to legal compliance, experiment integrity, billing, or the primary business decision.

---

## 30. Consent, privacy, security, and legal controls

Validate:

- only necessary data is requested and transmitted;
- purpose, controller, recipient, and retention information are accurate;
- consent is specific, informed, recorded, and reversible where required;
- non-essential tracking respects the selected consent state;
- form destinations and notifications do not expose data to unauthorized recipients;
- secrets, tokens, internal IDs, personal data, or unpublished information do not appear in markup, URLs, logs, assets, or metadata;
- external embeds and scripts are authorized;
- security headers and framing/download behavior support the intended content;
- disclaimers and required legal text are visible before the relevant decision;
- age, jurisdiction, accessibility, and regulated-content restrictions are implemented;
- retention and deletion behavior matches the approved system design.

Do not use front-end hiding as a substitute for access control.

---

## 31. Performance and delivery quality

Assess content-driven performance risks:

- oversized images, video, fonts, embeds, downloads, and third-party scripts;
- layout shifts caused by missing dimensions or late content;
- blocking media or widgets above the fold;
- duplicate assets or libraries;
- excessive DOM or hidden duplicated locale content;
- font fallback and character coverage for Armenian and Cyrillic text;
- caching suitability and freshness requirements;
- mobile network behavior;
- failure and placeholder states;
- impact on relevant Core Web Vitals or defined performance budgets.

Do not remove essential content, accessibility, evidence, or consent controls merely to improve a score. Optimize the delivery method.

---

## 32. Responsive and cross-browser rendering

Test representative:

- mobile, tablet, laptop, and wide-screen layouts;
- portrait and landscape where relevant;
- supported browsers and operating systems;
- high zoom and increased text size;
- long Armenian, English, and Russian strings;
- tables, code, formulas, quotes, cards, accordions, embeds, and navigation;
- touch target size and sticky elements;
- safe-area and on-screen keyboard behavior;
- image crop and focal point;
- printing or PDF output when a page is intended for it.

Record the supported matrix and any approved limitation. “Works on my screen” is an observation, not a test plan.

---

## 33. Staging implementation and review

Staging or a controlled preview is required for `P2–P4` unless a documented platform constraint and equivalent safe control exists.

The staging review must:

1. confirm environment and package identity;
2. compare visible content with the approved source;
3. inspect rendered metadata and machine-readable output;
4. test locale routing, links, CTAs, forms, and downloads;
5. test responsive and accessibility-critical behavior;
6. test redirects or migration behavior in an equivalent environment;
7. verify analytics without contaminating production data;
8. record defects and closure evidence;
9. confirm no unapproved deviations remain;
10. produce a go, conditional-go, or no-go decision.

Staging validation must account for differences from production, including domains, auth, cache, third-party integrations, secrets, and data.

---

## 34. Implementation comparison and deviation control

Use a combination of:

- source-to-rendered text comparison;
- screenshot or visual comparison;
- DOM and metadata inspection;
- link, status, and redirect tests;
- structured-data validation;
- locale reconciliation;
- asset checksum or version comparison where useful;
- event and form test evidence;
- human review of meaning and experience.

Classify implementation changes using `C0–C4` from `31_CONTENT_QA_REVIEW_AND_APPROVAL.md`.

- `C0–C1`: may be corrected and recorded without substantive re-approval when policy permits;
- `C2`: requires targeted reviewer confirmation;
- `C3–C4`: invalidates affected approval and blocks release until re-reviewed or handled by emergency authority.

Never normalize a deviation by editing the approved source after the fact. The record must show what changed, why, by whom, and under which authority.

---

## 35. Pre-publication technical validation

Before release confirm:

- required checks completed and linked;
- build, preview, or content validation succeeded;
- package and target version match;
- environment variables, integrations, and destinations are correct;
- required URLs are available and conflicts resolved;
- redirects are syntactically and logically valid;
- sitemap, feed, search index, or cache jobs are understood;
- form recipients and notification channels are correct;
- analytics test mode is removed or intentionally retained;
- no placeholder, test, draft, private, or staging identifiers remain;
- backup/version restore and rollback steps are ready;
- monitoring and validation owners are available;
- release timing respects embargoes, campaigns, dependencies, and operational coverage.

---

## 36. Release planning and scheduling

The release plan must define:

- scope and exact version;
- publication window and timezone;
- dependencies and sequencing;
- route, redirect, cache, sitemap, and integration changes;
- named executor and go/no-go authority;
- validation owners and deadlines;
- expected propagation behavior;
- communication recipients;
- rollback trigger, method, owner, and acceptable recovery time;
- observation window;
- contingency for partial success.

Schedule `P3–P4` releases when the required owners can observe and respond. Avoid launching high-impact changes immediately before an unsupported period unless urgency and authority are documented.

---

## 37. Cache, CDN, and propagation controls

Determine before publication:

- which layers cache HTML, API data, assets, redirects, and metadata;
- cache keys, locale variation, and query handling;
- expected TTL and stale behavior;
- revalidation, purge, or versioned-asset method;
- whether social previews or search tools cache prior metadata;
- how to distinguish a local/browser cache issue from origin state;
- propagation time and validation sampling points;
- rollback behavior across all cache layers.

After release, verify from an appropriate uncached or external perspective where possible. Do not repeatedly purge broad caches without understanding impact.

---

## 38. Publication execution

Execute publication in the documented order:

1. reconfirm go/no-go authority and package identity;
2. freeze unrelated changes affecting the same scope where needed;
3. capture the current recoverable state;
4. apply content, configuration, route, redirect, and asset changes;
5. publish or deploy;
6. confirm the operation completed;
7. trigger required revalidation, cache, sitemap, or indexing processes;
8. begin the production smoke test;
9. communicate actual status, not anticipated status;
10. record deviations, failures, and timestamps.

If only part of a coupled release succeeds, treat the result as a release incident until compatibility is proven or the change is completed or rolled back.

---

## 39. Production smoke test

Immediately after release verify the critical path:

- intended production URL resolves;
- response and access behavior are correct;
- correct page, locale, title, H1, and primary content appear;
- primary CTA or user action works;
- critical links, form, or download works;
- no visible error, placeholder, confidential content, or broken layout appears;
- canonical and indexation are not catastrophically wrong;
- redirect-critical old URL behaves correctly;
- essential analytics or consent behavior is not failing dangerously;
- correctable cache state is understood.

Smoke-test failure at material severity triggers hotfix, unpublish, or rollback. Do not wait for the full checklist while users remain exposed to a known critical defect.

---

## 40. Production content validation

Complete the applicable comparison against the approved package:

- all visible content and protected limitations;
- every locale and locale switcher;
- URL, title, H1, metadata, canonical, robots, hreflang, and schema;
- navigation, breadcrumbs, internal links, external references, and redirects;
- images, video, files, captions, credits, and alt text;
- CTA, form, error, success, and downstream notification behavior;
- responsive, browser, keyboard, zoom, and assistive-technology checks;
- analytics events and consent state;
- author, dates, evidence, disclosures, and trust elements;
- performance and cache behavior;
- absence of unrelated regression caused by shared components.

Record evidence proportionate to risk: URLs, timestamps, screenshots, tool outputs, event traces, submission IDs, and reviewer decisions.

---

## 41. Search and social validation

Where applicable verify:

- final URL is reachable by intended crawlers;
- status, canonical, robots, hreflang, and sitemap align;
- rendered structured data is valid and truthful;
- title and description are correct in source/rendered output;
- social preview resolves the intended image, title, description, and URL;
- image dimensions, accessibility, and public access are adequate;
- old URLs redirect as planned;
- search-console or indexing submission is performed only when useful and authorized;
- publication is not claimed as indexed before indexing evidence exists.

Search results and social platforms may retain cached previews. Record propagation separately from implementation correctness.

---

## 42. Monitoring and observation window

Define an observation window according to risk and traffic. Monitor applicable:

- availability, status codes, and error rate;
- form submissions and delivery failures;
- conversion and CTA behavior;
- analytics event volume and anomalies;
- redirects, 404s, crawl issues, and indexation signals;
- performance regressions;
- consent or privacy complaints;
- user feedback and support contacts;
- locale or device-specific failures;
- unexpected changes from editors, sync jobs, imports, or caches.

Separate normal data latency and propagation from true failure. Close the release only after required observations are recorded or formally handed to maintenance.

---

## 43. Defect severity and response

| Severity | Definition | Default response |
| --- | --- | --- |
| `D0` | cosmetic issue with no meaningful usability or content effect | record and schedule |
| `D1` | limited defect with safe workaround and low exposure | correct in normal workflow |
| `D2` | material content, accessibility, SEO, tracking, or functional defect | prioritize correction; targeted re-review and validation |
| `D3` | major user, commercial, legal, privacy, security, or discoverability harm | stop further rollout; hotfix, unpublish, or rollback |
| `D4` | active severe harm, data exposure, dangerous misinformation, or sitewide critical failure | immediate incident response and rollback/unpublish authority |

Severity considers impact, exposure, detectability, reversibility, duration, affected locales, and downstream propagation.

Known `D3–D4` defects block `PRODUCTION_VERIFIED`. A `D2` defect may block it when it affects an acceptance criterion or lacks authorized risk acceptance.

---

## 44. Rollback, unpublish, and hotfix

Before `P3–P4` publication, define:

- rollback unit and known good version;
- recovery steps and permissions;
- database, content, cache, redirect, asset, and integration implications;
- irreversible or externally propagated effects;
- validation after rollback;
- communication and evidence retention.

Use a hotfix only when a narrow correction is safer and faster than rollback. Re-review the affected meaning and controls. Validate the full affected path after correction.

Unpublish when continued exposure is unsafe and no immediately valid replacement exists. Verify removal from routes, listings, navigation, sitemaps, feeds, caches, and public files as applicable.

Rollback success requires validation of the restored state, not merely a successful command or CMS revision action.

---

## 45. Emergency publishing

Emergency workflow may compress checks but must retain:

- verified identity, destination, and core facts;
- named incident or accountable owner;
- explicit omissions and risk acceptance;
- minimum legal, privacy, security, and safety controls;
- primary action and audience verification;
- rollback or withdrawal path;
- immediate production smoke test;
- deadline for full validation and retrospective review.

Emergency authority does not permit invented facts, exposed personal data, unverified safety claims, or publication to an uncertain destination.

---

## 46. Batch, migration, and programmatic publishing

For batch operations:

- freeze and approve template, schema, source data, transformation, and locale rules;
- validate required fields and uniqueness before write;
- create deterministic IDs and traceability;
- run a dry run and inspect representative normal and edge cases;
- define batch size, rate, retry, idempotency, and partial-failure behavior;
- back up or preserve recoverable prior state;
- prevent duplicate pages, slugs, canonicals, entities, and redirects;
- validate all high-risk items and a documented sample of lower-risk items;
- reconcile counts, failures, skipped items, assets, locales, and status states;
- stop the batch when thresholds or blockers are reached;
- verify production programmatically and manually;
- retain item-level exception and correction records.

A valid template cannot correct invalid source data. Sampling cannot replace deterministic validation of fields that can be checked exhaustively.

---

## 47. AI-assisted implementation and validation

AI may assist with:

- field mapping and transformation proposals;
- extraction and comparison of visible copy;
- link, metadata, schema, and locale inventories;
- generation of test cases and checklists;
- detection of discrepancies, placeholders, or broken patterns;
- batch anomaly identification;
- validation summaries and release records.

AI must not:

- receive unauthorized secrets, personal data, confidential drafts, or licensed assets;
- invent missing fields, evidence, translations, metadata, or structured data;
- publish without defined authority;
- act as final legal, privacy, security, accessibility, or high-stakes validator;
- treat visual similarity or validator success as proof of semantic correctness;
- silently rewrite approved copy during formatting or migration.

Human owners remain accountable for decisions, system access, and verification of material AI output.

---

## 48. Audit trail and retention

Retain according to applicable policy:

- approved package and version identity;
- implementation mapping and change log;
- environment, routes, system, template, and component versions;
- staging results and defect closure evidence;
- release plan, go/no-go decision, and executor;
- publication timestamps and production URLs;
- redirect, cache, analytics, form, and integration changes;
- validation evidence and residual risks;
- hotfix, rollback, unpublish, and incident history;
- final state and maintenance handoff.

Records must be sufficient to reconstruct what users received, why it differed if applicable, who authorized it, and how it was validated.

---

## 49. Handoff to measurement and maintenance

After production verification, hand off:

- final canonical URLs and content IDs;
- live version and publication date;
- measurement baseline and event definitions;
- search, conversion, usability, and business objectives;
- known limitations and accepted defects;
- volatile facts, offers, sources, and expiry dates;
- redirect and migration monitoring needs;
- ownership and review cadence;
- correction and escalation channels;
- observation items not yet mature enough to conclude;
- next planned refresh or event-based trigger.

Do not mark early absence of traffic, rankings, or conversions as an implementation failure without considering discovery and data latency.

---

## 50. Required implementation record

```markdown
# Content Implementation Record

## 1. Identity

- Content ID:
- Title:
- Page/content type:
- Approved package/version:
- Approval record:
- Implementation risk: P0/P1/P2/P3/P4
- Target system/project/site:
- Target environments:
- Target locale(s):
- Target URL(s):

## 2. Ownership

- Content owner:
- Implementation owner:
- CMS editor/developer:
- Specialist validator(s):
- Release owner:
- Production validator:
- Rollback owner:
- Accountable authority:

## 3. Mapping and configuration

- Template/component version:
- Field-mapping record:
- Metadata specification:
- Canonical/indexation specification:
- Locale/hreflang specification:
- Structured-data specification:
- Redirect plan:
- Asset inventory:
- CTA/form specification:
- Analytics specification:
- Consent/privacy/security requirements:

## 4. Change log

| Change ID | Approved source | Implemented result | Class C0–C4 | Reason | Authority | Re-review |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

## 5. Staging validation

- Preview/staging identity:
- Version tested:
- Test date:
- Validators:
- Result:
- Defects:
- Closure evidence:
- Go/no-go recommendation:

## 6. Recovery

- Known good version:
- Backup/revision reference:
- Rollback method:
- Unpublish method:
- Irreversible effects:
```

---

## 51. Required release and validation record

```markdown
# Content Release and Production Validation Record

## 1. Release

- Content ID and version:
- Release scope:
- Production destination(s):
- Scheduled time and timezone:
- Actual start/end time:
- Executor:
- Go/no-go authority:
- Dependencies:
- Release result:
- Propagation expectation:

## 2. Production smoke test

- Validator:
- Time:
- URL/status:
- Page/locale identity:
- Primary content:
- Primary action:
- Critical metadata/indexation:
- Critical redirects:
- Result:

## 3. Full validation

| Area | Required | Validator | Result | Evidence | Defect IDs |
| --- | --- | --- | --- | --- | --- |
| Copy and structure | | | | | |
| Locales | | | | | |
| Metadata/SEO | | | | | |
| Schema | | | | | |
| Links/redirects | | | | | |
| Assets/accessibility | | | | | |
| CTAs/forms | | | | | |
| Analytics/consent | | | | | |
| Responsive/browser | | | | | |
| Performance/cache | | | | | |

## 4. Defects and decisions

| Defect ID | Severity D0–D4 | Exposure | Action | Owner | Status |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## 5. Final decision

- Live version matches approved intent: yes/no
- Open blockers: none/list
- Accepted residual risk:
- Final state:
- Production-verified by:
- Verification date/time:
- Observation window:
- Measurement/maintenance handoff:
```

---

## 52. Field-mapping template

```markdown
# Publication Field Map

| Approved unit | Source/version | System field/component | Locale | Rendering rule | Protected constraints | Validator |
| --- | --- | --- | --- | --- | --- | --- |
| Page title | | | | | | |
| H1 | | | | | | |
| Slug/route | | | | | | |
| Meta title | | | | | | |
| Meta description | | | | | | |
| Canonical | | | | | | |
| Robots/indexation | | | | | | |
| Hreflang | | | | | | |
| Body sections | | | | | | |
| CTA/form | | | | | | |
| Assets/alt text | | | | | | |
| Structured data | | | | | | |
| Analytics events | | | | | | |
| Author/dates | | | | | | |
| Evidence/disclosures | | | | | | |
```

---

## 53. Implementation quality score

Score each criterion from `0` to `4`:

- `0` — absent, false, or uncontrolled;
- `1` — materially deficient;
- `2` — partially adequate with important gaps;
- `3` — complete and reliable;
- `4` — complete, verified, traceable, and resilient.

Criteria:

1. approved-package identity;
2. entry-gate completeness;
3. role and authority clarity;
4. field mapping;
5. version and deviation control;
6. URL and routing integrity;
7. multilingual integrity;
8. visible-content fidelity;
9. metadata and indexation integrity;
10. structured-data truth;
11. link and redirect integrity;
12. media and accessibility quality;
13. CTA, form, and interaction behavior;
14. privacy, security, legal, and consent controls;
15. analytics and attribution validity;
16. responsive and performance quality;
17. staging evidence;
18. release and rollback readiness;
19. production validation evidence;
20. monitoring and maintenance handoff.

Maximum score: `80`.

Suggested interpretation:

| Score | Interpretation |
| ---: | --- |
| `72–80` | controlled, production-ready implementation |
| `62–71` | strong with limited non-blocking gaps |
| `50–61` | material controls require improvement |
| `35–49` | high implementation risk |
| `0–34` | uncontrolled; publication prohibited |

Score does not override blockers. A high average cannot compensate for an exposed secret, wrong locale, broken primary form, false claim, or incorrect indexation.

---

## 54. Metrics and process improvement

Track as useful:

- first-pass staging acceptance rate;
- implementation defects per release and page type;
- approved-to-live deviation rate;
- escaped `D2–D4` defects;
- time from approval to publication;
- time from publication to smoke test and full verification;
- rollback and hotfix rate;
- broken link, redirect, form, and tracking rates;
- localization mismatch rate;
- metadata, schema, and indexation defect rate;
- mean time to detect and correct;
- repeated root causes by template, system, team, or workflow;
- percentage of releases with complete records;
- performance regressions attributable to content assets.

Use metrics to improve templates, validation automation, training, permissions, and handoffs. Do not reward speed in a way that encourages skipped validation or hidden defects.

---

## 55. Anti-patterns

Prohibited or unreliable patterns include:

- publishing from an unlabeled “final” document;
- copying content from chat history instead of the approved package;
- editing claims directly in the CMS without re-review;
- using staging URLs in production links or canonicals;
- treating a successful deployment as production validation;
- validating only the desktop default locale;
- populating schema from hidden, stale, or invented data;
- changing a URL without redirects and internal-link updates;
- adding analytics that transmits unauthorized personal data;
- testing a form only up to button click, without confirming receipt;
- assuming metadata because the CMS field is filled;
- leaving `noindex` from staging or removing it without confirming canonical readiness;
- publishing all locales when only one was approved;
- using visual inspection as the only accessibility check;
- purging cache repeatedly instead of identifying the active layer;
- hotfixing production without updating the source record;
- keeping known critical defects live while waiting for a meeting;
- marking validation complete without evidence or a named validator;
- redirecting every removed page to the homepage;
- exposing internal comments, filenames, test records, or credentials;
- relying on AI-generated implementation without material human verification.

---

## 56. Pre-publication master checklist

### Authority and package

- [ ] Content ID and exact approved version are identified.
- [ ] Approval covers every route, locale, and asset in scope.
- [ ] Approval has not expired.
- [ ] Publication package is frozen.
- [ ] Implementation risk `P0–P4` is assigned.
- [ ] Required owners and validators are named.
- [ ] Known exceptions and residual risks are recorded.

### Environment and mapping

- [ ] Target account, project, site, environment, and domain are confirmed.
- [ ] Access follows least privilege.
- [ ] Preview/staging exposure is controlled.
- [ ] Template and component versions are correct.
- [ ] Every approved unit maps to the correct system field.
- [ ] Internal instructions cannot render publicly.
- [ ] CMS limitations and substitutions are approved.

### Content and locales

- [ ] Visible copy matches the approved source.
- [ ] Headings and semantic structure are correct.
- [ ] Numbers, claims, limitations, and disclosures are intact.
- [ ] Lists, tables, quotes, notes, and citations retain meaning.
- [ ] Every locale uses the correct approved version.
- [ ] Locale codes, routes, fallback, and switcher behavior are correct.
- [ ] Armenian, English, and Russian characters render correctly.
- [ ] Dates, currencies, units, and variables are localized correctly.

### URLs and discoverability

- [ ] Slug and full route are approved and unique.
- [ ] Title and meta description are correct by locale.
- [ ] Canonical points to the intended final production URL.
- [ ] Robots directives and access behavior match indexation intent.
- [ ] Hreflang is valid, reciprocal, and equivalent.
- [ ] Structured data is valid, visible, current, and truthful.
- [ ] Sitemap, feed, listing, and search inclusion are planned.
- [ ] Social preview metadata and images are correct.

### Links and migrations

- [ ] Internal and external links resolve correctly.
- [ ] CTA destinations are correct by locale.
- [ ] No staging, private, expired, or placeholder links remain.
- [ ] Download links return the intended current files.
- [ ] Redirect mappings are complete and tested.
- [ ] Redirect loops, chains, and irrelevant destinations are absent.
- [ ] Internal links, canonical, hreflang, and sitemap use final URLs.

### Assets and accessibility

- [ ] Assets are approved, licensed, and correctly attributed.
- [ ] Correct crop, dimensions, compression, and focal point are used.
- [ ] Alt text, captions, transcripts, and credits are implemented.
- [ ] No confidential metadata or hidden content remains in assets.
- [ ] Keyboard and focus behavior work.
- [ ] Controls and form fields have accessible names and labels.
- [ ] Contrast, reflow, zoom, reading order, and table semantics pass.
- [ ] Dynamic and hidden states are correctly exposed.

### Interactions, privacy, and measurement

- [ ] CTA and component states behave correctly.
- [ ] Forms validate, submit, deliver, and confirm correctly.
- [ ] Error and failure states are useful and safe.
- [ ] Recipients and downstream systems are correct.
- [ ] Consent and privacy text appears at the right decision point.
- [ ] Tracking respects consent and excludes unauthorized data.
- [ ] Analytics events fire with correct names, values, and frequency.
- [ ] Test activity is separated from production reporting.

### Technical and release readiness

- [ ] Responsive and supported-browser checks pass.
- [ ] Content assets meet performance expectations.
- [ ] Cache, CDN, and propagation behavior are understood.
- [ ] Staging validation passed and defects are closed.
- [ ] No unapproved `C2–C4` deviations remain.
- [ ] Backup, known good version, and rollback method are ready.
- [ ] Release window, order, dependencies, and authority are confirmed.
- [ ] Production validator and observation coverage are available.

---

## 57. Post-publication validation checklist

### Immediate smoke test

- [ ] Correct production URL resolves with intended status.
- [ ] Correct page, version, and locale are visible.
- [ ] Title, H1, primary content, and primary CTA are correct.
- [ ] Critical form, link, download, or interaction works.
- [ ] No critical visual, confidentiality, legal, or security defect is visible.
- [ ] Canonical, robots, and critical redirect behavior are safe.

### Full production validation

- [ ] Live copy matches the approved package.
- [ ] Every published locale is reconciled.
- [ ] Metadata and social metadata render correctly.
- [ ] Canonical, robots, hreflang, sitemap, and schema align.
- [ ] Links, anchors, downloads, and redirects work.
- [ ] Assets, alt text, captions, and credits are correct.
- [ ] Author, dates, claims, evidence, and disclosures are accurate.
- [ ] Responsive, browser, keyboard, zoom, and accessibility checks pass.
- [ ] CTAs, forms, success/error states, and notifications work end to end.
- [ ] Analytics and consent behavior are verified with evidence.
- [ ] Cache and propagation show the intended version.
- [ ] No unrelated regression appears in shared components or routes.

### Closure and handoff

- [ ] Defects are logged with `D0–D4` severity.
- [ ] Blockers were corrected, rolled back, or unpublished.
- [ ] Hotfixes were reconciled with the approved source and re-reviewed.
- [ ] Production validation evidence is retained.
- [ ] Final state and validator are recorded.
- [ ] Observation window and monitoring owner are active.
- [ ] Measurement and maintenance handoff is complete.

---

## 58. Publication blockers

Publication or `PRODUCTION_VERIFIED` status is blocked when any applicable condition exists:

- no exact approved package or valid approval;
- target account, environment, route, locale, or domain is uncertain;
- unresolved `C3–C4` deviation;
- false, unsupported, materially altered, or legally unsafe content;
- exposed secret, confidential information, or unauthorized personal data;
- missing required consent, privacy, security, legal, or safety control;
- wrong locale, mixed-language critical content, or missing approved limitation;
- broken primary CTA, form, payment, download, or user action;
- form or notification sends data to an incorrect or unauthorized recipient;
- canonical, robots, redirect, or access control creates material discoverability or exposure harm;
- structured data materially contradicts visible truth;
- inaccessible critical action without an approved equivalent;
- missing rollback or withdrawal capability for a `P4` release;
- staging or required specialist validation failed;
- known `D3–D4` production defect;
- production result cannot be identified or compared with the approved version;
- required production validator or accountable authority is unavailable;
- release would violate an embargo, contractual timing, or platform restriction.

Exceptions require documented authority permitted to accept the specific risk. No exception may authorize unlawful publication, deliberate deception, unsafe exposure, or unauthorized data processing.

---

## 59. Definition of done

Content publishing is done only when:

1. an exact, validly approved package entered implementation;
2. all approved units were mapped to identified system fields and components;
3. visible copy, locale, metadata, machine-readable data, assets, links, and interactions were implemented faithfully;
4. material deviations were recorded and re-reviewed at the required level;
5. staging or an authorized equivalent control passed;
6. release authority, sequencing, recovery, and validation ownership were explicit;
7. the intended production destination received the intended version;
8. the critical path passed an immediate smoke test;
9. applicable full production checks passed with evidence;
10. no unresolved publication blocker remains;
11. hotfix, rollback, unpublish, and residual-risk decisions are recorded;
12. the release has a final state, accountable validator, and observation window;
13. canonical URLs, measurement definitions, owners, and maintenance triggers were handed forward.

The terminal success state is `PRODUCTION_VERIFIED`, followed by controlled monitoring or maintenance. “Published” is an event. “Verified” is the completed outcome.
