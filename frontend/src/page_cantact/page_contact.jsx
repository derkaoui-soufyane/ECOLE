import React, { useState, useRef, useEffect } from 'react'
import './page_contact.css'
import Menu from '../menu/menu'
import Footer from '../footer/footer'

/* ── Contact info items ── */
const INFO_ITEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Adresse',
    value: 'Fès, Maroc',
    sub: "Quartier tghat",
    href: 'https://www.google.com/maps?q=34.0596987,-5.0220899',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.68 9.81 19.79 19.79 0 0 1 1.61 2.2 2 2 0 0 1 3.6.02h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.08 6.08l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: 'Téléphone',
    value: '+212 6 12 89 23 23',
    sub: 'Lun – Ven, 09:00 – 17:00',
    href: 'tel:+212612892323',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'soufyane.derkaoui@gmail.com',
    sub: 'Réponse sous 24h',
    href: 'mailto:soufyane.derkaoui@gmail.com',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    label: "Horaires d'accueil",
    value: 'Lun – Ven : 08:00 – 17:00',
    sub: 'Sam : 08:00 – 12:00',
    href: null,
  },
]

const SUBJECTS = [
  'Inscription & Admissions',
  'Renseignements généraux',
  'Transport scolaire',
  'Frais de scolarité',
  'Réclamation',
  'Autre',
]

const MAX_MESSAGE_LENGTH = 500

/* ── Reveal hook ── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return [ref, visible]
}

function Reveal({ children, className = '', delay = 0 }) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`ct-reveal ${visible ? 'ct-reveal--in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ── Main Component ── */
export default function Page_contact() {
  const [form, setForm] = useState({adresse:"", name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState(null)
  const [activeSubject, setActiveSubject] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) return
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubject = (s) => { setActiveSubject(s); setForm(f => ({ ...f, subject: s })) }

  const handleSubmit = async (e) => {
  e.preventDefault();

  // validation
  if (!form.name || !form.email || !form.message || !form.subject) {
  alert("Fill all required fields");
  return;
}

  try {
    const res = await fetch("http://127.0.0.1:8000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setSubmitted(true);
      console.log("Success:", data);
    } else {
      console.log("Error:", data);
      alert("Error sending message");
    }

  } catch (error) {
    console.error(error);
    alert("Server error");
  }
};

  const handleReset = () => {
    setSubmitted(false)
    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    setActiveSubject(null)
  }

  return (
    <>
      {/* <Menu /> */}
      <Menu/>
      <main className="ct-page">

        {/* ── HERO ── */}
        <section className="ct-hero">
          {/* Background image */}
          <img src="img-page-contact.png" alt="" className="ct-hero__img" />

          {/* Layered shadow overlays */}
          <div className="ct-hero__shadow" aria-hidden="true" />
          <div className="ct-hero__vignette" aria-hidden="true" />

          {/* Dot-grid texture */}
          <div className="ct-hero__dots" aria-hidden="true" />

          {/* Centered text content */}
          <div className="ct-hero__inner">
            <Reveal>
              <span className="ct-hero__label">
                <span className="ct-hero__dot" />
                Contactez-nous
              </span>
              <h1 className="ct-hero__title">
                Nous sommes là<br /><em>pour vous répondre</em>
              </h1>
              <p className="ct-hero__sub">
                Une question sur les inscriptions, les programmes ou la vie scolaire ?
                Notre équipe est disponible et à votre écoute.
              </p>
            </Reveal>
          </div>

          {/* Info cards float over the bottom edge of the hero */}
          <div className="ct-hero__cards-wrapper">
            <div className="ct-hero__cards">
              {INFO_ITEMS.map((item) => (
                <a
                  key={item.label}
                  className="ct-info-card"
                  href={item.href || undefined}
                  target={item.href?.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{ cursor: item.href ? 'pointer' : 'default', textDecoration: 'none' }}
                >
                  <span className="ct-info-card__icon">{item.icon}</span>
                  <div className="ct-info-card__body">
                    <span className="ct-info-card__label">{item.label}</span>
                    <span className="ct-info-card__value">{item.value}</span>
                    <span className="ct-info-card__sub">{item.sub}</span>
                  </div>
                  {item.href && (
                    <svg className="ct-info-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
          
        </section>

        {/* ── MAIN CONTENT ── */}
        <section className="ct-main">
          <div className="ct-main__inner">

            {/* FORM COLUMN */}
            <div className="ct-form-col">
              <Reveal>
                <div className="ct-form-header">
                  <span className="ct-section-label">Formulaire de contact</span>
                  <h2 className="ct-form-title">Envoyez-nous un message</h2>
                  <p className="ct-form-desc">Nous vous répondrons dans les plus brefs délais — généralement sous 24h ouvrables.</p>
                </div>

                {submitted ? (
                  <div className="ct-success">
                    <div className="ct-success__icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <h3 className="ct-success__title">Message envoyé !</h3>
                    <p className="ct-success__body">
                      Merci {form.name}. Notre équipe vous contactera à <strong>{form.email}</strong> dans les 24h.
                    </p>
                    <button className="ct-success__reset" onClick={handleReset}>
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <form className="ct-form" onSubmit={handleSubmit} noValidate>

                    {/* Subject pills */}
                    <div className="ct-field-group">
                      <label className="ct-label">Sujet de votre demande</label>
                      <div className="ct-subject-pills">
                        {SUBJECTS.map(s => (
                          <button
                            key={s}
                            type="button"
                            className={`ct-pill ${activeSubject === s ? 'ct-pill--on' : ''}`}
                            onClick={() => handleSubject(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name + Phone row */}
                    <div className="ct-row">
                      <div className={`ct-field ${focused === 'name' ? 'ct-field--focus' : ''} ${form.name ? 'ct-field--filled' : ''}`}>
                        <label className="ct-field__label" htmlFor="ct-name">Votre nom complet *</label>
                        <div className="ct-field__wrap">
                          <svg className="ct-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                          </svg>
                          <input
                            id="ct-name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            onFocus={() => setFocused('name')}
                            onBlur={() => setFocused(null)}
                            placeholder="Fatima Zahra Bennani"
                            required
                          />
                        </div>
                      </div>
                      <div className={`ct-field ${focused === 'address' ? 'ct-field--focus' : ''} ${form.address ? 'ct-field--filled' : ''}`}>
  <label className="ct-field__label">Adresse</label>
  <div className="ct-field__wrap">
    <input
      name="address"
      type="text"
      value={form.address}
      onChange={handleChange}
      onFocus={() => setFocused('address')}
      onBlur={() => setFocused(null)}
      placeholder="Fès, Maroc"
    />
  </div>
</div>
                      <div className={`ct-field ${focused === 'phone' ? 'ct-field--focus' : ''} ${form.phone ? 'ct-field--filled' : ''}`}>
                        <label className="ct-field__label" htmlFor="ct-phone">Téléphone</label>
                        <div className="ct-field__wrap">
                          <svg className="ct-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.68 9.81 19.79 19.79 0 0 1 1.61 2.2 2 2 0 0 1 3.6.02h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.08 6.08l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                          </svg>
                          <input
                            id="ct-phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            onFocus={() => setFocused('phone')}
                            onBlur={() => setFocused(null)}
                            placeholder="+212 6XX XXX XXX"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className={`ct-field ${focused === 'email' ? 'ct-field--focus' : ''} ${form.email ? 'ct-field--filled' : ''}`}>
                      <label className="ct-field__label" htmlFor="ct-email">Adresse email *</label>
                      <div className="ct-field__wrap">
                        <svg className="ct-field__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                        </svg>
                        <input
                          id="ct-email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          placeholder="vous@exemple.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div className={`ct-field ct-field--textarea ${focused === 'message' ? 'ct-field--focus' : ''} ${form.message ? 'ct-field--filled' : ''}`}>
                      <label className="ct-field__label" htmlFor="ct-message">Votre message *</label>
                      <div className="ct-field__wrap ct-field__wrap--ta">
                        <svg className="ct-field__icon ct-field__icon--ta" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        <textarea
                          id="ct-message"
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          onFocus={() => setFocused('message')}
                          onBlur={() => setFocused(null)}
                          placeholder="Décrivez votre demande en détail..."
                          rows={6}
                          maxLength={MAX_MESSAGE_LENGTH}
                          required
                        />
                      </div>
                      <span className="ct-char-count">{form.message.length} / {MAX_MESSAGE_LENGTH}</span>
                    </div>

                    <button className="ct-submit" type="submit">
                      <span>Envoyer le message</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>

                    <p className="ct-privacy">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                      Vos données sont traitées de manière confidentielle et ne sont jamais partagées.
                    </p>
                  </form>
                )}
              </Reveal>
            </div>

            {/* MAP + SIDEBAR COLUMN */}
            <div className="ct-map-col">
              <Reveal delay={80}>
                <div className="ct-map-wrap">
                  <iframe
                    title="Localisation École Médione"
                    src="https://www.google.com/maps?q=34.0596987,-5.0220899&z=15&output=embed"
                    allowFullScreen
                    loading="lazy"
                    className="ct-map"
                  />
                  <div className="ct-map-badge">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    École Médione · Fès
                  </div>
                </div>
              </Reveal>

              
            </div>

          </div>
        </section>

        {/* ── BOTTOM STRIP ── */}
        <section className="ct-strip">
          <div className="ct-strip__inner">
            <div className="ct-strip__text">
              <span className="ct-strip__dot" />
              <span>Inscriptions 2025-2026 ouvertes — Places limitées</span>
            </div>
            <a href="/Inscrire" className="ct-strip__btn">S'inscrire maintenant →</a>
          </div>
        </section>

      </main>
      <Footer/>
      {/* <Footer /> */}
    </>
  )
}