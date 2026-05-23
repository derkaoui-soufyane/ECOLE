import React, { useEffect, useRef, useState } from 'react'
import Menu from '../menu/menu'
import Footer from '../footer/footer'
import './acceuil.css'

/* ════════════════════════════════════════════════
   Intersection Observer reveal wrapper
════════════════════════════════════════════════ */
function ScrollReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.08 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'scroll-reveal--visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ════════════════════════════════════════════════
   Animated number counter
════════════════════════════════════════════════ */
function CountUp({ end, suffix = '' }) {
  const [currentValue, setCurrentValue] = useState(0)
  const elementRef = useRef(null)
  const hasStarted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true
          let current = 0
          const increment = Math.ceil(end / (1600 / 16))
          const timer = setInterval(() => {
            current += increment
            if (current >= end) {
              setCurrentValue(end)
              clearInterval(timer)
            } else {
              setCurrentValue(current)
            }
          }, 16)
        }
      },
      { threshold: 0.4 }
    )
    if (elementRef.current) observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [end])

  return <span ref={elementRef}>{currentValue}{suffix}</span>
}

/* ════════════════════════════════════════════════
   Badge Pill
════════════════════════════════════════════════ */
function BadgePill({ children, variant = 'default' }) {
  return <span className={`badge-pill badge-pill--${variant}`}>{children}</span>
}

/* ════════════════════════════════════════════════
   Marquee banner
════════════════════════════════════════════════ */
function MarqueeBanner() {
  const words = [
    'Baccalauréat', 'Excellence', 'Sciences', 'Orientation',
    'Avenir', 'Confiance', 'Filières', 'Réussite', 'Université', 'Innovation',
  ]
  return (
    <div className="marquee-banner__track-wrapper">
      <div className="marquee-banner__track">
        {[...words, ...words].map((word, i) => (
          <span key={i} className="marquee-banner__word">
            {word}
            <span className="marquee-banner__sep">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════
   FAQ Item
════════════════════════════════════════════════ */
function FaqItem({ question, answer, index }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div
      className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}
      onClick={() => setIsOpen(p => !p)}
    >
      <div className="faq-item__row">
        <span className="faq-item__index">{String(index).padStart(2, '0')}</span>
        <span className="faq-item__question">{question}</span>
        <span className="faq-item__toggle">{isOpen ? '−' : '+'}</span>
      </div>
      {isOpen && (
        <div className="faq-item__answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════
   Page component
════════════════════════════════════════════════ */
export default function Acceuil() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* ── Data ── */
  const filieres = [
    { code: 'SVT', title: 'Sciences de la Vie et de la Terre', desc: 'Biologie, géologie, environnement. Passerelle vers médecine, pharmacie et biochimie.', icon: '🔬' },
    { code: 'PC',  title: 'Physique-Chimie', desc: "Sciences expérimentales et exactes. Idéal pour les classes préparatoires et l'ingénierie.", icon: '⚗️' },
    { code: 'SM',  title: 'Sciences Mathématiques', desc: 'Mathématiques avancées et physique. La voie royale vers les grandes écoles.', icon: '📐' },
    { code: 'L',   title: 'Lettres & Sciences Humaines', desc: "Littérature, philosophie, histoire. Formation complète de l'esprit critique.", icon: '📖' },
    { code: 'ECO', title: 'Sciences Économiques', desc: 'Économie, gestion et droit. Préparation aux écoles de commerce et aux universités.', icon: '📊' },
  ]

  const clubs = [
    { name: 'Club Sciences', memberCount: '42 membres', icon: '🔬', desc: 'Expériences, olympiades scientifiques et visites de laboratoires universitaires.' },
    { name: 'Club Débat', memberCount: '28 membres', icon: '🗣️', desc: 'Tournois de plaidoirie, moot courts et conférences Model United Nations.' },
    { name: 'Club Arts', memberCount: '35 membres', icon: '🎨', desc: "Peinture, sculpture, photographie et expositions de fin d'année." },
    { name: 'Club Entrepreneuriat', memberCount: '31 membres', icon: '💡', desc: 'Mini-entreprises, concours de startups et mentorat par des professionnels.' },
    { name: 'Club Sport', memberCount: '60 membres', icon: '⚽', desc: 'Football, basketball, athlétisme et compétitions interétablissements.' },
    { name: 'Club Langues', memberCount: '38 membres', icon: '🌍', desc: "Anglais, espagnol, allemand et échanges avec des lycéens étrangers." },
  ]

  const orientationSteps = [
    { number: '01', title: 'Bilan de compétences', desc: "Tests d'aptitude et entretiens individuels pour identifier les forces et passions de chaque élève." },
    { number: '02', title: 'Exploration des filières', desc: "Journées portes ouvertes, rencontres avec des professionnels et anciens élèves de chaque secteur." },
    { number: '03', title: 'Projet personnalisé', desc: "Co-construction d'un plan d'études sur-mesure avec un conseiller dédié et la famille." },
    { number: '04', title: 'Accompagnement post-bac', desc: "Aide aux dossiers d'inscription, préparation aux concours et suivi jusqu'à l'intégration." },
  ]

  const values = [
    { num: '01', icon: '🎓', title: 'Rigueur académique', desc: 'Un enseignement exigeant aligné sur les standards nationaux et internationaux.' },
    { num: '02', icon: '🧭', title: 'Orientation active', desc: "Chaque élève repart avec un projet d'avenir clair et un accompagnement personnalisé." },
    { num: '03', icon: '🌍', title: 'Ouverture sur le monde', desc: 'Partenariats internationaux, échanges scolaires et programmes bilingues.' },
    { num: '04', icon: '💬', title: 'Dialogue constant', desc: "Communication transparente et régulière entre l'équipe pédagogique et les familles." },
    { num: '05', icon: '⚡', title: 'Innovation pédagogique', desc: 'Classes inversées, projets interdisciplinaires et outils numériques avancés.' },
    { num: '06', icon: '🤝', title: 'Bienveillance & Écoute', desc: "Un cadre sécurisant où chaque élève peut s'exprimer, échouer et progresser." },
  ]

  const stats = [
    {
      value: '98', suffix: '%',
      label: 'Taux de réussite au bac',
      desc: "Nos bacheliers réussissent à 98 %, soit 25 points au-dessus de la moyenne nationale.",
      detail: 'depuis 12 ans',
      icon: '🏆',
    },
    {
      value: '85', suffix: '%',
      label: 'Mentions Bien & TB',
      desc: "85 % de nos élèves obtiennent une mention, ouvrant les portes des meilleures filières.",
      detail: 'en moyenne',
      icon: '⭐',
    },
    {
      value: '100', suffix: '%',
      label: 'Orientés post-bac',
      desc: "Chaque bachelier repart avec un dossier validé dans une filière universitaire adaptée.",
      detail: 'chaque année',
      icon: '🎯',
    },
  ]

  const testimonials = [
    {
      quote: "Grâce à MDIONE, j'ai intégré la faculté de médecine de Fès en première tentative. L'encadrement était exceptionnel.",
      author: 'Karim A.',
      role: 'Ancien élève, promo 2023',
      filiere: 'SVT',
      initial: 'K',
    },
    {
      quote: "Le club débat m'a complètement transformée. J'ai développé une confiance en moi que je n'aurais jamais cru possible.",
      author: 'Imane S.',
      role: 'Élève de Terminale',
      filiere: 'Lettres',
      initial: 'I',
    },
    {
      quote: "En tant que parent, je suis impressionné par le suivi individuel. Les professeurs connaissent mon fils par son prénom et ses objectifs.",
      author: 'M. El Ouazzani',
      role: "Père d'élève",
      filiere: 'Famille',
      initial: 'E',
    },
  ]

  const faqs = [
    { q: "Quels sont les prérequis pour s'inscrire en 1ère année du lycée ?", a: "Les candidats doivent avoir leur diplôme du collège (DEF ou équivalent) avec une moyenne minimale de 12/20. Un entretien d'orientation est organisé pour affiner le choix de filière." },
    { q: 'Proposez-vous des classes de soutien et de préparation aux examens ?', a: 'Oui, des séances de soutien hebdomadaires sont organisées par matière, et des stages intensifs de préparation au baccalauréat sont proposés en mars et mai.' },
    { q: 'Existe-t-il un internat ou une cantine ?', a: "Le lycée dispose d'une cafétéria et d'un espace repas. Des partenariats avec des logements de proximité sont disponibles pour les élèves venant de l'extérieur." },
    { q: "Comment se déroule le suivi de l'orientation professionnelle ?", a: "Chaque élève est affecté à un conseiller d'orientation dès la 1ère. Des bilans trimestriels, des rencontres avec des professionnels et des visites d'universités sont planifiés tout au long de l'année." },
    { q: 'Le lycée propose-t-il des cours de langues supplémentaires ?', a: "Oui, en plus du programme officiel, nous proposons des cours optionnels d'anglais avancé, d'espagnol et d'allemand via notre Club Langues et des partenariats avec des instituts culturels." },
  ]

  const counterItems = [
    { end: 98,  suffix: '%', label: 'Taux de réussite bac' },
    { end: 5,   suffix: '',  label: 'Filières au choix' },
    { end: 12,  suffix: '+', label: "Années d'excellence" },
    { end: 420, suffix: '+', label: 'Élèves actifs' },
  ]

  return (
    <>
      <Menu scrolled={isScrolled} />

      {/* ══ HERO ══ */}
      <section className="page-hero">
        <div className="page-hero__bg">
          <img src="page-home.png" alt="Lycée MDIONE" className="page-hero__bg-img" />
          <div className="page-hero__overlay" />
        </div>

        <div className="page-hero__content">
          <div className="page-hero__eyebrow">
            <img src="imagesv.png" alt="" className="page-hero__eyebrow-icon" />
            <span>Lycée d'excellence · Fès</span>
          </div>
          <h1 className="page-hero__title">
            Construire les<br />
            <em>leaders</em> de demain
          </h1>
          <p className="page-hero__subtitle">
            Un lycée exigeant et bienveillant qui prépare chaque élève au
            baccalauréat, à l'université et à un avenir ambitieux.
          </p>
          <div className="page-hero__actions">
            <a href="#filieres" className="btn btn--primary">Découvrir nos filières →</a>
            <a href="#orientation" className="btn btn--ghost">Notre approche</a>
          </div>
        </div>

        <div className="hero-stats-bar">
          {[
            { value: '98%', label: 'Réussite au bac' },
            { value: '6', label: 'Filières' },
            { value: '+12 ans', label: "D'excellence" },
            { value: '420+', label: 'Élèves' },
          ].map((s, i) => (
            <div key={i} className="hero-stats-bar__item">
              <span className="hero-stats-bar__value">{s.value}</span>
              <span className="hero-stats-bar__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="marquee-banner">
        <MarqueeBanner />
      </div>

      {/* ══ WHY US ══ */}
      <ScrollReveal className="why-us-section">
        <div className="section-inner">
          <div className="why-us-section__layout">
            <div className="why-us-section__left">
              <BadgePill>Pourquoi nous choisir</BadgePill>
              <h2 className="section-title">
                Un lycée qui prépare au bac<br />
                <em className="section-title__em">et bien au-delà</em>
              </h2>
            </div>
            <p className="why-us-section__text">
              MDIONE ne se limite pas à préparer les examens. Nous façonnons des
              jeunes adultes autonomes, curieux et ambitieux, capables de s'épanouir
              dans les meilleures universités du Maroc et du monde.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* ══ VISION & MISSION ══ */}
      <section className="vision-mission-section" id="vision">
        <div className="vision-mission-section__image-col">
          <img
            src="Untitled-1-Recovered.png"
            alt="Élèves en cours"
            className="vision-mission-section__photo"
          />
          <div className="vision-mission-section__badge">
            <span className="vision-mission-section__badge-num">+12</span>
            <span className="vision-mission-section__badge-text">ans d'excellence</span>
          </div>
        </div>
        <div className="vision-mission-section__cards-col">
          <ScrollReveal delay={0}>
            <div className="vm-card vm-card--vision">
              <div className="vm-card__header">
                <img src="content2-221-icon.png" alt="" className="vm-card__icon" />
                <h3 className="vm-card__heading">Notre vision</h3>
              </div>
              <p className="vm-card__body">
                Devenir le lycée de référence à Fès-Meknès, formant une génération
                de bacheliers brillants, prêts à intégrer les meilleures filières
                universitaires grâce à une pédagogie innovante et exigeante.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="vm-card vm-card--mission">
              <div className="vm-card__header">
                <img src="content2-223-icon.png" alt="" className="vm-card__icon" />
                <h3 className="vm-card__heading">Notre mission</h3>
              </div>
              <p className="vm-card__body">
                Accompagner chaque lycéen de la 1ère jusqu'au baccalauréat avec un
                suivi personnalisé, une orientation rigoureuse et un environnement
                stimulant qui donne à chacun les clés de sa réussite.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══ VALUES ══ */}
      <section className="values-section" id="valeurs">
        <div className="section-inner">
          <ScrollReveal>
            <div className="values-section__header">
              <div>
                <BadgePill>Nos valeurs</BadgePill>
                <h2 className="section-title">
                  Ce qui nous guide<br /><em className="section-title__em">chaque jour</em>
                </h2>
              </div>
              <p className="values-section__lead">
                Six principes fondateurs qui structurent notre pédagogie, notre
                relation aux élèves et notre vision de l'éducation.
              </p>
            </div>
          </ScrollReveal>

          <div className="values-manifesto">
            {values.map((v, i) => (
              <ScrollReveal key={i} delay={i * 55}>
                <div className="value-item">
                  <div className="value-item__num">{v.num}</div>
                  <div className="value-item__content">
                    <span className="value-item__icon">{v.icon}</span>
                    <h3 className="value-item__title">{v.title}</h3>
                    <p className="value-item__desc">{v.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="section-footer-rule">
            <div className="section-footer-rule__accent" />
            <span className="section-footer-rule__label">6 valeurs fondatrices</span>
            <div className="section-footer-rule__line" />
          </div>
        </div>
      </section>

      {/* ══ FILIÈRES ══ */}
      <section className="filieres-section" id="filieres">
        <div className="section-inner">
          <ScrollReveal>
            <BadgePill>Nos filières</BadgePill>
            <h2 className="section-title">
              Choisissez votre{' '}
              <em className="section-title__em">voie vers le bac</em>
            </h2>
            <p className="section-lead">
              Cinq filières rigoureuses, encadrées par des professeurs spécialisés,
              pour préparer le baccalauréat marocain et viser les meilleures universités.
            </p>
          </ScrollReveal>

          <div className="filieres-grid">
            {filieres.map((f, i) => (
              <ScrollReveal key={i} delay={i * 70}>
                <div className="filiere-card">
                  <div className="filiere-card__top">
                    <span className="filiere-card__icon">{f.icon}</span>
                    <span className="filiere-card__code">{f.code}</span>
                  </div>
                  <h3 className="filiere-card__title">{f.title}</h3>
                  <p className="filiere-card__desc">{f.desc}</p>
                  <div className="filiere-card__bar" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PEDAGOGY ══ */}
      <ScrollReveal className="pedagogy-section">
        <div className="section-inner">
          <BadgePill>Notre pédagogie</BadgePill>
          <div className="pedagogy-section__grid">
            <div className="pedagogy-section__text">
              <p className="pedagogy-section__eyebrow">Méthode active</p>
              <h2 className="section-title">
                Un enseignement vivant qui va<br />au-delà du manuel
              </h2>
              <p className="section-lead">
                Nos professeurs utilisent des méthodes actives — classes inversées,
                travaux pratiques, projets collectifs et débats — pour ancrer durablement
                les connaissances et développer l'esprit critique indispensable aux études supérieures.
              </p>
            </div>
            <div className="pedagogy-section__visual">
              <img
                src="content4-2-2-img.png"
                alt="Cours au lycée MDIONE"
                className="pedagogy-section__photo"
              />
              <div className="pedagogy-section__photo-tag">Méthode active</div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* ══ ORIENTATION ══ */}
      <section className="orientation-section" id="orientation">
        <div className="section-inner">
          <ScrollReveal>
            <BadgePill>Orientation</BadgePill>
            <h2 className="section-title">
              De la <em className="section-title__em">1ère</em> à l'université,<br />nous vous guidons
            </h2>
            <p className="section-lead">
              Notre cellule d'orientation accompagne chaque élève dans la construction
              de son projet professionnel, de l'exploration des filières jusqu'à l'inscription universitaire.
            </p>
          </ScrollReveal>

          <div className="orientation-grid">
            {orientationSteps.map((s, i) => (
              <ScrollReveal key={i} delay={i * 90}>
                <div className="orientation-step">
                  <div className="orientation-step__num">{s.number}</div>
                  <div className="orientation-step__body">
                    <h3 className="orientation-step__title">{s.title}</h3>
                    <p className="orientation-step__desc">{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STATS — REDESIGNED ══ */}
      <section className="stats-section" id="resultats">
        <div className="section-inner">
          <ScrollReveal>
            <div className="stats-section__header">
              <div>
                <BadgePill variant="light">Nos résultats</BadgePill>
                <h2 className="section-title section-title--light">
                  Des chiffres qui<br /><em>parlent d'eux-mêmes</em>
                </h2>
              </div>
              <p className="stats-section__lead">
                Année après année, le lycée MDIONE affiche des résultats parmi les
                meilleurs de la région Fès-Meknès.
              </p>
            </div>
          </ScrollReveal>

          <div className="stats-manifesto">
            {stats.map((s, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="stat-item">
                  <div className="stat-item__index">{String(i + 1).padStart(2, '0')}</div>
                  <div className="stat-item__body">
                    <div className="stat-item__top">
                      <div className="stat-item__value-row">
                        <span className="stat-item__value">{s.value}</span>
                        <span className="stat-item__suffix">{s.suffix}</span>
                      </div>
                      <span className="stat-item__detail">{s.detail}</span>
                    </div>
                    <h3 className="stat-item__label">{s.label}</h3>
                    <p className="stat-item__desc">{s.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LIVE COUNTERS ══ */}
      <section className="counters-section">
        <div className="counters-section__grid">
          {counterItems.map((c, i) => (
            <ScrollReveal key={i} delay={i * 80} className="counter-cell">
              <div className="counter-cell__number">
                <CountUp end={c.end} suffix={c.suffix} />
              </div>
              <div className="counter-cell__label">{c.label}</div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ══ CLUBS ══ */}
      <section className="clubs-section" id="vie-scolaire">
        <div className="section-inner">
          <ScrollReveal>
            <BadgePill>Vie scolaire</BadgePill>
            <h2 className="section-title">
              S'épanouir <em className="section-title__em">au-delà des cours</em>
            </h2>
            <p className="section-lead">
              Le lycée MDIONE offre une vie extrascolaire riche : clubs thématiques,
              compétitions, sorties culturelles et projets collaboratifs.
            </p>
          </ScrollReveal>

          <div className="clubs-grid">
            {clubs.map((c, i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <div className="club-card">
                  <div className="club-card__top">
                    <span className="club-card__icon">{c.icon}</span>
                    <span className="club-card__count">{c.memberCount}</span>
                  </div>
                  <h3 className="club-card__name">{c.name}</h3>
                  <p className="club-card__desc">{c.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS — REDESIGNED ══ */}
      <section className="testimonials-section" id="temoignages">
        <div className="section-inner">
          <ScrollReveal>
            <div className="testimonials-section__header">
              <div>
                <BadgePill>Témoignages</BadgePill>
                <h2 className="section-title">
                  Ce que disent<br /><em className="section-title__em">élèves et familles</em>
                </h2>
              </div>
              <p className="testimonials-section__lead">
                Des témoignages authentiques de ceux qui vivent l'expérience MDIONE au quotidien.
              </p>
            </div>
          </ScrollReveal>

          <div className="testimonials-manifesto">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="testimonial-item">
                  <div className="testimonial-item__num">{String(i + 1).padStart(2, '0')}</div>
                  <div className="testimonial-item__content">
                    <div className="testimonial-item__stars">{'★'.repeat(5)}</div>
                    <blockquote className="testimonial-item__quote">
                      "{t.quote}"
                    </blockquote>
                    <div className="testimonial-item__author">
                      <div className="testimonial-item__avatar">{t.initial}</div>
                      <div>
                        <span className="testimonial-item__name">{t.author}</span>
                        <span className="testimonial-item__role">{t.role}</span>
                      </div>
                      <span className="testimonial-item__filiere">{t.filiere}</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="section-footer-rule">
            <div className="section-footer-rule__accent" />
            <span className="section-footer-rule__label">3 témoignages</span>
            <div className="section-footer-rule__line" />
          </div>
        </div>
      </section>

      {/* ══ FAQ — REDESIGNED ══ */}
      <section className="faq-section" id="faq">
        <div className="section-inner">
          <ScrollReveal>
            <div className="faq-section__header">
              <div>
                <BadgePill variant="light">Questions fréquentes</BadgePill>
                <h2 className="section-title section-title--light">
                  Tout ce que vous<br /><em>devez savoir</em>
                </h2>
              </div>
              <p className="faq-section__lead">
                Des réponses claires à vos questions les plus importantes sur
                l'inscription, le suivi et la vie au lycée MDIONE.
              </p>
            </div>
          </ScrollReveal>

          <div className="faq-manifesto">
            {faqs.map((f, i) => (
              <ScrollReveal key={i} delay={i * 45}>
                <FaqItem question={f.q} answer={f.a} index={i + 1} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ══ */}
      <section className="cta-section">
        <div className="cta-section__inner">
          <ScrollReveal>
            <BadgePill variant="cta">Inscriptions ouvertes</BadgePill>
            <h2 className="cta-section__title">
              Prêt à rejoindre<br />le lycée <em>MDIONE</em> ?
            </h2>
            <p className="cta-section__subtitle">
              Places limitées pour l'année scolaire 2025–2026.<br />
              Déposez votre candidature dès aujourd'hui.
            </p>
            <div className="cta-section__actions">
              <a href="/inscrire" className="btn btn--cta-primary">Déposer une candidature →</a>
              <a href="#faq" className="btn btn--cta-ghost">En savoir plus</a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </>
  )
}