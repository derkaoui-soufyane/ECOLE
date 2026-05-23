import React, { useEffect, useRef, useState } from 'react'
import Menu from '../menu/menu'
import Footer from '../footer/footer'
import './mission&valeur.css'

/* ════════════════════════════════════════════════
   Scroll reveal wrapper — identical to home page
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
   Animated counter — identical to home page
════════════════════════════════════════════════ */
function CountUp({ end, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let cur = 0
          const inc = Math.ceil(end / (1600 / 16))
          const t = setInterval(() => {
            cur += inc
            if (cur >= end) { setVal(end); clearInterval(t) }
            else setVal(cur)
          }, 16)
        }
      },
      { threshold: 0.4 }
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [end])
  return <span ref={ref}>{val}{suffix}</span>
}

/* ════════════════════════════════════════════════
   Badge pill — home page component
════════════════════════════════════════════════ */
function BadgePill({ children, variant = 'default' }) {
  return <span className={`badge-pill badge-pill--${variant}`}>{children}</span>
}

/* ════════════════════════════════════════════════
   Section footer rule — home page component
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
   Accordion item for Philosophy timeline
════════════════════════════════════════════════ */
function PhilosophyItem({ step, title, body, tags, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`phil-item ${open ? 'phil-item--open' : ''}`}
      onClick={() => setOpen(p => !p)}
    >
      <div className="phil-item__row">
        <span className="phil-item__index">{String(index).padStart(2, '0')}</span>
        <div className="phil-item__mid">
          <span className="phil-item__icon">{step.icon}</span>
          <span className="phil-item__title">{title}</span>
        </div>
        <span className="phil-item__toggle">{open ? '−' : '+'}</span>
      </div>
      {open && (
        <div className="phil-item__body">
          <p className="phil-item__text">{body}</p>
          <div className="phil-item__tags">
            {tags.map(t => (
              <span key={t} className="phil-item__tag">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════
   Commitment bar — animated on reveal
════════════════════════════════════════════════ */
function CommitBar({ width }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="commit-bar">
      <div
        className="commit-bar__fill"
        style={{ width: visible ? `${width}%` : '0%' }}
      />
    </div>
  )
}

/* ════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════ */
const VALUES = [
  { num: '01', icon: '⭐', title: 'Excellence', desc: 'Nous cultivons l\'exigence intellectuelle et la rigueur académique dans chaque discipline, préparant nos élèves à atteindre leur plein potentiel.', tag: 'Priorité centrale' },
  { num: '02', icon: '🤝', title: 'Communauté', desc: 'Notre école est une famille élargie où chaque élève, parent et enseignant participe à construire un environnement de confiance et d\'appartenance.', tag: 'Lien humain' },
  { num: '03', icon: '💛', title: 'Bienveillance', desc: 'Chaque enfant mérite d\'évoluer dans un cadre chaleureux, sécurisant et encourageant qui nourrit sa confiance en soi et son épanouissement.', tag: 'Bien-être' },
  { num: '04', icon: '⚡', title: 'Innovation', desc: 'Nous intégrons des méthodes pédagogiques modernes et des outils numériques pour préparer les élèves aux défis du monde de demain.', tag: 'Pédagogie active' },
  { num: '05', icon: '🏛️', title: 'Intégrité', desc: 'Nous formons des citoyens droits, responsables et éthiques, conscients de leur rôle dans la société marocaine et dans le monde.', tag: 'Caractère' },
  { num: '06', icon: '🌍', title: 'Ouverture', desc: 'Nous encourageons la curiosité culturelle, le multilinguisme et l\'esprit critique pour former des esprits ouverts et des citoyens du monde.', tag: 'Culture globale' },
]

const PILLARS = [
  { icon: '📚', title: 'Excellence académique', desc: 'Programmes rigoureux alignés sur les standards nationaux et internationaux' },
  { icon: '🌱', title: 'Épanouissement personnel', desc: 'Développement global : émotionnel, social, physique et créatif' },
  { icon: '🛡️', title: 'Formation du caractère', desc: 'Intégrité, responsabilité, empathie et leadership éthique' },
]

const STATS = [
  { end: 25,   suffix: '+', label: "Années d'expérience",   desc: 'D\'excellence éducative à Fès' },
  { end: 1400, suffix: '',  label: 'Élèves accueillis',     desc: 'De la maternelle au lycée' },
  { end: 98,   suffix: '%', label: 'Taux de réussite',      desc: 'Au baccalauréat national' },
  { end: 120,  suffix: '',  label: 'Enseignants qualifiés', desc: 'Corps pédagogique dévoué' },
]

const PHILOSOPHY_STEPS = [
  {
    icon: '🛡️',
    title: 'Sécurité & Confiance',
    body: 'Avant tout apprentissage, l\'enfant doit se sentir en sécurité. Nous créons un cadre bienveillant où chaque élève ose s\'exprimer, questionner et se tromper sans crainte du jugement.',
    tags: ['Environnement sécurisant', 'Respect mutuel', 'Écoute active'],
  },
  {
    icon: '📖',
    title: 'Éveil & Curiosité',
    body: 'Nous stimulons la curiosité naturelle de chaque enfant à travers des approches pédagogiques actives, des projets interdisciplinaires et une exploration ludique des savoirs.',
    tags: ['Apprentissage actif', 'Projets créatifs', 'Curiosité cultivée'],
  },
  {
    icon: '📈',
    title: 'Rigueur & Persévérance',
    body: 'L\'excellence s\'acquiert par le travail régulier et l\'effort soutenu. Nous accompagnons les élèves dans le développement de leur discipline personnelle et leur goût de l\'effort.',
    tags: ['Méthode de travail', 'Objectifs progressifs', 'Suivi personnalisé'],
  },
  {
    icon: '🌐',
    title: 'Responsabilité & Citoyenneté',
    body: 'Nous préparons des individus conscients de leur impact sur leur communauté et leur monde. Le sens des responsabilités, l\'empathie et l\'engagement civique sont au cœur de notre formation.',
    tags: ['Engagement social', 'Esprit civique', 'Leadership éthique'],
  },
  {
    icon: '🌟',
    title: 'Épanouissement & Rayonnement',
    body: 'L\'aboutissement de notre démarche éducative : un élève confiant, autonome, créatif et prêt à rayonner dans sa vie future. Nous célébrons chaque réussite, grande ou petite.',
    tags: ['Autonomie', 'Confiance en soi', 'Réussite durable'],
  },
]

const APPROACH_ROWS = [
  {
    num: '01',
    title: 'Une pédagogie',
    titleEm: 'centrée sur l\'enfant',
    body: 'Chez École Médione, chaque élève est unique. Nos équipes pédagogiques adaptent les approches d\'enseignement aux rythmes, aux styles d\'apprentissage et aux intérêts de chaque enfant. Nous rejetons le modèle uniforme au profit d\'un accompagnement personnalisé et bienveillant.',
    features: [
      'Différenciation pédagogique systématique',
      'Évaluation formative et bienveillante',
      'Groupes de niveau adaptatifs',
      'Soutien individualisé disponible',
    ],
    tag: 'Approche individuelle',
    img: 'img-pedagogy.png',
  },
  {
    num: '02',
    title: 'L\'environnement comme',
    titleEm: 'troisième enseignant',
    body: 'Nos espaces sont conçus pour stimuler la curiosité, favoriser la collaboration et inspirer la créativité. Des salles de classe modulables aux jardins pédagogiques, chaque espace est pensé pour maximiser l\'apprentissage.',
    features: [
      'Architectures d\'apprentissage flexibles',
      'Espaces naturels et jardins pédagogiques',
      'Laboratoires STEM équipés',
      'Bibliothèque multimédia moderne',
    ],
    tag: 'Espaces inspirants',
    img: 'img-spaces.png',
  },
  {
    num: '03',
    title: 'Le partenariat',
    titleEm: 'École–Famille',
    body: 'La réussite scolaire est une œuvre collective. Nous impliquons activement les familles dans la vie de l\'école à travers des rencontres régulières, une communication transparente et des projets participatifs.',
    features: [
      'Réunions trimestrielles structurées',
      'Portail numérique parents en temps réel',
      'Ateliers de parentalité positive',
      'Conseil des parents actif et représentatif',
    ],
    tag: 'Familles partenaires',
    img: 'img-family.png',
  },
]

const COMMITMENTS = [
  { icon: '🎯', title: 'Qualité Pédagogique', body: 'Programmes alignés sur les meilleures pratiques internationales tout en restant ancrés dans le curricula national marocain. Nos enseignants sont formés en continu.', bar: 95 },
  { icon: '💻', title: 'Innovation Numérique', body: 'Intégration maîtrisée des outils numériques dans les apprentissages : tablettes, tableaux interactifs, plateformes adaptatives et initiation au codage.', bar: 82 },
  { icon: '🌍', title: 'Ouverture Internationale', body: 'Enseignement renforcé de l\'anglais et du français, partenariats avec des établissements étrangers et projets d\'échange culturel.', bar: 78 },
  { icon: '🎨', title: 'Vie Scolaire Épanouissante', body: 'Clubs parascolaires, activités sportives, ateliers artistiques et sorties éducatives contribuent au développement global de la personnalité.', bar: 90 },
  { icon: '📡', title: 'Communication Transparente', body: 'Bulletins détaillés, suivi hebdomadaire en ligne, réunions parents-profs et journal de bord numérique accessible à tout moment.', bar: 88 },
  { icon: '🛡️', title: 'Sécurité & Bien-être', body: 'Environnement sécurisé avec surveillance continue, infirmerie professionnelle, politique anti-harcèlement stricte et accompagnement psychologique.', bar: 100 },
]

const TEAM = [
  { name: 'Dr. Karim Benali', role: 'Directeur Général', bio: 'Docteur en sciences de l\'éducation, 20 ans d\'expérience dans la direction d\'établissements privés au Maroc et à l\'étranger.', initial: 'K' },
  { name: 'Mme. Souad Tazi', role: 'Directrice Pédagogique', bio: 'Spécialiste en pédagogie différenciée, ancienne formatrice à l\'Académie Régionale de Fès-Meknès.', initial: 'S' },
  { name: 'M. Youssef Chraibi', role: 'Responsable Cycle Primaire', bio: '15 ans d\'expérience dans l\'enseignement primaire, passionné par les méthodes actives et l\'apprentissage par le jeu.', initial: 'Y' },
  { name: 'Mme. Laila Berrada', role: 'Coordinatrice Vie Scolaire', bio: 'Psychologue scolaire et coordinatrice parascolaire, elle veille à l\'épanouissement global de chaque élève.', initial: 'L' },
]

/* ════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════ */
export default function Page_mission() {
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <>
      <Menu scrolled={isScrolled} />

      {/* ══ HERO ══ */}
      <section className="mv-hero">
        <div className="mv-hero__bg">
          <img src="mission&valeurs.png" alt="Mission et valeurs" className="mv-hero__bg-img" />
          
        </div>

        

        {/* Stats bar — identical pattern to home page */}
        
      </section>

      {/* ══ MARQUEE ══ */}
      
      {/* ══ MANIFESTO STRIP ══ */}
      <section className="mv-manifesto">
        <ScrollReveal>
          <div className="mv-manifesto__inner">
            <p className="mv-manifesto__quote">
              « Éduquer, ce n'est pas remplir un vase, c'est <em>allumer un feu.</em> »
            </p>
            <div className="mv-manifesto__author">
              <span className="mv-manifesto__author-line" />
              Philosophie fondatrice — École Médione, 1999
              <span className="mv-manifesto__author-line" />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ══ MISSION — split layout ══ */}
      <section className="mv-mission-section" id="mission">
        <div className="section-inner">
          <div className="mv-mission-section__grid">

            <ScrollReveal className="mv-mission-section__visual">
              <div className="mv-mission-section__img-wrap">
                <img src="notre_mission.png" alt="Notre mission" className="mv-mission-section__img" />
                <div className="mv-mission-section__img-tag">Notre mission</div>
              </div>
              <div className="mv-mission-section__badge">
                <span className="mv-mission-section__badge-num">25+</span>
                <span className="mv-mission-section__badge-text">ans d'excellence</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80} className="mv-mission-section__content">
              <BadgePill>Notre mission</BadgePill>
              <h2 className="section-title">
                Former des êtres<br /><em className="section-title__em">complets et accomplis</em>
              </h2>
              <p className="section-lead">
                La mission d'École Médione est de dispenser un enseignement de qualité supérieure
                qui équilibre l'excellence académique, l'épanouissement personnel et le développement
                du caractère. Nous préparons des jeunes citoyens marocains à contribuer positivement
                à leur communauté et à s'adapter à un monde en constante évolution.
              </p>
              <p className="section-lead" style={{ marginTop: '0.75rem' }}>
                Notre approche intègre les meilleures pratiques pédagogiques internationales
                dans un cadre profondément ancré dans les valeurs et la culture marocaines.
              </p>

              {/* Pillar items — manifesto style */}
              <div className="mv-pillars">
                {PILLARS.map((p, i) => (
                  <div key={i} className="mv-pillar">
                    <span className="mv-pillar__icon">{p.icon}</span>
                    <div>
                      <strong className="mv-pillar__title">{p.title}</strong>
                      <span className="mv-pillar__desc">{p.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ══ VALUES — manifesto grid (home page pattern) ══ */}
      <section className="mv-values-section" id="valeurs">
        <div className="section-inner">
          <ScrollReveal>
            <div className="values-section__header">
              <div>
                <BadgePill>Nos valeurs fondatrices</BadgePill>
                <h2 className="section-title">
                  Six piliers qui<br /><em className="section-title__em">nous définissent</em>
                </h2>
              </div>
              <p className="values-section__lead">
                Ces valeurs ne sont pas de simples mots affichés sur des murs. Elles guident
                chaque décision pédagogique, chaque interaction et chaque projet de notre école.
              </p>
            </div>
          </ScrollReveal>

          <div className="values-manifesto">
            {VALUES.map((v, i) => (
              <ScrollReveal key={i} delay={i * 55}>
                <div className="value-item">
                  <div className="value-item__num">{v.num}</div>
                  <div className="value-item__content">
                    <span className="value-item__icon">{v.icon}</span>
                    <div className="value-item__header">
                      <h3 className="value-item__title">{v.title}</h3>
                      <span className="value-item__tag">{v.tag}</span>
                    </div>
                    <p className="value-item__desc">{v.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <SectionRule label="6 valeurs fondatrices" />
        </div>
      </section>

      {/* ══ STATS — dark navy, manifesto pattern (home page) ══ */}
      <section className="mv-stats-section">
        <div className="section-inner">
          <ScrollReveal>
            <div className="stats-section__header">
              <div>
                <BadgePill variant="light">Nos chiffres</BadgePill>
                <h2 className="section-title section-title--light">
                  Une école qui<br /><em>fait ses preuves</em>
                </h2>
              </div>
              <p className="stats-section__lead">
                Depuis 1999, l'École Médione construit, année après année, un bilan
                d'excellence reconnu dans toute la région de Fès-Meknès.
              </p>
            </div>
          </ScrollReveal>

          <div className="stats-manifesto">
            {STATS.map((s, i) => (
              <ScrollReveal key={i} delay={i * 70}>
                <div className="stat-item">
                  <div className="stat-item__index">{String(i + 1).padStart(2, '0')}</div>
                  <div className="stat-item__body">
                    <div className="stat-item__top">
                      <div className="stat-item__value-row">
                        <span className="stat-item__value">
                          <CountUp end={s.end} suffix={s.suffix} />
                        </span>
                      </div>
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

      {/* ══ PHILOSOPHY — accordion on ivory ══ */}
      <section className="mv-philosophy-section" id="philosophie">
        <div className="section-inner">
          <ScrollReveal>
            <div className="mv-philosophy-section__header">
              <div>
                <BadgePill>Notre philosophie</BadgePill>
                <h2 className="section-title">
                  Un parcours pensé<br /><em className="section-title__em">étape par étape</em>
                </h2>
              </div>
              <p className="mv-philosophy-section__lead">
                Notre philosophie éducative s'articule autour d'un chemin progressif,
                du fondement à l'épanouissement total de l'enfant.
              </p>
            </div>
          </ScrollReveal>

          {/* Accordion list — same structure as FAQ on home page */}
          <div className="phil-manifesto">
            {PHILOSOPHY_STEPS.map((step, i) => (
              <ScrollReveal key={i} delay={i * 45}>
                <PhilosophyItem
                  step={step}
                  title={step.title}
                  body={step.body}
                  tags={step.tags}
                  index={i + 1}
                />
              </ScrollReveal>
            ))}
          </div>

          <SectionRule label="5 étapes fondatrices" />
        </div>
      </section>

      {/* ══ APPROACH — alternating rows on navy ══ */}
      <section className="mv-approach-section" id="approche">
        <div className="section-inner">
          <ScrollReveal>
            <BadgePill variant="light">Notre approche concrète</BadgePill>
            <h2 className="section-title section-title--light">
              Comment nous <em>mettons en œuvre</em><br />nos valeurs
            </h2>
            <p className="section-lead" style={{ color: 'var(--text-light-mid)' }}>
              Les valeurs sans action ne sont que des mots. Voici comment nous les incarnons
              au quotidien dans la vie de l'école.
            </p>
          </ScrollReveal>

          <div className="mv-approach-rows">
            {APPROACH_ROWS.map((row, i) => (
              <ScrollReveal key={i} delay={60}>
                <div className={`mv-approach-row ${i % 2 !== 0 ? 'mv-approach-row--reverse' : ''}`}>

                  <div className="mv-approach-row__visual">
                    <div className="mv-approach-row__img-wrap">
                      <img src={row.img} alt={row.title} className="mv-approach-row__img" />
                      <div className="mv-approach-row__img-tag">
                        <span className="mv-approach-row__img-tag-dot" />
                        {row.tag}
                      </div>
                    </div>
                    {/* Coral top-edge accent — same as home pedagogy image */}
                    <div className="mv-approach-row__img-accent" />
                  </div>

                  <div className="mv-approach-row__content">
                    <div className="mv-approach-row__big-num" aria-hidden="true">{row.num}</div>
                    <h3 className="mv-approach-row__title">
                      {row.title}<br /><em>{row.titleEm}</em>
                    </h3>
                    <p className="mv-approach-row__body">{row.body}</p>
                    <ul className="mv-approach-row__features">
                      {row.features.map((f, j) => (
                        <li key={j} className="mv-approach-row__feature">
                          <span className="mv-approach-row__feature-dot" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COMMITMENTS — horizontal scroll on ivory ══ */}
      <section className="mv-commitments-section">
        <div className="mv-commitments-section__header">
          <div className="section-inner">
            <ScrollReveal>
              <div className="mv-commitments-section__header-inner">
                <div>
                  <BadgePill>Nos engagements</BadgePill>
                  <h2 className="section-title">
                    Ce que nous vous <em className="section-title__em">promettons</em>
                  </h2>
                </div>
                <span className="mv-commitments-section__hint">← Faire défiler →</span>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="mv-commitments-track">
          {COMMITMENTS.map((c, i) => (
            <div key={i} className="commit-card">
              <span className="commit-card__icon">{c.icon}</span>
              <h3 className="commit-card__title">{c.title}</h3>
              <p className="commit-card__body">{c.body}</p>
              <div className="commit-card__bar-label">
                <span>Niveau d'engagement</span>
                <span>{c.bar}%</span>
              </div>
              <CommitBar width={c.bar} />
            </div>
          ))}
        </div>
      </section>

      {/* ══ TEAM — manifesto-style cards on ivory ══ */}
      <section className="mv-team-section" id="equipe">
        <div className="section-inner">
          <ScrollReveal>
            <div className="values-section__header">
              <div>
                <BadgePill>Notre équipe</BadgePill>
                <h2 className="section-title">
                  Les visages de<br /><em className="section-title__em">l'école Médione</em>
                </h2>
              </div>
              <p className="values-section__lead">
                Une équipe de direction passionnée et expérimentée, au service
                de la réussite de chaque élève depuis plus de 25 ans.
              </p>
            </div>
          </ScrollReveal>

          <div className="mv-team-manifesto">
            {TEAM.map((m, i) => (
              <ScrollReveal key={i} delay={i * 65}>
                <div className="team-item">
                  <div className="team-item__index">{String(i + 1).padStart(2, '0')}</div>
                  <div className="team-item__content">
                    <div className="team-item__avatar">{m.initial}</div>
                    <div>
                      <h3 className="team-item__name">{m.name}</h3>
                      <span className="team-item__role">{m.role}</span>
                      <p className="team-item__bio">{m.bio}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <SectionRule label="4 membres de direction" />
        </div>
      </section>

      {/* ══ CTA — coral, same as home page ══ */}
      <section className="mv-cta-section">
        <div className="mv-cta-section__inner">
          <ScrollReveal>
            <BadgePill variant="cta">Rejoindre la famille Médione</BadgePill>
            <h2 className="mv-cta-section__title">
              Prêt à offrir à votre enfant<br />le meilleur <em>départ dans la vie</em> ?
            </h2>
            <p className="mv-cta-section__subtitle">
              Inscriptions 2025–2026 ouvertes. Visitez notre établissement et rencontrez
              nos équipes pour découvrir par vous-même ce qui fait la singularité d'École Médione.
            </p>
            <div className="mv-cta-section__actions">
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