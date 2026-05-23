import React, { useEffect, useRef, useState } from 'react'
import './presentation.css'
import Menu from '../menu/menu'
import Footer from '../footer/footer'

/* ══════════════════════════════════════ DATA ══════════════════════════════════════ */
const STATS = [
  { value: '1200', suffix: '+',    label: 'Élèves inscrits' },
  { value: '98',   suffix: '%',    label: 'Taux de réussite' },
  { value: '85',   suffix: '+',    label: 'Enseignants qualifiés' },
  { value: '20',   suffix: ' ans', label: "Années d'excellence" },
]

const VALUES = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
    title: 'Excellence académique',
    desc: 'Programme rigoureux ancré dans les meilleures pratiques mondiales, adapté aux besoins de chaque apprenant.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
    title: 'Innovation pédagogique',
    desc: 'Classes numériques, laboratoires interactifs et méthodes actives pour préparer les élèves aux défis de demain.',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: 'Communauté bienveillante',
    desc: "Environnement sécurisé et inclusif où chaque élève est vu, entendu et encouragé à donner le meilleur.",
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    title: 'Épanouissement global',
    desc: "Sport, arts, clubs et voyages scolaires : nous cultivons l'intelligence émotionnelle autant qu'intellectuelle.",
  },
]

const LEVELS = [
  { label: 'Lycée', ages: '16 – 18 ans', num: '01', icon: '🎓', desc: "Préparation intensive au baccalauréat et orientation vers l'enseignement supérieur." },
]

const TEAM = [
  { initials: 'AB', name: 'M. Ahmed Bennani',    role: 'Directeur général',          exp: '18 ans' },
  { initials: 'SF', name: 'Mme Salma Fassi',     role: 'Directrice pédagogique',     exp: '12 ans' },
  { initials: 'KO', name: 'M. Karim Ouazzani',   role: 'Responsable admissions',     exp: '9 ans'  },
  { initials: 'NE', name: 'Mme Nadia El-Amrani', role: 'Coordinatrice parascolaire', exp: '11 ans' },
]

const ACTIVITIES = [
  { icon: '⚽', label: 'Football',        category: 'Sport'   },
  { icon: '🎨', label: 'Arts plastiques', category: 'Arts'    },
  { icon: '🎭', label: 'Théâtre',         category: 'Arts'    },
  { icon: '🤖', label: 'Robotique',       category: 'Science' },
  { icon: '🎵', label: 'Musique',         category: 'Arts'    },
  { icon: '♟️', label: 'Échecs',          category: 'Logique' },
  { icon: '🌍', label: 'Géographie',      category: 'Science' },
  { icon: '📷', label: 'Photographie',    category: 'Arts'    },
  { icon: '🏊', label: 'Natation',        category: 'Sport'   },
  { icon: '💻', label: 'Coding',          category: 'Science' },
  { icon: '📚', label: 'Lecture',         category: 'Logique' },
  { icon: '🎬', label: 'Cinéma',          category: 'Arts'    },
]

const TESTIMONIALS = [
  { quote: "Mon fils a grandi intellectuellement et humainement. L'équipe pédagogique est d'une bienveillance remarquable.", author: 'Mme Khadija R.',  role: "Parent d'élève · Lycée",     initials: 'KR' },
  { quote: "Après deux ans à l'École Médione, ma fille a intégré une grande école d'ingénierie. Je dois beaucoup à cet établissement.", author: 'M. Youssef A.', role: "Parent d'élève · Terminale", initials: 'YA' },
  { quote: "Un cadre exceptionnel, des professeurs passionnés. Mon enfant va à l'école avec le sourire chaque matin.", author: 'Mme Amina B.',  role: "Parent d'élève · Primaire",  initials: 'AB' },
]

const FACILITIES = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
    title: 'Salles numériques',
    desc: "Chaque salle est équipée de tableaux interactifs et d'accès haut débit.",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    title: 'Bibliothèque moderne',
    desc: 'Plus de 8 000 ouvrages, espaces de lecture et ressources numériques.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    title: 'Labo des sciences',
    desc: 'Laboratoires de physique, chimie et biologie avec équipements modernes.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    title: 'Espace de vie',
    desc: 'Cantine équilibrée, salles de repos et espaces verts pour se ressourcer.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
    title: 'Terrain multisports',
    desc: 'Football, basketball, volleyball et athlétisme sur des installations dédiées.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: 'Sécurité & bien-être',
    desc: 'Surveillance permanente, infirmerie et accompagnement psychologique.',
  },
]

const FAQ = [
  { q: "Quand ont lieu les inscriptions ?",                      a: "Les inscriptions pour 2025-2026 sont ouvertes de janvier à juin. Nous recommandons de déposer votre dossier dès que possible, les places étant limitées." },
  { q: "Quels documents sont nécessaires pour l'inscription ?",  a: "Bulletins des deux dernières années, acte de naissance, copie de la CIN des parents, photos d'identité et formulaire d'inscription rempli." },
  { q: "L'école propose-t-elle un service de transport ?",       a: "Oui, notre réseau de transport couvre les principaux quartiers de Fès. Les horaires et lignes sont disponibles auprès du secrétariat." },
  { q: "Y a-t-il des bourses disponibles ?",                     a: "Nous proposons des aides financières pour les familles méritantes sous conditions de ressources. Renseignez-vous auprès de notre service administratif." },
]

/* ══════════════════════════════════════ COMPONENTS ══════════════════════════════════════ */

/* Animated counter */
function useCountUp(target, suffix, duration, trigger) {
  const [display, setDisplay] = useState('0' + suffix)
  useEffect(() => {
    if (!trigger) return
    const num = parseInt(String(target).replace(/\D/g, ''), 10)
    if (isNaN(num)) return
    let start = 0
    const step = Math.ceil(num / (duration / 16))
    const timer = setInterval(() => {
      start = Math.min(start + step, num)
      const formatted = num >= 1000 ? start.toLocaleString('fr-FR') : String(start)
      setDisplay(formatted + suffix)
      if (start >= num) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [trigger])
  return display
}

function StatCard({ value, suffix, label }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.4 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  const display = useCountUp(value, suffix, 1400, visible)
  return (
    <div className="stat-card" ref={ref}>
      <span className="stat-card__value">{display}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  )
}

/* Scroll reveal */
function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.08 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`reveal reveal--${direction} ${visible ? 'reveal--in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* FAQ item — manifesto style */
function FaqItem({ q, a, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`} onClick={() => setOpen(o => !o)}>
      <button className="faq-item__q" aria-expanded={open}>
        <span className="faq-item__q-num">{String(index).padStart(2, '0')}</span>
        <span className="faq-item__q-text">{q}</span>
        <span className="faq-item__icon">{open ? '−' : '+'}</span>
      </button>
      <div className="faq-item__body" style={{ maxHeight: open ? '200px' : '0' }}>
        <p className="faq-item__a">{a}</p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════ PAGE ══════════════════════════════════════ */
export default function Presentation() {
  const [activeTesti, setActiveTesti] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setActiveTesti(p => (p + 1) % TESTIMONIALS.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      {/* heroPage=true suppresses the header-spacer — hero is full-viewport */}
      <Menu heroPage={true} />

      <main className="pres">

        {/* ══ HERO ══ */}
        <section className="hero">
          <div className="hero__bg-dots" aria-hidden="true" />
          <div className="hero__lines" aria-hidden="true">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="hero__line" style={{ '--i': i }} />
            ))}
          </div>

          <div className="hero__inner">
            <div className="hero__eyebrow">
              <span className="hero__dot" />
              <span>Fès, Maroc — fondée en 2004</span>
              <span className="hero__eyebrow-sep" />
              <span>Agréée Ministère de l'Éducation</span>
            </div>

            <h1 className="hero__title">
              Former les esprits<br />
              <em>qui bâtiront demain</em>
            </h1>

            <p className="hero__sub">
              École Médione réunit l'exigence académique, l'innovation pédagogique
              et une communauté soudée pour offrir à chaque élève un parcours
              d'exception — de la maternelle au lycée.
            </p>

            <div className="hero__actions">
              <a href="/Inscrire" className="btn btn--primary btn--lg">S'inscrire maintenant →</a>
              <a href="#apropos"  className="btn btn--ghost-light btn--lg">Découvrir l'école</a>
            </div>

            <div className="hero__trust">
              {['Inscriptions 2025 ouvertes', 'Transport scolaire', 'Bourses disponibles'].map((item, i) => (
                <React.Fragment key={item}>
                  {i > 0 && <span className="hero__trust-sep" />}
                  <span className="hero__trust-item">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Decorative ring badge */}
          <div className="hero__visual" aria-hidden="true">
            <div className="hero__ring hero__ring--outer" />
            <div className="hero__ring hero__ring--mid" />
            <div className="hero__badge">
              <span className="hero__badge-e">É</span>
              <span className="hero__badge-m">M</span>
            </div>
            <div className="hero__tag hero__tag--1">Excellence</div>
            <div className="hero__tag hero__tag--2">Innovation</div>
            <div className="hero__tag hero__tag--3">Bienveillance</div>
          </div>

          <div className="hero__scroll-hint" aria-hidden="true"><span /></div>
        </section>

       git branch -M main
       

        {/* ══ ABOUT ══ */}
        <section className="about section" id="apropos">
          <div className="section__inner about__grid">
            <Reveal className="about__text-col">
              <span className="section__label">À propos de nous</span>
              <h2 className="section__title">
                Une école qui place<br /><em>l'humain au cœur de tout</em>
              </h2>
              <p className="about__body">
                Fondée en 2004 à Fès, l'École Médione s'est construite sur une conviction simple :
                chaque enfant porte un potentiel unique. Notre mission est de le révéler.
              </p>
              <p className="about__body">
                Vingt ans de parcours nous ont permis d'affiner un modèle éducatif qui allie rigueur
                académique, créativité et bien-être — reconnu parmi les établissements privés les plus
                performants de la région Fès-Meknès.
              </p>

              <div className="about__timeline">
                {[['2004','Fondation'],['2010','Ouverture lycée'],['2018','Lab numérique'],['2024','20e anniversaire']].map(([yr, ev]) => (
                  <div key={yr} className="about__tl-item">
                    <span className="about__tl-year">{yr}</span>
                    <span className="about__tl-dot" />
                    <span className="about__tl-event">{ev}</span>
                  </div>
                ))}
              </div>

              <a href="#admissions" className="btn btn--primary" style={{ marginTop: '2rem', display: 'inline-flex' }}>
                Déposer un dossier →
              </a>
            </Reveal>

            <div className="about__cards-col">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 80} direction="left">
                  <div className="value-card">
                    <span className="value-card__icon">{v.icon}</span>
                    <div>
                      <h3 className="value-card__title">{v.title}</h3>
                      <p className="value-card__desc">{v.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ LEVELS ══ */}
        <section className="levels section" id="niveaux">
          <div className="section__inner">
            <Reveal>
              <span className="section__label">Nos niveaux</span>
              <h2 className="section__title">Un parcours <em>complet et exigeant</em></h2>
            </Reveal>
            <div className="levels__grid">
              {LEVELS.map((l, i) => (
                <Reveal key={l.label} delay={i * 90}>
                  <div className="level-card">
                    <div className="level-card__bar" />
                    <span className="level-card__num">{l.num}</span>
                    <span className="level-card__icon">{l.icon}</span>
                    <div className="level-card__body">
                      <span className="level-card__ages">{l.ages}</span>
                      <h3 className="level-card__name">{l.label}</h3>
                      <p className="level-card__desc">{l.desc}</p>
                    </div>
                    <a href={`#${l.label.toLowerCase()}`} className="level-card__cta">
                      En savoir plus
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="section-rule">
              <div className="section-rule__accent" />
              <span className="section-rule__label">{LEVELS.length} niveau{LEVELS.length > 1 ? 'x' : ''} disponible{LEVELS.length > 1 ? 's' : ''}</span>
              <div className="section-rule__line" />
            </div>
          </div>
        </section>

        {/* ══ FACILITIES ══ */}
        <section className="facilities section" id="infrastructures">
          <div className="section__inner">
            <Reveal>
              <span className="section__label">Nos infrastructures</span>
              <h2 className="section__title">Des espaces pensés pour <em>apprendre et s'épanouir</em></h2>
            </Reveal>
            <div className="facilities__grid">
              {FACILITIES.map((f, i) => (
                <Reveal key={f.title} delay={i * 70}>
                  <div className="facility-card">
                    <span className="facility-card__icon">{f.icon}</span>
                    <h3 className="facility-card__title">{f.title}</h3>
                    <p className="facility-card__desc">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ ACTIVITIES — dark navy ══ */}
        <section className="activities section" id="activites">
          <div className="section__inner">
            <Reveal>
              <span className="section__label section__label--light">Vie parascolaire</span>
              <h2 className="section__title section__title--light">
                12 clubs pour <em>s'éveiller à chaque passion</em>
              </h2>
              <p className="activities__lead">
                Au-delà des cours, l'École Médione offre un écosystème d'activités pour révéler
                les talents cachés de chaque élève.
              </p>
            </Reveal>
            <div className="activities__grid">
              {ACTIVITIES.map((a, i) => (
                <Reveal key={a.label} delay={i * 35}>
                  <div className="activity-pill">
                    <span className="activity-pill__icon">{a.icon}</span>
                    <span className="activity-pill__label">{a.label}</span>
                    <span className="activity-pill__cat">{a.category}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══ */}
        <section className="testimonials section" id="temoignages">
          <div className="section__inner">
            <Reveal>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40, marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <span className="section__label">Témoignages</span>
                  <h2 className="section__title" style={{ marginBottom: 0 }}>
                    Ce que disent <em>nos familles</em>
                  </h2>
                </div>
                <p style={{ fontSize: '0.97rem', color: 'var(--text-mid)', lineHeight: 1.78, maxWidth: 340, flexShrink: 0 }}>
                  Des témoignages authentiques de ceux qui vivent l'expérience Médione au quotidien.
                </p>
              </div>
            </Reveal>

            <div className="testimonials__track">
              {TESTIMONIALS.map((t, i) => (
                <div
                  key={i}
                  className={`testimonial-card ${i === activeTesti ? 'testimonial-card--active' : ''}`}
                  onClick={() => setActiveTesti(i)}
                >
                  <div className="testimonial-card__num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="testimonial-card__content">
                    <span className="testimonial-card__stars">{'★'.repeat(5)}</span>
                    <p className="testimonial-card__text">"{t.quote}"</p>
                    <div className="testimonial-card__footer">
                      <div className="testimonial-card__avatar">{t.initials}</div>
                      <div>
                        <span className="testimonial-card__name">{t.author}</span>
                        <span className="testimonial-card__role">{t.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="testimonials__dots">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`testimonials__dot ${i === activeTesti ? 'testimonials__dot--on' : ''}`}
                  onClick={() => setActiveTesti(i)}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>

            <div className="section-rule">
              <div className="section-rule__accent" />
              <span className="section-rule__label">{TESTIMONIALS.length} témoignages</span>
              <div className="section-rule__line" />
            </div>
          </div>
        </section>

        {/* ══ QUOTE BANNER ══ */}
        <section className="quote-banner">
          <div className="quote-banner__inner">
            <Reveal>
              <span className="quote-banner__mark">"</span>
              <blockquote className="quote-banner__text">
                L'éducation est l'arme la plus puissante que vous puissiez utiliser pour changer le monde.
              </blockquote>
              <cite className="quote-banner__cite">— Nelson Mandela</cite>
            </Reveal>
          </div>
        </section>

        {/* ══ TEAM — dark navy manifesto ══ */}
        <section className="team section" id="equipe">
          <div className="section__inner">
            <Reveal>
              <span className="section__label section__label--light">Notre équipe</span>
              <h2 className="section__title section__title--light">
                Des visages derrière <em>l'excellence</em>
              </h2>
            </Reveal>
            <div className="team__grid">
              {TEAM.map((m, i) => (
                <Reveal key={m.name} delay={i * 80}>
                  <div className="team-card">
                    <div className="team-card__avatar">{m.initials}</div>
                    <h3 className="team-card__name">{m.name}</h3>
                    <span className="team-card__role">{m.role}</span>
                    <span className="team-card__exp">{m.exp} d'expérience</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ PROCESS — orientation steps ══ */}
        <section className="process section" id="admissions">
          <div className="section__inner">
            <Reveal>
              <span className="section__label">Processus d'admission</span>
              <h2 className="section__title">S'inscrire en <em>4 étapes simples</em></h2>
            </Reveal>
            <div className="process__steps">
              {[
                { n: '01', icon: '📋', title: 'Constitution du dossier', desc: "Rassemblez les bulletins, acte de naissance, photos d'identité et le formulaire d'inscription." },
                { n: '02', icon: '📬', title: 'Dépôt & examen',          desc: "Déposez votre dossier au secrétariat ou en ligne. Notre équipe l'examine sous 72h." },
                { n: '03', icon: '🤝', title: 'Entretien de bienvenue',  desc: "Un responsable vous reçoit avec votre enfant pour un échange personnalisé et chaleureux." },
                { n: '04', icon: '🎉', title: 'Confirmation & accueil',  desc: "Signature du contrat, présentation des classes et intégration dans la communauté Médione." },
              ].map((s, i) => (
                <Reveal key={s.n} delay={i * 100}>
                  <div className="process-step">
                    <div className="process-step__bubble">
                      <span>{s.icon}</span>
                    </div>
                    <span className="process-step__num">{s.n}</span>
                    <h3 className="process-step__title">{s.title}</h3>
                    <p className="process-step__desc">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FAQ — dark navy ══ */}
        <section className="faq section" id="faq">
          <div className="section__inner faq__inner">
            <Reveal className="faq__left">
              <span className="section__label section__label--light">Questions fréquentes</span>
              <h2 className="section__title section__title--light" style={{ marginBottom: '16px' }}>
                Tout ce que vous <em>souhaitez savoir</em>
              </h2>
              <p className="faq__lead">
                Une autre question ? Notre équipe est disponible du lundi au vendredi de 9h à 17h.
              </p>
            </Reveal>

            <Reveal className="faq__right" delay={100}>
              <div className="faq-manifesto">
                {FAQ.map((item, i) => (
                  <FaqItem key={i} q={item.q} a={item.a} index={i + 1} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ CTA — coral ══ */}
        <section className="cta-section">
          <div className="cta-section__inner">
            <Reveal>
              <span className="cta-section__badge">Inscriptions 2025 ouvertes</span>
              <h2 className="cta-section__title">
                Prêt à rejoindre<br />la famille <em>Médione</em> ?
              </h2>
              <p className="cta-section__sub">
                Offrez à votre enfant un environnement d'excellence, de bienveillance
                et d'innovation. Les places sont limitées.
              </p>
              <div className="cta-section__actions">
                <a href="/Inscrire"   className="btn btn--cta-primary btn--lg">S'inscrire →</a>
                <a href="/Connection" className="btn btn--cta-ghost btn--lg">Espace famille</a>
              </div>
              <div className="cta-section__contact">
                <a href="tel:+212612892323" className="cta-section__contact-link">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.68 9.81 19.79 19.79 0 0 1 1.61 2.2 2 2 0 0 1 3.6.02h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.08 6.08l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  +212 6 12 89 23 23
                </a>
                <span className="cta-section__contact-sep">·</span>
                <a href="mailto:contact@ecolemedione.ma" className="cta-section__contact-link">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  contact@ecolemedione.ma
                </a>
              </div>
            </Reveal>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}