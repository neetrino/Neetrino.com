'use client';

import { CdnImage } from '@/lib/cdn-image';
import { staticAsset } from '@/lib/static-asset';
import Link from 'next/link';
import { useHomeI18n } from './home-i18n-provider';
import { FooterLinkColumn, HomeContainer } from './home-ui';

export function HomeFooter(): React.JSX.Element {
  const { contactInfo, footerLinks, footerSocialIcons, homeCopy } = useHomeI18n();

  return (
    <footer id="contact" className="home-footer">
      <div className="home-footer-bg" aria-hidden>
        <CdnImage
          src={staticAsset("/figma-home/rectangle17415.svg")}
          alt=""
          fill
          sizes="100vw"
          className="home-footer-bg-shape"
        />
        <div className="home-footer-bg-glow">
          <div className="home-footer-bg-glow-expand">
            <CdnImage
              src={staticAsset("/about/mobile-bg/ellipse-31.svg")}
              alt=""
              fill
              sizes="1190px"
              loading="lazy"
              fetchPriority="low"
              className="home-footer-bg-glow-img"
            />
          </div>
        </div>
        <div className="home-footer-bg-team">
          <CdnImage
            src={staticAsset("/about/mobile-bg/team-bg.webp")}
            alt=""
            fill
            sizes="996px"
            loading="lazy"
            fetchPriority="low"
            className="home-footer-bg-team-img"
          />
        </div>
      </div>
      <HomeContainer>
        <div className="home-footer-grid">
          <div className="home-footer-links-group">
            <FooterLinkColumn title={homeCopy.footer.columns.company} links={footerLinks.company} />
            <FooterLinkColumn title={homeCopy.footer.columns.services} links={footerLinks.services} />
            <div className="home-footer-contact-column">
              <h3 className="home-footer-column-title">{homeCopy.footer.columns.contact}</h3>
              <ul className="home-footer-contact">
                <li>
                  <CdnImage src={staticAsset("/figma-home/vector4.svg")} alt="" width={14} height={18} aria-hidden />
                  <span>{contactInfo.address}</span>
                </li>
                <li>
                  <CdnImage src={staticAsset("/figma-home/vector5.svg")} alt="" width={20} height={15} aria-hidden />
                  <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                </li>
                <li>
                  <CdnImage src={staticAsset("/figma-home/vector6.svg")} alt="" width={18} height={18} aria-hidden />
                  <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}>{contactInfo.phone}</a>
                </li>
                <li>
                  <CdnImage src={staticAsset("/figma-home/group2087329580.svg")} alt="" width={22} height={21} aria-hidden />
                  <span className="home-footer-hours">{contactInfo.hours}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </HomeContainer>
      <div className="home-footer-bottom">
        <p>{homeCopy.footer.copyright}</p>
        <div className="home-footer-social">
          {footerSocialIcons.map((icon) => (
            <Link key={icon.alt} href="/#contact" aria-label={icon.alt}>
              <CdnImage src={icon.src} alt="" width={icon.width} height={icon.height} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
