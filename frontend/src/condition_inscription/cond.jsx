import React, { useState, useRef, useEffect } from 'react'
import './cond.css'
import Menu from '../menu/menu'
import Footer from '../footer/footer'

/* ─── Reveal hook ─── */
function useReveal(threshold = 0.10) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold }
    )
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
      className={`ly-reveal ${visible ? 'ly-reveal--in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ─── SVG icons ─── */
const Icon = {
  book:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  flask:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6M9 3v6l-5.5 11A2 2 0 0 0 5 22h14a2 2 0 0 0 1.5-3L15 9V3"/><line x1="6.5" y1="17" x2="17.5" y2="17"/></svg>,
  chart:  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  star:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  check:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  info:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  warn:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  cal:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  grad:   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  arrow:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  plus:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  user:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  clock:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  down:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
}

/* ─── FAQ Item ─── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`ly-faq-item ${open ? 'ly-faq-item--open' : ''}`}>
      <div className="ly-faq-item__q" onClick={() => setOpen(o => !o)}>
        <span>{q}</span>
        <div className="ly-faq-item__q-icon">{Icon.plus}</div>
      </div>
      <div className="ly-faq-item__a">
        <div className="ly-faq-item__a-inner">{a}</div>
      </div>
    </div>
  )
}

/* ─── Document checklist with progress ring ─── */
function DocSection({ items }) {
  const [done, setDone] = useState([])
  const toggle = i => setDone(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])
  const pct = Math.round((done.length / items.length) * 100)
  const circumference = 408
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="ly-documents__body">
      <div className="ly-checklist">
        {items.map((item, i) => (
          <div
            key={i}
            className={`ly-check-item ${done.includes(i) ? 'ly-check-item--done' : ''}`}
            onClick={() => toggle(i)}
          >
            <div className={`ly-check-item__box ${done.includes(i) ? 'ly-check-item__box--done' : ''}`}>
              {done.includes(i) && Icon.check}
            </div>
            <span className="ly-check-item__label">{item.label}</span>
            <span className={`ly-check-item__tag ly-check-item__tag--${item.req === 'Obligatoire' ? 'req' : 'opt'}`}>
              {item.req}
            </span>
          </div>
        ))}
      </div>

      <div className="ly-documents__sidebar">
        <div className="ly-progress-ring-wrap">
          <div className="ly-progress-ring-title">Progression du dossier</div>
          <div className="ly-ring-container">
            <svg className="ly-ring-svg" width="140" height="140" viewBox="0 0 140 140">
              <circle className="ly-ring-bg" cx="70" cy="70" r="65" />
              <circle className="ly-ring-fill" cx="70" cy="70" r="65"
                style={{ strokeDashoffset: offset }} />
            </svg>
            <div className="ly-ring-label">
              <span className="ly-ring-pct">{pct}%</span>
              <span className="ly-ring-sub">complet</span>
            </div>
          </div>
          <p className="ly-progress-ring-desc">
            {done.length} sur {items.length} documents cochés.<br />
            Cliquez sur chaque document pour le valider.
          </p>
        </div>

        <div className="ly-doc-tips">
          {[
            { icon: Icon.info,   tip: <><strong>Originaux requis</strong> — Apportez les originaux + 2 photocopies lors du dépôt.</> },
            { icon: Icon.clock,  tip: <><strong>Délai de traitement :</strong> 5 jours ouvrés après réception du dossier complet.</> },
            { icon: Icon.shield, tip: <><strong>Confidentialité :</strong> Vos documents sont conservés de manière sécurisée et confidentielle.</> },
          ].map((t, i) => (
            <div key={i} className="ly-doc-tip">
              <span className="ly-doc-tip__icon">{t.icon}</span>
              <span className="ly-doc-tip__text">{t.tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Tuition Calculator ─── */
function Calculator() {
  const [year, setYear]         = useState('1ere')
  const [meals, setMeals]       = useState('non')
  const [transport, setTransport] = useState('non')
  const [payment, setPayment]   = useState('annuel')

  const BASE = { '1ere': 28500, 'tco': 30000, 'tce': 30000, 'tcs': 31500 }
  const base = BASE[year]
  const mealCost      = meals === 'oui' ? 4800 : 0
  const transportCost = transport === 'oui' ? 3600 : 0
  const total = base + mealCost + transportCost
  const displayed = payment === 'mensuel'
    ? Math.round(total / 10)
    : payment === 'trimestriel'
    ? Math.round(total / 3)
    : total
  const periodLabel = payment === 'mensuel'
    ? '/ mois (×10)'
    : payment === 'trimestriel'
    ? '/ trimestre (×3)'
    : '/ année scolaire'

  return (
    <div className="ly-calculator">
      <div className="ly-calculator__left">
        <h3 className="ly-calculator__title">Calculez votre budget</h3>
        <p className="ly-calculator__sub">
          Simulez le coût total de la scolarité selon votre classe, vos options et votre mode de paiement.
        </p>
        <div className="ly-calc-options">
          {[
            {
              label: 'Classe',
              value: year, set: setYear,
              opts: [{ v: '1ere', l: '1ʳᵉ' }, { v: 'tco', l: 'TC Orig.' }, { v: 'tce', l: 'TC Éco.' }, { v: 'tcs', l: 'TC Sci.' }],
            },
            {
              label: 'Demi-pension',
              value: meals, set: setMeals,
              opts: [{ v: 'non', l: 'Non' }, { v: 'oui', l: 'Oui (+4 800)' }],
            },
            {
              label: 'Transport',
              value: transport, set: setTransport,
              opts: [{ v: 'non', l: 'Non' }, { v: 'oui', l: 'Oui (+3 600)' }],
            },
            {
              label: 'Paiement',
              value: payment, set: setPayment,
              opts: [{ v: 'annuel', l: 'Annuel' }, { v: 'trimestriel', l: 'Trim.' }, { v: 'mensuel', l: 'Mensuel' }],
            },
          ].map(({ label, value, set, opts }) => (
            <div key={label} className="ly-calc-row">
              <label>{label}</label>
              <div className="ly-calc-toggle">
                {opts.map(o => (
                  <button
                    key={o.v}
                    className={`ly-calc-opt ${value === o.v ? 'ly-calc-opt--active' : ''}`}
                    onClick={() => set(o.v)}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ly-calculator__right">
        <div className="ly-calc-result-label">Montant estimé</div>
        <div className="ly-calc-result-amount">
          <span className="ly-calc-result-currency">MAD</span>
          {displayed.toLocaleString('fr-FR')}
        </div>
        <div className="ly-calc-result-period">{periodLabel}</div>
        <div className="ly-calc-result-breakdown">
          <span>Scolarité de base <em>{base.toLocaleString('fr-FR')} MAD</em></span>
          {mealCost > 0 && <span>Demi-pension <em>{mealCost.toLocaleString('fr-FR')} MAD</em></span>}
          {transportCost > 0 && <span>Transport <em>{transportCost.toLocaleString('fr-FR')} MAD</em></span>}
          <span style={{ borderTop: '1px solid var(--coral-line)', paddingTop: 7, marginTop: 4, fontWeight: 700, color: 'var(--text-light-low)' }}>
            Total annuel <em style={{ color: 'var(--coral-light)' }}>{total.toLocaleString('fr-FR')} MAD</em>
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─── Profile Matcher Quiz ─── */
const QUIZ = [
  {
    q: 'Quelle matière vous passionne le plus au collège ?',
    opts: ['Mathématiques et Physique', 'Français, Histoire et Philosophie', 'Économie et Gestion', 'Aucune préférence marquée'],
  },
  {
    q: 'Quel est votre projet professionnel envisagé ?',
    opts: ['Ingénierie, Médecine, Architecture', 'Droit, Littérature, Journalisme', 'Commerce, Finance, Entrepreneuriat', 'Je ne sais pas encore'],
  },
  {
    q: 'Comment décririez-vous votre profil scolaire ?',
    opts: ['Fort en sciences et calcul', 'Créatif(ve) et bon(ne) communicant(e)', 'Analytique et sens des affaires', 'Équilibré(e) dans toutes les matières'],
  },
  {
    q: 'Votre environnement de travail préféré ?',
    opts: ['Laboratoire, expériences, formules', 'Débats, essais, lectures', 'Études de cas, projets économiques', 'Un peu de tout'],
  },
]

const RESULTS = [
  {
    title: 'Tronc Commun Sciences',
    desc: "Votre profil correspond parfaitement à la filière scientifique. Vous excellez en mathématiques et sciences naturelles — une passerelle idéale vers les Bac Sciences Physiques, SVT ou Maths.",
    tags: ['Mathématiques', 'Physique-Chimie', 'SVT', 'Informatique'],
  },
  {
    title: 'Tronc Commun Original',
    desc: "Littéraire dans l'âme, vous êtes fait(e) pour les humanités. La filière lettres-sciences humaines vous ouvre les portes du droit, de la communication et des grandes écoles de commerce.",
    tags: ['Français', 'Philosophie', 'Histoire-Géo', 'Langues'],
  },
  {
    title: 'Tronc Commun Économique',
    desc: "Votre sens des affaires et votre pensée analytique vous dirigent naturellement vers la filière économique. Un tremplin vers les grandes écoles de commerce et la finance.",
    tags: ['Économie', 'Gestion', 'Mathématiques', 'Droit'],
  },
  {
    title: "Entretien d'orientation",
    desc: "Votre profil est multiple et c'est une richesse ! Nous vous recommandons un entretien personnalisé avec notre conseillère d'orientation pour trouver la filière qui vous correspond le mieux.",
    tags: ['Orientation', 'Bilan de compétences', 'Conseil personnalisé'],
  },
]

function ProfileMatcher() {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [done, setDone]       = useState(false)

  const handleNext = () => {
    if (selected === null) return
    const newAnswers = [...answers, selected]
    if (step < QUIZ.length - 1) {
      setAnswers(newAnswers)
      setSelected(null)
      setStep(s => s + 1)
    } else {
      setAnswers(newAnswers)
      setDone(true)
    }
  }

  const handleBack = () => {
    if (step === 0) return
    const prev = [...answers]
    prev.pop()
    setAnswers(prev)
    setSelected(null)
    setStep(s => s - 1)
  }

  const restart = () => { setStep(0); setAnswers([]); setSelected(null); setDone(false) }

  const result = done ? (() => {
    const counts = [0, 0, 0, 0]
    answers.forEach(a => { if (a < 3) counts[a]++; else counts[3]++ })
    const max = Math.max(...counts)
    return RESULTS[counts.indexOf(max)]
  })() : null

  return (
    <div className="ly-matcher__quiz">
      {!done ? (
        <>
          <div className="ly-matcher__step-indicator">
            {QUIZ.map((_, i) => (
              <div
                key={i}
                className={`ly-matcher__step-dot ${i < step ? 'ly-matcher__step-dot--done' : i === step ? 'ly-matcher__step-dot--active' : ''}`}
              />
            ))}
          </div>
          <div className="ly-matcher__question">{QUIZ[step].q}</div>
          <div className="ly-matcher__options">
            {QUIZ[step].opts.map((opt, i) => (
              <div
                key={i}
                className={`ly-matcher__option ${selected === i ? 'ly-matcher__option--selected' : ''}`}
                onClick={() => setSelected(i)}
              >
                <span className="ly-matcher__option-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </div>
            ))}
          </div>
          <div className="ly-matcher__actions">
            <button className="ly-matcher__btn ly-matcher__btn--secondary" onClick={handleBack} disabled={step === 0}>
              ← Retour
            </button>
            <span className="ly-matcher__progress-text">{step + 1} / {QUIZ.length}</span>
            <button className="ly-matcher__btn ly-matcher__btn--primary" onClick={handleNext} disabled={selected === null}>
              {step === QUIZ.length - 1 ? 'Voir mon profil' : 'Suivant'} {Icon.arrow}
            </button>
          </div>
        </>
      ) : (
        <div className="ly-matcher__result">
          <div className="ly-matcher__result-icon">{Icon.star}</div>
          <h3 className="ly-matcher__result-title">
            Votre filière : <em>{result.title}</em>
          </h3>
          <p className="ly-matcher__result-desc">{result.desc}</p>
          <div className="ly-matcher__result-tags">
            {result.tags.map(t => <span key={t} className="ly-matcher__result-tag">{t}</span>)}
          </div>
          <button className="ly-matcher__restart" onClick={restart}>↺ Recommencer le test</button>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════════ */
const STREAMS = [
  {
    key: 'sciences',
    color: 'var(--sciences)',
    pale: 'var(--sciences-pale)',
    icon: Icon.flask,
    name: 'Sciences',
    tag: 'Filière Scientifique',
    letter: 'S',
    desc: "Pour les esprits curieux attirés par les mathématiques, la physique et les sciences naturelles. Un tremplin vers l'ingénierie, la médecine et la recherche.",
    subjects: ['Maths', 'Physique-Chimie', 'SVT', 'Informatique', 'Philosophie'],
    places: '28 places',
    cta: 'Choisir Sciences',
  },
  {
    key: 'lettres',
    color: 'var(--lettres)',
    pale: 'var(--lettres-pale)',
    icon: Icon.book,
    name: 'Lettres & S. Humaines',
    tag: 'Filière Humaniste',
    letter: 'L',
    desc: "Pour les passionnés de langue, de culture et de société. Une formation qui ouvre les portes du droit, de la communication, du journalisme et de la diplomatie.",
    subjects: ['Français', 'Philosophie', 'Histoire-Géo', 'Langues', 'Arabe'],
    places: '22 places',
    cta: 'Choisir Lettres',
  },
  {
    key: 'eco',
    color: 'var(--eco)',
    pale: 'var(--eco-pale)',
    icon: Icon.chart,
    name: 'Économie & Gestion',
    tag: 'Filière Économique',
    letter: 'E',
    desc: "Pour ceux qui pensent stratégie, marchés et entrepreneuriat. Une formation dense qui prépare aux grandes écoles de commerce et aux métiers de la finance.",
    subjects: ['Économie', 'Gestion', 'Mathématiques', 'Droit', 'Langues'],
    places: '24 places',
    cta: 'Choisir Économie',
  },
]

const COND_CARDS = [
  { icon: Icon.star,   title: 'Excellence académique',  desc: 'Moyenne annuelle ≥ 13/20 au collège, mention Bien au Brevet si disponible.' },
  { icon: Icon.shield, title: 'Conduite irréprochable', desc: 'Aucune sanction disciplinaire dans les deux dernières années scolaires.' },
  { icon: Icon.book,   title: 'Maîtrise bilingue',      desc: "Niveau satisfaisant en français (écrit et oral), langue d'enseignement principale." },
  { icon: Icon.user,   title: 'Entretien de motivation', desc: "Rencontre avec la direction pour évaluer le projet et la motivation de l'élève." },
]

const DOCS = [
  { label: 'Bulletins scolaires des 3 années de collège (originaux)',        req: 'Obligatoire' },
  { label: 'Relevé de notes du Brevet National (si passé)',                   req: 'Obligatoire' },
  { label: 'Acte de naissance — copie certifiée conforme',                   req: 'Obligatoire' },
  { label: 'CIN du père et de la mère (photocopies)',                        req: 'Obligatoire' },
  { label: "4 photos d'identité récentes (fond blanc)",                      req: 'Obligatoire' },
  { label: "Certificat de désinscription de l'établissement précédent",      req: 'Obligatoire' },
  { label: 'Lettre de bonne conduite signée par le précédent directeur',     req: 'Obligatoire' },
  { label: "Lettre de motivation de l'élève (1 page, manuscrite)",           req: 'Obligatoire' },
  { label: "Résultats des tests d'admission Médione (fournis après épreuve)", req: 'Obligatoire' },
  { label: 'Bilan d\'orientation psychologique (si BEP diagnostiqué)',       req: 'Optionnel' },
  { label: 'Attestations de participation à des olympiades ou concours',     req: 'Optionnel' },
  { label: "Lettre de recommandation d'un professeur du collège",            req: 'Optionnel' },
]

const PRICES = [
  {
    year: 'Première année',
    name: '1ʳᵉ Année Lycée',
    desc: 'Tronc commun — toutes filières. Première immersion dans le programme lycéen.',
    amount: '28 500', installment: 'Ou 2 850 MAD / mois × 10',
    features: [
      { t: 'Manuels scolaires inclus',             ok: true  },
      { t: 'Accès bibliothèque & salles info',     ok: true  },
      { t: 'Accompagnement orientation Bac',       ok: true  },
      { t: 'Préparation examens blancs',           ok: true  },
      { t: 'Cantine (option payante)',              ok: false },
      { t: 'Transport (option payante)',            ok: false },
    ],
    bg: '1ᵉ',
  },
  {
    year: 'Deuxième année',
    name: 'Terminale — Tronc Commun',
    desc: 'Sciences, Lettres ou Économie. Préparation intensive au Baccalauréat national.',
    amount: '30 000', installment: 'Ou 3 000 MAD / mois × 10',
    features: [
      { t: 'Manuels scolaires inclus',             ok: true  },
      { t: 'Cours de soutien hebdomadaires',       ok: true  },
      { t: 'Examens blancs régionaux',             ok: true  },
      { t: 'Coaching Bac personnalisé',            ok: true  },
      { t: 'Accès à la plateforme numérique',     ok: true  },
      { t: 'Cantine (option payante)',              ok: false },
    ],
    badge: 'Plus populaire',
    highlight: true,
    bg: 'TC',
  },
  {
    year: 'Terminale Scientifique',
    name: 'Terminale Sciences',
    desc: 'Filière scientifique renforcée. Orientation Classes Préparatoires & CPGE.',
    amount: '31 500', installment: 'Ou 3 150 MAD / mois × 10',
    features: [
      { t: 'Tout du Tronc Commun inclus',          ok: true  },
      { t: 'Laboratoires STEM prioritaires',       ok: true  },
      { t: 'Prépa CPGE & concours Grandes Écoles', ok: true  },
      { t: 'Club Robotique & Olympiades',          ok: true  },
      { t: 'Mentorat Ingénieur/Médecin',           ok: true  },
      { t: 'Visite établissements CPGE',           ok: true  },
    ],
    bg: 'TS',
  },
]

const DATES_DATA = [
  { day: '03', mon: 'Fév.',  label: 'Ouverture des inscriptions',    desc: 'Retrait des dossiers au secrétariat ou téléchargement en ligne.',                  pill: 'Déjà ouvert'    },
  { day: '28', mon: 'Fév.',  label: 'Clôture dossiers prioritaires', desc: "Fratrie et enfants d'anciens élèves — soumission avant cette date.",               pill: 'Prioritaire'    },
  { day: '14', mon: 'Mars',  label: "Tests d'admission",             desc: "Épreuves écrites organisées dans les locaux de l'établissement.",                  pill: 'Sur convocation' },
  { day: '28', mon: 'Mars',  label: 'Entretiens individuels',        desc: "Rencontre avec l'élève et sa famille pour affiner le projet de filière.",          pill: 'Sur rendez-vous' },
  { day: '10', mon: 'Avr.',  label: "Résultats d'admission",         desc: 'Communication des décisions par email et affichage au secrétariat.',               pill: 'J+30 après tests' },
  { day: '30', mon: 'Avr.',  label: 'Confirmation & règlement',      desc: "Validation définitive et versement de l'acompte d'inscription (20%).",            pill: 'Délai impératif' },
]

const TESTIMONIALS = [
  { init: 'IM', name: 'Imane M.',   role: 'Terminale Sciences — Promo 2024', text: "L'accompagnement pour les CPGE est exceptionnel. Mon professeur de Maths m'a aidée à préparer le concours d'accès aux classes préparatoires à Rabat. Je n'aurais pas réussi sans cet encadrement spécifique.", stream: 'Sciences', sc: 'var(--sciences)', sp: 'var(--sciences-pale)' },
  { init: 'YB', name: 'Youssef B.', role: 'Terminale Économie — Promo 2024', text: "La filière économie de Médione est rigoureuse et ouverte. Les études de cas réels, les intervenants professionnels et la préparation aux concours de commerce m'ont vraiment démarqué lors de mes entretiens.",  stream: 'Économie', sc: 'var(--eco)',      sp: 'var(--eco-pale)'  },
  { init: 'SC', name: 'Sara C.',    role: "1ʳᵉ Année Lycée — en cours",     text: "Après un collège public, j'avais peur de ne pas m'adapter. Le test d'admission m'a permis d'être orientée dans la bonne filière dès le début. L'accueil de l'équipe pédagogique est chaleureux et professionnel.",  stream: 'Lettres',  sc: 'var(--lettres)', sp: 'var(--lettres-pale)' },
]

const FAQS = [
  { q: "Mon enfant est en 3ème dans un établissement public. Peut-il intégrer le Lycée Médione ?",  a: "Absolument. Nous accueillons chaque année des élèves issus du public. Un dossier solide (moyenne ≥ 13/20, bonne conduite) et la réussite au test d'admission sont les critères déterminants, pas l'établissement d'origine." },
  { q: "Peut-on changer de filière en cours d'année ?",                                             a: "Un changement de filière en cours d'année est exceptionnellement possible jusqu'au 30 novembre, sous réserve de places disponibles et après avis pédagogique. Il nécessite un entretien avec la direction pédagogique et une période d'observation de 3 semaines." },
  { q: "Comment se déroule le test d'admission ?",                                                  a: "Le test dure 3 heures et comprend : 1h de Mathématiques, 1h de Français (compréhension + expression) et 1h d'Arabe. Il est calibré sur le niveau 3ème — son objectif est d'évaluer le niveau réel, pas de piéger les candidats. Les résultats sont communiqués sous 10 jours." },
  { q: "L'acompte de 20% est-il remboursable en cas de désistement ?",                             a: "L'acompte n'est pas remboursable en cas de désistement après le 15 mai. En cas de situation exceptionnelle (déménagement familial à l'étranger, motif médical grave), un dossier de demande de remboursement partiel peut être étudié par la direction." },
  { q: "Proposez-vous des préparations aux concours des grandes écoles ?",                          a: "Oui. Le Lycée Médione propose un programme de préparation aux concours d'entrée aux CPGE et aux grandes écoles marocaines (ISCAE, ENCG, etc.). Des intervenants professionnels et d'anciens élèves des CPGE participent à des sessions de coaching tout au long de l'année de Terminale." },
  { q: "Y a-t-il une liste d'attente si toutes les places sont prises ?",                           a: "Oui. En cas de saturation d'une filière, les candidats admis mais non placés sont inscrits sur une liste d'attente prioritaire. Si une place se libère avant le 31 août, ils sont contactés immédiatement. Cette liste est honorée chaque année dans plus de 60% des cas." },
]

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
export default function Page_Lycee_Inscription() {
  const [activeStream, setActiveStream] = useState('sciences')
  const [activeNav, setActiveNav]       = useState('niveau')

  return (
    <>
      {/* heroPage=true — hero is full-viewport, no spacer needed */}
      <Menu heroPage={true} />

      <main className="ly-page">

        {/* ══ HERO ══ */}
        <section className="ly-hero">
          <img src="lycee-hero.png" alt="" className="ly-hero__bg" />
          <div className="ly-hero__grad"  aria-hidden="true" />
          <div className="ly-hero__grid"  aria-hidden="true" />
          <div className="ly-hero__vline" aria-hidden="true" />

          <div className="ly-hero__inner">
            {/* Left — editorial title */}
            <div className="ly-hero__content">
              <div className="ly-hero__kicker">
                <span className="ly-hero__kicker-bar" />
                Lycée Médione · Fès — Inscriptions 2025–2026
                <span className="ly-hero__kicker-bar" />
              </div>
              <h1 className="ly-hero__title">
                <span className="ly-hero__title-line">Conditions</span>
                <span className="ly-hero__title-line ly-hero__title-line--coral">d'Inscription</span>
                <span className="ly-hero__title-line ly-hero__title-line--outline">Lycée</span>
              </h1>
              <p className="ly-hero__desc">
                Tout ce que vous devez savoir pour intégrer le Lycée Médione —
                filières, critères d'admission, dossier complet et tarifs de scolarité
                transparents pour l'année 2025–2026.
              </p>
            </div>

            {/* Right — floating info card */}
            <div className="ly-hero__card">
              <div className="ly-hero__card-title">En un coup d'œil</div>
              <div className="ly-hero__at-glance">
                {[
                  { icon: Icon.grad,   title: '3 filières disponibles',   sub: 'Sciences · Lettres · Économie'         },
                  { icon: Icon.cal,    title: "Tests d'admission",         sub: '14 mars 2025 — sur convocation'        },
                  { icon: Icon.star,   title: 'Moyenne requise',           sub: '≥ 13/20 en classe de 3ème'             },
                  { icon: Icon.shield, title: 'Frais de dossier',          sub: '200 MAD — non remboursables'           },
                  { icon: Icon.clock,  title: 'Clôture inscriptions',      sub: '30 avril 2025'                         },
                ].map(item => (
                  <div key={item.title} className="ly-hero__at-item">
                    <div className="ly-hero__at-icon">{item.icon}</div>
                    <div className="ly-hero__at-text">
                      <strong>{item.title}</strong>
                      <span>{item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ly-hero__scroll" aria-hidden="true">
            <div className="ly-hero__scroll-bar" />
            Découvrir
          </div>
        </section>

        {/* ══ STREAMS ══ */}
        <section className="ly-streams">
          <div className="ly-streams__corner" aria-hidden="true" />
          <div className="ly-streams__inner">
            <div className="ly-streams__head">
              <div>
                <Reveal>
                  <span className="ly-label">Nos filières du Lycée</span>
                  <h2 className="ly-section-title">
                    Choisissez votre <em>voie d'excellence</em>
                  </h2>
                  <p className="ly-streams__sub">
                    Trois filières complémentaires, chacune avec son identité pédagogique forte.
                    Votre orientation commence ici — et nos conseillers vous accompagnent.
                  </p>
                </Reveal>
              </div>
              <p className="ly-streams__legend">
                Cliquez sur une filière pour en savoir plus sur ses exigences spécifiques.
              </p>
            </div>

            <div className="ly-streams__grid">
              {STREAMS.map((s, i) => (
                <Reveal key={s.key} delay={i * 70}>
                  <div
                    className={`ly-stream-card ${activeStream === s.key ? 'ly-stream-card--active' : ''}`}
                    style={{ '--stream-color': s.color, '--stream-pale': s.pale }}
                    onClick={() => setActiveStream(s.key)}
                  >
                    <div className="ly-stream-card__top" data-letter={s.letter} style={{ background: s.color }}>
                      <div className="ly-stream-card__icon">{s.icon}</div>
                      <div className="ly-stream-card__name">{s.name}</div>
                      <div className="ly-stream-card__tag">{s.tag}</div>
                    </div>
                    <div className="ly-stream-card__body">
                      <p className="ly-stream-card__desc">{s.desc}</p>
                      <div className="ly-stream-card__subjects">
                        {s.subjects.map(sub => (
                          <span
                            key={sub}
                            className="ly-stream-card__subject"
                            style={{ color: s.color, background: s.pale }}
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                      <div className="ly-stream-card__footer">
                        <span className="ly-stream-card__cta" style={{ color: s.color }}>
                          {s.cta} {Icon.arrow}
                        </span>
                        <span className="ly-stream-card__places">{s.places}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══ ELIGIBILITY ══ */}
        <section className="ly-eligibility">
          <div className="ly-eligibility__watermark" aria-hidden="true">ÉLIGIBILITÉ</div>
          <div className="ly-eligibility__inner">

            {/* Sticky side nav */}
            <Reveal>
              <nav className="ly-eligibility__nav">
                <div className="ly-eligibility__nav-label">Sur cette page</div>
                {[
                  { id: 'niveau',     label: 'Niveau requis'   },
                  { id: 'conditions', label: 'Conditions'      },
                  { id: 'examen',     label: "Tests d'admission" },
                ].map(item => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`ly-eligibility__nav-item ${activeNav === item.id ? 'ly-eligibility__nav-item--active' : ''}`}
                    onClick={() => setActiveNav(item.id)}
                  >
                    <span className="ly-eligibility__nav-dot" />
                    {item.label}
                  </a>
                ))}
              </nav>
            </Reveal>

            {/* Content */}
            <div className="ly-eligibility__content">

              {/* Section 1 — grades */}
              <Reveal>
                <div className="ly-elig-section" id="niveau">
                  <h2 className="ly-elig-section__title">
                    <span className="ly-elig-section__title-num">01</span>
                    Niveau <em>académique requis</em>
                  </h2>
                  <p className="ly-elig-section__intro">
                    Les candidats doivent présenter un dossier scolaire solide attestant
                    d'un niveau conforme aux exigences de la filière choisie.
                  </p>
                  <table className="ly-grade-table">
                    <thead>
                      <tr>
                        <th>Matière</th>
                        <th>Sciences</th>
                        <th>Lettres</th>
                        <th>Économie</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Mathématiques',    '≥ 14/20', '≥ 11/20',      '≥ 13/20'     ],
                        ['Français',         '≥ 12/20', '≥ 14/20',      '≥ 12/20'     ],
                        ['Arabe',            '≥ 11/20', '≥ 14/20',      '≥ 12/20'     ],
                        ['Physique-Chimie',  '≥ 13/20', 'non évaluée',  '≥ 11/20'     ],
                        ['Sciences Nat.',    '≥ 13/20', 'non évaluée',  'non évaluée' ],
                        ['Moyenne générale', '≥ 13,5/20','≥ 13/20',    '≥ 13/20'     ],
                      ].map(([mat, sc, l, e]) => (
                        <tr key={mat}>
                          <td>{mat}</td>
                          <td><span className="ly-grade-badge ly-grade-badge--required">{sc}</span></td>
                          <td><span className={`ly-grade-badge ${l !== 'non évaluée' ? 'ly-grade-badge--preferred' : ''}`}>{l}</span></td>
                          <td><span className={`ly-grade-badge ${e !== 'non évaluée' ? 'ly-grade-badge--preferred' : ''}`}>{e}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="ly-alert ly-alert--warning" style={{ marginTop: 16 }}>
                    <span className="ly-alert__icon">{Icon.warn}</span>
                    <span className="ly-alert__text">
                      <strong>Attention :</strong> Ces moyennes sont des minimaux non négociables.
                      Tout bulletin présentant une note en dessous de 08/20 dans une matière fondamentale
                      entraîne le rejet automatique du dossier, quelle que soit la moyenne générale.
                    </span>
                  </div>
                </div>
              </Reveal>

              {/* Section 2 — condition cards */}
              <Reveal delay={40}>
                <div className="ly-elig-section" id="conditions">
                  <h2 className="ly-elig-section__title">
                    <span className="ly-elig-section__title-num">02</span>
                    Conditions <em>d'admission</em>
                  </h2>
                  <p className="ly-elig-section__intro">
                    Au-delà des résultats, l'admission repose sur une évaluation globale
                    du profil : engagement, caractère et projet personnel de l'élève.
                  </p>
                  <div className="ly-req-grid">
                    {COND_CARDS.map(c => (
                      <div key={c.title} className="ly-req-card">
                        <div className="ly-req-card__icon">{c.icon}</div>
                        <div className="ly-req-card__body">
                          <strong>{c.title}</strong>
                          <span>{c.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="ly-alert ly-alert--info" style={{ marginTop: 16 }}>
                    <span className="ly-alert__icon">{Icon.info}</span>
                    <span className="ly-alert__text">
                      <strong>Bon à savoir :</strong> Les élèves issus du secteur public avec un excellent
                      dossier bénéficient d'un traitement prioritaire. L'école valorise la diversité des
                      parcours et la motivation authentique.
                    </span>
                  </div>
                </div>
              </Reveal>

              {/* Section 3 — exam */}
              <Reveal delay={80}>
                <div className="ly-elig-section" id="examen">
                  <h2 className="ly-elig-section__title">
                    <span className="ly-elig-section__title-num">03</span>
                    Tests <em>d'admission</em>
                  </h2>
                  <p className="ly-elig-section__intro">
                    Tous les candidats externes passent un examen écrit calibré sur le niveau 3ème.
                    L'objectif : évaluer le niveau réel et orienter vers la filière la mieux adaptée.
                  </p>
                  <div className="ly-req-grid">
                    {[
                      { icon: Icon.book, title: 'Mathématiques — 1h',  desc: 'Algèbre, géométrie et calcul. Barème : 40 points. Matière éliminatoire pour la filière Sciences.' },
                      { icon: Icon.book, title: 'Français — 1h',       desc: 'Compréhension de texte + expression écrite. Barème : 40 points. Matière éliminatoire pour Lettres.' },
                      { icon: Icon.book, title: 'Arabe — 1h',          desc: "Compréhension et rédaction en arabe classique. Barème : 30 points. Obligatoire pour toutes les filières." },
                      { icon: Icon.user, title: 'Entretien individuel', desc: "20 minutes avec un jury composé du directeur pédagogique et d'un enseignant de la filière choisie." },
                    ].map(c => (
                      <div key={c.title} className="ly-req-card">
                        <div className="ly-req-card__icon">{c.icon}</div>
                        <div className="ly-req-card__body">
                          <strong>{c.title}</strong>
                          <span>{c.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

            </div>
          </div>
        </section>

        {/* ══ DOCUMENTS ══ */}
        <section className="ly-documents">
          <div className="ly-documents__inner">
            <Reveal>
              <div className="ly-documents__header">
                <span className="ly-label ly-label--center">Constitution du dossier</span>
                <h2 className="ly-documents__title">
                  Documents <em>à préparer</em>
                </h2>
                <p className="ly-documents__sub">
                  Cochez les documents au fur et à mesure que vous les réunissez.
                  Le dossier doit être déposé complet — aucun document manquant ne sera accepté.
                </p>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <DocSection items={DOCS} />
            </Reveal>
          </div>
        </section>

        
        

        {/* ══ TIMELINE ══ */}
        <section className="ly-timeline">
          <div className="ly-timeline__inner" style={{ maxWidth: 1160, margin: '0 auto' }}>
            <Reveal>
              <div>
                <span className="ly-label">Calendrier 2025</span>
                <h2 className="ly-section-title">
                  Les dates <em>à ne pas manquer</em>
                </h2>
                <p className="ly-timeline__sub">
                  Le processus d'admission est cadencé. Chaque étape est un jalon
                  important — ne laissez pas passer les délais, les places sont limitées.
                </p>
                <div className="ly-key-facts">
                  {[
                    { val: '74',  label: 'Places au total'       },
                    { val: '3',   label: 'Filières'              },
                    { val: '5J',  label: 'Délai réponse dossier' },
                    { val: '20%', label: 'Acompte confirmation'  },
                  ].map(f => (
                    <div key={f.label} className="ly-key-fact">
                      <div className="ly-key-fact__val">{f.val}</div>
                      <div className="ly-key-fact__label">{f.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="ly-date-list">
                {DATES_DATA.map((d, i) => (
                  <div key={i} className="ly-date-entry">
                    <div className="ly-date-entry__bubble">
                      <span className="ly-date-entry__day">{d.day}</span>
                      <span className="ly-date-entry__mon">{d.mon}</span>
                    </div>
                    <div className="ly-date-entry__body">
                      <div className="ly-date-entry__label">{d.label}</div>
                      <div className="ly-date-entry__desc">{d.desc}</div>
                      <span className="ly-date-entry__pill">{d.pill}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ PROFILE MATCHER ══ */}
        <section className="ly-matcher">
          <div className="ly-matcher__bg" aria-hidden="true" />
          <div className="ly-matcher__inner">
            <Reveal>
              <span className="ly-label ly-label--center">Outil d'orientation</span>
              <h2 className="ly-section-title" style={{ marginBottom: '0.75rem' }}>
                Quelle filière est <em>faite pour vous ?</em>
              </h2>
              <p className="ly-matcher__sub">
                Répondez à 4 questions rapides et notre outil d'orientation vous suggère
                la filière qui correspond le mieux à votre profil et à vos ambitions.
              </p>
            </Reveal>
            <Reveal delay={60}>
              <ProfileMatcher />
            </Reveal>
          </div>
        </section>

        
       
        {/* ══ FAQ — deep navy ══ */}
        <section className="ly-faq">
          <div className="ly-faq__inner">
            <Reveal>
              <div className="ly-faq__header">
                <span className="ly-label ly-label--light ly-label--center">Questions & Réponses</span>
                <h2 className="ly-section-title ly-section-title--light">
                  Tout ce que vous <em>voulez savoir</em>
                </h2>
                <p className="ly-faq__sub">
                  Les réponses aux questions que se posent la plupart des familles
                  avant de déposer leur dossier.
                </p>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <div className="ly-faq__list">
                {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ CTA — coral ══ */}
        <section className="ly-cta">
          <div className="ly-cta__inner">
            <Reveal>
              <div className="ly-cta__icon">{Icon.grad}</div>
              <span className="ly-label" style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.18)', color: '#fff', borderColor: 'rgba(255,255,255,0.30)', marginBottom: 20 }}>
                Rejoindre le Lycée Médione
              </span>
              <h2 className="ly-cta__title">
                Prêt à commencer votre<br /><em>parcours d'excellence ?</em>
              </h2>
              <p className="ly-cta__sub">
                Ne laissez pas passer cette opportunité. Téléchargez le dossier dès maintenant,
                réunissez vos pièces et déposez votre candidature avant le 30 avril 2025.
              </p>
              <div className="ly-cta__actions">
                <a href="/Inscrire" className="ly-btn ly-btn--cta-primary ly-btn--lg">
                  {Icon.down} Télécharger le dossier
                </a>
                <a href="/Contact" className="ly-btn ly-btn--cta-ghost ly-btn--lg">
                  Prendre rendez-vous →
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ STRIP ══ */}
        <section className="ly-strip">
          <div className="ly-strip__inner">
            <div className="ly-strip__left">
              <span className="ly-strip__pulse" />
              Lycée Médione · Fès — Inscriptions 2025–2026 · 3 filières · 74 places disponibles
            </div>
            <a href="/Contact" className="ly-btn ly-btn--primary" style={{ padding: '10px 22px', fontSize: 13 }}>
              Nous contacter →
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}