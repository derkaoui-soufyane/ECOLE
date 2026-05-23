import { useState } from "react";
import "./note_etd.css";

/* ─── Avatar colour palette (same as calendar) ─── */
const PALETTE = [
  "#4f46e5","#0891b2","#059669","#d97706",
  "#dc2626","#7c3aed","#0d9488","#b45309",
];
const subjectColor = (str = "") =>
  PALETTE[(str.charCodeAt(0) + (str.charCodeAt(1) || 0)) % PALETTE.length];

/* ─── Icons ─── */
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const ChevDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

/* ─── Grade badge color ─── */
const gradeColor = (note) => {
  if (note === null || note === undefined) return { bg: "var(--surface-2)", text: "var(--text-3)", border: "var(--border)" };
  if (note >= 16) return { bg: "#f0fdf4", text: "#15803d", border: "#86efac" };
  if (note >= 12) return { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" };
  if (note >= 10) return { bg: "#fefce8", text: "#a16207", border: "#fde047" };
  return { bg: "#fef2f2", text: "#b91c1c", border: "#fca5a5" };
};

const gradeLabel = (note) => {
  if (note === null || note === undefined) return null;
  if (note >= 16) return "Excellent";
  if (note >= 14) return "Très bien";
  if (note >= 12) return "Bien";
  if (note >= 10) return "Passable";
  return "Insuffisant";
};

/* ─── Mini star rating (out of 20) ─── */
const StarRating = ({ note }) => {
  if (note === null || note === undefined) return null;
  const filled = Math.round((note / 20) * 5);
  return (
    <div className="note-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < filled ? "#f59e0b" : "var(--border-strong)" }}>
          <StarIcon filled={i < filled} />
        </span>
      ))}
    </div>
  );
};

/* ─── Average calculation ─── */
const calcAverage = (notesList) => {
  const valid = notesList.filter(n => n !== null && n !== undefined && !isNaN(n));
  if (!valid.length) return null;
  return (valid.reduce((s, n) => s + Number(n), 0) / valid.length).toFixed(2);
};

/* ══════════════════════════════════════
   Main Component
══════════════════════════════════════ */
export default function Note_etd({ dataetd = [], dataFilieres = [] }) {

  const [expandedSubject, setExpandedSubject] = useState(null);
  const [activeTab, setActiveTab]   = useState("all"); // "all" | "passed" | "failed"

  const filiere = dataFilieres.filter(v => v.id === dataetd[0]?.id_filieres);
  const notes   = dataetd[0]?.notes || [];
  const etudiant = dataetd[0];

  /* Build subject rows */
  const rows = [];
  filiere.forEach(f => {
    (f.sujjets || []).forEach(s => {
      const subjectNotes = notes
        .filter(n => n.sujjet_id === s.id)
        .map(n => n.note);
      const avg = calcAverage(subjectNotes);
      rows.push({ subject: s, subjectNotes, avg: avg !== null ? parseFloat(avg) : null });
    });
  });

  /* Filter tabs */
  const filtered = rows.filter(r => {
    if (activeTab === "passed") return r.avg !== null && r.avg >= 10;
    if (activeTab === "failed") return r.avg !== null && r.avg < 10;
    return true;
  });

  /* Global average */
  const allAvgs = rows.filter(r => r.avg !== null).map(r => r.avg);
  const globalAvg = calcAverage(allAvgs);

  /* Stats */
  const totalMatieres = rows.length;
  const passedCount   = rows.filter(r => r.avg !== null && r.avg >= 10).length;
  const failedCount   = rows.filter(r => r.avg !== null && r.avg < 10).length;

  /* Colors for global avg */
  const gColors = gradeColor(globalAvg ? parseFloat(globalAvg) : null);

  return (
    <div className="note-page">

      {/* ── Header ── */}
      <div className="note-header">
        <p className="note-header__label">Relevé de notes</p>
        <h1 className="note-header__title">Notes & Résultats</h1>
      </div>

      {/* ── Stats strip ── */}
      <div className="note-stats">
        <div className="note-stat">
          <p className="note-stat__num">{totalMatieres}</p>
          <p className="note-stat__lbl">Matières</p>
        </div>
        <div className="note-stat">
          <p className="note-stat__num note-stat__num--green">{passedCount}</p>
          <p className="note-stat__lbl">Validées</p>
        </div>
        <div className="note-stat">
          <p className="note-stat__num note-stat__num--red">{failedCount}</p>
          <p className="note-stat__lbl">À repasser</p>
        </div>
        <div className="note-stat note-stat--avg"
          style={{ borderTop: `3px solid ${gColors.text}` }}>
          <p className="note-stat__num" style={{ color: gColors.text }}>
            {globalAvg ?? "—"}
          </p>
          <p className="note-stat__lbl">Moyenne générale</p>
          {globalAvg && (
            <span className="note-badge-label" style={{ background: gColors.bg, color: gColors.text, border: `1px solid ${gColors.border}` }}>
              {gradeLabel(parseFloat(globalAvg))}
            </span>
          )}
        </div>
      </div>

      {/* ── Toolbar / Tabs ── */}
      <div className="note-toolbar">
        <span className="note-toolbar__title">
          {etudiant?.nom ? `${etudiant.nom} ${etudiant.prenom || ""}` : "Toutes les matières"}
        </span>
        <div className="note-tabs">
          {[["all", "Toutes"], ["passed", "Validées"], ["failed", "Non validées"]].map(([key, label]) => (
            <button key={key}
              className={`note-tab${activeTab === key ? " active" : ""}`}
              onClick={() => setActiveTab(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Notes table ── */}
      <div className="note-card-wrap">
        {filtered.length === 0 ? (
          <div className="note-empty">Aucune matière trouvée.</div>
        ) : (
          <div className="note-table">

            {/* Table header */}
            <div className="note-table-head">
              <div className="note-th note-th--matiere">Matière</div>
              <div className="note-th note-th--notes">Notes</div>
              <div className="note-th note-th--avg">Moyenne</div>
              <div className="note-th note-th--status">Appréciation</div>
              <div className="note-th note-th--expand" />
            </div>

            {/* Rows */}
            {filtered.map(({ subject, subjectNotes, avg }) => {
              const sColor  = subjectColor(subject.matiere_nom || "M");
              const gColors = gradeColor(avg);
              const isOpen  = expandedSubject === subject.id;
              const passed  = avg !== null && avg >= 10;

              return (
                <div key={subject.id} className={`note-row-wrap${isOpen ? " is-open" : ""}`}>
                  <div className="note-row"
                    onClick={() => setExpandedSubject(isOpen ? null : subject.id)}>

                    {/* Matière */}
                    <div className="note-td note-td--matiere">
                      <div className="note-subject-dot" style={{ background: sColor }} />
                      <div>
                        <p className="note-subject-name">{subject.matiere_nom || "—"}</p>
                        {subject.coef && (
                          <p className="note-subject-coef">Coef. {subject.coef}</p>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="note-td note-td--notes">
                      {subjectNotes.length > 0
                        ? subjectNotes.map((n, i) => (
                            <span key={i} className="note-chip"
                              style={{ background: gradeColor(n).bg, color: gradeColor(n).text, borderColor: gradeColor(n).border }}>
                              {n}
                            </span>
                          ))
                        : <span className="note-no-note">—</span>}
                    </div>

                    {/* Moyenne */}
                    <div className="note-td note-td--avg">
                      {avg !== null ? (
                        <div className="note-avg-block">
                          <span className="note-avg-num"
                            style={{ color: gColors.text }}>{avg.toFixed(2)}</span>
                          <span className="note-avg-denom">/20</span>
                          <StarRating note={avg} />
                        </div>
                      ) : (
                        <span className="note-no-note">—</span>
                      )}
                    </div>

                    {/* Statut */}
                    <div className="note-td note-td--status">
                      {avg !== null && (
                        <span className="note-status-badge"
                          style={{ background: gColors.bg, color: gColors.text, borderColor: gColors.border }}>
                          {passed ? "✓ " : "✗ "}{gradeLabel(avg)}
                        </span>
                      )}
                    </div>

                    {/* Expand */}
                    <div className="note-td note-td--expand">
                      <span className={`note-chev${isOpen ? " is-open" : ""}`}>
                        <ChevDownIcon />
                      </span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="note-row-detail" style={{ borderLeftColor: sColor }}>
                      <div className="note-detail-grid">
                        {subjectNotes.length > 0
                          ? subjectNotes.map((n, i) => {
                              const nc = gradeColor(n);
                              return (
                                <div key={i} className="note-detail-item"
                                  style={{ background: nc.bg, borderColor: nc.border }}>
                                  <p className="note-detail-num" style={{ color: nc.text }}>{n}</p>
                                  <p className="note-detail-label" style={{ color: nc.text }}>
                                    {gradeLabel(n)}
                                  </p>
                                  <StarRating note={n} />
                                </div>
                              );
                            })
                          : <p className="note-no-note" style={{ padding: "8px 0" }}>Aucune note enregistrée.</p>}
                      </div>
                      {subjectNotes.length > 1 && avg !== null && (
                        <p className="note-detail-avg-line" style={{ color: gColors.text }}>
                          Moyenne : <strong>{avg.toFixed(2)}/20</strong> — {gradeLabel(avg)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}