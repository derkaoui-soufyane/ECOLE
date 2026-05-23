import React from 'react'
import './footer.css'

/* ── Data ── */
const QUICK_LINKS = [
  { label: 'Accueil',      href: '/' },
  { label: 'À propos',     href: '#apropos' },
  { label: 'Nos filières', href: '#filieres' },
  { label: 'Admissions',   href: '#admissions' },
  { label: 'Vie scolaire', href: '#vie-scolaire' },
  { label: 'Contact',      href: '/contact' },
]

const FILIERES = [
  { label: 'Sciences de la Vie et de la Terre', code: 'SVT', href: '#svt' },
  { label: 'Physique-Chimie',                   code: 'PC',  href: '#pc' },
  { label: 'Sciences Mathématiques',            code: 'SM',  href: '#sm' },
  { label: 'Lettres & Sciences Humaines',       code: 'L',   href: '#lettres' },
  { label: 'Sciences Économiques',              code: 'ECO', href: '#eco' },
]

const CONTACT_ITEMS = [
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Adresse',
    content: 'Rue Allal El Fassi, Fès, Maroc',
    href: null,
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.47 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.82-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: 'Téléphone',
    content: '+212 612 892 323',
    href: 'tel:+212612892323',
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    content: 'contact@ecolemedione.ma',
    href: 'mailto:contact@ecolemedione.ma',
  },
]

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://facebook.com/ecolemedione',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com/ecolemedione',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/212612892323',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.524 5.849L.057 23.5l5.797-1.522A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 0 1-5.001-1.368l-.36-.213-3.44.902.921-3.363-.234-.374A9.817 9.817 0 0 1 2.182 12C2.182 6.567 6.567 2.182 12 2.182S21.818 6.567 21.818 12 17.433 21.818 12 21.818z"/>
      </svg>
    ),
  },
]

const BOTTOM_LINKS = [
  { label: 'Mentions légales',              href: '/mentions-legales' },
  { label: 'Politique de confidentialité',  href: '/confidentialite' },
  { label: "Conditions d'utilisation",      href: '/cgu' },
]

/* ── Sub-components ── */
function FooterColumnHeading({ children }) {
  return (
    <h3 className="footer-col__heading">
      <span className="footer-col__heading-accent" aria-hidden="true" />
      {children}
    </h3>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">

      {/* Coral top-edge accent — mirrors page-hero::after */}
      <div className="site-footer__top-accent" aria-hidden="true" />

      {/* ── MAIN GRID ── */}
      <div className="site-footer__inner">
        <div className="site-footer__grid">

          {/* ── COL 1: BRAND ── */}
          <div className="footer-brand">
            <a href="/" className="footer-brand__logo" aria-label="École Médione – Accueil">
              <div className="footer-brand__badge">
                <img src="logo_ecole.png" alt="" className="footer-brand__badge-img" />
              </div>
              <div className="footer-brand__text">
                <span className="footer-brand__name">École Médione</span>
                <span className="footer-brand__tagline">Excellence · Innovation</span>
              </div>
            </a>

            <p className="footer-brand__description">
              Lycée d'excellence à Fès-Meknès offrant cinq filières rigoureuses,
              un encadrement personnalisé et un accompagnement complet vers le
              baccalauréat et l'université.
            </p>

            {/* Social links */}
            <div className="footer-brand__socials">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="footer-social-link"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="footer-social-link__icon">{social.icon}</span>
                  <span className="footer-social-link__label">{social.label}</span>
                </a>
              ))}
            </div>

            {/* Hours badge with pulsing coral dot */}
            <div className="footer-hours-badge">
              <div className="footer-hours-badge__dot" aria-hidden="true" />
              <span className="footer-hours-badge__label">Ouvert</span>
              <span className="footer-hours-badge__time">Lun – Sam · 8h – 17h</span>
            </div>
          </div>

          {/* ── COL 2: QUICK LINKS ── */}
          <div className="footer-col">
            <FooterColumnHeading>Navigation</FooterColumnHeading>
            <ul className="footer-col__list" role="list">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="footer-col__link">
                    <span className="footer-col__link-dot" aria-hidden="true" />
                    <span className="footer-col__link-label">{link.label}</span>
                    <svg
                      className="footer-col__link-arrow"
                      width="9" height="9" viewBox="0 0 9 9"
                      fill="none" aria-hidden="true"
                    >
                      <path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 3: FILIÈRES ── */}
          <div className="footer-col">
            <FooterColumnHeading>Nos filières</FooterColumnHeading>
            <ul className="footer-col__list" role="list">
              {FILIERES.map((filiere) => (
                <li key={filiere.code}>
                  <a href={filiere.href} className="footer-col__link footer-col__link--with-code">
                    <span className="footer-col__link-code">{filiere.code}</span>
                    <span className="footer-col__link-label">{filiere.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 4: CONTACT ── */}
          <div className="footer-col">
            <FooterColumnHeading>Contact</FooterColumnHeading>

            <ul className="footer-contact-list" role="list">
              {CONTACT_ITEMS.map((item) => (
                <li key={item.label} className="footer-contact-item">
                  <div className="footer-contact-item__icon-wrap" aria-hidden="true">
                    {item.icon}
                  </div>
                  <div className="footer-contact-item__body">
                    <span className="footer-contact-item__label">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className="footer-contact-item__value footer-contact-item__value--link">
                        {item.content}
                      </a>
                    ) : (
                      <span className="footer-contact-item__value">{item.content}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Coral CTA button — mirrors .btn--primary */}
            <a href="/Inscrire" className="footer-cta-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
              S'inscrire maintenant
            </a>
          </div>

        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="site-footer__bottom-bar">
        <div className="site-footer__inner">
          <div className="footer-bottom">
            <span className="footer-bottom__copy">
              © {currentYear} École Médione · Fès, Maroc. Tous droits réservés.
            </span>
           
          </div>
        </div>
      </div>

    </footer>
  )
}