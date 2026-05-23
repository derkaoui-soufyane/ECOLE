import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CryptoJS from "crypto-js"
import "./connection.css"

/* ════════════════════════════════════════════════
   Secure storage — unchanged logic
════════════════════════════════════════════════ */
const SECRET_KEY = "your-very-secret-key-change-this-32chars"

const secureStorage = {
  set(key, value) {
    const payload = JSON.stringify({ value, ts: Date.now() })
    const encrypted = CryptoJS.AES.encrypt(payload, SECRET_KEY).toString()
    const hash = CryptoJS.HmacSHA256(encrypted, SECRET_KEY).toString()
    localStorage.setItem(key, JSON.stringify({ data: encrypted, hash }))
  },
  get(key) {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const { data, hash } = JSON.parse(raw)
      const expectedHash = CryptoJS.HmacSHA256(data, SECRET_KEY).toString()
      if (expectedHash !== hash) { localStorage.removeItem(key); return null }
      const decrypted = CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8)
      const { value } = JSON.parse(decrypted)
      return value
    } catch { localStorage.removeItem(key); return null }
  },
  remove(key) { localStorage.removeItem(key) },
}

const sessionSecureStorage = {
  set(key, value) {
    const payload = JSON.stringify({ value, ts: Date.now() })
    const encrypted = CryptoJS.AES.encrypt(payload, SECRET_KEY).toString()
    const hash = CryptoJS.HmacSHA256(encrypted, SECRET_KEY).toString()
    sessionStorage.setItem(key, JSON.stringify({ data: encrypted, hash }))
  },
  get(key) {
    try {
      const raw = sessionStorage.getItem(key)
      if (!raw) return null
      const { data, hash } = JSON.parse(raw)
      const expectedHash = CryptoJS.HmacSHA256(data, SECRET_KEY).toString()
      if (expectedHash !== hash) { sessionStorage.removeItem(key); return null }
      const decrypted = CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8)
      const { value } = JSON.parse(decrypted)
      return value
    } catch { sessionStorage.removeItem(key); return null }
  },
  remove(key) { sessionStorage.removeItem(key) },
}

/* ════════════════════════════════════════════════
   Eye icon
════════════════════════════════════════════════ */
function EyeIcon({ open }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

/* ════════════════════════════════════════════════
   Main component
════════════════════════════════════════════════ */
export default function Connection() {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe]     = useState(false)
  const [msgErr, setMsgErr]             = useState("")
  const [showForm, setShowForm]         = useState(true)
  const [loading, setLoading]           = useState(false)
  const [focused, setFocused]           = useState(null)
  const navigate = useNavigate()
  const [obj, setObj] = useState({ email: "", password: "" })

  /* Redirect if already connected */
  useEffect(() => {
    const src = secureStorage.get("codeSRC") || sessionSecureStorage.get("codeSRC")
    const ens = secureStorage.get("codeENS") || sessionSecureStorage.get("codeENS")
    const etd = secureStorage.get("codeETD") || sessionSecureStorage.get("codeETD")
    if (src === "admin")       navigate("/Dashboard")
    else if (ens === "enseignant") navigate("/Dashboard_ense")
    else if (etd === "etudiant")   navigate("/Dashboard_etd")
  }, [navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setMsgErr("")
    setLoading(true)
    fetch("http://127.0.0.1:8000/api/usersShow", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email: obj.email, password: obj.password }),
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false)
        if (data.role === "admin") {
          const s = rememberMe ? secureStorage : sessionSecureStorage
          s.set("codeSRC", "admin"); s.set("codeSRC2", obj.email); s.set("username", data.name)
          navigate("/Dashboard", { state: { username: data.name } })
        } else if (data.role === "nv_etudiant") {
          setShowForm(false)
        } else if (data.role === "enseignant") {
          const s = rememberMe ? secureStorage : sessionSecureStorage
          s.set("codeENS", "enseignant"); s.set("codeENS2", obj.email); s.set("enseignant", data.name)
          navigate("/Dashboard_ense")
        } else if (data.role === "etudiant") {
          const s = rememberMe ? secureStorage : sessionSecureStorage
          s.set("codeETD", "etudiant"); s.set("codeETD2", obj.email); s.set("etudiant", data.name)
          navigate("/Dashboard_etd")
        } else if (data === "em" || data?.error === "em") {
          setMsgErr("Email et mot de passe sont incorrects")
        } else {
          setMsgErr("Mot de passe incorrect")
        }
      })
      .catch(() => {
        setLoading(false)
        setMsgErr("Une erreur est survenue. Veuillez réessayer.")
      })
  }

  const handleChange = (e) => setObj({ ...obj, [e.target.name]: e.target.value })

  /* ── Pending steps data ── */
  const pendingSteps = [
    { id: "submit", label: "Soumis",     state: "done"   },
    { id: "review", label: "En révision",state: "active" },
    { id: "active", label: "Activé",     state: "idle"   },
  ]

  return (
    <div className="cn-root">

      {/* ── Decorative bg — GPU layers only ── */}
      <div className="cn-bg" aria-hidden="true">
        <div className="cn-bg__ring cn-bg__ring--1" />
        <div className="cn-bg__ring cn-bg__ring--2" />
        <div className="cn-bg__dots" />
      </div>

      {/* ══════════════════════════════════════
          LEFT — brand panel (navy-deep)
      ══════════════════════════════════════ */}
      <aside className="cn-brand">

        {/* Background image + overlays */}
        <img src="connection-image.png" alt="" className="cn-brand__img" />
        <div className="cn-brand__overlay" aria-hidden="true" />

        {/* Coral bottom-edge line — same as home hero */}
        <div className="cn-brand__edge" aria-hidden="true" />

        <div className="cn-brand__inner">

          {/* Logo */}
          <div className="cn-brand__logo">
            <div className="cn-brand__logo-badge">
              <img src="logo_ecole.png" alt="" className="cn-brand__logo-img" />
            </div>
            <div className="cn-brand__logo-text">
              <span className="cn-brand__logo-name">École Médione</span>
              <span className="cn-brand__logo-tag">Espace Membre</span>
            </div>
          </div>

          {/* Main content */}
          <div className="cn-brand__body">
            <div className="cn-brand__eyebrow">
              <span className="cn-brand__eyebrow-line" />
              Depuis 1999
              <span className="cn-brand__eyebrow-line" />
            </div>

            <h2 className="cn-brand__headline">
              Former des êtres<br /><em>complets</em><br /><em>et accomplis</em>
            </h2>

            <p className="cn-brand__desc">
              Accédez à votre espace personnel pour suivre votre parcours scolaire,
              consulter vos résultats et rester connecté à la communauté Médione.
            </p>

            {/* Stats bar — same pattern as home page hero-stats-bar */}
            <div className="cn-brand__stats">
              {[
                { val: "1400", label: "Élèves" },
                { val: "98%",  label: "Réussite" },
                { val: "25+",  label: "Années" },
              ].map((s, i) => (
                <div key={i} className="cn-brand__stat-item">
                  <span className="cn-brand__stat-val">{s.val}</span>
                  <span className="cn-brand__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Brand footer */}
          <div className="cn-brand__footer">
            <span className="cn-brand__footer-dot" aria-hidden="true" />
            <span>École Médione · Fès, Maroc</span>
          </div>

        </div>
      </aside>

      {/* ══════════════════════════════════════
          RIGHT — form panel (ivory)
      ══════════════════════════════════════ */}
      <main className="cn-main">
        <div className="cn-main__inner">

          {showForm ? (

            /* ── Login form ── */
            <div className="cn-form-wrap">

              <div className="cn-form__head">
                <BadgePill>Connexion sécurisée</BadgePill>
                <h1 className="cn-form__title">Bon retour</h1>
                <p className="cn-form__subtitle">
                  Entrez vos identifiants pour accéder à votre espace.
                </p>
              </div>

              <form className="cn-form" onSubmit={handleSubmit} noValidate>

                {/* ── Username field ── */}
                <div className={`cn-field ${focused === "email" ? "cn-field--focused" : ""}`}>
                  <label className="cn-field__label" htmlFor="cn-email">Utilisateur</label>
                  <div className="cn-field__wrap">
                    <span className="cn-field__icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                    </span>
                    <input
                      id="cn-email"
                      type="text"
                      name="email"
                      value={obj.email}
                      onChange={handleChange}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused(null)}
                      placeholder="Votre nom d'utilisateur"
                      className="cn-field__input"
                      autoComplete="username"
                      required
                    />
                    {/* Coral bottom-line animation */}
                    <div className="cn-field__line" aria-hidden="true" />
                  </div>
                </div>

                {/* ── Password field ── */}
                <div className={`cn-field ${focused === "password" ? "cn-field--focused" : ""}`}>
                  <label className="cn-field__label" htmlFor="cn-password">Mot de passe</label>
                  <div className="cn-field__wrap">
                    <span className="cn-field__icon" aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </span>
                    <input
                      id="cn-password"
                      name="password"
                      value={obj.password}
                      onChange={handleChange}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused(null)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Votre mot de passe"
                      className="cn-field__input"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      className="cn-field__eye"
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    >
                      <EyeIcon open={showPassword} />
                    </button>
                    <div className="cn-field__line" aria-hidden="true" />
                  </div>
                </div>

                {/* ── Options row ── */}
                <div className="cn-form__options">
                  <label className="cn-form__remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="cn-form__checkbox-input"
                    />
                    <span className="cn-form__checkbox-box" aria-hidden="true">
                      {rememberMe && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5"
                            strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    <span>Se souvenir de moi</span>
                  </label>
                  <a href="#" className="cn-form__forgot">Mot de passe oublié ?</a>
                </div>

                {/* ── Error message ── */}
                {msgErr && (
                  <div className="cn-form__error" role="alert">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {msgErr}
                  </div>
                )}

                {/* ── Submit button — coral primary, home page btn--primary style ── */}
                <button
                  type="submit"
                  className={`cn-form__submit ${loading ? "cn-form__submit--loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="cn-form__spinner" />
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>

              </form>

              {/* ── Footer links ── */}
              <p className="cn-form__footer-text">
                Pas encore de compte ?{" "}
                <a href="/Inscrire" className="cn-form__footer-link">S'inscrire</a>
              </p>

              {/* ── Section footer rule — home page pattern ── */}
              <div className="cn-form__rule">
                <div className="cn-form__rule-accent" />
                <span className="cn-form__rule-label">Accès sécurisé</span>
                <div className="cn-form__rule-line" />
              </div>

              {/* ── Security note ── */}
              <div className="cn-form__security">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Connexion chiffrée SSL 256-bit
              </div>

            </div>

          ) : (

            /* ── Pending card — manifesto step pattern ── */
            <div className="cn-pending">

              {/* Success icon */}
              <div className="cn-pending__icon-wrap" aria-hidden="true">
                <div className="cn-pending__ring cn-pending__ring--1" />
                <div className="cn-pending__ring cn-pending__ring--2" />
                <div className="cn-pending__icon">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>

              <BadgePill variant="amber">En attente de validation</BadgePill>

              <h3 className="cn-pending__title">Inscription soumise !</h3>
              <p className="cn-pending__message">
                Votre demande a bien été reçue et est en cours d'examen par l'administrateur.
                Vous recevrez un email de confirmation dès l'activation de votre compte.
              </p>

              {/* ── Steps — manifesto pattern (numbered rows with coral left-edge) ── */}
              <div className="cn-pending__steps-manifesto">
                {pendingSteps.map((step, i) => (
                  <div key={step.id} className={`cn-pending__step cn-pending__step--${step.state}`}>
                    <div className="cn-pending__step-num">{String(i + 1).padStart(2, "0")}</div>
                    <div className="cn-pending__step-body">
                      <div className={`cn-pending__step-circle cn-pending__step-circle--${step.state}`}>
                        {step.state === "done"   && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                        {step.state === "active" && <span className="cn-pending__step-pulse" />}
                      </div>
                      <span className="cn-pending__step-label">{step.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              <a href="/" className="cn-pending__back">← Retour à l'accueil</a>

            </div>

          )}
        </div>
      </main>
    </div>
  )
}

/* ── Shared badge pill — home page component ── */
function BadgePill({ children, variant = "default" }) {
  return (
    <span className={`cn-badge cn-badge--${variant}`}>
      {variant === "amber" && <span className="cn-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
}