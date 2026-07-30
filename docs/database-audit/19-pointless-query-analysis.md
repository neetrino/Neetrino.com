# Are DB queries happening every few minutes “for nothing”?

**Checked:** 2026-07-30 (login-free, live Postgres stats)  
**Question:** Արդյոք DB-ին անիմաստ հարցումներ են լինում մի քանի րոպեն մեկ՝ առանց իրական օգտագործման։

---

## Short answer

| Claim | Verdict |
| --- | --- |
| App-ը background-ով ինքնուրույն ամեն 5 րոպեն DB է ծեծում (cron) | **Ոչ** — repo-ում cron չկա |
| Next.js ISR-ը ժամանակացույցով ինքն է կանչում DB | **Ոչ** — ISR-ը DB է դիպչում **միայն երբ request է գալիս** cache-ի ժամկետից հետո |
| DB hit-եր կան պարբերաբար (~րոպեների կարգ) | **Այո** — ապացուցված stats-ով |
| Դա նշանակում է «անիմաստ, ոչ ոք չի օգտագործում» | **Միանշանակ ոչ** — նշանակում է **ինչ-որ client request** է եկել (`/` կամ `/portfolio`)։ Դա կարող է լինել մարդ, bot կամ monitor |

---

## How ISR actually works here

Code: `src/app/page.tsx`, `src/app/portfolio/page.tsx`

```text
revalidate = 300  (5 minutes)
```

Flow:

```text
Request → if cache fresh (<300s) → NO database
Request → if cache stale (≥300s) → regenerate → Prisma → Neon wake
No requests at all → NO regenerate → NO database from ISR
```

Ուրեմն «ամեն 5 րոպեն մեկ query» **չի նշանակում** թայմեր։  
Նշանակում է՝ **մոտավորապես ամեն 5–10 րոպեն ինչ-որ մեկը/բան է բացում էջը** (կամ cache-ը արդեն stale է, և հաջորդ hit-ը regenerate է անում)։

---

## Fresh measurements (2026-07-30)

Compared to 2026-07-20 audit:

| Metric | 2026-07-20 | 2026-07-30 | Delta (~10 days) |
| --- | ---: | ---: | ---: |
| `portfolio_assets.seq_scan` | 5794 | **7242** | **+1448** |
| Approx scans/day | ~241 | **~146** | still regular |
| Avg interval | ~6 min | **~10 min** | still “every few minutes” order |
| `partners` idx_scan | 79 | **1170** | home uses partners too |
| `blog_posts.seq_scan` | 667 | 820 | less frequent |
| Last portfolio + partners hit | — | **2026-07-30 07:34 UTC** | same timestamp → **home page pattern** |
| Compute at probe | — | postmaster age **~1s** | was **suspended**, woke on our check |

`/`-ի pattern. home-ը միասին է կանչում portfolio + partners (`Promise.all`).  
Վերջին hit-ում երկուսի `last_*_scan`-ը **նույն ժամն** է (07:34) → դա home regeneration է, ոչ թե առանձին անիմաստ SQL loop։

---

## “Անիմաստ” vs “օգտագործվող”

| Եթե request-ը… | Query-ն… | Ծախսի տեսակ |
| --- | --- | --- |
| Իրական այցելու է, տեսնում է portfolio | **Օգտակար** | Նորմալ product cost |
| Bot/crawler է, էջը չի «օգտագործվում» բիզնեսով | **Ցածր արժեք / գրեթե անիմաստ** | Ավելորդ wake |
| Uptime monitor է բացում `/` | **Տեխնիկապես անիմաստ product-ի համար** | Կանոնավոր wake |
| Ոչ ոք request չի անում | Query **չի լինի** ISR-ից | $0 compute (suspended) |

App code-ում **չկա** «ամեն N րոպեն SELECT արա առանց request»։  
Անիմաստության աստիճանը կախված է **ով է բացում էջը**, ոչ թե buggy timer-ից։

---

## What we know vs don’t

**Know (high confidence)**

1. Պարբերական DB reads կան՝ հիմնականում public home/portfolio։  
2. Դա request-driven է, ոչ in-app cron։  
3. Neon-ը idle-ում քնում է (probe-ի ժամանակ cold start)։  
4. Մեկ short page view-ից հետո Neon-ը կարող է դեռ մի քանի րոպե bill անել (autosuspend window) — սա «query ավելորդ է» չէ, այլ **wake-ի արժեք**։

**Don’t know without access logs (Vercel/hosting)**

- Քանի %-ն է իրական user vs bot vs monitor  
- Exact User-Agent distribution  

Առանց log-երի չենք կարող ասել «100% անիմաստ է»։ Կարող ենք ասել՝ **ռիթմը կա, պատճառը request-ներն են, app timer չկա**։

---

## Practical interpretation for the $5 question

Եթե օրվա ընթացքում կայքը/բոտերը պարբերաբար բացում են `/`՝

- ISR-ը մոտ 5–10 րոպեն մեկ regenerate է անում  
- Neon արթնանում է  
- Հարցումը **տեխնիկապես օգտագործվում է էջը կառուցելու համար**  
- Բայց եթե այցելուները հիմնականում bot են՝ **բիզնես արժեքը ցածր է**, ծախսը մնում է  

Սա տարբեր է «DB-ն ինքն իրեն անիմաստ query է անում» սցենարից։
