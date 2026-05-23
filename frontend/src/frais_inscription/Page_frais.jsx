import React, { useEffect, useRef, useState, useCallback } from 'react'
import Menu from '../menu/menu'
import Footer from '../footer/footer'
import './frais_inscription.css'

/* ════════════════════════════════════════════════
   Scroll reveal — identical to home page
════════════════════════════════════════════════ */
function ScrollReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.07 }
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? 'scroll-reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ════════════════════════════════════════════════
   Animated counter
════════════════════════════════════════════════ */
function CountUp({ end, suffix = '', prefix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    started.current = false
    setVal(0)
  }, [end])
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true
          let cur = 0
          const inc = Math.ceil(end / (1500 / 16))
          const t = setInterval(() => {
            cur += inc
            if (cur >= end) { setVal(end); clearInterval(t) }
            else setVal(cur)
          }, 16)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [end])
  return (
    <span ref={ref}>
      {prefix}{val.toLocaleString('fr-MA')}{suffix}
    </span>
  )
}

/* ════════════════════════════════════════════════
   Badge pill — home page component
════════════════════════════════════════════════ */
function BadgePill({ children, variant = 'default' }) {
  return <span className={`badge-pill badge-pill--${variant}`}>{children}</span>
}

/* ════════════════════════════════════════════════
   Section footer rule
════════════════════════════════════════════════ */
function SectionRule({ label }) {
  return (
    <div className="section-footer-rule">
      <div className="section-footer-rule__accent" />
      <span className="section-footer-rule__label">{label}</span>
      <div className="section-footer-rule__line" />
    </div>
  )
}

/* ════════════════════════════════════════════════
   FAQ Item — manifesto style (home page pattern)
════════════════════════════════════════════════ */
function FaqItem({ question, answer, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`faq-item ${open ? 'faq-item--open' : ''}`}
      onClick={() => setOpen(p => !p)}
    >
      <div className="faq-item__row">
        <span className="faq-item__index">{String(index).padStart(2, '0')}</span>
        <span className="faq-item__question">{question}</span>
        <span className="faq-item__toggle">{open ? '−' : '+'}</span>
      </div>
      {open && (
        <div className="faq-item__answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════ */
const PAYMENT_MODES = [
  { id: 'annual',    label: 'Annuel',        short: 'Annuel',    multiplier: 1,      surcharge: 0,    badge: 'Recommandé', note: 'Aucune majoration · Priorité de place' },
  { id: 'trimester', label: '3 tranches',    short: 'Trimestr.', multiplier: 1,      surcharge: 0,    badge: null,         note: 'Sept · Janv · Avril · Aucune majoration' },
  { id: 'monthly',   label: '10 mensualités',short: 'Mensuel',   multiplier: 1.02,   surcharge: 2,    badge: null,         note: 'Sept → Juin · +2% de majoration' },
]

const BASE_FEES = {
  inscription: 3000,
  scolarite:   25800,
  activites:   2000,
  fournitures: 1100,
}

const FRATRIE_DISCOUNTS = [0, 0, 0.10, 0.15]

const CLASSES = ['Tronc Commun', '1ère Bac', '2ème Bac — Sciences', '2ème Bac — Lettres', '2ème Bac — Économie']

const INCLUDED = [
  { icon: '📚', title: 'Manuels scolaires',    desc: 'Tous les manuels officiels du programme national.' },
  { icon: '💻', title: 'Accès numérique',       desc: 'Plateforme pédagogique interactive 24h/24.' },
  { icon: '👥', title: 'Suivi pédagogique',     desc: 'Bulletins trimestriels et réunions parents-profs.' },
  { icon: '🛡️', title: 'Assurance scolaire',   desc: 'Couverture complète accidents et responsabilité civile.' },
  { icon: '🗺️', title: 'Sorties éducatives',   desc: 'Visites culturelles et sorties pédagogiques programmées.' },
  { icon: '📱', title: 'Portail parents',        desc: 'Suivi en temps réel des notes, absences et actualités.' },
]

const ENROLLMENT_STEPS = [
  { num: '01', title: 'Dossier d\'inscription', desc: 'Formulaire rempli, acte de naissance, photos, bulletins de l\'année précédente et certificat médical.' },
  { num: '02', title: 'Entretien d\'orientation', desc: 'Un entretien bienveillant avec notre équipe pour mieux connaître votre enfant. Gratuit et sans engagement.' },
  { num: '03', title: 'Confirmation & Paiement', desc: 'Après validation du dossier, réglez les frais pour confirmer la place. Virement, chèque ou espèces.' },
  { num: '04', title: 'Bienvenue chez Médione', desc: 'Kit de bienvenue, calendrier scolaire et accès à la plateforme numérique parents envoyés immédiatement.' },
]

const FAQ_ITEMS = [
  { q: 'Les frais d\'inscription sont-ils remboursables ?',    a: 'Les frais d\'inscription ne sont pas remboursables une fois la confirmation envoyée. En cas de désistement avant la rentrée, les frais de scolarité sont remboursés à hauteur de 80%.' },
  { q: 'Existe-t-il des facilités de paiement ?',              a: 'Oui. Les frais annuels peuvent être réglés en 3 tranches trimestrielles ou en 10 mensualités. Une majoration de 2% s\'applique aux paiements fractionnés au-delà de 3 tranches.' },
  { q: 'Y a-t-il des réductions pour fratrie ?',               a: 'Une réduction de 10% est accordée sur la scolarité du 2ème enfant, et de 15% à partir du 3ème enfant. Cette réduction s\'applique sur le cycle de moindre valeur.' },
  { q: 'Quels documents sont requis pour l\'inscription ?',    a: 'Formulaire d\'inscription rempli, copie de l\'acte de naissance, 4 photos d\'identité, bulletins scolaires de l\'année précédente, certificat médical de moins de 3 mois.' },
  { q: 'Les fournitures scolaires sont-elles incluses ?',      a: 'Un pack de fournitures de base est inclus. Une liste de fournitures complémentaires est transmise avant la rentrée pour le Lycée.' },
  { q: 'Quand les inscriptions 2025–2026 sont-elles ouvertes ?', a: 'Les inscriptions sont ouvertes dès maintenant. Les places étant limitées, nous recommandons de déposer votre dossier avant le 30 juin pour garantir votre place.' },
]

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
export default function Page_frais() {
  const [isScrolled, setIsScrolled]       = useState(false)
  const [paymentMode, setPaymentMode]     = useState('annual')
  const [childrenCount, setChildrenCount] = useState(1)
  const [activeStep, setActiveStep]       = useState(null)

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  /* ── Computed pricing ── */
  const mode        = PAYMENT_MODES.find(m => m.id === paymentMode)
  const fratDisc    = FRATRIE_DISCOUNTS[Math.min(childrenCount - 1, 3)]
  const scolariteDisc = BASE_FEES.scolarite * fratDisc
  const adjScolarite  = (BASE_FEES.scolarite - scolariteDisc) * mode.multiplier
  const totalBase     = BASE_FEES.inscription + BASE_FEES.scolarite + BASE_FEES.activites + BASE_FEES.fournitures
  const totalAdj      = BASE_FEES.inscription + adjScolarite + BASE_FEES.activites + BASE_FEES.fournitures
  const totalSavings  = totalBase - (BASE_FEES.inscription + (BASE_FEES.scolarite - scolariteDisc) + BASE_FEES.activites + BASE_FEES.fournitures)
  const monthlyAmt    = totalAdj / 10

  const fmt = (n) => Math.round(n).toLocaleString('fr-MA')

  return (
    <>
      <Menu scrolled={isScrolled} />

      {/* ══ HERO — editorial dark, identical to home page ══ */}
      <section className="fi-hero">
        <div className="fi-hero__bg">
          {/* Dot texture layer */}
          <div className="fi-hero__dots" aria-hidden="true" />
          {/* Decorative rings */}
          <div className="fi-hero__rings" aria-hidden="true">
            <div className="fi-hero__ring fi-hero__ring--1" />
            <div className="fi-hero__ring fi-hero__ring--2" />
          </div>
        </div>

        <div className="fi-hero__content">
          <div className="fi-hero__left">
            <div className="fi-hero__eyebrow">
              <span className="fi-hero__eyebrow-line" />
              Année scolaire 2025–2026
              <span className="fi-hero__eyebrow-dot" />
              Inscriptions ouvertes
            </div>
            <h1 className="fi-hero__title">
              Frais de<br /><em>Scolarité</em>
            </h1>
            <p className="fi-hero__subtitle">
              Une tarification transparente, juste et pensée pour accompagner
              toutes les familles dans l'accès à une éducation d'excellence.
            </p>
            <div className="fi-hero__actions">
              <a href="/Inscrire" className="btn btn--primary">
                Déposer un dossier →
              </a>
              <a href="/Contact" className="btn btn--ghost">
                Poser une question
              </a>
            </div>
          </div>

          {/* Right: KPI grid — identical pattern to home hero stats */}
          <div className="fi-hero__right">
            <div className="fi-kpi-grid">
              {[
                { val: 4,   suf: ' cycles', label: 'Maternelle au Lycée' },
                { val: 10,  suf: ' mois',   label: 'Paiement fractionnable' },
                { val: 15,  suf: '%',       label: 'Réduction fratrie' },
                { val: 100, suf: '%',       label: 'Transparence tarifaire' },
              ].map((k, i) => (
                <ScrollReveal key={i} delay={i * 65} className="fi-kpi">
                  <div className="fi-kpi__val">
                    <CountUp end={k.val} suffix={k.suf} />
                  </div>
                  <span className="fi-kpi__label">{k.label}</span>
                </ScrollReveal>
              ))}
            </div>

            <div className="fi-hero__notice">
              <span className="fi-hero__notice-icon">ℹ</span>
              Tarifs valables pour l'année scolaire 2025–2026. Soumis à révision annuelle avec préavis de 60 jours.
            </div>
          </div>
        </div>

        {/* Bottom stats bar — exactly like home page */}
       
      </section>

      {/* ══ MARQUEE — identical to home ══ */}
      

      {/* ══ INTERACTIVE PRICING CALCULATOR ══ */}
      <section className="fi-calculator-section" id="tarifs">
        <div className="section-inner">
          <ScrollReveal>
            <div className="fi-calc__header">
              <div>
                <BadgePill>Simulateur de frais</BadgePill>
                <h2 className="section-title">
                  Calculez votre<br /><em className="section-title__em">tarif personnalisé</em>
                </h2>
              </div>
              <p className="fi-calc__lead">
                Ajustez le mode de paiement et le nombre d'enfants inscrits
                pour obtenir une estimation précise de votre budget scolaire annuel.
              </p>
            </div>
          </ScrollReveal>

          {/* Controls row */}
          <ScrollReveal delay={80}>
            <div className="fi-calc__controls">

              {/* Payment mode toggle */}
              <div className="fi-calc__control-group">
                <span className="fi-calc__control-label">Mode de paiement</span>
                <div className="fi-mode-toggle">
                  {PAYMENT_MODES.map(m => (
                    <button
                      key={m.id}
                      className={`fi-mode-toggle__btn ${paymentMode === m.id ? 'fi-mode-toggle__btn--active' : ''}`}
                      onClick={() => setPaymentMode(m.id)}
                    >
                      {m.label}
                      {m.badge && <span className="fi-mode-toggle__badge">{m.badge}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Children counter */}
              <div className="fi-calc__control-group">
                <span className="fi-calc__control-label">Nombre d'enfants inscrits</span>
                <div className="fi-children-counter">
                  <button
                    className="fi-children-counter__btn"
                    onClick={() => setChildrenCount(c => Math.max(1, c - 1))}
                    disabled={childrenCount <= 1}
                  >−</button>
                  <div className="fi-children-counter__display">
                    <span className="fi-children-counter__num">{childrenCount}</span>
                    <span className="fi-children-counter__sub">
                      {childrenCount === 1 ? 'enfant' : 'enfants'}
                    </span>
                  </div>
                  <button
                    className="fi-children-counter__btn"
                    onClick={() => setChildrenCount(c => Math.min(4, c + 1))}
                    disabled={childrenCount >= 4}
                  >+</button>
                </div>
              </div>

              {/* Active mode note */}
              <div className="fi-calc__mode-note">
                <span className="fi-calc__mode-note-dot" />
                {mode.note}
              </div>

            </div>
          </ScrollReveal>

          {/* Main pricing breakdown — manifesto pattern */}
          <ScrollReveal delay={120}>
            <div className="fi-calc__breakdown-panel">

              {/* Breakdown lines — numbered manifesto rows */}
              <div className="fi-breakdown-manifesto">
                {[
                  { num: '01', label: 'Frais d\'inscription', base: BASE_FEES.inscription, adjusted: BASE_FEES.inscription, note: 'Une seule fois · Non remboursable', included: true },
                  { num: '02', label: 'Scolarité annuelle',   base: BASE_FEES.scolarite,   adjusted: adjScolarite, note: fratDisc > 0 ? `Réduction fratrie −${fratDisc * 100}% appliquée${mode.surcharge ? ` · +${mode.surcharge}% mode mensuel` : ''}` : mode.surcharge ? `+${mode.surcharge}% mode mensuel` : 'Enseignement · Encadrement · Suivi', included: true },
                  { num: '03', label: 'Activités parascolaires', base: BASE_FEES.activites, adjusted: BASE_FEES.activites, note: 'Sports · Arts · Clubs · Sorties', included: true },
                  { num: '04', label: 'Fournitures scolaires', base: BASE_FEES.fournitures, adjusted: BASE_FEES.fournitures, note: 'Pack de base inclus · Liste complémentaire fournie', included: true },
                ].map((row) => (
                  <div key={row.num} className="fi-breakdown-item">
                    <div className="fi-breakdown-item__num">{row.num}</div>
                    <div className="fi-breakdown-item__body">
                      <div className="fi-breakdown-item__top">
                        <span className="fi-breakdown-item__label">{row.label}</span>
                        <div className="fi-breakdown-item__amounts">
                          {row.adjusted !== row.base && (
                            <span className="fi-breakdown-item__original">{fmt(row.base)} MAD</span>
                          )}
                          <span className="fi-breakdown-item__price">{fmt(row.adjusted)} MAD</span>
                        </div>
                      </div>
                      <span className="fi-breakdown-item__note">{row.note}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total panel */}
              <div className="fi-calc__total-panel">
                <div className="fi-calc__total-left">
                  <div className="fi-calc__total-row">
                    <span className="fi-calc__total-label">Total annuel estimé</span>
                    <div className="fi-calc__total-value">
                      <CountUp end={Math.round(totalAdj)} suffix=" MAD" key={`${paymentMode}-${childrenCount}`} />
                    </div>
                  </div>
                  {paymentMode === 'monthly' && (
                    <div className="fi-calc__monthly-equiv">
                      soit <strong>{fmt(monthlyAmt)} MAD / mois</strong> sur 10 mensualités
                    </div>
                  )}
                  {paymentMode === 'trimester' && (
                    <div className="fi-calc__monthly-equiv">
                      soit <strong>{fmt(totalAdj / 3)} MAD / trimestre</strong>
                    </div>
                  )}
                </div>

                {totalSavings > 0 && (
                  <div className="fi-calc__savings-badge">
                    <span className="fi-calc__savings-icon">🎉</span>
                    <div>
                      <span className="fi-calc__savings-val">−{fmt(totalSavings)} MAD</span>
                      <span className="fi-calc__savings-label">économisés (fratrie)</span>
                    </div>
                  </div>
                )}

                <a href="/Inscrire" className="btn btn--primary fi-calc__cta">
                  Inscrire mon enfant →
                </a>
              </div>

            </div>
          </ScrollReveal>

          {/* Fratrie savings chart */}
          {childrenCount > 1 && (
            <ScrollReveal delay={60}>
              <div className="fi-fratrie-banner">
                <span className="fi-fratrie-banner__icon">👨‍👩‍👧‍👦</span>
                <div className="fi-fratrie-banner__text">
                  <strong>Réduction fratrie active</strong>
                  <span>
                    {childrenCount === 2
                      ? '10% de réduction sur la scolarité du 2ème enfant'
                      : `15% de réduction sur la scolarité à partir du 3ème enfant`}
                  </span>
                </div>
                <div className="fi-fratrie-banner__saving">
                  <span className="fi-fratrie-banner__saving-val">−{fmt(scolariteDisc)} MAD</span>
                  <span className="fi-fratrie-banner__saving-label">d'économie / an</span>
                </div>
              </div>
            </ScrollReveal>
          )}

          <SectionRule label="Tarif lycée 2025–2026" />
        </div>
      </section>

      {/* ══ INCLUDED — ivory warm ══ */}
      <section className="fi-included-section">
        <div className="section-inner">
          <ScrollReveal>
            <div className="values-section__header">
              <div>
                <BadgePill>Ce qui est inclus</BadgePill>
                <h2 className="section-title">
                  Tout ce que comprend<br /><em className="section-title__em">votre inscription</em>
                </h2>
              </div>
              <p className="values-section__lead">
                La scolarité à l'École Médione couvre bien plus que les cours.
                Voici ce qui est inclus dans votre cotisation, sans supplément caché.
              </p>
            </div>
          </ScrollReveal>

          {/* Manifesto grid — same pattern as values on home page */}
          <div className="values-manifesto">
            {INCLUDED.map((item, i) => (
              <ScrollReveal key={i} delay={i * 55}>
                <div className="value-item">
                  <div className="value-item__num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="value-item__content">
                    <span className="value-item__icon">{item.icon}</span>
                    <h3 className="value-item__title">{item.title}</h3>
                    <p className="value-item__desc">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <SectionRule label="6 services inclus dans la scolarité" />
        </div>
      </section>

      {/* ══ ENROLLMENT STEPS — navy dark ══ */}
      <section className="fi-steps-section" id="inscription">
        <div className="section-inner">
          <ScrollReveal>
            <div className="stats-section__header">
              <div>
                <BadgePill variant="light">Processus d'inscription</BadgePill>
                <h2 className="section-title section-title--light">
                  4 étapes pour<br /><em>rejoindre Médione</em>
                </h2>
              </div>
              <p className="fi-steps-section__lead">
                Un processus simple, transparent et bienveillant conçu pour accueillir
                chaque famille dans les meilleures conditions.
              </p>
            </div>
          </ScrollReveal>

          {/* Steps manifesto — dark navy version */}
          <div className="fi-steps-manifesto">
            {ENROLLMENT_STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 70}>
                <div
                  className={`fi-step-item ${activeStep === i ? 'fi-step-item--open' : ''}`}
                  onClick={() => setActiveStep(activeStep === i ? null : i)}
                >
                  <div className="fi-step-item__row">
                    <div className="fi-step-item__num">{step.num}</div>
                    <div className="fi-step-item__mid">
                      <span className="fi-step-item__circle">{i + 1}</span>
                      <span className="fi-step-item__title">{step.title}</span>
                    </div>
                    <span className="fi-step-item__toggle">{activeStep === i ? '−' : '+'}</span>
                  </div>
                  {activeStep === i && (
                    <div className="fi-step-item__body">
                      <p>{step.desc}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={320}>
            <div className="fi-steps-cta">
              <a href="/Inscrire" className="btn btn--cta-primary">
                Commencer mon inscription →
              </a>
              <a href="/Contact" className="btn btn--cta-ghost">
                Poser une question
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ PAYMENT OPTIONS — ivory ══ */}
      <section className="fi-payment-section">
        <div className="section-inner">
          <ScrollReveal>
            <BadgePill>Modalités de règlement</BadgePill>
            <h2 className="section-title">
              Choisissez votre <em className="section-title__em">rythme de paiement</em>
            </h2>
          </ScrollReveal>

          <div className="fi-payment-manifesto">
            {PAYMENT_MODES.map((m, i) => (
              <ScrollReveal key={m.id} delay={i * 70}>
                <div
                  className={`fi-payment-item ${paymentMode === m.id ? 'fi-payment-item--active' : ''}`}
                  onClick={() => setPaymentMode(m.id)}
                >
                  <div className="fi-payment-item__num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="fi-payment-item__content">
                    <div className="fi-payment-item__top">
                      <h3 className="fi-payment-item__title">{m.label}</h3>
                      {m.badge && <span className="fi-payment-item__badge">{m.badge}</span>}
                      {m.surcharge > 0 && (
                        <span className="fi-payment-item__surcharge">+{m.surcharge}%</span>
                      )}
                    </div>
                    <p className="fi-payment-item__note">{m.note}</p>
                  </div>
                  <div className="fi-payment-item__select">
                    <div className={`fi-payment-item__radio ${paymentMode === m.id ? 'fi-payment-item__radio--on' : ''}`} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <SectionRule label="3 options de règlement disponibles" />
        </div>
      </section>

      {/* ══ FAQ — navy dark, manifesto accordion ══ */}
      <section className="fi-faq-section" id="faq">
        <div className="section-inner">
          <ScrollReveal>
            <div className="fi-faq-section__header">
              <div>
                <BadgePill variant="light">Questions fréquentes</BadgePill>
                <h2 className="section-title section-title--light">
                  Toutes vos questions,<br /><em>nos réponses</em>
                </h2>
              </div>
              <p className="fi-faq-section__lead">
                Vous ne trouvez pas votre réponse ? Notre équipe est disponible
                du lundi au vendredi, de 8h à 17h.
              </p>
            </div>
          </ScrollReveal>

          {/* FAQ manifesto — dark navy, same as home page FAQ */}
          <div className="faq-manifesto">
            {FAQ_ITEMS.map((item, i) => (
              <ScrollReveal key={i} delay={i * 45}>
                <FaqItem question={item.q} answer={item.a} index={i + 1} />
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={60}>
            <div className="fi-faq-section__contact">
              <span>Vous avez d'autres questions ?</span>
              <a href="/Contact" className="btn btn--cta-ghost fi-faq-section__contact-btn">
                Contacter notre équipe →
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ CTA — coral, identical to home page ══ */}
      <section className="fi-cta-section">
        <div className="fi-cta-section__inner">
          <ScrollReveal>
            <BadgePill variant="cta">Inscriptions 2025–2026 ouvertes</BadgePill>
            <h2 className="fi-cta-section__title">
              Offrez à votre enfant<br /><em>le meilleur départ</em> dans la vie.
            </h2>
            <p className="fi-cta-section__subtitle">
              Places limitées. Déposez votre dossier avant le 30 juin
              pour garantir la place de votre enfant.
            </p>
            <div className="fi-cta-section__actions">
              <a href="/Inscrire" className="btn btn--cta-primary">S'inscrire maintenant →</a>
              <a href="/Contact" className="btn btn--cta-ghost">Prendre rendez-vous</a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  )
}