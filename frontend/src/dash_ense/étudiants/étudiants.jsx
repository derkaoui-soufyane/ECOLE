import { useState, useMemo } from "react";
import "./etudiants.css";

/* ─── Avatar colour palette ─── */
const PALETTE = [
  "#4f46e5","#0891b2","#059669","#d97706",
  "#dc2626","#7c3aed","#0d9488","#b45309",
];
const avatarColor = (str = "") =>
  PALETTE[(str.charCodeAt(0) + (str.charCodeAt(1) || 0)) % PALETTE.length];

const initials = (nom = "", prenom = "") =>
  `${(nom[0] || "").toUpperCase()}${(prenom[0] || "").toUpperCase()}`;

/* ─── Inline SVG icons ─── */
const Icon = {
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.18 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  ),
  Award: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
};

/* ─── note colour helpers ─── */
const scoreClass = (n) => {
  const v = parseFloat(n);
  if (isNaN(v)) return "";
  if (v >= 14) return "score-high";
  if (v >= 10) return "score-mid";
  return "score-low";
};
const barClass = (n) => {
  const v = parseFloat(n);
  if (isNaN(v)) return "high";
  if (v >= 14) return "high";
  if (v >= 10) return "mid";
  return "low";
};
const barWidth = (n, max = 20) => {
  const v = parseFloat(n);
  return isNaN(v) ? 0 : Math.min(100, Math.round((v / max) * 100));
};

/* ─── average ─── */
const average = (notes = []) => {
  const vals = notes
    .map(n => parseFloat(n.sujjet?.note))
    .filter(v => !isNaN(v));
  if (!vals.length) return null;
  return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
};

/* ══════════════════════════════════════
Detail Panel
══════════════════════════════════════ */
function DetailPanel({ student, onClose }) {
  
  const isOpen = !!student;
  const s = student || {};
  console.log(s)
  const avg = average(s.note || []);
  const color = avatarColor(s.nom || "");
  const cls = s.classe?.nom_classe ?? s.classe ?? "—";

  return (
    <aside className={`detail-panel${isOpen ? " is-open" : ""}`} aria-hidden={!isOpen}>
      {/* Header */}
      <div className="detail-panel__head">
        <span className="detail-panel__head-label">Fiche étudiant</span>
        <button className="btn-close-panel" onClick={onClose} aria-label="Fermer">
          <Icon.Close />
        </button>
      </div>

      {/* Hero */}
      <div className="detail-panel__hero">
        <div className="detail-panel__avatar" style={{ background: color }}>
          {initials(s.nom, s.prenom)}
        </div>
        <div>
          <p className="detail-panel__name">{s.nom} {s.prenom}</p>
          <p className="detail-panel__meta">{cls}</p>
          {avg !== null && (
            <span className={`badge badge--${parseFloat(avg) >= 14 ? "honor" : parseFloat(avg) >= 10 ? "active" : "probation"}`}
              style={{ marginTop: 6, display: "inline-flex" }}>
              <span style={{ marginRight: 4 }}>Moy.</span>{avg} / 20
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="detail-panel__body">

        {/* Coordonnées */}
        <div className="detail-section">
          <p className="detail-section__title">Coordonnées</p>
          <div className="detail-rows">
            <div className="detail-row">
              <span className="detail-row__key">Nom complet</span>
              <span className="detail-row__val">{s.nom} {s.prenom}</span>
            </div>
            {s.email && (
              <div className="detail-row">
                <span className="detail-row__key">Email</span>
                <span className="detail-row__val" style={{ color: "var(--blue-text)" }}>{s.email}</span>
              </div>
            )}
            {s.telephone && (
              <div className="detail-row">
                <span className="detail-row__key">Téléphone</span>
                <span className="detail-row__val">{s.telephone}</span>
              </div>
            )}
            {s.telephone_parent && (
              <div className="detail-row">
                <span className="detail-row__key">Tél. parent</span>
                <span className="detail-row__val">{s.telephone_parent}</span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-row__key">Filière</span>
              <span className="detail-row__val">{cls}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {s.notes && s.notes.length > 0 && (
          <div className="detail-section">
            <p className="detail-section__title">
              Notes &amp; matières
              <span style={{ color: "var(--text-3)", fontWeight: 400, marginLeft: 6, textTransform: "none", letterSpacing: 0 }}>
                ({s.notes.length})
              </span>
            </p>
            <div className="notes-list">
              {s.notes.map((n, i) => {
                const matiere = n.sujjet?.matiere_nom ?? n.sujjet?.matiere_nom ?? `Matière ${i + 1}`;
                const note    = n.sujjet?.note ?? n.note ?? "—";
                const sc      = scoreClass(note);
                const bc      = barClass(note);
                const bw      = barWidth(note);
                return (
                  <div className="note-card" key={i}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="note-card__matiere">{matiere}</p>
                      <div className="note-bar-wrap">
                        <div className={`note-bar ${bc}`} style={{ width: `${bw}%` }} />
                      </div>
                    </div>
                    <p className={`note-card__score ${sc}`}>{note}<span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-3)", marginLeft: 1 }}>/20</span></p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No notes */}
        {(!s.note || s.note.length === 0) && (
          <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-3)", fontSize: 13 }}>
            Aucune note disponible
          </div>
        )}

      </div>

      
    </aside>
  );
}

/* ══════════════════════════════════════
   Main Etudiants component
   ══════════════════════════════════════ */
export default function Etudiants({ dataEtudiant = [] }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");

  const nomClasse = dataEtudiant[0]?.classe?.nom_classe ?? null;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return dataEtudiant.filter(s =>
      `${s.nom} ${s.prenom} ${s.email ?? ""} ${s.telephone_parent ?? ""}`.toLowerCase().includes(q)
    );
  }, [dataEtudiant, search]);

  const avg = (s) => average(s.note || []);

  const handleRowClick = (s) => {
    setSelected(prev => (prev && (prev._id ?? prev.id) === (s._id ?? s.id) ? null : s));
  };

  return (
    <div className="roster-page">
      <main className={`roster-main${selected ? " panel-open" : ""}`}>

        {/* ── Page header ── */}
        <div className="roster-page-header">
          <p className="roster-page-header__label">Gestion des étudiants</p>
          <h1 className="roster-page-header__title">{nomClasse ?? "Classe"}</h1>
        </div>

        {/* ── Stats ── */}
        <div className="roster-stats">
          <div className="stat-pill">
            <span className="stat-pill__num">{dataEtudiant.length}</span>
            <span className="stat-pill__lbl">Total étudiants</span>
          </div>
          
          
          <div className="stat-pill">
            <span className="stat-pill__num blue">{filtered.length}</span>
            <span className="stat-pill__lbl">Résultats affichés</span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="roster-toolbar">
          <div className="toolbar-left">
            <div className="search-wrap">
              <span className="search-icon"><Icon.Search /></span>
              <input
                type="text"
                placeholder="Rechercher un étudiant…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            
          </div>
          
        </div>

        <p className="roster-count">
          {filtered.length} étudiant{filtered.length !== 1 ? "s" : ""} — cliquez sur une ligne pour voir le détail
        </p>

        {/* ── Table ── */}
        <div className="roster-table-wrap">
          <table className="roster-table">
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Filière</th>
                <th>Tél. parent</th>
              
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="roster-table-empty">Aucun étudiant trouvé.</td>
                </tr>
              ) : filtered.map((s, i) => {
                const color    = avatarColor(s.nom);
                const cls      = s.classe?.nom_classe ?? s.classe ?? nomClasse ?? "—";
                const isActive = selected && (selected._id ?? selected.id) === (s._id ?? s.id ?? i);
                
   

                return (
                  <tr
                    key={s._id ?? s.id ?? i}
                    className={isActive ? "is-selected" : ""}
                    onClick={() => handleRowClick(s._id || s.id ? s : { ...s, id: i })}
                  >
                    <td>
                      <div className="table-cell-student">
                        <div className="table-avatar" style={{ background: color }}>
                          {initials(s.nom, s.prenom)}
                        </div>
                        <div>
                          <p className="table-name">{s.nom} {s.prenom}</p>
                          {s.email && <p className="table-sub">{s.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="td-muted">{cls}</td>
                    <td className="td-muted">{s.telephone_parent || "—"}</td>
                    <td>
                      <div className="table-row-cue"><Icon.ChevronRight /></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* ── Sliding detail panel ── */}
      <DetailPanel student={selected} onClose={() => setSelected(null)} />
    </div>
  );
}