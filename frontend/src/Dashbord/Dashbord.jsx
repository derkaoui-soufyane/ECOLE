import { useEffect, useState } from 'react';
import './Dashbord.css';
import Student from './Student/Student';
import Classe from './classe/classe';
import Notes from './notes/note';
import Calendrier from './calendrier/Calendrier';
import Ense from './enseignements/ense';
import { useLocation, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import Validation_compte from './validation/validation_compte';
import Parametres from './parametre/parametre';
import Filiere from './filieres/filiere';

const SECRET_KEY = "your-very-secret-key-change-this-32chars";

const makeSecureStorage = (storage) => ({
  set(key, value) {
    const payload = JSON.stringify({ value, ts: Date.now() });
    const encrypted = CryptoJS.AES.encrypt(payload, SECRET_KEY).toString();
    const hash = CryptoJS.HmacSHA256(encrypted, SECRET_KEY).toString();
    storage.setItem(key, JSON.stringify({ data: encrypted, hash }));
  },
  get(key) {
    try {
      const raw = storage.getItem(key);
      if (!raw) return null;
      const { data, hash } = JSON.parse(raw);
      const expectedHash = CryptoJS.HmacSHA256(data, SECRET_KEY).toString();
      if (expectedHash !== hash) {
        console.warn(`Tamper detected on key: ${key}`);
        storage.removeItem(key);
        return null;
      }
      const decrypted = CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8);
      const { value } = JSON.parse(decrypted);
      return value;
    } catch {
      storage.removeItem(key);
      return null;
    }
  },
  remove(key) { storage.removeItem(key); },
});

const secureLocal   = makeSecureStorage(localStorage);
const secureSession = makeSecureStorage(sessionStorage);

function getStoredRole() {
  return secureSession.get("codeSRC") || secureLocal.get("codeSRC");
}

function clearAuth() {
  ["codeSRC", "codeSRC2"].forEach((k) => {
    secureLocal.remove(k);
    secureSession.remove(k);
  });
}

const STORAGE_KEYS = {
  ACTIVE_NAV: 'mdione_active_nav',
  STUDENTS:   'mdione_students',
};

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    return JSON.parse(stored);
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
}

// ── Icons ──────────────────────────────────────────────────────────────────────
const Icons = {
  Filiere: () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7l8-4 8 4-8 4-8-4z" />
    <path d="M4 7v10l8 4 8-4V7" />
    <path d="M12 11v10" />
  </svg>
),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h18M3 6h18M3 18h18"/>
    </svg>
  ),
  ChevronLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  ),
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Students: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Classes: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Grades: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Announcements: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  TrendUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
};

// ── Nav config ─────────────────────────────────────────────────────────────────
const navItems = [
  { icon: <Icons.Students />,      label: 'Étudiants' },
  { icon: <Icons.Students />,      label: 'enseignements' },
  { icon: <Icons.Classes />,       label: 'classes' },
  { icon: <Icons.Grades />,        label: 'Notes' },
  { icon: <Icons.Calendar />,      label: 'Calendrier' },
  { icon: <Icons.Filiere />, label: 'Filiere' },
  { icon: <Icons.Announcements />, label: 'validation' },
  { icon: <Icons.Settings />,      label: 'Paramètres' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(name) {
  if (!name) return 'AD';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

// ── Loading screen ─────────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="mdione-loading-screen">
      <div className="mdione-loading-emblem">🎓</div>
      <div className="mdione-loading-bar"><div className="mdione-loading-bar__fill" /></div>
      <p className="mdione-loading-text">Chargement de l'espace administratif…</p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [dataEtudiant,   setDataEtudiant]   = useState([]);
  const [dataNotes,      setDataNotes]      = useState([]);
  const [dataFilieres,   setDataFilieres]   = useState([]);
  const [DataEnse,       setdataEnse]       = useState([]);
  const [DataSalle,      setdataSalle]      = useState([]);
  const [DataSujjet,     setDataSujjet]     = useState([]);
  const [DataSalleDispo, setDataSalleDispo] = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [fetchError,     setFetchError]     = useState(false);
  const [dataClasse,     setdataClasse]     = useState(false);

  useEffect(() => {
    setLoading(true);
    setFetchError(false);

    const endpoints = [
      { url: 'http://127.0.0.1:8000/api/sallesDisponiblesIndex', setter: setDataSalleDispo },
      { url: 'http://127.0.0.1:8000/api/sujjetsIndex',           setter: setDataSujjet },
      { url: 'http://127.0.0.1:8000/api/sallesIndex',            setter: setdataSalle },
      { url: 'http://127.0.0.1:8000/api/enseignementsIndex',     setter: setdataEnse },
      { url: 'http://127.0.0.1:8000/api/filieres',               setter: setDataFilieres },
      { url: 'http://127.0.0.1:8000/api/notesIndex',             setter: setDataNotes },
      { url: 'http://127.0.0.1:8000/api/etudiants',              setter: setDataEtudiant },
      { url: 'http://127.0.0.1:8000/api/classeindex',            setter: setdataClasse },
    ];

    let hasError = false;

    Promise.allSettled(
      endpoints.map(({ url, setter }) =>
        fetch(url)
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
            return res.json();
          })
          .then((data) => setter(Array.isArray(data) ? data : []))
          .catch((err) => {
            console.error('Fetch error:', err);
            hasError = true;
          })
      )
    ).finally(() => {
      setLoading(false);
      if (hasError) setFetchError(true);
    });
  }, []);

  function getUsername() {
    return secureSession.get("username") || secureLocal.get("username") || "Admin";
  }
  function getemail() {
    return secureSession.get("codeSRC2") || secureLocal.get("codeSRC2") || "Admin";
  }

  const username = getUsername();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState(
    () => loadFromStorage(STORAGE_KEYS.ACTIVE_NAV, 'Étudiants')
  );
  const [allStudents, setAllStudents] = useState(
    () => loadFromStorage(STORAGE_KEYS.STUDENTS)
  );

  // Auth guard
  useEffect(() => {
    const role = getStoredRole();
    if (role !== 'admin') navigate('/Connection');
  }, [navigate]);

  const handleNavChange = (label) => {
    setActiveNav(label);
    saveToStorage(STORAGE_KEYS.ACTIVE_NAV, label);
  };

  const handleStudentsChange = (updaterOrValue) => {
    setAllStudents((prev) => {
      const next =
        typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue;
      saveToStorage(STORAGE_KEYS.STUDENTS, next);
      return next;
    });
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/Connection');
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="mdione-layout">

      {/* Error banner */}
      {fetchError && (
        <div className="mdione-error-banner">
          <span className="mdione-error-banner__icon">⚠</span>
          Certaines données n'ont pas pu être chargées. Vérifiez la connexion au serveur.
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className={`mdione-sidebar${collapsed ? ' mdione-sidebar--collapsed' : ''}`}>

        {/* Decorative line on the sidebar edge */}
        <div className="mdione-sidebar__edge-glow" aria-hidden="true" />

        {/* Brand */}
        <div className="mdione-sidebar__brand">
          <div className="mdione-sidebar__logo">
            <span>🎓</span>
          </div>
          <div className="mdione-sidebar__brand-text">
            <span className="mdione-sidebar__title">MdiOne</span>
            <span className="mdione-sidebar__subtitle">Administration</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mdione-sidebar__nav">
          <span className="mdione-sidebar__section-label">Navigation</span>

          {navItems.map((item) => (
            <button
              key={item.label}
              className={`mdione-nav-item${activeNav === item.label ? ' mdione-nav-item--active' : ''}`}
              onClick={() => handleNavChange(item.label)}
            >
              <span className="mdione-nav-item__icon">{item.icon}</span>
              <span className="mdione-nav-item__label">{item.label}</span>
              {item.badge && (
                <span className="mdione-nav-item__badge">{item.badge}</span>
              )}
              <span className="mdione-nav-item__tooltip">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User profile */}
        <div className="mdione-sidebar__footer">
          <div className="mdione-sidebar__user">
            <div className="mdione-sidebar__avatar">
              {getInitials(username)}
            </div>
            <div className="mdione-sidebar__user-info">
              <span className="mdione-sidebar__user-name">{username || 'Admin'}</span>
              <span className="mdione-sidebar__user-role">Administrateur</span>
            </div>
          </div>

          <button
            className="mdione-logout-btn"
            onClick={handleLogout}
            title="Déconnexion"
            aria-label="Déconnexion"
          >
            <span className="mdione-logout-btn__icon"><Icons.Logout /></span>
            <span className="mdione-logout-btn__label">Déconnexion</span>
            <span className="mdione-nav-item__tooltip">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className={`mdione-main${collapsed ? ' mdione-main--expanded' : ''}`}>

        {/* Topbar */}
        <header className="mdione-topbar">
          <div className="mdione-topbar__left">
            <button
              className={`mdione-topbar__toggle${collapsed ? ' mdione-topbar__toggle--rotated' : ''}`}
              onClick={() => setCollapsed((c) => !c)}
              aria-label="Toggle sidebar"
            >
              <Icons.ChevronLeft />
            </button>

            <div className="mdione-topbar__title-block">
              <h1 className="mdione-topbar__page-title">{activeNav}</h1>
              <p className="mdione-topbar__greeting">
                {getGreeting()}, <strong>{username || 'Admin'}</strong> 👋
              </p>
            </div>
          </div>

          <div className="mdione-topbar__right">
            <div className="mdione-topbar__user-chip">
              <div className="mdione-topbar__user-chip-avatar">
                {getInitials(username)}
              </div>
              <span className="mdione-topbar__user-chip-name">{username || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="mdione-page-content">
          {activeNav === 'Étudiants' && (
            <Student
              dataFilieres={dataFilieres}
              Icons={Icons}
              allStudents={dataEtudiant}
              setAllStudents={handleStudentsChange}
            />
          )}
          {activeNav === 'enseignements' && (
            <Ense
              dataFilieres={dataFilieres}
              DataSujjet={DataSujjet}
              DataEnse={DataEnse}
              Icons={Icons}
              allStudents={allStudents}
              setAllStudents={handleStudentsChange}
            />
          )}
          {activeNav==="Filiere" && 
          <Filiere
            dataFilieres={dataFilieres}
          />}
          {activeNav === 'classes' && (
            <Classe
              DataEnse={DataEnse}
              dataFilieres={dataFilieres}
              dataClasse={dataClasse}
              dataEtudiant={dataEtudiant}
            />
          )}
          {activeNav === 'Notes' && (
            <Notes
              Icons={Icons}
              dataNotes={dataNotes}
              dataFilieres={dataFilieres}
              DataSujjet={DataSujjet}
              dataEtudiant={dataEtudiant}
            />
          )}
          {activeNav === 'Calendrier' && (
            <Calendrier
              dataClasse={dataClasse}
              DataSalleDispo={DataSalleDispo}
              DataSujjet={DataSujjet}
              salle={DataSalle}
              enseignement={DataEnse}
              Filieres={dataFilieres}
              Icons={Icons}
              allStudents={allStudents}
            />
          )}
          {activeNav === 'validation' && <Validation_compte />}
          {activeNav === 'Paramètres' && <Parametres getemail={getemail()} />}
        </div>
      </main>
    </div>
  );
}