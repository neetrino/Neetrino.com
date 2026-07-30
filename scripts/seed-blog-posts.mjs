import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import {
  blogDemoCoverPath,
  generateBlogDemoCovers,
} from './generate-blog-demo-covers.mjs';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..');
const DEMO_SLUG_PREFIX = 'demo-';

function loadEnv(filePath) {
  for (const rawLine of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnv(join(ROOT, '.env'));

/**
 * 15 published demo posts for browsing the public blog UI.
 * English slug is the stable key (also used by blog-demo-taxonomy.ts).
 */
const SEED_POSTS = [
  {
    slug: 'demo-shipping-smaller-releases',
    daysAgo: 2,
    en: {
      title: 'Shipping faster with smaller releases',
      excerpt: 'Why thin vertical slices beat big-bang launches for product teams.',
      content:
        'Smaller releases reduce risk, shorten feedback loops, and keep stakeholders aligned.\n\nStart with one user outcome, ship it end-to-end, then iterate. Measure adoption before expanding scope.',
    },
    hy: {
      title: 'Ավելի արագ առաքում՝ փոքր release-երով',
      excerpt: 'Ինչու բարակ vertical slice-երը հաղթում են մեծ launch-երին։',
      content:
        'Փոքր release-երը նվազեցնում են ռիսկը և կարճացնում feedback loop-ը։\n\nՍկսեք մեկ user outcome-ից, առաքեք end-to-end, հետո կրկնեք։',
    },
    ru: {
      title: 'Быстрее в прод с маленькими релизами',
      excerpt: 'Почему тонкие vertical slice лучше больших запусков.',
      content:
        'Маленькие релизы снижают риск и ускоряют обратную связь.\n\nНачните с одного пользовательского результата, доведите его до конца и только потом расширяйте scope.',
    },
  },
  {
    slug: 'demo-design-systems-that-scale',
    daysAgo: 5,
    en: {
      title: 'Design systems that scale with the product',
      excerpt: 'Tokens, primitives, and when not to abstract too early.',
      content:
        'A useful design system grows with real screens, not speculative components.\n\nPrefer shared tokens and a few primitives first. Extract patterns only after they appear three times.',
    },
    hy: {
      title: 'Design system, որն աճում է product-ի հետ',
      excerpt: 'Token-ներ, primitive-ներ և երբ չպետք է շուտ abstract անել։',
      content:
        'Լավ design system-ը աճում է իրական էկրաններից։\n\nՍկսեք token-ներից և մի քանի primitive-ներից, pattern-ները առանձնացրեք միայն կրկնությունից հետո։',
    },
    ru: {
      title: 'Дизайн-система, которая растёт с продуктом',
      excerpt: 'Токены, примитивы и когда рано абстрагировать.',
      content:
        'Полезная дизайн-система растёт из реальных экранов.\n\nСначала токены и несколько примитивов. Паттерны выделяйте после повторений.',
    },
  },
  {
    slug: 'demo-api-error-contracts',
    daysAgo: 8,
    en: {
      title: 'API error contracts your clients can trust',
      excerpt: 'Stable codes, safe messages, and logging without leaking internals.',
      content:
        'Clients need predictable error shapes more than clever messages.\n\nUse stable codes, validate at boundaries, and keep internal details in logs — not in responses.',
    },
    hy: {
      title: 'API error contract, որին կարելի է վստահել',
      excerpt: 'Կայուն code-եր, անվտանգ message-ներ և logging առանց leak-ի։',
      content:
        'Client-ներին պետք է կանխատեսելի error shape։\n\nՕգտագործեք կայուն code-եր, validate արեք boundary-ում, իսկ ներքին մանրամասները թողեք log-երում։',
    },
    ru: {
      title: 'Контракт ошибок API, которому можно доверять',
      excerpt: 'Стабильные коды, безопасные сообщения и логи без утечек.',
      content:
        'Клиентам важна предсказуемая форма ошибок.\n\nДержите стабильные коды, валидируйте на границе и оставляйте внутренности в логах.',
    },
  },
  {
    slug: 'demo-discovery-before-build',
    daysAgo: 11,
    en: {
      title: 'Discovery before build: a practical checklist',
      excerpt: 'Clarify users, constraints, and success metrics before writing code.',
      content:
        'Discovery is not endless workshops — it is enough clarity to build the right thing.\n\nConfirm the user, the painful job, constraints, and how you will know the release worked.',
    },
    hy: {
      title: 'Discovery build-ից առաջ՝ գործնական checklist',
      excerpt: 'Պարզեք user-ին, սահմանափակումները և success metric-ները։',
      content:
        'Discovery-ն անվերջ workshop չէ — դա բավարար հստակություն է ճիշտ բանը կառուցելու համար։\n\nՀաստատեք user-ին, խնդիրը, սահմանափակումները և չափման ձևը։',
    },
    ru: {
      title: 'Discovery до разработки: практический чеклист',
      excerpt: 'Пользователь, ограничения и метрики успеха до кода.',
      content:
        'Discovery — не бесконечные воркшопы, а ясность, чтобы строить нужное.\n\nПодтвердите пользователя, боль, ограничения и критерий успеха релиза.',
    },
  },
  {
    slug: 'demo-neetrino-studio-notes',
    daysAgo: 14,
    en: {
      title: 'Studio notes: what we shipped this month',
      excerpt: 'A short look at recent delivery themes across client work.',
      content:
        'This month we focused on clearer marketing surfaces, faster admin workflows, and tighter release checklists.\n\nSmall process upgrades compounded into fewer handoff surprises.',
    },
    hy: {
      title: 'Studio notes. ինչ առաքեցինք այս ամիս',
      excerpt: 'Կարճ հայացք վերջին delivery թեմաներին։',
      content:
        'Այս ամիս կենտրոնացանք ավելի հստակ marketing էջերի, արագ admin flow-երի և release checklist-երի վրա։\n\nՓոքր process բարելավումները նվազեցրին handoff սխալները։',
    },
    ru: {
      title: 'Studio notes: что мы выпустили в этом месяце',
      excerpt: 'Короткий обзор тем доставки по клиентским проектам.',
      content:
        'В этом месяце мы усилили маркетинговые страницы, ускорили admin-потоки и ужесточили release checklist.\n\nМаленькие улучшения процесса уменьшили сюрпризы на handoff.',
    },
  },
  {
    slug: 'demo-mobile-perf-checklist',
    daysAgo: 17,
    en: {
      title: 'Mobile performance checklist for marketing pages',
      excerpt: 'Images, fonts, and above-the-fold work that actually moves LCP.',
      content:
        'Most mobile pain on marketing pages comes from heavy heroes and deferred critical CSS.\n\nPrioritize LCP media, limit font weights, and keep the first viewport lean.',
    },
    hy: {
      title: 'Mobile performance checklist marketing էջերի համար',
      excerpt: 'Image, font և above-the-fold աշխատանք, որն իրոք ազդում է LCP-ի վրա։',
      content:
        'Mobile-ի հիմնական խնդիրները հաճախ գալիս են ծանր hero-ից։\n\nԱռաջնահերթություն տվեք LCP media-ին, սահմանափակեք font weight-երը և առաջին viewport-ը պահեք թեթև։',
    },
    ru: {
      title: 'Чеклист мобильной производительности для маркетинга',
      excerpt: 'Картинки, шрифты и first viewport, которые двигают LCP.',
      content:
        'На мобильном чаще всего мешают тяжёлые hero и отложенный critical CSS.\n\nПриоритизируйте LCP-медиа, ограничьте начертания шрифтов и упростите первый экран.',
    },
  },
  {
    slug: 'demo-onboarding-that-converts',
    daysAgo: 20,
    en: {
      title: 'Onboarding that converts without the tour spam',
      excerpt: 'Guide users to one first win instead of explaining every feature.',
      content:
        'Good onboarding creates one early success, then gets out of the way.\n\nHide advanced settings, prefill sensible defaults, and celebrate the first completed action.',
    },
    hy: {
      title: 'Onboarding, որ convert է անում առանց tour spam-ի',
      excerpt: 'Տարեք user-ին մեկ առաջին win-ի, ոչ թե բոլոր feature-ների բացատրության։',
      content:
        'Լավ onboarding-ը ստեղծում է մեկ վաղ հաջողություն և հետ է քաշվում։\n\nԹաքցրեք advanced setting-ները, լրացրեք խելամիտ default-ներ և նշեք առաջին completed action-ը։',
    },
    ru: {
      title: 'Онбординг, который конвертирует без tour-спама',
      excerpt: 'Ведите к одному первому win, а не ко всем фичам сразу.',
      content:
        'Хороший онбординг даёт один ранний успех и не мешает дальше.\n\nСпрячьте advanced-настройки, задайте разумные defaults и отметьте первое действие.',
    },
  },
  {
    slug: 'demo-accessible-forms',
    daysAgo: 23,
    en: {
      title: 'Accessible forms without the redesign',
      excerpt: 'Labels, errors, and focus states that help every user finish.',
      content:
        'Most form accessibility wins are structural: real labels, clear errors, and visible focus.\n\nAnnounce validation near the field and never rely on color alone.',
    },
    hy: {
      title: 'Accessible form-եր առանց redesign-ի',
      excerpt: 'Label, error և focus state-եր, որոնք օգնում են ավարտել։',
      content:
        'Form accessibility-ի հիմնական շահումները կառուցվածքային են՝ իրական label, հստակ error և տեսանելի focus։\n\nValidation-ը ցույց տվեք դաշտի մոտ և մի՛ հենվեք միայն գույնի վրա։',
    },
    ru: {
      title: 'Доступные формы без редизайна',
      excerpt: 'Лейблы, ошибки и focus, которые помогают завершить форму.',
      content:
        'Главные победы в доступности форм — структурные: настоящие label, понятные ошибки и видимый focus.\n\nПоказывайте валидацию у поля и не полагайтесь только на цвет.',
    },
  },
  {
    slug: 'demo-postgres-indexing-basics',
    daysAgo: 26,
    en: {
      title: 'Postgres indexing basics for product engineers',
      excerpt: 'When an index helps, when it hurts, and how to read a slow query.',
      content:
        'Indexes speed up reads that filter or join on specific columns — and slow down writes.\n\nStart from EXPLAIN, index the selective predicates you actually use, and avoid speculative composite indexes.',
    },
    hy: {
      title: 'Postgres indexing basics product engineer-ների համար',
      excerpt: 'Երբ index-ը օգնում է, երբ խանգարում, և ինչպես կարդալ slow query։',
      content:
        'Index-ները արագացնում են այն read-երը, որոնք ֆիլտրում կամ join են անում կոնկրետ սյուներով, և դանդաղեցնում են write-երը։\n\nՍկսեք EXPLAIN-ից և index արեք այն predicate-ները, որոնք իրոք օգտագործում եք։',
    },
    ru: {
      title: 'Основы индексов Postgres для product-инженеров',
      excerpt: 'Когда индекс помогает, когда мешает, и как читать slow query.',
      content:
        'Индексы ускоряют чтения с фильтрами и join по нужным колонкам — и замедляют записи.\n\nНачните с EXPLAIN и индексируйте реальные predicate, а не гипотетические комбинации.',
    },
  },
  {
    slug: 'demo-roadmap-rituals',
    daysAgo: 29,
    en: {
      title: 'Roadmap rituals that keep teams honest',
      excerpt: 'Weekly prioritization without turning planning into theater.',
      content:
        'A roadmap is a bet list, not a promise calendar.\n\nReview outcomes weekly, kill stale bets early, and protect capacity for unplanned reliability work.',
    },
    hy: {
      title: 'Roadmap ritual-ներ, որոնք թիմը պահում են ազնիվ',
      excerpt: 'Շաբաթական առաջնահերթություն առանց planning theater-ի։',
      content:
        'Roadmap-ը bet-երի ցանկ է, ոչ թե խոստումների օրացույց։\n\nՇաբաթը մեկ ստուգեք outcome-ները, վաղ կտրեք հին bet-երը և capacity պահեք reliability-ի համար։',
    },
    ru: {
      title: 'Ритуалы roadmap, которые держат команду честной',
      excerpt: 'Еженедельные приоритеты без театра планирования.',
      content:
        'Roadmap — список ставок, а не календарь обещаний.\n\nРаз в неделю сверяйте outcomes, рано закрывайте устаревшие ставки и оставляйте ёмкость под reliability.',
    },
  },
  {
    slug: 'demo-brand-motion-principles',
    daysAgo: 32,
    en: {
      title: 'Brand motion principles for product UI',
      excerpt: 'Use motion for hierarchy and presence — not decoration noise.',
      content:
        'Motion should clarify what changed and where attention should go next.\n\nPrefer short, purposeful transitions over layered effects that compete with content.',
    },
    hy: {
      title: 'Brand motion principles product UI-ի համար',
      excerpt: 'Motion-ը՝ hierarchy և presence-ի համար, ոչ թե աղմուկի։',
      content:
        'Motion-ը պետք է հստակեցնի՝ ինչ փոխվեց և ուր գնա ուշադրությունը։\n\nՆախընտրեք կարճ ու նպատակային transition-ներ՝ բազմաշերտ էֆեկտների փոխարեն։',
    },
    ru: {
      title: 'Принципы brand motion для product UI',
      excerpt: 'Движение для иерархии и присутствия, а не для шума.',
      content:
        'Анимация должна показывать, что изменилось и куда вести внимание.\n\nКороткие осмысленные переходы лучше слоёных эффектов, которые спорят с контентом.',
    },
  },
  {
    slug: 'demo-secure-session-cookies',
    daysAgo: 35,
    en: {
      title: 'Secure session cookies without the folklore',
      excerpt: 'HttpOnly, Secure, SameSite, and what actually stops common theft paths.',
      content:
        'Session cookies should be HttpOnly and Secure in production, with SameSite chosen for your auth topology.\n\nPair cookie flags with CSRF protections on state-changing requests.',
    },
    hy: {
      title: 'Անվտանգ session cookie-ներ առանց folklore-ի',
      excerpt: 'HttpOnly, Secure, SameSite և ինչն է իրոք կանգնեցնում theft path-երը։',
      content:
        'Production-ում session cookie-ները պետք է լինեն HttpOnly և Secure, իսկ SameSite-ը՝ ըստ auth topology-ի։\n\nCookie flag-երը համադրեք CSRF պաշտպանության հետ state-changing request-երի վրա։',
    },
    ru: {
      title: 'Безопасные session cookie без фольклора',
      excerpt: 'HttpOnly, Secure, SameSite и что реально закрывает типовые кражи.',
      content:
        'В production session cookie должны быть HttpOnly и Secure, а SameSite — под вашу auth-топологию.\n\nДополняйте флаги cookie CSRF-защитой для state-changing запросов.',
    },
  },
  {
    slug: 'demo-hiring-builders',
    daysAgo: 38,
    en: {
      title: 'Hiring builders: signals we trust',
      excerpt: 'How we evaluate ownership, craft, and communication in interviews.',
      content:
        'We look for people who can ship, explain tradeoffs, and leave the codebase clearer than they found it.\n\nTake-homes stay small; conversations stay concrete.',
    },
    hy: {
      title: 'Hiring builders. ազդանշաններ, որոնց վստահում ենք',
      excerpt: 'Ինչպես ենք գնահատում ownership-ը, craft-ը և communication-ը։',
      content:
        'Փնտրում ենք մարդկանց, ովքեր կարող են առաքել, բացատրել tradeoff-ները և codebase-ը թողնել ավելի հստակ։\n\nTake-home-երը փոքր են, զրույցները՝ կոնկրետ։',
    },
    ru: {
      title: 'Наём builders: сигналы, которым мы доверяем',
      excerpt: 'Как оцениваем ownership, craft и коммуникацию на интервью.',
      content:
        'Мы ищем тех, кто умеет шипить, объяснять tradeoff и оставлять код понятнее, чем нашёл.\n\nTake-home остаются короткими, разговоры — конкретными.',
    },
  },
  {
    slug: 'demo-content-ops-for-saas',
    daysAgo: 41,
    en: {
      title: 'Content ops for SaaS marketing teams',
      excerpt: 'A lightweight workflow from draft to localized publish.',
      content:
        'Content ops works when ownership is obvious: who drafts, who reviews brand, who publishes.\n\nKeep localization in the same pipeline so releases do not wait on last-minute translation chase.',
    },
    hy: {
      title: 'Content ops SaaS marketing թիմերի համար',
      excerpt: 'Թեթև workflow draft-ից մինչև localized publish։',
      content:
        'Content ops-ը աշխատում է, երբ ownership-ը պարզ է՝ ով է գրում, ով է review անում, ով է publish անում։\n\nLocalization-ը պահեք նույն pipeline-ում, որ release-ը չսպասի վերջին պահի թարգմանությանը։',
    },
    ru: {
      title: 'Content ops для SaaS-маркетинга',
      excerpt: 'Лёгкий workflow от черновика до локализованной публикации.',
      content:
        'Content ops работает, когда ownership очевиден: кто пишет, кто проверяет бренд, кто публикует.\n\nДержите локализацию в том же pipeline, чтобы релиз не ждал перевод в последний момент.',
    },
  },
  {
    slug: 'demo-launch-week-playbook',
    daysAgo: 44,
    en: {
      title: 'Launch week playbook for product teams',
      excerpt: 'Comms, QA gates, and rollback plans that keep launches calm.',
      content:
        'Calm launches are prepared launches: owners, QA gates, support macros, and a rollback path.\n\nWrite the customer message before you flip the flag.',
    },
    hy: {
      title: 'Launch week playbook product թիմերի համար',
      excerpt: 'Comms, QA gate և rollback plan-եր, որոնք launch-ը պահում են հանգիստ։',
      content:
        'Հանգիստ launch-ը պատրաստված launch է՝ owner-ներ, QA gate-եր, support macro-ներ և rollback path։\n\nCustomer message-ը գրեք flag-ը միացնելուց առաջ։',
    },
    ru: {
      title: 'Playbook launch week для product-команд',
      excerpt: 'Коммуникации, QA gates и rollback, которые сохраняют спокойствие.',
      content:
        'Спокойный запуск — подготовленный запуск: владельцы, QA gates, support macros и путь отката.\n\nНапишите сообщение для клиентов до переключения флага.',
    },
  },
];

function daysAgoDate(daysAgo) {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date;
}

function translationPayload(locale, slug, copy) {
  return {
    locale,
    title: copy.title,
    slug: locale === 'en' ? slug : `${slug}-${locale}`,
    excerpt: copy.excerpt,
    content: copy.content,
    imageAlt: copy.title,
    seoTitle: copy.title,
    seoDescription: copy.excerpt,
  };
}

const prisma = new PrismaClient();

try {
  await generateBlogDemoCovers();
  console.log(`Generated ${SEED_POSTS.length} demo cover images.`);

  const existingDemo = await prisma.blogPostTranslation.findMany({
    where: {
      locale: 'en',
      slug: { startsWith: DEMO_SLUG_PREFIX },
    },
    select: { blogPostId: true, slug: true },
  });

  if (existingDemo.length > 0) {
    const ids = [...new Set(existingDemo.map((row) => row.blogPostId))];
    await prisma.blogPost.deleteMany({ where: { id: { in: ids } } });
    console.log(`Removed ${ids.length} existing demo blog post(s).`);
  }

  for (const post of SEED_POSTS) {
    const publishedAt = daysAgoDate(post.daysAgo);

    await prisma.blogPost.create({
      data: {
        status: 'PUBLISHED',
        publishedAt,
        coverImageUrl: blogDemoCoverPath(post.slug),
        translations: {
          create: [
            translationPayload('en', post.slug, post.en),
            translationPayload('hy', post.slug, post.hy),
            translationPayload('ru', post.slug, post.ru),
          ],
        },
      },
    });

    console.log('Seeded', post.slug, '→', blogDemoCoverPath(post.slug));
  }

  console.log(`Done. Seeded ${SEED_POSTS.length} published demo posts with covers.`);
} finally {
  await prisma.$disconnect();
}
