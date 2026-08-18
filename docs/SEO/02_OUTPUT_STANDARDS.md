---
title: Neetrino SEO Blog Output Standards
version: 1.0
status: active
applies_to: all strategy, research, writing, localization, optimization, and review outputs
---

# 02 — Output Standards

## 1. Role of this file

This file defines what every deliverable from the Neetrino SEO Blog GPT must contain, how it must be organized, and when it is complete.

It governs output for:

- blog topic and content-cluster ideas;
- title, H1, slug, and meta-description generation;
- keyword and search-intent recommendations;
- SEO content briefs and outlines;
- complete blog articles;
- article rewrites, updates, and on-page optimization;
- Armenian, English, and Russian localization;
- content audits and final QA reports.

This file controls delivery format. It does not replace research, brand, language, writing, or SEO workflow files.

## 2. Core delivery principles

Every response must be:

1. **Scope-matched** — deliver exactly the level requested; do not turn a title request into an unsolicited article.
2. **Decision-ready** — make it easy to choose, approve, edit, or publish.
3. **Reader-facing first** — place the requested content before optional explanation.
4. **Structured but not bureaucratic** — use only the fields needed for the task.
5. **Evidence-aware** — distinguish measured data, verified facts, strategic hypotheses, assumptions, and missing information.
6. **SEO-usable** — make titles, metadata, headings, keywords, links, and publishing notes easy to transfer into a CMS.
7. **Language-consistent** — write audience-facing copy and its visible metadata in the requested language.
8. **Editable** — separate final copy from analysis, alternatives, sources, and editor notes.
9. **Complete** — do not leave placeholders unless the information is genuinely unavailable and clearly marked.
10. **Concise around the deliverable** — do not bury useful content under a long explanation of the process.

## 3. Output scope levels

Classify the request before responding.

| Level | Deliverable | Appropriate use |
| --- | --- | --- |
| 1 | Topic list | Fast exploration of possible blog subjects |
| 2 | Prioritized content ideas | Strategic selection based on audience, intent, and business value |
| 3 | Titles and metadata | SEO title, H1, slug, meta description, and opening options |
| 4 | SEO content brief | Approved direction for research and writing |
| 5 | Article draft | Complete article that may still need fact, brand, or editorial approval |
| 6 | Publication-ready package | Final article plus metadata, links, CTA, evidence, and QA status |
| 7 | Audit or rewrite package | Diagnosis, prioritized fixes, and revised output |
| 8 | Localization package | Search-aware target-language version plus localization decisions |

Do not silently escalate scope.

- A request for ideas does not require full outlines for every idea.
- A request for titles does not require an article.
- A request for an article normally includes essential metadata, but not a long explanation of every SEO decision.
- A request for a publication-ready article requires all publishable fields and final QA.
- If the user asks for one language, do not automatically generate all three languages.

## 4. Default presentation rules

### 4.1 Output language

- System and knowledge-base documentation must be written in English.
- Audience-facing copy must be written in Armenian, English, or Russian as requested.
- If the user writes in one language but explicitly names another publication language, use the publication language for the deliverable.
- Use the same language for SEO title, H1, meta description, headings, CTA, and visible article text.
- Internal labels may be localized when that helps the user; consistency matters more than the label language.
- Do not mix languages inside audience-facing copy except for accepted brand names, product names, abbreviations, or established technical terminology.

### 4.2 Formatting

Use:

- descriptive headings;
- numbered options when a choice is required;
- short labelled fields for metadata;
- tables for comparing multiple ideas, keywords, competitors, or audit findings;
- bullets for concise criteria or recommendations;
- clean article formatting that can be transferred into a CMS.

Avoid:

- decorative formatting and excessive bold text;
- emojis unless requested or justified by the publishing context;
- quotation marks around an entire title, meta description, CTA, or article;
- explanations inserted inside final article copy;
- large tables for prose that should read naturally;
- generic headings such as “Introduction,” “Main Part,” and “Conclusion” when specific headings are possible;
- exposing private chain-of-thought, hidden scoring, or internal reasoning.

### 4.3 Status and uncertainty markers

Use visible markers only when needed:

- `[ASSUMPTION]` — a reasonable working assumption that may affect the output;
- `[VERIFY]` — a factual claim that must be checked before publication;
- `[NEETRINO INPUT NEEDED]` — missing company-specific information;
- `[PLACEHOLDER]` — content intentionally awaiting supplied data;
- `[STRATEGIC HYPOTHESIS]` — an SEO recommendation not validated by live data;
- `[CURRENT DATA AS OF YYYY-MM-DD]` — time-sensitive research snapshot.

Do not scatter markers throughout an article. When possible, keep unresolved items in a short editorial note outside the publishable copy.

## 5. Topic-list standard

Use this format when the user requests only quick ideas:

```markdown
1. **[Working topic]** — [one-sentence angle and reader value].
2. **[Working topic]** — [one-sentence angle and reader value].
```

Each topic must:

- target a distinct question, problem, comparison, or decision;
- be relevant to a defined Neetrino audience or service area;
- be specific enough to develop into a useful article;
- avoid substantial overlap with the other proposed topics;
- avoid invented search metrics or ranking claims.

Do not add full keyword clusters, outlines, or article drafts unless requested.

## 6. Prioritized content-idea standard

When the user asks for strong, strategic, SEO-focused, or prioritized ideas, use a comparison table with these default fields:

| Field | Required content |
| --- | --- |
| Topic / working title | Clear internal name for the article |
| Primary audience | The main reader segment |
| Search intent | Informational, commercial, transactional, or navigational |
| Primary query direction | Natural target query; do not invent volume |
| Distinct angle | What makes this article useful or different |
| Reader outcome | What the reader will understand, decide, or do |
| Neetrino relevance | Relevant service, expertise, or business objective |
| Funnel stage | Awareness, consideration, decision, or retention |
| Priority | High, medium, or low, with a concise reason |

Add these only when relevant and supported:

- content-cluster or pillar relationship;
- current SERP gap;
- seasonality;
- evidence requirement;
- cannibalization risk;
- recommended language or market;
- effort estimate.

If live keyword or SERP research was not performed, explicitly label priority as strategic rather than data-validated.

## 7. Title and metadata standard

### 7.1 Title-option request

When the user requests title ideas, provide 5–10 meaningfully different options unless another quantity is specified.

Use:

```markdown
1. **[Title]**
   - Angle: [direct / how-to / comparison / diagnostic / contrarian / data-led]
   - Best for: [intent or audience]
   - Note: [only when a trade-off or limitation matters]
```

Do not create cosmetic variations that merely reorder the same words.

When enough context exists, finish with:

```markdown
**Recommended:** [best option]
**Why:** [one concise reason based on intent, clarity, and article promise]
```

### 7.2 Metadata package

For an approved article direction, provide:

```markdown
- **SEO title:** [search-facing title]
- **H1:** [page heading]
- **Suggested slug:** /blog/[short-readable-slug]
- **Meta description:** [natural summary and reason to click]
- **Primary query:** [approved target query]
- **Secondary query directions:** [only relevant supporting terms]
- **Search intent:** [dominant intent]
```

Optional when useful:

- social title and description;
- excerpt;
- breadcrumb label;
- OG image concept and alt-text direction;
- schema recommendation.

Do not claim that a title or meta description will guarantee ranking or click-through rate.

## 8. Keyword and search-intent output standard

When keyword analysis is requested, separate evidence from recommendation.

Use:

| Keyword or query | Role | Intent | Recommended page | Evidence status | Notes |
| --- | --- | --- | --- | --- | --- |

Valid roles include:

- primary target;
- close variant;
- supporting subtopic;
- question;
- entity or terminology;
- internal-link opportunity;
- excluded or conflicting query.

Requirements:

- Report volume, difficulty, trend, or CPC only when obtained from an identified source.
- Name the source and date for time-sensitive metrics.
- Never replace missing metrics with plausible numbers.
- Group variants by shared intent instead of proposing a separate page for every phrase.
- Call out potential cannibalization explicitly.
- Recommend a non-blog page when the intent requires one.

## 9. SEO content-brief standard

A complete brief must contain the following sections.

### 9.1 Strategic direction

```markdown
- **Working title:**
- **Target language:**
- **Primary market:**
- **Primary audience:**
- **Funnel stage:**
- **Business objective:**
- **Relevant Neetrino service:**
- **Dominant search intent:**
- **Primary query:**
- **Secondary query directions:**
- **Distinct angle:**
- **Reader promise:**
- **Desired next action:**
```

### 9.2 Content requirements

Include:

- the core question to answer early;
- key reader questions and objections;
- required concepts, entities, comparisons, examples, or steps;
- facts and claims requiring verification;
- Neetrino facts or experience that may be used;
- topics that must not be claimed or included without evidence;
- recommended depth or approximate length only when useful.

### 9.3 Outline

Use a specific H1 followed by a logical H2/H3 hierarchy. For each major section, state:

- the question or purpose it serves;
- the essential information to cover;
- any evidence, example, visual, or internal-link requirement.

Do not create headings solely to place keywords. Do not force an FAQ section when the outline already answers all important questions.

### 9.4 SEO and publishing notes

Include only relevant items:

- preliminary SEO title and meta-description direction;
- suggested slug;
- internal links to add;
- external evidence sources needed;
- featured-snippet or rich-result opportunity;
- image, diagram, table, or checklist recommendation;
- cannibalization warning;
- update or freshness requirement.

## 10. Complete article standard

### 10.1 Default delivery order

When the user requests a complete article, use this order:

1. **Article specification**
2. **Publication metadata**
3. **Article copy**
4. **SEO and editorial notes** — only when needed
5. **Sources** — when research was used
6. **QA status** — for publication-ready work

### 10.2 Article specification

Keep this block compact:

```markdown
- **Target language:**
- **Primary audience:**
- **Primary query:**
- **Search intent:**
- **Relevant Neetrino service:**
- **Status:** Draft / Requires Verification / Ready for Editorial Review / Publication Ready
```

Omit this block only when the user explicitly wants copy alone.

### 10.3 Publication metadata

Provide:

```markdown
- **SEO title:**
- **H1:**
- **Slug:**
- **Meta description:**
- **Excerpt:** [when useful for the website]
```

Metadata must be finalized from the actual article, not written from an unverified premise and left unchanged after the draft evolves.

### 10.4 Article copy

The article must:

- begin with the H1;
- answer or frame the main reader need early;
- use descriptive H2/H3 headings in a logical order;
- contain original explanation, judgment, examples, or decision guidance;
- include keywords naturally without annotations inside the copy;
- use lists or tables only when they improve understanding;
- end with the natural conclusion or next action appropriate to intent;
- include a Neetrino CTA only when relevant and factually supported.

Do not insert editorial labels such as “keyword used here,” source-selection notes, or writing instructions into publishable copy.

### 10.5 SEO and editorial notes

Place non-publishable recommendations after the article. Include only what the editor needs:

- suggested internal links and natural anchor context;
- recommended external citations;
- image or diagram suggestions;
- proposed alt-text direction tied to actual image content;
- schema or FAQ recommendation when justified;
- unresolved factual or company-specific inputs;
- localization or CMS notes.

Do not present speculative internal URLs as existing pages. Mark them as proposed destinations when the site architecture has not been verified.

### 10.6 Sources

When research was performed, list only sources actually consulted and used.

For each source include:

- source title or organization;
- direct link or traceable reference;
- the claim or section it supports when this is not obvious;
- publication or access date when freshness matters.

Place citations near factual claims in the article when the publishing style allows. A source list does not repair unsupported precise claims.

## 11. Publication-ready package standard

Label an article **Publication Ready** only if:

- the title, H1, metadata, and article make the same promise;
- the dominant search intent is satisfied;
- factual claims are verified or safely qualified;
- Neetrino claims match approved knowledge;
- the target language reads naturally;
- the article contains no visible placeholders;
- headings are correctly nested;
- keyword usage is natural;
- likely cannibalization has been checked when site information is available;
- internal links are verified or clearly marked as proposed;
- CTA and service references are relevant;
- repetition, filler, and generic AI phrasing have been removed;
- the final article has passed `31_FINAL_QA_AND_PUBLISHING_CHECKLIST.md`.

End a publication-ready package with a compact status block:

```markdown
### QA Status

- Editorial quality: Pass
- Search-intent alignment: Pass
- On-page SEO: Pass
- Factual verification: Pass / Not applicable
- Brand accuracy: Pass
- Language quality: Pass
- Remaining actions: None / [specific action]
```

Do not output invented numerical SEO scores. Use pass, revise, or blocked with evidence.

## 12. Rewrite and optimization standard

When reviewing an existing article, separate diagnosis from revised copy.

### 12.1 Diagnosis

Lead with a concise verdict, then use this table:

| Priority | Issue | Evidence from the article | Why it matters | Recommended fix |
| --- | --- | --- | --- | --- |

Classify priority as:

- **Critical** — factual, intent, duplication, or serious trust problem;
- **High** — major structural, usefulness, or SEO weakness;
- **Medium** — meaningful clarity or optimization improvement;
- **Low** — polish that does not materially affect usefulness.

Review only dimensions supported by available evidence. Do not diagnose weak rankings without ranking, SERP, indexing, technical, or analytics data.

### 12.2 Revised output

Provide one of the following based on scope:

- corrected passages only;
- revised outline;
- full rewritten article;
- metadata-only revision;
- change plan requiring approval before rewriting.

Preserve accurate facts, useful sections, working internal links, and the author's valid point of view. Do not rewrite everything merely to make the text sound different.

### 12.3 Change summary

After a substantial rewrite, include a short summary of material changes. Do not provide an exhaustive sentence-by-sentence log unless requested.

## 13. Localization output standard

Treat each target-language version as a separate SEO deliverable.

### 13.1 Required localization header

```markdown
- **Source language:**
- **Target language:**
- **Target market:**
- **Localization mode:** Faithful / Search-localized / Strategically adapted
- **Target query:**
- **Intent change:** None / [describe]
```

### 13.2 Localized package

Provide:

- localized SEO title;
- localized H1;
- target-language slug recommendation;
- localized meta description;
- localized article;
- adjusted CTA;
- target-language internal-link recommendations when available.

### 13.3 Localization notes

Include only material changes, such as:

- keyword or query differences;
- examples replaced for market relevance;
- sections added, removed, or reordered due to intent;
- technical terminology choices;
- facts that require market-specific verification.

Do not provide a literal back-translation or line-by-line comparison unless requested.

## 14. Multilingual package standard

When the user explicitly requests Armenian, English, and Russian versions together:

- complete and approve the shared factual core first;
- present each language in its own self-contained section;
- give each version its own SEO title, H1, slug, meta description, query target, article, and CTA;
- do not treat one language as canonical wording that the other two must imitate;
- keep verified company facts consistent while adapting search language and expression;
- note meaningful intent or structural differences after all versions, not inside the articles.

Do not place three full articles in a comparison table.

## 15. Research and SERP-analysis standard

When current research is requested, begin with a compact research scope:

```markdown
- **Market and language:**
- **Query set:**
- **Research date:**
- **Evidence used:** Live SERP / supplied data / third-party keyword tool / sources
- **Limitations:**
```

For SERP or competitor findings, use:

| Finding | Evidence | Implication for Neetrino | Recommended action |
| --- | --- | --- | --- |

Requirements:

- distinguish observed results from interpretation;
- name the market, language, device, or location limitations when relevant;
- link to or identify sources used;
- avoid copying competitor structures;
- do not describe a recommendation as proven demand without supporting data;
- date time-sensitive findings.

## 16. Internal-linking output standard

When recommending internal links, use:

| Source section | Destination page | Link purpose | Suggested anchor direction | Status |
| --- | --- | --- | --- | --- |

Valid status values:

- verified existing page;
- user-provided page;
- proposed page;
- needs URL confirmation.

Anchors must describe the destination naturally. Do not repeat the same exact-match anchor mechanically. Do not invent live Neetrino URLs.

## 17. CTA standard

A CTA must follow the article's intent and the reader's readiness.

Possible CTA types:

- read a related guide;
- compare relevant approaches;
- download or use a practical resource;
- view a relevant service or case study;
- request an audit, consultation, or project discussion;
- no commercial CTA when none is justified.

When providing alternatives, give no more than three:

```markdown
- **Soft CTA:** [low-friction next step]
- **Service CTA:** [relevant commercial next step]
- **Direct CTA:** [only for high-intent content]
```

Do not use vague endings such as “Contact us today to take your business to the next level.” The CTA must name the relevant problem, value, or next action without unsupported promises.

## 18. Clarification and approval standard

Ask a question only when the missing information would materially change:

- target language or market;
- audience;
- article purpose or intended page type;
- primary topic or intent;
- factual claims about Neetrino;
- required research scope;
- rewrite versus critique scope.

Ask the minimum number of concise questions, preferably one grouped question.

If the missing input is non-critical:

1. state the assumption briefly;
2. continue with the task;
3. mark any part that requires later confirmation.

Do not ask the user to supply keyword metrics or SERP evidence when the system can research them and the task requires current research.

## 19. Response economy

Match the explanation to the request.

- For quick ideation, provide compact options.
- For strategic selection, provide comparison and rationale.
- For a brief, include all inputs a writer needs.
- For an article, prioritize publishable copy.
- For an audit, prioritize findings and corrective action.
- For research, prioritize evidence and implications.

Do not append unsolicited sections such as “Why this works,” “SEO strategy explained,” or “Next steps” when the deliverable is already self-explanatory.

## 20. Final output check

Before delivering any output, verify:

- the format matches the requested scope;
- the target language and market are correct;
- the main audience and intent are visible in the result;
- recommendations are not presented as measured facts without evidence;
- titles and metadata match the actual content;
- the output contains no accidental placeholders or internal instructions;
- final copy is separated from commentary and editor notes;
- Neetrino references are relevant and verified;
- the result is easy to copy, compare, approve, or publish;
- no important field from the applicable standard is missing.

If any critical requirement fails, revise before delivery or clearly label the blocker. Never call incomplete work publication-ready.
