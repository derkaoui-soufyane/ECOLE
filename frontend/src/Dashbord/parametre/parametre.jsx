import { useState } from 'react';
import './parametre.css';

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = {
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
};

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, id }) {
  return (
    <label className="ps-toggle" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="ps-toggle__input"
      />
      <span className="ps-toggle__track">
        <span className="ps-toggle__thumb" />
      </span>
    </label>
  );
}

// ── Setting Row ───────────────────────────────────────────────────────────────
function SettingRow({ label, description, children, danger }) {
  return (
    <div className={`ps-setting-row${danger ? ' ps-setting-row--danger' : ''}`}>
      <div className="ps-setting-row__info">
        <span className="ps-setting-row__label">{label}</span>
        {description && <span className="ps-setting-row__desc">{description}</span>}
      </div>
      <div className="ps-setting-row__control">{children}</div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <div className="ps-section">
      <div className="ps-section__header">
        <h3 className="ps-section__title">{title}</h3>
        {description && <p className="ps-section__desc">{description}</p>}
      </div>
      <div className="ps-section__body">{children}</div>
    </div>
  );
}

// ── Input Field ───────────────────────────────────────────────────────────────
function Field({ label, id, type = 'text', value, onChange, placeholder, hint, icon: IconComp }) {
  const [showPass, setShowPass] = useState(false);
  const inputType = type === 'password' ? (showPass ? 'text' : 'password') : type;

  return (
    <div className="ps-field">
      <label className="ps-field__label" htmlFor={id}>{label}</label>
      <div className="ps-field__wrap">
        {IconComp && <span className="ps-field__icon"><IconComp /></span>}
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`ps-field__input${IconComp ? ' ps-field__input--has-icon' : ''}${type === 'password' ? ' ps-field__input--has-suffix' : ''}`}
        />
        {type === 'password' && (
          <button
            type="button"
            className="ps-field__eye"
            onClick={() => setShowPass((s) => !s)}
            tabIndex={-1}
          >
            {showPass ? <Icon.EyeOff /> : <Icon.Eye />}
          </button>
        )}
      </div>
      {/* FIX 5: hint now uses danger color via ps-field__hint--error */}
      {hint && <span className="ps-field__hint ps-field__hint--error">{hint}</span>}
    </div>
  );
}

// ── Tab definitions ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'security',      label: 'Sécurité',       Icon: Icon.Lock },
  
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function Parametres({ getemail }) {
  // FIX 2: activeTab starts at 'security' and is now driven by the tab nav below
  const [activeTab, setActiveTab] = useState('security');
  const [dirty,     setDirty]     = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [saving,    setSaving]    = useState(false);

  // ── Security state ─────────────────────────────────────────────────────────
  const [security, setSecurity] = useState({
    email:           getemail,
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
    twoFactor:       false,
    sessionTimeout:  '30',
  });

  // ── Notifications state ────────────────────────────────────────────────────
  const [notifs, setNotifs] = useState({
    emailUpdates:   true,
    securityAlerts: true,
    weeklyDigest:   false,
  });

  const markDirty = () => { setDirty(true); setSaved(false); };

  const patchSecurity = (k, v) => { setSecurity((s) => ({ ...s, [k]: v })); markDirty(); };
  const patchNotifs   = (k, v) => { setNotifs((s)   => ({ ...s, [k]: v })); markDirty(); };

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleModifier = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/usersUpdate', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify(security),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur serveur');
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erreur:', error.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Password strength ──────────────────────────────────────────────────────
  const passwordStrength = () => {
    const p = security.newPassword;
    if (!p) return null;
    if (p.length < 6)  return { level: 1, label: 'Faible',    color: '#f25757' };
    if (p.length < 10) return { level: 2, label: 'Moyen',     color: '#f5a623' };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p) && /[^a-zA-Z0-9]/.test(p))
                       return { level: 4, label: 'Très fort', color: '#30c98e' };
    return              { level: 3, label: 'Fort',     color: '#4f8ef7' };
  };

  const strength = passwordStrength();

  const passwordMismatch =
    security.confirmPassword &&
    security.newPassword !== security.confirmPassword;

  return (
    <div className="ps-root">

      {/* ── Page header ── */}
      <div className="ps-page-header">
        <div className="ps-page-header__title-group">
          <h1 className="ps-page-header__title">Paramètres</h1>
          <p className="ps-page-header__subtitle">Gérez votre compte et vos préférences</p>
        </div>
      </div>

      {/* FIX 1 & 2: layout now has display:grid (fixed in CSS) + working tab nav */}
      <div className="ps-layout">

       

        {/* ── Panel ── */}
        <div className="ps-panel" key={activeTab}>

          {/* ════ SECURITY ════ */}
          {activeTab === 'security' && (
            <>
              <Section
                title="Changer le mot de passe"
                description="Choisissez un mot de passe fort d'au moins 8 caractères."
              >
                <Field
                  label="Mot de passe actuel"
                  id="currentPwd"
                  type="password"
                  value={security.currentPassword}
                  onChange={(v) => patchSecurity('currentPassword', v)}
                  placeholder="••••••••"
                />
                <Field
                  label="Nouveau mot de passe"
                  id="newPwd"
                  type="password"
                  value={security.newPassword}
                  onChange={(v) => patchSecurity('newPassword', v)}
                  placeholder="••••••••"
                />

                {/* Strength meter */}
                {strength && (
                  <div className="ps-strength">
                    <div className="ps-strength__bars">
                      {[1, 2, 3, 4].map((n) => (
                        <div
                          key={n}
                          className="ps-strength__bar"
                          style={{ background: n <= strength.level ? strength.color : undefined }}
                        />
                      ))}
                    </div>
                    <span className="ps-strength__label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}

                <Field
                  label="Confirmer le mot de passe"
                  id="confirmPwd"
                  type="password"
                  value={security.confirmPassword}
                  onChange={(v) => patchSecurity('confirmPassword', v)}
                  placeholder="••••••••"
                  hint={passwordMismatch ? '⚠ Les mots de passe ne correspondent pas.' : undefined}
                />

                {/* FIX 4: styled validate button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    className="ps-btn ps-btn--primary"
                    onClick={handleModifier}
                    disabled={saving || !!passwordMismatch}
                  >
                    {saving
                      ? <><span className="ps-btn__spinner" /> Enregistrement…</>
                      : saved
                      ? <><Icon.Check /> Enregistré</>
                      : 'Valider'
                    }
                  </button>
                </div>
              </Section>

             
               
            </>
          )}

          
        </div>
      </div>

      {/* FIX 3: floating save bar now actually renders when dirty */}
      <div className={`ps-save-bar${dirty ? ' ps-save-bar--visible' : ''}`}>
        <span className="ps-save-bar__text">
          <span className={`ps-save-bar__dot${saved ? ' ps-save-bar__dot--green' : ''}`} />
          {saved ? 'Modifications enregistrées' : 'Modifications non enregistrées'}
        </span>
        <div className="ps-save-bar__actions">
          <button
            className="ps-btn ps-btn--ghost"
            onClick={() => { setDirty(false); setSaved(false); }}
          >
            Annuler
          </button>
          <button
            className="ps-btn ps-btn--primary"
            onClick={handleModifier}
            disabled={saving}
          >
            {saving ? <><span className="ps-btn__spinner" /> Enregistrement…</> : 'Enregistrer'}
          </button>
        </div>
      </div>

    </div>
  );
}