'use client';

import { ContactMap } from './contact-map';
import { useHomeI18n } from './home-i18n-provider';
import { NeetrinoPageShell } from './neetrino-page-shell';
import { contactMessages } from './contact-messages';
import './contact.css';
import './contact-office.css';

type ContactMethodIcon = 'email' | 'phone';

type SocialIconKey = 'facebook' | 'instagram' | 'linkedin' | 'telegram' | 'whatsapp' | 'viber';

const SOCIAL_HREFS: Record<SocialIconKey, string> = {
  facebook: 'https://www.facebook.com/Neetrino',
  instagram: 'https://www.instagram.com/neetrino_it_agency/',
  linkedin: 'https://www.linkedin.com/company/neetrino-it-agency/',
  telegram: 'https://telegram.me/neetrino',
  whatsapp: 'https://wa.me/37444343000',
  viber: 'viber://chat?number=%2B37444343000',
};

const MAP_URL = 'https://www.google.com/maps?q=40.1684703,44.4458742&z=15&output=embed';
const MAP_LINK =
  'https://www.google.com/maps/place/Neetrino+IT+Company/@40.1684411,44.3634731,12z/data=!4m6!3m5!1s0x6a7d86fee77d7891:0x1a931845d2acd1e2!8m2!3d40.1684703!4d44.4458742!16s%2Fg%2F11tjg95w_6?entry=tts';

const SOCIAL_ICON_PATHS: Record<SocialIconKey, string> = {
  facebook: 'M13.7 20v-7.1h2.4l.4-2.8h-2.8V8.3c0-.8.2-1.4 1.4-1.4h1.5V4.4c-.7-.1-1.5-.2-2.2-.2-2.2 0-3.7 1.3-3.7 3.8v2.1H8.2v2.8h2.5V20h3z',
  instagram: 'M7.2 2.8h9.6a4.4 4.4 0 0 1 4.4 4.4v9.6a4.4 4.4 0 0 1-4.4 4.4H7.2a4.4 4.4 0 0 1-4.4-4.4V7.2a4.4 4.4 0 0 1 4.4-4.4Zm4.8 4.7a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm5.1-.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2Z',
  linkedin: 'M5.1 8.8h3.2V20H5.1V8.8Zm1.6-4.9a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6ZM10.3 8.8h3v1.5h.1c.4-.8 1.5-1.8 3.1-1.8 3.3 0 3.9 2.2 3.9 5V20h-3.2v-5.8c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V20h-3.2V8.8h.4Z',
  telegram: 'M21.4 4.5 18.5 19c-.2 1-.8 1.2-1.6.8l-4.4-3.3-2.1 2c-.2.2-.4.4-.9.4l.3-4.5 8.2-7.4c.4-.3-.1-.5-.5-.2L7.4 13.2 3 11.8c-1-.3-1-1  .2-1.4L20.4 3.8c.8-.3 1.5.2 1  .7Z',
  whatsapp: 'M12 3.3a8.4 8.4 0 0 1 7.1 12.9l1.1 4-4.1-1.1A8.4 8.4 0 1 1 12 3.3Zm-3.2 4.5c-.2 0-.6.1-.9.5s-1.2 1.2-1.2 2.9 1.3 3.4 1.5 3.6c.2.3 2.5 3.9 6.1 5.3 3 .1 3.6-2 3.7-2.2s.1-1.4-.2-1.5l-2.4-1.2c-.3-.1-.6-.2-.8.2l-1.1 1.3c-.2.3-.4.3-.8.1-.4-.2-1.5-.6-2.9-1.8-1.1-1-1.8-2.1-2-2.5s0-.6.2-.8l.6-.7c.2-.2.2-.4.3-.6.1-.2 0-.5 0-.7L9.8 8c-.2-.5-.5-.5-.7-.5h-.3Z',
  viber: 'M8.7 3.8h6.6a4.9 4.9 0 0 1 4.9 4.9v4.1a4.9 4.9 0 0 1-4.9 4.9h-2.6L9 20.4v-2.7h-.3a4.9 4.9 0 0 1-4.9-4.9V8.7a4.9 4.9 0 0 1 4.9-4.9Zm-.4 4.1c-.3.1-.6.7-.6 1 .3 3.6 2.6 6 6.2 6.4.4 0 .9-.3 1-.7l.4-1.2c.1-.3 0-.6-.3-.8l-1.6-.9c-.3-.2-.6-.1-.8.2l-.5.7c-1-.5-1.8-1.3-2.2-2.3l.7-.5c.3-.2.4-.5.2-.8L9.9 7.5c-.2-.3-.5-.4-.8-.3l-.8.7Z',
};

const SOCIAL_ICON_KEYS: readonly SocialIconKey[] = [
  'facebook',
  'instagram',
  'linkedin',
  'telegram',
  'whatsapp',
  'viber',
];

function ContactGlyph({ icon }: { icon: ContactMethodIcon }): React.JSX.Element {
  if (icon === 'email') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M4 6.8h16v10.4H4z" />
        <path d="m5.2 8 6.8 5.2L18.8 8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M8.5 5.4 6.3 7.1c-.6.5-.7 1.4-.3 2.1 1.8 3.6 4.7 6.5 8.3 8.3.7.4 1.6.3 2.1-.3l1.7-2.2-3.3-2.2-1.6 1.6c-1.8-.9-3.2-2.3-4.1-4.1l1.6-1.6z" />
    </svg>
  );
}

function SocialIcon({ icon }: { icon: SocialIconKey }): React.JSX.Element {
  if (icon === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" className="contact-social-icon-outline" aria-hidden>
        <path d="M12 3.5a8.4 8.4 0 0 1 7.1 12.9l1 3.8-3.9-1A8.4 8.4 0 1 1 12 3.5Z" />
        <path d="M8.9 8.2c-.4.1-1.1.9-1.1 1.6 0 2.9 3.1 6.3 6.6 6.3.7 0 1.4-.7 1.5-1.1l-2-1.1-.9 1c-1.3-.5-2.7-1.9-3.2-3.2l1-.9-1.1-2c-.3-.5-.5-.6-.8-.6Z" />
      </svg>
    );
  }

  if (icon === 'viber') {
    return (
      <svg viewBox="0 0 24 24" className="contact-social-icon-outline" aria-hidden>
        <path d="M8.5 4.2h7a4.5 4.5 0 0 1 4.5 4.5v3.8a4.5 4.5 0 0 1-4.5 4.5H13l-3.8 2.7V17h-.7A4.5 4.5 0 0 1 4 12.5V8.7a4.5 4.5 0 0 1 4.5-4.5Z" />
        <path d="M8.6 8.1c-.3.1-.8.6-.8 1.1.2 3.2 2.5 5.5 5.7 5.7.5 0 1-.5 1.1-.8l-1.6-1-.8.8c-1.1-.4-2-1.3-2.4-2.4l.8-.8-1-1.6c-.2-.4-.6-.6-1-.5Z" />
        <path d="M13.5 7.7c1.4.3 2.2 1.1 2.5 2.5" />
        <path d="M13.3 5.9c2.4.4 4 2 4.4 4.4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d={SOCIAL_ICON_PATHS[icon]} />
    </svg>
  );
}

function ContactIntroCard(): React.JSX.Element {
  const { contactCopy, contactInfo } = useHomeI18n();
  const { intro } = contactCopy;

  const contactMethods: { label: string; value: string; href: string; icon: ContactMethodIcon }[] = [
    {
      label: intro.methods.email,
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
      icon: 'email',
    },
    {
      label: intro.methods.phone,
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s+/g, '')}`,
      icon: 'phone',
    },
  ];

  return (
    <article className="contact-card contact-intro-card">
      <p className="contact-kicker">{intro.kicker}</p>
      <h2 className="contact-title">{intro.title}</h2>
      <p className="contact-copy">{intro.copy}</p>

      <div className="contact-methods">
        {contactMethods.map((method) => (
          <a key={method.icon} className="contact-method" href={method.href}>
            <span className="contact-method-label">
              <ContactGlyph icon={method.icon} />
              {method.label}
            </span>
            <span className="contact-method-value">{method.value}</span>
          </a>
        ))}
      </div>

      <div className="contact-social">
        <p>{intro.social.followUs}</p>
        <div className="contact-social-list">
          {SOCIAL_ICON_KEYS.map((icon) => (
            <a
              key={icon}
              href={SOCIAL_HREFS[icon]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={intro.social[icon]}
            >
              <SocialIcon icon={icon} />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function ContactOfficeSection(): React.JSX.Element {
  const { contactCopy, contactInfo } = useHomeI18n();
  const { office } = contactCopy;
  const officeAddress = `${contactInfo.address}, ${office.citySuffix}`;

  return (
    <section className="contact-office" aria-labelledby="contact-office-title">
      <div className="contact-office-head">
        <div>
          <h2 id="contact-office-title" className="contact-card-title">
            {office.title}
          </h2>
          <div className="contact-office-tags">
            <span>{officeAddress}</span>
            <span>{office.hours}</span>
          </div>
        </div>
        <a href={MAP_LINK} target="_blank" rel="noopener noreferrer">
          {office.openInMaps}
        </a>
      </div>

      <ContactMap mapUrl={MAP_URL} />
    </section>
  );
}

export function ContactPage(): React.JSX.Element {
  return (
    <NeetrinoPageShell mainId="contact-top" srOnlyTitle={contactMessages.hero.srOnlyTitle}>
      <section className="contact-page">
        <div className="contact-bg" aria-hidden />
        <div className="contact-grid" aria-hidden />
        <div className="contact-content">
          <div className="contact-hero-grid">
            <ContactIntroCard />
          </div>
          <ContactOfficeSection />
        </div>
      </section>
    </NeetrinoPageShell>
  );
}
