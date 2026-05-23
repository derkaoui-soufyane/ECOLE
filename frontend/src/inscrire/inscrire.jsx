import { useEffect, useState } from 'react';
import './inscrire.css';

/* ── SVG Icons ── */
const Icons = {
  user:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  mail:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.68 9.81 19.79 19.79 0 0 1 1.61 2.2 2 2 0 0 1 3.6.02h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 7.91a16 16 0 0 0 6.08 6.08l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  lock:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  school:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  shield:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  check:   <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  warn:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  arrow:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  plus:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  chevron: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
}

/* ── Password strength helper ── */
function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'transparent', width: '0%' };
  let score = 0;
  if (pw.length >= 8)              score++;
  if (/[A-Z]/.test(pw))           score++;
  if (/[0-9]/.test(pw))           score++;
  if (/[^A-Za-z0-9]/.test(pw))   score++;
  const levels = [
    { label: 'Très faible', color: '#e74c3c', width: '25%'  },
    { label: 'Faible',      color: '#e67e22', width: '50%'  },
    { label: 'Moyen',       color: '#f1c40f', width: '75%'  },
    { label: 'Fort',        color: '#27ae60', width: '100%' },
  ];
  return { score, ...levels[Math.max(0, score - 1)] };
}

/* ── Input field with icon ── */
function Field({ label, id, name, type = 'text', placeholder, value, onChange, icon, required }) {
  return (
    <div className="reg-form__group">
      <label htmlFor={id} className="reg-form__label">
        {label}{required && <span style={{ color: 'var(--coral)', marginLeft: 2 }}>*</span>}
      </label>
      <div className="reg-form__input-wrap">
        {icon && <span className="reg-form__input-icon">{icon}</span>}
        <input
          id={id}
          name={name}
          type={type}
          className="reg-form__input"
          style={!icon ? { paddingLeft: 14 } : {}}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */
export default function Inscrire() {
  const [msgErreur, setMsgErreur]   = useState('');
  const [isSuccess, setIsSuccess]   = useState(false);
  const [filieres, setFilieres]     = useState([]);
  const [isLoading, setIsLoading]   = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    prenom_i: '', nom_i: '', email: '', num_tele: '',
    nom_parents: '', telephone_parent: '',
    id_filiere: '', password: '', confirmPassword: '',
  });

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/filieres')
      .then(r => r.json())
      .then(data => setFilieres(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // auto-advance progress indicator
    const step1Done = formData.prenom_i && formData.nom_i && formData.email;
    const step2Done = step1Done && formData.num_tele && formData.nom_parents && formData.telephone_parent && formData.id_filiere;
    if (step2Done) setCurrentStep(3);
    else if (step1Done) setCurrentStep(2);
    else setCurrentStep(1);
  };

  const resetForm = () => {
    setFormData({ prenom_i: '', nom_i: '', email: '', num_tele: '', nom_parents: '', telephone_parent: '', id_filiere: '', password: '', confirmPassword: '' });
    setCurrentStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(false);
    setMsgErreur('');

    const required = ['prenom_i','nom_i','email','num_tele','nom_parents','telephone_parent','id_filiere','password','confirmPassword'];
    if (required.some(k => !formData[k])) {
      setMsgErreur('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setMsgErreur('Les mots de passe ne correspondent pas.');
      return;
    }
    if (formData.password.length < 6) {
      setMsgErreur('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsLoading(true);
    fetch('http://127.0.0.1:8000/api/neuveauinscrire_store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (res.ok) { resetForm(); setIsSuccess(true); }
        else return res.json().then(data => setMsgErreur(data.message || "Erreur lors de l'inscription."));
      })
      .catch(() => setMsgErreur('Erreur réseau. Veuillez réessayer.'))
      .finally(() => setIsLoading(false));
  };

  const pwStrength = getPasswordStrength(formData.password);

  const STEPS = [
    { n: 1, label: 'Identité'   },
    { n: 2, label: 'Famille'    },
    { n: 3, label: 'Sécurité'   },
  ];

  return (
    <div className="reg-page">

      {/* ══ LEFT DECORATIVE PANEL ══ */}
      <div className="reg-panel" aria-hidden="true">
        <div className="reg-panel__img" />
        <div className="reg-panel__overlay" />
        <div className="reg-panel__dots-bg" />
        <div className="reg-panel__line reg-panel__line--1" />
        <div className="reg-panel__line reg-panel__line--2" />

        <div className="reg-panel__content">
          {/* Logo */}
          <div className="reg-panel__logo">
            <div className="reg-panel__logo-badge">
              <img src="logo_ecole.png" alt="" />
            </div>
            <div>
              <div className="reg-panel__logo-name">École Médione</div>
              <span className="reg-panel__logo-sub">Excellence · Innovation</span>
            </div>
          </div>

          {/* Eyebrow */}
          <div className="reg-panel__eyebrow">
            <span className="reg-panel__eyebrow-dot" />
            Inscriptions 2025–2026 ouvertes
          </div>

          {/* Heading */}
          <h2 className="reg-panel__heading">
            Votre avenir<br />commence <em>ici</em>
          </h2>
          <p className="reg-panel__sub">
            Rejoignez le lycée d'excellence de Fès-Meknès. Créez votre compte
            et soumettez votre candidature en quelques minutes.
          </p>

          {/* Features */}
          <div className="reg-panel__features">
            {[
              '98% de réussite au baccalauréat',
              'Accompagnement personnalisé dès le 1er jour',
              'Réponse sous 72h après soumission',
            ].map(f => (
              <div key={f} className="reg-panel__feature">
                <span className="reg-panel__feature-dot" />
                {f}
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="reg-panel__progress">
            <span className={`rpd ${currentStep >= 1 ? 'rpd--on' : ''}`} />
            <span className={`rpd ${currentStep >= 2 ? 'rpd--on' : ''}`} />
            <span className={`rpd ${currentStep >= 3 ? 'rpd--on' : ''}`} />
          </div>
        </div>

        {/* Stat badges */}
        <div className="reg-panel__stats">
          {[
            { val: '98%',  lbl: 'Réussite bac'     },
            { val: '420+', lbl: 'Élèves actifs'     },
            { val: '12+',  lbl: "Années d'excellence" },
          ].map(s => (
            <div key={s.lbl} className="reg-panel__stat">
              <span className="reg-panel__stat-val">{s.val}</span>
              <span className="reg-panel__stat-lbl">{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ RIGHT FORM PANEL ══ */}
      <div className="reg-form-side">
        <div className="reg-card">

          {/* Logo link */}
          <a href="/" className="reg-card__logo">
            <div className="reg-card__logo-badge">
              <img src="logo_ecole.png" alt="" />
            </div>
            <div className="reg-card__logo-text">
              <span className="reg-card__logo-name">École Médione</span>
              <span className="reg-card__logo-sub">Excellence · Innovation</span>
            </div>
          </a>

          <div className="reg-card__heading">
            <h1 className="reg-card__title">
              Créer un <em>compte</em>
            </h1>
            <p className="reg-card__sub">
              Remplissez le formulaire ci-dessous pour soumettre votre candidature.
              Tous les champs marqués <span style={{ color: 'var(--coral)' }}>*</span> sont obligatoires.
            </p>
          </div>

          {/* Progress steps */}
          <div className="reg-progress" aria-label="Étapes du formulaire">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className={`reg-progress__step ${currentStep > s.n ? 'reg-progress__step--done' : ''} ${currentStep === s.n ? 'reg-progress__step--active' : ''}`}
              >
                <div className="reg-progress__num">
                  {currentStep > s.n ? '✓' : s.n}
                </div>
                <span className="reg-progress__label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* ── Success state ── */}
          {isSuccess ? (
            <div className="reg-success">
              <div className="reg-success__icon-wrap">
                <div className="reg-success__ring" />
                <div className="reg-success__icon">
                  {Icons.check}
                </div>
              </div>

              <div className="reg-success__badge">
                <span className="reg-success__badge-dot" />
                En attente de validation
              </div>

              <h3 className="reg-success__title">Inscription soumise !</h3>
              <p className="reg-success__msg">
                Votre demande a bien été reçue et est en attente d'approbation par l'administrateur.
                Vous recevrez une confirmation par email dès que votre compte sera activé.
              </p>

              <div className="reg-steps">
                <div className="reg-step reg-step--done">
                  <span className="reg-step__dot reg-step__dot--done">✓</span>
                  <span>Formulaire soumis</span>
                </div>
                <div className="reg-steps__line" />
                <div className="reg-step reg-step--active">
                  <span className="reg-step__dot reg-step__dot--pulse" />
                  <span>Validation admin</span>
                </div>
                <div className="reg-steps__line" />
                <div className="reg-step">
                  <span className="reg-step__dot reg-step__dot--empty" />
                  <span>Compte activé</span>
                </div>
              </div>

              <button
                className="reg-btn-secondary"
                onClick={() => { setIsSuccess(false); setMsgErreur(''); }}
              >
                {Icons.plus} Nouvelle inscription
              </button>
            </div>

          ) : (
            <>
              <form className="reg-form" onSubmit={handleSubmit} noValidate>

                {/* ── Section 1: Identité ── */}
                <div className="reg-form__section-title">Informations personnelles</div>

                <div className="reg-form__row">
                  <Field label="Prénom" id="prenom_i" name="prenom_i" placeholder="Yasmine"
                    value={formData.prenom_i} onChange={handleChange} icon={Icons.user} required />
                  <Field label="Nom" id="nom_i" name="nom_i" placeholder="Bennani"
                    value={formData.nom_i} onChange={handleChange} icon={Icons.user} required />
                </div>

                <Field label="Email" id="email" name="email" type="email"
                  placeholder="vous@exemple.com"
                  value={formData.email} onChange={handleChange} icon={Icons.mail} required />

                <Field label="Téléphone" id="num_tele" name="num_tele" type="tel"
                  placeholder="+212 6XX XXX XXX"
                  value={formData.num_tele} onChange={handleChange} icon={Icons.phone} required />

                {/* ── Section 2: Famille ── */}
                <div className="reg-form__section-title">Informations familiales</div>

                <div className="reg-form__row">
                  <Field label="Nom des parents" id="nom_parents" name="nom_parents"
                    placeholder="Nom complet"
                    value={formData.nom_parents} onChange={handleChange} icon={Icons.user} required />
                  <Field label="Tél. parent" id="telephone_parent" name="telephone_parent" type="tel"
                    placeholder="+212 6XX XXX XXX"
                    value={formData.telephone_parent} onChange={handleChange} icon={Icons.phone} required />
                </div>

                {/* Filière select */}
                <div className="reg-form__group">
                  <label htmlFor="id_filiere" className="reg-form__label">
                    Filière <span style={{ color: 'var(--coral)', marginLeft: 2 }}>*</span>
                  </label>
                  <div className="reg-form__select-wrap">
                    <span className="reg-form__input-icon">{Icons.school}</span>
                    <select
                      id="id_filiere"
                      name="id_filiere"
                      className="reg-form__input reg-form__select"
                      value={formData.id_filiere}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Sélectionnez une filière</option>
                      {filieres.map(v => (
                        <option key={v.id} value={v.id}>{v.nom}</option>
                      ))}
                    </select>
                    <span className="reg-form__select-arrow">{Icons.chevron}</span>
                  </div>
                </div>

                {/* ── Section 3: Sécurité ── */}
                <div className="reg-form__section-title">Sécurité du compte</div>

                <div className="reg-form__row">
                  <div className="reg-form__group">
                    <label htmlFor="password" className="reg-form__label">
                      Mot de passe <span style={{ color: 'var(--coral)', marginLeft: 2 }}>*</span>
                    </label>
                    <div className="reg-form__input-wrap">
                      <span className="reg-form__input-icon">{Icons.lock}</span>
                      <input
                        id="password" name="password" type="password"
                        className="reg-form__input"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    {/* Password strength bar */}
                    {formData.password && (
                      <div className="reg-pw-strength">
                        <div
                          className="reg-pw-strength__bar"
                          style={{ width: pwStrength.width, background: pwStrength.color }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="reg-form__group">
                    <label htmlFor="confirmPassword" className="reg-form__label">
                      Confirmer <span style={{ color: 'var(--coral)', marginLeft: 2 }}>*</span>
                    </label>
                    <div className="reg-form__input-wrap">
                      <span className="reg-form__input-icon">{Icons.lock}</span>
                      <input
                        id="confirmPassword" name="confirmPassword" type="password"
                        className={`reg-form__input ${formData.confirmPassword && formData.confirmPassword !== formData.password ? 'reg-form__input--error' : ''}`}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="reg-btn-primary" disabled={isLoading}>
                  {isLoading ? (
                    <span className="reg-btn-primary__loading">
                      <span className="reg-spinner" />
                      Envoi en cours…
                    </span>
                  ) : (
                    <>Soumettre ma candidature {Icons.arrow}</>
                  )}
                </button>
              </form>

              {/* Error alert */}
              {msgErreur && (
                <div className="reg-alert reg-alert--error" role="alert">
                  <span className="reg-alert__icon">{Icons.warn}</span>
                  {msgErreur}
                </div>
              )}

              {/* Privacy */}
              <p className="reg-privacy">
                {Icons.shield}
                Vos données sont traitées de manière confidentielle et sécurisée.
              </p>

              {/* Login link */}
              <p className="reg-login-link">
                Déjà un compte ?{' '}
                <a href="/Connection">Se connecter</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}