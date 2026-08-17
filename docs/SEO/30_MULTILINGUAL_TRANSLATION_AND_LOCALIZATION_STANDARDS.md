# 30 — Multilingual Translation and Localization Standards

## Table of contents

1. Role of this file
2. Core operating principle
3. Scope
4. Required distinctions
5. Authority and dependency order
6. Supported languages and locale assumptions
7. Source-of-truth policy
8. Minimum inputs
9. Translation modes
10. Translation lifecycle and states
11. Semantic-equivalence standard
12. Meaning hierarchy
13. Permission to restructure
14. Prohibited translation behavior
15. Ambiguity and missing-context protocol
16. Content-unit segmentation
17. Terminology governance
18. Translation memory and repeated strings
19. Proper nouns, brands, products, and services
20. Abbreviations, acronyms, and technical terms
21. Numbers, currencies, units, dates, and time
22. Links, files, email addresses, and identifiers
23. Tone, voice, and register
24. Armenian standards
25. English standards
26. Russian standards
27. Cross-language style equivalence
28. Headings, titles, and metadata
29. SEO localization
30. CTA and conversion language
31. UI and product-interface localization
32. Service and sales content
33. Technical and instructional content
34. Evidence, claims, and citations
35. Legal, privacy, security, and high-stakes content
36. Tables, lists, captions, and structured fields
37. Images, screenshots, and media text
38. Accessibility and inclusive language
39. Length, layout, and design constraints
40. Multilingual URL and hreflang handoff
41. AI-assisted translation
42. Human-review requirements
43. Translation workflow
44. Back-check and cross-language reconciliation
45. Change control and source updates
46. Issue severity and publication blockers
47. Translation record template
48. Terminology record template
49. Localization decision record
50. Quality score
51. Issue taxonomy
52. Anti-patterns
53. Pre-publication checklist
54. Post-publication validation
55. Definition of done

---

## 1. Role of this file

This file is Neetrino's canonical standard for translating and localizing approved content among Armenian, English, and Russian.

It governs how meaning, intent, factual accuracy, brand voice, terminology, search intent, conversion purpose, and user experience survive across languages. It applies to website pages, articles, case studies, landing pages, service descriptions, interfaces, metadata, social content, documents, emails, presentations, and reusable content components.

This file does not replace:

- content strategy;
- research and evidence verification;
- content briefs and outlines;
- editorial standards;
- on-page SEO decisions;
- legal review;
- product-design localization requirements.

It begins when a source text or approved content specification exists.

## 2. Core operating principle

Translate the intended meaning and user effect, not the visible word order.

Every language version must be:

- factually equivalent;
- natural to a competent native reader;
- appropriate for the same audience and journey stage;
- consistent with approved terminology;
- faithful to the source's certainty, limitations, and conversion purpose;
- independently readable without access to the source language.

Literal similarity is not proof of accuracy. A translation is correct when the target reader receives the same defensible message, not when the sentences have the same shape.

## 3. Scope

This standard applies to:

- Armenian → English;
- Armenian → Russian;
- English → Armenian;
- English → Russian;
- Russian → Armenian;
- Russian → English;
- creation of three synchronized HY, EN, and RU versions from one approved master;
- localization of language-specific search, interface, cultural, and formatting elements;
- later updates to any synchronized language set.

Machine output, AI output, human translation, and hybrid workflows are held to the same final quality standard.

## 4. Required distinctions

### 4.1 Translation

Transfer of meaning from a source language into a target language while preserving the source's communicative purpose.

### 4.2 Localization

Adaptation for target-language conventions, reader expectations, market context, formats, search behavior, interface constraints, and cultural clarity.

### 4.3 Transcreation

Controlled rewriting used when a headline, slogan, campaign line, metaphor, joke, or CTA cannot produce the intended effect through direct translation. Transcreation must preserve the approved strategic purpose and must be recorded.

### 4.4 Editing

Improvement of clarity, grammar, structure, or style within one language. Editing must not be disguised as translation when it materially changes the source claim.

### 4.5 Transliteration

Representation of a name or term in another writing system. Transliteration does not translate meaning.

### 4.6 Semantic equivalence

The degree to which source and target communicate the same proposition, intent, scope, certainty, conditions, and implications.

### 4.7 Locale

A language-market context that determines conventions such as spelling, date format, currency display, units, punctuation, address format, and terminology.

### 4.8 Source of truth

The approved language version or structured content specification from which synchronized versions are derived.

## 5. Authority and dependency order

When instructions conflict, use this order:

1. verified facts, legal requirements, and approved source meaning;
2. explicit project or page brief;
3. approved terminology and brand/service knowledge;
4. this translation and localization standard;
5. language-specific editorial standards;
6. SEO and conversion requirements;
7. layout or character preferences;
8. stylistic preference.

SEO, design, fluency, or persuasion must never alter a verified fact, contractual meaning, price, limitation, consent statement, or security claim.

## 6. Supported languages and locale assumptions

Unless a project specifies otherwise:

| Code | Language | Default working locale |
| --- | --- | --- |
| `hy` | Armenian | Armenia |
| `en` | English | International business English |
| `ru` | Russian | General Russian for Armenia/CIS audiences |

The default locale is not permission to invent market-specific facts. Record any narrower locale, such as US English, UK English, or Russia-specific legal terminology.

## 7. Source-of-truth policy

Every multilingual content set must have one declared source of truth.

The record must identify:

- source language;
- source file, page, field set, or version;
- approval status;
- approval date;
- owner;
- whether translators may correct obvious errors;
- whether one target version may become a new source.

If three drafts differ and no authoritative source exists, stop synchronization and request a content decision. Do not silently create a fourth meaning by averaging them.

Corrections found during translation must be made in or formally reconciled with the source of truth before publication.

## 8. Minimum inputs

Before translation, obtain or explicitly mark as unavailable:

- approved source text;
- content type and destination;
- target language and locale;
- intended audience;
- desired action or conversion goal;
- approved terminology or glossary;
- brand, product, and service names;
- SEO query map when search localization is required;
- character, component, or layout constraints;
- variables, placeholders, code fragments, and protected strings;
- evidence or citation dependencies;
- reviewer and approval owner;
- deadline and publication channel.

Unknown inputs must become visible assumptions, not silent inventions.

## 9. Translation modes

### 9.1 Faithful editorial translation

Default for articles, service pages, cases, reports, and general website copy. Preserve meaning while allowing natural restructuring.

### 9.2 Controlled translation

Required for UI strings, technical instructions, policies, structured fields, reusable modules, and content with variables. Terminology and structural constraints are strict.

### 9.3 SEO localization

Used when target-language query behavior has been researched. Keywords, titles, headings, slugs, and answer units may be adapted without changing the page's canonical purpose.

### 9.4 Transcreation

Used for slogans, campaign hooks, wordplay, emotionally loaded headlines, and culturally dependent examples. Requires explicit rationale and approval.

### 9.5 Summary translation

Produces a shorter target version. This is not equivalent translation and must be labeled as a summary.

### 9.6 Certified or regulated translation

Outside the default workflow. Use a qualified legal, medical, financial, or certified translator when required by law, contract, or risk.

## 10. Translation lifecycle and states

Use these states:

1. `NOT_READY` — source is missing, unstable, or unapproved;
2. `READY` — inputs and source are sufficient;
3. `IN_TRANSLATION` — target draft is being produced;
4. `LINGUISTIC_REVIEW` — accuracy and naturalness are being checked;
5. `DOMAIN_REVIEW` — terminology, claims, or regulated meaning are being checked;
6. `RECONCILIATION` — source and target discrepancies are being resolved;
7. `APPROVED` — responsible reviewer has approved the target version;
8. `IMPLEMENTED` — approved copy is in the intended system;
9. `VALIDATED` — rendered or published output has been checked;
10. `STALE` — source changed after approval or evidence expired.

Only `APPROVED` content may proceed to implementation. Only `VALIDATED` content is complete.

## 11. Semantic-equivalence standard

The target must preserve:

- who performs the action;
- what happens;
- to whom or to what;
- time frame;
- quantity and scope;
- conditions and exceptions;
- degree of certainty;
- causal or comparative relationship;
- benefit and limitation;
- emotional intensity;
- requested user action;
- legal or operational consequence.

Review propositions, not word pairs. For every material sentence, ask: would a reasonable HY, EN, and RU reader reach the same practical conclusion?

## 12. Meaning hierarchy

When perfect one-to-one transfer is impossible, preserve in this order:

1. factual and legal meaning;
2. safety and operational meaning;
3. scope, conditions, and certainty;
4. user intent and action;
5. brand position and tone;
6. rhetorical effect;
7. sentence rhythm and surface resemblance.

Never sacrifice levels 1–4 to preserve a rhyme, joke, idiom, or keyword.

## 13. Permission to restructure

Translators may:

- split or combine sentences;
- change clause order;
- replace an idiom with a natural equivalent;
- convert a noun-heavy structure into an action-led sentence;
- repeat a subject when the target language needs clarity;
- remove redundant pronouns or restore omitted ones;
- adapt punctuation and paragraph breaks;
- replace an example only when localization is approved and the same lesson remains valid.

They may not:

- add a new claim or benefit;
- remove a limitation, condition, or objection;
- strengthen certainty;
- change the target audience;
- alter prices, timelines, responsibilities, metrics, or scope;
- turn an observation into a fact;
- turn a recommendation into a guarantee.

## 14. Prohibited translation behavior

Do not:

- translate word for word when it produces unnatural or misleading language;
- preserve source syntax at the expense of readability;
- invent missing context;
- use dictionary synonyms without domain verification;
- translate brand or product names without authorization;
- translate code, variables, URLs, file names, IDs, or placeholders accidentally;
- convert `may`, `can`, `typically`, or `up to` into certainty;
- omit negatives, exceptions, disclaimers, or comparison baselines;
- localize evidence to another market without supporting evidence;
- use different terms for the same concept merely for stylistic variety;
- create target-language keyword stuffing;
- publish raw AI or machine translation.

## 15. Ambiguity and missing-context protocol

When the source permits more than one material interpretation:

1. mark the exact ambiguous segment;
2. state the plausible interpretations;
3. identify the decision impact;
4. ask the content owner or domain expert;
5. record the approved interpretation;
6. update the source when possible;
7. translate only after resolution.

Low-impact ambiguity may be resolved by the translator when context makes one reading clearly more natural. Material ambiguity involving facts, obligations, security, privacy, money, dates, technical behavior, or conversion promises is blocking.

## 16. Content-unit segmentation

Translate by meaningful content unit, not arbitrary line break.

Valid units include:

- page title;
- heading and its section;
- paragraph;
- list item set;
- CTA with surrounding context;
- UI label with component context;
- table row or structured field;
- reusable module;
- metadata set.

Keep context notes with short or ambiguous strings. `Apply`, `Plan`, `Order`, `Save`, or `Close` cannot be translated reliably without knowing whether each is a noun, verb, status, or action.

## 17. Terminology governance

Maintain one terminology base for recurring business, technical, product, SEO, legal, and brand concepts.

Each approved term must include:

- concept ID;
- source term;
- Armenian equivalent;
- English equivalent;
- Russian equivalent;
- definition;
- part of speech when relevant;
- approved context;
- prohibited or deprecated alternatives;
- capitalization and inflection notes;
- source or approval owner;
- review date.

Term consistency outranks stylistic synonym variety. A concept must not change names within one page or user flow unless the distinction is intentional.

If no clean Armenian or Russian equivalent exists, use the most natural established form, explain it on first use when necessary, and record the decision.

## 18. Translation memory and repeated strings

Reuse approved translations when the source meaning and context are identical.

Do not reuse mechanically when:

- the same word has a different function;
- the audience or locale differs;
- the surrounding sentence changes meaning;
- the previous translation is stale or incorrect;
- character constraints require a different approved form.

Repeated interface strings must remain consistent across screens. Repeated marketing sentences may be adjusted for flow only if semantic equivalence remains intact.

## 19. Proper nouns, brands, products, and services

- Preserve registered brand spelling.
- Use an officially localized name when the owner provides one.
- Do not translate legal entity names unless an official equivalent exists.
- Transliterate personal and geographic names consistently.
- Prefer the person's stated Latin spelling over generating a new transliteration.
- Preserve product model numbers, plan names, version names, and trademarks.
- Translate a descriptive service name only when it functions as generic content or an approved localized label.
- Record grammatical inflection decisions for names used in Armenian or Russian prose.

## 20. Abbreviations, acronyms, and technical terms

On first use, apply the target language's natural pattern:

- full target-language term plus established acronym;
- established English term plus a concise local explanation;
- acronym alone when the audience reliably knows it.

Do not create unofficial acronym translations. Preserve code tokens, API names, library names, database fields, commands, and protocol names exactly. Put user-facing explanations around them in the target language.

Technical precision outranks the desire to eliminate every English term.

## 21. Numbers, currencies, units, dates, and time

### 21.1 Preserve values

Never change a number merely because another value seems more natural in the target market.

### 21.2 Localize presentation

Localize separators, currency placement, date order, time format, and unit spacing according to the approved locale and design system.

### 21.3 Convert only with authorization

Currency or unit conversion requires:

- an approved conversion rule;
- exchange-rate or formula source;
- rate date when relevant;
- rounding rule;
- indication that the converted value is approximate when appropriate.

### 21.4 Preserve relationships

Check:

- percentages versus percentage points;
- ranges;
- `from`, `up to`, `more than`, and `less than`;
- inclusive or exclusive dates;
- singular/plural agreement;
- decimal and thousands separators;
- time zone.

Use explicit month names where numeric dates could be misread across locales.

## 22. Links, files, email addresses, and identifiers

- Preserve destination URLs unless a verified localized destination exists.
- Translate anchor text naturally while preserving destination meaning.
- Do not alter email addresses, phone numbers, order IDs, SKUs, API keys, route parameters, or database values.
- Preserve file extensions and code-sensitive filenames.
- Localize a downloadable file label only if the target file is available in that language.
- Do not imply that a linked page is localized when it is not.

## 23. Tone, voice, and register

Preserve the source's relationship with the reader:

- formal or conversational;
- expert or introductory;
- direct or consultative;
- restrained or energetic;
- analytical or promotional;
- individual or institutional voice.

Do not preserve linguistic habits that sound rude, inflated, vague, or childish in the target language. Match communicative distance, not pronoun mechanics alone.

The translation must maintain Neetrino's default voice: clear, competent, practical, evidence-aware, commercially useful, and free of empty technological grandeur.

## 24. Armenian standards

Armenian output must:

- read as original Armenian rather than translated syntax;
- use clear contemporary Eastern Armenian unless another variant is specified;
- prefer direct, understandable phrasing over bureaucratic calques;
- avoid unnecessary Russian or English sentence structures;
- retain English technical terms only when they are established, precise, or useful to the audience;
- explain unfamiliar borrowed terms on first use;
- use Armenian punctuation consistently;
- maintain grammatical agreement around borrowed words and brand names;
- avoid excessive nominalization and overlong chained clauses;
- use `դուք` consistently when formal reader address is intended;
- avoid switching unpredictably between Armenian and Latin spellings.

Where Armenian terminology is unstable, prioritize comprehension and consistency. Do not invent opaque neologisms merely to avoid a familiar international term.

## 25. English standards

English output must:

- use international business English unless a locale is specified;
- sound concise and natural, not like Armenian or Russian syntax in English words;
- prefer active, concrete constructions;
- avoid unnecessary articles, prepositions, or article omission caused by source-language transfer;
- use consistent US or UK spelling within one property;
- avoid promotional superlatives unless verified and approved;
- preserve distinctions among `must`, `should`, `may`, `can`, and `will`;
- avoid translating respectful forms into unnatural formality;
- use sentence case or title case according to the design/content standard;
- keep technical terminology consistent with official English documentation.

## 26. Russian standards

Russian output must:

- read as natural contemporary professional Russian;
- avoid Armenian-influenced word order and excessive English calques;
- use formal `вы` consistently unless the brand explicitly chooses another register;
- follow the project's capitalization policy for `вы/Вы`;
- avoid inflated bureaucratic language and stacked verbal nouns;
- preserve aspect, modality, negation, and condition accurately;
- use accepted Russian technical terms while retaining official English product names;
- maintain correct case agreement around numbers, brands, and borrowed terms;
- use `ё` according to the project's declared style, consistently;
- avoid market-specific legal terms unless the content is actually valid for that jurisdiction.

## 27. Cross-language style equivalence

HY, EN, and RU versions need not have identical:

- sentence count;
- word count;
- paragraph length;
- idioms;
- punctuation;
- rhetorical order;
- pronoun frequency.

They must have equivalent:

- message priority;
- factual content;
- reader difficulty;
- confidence level;
- emotional weight;
- objection handling;
- next action.

Do not make one language version noticeably more detailed, persuasive, cautious, or technically precise unless a recorded localization requirement justifies it.

## 28. Headings, titles, and metadata

Translate headings as standalone navigation and promise units.

- Preserve hierarchy and section purpose.
- Avoid target headings that are grammatical but vague outside the paragraph.
- Localize title rhythm and information order.
- Keep title, H1, meta description, social title, and navigation label distinct where their functions differ.
- Never truncate meaning solely to match the source's character count.
- When a hard limit applies, produce an approved short form and record the omitted nuance.

## 29. SEO localization

SEO localization requires target-language search evidence. A source-language keyword is not automatically the target keyword.

For each language:

1. preserve page intent and canonical topic ownership;
2. research actual target-language query phrasing when authorized;
3. map primary and supporting queries;
4. adapt title, H1, headings, opening, anchors, alt text, and metadata naturally;
5. preserve factual and conversion equivalence;
6. prevent cannibalization within that language;
7. validate rendered metadata and indexing signals.

Do not translate keywords literally, insert awkward variants, or change service positioning to chase search volume. If no research exists, deliver a semantically accurate translation and label SEO localization as pending.

## 30. CTA and conversion language

Translate the action, commitment level, and expected outcome.

Check whether the CTA:

- opens a form;
- starts checkout;
- requests consultation;
- downloads a file;
- creates an account;
- submits data;
- triggers payment;
- merely navigates.

Use natural target-language verbs. Preserve urgency only when it exists and is defensible. Do not turn `Learn more` into `Buy now`, `Request a quote` into `Get a guaranteed price`, or a low-commitment CTA into a higher-commitment action.

CTA labels, nearby reassurance, form heading, confirmation message, and destination page must remain semantically aligned.

## 31. UI and product-interface localization

Every UI string must include sufficient context:

- component and screen;
- noun or verb function;
- user role;
- state;
- variable definitions;
- character constraint;
- plural behavior;
- error or success condition.

Preserve placeholders exactly, including braces, percent syntax, HTML, Markdown, ICU syntax, escape characters, and interpolation keys.

Localize:

- buttons;
- field labels;
- helper text;
- errors;
- validation messages;
- statuses;
- empty states;
- notifications;
- permissions;
- onboarding;
- confirmation and destructive-action warnings.

Test strings inside the actual interface. A correct spreadsheet translation can still be an unusable button.

## 32. Service and sales content

Preserve:

- service scope;
- included and excluded work;
- delivery model;
- audience qualification;
- business outcome;
- prerequisite;
- timeline;
- price logic;
- proof;
- CTA.

Do not strengthen claims for fluency. Terms such as `automation`, `AI integration`, `custom`, `secure`, `scalable`, `real-time`, `end-to-end`, and `guaranteed` require the same approved meaning in all languages.

## 33. Technical and instructional content

Technical translations must preserve:

- sequence;
- prerequisites;
- system names;
- commands and code;
- field names;
- warnings;
- expected results;
- failure conditions;
- version applicability.

Translate explanations, not executable content. Verify official product terminology against current primary documentation when accuracy depends on version. Do not simplify away a condition that makes an instruction safe or correct.

## 34. Evidence, claims, and citations

Every translated claim inherits the source's evidence status, not additional authority.

- Preserve citation-to-claim proximity.
- Preserve quotation meaning and attribution.
- Do not translate a quotation as if it were verbatim unless an official target-language quotation exists.
- Label translated quotations appropriately when required.
- Preserve source title and publisher names; translate descriptive labels only when useful.
- Verify that evidence is applicable to the target market and date.
- Do not replace a source with a target-language source unless the replacement supports the same claim at equal or higher quality.

If localization introduces a new market-specific claim, create a new evidence record.

## 35. Legal, privacy, security, and high-stakes content

Legal terms, consent language, privacy notices, payment terms, warranties, security statements, medical claims, financial statements, and regulated instructions require domain review.

The translator must not:

- reinterpret an obligation;
- import a legal concept from another jurisdiction;
- remove a liability limitation;
- broaden consent;
- narrow a user right;
- promise absolute security;
- translate a defined term inconsistently;
- replace qualified advice with a directive.

When an official or certified version is required, the content remains blocked until qualified approval is recorded.

## 36. Tables, lists, captions, and structured fields

- Preserve row and column relationships.
- Translate labels consistently with surrounding prose.
- Keep units attached to the correct values.
- Recalculate sorting only if localization requires it and data ownership permits it.
- Preserve footnote markers and definitions.
- Do not merge structured fields merely to sound natural.
- Translate captions according to what the visual actually shows.
- Check plural and grammatical forms in dynamic fields.

## 37. Images, screenshots, and media text

Inventory all visible language inside:

- screenshots;
- diagrams;
- charts;
- video subtitles;
- audio transcripts;
- thumbnails;
- banners;
- image alt text;
- downloadable assets.

Do not claim full localization while key instructional or conversion text remains in another language without explanation. Preserve image evidence faithfully; do not edit values or UI states while replacing labels.

## 38. Accessibility and inclusive language

- Preserve heading logic and link purpose.
- Translate alt text by describing the same meaningful content, not by translating filenames.
- Keep instructions independent of color, position, or sound alone.
- Avoid target-language stereotypes or exclusionary assumptions.
- Maintain respectful terminology for people, roles, disability, age, and identity.
- Ensure screen-reader labels express the actual action.

## 39. Length, layout, and design constraints

Target-language expansion is normal. Design must accommodate language, not force misleading abbreviation.

When space is constrained:

1. preserve action and safety meaning;
2. remove redundancy;
3. choose a shorter natural equivalent;
4. move explanation to helper text when UX permits;
5. revise the component;
6. create an approved short label plus accessible full label.

Never reduce a material warning, condition, price basis, or consent statement merely to fit a component.

## 40. Multilingual URL and hreflang handoff

Translation owners must provide implementation teams with:

- language and locale code;
- localized slug decision;
- canonical language owner;
- alternate-language mapping;
- translated navigation and breadcrumbs;
- indexation intent;
- fallback behavior;
- language-switch destination.

Language switching must lead to the equivalent page when it exists, not automatically to the homepage. Hreflang, canonical, sitemap, and routing implementation belong to technical SEO/development validation.

## 41. AI-assisted translation

AI may assist with:

- first drafts;
- terminology candidate generation;
- repeated-string consistency checks;
- omission and number comparison;
- grammar and fluency review;
- back-check summaries;
- variant generation under explicit constraints.

AI must not be treated as:

- an authority on ambiguous source meaning;
- proof of terminology correctness;
- a native reviewer by default;
- a legal or domain approver;
- a source of invented market facts;
- permission to publish without review.

Prompts must include source text, target locale, audience, content type, glossary, protected strings, tone, constraints, and required output structure. Sensitive content must follow approved privacy and confidentiality rules.

## 42. Human-review requirements

At least one competent reviewer must verify every public-facing target version.

Native or near-native review is mandatory for:

- key website pages;
- paid campaigns;
- high-visibility thought leadership;
- sales and pricing pages;
- UI flows involving payment, permissions, or destructive actions;
- legal, privacy, security, medical, or financial content;
- transcreated headlines and slogans.

Domain review is separate from language review. A fluent reviewer may confirm naturalness but still miss a wrong technical or contractual meaning.

## 43. Translation workflow

### Stage 1 — Establish source

Confirm the approved source of truth, version, scope, owner, and target locales.

### Stage 2 — Prepare context

Collect audience, journey, page type, glossary, constraints, variables, evidence, and screenshots.

### Stage 3 — Extract protected elements

Mark names, numbers, citations, code, placeholders, legal definitions, URLs, and terms that must not change.

### Stage 4 — Build term map

Resolve important concepts across HY, EN, and RU before drafting long-form content.

### Stage 5 — Translate for meaning

Produce a complete natural target draft while preserving proposition-level equivalence.

### Stage 6 — Self-review against source

Check omissions, additions, negation, modality, numbers, names, conditions, and CTA behavior.

### Stage 7 — Edit target independently

Read the target without looking at the source. Improve fluency, structure, tone, and clarity without changing meaning.

### Stage 8 — Linguistic review

A competent reviewer checks correctness, naturalness, grammar, terminology, and audience fit.

### Stage 9 — Domain and evidence review

Verify technical, commercial, legal, quantitative, and market-specific meaning.

### Stage 10 — Reconcile all languages

Compare the approved HY, EN, and RU versions at claim and content-unit level.

### Stage 11 — Implement

Place approved content in the actual website, CMS, UI, document, or campaign.

### Stage 12 — Rendered validation

Check truncation, links, metadata, variables, responsive layout, language switching, and interaction behavior.

### Stage 13 — Approve and record

Store status, reviewers, decisions, version, and next review date.

## 44. Back-check and cross-language reconciliation

Back-translation may reveal discrepancies but is not a quality guarantee. Use a proposition matrix for material content:

| Meaning unit | HY | EN | RU | Status |
| --- | --- | --- | --- | --- |
| Core promise | equivalent text | equivalent text | equivalent text | pass/fail |
| Scope | equivalent text | equivalent text | equivalent text | pass/fail |
| Limitation | equivalent text | equivalent text | equivalent text | pass/fail |
| Evidence | equivalent text | equivalent text | equivalent text | pass/fail |
| CTA | equivalent text | equivalent text | equivalent text | pass/fail |

Reconciliation must check:

- missing or extra sections;
- changed numbers or dates;
- stronger or weaker claims;
- inconsistent terminology;
- different service scope;
- citations attached to different propositions;
- divergent CTA commitment;
- locale-only adaptations without records.

## 45. Change control and source updates

Every approved language version must retain its source version.

When the source changes:

1. classify the change as cosmetic, linguistic, factual, structural, strategic, or legal;
2. identify affected target units;
3. mark affected translations `STALE`;
4. update all languages from the approved change;
5. repeat the required review level;
6. validate implementation;
7. record completion.

Do not overwrite a target translation without knowing whether the source changed. Do not leave one language silently behind after a material update.

### Change severity

| Level | Description | Required review |
| --- | --- | --- |
| `T0` | formatting only; no linguistic effect | implementation check |
| `T1` | grammar or non-material wording | linguistic review |
| `T2` | terminology, CTA, metadata, or structural change | linguistic + content-owner review |
| `T3` | claim, number, scope, evidence, or technical change | linguistic + domain review |
| `T4` | legal, privacy, security, payment, or high-stakes change | qualified domain approval |

## 46. Issue severity and publication blockers

### Critical

Changes legal meaning, safety, payment, privacy, security, medical/financial meaning, or a material business commitment. Publication is blocked.

### Major

Changes a claim, audience, scope, certainty, metric, condition, CTA, or key terminology. Publication is blocked until corrected and reviewed.

### Moderate

Reduces clarity, consistency, naturalness, accessibility, SEO alignment, or UI usability without materially changing the proposition. Correct before publication unless an owner accepts the risk.

### Minor

Punctuation, spacing, or stylistic improvement with no effect on meaning or usability. May be scheduled when the version otherwise passes.

Blocking conditions include:

- no declared source of truth;
- material ambiguity;
- untranslated or corrupted protected string;
- mismatch in price, number, date, scope, limitation, or CTA;
- missing legal/domain approval;
- raw machine translation;
- target text that a competent reader cannot understand naturally;
- stale target after material source change;
- broken localized route or language switch;
- misleading localized evidence.

## 47. Translation record template

```markdown
## Translation record

- Content ID:
- Title:
- Content type:
- Destination:
- Source language:
- Source version:
- Source owner:
- Source approval status/date:
- Target language:
- Target locale:
- Translation mode:
- Audience:
- User action:
- Glossary version:
- Protected strings:
- SEO localization required: yes/no
- Character/layout constraints:
- Translator:
- Linguistic reviewer:
- Domain reviewer:
- Approval owner:
- Translation status:
- Change severity:
- Open ambiguities:
- Localization decisions:
- Evidence changes:
- Implementation location:
- Validation status/date:
- Next review date:
```

## 48. Terminology record template

```markdown
## Terminology record

- Concept ID:
- Definition:
- Armenian term:
- English term:
- Russian term:
- Approved context:
- Part of speech:
- Capitalization:
- Inflection notes:
- First-use explanation:
- Do not use:
- Official source:
- Approval owner:
- Approval date:
- Review date:
```

## 49. Localization decision record

```markdown
## Localization decision

- Content ID/unit:
- Target language/locale:
- Source text or concept:
- Direct translation considered:
- Problem with direct translation:
- Approved localized version:
- Meaning preserved:
- Market-specific evidence:
- SEO evidence, if applicable:
- Risk level:
- Decision owner:
- Approval date:
```

## 50. Quality score

Score each criterion from `0` to `2`:

- `0` — absent, wrong, or unsafe;
- `1` — partially acceptable or needs revision;
- `2` — complete and publication-ready.

| # | Criterion | Score |
| --- | --- | --- |
| 1 | Source of truth is identified and approved | 0–2 |
| 2 | Complete content coverage | 0–2 |
| 3 | Proposition-level semantic equivalence | 0–2 |
| 4 | Facts, names, numbers, and dates | 0–2 |
| 5 | Conditions, limitations, and negation | 0–2 |
| 6 | Certainty and claim strength | 0–2 |
| 7 | Terminology consistency | 0–2 |
| 8 | Target-language grammar | 0–2 |
| 9 | Native naturalness | 0–2 |
| 10 | Voice, tone, and register | 0–2 |
| 11 | Audience and journey fit | 0–2 |
| 12 | CTA and conversion equivalence | 0–2 |
| 13 | Evidence and citation integrity | 0–2 |
| 14 | SEO localization | 0–2 |
| 15 | UI, variables, and protected strings | 0–2 |
| 16 | Locale formats and conventions | 0–2 |
| 17 | Accessibility | 0–2 |
| 18 | Layout and rendered usability | 0–2 |
| 19 | Review and approval completeness | 0–2 |
| 20 | Cross-language synchronization | 0–2 |

Maximum: `40`.

- `37–40`: publication-ready if no blocker exists;
- `33–36`: minor revision required;
- `27–32`: substantial revision required;
- below `27`: retranslation or major reconciliation required.

A high total never overrides a critical or major error.

## 51. Issue taxonomy

Use these codes:

| Code | Issue |
| --- | --- |
| `TR-SRC` | source-of-truth or version problem |
| `TR-OMI` | omission |
| `TR-ADD` | unsupported addition |
| `TR-MEA` | meaning distortion |
| `TR-AMB` | unresolved ambiguity |
| `TR-NEG` | negation or condition error |
| `TR-MOD` | modality or certainty error |
| `TR-NUM` | number, date, currency, or unit error |
| `TR-TER` | terminology inconsistency |
| `TR-NAM` | name, brand, or transliteration error |
| `TR-FLU` | unnatural target-language phrasing |
| `TR-GRA` | grammar, spelling, or punctuation error |
| `TR-TON` | voice, tone, or register mismatch |
| `TR-SEO` | search-intent or metadata localization error |
| `TR-CTA` | action or commitment mismatch |
| `TR-UI` | interface-context or character-limit failure |
| `TR-VAR` | placeholder, code, or protected-string corruption |
| `TR-EVD` | evidence, citation, or market-applicability error |
| `TR-ACC` | accessibility problem |
| `TR-LAY` | rendered layout or truncation problem |
| `TR-LEG` | legal or regulated meaning risk |
| `TR-STA` | stale or unsynchronized language version |

Each issue record must include language, content unit, severity, explanation, correction, owner, and status.

## 52. Anti-patterns

Reject:

- sentence-by-sentence literal cloning;
- polished text with changed meaning;
- different claims in each language;
- English terms inserted everywhere to appear technical;
- obscure Armenian coinages where readers know the established term;
- Russian bureaucratic padding;
- English promotional inflation;
- inconsistent `you` register;
- translated keywords without query research;
- localized currency without rate logic;
- translated quotes presented as official verbatim quotes;
- missing disclaimers in the shortest language version;
- placeholder corruption;
- reviewer approval based only on reading the target;
- back-translation used as the sole QA method;
- publishing one updated language while equivalent pages remain stale;
- assuming grammar-check success equals translation quality.

## 53. Pre-publication checklist

### Source and scope

- [ ] The source of truth and version are recorded.
- [ ] The source is approved and stable.
- [ ] Target languages and locales are explicit.
- [ ] Content type, audience, and user action are known.
- [ ] Translation mode is selected.

### Meaning

- [ ] No material information is omitted.
- [ ] No unsupported information is added.
- [ ] Actor, action, object, time, quantity, and condition match.
- [ ] Negation and exceptions match.
- [ ] Certainty and causality match.
- [ ] Benefits and limitations match.
- [ ] CTA behavior and commitment match.

### Language

- [ ] Armenian reads as natural Eastern Armenian.
- [ ] English reads as natural international business English.
- [ ] Russian reads as natural professional Russian.
- [ ] Tone and register are equivalent.
- [ ] Terminology follows the approved glossary.
- [ ] Names and transliterations are consistent.
- [ ] Grammar, spelling, and punctuation pass review.

### Data and evidence

- [ ] Numbers, prices, dates, units, ranges, and percentages match.
- [ ] Locale formatting is correct.
- [ ] Citations support the same target claims.
- [ ] Quotations and attributions are handled correctly.
- [ ] Market-specific adaptations have evidence.
- [ ] Legal or domain review is complete where required.

### SEO and conversion

- [ ] Search localization is evidence-based or marked pending.
- [ ] Title, H1, metadata, headings, and opening preserve page intent.
- [ ] Local keywords are natural.
- [ ] Navigation, anchors, and CTAs lead to equivalent destinations.
- [ ] No new cannibalization risk is introduced.

### Interface and implementation

- [ ] Variables and protected strings are unchanged.
- [ ] UI context and plural behavior are correct.
- [ ] Character constraints do not remove material meaning.
- [ ] Links, files, email addresses, and identifiers are correct.
- [ ] Image and media text are localized where required.
- [ ] Accessibility labels and alt text are correct.

### Review and synchronization

- [ ] Self-review against source is complete.
- [ ] Independent linguistic review is complete.
- [ ] Domain review is complete where required.
- [ ] HY, EN, and RU reconciliation passes.
- [ ] No critical or major issue remains.
- [ ] Translation record and decisions are complete.

## 54. Post-publication validation

After implementation, verify each language in the real environment:

- page loads at the correct locale URL;
- language switch opens the equivalent page;
- title, metadata, H1, navigation, breadcrumbs, and footer are correct;
- no text is clipped, overlapped, or unintentionally untranslated;
- buttons, forms, errors, confirmation states, and dynamic variables work;
- prices, dates, plural forms, and formatted values render correctly;
- links and downloads lead to the intended language or are labeled honestly;
- canonical and alternate-language mappings are correct;
- structured data matches visible localized content;
- screenshots, captions, alt text, and embedded media are consistent;
- mobile and desktop layouts remain usable;
- analytics distinguish language versions when required;
- published copy matches the approved version;
- source and target versions are recorded as synchronized.

## 55. Definition of done

A multilingual content set is done only when:

- one approved source of truth exists;
- all required HY, EN, and RU versions preserve material meaning;
- every version reads naturally in its own language;
- terminology, facts, claims, evidence, and CTA behavior are consistent;
- necessary SEO, locale, UI, legal, and domain adaptations are approved;
- qualified linguistic and domain review is complete;
- no blocking issue remains;
- the implemented versions pass rendered validation;
- change ownership and synchronization records are stored.

The goal is not three texts that look alike. The goal is one trustworthy message that works correctly in three languages.
