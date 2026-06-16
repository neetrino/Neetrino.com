import Image from 'next/image';
import { contactInfo, footerLinks, footerSocialIcons } from './home-data';
import { FooterLinkColumn, HomeContainer } from './home-ui';

export function HomeFooter(): React.JSX.Element {
  return (
    <footer id="contact" className="home-footer">
      <div className="home-footer-bg" aria-hidden>
        <Image
          src="/figma-home/rectangle17415.svg"
          alt=""
          fill
          sizes="100vw"
          className="home-footer-bg-shape"
        />
      </div>
      <HomeContainer>
        <div className="home-footer-grid">
          <div className="home-footer-links-group">
            <FooterLinkColumn title="Company" links={footerLinks.Company} />
            <FooterLinkColumn title="Services" links={footerLinks.Services} />
            <div className="home-footer-contact-column">
              <h3 className="home-footer-column-title">Contact</h3>
              <ul className="home-footer-contact">
                <li>
                  <Image src="/figma-home/vector4.svg" alt="" width={14} height={18} aria-hidden />
                  <span>{contactInfo.address}</span>
                </li>
                <li>
                  <Image src="/figma-home/vector5.svg" alt="" width={20} height={15} aria-hidden />
                  <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                </li>
                <li>
                  <Image src="/figma-home/vector6.svg" alt="" width={18} height={18} aria-hidden />
                  <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}>{contactInfo.phone}</a>
                </li>
                <li>
                  <Image src="/figma-home/group2087329580.svg" alt="" width={22} height={21} aria-hidden />
                  <span className="home-footer-hours">{contactInfo.hours}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="home-footer-message">
            <h3 className="home-footer-column-title home-footer-message-title">Message us</h3>
            <p className="home-footer-message-copy">
              Step into the digital world with one message. Our team will get back to you shortly.
            </p>
            <form className="home-footer-form" action="/#contact">
              <label className="sr-only" htmlFor="footer-message">
                Your message
              </label>
              <input id="footer-message" type="text" placeholder="Enter your message" />
              <button type="submit" className="home-footer-send">
                <span>Send</span>
                <Image src="/figma-home/group221.svg" alt="" width={42} height={42} aria-hidden />
              </button>
            </form>
          </div>
        </div>
        <div className="home-footer-bottom">
          <p>Copyright © 2017 - 2026 Neetrino IT Company. All Rights Reserved.</p>
          <div className="home-footer-social">
            {footerSocialIcons.map((icon) => (
              <a key={icon.alt} href="/#contact" aria-label={icon.alt}>
                <Image src={icon.src} alt="" width={icon.width} height={icon.height} />
              </a>
            ))}
          </div>
        </div>
      </HomeContainer>
    </footer>
  );
}
