import { useState } from "react";
import "./parametre.css";
import { Form } from "react-router-dom";

/* ─── Avatar colour palette (same as student/calendar pages) ─── */
const PALETTE = [
  "#4f46e5","#0891b2","#059669","#d97706",
  "#dc2626","#7c3aed","#0d9488","#b45309",
];
const avatarColor = (str = "") =>
  PALETTE[(str.charCodeAt(0) + (str.charCodeAt(1) || 0)) % PALETTE.length];

const initials = (nom = "", prenom = "") =>
  `${(nom[0] || "").toUpperCase()}${(prenom[0] || "").toUpperCase()}`;

/* ─── Password strength ─── */
const getStrength = (pwd) => {
  if (!pwd) return null;
  let score = 0;
  if (pwd.length >= 8)              score++;
  if (/[A-Z]/.test(pwd))           score++;
  if (/[0-9]/.test(pwd))           score++;
  if (/[^A-Za-z0-9]/.test(pwd))   score++;
  if (score <= 1) return { level: "weak",   label: "Faible",    bars: 1 };
  if (score === 2) return { level: "fair",  label: "Moyen",     bars: 2 };
  if (score === 3) return { level: "good",  label: "Bon",       bars: 3 };
  return            { level: "strong",      label: "Fort",      bars: 4 };
};

/* ─── Inline SVG icons ─── */
const Icons = {
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Save: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Alert: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
};

/* ══════════════════════════════════════
   Password field with show/hide toggle
══════════════════════════════════════ */
function PasswordField({ label, name, value, onChange, error, hint, showStrength }) {
  const [show, setShow] = useState(false);
  const strength = showStrength ? getStrength(value) : null;

  return (
    <div className="param-field">
      <label className="param-label">{label}</label>
      <div className="param-input-wrap">
        <span className="param-input-wrap__icon"><Icons.Lock /></span>
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          className={`param-input${error ? " param-input--error" : ""}`}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="param-input-wrap__toggle"
          onClick={() => setShow(s => !s)}
          aria-label={show ? "Masquer" : "Afficher"}
        >
          {show ? <Icons.EyeOff /> : <Icons.Eye />}
        </button>
      </div>

      {strength && value && (
        <div className="param-strength">
          <div className="param-strength__bars">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`param-strength__bar${i <= strength.bars ? ` param-strength__bar--${strength.level}` : ""}`}
              />
            ))}
          </div>
          <span className={`param-strength__label param-strength__label--${strength.level}`}>
            {strength.label}
          </span>
        </div>
      )}

      {error && <p className="param-input-hint param-input-hint--error">{error}</p>}
      {hint && !error && <p className="param-input-hint param-input-hint--info">{hint}</p>}
    </div>
  );
}

/* ══════════════════════════════════════
   Main Parametre component
══════════════════════════════════════ */
export default function Parametre({ prof = [] }) {
  const profData = prof[0] || {};
  const profName = `${profData.nom || ""} ${profData.prenom || ""}`.trim() || "Enseignant";
  const color    = avatarColor(profData.nom || "P");
  const inits    = initials(profData.nom, profData.prenom) || "P";
  const cls      = profData.classe?.nom_classe ?? profData.specialite ?? "—";
  
  const [form, setForm] = useState({
  email: prof[0].user?.email,
  currentPassword: "",
  newPassword: "",
  confirmerpassword: "",
});

  const [errors, setErrors]   = useState({});
  const [alert, setAlert]     = useState(null); // { type: "success"|"error", message }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    setAlert(null);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.currentPassword)
      newErrors.currentPassword = "Veuillez saisir votre mot de passe actuel.";
    if (!form.newPassword)
      newErrors.newPassword = "Veuillez saisir un nouveau mot de passe.";
    else if (form.newPassword.length < 8)
      newErrors.newPassword = "Le mot de passe doit contenir au moins 8 caractères.";
    if (!form.confirmerpassword)
      newErrors.confirmerpassword = "Veuillez confirmer votre nouveau mot de passe.";
    else if (form.newPassword !== form.confirmerpassword)
      newErrors.confirmerpassword = "Les mots de passe ne correspondent pas.";
    if (form.currentPassword && form.newPassword && form.currentPassword === form.newPassword)
      newErrors.newPassword = "Le nouveau mot de passe doit être différent de l'actuel.";
    return newErrors;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);

  try {
    const res = await fetch('http://127.0.0.1:8000/api/usersUpdate', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: form.email,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setAlert({ type: "error", message: data.message || "Erreur serveur" });
    } else {
      setAlert({ type: "success", message: data.message });
      setForm({
        email: form.email,
        currentPassword: "",
        newPassword: "",
        confirmerpassword: "",
      });
    }

  } catch (err) {
    setAlert({ type: "error", message: "Erreur de connexion serveur" });
  }

  setLoading(false);
};

  const handleReset = () => {
    setForm({ currentPassword: "", newPassword: "", confirmerpassword: "" });
    setErrors({});
    setAlert(null);
  };

  const isDirty = form.currentPassword || form.newPassword || form.confirmerpassword;

  return (
    <div className="param-page">

      {/* ── Page header ── */}
      <div className="param-header">
        <p className="param-header__label">Compte</p>
        <h1 className="param-header__title">Paramètres</h1>
      </div>

      <div className="param-layout">

        {/* ── Left: Profile card ── */}
        <aside>
          <div className="param-profile-card">
            <div className="param-profile-card__top">
              <div className="param-avatar" style={{ background: color }}>{inits}</div>
              <div>
                <p className="param-profile-name">{profName}</p>
                <p className="param-profile-email">{profData.user?.email || "—"}</p>
              </div>
            </div>
            <div className="param-profile-card__body">
              {profData.user?.email && (
                <div className="param-profile-row">
                  <span className="param-profile-row__key">Email</span>
                  <span className="param-profile-row__val" style={{ color: "var(--blue-text)", fontSize: 11.5 }}>
                    {profData.user.email}
                  </span>
                </div>
              )}
              {profData.telephone && (
                <div className="param-profile-row">
                  <span className="param-profile-row__key">Téléphone</span>
                  <span className="param-profile-row__val">{profData.telephone}</span>
                </div>
              )}
              <div className="param-profile-row">
                <span className="param-profile-row__key">Spécialité</span>
                <span className="param-profile-row__val">{cls}</span>
              </div>
              <div className="param-profile-row">
                <span className="param-profile-row__key">Statut</span>
                <span style={{
                  background: "var(--green-bg)", color: "var(--green-text)",
                  border: "1px solid var(--green-border)",
                  borderRadius: 20, padding: "2px 8px",
                  fontSize: 11, fontWeight: 600,
                }}>Actif</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Right: Form sections ── */}
        <div className="param-content">

          {/* Alert */}
          {alert && (
            <div className={`param-alert param-alert--${alert.type}`}>
              {alert.type === "success" ? <Icons.Check /> : <Icons.Alert />}
              <span>{alert.message}</span>
            </div>
          )}

          {/* Change password section */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="param-section">
              <div className="param-section__head">
                <div className="param-section__icon"><Icons.Lock /></div>
                <div>
                  <p className="param-section__title">Changer le mot de passe</p>
                  <p className="param-section__sub">Utilisez un mot de passe fort d'au moins 8 caractères.</p>
                </div>
              </div>

              <div className="param-section__body">
                <PasswordField
                  label="Mot de passe actuel"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  error={errors.currentPassword}
                />

                <hr className="param-divider" />

                <PasswordField
                  label="Nouveau mot de passe"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                  hint="Minimum 8 caractères, avec majuscule et chiffre."
                  showStrength
                />

                <PasswordField
                  label="Confirmer le nouveau mot de passe"
                  name="confirmerpassword"
                  value={form.confirmerpassword}
                  onChange={handleChange}
                  error={errors.confirmerpassword}
                />
              </div>

              <div className="param-section__footer">
                <span className="param-footer-hint">
                  Dernière modification : jamais
                </span>
                <div style={{ display: "flex", gap: 10 }}>
                  {isDirty && (
                    <button
                      type="button"
                      className="param-btn param-btn--ghost"
                      onClick={handleReset}
                    >
                      Annuler
                    </button>
                  )}
                  <button
                    type="submit"
                    className="param-btn param-btn--primary"
                    disabled={loading || !isDirty}
                  >
                    <Icons.Save />
                    {loading ? "Enregistrement…" : "Enregistrer"}
                  </button>
                </div>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}